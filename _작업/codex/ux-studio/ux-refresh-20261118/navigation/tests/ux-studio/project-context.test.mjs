import test from 'node:test';
import assert from 'node:assert/strict';
const context = await import('../../src/tools/uxStudio/project-context.mjs').catch(() => ({}));
const toolDirectory = '/Users/max/projest_max/ui-studio';

test('project identity distinguishes selected game, sample, fixture and common storage from tool source', () => {
 assert.equal(typeof context.projectContext, 'function');
 const document = {name:'HUD draft',projectId:'ux-design',revision:4};
 const common = context.projectContext({document,dirty:true});
 assert.equal(common.kind,'common');assert.equal(common.directory,toolDirectory+'/_작업/codex/ux-studio/projects');
 assert.equal(common.toolDirectory,toolDirectory);assert.equal(common.design,'HUD draft · r4 · 미저장 수정');
 const sample = context.projectContext({workspaceId:'ws-sample',workspace:{id:'ws-sample',name:'Monopoly GO',directory:toolDirectory+'/samples/monopoly-go'},document});
 assert.equal(sample.kind,'sample');assert.equal(sample.name,'Monopoly GO');assert.equal(sample.storageDirectory,sample.directory+'/ui-studio');
 const game = context.projectContext({workspaceId:'ws-game',workspace:{id:'ws-game',name:'My game',directory:'/Games/my-game'},document});
 assert.equal(game.kind,'project');assert.equal(game.directory,'/Games/my-game');
 const fixture = context.projectContext({workspaceId:'ws-test',workspace:{id:'ws-test',name:'folder-check',directory:toolDirectory+'/samples/folder-check'},document});
 assert.equal(fixture.kind,'fixture');
 assert.throws(()=>context.projectContext({workspaceId:'ws-game',workspace:{id:'another',name:'Wrong',directory:'/other'},document}),/프로젝트/);
});

test('detail/canvas/preview links carry the same workspace, design, screen and element safely', () => {
 assert.equal(typeof context.designURL,'function');
 const selection={workspaceId:'ws-game',projectId:'ux-design',screenId:'shop',elementId:'buy-button'};
 assert.equal(context.designURL('detail',selection),'/ui-studio/?editor=detail&project=ux-design&screen=shop&element=buy-button&workspace=ws-game');
 assert.equal(context.designURL('canvas',selection),'/ui-studio/canvas.html?project=ux-design&screen=shop&element=buy-button&workspace=ws-game');
 assert.equal(context.designURL('preview',selection),'/ui-studio/preview.html?project=ux-design&screen=shop&element=buy-button&workspace=ws-game');
 assert.throws(()=>context.designURL('detail',{...selection,workspaceId:'../wrong'}));
});

test('cancel and failed save keep the canvas in place; saved navigation uses new copy identity',async()=>{
 assert.equal(typeof context.navigateDesign,'function');
 const navigated=[],destination={view:'detail',workspaceId:'ws-game',projectId:'ux-original',screenId:'shop',elementId:'buy-button'};
 let saves=0;
 const invoke=options=>context.navigateDesign({dirty:true,destination,choose:async()=> 'cancel',save:async()=>{saves++;return {projectId:'ux-copy'};},navigate:url=>navigated.push(url),...options});
 assert.equal(await invoke({}),false);assert.equal(saves,0);assert.deepEqual(navigated,[]);
 assert.equal(await invoke({choose:async()=> 'save',save:async()=>null}),false);assert.deepEqual(navigated,[]);
 assert.equal(await invoke({choose:async()=> 'save'}),true);
 assert.equal(navigated[0],'/ui-studio/?editor=detail&project=ux-copy&screen=shop&element=buy-button&workspace=ws-game');
 assert.equal(destination.projectId,'ux-original');
 assert.equal(await invoke({choose:async()=> 'discard'}),true);assert.match(navigated[1],/project=ux-original/);
 assert.equal(await invoke({dirty:false,choose:()=>{throw Error('must not ask');}}),true);
});

test('actual detail action still asks after local-stage save and cancellation preserves the canvas draft',async()=>{
 const {readFile}=await import('node:fs/promises'),{default:vm}=await import('node:vm');
 const code=await readFile('src/tools/uxStudio/grapes-pilot.mjs','utf8');
 const begin=code.indexOf(' const leaveForDetail='),end=code.indexOf(" document.querySelector('#main-editor').onclick=leaveForDetail",begin);
 let choices=0,prevented=0;
 const location={href:'canvas.html'},scope={navigateDesign:context.navigateDesign,workspaceId:'ws-game',source:{projectId:'ux-original'},savedCopy:null,
  fingerprint:()=> 'edited-but-staged',diskFingerprint:'server-snapshot',persisted:'edited-but-staged',
  screenPicker:{value:'shop'},editor:{getSelected:()=>({get:key=>({uxScreen:'shop',uxId:'buy-button'})[key]})},
  chooseDesignNavigation:async()=>{choices++;return 'cancel';},document:{querySelector:()=>{throw Error('must not save');}},location,status:{}};
 vm.createContext(scope);vm.runInContext(code.slice(begin,end)+'\nthis.leaveForDetail=leaveForDetail;',scope);
 await scope.leaveForDetail({preventDefault(){prevented++;}});
 assert.equal(prevented,1);assert.equal(choices,1);assert.equal(location.href,'canvas.html');assert.equal(scope.persisted,'edited-but-staged');
});
