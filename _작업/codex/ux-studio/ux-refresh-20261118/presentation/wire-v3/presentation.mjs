import {renderLayout} from '../../../../../../src/tools/uxStudio/layout-view.mjs';
import {controlContainerIds} from '../../../../../../src/tools/uxStudio/controls.mjs';
import {inputMode} from '../../../../../../src/tools/uxStudio/parts.mjs';
import {resolveResponsiveRect} from '../../../../../../src/tools/uxStudio/responsive-layout.mjs';

export const PRESENTATION_MODES = Object.freeze([
    Object.freeze({id: 'wireframe', label: '와이어프레임'}),
    Object.freeze({id: 'detailed-wireframe', label: '세부 와이어프레임'}),
    Object.freeze({id: 'ui', label: '본 UI'})
]);
export const normalizePresentationMode = value => PRESENTATION_MODES.some(mode => mode.id === value) ? value : 'ui';
const NS = 'http://www.w3.org/2000/svg';
const decorativeRoles = new Set(['background', 'frame', 'image', 'label', 'badge']);
let filterSequence = 0;

/** A resource-free drawing projection; authored data and coordinate contracts stay intact. */
export function presentationScreen(screen, mode = 'ui') {
    if (normalizePresentationMode(mode) !== 'wireframe') return screen;
    const controls = controlContainerIds(screen), projected = {...screen};
    delete projected.skin;
    projected.elements = screen.elements.map(element => {
        const copy = {...element, text: ''};
        for (const key of ['image', 'skin', 'control', 'buttonState', 'binding', 'notification', 'effects']) delete copy[key];
        // Native controls and their ancestors already use DIV input roots in renderLayout.
        if (controls.has(element.id) && element.kind === 'button' && !element.component) copy.component = 'game-ui';
        return copy;
    });
    return projected;
}

function alphaFilter(root) {
    if (root.querySelector(':scope > .presentation-filter-defs')) return;
    const doc = root.ownerDocument, make = (tag, attributes) => {
        const node = doc.createElementNS(NS, tag);
        for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
        return node;
    };
    const svg = make('svg', {class: 'presentation-filter-defs', 'aria-hidden': 'true', focusable: 'false', width: 0, height: 0});
    const id = 'presentation-alpha-' + (globalThis.crypto?.randomUUID?.() || ++filterSequence);
    const filter = make('filter', {id, x: '-10%', y: '-10%', width: '120%', height: '120%', 'color-interpolation-filters': 'sRGB'});
    filter.append(
        make('feFlood', {'flood-color': '#f7f7f4', result: 'paper'}),
        make('feComposite', {in: 'paper', in2: 'SourceAlpha', operator: 'in', result: 'mono'}),
        make('feMorphology', {in: 'SourceAlpha', operator: 'dilate', radius: '.65', result: 'edge'}),
        make('feFlood', {'flood-color': '#65717c', result: 'ink'}),
        make('feComposite', {in: 'ink', in2: 'edge', operator: 'in', result: 'outline'})
    );
    const merge = make('feMerge', {});
    merge.append(make('feMergeNode', {in: 'outline'}), make('feMergeNode', {in: 'mono'}));
    filter.append(merge, make('feDropShadow', {dx: 0, dy: 1, stdDeviation: '.65', 'flood-color': '#23313c', 'flood-opacity': '.16'}));
    svg.append(filter); root.append(svg);
    root.style.setProperty('--presentation-alpha-filter', `url("#${id}")`);
}

function largeZones(root) {
    const candidates = parent => {
        const found = [];
        for (const node of parent.children) {
            if (!node.classList.contains('ui-element') || decorativeRoles.has(node.dataset.partRole)) continue;
            if (['kind-image', 'kind-text', 'kind-button'].some(kind => node.classList.contains(kind))) continue;
            if (['kind-panel', 'kind-list', 'kind-card', 'is-group', 'compound-unit'].some(kind => node.classList.contains(kind))) found.push(node);
            else found.push(...candidates(node));
        }
        return found;
    };
    let zones = candidates(root);
    // A single coordinate wrapper is not a useful screen division. Stop at its first branching layer.
    while (zones.length === 1) {
        const inner = candidates(zones[0]);
        if (!inner.length) break;
        zones = inner;
    }
    return zones;
}

