import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as module from '../../src/tools/uxStudio/overview.mjs';
const design=()=>({schemaVersion:4,projectId:'design-a',name:'설계 가나다',revision:1,entryScreen:'first',fixtures:{balance:0,items:[]},screens:[{id:'first',name:'첫 화면',kind:'page',logicalSize:{w:390,h:844},elements:[]},{id:'first-2',name:'첫 화면 2',kind:'modal',logicalSize:{w:550,h:984},elements:[]}],transitions:[]});

test('overview reads catalog, design and workspace only inside the selected workspace',async()=>{
 assert.equal(typeof module.readOverviewData,'function');
 const calls=[],d=design();
 const result=await module.readOverviewData({workspaceId:'folder-a',projectId:'design-a'},async(url,options)=>{
  calls.push({url,options});return {ok:true,json:async()=>url.includes('/projects?')?{projects:[{id:'design-a',name:d.name,revision:1}]}:url.includes('/workspace?')?{workspace:{id:'folder-a',name:'Folder',directory:'/fixture/folder'}}:{document:d}};
 });
 assert.equal(result.design.projectId,'design-a');assert.equal(result.context.name,'Folder');
 assert.equal(calls.length,3);for(const {url,options}of calls){assert.equal(new URL(url,'http://localhost').searchParams.get('workspace'),'folder-a');assert.equal(options.cache,'no-store');}
});

test('empty catalog does not invent a design or fetch a project',async()=>{
 assert.equal(typeof module.readOverviewData,'function');
 const calls=[],result=await module.readOverviewData({workspaceId:null,projectId:null},async url=>{calls.push(url);return {ok:true,json:async()=>({projects:[]})};});
 assert.equal(result.design,null);assert.deepEqual(result.catalog,[]);assert.deepEqual(calls,['/api/ux-studio/projects']);
});

test('explicit missing project never falls through to another saved design',async()=>{
 assert.equal(typeof module.readOverviewData,'function');
 await assert.rejects(module.readOverviewData({workspaceId:null,projectId:'deleted'},async()=>({ok:true,json:async()=>({projects:[{id:'design-a',name:'A',revision:1}]})})),/찾지/);
});

test('wrong design identity, wrong workspace and malformed API catalog are rejected',async()=>{
 assert.equal(typeof module.readOverviewData,'function');
 for(const broken of ['identity','workspace','catalog'])await assert.rejects(module.readOverviewData({workspaceId:'folder-a',projectId:'design-a'},async url=>({ok:true,json:async()=>url.includes('/projects?')?{projects:broken==='catalog'?{}:[{id:'design-a',name:'A',revision:1}]}:url.includes('/workspace?')?{workspace:{id:broken==='workspace'?'folder-b':'folder-a',name:'Folder',directory:'/fixture'}}:{document:{...design(),projectId:broken==='identity'?'design-b':'design-a'}}})));
});

