import {previewFixtureScreen} from './bindings.mjs';
import {mountPlanningPanel,mountPlanningActions,readPlanningIndex} from './planning-panel.mjs';
import {scopeURL,scopedKey,openProjectManager} from './project-manager.mjs';
import {projectContext} from './project-context.mjs';
import {openManual} from './manual.mjs';
import {validateDocument} from './model.mjs';
import {applySkin} from './skins.mjs';
import {overlayRootSize} from './overlay-runtime.mjs';
import {disposeButtonStates} from './button-state.mjs';
import {disposeScrollPins} from './scroll-pin.mjs';
import {presentationModesFor,normalizePresentationMode,presentationScreen,renderPresentation} from './presentation.mjs';
import {parseOverviewURL,overviewURL,preferenceKey,cleanViewPreferences,screenSize,flowLayout,explicitEdges,restorePositions,boardExtent,visibleBoardIds,createOverviewRefresh} from './overview-layout.mjs';
import {reviewGrid,appendReviewMenus,reviewLayers} from './overview-review.mjs';
const NS='http://www.w3.org/2000/svg';
const kinds={page:'페이지',modal:'모달',sheet:'시트',toast:'토스트'};
const actions={navigate:'화면 이동',open:'팝업 열기',back:'뒤로 가기',close:'닫기',feedback:'알림',select:'선택',filter:'필터',purchase:'구매',module:'모듈'};

/** Read-only saved-design access. An explicit missing design never opens a different design. */
export async function readOverviewData(identity,fetcher=fetch,{preferredProjectId=null}={}) {
 overviewURL('overview',identity);
 const {workspaceId=null,projectId=null}=identity;
 const request=async path=>{
  const response=await fetcher(scopeURL('/api/ux-studio/'+path,workspaceId),{cache:'no-store'});
  if(!response.ok)throw Object.assign(Error(response.status===404?'저장한 설계를 찾지 못했습니다.':'프로젝트를 읽지 못했습니다 (HTTP '+response.status+').'),{status:response.status});
  return response.json();
 };
 const [catalogBody,workspaceBody]=await Promise.all([request('projects'),workspaceId?request('workspace'):null]);
 const catalog=catalogBody?.projects,workspace=workspaceBody?.workspace||null;
 if(!Array.isArray(catalog)||catalog.some(item=>!item||typeof item.name!=='string'||!Number.isSafeInteger(item.revision)||item.revision<0||! /^[a-z][a-z0-9-]{0,47}$/.test(item.id||''))||new Set(catalog.map(item=>item.id)).size!==catalog.length)throw Error('저장 설계 목록 형식을 확인하세요.');
 const context=projectContext({workspaceId,workspace});
 const selected=projectId||(catalog.some(item=>item.id===preferredProjectId)?preferredProjectId:catalog[0]?.id);
 if(!selected)return {catalog,design:null,workspace,context};
 if(!catalog.some(item=>item.id===selected))throw Object.assign(Error('저장한 설계를 찾지 못했습니다. 다른 저장 설계를 선택하세요.'),{status:404,catalog,context});
 const design=validateDocument((await request('project?id='+encodeURIComponent(selected))).document);
 if(design.projectId!==selected)throw Error('선택한 설계 정보가 일치하지 않습니다.');
 return {catalog,design,workspace,context:projectContext({workspaceId,workspace,document:design})};
}

