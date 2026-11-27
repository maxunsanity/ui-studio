import {buildDesignGuide} from './design-guides.mjs';
import {renderLayout} from './layout-view.mjs';

const NS = 'http://www.w3.org/2000/svg';
const number = value => Number.isFinite(value) ? String(Number(value.toFixed(2))) : '미확인';
const letter = index => {
    let label = '';
    do { label = String.fromCharCode(65 + index % 26) + label; index = Math.floor(index / 26) - 1; } while (index >= 0);
    return label;
};
const rectText = rect => ['x','y','w','h'].map(key => number(rect[key])).join(' / ');
const fontText = font => font ? [
    `${number(font.sizePx)} px (${font.source === 'explicit' ? '명시 설정' : '렌더러 기본'})`,
    `글꼴 ${font.family || '미지정'} · 굵기 ${font.weight ?? '미지정'}`,
    `줄 높이 ${font.lineHeight ?? '미지정'} · 자간 ${font.letterSpacing ?? '미지정'}`,
    `정렬 ${font.align || '미지정'} / ${font.vertical || '미지정'} · 줄바꿈 ${font.wrap || '미지정'} · 넘침 ${font.overflow || '미지정'}`
].join('\n') : '글자 설정 없음';

/** Read-only snapshot; editing is delegated to the caller's existing navigation guard. */
export function openDesignGuide({document:design,screenId,elementId = null,workspaceId = null,size,onSelect,onEdit} = {}) {
    const snapshot = structuredClone(design);
    let guide = buildDesignGuide(snapshot,screenId,elementId,size);
    const screen = snapshot.screens.find(item => item.id === screenId);
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
.ux-design-guide button{font:inherit;background:#fff;color:inherit;border:1px solid #aab9ca;border-radius:6px;padding:6px 10px;cursor:pointer;min-height:32px;max-width:100%;overflow-wrap:anywhere}.ux-design-guide button:disabled{cursor:default;opacity:.45}.ux-design-guide button:focus-visible{outline:3px solid #148d80;outline-offset:2px}.ux-design-guide button[aria-current=true]{background:#e4f3ee;border-color:#168374;color:#126a5e;font-weight:600}
.ux-design-guide .dg-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:10px 18px;border-bottom:1px solid #d4dce7;flex:none}.ux-design-guide .dg-breadcrumbs{display:flex;align-items:center;gap:6px;flex:1;flex-wrap:wrap;min-width:0}.ux-design-guide .dg-breadcrumbs button{font-size:12px}.ux-design-guide .dg-zoom{display:flex;align-items:center;gap:6px}.ux-design-guide .dg-scale{min-width:54px;text-align:center;font-variant-numeric:tabular-nums}
.ux-design-guide .dg-body{display:grid;grid-template-columns:minmax(0,1fr) 340px;min-height:0;flex:1}.ux-design-guide .dg-stage{position:relative;min-width:0;min-height:220px;background:#e8edf5}.ux-design-guide iframe{width:100%;height:100%;display:block;border:0}.ux-design-guide .dg-sidebar{padding:14px;min-width:0;overflow:auto;border-left:1px solid #d4dce7;background:#fff}.ux-design-guide h3{font-size:13px;margin:0 0 8px}.ux-design-guide .dg-summary{white-space:pre-wrap;overflow-wrap:anywhere;margin:0 0 14px;font:12px/1.7 ui-monospace,SFMono-Regular,monospace}.ux-design-guide .dg-children{display:flex;flex-direction:column;gap:5px;margin-bottom:16px}.ux-design-guide .dg-children button{text-align:left}.ux-design-guide .dg-note{margin:0;color:#5c6e84;font-size:12px;overflow-wrap:anywhere}
.ux-design-guide .dg-data{border-top:1px solid #d4dce7;max-height:35%;overflow:auto;background:#fff;flex:none}.ux-design-guide table{width:100%;border-collapse:collapse;min-width:1060px;text-align:left;font-size:12px;font-variant-numeric:tabular-nums}.ux-design-guide caption{text-align:left;padding:9px 14px;font-weight:600}.ux-design-guide th,.ux-design-guide td{padding:8px 10px;border-top:1px solid #e2e8f0;vertical-align:top;white-space:pre-line;overflow-wrap:anywhere}.ux-design-guide th{background:#f0f4f9;position:sticky;top:0;z-index:1}.ux-design-guide td:first-child{min-width:150px;max-width:230px}.ux-design-guide .dg-metrics{min-width:128px}.ux-design-guide .dg-font{min-width:245px}.ux-design-guide .dg-dimensions{padding:10px 14px;display:flex;gap:8px 18px;flex-wrap:wrap;border-top:1px solid #e2e8f0}.ux-design-guide .dg-dimensions span{font-size:12px;color:#a12134}.ux-design-guide footer{display:flex;gap:12px;align-items:center;justify-content:space-between;padding:10px 18px;border-top:1px solid #d4dce7;flex:none}.ux-design-guide .dg-edit{background:#157d71;color:#fff;border-color:#157d71}
@media(max-width:760px){.ux-design-guide{width:calc(100vw - 12px);height:calc(100dvh - 12px)}.ux-design-guide header,.ux-design-guide .dg-toolbar,.ux-design-guide footer{padding:10px}.ux-design-guide .dg-body{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(230px,1fr) 140px}.ux-design-guide .dg-sidebar{border-left:0;border-top:1px solid #d4dce7}.ux-design-guide .dg-data{max-height:27%}.ux-design-guide footer{align-items:start;flex-wrap:wrap}.ux-design-guide h2{font-size:15px}}
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
    zoomBar.append(zoomOut,scaleLabel,zoomIn,fit); toolbar.append(breadcrumbs,zoomBar);
    const body = make('div'); body.className = 'dg-body';
    const stage = make('section'); stage.className = 'dg-stage'; stage.setAttribute('aria-label','실제 UI와 빨간 점선 치수');
    const frame = make('iframe'); frame.className = 'dg-frame'; frame.title = '유닛 실제 UI · 빨간 점선 디자인 가이드';
    frame.setAttribute('sandbox','allow-same-origin');
    const sidebar = make('aside'); sidebar.className = 'dg-sidebar';
    const selectedTitle = make('h3','선택 부품 · 논리 px');
    const summary = make('pre'); summary.className = 'dg-summary';
    const childrenTitle = make('h3','직접 자식 · 눌러서 선택');
    const children = make('div'); children.className = 'dg-children';
    const note = make('p','현재 설계의 논리 px입니다. 부모 %와 화면 %는 기준이 다릅니다. 글자 정보는 설계 설정이며 원본 스크린샷의 폰트는 미확인입니다. 원본 글자의 가시 경계와 부품의 배치 사각형은 서로 다릅니다.'); note.className = 'dg-note';
    sidebar.append(selectedTitle,summary,childrenTitle,children,note); stage.append(frame); body.append(stage,sidebar);
    const data = make('section'); data.className = 'dg-data'; data.setAttribute('aria-label','위치 크기 여백 글자 명세');
    const footer = make('footer'), status = make('p','선택과 확대는 문서를 변경하지 않습니다.'); status.className = 'dg-note'; status.setAttribute('role','status');
    const edit = action('선택 부품 세부 편집',() => {
        if (guide.unit.id === null || typeof onEdit !== 'function') return;
        const id = guide.unit.id; dialog.close(); onEdit(id);
    }); edit.className = 'dg-edit';
    footer.append(status,edit); dialog.append(style,header,toolbar,body,data,footer);

    let closed = false, zoom = 1, fitting = true, frameDocument, scroller, spacer, scene, host, overlay;
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(() => { if (fitting) fitStage(); }) : null;
    function select(id) {
        if (closed || id === guide.unit.id) return;
        guide = buildDesignGuide(snapshot,screenId,id,size);
        refresh();
        onSelect?.(id);
        // Selection replaces the clicked row or iframe node; keep focus in the new view.
        data.querySelector?.('button[aria-current="true"]')?.focus();
    }
    function refresh() {
        dialog.dataset.element = guide.unit.id ?? '';
        title.textContent = 'UNIT DESIGN GUIDELINE VIEW · ' + guide.unit.name;
        subtitle.textContent = `${guide.screen.name} · 기준 ${number(guide.screen.width)} × ${number(guide.screen.height)} 논리 px · 읽기 전용`;
        breadcrumbs.replaceChildren();
        const trail = [{id:null,name:guide.screen.name},...guide.ancestors.filter(item => item.id !== null),...(guide.unit.id === null ? [] : [guide.unit])];
        for (const [index,item] of trail.entries()) {
            if (index) breadcrumbs.append(make('span','›'));
            const link = action(item.name,() => select(item.id));
            link.setAttribute('aria-current',String(item.id === guide.unit.id)); breadcrumbs.append(link);
        }
        summary.textContent = `${guide.unit.name}\nID ${guide.unit.id ?? '(화면 루트)'}\n화면 x / y / w / h\n${rectText(guide.unit.rect)} px\n부모 x / y / w / h\n${rectText(guide.unit.relative)} px\n부모 ${rectText(guide.unit.parentPercent)} %\n화면 ${rectText(guide.unit.screenPercent)} %`;
        children.replaceChildren();
        for (const item of guide.children) children.append(action(item.name,() => select(item.id)));
        if (!guide.children.length) children.append(make('p','직접 자식 없음'));
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
        data.replaceChildren(table,dimensions);
        renderStage();
        fitting = true; fitStage();
    }
    function initFrame() {
        const doc = frame.contentDocument;
        if (closed || !doc?.body || frameDocument === doc) return;
        frameDocument = doc;
        const shared = doc.createElement('link'); shared.rel = 'stylesheet'; shared.href = '/ui-studio/source/styles.css';
        const local = doc.createElement('style'); local.textContent = `
html,body{margin:0!important;padding:0!important;width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;overflow:hidden!important;background:#e8edf5!important}
.dg-scroller{width:100%;height:100%;overflow:auto;padding:0;overscroll-behavior:contain;touch-action:pan-x pan-y}.dg-spacer{position:relative;margin:0;min-width:100%;min-height:100%;overflow:hidden}.dg-scene{position:absolute;transform-origin:0 0;isolation:isolate}.dg-host{position:absolute;inset:0;background:#f9f8f2}.dg-host .ui-element{cursor:pointer!important}.dg-host .isolation-shell>:not(.ui-element):not(.layout-extent){display:none!important}.dg-overlay{position:absolute;inset:0;overflow:visible;pointer-events:none;z-index:2147483646}.dg-overlay .dg-boundary{fill:none;stroke:#d52c48;stroke-width:1.5;stroke-dasharray:6 4;vector-effect:non-scaling-stroke}.dg-overlay .dg-parent{stroke:#9b5261;stroke-dasharray:3 4}.dg-overlay .dg-unit{stroke-width:2}.dg-overlay line{stroke:#d52c48;stroke-width:1;stroke-dasharray:4 3;vector-effect:non-scaling-stroke}.dg-overlay text{fill:#b31835;font-family:Arial,sans-serif;font-weight:600;text-anchor:middle;dominant-baseline:central}.dg-overlay .dg-label-bg{fill:#fff;fill-opacity:.94;stroke:#e8b1bb;stroke-width:1;vector-effect:non-scaling-stroke}
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
            if (event.key === 'Escape') { event.preventDefault(); dialog.close(); }
            else if (event.key === 'Enter' || event.key === ' ') {
                const node = event.target.closest?.('.ui-element');
                if (node && guide.elements.some(item => item.id === node.dataset.element)) { event.preventDefault(); select(node.dataset.element); }
            }
        },true);
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
        const rectangles = [guide.bounds];
        const x = Math.min(...rectangles.map(item => item.x),...guide.dimensions.map(item => Math.min(item.x1,item.x2)));
        const y = Math.min(...rectangles.map(item => item.y),...guide.dimensions.map(item => Math.min(item.y1,item.y2)));
        const right = Math.max(...rectangles.map(item => item.x + item.w),...guide.dimensions.map(item => Math.max(item.x1,item.x2)));
        const bottom = Math.max(...rectangles.map(item => item.y + item.h),...guide.dimensions.map(item => Math.max(item.y1,item.y2)));
        return {x,y,w:Math.max(1,right-x),h:Math.max(1,bottom-y)};
    }
    function redrawOverlay() {
        if (!overlay) return;
        overlay.replaceChildren();
        const svg = (tag,attrs,text) => {
            const node = frameDocument.createElementNS(NS,tag);
            for (const [key,value] of Object.entries(attrs)) node.setAttribute(key,String(value));
            if (text !== undefined) node.textContent = text;
            overlay.append(node); return node;
        };
        const records = [...new Map([...(guide.parent ? [guide.parent] : []),guide.unit,...guide.elements].map(item => [item.id,item])).values()];
        for (const [index,item] of records.entries()) svg('rect',{
            x:item.rect.x,y:item.rect.y,width:item.rect.w,height:item.rect.h,
            class:'dg-boundary' + (index === 0 && guide.parent ? ' dg-parent' : '') + (item.id === guide.unit.id ? ' dg-unit' : ''),
            'data-element':item.id ?? ''
        });
        for (const [index,item] of guide.dimensions.entries()) {
            svg('line',{x1:item.x1,y1:item.y1,x2:item.x2,y2:item.y2,'data-dimension':item.key});
            const label = `${letter(index)} ${number(item.valuePx)}px (${number(item.valuePercent)}%)`;
            const x = (item.x1 + item.x2) / 2, y = (item.y1 + item.y2) / 2 - 11 / zoom;
            const width = (label.length * 7 + 12) / zoom;
            svg('rect',{x:x-width/2,y:y-9/zoom,width,height:18/zoom,rx:3/zoom,class:'dg-label-bg'});
            svg('text',{x,y,'font-size':12/zoom},label);
        }
    }
    function applyZoom() {
        scaleLabel.textContent = Math.round(zoom * 100) + '%';
        if (!scene) return;
        const bounds = focusBounds(), padding = 80;
        scene.style.transform = `scale(${zoom})`;
        scene.style.left = padding - bounds.x * zoom + 'px'; scene.style.top = padding - bounds.y * zoom + 'px';
        spacer.style.width = bounds.w * zoom + padding * 2 + 'px'; spacer.style.height = bounds.h * zoom + padding * 2 + 'px';
        redrawOverlay();
    }
    function fitStage() {
        fitting = true;
        if (scroller?.clientWidth && scroller?.clientHeight) {
            const bounds = focusBounds();
            zoom = Math.min(4,Math.max(.05,Math.min((scroller.clientWidth-160)/bounds.w,(scroller.clientHeight-160)/bounds.h)));
            scroller.scrollLeft = scroller.scrollTop = 0;
        }
        applyZoom();
    }
    function changeZoom(next) {
        fitting = false; zoom = Math.max(.05,Math.min(8,next)); applyZoom();
    }
    dialog.addEventListener('cancel',event => { event.preventDefault(); dialog.close(); });
    dialog.addEventListener('keydown',event => {
        event.stopPropagation();
        if (event.key === 'Escape') { event.preventDefault(); dialog.close(); }
    });
    dialog.addEventListener('close',() => {
        closed = true; observer?.disconnect(); dialog.remove();
        if (opener?.isConnected && typeof opener.focus === 'function') opener.focus();
    },{once:true});
    frame.addEventListener('load',initFrame);
    refresh(); document.body.append(dialog); dialog.showModal(); close.focus();
    observer?.observe(stage); initFrame();
    return dialog;
}
