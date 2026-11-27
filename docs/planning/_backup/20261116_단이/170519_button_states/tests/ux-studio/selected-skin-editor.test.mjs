import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {createSkin,skinSource,SKINS,SKIN_STATES} from '../../src/tools/uxStudio/skins.mjs';
import {componentRoot,inputMode,inputOwner,PART_ROLES,INPUT_MODES} from '../../src/tools/uxStudio/parts.mjs';
import {assetSource} from '../../src/tools/uxStudio/asset-reference.mjs';
import {validateDocument} from '../../src/tools/uxStudio/model.mjs';
import {commitDocumentEdit,pushSnapshot} from '../../src/tools/uxStudio/history.mjs';

const source=await readFile('src/tools/uxStudio/main.mjs','utf8');
const ref='sha256-'+ 'a'.repeat(64)+'.png';
const part=(id,extra={})=>({id,name:id,kind:'panel',x:0,y:0,w:100,h:100,text:'',...extra});
const fixture=()=>({schemaVersion:3,projectId:'skin-selected',name:'Skin selected',revision:0,entryScreen:'main',transitions:[],fixtures:{balance:0,items:[]},screens:[{id:'main',name:'Main',kind:'page',elements:[part('top',{component:'image-frame',skin:createSkin('modal')}),part('bg',{parentId:'top',partRole:'background'}),part('frame',{parentId:'top',partRole:'frame'}),part('child',{parentId:'bg',kind:'text',text:'Preserve'})]}]});
function setup(ownSkin=false){
 const doc=fixture();if(ownSkin)doc.screens[0].elements[1].skin=createSkin('backplate');
 const notices=[],ctx={doc,selectedScreen:'main',selectedElement:'bg',skinState:'pressed',mode:'edit',workspaceId:'ws-skin',workspaceAssets:[],undo:[],redo:[],dirty:false,status:'',wheelRun:null,editingComponent:null,
  clone:structuredClone,validateDocument,commitDocumentEdit,pushSnapshot,createSkin,componentRoot,inputMode,inputOwner,PART_ROLES,INPUT_MODES,skinSource,SKINS,SKIN_STATES,assetSource,TextEncoder,
  esc:String,render(){},notify:message=>notices.push(message),screenById:(d,id)=>d.screens.find(s=>s.id===id),
  importGuideImage:async()=>({src:'',assetRef:ref,sourceSize:[128,64]})};
 ctx.selection=()=>ctx.doc.screens.find(s=>s.id===ctx.selectedScreen)?.elements.find(e=>e.id===ctx.selectedElement);
 vm.createContext(ctx);
 const helper=source.indexOf('function skinEditTarget(');if(helper>=0)vm.runInContext(source.slice(helper,source.indexOf('function partsPanel(',helper)),ctx);
 const edited=source.indexOf('function edited(fn)');vm.runInContext(source.slice(edited,source.indexOf('let baselineItems',edited)),ctx);
 const start=source.indexOf('    const input = event.target;',source.indexOf("app.addEventListener('change'"));
 const end=source.indexOf("    if (input.matches('[data-asset-view]'))",start);
 vm.runInContext('async function change(event){'+source.slice(start,end)+'}',ctx);
 const panel=source.indexOf('function partsPanel(');vm.runInContext(source.slice(panel,source.indexOf("app.addEventListener('keydown'",panel)),ctx);
 vm.runInContext(source.slice(source.indexOf('function imageRegionInspector('),helper>=0?helper:panel),ctx);
 vm.runInContext(source.slice(source.indexOf('function skinInspector(')),ctx);
 ctx.changeField=(selector,dataset,value)=>ctx.change({target:{dataset,value,files:[],matches:target=>target===selector}});
 return {ctx,notices};
}

