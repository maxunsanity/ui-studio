import {clone,validateDocument} from './model.mjs';
/** Only supported edits are applied; all other design fields survive unchanged. */
export function applyGrapesEdits(source, screenId, edits) {
    validateDocument(source);
    const result=clone(source),screen=result.screens.find(s=>s.id===screenId);
    if(!screen || !Array.isArray(edits) || edits.length!==screen.elements.length)
        throw Error('화면 또는 부품 개수가 일치하지 않습니다.');
    const byId=new Map();
    for(const edit of edits){
        if(!edit || byId.has(edit.id))throw Error('부품 ID 중복입니다.');
        byId.set(edit.id,edit);
    }
    for(const e of screen.elements){
        const edit=byId.get(e.id);
        if(!edit || (edit.parentId||null)!==(e.parentId||null))throw Error('부품 ID 또는 부모 관계가 다릅니다.');
        if(typeof edit.name!=='string' || typeof edit.text!=='string')throw Error('이름과 표시글은 문자열이어야 합니다.');
        if(edit.rect!==undefined){
            if(!edit.rect || !['x','y','w','h'].every(k=>Number.isFinite(edit.rect[k]) && Math.abs(edit.rect[k])<=10000 && (!['w','h'].includes(k)||edit.rect[k]>0)))
                throw Error('위치·크기는 유효한 숫자여야 합니다.');
            if((e.inset || e.rectTransform) && ['x','y','w','h'].some(k=>edit.rect[k]!==e[k]))
                throw Error('여백/앵커 배치는 아직 이 편집기에서 변경할 수 없습니다.');
            for(const k of ['x','y','w','h'])e[k]=edit.rect[k];
        }
        for(const key of ['purpose','info'])if(Object.hasOwn(edit,key)){
            if(typeof edit[key]!=='string')throw Error('설명은 문자열이어야 합니다.');
            if(edit[key] !== (e[key]||''))e[key]=edit[key];
        }
        e.name=edit.name;
        // Preserve absent text fields when no edit was made.
        if(edit.text!==(e.text||''))e.text=edit.text;
    }
    return validateDocument(result);
}

/** Repair legacy decoration types on a copy; persisted stage data stays untouched. */
export function restoreGrapesSvg(project) {
    const result=clone(project);
    function visit(component, inSvg=false) {
        if (!component || typeof component!=='object') return;
        if(component.uxBoard){component.type='ux-board';const title=component.components?.[0];if(title&&typeof title==='object'){title.attributes={...title.attributes,'data-board-handle':'true'};title.style={...title.style,cursor:'move',width:'100%',height:'24px','user-select':'none'};}}
        const tag=String(component.tagName||'').toLowerCase();
        const svg=tag==='svg'||component.type==='svg';
        if (svg) component.type='svg';
        else if(inSvg && (!component.type||component.type==='default')) component.type='svg-in';
        const children=component.components;
        const childSvg=(inSvg||svg)&&tag!=='foreignobject';
        if(Array.isArray(children))children.forEach(child=>visit(child,childSvg));
        else if(children && typeof children==='object')visit(children,childSvg);
    }
    for(const page of result.pages||[])for(const frame of page.frames||[])visit(frame.component);
    return result;
}

/** Scope browser drafts to the exact source revision. */
export function grapesStageKey(source,stage) {
    if(!['W','P','U'].includes(stage))throw Error('알 수 없는 제작 단계');
    return `ux-grapes-pilot-0.23.9-${source.projectId}-r${source.revision}-${stage}`;
}
export function validateGrapesStage(saved,source) {
    if(!saved || JSON.stringify(saved.source)!==JSON.stringify(source))
        throw Error('다른 설계 또는 이전 버전의 단계입니다. 원본 설계에서 열어주세요.');
    if(!saved.project || !Array.isArray(saved.project.pages))throw Error('단계 편집 데이터가 없습니다.');
    return restoreGrapesSvg(saved.project);
}

/** Nudge percent geometry without changing constraints or mutating editor/source data. */
export function nudgeGrapesRect(element,rect,axis,delta){
 if(element.inset||element.rectTransform)throw Error('여백/앵커 부품은 원래 편집기에서 조절해주세요.');
 if(!['x','y','w','h'].includes(axis)||!Number.isFinite(delta))throw Error('잘못된 배치 조작입니다.');
 const next={...rect,[axis]:Math.round((rect[axis]+delta)*10000)/10000};
 if(!['x','y','w','h'].every(k=>Number.isFinite(next[k])&&Math.abs(next[k])<=10000&&(!['w','h'].includes(k)||next[k]>0)))throw Error('위치·크기 범위를 벗어났습니다.');
 return next;
}

