import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, mkdtemp, rm, readdir, symlink, cp, realpath, rename } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import uxSavePlugin from '../../src/tools/uxStudio/save-plugin.mjs';
const root = process.cwd();
const sample = JSON.parse(await readFile(resolve(root, 'src/tools/uxStudio/sample.json'), 'utf8'));
const origin = 'http://127.0.0.1:7018';
async function fixture(t, options = {}) {
    const temp = await realpath(await mkdtemp(join(root, '_작업/codex/ux-studio/workspace-tests-')));
    t.after(() => rm(temp, {recursive:true, force:true}));
    const gameA = join(temp, '한글 게임 A');
    const gameB = join(temp, '게임 B');
    await mkdir(gameA); await mkdir(gameB);
    await writeFile(join(gameA, 'game-source.js'), 'original game source');
    await writeFile(join(gameA, 'AGENTS.md'), 'parent instructions');
    const choices = options.choices || [gameA, gameB];
    const legacy = join(temp, 'cache/projects');
    let handler;
    uxSavePlugin(root, legacy, {chooseDirectory: options.chooseDirectory || (async () => choices.shift() ?? null)}).configureServer({middlewares:{use(fn){handler=fn;}}});
    async function request(method, path, body = {}, requestOrigin = origin) {
        const req = {method, url:'/api/ux-studio/' + path, headers:{host:'127.0.0.1:7018', origin:requestOrigin, 'content-type':'application/json'}, async *[Symbol.asyncIterator](){yield Buffer.from(JSON.stringify(body));}};
        let result;
        const res = {statusCode:0, setHeader(){}, end(text){result={status:this.statusCode, body:JSON.parse(text)};}};
        await handler(req,res,()=>assert.fail('unexpected next'));
        return result;
    }
    async function select() {
        const response = await request('POST', 'workspace-select');
        assert.equal(response.status, 200, response.body.error);
        return response.body.workspace;
    }
    async function decide(workspace, decision='independent') {
        const response = await request('POST', 'workspace-decision?workspace='+workspace.id, {decision});
        assert.equal(response.status, 200, response.body.error);
        return response.body.workspace;
    }
    const doc = name => ({...structuredClone(sample), name});
    return {temp, gameA, gameB, choices, legacy, request, select, decide, doc};
}
test('native selected folder initializes portable pending workspace, structure and guide copies', async t => {
    const f = await fixture(t);
    const w = await f.select();
    assert.equal(w.directory, f.gameA);
    assert.equal(w.name, '한글 게임 A');
    assert.equal(w.conversionDecision, 'pending');
    const meta = JSON.parse(await readFile(join(f.gameA,'ui-studio/project.json'),'utf8'));
    assert.equal(meta.id,w.id); assert.equal(meta.guideVersion,'2026-11-16.1');
    assert.equal(meta.directory, undefined); assert.equal(meta.root, undefined);
    assert.deepEqual((await readdir(join(f.gameA,'ui-studio'))).sort(), ['AGENTS.md','README.md','assets','designs','exports','guide','integration.md','project.json']);
    const guide = await f.request('GET','workspace-guide?workspace='+w.id+'&file=guide/USER_GUIDE.md');
    assert.equal(guide.status,200); assert.ok(guide.body.text.length > 20);
    assert.equal((await f.request('GET','workspace?workspace='+w.id)).body.workspace.id,w.id);
    const registry = JSON.parse(await readFile(join(f.temp,'cache/workspaces.json'),'utf8'));
    assert.equal(registry.workspaces[0].root,f.gameA);
});
test('cancelled picker leaves game folder and registry unchanged', async t => {
    const f = await fixture(t, {choices:[null]});
    assert.deepEqual((await f.request('POST','workspace-select')).body,{cancelled:true});
    assert.deepEqual((await readdir(f.gameA)).sort(),['AGENTS.md','game-source.js']);
    await assert.rejects(readFile(join(f.temp,'cache/workspaces.json')), {code:'ENOENT'});
});
test('selection requires same-origin JSON and never accepts browser directory paths', async t => {
    const f = await fixture(t);
    assert.equal((await f.request('POST','workspace-select',{},'http://other.test')).status,403);
    assert.equal((await f.request('POST','workspace-select',{directory:f.gameB})).status,400);
    assert.equal((await f.select()).directory,f.gameA);
});
test('reopening same folder preserves workspace id, customized guides and existing game files', async t => {
    const f = await fixture(t); f.choices.push(f.gameA);
    const first = await f.select();
    const original = await readFile(join(f.gameA,'ui-studio/project.json'),'utf8');
    await writeFile(join(f.gameA,'ui-studio/README.md'),'project-specific readme');
    await writeFile(join(f.gameA,'ui-studio/guide/USER_GUIDE.md'),'project-specific guide');
    await f.select();
    const again = await f.select();
    assert.equal(again.id,first.id);
    assert.equal(await readFile(join(f.gameA,'ui-studio/project.json'),'utf8'),original);
    assert.equal(await readFile(join(f.gameA,'ui-studio/README.md'),'utf8'),'project-specific readme');
    assert.equal(await readFile(join(f.gameA,'ui-studio/guide/USER_GUIDE.md'),'utf8'),'project-specific guide');
    assert.equal(await readFile(join(f.gameA,'game-source.js'),'utf8'),'original game source');
    assert.equal(await readFile(join(f.gameA,'AGENTS.md'),'utf8'),'parent instructions');
    assert.equal((await f.request('GET','workspaces')).body.workspaces.length,2);
});
test('pending decision permits reads but guards both design and baseline writes', async t => {
    const f = await fixture(t); const w = await f.select();
    assert.equal((await f.request('GET','projects?workspace='+w.id)).status,200);
    assert.equal((await f.request('POST','project?workspace='+w.id,{document:f.doc('pending'),expectedRevision:null})).status,409);
    assert.equal((await f.request('POST','baseline?workspace='+w.id,{projectId:sample.projectId,stage:'W',expectedRevision:1})).status,409);
    assert.deepEqual(await readdir(join(f.gameA,'ui-studio/designs')),[]);
});
test('independent decision persists consent and leaves all preexisting game files intact', async t => {
    const f = await fixture(t); const w = await f.select();
    const next = await f.decide(w);
    assert.equal(next.conversionDecision,'independent');
    assert.equal(next.mode,'independent'); assert.ok(Date.parse(next.conversionDecidedAt));
    assert.equal(await readFile(join(f.gameA,'game-source.js'),'utf8'),'original game source');
    assert.equal(await readFile(join(f.gameA,'AGENTS.md'),'utf8'),'parent instructions');
    assert.equal((await f.request('POST','workspace-decision?workspace='+w.id,{decision:'completed'})).status,400);
});
test('convert decision only records requested status without scanning or converting game sources', async t => {
    const f = await fixture(t); const w = await f.select(); const next = await f.decide(w,'convert');
    assert.equal(next.conversionDecision,'convert'); assert.equal(next.conversionStatus,'requested');
    assert.equal(await readFile(join(f.gameA,'game-source.js'),'utf8'),'original game source');
    assert.deepEqual((await readdir(f.gameA)).sort(),['AGENTS.md','game-source.js','ui-studio']);
});
test('same design ids, revisions, backups and baselines are isolated by request workspace and preserve legacy', async t => {
    const f = await fixture(t); const a=await f.select(); const b=await f.select();
    await f.decide(a); await f.decide(b);
    const save=async (w,name,doc=null,rev=null)=>f.request('POST','project'+(w?'?workspace='+w.id:''),{document:doc||f.doc(name),expectedRevision:rev});
    const savedA=(await save(a,'A')).body.document;
    assert.equal(savedA.revision,1);
    assert.equal((await save(b,'B')).body.document.revision,1);
    assert.equal((await save(null,'Legacy')).body.document.revision,1);
    assert.equal((await f.request('GET','project?workspace='+a.id+'&id='+sample.projectId)).body.document.name,'A');
    assert.equal((await f.request('GET','project?workspace='+b.id+'&id='+sample.projectId)).body.document.name,'B');
    assert.equal((await f.request('GET','project?id='+sample.projectId)).body.document.name,'Legacy');
    assert.equal((await f.request('POST','baseline?workspace='+a.id,{projectId:sample.projectId,stage:'W',expectedRevision:1})).status,200);
    assert.equal((await f.request('GET','baselines?workspace='+b.id+'&id='+sample.projectId)).body.baselines.length,0);
    assert.equal((await f.request('GET','baseline?workspace='+a.id+'&id='+sample.projectId+'&stage=W&revision=1')).body.document.name,'A');
    assert.equal((await f.request('GET','baseline?workspace='+b.id+'&id='+sample.projectId+'&stage=W&revision=1')).status,404);
    assert.equal((await save(a,'ignored',{...savedA,name:'A2'},1)).body.document.revision,2);
    assert.equal((await save(a,'ignored',savedA,1)).status,409);
    assert.equal((await readdir(join(f.gameA,'ui-studio/designs/backups'))).length,1);
    assert.equal((await f.request('GET','projects?workspace='+b.id)).body.projects[0].name,'B');
    assert.equal((await f.request('GET','projects')).body.projects[0].name,'Legacy');
});
test('malformed existing ui-studio is rejected without adding files or overwriting content', async t => {
    const f = await fixture(t); await mkdir(join(f.gameA,'ui-studio'));
    await writeFile(join(f.gameA,'ui-studio/project.json'),'{}');
    const response=await f.request('POST','workspace-select'); assert.equal(response.status,400);
    assert.deepEqual(await readdir(join(f.gameA,'ui-studio')),['project.json']);
    assert.equal(await readFile(join(f.gameA,'ui-studio/project.json'),'utf8'),'{}');
});
test('symlink selected roots and ui-studio roots cannot write outside selected folder', async t => {
    const f = await fixture(t);
    await symlink(f.gameB,join(f.temp,'linked-game')); f.choices.unshift(join(f.temp,'linked-game'));
    assert.equal((await f.request('POST','workspace-select')).status,400);
    await symlink(f.gameB,join(f.gameA,'ui-studio'));
    assert.equal((await f.request('POST','workspace-select')).status,400);
    assert.deepEqual(await readdir(f.gameB),[]);
});
test('replaced storage directories and guide symlinks are rejected before access', async t => {
    const f = await fixture(t); const w=await f.select(); await f.decide(w);
    await rm(join(f.gameA,'ui-studio/designs'),{recursive:true});
    await symlink(f.gameB,join(f.gameA,'ui-studio/designs'));
    assert.equal((await f.request('POST','project?workspace='+w.id,{document:f.doc('bad'),expectedRevision:null})).status,400);
    const guideFile=join(f.gameA,'ui-studio/guide/USER_GUIDE.md'); await rm(guideFile);
    await symlink(join(f.gameA,'game-source.js'),guideFile);
    assert.equal((await f.request('GET','workspace-guide?workspace='+w.id+'&file=guide/USER_GUIDE.md')).status,400);
    assert.deepEqual(await readdir(f.gameB),[]);
});
test('unknown workspace and unlisted guide requests cannot fall back to legacy or read game files', async t => {
    const f = await fixture(t); const w=await f.select();
    assert.equal((await f.request('GET','projects?workspace=missing')).status,404);
    assert.equal((await f.request('GET','projects?workspace=')).status,400);
    for (const file of ['../game-source.js','project.json','guide/../../game-source.js','guide/unknown.md'])
        assert.equal((await f.request('GET','workspace-guide?workspace='+w.id+'&file='+encodeURIComponent(file))).status,400);
    assert.equal((await f.request('GET','workspace-guide?workspace='+w.id+'&file=README.md')).status,200);
    assert.equal((await f.request('GET','workspace-guide?file=USER_GUIDE.md')).status,200);
});
test('one outstanding native chooser is enforced without replacing another request', async t => {
    let release; const waiting=new Promise(resolve=>release=resolve);
    const f = await fixture(t,{chooseDirectory:()=>waiting});
    const pending=f.request('POST','workspace-select');
    await new Promise(resolve=>setImmediate(resolve));
    assert.equal((await f.request('POST','workspace-select')).status,409);
    release(null); assert.deepEqual((await pending).body,{cancelled:true});
});
test('copied folder with conflicting workspace id is rejected rather than sharing another storage root', async t => {
    const f = await fixture(t); const a=await f.select();
    await cp(join(f.gameA,'ui-studio'),join(f.gameB,'ui-studio'),{recursive:true});
    assert.equal((await f.request('POST','workspace-select')).status,409);
    assert.equal((await f.request('GET','workspace?workspace='+a.id)).body.workspace.directory,f.gameA);
});


