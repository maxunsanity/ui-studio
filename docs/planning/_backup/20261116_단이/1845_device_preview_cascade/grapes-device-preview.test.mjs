import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {DEVICE_PROFILES,validateDevicePreview,canvasDevicePreview,canvasDeviceStyles} from '../../src/tools/uxStudio/canvas-device-preview.mjs';
import {applyGrapesEdits,restoreGrapesSvg} from '../../src/tools/uxStudio/grapes-bridge.mjs';

const pilot=readFileSync(new URL('../../src/tools/uxStudio/grapes-pilot.mjs',import.meta.url),'utf8');
const vendor=readFileSync(new URL('../../src/tools/uxStudio/vendor/grapesjs-0.23.9/grapes.min.js',import.meta.url),'utf8');
function fixture(){
 const module={exports:{}};vm.runInNewContext(vendor,{module,exports:module.exports,console,setTimeout,clearTimeout,setInterval,clearInterval});
 const editor=module.exports.init({headless:true,storageManager:false,telemetry:false,undoManager:{trackSelection:false}});
 editor.DomComponents.addType('ux-board',{});editor.DomComponents.addType('ux-part',{});
 const source={schemaVersion:4,projectId:'ux-device-test',name:'Device',revision:1,entryScreen:'main',screens:[{id:'main',name:'Main',kind:'page',logicalSize:{w:551,h:984},elements:[{id:'part',name:'Part',kind:'text',x:10,y:20,w:25,h:10,fontSize:26,text:'Original'}]}],transitions:[],fixtures:{balance:0,items:[]}};
 editor.addComponents({type:'ux-board',uxBoard:'main',boardX:24,boardY:40,style:{width:'551px',height:'984px'},components:[
  {tagName:'div',attributes:{'data-board-handle':'true'},content:'Main'},
  {type:'ux-part',uxId:'part',uxScreen:'main',name:'Part',uxText:'Original',uxX:10,uxY:20,uxW:25,uxH:10,style:{left:'10%',width:'25%','font-size':'26px'}}
 ]});
 const boardModels=()=>editor.getWrapper().components().filter(c=>c.get('uxBoard'));
 const part=()=>boardModels()[0].components().find(c=>c.get('uxId'));
 const design=()=>applyGrapesEdits(source,'main',[{id:'part',name:part().get('name'),text:part().get('uxText'),parentId:null,rect:Object.fromEntries(['x','y','w','h'].map(k=>[k,part().get('ux'+k.toUpperCase())]))}]);
 let persisted=0;
 const scope=vm.createContext({editor,source,boardModels,design,DEVICE_PROFILES,validateDevicePreview,canvasDevicePreview,canvasDeviceStyles,previewSettings:validateDevicePreview(),syncDeviceFields(){},resizeCanvas(){},boardFields(){},autoFit:false,home(){throw Error('Manual zoom must remain unchanged.');},localStorage:{setItem(){persisted++;}},devicePrefKey:'device-test'});
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
