import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { readFeatureCatalog } from '../../src/tools/uxStudio/catalog.mjs';
import { createLobbyDesign } from '../../src/tools/uxStudio/lobby.mjs';
import { nudgeSelection, removeSelection, copySelection, pasteSelection, groupSelection, ungroupSelection } from '../../src/tools/uxStudio/commands.mjs';
import { validateDocument, resolveRect } from '../../src/tools/uxStudio/model.mjs';
const fixtureRoot = resolve(process.cwd(), 'tests/ux-studio/fixtures/kpop-catalog'), c = await readFeatureCatalog(fixtureRoot);
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

function tabFixture(){
 const d=make(),s=d.screens[0];d.transitions=[];
 const part=(id,parentId,extra={})=>({id,name:id,kind:'panel',x:0,y:0,w:40,h:40,...(parentId?{parentId}:{}),...extra});
 s.elements=[part('root',null,{isGroup:true}),part('tabs','root',{control:{type:'tabs',value:'a',options:[{value:'a',label:'A',panelId:'body-a'},{value:'b',label:'B',panelId:'body-b'}]}}),part('body-a','root',{isGroup:true}),part('body-b','root',{isGroup:true}),part('label-a','body-a',{kind:'text',text:'Keep A'}),part('label-b','body-b',{kind:'text',text:'Keep B'})];
 validateDocument(d);return d;
}
test('duplicating a tab container remaps only copied panel IDs and preserves source and clipboard',()=>{
 const d=tabFixture(),s=d.screens[0],original=structuredClone(s.elements),clip=copySelection(d,s.id,['root']),before=structuredClone(clip);let n=0;
 pasteSelection(d,s.id,clip,()=>`tab-copy-${++n}`);validateDocument(d);
 const tabs=s.elements.find(e=>e.id==='tab-copy-2');
 assert.deepEqual(tabs.control.options,[{value:'a',label:'A',panelId:'tab-copy-3'},{value:'b',label:'B',panelId:'tab-copy-4'}]);
 assert.deepEqual(s.elements.slice(0,original.length),original);assert.deepEqual(clip,before);
});
for(const destination of ['same','other'])test('copying tabs without content clears unbundled panel references on '+destination+' screen',()=>{
 const d=tabFixture(),s=d.screens[0],clip=copySelection(d,s.id,['tabs']),before=structuredClone(clip);let n=0;
 if(destination==='other')d.screens.push({id:'other',name:'Other',kind:'page',elements:[]});
 const target=destination==='same'?s:d.screens.at(-1),[id]=pasteSelection(d,target.id,clip,()=>`tabs-only-${++n}`);validateDocument(d);
 assert.deepEqual(target.elements.find(e=>e.id===id).control.options,[{value:'a',label:'A'},{value:'b',label:'B'}]);
 assert.deepEqual(s.elements.find(e=>e.id==='tabs').control.options,before.elements[0].control.options);assert.deepEqual(clip,before);
});
test('partial tab content copy remaps the included panel and clears only the absent target',()=>{
 const d=tabFixture(),s=d.screens[0],clip=copySelection(d,s.id,['tabs','body-a']);let n=0;
 pasteSelection(d,s.id,clip,()=>`partial-${++n}`);validateDocument(d);
 assert.deepEqual(s.elements.find(e=>e.id==='partial-1').control.options,[{value:'a',label:'A',panelId:'partial-2'},{value:'b',label:'B'}]);
});
test('deleting a selected ancestor clears only references to its deleted tab panel descendants',()=>{
 const d=tabFixture(),s=d.screens[0],tabs=s.elements.find(e=>e.id==='tabs'),otherBefore=structuredClone(s.elements.filter(e=>['body-b','label-b'].includes(e.id)));
 s.elements.push({id:'holder',name:'Holder',kind:'panel',isGroup:true,parentId:'root',x:0,y:0,w:100,h:100});s.elements.find(e=>e.id==='body-a').parentId='holder';
 assert.equal(removeSelection(d,s.id,['holder']),3);validateDocument(d);
 assert.deepEqual(tabs.control.options,[{value:'a',label:'A'},{value:'b',label:'B',panelId:'body-b'}]);
 assert.equal(tabs.control.value,'a');assert.deepEqual(s.elements.filter(e=>['body-b','label-b'].includes(e.id)),otherBefore);
});

test('ungrouping a referenced tab panel clears its link while preserving children and the other panel',()=>{
 const d=tabFixture(),s=d.screens[0],tabs=s.elements.find(e=>e.id==='tabs'),before=resolveRect(s,'label-a',390,844),other=structuredClone(s.elements.find(e=>e.id==='body-b'));
 assert.deepEqual(ungroupSelection(d,s.id,['body-a'],390,844),['label-a']);validateDocument(d);
 assert.deepEqual(tabs.control.options,[{value:'a',label:'A'},{value:'b',label:'B',panelId:'body-b'}]);
 assert.equal(s.elements.find(e=>e.id==='label-a').parentId,'root');equalRect(resolveRect(s,'label-a',390,844),before);assert.deepEqual(s.elements.find(e=>e.id==='body-b'),other);
});
