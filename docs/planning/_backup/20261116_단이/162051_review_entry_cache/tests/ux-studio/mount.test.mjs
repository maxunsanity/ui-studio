import test from 'node:test';
import assert from 'node:assert/strict';
import {uiStudioMount,uiStudioFiles} from '../../tools/ux-studio/mount.mjs';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
function request(url,root='/tool') {
 let handler;uiStudioMount(root).configureServer({middlewares:{use(fn){handler=fn;}}});
 const headers={},res={statusCode:200,setHeader(k,v){headers[k.toLowerCase()]=v;},end(){this.ended=true;}},req={url};let next=false;
 handler(req,res,()=>{next=true;});return {req,res,headers,next};
}
test('bare and legacy editor addresses redirect to the independent canonical entry, preserving query',()=>{
 for(const path of ['/','/?project=demo','/index.html','/ui-studio','/docs/planning/ux-studio.html?workspace=ws-a']){
  const r=request(path);assert.equal(r.res.statusCode,302);assert.equal(r.res.ended,true);assert.equal(r.next,false);
  assert.equal(r.headers.location,'/ui-studio/'+(path.includes('?')?'?'+path.split('?')[1]:''));
 }
});

function reviewFixture(t,review){
 const parent=fileURLToPath(new URL('../../_작업/codex/ux-studio/',import.meta.url));
 const root=mkdtempSync(join(parent,'review-entry-test-'));
 t.after(()=>rmSync(root,{recursive:true,force:true}));
 mkdirSync(join(root,'tools/ux-studio'),{recursive:true});
 writeFileSync(join(root,'tools/ux-studio/current-review.json'),typeof review==='string'?review:JSON.stringify(review));
 return root;
}
test('a bare entry opens the published workspace instead of an unrelated default document',t=>{
 const root=reviewFixture(t,{workspaceId:'workspace-review',projectId:'ux-review'});
 const r=request('/ui-studio/?editor=detail&screen=main',root);
 assert.equal(r.res.statusCode,302);assert.equal(r.next,false);
 assert.equal(r.headers.location,'/ui-studio/?editor=detail&screen=main&workspace=workspace-review&project=ux-review');
 assert.equal(r.headers['cache-control'],'no-store');
});
test('explicit project or workspace entries never inherit the published sample',t=>{
 const root=reviewFixture(t,{workspaceId:'workspace-review',projectId:'ux-review'});
 for(const query of ['?workspace=workspace-other','?project=ux-other','?workspace=workspace-other&project=ux-other']){
  const r=request('/ui-studio/'+query,root);
  assert.equal(r.res.statusCode,200);assert.equal(r.next,true);assert.ok(r.req.url.endsWith(query));
 }
});
test('missing or invalid published entry metadata preserves the normal project picker',t=>{
 for(const review of ['{bad json}',{workspaceId:'../private',projectId:'ux-review'},{workspaceId:'workspace-review',projectId:'https://elsewhere.example'},{workspaceId:'workspace-review'}]){
  const root=reviewFixture(t,review),r=request('/ui-studio/',root);
  assert.equal(r.res.statusCode,200);assert.equal(r.next,true);
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
 for(const [path,target] of [['/ui-studio/','src/tools/uxStudio/grapes-pilot.html'],['/ui-studio/preview.html','docs/planning/ux-runtime-preview.html'],['/ui-studio/canvas.html','src/tools/uxStudio/grapes-pilot.html'],['/ui-studio/source/main.mjs','src/tools/uxStudio/main.mjs'],['/ui-studio/source/guide/index.json','src/tools/uxStudio/guide/index.json']]){
  const r=request(path+'?v=1');assert.equal(r.next,true);assert.equal(r.req.url,'/@fs/tool/'+target+'?v=1');
 }
 assert.ok(uiStudioFiles('/tool').includes('/tool/src/tools/uxStudio'));
});
test('old source URLs remain compatibility mounts; encoded traversal is never mounted',()=>{
 assert.equal(request('/src/tools/uxStudio/model.mjs').req.url,'/@fs/tool/src/tools/uxStudio/model.mjs');
 for(const path of ['/ui-studio/source/%2e%2e%2fsecrets.json','/src/tools/uxStudio/%2e%2e%2fsecrets.json']){const r=request(path);assert.equal(r.res.statusCode,400);assert.equal(r.next,false);}
});

test('main canvas and detailed editor preserve the same project selection',()=>{
 const query='?editor=detail&project=ux-example&workspace=workspace-demo&screen=main&element=button';
 const detail=request('/ui-studio/'+query);
 assert.equal(detail.req.url,'/@fs/tool/docs/planning/ux-studio.html'+query);
 assert.match(request('/ui-studio/?editor=unknown').req.url,/grapes-pilot.html/);
});
