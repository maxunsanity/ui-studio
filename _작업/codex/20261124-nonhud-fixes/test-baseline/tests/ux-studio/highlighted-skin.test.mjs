import test from 'node:test';
import assert from 'node:assert/strict';
import {createSkin,validateSkin,SKIN_STATES,applySkin} from '../../src/tools/uxStudio/skins.mjs';
test('highlighted state can be selected and resolves its own texture source',()=>{
 const skin=createSkin('button');skin.defaultState='highlighted';skin.slices=[0,0,0,0];
 skin.textures={highlighted:{src:'data:image/png;base64,YWJj',w:1,h:1}};
 assert.doesNotThrow(()=>validateSkin(skin));assert.ok(SKIN_STATES.highlighted);
 const values=new Map(),node={classList:{toggle(){}},dataset:{},style:{setProperty(k,v){values.set(k,v);}}};
 applySkin(node,skin,{state:'highlighted',live:true});
 assert.equal(node.dataset.skinState,'highlighted');
 assert.equal(values.get('--skin-source'),'url("data:image/png;base64,YWJj")');
 assert.equal(values.get('--skin-highlighted-source'),'url("data:image/png;base64,YWJj")');
});
