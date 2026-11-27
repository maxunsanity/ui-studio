import test from 'node:test';
import assert from 'node:assert/strict';
import { applyControlConfig, controlInspectorHTML } from '../../src/tools/uxStudio/control-inspector.mjs';

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

test('tab inspector preserves panel links across label edits and exposes validated skin geometry',()=>{
 let e=applyControlConfig(element(),'type','tabs');
 e=applyControlConfig(e,'panel.first','body');e=applyControlConfig(e,'options','first | Renamed\nsecond | Other');
 assert.equal(e.control.options[0].panelId,'body');
 e=applyControlConfig(e,'tabSkin.enabled',true);e=applyControlConfig(e,'tabSkin.slices.1','24');
 e=applyControlConfig(e,'tabSkin.edges.1','16');assert.equal(e.control.tabSkin.mode,'3');assert.equal(e.control.tabSkin.slices[1],24);
 assert.throws(()=>applyControlConfig(e,'tabSkin.slices.0','1'));
 const html=controlInspectorHTML(e,{elements:[e,{id:'body',name:'Content <body>'}]});
 assert.match(html,/data-control-field="panel.first"/);assert.match(html,/Content &lt;body&gt;/);assert.match(html,/data-tab-project-image="normal"/);assert.match(html,/data-tab-project-image="selected"/);
 e=applyControlConfig(e,'panel.first','');assert.equal(e.control.options[0].panelId,undefined);
 e=applyControlConfig(e,'tabSkin.enabled',false);assert.equal(e.control.tabSkin,undefined);
});

test('tab option values and layer labels stay inside escaped inspector attributes',()=>{
 const e={...element(),control:{type:'tabs',options:[{value:'a" onclick="alert(1)',label:'<script>'}],value:'a" onclick="alert(1)'}};
 const html=controlInspectorHTML(e,{elements:[]});
 assert.match(html,/data-control-field="panel.a&quot; onclick=&quot;alert\(1\)"/);
 assert.doesNotMatch(html,/<select[^>]* onclick="/);assert.doesNotMatch(html,/<script>/);
});

test('tab label display inspector exposes text/icon and applies validated values without changing identity or option labels',()=>{
 const e=applyControlConfig(element(),'type','tabs'),before=structuredClone(e),bytes=JSON.stringify(e),html=controlInspectorHTML(e);
 assert.match(html,/<select data-control-field="labelMode">/);assert.match(html,/<option value="text" selected>글자 표시<\/option>/);assert.match(html,/<option value="icon" >아이콘만<\/option>/);assert.equal(JSON.stringify(e),bytes);
 const icon=applyControlConfig(e,'labelMode','icon');assert.equal(icon.control.labelMode,'icon');assert.equal(icon.id,e.id);assert.equal(icon.w,e.w);assert.deepEqual(icon.control.options,e.control.options);assert.deepEqual(e,before);assert.match(controlInspectorHTML(icon),/<option value="icon" selected>아이콘만<\/option>/);
 assert.equal(applyControlConfig(icon,'labelMode','text').control.labelMode,'text');assert.throws(()=>applyControlConfig(icon,'labelMode','hidden'));const other=applyControlConfig(element(),'type','toggle-group');assert.doesNotMatch(controlInspectorHTML(other),/data-control-field="labelMode"/);assert.throws(()=>applyControlConfig(other,'labelMode','icon'));
});
