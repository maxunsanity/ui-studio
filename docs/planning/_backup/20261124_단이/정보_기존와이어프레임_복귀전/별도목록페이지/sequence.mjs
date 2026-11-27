import {mountSampleScreen, readSampleDesign} from '../../../sample-preview.mjs';
import {overviewURL} from '../../../overview-layout.mjs';

const workspaceId='workspace-cfa517bd-d9e1-40c4-aa1f-576e182500ba';
const profile='kpop-profile-ui';
const photo='import-6b577b09';
const presentationMode='detailed-wireframe';

// Modal rows carry the actual page used by the saved preview.
const flows=[
 ['idol','아이돌 기본 정보와 장비','멤버 정보 → 장비 보기. 포토카드와 로비에서도 공통 멤버 정보로 들어옵니다.',[
  [profile,'idol-info','멤버 정보'],[profile,'closet-set','장비 보기']]],
 ['idol-detail','아이돌 기본 정보 상세','멤버 정보에서 6축 성장 상세 또는 종합 능력 보기를 엽니다.',[
  [photo,'idol-ability-detail','6축 성장 상세'],[profile,'outfit-skills','아이돌 종합 능력','idol-info']]],
 ['equipment','아이돌 장비 상세','보유 장비를 누르면 상세 또는 비교가 열리고, 세트 착용에서는 전체 또는 보유 부위를 입힙니다.',[
  [profile,'outfit-owned','아이템 상세','closet-set'],[profile,'closet-try','현재 장비와 교체 장비 비교','closet-set'],
  [profile,'closet-try-set','전체·부분 세트 착용','closet-set'],[profile,'closet-set-applied','부분 착용 결과']]],
 ['team','팀 정보와 단체 의상','팀 정보 → 팀 단체 의상 → 세트와 대상 멤버 선택 → 적용 확인.',[
  [profile,'team-info','팀 기본 정보'],[photo,'team-picker','여러 팀에서 선택'],[profile,'team-info-ten','10인 포메이션'],
  [profile,'team-outfit','팀 단체 의상'],[profile,'team-set-picker','팀 세트 선택','team-outfit'],
  [profile,'team-confirm','적용 확인','team-outfit'],[profile,'team-applied','단체 의상 적용 결과']]],
 ['team-detail','팀 능력과 라포','팀 정보에서 팀 능력 자세히 또는 팀 라포를 엽니다.',[
  [photo,'team-ability-detail','팀 능력 상세'],[photo,'team','팀 라포']]],
 ['cards','포토카드','포토카드 목록 → 아이돌 정보 → 해당 아이돌 포토카드 → 카드 능력.',[
  [photo,'list','포토카드 목록'],[photo,'idol-card','오시온 포토카드'],[photo,'card-detail','개별 카드 능력','idol-card'],
  [photo,'idol-hanseoa-cards','한서아 포토카드']]],
 ['staff','스태프와 팬클럽','스태프 종합 → 선택한 스태프의 능력 상세. 카드 탭에서는 그 사람의 포토카드를 확인합니다.',[
  [photo,'staff-summary','스태프 종합'],[photo,'staff-ability-detail','김소리 능력 상세'],[photo,'staff-card','김소리 카드 12장'],
  [photo,'list-staff','포토카드 스태프 목록'],[photo,'list-chair','팬클럽 목록'],[photo,'chair-card','팬클럽 회장 포토카드']]],
 ['collection','카드 획득과 명함집','포토카드 목록에서 팩 보관함과 명함집으로 들어갑니다.',[
  [photo,'packs','포토카드 팩 보관함','list'],[photo,'book','명함집'],[photo,'scout','스카우트 팩','book']]],
];

const nav=document.querySelector('.info-main nav');
const content=document.querySelector('#flows');
const documents=new Map();
function getDesign(projectId){
  if(!documents.has(projectId))documents.set(projectId,readSampleDesign({workspaceId,projectId}));
  return documents.get(projectId);
}
function element(tag,text,className){
  const node=document.createElement(tag);
  if(text)node.textContent=text;
  if(className)node.className=className;
  return node;
}
function link(text,href,external=false){
  const node=element('a',text);
  node.href=href;
  if(external){node.target='_blank';node.rel='noopener';}
  return node;
}
async function render(preview,projectId,screenId){
  try{
    const {design}=await getDesign(projectId);
    mountSampleScreen(preview,design,{workspaceId,screenId,presentationMode});
    preview.dataset.loaded='true';
  }catch(error){preview.textContent=error.message;}
}
const observer=new IntersectionObserver(entries=>{
  for(const entry of entries){
    if(!entry.isIntersecting)continue;
    const preview=entry.target;
    observer.unobserve(preview);
    render(preview,preview.dataset.project,preview.dataset.screen);
  }
},{rootMargin:'200px'});

for(const [id,title,description,steps] of flows){
  nav.append(link(title,'#'+id));
  const section=element('section');
  section.id=id;
  const row=element('ol',null,'info-row');
  for(const [projectId,screenId,label,base] of steps){
    const item=element('li');
    const preview=element('div','불러오는 중','info-preview');
    preview.inert=true;
    Object.assign(preview.dataset,{project:projectId,screen:screenId});
    const actions=element('div',null,'info-actions');
    const params=new URLSearchParams({workspace:workspaceId,project:projectId,screen:base||screenId});
    if(base)params.set('overlay',screenId);
    actions.append(link('실행','/ui-studio/preview.html?'+params,true),
      link('편집',overviewURL('detail',{workspaceId,projectId,screenId,presentationMode}),true));
    item.append(element('h3',label),preview,actions);
    row.append(item);
    observer.observe(preview);
  }
  section.append(element('h2',title),element('p',description),row);
  content.append(section);
}
