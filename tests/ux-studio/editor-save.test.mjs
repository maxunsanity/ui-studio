import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {validateDocument} from '../../src/tools/uxStudio/model.mjs';

const source = await readFile('src/tools/uxStudio/main.mjs', 'utf8');
const handlers = source.slice(source.indexOf('async function save()'), source.indexOf('function showProjectManager()'));
const sample = JSON.parse(await readFile('src/tools/uxStudio/sample.json', 'utf8'));

// Run the real save handler, pausing only its network and browser boundaries.
function setup(waitForProjects = false) {
    let releaseSave, releaseProjects, markProjectsStarted;
    const messages = [], recentWrites = [], requests = [];
    const projectsStarted = new Promise(resolve => markProjectsStarted = resolve);
    const context = {
        doc: {...structuredClone(sample), projectId: 'saving-design', revision: 5},
        expectedRevision: 5, dirty: true, saveBusy: false, baselineBusy: false,
        wheelRun: null, status: '', workspaceId: 'ws-test', lastProjectKey: 'last-project',
        clone: structuredClone, validateDocument, render() {},
        localStorage: {setItem: (...args) => recentWrites.push(args)},
        designChannel: {postMessage: message => messages.push(message)},
        api(path, options) {
            assert.equal(path, 'project');
            const request = JSON.parse(options.body);
            requests.push(request);
            return new Promise(resolve => {
                releaseSave = () => resolve({document: {
                    ...request.document, revision: 6, savedAt: '2026-11-16T01:00:00.000Z'
                }});
            });
        },
        loadProjects() {
            markProjectsStarted();
            if (waitForProjects)
                return new Promise(resolve => releaseProjects = resolve);
        }
    };
    vm.createContext(context);
    vm.runInContext(handlers, context);
    return {context, messages, recentWrites, requests, projectsStarted,
        finishSave: () => releaseSave(), finishProjects: () => releaseProjects()};
}

for (const next of [
    {label: 'new design', projectId: 'new-design', revision: 0, expectedRevision: null, dirty: true},
    {label: 'imported JSON', projectId: 'import-design', revision: 0, expectedRevision: null, dirty: true},
    {label: 'another saved design', projectId: 'other-design', revision: 11, expectedRevision: 11, dirty: false}
]) {
    test(`pending save never applies its revision to ${next.label}`, async () => {
        const h = setup(), c = h.context, pending = c.save();
        c.doc = {...structuredClone(sample), projectId: next.projectId, revision: next.revision};
        c.expectedRevision = next.expectedRevision;
        c.dirty = next.dirty;
        const before = JSON.stringify(c.doc);
        h.finishSave();
        const saved = await pending;
        assert.equal(JSON.stringify(c.doc), before);
        assert.equal(c.expectedRevision, next.expectedRevision);
        assert.equal(c.dirty, next.dirty);
        assert.equal(saved, false);
        assert.equal(c.saveBusy, false);
        assert.equal(h.recentWrites.length, 0);
        assert.equal(h.messages[0].projectId, 'saving-design');
        assert.equal(h.messages[0].revision, 6);
        assert.equal(h.messages[0].workspace, 'ws-test');
    });
}

test('pending save advances the same design revision while preserving later unsaved edits', async () => {
    const h = setup(), c = h.context, pending = c.save();
    c.doc.name = 'Edited while saving';
    h.finishSave();
    assert.equal(await pending, false);
    assert.equal(c.doc.projectId, 'saving-design');
    assert.equal(c.doc.name, 'Edited while saving');
    assert.equal(c.doc.revision, 6);
    assert.equal(c.expectedRevision, 6);
    assert.equal(c.dirty, true);
    assert.equal(h.requests[0].expectedRevision, 5);
    assert.notEqual(h.requests[0].document.name, c.doc.name);
});

test('unchanged current design is saved cleanly and permits the folder save guard', async () => {
    const h = setup(), c = h.context, pending = c.save();
    h.finishSave();
    assert.equal(await pending, true);
    assert.equal(c.doc.revision, 6);
    assert.equal(c.expectedRevision, 6);
    assert.equal(c.dirty, false);
    assert.equal(c.saveBusy, false);
    assert.equal(h.recentWrites[0][1], 'saving-design');
});

test('switch during post-save project refresh cannot report the new current design as saved', async () => {
    const h = setup(true), c = h.context, pending = c.save();
    h.finishSave();
    await h.projectsStarted;
    c.doc = {...structuredClone(sample), projectId: 'other-design', revision: 11};
    c.expectedRevision = 11;
    c.dirty = false;
    h.finishProjects();
    assert.equal(await pending, false);
    assert.equal(c.doc.projectId, 'other-design');
    assert.equal(c.doc.revision, 11);
    assert.equal(c.expectedRevision, 11);
    assert.equal(c.dirty, false);
});