function pruneWireImages(screen, roles, byId, zones) {
    const basis = screen.logicalSize || {};
    const size = {w:basis.w??basis.width??390,h:basis.h??basis.height??844}, rectangles = new Map();
    const rect = id => {
        if (!rectangles.has(id)) rectangles.set(id, resolveResponsiveRect(screen,id,size.w,size.h));
        return rectangles.get(id);
    };
    const area = r => r.w*r.h;
    const overlap = (a,b) => Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y));
    const sameBox = (a,b) => a.w>=b.w*.9 && a.h>=b.h*.9 && overlap(a,b)>=area(b)*.85;
    const actions = new Set([...roles].filter(([,list])=>list.includes('action')).map(([id])=>id));
    const zoneIds = new Set(zones.map(e=>e.id));
    const ancestor = (element, accept) => {
        const seen = new Set();
        for (let e=element;e&&!seen.has(e.id);e=byId.get(e.parentId)) {seen.add(e.id);if(accept(e))return e;}
        return null;
    };
    const groups = new Map();
    for (const [id,list] of roles) {
        if (!list.includes('image')) continue;
        const element=byId.get(id), r=rect(id), owner=ancestor(element,e=>actions.has(e.id));
        const parent=element.parentId?rect(element.parentId):{x:0,y:0,w:size.w,h:size.h};
        const thin=Math.min(r.w,r.h)<16 && Math.min(r.w,r.h)/Math.max(r.w,r.h)<.2;
        const tiny=owner && Math.min(r.w,r.h)<24 && area(r)<area(rect(owner.id))*.08;
        // Full-area/state paint belongs to the existing action/region outline.
        const backdrop=!owner && r.w>=parent.w*.85 && r.h>=parent.h*.45 && [...actions].some(actionId=>ancestor(byId.get(actionId),e=>e.id===element.parentId) && overlap(r,rect(actionId))>=Math.min(area(r),area(rect(actionId)))*.6);
        if (thin || tiny || sameBox(r,parent) || owner && sameBox(r,rect(owner.id)) || backdrop) continue;
        const region=ancestor(element,e=>zoneIds.has(e.id));
        const key=owner?.id || region?.id || element.parentId || null;
        if(!groups.has(key))groups.set(key,[]);
        groups.get(key).push({id,r,owner});
    }
    const selected=new Set();
    for (const group of groups.values()) {
        const depth = item => group.filter(other=>area(other.r)>area(item.r)*1.1 && overlap(other.r,item.r)>=area(item.r)*.85).length;
        const distance = item => {const p=item.owner?rect(item.owner.id):item.r;return ((item.r.x+item.r.w/2-p.x-p.w/2)/p.w)**2+((item.r.y+item.r.h/2-p.y-p.h/2)/p.h)**2;};
        group.sort((a,b)=>depth(b)-depth(a)||area(b.r)-area(a.r)||distance(a)-distance(b));
        const keep=[];
        for (const item of group) {
            if (keep.some(other=>item.owner || overlap(item.r,other.r)>=Math.min(area(item.r),area(other.r))*.65)) continue;
            keep.push(item);selected.add(item.id);
        }
    }
    for (const [id,list] of roles) if (list.includes('image')&&!selected.has(id)) {
        const remaining=list.filter(role=>role!=='image');
        if(remaining.length)roles.set(id,remaining);else roles.delete(id);
    }
}

function wireStructure(screen, transitions = []) {
    const children = new Map(), byId = new Map(screen.elements.map(element => [element.id, element]));
    for (const element of screen.elements) {
        const id = element.parentId || null;
        if (!children.has(id)) children.set(id, []);
        children.get(id).push(element);
    }
    const candidates = parentId => (children.get(parentId) || []).flatMap(element => {
        if (decorativeRoles.has(element.partRole) || ['image', 'text', 'button'].includes(element.kind)) return [];
        return ['panel', 'list', 'card'].includes(element.kind) || element.component || element.isGroup ? [element] : candidates(element.id);
    });
    let zones = candidates(null);
    while (zones.length === 1) {
        const inner = candidates(zones[0].id);
        if (!inner.length) break;
        zones = inner;
    }
    const roles = new Map(zones.map(element => [element.id, ['zone']]));
    const badge = element => {
        const seen=new Set();
        for(let e=element;e&&!seen.has(e.id);e=byId.get(e.parentId)){seen.add(e.id);if(e.partRole==='badge')return true;}
        return false;
    };
    for (const element of screen.elements) {
        if (['background', 'frame'].includes(element.partRole) || badge(element)) continue;
        const list = roles.get(element.id) || [];
        if (inputMode(element, transitions) === 'action' || element.control) list.push('action');
        if (element.kind === 'image' || element.image) list.push('image');
        if (element.kind === 'text' || element.text || (element.binding && element.binding.type !== 'content-slot') || element.control?.type === 'input') list.push('text');
        if (list.length) roles.set(element.id, list);
    }
    pruneWireImages(screen,roles,byId,zones);
    const coordinates = new Set();
    for (const id of roles.keys()) for (let element = byId.get(id); element && !coordinates.has(element.id); element = byId.get(element.parentId)) coordinates.add(element.id);
    return {coordinates, roles};
}

