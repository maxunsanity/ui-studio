import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {designURL} from '../../src/tools/uxStudio/project-context.mjs';
import {openDesignGuide} from '../../src/tools/uxStudio/design-guide-view.mjs';

class Node extends EventTarget {
 constructor(tag,ownerDocument){super();this.tagName=tag.toUpperCase();this.ownerDocument=ownerDocument;this.children=[];this.attributes={};this.dataset={};this.style={};this._text='';this.contentDocument=null;this.disabled=false;}
 set innerHTML(value){throw Error('Untrusted design data cannot enter HTML');}
 set textContent(value){this._text=String(value);this.children=[];}
 get textContent(){return this._text+this.children.map(node=>node.textContent).join('');}
 append(...nodes){for(const node of nodes){node.parentNode=this;this.children.push(node);}}
 replaceChildren(...nodes){this._text='';this.children=[];this.append(...nodes);}
 setAttribute(key,value){this.attributes[key]=String(value);}
 getAttribute(key){return this.attributes[key]??null;}
 querySelector(){return null;}
 remove(){if(this.parentNode)this.parentNode.children.splice(this.parentNode.children.indexOf(this),1);this.parentNode=null;}
 get isConnected(){return this===this.ownerDocument.body||!!this.parentNode?.isConnected;}
 focus(){this.ownerDocument.activeElement=this;}
 showModal(){this.open=true;}
 close(){this.open=false;this.dispatchEvent(new Event('close'));}
}
const all=(root,predicate)=>root.children.flatMap(child=>[...(predicate(child)?[child]:[]),...all(child,predicate)]);
const button=(root,label)=>all(root,node=>node.tagName==='BUTTON'&&node.textContent===label)[0];
function dom(){const doc={createElement:tag=>new Node(tag,doc),createElementNS:(_,tag)=>new Node(tag,doc),activeElement:null};doc.body=new Node('body',doc);return doc;}
const fixture=()=>({schemaVersion:4,projectId:'ux-design',name:'설계 <검토>',revision:7,entryScreen:'page',screens:[{id:'page',name:'상점 <화면>',kind:'page',logicalSize:{width:400,height:800},elements:[{id:'parent',name:'부모',kind:'panel',x:0,y:0,w:100,h:100},{id:'child',parentId:'parent',name:'이름 <자식>',kind:'text',text:'시험',x:10,y:10,w:50,h:10}]}],transitions:[]});

test('stage and saved-sample navigation preserve selected context and presentation without changing old links',()=>{
 const selection={workspaceId:'ws-game',projectId:'ux-design',screenId:'상점 & 확인',elementId:'child',presentationMode:'detailed-wireframe'};
 const expected={detail:'/ui-studio/',canvas:'/ui-studio/canvas.html',preview:'/ui-studio/preview.html',sample:'/ui-studio/source/sample-preview.html'};
 for(const [stage,path]of Object.entries(expected)){
  const url=new URL(designURL(stage,selection),'http://localhost');
  assert.equal(url.pathname,path);assert.equal(url.searchParams.get('workspace'),'ws-game');assert.equal(url.searchParams.get('project'),'ux-design');assert.equal(url.searchParams.get('screen'),'상점 & 확인');assert.equal(url.searchParams.get('element'),'child');assert.equal(url.searchParams.get('view'),'detailed-wireframe');
 }
 assert.equal(designURL('detail',{projectId:'ux-design'}),'/ui-studio/?editor=detail&project=ux-design');
 assert.equal(new URL(designURL('canvas',{...selection,presentationMode:'bad'}),'http://localhost').searchParams.get('view'),'ui');
 assert.throws(()=>designURL('sample',{...selection,workspaceId:'../wrong'}));
});

test('guide shows project and screen, preserves selected path, and forwards preview and presentation changes',()=>{
 const previous=globalThis.document;globalThis.document=dom();
 try{
  const design=fixture(),before=structuredClone(design),previews=[],modes=[];
  const dialog=openDesignGuide({document:design,screenId:'page',elementId:'parent',workspaceId:'ws-game',context:{projectName:'프로젝트 <A>',dirty:true},presentationMode:'wireframe',onPreview:value=>previews.push(value),onPresentationChange:value=>modes.push(value)});
  const stage=all(dialog,node=>node.getAttribute('aria-label')==='제작 단계')[0];
  assert.ok(stage,'Guide exposes same three stage navigation');
  assert.deepEqual(all(stage,node=>node.tagName==='BUTTON').map(node=>node.textContent),['전체 캔버스','상세 편집','디자인 가이드']);
  assert.ok(dialog.textContent.includes('프로젝트 <A>'));assert.ok(dialog.textContent.includes('상점 <화면>'));
  button(dialog,'이름 <자식>').dispatchEvent(new Event('click'));
  const selector=all(dialog,node=>node.getAttribute('aria-label')==='표현')[0];assert.equal(selector.value,'wireframe');
  selector.value='detailed-wireframe';selector.dispatchEvent(new Event('change'));
  assert.deepEqual(modes,['detailed-wireframe']);
  button(dialog,'미리보기').dispatchEvent(new Event('click'));
  assert.deepEqual(previews,[{screenId:'page',elementId:'child',presentationMode:'detailed-wireframe'}]);
  assert.equal(dialog.isConnected,false);assert.deepEqual(design,before);
 }finally{globalThis.document=previous;}
});

