import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateDocument,resolveRect} from '../../src/tools/uxStudio/model.mjs';
const effects=await import('../../src/tools/uxStudio/visual-effects.mjs').catch(()=>({}));
const shadow=(extra={})=>({enabled:true,color:'#1234ab',opacity:.25,x:-3,y:6,blur:8,...extra});
const fixture=()=>JSON.parse(readFileSync(new URL('./fixtures/lobby-v1.json',import.meta.url),'utf8'));

test('document rejects malformed shadow fields while legacy and bounded effects preserve source geometry',()=>{
 const legacy=fixture(),before=structuredClone(legacy);validateDocument(legacy);assert.deepEqual(legacy,before);
 for(const invalid of [null,[],{glow:{}},{shadow:null},{shadow:[]},{shadow:shadow({enabled:'true'})},{shadow:shadow({color:'red;filter:none'})},{shadow:shadow({opacity:1.01})},{shadow:shadow({opacity:-.01})},{shadow:shadow({x:-97})},{shadow:shadow({y:97})},{shadow:shadow({blur:-1})},{shadow:shadow({blur:Infinity})},{shadow:shadow({x:NaN})},{shadow:{...shadow(),spread:4}}]){
  const d=fixture();d.screens[0].elements[0].effects=invalid;assert.throws(()=>validateDocument(d),/효과|그림자/);
 }
 const d=fixture(),screen=d.screens[0],part=screen.elements[0],rect=resolveRect(screen,part.id,390,844);part.effects={shadow:shadow({x:-96,y:96,blur:96,opacity:0})};
 assert.equal(validateDocument(d),d);assert.deepEqual(resolveRect(screen,part.id,390,844),rect);assert.deepEqual(JSON.parse(JSON.stringify(d)).screens[0].elements[0].effects,part.effects);
});

test('shadow filter encodes validated pixels and rgba without exposing arbitrary CSS',()=>{
 assert.equal(typeof effects.shadowFilter,'function');
 assert.equal(effects.shadowFilter(shadow()),'drop-shadow(-3px 6px 8px rgba(18,52,171,0.25))');
 assert.equal(effects.shadowFilter(shadow({enabled:false})),'none');assert.equal(effects.shadowFilter(undefined),'none');
 assert.throws(()=>effects.shadowFilter(shadow({color:'#ffffff) brightness(3)'})),/효과|그림자/);
});

test('art-only DOM shadow preserves geometry and state filters and clears when disabled or removed',()=>{
 assert.equal(typeof effects.applyShadow,'function');
 const props=new Map([['filter','brightness(.88)'],['left','12px'],['width','80px']]),classes=new Set();
 const node={style:{setProperty:(key,value)=>props.set(key,value),removeProperty:key=>props.delete(key)},classList:{add:key=>classes.add(key),remove:key=>classes.delete(key)}};
 effects.applyShadow(node,{shadow:shadow()},{assetView:'wire'});assert.equal(props.has('--ui-shadow'),false);
 effects.applyShadow(node,{shadow:shadow()},{assetView:'art',shell:true});assert.equal(classes.has('has-ui-shadow'),false);
 effects.applyShadow(node,{shadow:shadow()},{assetView:'art'});assert.equal(classes.has('has-ui-shadow'),true);assert.equal(props.get('--ui-shadow'),'drop-shadow(-3px 6px 8px rgba(18,52,171,0.25))');
 assert.equal(props.get('filter'),'brightness(.88)');assert.equal(props.get('left'),'12px');assert.equal(props.get('width'),'80px');
 effects.applyShadow(node,{shadow:shadow({enabled:false})},{assetView:'art'});assert.equal(classes.has('has-ui-shadow'),false);assert.equal(props.has('--ui-shadow'),false);
 effects.applyShadow(node,{shadow:shadow()},{assetView:'art'});effects.applyShadow(node,undefined,{assetView:'art'});assert.equal(props.has('--ui-shadow'),false);
 effects.applyShadow({get style(){throw Error('legacy style must remain untouched');}},undefined,{assetView:'art'});
});