/** Paint only. Can also follow an existing renderLayout call (e.g. the detailed editor). */
export function applyPresentation(root, value = 'ui') {
    const mode = normalizePresentationMode(value);
    root.dataset.presentationMode = mode;
    for (const label of root.querySelectorAll('.presentation-zone-label')) label.remove();
    for (const placeholder of root.querySelectorAll('.presentation-placeholder')) placeholder.remove();
    for (const node of root.querySelectorAll('.ui-element')) {
        node.classList.toggle('presentation-zone', false);
        for (const name of ['presentation-action', 'presentation-image-slot', 'presentation-text-slot', 'presentation-text-multiline']) node.classList.toggle(name, false);
        if (mode !== 'wireframe') {
            delete node.dataset.presentationLabel;
            delete node.dataset.presentationWireRoles;
            delete node.dataset.presentationTextMultiline;
        }
    }
    if (mode === 'detailed-wireframe') alphaFilter(root);
    else {
        root.querySelector(':scope > .presentation-filter-defs')?.remove();
        root.style.removeProperty('--presentation-alpha-filter');
    }
    if (mode === 'wireframe') {
        const nodes = [...root.querySelectorAll('.ui-element')];
        for (const node of nodes) {
            const roles = (node.dataset.presentationWireRoles || '').split(' ');
            node.querySelector(':scope > .image-content')?.remove();
            node.classList.toggle('presentation-action', roles.includes('action'));
            node.classList.toggle('presentation-image-slot', roles.includes('image'));
            node.classList.toggle('presentation-text-slot', roles.includes('text'));
            node.classList.toggle('presentation-text-multiline', node.dataset.presentationTextMultiline === 'true');
            for (const role of ['image', 'text']) if (roles.includes(role)) {
                const placeholder = root.ownerDocument.createElement('span');
                placeholder.className = 'presentation-placeholder presentation-' + role + '-placeholder';
                placeholder.setAttribute('aria-hidden', 'true');
                node.append(placeholder);
            }
        }
        const zones = nodes.some(node => node.dataset.presentationWireRoles !== undefined) ? nodes.filter(node => (node.dataset.presentationWireRoles || '').split(' ').includes('zone')) : largeZones(root);
        for (const node of zones) {
            node.classList.add('presentation-zone');
            const label = root.ownerDocument.createElement('span');
            label.className = 'presentation-zone-label';
            label.textContent = node.dataset.presentationLabel || node.dataset.element;
            label.setAttribute('aria-hidden', 'true');
            node.append(label);
        }
    }
    return mode;
}

/** The existing renderer remains the only owner of hierarchy, layout, text, state and input roots. */
export function renderPresentation(screen, root, {presentationMode = 'ui', ...renderOptions} = {}) {
    const mode = normalizePresentationMode(presentationMode), projected = presentationScreen(screen, mode);
    const structure = mode === 'wireframe' ? wireStructure(screen, renderOptions.transitions) : null;
    const coordinates = structure?.coordinates;
    const options = coordinates ? {...renderOptions, assetView: 'wire', text: () => '', slots: new Map(), children: undefined, visible: element => coordinates.has(element.id) && (renderOptions.visible?.(element) ?? true)} : renderOptions;
    const result = renderLayout(projected, root, options);
    root.classList.toggle('presentation-skin-layout', mode === 'wireframe' && !!screen.skin && screen.presentation?.rootMode !== 'fullscreen');
    if (mode === 'wireframe') {
        const originals = new Map(screen.elements.map(element => [element.id, element]));
        for (const node of root.querySelectorAll('.ui-element')) {
            const original = originals.get(node.dataset.element);
            node.dataset.presentationLabel = original?.name || node.dataset.element;
            node.dataset.presentationWireRoles = (structure.roles.get(node.dataset.element) || []).join(' ');
            node.dataset.presentationTextMultiline = String(original?.typography?.wrap === 'wrap' || original?.text?.includes('\n') || false);
            node.classList.toggle('presentation-skin-layout', !!original?.skin);
            node.classList.toggle('presentation-image-layout', !!(original?.image?.src || original?.image?.assetRef || original?.image?.asset));
            node.classList.toggle('presentation-compact-layout', !!original?.image?.compact);
        }
    }
    applyPresentation(root, mode);
    return result;
}
