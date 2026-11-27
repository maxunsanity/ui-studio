import {test} from 'node:test';
import assert from 'node:assert/strict';
import {bindSelectedImages} from '../../src/tools/uxStudio/bindings.mjs';

test('selected artwork and owner portrait resolve independently with authored fallbacks',()=>{
    const make=letter=>({src:'',assetRef:'sha256-'+letter.repeat(64)+'.jpg',sourceSize:[100,100],alt:letter,fit:'contain'});
    const art=make('a'), first=make('b'), second=make('c'), old=make('d');
    const screen={elements:[{id:'art',image:{...old,selectionKey:'art'}},{id:'owner',image:{...old,selectionKey:'owner'}}]};
    const fixtures={items:[{id:'one',images:{art,owner:first}},{id:'two',images:{art,owner:second}}]};
    const one=bindSelectedImages(screen,fixtures,'one');
    const two=bindSelectedImages(screen,fixtures,'two');
    assert.equal(one.elements[0].image,two.elements[0].image);
    assert.equal(one.elements[1].image,first);
    assert.equal(two.elements[1].image,second);
    assert.equal(bindSelectedImages(screen,fixtures,'missing'),screen);
    assert.equal(screen.elements[1].image.assetRef,old.assetRef);
});
