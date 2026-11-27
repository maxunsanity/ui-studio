#!/usr/bin/env node
// Read-only: normal-UI execution logs are expectations, never saved design/model input.
import assert from 'node:assert/strict';
import {readFile,readdir,lstat,realpath} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {inspectAsset} from '../../../../src/tools/uxStudio/asset-store.mjs';
const ROOT='/Users/max/projest_max/ui-studio';
const DESIGN=join(ROOT,'samples/acecraft/ui-studio/designs/ux-96eff1ad.json');
const MAPS='/Users/max/Documents/Codex/2026-11-11/new-chat';
const OVERRIDES=join(ROOT,'_작업/codex/ux-studio/acecraft-20261120/image-expectation-overrides.json');
const SOURCE_PREFIX='/ui-studio/source/assets/import-staging/acecraft-20261120/';
const familyAllowed=name=>/^(?:Page|Modal)_ACE_/.test(name||'');
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const region=value=>value==null?null:value;
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);

export async function compareBindings(document,logs,overrideData,resolveExpected){
 const result={checked:[],mismatches:[],notbuilt:[],skipped:[],warnings:[],overridesApplied:[],coverage:{acceptedLogs:0,imageActions:0,skinActions:0,missingImageSourcePaths:0}};
 const screens=new Map((document.screens||[]).map(s=>[s.id,s]));
 const allElements=new Map((document.screens||[]).flatMap(s=>(s.elements||[]).map(e=>[e.id,{screen:s,element:e}])));
 const overrides=new Map(),usedOverrides=new Set(),expectations=new Map();
 for(const o of overrideData.overrides||[]){
  if(!o||typeof o.elementId!=='string'||!o.elementId||typeof o.path!=='string'||!o.path.trim()||o.region!=null&&(!Array.isArray(o.region)||o.region.length!==4||!o.region.every(Number.isInteger)||o.region[0]<0||o.region[1]<0||o.region[2]<=0||o.region[3]<=0)){result.mismatches.push({code:'invalid-override',elementId:o?.elementId||null,message:'Override requires elementId, explicit path, and null or valid integer region.'});continue;}
  if(overrides.has(o.elementId)&&!same(overrides.get(o.elementId),o)){result.mismatches.push({code:'conflicting-overrides',elementId:o.elementId});continue;}
  overrides.set(o.elementId,o);
 }
 const check=async(binding)=>{
  const {type,screenId,elementId,origin}=binding;
  const screen=screens.get(screenId),element=screen?.elements?.find(e=>e.id===elementId);
  if(!screen){result.notbuilt.push({...binding,reason:'mapped-screen-not-in-saved-design'});return;}
  if(!familyAllowed(screen.name)){result.mismatches.push({...binding,code:'mapped-screen-not-ACE-family',actualScreenName:screen.name});return;}
  if(!element){
   const other=allElements.get(elementId);
   if(other)result.mismatches.push({...binding,code:'mapped-element-belongs-to-other-screen',actualScreen:other.screen.id});
   else result.notbuilt.push({...binding,reason:'mapped-element-not-in-saved-design'});
   return;
  }
  let expectedPath=binding.path,expectedRegion=region(binding.region),overridden=false;
  const override=type==='image'?overrides.get(elementId):null;
  if(override){expectedPath=override.path;expectedRegion=region(override.region);overridden=true;usedOverrides.add(elementId);}
  if(typeof expectedPath!=='string'||!expectedPath){if(type==='image')result.coverage.missingImageSourcePaths++;result.skipped.push({...binding,reason:type==='image'?'source-path-not-provided':'no-custom-skin-source',requiredExpectationSkipped:type==='image',overridden});return;}
  let expected;
  try{expected=await resolveExpected(expectedPath);}catch(error){result.mismatches.push({...binding,code:'expected-source-error',path:expectedPath,message:error.message});return;}
  if(type==='image'&&expectedRegion!==null&&(!Array.isArray(expectedRegion)||expectedRegion.length!==4||!expectedRegion.every(Number.isInteger)||expectedRegion[0]<0||expectedRegion[1]<0||expectedRegion[2]<=0||expectedRegion[3]<=0||expectedRegion[0]+expectedRegion[2]>expected.width||expectedRegion[1]+expectedRegion[3]>expected.height)){
   result.mismatches.push({...binding,code:'invalid-expected-region',path:expectedPath,expectedRegion,sourceSize:[expected.width,expected.height]});return;
  }
  const actual=type==='image'?{assetRef:element.image?.assetRef||null,region:region(element.image?.region)}:{assetRef:element.skin?.textures?.normal?.assetRef||null};
  const wanted={assetRef:expected.assetRef,...(type==='image'?{region:expectedRegion}:{})};
  const identity=type+':'+elementId,signature=JSON.stringify(wanted),previous=expectations.get(identity);
  if(previous){
   if(previous.signature!==signature)result.mismatches.push({...binding,code:'conflicting-map-expectations',previous:previous.origin,expected:wanted});
   else previous.origins.push(origin);
   return;
  }
  const item={type,screenId,screenName:screen.name,elementId,elementName:element.name||null,origin,origins:[origin],path:expectedPath,expected:wanted,actual,overridden};
  expectations.set(identity,{signature,origin,origins:item.origins});
  if(actual.assetRef!==wanted.assetRef)result.mismatches.push({...item,code:type==='image'?'image-asset-mismatch':'skin-normal-asset-mismatch'});
  if(type==='image'&&!same(actual.region,wanted.region))result.mismatches.push({...item,code:'image-region-mismatch'});
  result.checked.push({...item,match:actual.assetRef===wanted.assetRef&&(type!=='image'||same(actual.region,wanted.region))});
  if(overridden)result.overridesApplied.push({elementId,screenId,path:expectedPath,region:expectedRegion});
 };
 for(const log of logs){
  if(log.readError){result.notbuilt.push({file:log.file,reason:'map-not-readable-yet',message:log.readError});continue;}
  const data=log.data;
  if(!data||Array.isArray(data)||typeof data.family!=='object'||!Array.isArray(data.family?.actions)||!data.map||Array.isArray(data.map)||typeof data.sid!=='string'){
   result.skipped.push({file:log.file,reason:'not-a-family-sid-map-execution-log'});continue;
  }
  if(!familyAllowed(data.family.name)){result.skipped.push({file:log.file,familyName:data.family.name,reason:'not-ACE-family'});continue;}
  result.coverage.acceptedLogs++;
  const saved=screens.get(data.sid);
  if(saved&&saved.name!==data.family.name)result.warnings.push({file:log.file,screenId:data.sid,code:'map-family-name-differs-from-saved-screen',expected:data.family.name,actual:saved.name});
  for(const action of data.family.actions){
   const types=[];if(action?.op==='image')types.push('image');if(action&&Object.hasOwn(action,'skin'))types.push('skin');
   for(const type of types){
    result.coverage[type==='image'?'imageActions':'skinActions']++;
    const id=data.map[action.key],origin={file:log.file,family:data.family.id,familyName:data.family.name,key:action.key,progressIndex:data.i??null};
    if(typeof id!=='string'||!id){result.notbuilt.push({type,origin,screenId:data.sid,reason:'action-has-no-mapped-element-id'});continue;}
    await check({type,screenId:data.sid,elementId:id,origin,path:type==='image'?action.path:action.skin,region:type==='image'?region(action.region):null});
   }
  }
 }
 // Explicit intentional replacements remain testable even if their action was not in a log snapshot.
 for(const [id,o] of overrides){
  if(usedOverrides.has(id))continue;
  const found=allElements.get(id);
  if(!found){result.notbuilt.push({type:'image',elementId:id,reason:'override-element-not-in-saved-design'});continue;}
  await check({type:'image',screenId:found.screen.id,elementId:id,origin:{file:'image-expectation-overrides.json',key:'override-only'},path:o.path,region:region(o.region)});
 }
 return result;
}
export function bindingStatus(result){
 if(result.mismatches.length)return 'expected-binding-mismatches';
 if(result.notbuilt.length)return 'partial-notbuilt-diagnostic-only';
 if(result.coverage.missingImageSourcePaths)return 'partial-expectations-skipped-diagnostic-only';
 if(!result.coverage.acceptedLogs||!result.checked.length)return 'no-built-expectations-diagnostic-only';
 return 'mapped-bindings-match-ui-verification-still-pending';
}
async function exact(path,expected){
 if(resolve(path)!==expected)throw Error('Only this exact path is allowed: '+expected);
 const info=await lstat(path);if(info.isSymbolicLink()||await realpath(path)!==expected)throw Error('Symlink or moved path is not allowed: '+path);
 return path;
}
async function run(designPath,mapDirectory,overridePath){
 await exact(designPath,DESIGN);await exact(mapDirectory,MAPS);await exact(overridePath,OVERRIDES);
 const designBytes=await readFile(designPath),document=JSON.parse(designBytes.toString('utf8'));
 if(document.projectId!=='ux-96eff1ad')throw Error('Wrong saved design projectId');
 const overrideBytes=await readFile(overridePath),overrides=JSON.parse(overrideBytes.toString('utf8'));
 if(overrides.kind!=='verification-expectations-not-design'||!Array.isArray(overrides.overrides))throw Error('Unexpected override format');
 const logs=[],logInputs=[];
 for(const name of (await readdir(mapDirectory)).filter(n=>/^acecraft-[A-Za-z0-9_-]+-ui-map\.json$/.test(n)).sort()){
  const path=join(mapDirectory,name);
  try{await exact(path,path);const bytes=await readFile(path);logInputs.push({path,sha256:sha(bytes)});logs.push({file:path,data:JSON.parse(bytes.toString('utf8'))});}
  catch(error){logs.push({file:path,readError:error.message});}
 }
 const sources=new Map();
 const resolveExpected=async url=>{
  if(sources.has(url))return sources.get(url);
  const suffix=url.startsWith(SOURCE_PREFIX)?url.slice(SOURCE_PREFIX.length):'';
  if(!/^(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_-]+\.(?:png|jpg|jpeg|webp)$/.test(suffix))throw Error('Expected source must be an explicit ACE staging raster path: '+url);
  const path=join(ROOT,'src/tools/uxStudio/assets/import-staging/acecraft-20261120',suffix);await exact(path,path);
  const bytes=await readFile(path),ext=suffix.split('.').pop().toLowerCase(),mime=ext==='png'?'image/png':ext==='webp'?'image/webp':'image/jpeg';
  const asset=inspectAsset(bytes,mime);const item={...asset,path,sha256:sha(bytes)};sources.set(url,item);return item;
 };
 const before=sha(designBytes),inMemory=JSON.stringify(document),result=await compareBindings(document,logs,overrides,resolveExpected);
 assert.equal(JSON.stringify(document),inMemory,'Audit must never mutate the in-memory design');
 const after=sha(await readFile(designPath));if(before!==after)result.warnings.push({code:'concurrent-save-during-audit',message:'Saved design changed during read-only audit; rerun after normal UI save settles.'});
 const counts={mapFiles:logs.length,bindingsChecked:result.checked.length,imageBindings:result.checked.filter(x=>x.type==='image').length,skinBindings:result.checked.filter(x=>x.type==='skin').length,mismatches:result.mismatches.length,notbuilt:result.notbuilt.length,skipped:result.skipped.length,intentionalOverrides:result.overridesApplied.length};
 return {kind:'acecraft-readonly-expected-image-audit',status:bindingStatus(result),at:new Date().toISOString(),target:{design:designPath,projectId:document.projectId,revision:document.revision,mapDirectory,overrides:overridePath,overrideRevision:overrides.revision??null},counts,readOnly:{writes:0,apiCalls:0,sha256Before:before,sha256After:after,sameSnapshot:before===after},inputs:{logs:logInputs,overrideSha256:sha(overrideBytes)},...result,expectedSources:[...sources].map(([url,asset])=>({url,...asset})),limitations:['Logs are normal UI execution records, not design JSON. No log or override is injected, applied, or saved.','Missing mapped elements/screens/actions are notbuilt, malformed/non-ACE records are skipped, and missing explicit source paths are skipped with reasons.','Override entries take precedence over original action path/region. No region means null, including full-scene images.','Image assetRef and atlas region are semantic expectations; an in-bounds wrong cell is reported as a mismatch.','Custom skin check is normal texture assetRef on the mapped element itself. Built-in/no-source skins are skipped.','No live browser, visual equivalence, input, image HTTP or async UI timing test was performed. This does not run product npm tests.']};
}
async function selfTest(){
 const doc=(image={assetRef:'old',region:[0,0,64,64]})=>({projectId:'ux-96eff1ad',screens:[{id:'s',name:'Page_ACE_Test',elements:[{id:'e',name:'Image',image,skin:{textures:{normal:{assetRef:'skin'}}}}]}]});
 const log=(action={key:'Icon',op:'image',path:'/old.png',region:[64,0,64,64]},map={Icon:'e'},name='Page_ACE_Test')=>[{file:'fixture-log',data:{family:{id:'ACE_TEST',name,actions:[action]},sid:'s',map}}];
 const resolver=async path=>({assetRef:path==='/new.png'?'new':path==='/skin.png'?'skin':'old',width:256,height:256});
 let r=await compareBindings(doc(),log(),{overrides:[]},resolver);assert(r.mismatches.some(x=>x.code==='image-region-mismatch'));
 r=await compareBindings(doc(),log({key:'Scene',op:'image',path:'/old.png'},{Scene:'e'}),{overrides:[]},resolver);assert(r.mismatches.some(x=>x.code==='image-region-mismatch'&&x.expected.region===null));
 r=await compareBindings(doc({assetRef:'new',region:[150,0,64,64]}),log(),{overrides:[{elementId:'e',path:'/new.png',region:[150,0,64,64]}]},resolver);assert.equal(r.mismatches.length,0);assert.equal(r.overridesApplied.length,1);
 r=await compareBindings(doc(),log({key:'Frame',op:'panel',skin:'/skin.png'},{Frame:'e'}),{overrides:[]},resolver);assert.equal(r.checked[0].type,'skin');assert.equal(r.mismatches.length,0);
 r=await compareBindings(doc(),log(undefined,{}),{overrides:[]},resolver);assert.equal(r.notbuilt.length,1);
 let calls=0;r=await compareBindings(doc(),log(undefined,undefined,'Page_OTHER_Game'),{overrides:[]},async()=>{calls++;return {};});assert.equal(calls,0);assert.equal(r.skipped[0].reason,'not-ACE-family');
 r=await compareBindings(doc(),log({key:'Icon',op:'image'},{Icon:'e'}),{overrides:[]},resolver);assert.equal(r.skipped[0].reason,'source-path-not-provided');
 r=await compareBindings(doc({assetRef:'new'}),[],{overrides:[{elementId:'e',path:'/new.png'}]},resolver);assert.equal(r.checked.length,1);assert.equal(r.mismatches.length,0);
 assert.equal(bindingStatus({checked:[],mismatches:[],notbuilt:[],skipped:[],coverage:{acceptedLogs:0,missingImageSourcePaths:0}}),'no-built-expectations-diagnostic-only');
 const invalid=await compareBindings(doc(),log({key:'Icon',op:'image',path:'/old.png',region:[0,0,64,64]}),{overrides:[{elementId:'e'}]},resolver);assert(invalid.mismatches.some(x=>x.code==='invalid-override'),'invalid override must not suppress valid action path');
 const wrongScreen=doc();wrongScreen.screens[0].name='Page_OTHER_Game';r=await compareBindings(wrongScreen,log(),{overrides:[]},resolver);assert(r.mismatches.some(x=>x.code==='mapped-screen-not-ACE-family'),'an accepted ACE log must not silently skip a wrong saved screen');
 const original=doc(),originalLogs=log(),snapshot=JSON.stringify([original,originalLogs]);await compareBindings(original,originalLogs,{overrides:[]},resolver);assert.equal(JSON.stringify([original,originalLogs]),snapshot);
 r=await compareBindings(doc(),[{file:'partial',data:{kind:'other'}}],{overrides:[]},resolver);assert.equal(r.skipped.length,1);
 console.log(JSON.stringify({kind:'expected-image-script-self-test-only',checks:13,result:'passed',realDesignRead:false,uiVerified:false}));
}
const command=`node ${fileURLToPath(import.meta.url)} --design ${DESIGN} --maps-dir ${MAPS} --overrides ${OVERRIDES}`;
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const a=process.argv.slice(2);
  if(a.length===1&&a[0]==='--self-test')await selfTest();
  else if(a.length===1&&a[0]==='--help')console.log(JSON.stringify({kind:'expected-image-audit-help',command,output:'stdout JSON only; explicit shell redirection may save a report; the script writes no file',exitCodes:{0:'mapped bindings matched; browser verification pending',1:'binding/expectation mismatch',2:'invalid arguments or audit setup',3:'partial/zero coverage diagnostic'}}));
  else{if(a.length!==6||a[0]!=='--design'||a[2]!=='--maps-dir'||a[4]!=='--overrides')throw Error(command);const report=await run(a[1],a[3],a[5]);console.log(JSON.stringify(report,null,2));if(report.mismatches.length)process.exitCode=1;else if(report.status.endsWith('diagnostic-only'))process.exitCode=3;}
 }catch(error){console.log(JSON.stringify({kind:'acecraft-expected-image-audit-error',message:error.message}));process.exitCode=2;}
}
