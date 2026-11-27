import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, readFile, writeFile, rm, symlink, readdir} from 'node:fs/promises';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {createPartsDemo} from '../../src/tools/uxStudio/parts.mjs';
import {saveDocument} from '../../src/tools/uxStudio/save-plugin.mjs';
const reference = await import('../../src/tools/uxStudio/asset-reference.mjs').catch(()=>({}));
const storeModule = await import('../../src/tools/uxStudio/asset-store.mjs').catch(()=>({}));
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aFOsAAAAASUVORK5CYII=', 'base64');
const ref = 'sha256-'+createHash('sha256').update(png).digest('hex')+'.png';
async function fixture(t) {
 const root=await mkdtemp(join(process.cwd(),'_작업/codex/ux-studio/asset-tests-'));
 t.after(()=>rm(root,{recursive:true,force:true}));
 const a=join(root,'a'),b=join(root,'b');await mkdir(a);await mkdir(b);
 return {root,a,b,store:storeModule.createAssetStore?.(root,a)};
}
test('asset references have no workspace/path and resolve only inside an explicit or valid current scope',()=>{
 assert.equal(typeof reference.assetUrl,'function');
 assert.equal(reference.assetUrl(ref,'ws-a'),'/api/ux-studio/asset?ref='+ref+'&workspace=ws-a');
 assert.equal(reference.assetUrl(ref,null),'/api/ux-studio/asset?ref='+ref);
 for(const bad of ['../image.png','/secret.png','https://host/img.png',ref.replace('.png','.svg')])assert.throws(()=>reference.assetUrl(bad,'ws-a'));
 assert.throws(()=>reference.assetUrl(ref,'../other'));
 assert.throws(()=>reference.currentAssetWorkspace({pathname:'/other',search:'?workspace=ws-a'}));
 assert.throws(()=>reference.currentAssetWorkspace({pathname:'/ui-studio/',search:'?workspace=../other'}));
 assert.throws(()=>reference.currentAssetWorkspace({pathname:'/ui-studio/',search:'?workspace=ws-a&workspace=ws-b'}));
 assert.equal(reference.currentAssetWorkspace({pathname:'/ui-studio/preview.html',search:'?workspace=ws-a'}),'ws-a');
 assert.equal(reference.assetSource({src:'data:image/png;base64,AAAA'},null),'data:image/png;base64,AAAA');
});
test('asset import persists immutable validated bytes, deduplicates and isolates selected storage',async t=>{
 assert.equal(typeof storeModule.createAssetStore,'function');const f=await fixture(t);
 const a=await f.store.put(png,'image/png');assert.equal(a.assetRef,ref);assert.deepEqual([a.width,a.height,a.bytes],[1,1,png.length]);
 assert.deepEqual(await f.store.put(png,'image/png'),a);
 assert.deepEqual((await f.store.list()).map(a=>a.assetRef),[ref]);assert.equal((await f.store.read(ref)).buffer.equals(png),true);
 assert.deepEqual(await readdir(f.a),[ref]);
 await assert.rejects(()=>storeModule.createAssetStore(f.root,f.b).read(ref),error=>error.status===404);
 assert.deepEqual(await readFile(join(f.a,ref)),png);
});
test('asset import and reads reject wrong media, invalid dimensions, traversal, symlinks and corrupt content',async t=>{
 assert.equal(typeof storeModule.createAssetStore,'function');const f=await fixture(t);
 await assert.rejects(()=>f.store.put(png,'image/jpeg'));
 await assert.rejects(()=>f.store.put(Buffer.alloc(300001),'image/png'));
 await assert.rejects(()=>f.store.put(png.subarray(0,24),'image/png'));
 const huge=Buffer.from(png);huge.writeUInt32BE(4097,16);await assert.rejects(()=>f.store.put(huge,'image/png'));
 await assert.rejects(()=>f.store.read('../outside.png'));
 await writeFile(join(f.b,ref),png);await symlink(join(f.b,ref),join(f.a,ref));await assert.rejects(()=>f.store.read(ref));
 await assert.rejects(()=>f.store.put(png,'image/png'));
 const linked=join(f.root,'linked');await symlink(f.b,linked);await assert.rejects(()=>storeModule.createAssetStore(f.root,linked).read(ref));
 await rm(join(f.a,ref));await writeFile(join(f.a,ref),Buffer.from('wrong'));await assert.rejects(()=>f.store.read(ref));
});
test('document save requires local asset presence and matching dimensions while keeping revision conflicts',async t=>{
 assert.equal(typeof storeModule.createAssetStore,'function');const f=await fixture(t);
 const designs=join(f.root,'workspace/designs'),assets=join(f.root,'workspace/assets');await mkdir(designs,{recursive:true});
 const d=createPartsDemo('assets-design'),image=d.screens[0].elements.find(e=>e.kind==='image');image.image={src:'',assetRef:ref,sourceSize:[1,1],alt:'stored pixel',fit:'contain'};
 await assert.rejects(()=>saveDocument(f.root,designs,d,null),/자원|이미지/);
 await storeModule.createAssetStore(f.root,assets).put(png,'image/png');const saved=await saveDocument(f.root,designs,d,null);assert.equal(saved.revision,1);assert.equal(saved.screens[0].elements.find(e=>e.id===image.id).image.assetRef,ref);
 await assert.rejects(()=>saveDocument(f.root,designs,d,null),error=>error.status===409);
 const wrong=structuredClone(saved);wrong.screens[0].elements.find(e=>e.id===image.id).image.sourceSize=[2,1];await assert.rejects(()=>saveDocument(f.root,designs,wrong,1),/크기/);
 assert.equal(JSON.parse(await readFile(join(designs,d.projectId+'.json'),'utf8')).revision,1);
});
const client=await import('../../src/tools/uxStudio/asset-client.mjs').catch(()=>({}));
test('cross-folder copy transfers each required hash within both scopes and refuses wrong responses',async()=>{
 assert.equal(typeof client.copyDocumentAssets,'function');
 const document=createPartsDemo('asset-copy'),image=document.screens[0].elements.find(e=>e.kind==='image');image.image={src:'',assetRef:ref,sourceSize:[1,1],alt:'pixel',fit:'contain'};
 document.screens[0].elements.find(e=>e.kind==='image'&&e!==image).image=structuredClone(image.image);
 const before=JSON.stringify(document),calls=[];
 const fetcher=async(url,options={})=>{calls.push([url,options]);return options.method==='POST'?{ok:true,json:async()=>({asset:{assetRef:ref,mime:'image/png',width:1,height:1,bytes:png.length}})}:{ok:true,blob:async()=>new Blob([png],{type:'image/png'})};};
 await client.copyDocumentAssets(document,'ws-source','ws-target',fetcher);
 assert.equal(calls.length,2);assert.match(calls[0][0],/workspace=ws-source/);assert.match(calls[1][0],/workspace=ws-target/);assert.equal(calls[1][1].headers['Content-Type'],'image/png');assert.equal(JSON.stringify(document),before);
 await assert.rejects(()=>client.copyDocumentAssets(document,'ws-source','ws-target',async(_url,options={})=>options.method==='POST'?{ok:true,json:async()=>({asset:{assetRef:ref.replace('.png','.jpg'),mime:'image/png',width:1,height:1,bytes:png.length}})}:{ok:true,blob:async()=>new Blob([png],{type:'image/png'})}),/참조|해시/);
 let wrote=false;await assert.rejects(()=>client.copyDocumentAssets(document,'ws-source','ws-target',async(_url,options={})=>{if(options.method==='POST')wrote=true;return {ok:false,json:async()=>({error:'missing source'})};}),/missing source/);assert.equal(wrote,false);
});
import uxSavePlugin from '../../src/tools/uxStudio/save-plugin.mjs';
async function apiFixture(t) {
 const f=await fixture(t),gameA=join(f.root,'game-a'),gameB=join(f.root,'game-b');await mkdir(gameA);await mkdir(gameB);
 const choices=[gameA,gameB];let handler;
 uxSavePlugin(process.cwd(),join(f.root,'cache/projects'),{chooseDirectory:async()=>choices.shift()}).configureServer({middlewares:{use(fn){handler=fn;}}});
 async function request(method,path,body={},mime='application/json',origin='http://127.0.0.1:7018') {
  let result;const headers={};
  await handler({method,url:'/api/ux-studio/'+path,headers:{host:'127.0.0.1:7018',origin,'content-type':mime},async *[Symbol.asyncIterator](){yield Buffer.isBuffer(body)?body:Buffer.from(JSON.stringify(body));}},
   {statusCode:0,setHeader(k,v){headers[k]=v;},end(value){result={status:this.statusCode,headers,body:headers['Content-Type']?.startsWith('application/json')?JSON.parse(value):value};}},()=>assert.fail('unexpected next'));
  return result;
 }
 return {...f,gameA,gameB,request};
}
test('asset API authorizes selected workspace, requires same origin/type and persists across reopen without cross-folder fallback',async t=>{
 const f=await apiFixture(t),a=(await f.request('POST','workspace-select')).body.workspace,b=(await f.request('POST','workspace-select')).body.workspace;
 assert.equal((await f.request('POST','asset?workspace='+a.id,png,'image/png')).status,409);
 for(const workspace of [a,b])assert.equal((await f.request('POST','workspace-decision?workspace='+workspace.id,{decision:'independent'})).status,200);
 assert.equal((await f.request('POST','asset?workspace='+a.id,png,'image/png','https://other.test')).status,403);
 assert.equal((await f.request('POST','asset?workspace='+a.id,png,'image/jpeg')).status,400);
 assert.equal((await f.request('POST','asset?workspace='+a.id,Buffer.alloc(300001),'image/png')).status,413);
 const imported=await f.request('POST','asset?workspace='+a.id,png,'image/png');assert.equal(imported.status,200);assert.equal(imported.body.asset.assetRef,ref);
 const read=await f.request('GET','asset?workspace='+a.id+'&ref='+ref);assert.equal(read.status,200);assert.equal(read.headers['Content-Type'],'image/png');assert.equal(read.headers['X-Content-Type-Options'],'nosniff');assert.deepEqual(read.body,png);
 assert.equal((await f.request('GET','asset?workspace='+b.id+'&ref='+ref)).status,404);
 assert.deepEqual((await f.request('GET','assets?workspace='+b.id)).body.assets,[]);
 assert.equal((await f.request('GET','asset?workspace=unknown-workspace&ref='+ref)).status,404);
 assert.equal((await f.request('GET','asset?workspace='+a.id+'&ref=..%2Fsecret.png')).status,400);
 assert.equal((await f.request('GET','asset?workspace='+a.id+'&workspace='+b.id+'&ref='+ref)).status,400);
 assert.deepEqual((await f.request('GET','assets?workspace='+a.id)).body.assets,[imported.body.asset]);
 const reopened=storeModule.createAssetStore(f.gameA,join(f.gameA,'ui-studio/assets'));assert.deepEqual((await reopened.read(ref)).buffer,png);
});
import vm from 'node:vm';
import {readImageFile,validateParts} from '../../src/tools/uxStudio/parts.mjs';
import {validateDocument} from '../../src/tools/uxStudio/model.mjs';
import {createSkin,validateSkin,applySkin,SKIN_ASSETS} from '../../src/tools/uxStudio/skins.mjs';
test('legacy sources remain unchanged and references reject mixed sources or path-bound refs',()=>{
 const image={src:'',assetRef:ref,sourceSize:[1,1],alt:'pixel',fit:'contain'};
 validateParts({kind:'image',image});validateParts({kind:'image',image:{...image,region:[0,0,1,1]}});
 for(const change of [{src:'data:image/png;base64,AAAA'},{asset:'icon'},{assetRef:'ws-source/'+ref},{sourceSize:undefined}])assert.throws(()=>validateParts({kind:'image',image:{...image,...change}}));
 const skin=createSkin('button');skin.slices=[0,0,0,0];skin.textures={normal:{src:'',assetRef:ref,w:1,h:1}};validateSkin(skin);
 skin.textures.normal.assetRef='../'+ref;assert.throws(()=>validateSkin(skin));
});
test('real image-import handler stores uploaded reference and cancels applying a late upload to a different document',async()=>{
 const source=await readFile('src/tools/uxStudio/main.mjs','utf8'),start=source.indexOf("    if ((input.matches('[data-image-file]')"),code=source.slice(start,source.indexOf("    if (input.matches('[data-part-field]'))",start));
 for(const switchDuringUpload of [false,true]) {
  const document=createPartsDemo('asset-import'),image=document.screens[0].elements.find(e=>e.kind==='image'),file=new Blob([png],{type:'image/png'}),input={files:[file],matches:selector=>selector==='[data-image-file]'};
  const uploads=[],notices=[],context={doc:document,selectedScreen:document.screens[0].id,selectedElement:image.id,workspaceId:'ws-import',workspaceAssets:[],input,readImageFile,clone:structuredClone,validateDocument,TextEncoder,undo:[],redo:[],dirty:false,
   screenById:(d,id)=>d.screens.find(screen=>screen.id===id),pushSnapshot:(undo,before)=>undo.push(before),render(){},notify:message=>notices.push(message),Image:class{naturalWidth=1;naturalHeight=1;async decode(){}},
   uploadImageAsset:async(file,workspace)=>{uploads.push({file,workspace});if(switchDuringUpload)context.doc=createPartsDemo('replacement');return {assetRef:ref,width:1,height:1,mime:'image/png',bytes:png.length};}};
  vm.createContext(context);vm.runInContext('async function importImage(){'+code+'}',context);await context.importImage();
  assert.equal(uploads.length,1);assert.equal(uploads[0].workspace,'ws-import');
  if(switchDuringUpload) {assert.equal(context.doc.projectId,'replacement');assert.equal(image.image.assetRef,undefined);assert.equal(context.undo.length,0);assert.match(notices[0],/설계가 바뀌어/);}
  else {assert.equal(image.image.assetRef,ref);assert.equal(image.image.src,'');assert.deepEqual(Array.from(image.image.sourceSize),[1,1]);assert.equal(context.dirty,true);assert.equal(context.undo.length,1);}
 }
});
class TestNode {
 constructor(tag='div') {this.tagName=tag.toUpperCase();this.children=[];this.dataset={};this.style={};this.events={};this.attributes={};this.className='';this.classList={add:name=>{this.className+=' '+name;},toggle:(name,value)=>{if(value)this.className+=' '+name;},contains:name=>this.className.split(' ').includes(name)};}
 append(...nodes){for(const node of nodes){node.parent=this;this.children.push(node);}}
 querySelector(selector){const name=selector.split('.').pop();return this.children.find(node=>node.classList?.contains(name))||null;}
 setAttribute(name,value){this.attributes[name]=value;}
 addEventListener(name,callback){this.events[name]=callback;}
 remove(){if(this.parent)this.parent.children=this.parent.children.filter(child=>child!==this);}
}
test('image and cropped-image renderer scope URLs and display an actual missing-file error',async()=>{
 const source=await readFile('src/tools/uxStudio/layout-view.mjs','utf8'),code=source.slice(source.indexOf('function renderImagePart('));
 const document={createElement:tag=>new TestNode(tag),createElementNS:(_ns,tag)=>new TestNode(tag),createTextNode:text=>({textContent:text})};
 const context={document,assetSource:reference.assetSource,SKIN_ASSETS,NS:'svg'};vm.createContext(context);vm.runInContext(code,context);
 for(const cropped of [false,true]) {
  const node=new TestNode(),image={src:'',assetRef:ref,sourceSize:[1,1],alt:'missing pixel',fit:'contain',...(cropped?{region:[0,0,1,1]}:{})};
  context.renderImagePart(node,{name:'Image',kind:'image',image},'art',false,'ws-render');
  const box=node.children[0],media=cropped?box.children[0].children[0]:box.children[0];
  assert.equal(cropped?media.attributes.href:media.src,reference.assetUrl(ref,'ws-render'));
  media.events.error();assert.equal(box.classList.contains('image-missing'),true);assert.match(box.children.at(-1).textContent,/이미지 오류/);
 }
});

