import { hiddenByMenu } from './menu-state.mjs';
import {validateSkin,applySkin} from './skins.mjs';
import {typographyStyles} from './parts.mjs';

export const CONTROL_TYPES = {
    toggle: '토글', tabs: '탭', 'toggle-group': '선택 그룹', slider: '슬라이더', scrollbar: '스크롤바', dropdown: '드롭다운', input: '텍스트 입력'
};
const choices = type => ['tabs', 'toggle-group', 'dropdown'].includes(type);
const range = type => ['slider', 'scrollbar'].includes(type);
const choiceMarker = type => ['toggle', 'toggle-group'].includes(type);
const fail = () => { throw Error('컨트롤 설정·입력 값 범위를 확인하세요.'); };

export function createControl(type) {
    if (!Object.hasOwn(CONTROL_TYPES, type)) fail();
    if (type === 'toggle') return { type, value: false };
    if (range(type)) return { type, min: 0, max: 100, step: 1, value: 0, orientation: 'horizontal' };
    if (choices(type)) return { type, options: [{ value: 'first', label: '선택 1' }, { value: 'second', label: '선택 2' }], value: 'first' };
    return { type, value: '', placeholder: '내용 입력', maxLength: 1000, required: false, validation: 'none' };
}
export function initialControlValue(control) {
    if (Object.hasOwn(control, 'value')) return control.value;
    if (Object.hasOwn(control, 'defaultValue')) return control.defaultValue;
    if (control.type === 'toggle') return false;
    if (range(control.type)) return control.min ?? 0;
    if (choices(control.type)) return (control.options.find(o => !o.disabled) || control.options[0]).value;
    return '';
}
function assertValue(control, value) {
    if (control.type === 'toggle') {
        if (typeof value !== 'boolean') fail();
    } else if (range(control.type)) {
        const min = control.min ?? 0, max = control.max ?? 100, step = control.step ?? 1;
        const steps = (value - min) / step;
        if (!Number.isFinite(value) || value < min || value > max || Math.abs(steps - Math.round(steps)) > 1e-7) fail();
    } else if (choices(control.type)) {
        if (typeof value !== 'string' || !control.options.some(o => o.value === value)) fail();
    } else if (typeof value !== 'string' || value.length > (control.maxLength ?? 10000)) fail();
}
export function validateControl(control) {
    if (control === undefined) return;
    if (!control || typeof control !== 'object' || Array.isArray(control) || !Object.hasOwn(CONTROL_TYPES, control.type)) fail();
    const fields = ['type', 'value', 'defaultValue', 'disabled', 'readonly', ...(choiceMarker(control.type) ? ['choiceShape', 'choiceSize', 'choiceColor'] : []), ...(control.type === 'toggle' ? ['group'] : range(control.type) ? ['min', 'max', 'step', 'orientation'] : choices(control.type) ? ['options', ...(control.type === 'tabs' ? ['tabSkin', 'labelMode'] : [])] : ['maxLength', 'required', 'placeholder', 'validation'])];
    if (Object.keys(control).some(k => !fields.includes(k))) fail();
    if (control.choiceShape !== undefined && !['native', 'square'].includes(control.choiceShape) || control.choiceSize !== undefined && (!Number.isFinite(control.choiceSize) || control.choiceSize < 8 || control.choiceSize > 96) || control.choiceColor !== undefined && (typeof control.choiceColor !== 'string' || !/^#[0-9a-f]{6}$/i.test(control.choiceColor))) fail();
    if (control.labelMode !== undefined && !['text', 'icon'].includes(control.labelMode)) fail();
    for (const key of ['disabled', 'readonly', 'required'])
        if (control[key] !== undefined && typeof control[key] !== 'boolean') fail();
    if (control.group !== undefined && (typeof control.group !== 'string' || !/^[\p{L}\p{N}_.:-]{1,128}$/u.test(control.group))) fail();
    if (range(control.type)) {
        if (['min', 'max', 'step'].some(k => control[k] !== undefined && !Number.isFinite(control[k])) || (control.min ?? 0) > (control.max ?? 100) || (control.step ?? 1) <= 0 || control.orientation !== undefined && !['horizontal', 'vertical'].includes(control.orientation)) fail();
    }
    if (choices(control.type)) {
        if (!Array.isArray(control.options) || !control.options.length || control.options.length > 100) fail();
        const seen = new Set();
        for (const o of control.options) {
            if (!o || typeof o !== 'object' || Array.isArray(o) || Object.keys(o).some(k => !['value', 'label', 'disabled', ...(control.type === 'tabs' ? ['panelId'] : [])].includes(k)) || typeof o.value !== 'string' || o.value.length > 256 || seen.has(o.value) || typeof o.label !== 'string' || o.label.length > 1000 || o.disabled !== undefined && typeof o.disabled !== 'boolean') fail();
            if (o.panelId !== undefined && (typeof o.panelId !== 'string' || !/^[\p{L}\p{N}_.:-]{1,128}$/u.test(o.panelId))) fail();
            seen.add(o.value);
        }
    }
    if (control.tabSkin !== undefined) {
        validateSkin(control.tabSkin);
        if (control.tabSkin.mode !== '3' || Object.keys(control.tabSkin.textures || {}).some(state => !['normal','selected'].includes(state))) fail();
    }
    if (control.type === 'input') {
        if (control.maxLength !== undefined && (!Number.isSafeInteger(control.maxLength) || control.maxLength < 0 || control.maxLength > 10000) || control.placeholder !== undefined && (typeof control.placeholder !== 'string' || control.placeholder.length > 1000) || control.validation !== undefined && !['none', 'email', 'number'].includes(control.validation)) fail();
    }
    for (const key of ['value', 'defaultValue'])
        if (Object.hasOwn(control, key)) assertValue(control, control[key]);
}
export function validateControlGroups(screen) {
    const byId = new Map(screen.elements.map(e => [e.id,e])), panels = new Set();
    for (const e of screen.elements.filter(e => e.control?.type === 'tabs')) {
        const targets = e.control.options.map(o => o.panelId).filter(Boolean);
        for (const id of targets) {
            if (!byId.has(id) || panels.has(id) || isWithin(screen,e.id,id) || targets.some(other => other !== id && isWithin(screen,id,other))) throw Error('탭 본문은 같은 화면의 겹치지 않는 레이어로 지정하세요.');
            panels.add(id);
        }
    }
    const selected = new Set();
    for (const e of screen.elements) {
        if (e.control?.type !== 'toggle' || !e.control.group || !initialControlValue(e.control)) continue;
        if (selected.has(e.control.group)) throw Error('컨트롤 그룹의 초기 선택은 하나만 지정하세요.');
        selected.add(e.control.group);
    }
}

function isWithin(screen, id, ancestor) {
    const byId = new Map(screen.elements.map(e => [e.id,e])), seen = new Set();
    while (id && !seen.has(id)) { if (id === ancestor) return true; seen.add(id); id = byId.get(id)?.parentId; }
    return false;
}
export function hiddenByTabs(screen, elementId, runtime = {}) {
    return !!screen?.elements.some(e => e.control?.type === 'tabs' && e.control.options.some(o => o.panelId && o.value !== controlValue(screen,e,runtime) && isWithin(screen,elementId,o.panelId)));
}

export function controlInteractive(element) {
    return !!element.control && !element.control.disabled && !element.control.readonly && element.interaction?.enabled !== false && (!element.interaction?.mode || element.interaction.mode === 'action');
}
export function controlValue(screen, element, runtime = {}) {
    const values = Object.hasOwn(runtime.controlValues || {}, screen.id) ? runtime.controlValues[screen.id] : {};
    if (Object.hasOwn(values, element.id)) {
        try { assertValue(element.control, values[element.id]); return values[element.id]; } catch { /* Changed design constraints reset only this runtime value. */ }
    }
    return initialControlValue(element.control);
}
export function controlValidity(control, value) {
    let message = '';
    if (control.type === 'input') {
        if (control.required && !value.trim()) message = '내용을 입력하세요.';
        else if (value && control.validation === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message = '이메일 형식을 확인하세요.';
        else if (value && control.validation === 'number' && (!value.trim() || !Number.isFinite(Number(value)))) message = '숫자를 입력하세요.';
    }
    return { valid: !message, message };
}
export function createControlState(screens) {
    return {
        controlValues: Object.fromEntries(screens.map(s => [s.id, Object.fromEntries(s.elements.filter(e => e.control).map(e => [e.id, initialControlValue(e.control)]))])),
        controlValidity: Object.fromEntries(screens.map(s => [s.id, Object.fromEntries(s.elements.filter(e => e.control).map(e => [e.id, controlValidity(e.control, initialControlValue(e.control))]))]))
    };
}
export function updateControlValue(screen, runtime, element, value, event = 'change') {
    validateControl(element.control);
    assertValue(element.control, value);
    if (!['input', 'change'].includes(event) || choices(element.control.type) && element.control.options.find(o => o.value === value)?.disabled) fail();
    if (!controlInteractive(element)) return null;
    const previousValue = controlValue(screen, element, runtime), status = controlValidity(element.control, value);
    const peers = element.control.type === 'toggle' && element.control.group && value ? screen.elements.filter(peer => peer.id !== element.id && peer.control?.type === 'toggle' && peer.control.group === element.control.group).map(peer => [peer.id, false]) : [];
    const values = { ...runtime.controlValues?.[screen.id], ...Object.fromEntries(peers), [element.id]: value };
    return {
        controlValues: { ...runtime.controlValues, [screen.id]: values },
        controlValidity: { ...runtime.controlValidity, [screen.id]: { ...runtime.controlValidity?.[screen.id], [element.id]: status } },
        lastAction: { type: 'control-change', screen: screen.id, element: element.id, controlType: element.control.type, value, previousValue, event, ...status }
    };
}

const rootScopes = new WeakMap();
let scopeSequence = 0;
/** Reuses native fields. onChange(change, nativeEvent) may return the authoritative next runtime. */
export function attachControls(root, screen, runtime = {}, { mode = 'view', onChange, onInvalid, workspaceId = root._controlWorkspaceId, assetView = root._controlAssetView || 'art' } = {}) {
    if (!rootScopes.has(root)) rootScopes.set(root, ++scopeSequence);
    root._controlWorkspaceId = workspaceId; root._controlAssetView = assetView;
    let count = 0;
    const byId = new Map(screen.elements.map(e => [e.id, e]));
    for (const node of root.querySelectorAll('.ui-element')) {
        if (node.dataset.screen !== screen.id) continue;
        const element = byId.get(node.dataset.element), control = element?.control;
        let box = node.querySelector(':scope > .ui-control');
        const text = node.querySelector(':scope > .element-text');
        if (!control) {
            if (box) { box.remove(); if (text && !element?.menu && element?.binding?.type !== 'content-slot') text.hidden = false; }
            continue;
        }
        if (node.closest('button')) throw Error('네이티브 컨트롤과 그 부모는 button 대신 div로 표시하세요.');
        if (text) text.hidden = true;
        const key = JSON.stringify([control.type, control.options, control.group]);
        if (box?._controlKey !== key) {
            box?.remove();
            box = createNativeControl(node.ownerDocument, element);
            box._controlKey = key;
            node.append(box);
        }
        box._context = { root, screen, runtime, element, mode, onChange, onInvalid, workspaceId, assetView };
        syncNativeControl(box);
        count++;
    }
    syncTabPanels(root,screen,runtime);
    return count;
}
function syncTabPanels(root,screen,runtime) {
    const nodes = new Map([...root.querySelectorAll('.ui-element')].filter(n => n.dataset.screen === screen.id).map(n => [n.dataset.element,n]));
    for (const node of nodes.values()) {
        if (!node._tabPanelRestore) continue;
        const restore = node._tabPanelRestore;
        for (const [key,value] of Object.entries(restore.attributes)) value === null ? node.removeAttribute(key) : node.setAttribute(key,value);
        node.style.display = restore.display; node.inert = restore.inert; delete node._tabPanelRestore;
    }
    for (const element of screen.elements.filter(e => e.control?.type === 'tabs')) {
        const box = nodes.get(element.id)?.querySelector(':scope > .ui-control');
        if (!box) continue;
        for (const [index,option] of element.control.options.entries()) {
            const field = box._fields[index], node = nodes.get(option.panelId);
            if (!node) { field.removeAttribute('aria-controls'); continue; }
            const prefix = 'ui-tabs-' + rootScopes.get(root) + '-' + screen.id + '-' + element.id;
            const selected = option.value === controlValue(screen,element,runtime);
            node._tabPanelRestore = {display:node.style.display || '',inert:!!node.inert,attributes:Object.fromEntries(['id','role','aria-hidden','aria-labelledby'].map(key => [key,node.getAttribute(key)]))};
            field.setAttribute('id',prefix + '-tab-' + index);
            node.setAttribute('id',prefix + '-panel-' + index);node.setAttribute('role','tabpanel');
            node.setAttribute('aria-labelledby',field.getAttribute('id'));node.setAttribute('aria-hidden',String(!selected));
            field.setAttribute('aria-controls',node.getAttribute('id'));
            node.style.display = selected ? node._tabPanelRestore.display : 'none';node.inert = node._tabPanelRestore.inert || !selected;
            if (!selected && node.contains(node.ownerDocument.activeElement)) box._fields.find(f => f.getAttribute('aria-selected') === 'true')?.focus();
        }
    }
}

function createNativeControl(doc, element) {
    const c = element.control, box = doc.createElement('div');
    box.className = 'ui-control control-' + c.type;
    box.dataset.uiControl = c.type;
    box.addEventListener('click',event=>event.stopPropagation());
    box.addEventListener('pointerdown',event=>event.stopPropagation());
    Object.assign(box.style, { position: 'absolute', inset: '0', display: 'flex', alignItems: 'center', gap: '6px', padding: '4px', boxSizing: 'border-box' });
    const make = (tag, option) => {
        const field = doc.createElement(tag);
        if (option) field.dataset.controlValue = option.value;
        field.addEventListener('input', event => { event.stopPropagation(); if (c.type === 'input' || range(c.type)) nativeChange(box, field, 'input', event); });
        field.addEventListener('change', event => nativeChange(box, field, 'change', event));
        field.addEventListener('click', event => {
            event.stopPropagation();
            if (c.type === 'tabs') nativeChange(box, field, 'change', event);
        });
        field.addEventListener('keydown', event => {
            if (!['Tab', 'Escape'].includes(event.key)) event.stopPropagation();
            if (c.type !== 'tabs' || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key) || field.disabled) return;
            event.preventDefault();
            const enabled = box._fields.filter(f => !f.disabled), index = enabled.indexOf(field);
            const next = event.key === 'Home' ? enabled[0] : event.key === 'End' ? enabled.at(-1) : enabled[(index + (['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 1) + enabled.length) % enabled.length];
            next?.focus();
            if (next) nativeChange(box, next, 'change', event);
        });
        field.addEventListener('keyup', event => { if (!['Tab', 'Escape'].includes(event.key)) event.stopPropagation(); });
        field.addEventListener('pointerdown', event => event.stopPropagation());
        return field;
    };
    box._fields = [];
    if (c.type === 'tabs' || c.type === 'toggle-group') {
        box.setAttribute('role', c.type === 'tabs' ? 'tablist' : 'radiogroup');
        box.setAttribute('aria-label', element.name);
        for (const option of c.options) {
            const field = make(c.type === 'tabs' ? 'button' : 'input', option);
            if (c.type === 'tabs') {
                field.type = 'button'; field.textContent = option.label; field.setAttribute('role', 'tab');
                Object.assign(field.style, { flex: '1 1 0px', minWidth: '0', height: '100%' });
                box.append(field);
            } else {
                field.type = 'radio';
                const label = doc.createElement('label'), text = doc.createElement('span'); text.textContent = option.label;
                label.append(field, text); box.append(label);
            }
            box._fields.push(field);
        }
    } else {
        const field = make(c.type === 'dropdown' ? 'select' : 'input');
        if (c.type === 'dropdown') {
            for (const option of c.options) {
                const node = doc.createElement('option'); node.value = option.value; node.textContent = option.label; node.disabled = !!option.disabled; field.append(node);
            }
        } else field.type = c.type === 'toggle' ? c.group ? 'radio' : 'checkbox' : range(c.type) ? 'range' : 'text';
        if (c.type === 'toggle') {
            const label = doc.createElement('label'); box._label = doc.createElement('span'); label.append(field, box._label); box.append(label);
            Object.assign(label.style, { display: 'flex', alignItems: 'center', gap: '6px', width: '100%', height: '100%' });
        } else { Object.assign(field.style, { width: '100%', minWidth: '0', height: '100%', boxSizing: 'border-box' }); box.append(field); }
        box._fields.push(field);
    }
    return box;
}
function syncNativeControl(box) {
    const { element, screen, runtime, root, mode, workspaceId, assetView } = box._context, c = element.control, value = controlValue(screen, element, runtime), status = controlValidity(c, value);
    const edit = mode === 'edit', disabled = edit || !!c.disabled || !!runtime.pending || element.interaction?.enabled === false || !!element.interaction?.mode && element.interaction.mode !== 'action';
    box.style.pointerEvents = edit ? 'none' : '';
    if (box._label) box._label.textContent = element.text || element.name;
    for (const field of box._fields) {
        const option = c.options?.find(o => o.value === field.dataset.controlValue);
        field.disabled = disabled || !!option?.disabled || !!c.readonly && c.type !== 'input';
        field.setAttribute('aria-readonly', String(!!c.readonly));
        field.setAttribute('aria-label', option?.label || element.name);
        field.setAttribute('aria-invalid', String(!status.valid));
        field.setCustomValidity?.(status.message);
        if (range(c.type)) {
            field.min = String(c.min ?? 0); field.max = String(c.max ?? 100); field.step = String(c.step ?? 1);
            field.setAttribute('aria-orientation', c.orientation || 'horizontal');
            field.style.writingMode = c.orientation === 'vertical' ? 'vertical-lr' : '';
            field.style.direction = c.orientation === 'vertical' ? 'rtl' : '';
        }
        if (c.type === 'toggle' || c.type === 'toggle-group') {
            field.checked = c.type === 'toggle' ? value : field.dataset.controlValue === value;
            field.name = 'ui-control-' + JSON.stringify([rootScopes.get(root), screen.id, c.group || element.id]);
            if (c.choiceShape === 'square') {
                field.dataset.choiceShape = 'square';
                const a = element.appearance || {};
                Object.assign(field.style, { width: (c.choiceSize ?? 18) + 'px', height: (c.choiceSize ?? 18) + 'px', fontSize: (c.choiceSize ?? 18) + 'px', color: c.choiceColor || 'inherit', backgroundColor: a.fill || '#ffffff', borderColor: a.stroke || '#71839a', borderWidth: (a.strokeWidth ?? 1) + 'px', borderRadius: (a.radius ?? 0) + 'px' });
            } else if (field.dataset.choiceShape) {
                delete field.dataset.choiceShape;
                Object.assign(field.style, { width: '', height: '', fontSize: '', color: '', backgroundColor: '', borderColor: '', borderWidth: '', borderRadius: '' });
            }
        } else if (c.type === 'tabs') {
            field.textContent = c.labelMode === 'icon' ? '' : option.label;
            const selected = field.dataset.controlValue === value;
            field.setAttribute('aria-selected', String(selected));
            field.tabIndex = selected && !field.disabled ? 0 : -1;
            const textStyle = typographyStyles(element); delete textStyle.width;
            Object.assign(field.style,textStyle,{fontSize:(element.fontSize || 16) + 'px',color:element.appearance?.textColor || 'inherit'});
            if (c.tabSkin || field.classList?.contains('game-skin')) {applySkin(field,c.tabSkin,{workspaceId,view:assetView,state:selected?'selected':'normal'});field.style.setProperty('--skin-text',element.appearance?.textColor || 'inherit');}
            field.classList?.toggle('native-tab-skin',!!c.tabSkin);
        } else if (field.value !== String(value)) field.value = String(value);
        if (c.type === 'input') {
            field.readOnly = !!c.readonly; field.maxLength = c.maxLength ?? 10000; field.required = !!c.required; field.placeholder = c.placeholder || '';
            field.inputMode = c.validation === 'number' ? 'decimal' : c.validation === 'email' ? 'email' : 'text';
            const a = element.appearance;
            if (a || field._inputAppearanceStyled) {
                Object.assign(field.style, { backgroundColor: a?.fill || '', color: a?.textColor || '', borderColor: a?.stroke || '', borderWidth: a?.strokeWidth === undefined ? '' : a.strokeWidth + 'px', borderStyle: a?.stroke !== undefined || a?.strokeWidth !== undefined ? 'solid' : '', borderRadius: a?.radius === undefined ? '' : a.radius + 'px', font: a ? 'inherit' : '' });
                field._inputAppearanceStyled = !!a;
            }
        }
    }
}
function nativeChange(box, field, eventType, event) {
    event.stopPropagation();
    const ctx = box._context, { element, screen, runtime, root } = ctx, c = element.control;
    if (!root.contains(box)) return;
    if (ctx.mode === 'edit' || !controlInteractive(element) || field.disabled || runtime.pending || box.closest('[inert]') || hiddenByMenu(screen, element.id, runtime.menuOpen) || hiddenByTabs(screen,element.id,runtime)) { syncNativeControl(box); return; }
    const value = c.type === 'toggle' ? field.checked : c.type === 'toggle-group' || c.type === 'tabs' ? field.dataset.controlValue : range(c.type) ? Number(field.value) : field.value;
    try {
        const result = updateControlValue(screen, runtime, element, value, eventType);
        const supplied = ctx.onChange?.(result.lastAction, event);
        const next = supplied && typeof supplied === 'object' && supplied.controlValues ? supplied : { ...runtime, ...result };
        attachControls(root, screen, next, ctx);
    } catch (error) {
        syncNativeControl(box);
        ctx.onInvalid?.(error, { screen: screen.id, element: element.id, value });
    }
}

// A native field cannot be nested inside a native button, including a distant parent.
export function controlContainerIds(screen){
 const byId=new Map(screen.elements.map(e=>[e.id,e])),ids=new Set();
 for(const element of screen.elements.filter(e=>e.control)){let current=element;const seen=new Set();while(current&&!seen.has(current.id)){seen.add(current.id);ids.add(current.id);current=byId.get(current.parentId);}}
 return ids;
}
