import {PRESENTATION_MODES,normalizePresentationMode,presentationScreen,renderPresentation} from './presentation.mjs';
import {applySkin} from './skins.mjs';
import {validateDocument,clone,createRuntime} from './model.mjs';
import {attachControls,updateControlValue} from './controls.mjs';
import {disposeButtonStates} from './button-state.mjs';
import {disposeScrollPins} from './scroll-pin.mjs';
import {scopeURL} from './project-manager.mjs';
import {projectContext} from './project-context.mjs';
import {validateAssetWorkspace} from './asset-reference.mjs';
import {overlayRootSize} from './overlay-runtime.mjs';
import {overviewURL} from './overview-layout.mjs';

export function sampleSize(design,screen){
 const size=screen.logicalSize||design.designBasis?.logicalSize||{w:390,h:844};
 return {w:size.w??size.width??390,h:size.h??size.height??844};
}
export function applyScreenSkin(node,screen,{workspaceId=null,presentationMode='ui'}={}){
 const shown=presentationScreen(screen,normalizePresentationMode(presentationMode));
 applySkin(node,shown.presentation?.rootMode==='fullscreen'?undefined:shown.skin,{view:'art',workspaceId});
}
/** A screen board never mounts the entry page, overlay backdrop or game actions. */
export function mountSampleScreen(root,initialDesign,{screenId,workspaceId=null,presentationMode='ui'}={}){
 validateAssetWorkspace(workspaceId);
 let design=clone(validateDocument(initialDesign)),selected=screenId||design.entryScreen,runtime=createRuntime(design),board,panel;
 let currentPresentation=normalizePresentationMode(presentationMode);
 const getScreen=()=>design.screens.find(screen=>screen.id===selected);
 const release=()=>{if(panel){disposeButtonStates(panel);disposeScrollPins(panel);}};
 function paint(reset=false){
  const screen=getScreen();
  if(!screen)throw Error('선택한 화면을 찾지 못했습니다.');
  const windowed=screen.kind!=='page'&&screen.presentation?.rootMode!=='fullscreen';
  if(reset||!board||windowed!==(panel!==board)){
   release();board=root.ownerDocument.createElement('div');board.className='preview-screen sample-screen';root.replaceChildren(board);
   panel=board;
   if(windowed){panel=root.ownerDocument.createElement('div');panel.className='sample-panel';board.append(panel);}
  }
  const size=sampleSize(design,screen);
  board.dataset.screen=screen.id;board.style.width=size.w+'px';board.style.height=size.h+'px';
  if(windowed){const inner=overlayRootSize(screen,size);Object.assign(panel.style,{width:inner.w+'px',height:inner.h+'px',left:(size.w-inner.w)/2+'px',top:(size.h-inner.h)/2+'px'});}
  applyScreenSkin(panel,screen,{workspaceId,presentationMode:currentPresentation});
  renderPresentation(screen,panel,{presentationMode:currentPresentation,mode:'view',assetView:'art',workspaceId,transitions:design.transitions,runtime});
  if(currentPresentation!=='wireframe')attachControls(panel,screen,runtime,{mode:'view',workspaceId,onChange:change=>{runtime={...runtime,...updateControlValue(screen,runtime,screen.elements.find(element=>element.id===change.element),change.value,change.event)};paint();return runtime;}});
 }
 paint(true);
 return {
  select(id){if(!design.screens.some(screen=>screen.id===id))throw Error('선택한 화면을 찾지 못했습니다.');if(id!==selected){selected=id;runtime=createRuntime(design);paint(true);}},
  updateDesign(next){validateDocument(next);if(next.projectId!==design.projectId||next.revision<design.revision)throw Error('다른 설계 또는 오래된 버전입니다.');design=clone(next);const removed=!getScreen();if(removed)selected=design.entryScreen;paint(removed);},
  getScreen:()=>clone(getScreen()),getDesign:()=>clone(design),
  getPresentation:()=>currentPresentation,
  setPresentation(value){const next=normalizePresentationMode(value);if(next!==currentPresentation){currentPresentation=next;paint(true);}},
  dispose(){release();root.replaceChildren();}
 };
}

export function parseSampleURL(href){
 const url=new URL(href),params=url.searchParams;
 for(const key of ['workspace','project','screen','view'])if(params.getAll(key).length>1)throw Error('주소의 선택 정보가 중복되었습니다.');
 const projectId=params.get('project'),workspaceId=params.get('workspace');
 if(!/^[a-z][a-z0-9-]{0,47}$/.test(projectId||''))throw Error('설계 ID를 확인하세요.');
 validateAssetWorkspace(workspaceId);
 const result={projectId,workspaceId,screenId:params.get('screen')||null};
 if(params.has('view')){const value=params.get('view');if(!PRESENTATION_MODES.some(mode=>mode.id===value))throw Error('표현 모드를 확인하세요.');result.presentationMode=value;}
 return result;
}
export async function readSampleDesign({projectId,workspaceId},fetcher=fetch){
 const response=await fetcher(scopeURL('/api/ux-studio/project?id='+encodeURIComponent(projectId),workspaceId),{cache:'no-store'});
 if(!response.ok)throw Error(response.status===404?'저장한 설계를 찾지 못했습니다.':'저장한 설계를 읽지 못했습니다.');
 const {document:design}=await response.json();validateDocument(design);
 if(design.projectId!==projectId)throw Error('선택한 설계 정보가 일치하지 않습니다.');
 let workspace=null;
 if(workspaceId){const meta=await fetcher(scopeURL('/api/ux-studio/workspace',workspaceId),{cache:'no-store'});if(!meta.ok)throw Error('프로젝트 폴더 정보를 읽지 못했습니다.');workspace=(await meta.json()).workspace;}
 return {design,context:projectContext({workspaceId,workspace,document:design})};
}
export function sampleFit(size,width,height){return Math.max(.001,Math.min(1,Math.max(1,width-24)/size.w,Math.max(1,height-24)/size.h));}