// Real overview controller with an EventTarget DOM shell; the renderer itself stays real.
class Node extends EventTarget{
 constructor(tag,doc){super();this.ownerDocument=doc;this.tagName=tag.toUpperCase();this.children=[];this.style={setProperty(key,value){this[key]=value;},removeProperty(key){delete this[key];}};this.dataset={};this.attributes={};this.className='';this.textContent='';this.clientWidth=900;this.clientHeight=700;this.scrollLeft=0;this.scrollTop=0;this.classList={add:()=>{},remove:()=>{},toggle:()=>{},contains:()=>false};}
 append(...nodes){for(const node of nodes){node.parentNode=this;this.children.push(node);}}
 replaceChildren(...nodes){this.children=[];this.append(...nodes);}
 setAttribute(key,value){this.attributes[key]=String(value);}
 getAttribute(key){return this.attributes[key]??null;}
 removeAttribute(key){delete this.attributes[key];}
 querySelectorAll(){return [];}
 querySelector(){return null;}
 focus(){this.ownerDocument.activeElement=this;}
 remove(){if(this.parentNode)this.parentNode.children=this.parentNode.children.filter(node=>node!==this);}
 getBoundingClientRect(){return {left:0,top:0,width:this.clientWidth,height:this.clientHeight};}
}
function shell(t,url='http://localhost/ui-studio/canvas.html?project=design-a&workspace=folder-a'){
 const before=globalThis.document,nodes=new Map(),page={createElement:tag=>new Node(tag,page),createElementNS:(_ns,tag)=>new Node(tag,page),querySelector:selector=>nodes.get(selector)||null};
 for(const id of ['overview','overview-project','overview-design','overview-current-screen','overview-status','overview-screens','overview-selected-name','overview-purpose','overview-kind','overview-size','overview-incoming','overview-outgoing','overview-viewport','overview-stage','overview-layer','overview-edges','overview-presentation','overview-layout','overview-zoom-value','overview-zoom-in','overview-zoom-out','overview-fit','overview-detail','overview-preview','overview-projects','overview-manual','overview-design-select','overview-design-open','overview-refresh','overview-empty','overview-count'])nodes.set('#'+id,new Node(id.includes('select')?'select':'div',page));
 globalThis.document=page;t.after(()=>{if(before===undefined)delete globalThis.document;else globalThis.document=before;});
 const frames=[],saved=new Map(),view=new EventTarget(),callbacks=new Map();let channel;
 const add=view.addEventListener.bind(view),remove=view.removeEventListener.bind(view);view.addEventListener=(name,fn,options)=>{callbacks.set(name,fn);add(name,fn,options);};view.removeEventListener=(name,fn)=>{callbacks.delete(name);remove(name,fn);};
 Object.assign(view,{location:{href:url},history:{replaceState(_a,_b,value){view.location.href=String(value);}},localStorage:{getItem:key=>saved.get(key)||null,setItem:(key,value)=>saved.set(key,value)},requestAnimationFrame:callback=>{frames.push(callback);return frames.length;},cancelAnimationFrame:()=>{},setTimeout,clearTimeout,BroadcastChannel:class{constructor(){channel=this;}close(){this.closed=true;}},fetch:async path=>({ok:true,json:async()=>path.includes('/projects?')?{projects:[{id:'design-a',name:'설계 가나다',revision:1}]}:path.includes('/workspace?')?{workspace:{id:'folder-a',name:'Folder',directory:'/fixture'}}:{document:design()}})});
 return {page,view,nodes,saved,callbacks,channel:()=>channel,flush(){let remaining=30;while(frames.length&&remaining--)frames.shift()();}};
}

test('flat screen rows and board buttons select exact IDs, render only visible boards, and keep game geometry untouched',async t=>{
 assert.equal(typeof module.mountOverview,'function');
 const env=shell(t),d=design(),before=structuredClone(d);
 env.view.fetch=async path=>({ok:true,json:async()=>path.includes('/projects?')?{projects:[{id:'design-a',name:d.name,revision:1}]}:path.includes('/workspace?')?{workspace:{id:'folder-a',name:'Folder',directory:'/fixture'}}:{document:d}});
 const controller=module.mountOverview(env.page,env.view);await controller.refresh();env.flush();
 const rows=env.nodes.get('#overview-screens').children;
 assert.equal(rows.length,2);assert.equal(rows[0].dataset.screen,'first');assert.equal(rows[1].dataset.screen,'first-2');
 rows[1].onclick();assert.equal(controller.snapshot().selected,'first-2');
 assert.equal(env.nodes.get('#overview-current-screen').textContent,'첫 화면 2');
 const link=new URL(env.nodes.get('#overview-detail').href,'http://localhost');assert.equal(link.searchParams.get('screen'),'first-2');assert.equal(link.searchParams.get('workspace'),'folder-a');
 assert.ok(controller.snapshot().mountedBoards<=2);assert.deepEqual(d,before);controller.dispose();
});

