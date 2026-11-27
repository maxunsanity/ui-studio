import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
const root=process.env.UI_STUDIO_ROOT||process.cwd();
const source=readFileSync(process.env.LAYOUT_SOURCE||root+'/src/tools/uxStudio/layout-view.mjs','utf8');
const deps={};
for(const name of ['controls','asset-reference','responsive-layout','skins','parts','menu-state','visual-effects','notification','button-state','scroll-pin'])Object.assign(deps,await import(pathToFileURL(root+'/src/tools/uxStudio/'+name+'.mjs')));
const fixtureSource=readFileSync(root+'/tests/ux-studio/control-visual.test.mjs','utf8');
function fixture(){
 const skinCalls=[];let renderGraphic;const scope={...deps,EventTarget,Event,console,crypto,applySkin:(node,skin,options)=>{skinCalls.push(skin);return deps.applySkin(node,skin,options);},attachButtonStates:(node,screen,runtime,options)=>{renderGraphic=options.renderGraphic;return deps.attachButtonStates(node,screen,runtime,options);}};vm.createContext(scope);
 vm.runInContext(fixtureSource.slice(fixtureSource.indexOf('class Node extends'),fixtureSource.indexOf('function fixture(t)'))+'\nthis.Node=Node;this.fire=fire;',scope);
 const doc={};doc.createElement=tag=>{const n=new scope.Node(tag,doc);n.style.setProperty=(k,v)=>{n.style[k]=v;};n.style.removeProperty=k=>{delete n.style[k];};n.classList.remove=k=>n.classList.toggle(k,false);return n;};doc.createElementNS=(_ns,tag)=>doc.createElement(tag);scope.document=doc;
 vm.runInContext(source.replace(/^import .*;\n/gm,'').replace(/^export /gm,''),scope);
 return {scope,root:doc.createElement('section'),doc,fire:scope.fire,skinCalls,get renderGraphic(){return renderGraphic;}};
}
const image=(name,size=[180,80])=>({src:'data:image/png;base64,'+Buffer.from(name).toString('base64'),alt:name,fit:'fill',...(size?{sourceSize:size}:{})});
function button(mode='3'){
 const skin=deps.createSkin(mode==='3'?'button':'backplate');skin.textures={normal:{src:image('original').src,w:180,h:80},highlighted:{src:image('old-hover').src,w:180,h:80},pressed:{src:image('old-press').src,w:180,h:80}};
 return {id:'button',name:'Button',kind:'button',x:0,y:0,w:60,h:20,skin,buttonState:{...deps.createButtonState(),enabled:true,mode:'image',images:Object.fromEntries(['normal','hover','pressed','selected','disabled'].map(s=>[s,image(s)]))}};
}
const url=src=>'url("'+src+'")';
function assertSkin(node,src,mode){
 assert.equal(!!node.querySelector('.image-content'),false,'frame-only state must not add a plain img over the sliced frame');
 assert.equal(node.style['--skin-source'],url(src));
 for(const s of ['normal','highlighted','pressed','selected','disabled'])assert.equal(node.style['--skin-'+s+'-source'],url(src),'CSS pseudo-state must use the current button image');
 assert.equal(node.style['--skin-slices'],mode==='3'?'0 16 0 16 fill':'12 12 12 12 fill');
 assert.equal(node.style['--skin-edges'],mode==='3'?'0px 12px 0px 12px':'6px 6px 6px 6px');
}
for(const kind of ['button','panel'])for(const mode of ['3','9'])test(mode+'-slice '+kind+' action-owner self keeps caps, swaps every state and restores without model mutation',()=>{
 const f=fixture(),b=button(mode);if(kind==='panel')Object.assign(b,{kind:'panel',partRole:'frame',interaction:{mode:'action',enabled:true,shape:'rectangle',reason:''}});const screen={id:'main',elements:[b]},before=JSON.stringify(screen),runtime={};deps.validateButtonStates(screen,[]);
 const render=()=>f.scope.renderLayout(screen,f.root,{mode:'play',assetView:'art',runtime});render();const n=f.root.children[0];assertSkin(n,b.buttonState.images.normal.src,mode);
 f.fire(n,'pointerenter',{pointerType:'mouse'});assertSkin(n,b.buttonState.images.hover.src,mode);
 f.fire(n,'pointerdown',{button:0,pointerId:1});assertSkin(n,b.buttonState.images.pressed.src,mode);
 f.fire(n,'pointerup',{pointerId:1});assertSkin(n,b.buttonState.images.hover.src,mode);
 f.fire(n,'pointerleave');assertSkin(n,b.buttonState.images.normal.src,mode);
 f.fire(n,'focus');assertSkin(n,b.buttonState.images.hover.src,mode);
 f.fire(n,'keydown',{key:'Enter'});assertSkin(n,b.buttonState.images.pressed.src,mode);
 f.fire(n,'keyup',{key:'Enter'});assertSkin(n,b.buttonState.images.hover.src,mode);f.fire(n,'blur');
 b.buttonState.selectable=true;b.buttonState.selected=true;render();assertSkin(n,b.buttonState.images.selected.src,mode);b.buttonState.selectable=false;b.buttonState.selected=false;
 runtime.pending=true;render();assertSkin(n,b.buttonState.images.disabled.src,mode);runtime.pending=false;
 assert.equal(JSON.stringify(screen),before,'all events must leave authored image and skin data unchanged');
 b.buttonState.mode='tint';render();assert.equal(n.querySelector('.image-content'),null);assert.equal(n.style['--skin-source'],url(image('original').src));assert.equal(n.style['--skin-highlighted-source'],url(image('old-hover').src));
});
test('missing sourceSize uses original texture dimensions and leaves original skin intact',()=>{
 const f=fixture(),b=button();b.buttonState.images.normal=image('no-size',null);const before=JSON.stringify(b.skin);f.scope.renderLayout({id:'main',elements:[b]},f.root,{mode:'play',assetView:'art'});assertSkin(f.root.children[0],image('no-size',null).src,'3');assert.equal(JSON.stringify(b.skin),before);
});
test('actual image and separate frame retain the original raw-image rendering path',()=>{
 const f=fixture(),b=button(),frame={id:'frame',parentId:'button',name:'Frame',kind:'panel',x:0,y:0,w:100,h:100,skin:deps.createSkin('button')};b.image=image('base');const screen={id:'main',elements:[b,frame]},before=JSON.stringify(screen);f.scope.renderLayout(screen,f.root,{mode:'play',assetView:'art'});const n=f.root.children[0];assert.equal(n.querySelector('.image-content').querySelector('img').src,b.buttonState.images.normal.src);assert.equal(n.style['--skin-source'],url(image('original').src));f.fire(n,'pointerdown',{button:0,pointerId:2});assert.equal(n.querySelector('.image-content').querySelector('img').src,b.buttonState.images.pressed.src);assert.equal(JSON.stringify(screen),before);
});
test('sprite-region state remains an explicit raw crop instead of becoming a slice texture',()=>{
 const f=fixture(),b=button();b.buttonState.images.normal={...image('sprite'),region:[0,0,40,40]};f.scope.renderLayout({id:'main',elements:[b]},f.root,{mode:'play',assetView:'art'});const n=f.root.children[0];assert.equal(n.querySelector('.sprite-region-image').getAttribute('viewBox'),'0 0 40 40');assert.equal(n.style['--skin-source'],url(image('original').src));
});

