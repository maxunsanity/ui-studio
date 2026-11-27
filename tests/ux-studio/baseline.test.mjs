import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm, readdir, symlink, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import uxSavePlugin, { saveDocument, saveBaseline, readBaseline, listBaselines } from '../../src/tools/uxStudio/save-plugin.mjs';
const root = process.cwd();
const sample = JSON.parse(await readFile(resolve(root, 'src/tools/uxStudio/sample.json'), 'utf8'));
async function fixture(t) {
    const temp = await mkdtemp(resolve(root, '_작업/codex/ux-studio/baseline-tests-'));
    t.after(() => rm(temp, { recursive: true, force: true }));
    const dir = join(temp, 'projects');
    const saved = await saveDocument(root, dir, structuredClone(sample), null);
    return { dir, saved };
}
test('W baseline survives later P/U edits and can be restored through normal revision checks', async t => {
    const {dir, saved} = await fixture(t);
    assert.deepEqual(await saveBaseline(root, dir, saved.projectId, 'W', 1), saved);
    const edited = structuredClone(saved);
    edited.name = 'Prototype';
    const second = await saveDocument(root, dir, edited, 1);
    await saveBaseline(root, dir, saved.projectId, 'P', 2);
    assert.deepEqual(await readBaseline(root, dir, saved.projectId, 'W', 1), saved);
    assert.deepEqual(await readBaseline(root, dir, saved.projectId, 'P', 2), second);
    await assert.rejects(() => saveDocument(root, dir, saved, 1), e => e.status === 409);
    const restored = await saveDocument(root, dir, {...saved, revision: 2}, 2);
    assert.equal(restored.name, saved.name);
    assert.equal(restored.revision, 3);
    assert.deepEqual(await readBaseline(root, dir, saved.projectId, 'P', 2), second);
});
test('concurrent duplicate baseline requests are idempotent and leave no temp file', async t => {
    const {dir, saved} = await fixture(t);
    const results = await Promise.all([saveBaseline(root, dir, saved.projectId, 'U', 1), saveBaseline(root, dir, saved.projectId, 'U', 1)]);
    results.forEach(d => assert.deepEqual(d, saved));
    assert.deepEqual(await readdir(join(dir, 'baselines')), [saved.projectId + '-U-r1.json']);
});
test('invalid stage, traversal, missing/stale revision and symlink are rejected', async t => {
    const {dir, saved} = await fixture(t);
    for (const args of [['../x','W',1], [saved.projectId,'../W',1], [saved.projectId,'W',0], [saved.projectId,'W',1.5]])
        await assert.rejects(() => saveBaseline(root, dir, ...args));
    await assert.rejects(() => saveBaseline(root, dir, saved.projectId, 'W', 2), e => e.status === 409);
    await assert.rejects(() => saveBaseline(root, dir, 'missing', 'W', 1), e => e.status === 409);
    assert.equal(await readBaseline(root, dir, saved.projectId, 'W', 1), null);
    await symlink(join(dir, saved.projectId + '.json'), join(dir, 'baselines', saved.projectId + '-W-r1.json'));
    await assert.rejects(() => saveBaseline(root, dir, saved.projectId, 'W', 1), /형식/);
});
test('baseline cannot overwrite a different existing snapshot', async t => {
    const {dir, saved} = await fixture(t);
    await saveBaseline(root, dir, saved.projectId, 'W', 1);
    const file = join(dir, 'baselines', saved.projectId + '-W-r1.json');
    const changed = {...saved, name: 'preserve this'};
    await writeFile(file, JSON.stringify(changed));
    await assert.rejects(() => saveBaseline(root, dir, saved.projectId, 'W', 1), e => e.status === 409);
    assert.deepEqual(JSON.parse(await readFile(file, 'utf8')), changed);
});
test('baseline middleware validates origin, creates, reads and returns missing/error status', async t => {
    const {dir, saved} = await fixture(t);
    let handler;
    uxSavePlugin(root, dir).configureServer({middlewares:{use(fn){handler=fn;}}});
    async function request(method, url, body, origin='http://127.0.0.1:7018') {
        const req = {method, url, headers:{host:'127.0.0.1:7018', origin, 'content-type':'application/json'},
            async *[Symbol.asyncIterator]() {yield Buffer.from(JSON.stringify(body));}};
        let result;
        const res = {statusCode:0, setHeader(){}, end(text){result={status:this.statusCode, body:JSON.parse(text)};}};
        await handler(req,res,()=>assert.fail('unexpected next'));
        return result;
    }
    const body={projectId:saved.projectId,stage:'W',expectedRevision:1};
    assert.equal((await request('POST','/api/ux-studio/baseline',body,'http://other.test')).status,403);
    assert.equal((await request('POST','/api/ux-studio/baseline',body)).status,200);
    const prefix='/api/ux-studio/baseline?id='+saved.projectId;
    assert.deepEqual((await request('GET',prefix+'&stage=W&revision=1')).body.document,saved);
    assert.equal((await request('GET',prefix+'&stage=P&revision=1')).status,404);
    assert.equal((await request('GET',prefix+'&stage=W&revision=-1')).status,400);
});

test('baseline list isolates projects and sorts saved stages by revision', async t => {
    const {dir, saved} = await fixture(t);
    assert.deepEqual(await listBaselines(root, dir, saved.projectId), []);
    await saveBaseline(root, dir, saved.projectId, 'W', 1);
    const second = await saveDocument(root, dir, saved, 1);
    await saveBaseline(root, dir, saved.projectId, 'U', 2);
    await saveBaseline(root, dir, saved.projectId, 'P', 2);
    const other = await saveDocument(root, dir, {...sample, projectId:'other-design'}, null);
    await saveBaseline(root, dir, other.projectId, 'W', 1);
    assert.deepEqual((await listBaselines(root, dir, saved.projectId)).map(b => [b.stage,b.revision]), [['P',2],['U',2],['W',1]]);
    await assert.rejects(() => listBaselines(root, dir, '../escape'));
});