test('save broadcast ignores another workspace and refreshes matching selection with removed-screen fallback',async t=>{
 assert.equal(typeof module.mountOverview,'function');
 const env=shell(t),d=design();let current=d,reads=0;
 env.view.fetch=async path=>{if(path.includes('/project?'))reads++;return {ok:true,json:async()=>path.includes('/projects?')?{projects:[{id:'design-a',name:d.name,revision:current.revision}]}:path.includes('/workspace?')?{workspace:{id:'folder-a',name:'Folder',directory:'/fixture'}}:{document:current}};};
 const controller=module.mountOverview(env.page,env.view);await controller.refresh();env.flush();env.nodes.get('#overview-screens').children[1].onclick();
 const initialReads=reads;
 env.channel().onmessage({data:{type:'design.saved',workspace:'folder-b',projectId:'design-a',revision:2}});await new Promise(setImmediate);assert.equal(reads,initialReads);
 current={...d,revision:2,screens:[d.screens[0]]};
 env.channel().onmessage({data:{type:'design.saved',workspace:'folder-a',projectId:'design-a',revision:2}});await new Promise(setImmediate);env.flush();assert.ok(reads>initialReads);assert.equal(controller.snapshot().selected,'first');assert.equal(env.nodes.get('#overview-screens').children.length,1);
 controller.dispose();assert.equal(env.channel().closed,true);
});

test('initial grid fits width and leaves lower rows scrollable; explicit fit includes height',async t=>{
 const env=shell(t),d=design();d.screens=Array.from({length:17},(_,i)=>({...d.screens[0],id:'board-'+i,name:'화면 '+i}));d.entryScreen='board-0';
 env.view.fetch=async path=>({ok:true,json:async()=>path.includes('/projects?')?{projects:[{id:d.projectId,name:d.name,revision:1}]}:path.includes('/workspace?')?{workspace:{id:'folder-a',name:'Folder',directory:'/fixture'}}:{document:d}});
 const controller=module.mountOverview(env.page,env.view);await controller.refresh();env.flush();
 const first=controller.snapshot();assert.equal(first.positions[4].y,first.positions[0].y);assert.ok(first.positions[5].y>first.positions[0].y);
 assert.ok(Math.abs(first.zoom-876/2326)<.0001);assert.ok(first.positions[10].y*first.zoom>700);
 assert.ok(first.mountedBoards<17,'off-screen last row must not render immediately');
 env.nodes.get('#overview-fit').onclick();env.flush();assert.ok(controller.snapshot().zoom<first.zoom);controller.dispose();
});

test('flow keyboard movement and pointer cancellation update only view coordinates and survive a layout round trip',async t=>{
 const env=shell(t),d=design(),before=structuredClone(d);
 const controller=module.mountOverview(env.page,env.view);await controller.refresh();env.flush();
 const picker=env.nodes.get('#overview-layout');picker.value='flow';picker.onchange();env.flush();
 const start=controller.snapshot().positions.find(p=>p.id==='first'),hit=env.nodes.get('#overview-layer').children[0].children[2];
 let prevented=0;hit.onkeydown({key:'ArrowRight',shiftKey:false,preventDefault(){prevented++;}});
 assert.equal(prevented,1);assert.equal(controller.snapshot().positions.find(p=>p.id==='first').x,start.x+20);
 hit.onpointerdown({button:0,pointerId:1,clientX:100,clientY:100,preventDefault(){}});
 const fire=(type,values)=>{const event=new Event(type,{cancelable:true});for(const [key,value]of Object.entries(values))Object.defineProperty(event,key,{value});env.view.dispatchEvent(event);};
 fire('pointermove',{pointerId:1,clientX:150,clientY:150});assert.ok(controller.snapshot().positions.find(p=>p.id==='first').x>start.x+20);
 fire('keydown',{key:'Escape'});assert.equal(controller.snapshot().positions.find(p=>p.id==='first').x,start.x+20);
 picker.value='grid';picker.onchange();picker.value='flow';picker.onchange();assert.equal(controller.snapshot().positions.find(p=>p.id==='first').x,start.x+20);
 assert.deepEqual(d,before);controller.dispose();
});

