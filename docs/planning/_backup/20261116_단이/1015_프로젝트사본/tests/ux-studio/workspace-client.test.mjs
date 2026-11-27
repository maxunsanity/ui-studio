import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const client = await import('../../src/tools/uxStudio/project-manager.mjs').catch(() => ({}));
test('same design IDs resolve to separate workspace API, preview and local stage keys', () => {
 assert.equal(typeof client.scopeURL, 'function');
 assert.equal(client.scopeURL('/api/ux-studio/project?id=shared', 'ws-a'), '/api/ux-studio/project?id=shared&workspace=ws-a');
 assert.equal(client.scopeURL('/ui-studio/preview.html?project=shared', 'ws-b'), '/ui-studio/preview.html?project=shared&workspace=ws-b');
 assert.equal(client.scopeURL('/api/ux-studio/projects', null), '/api/ux-studio/projects');
 assert.notEqual(client.scopedKey('stage-shared-W', 'ws-a'), client.scopedKey('stage-shared-W', 'ws-b'));
 assert.equal(client.scopedKey('ux-studio.last-project', null), 'ux-studio.last-project');
 assert.throws(() => client.scopeURL('/api/ux-studio/projects', '../other'));
});
test('cancel or failed save never permits switching; discard is explicit', async () => {
 assert.equal(typeof client.allowProjectSwitch, 'function');
 let saves = 0;
 assert.equal(await client.allowProjectSwitch({dirty:true,choose:async()=> 'cancel',save:async()=>{saves++;return true;}}),false);
 assert.equal(saves,0);
 assert.equal(await client.allowProjectSwitch({dirty:true,choose:async()=> 'save',save:async()=> false}),false);
 assert.equal(await client.allowProjectSwitch({dirty:true,choose:async()=> 'save',save:async()=> true}),true);
 assert.equal(await client.allowProjectSwitch({dirty:true,choose:async()=> 'discard',save:async()=>{throw Error('must not save');}}),true);
 assert.equal(await client.allowProjectSwitch({dirty:false,choose:async()=>{throw Error('must not ask');}}),true);
});

test('unavailable destination blocks switch before discarding and is checked again after a choice', async () => {
 let asks=0, checks=0;
 assert.equal(await client.allowProjectSwitch({dirty:true,validate:async()=>false,choose:async()=>{asks++;return 'discard';}}),false);
 assert.equal(asks,0);
 assert.equal(await client.allowProjectSwitch({dirty:true,validate:async()=>++checks===1,choose:async()=> 'discard'}),false);
 assert.equal(checks,2);
});

for (const settingsAvailable of [true, false]) {
 test(`standalone boot reads local sample and glossary without a catalog host when settings ${settingsAvailable ? 'load' : 'are missing'}`, async () => {
  const source = await readFile('src/tools/uxStudio/main.mjs','utf8');
  const state = source.split('\n').find(line => line.startsWith('let folderProject ='));
  const catalog = source.slice(source.indexOf('async function loadCatalog()'),source.indexOf('function featurePalette()'));
  const boot = source.slice(source.indexOf('async function init()'),source.indexOf('void init();'));
  const requests=[],apis=[],opened=[],sample={projectId:'test-design',revision:0};
  const ctx={workspaceId:null,featureCatalog:null,featureLoading:false,featureError:'',projects:[],lastProjectKey:'recent',
   URLSearchParams,location:{search:''},localStorage:{getItem:()=>null},loadProjects:async()=>{},render(){},
   setDoc:(document,revision)=>opened.push({document,revision}),
   app:{innerHTML:'',querySelector:()=>({})},esc:String,showProjectManager(){},openManual(){},
   api:async path=>{apis.push(path);return {};},
   fetch:async path=>{requests.push(path);return {ok:path.endsWith('studio-config.json')?settingsAvailable:true,
    json:async()=>path.endsWith('studio-config.json')?{catalogEnabled:false}:path.endsWith('sample.json')?sample:{terms:[]}};}
  };
  vm.createContext(ctx);vm.runInContext(state+'\n'+catalog+'\n'+boot,ctx);await ctx.init();
  assert.deepEqual(requests,['/ui-studio/source/studio-config.json','/ui-studio/source/sample.json','/ui-studio/source/glossary.json']);
  assert.deepEqual(apis,[]);assert.deepEqual(opened,[{document:sample,revision:null}]);
 });
}
