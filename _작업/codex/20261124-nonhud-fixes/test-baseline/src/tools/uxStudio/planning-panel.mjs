// Read-only sidecar documentation: never changes a saved design or its approval state.
const empty=()=>({schemaVersion:1,projects:[]});
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function planningURL(viewer,section='overview') {
 if(typeof viewer!=='string'||! /^[a-z0-9][a-z0-9/_-]*\.html$/.test(viewer)||viewer.split('/').some(p=>!p||p==='.'||p==='..')||! /^[a-z][a-z0-9-]*$/.test(section))return null;
 return '/ui-studio/source/guide/reference/'+viewer+'#'+section;
}
export async function readPlanningIndex(fetcher=fetch) {
 try {const response=await fetcher('/ui-studio/source/planning-documents.json',{cache:'no-store'});if(!response.ok)return empty();const data=await response.json();return data?.schemaVersion===1&&Array.isArray(data.projects)?data:empty();} catch{return empty();}
}
export function planningPreviewTarget(index,{workspaceId,projectId,moduleId,elementId}) {
 if(!workspaceId||!moduleId)return null;
 const projects=index?.projects||[];
 const source=projects.find(entry=>entry.workspaceId===workspaceId&&entry.projectId===projectId);
 const raw=source?.previewModules?.[elementId]??source?.previewModules?.[moduleId];
 const target=typeof raw==='string'?{projectId:raw}:raw;
 if(!target||! /^[a-z][a-z0-9-]{0,47}$/.test(target.projectId||''))return null;
 const entry=projects.find(p=>p.workspaceId===workspaceId&&p.projectId===target.projectId);
 if(!entry||target.screenId&&!Object.hasOwn(entry.screens||{},target.screenId))return null;
 if(target.backModule&&!Object.hasOwn(entry.previewModules||{},target.backModule))return null;
 return target;
}
export function planningPreviewProject(index,context) {
 return planningPreviewTarget(index,context)?.projectId??null;
}
export function planningSelection(index,{workspaceId,projectId,screenId,elementId=null,elements=[]}) {
 const entry=index?.projects?.find(p=>p.workspaceId===workspaceId&&p.projectId===projectId),screen=entry?.screens?.[screenId];
 if(!screen||!Array.isArray(entry.sections))return null;
 let id=elementId,sectionId=screen.section;const seen=new Set();
 while(id&&!seen.has(id)){seen.add(id);if(Object.hasOwn(screen.elements||{},id)){sectionId=screen.elements[id];break;}id=elements.find(e=>e.id===id)?.parentId;}
 const section=[...entry.sections,...(entry.parts||[])].find(s=>s.id===sectionId);return section&&planningURL(entry.viewer,section.id)?{entry,section}:null;
}
export function planningPanelHTML(selection, compact=false) {
 if(!selection)return '';
 const {entry,section}=selection,url=planningURL(entry.viewer,section.id);
 if(compact)return `<button type="button" data-planning-open="${esc(url)}">작업 명세</button>`;
 const fields=section.fields||[{label:'내용',value:section.summary},...(section.lines||[]).map(value=>({label:'',value}))];
 return `<section class="planning-panel" aria-label="선택 작업 기획" style="margin:12px 0;padding:12px;border:1px solid #8b9ba7;border-radius:6px;font-size:13px;line-height:1.6;overflow-wrap:anywhere"><h3 style="font-size:15px;margin:0 0 10px">${esc(section.title)}</h3><dl style="margin:0 0 12px">${fields.filter(field=>field.value).map(field=>`<dt>${esc(field.label)}</dt><dd style="margin:2px 0 10px">${esc(field.value)}</dd>`).join('')}</dl><button type="button" data-planning-open="${esc(url)}">작업 명세</button></section>`;
}
let indexPromise;
export async function mountPlanningPanel(host,context) {
 if(!host)return;
 indexPromise??=readPlanningIndex();const index=await indexPromise;
 if(!host.isConnected)return;
 const entries=context.projectOverview?index.projects.filter(entry=>entry.workspaceId===context.workspaceId):[];
 host.innerHTML=context.projectOverview?entries.map(entry=>planningPanelHTML(planningSelection(index,{workspaceId:entry.workspaceId,projectId:entry.projectId,screenId:entry.overviewScreen}))).join(''):planningPanelHTML(planningSelection(index,context),context.compact);
 for(const button of host.querySelectorAll('[data-planning-open]'))button.addEventListener('click',event=>openPlanningDocument(event.currentTarget.dataset.planningOpen,host.ownerDocument,event.currentTarget.textContent));
}
export function openPlanningDocument(url,page=document,titleText='작업 명세') {
 // Callers can only open the registered local viewer path, never arbitrary iframe URLs.
 if(typeof url!=='string'||!url.startsWith('/ui-studio/source/guide/reference/'))return;
 const [viewer,section]=url.slice('/ui-studio/source/guide/reference/'.length).split('#');
 if(planningURL(viewer,section)!==url)return;
 const previous=page.activeElement,dialog=page.createElement('dialog');dialog.setAttribute('aria-label','선택 작업 기획서');
 dialog.style.cssText='width:min(1120px,calc(100vw - 24px));height:90dvh;max-height:90dvh;padding:0;border:1px solid #8999a5;background:#fff;color:#24313d;overflow:hidden';
 const header=page.createElement('header');header.style.cssText='display:flex;align-items:center;justify-content:space-between;padding:10px 16px';
 const title=page.createElement('strong');title.textContent=titleText;const close=page.createElement('button');close.type='button';close.textContent='닫기';close.onclick=()=>dialog.close();header.append(title,close);
 const iframe=page.createElement('iframe');iframe.title='로비 기획서 읽기';iframe.src=url;iframe.style.cssText='display:block;width:100%;height:calc(100% - 52px);border:0';
 dialog.append(header,iframe);page.body.append(dialog);dialog.addEventListener('keydown',event=>event.stopPropagation());dialog.addEventListener('close',()=>{dialog.remove();previous?.focus();},{once:true});dialog.showModal();close.focus();
}

export function planningActionsHTML(selection) {
 const {planningDocument,planningTab}=selection?.entry||{};
 if(typeof planningDocument==='string' && /^[A-Za-z0-9_-]+$/.test(planningDocument)){
  const tab=typeof planningTab==='string' && /^[a-z][a-z0-9-]*$/.test(planningTab) ? '#'+planningTab : '';
  return `<a class="planning-library-link" href="/ui-studio/source/guide/reference/kpop-planning/index.html?doc=${esc(planningDocument)}${tab}">UI 기획서</a>`;
 }
 const url=selection&&planningURL(selection.entry.originalViewer);
 return url?`<button type="button" data-planning-open="${esc(url)}">원본 기획서</button>`:'';
}
export async function mountPlanningActions(host,context) {
 if(!host)return;
 indexPromise??=readPlanningIndex();const index=await indexPromise;
 if(!host.isConnected)return;
 const relevant=index.projects.some(entry=>entry.workspaceId===context.workspaceId&&entry.projectId===context.projectId);
 const params=new URLSearchParams({workspace:context.workspaceId,project:context.projectId,screen:context.screenId||'main'});
 const library=relevant?` <a class="planning-library-link" href="/ui-studio/source/guide/reference/kpop-planning/index.html?${esc(params.toString())}">기획서 모음</a>`:'';
 host.innerHTML=planningActionsHTML(planningSelection(index,context))+library;
 for(const button of host.querySelectorAll('[data-planning-open]'))button.addEventListener('click',event=>openPlanningDocument(button.dataset.planningOpen,host.ownerDocument,button.textContent));
}
