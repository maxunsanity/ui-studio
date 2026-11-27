import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {validateDocument} from '../../src/tools/uxStudio/model.mjs';
const source = await readFile('src/tools/uxStudio/main.mjs','utf8');
// Exercise the actual async editor handlers without a native DOM on the locked Mac.
const handlers = source.slice(source.indexOf('async function refreshBaselines()'),source.indexOf('async function openSaved(id)'));
const sample = JSON.parse(await readFile('src/tools/uxStudio/sample.json','utf8'));
function setup(api) {
    const ctx = {doc:{...structuredClone(sample),revision:5},expectedRevision:5,dirty:false,saveBusy:false,baselineBusy:false,
        baselineItems:[{stage:'W',revision:1}],baselineStage:'W',baselineLabels:{W:'Wireframe'},undo:[],redo:[],status:'',
        validateDocument,JSON,encodeURIComponent,confirm:()=>true,render(){},api};
    ctx.notify = text => ctx.status=text;
    ctx.checkpoint = () => {ctx.undo.push(structuredClone(ctx.doc));ctx.redo=[];};
    ctx.setDoc = (d,revision) => {ctx.doc=structuredClone(d);ctx.expectedRevision=revision;ctx.undo=[];ctx.redo=[];ctx.dirty=false;};
    vm.createContext(ctx);vm.runInContext(handlers,ctx);return ctx;
}
test('restore stages edits without saving and preserves previous document for undo',async()=>{
    const baseline={...structuredClone(sample),revision:1,name:'Wireframe'};
    let calls=0;const c=setup(async()=>{calls++;return {document:baseline};});
    const before=JSON.stringify(c.doc);await c.restoreBaseline('W:1');
    assert.equal(c.doc.name,'Wireframe');assert.equal(c.doc.revision,5);assert.equal(c.expectedRevision,5);
    assert.equal(c.dirty,true);assert.equal(JSON.stringify(c.undo[0]),before);assert.equal(calls,1);assert.equal(c.baselineBusy,false);
});
test('dirty document, cancellation and active save prevent restore requests',async()=>{
    let calls=0;const c=setup(async()=>{calls++;});
    c.dirty=true;await c.restoreBaseline('W:1');c.dirty=false;c.confirm=()=>false;await c.restoreBaseline('W:1');
    c.confirm=()=>true;c.saveBusy=true;await c.restoreBaseline('W:1');assert.equal(calls,0);
});
test('edits made while response is pending are not overwritten',async()=>{
    let resolve;const c=setup(()=>new Promise(r=>resolve=r));const pending=c.restoreBaseline('W:1');
    c.doc.name='New edit';c.dirty=true;resolve({document:{...sample,revision:1}});await pending;
    assert.equal(c.doc.name,'New edit');assert.equal(c.undo.length,0);assert.equal(c.baselineBusy,false);
});
test('failed or wrong-project responses keep current edits and release busy flag',async()=>{
    for(const api of [async()=>{throw Error('offline');},async()=>({document:{...sample,projectId:'other',revision:1}})]){
        const c=setup(api),before=JSON.stringify(c.doc);await c.restoreBaseline('W:1');
        assert.equal(JSON.stringify(c.doc),before);assert.equal(c.undo.length,0);assert.equal(c.baselineBusy,false);
    }
});
test('capture requires a clean saved design and submits only its revision',async()=>{
    const calls=[];const c=setup(async(path,opts)=>{calls.push([path,opts]);return {baselines:[]};});
    c.dirty=true;await c.captureBaseline();assert.equal(calls.length,0);c.dirty=false;
    await c.captureBaseline();assert.deepEqual(JSON.parse(calls[0][1].body),{projectId:sample.projectId,stage:'W',expectedRevision:5});
    assert.equal(calls.length,2);assert.equal(c.dirty,false);assert.equal(c.baselineBusy,false);
});
