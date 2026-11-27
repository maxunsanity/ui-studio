import {resolveTransform,transformStyles,validateTransform} from './rect-transform.mjs';

const positive=n=>Number.isFinite(n)&&n>0&&n<=10000;
const spacing=value=>Array.isArray(value)&&value.length===4&&value.every(n=>Number.isFinite(n)&&n>=0&&n<=10000);
const overflowStyles={visible:['visible','visible'],clip:['clip','clip'],'scroll-x':['auto','hidden'],'scroll-y':['hidden','auto'],'scroll-both':['auto','auto']};
export function validateLogicalSize(size) {
 if(!size||!positive(size.w)||!positive(size.h))throw Error('화면 논리 크기는 0보다 큰 10000px 이하 너비·높이여야 합니다.');
 return size;
}
export function validateResponsiveScreen(screen,{requireLogicalSize=false}={}) {
 if(requireLogicalSize||screen.logicalSize!==undefined)validateLogicalSize(screen.logicalSize);
 if(screen.safeArea!==undefined&&(!spacing(screen.safeArea)||screen.logicalSize&&(screen.safeArea[1]+screen.safeArea[3]>=screen.logicalSize.w||screen.safeArea[0]+screen.safeArea[2]>=screen.logicalSize.h)))throw Error('안전 여백과 남는 화면 크기를 확인하세요.');
 const elements=new Map(screen.elements.map(e=>[e.id,e]));
 for(const e of screen.elements){
  if(e.useSafeArea!==undefined&&(typeof e.useSafeArea!=='boolean'||e.useSafeArea&&e.parentId))throw Error('안전 영역 기준은 화면 직속 부품에만 사용할 수 있습니다.');
  if(e.overflow!==undefined&&!Object.hasOwn(overflowStyles,e.overflow))throw Error('지원하는 클리핑·스크롤 방식을 선택하세요.');
  if(e.rectTransform!==undefined){validateTransform(e.rectTransform);if(e.inset!==undefined)throw Error('앵커와 부모 맞춤 여백은 동시에 지정할 수 없습니다.');}
  if(e.layout?.type!==undefined){
   const l=e.layout;
   if(!['panel','list','card'].includes(e.kind)&&!e.isGroup&&!e.component)throw Error('자동 배치는 부모 컨테이너에만 지정하세요.');
   if(!l||!['horizontal','vertical','grid'].includes(l.type)||!Number.isFinite(l.gap)||l.gap<0||l.gap>10000||!spacing(l.padding)||!Array.isArray(l.itemSize)||l.itemSize.length!==2||!l.itemSize.every(positive)||l.type==='grid'&&(!Number.isSafeInteger(l.columns)||l.columns<1||l.columns>100)||Object.keys(l).some(key=>!['type','gap','padding','itemSize','columns'].includes(key)))throw Error('자동 배치는 방향·간격·네 여백·양수 고정 항목 크기와 그리드 열 수가 필요합니다.');
   if(e.menu)throw Error('메뉴 컨테이너와 자동 배치는 함께 사용하지 않습니다.');
  }
  if(elements.get(e.parentId)?.layout?.type&&(e.rectTransform!==undefined||e.inset!==undefined||e.useSafeArea))throw Error('자동 배치 자식의 앵커·부모 맞춤 여백·안전 영역을 먼저 해제하세요.');
 }
 if(requireLogicalSize)for(const e of screen.elements)resolveResponsiveRect(screen,e.id,screen.logicalSize.w,screen.logicalSize.h);
 return screen;
}
function positiveRect(rect){if(!['x','y','w','h'].every(k=>Number.isFinite(rect[k]))||rect.w<=0||rect.h<=0)throw Error('배치 결과는 유한한 위치와 양수 크기여야 합니다.');return rect;}
function safeBasis(screen,e,parent){
 if(!e.useSafeArea)return parent;
 const [t,r,b,l]=screen.safeArea||[0,0,0,0];
 return positiveRect({x:parent.x+l,y:parent.y+t,w:parent.w-l-r,h:parent.h-t-b});
}
function autoRect(screen,e,parent){
 const owner=screen.elements.find(p=>p.id===e.parentId),l=owner?.layout;
 if(!l?.type)return null;
 const index=screen.elements.filter(sibling=>sibling.parentId===e.parentId).findIndex(sibling=>sibling.id===e.id),[w,h]=l.itemSize;
 const col=l.type==='horizontal'?index:l.type==='grid'?index%l.columns:0,row=l.type==='vertical'?index:l.type==='grid'?Math.floor(index/l.columns):0;
 return {x:parent.x+l.padding[3]+col*(w+l.gap),y:parent.y+l.padding[0]+row*(h+l.gap),w,h};
}
export function responsiveContentSize(screen,element){
 const l=element.layout;if(!l?.type)return null;
 const rects=screen.elements.filter(e=>e.parentId===element.id).map(e=>autoRect(screen,e,{x:0,y:0,w:1,h:1}));
 return {w:Math.max(l.padding[3],...rects.map(r=>r.x+r.w))+l.padding[1],h:Math.max(l.padding[0],...rects.map(r=>r.y+r.h))+l.padding[2]};
}
export function resolveResponsiveRect(screen,id,width,height){
 const byId=new Map(screen.elements.map(e=>[e.id,e])),visiting=new Set(),memo=new Map();
 const resolve=id=>{
  if(memo.has(id))return memo.get(id);
  const e=byId.get(id);if(!e)throw Error('요소 없음');if(visiting.has(id))throw Error('부모 요소 순환입니다.');visiting.add(id);
  const parent=e.parentId?resolve(e.parentId):{x:0,y:0,w:width,h:height},p=safeBasis(screen,e,parent);
  let rect=autoRect(screen,e,parent);
  if(!rect&&e.rectTransform)rect=resolveTransform(p,e.rectTransform);
  if(!rect&&e.inset){const [t,r,b,l]=e.inset;rect={x:p.x+l,y:p.y+t,w:p.w-l-r,h:p.h-t-b};if(!screen.logicalSize){rect.w=Math.max(1,rect.w);rect.h=Math.max(1,rect.h);}}
  rect||={x:p.x+e.x*p.w/100,y:p.y+e.y*p.h/100,w:e.w*p.w/100,h:e.h*p.h/100};
  positiveRect(rect);visiting.delete(id);memo.set(id,rect);return rect;
 };
 return resolve(id);
}
export function responsiveParentRect(screen,e,width,height){return safeBasis(screen,e,e.parentId?resolveResponsiveRect(screen,e.parentId,width,height):{x:0,y:0,w:width,h:height});}
const calc=(fraction,px)=>`calc(${fraction*100}% ${px<0?'-':'+'} ${Math.abs(px)}px)`;
/** CSS uses the same parent-relative coefficients as resolveResponsiveRect, including on resize. */
export function responsiveStyles(screen,e){
 const style={},parent=screen.elements.find(p=>p.id===e.parentId),auto=parent?.layout?.type&&autoRect(screen,e,{x:0,y:0,w:1,h:1});
 if(auto)Object.assign(style,{left:auto.x+'px',top:auto.y+'px',width:auto.w+'px',height:auto.h+'px'});
 else if(e.rectTransform)Object.assign(style,transformStyles(e.rectTransform,e.useSafeArea?screen.safeArea:undefined));
 else if(e.useSafeArea){
  const [t,r,b,l]=screen.safeArea||[0,0,0,0];
  if(e.inset){const [it,ir,ib,il]=e.inset;Object.assign(style,{left:l+il+'px',top:t+it+'px',width:calc(1,-l-r-il-ir),height:calc(1,-t-b-it-ib)});}
  else Object.assign(style,{left:calc(e.x/100,l-(l+r)*e.x/100),top:calc(e.y/100,t-(t+b)*e.y/100),width:calc(e.w/100,-(l+r)*e.w/100),height:calc(e.h/100,-(t+b)*e.h/100)});
 }
 if(e.overflow!==undefined){const [overflowX,overflowY]=overflowStyles[e.overflow];Object.assign(style,{overflowX,overflowY});}
 return style;
}