export function mountOverview(page=document,view=window) {
 const q=id=>page.querySelector('#'+id),host=q('overview'),viewport=q('overview-viewport'),stage=q('overview-stage'),layer=q('overview-layer'),svg=q('overview-edges'),status=q('overview-status');
 let identity;
 try{identity=parseOverviewURL(view.location.href);}catch(error){status.textContent=error.message;q('overview-empty').textContent=error.message;return {refresh:async()=>{},snapshot:()=>({error:error.message}),dispose(){}};}
 let review=null,design=null,selected=null,layout='grid',presentationMode='ui',zoom=1,positions=[],disposed=false,frame=null,saveTimer=null,channel=null,drag=null,suppressClick=false,requestedRevision=-1,initialized=false,autoFit=true,fitEntire=false,visible=[];
 const boards=new Map(),rows=new Map();
 const scheduleFrame=view.requestAnimationFrame?.bind(view)|| (callback=>view.setTimeout(callback,16));
 const cancelFrame=view.cancelAnimationFrame?.bind(view)||view.clearTimeout.bind(view);
 const readJSON=key=>{try{return JSON.parse(view.localStorage.getItem(key)||'null');}catch{return null;}};
 const writeJSON=(key,value)=>{try{view.localStorage.setItem(key,JSON.stringify(value));}catch{}};
 const viewKey=()=>preferenceKey(identity,layout);
 const currentView=()=>({zoom,left:viewport.scrollLeft,top:viewport.scrollTop,selected,positions:layout==='flow'?positions.map(({id,x,y})=>({id,x,y})):[]});
 function saveView(){if(!design||disposed)return;writeJSON(viewKey(),currentView());writeJSON(preferenceKey(identity),{layout,presentationMode});}
 function saveSoon(){if(saveTimer!==null)view.clearTimeout(saveTimer);saveTimer=view.setTimeout(()=>{saveTimer=null;saveView();},160);}
 const viewportState=()=>({left:viewport.scrollLeft,top:viewport.scrollTop,width:viewport.clientWidth,height:viewport.clientHeight,zoom});
 function metrics(){
  host.dataset.totalBoards=String(positions.length);host.dataset.mountedBoards=String([...boards.values()].filter(b=>b.panel).length);host.dataset.visibleBoards=String(visible.length);
  host.dataset.renderedElements=String([...boards.values()].reduce((count,b)=>count+(b.panel?b.panel.querySelectorAll('.ui-element').length:0),0));
  host.dataset.layout=layout;host.dataset.presentation=presentationMode;
 }
 function release(board){if(!board.panel)return;disposeButtonStates(board.panel);disposeScrollPins(board.panel);board.content.replaceChildren();board.panel=null;board.node.dataset.mounted='false';}
 function clearBoards(){finishDrag(true);for(const board of boards.values())release(board);boards.clear();rows.clear();layer.replaceChildren();svg.replaceChildren();q('overview-screens').replaceChildren();stage.style.width='100%';stage.style.height='100%';positions=[];visible=[];metrics();}
 function resetDetails(){q('overview-planning-actions')?.replaceChildren();q('overview-planning')?.replaceChildren();q('overview-current-screen').textContent='화면 선택';q('overview-selected-name').textContent='화면 설명';q('overview-purpose').textContent='화면을 선택하면 설명과 실제 연결을 볼 수 있습니다.';q('overview-kind').textContent='—';q('overview-size').textContent='—';q('overview-incoming').replaceChildren();q('overview-outgoing').replaceChildren();q('overview-count').textContent='0';}
 function paintBoard(board){
  const screen=design.screens.find(s=>s.id===board.id),size=screenSize(design,screen);
  const panel=page.createElement('div');panel.className='overview-content-root';
  const windowed=screen.kind!=='page'&&screen.presentation?.rootMode!=='fullscreen',inner=windowed?overlayRootSize(screen,size):size;
  Object.assign(panel.style,{position:'absolute',width:inner.w+'px',height:inner.h+'px',left:(size.w-inner.w)/2+'px',top:(size.h-inner.h)/2+'px',overflow:'hidden'});
  board.panel=panel;
  const layers=reviewLayers(design,review,screen);
  for(const layer of layers){
   const target=layers.length===1?panel:page.createElement('div');
   if(target!==panel){
    Object.assign(target.style,{position:'absolute',inset:'0',overflow:'hidden',background:layer.dim?'#26334166':'transparent'});
    target.dataset.reviewLayer=layer.screen.id;
    panel.append(target);
   }
   const current=presentationScreen(layer.screen,presentationMode);
   applySkin(target,current.presentation?.rootMode==='fullscreen'?undefined:current.skin,{view:presentationMode==='wireframe'?'wire':'art',workspaceId:identity.workspaceId});
   renderPresentation(previewFixtureScreen(layer.screen,design.fixtures),target,{presentationMode,mode:'view',assetView:'art',workspaceId:identity.workspaceId,transitions:design.transitions,runtime:layer.runtime,suppressedElements:layer.suppressedElements});
   disposeButtonStates(target,{preserveVisual:true});disposeScrollPins(target);
  }
  board.content.replaceChildren(panel);
  if(layout==='grid' && review?.parts===board.id)appendReviewMenus(page,board.content,design,review,size.h);
  board.node.dataset.mounted='true';
 }
 function paintVisible(){
  frame=null;if(disposed||!design)return;
  const state=viewportState();visible=visibleBoardIds(positions,state,120);
  const keep=new Set(visibleBoardIds(positions,state,500)),mount=new Set(visible);
  for(const [id,board]of boards)if(board.panel&&!keep.has(id))release(board);
  const pending=[...boards.values()].filter(board=>mount.has(board.id)&&!board.panel&&!board.failed).sort((a,b)=>(a.id===selected?-1:b.id===selected?1:0));
  for(const board of pending.slice(0,3))try{paintBoard(board);}catch(error){release(board);board.content.textContent='화면 표시 실패 · '+error.message;board.node.dataset.mounted='error';board.failed=true;}
  metrics();if(pending.length>3)requestPaint();
 }
 function requestPaint(){if(frame===null&&!disposed)frame=scheduleFrame(paintVisible);}
 function updateGeometry(){
  const extent=boardExtent(positions);stage.style.width=Math.max(viewport.clientWidth,extent.w*zoom)+'px';stage.style.height=Math.max(viewport.clientHeight,extent.h*zoom)+'px';
  Object.assign(layer.style,{width:extent.w+'px',height:extent.h+'px',transform:'scale('+zoom+')'});
  for(const p of positions){const board=boards.get(p.id);if(board)Object.assign(board.node.style,{left:p.x+'px',top:p.y+'px',width:p.w+'px',height:p.h+'px'});}
  svg.setAttribute('width',extent.w);svg.setAttribute('height',extent.h);svg.style.transform='scale('+zoom+')';svg.hidden=layout!=='flow';
  svg.replaceChildren();
  if(layout==='flow'){
   const map=new Map(positions.map(p=>[p.id,p]));
   for(const edge of explicitEdges(design)){
    const from=map.get(edge.fromScreen),to=map.get(edge.targetScreen),path=page.createElementNS(NS,'path'),title=page.createElementNS(NS,'title');
    const x1=from.x+from.w,y1=from.y+from.h/2,x2=to.x,y2=to.y+to.h/2,bend=Math.min(80,Math.max(24,Math.abs(x2-x1)/2));
    path.setAttribute('d','M '+x1+' '+y1+' C '+(x1+bend)+' '+y1+', '+(x2-bend)+' '+y2+', '+x2+' '+y2);path.setAttribute('class','overview-edge');path.dataset.transition=edge.id;
    title.textContent=(design.screens.find(s=>s.id===edge.fromScreen)?.name||edge.fromScreen)+' → '+(design.screens.find(s=>s.id===edge.targetScreen)?.name||edge.targetScreen)+' · '+(edge.label||actions[edge.action]||edge.action);path.append(title);svg.append(path);
   }
  }
  q('overview-zoom-value').textContent=Math.round(zoom*100)+'%';q('overview-zoom-out').disabled=zoom<=.01;q('overview-zoom-in').disabled=zoom>=2;requestPaint();
 }
 function syncURL(){if(!design)return;view.history.replaceState(null,'',overviewURL('overview',{...identity,screenId:selected,presentationMode,layout}));}
 function syncSelection(){
  const screen=design?.screens.find(s=>s.id===selected);
  for(const [id,row]of rows)row.setAttribute('aria-current',String(id===selected));
  for(const [id,board]of boards)board.hit.setAttribute('aria-pressed',String(id===selected));
  if(!screen)return;
  q('overview-current-screen').textContent=screen.name;q('overview-selected-name').textContent=screen.name;q('overview-purpose').textContent=screen.purpose||'아직 화면 설명이 없습니다.';
  q('overview-kind').textContent=kinds[screen.kind]||screen.kind;const size=screenSize(design,screen);q('overview-size').textContent=size.w+' × '+size.h;
  const appendLink=(container,text,target)=>{const item=page.createElement('li');if(target){const button=page.createElement('button');button.type='button';button.textContent=text;button.onclick=()=>{
      if(!boards.has(target)&&layout==='grid'){layout='flow';q('overview-layout').value='flow';arrange();fit();}
      choose(target,{reveal:true});
     };item.append(button);}else item.textContent=text;container.append(item);};
  const incoming=q('overview-incoming'),outgoing=q('overview-outgoing');incoming.replaceChildren();outgoing.replaceChildren();
  const edges=explicitEdges(design),ins=edges.filter(t=>t.targetScreen===selected),outs=design.transitions.filter(t=>t.fromScreen===selected);
  for(const t of ins)appendLink(incoming,(design.screens.find(s=>s.id===t.fromScreen)?.name||t.fromScreen)+' · '+(t.label||actions[t.action]||t.action),t.fromScreen);
  for(const t of outs){const target=design.screens.find(s=>s.id===t.targetScreen);appendLink(outgoing,(t.label||actions[t.action]||t.action)+(target?' → '+target.name:''),target?.id);}
  if(!ins.length)appendLink(incoming,'저장된 진입 연결이 없습니다.');if(!outs.length)appendLink(outgoing,'저장된 출발 연결이 없습니다.');
  const actionsSlot=q('overview-planning-actions');if(actionsSlot){const actionsHost=page.createElement('span');actionsSlot.replaceChildren(actionsHost);void mountPlanningActions(actionsHost,{...identity,screenId:selected});}
  const planningSlot=q('overview-planning');
  if(planningSlot){const planningHost=page.createElement('div');planningSlot.replaceChildren(planningHost);void mountPlanningPanel(planningHost,{...identity,screenId:selected,elements:screen.elements});}
  const context={...identity,screenId:selected,presentationMode};q('overview-detail').href=overviewURL('detail',context);q('overview-preview').href=overviewURL('sample',context);
  syncURL();saveSoon();requestPaint();
 }
 function choose(id,{reveal=false}={}){
  if(!boards.has(id))return;
  selected=id;syncSelection();
  if(reveal){const p=positions.find(p=>p.id===id);viewport.scrollLeft=Math.max(0,(p.x+p.w/2)*zoom-viewport.clientWidth/2);viewport.scrollTop=Math.max(0,(p.y+p.h/2)*zoom-viewport.clientHeight/2);requestPaint();}
 }
 function fit({all=true}={}){if(!design)return;autoFit=true;fitEntire=all;const extent=boardExtent(positions);zoom=Math.max(.01,Math.min(1,(viewport.clientWidth-24)/extent.w,all?(viewport.clientHeight-24)/extent.h:Infinity));viewport.scrollLeft=0;viewport.scrollTop=0;updateGeometry();saveSoon();}
 function zoomTo(next,point){if(!design)return;autoFit=false;next=Math.max(.01,Math.min(2,next));const at=point||{x:viewport.clientWidth/2,y:viewport.clientHeight/2},left=(viewport.scrollLeft+at.x)/zoom*next-at.x,top=(viewport.scrollTop+at.y)/zoom*next-at.y;zoom=next;updateGeometry();viewport.scrollLeft=Math.max(0,left);viewport.scrollTop=Math.max(0,top);saveSoon();}
 function finishDrag(cancel=false){
  if(!drag)return;const current=drag;drag=null;
  if(current.type==='board'&&cancel){const p=positions.find(p=>p.id===current.id);if(p){p.x=current.before.x;p.y=current.before.y;updateGeometry();}}
  suppressClick=current.type==='board'&&!!current.moved;
  if(current.capture?.hasPointerCapture?.(current.pointerId))current.capture.releasePointerCapture(current.pointerId);
  host.classList.remove('overview-dragging');saveSoon();
 }
 function boardPointerDown(id,event){
  if(event.button!==0||drag)return;
  choose(id);if(layout!=='flow')return;
  const p=positions.find(p=>p.id===id),capture=boards.get(id).hit;event.preventDefault();capture.focus();capture.setPointerCapture?.(event.pointerId);autoFit=false;
  drag={type:'board',id,capture,pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,before:{x:p.x,y:p.y},moved:false};host.classList.add('overview-dragging');
 }
 function buildBoards(){
  for(const screen of positions.map(p=>design.screens.find(s=>s.id===p.id))){
   const node=page.createElement('section'),label=page.createElement('div'),content=page.createElement('div'),hit=page.createElement('button'),row=page.createElement('button');
   node.className='overview-board';node.dataset.board=screen.id;label.className='overview-board-label';label.textContent=screen.name+(screen.id===design.entryScreen?' · 시작':'')+(positions.find(p=>p.id===screen.id)?.connected===false?' · 미연결':'');label.setAttribute('aria-hidden','true');
   content.className='overview-board-content';content.inert=true;content.setAttribute('inert','');content.setAttribute('aria-hidden','true');
   hit.type='button';hit.className='overview-board-hit';hit.style.touchAction=layout==='flow'?'none':'pan-x pan-y';hit.dataset.screen=screen.id;hit.setAttribute('aria-label',screen.name+' 화면 전체 선택');hit.title='화면 전체 선택 · 연결 보기에서 끌어 이동 / 방향키 이동 · Esc 취소';
   hit.onclick=()=>{if(suppressClick){suppressClick=false;return;}choose(screen.id);};hit.onpointerdown=event=>boardPointerDown(screen.id,event);
   hit.onkeydown=event=>{
    if(layout!=='flow'||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;
    event.preventDefault();const p=positions.find(p=>p.id===screen.id),step=event.shiftKey?80:20;
    if(event.key==='ArrowLeft')p.x=Math.max(0,p.x-step);if(event.key==='ArrowRight')p.x+=step;if(event.key==='ArrowUp')p.y=Math.max(36,p.y-step);if(event.key==='ArrowDown')p.y+=step;choose(screen.id);autoFit=false;updateGeometry();saveSoon();
   };
   node.append(label,content,hit);layer.append(node);boards.set(screen.id,{id:screen.id,node,content,hit,panel:null});
   row.type='button';row.className='overview-screen-row';row.dataset.screen=screen.id;row.textContent=screen.name;row.title=screen.name;row.onclick=()=>choose(screen.id,{reveal:true});q('overview-screens').append(row);rows.set(screen.id,row);
  }
 }
 function arrange(saved=null){
  finishDrag(true);
  for(const board of boards.values())release(board);boards.clear();rows.clear();layer.replaceChildren();q('overview-screens').replaceChildren();
  positions=layout==='flow'?restorePositions(flowLayout(design),saved?.positions):reviewGrid(design,review);
  if(!positions.some(p=>p.id===selected))selected=design.entryScreen;
  buildBoards();q('overview-count').textContent=String(positions.length);syncSelection();updateGeometry();
 }
 function fillCatalog(catalog){const picker=q('overview-design-select');picker.replaceChildren();for(const item of catalog){const option=page.createElement('option');option.value=item.id;option.textContent=item.name+' · r'+item.revision;picker.append(option);}picker.value=catalog.some(item=>item.id===identity.projectId)?identity.projectId:catalog[0]?.id||'';picker.disabled=!catalog.length;q('overview-design-open').disabled=!catalog.length;}
 function setUsable(enabled){for(const id of ['overview-presentation','overview-layout','overview-fit','overview-zoom-in','overview-zoom-out'])q(id).disabled=!enabled;for(const id of ['overview-detail','overview-preview']){q(id).setAttribute('aria-disabled',String(!enabled));if(!enabled)q(id).removeAttribute('href');}}
 function applyData(data){
  fillCatalog(data.catalog);q('overview-project').textContent=data.context.name;q('overview-project').title=data.context.directory;
  if(!data.design){clearBoards();resetDetails();design=null;q('overview-empty').hidden=false;q('overview-empty').textContent='저장된 설계가 없습니다. 상세 편집에서 첫 설계를 만든 뒤 전체 캔버스를 여세요.';status.textContent='저장된 설계가 없습니다.';q('overview-design').textContent='설계 없음';setUsable(false);q('overview-detail').href=overviewURL('detail',identity);q('overview-detail').setAttribute('aria-disabled','false');return;}
  if(design&&data.design.revision<design.revision)return;
  const first=!initialized,previous=selected;
  finishDrag(true);if(design)saveView();design=data.design;review=data.review;identity={...identity,projectId:design.projectId};requestedRevision=Math.max(requestedRevision,design.revision);
  const settings=readJSON(preferenceKey(identity));
  if(first){layout=identity.layout||(['grid','flow'].includes(settings?.layout)?settings.layout:'grid');presentationMode=normalizePresentationMode(identity.presentationMode||settings?.presentationMode,identity.workspaceId);}
  const saved=cleanViewPreferences(readJSON(viewKey()));
  selected=design.screens.find(s=>s.id===(first?identity.screenId||saved.selected:previous))?.id||design.entryScreen;
  initialized=true;q('overview-empty').hidden=true;q('overview-design').textContent=design.name+' · r'+design.revision;q('overview-design-select').value=design.projectId;q('overview-count').textContent=String(design.screens.length);
  q('overview-presentation').value=presentationMode;q('overview-layout').value=layout;q('overview-current-screen').textContent=design.screens.find(s=>s.id===selected).name;
  arrange(saved);setUsable(true);
  if(first){if(saved.zoom){zoom=saved.zoom;autoFit=false;updateGeometry();viewport.scrollLeft=saved.left;viewport.scrollTop=saved.top;}else fit({all:layout==='flow'});}
  else if(autoFit)fit({all:fitEntire});
  try{view.localStorage.setItem(scopedKey('ux-studio.last-project',identity.workspaceId),design.projectId);}catch{}
  status.textContent=(previous&&previous!==selected?'선택 화면이 없어 시작 화면을 표시합니다. · ':'')+positions.length+'개 화면 · 저장 r'+design.revision;
 }
 function showError(error){
  if(error.catalog)fillCatalog(error.catalog);if(error.context)q('overview-project').textContent=error.context.name;
  status.textContent='읽기 실패 · '+error.message;
  if(!design||error.status===404){clearBoards();resetDetails();design=null;q('overview-design').textContent='설계 읽기 실패';setUsable(false);q('overview-empty').hidden=false;q('overview-empty').textContent=error.message;}
  else status.textContent+=' · 마지막 읽은 r'+design.revision+' 표시 중';
 }
 const refresher=createOverviewRefresh({read:()=>{
  status.textContent=design?'저장 설계 다시 읽는 중…':'저장 설계 읽는 중…';
  let preferred=null;try{preferred=view.localStorage.getItem(scopedKey('ux-studio.last-project',identity.workspaceId));}catch{}
  const fetcher=view.fetch.bind(view);
  return Promise.all([readOverviewData(identity,fetcher,{preferredProjectId:preferred}),readPlanningIndex(fetcher)]).then(([data,index])=>{
   const entry=index.projects.find(p=>p.workspaceId===identity.workspaceId&&p.projectId===data.design?.projectId);
   return {...data,review:entry?.canvasReview};
  });
 },apply:applyData,error:showError});
 q('overview-presentation').replaceChildren(...presentationModesFor(identity.workspaceId).map(mode=>{const option=page.createElement('option');option.value=mode.id;option.textContent=mode.label;option.disabled=!!mode.disabled;return option;}));
 q('overview-presentation').onchange=()=>{presentationMode=normalizePresentationMode(q('overview-presentation').value,identity.workspaceId);for(const board of boards.values()){release(board);board.failed=false;}syncSelection();saveView();requestPaint();};
 q('overview-layout').onchange=()=>{if(!design)return;finishDrag(true);saveView();layout=q('overview-layout').value==='flow'?'flow':'grid';const saved=cleanViewPreferences(readJSON(viewKey()));selected=design.screens.some(s=>s.id===saved.selected)?saved.selected:selected;arrange(saved);if(saved.zoom){zoom=saved.zoom;autoFit=false;updateGeometry();viewport.scrollLeft=saved.left;viewport.scrollTop=saved.top;}else fit({all:layout==='flow'});saveView();};
 q('overview-fit').onclick=()=>fit();q('overview-zoom-in').onclick=()=>zoomTo(zoom*1.25);q('overview-zoom-out').onclick=()=>zoomTo(zoom/1.25);q('overview-refresh').onclick=()=>refresher.refresh();
 q('overview-manual').onclick=()=>openManual({workspaceId:identity.workspaceId}).catch(showError);
 q('overview-projects').onclick=()=>openProjectManager({workspaceId:identity.workspaceId,isDirty:()=>false,save:async()=>false,guide:()=>openManual({workspaceId:identity.workspaceId}),navigate:workspaceId=>{saveView();view.location.href=overviewURL('overview',{workspaceId});}}).catch(showError);
 q('overview-design-open').onclick=()=>{saveView();view.location.href=overviewURL('overview',{workspaceId:identity.workspaceId,projectId:q('overview-design-select').value});};
 const onScroll=()=>{requestPaint();saveSoon();};viewport.addEventListener('scroll',onScroll,{passive:true});
 const onWheel=event=>{if(!(event.ctrlKey||event.metaKey)||!event.deltaY||!design)return;event.preventDefault();const rect=viewport.getBoundingClientRect(),delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?rect.height:1);zoomTo(zoom*Math.exp(-Math.max(-200,Math.min(200,delta))*.002),{x:event.clientX-rect.left,y:event.clientY-rect.top});};viewport.addEventListener('wheel',onWheel,{passive:false});
 const pointerDown=event=>{if(drag||event.button!==0||event.target.closest('button')||event.target.closest('a'))return;const capture=viewport;capture.setPointerCapture?.(event.pointerId);drag={type:'pan',capture,pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,before:{x:viewport.scrollLeft,y:viewport.scrollTop},moved:false};host.classList.add('overview-dragging');};
 const pointerMove=event=>{if(!drag||event.pointerId!==drag.pointerId)return;const dx=event.clientX-drag.startX,dy=event.clientY-drag.startY;drag.moved||=Math.abs(dx)+Math.abs(dy)>3;if(drag.type==='pan'){viewport.scrollLeft=drag.before.x-dx;viewport.scrollTop=drag.before.y-dy;}else{const p=positions.find(p=>p.id===drag.id);if(!p){finishDrag(true);return;}p.x=Math.max(0,Math.min(1000000,drag.before.x+dx/zoom));p.y=Math.max(36,Math.min(1000000,drag.before.y+dy/zoom));updateGeometry();}};
 const pointerUp=event=>{if(event.pointerId===drag?.pointerId)finishDrag(event.type==='pointercancel');};
 const keyDown=event=>{if(event.key==='Escape'&&drag){event.preventDefault();finishDrag(true);}};
 viewport.addEventListener('pointerdown',pointerDown);view.addEventListener('pointermove',pointerMove);view.addEventListener('pointerup',pointerUp);view.addEventListener('pointercancel',pointerUp);view.addEventListener('keydown',keyDown);
 const resize=()=>{if(design&&autoFit)fit({all:fitEntire});else{if(design)updateGeometry();requestPaint();}};
 const observer=typeof view.ResizeObserver==='function'?new view.ResizeObserver(resize):null;observer?.observe(viewport);view.addEventListener('resize',resize);
 if(typeof view.BroadcastChannel==='function'){channel=new view.BroadcastChannel('ux-studio-design');channel.onmessage=event=>{const data=event.data;if(data?.type==='design.saved'&&(data.workspace||null)===identity.workspaceId&&data.projectId===identity.projectId&&Number.isSafeInteger(data.revision)&&data.revision>requestedRevision){requestedRevision=data.revision;refresher.refresh();}};}
 function dispose(){if(disposed)return;finishDrag(true);saveView();disposed=true;refresher.dispose();observer?.disconnect();channel?.close();if(frame!==null)cancelFrame(frame);if(saveTimer!==null)view.clearTimeout(saveTimer);for(const board of boards.values())release(board);viewport.removeEventListener('scroll',onScroll);viewport.removeEventListener('wheel',onWheel);viewport.removeEventListener('pointerdown',pointerDown);view.removeEventListener('pointermove',pointerMove);view.removeEventListener('pointerup',pointerUp);view.removeEventListener('pointercancel',pointerUp);view.removeEventListener('keydown',keyDown);view.removeEventListener('resize',resize);view.removeEventListener('pagehide',pageHide);view.removeEventListener('pageshow',pageShow);}
 const pageHide=event=>{if(event.persisted){finishDrag(true);saveView();}else dispose();};
 const pageShow=event=>{if(event.persisted){resize();refresher.refresh();}};
 view.addEventListener('pagehide',pageHide);view.addEventListener('pageshow',pageShow);setUsable(false);refresher.refresh();
 return {refresh:()=>refresher.refresh(),dispose,snapshot:()=>({projectId:identity.projectId,workspaceId:identity.workspaceId,selected,layout,presentationMode,zoom,totalBoards:positions.length,mountedBoards:[...boards.values()].filter(b=>b.panel).length,visibleBoards:visible.length,positions:positions.map(p=>({...p})),revision:design?.revision??null})};
}
if(typeof document!=='undefined'&&document.querySelector?.('#overview'))mountOverview();
