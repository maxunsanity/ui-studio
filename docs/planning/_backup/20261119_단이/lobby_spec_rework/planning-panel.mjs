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
export function planningSelection(index,{workspaceId,projectId,screenId,elementId=null,elements=[]}) {
 const entry=index?.projects?.find(p=>p.workspaceId===workspaceId&&p.projectId===projectId),screen=entry?.screens?.[screenId];
 if(!screen||!Array.isArray(entry.sections))return null;
 let id=elementId,sectionId=screen.section;const seen=new Set();
 while(id&&!seen.has(id)){seen.add(id);if(Object.hasOwn(screen.elements||{},id)){sectionId=screen.elements[id];break;}id=elements.find(e=>e.id===id)?.parentId;}
 const section=entry.sections.find(s=>s.id===sectionId);return section&&planningURL(entry.viewer,section.id)?{entry,section}:null;
}
export function planningPanelHTML(selection) {
 if(!selection)return '';
 const {entry,section}=selection,url=planningURL(entry.viewer,section.id);
 return `<section class="planning-panel" aria-label="선택 작업 기획" style="margin:12px 0;padding:12px;border:1px solid #8b9ba7;border-radius:6px;font-size:13px;line-height:1.6;overflow-wrap:anywhere"><small>기획 · ${esc(entry.title)}</small><p style="font-weight:700">${esc(entry.status)}</p><h3 style="font-size:15px;margin:8px 0">${esc(section.title)}</h3><p>${esc(section.summary)}</p><ul style="padding-left:18px">${(section.lines||[]).map(line=>`<li>${esc(line)}</li>`).join('')}</ul><button type="button" data-planning-open="${esc(url)}">기획서 열기</button> <a href="${esc(url)}" target="_blank" rel="noopener">새 창 ↗</a></section>`;
}
let indexPromise;
export async function mountPlanningPanel(host,context) {
 if(!host)return;
 indexPromise??=readPlanningIndex();const index=await indexPromise;
 if(!host.isConnected)return;
 const entries=context.projectOverview?index.projects.filter(entry=>entry.workspaceId===context.workspaceId):[];
 host.innerHTML=context.projectOverview?entries.map(entry=>planningPanelHTML(planningSelection(index,{workspaceId:entry.workspaceId,projectId:entry.projectId,screenId:entry.overviewScreen}))).join(''):planningPanelHTML(planningSelection(index,context));
 host.querySelector('[data-planning-open]')?.addEventListener('click',event=>openPlanningDocument(event.currentTarget.dataset.planningOpen,host.ownerDocument));
}
export function openPlanningDocument(url,page=document) {
 // Callers can only open the registered local viewer path, never arbitrary iframe URLs.
 if(typeof url!=='string'||!url.startsWith('/ui-studio/source/guide/reference/'))return;
 const [viewer,section]=url.slice('/ui-studio/source/guide/reference/'.length).split('#');
 if(planningURL(viewer,section)!==url)return;
 const previous=page.activeElement,dialog=page.createElement('dialog');dialog.setAttribute('aria-label','선택 작업 기획서');
 dialog.style.cssText='width:min(1120px,calc(100vw - 24px));height:90dvh;max-height:90dvh;padding:0;border:1px solid #8999a5;background:#fff;color:#24313d;overflow:hidden';
 const header=page.createElement('header');header.style.cssText='display:flex;align-items:center;justify-content:space-between;padding:10px 16px';
 const title=page.createElement('strong');title.textContent='작업 기획서';const close=page.createElement('button');close.type='button';close.textContent='닫기';close.onclick=()=>dialog.close();header.append(title,close);
 const iframe=page.createElement('iframe');iframe.title='로비 기획서 읽기';iframe.src=url;iframe.style.cssText='display:block;width:100%;height:calc(100% - 52px);border:0';
 dialog.append(header,iframe);page.body.append(dialog);dialog.addEventListener('keydown',event=>event.stopPropagation());dialog.addEventListener('close',()=>{dialog.remove();previous?.focus();},{once:true});dialog.showModal();close.focus();
}