test('guide navigation closes first and carries current child and view into overview/detail callbacks',()=>{
 const previous=globalThis.document;globalThis.document=dom();
 try{
  const calls=[];
  for(const [label,stage]of [['전체 캔버스','overview'],['상세 편집','detail']]){
   const dialog=openDesignGuide({document:fixture(),screenId:'page',elementId:'child',presentationMode:'ui',onNavigate:value=>{assert.equal(dialog.isConnected,false);calls.push(value);}});
   assert.ok(button(dialog,label),'Requested stage is available');button(dialog,label).dispatchEvent(new Event('click'));
   assert.deepEqual(calls.at(-1),{stage,screenId:'page',elementId:'child',presentationMode:'ui'});
  }
 }finally{globalThis.document=previous;}
});

test('detail header exposes current screen and shared stages, with all edit aids folded and history buttons absent',()=>{
 const source=readFileSync(new URL('../../src/tools/uxStudio/main.mjs',import.meta.url),'utf8'),start=source.indexOf('function header() {'),end=source.indexOf('\nfunction ',start+1);
 assert.ok(start>=0&&end>start);
 const doc=fixture(),scope={status:'',doc,workspaceId:null,folderProject:null,dirty:true,expectedRevision:7,saveBusy:false,mode:'edit',selectedScreen:'page',selectedElement:'child',presentationMode:'detailed-wireframe',assetView:'art',projects:[],baselineLabels:{W:'와이어'},baselineStage:'W',baselineItems:[],baselineBusy:false,studioSettings:{catalogEnabled:false},profiles:{design:{name:'설계',w:400,h:800}},profile:'design',zoom:'fit',workspacePrefs:{frame:{},stageColor:'#112233',canvasColor:'#112233'},grid:false,snap:true,handTool:false,undo:[],redo:[],innerWidth:1440,innerHeight:900,esc:value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])),projectContext:()=>({label:'공용',name:'프로젝트',directory:'/project',design:'설계'}),scopeURL:value=>value,designURL,screenById:(d,id)=>d.screens.find(s=>s.id===id),detailDevicePreview:()=>({reference:{w:400,h:800}}),PRESENTATION_MODES:[{id:'wireframe',label:'구역선'},{id:'detailed-wireframe',label:'세부 와이어'},{id:'ui',label:'본UI'}]};
 vm.createContext(scope);vm.runInContext(source.slice(start,end)+'\nthis.html=header();',scope);
 const html=scope.html;
 assert.match(html,/상점 &lt;화면&gt;/);assert.match(html,/aria-label="제작 단계"/);assert.match(html,/view=detailed-wireframe/);
 assert.doesNotMatch(html,/data-action="(?:undo|redo)"/);
 const exposed=html.replace(/<details\b[\s\S]*?<\/details>/g,'');
 assert.doesNotMatch(exposed,/data-setting="profile"|data-action="hand"|data-action="shortcuts"|data-action="unit-library"/);
 assert.match(exposed,/data-action="preview-current"/);assert.match(exposed,/data-action="save"/);
});


test('guide marks in-memory edits before preview without claiming they were saved',()=>{
 const previous=globalThis.document;globalThis.document=dom();
 try{
  const dialog=openDesignGuide({document:fixture(),screenId:'page',elementId:'child',context:{projectName:'프로젝트',dirty:false},onChange:()=>fixture()});
  const text=all(dialog,node=>node.getAttribute('aria-label')==='가이드 글자')[0],font=all(dialog,node=>node.getAttribute('aria-label')==='가이드 글자 크기 px')[0];
  text.value='새 글자';font.value='20';button(dialog,'글자 적용').dispatchEvent(new Event('click'));
  assert.ok(all(dialog,node=>node.className==='dg-subtitle')[0].textContent.includes('미저장 수정 포함'));
  dialog.close();
 }finally{globalThis.document=previous;}
});

