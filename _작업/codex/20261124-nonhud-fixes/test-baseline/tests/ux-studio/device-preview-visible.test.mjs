import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// 기기 화면 크기 전환은 접힌 '편집 도구' 메뉴가 아니라 툴바와 미리보기 창에서 바로 보여야 합니다.
const source = readFileSync(new URL('../../src/tools/uxStudio/main.mjs', import.meta.url), 'utf8');
const toolbarLine = source.split('\n').find(line => line.includes('data-action="preview-current"'));

test('detail toolbar shows the device picker outside the collapsed edit-tools menu', () => {
    assert.ok(toolbarLine, 'toolbar template');
    const picker = toolbarLine.indexOf('data-setting="profile"'), menu = toolbarLine.indexOf('<details class="file-menu studio-tools">');
    assert.ok(picker > 0 && menu > 0);
    assert.ok(picker < menu, 'device picker is rendered before (outside) the edit-tools <details>');
    assert.equal((toolbarLine.match(/data-setting="profile"/g) || []).length, 1, 'only one device picker');
});
test('screen preview dialog offers device sizes and re-mounts at the device logical height', () => {
    const start = source.indexOf('function openCurrentPreview('), end = source.indexOf('\nfunction header()', start);
    const body = source.slice(start, end);
    assert.match(body, /studio-screen-preview-device/);
    assert.match(body, /Object\.entries\(profiles\)/);
    assert.match(body, /canvasDevicePreview\(/);
    assert.match(body, /logicalSize\s*=/);
});
