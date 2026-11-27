import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, readFile, writeFile, readdir, rm} from 'node:fs/promises';
import {join} from 'node:path';
import {saveDocument, saveBaseline, readBaseline} from '../../src/tools/uxStudio/save-plugin.mjs';

const root = process.cwd();
async function fixture(t) {
    const temp = await mkdtemp(join(root, '_작업/codex/ux-studio/save-size-tests-'));
    t.after(() => rm(temp, {recursive:true, force:true}));
    const dir = join(temp, 'projects');
    await mkdir(dir);
    return dir;
}
function largeLayout() {
    return {
        schemaVersion:1, projectId:'large-layout', revision:0, name:'반복 부품을 포함한 설계',
        entryScreen:'page-0', transitions:[], fixtures:{balance:0,items:[]},
        savedAt:'2026-11-17T00:00:00.000Z',
        screens:Array.from({length:5}, (_, s) => ({
            id:'page-'+s, name:'화면 '+s, kind:'page',
            elements:Array.from({length:400}, (_, i) => ({
                id:`label-${s}-${i}`, name:'공통 안내 부품 '+i, kind:'text', partRole:'label',
                x:0, y:0, w:10, h:10, text:'화면의 수량과 안내', purpose:'텍스트 부품',
                info:'공통 부품의 입력과 표시 규칙을 보존합니다.', fontSize:16,
                appearance:{shape:'rectangle',fill:'#ffffff',stroke:'#71839a',textColor:'#243549',strokeWidth:0,radius:0,opacity:1},
                typography:{weight:700,lineHeight:20,align:'left',wrap:'nowrap',strokeWidth:1,strokeColor:'#20202b'},
                interaction:{mode:'none',enabled:true,shape:'rectangle',reason:''}
            }))
        }))
    };
}
function sizedLayout(jsonBytes) {
    const document = largeLayout();
    for (const screen of document.screens) for (const element of screen.elements) element.info = '';
    let remaining = jsonBytes - Buffer.byteLength(JSON.stringify(document));
    assert.ok(remaining >= 0);
    for (const screen of document.screens) for (const element of screen.elements) {
        const bytes = Math.min(remaining, 10000);
        element.info = '가'.repeat(Math.floor(bytes / 3)) + 'x'.repeat(bytes % 3);
        remaining -= bytes;
    }
    assert.equal(remaining, 0);
    assert.equal(Buffer.byteLength(JSON.stringify(document)), jsonBytes);
    return document;
}

test('layout under the data limit round-trips even when pretty formatting exceeds 2MB', async t => {
    const dir = await fixture(t), document = largeLayout();
    assert.ok(Buffer.byteLength(JSON.stringify(document)) < 2000000);
    assert.ok(Buffer.byteLength(JSON.stringify(document, null, 2)) > 2000000);
    const saved = await saveDocument(root, dir, document, null);
    const file = join(dir, document.projectId + '.json');
    assert.ok(Buffer.byteLength(await readFile(file)) <= 2000000);
    assert.deepEqual(JSON.parse(await readFile(file, 'utf8')), saved);
    assert.deepEqual({...saved,revision:0,savedAt:document.savedAt}, document);
    const next = await saveDocument(root, dir, {...saved,name:'다음 편집'}, 1);
    assert.equal(next.revision, 2);
    const backups = await readdir(join(dir,'backups'));
    assert.equal(backups.length, 1);
    assert.deepEqual(JSON.parse(await readFile(join(dir,'backups',backups[0]),'utf8')), saved);
    await assert.rejects(() => saveDocument(root, dir, saved, 1), e => e.status === 409);
    assert.deepEqual(JSON.parse(await readFile(file,'utf8')), next);
    assert.deepEqual((await readdir(dir)).sort(), ['backups','large-layout.json']);
});

test('baseline of a legacy pretty layout stays within 2MB and preserves every value', async t => {
    const dir = await fixture(t), document = {...largeLayout(),revision:1};
    await writeFile(join(dir,'large-layout.json'),JSON.stringify(document,null,2));
    const baseline = await saveBaseline(root,dir,document.projectId,'W',1);
    assert.deepEqual(baseline, document);
    const bytes = await readFile(join(dir,'baselines','large-layout-W-r1.json'));
    assert.ok(bytes.byteLength <= 2000000);
    assert.deepEqual(await readBaseline(root,dir,document.projectId,'W',1),document);
});

test('the final newline is counted and an exactly 2MB stored file is allowed', async t => {
    const dir = await fixture(t), document = sizedLayout(1999999);
    const saved = await saveDocument(root,dir,document,null);
    const bytes = await readFile(join(dir,'large-layout.json'));
    assert.equal(bytes.byteLength,2000000);
    assert.deepEqual(JSON.parse(bytes),saved);
});

for (const jsonBytes of [2000000,2000001]) {
    test(`compact input of ${jsonBytes} bytes cannot publish an oversized saved file`, async t => {
        const dir = await fixture(t), document = sizedLayout(jsonBytes);
        await assert.rejects(() => saveDocument(root,dir,document,null), /2MB/);
        assert.deepEqual(await readdir(dir), []);
    });
}

test('oversized baseline is rejected without publishing a snapshot or temporary file', async t => {
    const dir = await fixture(t), document = {...sizedLayout(2000000),revision:1};
    await writeFile(join(dir,'large-layout.json'),JSON.stringify(document));
    await assert.rejects(() => saveBaseline(root,dir,document.projectId,'W',1), /2MB/);
    const items = await readdir(dir);
    if (items.includes('baselines')) assert.deepEqual(await readdir(join(dir,'baselines')), []);
    assert.deepEqual(JSON.parse(await readFile(join(dir,'large-layout.json'),'utf8')), document);
});