// Tiny codec-generated fixtures are embedded; test execution needs only Node.
const encodedMedia={"jpeg": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAACAAMDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDx6iiiuw5D/9k=", "webp": "UklGRjAAAABXRUJQVlA4ICQAAABQAQCdASoDAAIAAUAmJQBOgCgAAP77GcuR2EN2HLri5shvAAA=", "webp-lossless": "UklGRh4AAABXRUJQVlA4TBEAAAAvAkAAAAfQkT70pv+BiOh/AAA="};
test('JPEG and both static WebP encodings preserve validated dimensions and detect a mismatched MIME',async t=>{
 const f=await fixture(t);
 for(const [name,encoded] of Object.entries(encodedMedia)) {
  const buffer=Buffer.from(encoded,'base64'),mime=name==='jpeg'?'image/jpeg':'image/webp';
  const asset=await f.store.put(buffer,mime);assert.deepEqual([asset.width,asset.height],[3,2]);assert.equal((await f.store.read(asset.assetRef)).buffer.equals(buffer),true);
  await assert.rejects(()=>f.store.put(buffer,'image/png'));
 }
});
test('skin references use the same selected workspace and show missing errors without leaving stale notices',()=>{
 const previousImage=globalThis.Image,previousDocument=globalThis.document,probes=[];
 try {
  globalThis.document={createElement:tag=>new TestNode(tag)};
  globalThis.Image=class{constructor(){probes.push(this);}};
  const node=new TestNode(),properties=new Map();node.style.setProperty=(key,value)=>properties.set(key,value);
  const skin=createSkin('button');skin.slices=[0,0,0,0];skin.textures={normal:{src:'',assetRef:ref,w:1,h:1}};
  applySkin(node,skin,{workspaceId:'ws-skin'});assert.equal(probes.length,1);assert.match(properties.get('--skin-source'),/workspace=ws-skin/);
  probes[0].onerror();assert.match(node.querySelector(':scope > .skin-image-error').textContent,/프레임 이미지 오류/);
  applySkin(node,undefined,{workspaceId:'ws-skin'});assert.equal(node.querySelector(':scope > .skin-image-error'),null);
  probes[0].onerror();assert.equal(node.querySelector(':scope > .skin-image-error'),null);
 } finally {if(previousImage===undefined)delete globalThis.Image;else globalThis.Image=previousImage;if(previousDocument===undefined)delete globalThis.document;else globalThis.document=previousDocument;}
});
test('design-copy callback transfers assets before publishing and never publishes when a source resource is missing',async t=>{
 const f=await apiFixture(t),a=(await f.request('POST','workspace-select')).body.workspace,b=(await f.request('POST','workspace-select')).body.workspace;
 for(const workspace of [a,b])await f.request('POST','workspace-decision?workspace='+workspace.id,{decision:'independent'});
 await f.request('POST','asset?workspace='+a.id,png,'image/png');
 const source=await readFile('src/tools/uxStudio/main.mjs','utf8'),code=source.slice(source.indexOf('async function copyDesignToWorkspace('),source.indexOf('function showProjectManager()'));
 const document=createPartsDemo('copy-source'),image=document.screens[0].elements.find(e=>e.kind==='image');image.image={src:'',assetRef:ref,sourceSize:[1,1],alt:'source pixel',fit:'contain'};
 const original=JSON.stringify(document),fetcher=async(url,options={})=>{
  const body=options.body instanceof Blob?Buffer.from(await options.body.arrayBuffer()):{};
  const result=await f.request(options.method||'GET',url.replace('/api/ux-studio/',''),body,options.headers?.['Content-Type']);
  return {ok:result.status===200,json:async()=>result.body,blob:async()=>new Blob([result.body],{type:result.headers['Content-Type']})};
 };
 let sequence=0,documentWrites=0;
 const context={doc:document,workspaceId:a.id,clone:structuredClone,validateDocument,crypto:{randomUUID:()=>++sequence===1?'12345678-rest':'23456789-rest'},copyDocumentAssets:(d,from,to)=>client.copyDocumentAssets(d,from,to,fetcher),api:async(path,options,workspace)=>{
  documentWrites++;const result=await f.request('POST',path+'?workspace='+workspace,JSON.parse(options.body));if(result.status!==200)throw Error(result.body.error);return result.body;
 }};
 vm.createContext(context);vm.runInContext(code,context);
 const saved=await context.copyDesignToWorkspace(b.id);assert.equal(saved.revision,1);assert.equal(documentWrites,1);assert.equal(JSON.stringify(document),original);
 assert.equal((await f.request('GET','asset?workspace='+b.id+'&ref='+ref)).status,200);
 await rm(join(f.gameA,'ui-studio/assets',ref));
 await assert.rejects(()=>context.copyDesignToWorkspace(b.id),/이미지 자원 파일/);assert.equal(documentWrites,1);assert.equal(JSON.stringify(document),original);
 assert.equal((await f.request('GET','projects?workspace='+b.id)).body.projects.length,1);
});
