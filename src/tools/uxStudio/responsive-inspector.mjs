import {clone,validateDocument,resolveRect} from './model.mjs';
import {encodeTransform} from './rect-transform.mjs';
import {responsiveParentRect,validateLogicalSize} from './responsive-layout.mjs';
const presets={
 'top-left':{min:[0,1],max:[0,1],pivot:[0,1]},'top-right':{min:[1,1],max:[1,1],pivot:[1,1]},
 'bottom-left':{min:[0,0],max:[0,0],pivot:[0,0]},'bottom-right':{min:[1,0],max:[1,0],pivot:[1,0]},
 center:{min:[.5,.5],max:[.5,.5],pivot:[.5,.5]},stretch:{min:[0,0],max:[1,1],pivot:[.5,.5]},
 'stretch-x':{min:[0,1],max:[1,1],pivot:[.5,1]},'stretch-y':{min:[0,0],max:[0,1],pivot:[0,.5]}
};
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const num=raw=>{if(!['number','string'].includes(typeof raw)||typeof raw==='string'&&!raw.trim())throw Error('배치 수치를 입력하세요.');const value=Number(raw);if(!Number.isFinite(value))throw Error('유한한 배치 수치를 입력하세요.');return value;};
/** Explicit property edits produce validated copies; opening the inspector never upgrades documents. */
export function applyResponsiveEdit(document,screenId,elementId,field,raw,logicalSize){
 const next=clone(document),screen=next.screens.find(s=>s.id===screenId),element=screen?.elements.find(e=>e.id===elementId);
 if(!screen)throw Error('편집할 화면이 없습니다.');
 const size=validateLogicalSize(logicalSize||screen.logicalSize||{w:390,h:844});
 if(/^screen\.logicalSize\.[wh]$/.test(field)){
  const key=field.slice('screen.logicalSize.'.length);
  screen.logicalSize=validateLogicalSize({...screen.logicalSize||size,[key]:num(raw)});
 }else if(field.startsWith('screen.safeArea.')){
  const index=Number(field.slice('screen.safeArea.'.length));if(!Number.isInteger(index)||index<0||index>3)throw Error('안전 여백 항목이 없습니다.');
  const value=num(raw);if(value!==0||screen.safeArea!==undefined){screen.safeArea=[...(screen.safeArea||[0,0,0,0])];screen.safeArea[index]=value;}
 }else{
  if(!element)throw Error('편집할 부품을 선택하세요.');
  const parentLayout=screen.elements.find(p=>p.id===element.parentId)?.layout?.type;
  if(field==='anchor.preset'){
   if(raw!=='percent'&&!Object.hasOwn(presets,raw))throw Error('지원하는 앵커 배치를 선택하세요.');
   if(parentLayout&&raw!=='percent')throw Error('자동 배치 자식은 앵커를 함께 사용하지 않습니다.');
   if(raw!=='percent'||element.rectTransform||element.inset){
    const rect=resolveRect(screen,element.id,size.w,size.h),parent=responsiveParentRect(screen,element,size.w,size.h);
    if(raw==='percent'){Object.assign(element,{x:(rect.x-parent.x)/parent.w*100,y:(rect.y-parent.y)/parent.h*100,w:rect.w/parent.w*100,h:rect.h/parent.h*100});delete element.rectTransform;}
    else{const p=presets[raw];element.rectTransform=encodeTransform(parent,rect,p.min,p.max,p.pivot);}
    delete element.inset;
   }
  }else if(/^rectTransform\.(min|max|pivot|position|sizeDelta)\.[01]$/.test(field)){
   if(!element.rectTransform)throw Error('먼저 고정 또는 늘림 앵커를 선택하세요.');
   const [,key,index]=field.split('.');element.rectTransform[key][Number(index)]=num(raw);
  }else if(field==='useSafeArea'){
   if(raw===true||raw==='true'){if(element.parentId)throw Error('안전 영역 기준은 화면 직속 부품에만 사용할 수 있습니다.');element.useSafeArea=true;}
   else if(raw===false||raw==='false')delete element.useSafeArea;else throw Error('안전 영역 기준을 선택하세요.');
  }else if(field==='overflow'){
   if(raw==='default')delete element.overflow;else element.overflow=raw;
  }else if(field==='scrollbar'){
   if(raw==='default')delete element.scrollbar;else element.scrollbar=raw;
  }else if(field==='scrollPin.mode'){
   if(raw==='none')delete element.scrollPin;
   else if(raw==='enabled')element.scrollPin||={top:0};
   else throw Error('스크롤 고정 사용 여부를 선택하세요.');
  }else if(field==='scrollPin.top'){
   if(!element.scrollPin)throw Error('먼저 세로 스크롤 고정을 켜세요.');
   element.scrollPin.top=num(raw);
  }else if(field==='layout.type'){
   if(raw==='none'){if(element.layout?.type)delete element.layout;}
   else{if(!['horizontal','vertical','grid'].includes(raw))throw Error('지원하는 자동 배치 방향을 선택하세요.');const current=element.layout?.type?element.layout:null;const rect=resolveRect(screen,element.id,size.w,size.h);element.layout={...(current||{gap:8,padding:[8,8,8,8],itemSize:[Math.max(1,Math.min(80,rect.w-16)),40]}),type:raw};if(raw==='grid')element.layout.columns=current?.columns||2;else delete element.layout.columns;}
  }else if(/^layout\.(gap|columns|padding\.[0-3]|itemSize\.[01])$/.test(field)){
   if(!element.layout?.type)throw Error('먼저 자동 배치 방향을 선택하세요.');
   const [,key,index]=field.split('.');if(index===undefined)element.layout[key]=num(raw);else element.layout[key][Number(index)]=num(raw);
  }else throw Error('지원하지 않는 배치 속성입니다.');
 }
 if(JSON.stringify(next)===JSON.stringify(document))return next;
 if(next.schemaVersion!==4){next.schemaVersion=4;for(const item of next.screens)item.logicalSize={...(item.logicalSize||size)};}
 // An edit is checked at its authored logical size as well as the active device profile.
 const checkedSize=field.startsWith('screen.logicalSize.')?screen.logicalSize:size;
 validateDocument(next);for(const item of screen.elements)resolveRect(screen,item.id,checkedSize.w,checkedSize.h);
 return next;
}
const input=(label,field,value,extra='')=>`<label>${esc(label)}<input type="number" ${extra.includes('step=')?'':'step="0.1"'} data-responsive-field="${field}" value="${esc(value)}" ${extra}></label>`;
const select=(label,field,value,options,extra='')=>`<label>${esc(label)}<select data-responsive-field="${field}" ${extra}>${options.map(([id,name])=>`<option value="${esc(id)}" ${id===value?'selected':''}>${esc(name)}</option>`).join('')}</select></label>`;
export function responsiveInspectorHTML(screen,element){
 const size=screen.logicalSize||{w:390,h:844};
 const safe=screen.safeArea||[0,0,0,0],safeHTML=safe.map((value,index)=>input('안전 여백 '+['위','오른쪽','아래','왼쪽'][index]+' px','screen.safeArea.'+index,value,'min="0" max="10000"')).join('');
 let html=`<details class="responsive-inspector"><summary>응답형 배치 · 안전 영역</summary><p class="subtle">축에 맞춘 2D 고정·늘림 앵커와 고정 크기 자동 배치를 지원합니다. 수치는 논리 px이며 앵커 Y는 아래에서 위로 증가합니다. 새 배치를 적용할 때만 설계 버전 4로 저장합니다.</p><p class="subtle">${screen.logicalSize?`저장 기준 ${esc(screen.logicalSize.w)} × ${esc(screen.logicalSize.h)} px`:'첫 적용 시 현재 기기의 논리 크기를 기록합니다.'}</p><fieldset><legend>현재 화면 논리 크기</legend>${input('논리 너비 px','screen.logicalSize.w',size.w,'min="0.1" max="10000"')}${input('논리 높이 px','screen.logicalSize.h',size.h,'min="0.1" max="10000"')}</fieldset><fieldset><legend>현재 화면 안전 여백</legend>${safeHTML}</fieldset>`;
 if(!element)return html+'<p>부품을 선택하면 앵커·자동 배치·스크롤을 설정할 수 있습니다.</p></details>';
 const autoParent=screen.elements.find(p=>p.id===element.parentId)?.layout?.type,t=element.rectTransform;
 let preset=t?Object.entries(presets).find(([,p])=>JSON.stringify([p.min,p.max,p.pivot])===JSON.stringify([t.min,t.max,t.pivot]))?.[0]||'custom':'percent';
 html+=select('안전 영역 기준','useSafeArea',element.useSafeArea?'true':'false',[['false','부모 전체'],['true','화면 안전 영역']],element.parentId?'disabled':'');
 html+=select('앵커','anchor.preset',preset,[['percent','기존 % 배치'],['top-left','왼쪽 위 고정'],['top-right','오른쪽 위 고정'],['bottom-left','왼쪽 아래 고정'],['bottom-right','오른쪽 아래 고정'],['center','가운데 고정'],['stretch','가로·세로 늘림'],['stretch-x','가로 늘림'],['stretch-y','세로 늘림'],...(preset==='custom'?[['custom','직접 설정']]:[])],autoParent?'disabled':'');
 if(t){for(const [key,label] of [['min','최소 앵커'],['max','최대 앵커'],['pivot','피벗'],['position','기준점 위치 px'],['sizeDelta','크기 차이 px']])html+=`<fieldset><legend>${label}</legend>${t[key].map((value,index)=>input(['X','Y'][index],`rectTransform.${key}.${index}`,value,['min','max','pivot'].includes(key)?'min="0" max="1"':'')).join('')}</fieldset>`;}
 if(autoParent)html+='<p class="subtle">이 부품은 부모의 자동 배치가 위치·크기를 정합니다. 수동 배치는 부모의 자동 배치를 해제한 뒤 조절하세요.</p>';
 html+=select('자식 자동 배치','layout.type',element.layout?.type||'none',[['none','수동 배치'],['horizontal','가로'],['vertical','세로'],['grid','고정 열 그리드']],!['panel','list','card'].includes(element.kind)&&!element.isGroup&&!element.component?'disabled':'');
 if(element.layout?.type){const l=element.layout;html+=input('항목 간격 px','layout.gap',l.gap,'min="0" max="10000"');html+=l.padding.map((value,index)=>input('내부 여백 '+['위','오른쪽','아래','왼쪽'][index]+' px','layout.padding.'+index,value,'min="0" max="10000"')).join('');html+=l.itemSize.map((value,index)=>input('고정 항목 '+['너비','높이'][index]+' px','layout.itemSize.'+index,value,'min="0.1" max="10000"')).join('');if(l.type==='grid')html+=input('고정 열 수','layout.columns',l.columns,'min="1" max="100" step="1"');}
 html+=select('영역 넘침','overflow',element.overflow||'default',[['default','기존 기본값 유지'],['visible','영역 밖 표시'],['clip','영역에서 자르기'],['scroll-x','가로 스크롤'],['scroll-y','세로 스크롤'],['scroll-both','가로·세로 스크롤']]);
 html+=select('브라우저 스크롤바','scrollbar',element.scrollbar||'default',[['default','기본 표시'],['hidden','숨김 · 스크롤 유지']]);
 html+=select('세로 스크롤 고정','scrollPin.mode',element.scrollPin?'enabled':'none',[['none','없음'],['enabled','켜짐']]);
 if(element.scrollPin)html+=input('스크롤 영역 위에서 고정 px','scrollPin.top',element.scrollPin.top,'min="0" max="10000"');
 return html+'<p class="subtle">자동 배치는 문서의 직속 자식 순서·고정 항목 크기를 사용하며 자식 앵커/부모 맞춤 여백과 혼합하지 않습니다. 안전 영역 기준은 화면 직속 부품에만 적용합니다. 스크롤·클리핑은 같은 DOM 영역의 표시와 입력에 함께 적용합니다. 회전·3D·전체 엔진 호환은 지원하지 않습니다.</p></details>';
}
