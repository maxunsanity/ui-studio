/** Keep Grapes' tree rendering, but bind each visible row to its exact UI model. */
export function attachCanvasLayers(root,{select,toggleOpen,isOpen}){
 const models=new WeakMap();
 const hasChildren=component=>component.components().some(child=>child.get('uxId'));
 const onRender=({component,el})=>{
  const id=component.get('uxId'),screen=component.get('uxScreen')||component.get('uxBoard');
  if(!id&&!component.get('uxBoard'))return;
  const item=el.querySelector(':scope > [data-toggle-select]');if(!item)return;
  models.set(el,component);el.dataset.uxLayer=id||'screen:'+screen;el.dataset.uxScreen=screen;
  if(id){item.tabIndex=0;item.setAttribute('role','button');item.setAttribute('aria-label','레이어 선택 · '+component.get('name'));item.setAttribute('aria-pressed',String(component.get('status')==='selected'));}
  const caret=item.querySelector('[data-toggle-open]');
  if(caret&&hasChildren(component)){caret.tabIndex=0;caret.setAttribute('role','button');caret.setAttribute('aria-label','하위 레이어 펼치기 · '+component.get('name'));caret.setAttribute('aria-expanded',String(!!isOpen(component)));}
 };
 const activate=event=>{
  if(event.target.closest('[contenteditable="true"],input,textarea,[data-toggle-visible]'))return;
  const item=event.target.closest('[data-toggle-select]'),component=item&&models.get(item.parentElement);
  if(!component)return;
  const caret=event.target.closest('[data-toggle-open]');
  if(caret&&hasChildren(component)){event.preventDefault();event.stopImmediatePropagation();toggleOpen(component);caret.setAttribute('aria-expanded',String(!!isOpen(component)));return;}
  if(component.get('uxId')){event.preventDefault();event.stopImmediatePropagation();select(component);}
 };
 const keydown=event=>{if(event.key==='Enter'||event.key===' '){activate(event);}};
 root.addEventListener('click',activate,true);root.addEventListener('keydown',keydown,true);
 return {onRender,syncSelection(selected){for(const row of root.querySelectorAll('[data-ux-layer]')){const component=models.get(row);if(component?.get('uxId'))row.querySelector(':scope > [data-toggle-select]')?.setAttribute('aria-pressed',String(component===selected));}},dispose(){root.removeEventListener('click',activate,true);root.removeEventListener('keydown',keydown,true);}};
}
