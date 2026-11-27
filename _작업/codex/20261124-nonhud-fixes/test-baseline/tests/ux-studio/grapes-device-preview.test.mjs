import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {DEVICE_PROFILES,validateDevicePreview,canvasDevicePreview,canvasDeviceStyles} from '../../src/tools/uxStudio/canvas-device-preview.mjs';
import {applyGrapesEdits,restoreGrapesSvg,canvasBoardPositions} from '../../src/tools/uxStudio/grapes-bridge.mjs';
import {overlayBoardScreen} from '../../src/tools/uxStudio/overlay-runtime.mjs';

const pilot=readFileSync(new URL('../../src/tools/uxStudio/grapes-pilot.mjs',import.meta.url),'utf8');
const vendor=readFileSync(new URL('../../src/tools/uxStudio/vendor/grapesjs-0.23.9/grapes.min.js',import.meta.url),'utf8');
function fixture({initialProfile='design'}={}){
 const module={exports:{}};vm.runInNewContext(vendor,{module,exports:module.exports,console,setTimeout,clearTimeout,setInterval,clearInterval});
 const init=pilot.split('\n').find(line=>line.startsWith(' const editor=grapesjs.init('));
 assert.ok(init,'Live editor options exist');
 let options;vm.runInNewContext(init,{grapesjs:{init:value=>{options=value;}},source:{screens:[{},{}]},canvasLayers:{onRender(){}}});
 const editor=module.exports.init({...options,headless:true});
 editor.DomComponents.addType('ux-board',{});editor.DomComponents.addType('ux-part',{});
 const source={schemaVersion:4,projectId:'ux-device-test',name:'Device',revision:1,entryScreen:'main',screens:[{id:'main',name:'Main',kind:'page',logicalSize:{w:551,h:984},elements:[{id:'part',name:'Part',kind:'text',x:10,y:20,w:25,h:10,fontSize:26,text:'Original'}]}],transitions:[],fixtures:{balance:0,items:[]}};
 editor.addComponents({type:'ux-board',uxBoard:'main',boardX:24,boardY:40,style:canvasDeviceStyles(canvasDevicePreview(source.screens[0],{profile:initialProfile})),components:[
  {tagName:'div',attributes:{'data-board-handle':'true'},content:'Main'},
  {type:'ux-part',uxId:'part',uxScreen:'main',name:'Part',uxText:'Original',uxX:10,uxY:20,uxW:25,uxH:10,style:{left:'10%',width:'25%','font-size':'26px'}}
 ]});
 const boardModels=()=>editor.getWrapper().components().filter(c=>c.get('uxBoard'));
 const part=()=>boardModels()[0].components().find(c=>c.get('uxId'));
 const design=()=>applyGrapesEdits(source,'main',[{id:'part',name:part().get('name'),text:part().get('uxText'),parentId:null,rect:Object.fromEntries(['x','y','w','h'].map(k=>[k,part().get('ux'+k.toUpperCase())]))}]);
 let persisted=0;
 const scope=vm.createContext({editor,source,boardModels,design,canvasBoardPositions,DEVICE_PROFILES,validateDevicePreview,canvasDevicePreview,canvasDeviceStyles,overlayBoardScreen,previewSettings:validateDevicePreview(),syncDeviceFields(){},resizeCanvas(){},boardFields(){},autoFit:false,home(){throw Error('Manual zoom must remain unchanged.');},localStorage:{setItem(){persisted++;}},devicePrefKey:'device-test'});
 const start=pilot.indexOf(' function applyDevicePreview('),end=pilot.indexOf(' const deviceControls=',start);
 assert.ok(start>=0&&end>start,'Live device preview function exists');
 vm.runInContext(pilot.slice(start,end),scope);
 const undoHook=pilot.split('\n').find(line=>line.startsWith(" editor.on('undo redo',()=>{")&&line.includes('applyDevicePreview'));
 if(undoHook)vm.runInContext(undoHook,scope);
 editor.UndoManager.clear();
 return {editor,source,part,boardModels,design,scope,get persisted(){return persisted;}};
}

