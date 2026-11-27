import test from 'node:test';
import assert from 'node:assert/strict';
const panels=await import('../../src/tools/uxStudio/canvas-panels.mjs').catch(()=>({}));

test('canvas panel bounds reserve a usable center and constrain only the dragged side first',()=>{
 assert.equal(typeof panels.canvasPaneWidths,'function');
 assert.deepEqual(panels.canvasPaneWidths(1440,210,290),{left:210,right:290});
 assert.deepEqual(panels.canvasPaneWidths(1440,1000,290,'left'),{left:648,right:290});
 assert.deepEqual(panels.canvasPaneWidths(900,500,290,'left'),{left:334,right:290});
 assert.deepEqual(panels.canvasPaneWidths(900,210,500,'right'),{left:210,right:405});
 const narrow=panels.canvasPaneWidths(761,500,500,'right');
 assert.equal(narrow.left,285);assert.equal(narrow.right,200);
 assert.equal(761-narrow.left-narrow.right-16,260);
 assert.deepEqual(panels.canvasPaneWidths(1440,-1,NaN),{left:160,right:290});
 assert.throws(()=>panels.canvasPaneWidths(NaN,210,290));
});

test('panel pointer and keyboard changes update preferences separately, cancel restores, mobile ignores drag',()=>{
 assert.equal(typeof panels.attachCanvasPanels,'function');
 const callbacks=new Map(),stored=new Map(),props=new Map();let viewport=1440;
 const handles=['left','right'].map(side=>({dataset:{canvasSplit:side},attributes:{},listeners:new Map(),setAttribute(key,value){this.attributes[key]=String(value);},addEventListener(name,fn){this.listeners.set(name,fn);},removeEventListener(name){this.listeners.delete(name);},setPointerCapture(id){this.capture=id;},hasPointerCapture(id){return this.capture===id;},releasePointerCapture(){this.capture=null;},focus(){}}));
 const view={get innerWidth(){return viewport;},localStorage:{getItem:key=>stored.get(key),setItem:(key,value)=>stored.set(key,value)},addEventListener:(name,fn)=>callbacks.set('view:'+name,fn),removeEventListener:name=>callbacks.delete('view:'+name)};
 const host={ownerDocument:{defaultView:view},get clientWidth(){return viewport;},style:{setProperty:(key,value)=>props.set(key,value)},classList:{add(){},remove(){}},querySelectorAll:()=>handles,addEventListener:(name,fn)=>callbacks.set(name,fn),removeEventListener:name=>callbacks.delete(name)};
 const dispose=panels.attachCanvasPanels(host,{storageKey:'tool-panels'});
 const event=(handle,extra={})=>({button:0,pointerId:1,clientX:210,target:{closest:()=>handle},preventDefault(){},stopPropagation(){},...extra});
 callbacks.get('pointerdown')(event(handles[0]));
 handles[0].listeners.get('pointermove')(event(handles[0],{clientX:310}));
 assert.equal(props.get('--canvas-left'),'310px');assert.equal(handles[0].attributes['aria-valuenow'],'310');
 handles[0].listeners.get('pointerup')(event(handles[0]));assert.equal(JSON.parse(stored.get('tool-panels')).left,310);
 callbacks.get('keydown')(event(handles[1],{key:'ArrowLeft'}));assert.equal(props.get('--canvas-right'),'306px');
 callbacks.get('pointerdown')(event(handles[0]));handles[0].listeners.get('pointermove')(event(handles[0],{clientX:410}));
 callbacks.get('keydown')(event(handles[0],{key:'Escape'}));assert.equal(props.get('--canvas-left'),'310px');
 viewport=430;callbacks.get('pointerdown')(event(handles[0]));assert.equal(handles[0].capture,null);
 dispose();assert.equal(callbacks.size,0);
});
