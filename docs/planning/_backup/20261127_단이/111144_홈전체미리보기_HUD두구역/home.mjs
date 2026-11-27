import {readHomeCatalog,openWorkspaceURL,copySampleToWorkspace} from './home-data.mjs';
import {overviewURL as designURL} from './overview-layout.mjs';
import {openProjectManager} from './project-manager.mjs';
import {openManual} from './manual.mjs';

export function mountHome(page=document,view=window) {
 const make=(tag,className='',text=null)=>{const node=page.createElement(tag);if(className)node.className=className;if(text!==null)node.textContent=text;return node;};
 const mark=(node,name,value='')=>{node.setAttribute(name,value);return node;};
 const button=(label,className='home-button')=>{const node=make('button',className,label);node.type='button';return node;};
 const link=(label,href,className='home-button')=>{const node=make('a',className,label);node.href=href;return node;};
 let catalog=null,pending=null,disposed=false;
 const fetcher=view.fetch?.bind(view)||fetch;
 page.body.className='home-page';page.title='UI 스튜디오';
 const skip=link('본문으로 이동','#home-main','home-skip');
 const header=make('header','home-header'),bar=make('div','home-header-inner');
 const brand=make('div','home-brand'),brandIcon=make('span','home-brand-icon');brandIcon.setAttribute('aria-hidden','true');brand.append(brandIcon,make('span','','UI 스튜디오'));
 const manual=mark(button('가이드','home-text-button'),'data-home-guide');
 bar.append(brand,manual);header.append(bar);
 const main=make('main','home-main');main.id='home-main';main.tabIndex=-1;
 const intro=make('div','home-intro');intro.append(make('h1','','무엇을 만들어 볼까요?'),make('p','','새로운 UI를 만들거나, 저장한 작업을 이어서 편집하세요.'));
 const entrances=make('nav','home-entrances');entrances.setAttribute('aria-label','시작하기');
 const entrance=(title,description,hint,kind)=>{
  const node=button(null,'home-entry home-entry-'+kind);
  const head=make('span','home-entry-heading'),icon=make('span','home-entry-icon',kind==='create'?'+':kind==='samples'?'▧':'?');icon.setAttribute('aria-hidden','true');
  head.append(icon,make('span','home-entry-title',title));
  node.append(head,make('span','home-entry-description',description),make('span','home-entry-hint',hint));return node;
 };
 const create=mark(entrance('제작하기','내 프로젝트 폴더에서 새로운 UI를 만드세요.','폴더 선택 →','create'),'data-home-create');
 const browse=mark(entrance('샘플 보기','참고용 예제를 둘러보고 사본으로 시작하세요.','샘플 살펴보기 ↓','samples'),'data-home-browse');
 const guide=mark(entrance('가이드','제작 도구와 사용 순서를 확인하세요.','사용법 보기 →','guide'),'data-home-guide-entry');entrances.append(create,browse,guide);
 const status=mark(make('p','home-status'),'data-home-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 const workSection=make('section','home-section'),workHeading=make('div','home-section-heading'),workTitle=make('div');
 const workH2=make('h2','','내 작업');workH2.id='home-work-title';workSection.setAttribute('aria-labelledby',workH2.id);workTitle.append(workH2,make('p','','내 폴더에 저장한 제작 프로젝트입니다.'));
 const refreshButton=mark(button('새로 읽기','home-text-button'),'data-home-refresh');workHeading.append(workTitle,refreshButton);
 const workHost=mark(make('div','home-card-grid'),'data-home-work');workSection.append(workHeading,workHost);
 const sampleSection=make('section','home-section home-sample-section');sampleSection.id='home-samples';sampleSection.tabIndex=-1;
 const sampleHeading=make('div','home-section-heading'),sampleTitle=make('div'),sampleH2=make('h2','','샘플');sampleH2.id='home-samples-title';sampleSection.setAttribute('aria-labelledby',sampleH2.id);
 sampleTitle.append(sampleH2,make('p','','참고용 예제입니다. 사본으로 제작하면 내 작업에 저장됩니다.'));sampleHeading.append(sampleTitle);
 const sampleHost=mark(make('div','home-card-grid'),'data-home-samples');sampleSection.append(sampleHeading,sampleHost);
 main.append(intro,entrances,status,workSection,sampleSection);page.body.replaceChildren(skip,header,main);

 const showError=error=>{if(!disposed){status.textContent=error?.message||String(error);status.setAttribute('data-state','error');}};
 const action=run=>async()=>{try{return await run();}catch(error){showError(error);}};
 const openGuide=action(()=>openManual());manual.onclick=openGuide;guide.onclick=openGuide;
 const folderOptions=()=>({workOnly:true,isDirty:()=>false,save:async()=>true,guide:openGuide,navigate:async(workspaceId,copied=null,{isActive=()=>true}={})=>{
  if(copied){if(isActive())view.location.href=designURL('detail',{workspaceId,projectId:copied.projectId});return;}
  const value=await readHomeCatalog(fetcher);
  if(disposed||!isActive())return;
  catalog=value;
  const entry=value.work.find(item=>item.workspace.id===workspaceId);
  if(!entry)throw Error('내 작업 폴더를 다시 확인해 주세요.');
  view.location.href=openWorkspaceURL(entry);
 }});
 const chooseFolder=action(()=>openProjectManager({...folderOptions(),title:'제작할 폴더 선택'}));create.onclick=chooseFolder;
 browse.onclick=()=>{sampleSection.scrollIntoView({block:'start'});sampleSection.focus({preventScroll:true});};
 const copySample=entry=>openProjectManager({...folderOptions(),copyOnly:true,title:'사본으로 제작할 폴더 선택',copyToWorkspace:async workspaceId=>{
  const {document}=await copySampleToWorkspace(entry,workspaceId,fetcher);
  return document;
 }});
 const empty=(host,title,description,cta=null)=>{
  const box=make('div','home-empty');box.append(make('h3','',title),make('p','',description));
  if(cta){const choose=button(cta,'home-button home-primary');choose.onclick=chooseFolder;box.append(choose);}host.append(box);
 };
 const card=(entry,kind)=>{
  const sample=kind==='sample',workspace=entry.workspace,design=entry.designs[0]||null;
  const row=mark(mark(make('article','home-project-card'),'data-home-cardkind',kind),'cardkind',kind);
  const cardTop=make('div','home-card-top'),badge=make('span','home-kind home-kind-'+kind,sample?'참고용 · 제작 중':'작업');
  const title=entry.title||workspace.name;
  const error=entry.error||(workspace.unavailable?'폴더를 읽을 수 없습니다. 위치를 다시 확인해 주세요.':null);
  const workMenu=entry.workMenu?.length?entry.workMenu:null;
  const options=workMenu||entry.designs;
  const canChoose=!sample&&!error&&workspace.conversionDecision!=='pending'&&(options.length>1||Boolean(workMenu));
  cardTop.append(badge);row.append(cardTop,make('h3','home-card-title',title));
  const path=make('p','home-folder-path',workspace.directory);path.setAttribute('aria-label','프로젝트 폴더: '+workspace.directory);row.append(path);
  const info=make('div','home-card-info');info.append(make('p','home-design-count',canChoose&&workMenu?'현재 작업 '+workMenu.length+'개':'저장 설계 '+entry.designs.length+'개'));
  if(design&&!canChoose)info.append(make('p','home-design-name',design.name+' · r'+design.revision));
  else if(!design&&!entry.error&&!workspace.unavailable)info.append(make('p','home-design-name',sample?'저장한 설계가 아직 없습니다.':'아직 저장한 설계가 없습니다.'));
  row.append(info);
  if(canChoose){
   const group=make('div','home-work-group'),menu=make('nav','home-work-menu');
   menu.setAttribute('aria-label',title+' 작업 메뉴');
   const list=make('ul','home-design-options');
   for(const saved of options){
    const item=make('li');
    const caption=saved.label||saved.name+' · r'+saved.revision;
    const target=designURL('overview',{workspaceId:workspace.id,projectId:saved.id,presentationMode:saved.view});
    item.append(link(caption,target,'home-design-option'));
    list.append(item);
   }
   const hud=workMenu?.find(saved=>saved.label==='HUD');
   if(hud){
    const target=designURL('preview',{workspaceId:workspace.id,projectId:hud.id,presentationMode:hud.view});
    const preview=mark(link('미리보기',target,'home-button home-primary home-work-preview'),'data-home-preview');
    preview.target='_blank';
    preview.rel='noopener';
    preview.setAttribute('aria-label','HUD 로비 미리보기 (새 탭)');
    menu.append(preview);
   }
   menu.append(list);group.append(row,menu);return group;
  }
  if(error)row.append(make('p','home-card-error',error));
  const actions=make('div','home-card-actions');
  if(sample){
   let url=null;if(design&&!error)try{url=designURL('overview',{workspaceId:workspace.id,projectId:design.id});}catch(reason){row.append(make('p','home-card-error',reason.message));}
   if(url)actions.append(link('샘플 보기',url));else{const unavailable=button('샘플 보기');unavailable.disabled=true;actions.append(unavailable);}
   const copy=button('사본으로 제작','home-button home-primary');copy.disabled=!url;copy.onclick=action(()=>copySample(entry));actions.append(copy);
  }else if(error){
   const retry=button('다시 읽기');retry.onclick=()=>refresh();const locate=button('폴더 다시 선택','home-button home-primary');locate.onclick=chooseFolder;actions.append(retry,locate);
  }else{
   const label=design?'이어서 편집':'새 설계';
   if(workspace.conversionDecision==='pending'){const open=button(label,'home-button home-primary');open.onclick=chooseFolder;actions.append(open);}
   else try{actions.append(link(label,openWorkspaceURL(entry),'home-button home-primary'));}catch(reason){const unavailable=button(label,'home-button home-primary');unavailable.disabled=true;actions.append(unavailable);row.append(make('p','home-card-error',reason.message));}
  }
  row.append(actions);
  return row;
 };
 function render(value){
  workHost.replaceChildren();sampleHost.replaceChildren();
  for(const entry of value.work)workHost.append(card(entry,'work'));
  if(!value.work.length)empty(workHost,'아직 내 작업이 없어요','프로젝트 폴더를 선택하면 이곳에서 이어서 작업할 수 있어요.','폴더 선택하기');
  for(const entry of value.samples)sampleHost.append(card(entry,'sample'));
  if(!value.samples.length)empty(sampleHost,'등록된 샘플이 없습니다.','샘플을 등록한 뒤 새로 읽기를 눌러 주세요.');
 }
 function refresh(){
  if(disposed)return Promise.resolve();if(pending)return pending;
  refreshButton.disabled=true;workSection.setAttribute('aria-busy','true');sampleSection.setAttribute('aria-busy','true');status.setAttribute('data-state','loading');status.textContent='프로젝트를 불러오는 중…';
  if(!catalog){workHost.replaceChildren(make('p','home-loading','내 작업을 읽고 있어요…'));sampleHost.replaceChildren(make('p','home-loading','샘플을 읽고 있어요…'));}
  pending=(async()=>{
   try{const value=await readHomeCatalog(fetcher);if(disposed)return;catalog=value;render(value);status.textContent='';status.setAttribute('data-state','ready');}
   catch(error){if(disposed)return;workHost.replaceChildren();sampleHost.replaceChildren();empty(workHost,'내 작업을 읽지 못했어요','새로 읽기를 누르거나 프로젝트 폴더를 다시 선택해 주세요.','폴더 선택하기');empty(sampleHost,'샘플을 읽지 못했어요','새로 읽기를 눌러 다시 확인해 주세요.');showError(error);}
   finally{pending=null;if(!disposed){refreshButton.disabled=false;workSection.setAttribute('aria-busy','false');sampleSection.setAttribute('aria-busy','false');}}
  })();return pending;
 }
 refreshButton.onclick=()=>refresh();
 const ready=refresh();
 return {ready,refresh,dispose(){disposed=true;}};
}
