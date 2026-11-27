import {inputMode,inputOwner,validateParts,insideHit} from './parts.mjs';
import {hiddenByMenu} from './menu-state.mjs';
import {validateEffects,shadowFilter} from './visual-effects.mjs';

export const BUTTON_STATES={normal:'기본',hover:'가리킴·키보드 초점',pressed:'눌림',selected:'선택',disabled:'비활성'};
export const createButtonState=()=>({enabled:false,mode:'tint',targetGraphic:'self',selectable:false,selected:false,tints:{normal:'#ffffff',hover:'#f2f2f2',pressed:'#bdbdbd',selected:'#d8e8ff',disabled:'#999999'}});
export function buttonStateOwner(screen,element,transitions=[]){
 const owner=inputOwner(screen,element?.id,transitions);
 return owner&&!owner.control?owner:null;
}
export function buttonGraphic(screen,owner){return owner.buttonState?.targetGraphic==='self'?owner:screen.elements.find(e=>e.id===owner.buttonState?.targetGraphic);}
export function buttonMotionTargets(screen,owner,transitions=[]){
 return screen.elements.filter(e=>{
  if(e===owner||e.control||!['none','parent'].includes(inputMode(e,transitions)))return false;
  let parent=e.parentId;const seen=new Set();
  while(parent&&!seen.has(parent)){if(parent===owner.id)return true;seen.add(parent);parent=screen.elements.find(p=>p.id===parent)?.parentId;}
  return false;
 });
}
export function validateButtonStates(screen,transitions=[]){
 for(const element of screen.elements){
  const c=element.buttonState;if(c===undefined)continue;
  if(!c||Array.isArray(c)||Object.keys(c).some(k=>!['enabled','mode','targetGraphic','selectable','selected','tints','images','pressFeedback'].includes(k))||!['enabled','selectable','selected'].every(k=>typeof c[k]==='boolean')||!['tint','image'].includes(c.mode)||typeof c.targetGraphic!=='string'||inputMode(element,transitions)!=='action'||element.control)throw Error('버튼 상태 효과의 방식·대상·선택 설정을 확인하세요.');
  const target=buttonGraphic(screen,element);
  if(!target)throw Error('버튼 효과 대상을 찾을 수 없습니다.');
  if(target!==element){let parent=target.parentId;const seen=new Set();while(parent&&parent!==element.id&&!seen.has(parent)){seen.add(parent);parent=screen.elements.find(e=>e.id===parent)?.parentId;}if(target.kind!=='image'||parent!==element.id)throw Error('효과 대상은 버튼 전체 또는 그 안의 실제 이미지 부품이어야 합니다.');}
  if(!c.tints||Array.isArray(c.tints)||Object.keys(c.tints).some(k=>!Object.hasOwn(BUTTON_STATES,k))||Object.keys(BUTTON_STATES).some(k=>!/^#[a-f\d]{6}$/i.test(c.tints[k])))throw Error('버튼 상태 색은 #RRGGBB 다섯 개로 지정하세요.');
  if(c.pressFeedback!==undefined){
   const p=c.pressFeedback;
   if(!p||Array.isArray(p)||Object.keys(p).some(k=>!['enabled','target','distance','shadow'].includes(k))||typeof p.enabled!=='boolean'||!Number.isFinite(p.distance)||p.distance<0||p.distance>16||!buttonMotionTargets(screen,element,transitions).some(e=>e.id===p.target))throw Error('눌림 깊이의 앞면 대상·거리·사용 설정을 확인하세요.');
   if(p.shadow!==undefined)validateEffects({shadow:p.shadow});
  }
  if(c.images!==undefined){if(!c.images||Array.isArray(c.images)||Object.keys(c.images).some(k=>!Object.hasOwn(BUTTON_STATES,k)))throw Error('버튼 상태 이미지 형식을 확인하세요.');for(const image of Object.values(c.images)){if(image===undefined)throw Error('버튼 상태 이미지를 확인하세요.');validateParts({kind:'image',image});}}
 }
}
export function createButtonSelections(screens){
 const entries=screens.map(s=>[s.id,Object.fromEntries(s.elements.filter(e=>e.buttonState?.enabled&&e.buttonState.selectable).map(e=>[e.id,e.buttonState.selected]))]).filter(([,v])=>Object.keys(v).length);
 return entries.length?{buttonSelections:Object.fromEntries(entries)}:{};
}
export function buttonSelected(screen,element,runtime={}){return element.buttonState?.selectable?(runtime.buttonSelections?.[screen.id]?.[element.id]??element.buttonState.selected):element.buttonState?.selected??false;}
export function toggleButtonSelection(screen,element,runtime){
 if(!element.buttonState?.enabled||!element.buttonState.selectable)return;
 runtime.buttonSelections={...runtime.buttonSelections,[screen.id]:{...runtime.buttonSelections?.[screen.id],[element.id]:!buttonSelected(screen,element,runtime)}};
}

const scopes=new WeakMap();let filterSequence=0;
export function disposeButtonStates(root,{preserveVisual=false}={}){const scope=scopes.get(root);if(scope){for(const controller of scope.values())controller.dispose({preserveVisual});scope.clear();scopes.delete(root);}}
/** Transient pointer/focus states belong to the view; only explicit selection lives in runtime. */
export function attachButtonStates(root,screen,runtime={},options={}){
 const {mode='view',assetView='art',preview,previewElement,transitions=[],renderGraphic}=options;
 let scope=scopes.get(root);
 if(!scope&&!screen.elements.some(e=>e.buttonState?.enabled))return;
 if(!scope){scope=new Map();scopes.set(root,scope);}
 const nodes=new Map([...root.querySelectorAll('.ui-element')].filter(n=>n.dataset.screen===screen.id).map(n=>[n.dataset.element,n])),keep=new Set();
 for(const owner of screen.elements.filter(e=>e.buttonState?.enabled)){
  const node=nodes.get(owner.id),graphic=buttonGraphic(screen,owner),target=nodes.get(graphic?.id);
  if(!node||!target||assetView!=='art'||options.shell?.(owner)||options.shell?.(graphic))continue;
  keep.add(node);let controller=scope.get(node);
  if(!controller){controller=createController(node);scope.set(node,controller);}
  controller.update({screen,owner,graphic,target,motionNode:nodes.get(owner.buttonState.pressFeedback?.target),runtime,mode,renderGraphic,transitions,preview:previewElement===owner.id?preview:undefined});
 }
 for(const [node,controller] of scope)if(!keep.has(node)){controller.dispose();scope.delete(node);}
}
function createController(node){
 let ctx,target,originalFilter='',svg,matrix,hover=false,focus=false,pressed=false,key=null,pointer=null,imageApplied=false,lastPointerType='',pointerInside=true,motionTarget;
 const handlers=new Map(),doc=node.ownerDocument;
 const live=()=>ctx.mode!=='edit';
 const disabled=()=>ctx.owner.interaction?.enabled===false||ctx.runtime.pending||!!node.closest('[inert]')||hiddenByMenu(ctx.screen,ctx.owner.id,ctx.runtime.menuOpen);
 const ownEvent=event=>{if(event.target.closest?.('[data-ui-control]'))return false;const part=event.target.closest?.('.ui-element');return !part||inputOwner(ctx.screen,part.dataset.element,ctx.transitions)?.id===ctx.owner.id;};
 const clearMotion=()=>{if(motionTarget)motionTarget.style.translate='';motionTarget=null;};
 const reset=()=>{pressed=false;key=null;pointer=null;doc.removeEventListener?.('pointerup',up);doc.removeEventListener?.('pointercancel',cancel);};
 // Layout has already painted the authoritative current image before controllers reconcile.
 const clearGraphic=()=>{if(target){target.style.filter=originalFilter;delete target.dataset.buttonVisualState;}svg?.remove();svg=matrix=null;imageApplied=false;};
 const paint=()=>{
  if(!ctx)return;
  const state=disabled()?'disabled':ctx.preview|| (pressed&&(key!==null||pointerInside)?'pressed':hover||focus?'hover':buttonSelected(ctx.screen,ctx.owner,ctx.runtime)?'selected':'normal');
  node.dataset.buttonState=state;target.dataset.buttonVisualState=state;
  if(live()){node.setAttribute('aria-disabled',String(!!disabled()));if(node.tagName==='BUTTON')node.disabled=!!disabled();}
  if(ctx.owner.buttonState.selectable)node.setAttribute('aria-pressed',String(buttonSelected(ctx.screen,ctx.owner,ctx.runtime)));else node.removeAttribute('aria-pressed');
  const c=ctx.owner.buttonState,depth=c.pressFeedback,down=depth?.enabled&&state==='pressed';
  if(motionTarget)motionTarget.style.translate=down?'0 '+depth.distance+'px':'';
  const pressedShadow=down&&depth.shadow!==undefined?shadowFilter(depth.shadow):null;
  const visualShadow=pressedShadow===null?(originalFilter||'var(--ui-shadow, opacity(1))'):pressedShadow==='none'?'opacity(1)':pressedShadow;
  if(c.mode==='image'){
   if(svg){svg.remove();svg=matrix=null;}
   target.style.filter=visualShadow;
   ctx.renderGraphic?.(target,ctx.graphic,c.images?.[state]||c.images?.normal||ctx.graphic.image);imageApplied=true;
  }else{
   if(imageApplied){ctx.renderGraphic?.(target,ctx.graphic,ctx.graphic.image);imageApplied=false;}
   if(!matrix){
    svg=doc.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('aria-hidden','true');Object.assign(svg.style,{position:'absolute',width:'0',height:'0',pointerEvents:'none'});
    const filter=doc.createElementNS('http://www.w3.org/2000/svg','filter'),id='ui-button-tint-'+(++filterSequence);filter.setAttribute('id',id);filter.setAttribute('color-interpolation-filters','sRGB');
    matrix=doc.createElementNS('http://www.w3.org/2000/svg','feColorMatrix');matrix.setAttribute('type','matrix');filter.append(matrix);svg.append(filter);target.append(svg);svg._filterId=id;
   }
   const color=c.tints[state],rgb=[1,3,5].map(i=>parseInt(color.slice(i,i+2),16)/255);
   matrix.setAttribute('values',`${rgb[0]} 0 0 0 0 0 ${rgb[1]} 0 0 0 0 0 ${rgb[2]} 0 0 0 0 0 1 0`);
   target.style.filter=`url("#${svg._filterId}") ${visualShadow}`;
  }
 };
 const up=event=>{if(pointer!==null&&event.pointerId!==undefined&&event.pointerId!==pointer)return;reset();paint();};
 const cancel=()=>{reset();hover=false;focus=false;paint();};
 const on=(type,fn)=>{handlers.set(type,fn);node.addEventListener(type,fn);};
 on('pointerenter',event=>{pointerInside=true;if(event.pointerType!=='touch'&&live()&&!disabled()&&ownEvent(event)){hover=true;paint();}});
 on('pointerleave',()=>{hover=false;pointerInside=false;paint();});
 on('pointermove',event=>{
  if(!pressed||pointer===null||event.pointerId!==undefined&&event.pointerId!==pointer)return;
  const r=node.getBoundingClientRect?.();if(!r||!Number.isFinite(event.clientX)||!Number.isFinite(event.clientY))return;
  const inside=insideHit(ctx.owner,(event.clientX-r.left)/r.width,(event.clientY-r.top)/r.height);
  if(inside!==pointerInside){pointerInside=inside;paint();}
 });
 on('pointerdown',event=>{if(!live()||disabled()||event.button!==0||!ownEvent(event))return;const r=node.getBoundingClientRect?.();if(r&&Number.isFinite(event.clientX)&&!insideHit(ctx.owner,(event.clientX-r.left)/r.width,(event.clientY-r.top)/r.height))return;lastPointerType=event.pointerType||'mouse';if(lastPointerType==='touch'){hover=false;focus=false;}pressed=true;pointerInside=true;pointer=event.pointerId??null;try{node.setPointerCapture?.(event.pointerId);}catch{}doc.addEventListener?.('pointerup',up);doc.addEventListener?.('pointercancel',cancel);paint();});
 on('pointerup',up);on('pointercancel',cancel);on('lostpointercapture',()=>{if(pressed){reset();paint();}});
 on('focus',()=>{if(lastPointerType!=='touch'&&live()&&!disabled()){focus=true;paint();}});on('blur',cancel);
 on('keydown',event=>{if(!live()||!ownEvent(event))return;if(event.key==='Escape'){cancel();return;}if(!['Enter',' '].includes(event.key))return;event.preventDefault();if(disabled()||event.repeat)return;lastPointerType='keyboard';focus=true;key=event.key;pressed=true;paint();});
 on('keyup',event=>{if(!live()||!['Enter',' '].includes(event.key)||!ownEvent(event))return;event.preventDefault();const activate=key===event.key&&!disabled();reset();paint();if(activate)node.click();});
 const controller={update(next){if(motionTarget!==next.motionNode){clearMotion();motionTarget=next.motionNode;}if(target&&target!==next.target){clearGraphic();reset();}ctx=next;if(target!==next.target){target=next.target;originalFilter=target.style.filter||'';}if(disabled())reset();node._buttonStateController=controller;paint();},dispose({preserveVisual=false}={}){reset();clearMotion();if(!preserveVisual)clearGraphic();for(const [type,fn] of handlers)node.removeEventListener(type,fn);delete node._buttonStateController;if(!preserveVisual){delete node.dataset.buttonState;node.removeAttribute('aria-pressed');if(node.tagName==='BUTTON')node.disabled=false;}}};
 return controller;
}
