import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
import {applyCanvasPositions,restoreGrapesSvg} from '../../src/tools/uxStudio/grapes-bridge.mjs';
const source=JSON.parse(await readFile('tests/ux-studio/fixtures/lobby-v1.json','utf8'));
const positions=()=>source.screens.map((s,i)=>({id:s.id,x:i*450+24,y:40}));
test('canvas identity preserves absent metadata, moves only selected screen, saves roundtrip',()=>{
 assert.deepEqual(applyCanvasPositions(source,positions()),source);const p=positions();p[1].x=24;p[1].y=940;
 const result=applyCanvasPositions(source,p),expected=structuredClone(source);expected.screens[1].canvasPosition={x:24,y:940};assert.deepEqual(result,expected);assert.equal(source.screens[1].canvasPosition,undefined);
 assert.deepEqual(applyCanvasPositions(JSON.parse(JSON.stringify(result)),p),result);
});
test('invalid/missing/duplicate canvas coordinates reject',()=>{
 for(const n of [-1,Infinity,NaN,10001]){const p=positions();p[0].x=n;assert.throws(()=>applyCanvasPositions(source,p));}
 assert.throws(()=>applyCanvasPositions(source,[]));const p=positions();p[1]=p[0];assert.throws(()=>applyCanvasPositions(source,p));
});
test('legacy board stages regain board model without changing persisted object',()=>{
 const data={pages:[{frames:[{component:{uxBoard:'one',tagName:'section',style:{left:'24px'}}}]}]};const restored=restoreGrapesSvg(data);assert.equal(restored.pages[0].frames[0].component.type,'ux-board');assert.equal(data.pages[0].frames[0].component.type,undefined);
});

const nativeSource=()=>({schemaVersion:4,projectId:'ux-board-spacing',name:'Spacing',revision:1,entryScreen:'one',screens:[{id:'one',name:'One',kind:'page',logicalSize:{w:551,h:984},elements:[]},{id:'two',name:'Two',kind:'page',logicalSize:{w:551,h:984},elements:[]},{id:'fixed',name:'Fixed',kind:'page',logicalSize:{w:320,h:640},canvasPosition:{x:2000,y:300},elements:[]}],transitions:[],fixtures:{balance:0,items:[]}});

test('default boards accumulate actual widths and existing gap while explicit coordinates stay unchanged',async()=>{
 const {canvasBoardPositions}=await import('../../src/tools/uxStudio/grapes-bridge.mjs');
 const doc=nativeSource(),before=structuredClone(doc);
 assert.deepEqual(canvasBoardPositions(doc.screens),[{id:'one',x:24,y:40},{id:'two',x:635,y:40},{id:'fixed',x:2000,y:300}]);
 assert.deepEqual(canvasBoardPositions(doc.screens,()=>390),[{id:'one',x:24,y:40},{id:'two',x:474,y:40},{id:'fixed',x:2000,y:300}]);
 assert.deepEqual(applyCanvasPositions(doc,[{id:'one',x:null,y:null},{id:'two',x:null,y:null},{id:'fixed',x:2000,y:300}]),before);
 assert.deepEqual(doc,before);
});

test('actual pilot builder creates width-aware default positions without authoring automatic coordinates',async()=>{
 const vm=await import('node:vm'),{canvasBoardPositions}=await import('../../src/tools/uxStudio/grapes-bridge.mjs'),{canvasDevicePreview}=await import('../../src/tools/uxStudio/canvas-device-preview.mjs');
 const pilot=await readFile('src/tools/uxStudio/grapes-pilot.mjs','utf8'),start=pilot.indexOf(' const boardPreview='),end=pilot.indexOf(' const canvasEditingCSS=',start),source=nativeSource();let boards;
 vm.runInNewContext(pilot.slice(start,end),{source,canvasBoardPositions,canvasDevicePreview,canvasDeviceStyles:preview=>({width:preview.logical.w+'px',height:preview.logical.h+'px',transform:`scale(${preview.scale})`,'transform-origin':'top left'}),previewSettings:{profile:'design'},document:{createElement:()=>({children:[]})},renderLayout(){},workspaceId:null,escape:String,editor:{setComponents:value=>{boards=value;}}});
 assert.deepEqual(Array.from(boards,board=>board.style.left),['24px','635px','2000px']);
 assert.deepEqual(Array.from(boards,board=>[board.boardX,board.boardY]),[[null,null],[null,null],[2000,300]]);
});

