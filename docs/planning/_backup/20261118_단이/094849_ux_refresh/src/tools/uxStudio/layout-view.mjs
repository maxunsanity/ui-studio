import {attachControls,controlContainerIds} from './controls.mjs';
import {assetSource} from './asset-reference.mjs';
import {responsiveStyles,responsiveContentSize} from './responsive-layout.mjs';
import { applySkin, SKIN_ASSETS } from './skins.mjs';
import { inputMode, inputOwner, typographyStyles } from './parts.mjs';
import { menuIsOpen } from './menu-state.mjs';
import {applyShadow} from './visual-effects.mjs';
import {formatNotification} from './notification.mjs';
import {attachButtonStates} from './button-state.mjs';
import {attachScrollPins} from './scroll-pin.mjs';
const NS = 'http://www.w3.org/2000/svg';
const fullscreenRootStyle={position:'absolute',inset:'0',width:'100%',height:'100%',maxWidth:'none',maxHeight:'none',margin:'0',padding:'0',background:'transparent',border:'0',borderImage:'none',borderRadius:'0',boxShadow:'none',outline:'0'};
/** Fullscreen is a transparent UI coordinate root; the backdrop owns dimming and blocking. */
export function applyOverlayRoot(node,screen,options={}){
    const fullscreen=screen.presentation?.rootMode==='fullscreen';
    node.dataset.overlayRoot=fullscreen?'fullscreen':'window';
    applySkin(node,fullscreen?undefined:screen.skin,options);
    if(fullscreen){Object.assign(node.style,fullscreenRootStyle);node.style.pointerEvents='none';}
    else if(node._fullscreenRoot){for(const key of Object.keys(fullscreenRootStyle))node.style[key]='';node.style.pointerEvents='auto';}
    node._fullscreenRoot=fullscreen;
}
export function unitSurface(a = {}) {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'unit-surface');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', a.shape === 'circle' ? 'xMidYMid meet' : 'none');
    svg.setAttribute('aria-hidden', 'true');
    const shape = a.shape || 'rounded';
    let node;
    if (['hexagon', 'triangle', 'diamond'].includes(shape)) {
        node = document.createElementNS(NS, 'polygon');
        node.setAttribute('points', {
            hexagon: '25,2 75,2 98,50 75,98 25,98 2,50', triangle: '50,2 98,98 2,98', diamond: '50,2 98,50 50,98 2,50'
        }[shape]);
    }
    else if (['circle', 'ellipse'].includes(shape)) {
        node = document.createElementNS(NS, 'ellipse');
        for (const [k, v] of Object.entries({
            cx: 50, cy: 50, rx: 48, ry: 48
        }))
            node.setAttribute(k, v);
    }
    else {
        node = document.createElementNS(NS, 'rect');
        for (const [k, v] of Object.entries({
            x: 1, y: 1, width: 98, height: 98, rx: shape === 'rectangle' ? 0 : shape === 'capsule' ? 49 : a.radius ?? 12
        }))
            node.setAttribute(k, v);
    }
    node.setAttribute('fill', a.fill || '#e8edf2');
    node.setAttribute('stroke', a.stroke || '#71839a');
    node.setAttribute('stroke-width', a.strokeWidth ?? 1.5);
    node.setAttribute('vector-effect', 'non-scaling-stroke');
    svg.append(node);
    return svg;
}
/** Own the UI nodes; slot contents belong to the consumer and survive layout updates. */
export function renderLayout(screen, container, { mode = 'view', selectedScreen, selectedElement, selectedIds = [], grid = false, text = e => e.text || '', visible = () => true, shell = () => false, rowY = () => undefined, slots = new Map(), menuState = {}, values = {}, children, assetView = 'wire', transitions = [], inspectInput = false, highlightInput, skinState, skinElement, workspaceId, runtime = {}, buttonPreview, buttonElement, suppressedElements = new Set() } = {}, parentId = null) {
    if (highlightInput === undefined)
        highlightInput = mode === 'edit' && inspectInput ? inputOwner(screen, selectedElement, transitions)?.id || null : null;
    if (!children) {
        children = new Map();
        for (const e of screen.elements) {
            const key = e.parentId || null;
            if (!children.has(key))
                children.set(key, []);
            children.get(key).push(e);
        }
    }
    const parentBadge = screen.elements.find(e => e.id === parentId && e.partRole === 'badge' && (e.component || e.isGroup));
    const parentNotification = parentBadge ? formatNotification(parentBadge.notification,values) : null;
    const controlContainers = controlContainerIds(screen);
    const desired = (children.get(parentId) || []).filter(visible);
    const existing = new Map([...container.children].filter(n => n.classList.contains('ui-element')).map(n => [n.dataset.element, n]));
    for (const e of desired) {
        let node = existing.get(e.id);
        const im = inputMode(e, transitions);
        const tag = e.kind === 'button' && im === 'action' && !e.component && !controlContainers.has(e.id) ? 'BUTTON' : 'DIV';
        if (node && node.tagName !== tag) {
            node.remove();
            node = null;
        }
        if (!node) {
            node = document.createElement(tag.toLowerCase());
            container.append(node);
        }
        existing.delete(e.id);
        const selected = mode === 'edit' && screen.id === selectedScreen && (e.id === selectedElement || selectedIds.includes(e.id));
        node.className = 'ui-element kind-' + e.kind + (selected ? ' selected' : '') + (e.isGroup ? ' is-group' : '') + (shell(e) ? ' isolation-shell' : '');
        node.dataset.element = e.id;
        node.dataset.screen = screen.id;
        node.dataset.partRole = e.partRole || '';
        node.dataset.inputMode = im;
        node.classList.toggle('compound-unit', !!e.component);
        node.classList.toggle('image-part', e.kind === 'image');
        const filled = !!(e.image?.src || e.image?.assetRef || e.image?.asset);
        node.classList.toggle('image-filled', filled);
        node.classList.toggle('show-input', mode === 'edit' && inspectInput && e.id === highlightInput);
        let roleBadge = node.querySelector(':scope > .component-role-badge');
        if (mode === 'edit' && e.component && (e.component === 'image-frame' || selected || e.id === highlightInput)) {
            if (!roleBadge) {
                roleBadge = document.createElement('span');
                roleBadge.className = 'component-role-badge';
                node.append(roleBadge);
            }
            roleBadge.textContent = e.interaction?.enabled === false ? '비활성' : ({
                action: '탭', none: '표시 전용', parent: '부모 전달', block: '입력 차단'
            })[im];
        }
        else
            roleBadge?.remove();
        node.classList.toggle('compact-image', !!e.image?.compact);
        node.dataset.hitShape = e.interaction?.shape || 'rectangle';
        if (mode !== 'edit' && im === 'action' && !e.control) {
            node.tabIndex = e.interaction?.enabled === false ? -1 : 0;
            node.setAttribute('role', 'button');
            node.setAttribute('aria-label', e.name);
            node.setAttribute('aria-disabled', String(e.interaction?.enabled === false));
        }
        else {
            node.removeAttribute('role');
            node.removeAttribute('aria-label');
            node.removeAttribute('aria-disabled');
            if (mode !== 'edit')
                node.removeAttribute('tabindex');
        }
        node.classList.toggle('input-disabled', e.interaction?.enabled === false);
        node.style.cssText = `left:${e.x}%;top:${e.y}%;width:${e.w}%;height:${e.h}%;font-size:${e.fontSize || 16}px;`;
        // Keep mounted controls and scroll position while the overlay temporarily masks UI.
        node.style.visibility = suppressedElements.has(e.id) ? 'hidden' : '';
        node.style.pointerEvents = mode !== 'edit' && im === 'none' && ['image', 'text'].includes(e.kind) ? 'none' : 'auto';
        if (e.inset) {
            const [t, r, b, l] = e.inset;
            Object.assign(node.style, {
                left: l + 'px', top: t + 'px', width: `calc(100% - ${l + r}px)`, height: `calc(100% - ${t + b}px)`
            });
        }
        Object.assign(node.style,responsiveStyles(screen,e));
        let extent = node.querySelector(':scope > .layout-extent');
        const contentSize = responsiveContentSize(screen,e);
        if (contentSize) {
            if (!extent) {extent=document.createElement('span');extent.className='layout-extent';extent.setAttribute('aria-hidden','true');node.append(extent);}
            extent.style.cssText=`position:absolute;left:0;top:0;width:${contentSize.w}px;height:${contentSize.h}px;visibility:hidden;pointer-events:none;`;
        } else extent?.remove();
        const filteredY = rowY(e);
        if (Number.isFinite(filteredY)) node.style.top = filteredY + '%';
        if (tag === 'BUTTON')
            node.type = 'button';
        if (mode === 'edit')
            node.tabIndex = 0;
        const surfaceKey = JSON.stringify([e.appearance, e.isGroup, e.component, e.partRole, e.kind, !!e.skin, filled, shell(e)]);
        if (node._surfaceKey !== surfaceKey) {
            node.querySelector(':scope > .unit-surface')?.remove();
            if (e.appearance && !(e.partRole === 'label' && e.kind === 'text') && !e.isGroup && !e.component && !e.skin && !filled && !shell(e)) {
                const surface = unitSurface(e.appearance);
                if (e.partRole === 'frame')
                    surface.lastElementChild.setAttribute('fill', 'none');
                node.prepend(surface);
            }
            node._surfaceKey = surfaceKey;
        }
        if (e.appearance && !e.isGroup && !shell(e)) {
            node.classList.add('has-appearance');
            node.style.color = e.appearance.textColor || '#243549';
            node.style.opacity = e.appearance.opacity ?? 1;
            if (e.appearance.variant && !(e.control && ['toggle', 'slider', 'tabs', 'progress'].includes(e.appearance.variant)))
                node.classList.add('variant-' + e.appearance.variant);
        }
        let content = node.querySelector(':scope > .element-text');
        if (!content) {
            content = document.createElement('span');
            content.className = 'element-text';
            node.append(content);
        }
        const notification=e.partRole==='badge'?formatNotification(e.notification,values):null;
        if(notification){node.hidden=notification.hidden;node._notificationApplied=true;}
        else if(node._notificationApplied){node.hidden=false;delete node._notificationApplied;}
        const compoundBadge = e.partRole === 'badge' && !!(e.component || e.isGroup);
        const labelNotification = e.partRole === 'label' ? parentNotification : null;
        content.textContent = shell(e) || compoundBadge ? '' : notification?.text ?? labelNotification?.text ?? text(e);
        const typographyKey = JSON.stringify(e.typography || null);
        if (content._typographyKey !== typographyKey) {
            // Reset overrides on restore; skip unchanged text style writes during selection redraws.
            Object.assign(content.style, typographyStyles(e));
            content._typographyKey = typographyKey;
        }
        node.style.alignItems = ({top:'flex-start',middle:'center',bottom:'flex-end'})[e.typography?.vertical] || '';
        renderImagePart(node, e, assetView, shell(e), workspaceId);
        applySkin(node, e.skin, {
            workspaceId, view: assetView, state: e.interaction?.enabled === false ? 'disabled' : e.id === skinElement ? skinState : undefined, live: mode !== 'edit'
        });
        applyShadow(node,e.effects,{assetView,shell:shell(e)});
        for (const h of node.querySelectorAll(':scope > .selection-hatch'))
            h.remove();
        if (selected) {
            const hatch = unitSurface({
                ...e.appearance, shape: e.appearance?.shape || 'rectangle', strokeWidth: 0
            });
            hatch.classList.add('selection-hatch');
            const key = 'hatch-' + crypto.randomUUID(), defs = document.createElementNS(NS, 'defs'), pattern = document.createElementNS(NS, 'pattern');
            pattern.setAttribute('id', key);
            pattern.setAttribute('width', '8');
            pattern.setAttribute('height', '8');
            pattern.setAttribute('patternUnits', 'userSpaceOnUse');
            pattern.setAttribute('patternTransform', 'rotate(45)');
            const line = document.createElementNS(NS, 'path');
            line.setAttribute('d', 'M0 0 V8');
            line.setAttribute('stroke', '#007f73');
            line.setAttribute('stroke-width', '2');
            pattern.append(line);
            defs.append(pattern);
            hatch.prepend(defs);
            hatch.lastElementChild.setAttribute('fill', 'url(#' + key + ')');
            hatch.style.opacity = '.23';
            node.append(hatch);
        }
        node.querySelector(':scope > .element-badge')?.remove();
        if (mode === 'edit' && grid && selected) {
            const badge = document.createElement('span');
            badge.className = 'element-badge';
            badge.textContent = (screen.elements.indexOf(e) + 1) + ' ' + e.name;
            node.append(badge);
        }
        if (shell(e))
            node.style.opacity = 1;
        if (e.binding?.type === 'content-slot') {
            node.dataset.contentSlot = e.binding.slot;
            const provider = slots.get(e.binding.slot);
            if (provider) {
                content.hidden = true;
                if (provider.parentNode !== node)
                    node.append(provider);
            }
            else
                content.hidden = false;
        }
        else
            delete node.dataset.contentSlot;
        let header = node.querySelector(':scope > .menu-toggle');
        if (e.menu) {
            if (!header) {
                header = document.createElement('button');
                header.type = 'button';
                header.className = 'menu-toggle';
                node.append(header);
            }
            const open = menuIsOpen(e, menuState);
            header.dataset.menuToggle = e.id;
            header.dataset.screen = screen.id;
            header.textContent = (open ? '▾ ' : '▸ ') + (e.text || e.name);
            header.setAttribute('aria-expanded', String(open));
            header.style.height = e.menu.headerHeight + 'px';
            content.hidden = true;
            if (!open)
                node.style.height = e.menu.headerHeight + 'px';
            renderLayout(screen, node, {
                mode, selectedScreen, selectedElement, selectedIds, grid, text, visible: open ? visible : () => false, shell, rowY, slots, menuState, values, children, assetView, transitions, inspectInput, highlightInput, skinState, skinElement, workspaceId, runtime, buttonPreview, buttonElement, suppressedElements
            }, e.id);
        }
        else {
            header?.remove();
            renderLayout(screen, node, {
                mode, selectedScreen, selectedElement, selectedIds, grid, text, visible, shell, rowY, slots, menuState, values, children, assetView, transitions, inspectInput, highlightInput, skinState, skinElement, workspaceId, runtime, buttonPreview, buttonElement, suppressedElements
            }, e.id);
        }
    }
    for (const node of existing.values())
        node.remove();
    // Reconcile only changed sibling order, keeping unchanged control subtrees in place.
    const painted = [...container.children].filter(node => node.classList.contains('ui-element'));
    for (let index = 0; index < desired.length; index++) {
        if (painted[index]?.dataset.element === desired[index].id) continue;
        const from = painted.findIndex(node => node.dataset.element === desired[index].id);
        if (from < 0) continue;
        const node = painted[from];
        container.insertBefore(node, painted[index] || null);
        painted.splice(from, 1); painted.splice(index, 0, node);
    }
    if (parentId === null) {
        attachControls(container, screen, runtime, {mode:'edit',workspaceId,assetView});
        attachButtonStates(container,screen,runtime,{mode,assetView,transitions,shell,preview:buttonPreview,previewElement:buttonElement,renderGraphic:(node,element,image)=>{
            let skin=element.skin;
            if(skin&&!element.image&&!image?.region){
                renderImagePart(node,element,assetView,false,workspaceId);
                if(image){
                    const original=skin.textures?.normal||SKIN_ASSETS[skin.asset];
                    const [w,h]=image.sourceSize||[original.w,original.h];
                    const texture={...image,w,h,src:image.asset?SKIN_ASSETS[image.asset].src:image.src};
                    // Keep live CSS pseudo-states on the image already chosen by the button controller.
                    skin={...skin,textures:Object.fromEntries(['normal','highlighted','pressed','selected','disabled'].map(state=>[state,texture]))};
                }
            }else renderImagePart(node,{...element,image},assetView,false,workspaceId);
            if(element.skin&&!element.image)applySkin(node,skin,{workspaceId,view:assetView,state:element.interaction?.enabled===false?'disabled':element.id===skinElement?skinState:undefined,live:mode!=='edit'});
        }});
        attachScrollPins(container,screen);
    }
}
function renderImagePart(node, e, view, isShell, workspaceId) {
    const old = node.querySelector(':scope > .image-content');
    if ((!e.image && e.kind !== 'image') || isShell) {
        old?.remove();
        return;
    }
    const key = JSON.stringify([e.image, view, e.name, e.image?.assetRef ? assetSource(e.image, workspaceId) : null]);
    if (old?.dataset.key === key)
        return;
    old?.remove();
    const box = document.createElement('div');
    box.className = 'image-content';
    box.dataset.key = key;
    if (e.image?.asset || view === 'art' && (e.image?.src || e.image?.assetRef)) {
        if (view === 'art' && e.image.topArchHeight > 0) {
            const height = `min(100%, ${e.image.topArchHeight}px)`;
            box.style.borderRadius = `50% 50% 0 0 / ${height} ${height} 0 0`;
        }
        if (e.image.region && !e.image.asset) {
            const sprite = document.createElementNS(NS, 'svg');
            sprite.classList.add('sprite-region-image');
            sprite.setAttribute('viewBox', e.image.region.join(' '));
            sprite.setAttribute('preserveAspectRatio', e.image.fit === 'fill' ? 'none' : e.image.fit === 'cover' ? 'xMidYMid slice' : 'xMidYMid meet');
            sprite.setAttribute('role', 'img');
            sprite.setAttribute('aria-label', e.image.alt || e.name);
            const source = document.createElementNS(NS, 'image');
            source.setAttribute('href', assetSource(e.image, workspaceId));
            source.addEventListener('error', () => {
                sprite.remove();
                box.classList.add('image-missing');
                box.append(document.createTextNode('이미지 오류 · ' + (e.image.alt || e.name)));
            }, {once:true});
            source.setAttribute('width', e.image.sourceSize[0]);
            source.setAttribute('height', e.image.sourceSize[1]);
            sprite.append(source);
            box.append(sprite);
            node.append(box);
            return;
        }
        const img = document.createElement('img');
        img.src = e.image.asset ? SKIN_ASSETS[e.image.asset].src : assetSource(e.image, workspaceId);
        img.alt = e.image.alt || e.name;
        img.draggable = false;
        img.decoding = 'async';
        img.style.objectFit = e.image.fit || 'contain';
        img.addEventListener('error', () => {
            img.hidden = true;
            box.classList.add('image-missing');
            box.append(document.createTextNode('이미지 오류 · ' + (e.image.alt || e.name)));
        }, {
            once: true
        });
        box.append(img);
    }
    else {
        if (e.kind !== 'image')
            return;
        const icon = document.createElementNS(NS, 'svg');
        icon.setAttribute('viewBox', '0 0 100 70');
        icon.setAttribute('aria-hidden', 'true');
        const path = document.createElementNS(NS, 'path');
        path.setAttribute('d', 'M5 5H95V65H5Z M10 58L36 30L55 48L70 35L90 58 M65 20h1');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'currentColor');
        path.setAttribute('stroke-width', '2');
        icon.append(path);
        const label = document.createElement('small');
        label.textContent = (e.image?.alt || e.name) + (view === 'art' ? ' · 이미지 미등록' : ' · 이미지 자리');
        box.append(icon, label);
    }
    node.append(box);
}