test('whole-board selection keeps native content inert and distant boards are released after scrolling',async t=>{
 const env=shell(t),d=design();d.screens=Array.from({length:20},(_,i)=>({...d.screens[0],id:'board-'+i,name:'화면 '+i}));d.entryScreen='board-0';
 env.view.fetch=async path=>({ok:true,json:async()=>path.includes('/projects?')?{projects:[{id:d.projectId,name:d.name,revision:1}]}:path.includes('/workspace?')?{workspace:{id:'folder-a',name:'Folder',directory:'/fixture'}}:{document:d}});
 const controller=module.mountOverview(env.page,env.view);await controller.refresh();env.flush();
 const board=env.nodes.get('#overview-layer').children[1],content=board.children[1],hit=board.children[2];
 assert.equal(content.inert,true);assert.equal(content.getAttribute('aria-hidden'),'true');assert.equal(hit.tagName,'BUTTON');
 hit.onclick();assert.equal(controller.snapshot().selected,'board-1');
 assert.ok(controller.snapshot().mountedBoards>0);const viewport=env.nodes.get('#overview-viewport');viewport.scrollTop=10000;viewport.dispatchEvent(new Event('scroll'));env.flush();assert.equal(controller.snapshot().mountedBoards,0);controller.dispose();
});

test('deleted design clears stale screen rows and explanation while preserving available design choices',async t=>{
 const env=shell(t);let missing=false;
 env.view.fetch=async path=>({ok:true,json:async()=>path.includes('/projects?')?{projects:missing?[{id:'design-b',name:'다른 설계',revision:1}]:[{id:'design-a',name:'A',revision:1}]}:path.includes('/workspace?')?{workspace:{id:'folder-a',name:'Folder',directory:'/fixture'}}:{document:design()}});
 const controller=module.mountOverview(env.page,env.view);await controller.refresh();env.flush();assert.equal(env.nodes.get('#overview-screens').children.length,2);
 missing=true;await controller.refresh();env.flush();assert.equal(controller.snapshot().totalBoards,0);assert.equal(env.nodes.get('#overview-screens').children.length,0);assert.equal(env.nodes.get('#overview-purpose').textContent,'화면을 선택하면 설명과 실제 연결을 볼 수 있습니다.');assert.equal(env.nodes.get('#overview-design-select').value,'design-b');assert.match(env.nodes.get('#overview-status').textContent,/찾지/);controller.dispose();
});

test('opening a different design omits source view overrides and restores destination preferences',async t=>{
 const env=shell(t),controller=module.mountOverview(env.page,env.view);await controller.refresh();env.flush();
 const mode=env.nodes.get('#overview-presentation'),layout=env.nodes.get('#overview-layout');mode.value='wireframe';mode.onchange();layout.value='flow';layout.onchange();
 env.nodes.get('#overview-design-select').value='design-b';env.nodes.get('#overview-design-open').onclick();
 const target=new URL(env.view.location.href,'http://localhost');assert.equal(target.searchParams.get('project'),'design-b');assert.equal(target.searchParams.get('workspace'),'folder-a');assert.equal(target.searchParams.has('view'),false);assert.equal(target.searchParams.has('layout'),false);assert.equal(target.searchParams.has('screen'),false);controller.dispose();
});

test('grid board gestures allow native touch pan while flow boards reserve pointer drag',async t=>{
 const env=shell(t),controller=module.mountOverview(env.page,env.view);await controller.refresh();env.flush();
 assert.equal(env.nodes.get('#overview-layer').children[0].children[2].style.touchAction,'pan-x pan-y');
 const picker=env.nodes.get('#overview-layout');picker.value='flow';picker.onchange();assert.equal(env.nodes.get('#overview-layer').children[0].children[2].style.touchAction,'none');controller.dispose();
});

test('persisted pagehide preserves live boards and pageshow keeps selection interactive',async t=>{
 const env=shell(t),controller=module.mountOverview(env.page,env.view);await controller.refresh();env.flush();const count=controller.snapshot().mountedBoards;
 env.callbacks.get('pagehide')({persisted:true});assert.equal(controller.snapshot().mountedBoards,count);assert.equal(env.channel().closed,undefined);
 env.callbacks.get('pageshow')?.({persisted:true});await controller.refresh();env.flush();env.nodes.get('#overview-screens').children[1].onclick();assert.equal(controller.snapshot().selected,'first-2');assert.ok(controller.snapshot().mountedBoards>0);controller.dispose();
});

