import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {projectMenuGroups} from '../../src/tools/uxStudio/project-manager.mjs';
import {workspaceKind} from '../../src/tools/uxStudio/workspace-kind.mjs';
const root='/Users/max/projest_max/ui-studio';
test('project manager separates samples from work and keeps unknown user folders available',()=>{
 const work={id:'work',name:'monopoly-go',directory:'/Games/mine'},sample={id:'sample',name:'Reference',directory:root+'/samples/new-sample'},nested={id:'nested',name:'Nested',directory:root+'/samples/capybara-go/ui-studio'};
 const groups=projectMenuGroups([work,sample,nested],null);
 assert.deepEqual(groups.recent,[work]);assert.deepEqual(groups.samples,[sample]);assert.deepEqual(groups.tools,[nested]);
});
test('all registered sample contexts use the shared classification',async()=>{
 const {projectContext}=await import('../../src/tools/uxStudio/project-context.mjs');
 for(const slug of ['capybara-go','royal-match']){
  const context=projectContext({workspaceId:'workspace-'+slug,workspace:{id:'workspace-'+slug,name:slug,directory:root+'/samples/'+slug}});
  assert.equal(context.kind,'sample');assert.match(context.label,/샘플/);
 }
});
test('work-only sample copy blocks protected folders before conversion decision or copy',async()=>{
 const code=await readFile('src/tools/uxStudio/project-manager.mjs','utf8'),start=code.indexOf('    const copyInto ='),end=code.indexOf('    const refresh =',start);
 let writes=0;
 const ctx={workspaceKind,workOnly:true,copyOnly:false,copyBusy:false,status:{},dialog:{isConnected:true},decision:async()=>{writes++;},copyToWorkspace:async()=>{writes++;}};
 vm.createContext(ctx);vm.runInContext(code.slice(start,end)+';this.copyInto=copyInto',ctx);
 await assert.rejects(()=>ctx.copyInto({id:'sample',directory:root+'/samples/royal-match',conversionDecision:'pending'}),/작업|샘플/);
 assert.equal(writes,0);
});
test('bare home bootstrap is lazy and current review does not force a sample',async()=>{
 const [html,entry,review]=await Promise.all([readFile('src/tools/uxStudio/grapes-pilot.html','utf8'),readFile('src/tools/uxStudio/entry.mjs','utf8').catch(()=>''),readFile('tools/ux-studio/current-review.json','utf8')]);
 assert.match(html,/src="\/ui-studio\/source\/entry\.mjs"/);
 assert.match(entry,/isHomeEntry/);assert.match(entry,/import\(['"]\.\/home\.mjs/);assert.match(entry,/import\(['"]\.\/overview\.mjs/);
 assert.equal(JSON.parse(review).enabled,false);
});

test('manager awaits project activation failures without closing the folder dialog',async()=>{
 const code=await readFile('src/tools/uxStudio/project-manager.mjs','utf8'),start=code.indexOf('    const activate ='),end=code.indexOf('    const copyInto =',start);
 let closed=0;
 const ctx={workOnly:false,copyOnly:false,dialog:{isConnected:true,close(){closed++;}},status:{},request:async()=>({}),isDirty:()=>false,save:async()=>true,allowProjectSwitch:async()=>true,navigate:async()=>{throw Error('fresh list unavailable');}};
 vm.createContext(ctx);vm.runInContext(code.slice(start,end)+';this.activate=activate',ctx);
 await assert.rejects(()=>ctx.activate({id:'workspace-work',directory:'/Games/work',conversionDecision:'independent'}),/fresh list/);
 assert.equal(closed,0);
});
test('manager serializes copy clicks and never navigates after the dialog has closed',async()=>{
 const code=await readFile('src/tools/uxStudio/project-manager.mjs','utf8'),start=code.indexOf('    const copyInto ='),end=code.indexOf('    const refresh =',start);
 let copied=0,navigated=0,finish;
 const ctx={workOnly:true,copyOnly:true,copyBusy:false,workspaceKind,status:{},dialog:{isConnected:true,querySelectorAll:()=>[]},decision:async meta=>meta,
  copyToWorkspace:()=>{copied++;return new Promise(resolve=>{finish=()=>resolve({projectId:'ux-copied'});});},navigate:async()=>{navigated++;}};
 vm.createContext(ctx);vm.runInContext(code.slice(start,end)+';this.copyInto=copyInto',ctx);
 const meta={id:'workspace-work',directory:'/Games/work',conversionDecision:'independent',name:'Work'};
 const first=ctx.copyInto(meta),second=ctx.copyInto(meta);
 assert.equal(copied,1);
 ctx.dialog.isConnected=false;finish();await Promise.all([first,second]);assert.equal(navigated,0);
});
