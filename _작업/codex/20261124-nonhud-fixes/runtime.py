from pathlib import Path
import shutil
r=Path.cwd(); base=r/'src/tools/uxStudio'; backup=r/'docs/planning/_backup/20261124_단이/HUD제외_UI보완'
def sub(file,old,new):
    p=base/file; dest=backup/p.relative_to(r);dest.parent.mkdir(parents=True,exist_ok=True)
    if not dest.exists():shutil.copy2(p,dest)
    s=p.read_text()
    assert s.count(old)==1,(file,old,s.count(old))
    p.write_text(s.replace(old,new))
sub('overlay-runtime.mjs','dismissOnEscape: p.dismissOnEscape ?? blocking,','dismissOnEscape: p.dismissOnEscape ?? blocking, dismissOnBackdrop: p.dismissOnBackdrop ?? true,')
sub('overlay-runtime.mjs',"export function openOverlay(design, runtime, screenId, { trigger = null } = {}) {","export function openOverlay(design, runtime, screenId, { trigger = null, replaceTop = null } = {}) {")
sub('overlay-runtime.mjs',"    const policy = overlayPolicy(screen);\n    if (policy.type === 'toast'", """    if (replaceTop !== null) {
        if (next.overlays.at(-1) !== replaceTop) return next;
        next.overlays.pop();
        trigger = next.focusStack.pop() ?? null;
    }
    const policy = overlayPolicy(screen);
    if (policy.type === 'toast'""")
sub('overlay-runtime.mjs',"reason === 'escape' && !policy.dismissOnEscape || reason !== 'timeout'","reason === 'escape' && !policy.dismissOnEscape || reason === 'backdrop' && !policy.dismissOnBackdrop || reason !== 'timeout'")
sub('units.mjs',"['blocking', 'dismissOnEscape'].some","['blocking', 'dismissOnEscape', 'dismissOnBackdrop'].some")
sub('controls.mjs',"export function updateControlValue(screen, runtime, element, value, event = 'change') {","export function updateControlValue(screen, runtime, element, value, event = 'change', {authored = false} = {}) {")
sub('controls.mjs',"    if (!controlInteractive(element)) return null;","    if (!authored && !controlInteractive(element)) return null;")
sub('model.mjs',"        if (t.payload?.initialControls !== undefined) {","""        for (const [key, action] of [['replaceOverlay', 'open'], ['replacePage', 'navigate']]) {
            if (t.payload?.[key] !== undefined && (t.action !== action || typeof t.payload[key] !== 'boolean')) fail('화면 교체 행동을 확인해 주세요.');
        }
        if (t.payload?.replaceOverlay && (screens.get(t.fromScreen).kind === 'page' || screens.get(t.targetScreen)?.kind === 'page'))
            fail('교체하는 창의 출발과 도착 유형을 확인해 주세요.');
        if (t.payload?.pageAfter !== undefined && (t.action !== 'open' || screens.get(t.payload.pageAfter)?.kind !== 'page'))
            fail('창을 열면서 표시할 페이지를 확인해 주세요.');
        if (t.payload?.controlUpdates !== undefined) {
            const updates = t.payload.controlUpdates;
            if (!updates || typeof updates !== 'object' || Array.isArray(updates))
                fail('연결에서 갱신할 컨트롤 값을 확인해 주세요.');
            for (const [id, fields] of Object.entries(updates)) {
                const target = screens.get(id);
                if (!target || !fields || typeof fields !== 'object' || Array.isArray(fields))
                    fail('갱신 대상 화면과 컨트롤 목록을 확인해 주세요.');
                for (const [elementId, value] of Object.entries(fields)) {
                    const element = target.elements.find(e => e.id === elementId && e.control);
                    if (!element || !updateControlValue(target, {}, element, value, 'change', {authored:true}))
                        fail('갱신할 컨트롤의 값을 확인해 주세요.');
                }
            }
        }
        if (t.payload?.initialControls !== undefined) {""")
sub('model.mjs',"            next.history.push({\n                page: next.page, selection: next.selection, filter: next.filter, focusReturn: elementId\n            });","            if (!t.payload?.replacePage) next.history.push({\n                page: next.page, selection: next.selection, filter: next.filter, focusReturn: elementId\n            });")
sub('model.mjs',"            Object.assign(next,openOverlay(d,next,t.targetScreen,{trigger:elementId}));",
    """            Object.assign(next,openOverlay(d,next,t.targetScreen,{trigger:elementId,replaceTop:t.payload?.replaceOverlay ? screenId : null}));
            if (!wasOpen && next.overlays.includes(t.targetScreen) && t.payload?.pageAfter) {
                next.page = t.payload.pageAfter;
                next.visits.push(next.page);
            }""")
sub('model.mjs',"    return next;\n}\nexport function settlePurchase", """    const completed = t.action === 'open' ? next.overlays.includes(t.targetScreen) && !r.overlays.includes(t.targetScreen)
        : t.action === 'close' ? r.overlays.includes(screenId) && !next.overlays.includes(screenId)
        : t.action === 'back' ? r.history.length > next.history.length : true;
    if (completed) for (const [id, fields] of Object.entries(t.payload?.controlUpdates || {})) {
        const target = screenById(d,id);
        for (const [elementId,value] of Object.entries(fields)) {
            const element = target.elements.find(e => e.id === elementId);
            const updated = updateControlValue(target,next,element,value,'change',{authored:true});
            next.controlValues = updated.controlValues;
            next.controlValidity = updated.controlValidity;
        }
    }
    return next;
}
export function settlePurchase""")
sub('consumer.mjs',"        for (const id of runtime.overlays) {","        for (const [index,id] of runtime.overlays.entries()) {")
sub('consumer.mjs',"            render(s, panel, {\n                workspaceId,","            render(s, panel, {\n                suppressedElements:overlayBaseHiddenElements(design,runtime.overlays.slice(index+1)), workspaceId,")
sub('main.mjs',"        for (const id of runtime.overlays) {\n            const s = screenById(doc, id);","        for (const [index,id] of runtime.overlays.entries()) {\n            const s = screenById(doc, id);")
sub('main.mjs',"            }, canvas, false);\n        }\n        if (runtime.message)","            }, canvas, false, overlayBaseHiddenElements(doc,runtime.overlays.slice(index+1),demoOverlay?.presentation));\n        }\n        if (runtime.message)")
sub('main.mjs',"function drawOverlay(s, p, canvas, isDemo) {","function drawOverlay(s, p, canvas, isDemo, suppressedElements = new Set()) {")
sub('main.mjs',"    renderElements({...s,presentation:p}, panel);","    renderElements({...s,presentation:p}, panel,suppressedElements);")
