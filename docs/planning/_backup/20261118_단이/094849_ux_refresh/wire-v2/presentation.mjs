import {renderLayout} from './layout-view.mjs';
import {controlContainerIds} from './controls.mjs';

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

function wireCoordinates(screen) {
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
    const ids = new Set();
    for (let element of zones) while (element && !ids.has(element.id)) {
        ids.add(element.id); element = byId.get(element.parentId);
    }
    return ids;
}

/** Paint only. Can also follow an existing renderLayout call (e.g. the detailed editor). */
export function applyPresentation(root, value = 'ui') {
    const mode = normalizePresentationMode(value);
    root.dataset.presentationMode = mode;
    for (const label of root.querySelectorAll('.presentation-zone-label')) label.remove();
    for (const node of root.querySelectorAll('.ui-element')) {
        node.classList.toggle('presentation-zone', false);
        if (mode !== 'wireframe') delete node.dataset.presentationLabel;
    }
    if (mode === 'detailed-wireframe') alphaFilter(root);
    else {
        root.querySelector(':scope > .presentation-filter-defs')?.remove();
        root.style.removeProperty('--presentation-alpha-filter');
    }
    if (mode === 'wireframe') for (const node of largeZones(root)) {
        node.classList.add('presentation-zone');
        const label = root.ownerDocument.createElement('span');
        label.className = 'presentation-zone-label';
        label.textContent = node.dataset.presentationLabel || node.dataset.element;
        label.setAttribute('aria-hidden', 'true');
        node.append(label);
    }
    return mode;
}

/** The existing renderer remains the only owner of hierarchy, layout, text, state and input roots. */
export function renderPresentation(screen, root, {presentationMode = 'ui', ...renderOptions} = {}) {
    const mode = normalizePresentationMode(presentationMode), projected = presentationScreen(screen, mode);
    const coordinates = mode === 'wireframe' ? wireCoordinates(projected) : null;
    const options = coordinates ? {...renderOptions, assetView: 'wire', text: () => '', slots: new Map(), children: undefined, visible: element => coordinates.has(element.id) && (renderOptions.visible?.(element) ?? true)} : renderOptions;
    const result = renderLayout(projected, root, options);
    root.classList.toggle('presentation-skin-layout', mode === 'wireframe' && !!screen.skin && screen.presentation?.rootMode !== 'fullscreen');
    if (mode === 'wireframe') {
        const originals = new Map(screen.elements.map(element => [element.id, element]));
        for (const node of root.querySelectorAll('.ui-element')) {
            const original = originals.get(node.dataset.element);
            node.dataset.presentationLabel = original?.name || node.dataset.element;
            node.classList.toggle('presentation-skin-layout', !!original?.skin);
            node.classList.toggle('presentation-image-layout', !!(original?.image?.src || original?.image?.assetRef || original?.image?.asset));
            node.classList.toggle('presentation-compact-layout', !!original?.image?.compact);
        }
    }
    applyPresentation(root, mode);
    return result;
}