test('an unskinned selected BG exposes its own frame mode even inside a skinned component',()=>{
 const {ctx}=setup(),html=ctx.partsPanel(ctx.doc.screens[0],ctx.selection());
 assert.match(html,/프레임 방식/);assert.match(html,/data-skin-mode/);
 assert.match(html,/value="none"[^>]*selected/);assert.match(html,/정보 백판.*9/);assert.match(html,/버튼.*3/);
});
test('assigning and removing the selected panel skin preserves IDs parents children and one-step Undo',async()=>{
 const {ctx}=setup(),before=structuredClone(ctx.doc),top=ctx.doc.screens[0].elements[0].skin;
 await ctx.changeField('[data-skin-mode]',{},'backplate');
 assert.equal(ctx.selection().skin.mode,'9');assert.equal(ctx.doc.screens[0].elements[0].skin,top);
 const stripped=structuredClone(ctx.doc);delete stripped.screens[0].elements[1].skin;
 assert.deepEqual(stripped,before);assert.equal(ctx.undo.length,1);assert.deepEqual(ctx.undo[0],before);
 await ctx.changeField('[data-skin-mode]',{},'none');
 assert.equal(ctx.selection().skin,undefined);assert.equal(ctx.doc.screens[0].elements[0].skin.preset,'modal');assert.equal(ctx.undo.length,2);
});
test('skin field and inspector prefer selected own skin while a plain child retains the root fallback',async()=>{
 const {ctx}=setup(true);ctx.skinState='normal';
 assert.match(ctx.partsPanel(ctx.doc.screens[0],ctx.selection()),/data-skin-project-image/);
 assert.match(ctx.partsPanel(ctx.doc.screens[0],ctx.selection()),/원본 128×96px/);
 await ctx.changeField('[data-skin-field]',{skinField:'edges.0'},'9');
 assert.equal(ctx.selection().skin.edges[0],9);assert.equal(ctx.doc.screens[0].elements[0].skin.edges[0],10);
 ctx.selectedElement='child';assert.equal(ctx.skinEditTarget(ctx.doc.screens[0],ctx.selection()).id,'top');
});
test('button frame mode reuses the existing three-slice definition on the selected panel',async()=>{
 const {ctx}=setup();await ctx.changeField('[data-skin-mode]',{},'button');
 assert.equal(ctx.selection().skin.mode,'3');assert.deepEqual(Array.from(ctx.selection().skin.slices),[0,16,0,16]);
});
test('project-path texture applies to the selected own state with a validated Undo snapshot',async()=>{
 const {ctx}=setup(true),before=structuredClone(ctx.doc);let imported;
 ctx.importGuideImage=async(input,workspace)=>{imported={input:JSON.parse(JSON.stringify(input)),workspace};return {src:'',assetRef:ref,sourceSize:[128,64]};};
 await ctx.changeField('[data-skin-project-image]',{},'/ui-studio/source/assets/frame.png');
 assert.deepEqual(imported,{input:{path:'/ui-studio/source/assets/frame.png'},workspace:'ws-skin'});
 assert.deepEqual(JSON.parse(JSON.stringify(ctx.selection().skin.textures.pressed)),{src:'',assetRef:ref,w:128,h:64});
 assert.equal(ctx.doc.screens[0].elements[0].skin.textures,undefined);assert.equal(ctx.undo.length,1);assert.deepEqual(ctx.undo[0],before);assert.equal(ctx.dirty,true);
});
for(const mutation of ['selection','document','play'])test('late project texture is ignored after '+mutation+' changes',async()=>{
 const {ctx}=setup(true);let release,imports=0;
 ctx.importGuideImage=async()=>{imports++;return new Promise(resolve=>release=()=>resolve({src:'',assetRef:ref,sourceSize:[128,64]}));};
 const pending=ctx.changeField('[data-skin-project-image]',{},'/ui-studio/source/assets/frame.png');
 assert.equal(imports,1);
 if(mutation==='selection')ctx.selectedElement='frame';else if(mutation==='document')ctx.doc=fixture();else ctx.mode='play';
 release();await pending;assert.equal(ctx.undo.length,0);assert.equal(ctx.dirty,false);
 assert.equal(ctx.doc.screens[0].elements[1].skin?.textures,undefined);
});
test('invalid frame textures roll back and play mode cannot assign a skin',async()=>{
 const {ctx,notices}=setup(true),before=structuredClone(ctx.doc);ctx.importGuideImage=async()=>({src:'',assetRef:ref,sourceSize:[16,16]});
 await ctx.changeField('[data-skin-project-image]',{},'/ui-studio/source/assets/tiny.png');
 assert.deepEqual(ctx.doc,before);assert.equal(ctx.undo.length,0);assert.match(notices[0],/프레임/);
 ctx.mode='play';await ctx.changeField('[data-skin-mode]',{},'button');assert.deepEqual(ctx.doc,before);
});
