import { scopeURL, scopedKey, openProjectManager } from './project-manager.mjs';
import { openManual } from './manual.mjs';
import {projectContext,designURL,navigateDesign,chooseDesignNavigation} from './project-context.mjs';
import {startCanvasPan,startBoardDrag,startPartDrag} from './grapes-drag.mjs';
import {zoomGrapesViewport,applyGrapesNewLinks,applyGrapesActions,applyGrapesTargets,applyGrapesScreenDescription,applyGrapesEntry,applyCanvasPositions,nudgeGrapesRect,applyGrapesEdits,restoreGrapesSvg,grapesStageKey,validateGrapesStage} from './grapes-bridge.mjs?v=20261116-canvas-individual1';
import {renderLayout} from './layout-view.mjs';
import {validateDocument} from './model.mjs';
import {percentRectEditable} from './responsive-layout.mjs';
import {openDesignGuide} from './design-guide-view.mjs';
import {attachCanvasPanels} from './canvas-panels.mjs';
import {attachCanvasLayers} from './canvas-layers.mjs';
import {applyDesignGuideChange,importGuideImage} from './design-guide-edit.mjs';
import {attachControls} from './controls.mjs';
const status=document.querySelector('#status');
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const parameters=new URLSearchParams(location.search);
const workspaceId=parameters.get('workspace')||null;
const disposePanels=attachCanvasPanels(document.querySelector('.canvas-workspace'),{storageKey:scopedKey('ux-studio.canvas-panels.v1',workspaceId)});
window.addEventListener('pagehide',disposePanels,{once:true});
let projectId=parameters.get('project')||null;
let folderProject=null;
const scopedFetch=(path,options)=>fetch(scopeURL(path,workspaceId),options);
if(workspaceId){const input=document.createElement('input');input.type='hidden';input.name='workspace';input.value=workspaceId;document.querySelector('header form').append(input);}
document.querySelector('#manual').onclick=()=>openManual({workspaceId});
document.querySelector('#project-folders').onclick=()=>openProjectManager({workspaceId,isDirty:()=>false,save:async()=>false,guide:()=>openManual({workspaceId}),navigate:id=>location.href=designURL('canvas',{workspaceId:id})});
document.querySelector('#main-editor').href=designURL('detail',{workspaceId,projectId});
try {
 if(workspaceId){const response=await scopedFetch('/api/ux-studio/workspace');const body=await response.json();if(!response.ok)throw Error(body.error||'프로젝트 폴더 정보 조회 실패');folderProject=body.workspace;}
 const catalogResponse=await scopedFetch('/api/ux-studio/projects');
 if(!catalogResponse.ok)throw Error('저장 설계 목록 조회 실패');
 const catalog=(await catalogResponse.json()).projects;
 let preferred;try{preferred=localStorage.getItem(scopedKey('ux-studio.last-project',workspaceId));}catch{}
 projectId ||= catalog.some(item=>item.id===preferred)?preferred:catalog[0]?.id;
 const picker=document.querySelector('#project');
 for(const item of catalog){const option=new Option(`${item.name} · r${item.revision}`,item.id);picker.add(option);}
 if(!catalog.length){const context=projectContext({workspaceId,workspace:folderProject});document.querySelector('#project-name').textContent=context.name;document.querySelector('#project-kind').textContent=context.label;document.querySelector('#project-directory').textContent=context.directory;throw Error('저장 설계가 없습니다. 상세 편집에서 첫 설계를 만든 뒤 캔버스를 열어주세요.');}
 if(!catalog.some(item=>item.id===projectId))throw Error('저장 목록에 없는 설계입니다.');
 picker.value=projectId;
 const response=await scopedFetch('/api/ux-studio/project?id='+encodeURIComponent(projectId));
 if(!response.ok)throw Error(`설계 조회 ${response.status}`);
 const source=validateDocument((await response.json()).document),screen=source.screens.find(s=>s.id===source.entryScreen);
 const initialContext=projectContext({workspaceId,workspace:folderProject,document:source});
 document.querySelector('#project-name').textContent=initialContext.name;
 document.querySelector('#project-kind').textContent=initialContext.label;
 document.querySelector('#project-directory').textContent=initialContext.directory;
 document.querySelector('#project-directory').title=`설계 저장: ${initialContext.storageDirectory} · 도구 소스: ${initialContext.toolDirectory}`;
 const key=()=>scopedKey(grapesStageKey(source,document.querySelector('#stage').value),workspaceId);
 const partKey=(sid,id)=>JSON.stringify([sid,id]);
 const originals=new Map(source.screens.flatMap(s=>s.elements.map(e=>[partKey(s.id,e.id),e])));
 const originalFor=c=>originals.get(partKey(c.get('uxScreen')||screen.id,c.get('uxId')));
 const sourceScreenFor=original=>source.screens.find(s=>s.elements.includes(original));
 const canEditRect=original=>percentRectEditable(sourceScreenFor(original),original);
 const canvasLayers=attachCanvasLayers(document.querySelector('#layers'),{select:part=>editor.select(part),toggleOpen:part=>editor.Layers.setOpen(part,!editor.Layers.isOpen(part)),isOpen:part=>editor.Layers.isOpen(part)});
 const editor=grapesjs.init({container:'#gjs',height:'100%',width:'auto',storageManager:false,telemetry:false,panels:{defaults:[]},layerManager:{appendTo:'#layers',sortable:false,onRender:canvasLayers.onRender},traitManager:{appendTo:'#traits'},deviceManager:{devices:[{id:'phone',name:'Phone',width:Math.max(390,source.screens.length*450)+'px'}]},canvas:{styles:['/ui-studio/source/styles.css']},undoManager:{trackSelection:false}});
 editor.on('component:selected component:deselected',()=>canvasLayers.syncSelection(editor.getSelected()));
 editor.on('destroy',canvasLayers.dispose);
 editor.DomComponents.addType('ux-part',{view:{events:{mousedown:'dragPart'},dragPart(event){if(event.button!==0||event.target.closest('[data-element]')!==this.model.getEl())return;const original=originalFor(this.model);if(!original)return;event.preventDefault();event.stopPropagation();editor.select(this.model);if(canEditRect(original))startPartDrag(editor,this.model,original,event,message=>status.textContent=message);}},model:{defaults:{uxImage:false,uxFontSize:false,uxGuideGeometry:false,draggable:false,droppable:false,copyable:false,removable:false,editable:false,resizable:false,traits:[{type:'text',name:'name',label:'이름',changeProp:true},{type:'text',name:'uxText',label:'표시글',changeProp:true}]},init(){
 const original=originalFor(this);this.set({uxPurpose:this.get('uxPurpose')??original?.purpose??'',uxInfo:this.get('uxInfo')??original?.info??''},{silent:true});
 const tracked=this.get('_undo');if(tracked!==true)this.set('_undo',[...(Array.isArray(tracked)?tracked:[]),'uxPurpose','uxInfo','uxImage','uxFontSize','uxGuideGeometry']);
 this.on('change:uxImage change:uxFontSize change:uxGuideGeometry',()=>refreshPartAppearance(this));
 for(const [key,css] of Object.entries({X:'left',Y:'top',W:'width',H:'height'}))this.on('change:ux'+key,()=>{if(canEditRect(originalFor(this)))this.addStyle({[css]:this.get('ux'+key)+'%'});});this.on('change:uxText',()=>{const label=this.components().find(c=>(c.getClasses().includes('element-text') || String(c.getAttributes().class || '').split(/\s+/).includes('element-text')));if(label)label.components(escape(this.get('uxText')||''));});}}});

 const traitsFor=original=>[{type:'text',name:'name',label:'이름',changeProp:true},{type:'text',name:'uxText',label:'표시글',changeProp:true},{type:'text',name:'uxPurpose',label:'어떤 기능인가요?',changeProp:true},{type:'text',name:'uxInfo',label:'표시할 정보 / 설명',changeProp:true},...(canEditRect(original)?['x','y','w','h'].map(k=>({type:'number',name:'ux'+k.toUpperCase(),label:k.toUpperCase()+' (%)',changeProp:true,min:['w','h'].includes(k)?0.1:-10000,max:10000,step:0.1})):[])];
 function component(node,sid){
  const original=originals.get(partKey(sid,node.dataset?.element));
  if(!original)return {type:node.namespaceURI==='http://www.w3.org/2000/svg'?(node.tagName.toLowerCase()==='svg'?'svg':'svg-in'):'default',tagName:node.tagName.toLowerCase(),style:Object.fromEntries([...node.style].map(k=>[k,node.style.getPropertyValue(k)])),attributes:Object.fromEntries([...node.attributes].filter(a=>a.name!=='style').map(a=>[a.name,a.value])),components:(node.namespaceURI==='http://www.w3.org/2000/svg'||node.querySelector('[data-element]'))?[...node.children].map(child=>component(child,sid)):node.innerHTML,selectable:false,hoverable:false,layerable:false,draggable:false,droppable:false,removable:false,copyable:false};
  return {type:'ux-part',...Object.fromEntries(['x','y','w','h'].map(k=>['ux'+k.toUpperCase(),original[k]])),traits:traitsFor(original),name:original.name,uxText:original.text||'',uxPurpose:original.purpose||'',uxInfo:original.info||'',uxId:original.id,uxScreen:sid,tagName:'div',style:Object.fromEntries([...node.style].map(k=>[k,node.style.getPropertyValue(k)])),attributes:Object.fromEntries([...node.attributes].filter(a=>a.name!=='style').map(a=>[a.name,a.value])),components:[...node.children].map(child=>component(child,sid))};
 }
 editor.DomComponents.addType('ux-board',{view:{events:{mousedown:'dragBoard'},dragBoard(event){startBoardDrag(editor,this.model,event,message=>{screenPicker.value=this.model.get('uxBoard');boardFields();resizeCanvas();status.textContent=message;});}},model:{defaults:{uxEntryScreen:null,uxTargets:null,uxActions:null,uxNewLinks:null},init(){this.set('uxScreenPurpose',this.get('uxScreenPurpose')??source.screens.find(s=>s.id===this.get('uxBoard'))?.purpose??'',{silent:true});const tracked=this.get('_undo');if(tracked!==true)this.set('_undo',[...(Array.isArray(tracked)?tracked:[]),'uxEntryScreen','uxScreenPurpose','uxTargets','uxActions','uxNewLinks']);this.on('change:boardX change:boardY',()=>this.addStyle({left:this.get('boardX')+'px',top:this.get('boardY')+'px'}));}}});
 const boardSize=s=>s.logicalSize||{w:390,h:844};
 const boards=source.screens.map((s,index)=>{
  const host=document.createElement('div');
  // Editor exposes collapsed descendants; preview keeps the saved initial state.
  renderLayout(s,host,{workspaceId,assetView:'art',mode:'view',transitions:source.transitions,menuState:Object.fromEntries(s.elements.filter(e=>e.menu).map(e=>[e.id,true]))});
  return {type:'ux-board',uxScreenPurpose:s.purpose||'',boardX:s.canvasPosition?.x??index*450+24,boardY:s.canvasPosition?.y??40,tagName:'section',name:s.name,uxBoard:s.id,attributes:{'data-board':s.id},style:{position:'absolute',left:(s.canvasPosition?.x??index*450+24)+'px',top:(s.canvasPosition?.y??40)+'px',width:boardSize(s).w+'px',height:boardSize(s).h+'px',background:'white'},selectable:false,draggable:false,droppable:false,components:[{tagName:'div',attributes:{'data-board-handle':'true',title:'화면 제목을 끌어 배치 · Esc 취소'},content:escape(s.name),style:{position:'absolute',top:'-28px',color:'#eee',cursor:'move',width:'100%',height:'24px','user-select':'none'},selectable:false,draggable:false,layerable:false},...[...host.children].map(node=>component(node,s.id))]};
 });
 editor.setComponents(boards);
 const canvasEditingCSS='body { background: #111821; } [data-board] .ui-element { pointer-events:auto!important; } [data-board] .ui-element > :not(.ui-element) { pointer-events:none!important; }';
 editor.addStyle(canvasEditingCSS);
 const boardModels=()=>editor.getWrapper().components().filter(c=>c.get('uxBoard'));
 const entryPicker=document.querySelector('#entry-screen');
 for(const s of source.screens.filter(s=>s.kind==='page'))entryPicker.add(new Option(s.name,s.id));
 const entryId=()=>boardModels()[0]?.get('uxEntryScreen')??source.entryScreen;
 const syncEntry=()=>{entryPicker.value=entryId();};
 entryPicker.onchange=()=>{try{applyGrapesEntry(source,entryPicker.value);boardModels()[0].set('uxEntryScreen',entryPicker.value);status.textContent='프로토타입 시작 화면 · '+entryPicker.selectedOptions[0].text;}catch(error){syncEntry();status.textContent='시작 화면 변경 실패: '+error.message;}};
 editor.on('undo redo',syncEntry);
 syncEntry();

 const linkPicker=document.querySelector('#link-choice'),targetPicker=document.querySelector('#link-target'),targetApply=document.querySelector('#link-apply');
 const targetEdits=()=>boardModels()[0]?.get('uxTargets')??[];
 const actionPicker=document.querySelector('#link-action');
 const actionEdits=()=>boardModels()[0]?.get('uxActions')??[];
 const newLinks=()=>boardModels()[0]?.get('uxNewLinks')??[];
 const linkBase=()=>applyGrapesNewLinks(source,newLinks());
 const currentLinks=()=>applyGrapesActions(applyGrapesTargets(linkBase(),targetEdits()),actionEdits()).transitions;
 const canCreateLink=()=>{const e=editor.getSelected()&&originalFor(editor.getSelected());return e?.kind==='button'&&!e.menu&&!e.intentionalNoAction&&e.interaction?.enabled!==false&&(!e.interaction?.mode||e.interaction.mode==='action')&&!currentLinks().some(t=>t.fromElement===e.id);};
 const fillTargets=target=>{
  targetPicker.replaceChildren();
  const action=actionPicker.value,needsTarget=['navigate','open'].includes(action);
  if(needsTarget){for(const s of source.screens.filter(s=>action==='navigate'?s.kind==='page':['modal','sheet','toast'].includes(s.kind)))targetPicker.add(new Option(s.name,s.id));targetPicker.value=target||'';}
  targetPicker.disabled=actionPicker.disabled||!needsTarget;
 };
 const targetFields=()=>{
  const link=currentLinks().find(t=>t.id===linkPicker.value),editable=link?['navigate','open','back','close'].includes(link.action):canCreateLink();
  actionPicker.disabled=targetApply.disabled=!editable;
  actionPicker.value=editable?(link?.action||'navigate'):'';
  targetApply.textContent=link?'행동 적용':'새 연결 추가';
  fillTargets(link?.targetScreen);
  document.querySelector('#link-detail').textContent=link?`현재 행동: ${link.action} · 조건: ${link.condition} · ${link.label||''}`:(editable?'연결할 행동과 목적지를 선택해주세요.':'연결 없음 · 입력 가능한 자체 동작 버튼을 선택해주세요.');
 };
 actionPicker.onchange=()=>fillTargets(currentLinks().find(t=>t.id===linkPicker.value)?.targetScreen);
 const syncLinks=()=>{
  const selected=editor.getSelected(),previous=linkPicker.value;
  linkPicker.replaceChildren();
  for(const t of currentLinks().filter(t=>t.fromScreen===selected?.get('uxScreen')&&t.fromElement===selected?.get('uxId')))linkPicker.add(new Option(`${t.label||t.id} · ${t.id}`,t.id));
  if([...linkPicker.options].some(o=>o.value===previous))linkPicker.value=previous;
  document.querySelector('#link-part').textContent=selected?.get('name')||'부품을 선택하세요';
  targetFields();
 };
 linkPicker.onchange=targetFields;
 targetApply.onclick=()=>{try{
  if(!linkPicker.value){
   const c=editor.getSelected();if(!canCreateLink())throw Error('새 연결 대상이 아닙니다.');
   const additions=[...newLinks(),{id:'link-'+crypto.randomUUID(),fromScreen:c.get('uxScreen'),fromElement:c.get('uxId'),action:actionPicker.value,targetScreen:targetPicker.value}];
   applyGrapesNewLinks(source,additions);boardModels()[0].set('uxNewLinks',additions);syncLinks();status.textContent='새 버튼 연결 추가';return;
  }
  const edits=[...actionEdits().filter(e=>e.id!==linkPicker.value),{id:linkPicker.value,action:actionPicker.value,targetScreen:targetPicker.value}];
  applyGrapesActions(applyGrapesTargets(linkBase(),targetEdits()),edits);boardModels()[0].set('uxActions',edits);syncLinks();status.textContent='버튼 행동 적용 · '+actionPicker.selectedOptions[0].text;
 }catch(error){status.textContent='행동 적용 실패: '+error.message;}};
 editor.on('component:selected undo redo',syncLinks);

 const positions=()=>boardModels().map((c,index)=>({id:c.get('uxBoard'),x:Number(c.get('boardX')??parseFloat(c.getStyle().left)??index*450+24),y:Number(c.get('boardY')??parseFloat(c.getStyle().top)??40)}));
 const extent=()=>{const p=positions();return {right:Math.max(...p.map(p=>p.x+boardSize(source.screens.find(s=>s.id===p.id)).w))+24,bottom:Math.max(...p.map(p=>p.y+boardSize(source.screens.find(s=>s.id===p.id)).h))+24};};
 const resizeCanvas=()=>{const e=extent();editor.Devices.getSelected().set({width:e.right+'px',height:e.bottom+'px'});};
 let autoFit=true;
 const home=()=>{autoFit=true;resizeCanvas();const rect=editor.Canvas.getElement().getBoundingClientRect(),e=extent();const zoom=Math.max(10,Math.min(100,Math.floor(Math.min((rect.width-48)/e.right,(rect.height-48)/e.bottom)*100)));editor.Canvas.setZoom(zoom);editor.Canvas.setCoords(24-rect.width*(1-zoom/100)/2,24-rect.height*(1-zoom/100)/2);const picker=document.querySelector('#zoom');let fit=picker.querySelector('[data-fit]');if(!fit){fit=new Option('',String(zoom));fit.dataset.fit='true';picker.add(fit);}fit.value=String(zoom);fit.textContent=zoom+' (전체 맞춤)';picker.value=String(zoom);document.querySelector('#zoom-out').disabled=zoom<=10;document.querySelector('#zoom-in').disabled=false;};
 const zoomTo=(value,point)=>{
  autoFit=false;
  const rect=editor.Canvas.getElement().getBoundingClientRect(),next=zoomGrapesViewport({zoom:editor.Canvas.getZoom(),coords:editor.Canvas.getCoords(),width:rect.width,height:rect.height},value,point);
  editor.Canvas.setZoom(next.zoom);editor.Canvas.setCoords(next.x,next.y);
  const picker=document.querySelector('#zoom');let custom=picker.querySelector('[data-manual]');
  if(![...picker.options].some(option=>Number(option.value)===next.zoom)){if(!custom){custom=new Option();custom.dataset.manual='true';picker.add(custom);}custom.value=String(next.zoom);custom.textContent=String(Math.round(next.zoom*10)/10);}
  picker.value=String(next.zoom);
  document.querySelector('#zoom-out').disabled=next.zoom<=10;document.querySelector('#zoom-in').disabled=next.zoom>=400;
 };
 document.querySelector('#zoom').onchange=event=>zoomTo(Number(event.target.value));
 document.querySelector('#zoom-in').onclick=()=>zoomTo(editor.Canvas.getZoom()*1.25);
 document.querySelector('#zoom-out').onclick=()=>zoomTo(editor.Canvas.getZoom()/1.25);
 const wheelZoom=(event,fromFrame=false)=>{
  if(!(event.ctrlKey||event.metaKey)||!event.deltaY)return;
  event.preventDefault();event._parentEvent?.preventDefault();
  const canvas=editor.Canvas.getElement().getBoundingClientRect(),frame=editor.Canvas.getFrameEl().getBoundingClientRect(),scale=editor.Canvas.getZoom()/100;
  const inFrame=fromFrame||event._parentEvent,x=inFrame?frame.left+event.clientX*scale:event.clientX,y=inFrame?frame.top+event.clientY*scale:event.clientY;
  const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?canvas.height:1);
  zoomTo(editor.Canvas.getZoom()*Math.exp(-Math.max(-200,Math.min(200,delta))*.002),{x:x-canvas.left,y:y-canvas.top});
 };
 editor.Canvas.getElement().addEventListener('wheel',wheelZoom,{passive:false});
 // Grapes forwards iframe wheels from a passive listener; consume zoom before that listener.
 let wheelDocument;
 const frameWheelZoom=event=>{if(!(event.ctrlKey||event.metaKey)||!event.deltaY)return;event.stopImmediatePropagation();wheelZoom(event,true);};
 const bindFrameWheel=()=>{const doc=editor.Canvas.getDocument();if(doc===wheelDocument)return;wheelDocument?.removeEventListener('wheel',frameWheelZoom,true);wheelDocument=doc;doc?.addEventListener('wheel',frameWheelZoom,{capture:true,passive:false});};
 editor.on('canvas:frame:load:body load',bindFrameWheel);
 editor.on('destroy',()=>{editor.Canvas.getElement().removeEventListener('wheel',wheelZoom);wheelDocument?.removeEventListener('wheel',frameWheelZoom,true);});
 for(const button of document.querySelectorAll('[data-pan]'))button.onclick=()=>{autoFit=false;const {x,y}=editor.Canvas.getCoords();editor.Canvas.setCoords(x+Number(button.dataset.pan),y);};
 document.querySelector('#canvas-home').onclick=home;
 const handButton=document.querySelector('#canvas-hand');
 const panShield=document.createElement('div');
 panShield.setAttribute('aria-label','캔버스 손 이동 영역');
 panShield.style.cssText='position:absolute;inset:0;z-index:100;cursor:grab;touch-action:none';
 panShield.hidden=true;editor.Canvas.getElement().append(panShield);
 let panDrag;
 const setHand=active=>{
  if(panDrag)return;
  panShield.hidden=!active;
  handButton.setAttribute('aria-pressed',String(active));
  document.querySelector('#canvas-select').setAttribute('aria-pressed',String(!active));
  status.textContent=active?'손 이동 모드 · 작업판 끌기 · Esc 취소':'선택 편집 모드';
 };
 handButton.onclick=()=>setHand(panShield.hidden);
 document.querySelector('#canvas-select').onclick=()=>setHand(false);
 panShield.addEventListener('mousedown',event=>{
  if(event.button!==0||panDrag)return;
  autoFit=false;panShield.style.cursor='grabbing';
  panDrag=startCanvasPan(editor,event,message=>{panDrag=null;panShield.style.cursor='grab';status.textContent=message;});
 });

 // Fit follows available space; manual zoom/pan keeps the user's view.
 const fitObserver=new ResizeObserver(()=>{if(autoFit)home();});
 fitObserver.observe(editor.Canvas.getElement());
 editor.on('destroy',()=>fitObserver.disconnect());
 for(const button of document.querySelectorAll('[data-pan-y]'))button.onclick=()=>{autoFit=false;const {x,y}=editor.Canvas.getCoords();editor.Canvas.setCoords(x,y+Number(button.dataset.panY));};
 const screenPicker=document.querySelector('#screen-focus');
 for(const s of source.screens)screenPicker.add(new Option(s.name,s.id));
 const focusScreen=()=>{
  autoFit=false;
  const board=editor.getWrapper().components().find(c=>c.get('uxBoard')===screenPicker.value);
  if(!board)return;
  editor.Canvas.setZoom(100);document.querySelector('#zoom').value='100';document.querySelector('#zoom-out').disabled=false;document.querySelector('#zoom-in').disabled=false;
  setTimeout(()=>{
   const canvas=editor.Canvas.getElement().getBoundingClientRect(),frame=editor.Canvas.getFrameEl().getBoundingClientRect(),target=board.getEl().getBoundingClientRect(),coords=editor.Canvas.getCoords();
   editor.Canvas.setCoords(coords.x+canvas.left+(canvas.width-target.width)/2-frame.left-target.left,coords.y+canvas.top+(canvas.height-target.height)/2-frame.top-target.top);
  },0);
  const first=parts().find(c=>(c.get('uxScreen')||screen.id)===screenPicker.value);
  if(first&&editor.getSelected()?.get('uxScreen')!==screenPicker.value)editor.select(first);
  status.textContent=`화면 탐색 · ${board.get('name')} · 100% · 설계 좌표 변경 없음`;
 };
 document.querySelector('#focus-screen').onclick=focusScreen;
 const boardFields=()=>{const p=positions().find(p=>p.id===screenPicker.value);document.querySelector('#board-x').value=p.x;document.querySelector('#board-y').value=p.y;const board=boardModels().find(c=>c.get('uxBoard')===p.id);document.querySelector('#screen-purpose').value=board.get('uxScreenPurpose');document.querySelector('#screen-description-name').textContent=board.get('name');};
 screenPicker.addEventListener('change',boardFields);
 screenPicker.addEventListener('change',()=>syncSelection());
 document.querySelector('#screen-purpose-apply').onclick=()=>{try{const purpose=document.querySelector('#screen-purpose').value;applyGrapesScreenDescription(source,screenPicker.value,purpose);boardModels().find(c=>c.get('uxBoard')===screenPicker.value).set('uxScreenPurpose',purpose);status.textContent='화면 설명 적용 · '+screenPicker.selectedOptions[0].text;}catch(error){status.textContent='설명 적용 실패: '+error.message;}};
 editor.on('component:selected',component=>{
  let current=component;
  while(current){
   const id=current.get('uxScreen')||current.get('uxBoard');
   if(id&&source.screens.some(s=>s.id===id)){screenPicker.value=id;boardFields();return;}
   current=current.parent();
  }
 });
 document.querySelector('#board-place').onclick=()=>{try{
  const x=Number(document.querySelector('#board-x').value),y=Number(document.querySelector('#board-y').value);
  applyCanvasPositions(source,positions().map(p=>p.id===screenPicker.value?{...p,x,y}:p));
  const board=boardModels().find(c=>c.get('uxBoard')===screenPicker.value);board.set({boardX:x,boardY:y});resizeCanvas();
  status.textContent=`캔버스 화면 배치 · ${board.get('name')} · ${x}, ${y}px · 내부 부품 좌표 유지`;
 }catch(e){status.textContent='배치 실패: '+e.message;}};
 editor.on('undo redo',()=>{resizeCanvas();boardFields();});


 let persisted,diskFingerprint,savedCopy=null;
 const syncContext=()=>{const dirty=diskFingerprint!==undefined&&fingerprint()!==diskFingerprint;const context=projectContext({workspaceId,workspace:folderProject,document:savedCopy||source,dirty});const target=document.querySelector('#design-context');target.textContent=context.design;target.classList.toggle('dirty',dirty);};
 const fingerprint=()=>JSON.stringify(design());
 const hasUnsaved=()=>{if(persisted===undefined)return false;try{return fingerprint()!==persisted;}catch{return true;}};
 window.addEventListener('beforeunload',event=>{if(hasUnsaved()){event.preventDefault();event.returnValue='';}});
 document.querySelector('header form').onsubmit=event=>{if(hasUnsaved()){event.preventDefault();status.textContent='단계 저장 또는 사본 저장 후 다른 설계를 열어주세요.';}};
 const parts=()=>{const found=[];const visit=c=>{if(c.get('uxId'))found.push(c);c.components().forEach(visit);};visit(editor.getWrapper());return found;};
 function verify(){const list=parts();if(list.length!==originals.size||new Set(list.map(c=>partKey(c.get('uxScreen')||screen.id,c.get('uxId')))).size!==originals.size)throw Error('요소 ID/개수 불일치');for(const c of list){const e=originalFor(c);if(!e)throw Error('알 수 없는 요소');const p=c.parent()?.get('uxId')||null;if(p!==(e.parentId||null))throw Error('부모 관계 불일치');}return list;}
 const restoreTraits=()=>{editor.addStyle(canvasEditingCSS);parts().forEach(c=>c.set('traits',traitsFor(originalFor(c))));resizeCanvas();boardFields();syncEntry();syncLinks();};
 const design=()=>applyGrapesActions(applyGrapesTargets(applyGrapesNewLinks(baseDesign(),newLinks()),targetEdits()),actionEdits());
 const baseDesign=()=>{const list=verify();return boardModels().reduce((doc,b)=>applyGrapesScreenDescription(doc,b.get('uxBoard'),b.get('uxScreenPurpose')),applyGrapesEntry(applyCanvasPositions(source.screens.reduce((doc,s)=>applyGrapesEdits(doc,s.id,list.filter(c=>(c.get('uxScreen')||screen.id)===s.id).map(c=>({id:c.get('uxId'),parentId:c.parent()?.get('uxId')||null,name:c.get('name'),text:c.get('uxText'),purpose:c.get('uxPurpose'),info:c.get('uxInfo'),guideGeometry:c.get('uxGuideGeometry')||undefined,...(c.get('uxImage')!==false?{image:c.get('uxImage')}:{}),...(c.get('uxFontSize')!==false?{fontSize:c.get('uxFontSize')}:{}),rect:!canEditRect(originalFor(c))?undefined:Object.fromEntries(['x','y','w','h'].map(k=>[k,Number(c.get('ux'+k.toUpperCase())??originalFor(c)[k])]))}))),source),positions()),entryId()));};
 function refreshPartAppearance(model){
  const current=design(),screen=current.screens.find(s=>s.id===model.get('uxScreen')),element=screen.elements.find(e=>e.id===model.get('uxId')),host=document.createElement('div');
  renderLayout(screen,host,{workspaceId,assetView:'art',mode:'view',visible:e=>e.id===element.id,transitions:current.transitions,menuState:Object.fromEntries(screen.elements.filter(e=>e.menu).map(e=>[e.id,true]))},element.parentId||null);
  attachControls(host,screen,{}, {mode:'edit'});
  const node=host.firstElementChild;if(!node)return;
  // Decorations follow the live design; actual child models keep their IDs and parent.
  editor.UndoManager.skip(()=>{
   model.setStyle(Object.fromEntries([...node.style].map(key=>[key,node.style.getPropertyValue(key)])));model.setClass([...node.classList]);
   model.components().filter(child=>!child.get('uxId')).forEach(child=>model.components().remove(child));
   model.components().add([...node.children].filter(child=>!child.dataset.element).map(child=>component(child,screen.id)),{at:0});
  });
 }
 document.querySelector('#studio-save').onclick=async()=>{
  const button=document.querySelector('#studio-save');if(button.disabled)return null;button.disabled=true;
  try{
   const designCopy=design(),savingFingerprint=JSON.stringify(designCopy);designCopy.projectId='ux-gjs-'+crypto.randomUUID().slice(0,8);designCopy.revision=0;designCopy.name=source.name+' · 캔버스 사본';
   const response=await scopedFetch('/api/ux-studio/project',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({document:designCopy,expectedRevision:null})});
   const saved=await response.json();if(!response.ok)throw Error(saved.error||'저장 실패');
   const reread=await scopedFetch('/api/ux-studio/project?id='+encodeURIComponent(saved.document.projectId));if(!reread.ok)throw Error('저장본 재조회 실패');
   const actual=(await reread.json()).document;if(JSON.stringify(actual)!==JSON.stringify(saved.document))throw Error('저장 재조회 불일치');
   persisted=savingFingerprint;diskFingerprint=savingFingerprint;savedCopy=actual;
   try{localStorage.setItem(scopedKey('ux-studio.last-project',workspaceId),actual.projectId);}catch{}
   syncContext();
   status.textContent=`우리 형식 저장·재조회 통과 · ${actual.projectId} r${actual.revision} · 원본 보존`;
   const link=document.querySelector('#studio-preview');link.href=scopeURL('/ui-studio/preview.html?project='+encodeURIComponent(actual.projectId),workspaceId);link.hidden=false;
   return fingerprint()===savingFingerprint?actual:null;
  }catch(error){status.textContent='저장 실패: '+error.message;}finally{button.disabled=false;}
 };
 const syncSelection=()=>{
  const selected=editor.getSelected(),original=selected&&originalFor(selected);
  document.querySelector('#selected-part-name').textContent=selected?.get('name')||'부품을 선택하세요';
  document.querySelector('#unit-guide').disabled=!original;
  const path=document.querySelector('#selection-path'),children=document.querySelector('#selection-children');path.replaceChildren();children.replaceChildren();
  const family=[];for(let current=selected;current?.get('uxId');current=current.parent())family.unshift(current);
  const selectButton=(part,container)=>{const button=document.createElement('button');button.textContent=part.get('name')||part.get('uxId');button.dataset.selectPart=part.get('uxId');if(part===selected)button.setAttribute('aria-current','true');button.onclick=()=>editor.select(part);container.append(button);};
  family.forEach(part=>selectButton(part,path));
  selected?.components().filter(part=>part.get('uxId')).forEach(part=>selectButton(part,children));
  const fixed=!!original&&!canEditRect(original);
  document.querySelector('#geometry-note').textContent=fixed?'앵커·여백·안전 영역은 디자인 가이드에서, 부모 자동 배치의 자식은 상세 편집에서 조절하세요.':'위치·크기는 부모 영역 기준 %입니다. 이름·표시글·설명도 편집할 수 있습니다.';
  for(const button of document.querySelectorAll('[data-nudge]'))button.disabled=!original||fixed;
  const selection={workspaceId,projectId:savedCopy?.projectId||source.projectId,screenId:selected?.get('uxScreen')||screenPicker.value,elementId:selected?.get('uxId')};
  document.querySelector('#main-editor').href=designURL('detail',selection);
 };
 const leaveForDetail=async event=>{
  event.preventDefault();
  try{const selected=editor.getSelected();await navigateDesign({dirty:fingerprint()!==diskFingerprint,destination:{view:'detail',workspaceId,projectId:savedCopy?.projectId||source.projectId,screenId:selected?.get('uxScreen')||screenPicker.value,elementId:selected?.get('uxId')},choose:chooseDesignNavigation,save:()=>document.querySelector('#studio-save').onclick(),navigate:url=>{persisted=fingerprint();location.href=url;}});}catch(error){status.textContent='상세 편집 이동 실패: '+error.message;}
 };
 document.querySelector('#main-editor').onclick=leaveForDetail;
 document.querySelector('#unit-guide').onclick=()=>{
  try{
   const selected=editor.getSelected(),screenId=selected?.get('uxScreen')||screenPicker.value;
   const selectPart=id=>{if(!id)return false;const part=parts().find(c=>c.get('uxScreen')===screenId&&c.get('uxId')===id);if(!part)return false;editor.select(part);return true;};
   const changePart=change=>{
    const id=change.elementId||editor.getSelected()?.get('uxId'),part=parts().find(c=>c.get('uxScreen')===screenId&&c.get('uxId')===id);
    if(!part)throw Error('가이드에서 편집할 부품을 다시 선택하세요.');
    const next=applyDesignGuideChange(design(),screenId,id,change),element=next.screens.find(s=>s.id===screenId).elements.find(e=>e.id===id),values={};
    if(change.type==='rect'){values.uxGuideGeometry=Object.fromEntries(['x','y','w','h','inset','rectTransform'].filter(key=>Object.hasOwn(element,key)).map(key=>[key,element[key]]));for(const key of ['x','y','w','h'])values['ux'+key.toUpperCase()]=element[key];}
    if(change.type==='image')values.uxImage=element.image||null;
    if(change.type==='text'){values.uxText=element.text||'';values.uxFontSize=element.fontSize??null;}
    part.set(values);return design();
   };
   openDesignGuide({document:design(),screenId,elementId:selected?.get('uxId'),workspaceId,onSelect:selectPart,onEdit:id=>{if(selectPart(id))return leaveForDetail({preventDefault(){}});},onChange:changePart,onImportImage:input=>importGuideImage(input,workspaceId)});
  }catch(error){status.textContent='디자인 가이드 열기 실패: '+error.message;}
 };
 document.querySelector('#project-folders').onclick=()=>openProjectManager({workspaceId,isDirty:()=>hasUnsaved()||fingerprint()!==diskFingerprint,save:async()=>!!await document.querySelector('#studio-save').onclick(),guide:()=>openManual({workspaceId}),navigate:id=>{persisted=fingerprint();location.href=designURL('canvas',{workspaceId:id});}});
 editor.on('component:selected component:deselected component:update undo redo',()=>{syncSelection();if(persisted!==undefined)try{syncContext();}catch{document.querySelector('#design-context').textContent='미저장 수정 · 입력값을 확인하세요';document.querySelector('#design-context').classList.add('dirty');}});
 const run=fn=>{try{fn();}catch(e){status.textContent=`실패: ${e.message}`;}};
 for(const button of document.querySelectorAll('[data-nudge]'))button.onclick=()=>run(()=>{
  const c=editor.getSelected(),original=c&&originalFor(c);
  if(!original)throw Error('먼저 화면 안의 부품을 선택해주세요.');
  const [axis,direction]=button.dataset.nudge.split(':');
  const rect=Object.fromEntries(['x','y','w','h'].map(k=>[k,Number(c.get('ux'+k.toUpperCase())??original[k])]));
  const next=nudgeGrapesRect(original,rect,axis,Number(direction)*Number(document.querySelector('#nudge-step').value),sourceScreenFor(original));
  c.set('ux'+axis.toUpperCase(),next[axis]);
  status.textContent=`부품 배치 · ${c.get('name')} · ${axis.toUpperCase()} ${next[axis]}% · 부모 기준`;
 });

 document.querySelector('#undo').onclick=()=>{editor.UndoManager.undo();status.textContent='GrapesJS 되돌리기 실행';};
 document.querySelector('#redo').onclick=()=>{editor.UndoManager.redo();status.textContent='GrapesJS 다시하기 실행';};
 document.querySelector('#save').onclick=()=>run(()=>{verify();localStorage.setItem(key(),JSON.stringify({source,project:editor.getProjectData()}));persisted=fingerprint();status.textContent=`${document.querySelector('#stage').value} 단계 저장 · 원본 r${source.revision} 미변경`;});
 document.querySelector('#load').onclick=()=>run(()=>{if(hasUnsaved())throw Error('현재 편집을 단계 저장 또는 사본 저장한 뒤 재열어주세요.');const saved=JSON.parse(localStorage.getItem(key())||(!workspaceId&&source.projectId==='ux-dd8c212e'?localStorage.getItem('ux-grapes-pilot-0.23.9-'+document.querySelector('#stage').value):null)||'null');if(!saved)throw Error('저장된 단계 없음');const data=validateGrapesStage(saved,source),previous=editor.getProjectData();try{editor.loadProjectData(data);verify();restoreTraits();}catch(error){editor.loadProjectData(previous);restoreTraits();throw error;}editor.select(parts().find(c=>c.get('name')==='별 수치')||parts()[0]);persisted=fingerprint();status.textContent=`단계 재열기 · ${originals.size}개 ID/부모 관계 통과`;});
 document.querySelector('#check').onclick=()=>run(()=>{const before=JSON.stringify(design());const data=JSON.parse(JSON.stringify(editor.getProjectData()));editor.loadProjectData(data);restoreTraits();const after=JSON.stringify(design());if(before!==after)throw Error('왕복 불일치');editor.select(parts().find(c=>c.get('name')==='별 수치')||parts()[0]);status.textContent=`왕복 검사 통과 · ${originals.size}개 부품 · 이름/글자/부모/배치 보존`;});
 editor.on('load',()=>{verify();const requestedScreen=source.screens.find(s=>s.id===parameters.get('screen'))?.id;screenPicker.value=requestedScreen||source.entryScreen;const requestedPart=parts().find(c=>c.get('uxScreen')===screenPicker.value&&c.get('uxId')===parameters.get('element'));editor.select(requestedPart||parts().find(c=>c.get('uxScreen')===screenPicker.value)||parts()[0]);editor.UndoManager.clear();boardFields();requestAnimationFrame(requestedScreen?focusScreen:home);persisted=fingerprint();diskFingerprint=persisted;syncContext();syncSelection();const preview=document.querySelector('#studio-preview');preview.href=designURL('preview',{workspaceId,projectId:source.projectId});preview.hidden=false;document.querySelectorAll('[data-requires-design]').forEach(button=>button.disabled=false);status.textContent=`${source.screens.length}개 화면 · ${originals.size}개 부품 · 원본 r${source.revision} 보존 · 수정은 사본으로 저장`;});
} catch(error){status.textContent=`캔버스를 열지 못했습니다: ${error.message}`;}
