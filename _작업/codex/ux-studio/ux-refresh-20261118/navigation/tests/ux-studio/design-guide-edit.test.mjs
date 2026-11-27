import test from 'node:test';
import assert from 'node:assert/strict';
import * as edit from '../../src/tools/uxStudio/design-guide-edit.mjs';
import {resolveRect} from '../../src/tools/uxStudio/model.mjs';
const part=(id,extra={})=>({id,name:id,kind:'panel',x:10,y:10,w:50,h:20,...extra});
const fixture=()=>({schemaVersion:4,projectId:'ux-guide-edit',name:'Guide',revision:3,entryScreen:'main',screens:[{id:'main',name:'Main',kind:'page',logicalSize:{w:400,h:800},safeArea:[20,10,20,10],elements:[part('parent'),part('child',{parentId:'parent',kind:'image'})]}],transitions:[],fixtures:{balance:0,items:[]}});
test('guide geometry uses parent pixels and preserves source IDs and unrelated fields',()=>{
 const d=fixture(),before=JSON.stringify(d),next=edit.applyDesignGuideChange(d,'main','child',{type:'rect',rect:{x:20,y:10,w:80,h:30}});
 assert.equal(JSON.stringify(d),before);assert.equal(next.revision,3);assert.equal(next.screens[0].elements[1].parentId,'parent');
 assert.deepEqual(resolveRect(next.screens[0],'child',400,800),{x:60,y:90,w:80,h:30});
});
test('guide keeps inset, anchors and safe-area constraints, rejecting auto layout and invalid changes',()=>{
 for(const constraints of [{inset:[1,2,3,4]},{rectTransform:{min:[1,1],max:[1,1],pivot:[1,1],position:[0,0],sizeDelta:[30,40]}},{useSafeArea:true,parentId:undefined}]){
 const d=fixture();Object.assign(d.screens[0].elements[1],constraints);
 const next=edit.applyDesignGuideChange(d,'main','child',{type:'rect',rect:{x:20,y:10,w:80,h:30}});
 const r=resolveRect(next.screens[0],'child',400,800);
 assert.ok(Math.abs(r.w-80)<1e-8);assert.ok(Math.abs(r.h-30)<1e-8);
 if(constraints.inset)assert.ok(next.screens[0].elements[1].inset);
 if(constraints.rectTransform)assert.deepEqual(next.screens[0].elements[1].rectTransform.min,[1,1]);
 }
 const d=fixture();d.screens[0].elements[0].layout={type:'vertical',gap:4,padding:[0,0,0,0],itemSize:[30,30]};
 assert.throws(()=>edit.applyDesignGuideChange(d,'main','child',{type:'rect',rect:{x:0,y:0,w:30,h:30}}),/자동/);
 const clean=fixture(),before=JSON.stringify(clean);
 assert.throws(()=>edit.applyDesignGuideChange(clean,'main','child',{type:'rect',rect:{x:NaN,y:0,w:0,h:1}}));
 assert.equal(JSON.stringify(clean),before);
});
test('guide image removal preserves the part and image addition/text settings validate before applying',()=>{
 const d=fixture(),image={src:'',asset:'icon',alt:'Cash',fit:'contain'};
 const added=edit.applyDesignGuideChange(d,'main','child',{type:'image',image});
 assert.deepEqual(added.screens[0].elements[1].image,image);
 const removed=edit.applyDesignGuideChange(added,'main','child',{type:'image',image:null});
 assert.equal(removed.screens[0].elements.length,2);assert.equal(removed.screens[0].elements[1].image,undefined);
 const text=edit.applyDesignGuideChange(d,'main','child',{type:'text',text:'13,075',fontSize:18});
 assert.equal(text.screens[0].elements[1].fontSize,18);
 assert.throws(()=>edit.applyDesignGuideChange(d,'main','child',{type:'text',text:'ok',fontSize:-1}));
});
test('guide imports only local project image paths or files using the existing asset store',async()=>{
 const calls=[],blob=new Blob(['abc'],{type:'image/webp'}),ref='sha256-'+'a'.repeat(64)+'.webp';
 const fetcher=async(url,options)=>{calls.push([url,options]);return options?.method==='POST'?{ok:true,json:async()=>({asset:{assetRef:ref,width:20,height:30,mime:'image/webp',bytes:3}})}:{ok:true,blob:async()=>blob};};
 const image=await edit.importGuideImage({path:'/ui-studio/source/assets/test.webp'},null,fetcher);
 assert.equal(image.assetRef,ref);assert.deepEqual(image.sourceSize,[20,30]);assert.equal(calls.length,2);
 for(const path of ['https://example.com/x.png','/ui-studio/source/assets/../x.png','/api/secret.png'])await assert.rejects(()=>edit.importGuideImage({path},null,fetcher),/경로/);
 assert.equal(calls.length,2);
});