test('saved refresh can remove a dragging screen without leaving pointer or Escape errors',async t=>{
 const env=shell(t),d=design();let current=d;
 env.view.fetch=async path=>({ok:true,json:async()=>path.includes('/projects?')?{projects:[{id:d.projectId,name:d.name,revision:current.revision}]}:path.includes('/workspace?')?{workspace:{id:'folder-a',name:'Folder',directory:'/fixture'}}:{document:current}});
 const controller=module.mountOverview(env.page,env.view);await controller.refresh();env.flush();env.nodes.get('#overview-layout').value='flow';env.nodes.get('#overview-layout').onchange();
 env.nodes.get('#overview-layer').children[1].children[2].onpointerdown({button:0,pointerId:8,clientX:100,clientY:100,preventDefault(){}});
 current={...d,revision:2,screens:[d.screens[0]]};await controller.refresh();env.flush();
 assert.doesNotThrow(()=>env.callbacks.get('pointermove')({pointerId:8,clientX:160,clientY:160}));assert.doesNotThrow(()=>env.callbacks.get('keydown')({key:'Escape',preventDefault(){}}));assert.equal(controller.snapshot().selected,'first');controller.dispose();
});

test('refresh cancels a partial drag before saving view preferences even when the same screen survives',async t=>{
 const env=shell(t),controller=module.mountOverview(env.page,env.view);await controller.refresh();env.flush();env.nodes.get('#overview-layout').value='flow';env.nodes.get('#overview-layout').onchange();
 const before=controller.snapshot().positions.find(p=>p.id==='first');env.nodes.get('#overview-layer').children[0].children[2].onpointerdown({button:0,pointerId:9,clientX:100,clientY:100,preventDefault(){}});
 env.callbacks.get('pointermove')({pointerId:9,clientX:170,clientY:170});assert.ok(controller.snapshot().positions.find(p=>p.id==='first').x>before.x);
 await controller.refresh();env.flush();assert.equal(controller.snapshot().positions.find(p=>p.id==='first').x,before.x);controller.dispose();
});

test('the combined HUD overview always previews the saved lobby entry',async t=>{
 const env=shell(t,'http://localhost/ui-studio/canvas.html?project=design-a&workspace=folder-a&screen=other');
 const hud=design();
 const other={...design(),projectId:'design-b',entryScreen:'other',screens:[{...hud.screens[0],id:'other'}]};
 const sources=[hud,other];
 const planning={schemaVersion:1,projects:[{
  workspaceId:'folder-a',projectId:hud.projectId,homeMenuLabel:'HUD',
  canvasSources:[other.projectId],canvasReview:{sequence:['other','first','first-2'],sequenceRows:[],labels:{}},
 }]};
 env.view.fetch=async path=>{
  const url=new URL(path,'http://localhost');
  const payload=url.pathname.endsWith('/planning-documents.json')?planning
   :url.pathname.endsWith('/projects')?{projects:sources.map(d=>({id:d.projectId,name:d.name,revision:d.revision}))}
   :url.pathname.endsWith('/workspace')?{workspace:{id:'folder-a',name:'Folder',directory:'/fixture'}}
   :{document:sources.find(d=>d.projectId===url.searchParams.get('id'))};
  return {ok:true,json:async()=>payload};
 };
 const controller=module.mountOverview(env.page,env.view);
 t.after(()=>controller.dispose());
 await controller.refresh();
 env.flush();
 assert.equal(controller.snapshot().selected,'other');
 const link=new URL(env.nodes.get('#overview-preview').href,'http://localhost');
 assert.equal(link.pathname,'/ui-studio/preview.html');
 assert.equal(link.searchParams.get('project'),hud.projectId);
 assert.equal(link.searchParams.get('screen'),hud.entryScreen);
});
