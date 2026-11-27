import test from 'node:test';
import assert from 'node:assert/strict';
import {fixture as baseFixture} from './dom-fixture.mjs';
import {mountSamplePage} from '../../src/tools/uxStudio/sample-preview.mjs';

const design=()=>({schemaVersion:4,projectId:'sample-test',name:'Sample',revision:1,entryScreen:'main',fixtures:{balance:0,items:[]},screens:[{id:'main',name:'Main',kind:'page',logicalSize:{w:390,h:844},elements:[]},{id:'popup',name:'Popup',kind:'modal',logicalSize:{w:390,h:844},elements:[]}],transitions:[]});
function pageFixture(t,query,{notFound=false}={}){
 const root=baseFixture(t),doc=root.ownerDocument,create=doc.createElement;
 doc.createElement=tag=>{const n=create(tag);n.style.setProperty=(k,v)=>n.style[k]=v;n.style.removeProperty=k=>delete n.style[k];return n;};
 const ids=['sample-board','sample-viewport','sample-stage','sample-status','sample-select','sample-project','sample-screen-info','sample-previous','sample-next','sample-refresh','sample-presentation','sample-overview'];
 const nodes=Object.fromEntries(ids.map(id=>[id,doc.createElement(id==='sample-select'||id==='sample-presentation'?'select':id==='sample-overview'?'a':'div')]));
 nodes['sample-overview'].hidden=true;nodes['sample-viewport'].clientWidth=430;nodes['sample-viewport'].clientHeight=650;
 doc.querySelector=selector=>nodes[selector.slice(1)];
 let current=design(),calls=0;
 const view=new EventTarget();view.location={href:'http://localhost/ui-studio/source/sample-preview.html'+query};view.history={replaceState(_a,_b,url){view.location.href=String(url);}};view.scrollTo=()=>{};
 view.fetch=async url=>{calls++;return {ok:!notFound,status:notFound?404:200,json:async()=>url.includes('/workspace?')?{workspace:{id:'workspace-a',name:'Folder',directory:'/sample/folder'}}:{document:current}};};
 const controller=mountSamplePage(doc,view);
 return {nodes,controller,setDesign:d=>current=d,calls:()=>calls};
}
test('sample overview link follows current screen and presentation after selection and saved refresh',async t=>{
 const e=pageFixture(t,'?project=sample-test&workspace=workspace-a&screen=popup&view=ui'),link=e.nodes['sample-overview'];
 assert.equal(link.hidden,true);
 await new Promise(setImmediate);
 assert.equal(link.hidden,false,'a loaded sample needs its own whole-canvas entrance');
 let url=new URL(link.href,'http://localhost');assert.equal(url.pathname,'/ui-studio/canvas.html');assert.equal(url.searchParams.get('workspace'),'workspace-a');assert.equal(url.searchParams.get('project'),'sample-test');assert.equal(url.searchParams.get('screen'),'popup');assert.equal(url.searchParams.get('view'),'ui');
 e.nodes['sample-select'].value='main';e.nodes['sample-select'].onchange();
 e.nodes['sample-presentation'].value='wireframe';e.nodes['sample-presentation'].onchange();
 url=new URL(link.href,'http://localhost');assert.equal(url.searchParams.get('screen'),'main');assert.equal(url.searchParams.get('view'),'wireframe');
 e.setDesign({...design(),revision:2,screens:[design().screens[0]]});await e.controller.load();
 url=new URL(link.href,'http://localhost');assert.equal(url.searchParams.get('screen'),'main');assert.equal(url.searchParams.get('view'),'wireframe');e.controller.dispose();
});
test('legacy sample overview omits absent workspace instead of selecting a different folder',async t=>{
 const e=pageFixture(t,'?project=sample-test');await new Promise(setImmediate);assert.equal(e.nodes['sample-overview'].hidden,false);
 const url=new URL(e.nodes['sample-overview'].href,'http://localhost');assert.equal(url.pathname,'/ui-studio/canvas.html');assert.equal(url.searchParams.has('workspace'),false);assert.equal(url.searchParams.get('project'),'sample-test');e.controller.dispose();
});
test('invalid sample identity leaves overview hidden without fetching a fallback design',async t=>{
 const e=pageFixture(t,'?workspace=workspace-a');await new Promise(setImmediate);assert.equal(e.nodes['sample-overview'].hidden,true);assert.equal(e.nodes['sample-overview'].href,undefined);assert.equal(e.calls(),0);e.controller.dispose();
});
test('missing saved sample cannot expose a canvas link to a remembered unrelated design',async t=>{
 const e=pageFixture(t,'?project=sample-test&workspace=workspace-a',{notFound:true});await new Promise(setImmediate);assert.equal(e.nodes['sample-overview'].hidden,true);assert.equal(e.nodes['sample-overview'].href,undefined);assert.equal(e.calls(),1);e.controller.dispose();
});
