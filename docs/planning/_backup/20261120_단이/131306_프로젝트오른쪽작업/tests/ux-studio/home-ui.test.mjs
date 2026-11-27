import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {overviewURL} from '../../src/tools/uxStudio/overview-layout.mjs';

class Element extends EventTarget {
 constructor(tag, document) {super();this.tagName=tag.toUpperCase();this.ownerDocument=document;this.children=[];this.dataset={};this.attributes={};this.className='';this.textContent='';this.disabled=false;}
 append(...children) {this.children.push(...children);for(const child of children)child.parentElement=this;}
 replaceChildren(...children) {this.children=[];this.append(...children);}
 setAttribute(key,value) {this.attributes[key]=String(value);}
 getAttribute(key) {return this.attributes[key]??null;}
 focus() {this.ownerDocument.activeElement=this;}
 scrollIntoView() {this.scrolled=true;}
}
const all = element => [element,...element.children.flatMap(all)];
const text = element => element.textContent+' '+element.children.map(text).join(' ');
const has = (element,label) => all(element).find(node=>node.textContent===label);
const entry = (id,designs=[]) => ({workspace:{id,name:id,directory:'/fixtures/'+id,conversionDecision:'independent'},title:id,designs,error:null});
async function shell(catalog) {
 const page={createElement:tag=>new Element(tag,page)};page.body=new Element('body',page);
 const view={location:{href:'http://localhost/ui-studio/'},fetch(){},};
 const calls=[];
 const state={catalog};
 globalThis.__homeTestDeps={
  readHomeCatalog:async()=>{if(state.error)throw Error(state.error);return state.catalog;},
  openWorkspaceURL:item=>overviewURL(item.designs.length?'overview':'detail',{workspaceId:item.workspace.id,projectId:item.designs[0]?.id}),
  copySampleToWorkspace:async(item,id)=>{calls.push(['copy',item.workspace.id,id]);return {document:{projectId:'new-copy'}};},
  openProjectManager:async options=>{calls.push(['manager',options]);},openManual:async()=>{calls.push(['guide']);},designURL:overviewURL
 };
 let source;try {source=await readFile(new URL('../../src/tools/uxStudio/home.mjs',import.meta.url),'utf8');} catch {source='';}
 source=source.replace(/^import[^\n]+;\n/gm,'');
 source='const {readHomeCatalog,openWorkspaceURL,copySampleToWorkspace,openProjectManager,openManual,designURL}=globalThis.__homeTestDeps;\n'+source;
 const module=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64')+'#'+Math.random());
 assert.equal(typeof module.mountHome,'function','mountHome export must exist');
 const controller=module.mountHome(page,view);await controller.ready;
 return {page,view,calls,state,controller,nodes:()=>all(page.body)};
}

test('home keeps selected work and dynamic samples in separate sections with literal folder labels',async()=>{
 const work=entry('work-a',[{id:'design-a',name:'내 설계',revision:4}]);work.title='<img src=x onerror=alert(1)>';
 const sample=entry('sample-third',[{id:'example-a',name:'세 번째 예제',revision:8}]);
 const env=await shell({work:[work],samples:[sample],hidden:[]});
 const workHost=env.nodes().find(node=>node.attributes['data-home-work']!==undefined);
 const sampleHost=env.nodes().find(node=>node.attributes['data-home-samples']!==undefined);
 assert.match(text(workHost),/내 설계 · r4/);assert.match(text(workHost),/저장 설계 1개/);
 assert.match(text(workHost),/<img src=x onerror=alert\(1\)>/);assert.doesNotMatch(text(sampleHost),/내 설계/);
 assert.match(text(sampleHost),/sample-third/);assert.match(text(sampleHost),/참고용 · 제작 중/);
 assert.equal(env.nodes().filter(node=>node.tagName==='IMG').length,0);
 const open=has(sampleHost,'샘플 보기');const target=new URL(open.href,'http://localhost');assert.equal(target.pathname,'/ui-studio/canvas.html');assert.equal(target.searchParams.get('workspace'),'sample-third');assert.equal(target.searchParams.get('project'),'example-a');
});

