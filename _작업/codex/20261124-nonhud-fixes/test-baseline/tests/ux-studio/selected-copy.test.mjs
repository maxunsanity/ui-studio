import {test} from 'node:test';
import assert from 'node:assert/strict';
import {bindSelectedCopy} from '../../src/tools/uxStudio/bindings.mjs';

test('renders only the selected record and leaves other bindings for the host', () => {
    const fixtures = {items:[
        {id:'a',name:'보컬 기초',copy:{effect:'음정 +1,000'}},
        {id:'b',name:'팬 카드',copy:{effect:'팬 +1.25%',zero:0}},
    ]};
    const template = '{{selection.name}} · {{selection.effect}} · {{selection.zero}} · {{score}}';
    assert.equal(bindSelectedCopy(template, fixtures, 'b'), '팬 카드 · 팬 +1.25% · 0 · {{score}}');
    assert.equal(bindSelectedCopy(template, fixtures, 'a'), '보컬 기초 · 음정 +1,000 · — · {{score}}');
    assert.equal(bindSelectedCopy(template, fixtures, null), '— · — · — · {{score}}');
});
