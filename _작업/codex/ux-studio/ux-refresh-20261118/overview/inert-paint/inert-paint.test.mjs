import test from 'node:test';
import assert from 'node:assert/strict';
import {mountOverview} from '../../../../../../src/tools/uxStudio/overview.mjs';
import {fixture,fire} from '../../../../../../tests/ux-studio/dom-fixture.mjs';
import {createButtonState,disposeButtonStates} from '../../../../../../src/tools/uxStudio/button-state.mjs';
import {renderPresentation} from '../../../../../../src/tools/uxStudio/presentation.mjs';
const image=letter=>({src:'',assetRef:'sha256-'+letter.repeat(64)+'.webp',sourceSize:[20,20],fit:'contain',alt:'Static button'});
const design=(mode,disabled)=>({schemaVersion:4,projectId:'static-test',name:'Static display',revision:1,entryScreen:'page',fixtures:{balance:0,items:[]},transitions:[],screens:[{id:'page',name:'Page',kind:'page',logicalSize:{w:390,h:844},elements:[{id:'button',name:'Button',kind:'button',x:0,y:0,w:50,h:20,text:'Label',image:image('a'),interaction:{mode:'action',enabled:!disabled,shape:'rectangle',reason:''},buttonState:{...createButtonState(),enabled:true,mode,tints:{normal:'#336699',hover:'#eeeeee',pressed:'#cccccc',selected:'#dddddd',disabled:'#993366'},...(mode==='image'?{images:{normal:image('a'),disabled:image('d')}}:{})}}]}]});
function realDOM(t){
 const root=fixture(t),page=root.ownerDocument,create=page.createElement;
 const patch=node=>{node.style.setProperty=(key,value)=>node.style[key]=value;node.style.removeProperty=key=>delete node.style[key];node.classList.remove=name=>node.classList.toggle(name,false);return node;};
 patch(root);page.createElement=tag=>patch(create(tag));page.createElementNS=(_ns,tag)=>page.createElement(tag);
 return root;
}
function shell(t,d,presentationMode){
 const root=realDOM(t),page=root.ownerDocument,nodes=new Map(),frames=[],stored=new Map();
 for(const id of ['overview','overview-project','overview-design','overview-current-screen','overview-status','overview-screens','overview-selected-name','overview-purpose','overview-kind','overview-size','overview-incoming','overview-outgoing','overview-viewport','overview-stage','overview-layer','overview-edges','overview-presentation','overview-layout','overview-zoom-value','overview-zoom-in','overview-zoom-out','overview-fit','overview-detail','overview-preview','overview-projects','overview-manual','overview-design-select','overview-design-open','overview-refresh','overview-empty','overview-count']){const node=page.createElement('div');node.clientWidth=900;node.clientHeight=700;node.scrollLeft=node.scrollTop=0;nodes.set('#'+id,node);root.append(node);}
 page.querySelector=selector=>nodes.get(selector)||null;
 const view=new EventTarget();Object.assign(view,{location:{href:'http://localhost/ui-studio/canvas.html?project=static-test&view='+presentationMode},history:{replaceState(_a,_b,url){view.location.href=String(url);}},localStorage:{getItem:key=>stored.get(key)||null,setItem:(key,value)=>stored.set(key,value)},setTimeout,clearTimeout,requestAnimationFrame:callback=>{frames.push(callback);return frames.length;},cancelAnimationFrame(){},fetch:async path=>({ok:true,json:async()=>path==='/api/ux-studio/projects'?{projects:[{id:d.projectId,name:d.name,revision:1}]}:{document:d}})});
 return {page,view,nodes,flush(){let n=30;while(frames.length&&n--)frames.shift()();}};
}

for(const presentationMode of ['ui','detailed-wireframe'])for(const mode of ['image','tint'])for(const disabled of [false,true])test('overview static '+presentationMode+' preserves authored '+(disabled?'disabled':'normal')+' '+mode+' paint while input stays inert',async t=>{
 const d=design(mode,disabled),before=structuredClone(d),env=shell(t,d,presentationMode),controller=mountOverview(env.page,env.view);t.after(()=>controller.dispose());await controller.refresh();env.flush();
 const board=env.nodes.get('#overview-layer').children[0],content=board.children[1],panel=content.children[0],button=panel.querySelector('.ui-element');
 assert.equal(controller.snapshot().mountedBoards,1);assert.equal(content.inert,true);assert.equal(button._buttonStateController,undefined);assert.equal(button.disabled,disabled);assert.equal(button.dataset.buttonState,disabled?'disabled':'normal');
 const picture=button.querySelector('img');assert.equal(picture.src,'/api/ux-studio/asset?ref=sha256-'+(mode==='image'&&disabled?'d':'a').repeat(64)+'.webp');
 if(mode==='tint'){
  const matrix=button.querySelector('fecolormatrix'),id=button.querySelector('filter')?.getAttribute('id');assert.ok(matrix,'static tint definition remains available');assert.equal(matrix.getAttribute('values'),disabled?'0.6 0 0 0 0 0 0.2 0 0 0 0 0 0.4 0 0 0 0 0 1 0':'0.2 0 0 0 0 0 0.4 0 0 0 0 0 0.6 0 0 0 0 0 1 0');assert.ok(button.style.filter.includes('url("#'+id+'")'));
 }
 const staticImage=picture.src,staticFilter=button.style.filter,state=button.dataset.buttonState;
 fire(button,'pointerenter',{pointerType:'mouse'});fire(button,'pointerdown',{button:0,pointerId:1});fire(button,'keydown',{key:' '});
 assert.equal(picture.src,staticImage);assert.equal(button.style.filter,staticFilter);assert.equal(button.dataset.buttonState,state);assert.deepEqual(d,before);
});

test('default button disposal still removes transient tint, state and listeners for existing consumers',t=>{
 const root=realDOM(t),d=design('tint',false);renderPresentation(d.screens[0],root,{presentationMode:'ui',mode:'view',assetView:'art',workspaceId:null});const button=root.querySelector('.ui-element');assert.ok(button.querySelector('filter'));disposeButtonStates(root);assert.equal(button.querySelector('filter'),null);assert.equal(button.dataset.buttonState,undefined);assert.equal(button._buttonStateController,undefined);const filter=button.style.filter;fire(button,'pointerenter',{pointerType:'mouse'});assert.equal(button.style.filter,filter);
});
