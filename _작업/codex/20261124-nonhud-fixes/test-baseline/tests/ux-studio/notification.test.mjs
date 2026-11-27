import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateDocument} from '../../src/tools/uxStudio/model.mjs';
const notification=await import('../../src/tools/uxStudio/notification.mjs').catch(()=>({}));
const config=(extra={})=>({enabled:true,mode:'count',value:5,hideZero:true,maxDisplay:99,...extra});
const fixture=()=>JSON.parse(readFileSync(new URL('./fixtures/lobby-v1.json',import.meta.url),'utf8'));

test('notification config validates the typed contract and leaves legacy documents unchanged',()=>{
 const old=fixture(),before=structuredClone(old);assert.equal(validateDocument(old),old);assert.deepEqual(old,before);
 for(const invalid of [null,[],{},config({enabled:'true'}),config({mode:'banner'}),config({value:-1}),config({value:1.5}),config({value:Infinity}),config({hideZero:0}),config({maxDisplay:0}),config({maxDisplay:1000}),config({valueKey:''}),config({valueKey:'nested[key]'}),{...config(),unknown:true}]){
  const d=fixture();d.screens[0].elements[0].partRole='badge';d.screens[0].elements[0].notification=invalid;assert.throws(()=>validateDocument(d),/알림|배지/);
 }
 const d=fixture(),part=d.screens[0].elements[0];part.partRole='badge';part.notification=config({valueKey:'nav.buildCount'});assert.equal(validateDocument(d),d);assert.deepEqual(JSON.parse(JSON.stringify(d)).screens[0].elements[0].notification,part.notification);
});

test('notification counts cap display, dots follow count presence, and zero or disabled hide correctly',()=>{
 assert.equal(typeof notification.formatNotification,'function');
 assert.equal(notification.formatNotification(undefined),null);
 for(const [input,want] of [[config(),{text:'5',hidden:false}],[config({value:100}),{text:'99+',hidden:false}],[config({value:0}),{text:'0',hidden:true}],[config({value:0,hideZero:false}),{text:'0',hidden:false}],[config({mode:'dot'}),{text:'',hidden:false}],[config({mode:'dot',value:0}),{text:'',hidden:true}],[config({enabled:false}),{text:'',hidden:true}]])assert.deepEqual(notification.formatNotification(input),want);
 const n=config({valueKey:'nav.buildCount'});assert.deepEqual(notification.formatNotification(n,{'nav.buildCount':20}),{text:'20',hidden:false});assert.deepEqual(notification.formatNotification(n,{}),{text:'5',hidden:false});
 assert.deepEqual(notification.formatNotification(config({maxDisplay:9,value:10})),{text:'9+',hidden:false});
 assert.deepEqual(notification.formatNotification(config({valueKey:'toString'}),{}),{text:'5',hidden:false});
 assert.deepEqual(notification.formatNotification(n,Object.create({'nav.buildCount':88})),{text:'5',hidden:false});
 assert.throws(()=>notification.formatNotification(n,{'nav.buildCount':-1}),/알림|배지/);
});
