import test from 'node:test';
import assert from 'node:assert/strict';
import {uiStudioMount,uiStudioFiles} from '../../tools/ux-studio/mount.mjs';
function request(url) {
 let handler;uiStudioMount('/tool').configureServer({middlewares:{use(fn){handler=fn;}}});
 const headers={},res={statusCode:200,setHeader(k,v){headers[k.toLowerCase()]=v;},end(){this.ended=true;}},req={url};let next=false;
 handler(req,res,()=>{next=true;});return {req,res,headers,next};
}
test('bare and legacy editor addresses redirect to the independent canonical entry, preserving query',()=>{
 for(const path of ['/','/?project=demo','/index.html','/ui-studio','/docs/planning/ux-studio.html?workspace=ws-a']){
  const r=request(path);assert.equal(r.res.statusCode,302);assert.equal(r.res.ended,true);assert.equal(r.next,false);
  assert.equal(r.headers.location,'/ui-studio/'+(path.includes('?')?'?'+path.split('?')[1]:''));
 }
});
test('legacy preview and canvas links redirect without losing project/workspace',()=>{
 for(const [path,destination] of [['/docs/planning/ux-runtime-preview.html','/ui-studio/preview.html'],['/src/tools/uxStudio/grapes-pilot.html','/ui-studio/canvas.html']]){
  const r=request(path+'?project=demo&workspace=ws-a');assert.equal(r.res.statusCode,302);assert.equal(r.headers.location,destination+'?project=demo&workspace=ws-a');
 }
});
test('planning, simulator and API routes keep the host route',()=>{
 for(const path of ['/docs/planning/planning-docs-tool.html?doc=T04','/api/ux-studio/projects','/simulator/']){const r=request(path);assert.equal(r.next,true);assert.equal(r.req.url,path);}
});
test('canonical editor, preview, canvas and sources resolve exclusively from independent root',()=>{
 for(const [path,target] of [['/ui-studio/','docs/planning/ux-studio.html'],['/ui-studio/preview.html','docs/planning/ux-runtime-preview.html'],['/ui-studio/canvas.html','src/tools/uxStudio/grapes-pilot.html'],['/ui-studio/source/main.mjs','src/tools/uxStudio/main.mjs'],['/ui-studio/source/guide/index.json','src/tools/uxStudio/guide/index.json']]){
  const r=request(path+'?v=1');assert.equal(r.next,true);assert.equal(r.req.url,'/@fs/tool/'+target+'?v=1');
 }
 assert.ok(uiStudioFiles('/tool').includes('/tool/src/tools/uxStudio'));
});
test('old source URLs remain compatibility mounts; encoded traversal is never mounted',()=>{
 assert.equal(request('/src/tools/uxStudio/model.mjs').req.url,'/@fs/tool/src/tools/uxStudio/model.mjs');
 for(const path of ['/ui-studio/source/%2e%2e%2fsecrets.json','/src/tools/uxStudio/%2e%2e%2fsecrets.json']){const r=request(path);assert.equal(r.res.statusCode,400);assert.equal(r.next,false);}
});
