import {buildDesignGuide} from './design-guides.mjs';
import {renderLayout} from './layout-view.mjs';
import {isAutoLayoutChild} from './responsive-layout.mjs';

const NS = 'http://www.w3.org/2000/svg';
const LINE_DEFAULTS = {left:'#2f66c8',right:'#8854c5',top:'#ca7a16',bottom:'#c53e54'};
const LINE_NAMES = {left:'왼쪽',right:'오른쪽',top:'위',bottom:'아래'};
export function guideOutlineColors(ids) {
    const palette = ['#315bbb','#bd5d12','#8550b8','#ba3151','#087f9d','#935f39','#b23b97','#6250a8','#b88714','#316eaa','#a54871','#936f24'];
    const colors = new Map(), used = new Set();
    for (const id of [...new Set(ids)].sort()) {
        let hash = 0; for (const char of id) hash = (hash * 31 + char.codePointAt(0)) >>> 0;
        let index = hash % palette.length;
        for (let attempts=0; attempts<palette.length && used.has(palette[index]); attempts++) index = (index+1)%palette.length;
        const color = used.has(palette[index]) ? `hsl(${[20,190,220,260,300,340][colors.size%6]} 65% ${30+colors.size%28}%)` : palette[index];
        colors.set(id,color); used.add(color);
    }
    return colors;
}
const number = value => Number.isFinite(value) ? String(Number(value.toFixed(2))) : '미확인';
/** The selected logical size stays readable independently of canvas zoom and optional redlines. */
export function renderGuideSize(overlay,rect,zoom) {
    overlay.querySelector?.('[data-guide-size]')?.remove();
    const label = `W${number(rect.w)}px · H${number(rect.h)}px`;
    const make = (tag,attrs,text) => {
        const node = overlay.ownerDocument.createElementNS(NS,tag);
        for (const [key,value] of Object.entries(attrs)) node.setAttribute(key,String(value));
        if (text !== undefined) node.textContent = text;
        return node;
    };
    const group = make('g',{'data-guide-size':'',transform:`translate(${rect.x} ${rect.y})`,role:'img','aria-label':label});
    group.append(
        make('rect',{x:0,y:-58/zoom,width:(label.length*7+16)/zoom,height:20/zoom,rx:3/zoom,fill:'#f8faff',stroke:'#a9b7ca','stroke-width':1,'vector-effect':'non-scaling-stroke'}),
        make('text',{x:8/zoom,y:-48/zoom,'font-size':12/zoom,style:'fill:#34475d;text-anchor:start'},label)
    );
    overlay.append(group);
    return group;
}

const letter = index => {
    let label = '';
    do { label = String.fromCharCode(65 + index % 26) + label; index = Math.floor(index / 26) - 1; } while (index >= 0);
    return label;
};
// Keep original indices so the diagram letters still match the complete value table.
export function guideDiagramDimensions(dimensions) {
    return [...dimensions.entries()].filter(([,item]) => item.kind !== 'padding' || item.valuePx !== 0);
}
export function guideDragRect(rect,edge,pointerX,pointerY,zoom) {
    if (![pointerX,pointerY,zoom].every(Number.isFinite) || zoom <= 0) throw Error('드래그 확대율을 확인하세요.');
    const next = {...rect}, dx = pointerX / zoom, dy = pointerY / zoom;
    if (edge === 'move') { next.x += dx; next.y += dy; }
    else if (edge === 'left') { next.x = Math.min(rect.x + dx,rect.x + rect.w - 1); next.w = rect.x + rect.w - next.x; }
    else if (edge === 'right') next.w = Math.max(1,rect.w + dx);
    else if (edge === 'top') { next.y = Math.min(rect.y + dy,rect.y + rect.h - 1); next.h = rect.y + rect.h - next.y; }
    else if (edge === 'bottom') next.h = Math.max(1,rect.h + dy);
    else throw Error('가이드 변을 확인하세요.');
    return next;
}
const rectText = rect => ['x','y','w','h'].map(key => number(rect[key])).join(' / ');
const fontText = font => font ? [
    `${number(font.sizePx)} px (${font.source === 'explicit' ? '명시 설정' : '렌더러 기본'})`,
    `글꼴 ${font.family || '미지정'} · 굵기 ${font.weight ?? '미지정'}`,
    `줄 높이 ${font.lineHeight ?? '미지정'} · 자간 ${font.letterSpacing ?? '미지정'}`,
    `정렬 ${font.align || '미지정'} / ${font.vertical || '미지정'} · 줄바꿈 ${font.wrap || '미지정'} · 넘침 ${font.overflow || '미지정'}`
].join('\n') : '글자 설정 없음';

