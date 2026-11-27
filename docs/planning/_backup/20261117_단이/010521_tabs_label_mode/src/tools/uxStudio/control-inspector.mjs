import {createControl,validateControl} from './controls.mjs';
import {createSkin,skinSource} from './skins.mjs';

const types=[['','표시·일반 버튼'],['toggle','토글'],['tabs','선택 탭'],['toggle-group','단일 선택 목록'],['slider','슬라이더'],['scrollbar','스크롤바'],['dropdown','선택 상자'],['input','텍스트 입력']];
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const optionsType=type=>['tabs','toggle-group','dropdown'].includes(type);
const numericType=type=>['slider','scrollbar'].includes(type);

export function applyControlConfig(element,field,raw){
 const result=structuredClone(element);
 if(field==='type'){
  if(!raw){delete result.control;return result;}
  result.control=createControl(raw);return result;
 }
 const c=result.control;if(!c)throw Error('입력 종류를 먼저 선택하세요.');
 if(['disabled','readonly','required'].includes(field)){
  if(typeof raw!=='boolean')throw Error('켜짐·꺼짐 값을 확인하세요.');c[field]=raw;
 }else if(['min','max','step','maxLength'].includes(field)){
  if(String(raw).trim()==='')throw Error('숫자 값을 입력하세요.');c[field]=Number(raw);
 }else if(field==='value'){
  c.value=numericType(c.type)?Number(raw):raw;
 }else if(field==='options'){
  if(!optionsType(c.type)||typeof raw!=='string')throw Error('선택 항목 형식 오류');
  c.options=raw.split('\n').filter(line=>line.trim()).map(line=>{
   const split=line.indexOf('|');const value=(split<0?line:line.slice(0,split)).trim();
   const previous=c.options.find(o=>o.value===value);
   return {...previous,value,label:(split<0?line:line.slice(split+1)).trim()};
  });
  if(!c.options.some(o=>o.value===c.value&&!o.disabled))c.value=c.options.find(o=>!o.disabled)?.value??'';
 }else if(field.startsWith('panel.')&&c.type==='tabs'){
  const option=c.options.find(o=>o.value===field.slice(6));if(!option)throw Error('탭 항목을 확인하세요.');
  if(raw)option.panelId=raw;else delete option.panelId;
 }else if(field==='tabSkin.enabled'&&c.type==='tabs'){
  if(typeof raw!=='boolean')throw Error('켜짐·꺼짐 값을 확인하세요.');
  if(raw)c.tabSkin={...createSkin('button'),padding:[0,0,0,0]};else delete c.tabSkin;
 }else if(/^tabSkin\.(slices|edges)\.[13]$/.test(field)&&c.type==='tabs'&&c.tabSkin){
  const [,key,index]=field.split('.');if(String(raw).trim()==='')throw Error('숫자 값을 입력하세요.');c.tabSkin[key][Number(index)]=Number(raw);
 }else if(['group','orientation','placeholder','validation'].includes(field))c[field]=raw;
 else throw Error('지원하지 않는 입력 속성입니다.');
 validateControl(c);return result;
}

export function applyTabTexture(element,state,texture){
 if(element.control?.type!=='tabs'||!['normal','selected'].includes(state))throw Error('탭 이미지 상태를 확인하세요.');
 const result=structuredClone(element),c=result.control;
 c.tabSkin ||= {...createSkin('button'),padding:[0,0,0,0]};
 c.tabSkin.textures={...c.tabSkin.textures,[state]:texture};validateControl(c);return result;
}

export function controlInspectorHTML(element,screen={elements:[]}){
 const c=element.control;
 const field=(label,key,value,type='text',attrs='')=>`<label>${label}<input data-control-field="${esc(key)}" type="${type}" value="${esc(value)}" ${attrs}></label>`;
 const check=(label,key,value)=>`<label class="inline"><input data-control-field="${esc(key)}" type="checkbox" ${value?'checked':''}>${label}</label>`;
 const select=(label,key,value,choices)=>`<label>${esc(label)}<select data-control-field="${esc(key)}">${choices.map(([v,n])=>`<option value="${esc(v)}" ${v===value?'selected':''}>${esc(n)}</option>`).join('')}</select></label>`;
 let body=select('입력 종류','type',c?.type||'',types);
 if(c){
  const value=c.value??c.defaultValue;
  body+=numericType(c.type)?`<div class="field-grid">${field('최소값','min',c.min,'number')}${field('최대값','max',c.max,'number')}${field('간격','step',c.step,'number','step="any"')}${field('기본값','value',value,'number','step="any"')}</div>`:c.type==='toggle'?check('기본 켜짐','value',value):field('기본값','value',value);
  if(optionsType(c.type))body+=`<label>선택 항목 · 한 줄에 값 | 표시 이름<textarea data-control-field="options" rows="4">${esc(c.options.map(o=>o.value+' | '+o.label).join('\n'))}</textarea></label>`;
  if(c.type==='tabs'){
   const layers=screen.elements.filter(e=>e.id!==element.id);
   body+=c.options.map(o=>select(o.label+' · 본문','panel.'+o.value,o.panelId||'',[['','연결 안 함'],...layers.map(e=>[e.id,e.name+' · '+e.id])])).join('');
   body+=check('탭 프레임 · 3슬라이스','tabSkin.enabled',!!c.tabSkin);
   if(c.tabSkin){
    body+='<div class="field-grid">'+[1,3].map(i=>field('분할 '+(i===1?'우':'좌'),'tabSkin.slices.'+i,c.tabSkin.slices[i],'number','min="0" max="96"')+field('고정폭 '+(i===1?'우':'좌'),'tabSkin.edges.'+i,c.tabSkin.edges[i],'number','min="0" max="96"')).join('')+'</div>';
    for(const state of ['normal','selected']){
     const image=skinSource(c.tabSkin,state);
     body+=`<label>${state==='normal'?'기본':'선택'} 프레임 · 원본 ${image.w}×${image.h}px<input data-tab-project-image="${state}" placeholder="프로젝트 이미지 경로" value=""><input type="file" data-tab-image="${state}" accept="image/png,image/jpeg,image/webp"></label>`;
    }
   }
  }
  if(numericType(c.type))body+=select('방향','orientation',c.orientation||'horizontal',[['horizontal','가로'],['vertical','세로']]);
  if(c.type==='toggle')body+=field('단일 선택 그룹 · 비우면 독립','group',c.group||'');
  if(c.type==='input')body+=field('안내 문구','placeholder',c.placeholder||'')+field('최대 글자 수','maxLength',c.maxLength??1000,'number','min="1"')+select('입력 검사','validation',c.validation||'none',[['none','검사 없음'],['email','이메일'],['number','숫자']])+check('필수 입력','required',c.required);
  body+=check('사용 불가','disabled',c.disabled)+check('읽기 전용','readonly',c.readonly);
  body+='<p class="subtle">동작 시험과 저장 UI에서 실제 값을 조작합니다. 시험 중 값 변경은 설계 기본값을 바꾸지 않습니다.</p>';
 }
 return `<details class="control-inspector" ${c?'open':''}><summary>입력·선택 동작</summary>${body}</details>`;
}