test('empty work remains normal while a sample without a saved design cannot open or copy',async()=>{
 const env=await shell({work:[],samples:[entry('new-sample')],hidden:[]});
 assert.match(text(env.page.body),/아직 내 작업이 없어요/);assert.ok(has(env.page.body,'폴더 선택하기'));
 const sampleHost=env.nodes().find(node=>node.attributes['data-home-samples']!==undefined);
 assert.equal(has(sampleHost,'샘플 보기').disabled,true);assert.equal(has(sampleHost,'사본으로 제작').disabled,true);
 assert.match(text(sampleHost),/저장한 설계가 아직 없습니다/);
});

test('retry recovers the catalog and sample copy goes to a selected work folder',async()=>{
 const sample=entry('sample-a',[{id:'sample-design',name:'샘플 설계',revision:2}]);
 const env=await shell({work:[],samples:[sample],hidden:[]});env.state.error='목록 오류';await env.controller.refresh();
 assert.match(text(env.page.body),/목록 오류/);env.state.error=null;await env.controller.refresh();
 await has(env.page.body,'사본으로 제작').onclick();
 const options=env.calls.find(call=>call[0]==='manager')[1];assert.equal(options.workOnly,true);assert.equal(options.copyOnly,true);
 const copied=await options.copyToWorkspace('my-folder');assert.deepEqual(env.calls.at(-1),['copy','sample-a','my-folder']);
 assert.equal(env.view.location.href,'http://localhost/ui-studio/');await options.navigate('my-folder',copied,{isActive:()=>true});
 assert.match(env.view.location.href,/editor=detail/);assert.match(env.view.location.href,/workspace=my-folder/);assert.match(env.view.location.href,/project=new-copy/);
});

test('new creation always opens work folder selection and pending work keeps its decision step',async()=>{
 const pending=entry('pending-folder',[{id:'first',name:'첫 설계',revision:1}]);pending.workspace.conversionDecision='pending';
 const env=await shell({work:[pending],samples:[],hidden:[]});await env.nodes().find(node=>node.attributes['data-home-create']!==undefined).onclick();
 let options=env.calls.at(-1)[1];assert.equal(options.workOnly,true);env.state.catalog={work:[pending,entry('new-folder')],samples:[],hidden:[]};await options.navigate('new-folder');
 assert.match(env.view.location.href,/editor=detail/);assert.match(env.view.location.href,/workspace=new-folder/);
 await has(env.page.body,'이어서 편집').onclick();options=env.calls.at(-1)[1];assert.equal(options.workOnly,true);
 assert.equal(options.workspaceId,undefined);assert.equal(options.copyOnly,undefined);
});

test('work with multiple designs exposes a choice on the project card',async()=>{
 const project=entry('work-a',[{id:'hud',name:'HUD',revision:7},{id:'photocard',name:'포토카드',revision:2}]);
 project.title='케이팝몬스터즈';
 const env=await shell({work:[project],samples:[],hidden:[]});
 const picker=env.nodes().find(node=>node.className==='home-design-picker');
 assert.equal(picker.tagName,'DETAILS');
 assert.equal(picker.children[0].tagName,'SUMMARY');
 assert.ok(has(picker.children[0],'케이팝몬스터즈'));
 assert.equal(new URL(has(picker,'HUD · r7').href,'http://localhost').searchParams.get('project'),'hud');
 const photo=new URL(has(picker,'포토카드 · r2').href,'http://localhost');
 assert.equal(photo.searchParams.get('workspace'),'work-a');
 assert.equal(photo.searchParams.get('project'),'photocard');
 assert.equal(has(env.page.body,'이어서 편집'),undefined);
});

test('a configured work menu shows only active work names and hides older designs',async()=>{
 const work=entry('work-a',[{id:'old-hud',name:'이전 HUD',revision:1},{id:'hud',name:'최근 HUD',revision:7},{id:'pc',name:'최근 포토카드',revision:2}]);
 work.workMenu=[{...work.designs[1],label:'HUD'},{...work.designs[2],label:'포토카드'}];
 const env=await shell({work:[work],samples:[],hidden:[]});
 assert.ok(has(env.page.body,'HUD'));assert.ok(has(env.page.body,'포토카드'));
 assert.ok(has(env.page.body,'현재 작업 2개'));
 assert.equal(has(env.page.body,'이전 HUD · r1'),undefined);
});