/** Guide edits flow through the caller's validated document and undo handling. */
export function openDesignGuide({document:design,screenId,elementId = null,workspaceId = null,size,onSelect,onEdit,onChange,onImportImage} = {}) {
    let snapshot = structuredClone(design);
    let guide = buildDesignGuide(snapshot,screenId,elementId,size);
    let screen = snapshot.screens.find(item => item.id === screenId);
    const opener = document.activeElement;
    const make = (tag,text) => {
        const node = document.createElement(tag);
        if (text !== undefined) node.textContent = text;
        return node;
    };
    const action = (text,handler) => {
        const node = make('button',text); node.type = 'button';
        node.addEventListener('click',handler); return node;
    };
    const dialog = make('dialog');
    dialog.className = 'ux-design-guide';
    const style = make('style',`
.ux-design-guide{width:min(1520px,calc(100vw - 28px));height:calc(100dvh - 28px);max-width:none;max-height:none;box-sizing:border-box;padding:0;border:1px solid #b7c2cc;border-radius:12px;background:#f7f9fc;color:#253247;font:13px/1.5 -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo",sans-serif;z-index:2147483647}
.ux-design-guide::backdrop{background:#102034aa}.ux-design-guide[open]{display:flex;flex-direction:column}
.ux-design-guide *{box-sizing:border-box}.ux-design-guide header{padding:14px 18px;display:flex;gap:12px;align-items:start;border-bottom:1px solid #d4dce7;flex:none}.ux-design-guide .dg-heading{min-width:0;flex:1}.ux-design-guide h2{font-size:17px;line-height:1.4;margin:0;overflow-wrap:anywhere}.ux-design-guide .dg-subtitle{margin:3px 0 0;color:#596b81;font-size:12px;overflow-wrap:anywhere}
.ux-design-guide button{font:inherit;background:#fff;color:inherit;border:1px solid #aab9ca;border-radius:6px;padding:6px 10px;cursor:pointer;min-height:32px;max-width:100%;overflow-wrap:anywhere}.ux-design-guide button:disabled{cursor:default;opacity:.45}.ux-design-guide button:focus-visible{outline:3px solid #3567bd;outline-offset:2px}.ux-design-guide button[aria-current=true]{background:#edf2fb;border-color:#3567bd;color:#244f9e;font-weight:600}
.ux-design-guide .dg-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:10px 18px;border-bottom:1px solid #d4dce7;flex:none}.ux-design-guide .dg-breadcrumbs{display:flex;align-items:center;gap:6px;flex:1;flex-wrap:wrap;min-width:0}.ux-design-guide .dg-breadcrumbs button{font-size:12px}.ux-design-guide .dg-zoom{display:flex;align-items:center;gap:6px}.ux-design-guide .dg-scale{min-width:54px;text-align:center;font-variant-numeric:tabular-nums}
.ux-design-guide .dg-body{display:grid;grid-template-columns:minmax(0,1fr) 340px;min-height:0;flex:1}.ux-design-guide .dg-stage{position:relative;min-width:0;min-height:220px;background:#e8edf5}.ux-design-guide iframe{width:100%;height:100%;display:block;border:0}.ux-design-guide .dg-sidebar{padding:14px;min-width:0;overflow:auto;border-left:1px solid #d4dce7;background:#fff}.ux-design-guide h3{font-size:13px;margin:0 0 8px}.ux-design-guide .dg-summary{white-space:pre-wrap;overflow-wrap:anywhere;margin:0 0 14px;font:12px/1.7 ui-monospace,SFMono-Regular,monospace}.ux-design-guide .dg-children{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px}.ux-design-guide .dg-children button{text-align:left;font-size:11px;min-height:26px;max-width:150px;padding:3px 6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ux-design-guide .dg-line-swatch{display:inline-block;width:14px;margin-right:5px;vertical-align:middle}.ux-design-guide .dg-line-fields{display:grid;grid-template-columns:1fr 58px 1fr;gap:6px}.ux-design-guide .dg-line-swatches{display:flex;gap:5px;flex-wrap:wrap}.ux-design-guide .dg-line-swatches button{font-size:11px;padding:3px 8px;min-height:26px}.ux-design-guide .dg-line-fields select{font:inherit;min-width:0;width:100%;padding:6px 3px;border:1px solid #aab9ca;border-radius:5px}.ux-design-guide .dg-note{margin:0;color:#5c6e84;font-size:12px;overflow-wrap:anywhere}
.ux-design-guide .dg-data{border-top:1px solid #d4dce7;max-height:35%;overflow:auto;background:#fff;flex:none}.ux-design-guide .dg-data>summary{cursor:pointer;padding:9px 14px;font-weight:600;background:#edf3f8}.ux-design-guide .dg-data>.dg-summary{padding:10px 14px;margin:0}.ux-design-guide .dg-note-details>summary{cursor:pointer;font-size:12px;color:#596b81}.ux-design-guide .dg-note-details p{padding-top:8px}.ux-design-guide table{width:100%;border-collapse:collapse;min-width:1060px;text-align:left;font-size:12px;font-variant-numeric:tabular-nums}.ux-design-guide caption{text-align:left;padding:9px 14px;font-weight:600}.ux-design-guide th,.ux-design-guide td{padding:8px 10px;border-top:1px solid #e2e8f0;vertical-align:top;white-space:pre-line;overflow-wrap:anywhere}.ux-design-guide th{background:#f0f4f9;position:sticky;top:0;z-index:1}.ux-design-guide td:first-child{min-width:150px;max-width:230px}.ux-design-guide .dg-metrics{min-width:128px}.ux-design-guide .dg-font{min-width:245px}.ux-design-guide .dg-dimensions{padding:10px 14px;display:flex;gap:8px 18px;flex-wrap:wrap;border-top:1px solid #e2e8f0}.ux-design-guide .dg-dimensions span{font-size:12px;color:#a12134}.ux-design-guide footer{display:flex;gap:12px;align-items:center;justify-content:space-between;padding:10px 18px;border-top:1px solid #d4dce7;flex:none}.ux-design-guide .dg-edit{background:#315fba;color:#fff;border-color:#315fba}
.ux-design-guide input,.ux-design-guide textarea{font:inherit;min-width:0;width:100%;padding:6px;border:1px solid #aab9ca;border-radius:5px;color:inherit;background:#fff}.ux-design-guide input:disabled,.ux-design-guide textarea:disabled{background:#edf0f4;color:#718096}.ux-design-guide .dg-editor{display:grid;gap:8px;margin:14px 0}.ux-design-guide .dg-editor h3{margin:8px 0 0}.ux-design-guide .dg-rect-fields{display:grid;grid-template-columns:1fr 1fr;gap:6px}.ux-design-guide .dg-editor label{display:grid;gap:3px;font-size:12px}.ux-design-guide .dg-editor textarea{resize:vertical;min-height:54px}.ux-design-guide .dg-image-actions{display:flex;gap:6px;flex-wrap:wrap}.ux-design-guide .dg-error{color:#a71932;background:#fff0f3;border:1px solid #efb5c1;padding:8px;overflow-wrap:anywhere;margin:8px 0}.ux-design-guide .dg-option{display:flex;align-items:center;gap:5px;white-space:nowrap;font-size:12px}.ux-design-guide .dg-option input{width:auto}.ux-design-guide .dg-edit-hint{font-size:12px;color:#465a7a;margin:0}

@media(max-width:760px){.ux-design-guide{width:calc(100vw - 12px);height:calc(100dvh - 12px);overflow:auto}.ux-design-guide header,.ux-design-guide .dg-toolbar,.ux-design-guide footer{padding:10px}.ux-design-guide .dg-body{flex:none;grid-template-columns:minmax(0,1fr);grid-template-rows:280px 320px}.ux-design-guide .dg-sidebar{min-height:0;border-left:0;border-top:1px solid #d4dce7}.ux-design-guide .dg-data{flex:none;min-height:0;max-height:180px}.ux-design-guide footer{align-items:start;flex-wrap:wrap}.ux-design-guide h2{font-size:15px}}
`);
    const header = make('header'), headingWrap = make('div'); headingWrap.className = 'dg-heading';
    const title = make('h2'); title.id = 'ux-design-guide-' + crypto.randomUUID();
    dialog.setAttribute('aria-labelledby',title.id);
    const subtitle = make('p'); subtitle.className = 'dg-subtitle';
    headingWrap.append(title,subtitle);
    const close = action('닫기',() => dialog.close()); close.setAttribute('aria-label','디자인 가이드 닫기');
    header.append(headingWrap,close);
    const toolbar = make('div'); toolbar.className = 'dg-toolbar';
    const breadcrumbs = make('nav'); breadcrumbs.className = 'dg-breadcrumbs'; breadcrumbs.setAttribute('aria-label','부모 부품 경로');
    const zoomBar = make('div'); zoomBar.className = 'dg-zoom';
    const zoomOut = action('−',() => changeZoom(zoom / 1.25)); zoomOut.setAttribute('aria-label','가이드 축소');
    const zoomIn = action('+',() => changeZoom(zoom * 1.25)); zoomIn.setAttribute('aria-label','가이드 확대');
    const scaleLabel = make('output'); scaleLabel.className = 'dg-scale'; scaleLabel.setAttribute('aria-label','가이드 확대율');
    const fit = action('유닛 맞춤',() => fitStage());
    zoomBar.append(zoomOut,scaleLabel,zoomIn,fit);
    const option = (label,checked,change) => {
        const wrap = make('label'); wrap.className = 'dg-option';
        const field = make('input'); field.type = 'checkbox'; field.checked = checked;
        field.setAttribute('aria-label',label); field.addEventListener('change',change);
        wrap.append(field,make('span',label)); toolbar.append(wrap); return field;
    };
    toolbar.append(breadcrumbs,zoomBar);
    const outlines = option('하위 경계 표시',false,() => { refreshLegend(); redrawOverlay(); });
    const parentOutline = option('부모 경계 표시',false,() => { refreshLegend(); redrawOverlay(); });
    const measurements = option('치수 표시',false,() => fitStage());
    const body = make('div'); body.className = 'dg-body';
    const stage = make('section'); stage.className = 'dg-stage'; stage.setAttribute('aria-label','실제 UI와 빨간 점선 치수');
    const frame = make('iframe'); frame.className = 'dg-frame'; frame.title = '유닛 실제 UI · 빨간 점선 디자인 가이드';
    frame.setAttribute('sandbox','allow-same-origin');
    const sidebar = make('aside'); sidebar.className = 'dg-sidebar';
    const selectedTitle = make('h3','선택 부품 · 논리 px');
    const summary = make('pre'); summary.className = 'dg-summary';
    const childrenTitle = make('h3','선 색상 · 눌러서 부품 선택');
    const children = make('div'); children.className = 'dg-children';
    const note = make('p','현재 설계의 논리 px입니다. 부모 %와 화면 %는 기준이 다릅니다. 글자 정보는 설계 설정이며 원본 스크린샷의 폰트는 미확인입니다. 원본 글자의 가시 경계와 부품의 배치 사각형은 서로 다릅니다. 0px 내용 여백은 점선 그림에서 생략하고 값표에는 유지합니다. 선택 부품의 W/H는 항상 표시합니다. 여백·간격 치수는 토글을 켜면 그림 바깥에 대표 8개까지, 전체 값은 상세 명세에서 확인합니다.'); note.className = 'dg-note';
    const editor = make('section'); editor.className = 'dg-editor'; editor.setAttribute('aria-label','가이드에서 실제 부품 편집');
    const editHint = make('p'); editHint.className = 'dg-edit-hint';
    const rectFields = {}, originalFields = new Map(), rectFieldsWrap = make('div'); rectFieldsWrap.className = 'dg-rect-fields';
    for (const [key,label] of [['x','X 위치'],['y','Y 위치'],['w','너비'],['h','높이']]) {
        const wrap = make('label',label + ' · 부모 px'), field = make('input');
        field.type = 'number'; field.step = 'any'; field.setAttribute('aria-label','가이드 '+key+' px');
        if (key === 'w' || key === 'h') field.min = '0.01';
        rectFields[key] = field; wrap.append(field); rectFieldsWrap.append(wrap);
    }
    const applyRect = action('위치·크기 적용',() => {
        if (!rectEditable()) return;
        const rect = Object.fromEntries(Object.entries(rectFields).map(([key,field]) => [key,field.value.trim() === '' ? NaN : field.value === originalFields.get(key)?.display ? originalFields.get(key).value : Number(field.value)]));
        if (!Object.values(rect).every(Number.isFinite) || rect.w <= 0 || rect.h <= 0) return fail('위치와 0보다 큰 너비·높이를 입력하세요.');
        commit({type:'rect',rect});
    });
    const lineSelect = make('select'); lineSelect.setAttribute('aria-label','가이드 선 선택');
    for (const [key,name] of Object.entries(LINE_NAMES)) { const choice = make('option',name+' 선'); choice.value = key; lineSelect.append(choice); }
    lineSelect.value = 'left'; lineSelect.addEventListener('change',syncLineEditor);
    const lineColor = make('input'); lineColor.type = 'color'; lineColor.setAttribute('aria-label','가이드 선 색상');
    lineColor.addEventListener('change',() => {
        if (!/^#[0-9a-f]{6}$/i.test(lineColor.value)) return;
        lineColors[lineSelect.value] = lineColor.value;
        try { document.defaultView?.localStorage?.setItem(linePreferenceKey(),JSON.stringify(lineColors)); } catch { /* Color remains usable when browser storage is unavailable. */ }
        syncLineEditor(); redrawOverlay();
    });
    const linePosition = make('input'); linePosition.type = 'number'; linePosition.step = 'any'; linePosition.setAttribute('aria-label','가이드 선 위치 px');
    const applyLine = action('선 위치 적용',() => {
        if (!rectEditable()) return;
        const position = linePosition.value === linePosition.dataset.originalDisplay ? Number(linePosition.dataset.originalValue) : linePosition.value.trim() === '' ? NaN : Number(linePosition.value);
        const rect = {...guide.unit.relative}, edge = lineSelect.value;
        if (edge === 'left') { rect.w += rect.x-position; rect.x = position; }
        else if (edge === 'right') rect.w = position-rect.x;
        else if (edge === 'top') { rect.h += rect.y-position; rect.y = position; }
        else rect.h = position-rect.y;
        if (!Number.isFinite(position) || rect.w <= 0 || rect.h <= 0) return fail('반대편 선을 넘지 않는 위치를 입력하세요.');
        commit({type:'rect',rect});
    });
    const lineSwatches = make('div'); lineSwatches.className = 'dg-line-swatches';
    for (const [key,name] of Object.entries(LINE_NAMES)) {
        const pick = action(name,() => { lineSelect.value = key; syncLineEditor(); }); pick.dataset.line = key; lineSwatches.append(pick);
    }
    const lineFields = make('div'); lineFields.className = 'dg-line-fields';
    const lineLabel = make('label','선 선택'); lineLabel.append(lineSelect);
    const colorLabel = make('label','선 색상'); colorLabel.append(lineColor);
    const positionLabel = make('label','선 위치 · 부모 px'); positionLabel.append(linePosition);
    lineFields.append(lineLabel,colorLabel,positionLabel);
    const textLabel = make('label','글자'), textField = make('textarea'); textField.setAttribute('aria-label','가이드 글자'); textLabel.append(textField);
    const fontLabel = make('label','글자 크기 · px'), fontField = make('input'); fontField.type = 'number'; fontField.min = '1'; fontField.step = 'any'; fontField.setAttribute('aria-label','가이드 글자 크기 px'); fontLabel.append(fontField);
    const applyText = action('글자 적용',() => {
        if (applyText.disabled) return;
        const fontSize = fontField.value === fontField.dataset.originalDisplay ? Number(fontField.dataset.originalValue) : Number(fontField.value);
        if (!Number.isFinite(fontSize) || fontSize <= 0) return fail('0보다 큰 글자 크기를 입력하세요.');
        commit({type:'text',text:textField.value,fontSize});
    });
    const fileLabel = make('label','이미지 파일'), imageFile = make('input'); imageFile.type = 'file'; imageFile.accept = 'image/png,image/jpeg,image/webp'; imageFile.setAttribute('aria-label','가이드 이미지 파일');
    imageFile.addEventListener('change',() => { const file = imageFile.files?.[0]; if (file) void importImage({file}); imageFile.value = ''; }); fileLabel.append(imageFile);
    const pathLabel = make('label','프로젝트 이미지 경로'), imagePath = make('input'); imagePath.type = 'text'; imagePath.placeholder = 'assets/…'; imagePath.setAttribute('aria-label','프로젝트 이미지 경로'); pathLabel.append(imagePath);
    const applyImagePath = action('경로 이미지 넣기',() => {
        const path = imagePath.value.trim();
        if (!path) return fail('프로젝트 이미지 경로를 입력하세요.');
        void importImage({path});
    });
    const removeImage = action('이미지 빼기',() => { if (!removeImage.disabled) commit({type:'image',image:null}); });
    const imageActions = make('div'); imageActions.className = 'dg-image-actions'; imageActions.append(applyImagePath,removeImage);
    const errorBox = make('p'); errorBox.className = 'dg-error'; errorBox.hidden = true; errorBox.setAttribute('role','alert');
    editor.append(make('h3','가이드 조절 → 실제 부품 반영'),editHint,rectFieldsWrap,applyRect,make('h3','가이드 선'),lineSwatches,lineFields,applyLine,textLabel,fontLabel,applyText,make('h3','이미지 넣기·빼기'),fileLabel,pathLabel,imageActions,errorBox);
    const noteDetails = make('details'); noteDetails.className = 'dg-note-details'; noteDetails.append(make('summary','측정 기준·원본 확인 범위'),note);
    sidebar.append(selectedTitle,childrenTitle,children,editor,noteDetails); stage.append(frame); body.append(stage,sidebar);
    const data = make('details'); data.className = 'dg-data'; data.setAttribute('aria-label','위치 크기 여백 글자 명세');
    const dataLabel = make('summary','상세 수치·폰트 명세');
    const footer = make('footer'), status = make('p',typeof onChange === 'function' ? '가이드 조절은 현재 설계에 반영됩니다. 저장은 편집기의 저장을 사용하세요.' : '읽기 전용입니다. 선택과 확대는 문서를 변경하지 않습니다.'); status.className = 'dg-note'; status.setAttribute('role','status');
    const edit = action('선택 부품 세부 편집',() => {
        if (guide.unit.id === null || typeof onEdit !== 'function') return;
        const id = guide.unit.id; dialog.close(); onEdit(id);
    }); edit.className = 'dg-edit';
    footer.append(status,edit); dialog.append(style,header,toolbar,body,data,footer);

    let closed = false, zoom = 1, fitting = true, frameDocument, scroller, spacer, scene, host, overlay, drag = null, importRequest = 0, importBusy = false, lineColors = {...LINE_DEFAULTS};
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(() => { if (fitting) fitStage(); }) : null;
    function select(id) {
        if (closed || id === guide.unit.id) return;
        cancelDrag();
        const cancelledImport = importBusy; ++importRequest; importBusy = false; errorBox.hidden = true;
        guide = buildDesignGuide(snapshot,screenId,id,size);
        refresh();
        if (cancelledImport) status.textContent = '부품 선택이 바뀌어 이전 이미지 적용을 취소했습니다.';
        onSelect?.(id);
        // Selection replaces the clicked row or iframe node; keep focus in the new view.
        data.querySelector?.('button[aria-current="true"]')?.focus();
    }
    function selectedElement() { return screen.elements.find(item => item.id === guide.unit.id); }
    function editable() { return typeof onChange === 'function' && guide.unit.id !== null; }
    function rectEditable() { return editable() && !isAutoLayoutChild(screen,selectedElement()); }
    function fail(message) { errorBox.textContent = message; errorBox.hidden = false; }
    function linePreferenceKey() { return 'ux-studio:guide-lines:' + JSON.stringify([workspaceId,screenId,guide.unit.id]); }
    function loadLineColors() {
        lineColors = {...LINE_DEFAULTS};
        try {
            const saved = JSON.parse(document.defaultView?.localStorage?.getItem(linePreferenceKey()) || '{}');
            for (const key of Object.keys(LINE_DEFAULTS)) if (/^#[0-9a-f]{6}$/i.test(saved?.[key])) lineColors[key] = saved[key];
        } catch { /* Ignore malformed or unavailable editor preferences. */ }
    }
    function writeRectFields(rect) {
        for (const [key,field] of Object.entries(rectFields)) { field.value = number(rect[key]); originalFields.set(key,{value:rect[key],display:field.value}); }
    }
    function syncLineEditor() {
        const edge = lineSelect.value, rect = guide.unit.relative;
        const position = edge === 'left' ? rect.x : edge === 'right' ? rect.x+rect.w : edge === 'top' ? rect.y : rect.y+rect.h;
        lineColor.value = lineColors[edge]; linePosition.value = number(position);
        linePosition.dataset.originalValue = String(position); linePosition.dataset.originalDisplay = linePosition.value;
        lineSelect.disabled = lineColor.disabled = linePosition.disabled = applyLine.disabled = !rectEditable();
        for (const pick of lineSwatches.children) { pick.style.borderBottom = '2px solid '+lineColors[pick.dataset.line]; pick.setAttribute('aria-pressed',String(pick.dataset.line === edge)); }
    }
    function refreshLegend() {
        children.replaceChildren();
        const colors = guideOutlineColors(screen.elements.map(item => item.id));
        const records = [...new Map([guide.unit,...(parentOutline.checked && guide.parent ? [guide.parent] : []),...(outlines.checked ? guide.elements : guide.children)].map(item => [item.id,item])).values()];
        for (const item of records) {
            const color = item.id === guide.unit.id ? LINE_DEFAULTS.left : item === guide.parent ? '#ca7a16' : colors.get(item.id);
            const pick = action(item.name,() => select(item.id)); pick.title = item.name;
            const swatch = make('span'); swatch.className = 'dg-line-swatch'; swatch.style.borderTop = '2px solid '+color;
            pick.replaceChildren(swatch,make('span',item.name)); children.append(pick);
        }
    }
    function syncEditor() {
        const element = selectedElement(), canEdit = editable(), canRect = rectEditable();
        writeRectFields(guide.unit.relative);
        for (const field of Object.values(rectFields)) field.disabled = !canRect;
        loadLineColors(); syncLineEditor();
        applyRect.disabled = !canRect;
        editHint.textContent = !canEdit ? '읽기 전용: 편집 연결이 없는 화면입니다.' : !canRect ? '자동 배치 자식입니다. 부모 배치를 유지하므로 위치·크기와 가이드 드래그를 잠갔습니다.' : '서로 다른 색의 변으로 크기를 조절하고 위 이동 손잡이로 옮기세요. 선 색상은 편집기 표시 설정입니다.';
        const canText = canEdit && (['text','button'].includes(element?.kind) || typeof element?.text === 'string');
        textField.value = element?.text || ''; fontField.value = number(guide.unit.font?.sizePx || 16);
        fontField.dataset.originalValue = String(guide.unit.font?.sizePx || 16); fontField.dataset.originalDisplay = fontField.value;
        textField.disabled = fontField.disabled = applyText.disabled = !canText;
        const canImport = canEdit && typeof onImportImage === 'function' && !importBusy;
        imageFile.disabled = imagePath.disabled = applyImagePath.disabled = !canImport;
        removeImage.disabled = !canEdit || !element?.image;
    }
    function commit(change) {
        if (!editable() || closed) return false;
        try {
            const id = guide.unit.id;
            const next = onChange({...change,screenId,elementId:id});
            if (!next || !Array.isArray(next.screens)) throw Error('편집 결과 문서를 받지 못했습니다.');
            const copy = structuredClone(next), nextGuide = buildDesignGuide(copy,screenId,id,size);
            snapshot = copy; screen = copy.screens.find(item => item.id === screenId); guide = nextGuide;
            errorBox.hidden = true; refresh(false);
            status.textContent = '현재 설계에 반영했습니다. 저장은 편집기의 저장을 사용하세요.';
            return true;
        } catch (error) { syncEditor(); redrawOverlay(); fail(error.message || '변경을 적용하지 못했습니다.'); return false; }
    }
    async function importImage(source) {
        if (!editable() || typeof onImportImage !== 'function' || importBusy || closed) return;
        const request = ++importRequest, id = guide.unit.id;
        importBusy = true; syncEditor(); errorBox.hidden = true; status.textContent = '이미지를 불러오는 중입니다…';
        try {
            const image = await onImportImage(source);
            if (closed || request !== importRequest || id !== guide.unit.id) return;
            if (!image || typeof image !== 'object') throw Error('이미지 정보를 받지 못했습니다.');
            commit({type:'image',image});
        } catch (error) {
            if (!closed && request === importRequest && id === guide.unit.id) fail(error.message || '이미지를 불러오지 못했습니다.');
        } finally {
            if (!closed && request === importRequest) { importBusy = false; syncEditor(); }
        }
    }
    function refresh(refit = true) {
        dialog.dataset.element = guide.unit.id ?? '';
        title.textContent = '디자인 가이드 · ' + guide.unit.name;
        selectedTitle.textContent = guide.unit.name;
        subtitle.textContent = `${guide.screen.name} · 기준 ${number(guide.screen.width)} × ${number(guide.screen.height)} 논리 px · ${editable() ? '편집 가능' : '읽기 전용'}`;
        breadcrumbs.replaceChildren();
        const trail = [{id:null,name:guide.screen.name},...guide.ancestors.filter(item => item.id !== null),...(guide.unit.id === null ? [] : [guide.unit])];
        for (const [index,item] of trail.entries()) {
            if (index) breadcrumbs.append(make('span','›'));
            const link = action(item.name,() => select(item.id));
            link.setAttribute('aria-current',String(item.id === guide.unit.id)); breadcrumbs.append(link);
        }
        summary.textContent = `${guide.unit.name}\nID ${guide.unit.id ?? '(화면 루트)'}\n화면 x / y / w / h\n${rectText(guide.unit.rect)} px\n부모 x / y / w / h\n${rectText(guide.unit.relative)} px\n부모 ${rectText(guide.unit.parentPercent)} %\n화면 ${rectText(guide.unit.screenPercent)} %`;
        refreshLegend();
        edit.disabled = guide.unit.id === null || typeof onEdit !== 'function';
        const table = make('table'), caption = make('caption','선택 부품 + 직접 자식 · x / y / w / h 순서');
        const head = make('thead'), headings = make('tr');
        for (const label of ['부품','부모 기준 px\nx / y / w / h','부모 기준 %\nx / y / w / h','화면 기준 %\nx / y / w / h','부모 안쪽 여백 px\n상 / 우 / 하 / 좌','글자 · 현재 설계 설정']) headings.append(make('th',label));
        head.append(headings); const rows = make('tbody');
        for (const item of [guide.unit,...guide.children]) {
            const row = make('tr'), name = make('td'), pick = action(item.name,() => select(item.id));
            pick.setAttribute('aria-current',String(item.id === guide.unit.id)); name.append(pick,make('div',item.id ?? '(화면 루트)')); row.append(name);
            for (const value of [rectText(item.relative),rectText(item.parentPercent),rectText(item.screenPercent),['top','right','bottom','left'].map(key => number(item.margins[key])).join(' / ')]) {
                const cell = make('td',value); cell.className = 'dg-metrics'; row.append(cell);
            }
            const font = make('td',fontText(item.font)); font.className = 'dg-font'; row.append(font); rows.append(row);
        }
        table.append(caption,head,rows);
        const dimensions = make('div'); dimensions.className = 'dg-dimensions';
        for (const [index,item] of guide.dimensions.entries()) dimensions.append(make('span',`${letter(index)} · ${item.label} · ${number(item.valuePx)} px (${number(item.valuePercent)}%)`));
        data.replaceChildren(dataLabel,summary,table,dimensions);
        syncEditor(); renderStage();
        if (refit) fitStage(); else applyZoom();
    }
    function initFrame() {
        const doc = frame.contentDocument;
        if (closed || !doc?.body || frameDocument === doc) return;
        frameDocument = doc;
        const shared = doc.createElement('link'); shared.rel = 'stylesheet'; shared.href = '/ui-studio/source/styles.css';
        const local = doc.createElement('style'); local.textContent = `
html,body{margin:0!important;padding:0!important;width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;overflow:hidden!important;background:#e8edf5!important}
.dg-scroller{width:100%;height:100%;overflow:auto;padding:0;background:repeating-conic-gradient(#e6e9ed 0 25%,#f2f4f7 0 50%) 0/16px 16px;overscroll-behavior:contain;touch-action:pan-x pan-y}.dg-spacer{position:relative;margin:0;min-width:100%;min-height:100%;overflow:hidden}.dg-scene{position:absolute;transform-origin:0 0;isolation:isolate}.dg-host{position:absolute;inset:0;background:transparent;box-shadow:none}.dg-host .ui-element{cursor:pointer!important}.dg-host .ui-element:focus-visible{outline:1px solid #2f66c8!important}.dg-host .component-role-badge,.dg-host .element-badge,.dg-host .selection-hatch{display:none!important}.dg-host .isolation-shell>:not(.ui-element):not(.layout-extent){display:none!important}.dg-overlay{position:absolute;inset:0;overflow:visible;pointer-events:none;z-index:2147483646}.dg-overlay .dg-boundary{fill:none;stroke:#d52c48;stroke-width:1.5;stroke-dasharray:6 4;vector-effect:non-scaling-stroke}.dg-overlay .dg-parent{stroke:#9b5261;stroke-dasharray:3 4}.dg-overlay .dg-child{stroke:#8a9baa;stroke-width:1;stroke-dasharray:3 4}.dg-overlay .dg-unit{stroke:#2f66c8;stroke-width:1.5}.dg-overlay .dg-handle{pointer-events:none;stroke-width:1.5;stroke-dasharray:none;vector-effect:non-scaling-stroke}.dg-overlay .dg-hit{pointer-events:stroke;stroke:transparent;stroke-width:12;stroke-dasharray:none;cursor:ew-resize;touch-action:none;vector-effect:non-scaling-stroke}.dg-overlay .dg-handle-y{cursor:ns-resize}.dg-overlay .dg-move{pointer-events:all;fill:#f6f8fb;stroke:#2f66c8;stroke-width:1;cursor:move;touch-action:none;vector-effect:non-scaling-stroke}.dg-overlay .dg-drag-ghost{fill:none;stroke:#2f66c8;stroke-width:1.5;stroke-dasharray:5 3;pointer-events:none;vector-effect:non-scaling-stroke}.dg-overlay line{stroke:#d52c48;stroke-width:1;stroke-dasharray:4 3;vector-effect:non-scaling-stroke}.dg-overlay text{fill:#b31835;font-family:Arial,sans-serif;font-weight:600;text-anchor:middle;dominant-baseline:central}.dg-overlay .dg-label-bg{fill:#fff;fill-opacity:.94;stroke:#e8b1bb;stroke-width:1;vector-effect:non-scaling-stroke}
`;
        doc.head.append(shared,local); doc.body.replaceChildren();
        scroller = doc.createElement('div'); scroller.className = 'dg-scroller';
        spacer = doc.createElement('div'); spacer.className = 'dg-spacer';
        scene = doc.createElement('div'); scene.className = 'dg-scene';
        host = doc.createElement('div'); host.className = 'dg-host';
        overlay = doc.createElementNS(NS,'svg'); overlay.setAttribute('class','dg-overlay'); overlay.setAttribute('aria-label','부모와 자식 경계 및 논리 픽셀 치수');
        scene.append(host,overlay); spacer.append(scene); scroller.append(spacer); doc.body.append(scroller);
        host.addEventListener('click',event => {
            event.preventDefault(); event.stopImmediatePropagation();
            const node = event.target.closest?.('.ui-element');
            if (node && guide.elements.some(item => item.id === node.dataset.element)) select(node.dataset.element);
        },true);
        doc.addEventListener('keydown',event => {
            event.stopPropagation();
            if (event.key === 'Escape') { event.preventDefault(); if (drag) cancelDrag(); else dialog.close(); }
            else if (event.key === 'Enter' || event.key === ' ') {
                const node = event.target.closest?.('.ui-element');
                if (node && guide.elements.some(item => item.id === node.dataset.element)) { event.preventDefault(); select(node.dataset.element); }
            }
        },true);
        doc.addEventListener('pointermove',moveDrag,true);
        doc.addEventListener('pointerup',endDrag,true);
        doc.addEventListener('pointercancel',() => cancelDrag(),true);
        renderStage(); fitStage();
    }
    function renderStage() {
        if (!host || closed) return;
        const descendants = new Set(guide.elements.map(item => item.id)), ancestors = new Set(guide.ancestors.map(item => item.id));
        renderLayout(screen,host,{
            mode:'edit',assetView:'art',workspaceId,
            visible:item => descendants.has(item.id) || ancestors.has(item.id),
            shell:item => ancestors.has(item.id),
            menuState:Object.fromEntries(screen.elements.filter(item => item.menu).map(item => [item.id,true]))
        });
        scene.style.width = host.style.width = guide.screen.width + 'px';
        scene.style.height = host.style.height = guide.screen.height + 'px';
        overlay.setAttribute('width',guide.screen.width); overlay.setAttribute('height',guide.screen.height);
        redrawOverlay();
    }
    function focusBounds() {
        const bounds = guide.bounds;
        return {x:bounds.x,y:bounds.y,w:Math.max(1,bounds.w),h:Math.max(1,bounds.h)};
    }
    function redrawOverlay() {
        if (!overlay || drag) return;
        overlay.replaceChildren();
        const svg = (tag,attrs,text) => {
            const node = frameDocument.createElementNS(NS,tag);
            for (const [key,value] of Object.entries(attrs)) node.setAttribute(key,String(value));
            if (text !== undefined) node.textContent = text;
            overlay.append(node); return node;
        };
        const colors = guideOutlineColors(screen.elements.map(item => item.id));
        const records = [...new Map([...(parentOutline.checked && guide.parent ? [guide.parent] : []),guide.unit,...(outlines.checked ? guide.elements : guide.children)].map(item => [item.id,item])).values()];
        for (const item of records) {
            if (item.id === guide.unit.id && rectEditable()) continue;
            const color = item.id === guide.unit.id ? LINE_DEFAULTS.left : item === guide.parent ? '#ca7a16' : colors.get(item.id);
            svg('rect',{
                x:item.rect.x,y:item.rect.y,width:item.rect.w,height:item.rect.h,
                class:'dg-boundary','data-element':item.id ?? '',style:'stroke:'+color+';stroke-width:'+(item.id === guide.unit.id ? '1.5' : '1')
            });
        }
        if (measurements.checked) {
            const dimensions = guideDiagramDimensions(guide.dimensions).filter(([,item]) => item.kind !== 'size').slice(0,8), u = guide.unit.rect;
            const columns = Math.max(1,Math.floor(Math.max(100,u.w * zoom) / 112));
            for (const [position,[index,item]] of dimensions.entries()) {
                // The letters stay on outside rails; the full values remain in the separate table legend.
                const label = `${letter(index)} ${number(item.valuePx)}px`;
                const column = position % columns, row = Math.floor(position / columns);
                const x = u.x + (column * 112 + 56) / zoom;
                const y = u.y + u.h + (row * 22 + 24) / zoom;
                svg('line',{x1:item.x1,y1:item.y1,x2:item.x2,y2:item.y2,'data-dimension':item.key});
                svg('rect',{x:x-53/zoom,y:y-9/zoom,width:106/zoom,height:18/zoom,rx:3/zoom,class:'dg-label-bg'});
                svg('text',{x,y,'font-size':12/zoom},label);
            }
        }
        renderGuideSize(overlay,guide.unit.rect,zoom);
        if (rectEditable()) {
            const u = guide.unit.rect;
            for (const [edge,coords] of Object.entries({left:[u.x,u.y,u.x,u.y+u.h],right:[u.x+u.w,u.y,u.x+u.w,u.y+u.h],top:[u.x,u.y,u.x+u.w,u.y],bottom:[u.x,u.y+u.h,u.x+u.w,u.y+u.h]})) {
                const [x1,y1,x2,y2] = coords;
                svg('line',{x1,y1,x2,y2,class:'dg-handle',style:'stroke:'+lineColors[edge]});
                const handle = svg('line',{x1,y1,x2,y2,class:'dg-hit'+(['top','bottom'].includes(edge)?' dg-handle-y':''),'data-guide-handle':edge,tabindex:0,'aria-label':'선택 부품 '+edge+' 가이드 조절'});
                handle.addEventListener('pointerdown',event => startDrag(event,edge));
            }
            const handle = svg('rect',{x:u.x+u.w/2-22/zoom,y:u.y-28/zoom,width:44/zoom,height:18/zoom,rx:3/zoom,class:'dg-move','data-guide-handle':'move',tabindex:0,'aria-label':'선택 부품 이동'});
            svg('text',{x:u.x+u.w/2,y:u.y-19/zoom,'font-size':11/zoom,style:'fill:#2f66c8'},'↔ 이동');
            handle.addEventListener('pointerdown',event => startDrag(event,'move'));
        }
    }
    function startDrag(event,edge) {
        if (!rectEditable() || drag || event.button !== undefined && event.button !== 0) return;
        event.preventDefault(); event.stopPropagation();
        const target = event.currentTarget, rect = {...guide.unit.relative};
        const ghost = frameDocument.createElementNS(NS,'rect'); ghost.setAttribute('class','dg-drag-ghost'); overlay.append(ghost);
        drag = {id:guide.unit.id,edge,pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,zoom,base:rect,rect,target,ghost,origin:{x:guide.unit.rect.x-rect.x,y:guide.unit.rect.y-rect.y}};
        updateGhost(); target.focus?.(); target.setPointerCapture?.(event.pointerId);
        status.textContent = '가이드 조절 중… 놓으면 적용, Escape는 취소합니다.';
    }
    function updateGhost() {
        for (const [key,value] of Object.entries({x:drag.rect.x+drag.origin.x,y:drag.rect.y+drag.origin.y,width:drag.rect.w,height:drag.rect.h})) drag.ghost.setAttribute(key,value);
        writeRectFields(drag.rect);
        renderGuideSize(overlay,{...drag.rect,x:drag.rect.x+drag.origin.x,y:drag.rect.y+drag.origin.y},zoom);
    }
    function moveDrag(event) {
        if (!drag || event.pointerId !== drag.pointerId) return;
        event.preventDefault();
        drag.rect = guideDragRect(drag.base,drag.edge,event.clientX-drag.startX,event.clientY-drag.startY,drag.zoom);
        updateGhost();
    }
    function releaseDrag() {
        const current = drag; if (!current) return null;
        drag = null; current.ghost.remove();
        try { current.target.releasePointerCapture?.(current.pointerId); } catch { /* Pointer may already have been released. */ }
        return current;
    }
    function cancelDrag() {
        if (!releaseDrag()) return;
        syncEditor(); redrawOverlay(); status.textContent = '가이드 조절을 취소했습니다.';
    }
    function endDrag(event) {
        if (!drag || event.pointerId !== drag.pointerId) return;
        event.preventDefault(); moveDrag(event);
        const current = releaseDrag();
        if (current.id === guide.unit.id && Object.keys(current.base).some(key => current.base[key] !== current.rect[key])) commit({type:'rect',rect:current.rect});
        else { syncEditor(); redrawOverlay(); }
    }
    function applyZoom() {
        scaleLabel.textContent = Math.round(zoom * 100) + '%';
        if (!scene) return;
        const bounds = focusBounds(), padding = measurements.checked ? 96 : 36, topPadding = measurements.checked ? 96 : 64;
        scene.style.transform = `scale(${zoom})`;
        scene.style.left = padding - bounds.x * zoom + 'px'; scene.style.top = topPadding - bounds.y * zoom + 'px';
        spacer.style.width = bounds.w * zoom + padding * 2 + 'px'; spacer.style.height = bounds.h * zoom + topPadding + padding + 'px';
        redrawOverlay();
    }
    function fitStage() {
        fitting = true;
        if (scroller?.clientWidth && scroller?.clientHeight) {
            const bounds = focusBounds();
            zoom = Math.min(4,Math.max(.05,Math.min((scroller.clientWidth-(measurements.checked?192:72))/bounds.w,(scroller.clientHeight-(measurements.checked?192:100))/bounds.h)));
            scroller.scrollLeft = scroller.scrollTop = 0;
        }
        applyZoom();
    }
    function changeZoom(next) {
        fitting = false; zoom = Math.max(.05,Math.min(8,next)); applyZoom();
    }
    dialog.addEventListener('cancel',event => { event.preventDefault(); if (drag) cancelDrag(); else dialog.close(); });
    dialog.addEventListener('keydown',event => {
        event.stopPropagation();
        if (event.key === 'Escape') { event.preventDefault(); if (drag) cancelDrag(); else dialog.close(); }
    });
    dialog.addEventListener('close',() => {
        closed = true; ++importRequest; releaseDrag(); observer?.disconnect(); dialog.remove();
        if (opener?.isConnected && typeof opener.focus === 'function') opener.focus();
    },{once:true});
    frame.addEventListener('load',initFrame);
    refresh(); document.body.append(dialog); dialog.showModal(); close.focus();
    observer?.observe(stage); initFrame();
    return dialog;
}
