import {readPlanningIndex} from './planning-panel.mjs';
const host=document.querySelector('#content');
const make=(tag,text)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;return node;};
function fieldsNode(fields){const list=make('dl');for(const field of fields||[]){if(!field.value)continue;list.append(make('dt',field.label),make('dd',field.value));}return list;}
function detail(title,id){const node=make('details');if(id)node.id=id;const body=make('div');body.className='body';node.append(make('summary',title),body);return {node,body};}
const index=await readPlanningIndex(),entry=index.projects.find(p=>location.pathname==='/ui-studio/source/guide/reference/'+p.viewer);
if(!entry){host.replaceChildren(make('p','기획서를 읽지 못했습니다. 창을 닫고 다시 열어 주세요.'));}
else {
 host.replaceChildren();
 for(const section of entry.sections){
  const {node,body}=detail(section.title,section.id);body.append(fieldsNode(section.fields||[{label:'내용',value:section.summary},...(section.lines||[]).map(value=>({label:'',value}))]));
  for(const part of (entry.parts||[]).filter(p=>p.area===section.id)){
   const item=detail(part.title,part.id);item.body.append(fieldsNode(part.fields));
   const source=detail('데이터·원문 근거');source.body.append(fieldsNode(part.sourceFields));item.body.append(source.node);body.append(item.node);
  }
  for(const table of section.tables||[]){
   const group=detail(table.title+' · 항목별 상세');
   for(const row of table.rows){const item=detail(row[0]||'항목');item.body.append(fieldsNode(table.headers.slice(1).map((label,i)=>({label,value:row[i+1]}))));group.body.append(item.node);}
   body.append(group.node);
  }
  node.append(body);host.append(node);
 }
 const evidence=detail('전체 원문·변경 이력','evidence');evidence.body.append(make('p','2026-11-19 v1.5 원문과 그림의 보존 사본입니다. 원문의 제안·과거 결정 기록을 함께 확인할 수 있습니다.'));
 const link=make('a','전체 원문 보기 ↗');link.href='source.html';link.target='_blank';link.rel='noopener';evidence.body.append(link);host.append(evidence.node);
 const reveal=()=>{const target=document.getElementById(location.hash.slice(1)||'overview');if(target?.tagName==='DETAILS'){for(let parent=target;parent;parent=parent.parentElement)if(parent.tagName==='DETAILS')parent.open=true;target.scrollIntoView({block:'start'});}};
 window.addEventListener('hashchange',reveal);reveal();
}
