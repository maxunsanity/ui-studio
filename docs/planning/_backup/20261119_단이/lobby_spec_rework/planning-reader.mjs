import {readPlanningIndex} from './planning-panel.mjs';
const host=document.querySelector('#content');
const make=(tag,text)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;return node;};
const index=await readPlanningIndex();
const entry=index.projects.find(p=>location.pathname==='/ui-studio/source/guide/reference/'+p.viewer);
if(!entry){host.replaceChildren(make('p','기획서를 읽지 못했습니다. 창을 닫고 다시 열어 주세요.'));}
else {
 const notice=make('p','이 문서는 원문을 읽기 쉽게 정리한 보기입니다. 사용자 최신 지시에 따라 로비 1차만 합의된 것으로 표시합니다. 원문 속 과거 컨펌 표현을 2차 승인으로 적용하지 않습니다.');notice.className='notice';host.replaceChildren(notice);
 for(const section of entry.sections){
  const details=make('details');details.id=section.id;const summary=make('summary',section.title),body=make('div');body.className='body';body.append(make('p',section.summary));const list=make('ul');for(const line of section.lines||[])list.append(make('li',line));body.append(list);details.append(summary,body);host.append(details);
 }
 const evidence=make('details');evidence.id='evidence';evidence.append(make('summary','원문·근거·변경 이력'));const body=make('div');body.className='body';body.append(make('p','정리 기준: 2026-11-19 원문 v1.5. 원문 내용과 이미지의 보존 사본입니다. 추가 기능이나 새 발란스 값을 확정하지 않았습니다.'));
 const link=make('a','조사 기록과 원문 전체 보기 ↗');link.href='source.html';link.target='_blank';link.rel='noopener';body.append(link);evidence.append(body);host.append(evidence);
 const reveal=()=>{const id=location.hash.slice(1)||'overview',target=document.getElementById(id);if(target?.tagName==='DETAILS'){target.open=true;target.scrollIntoView({block:'start'});}};
 window.addEventListener('hashchange',reveal);reveal();
}
