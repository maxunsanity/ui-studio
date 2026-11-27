// Read-only audit of the Studio-saved design. Does not author or rewrite it.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {validateDocument,createRuntime,activate} from '../../../../../src/tools/uxStudio/model.mjs';
import {openOverlay} from '../../../../../src/tools/uxStudio/overlay-runtime.mjs';
const root=new URL('../../../',import.meta.url),designPath=new URL('ui-studio/designs/ux-8d104ce4.json',root);
const bytes=await fs.readFile(designPath),d=validateDocument(JSON.parse(bytes));
const results=[];
for(const edge of d.transitions){
 const source=d.screens.find(s=>s.id===edge.fromScreen);let r=createRuntime(d);
 // Synthetic runtime fixture, never persisted to the authored design or browser.
 if(source.kind==='modal')r=openOverlay(d,r,source.id);else r.page=source.id;
 const next=activate(d,r,source.id,edge.fromElement);
 const pass=edge.action==='navigate'?next.page===edge.targetScreen:edge.action==='open'?next.overlays.includes(edge.targetScreen):edge.action==='close'?!next.overlays.includes(source.id):false;
 assert(pass,edge.label);results.push({label:edge.label,action:edge.action,pass,method:'local native-runtime simulation; not a browser click'});
}
const refs=new Set();let imageButtons=0;
for(const s of d.screens)for(const e of s.elements){
 if(e.image?.assetRef)refs.add(e.image.assetRef);
 for(const im of Object.values(e.control?.tabImages||{}))if(im?.assetRef)refs.add(im.assetRef);
 const b=e.buttonState;
 if(b?.enabled&&b.mode==='image'){
  imageButtons++;const n=b.images.normal,p=b.images.pressed;assert(n?.assetRef&&p?.assetRef&&n.assetRef!==p.assetRef,e.name+' state pair');assert.deepEqual(n.sourceSize,p.sourceSize,e.name+' state size');
  for(const im of Object.values(b.images))if(im.assetRef)refs.add(im.assetRef);
  const target=s.elements.find(x=>x.id===b.targetGraphic);assert(target,e.name+' target');assert.equal(target.image.assetRef,n.assetRef,e.name+' normal image');
  const text=s.elements.find(x=>x.id===b.pressFeedback?.target);assert(text,e.name+' text front');assert.equal(b.pressFeedback.distance,2,e.name+' front distance');
 }
}
function gather(x){if(!x||typeof x!=="object")return;if(x.assetRef)refs.add(x.assetRef);for(const v of Object.values(x))gather(v);}gather(d);
for(const ref of refs){const b=await fs.readFile(new URL('ui-studio/assets/'+ref,root));assert(b.length<300000,ref+' bytes');assert.equal('sha256-'+createHash('sha256').update(b).digest('hex')+'.webp',ref);}
assert(bytes.length<2000000);assert.equal(d.screens.length,15);
const result={revision:d.revision,screens:15,elements:d.screens.reduce((n,s)=>n+s.elements.length,0),transitions:results,uniqueImageRefs:refs.size,imageButtons,documentBytes:bytes.length,documentSHA256:createHash('sha256').update(bytes).digest('hex'),method:'read-only saved design audit; local runtime fixture is not persisted',passed:true};
await fs.writeFile(new URL('docs/evidence/20261118-kingshot/saved-design-audit.json',root),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
