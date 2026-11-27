import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

test('canvas resize follows fit mode, preserves manual zoom, and disconnects on destroy',()=>{
 const source=readFileSync(new URL('../../src/tools/uxStudio/grapes-pilot.mjs',import.meta.url),'utf8');
 const observerCode=source.slice(source.indexOf(' const fitObserver='),source.indexOf(" for(const button of document.querySelectorAll('[data-pan-y]'))"));
 let resized,disposed,destroyed,zoom,fitCount=0;
 const canvas={},picker={};
 const context=vm.createContext({autoFit:true,home:()=>fitCount++,document:{querySelector:()=>picker},ResizeObserver:class{constructor(cb){resized=cb;}observe(el){assert.equal(el,canvas);}disconnect(){disposed=true;}},editor:{Canvas:{getElement:()=>canvas,setZoom:value=>zoom=value},on:(name,cb)=>{assert.equal(name,'destroy');destroyed=cb;}}});
 vm.runInContext(observerCode,context);
 resized();assert.equal(fitCount,1);
 const zoomCode=source.slice(source.indexOf(" document.querySelector('#zoom').onchange="),source.indexOf(" for(const button of document.querySelectorAll('[data-pan]'))"));
 vm.runInContext(zoomCode,context);picker.onchange({target:{value:'75'}});
 resized();assert.equal(zoom,75);assert.equal(fitCount,1);
 context.autoFit=true;resized();assert.equal(fitCount,2);
 destroyed();assert.equal(disposed,true);
});