test('explicitly reselecting a moved folder restores its id and routes design reads and writes to its new location', async t => {
    const f = await fixture(t); const first = await f.select(); await f.decide(first);
    const saved = await f.request('POST','project?workspace='+first.id,{document:f.doc('before move'),expectedRevision:null});
    assert.equal(saved.status,200);
    const metadata = await readFile(join(f.gameA,'ui-studio/project.json'),'utf8');
    const moved = join(f.temp,'이동한 게임 A');
    await rename(f.gameA,moved);
    assert.equal((await f.request('GET','workspaces')).body.workspaces[0].unavailable,true);
    f.choices.unshift(moved);
    const reopened = await f.select();
    assert.equal(reopened.id,first.id); assert.equal(reopened.directory,moved);
    assert.equal(await readFile(join(moved,'ui-studio/project.json'),'utf8'),metadata);
    assert.equal((await f.request('GET','project?workspace='+first.id+'&id='+sample.projectId)).body.document.name,'before move');
    const updated = await f.request('POST','project?workspace='+first.id,{document:{...saved.body.document,name:'after move'},expectedRevision:1});
    assert.equal(updated.status,200); assert.equal(updated.body.document.revision,2);
    assert.equal(JSON.parse(await readFile(join(moved,'ui-studio/designs',sample.projectId+'.json'),'utf8')).name,'after move');
    const registry = JSON.parse(await readFile(join(f.temp,'cache/workspaces.json'),'utf8'));
    assert.deepEqual(registry.workspaces,[{id:first.id,root:moved}]);
    assert.equal((await f.request('GET','workspace?workspace='+first.id)).body.workspace.directory,moved);
    assert.equal(await readFile(join(moved,'game-source.js'),'utf8'),'original game source');
    await assert.rejects(readFile(join(f.gameA,'ui-studio/project.json')),{code:'ENOENT'});
});

