import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {zoomGrapesViewport} from '../../src/tools/uxStudio/grapes-bridge.mjs';

test('canvas resize follows fit mode, preserves manual zoom, and disconnects on destroy',()=>{
 const source=readFileSync(new URL('../../src/tools/uxStudio/grapes-pilot.mjs',import.meta.url),'utf8');
 const observerCode=source.slice(source.indexOf(' const fitObserver='),source.indexOf(" for(const button of document.querySelectorAll('[data-pan-y]'))"));
 let resized,disposed,destroyed,zoom=50,coords={x:10,y:20},fitCount=0;
 const canvas={getBoundingClientRect:()=>({width:800,height:600})},picker={options:[{value:'75'}],querySelector:()=>null},buttons={};
 const context=vm.createContext({autoFit:true,zoomGrapesViewport,home:()=>fitCount++,document:{querySelector:id=>id==='#zoom'?picker:buttons},ResizeObserver:class{constructor(cb){resized=cb;}observe(el){assert.equal(el,canvas);}disconnect(){disposed=true;}},editor:{Canvas:{getElement:()=>canvas,getZoom:()=>zoom,getCoords:()=>coords,setZoom:value=>zoom=value,setCoords:(x,y)=>coords={x,y}},on:(name,cb)=>{assert.equal(name,'destroy');destroyed=cb;}}});
 vm.runInContext(observerCode,context);
 resized();assert.equal(fitCount,1);
 const zoomCode=source.slice(source.indexOf(' const zoomTo='),source.indexOf(' const wheelZoom='));
 vm.runInContext(zoomCode,context);picker.onchange({target:{value:'75'}});
 resized();assert.equal(zoom,75);assert.deepEqual(coords,{x:15,y:30});assert.equal(fitCount,1);
 context.autoFit=true;resized();assert.equal(fitCount,2);
 destroyed();assert.equal(disposed,true);
});
