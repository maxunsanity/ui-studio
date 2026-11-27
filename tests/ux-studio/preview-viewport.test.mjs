import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {activate,createRuntime,validateDocument} from '../../src/tools/uxStudio/model.mjs';
const script=readFileSync('src/tools/uxStudio/preview.mjs','utf8').replace(/^import .*;\n/gm,'').replace('\nload();\n','\n');
const design=()=>({schemaVersion:4,projectId:'preview-scroll',name:'Preview',revision:43,entryScreen:'main',screens:[
 {id:'main',name:'Main',kind:'page',logicalSize:{w:551,h:984},elements:[{id:'go-build',name:'Build',kind:'button',x:0,y:90,w:20,h:10},{id:'feedback',name:'Feedback',kind:'button',x:20,y:90,w:20,h:10},{id:'open',name:'Open',kind:'button',x:40,y:90,w:20,h:10}]},
 {id:'build',name:'Build',kind:'page',logicalSize:{w:551,h:984},elements:[{id:'back',name:'Back',kind:'button',x:0,y:90,w:20,h:10}]},
 {id:'modal',name:'Modal',kind:'modal',logicalSize:{w:551,h:984},elements:[]}
],transitions:[{id:'navigate',fromScreen:'main',fromElement:'go-build',event:'click',action:'navigate',condition:'always',targetScreen:'build'},{id:'back-link',fromScreen:'build',fromElement:'back',event:'click',action:'back',condition:'always'},{id:'same-page',fromScreen:'main',fromElement:'feedback',event:'click',action:'feedback',condition:'always',payload:{message:'Hi'}},{id:'overlay',fromScreen:'main',fromElement:'open',event:'click',action:'open',condition:'always',targetScreen:'modal'}],fixtures:{balance:0,items:[]}});
async function setup({w=1600,h=900,top=115}={}){
 const nodes=Object.fromEntries(['consumer-status','consumer-phone','preview-project','action-output','refresh-design','consumer-stage'].map(id=>['#'+id,{style:{},textContent:''}])),scrolls=[],listeners={},observers=[];
 const stage=nodes['#consumer-stage'],footer=nodes['#action-output'],inside={scrollTop:141};let consumer;
 const window={scrollY:0,scrollX:0,getComputedStyle:node=>node===footer?{marginBottom:'16px'}:{paddingBottom:'18px'},addEventListener:(name,fn)=>listeners[name]=fn,scrollTo:options=>{scrolls.push(options);window.scrollX=options.left;window.scrollY=options.top;}};
 stage.getBoundingClientRect=()=>({top:top-window.scrollY,bottom:top-window.scrollY+(parseFloat(stage.style.height)||984)});
 footer.getBoundingClientRect=()=>({bottom:stage.getBoundingClientRect().bottom+22});
 const d=design(),scope={URL,location:{href:'http://localhost/ui-studio/preview.html?project=preview-scroll'},window,MutationObserver:class{constructor(callback){this.callback=callback;observers.push(this);}observe(node,options){this.node=node;this.options=options;}disconnect(){this.disconnected=true;}},document:{querySelector:id=>nodes[id],documentElement:{clientWidth:w,clientHeight:h},body:{}},scopeURL:path=>path,projectContext:()=>({label:'Project',name:'Preview',directory:'Directory'}),fetch:async()=>({ok:true,json:async()=>({document:d})}),mountDesignConsumer(host,document){validateDocument(document);let runtime=createRuntime(document);consumer={getState:()=>structuredClone(runtime),updateDesign(){},dispose(){},click:element=>{runtime=activate(document,runtime,runtime.page,element);}};host.internalList=inside;return consumer;}};
 vm.createContext(scope);vm.runInContext(script,scope);await scope.load();return {scope,nodes,window,scrolls,listeners,observers,consumer,inside,d};
}
for(const size of [{w:1600,h:900,top:115},{w:430,h:844,top:180},{w:1600,h:1800,top:115}])test(`standalone preview fits width and available height at ${size.w}×${size.h} without changing logical dimensions`,async()=>{
 const f=await setup(size),stage=f.nodes['#consumer-stage'],host=f.nodes['#consumer-phone'];
 assert.equal(host.style.width,'551px');assert.equal(host.style.height,'984px');
 assert.ok(parseFloat(stage.style.width)<=size.w-36);assert.ok(parseFloat(stage.style.height)+size.top+22+16+18<=size.h+1e-6);
 assert.ok(parseFloat(stage.style.height)<=984);if(size.h===1800)assert.equal(stage.style.height,'984px');else assert.ok(parseFloat(stage.style.height)<984);
 assert.equal(f.inside.scrollTop,141);assert.deepEqual(f.d.screens[0].logicalSize,{w:551,h:984});
 // Fit uses document coordinates, so a previously scrolled outer page has the same scale.
 const height=stage.style.height;f.window.scrollY=238.75;f.scope.fit();assert.equal(stage.style.height,height);
});
test('navigate and Back reset only the outer document; same-page feedback and overlays keep scroll position',async()=>{
 const f=await setup();assert.equal(f.observers.length,1);const observer=f.observers[0];assert.equal(observer.node,f.nodes['#consumer-phone']);
 f.window.scrollY=238.75;f.consumer.click('go-build');observer.callback();assert.equal(f.consumer.getState().page,'build');assert.equal(f.window.scrollY,0);assert.equal(f.inside.scrollTop,141);
 f.window.scrollY=120;f.consumer.click('back');observer.callback();assert.equal(f.consumer.getState().page,'main');assert.equal(f.window.scrollY,0);assert.equal(f.scrolls.length,2);
 f.window.scrollY=100;f.consumer.click('feedback');observer.callback();assert.equal(f.window.scrollY,100);f.consumer.click('open');observer.callback();assert.equal(f.window.scrollY,100);assert.equal(f.scrolls.length,2);assert.equal(f.inside.scrollTop,141);
 f.listeners.pagehide();assert.equal(observer.disconnected,true);
});
