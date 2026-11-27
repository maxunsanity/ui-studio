import test from 'node:test';
import assert from 'node:assert/strict';
import {DEVICE_PROFILES,validateDevicePreview,canvasDevicePreview,canvasDeviceStyles} from '../../src/tools/uxStudio/canvas-device-preview.mjs';
import {resolveResponsiveRect} from '../../src/tools/uxStudio/responsive-layout.mjs';

const fixture=()=>({id:'main',kind:'page',logicalSize:{w:551,h:984},elements:[
 {id:'world',x:0,y:0,w:100,h:100},
 {id:'bottom',x:0,y:0,w:100,h:10,rectTransform:{min:[0,0],max:[0,0],pivot:[0,0],position:[0,0],sizeDelta:[551,280]}},
 {id:'icon',parentId:'bottom',x:0,y:0,w:64/551*100,h:64/280*100},
 {id:'badge',parentId:'bottom',x:10,y:0,w:28/551*100,h:28/280*100}
]});
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} ~= ${b}`);

test('shared profiles retain existing IDs and explicit 360/390/430 dimensions',()=>{
 for(const key of ['design','phone','fold','tablet','short'])assert.ok(DEVICE_PROFILES[key]);
 assert.equal(DEVICE_PROFILES.short.w,360);assert.equal(DEVICE_PROFILES.phone.w,390);assert.equal(DEVICE_PROFILES.phone430.w,430);
 assert.deepEqual(validateDevicePreview(),{profile:'design',orientation:'original',w:390,h:844});
});

test('design basis is unchanged; device dimensions and uniform logical viewport are independent',()=>{
 const screen=fixture(),original=structuredClone(screen),native=canvasDevicePreview(screen);
 assert.deepEqual(native.device,screen.logicalSize);assert.deepEqual(native.logical,screen.logicalSize);assert.equal(native.scale,1);
 const phone=canvasDevicePreview(screen,{profile:'phone'});
 assert.deepEqual(phone.device,{w:390,h:844});near(phone.scale,390/551);near(phone.logical.w,551);near(phone.logical.h,844*551/390);
 assert.notEqual(phone.logical.h,screen.logicalSize.h);
 assert.deepEqual(canvasDeviceStyles(phone),{width:'551px',height:phone.logical.h+'px',transform:`scale(${phone.scale})`,'transform-origin':'top left'});
 assert.deepEqual(screen,original);
});

test('actual percent and bottom anchors reflow while fixed square units and fonts scale uniformly',()=>{
 const screen=fixture();
 for(const profile of ['short','phone','phone430']){
  const preview=canvasDevicePreview(screen,{profile}),{w,h}=preview.logical;
  const world=resolveResponsiveRect(screen,'world',w,h),bottom=resolveResponsiveRect(screen,'bottom',w,h);
  near(world.h*preview.scale,preview.device.h);near((bottom.y+bottom.h)*preview.scale,preview.device.h);
  for(const [id,size] of [['icon',64],['badge',28]]){const rect=resolveResponsiveRect(screen,id,w,h);near(rect.w,rect.h);near(rect.w*preview.scale,size*preview.scale);}
  near(26*preview.scale,26*preview.device.w/screen.logicalSize.w);
 }
});

test('custom and orientation use preview dimensions without rewriting reference size',()=>{
 const screen=fixture(),p=canvasDevicePreview(screen,{profile:'custom',w:430,h:900,orientation:'landscape'});
 assert.deepEqual(p.device,{w:900,h:430});assert.deepEqual(p.reference,{w:551,h:984});near(p.logical.h*p.scale,430);
 assert.deepEqual(canvasDevicePreview(screen,{profile:'design',orientation:'landscape'}).device,{w:984,h:551});
 assert.deepEqual(canvasDevicePreview({elements:[]}).device,{w:390,h:844});
});

test('invalid preferences and impossible stretched constraints reject before view mutation',()=>{
 for(const settings of [{profile:'bad'},{orientation:'sideways'},{profile:'custom',w:0,h:900},{w:Infinity},{h:1.5},{h:10001}])assert.throws(()=>validateDevicePreview(settings));
 const screen=fixture();screen.elements.push({id:'invalid',x:0,y:0,w:1,h:1,rectTransform:{min:[0,0],max:[1,1],pivot:[0,0],position:[0,0],sizeDelta:[0,-700]}});
 assert.throws(()=>canvasDevicePreview(screen,{profile:'custom',w:1000,h:300}));
});
