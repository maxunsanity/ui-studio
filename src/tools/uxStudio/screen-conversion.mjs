import {validateDocument} from './model.mjs';

/** Convert in a copy so the editor can commit or reject the whole change with Undo. */
export function convertPageToModal(document,screenId,{name}={}) {
    const screen=document.screens.find(s=>s.id===screenId);
    if(!screen)throw Error('전환할 화면을 찾을 수 없습니다.');
    if(screen.id===document.entryScreen)throw Error('시작 페이지는 팝업으로 전환할 수 없습니다.');
    if(screen.kind!=='page')throw Error('페이지 화면만 팝업으로 전환할 수 있습니다.');
    if(name!==undefined&&typeof name!=='string')throw Error('화면 이름을 확인해 주세요.');
    const next=structuredClone(document),target=next.screens.find(s=>s.id===screenId);
    target.kind='modal';
    if(name?.trim())target.name=name.trim();
    target.presentation={effect:'fade',durationMs:240,autoCloseMs:0,dim:true,blocking:true,dismissOnEscape:true,closePolicy:'allow',...target.presentation,type:'modal',rootMode:'fullscreen'};
    for(const transition of next.transitions){
        if(transition.targetScreen===screenId&&transition.action==='navigate')transition.action='open';
        if(transition.fromScreen===screenId&&transition.action==='back')transition.action='close';
    }
    return validateDocument(next);
}
