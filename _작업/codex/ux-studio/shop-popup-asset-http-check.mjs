// Bounded GETs of the saved Shop's 22 asset resources only; no design/state API or browser.
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {dirname,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../../..');
const {documentAssetImages,assetSource}=await import(pathToFileURL(resolve(root,'src/tools/uxStudio/asset-reference.mjs')));
const designPath='samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json';
const documentBytes=await readFile(resolve(root,designPath)),document=JSON.parse(documentBytes);
const shop=document.screens.find(s=>s.name==='Modal_Shop_Store');
const refs=[...new Set(documentAssetImages({screens:[shop]}).map(i=>i.assetRef))];
if(refs.length!==22)throw Error('Expected exactly22 saved Shop asset refs; no HTTP requests sent.');
const workspace='workspace-8e0f09e7-4699-4ac6-81b3-d545c7046ef6';
const sha=b=>createHash('sha256').update(b).digest('hex');
const checks=[];
// Sequential requests allow immediate stop if normal approved access is denied.
for(const ref of refs){
 const expected=ref.match(/^sha256-([a-f0-9]{64})\.(webp|png|jpg)$/)?.[1];
 if(!expected)throw Error('Invalid saved asset ref; HTTP stopped.');
 const url=new URL(assetSource({assetRef:ref},workspace),'http://127.0.0.1:7018');
 if(url.origin!=='http://127.0.0.1:7018'||url.pathname!=='/api/ux-studio/asset')throw Error('Unexpected resource URL; HTTP stopped.');
 const localPath='samples/monopoly-go/ui-studio/assets/'+ref;
 const localBytes=await readFile(resolve(root,localPath));
 const response=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(10000)});
 const remoteBytes=Buffer.from(await response.arrayBuffer());
 const check={assetRef:ref,url:url.href,localPath,status:response.status,contentType:response.headers.get('content-type'),localBytes:localBytes.length,responseBytes:remoteBytes.length,expectedSHA256:expected,localSHA256:sha(localBytes),responseSHA256:sha(remoteBytes)};
 check.pass=response.status===200&&check.localSHA256===expected&&check.responseSHA256===expected&&localBytes.equals(remoteBytes);checks.push(check);
 if([401,403].includes(response.status))throw Error('Resource access denied; stopped without bypass.');
}
const result={checkedAt:new Date().toISOString(),revision:document.revision,screenId:shop.id,screenName:shop.name,workspace,scope:'Only22 saved Shop asset GETs at approved localhost7018; response and local bytes SHA checked',documentSHA256:sha(documentBytes),checks,total:checks.length,passed:checks.filter(c=>c.pass).length,pass:checks.every(c=>c.pass),limitations:['No browser/design API/app-state API/other host read. No source/design/guide/shared report/STATUS/server changes.']};
result.savedFileUnchanged=sha(await readFile(resolve(root,designPath)))===result.documentSHA256;
await writeFile(resolve(root,'docs/evidence/20261117-shop-popup/asset-http-checks.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({revision:result.revision,total:result.total,passed:result.passed,pass:result.pass,savedFileUnchanged:result.savedFileUnchanged},null,2));
if(!result.pass)process.exitCode=1;
