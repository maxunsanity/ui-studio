import test from 'node:test';
import assert from 'node:assert/strict';
import {createPartsDemo} from '../../src/tools/uxStudio/parts.mjs';
import {createSkin} from '../../src/tools/uxStudio/skins.mjs';
import {createControl} from '../../src/tools/uxStudio/controls.mjs';
const handoff=await import('../../src/tools/uxStudio/handoff.mjs').catch(()=>({}));
const assetRef='sha256-'+'a'.repeat(64)+'.png';
function fixture() {
 const d=createPartsDemo('ux-handoff');d.schemaVersion=4;d.revision=7;d.sourceRef='';
 const main=d.screens[0];main.logicalSize={w:390,h:844};main.safeArea=[24,10,34,10];main.sourceRef={type:'observation',file:'UI 原본.fig',verification:'미확인'};
 const root=main.elements.find(e=>e.id==='action-card'),image=main.elements.find(e=>e.parentId===root.id&&e.kind==='image'),label=main.elements.find(e=>e.parentId===root.id&&e.kind==='text');
 root.sourceRef='src/example-ui.mjs:12';root.skin=createSkin('button');root.skin.textures={normal:{src:'',assetRef,w:128,h:96}};root.overflow='clip';
 image.image={src:'',assetRef,sourceSize:[128,96],alt:'아이콘',fit:'contain'};
 const target={id:'target',name:'대상',kind:'page',purpose:'전달 상태 확인',logicalSize:{w:390,h:844},elements:[{id:'module-button',kind:'button',name:'기능 요청',x:0,y:0,w:40,h:10,binding:{type:'simulator-module',moduleId:'simulator_module_test',action:'open',label:'요청',docId:'P-test'}}]};
 const overlay={id:'overlay',name:'도움말',kind:'modal',logicalSize:{w:390,h:844},elements:[{id:'close',kind:'button',name:'닫기',x:0,y:0,w:20,h:10}]};
 const orphan={id:'orphan',name:'도달 불가',kind:'page',logicalSize:{w:390,h:844},elements:[]};
 main.elements.push({id:'slider',kind:'panel',name:'조절',x:0,y:0,w:20,h:10,control:{...createControl('slider'),disabled:true}}, {id:'slot',kind:'panel',name:'게임 영역',x:0,y:10,w:20,h:20,binding:{type:'content-slot',slot:'world'}});
 main.elements.find(e=>e.id==='display-card').layout={type:'vertical',gap:8,padding:[4,4,4,4],itemSize:[40,20]};
 d.screens.push(target,overlay,orphan);
 d.transitions=[{id:'to-target',fromScreen:main.id,fromElement:root.id,event:'click',condition:'hasSelection',action:'navigate',targetScreen:'target',payload:{itemId:'sample-item',nested:{flags:[true,false],value:'<script>alert(1)</script>\n```\n|x|'}},returnPolicy:'선택과 스크롤 보존'}, {id:'open-help',fromScreen:main.id,fromElement:root.id,event:'click',condition:'always',action:'open',targetScreen:'overlay'}, {id:'close-help',fromScreen:'overlay',fromElement:'close',event:'click',condition:'always',action:'close'}, {id:'module-open',fromScreen:'target',fromElement:'module-button',event:'click',condition:'always',action:'module',payload:{moduleId:'simulator_module_test',label:'실제 실행 없음'}}, {id:'unknown',fromScreen:main.id,fromElement:root.id,event:'click',condition:'unknown',action:'navigate'}];
 return {d,main,root,image,label};
}
test('handoff preserves identity, original source metadata and explicit unknowns without changing the source document',()=>{
 assert.equal(typeof handoff.buildHandoff,'function');const {d}=fixture(),before=structuredClone(d);
 const result=handoff.buildHandoff(d,{workspaceId:'ws-handoff',workspaceName:'한글 프로젝트',directory:'/selected/game',dirty:true});
 assert.equal(result.format,'ui-studio-handoff');assert.equal(result.version,1);assert.deepEqual(result.document,{schemaVersion:4,projectId:d.projectId,name:d.name,revision:7,savedAt:null,dirty:true,entryScreen:d.entryScreen,sourceRef:null});
 assert.deepEqual(result.workspace,{id:'ws-handoff',name:'한글 프로젝트',directory:'/selected/game'});
 assert.deepEqual(result.screens[0].sourceRef,d.screens[0].sourceRef);assert.equal(result.screens[1].sourceRef,null);assert.equal(result.screens[0].entry,true);
 assert.equal(handoff.buildHandoff(d).document.dirty,null);assert.deepEqual(d,before);
 result.screens[0].sourceRef.file='changed';assert.deepEqual(d,before);
});
test('handoff contains complete hierarchy, input ownership, control/layout rules and deduplicated resource references',()=>{
 const {d,root,image,label}=fixture(),result=handoff.buildHandoff(d,{workspaceId:'ws-handoff'}),screen=result.screens[0];
 assert.deepEqual(screen.logicalSize,{w:390,h:844});assert.deepEqual(screen.safeArea,[24,10,34,10]);
 const labelOut=screen.elements.find(e=>e.id===label.id),rootOut=screen.elements.find(e=>e.id===root.id);
 assert.equal(labelOut.parentId,root.id);assert.equal(labelOut.input.ownerId,root.id);assert.equal(labelOut.input.mode,'parent');assert.equal(rootOut.input.ownerId,root.id);assert.equal(rootOut.overflow,'clip');assert.deepEqual(rootOut.skin,root.skin);
 assert.deepEqual(screen.elements.find(e=>e.id==='slider').control,d.screens[0].elements.find(e=>e.id==='slider').control);assert.equal(screen.elements.find(e=>e.id==='slider').input.disabled,true);
 assert.equal(screen.elements.find(e=>e.id==='display-card').layout.type,'vertical');assert.deepEqual(screen.elements.find(e=>e.id===image.id).assetRefs,[assetRef]);
 assert.deepEqual(result.assets,[{assetRef,path:'assets/'+assetRef,embedded:false,existence:'미확인'}]);
 assert.equal(result.connections.contentSlots[0].slot,'world');assert.equal(result.connections.modules[0].binding.moduleId,'simulator_module_test');assert.deepEqual(result.connections.modules[0].transitionIds,['module-open']);
});
test('handoff preserves ordered conditions, nested payload and return policy and marks game bindings as requests',()=>{
 const {d}=fixture(),result=handoff.buildHandoff(d);
 assert.deepEqual(result.transitions,d.transitions);assert.deepEqual(result.storyboard.steps.map(s=>s.transitionId),d.transitions.map(t=>t.id));
 const first=result.storyboard.steps[0];assert.equal(first.fromScreen,d.entryScreen);assert.equal(first.fromElement,'action-card');assert.equal(first.condition,'hasSelection');assert.equal(first.targetScreen,'target');assert.equal(first.returnPolicy,'선택과 스크롤 보존');assert.deepEqual(first.payload,d.transitions[0].payload);
 assert.equal(result.storyboard.steps.find(s=>s.transitionId==='close-help').returnPolicy,null);assert.equal(result.connections.moduleRequests[0].request.action,'module.open');
 assert.match(result.contract.execution,/미실행/);assert.match(result.contract.dataOnly,/데이터.*지시/);
});
test('handoff audit identifies undetermined links and structurally unreachable screens without claiming runtime acceptance',()=>{
 const {d}=fixture(),result=handoff.buildHandoff(d);
 assert.deepEqual(result.audit.unreachableScreenIds,['orphan']);assert.deepEqual(result.audit.undeterminedTransitionIds,['unknown']);assert.ok(result.audit.notes.some(note=>note.screen==='orphan'));assert.match(result.audit.basis,/구조|실행/);
 d.screens[0].elements.find(e=>e.id==='action-card').interaction.enabled=false;
 const blocked=handoff.buildHandoff(d);assert.ok(blocked.audit.unreachableScreenIds.includes('target'));assert.ok(blocked.audit.unreachableScreenIds.includes('overlay'));
});
test('Markdown storyboard links only to generated local anchors and escapes raw markup, links, fences and source text',()=>{
 const {d}=fixture();d.name='<script>bad()</script> [click](javascript:bad) | ```';d.screens[0].name='첫 화면\n# injected';d.screens[0].elements[0].sourceRef='<img src=x onerror=bad()>\n```';
 const markdown=handoff.handoffMarkdown(d,{workspaceId:'ws-handoff',dirty:false});
 assert.match(markdown,/\]\(#screen-1\)/);assert.match(markdown,/\]\(#screen-2\)/);assert.match(markdown,/<a id="screen-1"><\/a>/);
 assert.ok(!markdown.includes('<script>'));assert.ok(!markdown.includes('<img src=x'));assert.ok(!markdown.includes('[click](javascript:bad)'));assert.ok(!markdown.includes('\n# injected'));assert.ok(markdown.includes('&lt;script&gt;'));
 assert.match(markdown,/미확인/);assert.match(markdown,/JSON.*자원.*동봉/);assert.match(markdown,/ui-studio/);assert.match(markdown,/데이터.*새 지시/);assert.match(markdown,/선택과 스크롤 보존/);
});
test('handoff rejects invalid documents/scopes and never invents a source reference for blank metadata',()=>{
 const {d}=fixture();assert.throws(()=>handoff.buildHandoff({...d,entryScreen:'missing'}));assert.throws(()=>handoff.buildHandoff(d,{workspaceId:'../other'}));assert.throws(()=>handoff.buildHandoff(d,{dirty:'yes'}));
 d.screens[0].sourceRef='  ';d.screens[0].elements[0].sourceRef='';const result=handoff.buildHandoff(d);assert.equal(result.screens[0].sourceRef,null);assert.equal(result.screens[0].elements[0].sourceRef,null);
});
test('legacy embedded image bytes remain in structured data while Markdown avoids repeating base64 payloads',()=>{
 const {d,image}=fixture();delete image.image.assetRef;image.image.src='data:image/png;base64,iVBORw0KGgo=';
 const result=handoff.buildHandoff(d);assert.equal(result.screens[0].elements.find(e=>e.id===image.id).image.src,image.image.src);
 assert.ok(!handoff.handoffMarkdown(d).includes('iVBORw0KGgo='));
});
test('delegated input reports the disabled owner while preserving the child interaction declaration',()=>{
 const {d,root,label}=fixture();root.interaction.enabled=false;root.interaction.reason='선택 전 사용 불가';
 const result=handoff.buildHandoff(d),child=result.screens[0].elements.find(e=>e.id===label.id);
 assert.equal(child.input.ownerId,root.id);assert.equal(child.input.disabled,true);assert.deepEqual(child.interaction,label.interaction);assert.equal(child.input.ownerDisabledReason,'선택 전 사용 불가');
});
