export const UNLINKED_MESSAGE = '아직 연결된 화면이 없습니다.';
// Common lightweight notice. Dismissing never navigates or mutates the design.
export function renderFeedbackNotice(host,message,onDismiss) {
 host.replaceChildren();host.hidden=!message;if(!message)return;
 host.setAttribute('role','status');
 const text=host.ownerDocument.createElement('span');text.textContent=message;
 const confirm=host.ownerDocument.createElement('button');confirm.type='button';confirm.textContent='확인';confirm.setAttribute('aria-label','안내 닫기');
 confirm.addEventListener('click',event=>{event.stopPropagation();onDismiss();});
 confirm.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();onDismiss();}});
 host.append(text,confirm);
}
