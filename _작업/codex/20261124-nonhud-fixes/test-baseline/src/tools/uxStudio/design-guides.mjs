import {resolveRect} from './model.mjs';
import {responsiveParentRect} from './responsive-layout.mjs';
const rect=(x,y,w,h)=>({x,y,w,h});
const pct=(r,p)=>rect(r.x/p.w*100,r.y/p.h*100,r.w/p.w*100,r.h/p.h*100);
const difference=(r,p)=>rect(r.x-p.x,r.y-p.y,r.w,r.h);
/** Logical design measurements, independent of editor zoom. Never changes the document. */
export function buildDesignGuide(document,screenId,elementId=null,size={}){
 const screen=document.screens.find(s=>s.id===screenId);if(!screen)throw Error('Guide screen / 화면이 없습니다.');
 const basis=screen.logicalSize||document.designBasis?.logicalSize||{w:390,h:844};
 const width=size.width??size.w??basis.width??basis.w,height=size.height??size.h??basis.height??basis.h;
 if(!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0)throw Error('Guide size / 크기를 확인하세요.');
 const screenRect=rect(0,0,width,height),byId=new Map(screen.elements.map(e=>[e.id,e]));
 if(byId.size!==screen.elements.length)throw Error('Guide unit IDs are duplicated.');
 const root={id:null,name:screen.name,kind:screen.kind,parentId:null,rect:screenRect,parentRect:null,relative:screenRect,parentPercent:rect(0,0,100,100),screenPercent:rect(0,0,100,100),margins:{top:0,right:0,bottom:0,left:0},font:null,depth:0};
 function ancestry(e){const list=[],seen=new Set([e.id]);let id=e.parentId;while(id){if(seen.has(id))throw Error('Guide parent cycle / 순환 관계');seen.add(id);const p=byId.get(id);if(!p)throw Error('Guide parent unit / 부모 부품이 없습니다.');list.unshift(p);id=p.parentId;}return list;}
 const cache=new Map();
 function record(e){
  if(cache.has(e.id))return cache.get(e.id);
  const ancestors=ancestry(e),r=resolveRect(screen,e.id,width,height),p=responsiveParentRect(screen,e,width,height);
  if(![r.x,r.y,r.w,r.h,p.x,p.y,p.w,p.h].every(Number.isFinite)||p.w<=0||p.h<=0)throw Error('Guide unit size is invalid.');
  const relative=difference(r,p),t=e.typography||{};
  const result={id:e.id,name:e.name,kind:e.kind,partRole:e.partRole||null,parentId:e.parentId||null,rect:r,parentRect:p,relative,parentPercent:pct(relative,p),screenPercent:pct(r,screenRect),margins:{top:relative.y,right:p.w-relative.x-r.w,bottom:p.h-relative.y-r.h,left:relative.x},font:e.kind==='text'||e.text?{sizePx:e.fontSize||16,source:e.fontSize?'explicit':'renderer-default',family:t.family||'renderer-default',weight:t.weight??null,lineHeight:t.lineHeight??null,letterSpacing:t.letterSpacing??null,align:t.align||'renderer-default',vertical:t.vertical||'renderer-default',wrap:t.wrap||'renderer-default',overflow:t.overflow||'renderer-default'}:null,depth:ancestors.length,basis:e.useSafeArea?'safe-area':'parent'};
  cache.set(e.id,result);return result;
 }
 const original=elementId===null?null:byId.get(elementId);if(elementId!==null&&!original)throw Error('Guide unit / 부품이 없습니다.');
 if(original)ancestry(original);
 const unit=original?record(original):root;
 const included=new Set(original?[original.id]:screen.elements.map(e=>e.id));
 if(original){let changed=true;while(changed){changed=false;for(const e of screen.elements)if(e.parentId&&included.has(e.parentId)&&!included.has(e.id)){included.add(e.id);changed=true;}}}
 const elements=screen.elements.filter(e=>included.has(e.id)).map(record);
 const children=screen.elements.filter(e=>(e.parentId||null)===elementId).map(record);
 const ancestors=original?ancestry(original).map(record):[];
 const parent=original?(original.parentId?record(byId.get(original.parentId)):root):null;
 const dimensions=[],u=unit.rect,paintRole=e=>['background','frame'].includes(e.partRole);
 const add=(key,kind,axis,x1,y1,x2,y2,label)=>{const valuePx=axis==='x'?x2-x1:y2-y1,span=axis==='x'?u.w:u.h;dimensions.push({key,kind,axis,x1,y1,x2,y2,valuePx,valuePercent:span?valuePx/span*100:0,label});};
 add('unit-width','size','x',u.x,u.y-20,u.x+u.w,u.y-20,'유닛 너비');
 add('unit-height','size','y',u.x-20,u.y,u.x-20,u.y+u.h,'유닛 높이');
 const contents=children.filter(e=>!paintRole(e));
 if(contents.length){
  const left=Math.min(...contents.map(e=>e.rect.x)),top=Math.min(...contents.map(e=>e.rect.y)),right=Math.max(...contents.map(e=>e.rect.x+e.rect.w)),bottom=Math.max(...contents.map(e=>e.rect.y+e.rect.h));
  add('content-left','padding','x',u.x,u.y+u.h+16,left,u.y+u.h+16,'내용 왼쪽 여백');
  add('content-right','padding','x',right,u.y+u.h+16,u.x+u.w,u.y+u.h+16,'내용 오른쪽 여백');
  add('content-top','padding','y',u.x+u.w+16,u.y,u.x+u.w+16,top,'내용 위 여백');
  add('content-bottom','padding','y',u.x+u.w+16,bottom,u.x+u.w+16,u.y+u.h,'내용 아래 여백');
 }
 // Nearest neighbours on each axis; overlapping background/frame is never a gap.
 for(const axis of ['x','y'])for(const a of contents){
  const cross=axis==='x'?'y':'x',length=axis==='x'?'w':'h',crossLength=axis==='x'?'h':'w',end=a.rect[axis]+a.rect[length];
  const candidates=contents.filter(b=>b.id!==a.id&&b.rect[axis]>=end-1e-9&&Math.min(a.rect[cross]+a.rect[crossLength],b.rect[cross]+b.rect[crossLength])-Math.max(a.rect[cross],b.rect[cross])>1e-9).sort((b,c)=>b.rect[axis]-c.rect[axis]);
  if(!candidates.length)continue;const b=candidates[0],position=(Math.max(a.rect[cross],b.rect[cross])+Math.min(a.rect[cross]+a.rect[crossLength],b.rect[cross]+b.rect[crossLength]))/2;
  add('gap-'+axis+'-'+a.id+'-'+b.id,'gap',axis,...(axis==='x'?[end,position,b.rect.x,position]:[position,end,position,b.rect.y]),a.name+' → '+b.name+' 간격');
 }
 const all=[unit,...elements],x=Math.min(...all.map(e=>e.rect.x)),y=Math.min(...all.map(e=>e.rect.y)),right=Math.max(...all.map(e=>e.rect.x+e.rect.w)),bottom=Math.max(...all.map(e=>e.rect.y+e.rect.h));
 return {screen:{id:screen.id,name:screen.name,width,height},unit,parent,ancestors,elements,children,dimensions,bounds:rect(x,y,right-x,bottom-y)};
}
