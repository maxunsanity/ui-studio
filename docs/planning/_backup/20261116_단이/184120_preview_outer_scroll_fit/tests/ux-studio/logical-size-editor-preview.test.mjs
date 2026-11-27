import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {responsiveInspectorHTML,applyResponsiveEdit} from '../../src/tools/uxStudio/responsive-inspector.mjs';
import {validateDocument} from '../../src/tools/uxStudio/model.mjs';

const fixture = () => ({schemaVersion:2,projectId:'logical-size',name:'Logical size',revision:0,entryScreen:'main',screens:[
 {id:'main',name:'Main',kind:'page',elements:[{id:'hud',name:'HUD',kind:'panel',x:2,y:.4,w:97,h:9.5}]},
 {id:'other',name:'Other',kind:'page',logicalSize:{w:768,h:1024},elements:[]}
],transitions:[],fixtures:{balance:0,items:[]}});

test('screen logical dimensions are editable without a selected part and save a validated v4 copy', () => {
 const original=fixture(),before=structuredClone(original);
 const width=applyResponsiveEdit(original,'main',null,'screen.logicalSize.w','551',{w:390,h:844});
 const next=applyResponsiveEdit(width,'main',null,'screen.logicalSize.h','984',{w:390,h:844});
 assert.equal(next.schemaVersion,4);
 assert.deepEqual(next.screens[0].logicalSize,{w:551,h:984});
 assert.deepEqual(next.screens[1].logicalSize,{w:768,h:1024});
 assert.deepEqual(next.screens[0].elements,before.screens[0].elements);
 assert.deepEqual(original,before);
 assert.doesNotThrow(() => validateDocument(next));
});

test('logical dimension fields remain available at screen root and opening them never upgrades the design', () => {
 const d=fixture(),before=structuredClone(d);
 d.screens[0].logicalSize={w:551,h:984};
 const html=responsiveInspectorHTML(d.screens[0],null);
 assert.match(html,/data-responsive-field="screen.logicalSize.w"[^>]*value="551"/);
 assert.match(html,/data-responsive-field="screen.logicalSize.h"[^>]*value="984"/);
 delete d.screens[0].logicalSize;
 assert.deepEqual(d,before);
});

test('invalid logical sizes reject without changing the document or bypassing safe-area validation', () => {
 const d=fixture();d.schemaVersion=4;d.screens[0].logicalSize={w:551,h:984};d.screens[0].safeArea=[0,100,0,100];
 const before=structuredClone(d);
 for(const raw of ['0','-1','10001','','bad'])assert.throws(() => applyResponsiveEdit(d,'main',null,'screen.logicalSize.w',raw));
 assert.throws(() => applyResponsiveEdit(d,'main',null,'screen.logicalSize.w','190'),/안전/);
 assert.deepEqual(d,before);
});

async function previewScope(design) {
 const source=(await readFile('src/tools/uxStudio/preview.mjs','utf8')).replace(/^import .*;\n/gm,'').replace('\nload();\n','\n');
 const nodes=Object.fromEntries(['consumer-status','consumer-phone','preview-project','action-output','refresh-design','consumer-stage'].map(id=>['#'+id,{style:{},textContent:''}]));
 const scope={URL,location:{href:'http://localhost/ui-studio/preview.html?project=logical-size'},
  document:{querySelector:id=>nodes[id],documentElement:{clientWidth:1000}},window:{addEventListener(){}},
  scopeURL:path=>path,projectContext:()=>({label:'Project',name:'Name',directory:'Directory'}),
  fetch:async()=>({ok:true,json:async()=>({document:design})}),
  mountDesignConsumer(_host,d){validateDocument(d);return {updateDesign:validateDocument,dispose(){}};}
 };
 vm.createContext(scope);vm.runInContext(source,scope);await scope.load();return {scope,nodes};
}

for(const {name,entry,basis,width,height} of [
 {name:'entry logical size wins over legacy basis and a different first screen',entry:{w:551,h:984},basis:{width:390,height:844},width:'551px',height:'984px'},
 {name:'legacy width/height basis remains supported',basis:{width:600,height:900},width:'600px',height:'900px'},
 {name:'legacy w/h basis remains supported',basis:{w:620,h:930},width:'620px',height:'930px'},
 {name:'unspecified size retains the phone fallback',width:'390px',height:'844px'}
])test('saved preview '+name,async()=>{
 const d=fixture();d.screens.reverse();if(entry)d.screens.find(s=>s.id==='main').logicalSize=entry;
 if(basis)d.designBasis={logicalSize:basis};
 const {nodes}=await previewScope(d);
 assert.equal(nodes['#consumer-phone'].style.width,width);
 assert.equal(nodes['#consumer-phone'].style.height,height);
 assert.equal(nodes['#consumer-stage'].style.width,width);
 assert.equal(nodes['#consumer-stage'].style.height,height);
});
