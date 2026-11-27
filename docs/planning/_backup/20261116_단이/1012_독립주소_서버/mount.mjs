import { resolve, sep } from 'node:path';
export function uiStudioMount(root) {
 return {name:'independent-ui-studio-mount',configureServer(server){server.middlewares.use((req,res,next)=>{
  const url=new URL(req.url,'http://127.0.0.1');let path;
  try{path=decodeURIComponent(url.pathname);}catch{return next();}
  if(path==='/' || path==='/index.html'){res.statusCode=302;res.setHeader('Location','/docs/planning/ux-studio.html'+url.search);res.setHeader('Cache-Control','no-store');return res.end();}
  const allowed=path.startsWith('/src/tools/uxStudio/') || ['/docs/planning/ux-studio.html','/docs/planning/ux-runtime-preview.html','/docs/planning/code-map/vis-network.min.js'].includes(path);
  if(!allowed)return next();
  const file=resolve(root,'.'+path),base=resolve(root);
  if(!file.startsWith(base+sep)){res.statusCode=400;return res.end('Invalid path');}
  req.url='/@fs'+encodeURI(file)+url.search;next();
 });}};
}
export function uiStudioFiles(root){return ['src/tools/uxStudio','docs/planning/ux-studio.html','docs/planning/ux-runtime-preview.html','docs/planning/code-map/vis-network.min.js'].map(path=>resolve(root,path));}
