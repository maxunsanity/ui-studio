import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {validateDocument} from '../../src/tools/uxStudio/model.mjs';
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

async function setupCopy(api) {
 const source=await readFile('src/tools/uxStudio/main.mjs','utf8');
 const code=source.slice(source.indexOf('async function copyDesignToWorkspace('),source.indexOf('function showProjectManager()'));
 const doc={...JSON.parse(await readFile('src/tools/uxStudio/sample.json','utf8')),revision:14,name:'Original design'};
 const context={doc,expectedRevision:14,dirty:true,clone:structuredClone,validateDocument,api,crypto:{randomUUID:()=> '12345678-rest'}};
 vm.createContext(context);vm.runInContext(code,context);
 return context;
}
test('copy callback creates a new design only in the chosen workspace and preserves source edits and revision',async()=>{
 const calls=[],c=await setupCopy(async(path,options,workspace)=>{
  const body=JSON.parse(options.body);calls.push({path,workspace,body});
  return {document:{...body.document,revision:1}};
 });
 const original=c.doc,before=JSON.stringify(original),saved=await c.copyDesignToWorkspace('ws-target');
 assert.equal(calls.length,1);assert.equal(calls[0].path,'project');assert.equal(calls[0].workspace,'ws-target');
 assert.equal(calls[0].body.expectedRevision,null);assert.equal(calls[0].body.document.projectId,'ux-12345678');
 assert.equal(calls[0].body.document.revision,0);assert.equal(calls[0].body.document.name,'Original design · 사본');
 assert.equal(saved.projectId,'ux-12345678');assert.equal(saved.revision,1);
 assert.equal(c.doc,original);assert.equal(JSON.stringify(c.doc),before);assert.equal(c.expectedRevision,14);assert.equal(c.dirty,true);
});
test('failed copy keeps the current document, unsaved edits and revision',async()=>{
 const c=await setupCopy(async()=>{throw Error('disk unavailable');}),before=JSON.stringify(c.doc);
 await assert.rejects(()=>c.copyDesignToWorkspace('ws-target'),/disk unavailable/);
 assert.equal(JSON.stringify(c.doc),before);assert.equal(c.expectedRevision,14);assert.equal(c.dirty,true);
});
test('copy response cannot report success after the source document changes',async()=>{
 let finish;const c=await setupCopy(async(_path,options)=>new Promise(resolve=>{
  const body=JSON.parse(options.body);finish=()=>resolve({document:{...body.document,revision:1}});
 }));
 const pending=c.copyDesignToWorkspace('ws-target');c.doc.name='Edited during copy';const edited=JSON.stringify(c.doc);
 finish();await assert.rejects(()=>pending,/설계가 바뀌/);
 assert.equal(JSON.stringify(c.doc),edited);assert.equal(c.expectedRevision,14);assert.equal(c.dirty,true);
});
test('manager copy asks pending projects first, rejects unavailable folders and never navigates',async()=>{
 const source=await readFile('src/tools/uxStudio/project-manager.mjs','utf8');
 const code=source.slice(source.indexOf('    const copyInto ='),source.indexOf('    const refresh ='));
 const steps=[],status={},ctx={workOnly:false,copyOnly:false,copyBusy:false,status,dialog:{isConnected:true},navigate(){throw Error('must not navigate');},
  decision:async meta=>{steps.push('decision');return {...meta,conversionDecision:'independent'};},
  copyToWorkspace:async id=>{steps.push(id);return {projectId:'ux-copied'};}};
 vm.createContext(ctx);vm.runInContext(code+'\nthis.copyInto=copyInto;',ctx);
 await ctx.copyInto({id:'ws-target',name:'Target',conversionDecision:'pending'});
 assert.deepEqual(steps,['decision','ws-target']);assert.match(status.textContent,/ux-copied/);
 steps.length=0;await assert.rejects(()=>ctx.copyInto({id:'ws-missing',unavailable:true}),/읽을 수 없/);assert.deepEqual(steps,[]);
 ctx.decision=async()=>null;await ctx.copyInto({id:'ws-target',conversionDecision:'pending'});assert.deepEqual(steps,[]);
});
