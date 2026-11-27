import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {scopeURL} from '../../src/tools/uxStudio/project-manager.mjs';
const code=await readFile('src/tools/uxStudio/grapes-pilot.mjs','utf8');
const slice=(a,b)=>code.slice(code.indexOf(a),code.indexOf(b,code.indexOf(a)));
test('actual dirty guard protects edits and invalid geometry, permits unchanged/undo and initial load',()=>{
 const handlers={},form={};let value='saved',invalid=false;
 const ctx=vm.createContext({fingerprint:()=>{if(invalid)throw Error('invalid');return value;},window:{addEventListener:(n,f)=>handlers[n]=f},document:{querySelector:()=>form},status:{}});
 vm.runInContext("let persisted='saved';"+slice('const hasUnsaved=',' const parts='),ctx);
 const event=()=>({prevented:false,preventDefault(){this.prevented=true;}});
 let e=event();handlers.beforeunload(e);assert.equal(e.prevented,false);
 value='edited';e=event();handlers.beforeunload(e);assert.equal(e.prevented,true);
 e=event();form.onsubmit(e);assert.equal(e.prevented,true);
 value='saved';e=event();handlers.beforeunload(e);assert.equal(e.prevented,false);
 invalid=true;e=event();handlers.beforeunload(e);assert.equal(e.prevented,true);
 vm.runInContext('persisted=undefined',ctx);e=event();handlers.beforeunload(e);assert.equal(e.prevented,false);
});
test('actual async save marks the submitted snapshot, never later edits, as persisted',async()=>{
 const button={},link={},nodes={'#studio-save':button,'#studio-preview':link};let current={projectId:'original',revision:3,name:'demo'},release,saved;
 const ctx=vm.createContext({source:{name:'demo'},document:{querySelector:id=>nodes[id]},design:()=>structuredClone(current),fingerprint:()=>JSON.stringify(current),crypto:{randomUUID:()=> '12345678-rest'},status:{},syncContext:()=>{},localStorage:{setItem(){}},scopedKey:(key,workspace)=>key+workspace,workspaceId:'ws-a',scopeURL,scopedFetch:async(url,options)=>{
  if(options){saved=JSON.parse(options.body).document;saved.revision=1;await new Promise(r=>release=r);}
  return {ok:true,json:async()=>({document:saved})};
 }});
 vm.runInContext('let persisted,diskFingerprint,savedCopy;'+slice("document.querySelector('#studio-save').onclick",' const syncSelection='),ctx);
 const original=JSON.stringify(current),pending=button.onclick();current.name='edited while saving';release();const result=await pending;assert.equal(result,null);assert.equal(vm.runInContext('savedCopy.projectId',ctx),'ux-gjs-12345678');assert.equal(vm.runInContext('diskFingerprint',ctx),original);
 assert.equal(vm.runInContext('persisted',ctx),original);assert.notEqual(vm.runInContext('persisted',ctx),JSON.stringify(current));assert.equal(button.disabled,false);
 assert.equal(link.href,'/ui-studio/preview.html?project=ux-gjs-12345678&workspace=ws-a');assert.equal(link.hidden,false);
});
test('actual stage load blocks dirty edits before reading or replacing project data',()=>{
 const button={};let reads=0;
 const ctx=vm.createContext({document:{querySelector:()=>button},run:fn=>fn(),hasUnsaved:()=>true,localStorage:{getItem(){reads++;}},Error});
 vm.runInContext(slice("document.querySelector('#load').onclick", " document.querySelector('#check')"),ctx);
 assert.throws(()=>button.onclick(),/현재 편집/);assert.equal(reads,0);
});