test('direct undefined callback restores the authored skin without waiting for layout reconciliation',()=>{
 const f=fixture(),b=button(),before=JSON.stringify(b),screen={id:'main',elements:[b]};f.scope.renderLayout(screen,f.root,{mode:'play',assetView:'art'});const n=f.root.children[0];
 f.renderGraphic(n,b,b.buttonState.images.pressed);assertSkin(n,b.buttonState.images.pressed.src,'3');
 f.renderGraphic(n,b,undefined);assert.equal(n.style['--skin-source'],url(image('original').src));assert.equal(n.style['--skin-highlighted-source'],url(image('old-hover').src));assert.equal(!!n.querySelector('.image-content'),false);assert.equal(JSON.stringify(b),before);
});
test('state texture uses sourceSize, authored normal dimensions or built-in dimensions and keeps assetRef scoped',()=>{
 const f=fixture(),b=button();f.scope.renderLayout({id:'main',elements:[b]},f.root,{mode:'play',assetView:'art',workspaceId:'monopoly-go'});const n=f.root.children[0];
 const check=(state,w,h)=>{f.renderGraphic(n,b,state);const skin=f.skinCalls.at(-1);assert.equal(skin.textures.normal.w,w);assert.equal(skin.textures.normal.h,h);};
 check(image('wide',[200,90]),200,90);check(image('fallback',null),180,80);
 const original=b.skin.textures;delete b.skin.textures;check(image('built-in',null),96,48);b.skin.textures=original;
 const assetRef='sha256-'+'a'.repeat(64)+'.webp';check({src:'',assetRef,alt:'Scoped',fit:'fill',sourceSize:[200,90]},200,90);assert.equal(n.style['--skin-source'],'url("/api/ux-studio/asset?ref='+assetRef+'&workspace=monopoly-go")');
});

test('switching from a sliced state to a region restores the authored frame behind the raw crop',()=>{
 const f=fixture(),b=button();b.buttonState.images.pressed={...image('sprite'),region:[0,0,40,40]};const screen={id:'main',elements:[b]},before=JSON.stringify(screen);f.scope.renderLayout(screen,f.root,{mode:'play',assetView:'art'});const n=f.root.children[0];
 f.fire(n,'pointerdown',{button:0,pointerId:7});assert.equal(n.querySelector('.sprite-region-image').getAttribute('viewBox'),'0 0 40 40');assert.equal(n.style['--skin-source'],url(image('original').src));assert.equal(JSON.stringify(screen),before);
});
