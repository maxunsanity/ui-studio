const screenFor = (design, id) => design.screens.find(s => s.id === id);
/** Overlay content uses its backing page; saved reference dimensions remain untouched. */
export function overlayRootSize(screen,basis){
    if(screen.presentation?.rootMode==='fullscreen')return {w:basis.w,h:basis.h};
    const type=screen.presentation?.type||screen.kind;
    return {w:basis.w*({sheet:1,popover:.75}[type]||.9),h:basis.h*({sheet:.55,toast:.18,popover:.3}[type]||.48)};
}
export function overlayBoardScreen(document,screen,entryId=document.entryScreen){
    if(screen.kind==='page'||screen.presentation?.rootMode!=='fullscreen')return screen;
    const basis=screenFor(document,entryId)?.logicalSize||{w:390,h:844};
    return {...screen,logicalSize:{w:basis.w,h:basis.h}};
}
export function overlayPolicy(screen) {
    const p = screen?.presentation || {}, type = p.type || screen?.kind || 'modal';
    const blocking = p.blocking ?? !['toast', 'popover'].includes(type);
    return { type, blocking, dim: p.dim ?? blocking, dismissOnEscape: p.dismissOnEscape ?? blocking, closePolicy: p.closePolicy || 'allow', toastPolicy: p.toastPolicy || 'dedupe', autoCloseMs: p.autoCloseMs || 0 };
}
export function overlayMotion(screen, reducedMotion = false) {
    return { effect: reducedMotion ? 'none' : screen?.presentation?.effect || 'none', durationMs: reducedMotion ? 0 : screen?.presentation?.durationMs || 0 };
}
export function blockingOverlayIndex(design, runtime) {
    return runtime.overlays.findLastIndex(id => overlayPolicy(screenFor(design, id)).blocking);
}
export function canOverlayInput(design, runtime, screenId) {
    const blocking = blockingOverlayIndex(design, runtime), index = runtime.overlays.lastIndexOf(screenId);
    return index >= 0 ? index >= blocking : screenId === runtime.page && blocking < 0;
}
export function openOverlay(design, runtime, screenId, { trigger = null } = {}) {
    const next = structuredClone(runtime), screen = screenFor(design, screenId);
    if (!screen) return next;
    next.overlayQueue ||= [];
    if (next.overlays.includes(screenId) || next.overlayQueue.some(item => item.screenId === screenId)) return next;
    const policy = overlayPolicy(screen);
    if (policy.type === 'toast' && policy.toastPolicy === 'queue' && next.overlays.some(id => overlayPolicy(screenFor(design, id)).type === 'toast')) {
        next.overlayQueue.push({ screenId, trigger });
        return next;
    }
    next.overlays.push(screenId); next.focusStack.push(trigger); next.visits.push(screenId);
    if (policy.blocking && trigger) next.focusReturn = trigger;
    return next;
}
/** canClose is an optional synchronous host veto; false cancels without inventing a confirmation UI. */
export function closeOverlay(design, runtime, screenId, { reason = 'action', canClose } = {}) {
    const next = structuredClone(runtime), index = next.overlays.lastIndexOf(screenId), screen = screenFor(design, screenId);
    if (index < 0 || !screen) return next;
    const policy = overlayPolicy(screen);
    if (policy.closePolicy === 'prevent' || reason === 'escape' && !policy.dismissOnEscape || reason !== 'timeout' && (!canOverlayInput(design, next, screenId) || next.pending) || canClose?.({ screenId, reason, screen, runtime: structuredClone(runtime) }) === false) return next;
    next.overlays.splice(index, 1);
    const [trigger] = next.focusStack.splice(index, 1);
    if (policy.blocking) next.focusReturn = trigger || null;
    next.lastAction = null;
    if (policy.type === 'toast' && !next.overlays.some(id => overlayPolicy(screenFor(design, id)).type === 'toast')) {
        const queue = next.overlayQueue || [];
        while (queue.length) {
            const item = queue.shift();
            if (!screenFor(design, item.screenId)) continue;
            next.overlays.push(item.screenId); next.focusStack.push(item.trigger); next.visits.push(item.screenId);
            break;
        }
    }
    return next;
}
export function escapeOverlay(design, runtime, options = {}) {
    const floor = Math.max(0, blockingOverlayIndex(design, runtime));
    const id = runtime.overlays.slice(floor).findLast(id => overlayPolicy(screenFor(design, id)).dismissOnEscape);
    return id ? closeOverlay(design, runtime, id, { ...options, reason: 'escape' }) : structuredClone(runtime);
}
/** sync after each paint; reset before design replacement; dispose cancels every callback epoch. */
export function createOverlayTimers({ getDesign, getRuntime, onChange, canClose, setTimeout: schedule = globalThis.setTimeout, clearTimeout: cancel = globalThis.clearTimeout }) {
    const entries = new Map(); let epoch = 0, disposed = false;
    const reset = () => { epoch++; for (const entry of entries.values()) cancel(entry.handle); entries.clear(); };
    const sync = () => {
        if (disposed) return;
        const design = getDesign(), runtime = getRuntime();
        for (const [id, entry] of entries) {
            if (!runtime.overlays.includes(id)) { cancel(entry.handle); entries.delete(id); }
        }
        for (const id of runtime.overlays) {
            const p = overlayPolicy(screenFor(design, id));
            if (!p.autoCloseMs || p.closePolicy === 'prevent' || entries.has(id)) continue;
            const entry = { epoch, handle: null }; entries.set(id, entry);
            entry.handle = schedule(() => {
                if (disposed || entry.epoch !== epoch || entries.get(id) !== entry || !getRuntime().overlays.includes(id)) return;
                const current = getRuntime(), next = closeOverlay(getDesign(), current, id, { reason: 'timeout', canClose });
                if (next.overlays.includes(id)) return;
                onChange(next, { type: 'overlay-close', screen: id, reason: 'timeout' });
                sync();
            }, p.autoCloseMs);
        }
    };
    return { sync, reset, dispose() { disposed = true; reset(); } };
}
export function focusableOverlay(panel) {
    return [...panel.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href],[tabindex]:not([tabindex="-1"])')].filter(n => n.tabIndex >= 0 && n.getAttribute('aria-disabled') !== 'true' && n.getClientRects().length && !n.closest('[inert]'));
}
export function trapOverlayFocus(event, panel) {
    if (event.key !== 'Tab' || !panel) return;
    const items = focusableOverlay(panel), first = items[0] || panel, last = items.at(-1) || panel, active = panel.ownerDocument.activeElement;
    if (!items.length) panel.tabIndex = -1;
    if (!panel.contains(active) || active === panel || (event.shiftKey ? active === first : active === last)) {
        event.preventDefault(); (event.shiftKey ? last : first).focus();
    }
}
export function syncOverlayFocus(design, runtime, page, panels, { previousModal = null, previousFocus = null } = {}) {
    const index = blockingOverlayIndex(design, runtime), active = index >= 0 ? panels.get(runtime.overlays[index]) : null;
    page.inert = !!active;
    for (const [id, panel] of panels) {
        const policy = overlayPolicy(screenFor(design, id)), behind = !!active && runtime.overlays.lastIndexOf(id) < index;
        panel.inert = behind;
        if (panel.parentNode) panel.parentNode.inert = behind;
        panel.setAttribute('role', policy.blocking ? 'dialog' : policy.type === 'toast' ? 'status' : 'region');
        if (panel === active) { panel.setAttribute('aria-modal', 'true'); panel.tabIndex = -1; }
        else panel.removeAttribute('aria-modal');
    }
    const focusReturn = panel => focusableOverlay(panel).find(n => (n.dataset.element || n.closest('.ui-element')?.dataset.element) === runtime.focusReturn);
    if (active && (active !== previousModal || !active.contains(previousFocus))) (focusReturn(active) || focusableOverlay(active)[0] || active).focus();
    else if (!active && previousFocus && !page.contains(previousFocus)) focusReturn(page)?.focus();
    return active;
}
