import {scopeURL,scopedKey} from './project-manager.mjs';
import {workspaceKind} from './workspace-kind.mjs';
import {readPlanningIndex} from './planning-panel.mjs';
const ID=/^[a-z][a-z0-9-]{0,63}$/,DESIGN_ID=/^[a-z][a-z0-9-]{0,47}$/;
function checkedWorkspace(meta){
 if(!meta||!ID.test(meta.id||'')||typeof meta.name!=='string'||!meta.name.trim()||typeof meta.directory!=='string'||!meta.directory.startsWith('/')||/[\x00-\x1f]/.test(meta.directory))throw Error('프로젝트 폴더 목록의 이름·경로·ID를 확인하세요.');
 return meta;
}
function checkedDesigns(items){
 if(!Array.isArray(items)||items.some(p=>!p||!DESIGN_ID.test(p.id||'')||typeof p.name!=='string'||!Number.isSafeInteger(p.revision)||p.revision<0)||new Set(items.map(p=>p.id)).size!==items.length)throw Error('저장 설계 목록 형식을 확인하세요.');
 return items;
}
async function request(fetcher,path,options){
 const response=await fetcher(path,{cache:'no-store',...options});
 let body;try{body=await response.json();}catch{throw Error('응답 형식을 확인하세요 (HTTP '+response.status+').');}
 if(!response.ok)throw Error(body?.error||'프로젝트를 읽지 못했습니다 (HTTP '+response.status+').');
 return body;
}
export function isHomeEntry(href){
 const url=new URL(href,'http://127.0.0.1');
 return url.pathname==='/ui-studio/'&&!url.searchParams.has('workspace')&&!url.searchParams.has('project')&&url.searchParams.get('editor')!=='detail';
}
export function openWorkspaceURL(entry){
 const workspace=checkedWorkspace(entry?.workspace);
 if(workspace.unavailable||entry.error)throw Error(entry.error||'프로젝트 폴더를 읽을 수 없습니다.');
 const design=checkedDesigns(entry.designs||[])[0];
 const url=new URL(design?'/ui-studio/canvas.html':'/ui-studio/?editor=detail','http://127.0.0.1');
 if(design)url.searchParams.set('project',design.id);
 return scopeURL(url.pathname+url.search,workspace.id);
}
function rememberedProject(workspaceId){
 try{return globalThis.localStorage?.getItem(scopedKey('ux-studio.last-project',workspaceId));}catch{return null;}
}
export async function readHomeCatalog(fetcher=globalThis.fetch,{preferredProject=rememberedProject}={}){
 const body=await request(fetcher,'/api/ux-studio/workspaces');
 if(!Array.isArray(body.workspaces))throw Error('프로젝트 폴더 목록을 확인하세요.');
 const workspaces=body.workspaces.map(checkedWorkspace);
 if(new Set(workspaces.map(meta=>meta.id)).size!==workspaces.length)throw Error('프로젝트 폴더 ID가 중복되었습니다.');
 let research=[];
 try{const data=await request(fetcher,'/ui-studio/source/project-research.json');if(Array.isArray(data.projects))research=data.projects;}catch{/* Optional research titles do not prevent opening work. */}
 const planned=await readPlanningIndex(fetcher);
 const result={work:[],samples:[],hidden:[]};
 const entries=await Promise.all(workspaces.map(async workspace=>{
  const kind=workspaceKind(workspace.directory);
  const entry={workspace,title:research.find(p=>p.directory===workspace.directory)?.title||workspace.name,designs:[],error:null,kind};
  if(kind==='fixture')return entry;
  if(workspace.unavailable){entry.error='폴더를 읽을 수 없습니다. 폴더 위치를 확인하세요.';return entry;}
  try{
   entry.designs=checkedDesigns((await request(fetcher,scopeURL('/api/ux-studio/projects',workspace.id))).projects);
   if(kind==='project'){
    const menu=planned.projects.filter(project=>project.workspaceId===workspace.id&&typeof project.homeMenuLabel==='string'&&project.homeMenuLabel.trim());
    entry.workMenu=menu.flatMap(project=>{
     const saved=entry.designs.find(design=>design.id===project.projectId);
     return saved?[{...saved,label:project.homeMenuLabel}]:[];
    });
   }
   const preferred=preferredProject(workspace.id),index=entry.designs.findIndex(item=>item.id===preferred);
   if(index>0)entry.designs=[entry.designs[index],...entry.designs.filter((_,i)=>i!==index)];
  }catch(error){entry.error=error.message||String(error);}
  return entry;
 }));
 for(const entry of entries)result[entry.kind==='fixture'?'hidden':entry.kind==='sample'?'samples':'work'].push(entry);
 return result;
}
export async function copySampleToWorkspace(entry,targetWorkspaceId,fetcher=globalThis.fetch){
 const source=checkedWorkspace(entry?.workspace),selected=checkedDesigns(entry.designs||[])[0];
 if(workspaceKind(source.directory)!=='sample'||!selected)throw Error('복사할 샘플 설계를 확인하세요.');
 if(!ID.test(targetWorkspaceId||'')||source.id===targetWorkspaceId)throw Error('샘플과 다른 내 작업 폴더를 선택하세요.');
 const target=checkedWorkspace((await request(fetcher,scopeURL('/api/ux-studio/workspace',targetWorkspaceId))).workspace);
 if(target.id!==targetWorkspaceId||target.unavailable||workspaceKind(target.directory)!=='project')throw Error('샘플이나 시험 폴더 대신 내 작업 폴더를 선택하세요.');
 if(target.conversionDecision==='pending')throw Error('기존 UI 변환 여부를 먼저 선택하세요.');
 const {validateDocument}=await import('./model.mjs');
 const original=validateDocument((await request(fetcher,scopeURL('/api/ux-studio/project?id='+encodeURIComponent(selected.id),source.id))).document);
 if(original.projectId!==selected.id)throw Error('선택 샘플의 설계 ID가 다릅니다.');
 const document=structuredClone(original);
 document.projectId='ux-'+globalThis.crypto.randomUUID().slice(0,8);document.revision=0;document.name+=' · 사본';
 validateDocument(document);
 const {copyDocumentAssets}=await import('./asset-client.mjs');
 await copyDocumentAssets(document,source.id,targetWorkspaceId,fetcher);
 const result=await request(fetcher,scopeURL('/api/ux-studio/project',targetWorkspaceId),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({document,expectedRevision:null})});
 validateDocument(result.document);
 if(result.document.projectId!==document.projectId)throw Error('사본 저장 응답의 설계 ID가 다릅니다.');
 return result;
}