test('real Grapes device changes preserve edited fields, model identity, selection, zoom and Undo history',()=>{
 const f=fixture();try{
  const original=structuredClone(f.source),model=f.part();f.editor.select(model);f.editor.Canvas.setZoom(75);
  model.set({uxX:12,uxText:'Unsaved'});const before=f.design(),stack=f.editor.UndoManager.getStack().length;
  f.scope.applyDevicePreview({profile:'phone'});
  assert.equal(f.part(),model);assert.equal(f.editor.getSelected(),model);assert.equal(f.editor.Canvas.getZoom(),75);
  assert.deepEqual(f.design(),before);assert.deepEqual(f.source,original);assert.equal(f.editor.UndoManager.getStack().length,stack);assert.equal(f.persisted,1);
  assert.equal(f.boardModels()[0].getStyle().height,844*551/390+'px');assert.equal(model.getStyle()['font-size'],'26px');
  f.editor.UndoManager.undo();assert.equal(model.get('uxX'),10);assert.equal(model.get('uxText'),'Original');
  assert.equal(f.boardModels()[0].getStyle().transform,`scale(${390/551})`);
  f.editor.UndoManager.redo();assert.deepEqual(f.design(),before);
 }finally{f.editor.destroy();}
});
test('real Grapes fullscreen modal viewport follows the entry page across devices and stage reload without authoring size',()=>{
 const f=fixture();try{
  const modal={id:'wins',name:'Wins',kind:'modal',logicalSize:{w:300,h:400},presentation:{type:'modal',effect:'fade',durationMs:240,autoCloseMs:0,dim:true,rootMode:'fullscreen'},elements:[]};f.source.screens.push(modal);
  f.editor.addComponents({type:'ux-board',uxBoard:'wins',boardX:600,boardY:40,components:[{tagName:'div',attributes:{'data-board-handle':'true'},content:'Wins'}]});f.editor.UndoManager.clear();const before=f.design();
  f.scope.applyDevicePreview({profile:'design'},{persist:false});const board=f.boardModels().find(c=>c.get('uxBoard')==='wins');assert.equal(board.getStyle().width,'551px');assert.equal(board.getStyle().height,'984px');assert.equal(board.getStyle().background,'transparent');
  f.scope.applyDevicePreview({profile:'phone'},{persist:false});assert.equal(board.getStyle().height,844*551/390+'px');assert.equal(board.getStyle().transform,`scale(${390/551})`);assert.equal(f.editor.UndoManager.getStack().length,0);assert.deepEqual(f.design(),before);
  f.editor.loadProjectData(restoreGrapesSvg(JSON.parse(JSON.stringify(f.editor.getProjectData()))));f.scope.applyDevicePreview({profile:'design'},{persist:false});assert.deepEqual(f.design(),before);assert.deepEqual(modal.logicalSize,{w:300,h:400});
 }finally{f.editor.destroy();}
});

test('legacy stage models accept the current preview without adding Undo or changing saved geometry',()=>{
 const f=fixture();try{
  const before=f.design(),stage=JSON.parse(JSON.stringify(f.editor.getProjectData()));
  f.editor.loadProjectData(restoreGrapesSvg(stage));f.editor.UndoManager.clear();
  f.scope.applyDevicePreview({profile:'phone430',orientation:'landscape'},{persist:false});
  assert.deepEqual(f.design(),before);assert.equal(f.editor.UndoManager.getStack().length,0);assert.equal(f.persisted,0);
  const board=f.boardModels()[0];assert.equal(board.getStyle().transform,`scale(${932/551})`);assert.equal(board.getAttributes()['data-preview-scale'],String(932/551));
  const data=f.editor.getProjectData();f.editor.loadProjectData(data);f.scope.applyDevicePreview({profile:'design'},{persist:false});
  assert.deepEqual(f.design(),before);assert.equal(f.boardModels()[0].getStyle().height,'984px');
  const style={...f.boardModels()[0].getStyle()};assert.throws(()=>f.scope.applyDevicePreview({profile:'custom',w:0,h:844}));
  assert.deepEqual({...f.boardModels()[0].getStyle()},style);
 }finally{f.editor.destroy();}
});

test('Undo of an older board style never restores the previous device dimensions',()=>{
 const f=fixture();try{
  const board=f.boardModels()[0];board.addStyle({left:'124px'});
  f.scope.applyDevicePreview({profile:'phone'});const count=f.editor.UndoManager.getStack().length;
  f.editor.UndoManager.undo();
  assert.equal(board.getStyle().height,844*551/390+'px');assert.equal(board.getStyle().transform,`scale(${390/551})`);
  assert.equal(f.editor.UndoManager.getStack().length,count);
  f.editor.UndoManager.redo();assert.equal(board.getStyle().height,844*551/390+'px');
 }finally{f.editor.destroy();}
});


test('live editor device settings update the applicable base CSS through mobile/design at narrow and wide iframe widths',()=>{
 for(const initialProfile of ['phone','design']){
 const f=fixture({initialProfile});try{
  const board=f.boardModels()[0],device=f.editor.Devices.getSelected();
  assert.equal(device.get('widthMedia'),'900px','Fixture uses the live two-screen canvas device configuration');
  const effectiveStyle=width=>{
   const result={};
   for(const rule of f.editor.Css.getComponentRules(board)){
    const media=rule.get('mediaText'),max=/^\(max-width: ([0-9.]+)px\)$/.exec(media||'');
    assert.ok(!media||max,'Only the generated max-width media rule is needed by this fixture');
    if(!media||width<=Number(max[1]))Object.assign(result,rule.getStyle());
   }
   return result;
  };
  const before=f.design(),stack=f.editor.UndoManager.getStack().length;
  for(const width of [1200,900]){
   device.set({width:width+'px'});
   for(const profile of ['design','phone','phone430','design']){
    f.scope.applyDevicePreview({profile},{persist:false});
    const expected=canvasDeviceStyles(canvasDevicePreview(f.source.screens[0],{profile})),actual=effectiveStyle(width);
    assert.equal(actual.height,expected.height,`${width}px iframe applies the ${profile} height rather than stale base CSS`);
    assert.equal(actual.transform,expected.transform,`${width}px iframe applies the ${profile} scale`);
   }
  }
  assert.equal(f.editor.Css.getComponentRules(board).filter(rule=>rule.get('mediaText')).length,0,'View-only device changes do not author responsive CSS overrides');
  assert.deepEqual(f.design(),before);assert.equal(f.editor.UndoManager.getStack().length,stack);
 }finally{f.editor.destroy();}
 }
});
