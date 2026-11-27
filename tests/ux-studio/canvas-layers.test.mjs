import test from 'node:test';
import assert from 'node:assert/strict';
const layers=await import('../../src/tools/uxStudio/canvas-layers.mjs').catch(()=>({}));

test('whole nested layer rows select their exact model while the arrow only expands its own parent',()=>{
 assert.equal(typeof layers.attachCanvasLayers,'function');
 const callbacks=new Map(),rows=[];let selected=null,toggles=0,stops=0;
 const root={addEventListener:(name,fn)=>callbacks.set(name,fn),removeEventListener:name=>callbacks.delete(name),querySelectorAll:()=>rows};
 const helper=layers.attachCanvasLayers(root,{select:part=>selected=part,isOpen:part=>part.open,toggleOpen:part=>{part.open=!part.open;toggles++;}});
 const row=(id,child=false)=>{
  const model={open:false,get:key=>({uxId:id,uxScreen:'page',name:id})[key],components:()=>child?[{get:key=>key==='uxId'?'child':null}]:[]};
  const attributes={},caret={attributes:{},setAttribute(k,v){this.attributes[k]=String(v);}},item={attributes:{},parentElement:null,setAttribute(k,v){this.attributes[k]=String(v);},querySelector:()=>caret};
  const el={dataset:{},querySelector:()=>item};item.parentElement=el;rows.push(el);helper.onRender({component:model,el});
  const event=(arrow=false,key)=>({key,target:{closest:selector=>selector==='[data-toggle-select]'?item:selector==='[data-toggle-open]'&&arrow?caret:null},preventDefault(){},stopImmediatePropagation(){stops++;}});
  return {model,item,caret,el,event};
 };
 const parent=row('HUD_Top',true),child=row('Currency_Cash');
 callbacks.get('click')(child.event());assert.equal(selected,child.model);assert.equal(toggles,0);
 callbacks.get('click')(parent.event(true));assert.equal(toggles,1);assert.equal(selected,child.model);assert.equal(parent.caret.attributes['aria-expanded'],'true');
 callbacks.get('click')(parent.event());assert.equal(selected,parent.model);
 callbacks.get('keydown')(child.event(false,'Enter'));assert.equal(selected,child.model);
 helper.syncSelection(child.model);assert.equal(child.item.attributes['aria-pressed'],'true');assert.equal(parent.item.attributes['aria-pressed'],'false');
 assert.equal(stops,4);helper.dispose();assert.equal(callbacks.size,0);
});
