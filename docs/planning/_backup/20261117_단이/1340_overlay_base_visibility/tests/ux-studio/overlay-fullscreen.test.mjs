import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {mkdtemp,writeFile,readFile,rm} from 'node:fs/promises';
import {join} from 'node:path';
import * as overlays from '../../src/tools/uxStudio/overlay-runtime.mjs';
import * as layout from '../../src/tools/uxStudio/layout-view.mjs';
import {validatePresentation,overlayTemplate,EFFECTS} from '../../src/tools/uxStudio/units.mjs';
import {validateDocument,screenById} from '../../src/tools/uxStudio/model.mjs';
import {createSkin} from '../../src/tools/uxStudio/skins.mjs';
import {commitDocumentEdit} from '../../src/tools/uxStudio/history.mjs';
import {saveDocument} from '../../src/tools/uxStudio/save-plugin.mjs';
const main=readFileSync('src/tools/uxStudio/main.mjs','utf8');
const fixture=(version=4)=>({schemaVersion:version,projectId:'fullscreen-root',name:'Root',revision:44,entryScreen:'main',screens:[{id:'main',name:'Main',kind:'page',...(version===4?{logicalSize:{w:551,h:984}}:{}),elements:[{id:'wins',name:'Wins',kind:'button',x:0,y:90,w:20,h:10}]}],transitions:[],fixtures:{balance:0,items:[]}});
function editor(version=4){
 let sequence=0;const c={doc:fixture(version),selectedScreen:'main',selectedElement:'wins',previewBase:'main',profile:'phone',overlayChoice:'builtin:modal',demoKind:'modal',demoRootMode:'window',demoEffect:'fade',demoDuration:240,demoAuto:0,demoDim:true,undo:[],redo:[],dirty:false,status:'',wheelRun:null,crypto:{randomUUID:()=>String(++sequence)},screenById,overlayTemplate,EFFECTS,commitDocumentEdit,render(){},notify:message=>assert.fail(message),esc:String};c.selection=()=>screenById(c.doc,c.selectedScreen).elements.find(e=>e.id===c.selectedElement);
 vm.createContext(c);let start=main.indexOf('function edited(fn)');vm.runInContext(main.slice(start,main.indexOf('let baselineItems',start)),c);
 start=main.indexOf('function presentation(');vm.runInContext(main.slice(start,main.indexOf('function drawOverlay(',start)),c);
 start=main.indexOf('function overlayPanel(');vm.runInContext(main.slice(start,main.indexOf('function typographyPanel(',start)),c);
 start=main.indexOf("        case 'bind-overlay':");vm.runInContext('function bind(){switch("bind-overlay"){'+main.slice(start,main.indexOf("        case 'overlay-content':",start))+'}}',c);return c;
}
test('fullscreen root is a validated optional enum while every default window remains unchanged',()=>{
 const p=overlayTemplate('modal','m').presentation,before=structuredClone(p);validatePresentation(p);assert.deepEqual(p,before);
 for(const rootMode of ['window','fullscreen'])assert.doesNotThrow(()=>validatePresentation({...p,rootMode}));
 for(const rootMode of [true,2,'100%','fullscreen;position:fixed',{}])assert.throws(()=>validatePresentation({...p,rootMode}));
 assert.equal(typeof overlays.overlayRootSize,'function');assert.deepEqual(overlays.overlayRootSize({kind:'modal'},{w:551,h:984}),{w:495.90000000000003,h:472.32});
 assert.deepEqual(overlays.overlayRootSize({kind:'modal',presentation:{rootMode:'fullscreen'}},{w:551,h:984}),{w:551,h:984});
});
test('fullscreen layout does not add centering transforms and existing motion finishes at the normal full-stage origin',()=>{
 const css=readFileSync('src/tools/uxStudio/styles.css','utf8'),scale=css.slice(css.indexOf('@keyframes ux-scale'),css.indexOf('@keyframes ux-slide'));
 assert.match(scale,/transform:\s*scale\(1\)/);assert.doesNotMatch(scale,/translate/);
 for(const type of ['modal','sheet','toast','popover','top'])assert.deepEqual(overlays.overlayRootSize({kind:'modal',presentation:{type,rootMode:'fullscreen'}},{w:551,h:984}),{w:551,h:984});
});
test('fullscreen demo close accepts pointer input while frame decorations and blank root retain backdrop input policy',()=>{
 const css=readFileSync('src/tools/uxStudio/styles.css','utf8');
 const selectors=[...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter(([,selector,body])=>selector.includes('[data-overlay-root="fullscreen"]')&&/pointer-events:\s*auto\s*;/.test(body)).flatMap(([,selector])=>selector.split(',').map(value=>value.trim()));
 assert.deepEqual(selectors.sort(),[
  '.preview-overlay[data-overlay-root="fullscreen"]>.demo-dismiss',
  '.preview-overlay[data-overlay-root="fullscreen"]>.ui-element:not([data-part-role="frame"])'
 ].sort());
});
test('fullscreen graphic root is transparent and unframed, restores window skin and never changes children or source',()=>{
 assert.equal(typeof layout.applyOverlayRoot,'function');const screen=overlayTemplate('modal','m');screen.presentation.rootMode='fullscreen';const before=structuredClone(screen),classes=new Set(),child={},node={children:[child],dataset:{},style:{setProperty(k,v){this[k]=v;}},classList:{toggle(k,on){if(on)classes.add(k);else classes.delete(k);}},querySelector(){return null;}};
 layout.applyOverlayRoot(node,screen,{live:true});assert.equal(node.style.width,'100%');assert.equal(node.style.height,'100%');assert.equal(node.style.background,'transparent');assert.equal(node.style.border,'0');assert.equal(node.style.boxShadow,'none');assert.equal(node.style.padding,'0');assert.equal(node.style.pointerEvents,'none');assert.equal(classes.has('game-skin'),false);assert.equal(node.children[0],child);assert.deepEqual(screen,before);
 layout.applyOverlayRoot(node,{...screen,presentation:{...screen.presentation,rootMode:'window'}});assert.equal(node.style.width,'');assert.equal(classes.has('game-skin'),true);
 const untouched={dataset:{},style:{setProperty(){}},classList:{toggle(){}},querySelector(){return null;}};layout.applyOverlayRoot(untouched,{kind:'modal',skin:createSkin('modal')});assert.equal(untouched.style.width,undefined);
});
test('whole-canvas fullscreen modal uses entry reference dimensions without rewriting its saved logicalSize',()=>{
 assert.equal(typeof overlays.overlayBoardScreen,'function');const doc=fixture(),screen={...overlayTemplate('modal','m'),logicalSize:{w:300,h:400}};screen.presentation.rootMode='fullscreen';doc.screens.push(screen);const before=structuredClone(doc),view=overlays.overlayBoardScreen(doc,screen);
 assert.deepEqual(view.logicalSize,{w:551,h:984});assert.equal(view.elements,screen.elements);assert.deepEqual(doc,before);delete screen.presentation.rootMode;assert.equal(overlays.overlayBoardScreen(doc,screen),screen);
});
test('common overlay inspector exposes one explicit root choice and default presentation adds no field',()=>{
 const c=editor(),before=structuredClone(c.doc);assert.match(c.overlayPanel(),/data-demo="rootMode"/);assert.match(c.overlayPanel(),/화면 전체 · 투명 UI 루트/);assert.equal(Object.hasOwn(c.presentation(),'rootMode'),false);c.demoRootMode='fullscreen';assert.equal(c.presentation().rootMode,'fullscreen');assert.deepEqual(c.doc,before);assert.equal(c.undo.length,0);
});
test('changing an existing root mode keeps its authored blocking, Escape and close policies',()=>{
 const c=editor(),modal=overlayTemplate('modal','existing');modal.logicalSize={w:551,h:984};Object.assign(modal.presentation,{blocking:false,dismissOnEscape:false,closePolicy:'prevent'});c.doc.screens.push(modal);c.overlayChoice=modal.id;c.demoRootMode='fullscreen';c.bind();
 assert.equal(modal.presentation.blocking,false);assert.equal(modal.presentation.dismissOnEscape,false);assert.equal(modal.presentation.closePolicy,'prevent');assert.equal(modal.presentation.rootMode,'fullscreen');
 c.demoRootMode='window';c.bind();assert.equal(modal.presentation.rootMode,undefined);assert.equal(modal.presentation.closePolicy,'prevent');
});
test('v4 actual common-definition handler inherits authored dimensions, binds open/close, and saves/reopens fullscreen',async t=>{
 const c=editor(),before=structuredClone(c.doc);c.demoRootMode='fullscreen';c.bind();const modal=c.doc.screens.at(-1);assert.deepEqual(structuredClone(modal.logicalSize),{w:551,h:984});assert.equal(modal.presentation.rootMode,'fullscreen');assert.equal(c.doc.revision,44);assert.equal(c.doc.entryScreen,'main');assert.deepEqual(c.doc.screens[0],before.screens[0]);assert.equal(c.undo.length,1);assert.deepEqual(c.undo[0],before);validateDocument(c.doc);
 assert.equal(c.doc.transitions.filter(t=>t.action==='open'&&t.targetScreen===modal.id).length,1);assert.equal(c.doc.transitions.filter(t=>t.action==='close'&&t.fromScreen===modal.id).length,1);
 const dir=await mkdtemp(join(process.cwd(),'_작업/codex/ux-studio/fullscreen-save-'));t.after(()=>rm(dir,{recursive:true,force:true}));await writeFile(join(dir,c.doc.projectId+'.json'),JSON.stringify(before));const saved=await saveDocument(process.cwd(),dir,c.doc,44),loaded=JSON.parse(await readFile(join(dir,c.doc.projectId+'.json'),'utf8'));assert.deepEqual(loaded,saved);assert.equal(saved.revision,45);assert.equal(loaded.screens.at(-1).presentation.rootMode,'fullscreen');assert.equal(c.doc.revision,44);
});
for(const version of [1,2,3])test(`v${version} common-definition creation preserves legacy schema and absent logicalSize`,()=>{
 const c=editor(version);c.bind();assert.equal(c.doc.schemaVersion,version);assert.equal(c.doc.screens.at(-1).logicalSize,undefined);assert.equal(c.doc.screens.at(-1).presentation.rootMode,undefined);validateDocument(c.doc);
});
