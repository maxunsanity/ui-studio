import test from 'node:test';
import assert from 'node:assert/strict';
import { applyControlConfig } from '../../src/tools/uxStudio/control-inspector.mjs';

const element = () => ({id:'volume',name:'Volume',kind:'panel',x:0,y:0,w:50,h:10,text:'Keep me'});
test('changing control type preserves element identity, geometry and the source',()=>{
 const original=element(), changed=applyControlConfig(original,'type','slider');
 assert.equal(original.control,undefined);assert.equal(changed.id,original.id);
 assert.equal(changed.text,'Keep me');assert.equal(changed.w,50);assert.equal(changed.control.type,'slider');
 assert.equal(applyControlConfig(changed,'type','').control,undefined);
});
test('slider edits are numeric and invalid ranges leave the original unchanged',()=>{
 const original=applyControlConfig(element(),'type','slider');
 const changed=applyControlConfig(original,'value','75');assert.equal(changed.control.value,75);
 assert.notEqual(original.control.value,75);
 assert.throws(()=>applyControlConfig(changed,'max','0'));
 assert.throws(()=>applyControlConfig(changed,'value','NaN'));
 assert.equal(changed.control.value,75);
});
test('editing dropdown options selects an available value and rejects duplicate values',()=>{
 let e=applyControlConfig(element(),'type','dropdown');
 e=applyControlConfig(e,'options','alpha | First\nbeta | Second');
 assert.deepEqual(e.control.options,[{value:'alpha',label:'First'},{value:'beta',label:'Second'}]);
 assert.equal(e.control.value,'alpha');
 e=applyControlConfig(e,'value','beta');assert.equal(e.control.value,'beta');
 assert.throws(()=>applyControlConfig(e,'options','alpha | A\nalpha | B'));
 assert.equal(e.control.value,'beta');
});
test('toggle value and disabled flags remain booleans',()=>{
 let e=applyControlConfig(element(),'type','toggle');
 e=applyControlConfig(e,'value',true);e=applyControlConfig(e,'disabled',true);
 assert.equal(e.control.value,true);assert.equal(e.control.disabled,true);
 assert.throws(()=>applyControlConfig(e,'disabled','false'));
});
test('text configuration enforces length without interpreting labels as markup',()=>{
 let e=applyControlConfig(element(),'type','input');
 e=applyControlConfig(e,'value','<player>');assert.equal(e.control.value,'<player>');
 assert.throws(()=>applyControlConfig(e,'maxLength','3'));
 assert.throws(()=>applyControlConfig(e,'unexpected','value'));
});
