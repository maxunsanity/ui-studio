import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {selectionDescriptionHTML} from '../../src/tools/uxStudio/inspector-description.mjs';

test('selected part shows its saved purpose and info read-only, escaped', () => {
  const html = selectionDescriptionHTML({name:'S', purpose:'화면 설명'}, {name:'HUD_Top', purpose:'상단 메뉴 <b>공간</b>', info:'둘째 줄'});
  assert.match(html, /class="inspector-description"/);
  assert.match(html, /상단 메뉴 &lt;b&gt;공간&lt;\/b&gt;/);
  assert.match(html, /둘째 줄/);
  assert.doesNotMatch(html, /화면 설명/);
  assert.doesNotMatch(html, /<textarea|<input/);
});

test('screen selection shows screen purpose; empty descriptions say so', () => {
  assert.match(selectionDescriptionHTML({name:'S', purpose:'1차 공간 가이드'}, null), /1차 공간 가이드/);
  assert.match(selectionDescriptionHTML({name:'S'}, {name:'X'}), /설명이 없습니다/);
  assert.match(selectionDescriptionHTML({name:'S', purpose:''}, null), /설명이 없습니다/);
});

test('default wireframe placeholder info is not repeated as a description', () => {
  const html = selectionDescriptionHTML({name:'S'}, {name:'X', purpose:'용도', info:'와이어프레임 유닛 · 기능은 연결·조건에서 지정'});
  assert.match(html, /용도/);
  assert.doesNotMatch(html, /와이어프레임 유닛/);
});

test('main inspector renders the description block under the title', () => {
  const src = readFileSync('src/tools/uxStudio/main.mjs', 'utf8');
  assert.match(src, /import \{ selectionDescriptionHTML \} from '\.\/inspector-description\.mjs'/);
  assert.match(src, /<\/h2>\$\{selectionDescriptionHTML\(screen, e\)\}<\/div>/);
});
