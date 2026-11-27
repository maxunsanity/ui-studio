import {nudgeGrapesRect} from './grapes-bridge.mjs';
/** Grapes owns pointer lifetime/Escape; only completed percent edits enter Undo/storage. */
export function startPartDrag(editor,component,original,event,report=()=>{}){
 if(event.button!==0||original.inset||original.rectTransform)return false;
 const el=component.getEl(),parent=el?.offsetParent;
 if(!parent||event.target.closest('[data-element]')!==el)return false;
 const width=parent.clientWidth,height=parent.clientHeight;
 if(!(width>0&&height>0))return false;
 const before=Object.fromEntries(['x','y','w','h'].map(k=>[k,Number(component.get('ux'+k.toUpperCase())??original[k])]));
 let next=before,error;
 const left=el.style.left,top=el.style.top;
 const restore=()=>{el.style.left=left;el.style.top=top;};
 event.preventDefault();event.stopPropagation();editor.select(component);
 const dragger=new editor.Utils.Dragger({doc:el.ownerDocument,container:el.ownerDocument,
  getPosition:()=>({x:0,y:0}),
  // iframe pointer coordinates are already unscaled CSS pixels, including at canvas zoom.
  scale:1,
  setPosition:({x,y})=>{try{
   next=nudgeGrapesRect(original,nudgeGrapesRect(original,before,'x',x/width*100),'y',y/height*100);
   el.style.left=next.x+'%';el.style.top=next.y+'%';error=null;
  }catch(e){error=e;restore();}},
  onEnd:(_event,_dragger,{cancelled})=>{
   restore();
   if(cancelled){report('이동 취소 · 원래 위치 유지');return;}
   if(error){report('이동 실패: '+error.message);return;}
   component.set({uxX:next.x,uxY:next.y});
   report(`부품 이동 · ${component.get('name')} · X ${next.x}% / Y ${next.y}% · 부모 유지`);
  }
 });
 dragger.start(event);return dragger;
}

/** Board titles move canvas metadata only; child geometry is never rewritten. */
export function startBoardDrag(editor,board,event,report=()=>{}){
 const el=board.getEl();
 if(event.button!==0||!el||event.target.closest('[data-board-handle]')?.parentElement!==el)return false;
 const before={x:Number(board.get('boardX')??parseFloat(board.getStyle().left)),y:Number(board.get('boardY')??parseFloat(board.getStyle().top))};
 if(!Number.isFinite(before.x)||!Number.isFinite(before.y))return false;
 let next=before;
 const left=el.style.left,top=el.style.top,restore=()=>{el.style.left=left;el.style.top=top;};
 event.preventDefault();event.stopPropagation();
 const dragger=new editor.Utils.Dragger({doc:el.ownerDocument,container:el.ownerDocument,scale:1,getPosition:()=>before,
  setPosition:({x,y})=>{next={x:Math.max(0,Math.min(10000,x)),y:Math.max(0,Math.min(10000,y))};el.style.left=next.x+'px';el.style.top=next.y+'px';},
  onEnd:(_event,_dragger,{cancelled})=>{
   restore();
   if(cancelled){report('화면 이동 취소 · 원래 위치 유지');return;}
   board.set({boardX:next.x,boardY:next.y});report(`화면 이동 · ${board.get('name')} · ${next.x}, ${next.y}px · 내부 부품 유지`);
  }
 });dragger.start(event);return dragger;
}

/** Outer-document pan shield keeps view motion separate from component editing. */
export function startCanvasPan(editor,event,report=()=>{}){
 if(event.button!==0)return false;
 const before={...editor.Canvas.getCoords()},doc=event.currentTarget.ownerDocument;
 event.preventDefault();event.stopImmediatePropagation();
 const dragger=new editor.Utils.Dragger({doc,container:doc,scale:1,getPosition:()=>before,
  setPosition:({x,y})=>{if(Number.isFinite(x)&&Number.isFinite(y))editor.Canvas.setCoords(x,y);},
  onEnd:(_event,_dragger,{cancelled})=>{
   if(cancelled)editor.Canvas.setCoords(before.x,before.y);
   report(cancelled?'작업판 이동 취소':'작업판 이동 · 설계 배치 변경 없음');
  }
 });dragger.start(event);return dragger;
}
