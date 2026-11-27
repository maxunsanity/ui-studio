const minimum={left:160,right:200},defaults={left:210,right:290};
/** Two 8px separators and a 260px canvas remain available on desktop. */
export function canvasPaneWidths(width,left=defaults.left,right=defaults.right,active='left'){
 if(!Number.isFinite(width)||width<=0)throw Error('패널 작업 영역 폭을 확인하세요.');
 const available=Math.max(636,width),maximum=Math.floor(available*.45),budget=available-16-260;
 const result={left:Math.max(minimum.left,Math.min(maximum,Number.isFinite(left)?left:defaults.left)),right:Math.max(minimum.right,Math.min(maximum,Number.isFinite(right)?right:defaults.right))};
 let excess=Math.max(0,result.left+result.right-budget);
 for(const side of active==='right'?['right','left']:['left','right']){const cut=Math.min(result[side]-minimum[side],excess);result[side]-=cut;excess-=cut;}
 return result;
}

/** Tool preferences only: panel resizing never edits a design or its revision. */
export function attachCanvasPanels(host,{storageKey='ux-studio.canvas-panels.v1'}={}){
 const view=host.ownerDocument.defaultView,handles=[...host.querySelectorAll('[data-canvas-split]')];
 let widths={...defaults},drag;
 try{const saved=JSON.parse(view.localStorage.getItem(storageKey)||'null');if(saved)widths={left:saved.left,right:saved.right};}catch{}
 const desktop=()=>view.innerWidth>760;
 const apply=(next=widths,active)=>{
  if(!desktop())return;
  const width=host.clientWidth;
  if(!(width>0))return;
  widths=canvasPaneWidths(width,next.left,next.right,active);
  host.style.setProperty('--canvas-left',widths.left+'px');host.style.setProperty('--canvas-right',widths.right+'px');
  for(const handle of handles){const side=handle.dataset.canvasSplit,other=side==='left'?'right':'left';handle.setAttribute('aria-valuemin',minimum[side]);handle.setAttribute('aria-valuemax',Math.floor(Math.min(width*.45,width-16-260-widths[other])));handle.setAttribute('aria-valuenow',Math.round(widths[side]));}
 };
 const persist=()=>{try{view.localStorage.setItem(storageKey,JSON.stringify(widths));}catch{}};
 const finish=cancelled=>{
  if(!drag)return;
  const current=drag;drag=null;
  for(const [name,listener] of current.listeners)current.handle.removeEventListener(name,listener);
  if(cancelled)apply(current.before);else persist();
  host.classList.remove('resizing-panels');
  if(current.handle.hasPointerCapture?.(current.pointerId))current.handle.releasePointerCapture(current.pointerId);
 };
 const pointerdown=event=>{
  const handle=event.target.closest('[data-canvas-split]');
  if(!handle||!handles.includes(handle)||event.button!==0||!desktop()||drag)return;
  event.preventDefault();event.stopPropagation();handle.focus();
  const before={...widths},side=handle.dataset.canvasSplit,start=event.clientX,pointerId=event.pointerId;
  const move=e=>{if(e.pointerId!==pointerId)return;apply({...before,[side]:before[side]+(e.clientX-start)*(side==='left'?1:-1)},side);};
  const up=e=>{if(e.pointerId===pointerId)finish(false);};
  const cancel=()=>finish(true),listeners=[['pointermove',move],['pointerup',up],['pointercancel',cancel],['lostpointercapture',cancel]];
  drag={handle,pointerId,before,listeners};
  for(const [name,listener] of listeners)handle.addEventListener(name,listener);
  handle.setPointerCapture(pointerId);host.classList.add('resizing-panels');
 };
 const keydown=event=>{
  if(event.key==='Escape'&&drag){event.preventDefault();finish(true);return;}
  const handle=event.target.closest('[data-canvas-split]');
  if(!handle||!handles.includes(handle)||!desktop()||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();event.stopPropagation();
  const side=handle.dataset.canvasSplit,step=event.shiftKey?64:16,delta=(event.key==='ArrowRight'?1:-1)*(side==='left'?1:-1)*step;
  const value=event.key==='Home'?minimum[side]:event.key==='End'?host.clientWidth*.45:widths[side]+delta;
  apply({...widths,[side]:value},side);persist();
 };
 const resize=()=>{if(!desktop())finish(true);apply();};
 host.addEventListener('pointerdown',pointerdown);host.addEventListener('keydown',keydown);view.addEventListener('resize',resize);apply();
 return ()=>{finish(true);host.removeEventListener('pointerdown',pointerdown);host.removeEventListener('keydown',keydown);view.removeEventListener('resize',resize);};
}
