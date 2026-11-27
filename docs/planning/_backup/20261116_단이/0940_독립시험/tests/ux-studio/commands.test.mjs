import test from 'node:test';
import assert from 'node:assert/strict';
import { readFeatureCatalog } from '../../src/tools/uxStudio/catalog.mjs';
import { createLobbyDesign } from '../../src/tools/uxStudio/lobby.mjs';
import { nudgeSelection, removeSelection, copySelection, pasteSelection, groupSelection, ungroupSelection } from '../../src/tools/uxStudio/commands.mjs';
import { validateDocument, resolveRect } from '../../src/tools/uxStudio/model.mjs';
const c = await readFeatureCatalog(process.cwd());
const make = () => createLobbyDesign(c, 'command-test');
test('delete removes selected descendants and their transitions without touching shared modal', () => {
    const d = make(), s = d.screens[0];
    const before = d.screens.length;
    removeSelection(d, s.id, ['menu-shop']);
    assert.ok(!s.elements.some(e => e.id === 'menu-shop'));
    assert.ok(!d.transitions.some(t => t.fromElement === 'menu-shop'));
    assert.equal(d.screens.length, before);
    validateDocument(d);
});
test('group and ungroup preserve exact logical geometry within tolerance', () => {
    const d = make(), s = d.screens[0], ids = ['currency-dice', 'currency-gems'];
    const before = ids.map(id => resolveRect(s, id, 390, 844));
    groupSelection(d, s.id, ids, 'group-test');
    validateDocument(d);
    ids.forEach((id, i) => {
        const rect = resolveRect(s, id, 390, 844);
        for (const k of ['x', 'y', 'w', 'h'])
            assert.ok(Math.abs(rect[k] - before[i][k]) < 1e-8);
    });
    ungroupSelection(d, s.id, ['group-test']);
    validateDocument(d);
    ids.forEach((id, i) => {
        const rect = resolveRect(s, id, 390, 844);
        for (const k of ['x', 'y', 'w', 'h'])
            assert.ok(Math.abs(rect[k] - before[i][k]) < 1e-8);
    });
});
test('copy and paste remap IDs, child parents and action references', () => {
    const d = make(), s = d.screens[0];
    groupSelection(d, s.id, ['menu-shop', 'menu-mission'], 'group-test');
    const clip = copySelection(d, s.id, ['group-test']);
    let n = 0;
    const ids = pasteSelection(d, s.id, clip, () => 'pasted-' + (++n));
    validateDocument(d);
    assert.equal(ids.length, 1);
    const children = s.elements.filter(e => e.parentId === ids[0]);
    assert.equal(children.length, 2);
    assert.ok(children.every(e => d.transitions.some(t => t.fromElement === e.id)));
    assert.equal(s.elements.find(e => e.id === 'menu-shop').parentId, 'group-test');
});
test('cross-screen paste normalizes nested coordinates and keeps module binding', () => {
    const d = make(), s = d.screens[0];
    groupSelection(d, s.id, ['menu-shop', 'menu-mission'], 'group-test');
    const original = resolveRect(s, 'menu-shop', 100, 100);
    const clip = copySelection(d, s.id, ['menu-shop']);
    d.screens.push({
        id: 'other', kind: 'page', name: '다른 화면', elements: []
    });
    let n = 0;
    const ids = pasteSelection(d, 'other', clip, () => 'other-' + (++n));
    validateDocument(d);
    const e = d.screens.at(-1).elements[0];
    assert.equal(e.parentId, undefined);
    assert.ok(Math.abs(e.x - original.x - 2) < 1e-8);
    assert.equal(e.binding.moduleId, 'simulator_module_shop');
    assert.equal(ids[0], e.id);
});
test('empty or mixed-parent grouping is rejected before document mutation', () => {
    const d = make(), before = JSON.stringify(d);
    assert.throws(() => groupSelection(d, d.entryScreen, [], 'bad'));
    assert.equal(JSON.stringify(d), before);
});
test('duplicating content area creates a plain placeholder and never a second world host', () => {
    const d = make(), clip = copySelection(d, d.entryScreen, ['slot-world']);
    let n = 0;
    pasteSelection(d, d.entryScreen, clip, () => 'slot-copy-' + (++n));
    validateDocument(d);
    assert.equal(d.screens[0].elements.filter(e => e.binding?.slot === 'world').length, 1);
    assert.equal(d.screens[0].elements.at(-1).binding, undefined);
});

function insetFixture() {
    const d=make(),s=d.screens[0];d.transitions=[];
    s.elements=[
        {id:'parent',kind:'panel',name:'parent',x:10,y:10,w:80,h:70},
        {id:'face',kind:'panel',name:'face',parentId:'parent',x:5,y:5,w:50,h:50,inset:[12,15,18,21]},
        {id:'label',kind:'text',name:'label',parentId:'face',x:5,y:5,w:20,h:10},
        {id:'other',kind:'button',name:'other',parentId:'parent',x:30,y:30,w:20,h:20}
    ];return d;
}
function equalRect(a,b){for(const k of ['x','y','w','h'])assert.ok(Math.abs(a[k]-b[k])<1e-7,k+': '+a[k]+' != '+b[k]);}
test('copy inset subtree uses actual viewport geometry and retains child positions',()=>{
    for(const [w,h] of [[390,844],[768,1024]]){
        const d=insetFixture(),s=d.screens[0],before=resolveRect(s,'face',w,h),child=resolveRect(s,'label',w,h);
        const clip=copySelection(d,s.id,['face'],w,h);let n=0;
        const [id]=pasteSelection(d,s.id,clip,()=>`copied-${++n}`,0);
        equalRect(resolveRect(s,id,w,h),before);equalRect(resolveRect(s,'copied-2',w,h),child);
    }
});
test('group and ungroup inset and percent siblings preserve bounds and child positions',()=>{
    for(const [w,h] of [[390,844],[768,1024]]){
        const d=insetFixture(),s=d.screens[0],ids=['face','other','label'];
        const before=ids.map(id=>resolveRect(s,id,w,h));
        groupSelection(d,s.id,['face','other'],'inset-group',w,h);
        ids.forEach((id,i)=>equalRect(resolveRect(s,id,w,h),before[i]));
        ungroupSelection(d,s.id,['inset-group'],w,h);
        ids.forEach((id,i)=>equalRect(resolveRect(s,id,w,h),before[i]));
        assert.ok(s.elements.find(e=>e.id==='face').inset);validateDocument(d);
    }
});

test('keyboard nudge moves inset and percent siblings equally and keeps dimensions',()=>{
    const d=insetFixture(),s=d.screens[0],ids=['face','other'];
    const before=ids.map(id=>resolveRect(s,id,390,844));
    nudgeSelection(d,s.id,ids,.25,-1,390,844);
    ids.forEach((id,i)=>equalRect(resolveRect(s,id,390,844),{...before[i],x:before[i].x+312*.0025,y:before[i].y-590.8*.01}));
    validateDocument(d);
});
test('keyboard parent and descendant multiselection moves descendants once',()=>{
    const d=insetFixture(),s=d.screens[0];
    const before=resolveRect(s,'label',390,844);
    nudgeSelection(d,s.id,['parent','face','label'],1,0,390,844);
    equalRect(resolveRect(s,'label',390,844),{...before,x:before.x+3.9});
    nudgeSelection(d,s.id,['parent','face','label'],-1,0,390,844);
    equalRect(resolveRect(s,'label',390,844),before);
});