/** Canvas placement is editor metadata, independent of every in-screen coordinate. */
export function applyCanvasPositions(source,positions){
 const result=clone(source);
 if(!Array.isArray(positions)||positions.length!==source.screens.length||new Set(positions.map(p=>p.id)).size!==positions.length)throw Error('캔버스 화면 목록 불일치');
 for(const [index,s] of result.screens.entries()){
  const p=positions.find(p=>p.id===s.id);if(!p)throw Error('캔버스 화면 누락');
  const before=s.canvasPosition||{x:index*450+24,y:40};
  if(p.x!==before.x||p.y!==before.y)s.canvasPosition={x:p.x,y:p.y};
 }
 return validateDocument(result);
}

/** Prototype entry uses the existing page-only runtime contract. */
export function applyGrapesEntry(source,entryScreen){
 validateDocument(source);
 return validateDocument({...clone(source),entryScreen});
}

export function applyGrapesScreenDescription(source,screenId,purpose){
 validateDocument(source);
 if(typeof purpose!=='string'||purpose.length>10000)throw Error('화면 설명은 10000자 이내 문자열이어야 합니다.');
 const result=clone(source),screen=result.screens.find(s=>s.id===screenId);
 if(!screen)throw Error('설명 대상 화면이 없습니다.');
 if(purpose!==(screen.purpose||''))screen.purpose=purpose;
 return validateDocument(result);
}

/** Edit only existing destinations; conditions, payload and other actions survive. */
export function applyGrapesTargets(source,edits){
 validateDocument(source);
 if(!Array.isArray(edits))throw Error('목적지 편집 목록이 아닙니다.');
 const result=clone(source),seen=new Set();
 for(const edit of edits){
  const link=result.transitions.find(t=>t.id===edit?.id),target=result.screens.find(s=>s.id===edit?.targetScreen);
  if(!link||seen.has(edit.id))throw Error('연결이 없거나 중복됩니다.');
  seen.add(edit.id);
  if(!['navigate','open'].includes(link.action))throw Error('화면 이동/팝업 열기 연결만 목적지를 바꿀 수 있습니다.');
  if(!target||(link.action==='navigate'?target.kind!=='page':!['modal','sheet','toast'].includes(target.kind)))throw Error('행동에 맞는 목적지 화면을 선택해주세요.');
  link.targetScreen=target.id;
 }
 return validateDocument(result);
}

/** Preserve conditional/payload metadata while editing the four navigation actions. */
export function applyGrapesActions(source,edits){
 validateDocument(source);
 if(!Array.isArray(edits))throw Error('행동 편집 목록이 아닙니다.');
 const result=clone(source),seen=new Set(),actions=['navigate','open','back','close'];
 for(const edit of edits){
  const link=result.transitions.find(t=>t.id===edit?.id);
  if(!link||seen.has(edit.id))throw Error('연결이 없거나 중복됩니다.');
  seen.add(edit.id);
  if(!actions.includes(link.action)||!actions.includes(edit.action))throw Error('화면 이동·팝업 열기·뒤로 가기·닫기만 편집할 수 있습니다.');
  if(['navigate','open'].includes(edit.action)){
   const target=result.screens.find(s=>s.id===edit.targetScreen);
   if(!target||(edit.action==='navigate'?target.kind!=='page':!['modal','sheet','toast'].includes(target.kind)))throw Error('행동에 맞는 목적지를 선택해주세요.');
   link.targetScreen=target.id;
  }else delete link.targetScreen;
  link.action=edit.action;
 }
 return validateDocument(result);
}

/** First click connection only; never change an element's input policy implicitly. */
export function applyGrapesNewLinks(source,edits){
 validateDocument(source);
 if(!Array.isArray(edits))throw Error('새 연결 목록이 아닙니다.');
 let result=clone(source);
 for(const edit of edits){
  const screen=result.screens.find(s=>s.id===edit?.fromScreen),element=screen?.elements.find(e=>e.id===edit?.fromElement);
  if(!element||element.kind!=='button'||element.menu||element.intentionalNoAction||element.interaction?.enabled===false||(element.interaction?.mode&&element.interaction.mode!=='action'))throw Error('입력 가능한 자체 동작 버튼만 연결할 수 있습니다.');
  if(result.transitions.some(t=>t.fromElement===element.id))throw Error('이미 연결된 버튼입니다. 기존 연결을 편집해주세요.');
  if(result.screens.some(s=>s.id===edit.id||s.elements.some(e=>e.id===edit.id))||result.transitions.some(t=>t.id===edit.id))throw Error('이미 사용 중인 ID입니다.');
  const link={id:edit.id,fromScreen:screen.id,fromElement:element.id,event:'click',action:edit.action,condition:'always',...(['navigate','open'].includes(edit.action)?{targetScreen:edit.targetScreen}:{})};
  result.transitions.push(link);
  result=applyGrapesActions(result,[{id:link.id,action:link.action,targetScreen:link.targetScreen}]);
 }
 return validateDocument(result);
}
