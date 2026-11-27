import test from 'node:test';
import assert from 'node:assert/strict';
import {arrangeChildren,wrapMenu} from '../../src/tools/uxStudio/menu-layout.mjs';
import {resolveRect} from '../../src/tools/uxStudio/model.mjs';
import {encodeTransform} from '../../src/tools/uxStudio/rect-transform.mjs';
function close(a,b){for(const k of ['x','y','w','h'])assert.ok(Math.abs(a[k]-b[k])<1e-8,`${k}: ${a[k]} != ${b[k]}`);}
for(const type of ['anchor','inset'])for(const direction of ['row','column'])test(`${type} menu ${direction} arrangement preserves pixel sizes and constraint kinds`,()=>{
 const base={x:0,y:0,w:400,h:800},pr={x:20,y:30,w:300,h:400};
 const p={id:'p',kind:'panel',x:0,y:0,w:1,h:1,menu:{headerHeight:36}};
 if(type==='anchor')p.rectTransform=encodeTransform(base,pr,[1,1],[1,1],[1,1]);else p.inset=[30,80,370,20];
 const a={id:'a',parentId:'p',x:0,y:0,w:1,h:1,rectTransform:encodeTransform(pr,{x:40,y:80,w:60,h:40},[0,0],[1,1],[.5,.5])};
 const b={id:'b',parentId:'p',x:0,y:0,w:1,h:1,inset:[70,150,280,50]};
 const c={id:'c',parentId:'a',x:10,y:10,w:50,h:50};const s={elements:[p,a,b,c]};
 arrangeChildren(s,'p',direction,12,400,800);
 close(resolveRect(s,'p',400,800),{x:20,y:30,w:direction==='row'?188:116,h:direction==='row'?102:154});
 close(resolveRect(s,'a',400,800),{x:28,y:74,w:60,h:40});
 close(resolveRect(s,'b',400,800),{x:direction==='row'?100:28,y:direction==='row'?74:126,w:100,h:50});
 close(resolveRect(s,'c',400,800),{x:34,y:78,w:30,h:20});
 assert.deepEqual(a.rectTransform.max,[1,1]);assert.ok(b.inset);assert.equal(Boolean(p.rectTransform),type==='anchor');
 const before=s.elements.map(e=>resolveRect(s,e.id,400,800));arrangeChildren(s,'p',direction,12,400,800);
 s.elements.forEach((e,i)=>close(resolveRect(s,e.id,400,800),before[i]));
});
