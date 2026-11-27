import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {validateDocument,screenById,createRuntime,activate} from '../../src/tools/uxStudio/model.mjs';
import {escapeOverlay,canOverlayInput} from '../../src/tools/uxStudio/overlay-runtime.mjs';
import {commitDocumentEdit} from '../../src/tools/uxStudio/history.mjs';
const conversion=await import('../../src/tools/uxStudio/screen-conversion.mjs').catch(()=>({}));
const source=readFileSync('src/tools/uxStudio/main.mjs','utf8');
const convert=(...args)=>{assert.equal(typeof conversion.convertPageToModal,'function','page to modal conversion must exist');return conversion.convertPageToModal(...args);};
function fixture(version=4){
 const size=version===4?{logicalSize:{w:551,h:984}}:{};
 return {schemaVersion:version,projectId:'screen-conversion',revision:171,name:'Preserved design',entryScreen:'main',screens:[
  {id:'main',name:'Page_Main',kind:'page',...size,elements:[{id:'shop-entry',name:'Shop entry',kind:'button',x:5,y:90,w:20,h:8}]},
  {id:'shop',name:'Page_Shop',kind:'page',...size,canvasPosition:{x:635,y:40},purpose:'Shop content',elements:[
   {id:'shop-panel',name:'Panel_Shop',kind:'panel',x:4,y:12,w:92,h:82},
   {id:'shop-art',name:'Img_Shop',kind:'image',parentId:'shop-panel',x:10,y:20,w:80,h:30,image:{src:'',alt:'Shop artwork',fit:'contain',assetRef:'sha256-'+ 'a'.repeat(64)+'.webp',sourceSize:[128,128],region:[0,0,128,128]}},
   {id:'shop-close',name:'Back',kind:'button',parentId:'shop-panel',x:82,y:2,w:14,h:8}
  ]},
  {id:'other',name:'Page_Other',kind:'page',...size,elements:[{id:'other-button',name:'Other button',kind:'button',x:0,y:0,w:10,h:10}]}
 ],transitions:[
  {id:'enter-shop',fromScreen:'main',fromElement:'shop-entry',event:'click',action:'navigate',condition:'always',targetScreen:'shop',label:'Shop',payload:{origin:'main'},returnPolicy:'preserve'},
  {id:'leave-shop',fromScreen:'shop',fromElement:'shop-close',event:'click',action:'back',condition:'always',label:'Back',returnPolicy:'preserve'},
  {id:'other-back',fromScreen:'other',fromElement:'other-button',event:'click',action:'back',condition:'always',label:'Back'}
 ],fixtures:{balance:13075,items:[]}};
}
test('page conversion preserves source, stable IDs, all element data and unrelated screens',()=>{
 const d=fixture(),before=structuredClone(d),next=convert(d,'shop');
 assert.deepEqual(d,before);assert.notEqual(next,d);assert.equal(next.screens[1].kind,'modal');
 const {kind,presentation,...after}=next.screens[1],{kind:oldKind,...original}=before.screens[1];assert.deepEqual(after,original);
 assert.deepEqual(next.screens[0],before.screens[0]);assert.deepEqual(next.screens[2],before.screens[2]);
 assert.equal(next.entryScreen,'main');assert.equal(next.projectId,'screen-conversion');assert.equal(next.revision,171);assert.deepEqual(next.fixtures,before.fixtures);validateDocument(next);
 assert.deepEqual(presentation,{type:'modal',effect:'fade',durationMs:240,autoCloseMs:0,dim:true,blocking:true,dismissOnEscape:true,closePolicy:'allow',rootMode:'fullscreen'});
});
test('only incoming navigation and the converted screen back action change, retaining edge IDs and metadata',()=>{
 const d=fixture();d.transitions.push({...d.transitions[0],id:'already-open',action:'open',condition:'unknown'},{...d.transitions[1],id:'outgoing-page',action:'navigate',targetScreen:'other'});
 const before=structuredClone(d.transitions),next=convert(d,'shop');
 assert.deepEqual(next.transitions,[{...before[0],action:'open'},{...before[1],action:'close'},...before.slice(2)]);
});
test('converted runtime opens over the actual page and closes or Escapes with state and trigger focus retained',()=>{
 const d=convert(fixture(),'shop');let r=createRuntime(d);r.selection='kept-selection';r.filter='kept-filter';r.scroll={main:91};
 r=activate(d,r,'main','shop-entry');assert.equal(r.page,'main');assert.deepEqual(r.overlays,['shop']);assert.deepEqual(r.history,[]);assert.equal(canOverlayInput(d,r,'main'),false);
 for(const closed of [activate(d,r,'shop','shop-close'),escapeOverlay(d,r)]){
  assert.equal(closed.page,'main');assert.deepEqual(closed.overlays,[]);assert.equal(closed.selection,'kept-selection');assert.equal(closed.filter,'kept-filter');assert.deepEqual(closed.scroll,{main:91});assert.equal(closed.balance,13075);assert.equal(closed.focusReturn,'shop-entry');assert.equal(canOverlayInput(d,closed,'main'),true);
 }
});
test('entry, unknown, and non-page screens reject conversion without mutating the document',()=>{
 for(const target of ['main','missing','shop'])for(const kind of target==='shop'?['modal','sheet','toast']:['page']){
  const d=fixture();if(target==='shop')d.screens[1].kind=kind;const before=structuredClone(d);assert.throws(()=>convert(d,target),/시작|찾을|페이지/);assert.deepEqual(d,before);
 }
});
test('screen names change only when the conversion form explicitly supplies a nonempty name',()=>{
 const d=fixture();assert.equal(convert(d,'shop').screens[1].name,'Page_Shop');assert.equal(convert(d,'shop',{name:'  '}).screens[1].name,'Page_Shop');assert.equal(convert(d,'shop',{name:' Modal_Shop '}).screens[1].name,'Modal_Shop');assert.throws(()=>convert(d,'shop',{name:42}),/이름/);assert.equal(d.screens[1].name,'Page_Shop');
});
test('existing authored motion and close policies survive while the presentation becomes fullscreen modal',()=>{
 const d=fixture();d.screens[1].presentation={type:'sheet',effect:'slide',durationMs:180,autoCloseMs:0,dim:false,blocking:true,dismissOnEscape:false,closePolicy:'prevent'};
 const next=convert(d,'shop');assert.deepEqual(next.screens[1].presentation,{...d.screens[1].presentation,type:'modal',rootMode:'fullscreen'});validateDocument(next);
});
test('legacy versions keep their schema and absent logical dimensions without implicit migration',()=>{
 for(const version of [1,2,3]){const next=convert(fixture(version),'shop');assert.equal(next.schemaVersion,version);assert.equal(Object.hasOwn(next.screens[1],'logicalSize'),false);validateDocument(next);}
});
test('native conversion action creates one Undo snapshot and shows the same selected popup in both project tabs',()=>{
 const c={doc:fixture(),selectedScreen:'shop',selectedElement:'shop-art',selectedIds:['shop-art'],previewBase:'shop',overlayChoice:'builtin:modal',demoRootMode:'window',demoOverlay:null,mode:'edit',treeTab:'screens',search:'',cachedLayerBrowser:null,undo:[],redo:[{old:true}],dirty:false,status:'',wheelRun:null,convertPageToModal:convert,screenById,commitDocumentEdit,esc:String,render(){},notify:message=>assert.fail(message),resetRuntime(){},layerRows:()=>'<li>layers</li>',layerBrowserKey:()=>'',paletteBody:()=>''};
 c.$=id=>({value:id==='#convert-screen-name'?'Modal_Shop':'modal'});vm.createContext(c);
 let start=source.indexOf('function edited(fn)');vm.runInContext(source.slice(start,source.indexOf('let baselineItems',start)),c);
 start=source.indexOf('function projectTree()');vm.runInContext(source.slice(start,source.indexOf('function unitPalette()',start)),c);
 start=source.indexOf("        case 'convert-screen':");assert.notEqual(start,-1,'native conversion action is registered');
 vm.runInContext('function applyConversion(){switch("convert-screen"){'+source.slice(start,source.indexOf("        case 'new-screen':",start))+'}}',c);
 const before=structuredClone(c.doc);c.applyConversion();assert.equal(c.doc.screens[1].kind,'modal');assert.equal(c.doc.screens[1].name,'Modal_Shop');assert.equal(c.selectedScreen,'shop');assert.equal(c.previewBase,'main');assert.equal(c.overlayChoice,'shop');assert.equal(c.dirty,true);assert.equal(c.undo.length,1);assert.deepEqual(c.undo[0],before);assert.equal(c.redo.length,0);
 for(const treeTab of ['screens','layers']){c.treeTab=treeTab;const html=c.projectTree();assert.match(html,/현재 화면/);assert.match(html,/id="convert-screen-kind"/);assert.match(html,/Modal_Shop/);if(treeTab==='screens')assert.match(html,/data-screen="shop" class="active"/);}
 c.doc=c.undo.pop();assert.deepEqual(c.doc,before);
});