test('real vendor default board layout follows device widths without dirtying design and manual move Undo restores automatic layout',async()=>{
 const vm=await import('node:vm'),{canvasBoardPositions}=await import('../../src/tools/uxStudio/grapes-bridge.mjs'),device=await import('../../src/tools/uxStudio/canvas-device-preview.mjs');
 const pilot=await readFile('src/tools/uxStudio/grapes-pilot.mjs','utf8'),vendor=await readFile('src/tools/uxStudio/vendor/grapesjs-0.23.9/grapes.min.js','utf8'),module={exports:{}};
 vm.runInNewContext(vendor,{module,exports:module.exports,console,setTimeout,clearTimeout,setInterval,clearInterval});
 const source=nativeSource();let options;
 vm.runInNewContext(pilot.split('\n').find(line=>line.startsWith(' const editor=grapesjs.init(')),{source,grapesjs:{init:value=>{options=value;}},canvasLayers:{onRender(){}}});
 const editor=module.exports.init({...options,headless:true});
 try{
  const scope=vm.createContext({editor,source,...device,canvasBoardPositions,previewSettings:{profile:'design'},document:{createElement:()=>({children:[]})},renderLayout(){},workspaceId:null,escape:String,boardFields(){},resizeCanvas(){},syncDeviceFields(){},autoFit:false,home(){throw Error('Manual view must remain unchanged');},startBoardDrag(){},screenPicker:{},localStorage:{setItem(){}},devicePrefKey:'spacing'});
  const boardStart=pilot.indexOf(" editor.DomComponents.addType('ux-board'"),boardEnd=pilot.indexOf(' const devicePrefKey=',boardStart);vm.runInContext(pilot.slice(boardStart,boardEnd),scope);
  const start=pilot.indexOf(' const boardPreview='),end=pilot.indexOf(' const canvasEditingCSS=',start);vm.runInContext(pilot.slice(start,end),scope);
  scope.boardModels=()=>editor.getWrapper().components().filter(model=>model.get('uxBoard'));
  scope.design=()=>applyCanvasPositions(source,vm.runInContext('authoredPositions()',scope));
  const positionStart=pilot.indexOf(' const positions='),positionEnd=pilot.indexOf(' const extent=',positionStart);vm.runInContext(pilot.slice(positionStart,positionEnd),scope);
  const previewStart=pilot.indexOf(' function applyDevicePreview('),previewEnd=pilot.indexOf(' const deviceControls=',previewStart);vm.runInContext(pilot.slice(previewStart,previewEnd),scope);
  const undoHook=pilot.split('\n').find(line=>line.startsWith(" editor.on('undo redo',()=>{")&&line.includes('applyDevicePreview'));vm.runInContext(undoHook,scope);
  editor.UndoManager.clear();
  for(const profile of ['phone','design','phone430','design']){
   scope.applyDevicePreview({profile},{persist:false});
   const models=scope.boardModels(),width=device.canvasDevicePreview(source.screens[0],{profile}).device.w;
   assert.equal(parseFloat(models[1].getStyle().left)-parseFloat(models[0].getStyle().left)-width,60);
   assert.equal(models[2].getStyle().left,'2000px');assert.equal(models[2].getStyle().top,'300px');
   assert.deepEqual(scope.design(),source);assert.equal(editor.UndoManager.getStack().length,0);
  }
  const moved=scope.boardModels()[1];moved.set({boardX:1200,boardY:200});const manual=scope.design();
  assert.deepEqual(manual.screens[1].canvasPosition,{x:1200,y:200});
  scope.applyDevicePreview({profile:'phone'},{persist:false});assert.equal(moved.getStyle().left,'1200px');assert.deepEqual(scope.design(),manual);
  editor.UndoManager.undo();assert.equal(moved.get('boardX'),null);assert.equal(moved.getStyle().left,'474px');assert.deepEqual(scope.design(),source);
  editor.UndoManager.redo();assert.equal(moved.getStyle().left,'1200px');assert.deepEqual(scope.design(),manual);
 }finally{editor.destroy();}
});
