import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {screenById} from '../../src/tools/uxStudio/model.mjs';
import {overlayPolicy} from '../../src/tools/uxStudio/overlay-runtime.mjs';
const source=readFileSync('src/tools/uxStudio/main.mjs','utf8');
class Node {
 constructor(){this.children=[];this.dataset={};this.style={};this.className='';this.classList={add:name=>{this.className+=' '+name;},toggle(){}};}
 append(node){this.children.push(node);}
 querySelector(){return null;}
 querySelectorAll(){return [];}
}
test('detail popup placement respects saved dim=false and keeps explicit/default dim policies without editing the design',()=>{
 for(const [kind,presentation,dimmed] of [['modal',{dim:false},false],['modal',{dim:true},true],['modal',undefined,true],['toast',undefined,false]]){
  const doc={entryScreen:'main',screens:[{id:'main',kind:'page',name:'Main',elements:[]},{id:'popup',kind,name:'Popup',presentation,elements:[{id:'custom-dim',appearance:{opacity:.72}}]}]},before=structuredClone(doc),host=new Node();host.clientWidth=1000;host.clientHeight=1000;
  const c={doc,mode:'edit',selectedScreen:'popup',previewBase:'main',profile:'design',profiles:{design:{}},detailDevicePreview:()=>({logical:{w:551,h:984},device:{w:551,h:984},scale:1}),screenById,overlayPolicy,zoom:'1',selectedIds:[],selectedElement:null,demoOverlay:null,assetView:'art',workspaceId:null,zoomAnchor:null,viewMemory:null,handTool:false,spaceDown:false,snap:false,runtime:{scroll:{}},document:{createElement:()=>new Node()},$:id=>id==='#preview-host'?host:{},renderElements(){},applyOverlayRoot(){},attachEditor:()=>()=>{}};
  vm.createContext(c);const start=source.indexOf('function renderPreview(');vm.runInContext(source.slice(start,source.indexOf('function flow(',start)),c);c.renderPreview();
  const canvas=host.children[0].children[0].children[0],backdrop=canvas.children.find(node=>node.className.split(' ').includes('modal-backdrop'));
  assert.ok(backdrop,'placement creates the overlay backdrop');assert.equal(backdrop.className.split(' ').includes('no-dim'),!dimmed,kind+' '+JSON.stringify(presentation));assert.equal(backdrop.children[0].className,'preview-overlay '+kind);assert.deepEqual(doc,before);
 }
});