test('reselecting an actual copy keeps the original registry and design storage even when its metadata later becomes invalid', async t => {
    const f = await fixture(t); const first = await f.select(); await f.decide(first);
    const saved = await f.request('POST','project?workspace='+first.id,{document:f.doc('original'),expectedRevision:null});
    assert.equal(saved.status,200);
    await cp(join(f.gameA,'ui-studio'),join(f.gameB,'ui-studio'),{recursive:true});
    const registry = await readFile(join(f.temp,'cache/workspaces.json'),'utf8');
    assert.equal((await f.request('POST','workspace-select')).status,409);
    assert.equal(await readFile(join(f.temp,'cache/workspaces.json'),'utf8'),registry);
    const updated = await f.request('POST','project?workspace='+first.id,{document:{...saved.body.document,name:'original updated'},expectedRevision:1});
    assert.equal(updated.status,200);
    assert.equal(JSON.parse(await readFile(join(f.gameB,'ui-studio/designs',sample.projectId+'.json'),'utf8')).name,'original');
    await writeFile(join(f.gameA,'ui-studio/project.json'),'{}');
    f.choices.unshift(f.gameB);
    assert.equal((await f.request('POST','workspace-select')).status,409);
    assert.equal(await readFile(join(f.temp,'cache/workspaces.json'),'utf8'),registry);
});
