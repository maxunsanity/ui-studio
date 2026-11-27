#!/usr/bin/env node
// Read-only ACE copied header/footer audit. Run only after root announces the final saved revision.
// No writes, save APIs, servers, model mutation or UI/browser calls.
import {readFile,readdir,lstat,realpath} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {validateDocument,resolveRect} from '../../../../src/tools/uxStudio/model.mjs';
import {inspectAsset} from '../../../../src/tools/uxStudio/asset-store.mjs';
const ROOT='/Users/max/projest_max/ui-studio',MAPS='/Users/max/Documents/Codex/2026-11-11/new-chat';
const DESIGN=join(ROOT,'samples/acecraft/ui-studio/designs/ux-96eff1ad.json');
const sha=b=>createHash('sha256').update(b).digest('hex');
const errors=[],checked=[],intentional=[],notbuilt=[];
const emit=(scope,role,code,expected,actual)=>errors.push({scope,role,code,expected,actual});
const eq=(scope,role,code,a,b)=>{if(JSON.stringify(a)!==JSON.stringify(b))emit(scope,role,code,a,b);};
async function bytes(path){if(resolve(path)!==path||await realpath(path)!==path||(await lstat(path)).isSymbolicLink())throw Error('Moved/symlink path rejected: '+path);return readFile(path);}
const json=async path=>JSON.parse((await bytes(path)).toString('utf8'));
const aliases=async file=>json(join(MAPS,file));
const sourceCache=new Map();
async function expectedImage(path){
 const prefix='/ui-studio/source/assets/import-staging/acecraft-20261120/';
 if(!path.startsWith(prefix)||path.slice(prefix.length).includes('/'))throw Error('Unexpected ACE raw asset path: '+path);
 if(!sourceCache.has(path)){const b=await bytes(join(ROOT,'src/tools/uxStudio',path.slice('/ui-studio/source/'.length)));sourceCache.set(path,inspectAsset(b,path.endsWith('.png')?'image/png':path.endsWith('.webp')?'image/webp':'image/jpeg'));}
 return sourceCache.get(path);
}
function rect(scope,role,expected,actual){for(const k of ['x','y','w','h'])if(!Number.isFinite(actual?.[k])||Math.abs(expected[k]-actual[k])>.25){emit(scope,role,'world-rect',expected,actual);break;}}
function descendants(screen,root){const result=new Set([root]);let n;do{n=result.size;for(const e of screen.elements)if(result.has(e.parentId))result.add(e.id);}while(n!==result.size);return result;}
function index(screen){return new Map(screen.elements.map(e=>[e.id,e]));}
function getScreen(doc,sid,label){const s=doc.screens.find(s=>s.id===sid);if(!s||!/^(?:Page|Modal)_ACE_/.test(s.name)){notbuilt.push({label,sid});return null;}return s;}
async function actionCheck(screen,e,a,parent,scope){
 if(!e){emit(scope,a.key,'missing-element',true,null);return;}
 const kind={plain:'panel',panel:'panel',image:'image',text:'text'}[a.op];
 eq(scope,a.key,'kind',kind,e.kind);rect(scope,a.key,a.rect,resolveRect(screen,e.id,420,924));
 if(parent!==undefined)eq(scope,a.key,'parent',parent,e.parentId||null);
 if(a.op==='text'){eq(scope,a.key,'text',a.text,e.text);eq(scope,a.key,'fontSize',a.size,e.fontSize);eq(scope,a.key,'fontWeight',a.weight,e.typography?.weight);eq(scope,a.key,'textColor',a.color.toLowerCase(),e.appearance?.textColor?.toLowerCase());eq(scope,a.key,'align',a.align,e.typography?.align);}
 if(a.path){const asset=await expectedImage(a.path);eq(scope,a.key,'image-assetRef',asset.assetRef,e.image?.assetRef||null);eq(scope,a.key,'image-region',a.region||null,e.image?.region||null);if(a.fit)eq(scope,a.key,'image-fit',a.fit,e.image?.fit);}
 if(a.skin){const asset=await expectedImage(a.skin);eq(scope,a.key,'skin-assetRef',asset.assetRef,e.skin?.textures?.normal?.assetRef||null);eq(scope,a.key,'skin-mode','3',String(e.skin?.mode));eq(scope,a.key,'skin-slices',a.skinMetrics,e.skin?.slices);eq(scope,a.key,'skin-edges',a.skinMetrics,e.skin?.edges);eq(scope,a.key,'skin-padding',[0,0,0,0],e.skin?.padding);}
 eq(scope,a.key,'display-input-mode','none',e.interaction?.mode||'none');
 if(e.buttonState?.enabled)emit(scope,a.key,'display-has-buttonState',false,true);
 checked.push({scope,role:a.key,id:e.id});
}
function tintCheck(screen,e,parent,scope){
 if(!e){emit(scope,'Tint','missing-element',true,null);return;}
 eq(scope,'Tint','kind','panel',e.kind);eq(scope,'Tint','parent',parent,e.parentId||null);
 rect(scope,'Tint',{x:0,y:43,w:420,h:52},resolveRect(screen,e.id,420,924));
 eq(scope,'Tint','transparent-opacity',0,e.appearance?.opacity);
 eq(scope,'Tint','display-input-mode','none',e.interaction?.mode||'none');checked.push({scope,role:'Tint',id:e.id});
}
function copyRoles(log,nameToRole){
 if(!Array.isArray(log.parts)||log.parts.length!==21)throw Error('Header creation log must contain 21 parts');
 const roles={};for(const p of log.parts){const name=p.name.replace(/ 복사$/,'');const role=nameToRole.get(name);if(!role||roles[role])throw Error('Unknown/duplicate copied header role: '+p.name);roles[role]=p.id;}return roles;
}
async function headers(doc){
 const patch=await aliases('acecraft-ACE_ShopCurrencyPatch-ui-map.json');
 if(patch.family?.id!=='ACE_ShopCurrencyPatch'||patch.family.actions?.length!==20)throw Error('Unexpected exact ShopCurrencyPatch contract');
 const s=getScreen(doc,patch.sid,'source header');if(!s)return;
 const es=index(s),header=patch.map.CurrencyHeader,sourceParts=descendants(s,header);
 const mapped=new Set(patch.family.actions.map(a=>patch.map[a.key])),extras=[...sourceParts].filter(id=>!mapped.has(id));
 eq('source-header','subtree','part-count',21,sourceParts.size);
 if(extras.length!==1||es.get(extras[0])?.name!=='Frame_ACE10L_CurrencyHeader_Tint')throw Error('Expected exactly the unmapped native transparent Tint child');
 const nameToRole=new Map(patch.family.actions.map(a=>[a.name,a.key]));nameToRole.set(es.get(extras[0]).name,'Tint');
 for(const a of patch.family.actions)await actionCheck(s,es.get(patch.map[a.key]),a,patch.map[a.parent], 'source-header');
 tintCheck(s,es.get(extras[0]),header,'source-header');
 const files=(await readdir(MAPS)).filter(n=>/^acecraft-ACE(?:10C|14T|15P|15M)-header-ui-map\.json$/.test(n));
 for(const family of ['ACE10C','ACE14T','ACE15P','ACE15M']){
  const filename='acecraft-'+family+'-header-ui-map.json';if(!files.includes(filename)){notbuilt.push({label:filename});continue;}
  const log=await aliases(filename),screen=getScreen(doc,log.sid,filename);if(!screen)continue;
  const actual=index(screen),roles=copyRoles(log,nameToRole),scope='copy-header/'+family;
  const primary=await aliases('acecraft-'+family+'-ui-map.json');if(primary.sid!==screen.id)throw Error('Header target primary alias sid differs');
  const externalParent=actual.get(roles.CurrencyHeader)?.parentId;if(externalParent&&externalParent!==primary.map.root)emit(scope,'CurrencyHeader','external-parent',[null,primary.map.root],externalParent);
  const recipe=structuredClone(patch.family.actions),remove=new Set();
  if(family==='ACE14T'){
   for(const a of recipe)if(/^(Cash|RecruitTicket|PowerCube)/.test(a.key))remove.add(a.key);
   for(const a of recipe){if(a.key.startsWith('Gem'))a.rect.x+=204;if(a.key.startsWith('EventToken'))a.rect.x-=102;if(a.key==='GemValue')a.text='1239';if(a.key==='EventTokenValue')a.text='148.6K';if(a.key==='EventTokenGlyph')a.region=[0,0,64,64];}
   intentional.push({scope,remove:[...remove],keptParts:10,changes:'EventToken x209 / Gem x311; values148.6K/1239; EventTokenGlyph=goldcoin[0,0,64,64]'});
  }
  if(family==='ACE15P'||family==='ACE15M')for(const a of recipe){if(a.key==='CashValue')a.text='6514';if(a.key==='GemValue')a.text=family==='ACE15P'?'1239':'1339';if(family==='ACE15M'&&a.key==='EventTokenValue')a.text='6';}
  if(family==='ACE15P'||family==='ACE15M')intentional.push({scope,changes:family==='ACE15P'?'Cash6514/Gem1239':'Cash6514/Gem1339/Event6'});
  for(const role of remove)if(actual.has(roles[role]))emit(scope,role,'intentionally-deleted-part-still-exists',false,true);
  for(const a of recipe){if(remove.has(a.key))continue;await actionCheck(screen,actual.get(roles[a.key]),a,a.key==='CurrencyHeader'?undefined:roles[a.parent],scope);}
  tintCheck(screen,actual.get(roles.Tint),roles.CurrencyHeader,scope);
  const expected=new Set(Object.entries(roles).filter(([role])=>!remove.has(role)).map(([,id])=>id));
  const subtree=descendants(screen,roles.CurrencyHeader);eq(scope,'subtree','part-count',family==='ACE14T'?10:21,subtree.size);
  eq(scope,'subtree','exact-member-IDs',[...expected].sort(),[...subtree].sort());
  if(family==='ACE14T')eq(scope,'EventTokenGlyph','intentional-name','Img_ACE14T_TempusCurrencyGlyph',actual.get(roles.EventTokenGlyph)?.name);
 }
}
async function footer(doc){
 const hm=await aliases('acecraft-honk-ui-map.json'),nav=await aliases('acecraft-global-navigation-ui-map.json'),copy=await aliases('acecraft-pilot-footer-ui-map.json');
 if(hm.family?.name!=='Page_ACE_HonkDepot'||nav.sid!==hm.sid||!Array.isArray(copy.parts)||copy.parts.length!==16)throw Error('Unexpected exact footer alias contract');
 const source=getScreen(doc,hm.sid,'Honk footer source'),target=getScreen(doc,copy.sid,'Pilot footer');if(!source||!target)return;
 const se=index(source),te=index(target),ids=descendants(source,nav.groupId),sourceByName=new Map([...ids].map(id=>[se.get(id)?.name,se.get(id)]));
 eq('source-footer','subtree','part-count',16,ids.size);
 const remap=new Map();
 for(const part of copy.parts){const original=sourceByName.get(part.name.replace(/ 복사$/,''));if(!original)throw Error('Unmatched copied footer name: '+part.name);remap.set(original.id,part.id);}
 const targetRoot=remap.get(nav.groupId);if(!targetRoot)throw Error('Pilot footer root mapping missing');
 const pilot=await aliases('acecraft-ACE02-ui-map.json');if(pilot.sid!==target.id)throw Error('Pilot primary alias sid differs');
 const externalParent=te.get(targetRoot)?.parentId;if(externalParent&&externalParent!==pilot.map.root)emit('copy-footer/Pilot','root','external-parent',[null,pilot.map.root],externalParent);
 rect('source-footer','root',nav.rect,resolveRect(source,nav.groupId,420,924));
 for(const sid of ids){
  const a=se.get(sid),e=te.get(remap.get(sid)),role=a.name,scope='copy-footer/Pilot';
  if(!e){emit(scope,role,'missing-element',true,null);continue;}
  eq(scope,role,'kind',a.kind,e.kind);eq(scope,role,'isGroup',Boolean(a.isGroup),Boolean(e.isGroup));
  rect(scope,role,resolveRect(source,sid,420,924),resolveRect(target,e.id,420,924));
  if(sid!==nav.groupId)eq(scope,role,'parent',remap.get(a.parentId),e.parentId||null);
  eq(scope,role,'input-mode',a.interaction?.mode||'none',e.interaction?.mode||'none');
  eq(scope,role,'buttonState-enabled',Boolean(a.buttonState?.enabled),Boolean(e.buttonState?.enabled));
  if(a.image){eq(scope,role,'image-assetRef',a.image.assetRef||null,e.image?.assetRef||null);eq(scope,role,'image-region',a.image.region||null,e.image?.region||null);}
  if(a.skin){eq(scope,role,'skin-assetRef',a.skin.textures?.normal?.assetRef||null,e.skin?.textures?.normal?.assetRef||null);eq(scope,role,'skin-slices',a.skin.slices,e.skin?.slices);eq(scope,role,'skin-edges',a.skin.edges,e.skin?.edges);}
  checked.push({scope,role,id:e.id});
 }
 // Validate source hashes/regions independently, so a matching wrong source/copy cell cannot pass.
 for(const a of hm.family.actions.filter(a=>a.key.startsWith('GlobalNav'))){
  const sourceElement=se.get(hm.map[a.key]),targetElement=te.get(remap.get(hm.map[a.key]));if(!sourceElement||!targetElement)continue;
  if(a.rect)rect('source-footer',a.key,a.rect,resolveRect(source,sourceElement.id,420,924));
  for(const [scope,e]of [['source-footer',sourceElement],['copy-footer/Pilot',targetElement]]){
   if(a.path){const info=await expectedImage(a.path);eq(scope,a.key,'raw-image-assetRef',info.assetRef,e.image?.assetRef||null);eq(scope,a.key,'raw-image-region',a.region||null,e.image?.region||null);}
   if(a.skin){const info=await expectedImage(a.skin);eq(scope,a.key,'raw-skin-assetRef',info.assetRef,e.skin?.textures?.normal?.assetRef||null);}
  }
 }
 const actual=descendants(target,targetRoot);eq('copy-footer/Pilot','subtree','exact-member-IDs',[...remap.values()].sort(),[...actual].sort());
}
async function main(){
 const args=process.argv.slice(2);if(args.includes('--help')){console.log('Read-only final audit: node audit-copied-ui.mjs [--revision N]. No report files are written. Root must announce final save first.');return;}
 const i=args.indexOf('--revision'),revision=i<0?null:Number(args[i+1]);if(args.length&&(i!==0||args.length!==2||!Number.isInteger(revision)))throw Error('Usage: node audit-copied-ui.mjs [--revision N]');
 const raw=await bytes(DESIGN),doc=JSON.parse(raw.toString('utf8'));
 if(doc.projectId!=='ux-96eff1ad'||doc.screens?.length!==20)throw Error('Only the exact final20-board ACE saved design is accepted');
 if(revision!==null&&doc.revision!==revision)throw Error('Saved revision differs from requested revision');
 validateDocument(structuredClone(doc));await headers(doc);await footer(doc);
 const after=sha(await bytes(DESIGN));if(after!==sha(raw))emit('snapshot',null,'concurrent-save',sha(raw),after);
 const report={kind:'read-only-copied-native-ui-audit-not-design',designPath:DESIGN,revision:doc.revision,designSHA256:sha(raw),status:errors.length?'mismatch':notbuilt.length?'partial':'match',errors,notbuilt,intentional,counts:{checkedParts:checked.length,rawAssetSources:sourceCache.size},checked,uiVerified:false,writesPerformed:0};
 console.log(JSON.stringify(report,null,2));process.exitCode=errors.length?1:notbuilt.length?3:0;
}
main().catch(error=>{console.log(JSON.stringify({kind:'read-only-copied-native-ui-audit-not-design',status:'setup-error',error:error.message,writesPerformed:0}));process.exitCode=2;});