test('current-design preview mounts the selected modal from a clone, stays honest about dirty state and disposes cleanly',()=>{
 const source=readFileSync(process.env.NAVIGATION_MAIN_SOURCE||new URL('../../src/tools/uxStudio/main.mjs',import.meta.url),'utf8');
 const begin=source.indexOf('function openCurrentPreview('),end=source.indexOf('\nfunction ',begin+1);
 assert.ok(begin>=0&&end>begin,'Current-design preview is available');
 const document=dom(),opener=document.createElement('button');document.body.append(opener);opener.focus();
 const doc=fixture();doc.screens.push({id:'modal',name:'확인 창',kind:'modal',logicalSize:{width:430,height:932},elements:[]});
 const before=structuredClone(doc),mounts=[];let disposed=0;
 const scope={document,doc,folderProject:{name:'나의 게임'},selectedScreen:'page',selectedElement:'child',workspaceId:'ws-game',presentationMode:'ui',dirty:true,expectedRevision:7,crypto,clone:structuredClone,screenById:(d,id)=>d.screens.find(s=>s.id===id),normalizePresentationMode:value=>['wireframe','detailed-wireframe','ui'].includes(value)?value:'ui',sampleSize:()=>({w:430,h:932}),sampleFit:()=>.5,notify:message=>{throw Error(message);},mountSampleScreen:(root,design,options)=>{mounts.push({root,design,options});return {dispose(){disposed++;}};}};
 vm.createContext(scope);vm.runInContext(source.slice(begin,end)+'\nopenCurrentPreview({screenId:"modal",elementId:null,presentationMode:"wireframe"});',scope);
 const dialog=all(document.body,node=>node.tagName==='DIALOG')[0];
 assert.ok(dialog.textContent.includes('확인 창'));assert.ok(dialog.textContent.includes('미저장 수정 포함'));assert.ok(dialog.textContent.includes('나의 게임'));
 assert.equal(mounts.length,1);assert.equal(mounts[0].options.screenId,'modal');assert.equal(mounts[0].options.workspaceId,'ws-game');assert.equal(mounts[0].options.presentationMode,'wireframe');assert.notEqual(mounts[0].design,doc);assert.deepEqual(doc,before);
 const host=all(dialog,node=>node.className==='studio-screen-preview-host')[0];assert.equal(host.style.width,'430px');assert.equal(host.style.transform,'scale(0.5)');
 dialog.close();assert.equal(disposed,1);assert.equal(dialog.isConnected,false);assert.equal(document.activeElement,opener);
 scope.dirty=false;scope.expectedRevision=null;vm.runInContext('openCurrentPreview({screenId:"modal"});',scope);
 const draft=all(document.body,node=>node.tagName==='DIALOG')[0];assert.ok(draft.textContent.includes('파일 저장 전'));draft.close();
});

test('detail location tracks current screen and child for reload without creating navigation history',()=>{
 const source=readFileSync(new URL('../../src/tools/uxStudio/main.mjs',import.meta.url),'utf8'),start=source.indexOf('function rememberPresentation()'),end=source.indexOf('\nfunction ',start+1);
 const location={href:'http://localhost/ui-studio/?editor=detail&workspace=ws-game&project=old&screen=stale&element=gone&view=ui#editor'},writes=[];
 const scope={URL,location,history:{replaceState(_state,_title,url){writes.push(url.href);location.href=url.href;}},doc:fixture(),workspaceId:'ws-game',selectedScreen:'page',selectedElement:'child',presentationMode:'detailed-wireframe'};
 vm.createContext(scope);vm.runInContext(source.slice(start,end),scope);
 scope.rememberPresentation();let url=new URL(location.href);
 assert.equal(url.searchParams.get('project'),'ux-design');assert.equal(url.searchParams.get('screen'),'page');assert.equal(url.searchParams.get('element'),'child');assert.equal(url.searchParams.get('view'),'detailed-wireframe');assert.equal(url.searchParams.get('workspace'),'ws-game');assert.equal(url.hash,'#editor');
 scope.rememberPresentation();assert.equal(writes.length,1,'rendering unchanged context does not write another history entry');
 scope.selectedElement='removed';scope.workspaceId=null;scope.rememberPresentation();url=new URL(location.href);assert.equal(url.searchParams.has('element'),false);assert.equal(url.searchParams.has('workspace'),false);
 assert.ok(source.slice(source.indexOf('function render() {'),source.indexOf('function collectScroll()')).includes('rememberPresentation()'),'screen selection re-renders synchronize reload context');
});

test('detail browser back-cache preserves timers until the document is actually discarded',()=>{
 const source=readFileSync(new URL('../../src/tools/uxStudio/main.mjs',import.meta.url),'utf8'),start=source.indexOf("window.addEventListener('pagehide'"),end=source.indexOf('\n',start);
 const window=new EventTarget();let pins=0,timers=0;
 const scope={window,disposePreviewPins:()=>pins++,runtimeOverlayTimers:{dispose:()=>timers++}};
 vm.createContext(scope);vm.runInContext(source.slice(start,end),scope);
 const persisted=new Event('pagehide');Object.defineProperty(persisted,'persisted',{value:true});window.dispatchEvent(persisted);
 assert.equal(timers,0,'a cached document must keep usable timer ownership');assert.equal(pins,0);
 window.dispatchEvent(new Event('pagehide'));assert.equal(timers,1,'final document disposal releases timers even after a cached visit');assert.equal(pins,1);
});