export function mountSamplePage(page=document,view=window){
 const q=id=>page.querySelector(id),host=q('#sample-board'),viewport=q('#sample-viewport'),stage=q('#sample-stage'),status=q('#sample-status'),select=q('#sample-select');
 const presentationPicker=q('#sample-presentation'),overviewLink=q('#sample-overview');
 if(overviewLink)overviewLink.hidden=true;
 let identity,viewer,loading=false,queued=false,requestedRevision=0,disposed=false,channel;
 try{identity=parseSampleURL(view.location.href);}catch(error){status.textContent=error.message;return {dispose(){}};}
 function fit(){if(!viewer)return;const size=sampleSize(viewer.getDesign(),viewer.getScreen()),scale=sampleFit(size,viewport.clientWidth,viewport.clientHeight);host.style.width=size.w+'px';host.style.height=size.h+'px';host.style.transform='scale('+scale+')';stage.style.width=size.w*scale+'px';stage.style.height=size.h*scale+'px';}
 function sync(){
  const design=viewer.getDesign(),screen=viewer.getScreen(),size=sampleSize(design,screen),index=design.screens.findIndex(s=>s.id===screen.id);
  select.replaceChildren(...design.screens.map((s,i)=>{const option=page.createElement('option');option.value=s.id;option.textContent=(i+1)+'. '+s.name;return option;}));select.value=screen.id;
  status.textContent=design.name+' · r'+design.revision+' · '+(index+1)+' / '+design.screens.length;
  q('#sample-screen-info').textContent=screen.name+' · '+(screen.kind==='page'?'페이지':screen.kind==='modal'?'모달':screen.kind)+' · '+size.w+' × '+size.h+' · 단독 샘플';
  if(overviewLink){overviewLink.href=overviewURL('overview',{workspaceId:identity.workspaceId,projectId:design.projectId,screenId:screen.id,presentationMode:viewer.getPresentation()});overviewLink.hidden=false;}
  q('#sample-previous').disabled=index===0;q('#sample-next').disabled=index===design.screens.length-1;select.disabled=false;
  const url=new URL(view.location.href);url.searchParams.set('screen',screen.id);url.searchParams.set('view',viewer.getPresentation());view.history.replaceState(null,'',url);if(presentationPicker)presentationPicker.value=viewer.getPresentation();fit();
 }
 function choose(id){if(!viewer)return;viewer.select(id);sync();view.scrollTo({left:0,top:0,behavior:'instant'});}
 async function load(){
  if(loading){queued=true;return;}loading=true;
  try{const {design,context}=await readSampleDesign(identity,view.fetch.bind(view));if(disposed)return;
   if(viewer)viewer.updateDesign(design);else viewer=mountSampleScreen(host,design,{screenId:identity.screenId,workspaceId:identity.workspaceId,presentationMode:identity.presentationMode});
   q('#sample-project').textContent=context.label+' · '+context.name+' · '+context.directory;
   requestedRevision=Math.max(requestedRevision,design.revision);sync();
  }catch(error){status.textContent=error.message;}
  finally{loading=false;if(queued&&!disposed){queued=false;load();}}
 }
 select.onchange=()=>choose(select.value);q('#sample-refresh').onclick=load;
 if(presentationPicker)presentationPicker.onchange=()=>{if(viewer){viewer.setPresentation(presentationPicker.value);sync();}};
 for(const [id,delta]of [['#sample-previous',-1],['#sample-next',1]])q(id).onclick=()=>{if(!viewer)return;const d=viewer.getDesign(),index=d.screens.findIndex(s=>s.id===viewer.getScreen().id);if(d.screens[index+delta])choose(d.screens[index+delta].id);};
 const resize=typeof view.ResizeObserver==='function'?new view.ResizeObserver(fit):null;resize?.observe(viewport);view.addEventListener('resize',fit);
 if(typeof view.BroadcastChannel==='function'){channel=new view.BroadcastChannel('ux-studio-design');channel.onmessage=event=>{const data=event.data;if(data?.type==='design.saved'&&(data.workspace||null)===identity.workspaceId&&data.projectId===identity.projectId&&Number.isSafeInteger(data.revision)&&data.revision>requestedRevision){requestedRevision=data.revision;load();}};}
 const onPageHide=event=>{if(!event.persisted)dispose();};
 const onPageShow=event=>{if(event.persisted){fit();load();}};
 const dispose=()=>{disposed=true;resize?.disconnect();channel?.close();viewer?.dispose();view.removeEventListener('resize',fit);view.removeEventListener('pagehide',onPageHide);view.removeEventListener('pageshow',onPageShow);};
 view.addEventListener('pagehide',onPageHide);view.addEventListener('pageshow',onPageShow);
 load();return {load,dispose};
}
if(typeof document!=='undefined'&&document.querySelector?.('#sample-board'))mountSamplePage();
