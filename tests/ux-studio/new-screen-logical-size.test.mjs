import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {mkdtemp,readFile,writeFile,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {validateDocument,screenById} from '../../src/tools/uxStudio/model.mjs';
import {commitDocumentEdit} from '../../src/tools/uxStudio/history.mjs';
import {copySelection,pasteSelection} from '../../src/tools/uxStudio/commands.mjs';
import {canvasDevicePreview} from '../../src/tools/uxStudio/canvas-device-preview.mjs';
import {saveDocument} from '../../src/tools/uxStudio/save-plugin.mjs';

const source=readFileSync('src/tools/uxStudio/main.mjs','utf8');
function fixture(schemaVersion=4){
 return {schemaVersion,projectId:'new-screen-case',name:'New screen',revision:24,entryScreen:'main',screens:[
  {id:'main',name:'Main',kind:'page',...(schemaVersion===4?{logicalSize:{w:551,h:984}}:{}),elements:[{id:'slot',name:'Slot_3D',kind:'panel',x:0,y:0,w:100,h:100},{id:'image',name:'City',kind:'image',parentId:'slot',x:0,y:0,w:100,h:100}]},
  {id:'other',name:'Other',kind:'page',...(schemaVersion===4?{logicalSize:{w:768,h:1024}}:{}),elements:[]},
  {id:'modal',name:'Modal',kind:'modal',...(schemaVersion===4?{logicalSize:{w:400,h:500}}:{}),elements:[]}
 ],transitions:[],fixtures:{balance:0,items:[]}};
}
function setup({version=4,selected='main',kind='page'}={}){
 const c={doc:fixture(version),selectedScreen:selected,selectedElement:'slot',profile:'phone',undo:[],redo:[],dirty:false,status:'',wheelRun:null,render(){},notify:message=>assert.fail(message),crypto:{randomUUID:()=>kind+'-generated'},screenById,commitDocumentEdit};
 c.$=id=>({value:id==='#new-screen-name'?'Build':kind});vm.createContext(c);
 const edited=source.indexOf('function edited(fn)');vm.runInContext(source.slice(edited,source.indexOf('let baselineItems',edited)),c);
 const start=source.indexOf("        case 'new-screen':");vm.runInContext('function addScreen(){switch("new-screen"){'+source.slice(start,source.indexOf("        case 'new-project':",start))+'}}',c);return c;
}

for(const kind of ['page','modal'])test(`v4 actual new-${kind} handler inherits authored page dimensions, independent of preview reflow`,()=>{
 const c=setup({kind}),before=structuredClone(c.doc),device=canvasDevicePreview(c.doc.screens[0],{profile:'phone'});assert.notEqual(device.logical.h,984);
 c.addScreen();const added=c.doc.screens.at(-1);assert.deepEqual(structuredClone(added.logicalSize),{w:551,h:984});assert.notEqual(added.logicalSize,c.doc.screens[0].logicalSize);
 validateDocument(c.doc);assert.equal(c.doc.schemaVersion,4);assert.equal(c.doc.revision,24);assert.equal(c.doc.entryScreen,'main');assert.equal(c.undo.length,1);assert.deepEqual(c.undo[0],before);assert.equal(c.dirty,true);assert.equal(c.selectedScreen,added.id);assert.equal(c.selectedElement,null);
 assert.deepEqual(c.doc.screens.slice(0,-1),before.screens);
});

test('selected second page uses its own authored size and modal selection uses the entry page',()=>{
 for(const [selected,size]of [['other',{w:768,h:1024}],['modal',{w:551,h:984}]]){const c=setup({selected});c.addScreen();assert.deepEqual(structuredClone(c.doc.screens.at(-1).logicalSize),size);validateDocument(c.doc);}
});

for(const version of [1,2,3])test(`v${version} new-screen preserves the legacy absence of logicalSize and schema/revision`,()=>{
 const c=setup({version});c.addScreen();const added=c.doc.screens.at(-1);assert.equal(Object.hasOwn(added,'logicalSize'),false);assert.equal(c.doc.schemaVersion,version);assert.equal(c.doc.revision,24);validateDocument(c.doc);
});

test('new v4 page accepts a copied parent subtree and atomically saves/reopens without touching main',async t=>{
 const c=setup(),original=structuredClone(c.doc),before=structuredClone(c.doc.screens[0]),clipboard=copySelection(c.doc,'main',['slot'],551,984);c.addScreen();let count=0;
 const [root]=pasteSelection(c.doc,c.selectedScreen,clipboard,()=>'pasted-'+(++count));validateDocument(c.doc);
 const added=c.doc.screens.at(-1);assert.equal(added.elements.length,2);assert.equal(added.elements[1].parentId,root);assert.deepEqual(c.doc.screens[0],before);
 const saved=JSON.parse(JSON.stringify(c.doc));validateDocument(saved);assert.deepEqual(saved.screens.at(-1).logicalSize,{w:551,h:984});assert.equal(saved.revision,24);
 const storage=await mkdtemp(join(process.cwd(),'_작업/codex/ux-studio/new-screen-save-'));t.after(()=>rm(storage,{recursive:true,force:true}));
 await writeFile(join(storage,c.doc.projectId+'.json'),JSON.stringify(original));
 const committed=await saveDocument(process.cwd(),storage,c.doc,24),reopened=JSON.parse(await readFile(join(storage,c.doc.projectId+'.json'),'utf8'));
 assert.equal(committed.revision,25);
 assert.deepEqual(reopened,committed);validateDocument(reopened);assert.deepEqual(reopened.screens.at(-1).logicalSize,{w:551,h:984});assert.equal(reopened.screens.at(-1).elements[1].parentId,root);assert.equal(c.doc.revision,24);assert.deepEqual(c.doc.screens[0],before);
});
