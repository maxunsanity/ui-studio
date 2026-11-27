import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import {validateDocument,audit} from '../../../../../src/tools/uxStudio/model.mjs';
const root='/Users/max/projest_max/ui-studio/samples/wild-castle',work=root+'/_작업/codex/video01',evidence=root+'/docs/evidence/20261119-wild-castle';
const d=JSON.parse(readFileSync(root+'/ui-studio/designs/ux-957138c6.json')),assets=JSON.parse(readFileSync(work+'/assets.json'));validateDocument(d);
const assert=(ok,msg)=>{if(!ok)throw Error(msg)},sha=b=>createHash('sha256').update(b).digest('hex');
assert(d.revision===93,'revision');assert(d.screens.length===7,'screens');assert(d.transitions.length===15,'edges');
const known=new Map(assets.map(a=>['sha256-'+a.sha256+'.webp',a])),refs=new Set();const scan=x=>{if(Array.isArray(x))x.forEach(scan);else if(x&&typeof x==='object'){if(x.assetRef)refs.add(x.assetRef);Object.values(x).forEach(scan)}};scan(d);
for(const a of assets){const bytes=readFileSync(a.path);assert(bytes.length<=300000,'asset limit '+a.role);assert(sha(bytes)===a.sha256,'production SHA '+a.role);}
for(const ref of refs){assert(known.has(ref),'unknown asset '+ref);assert(sha(readFileSync(root+'/ui-studio/assets/'+ref))===known.get(ref).sha256,'native SHA '+ref);}
let pairs=0;for(const s of d.screens){assert(s.logicalSize.w===390&&s.logicalSize.h===780,'logical size');const f=s.elements.find(e=>e.name==='Group_WC_FixedGameViewport');assert(f?.rectTransform?.sizeDelta[0]===390&&f.rectTransform.sizeDelta[1]===780,'fixed frame');for(const e of s.elements){const b=e.buttonState;if(b?.enabled&&b.mode==='image'){assert(b.images.normal&&b.images.pressed,'pair missing '+e.name);assert(isDeepStrictEqual(b.images.normal.sourceSize,b.images.pressed.sourceSize),'pair canvas '+e.name);assert(b.images.normal.assetRef!==b.images.pressed.assetRef,'pair SHA '+e.name);pairs++;}}}
for(const s of d.screens.filter(s=>['Page_WC_Lobby','Page_WC_Lobby_HighLevel'].includes(s.name))){for(const [key,x,w]of [['Shop',20,80],['Village',104,80],['Replay',188,80],['Fight',272,98]]){const e=s.elements.find(e=>e.name==='Btn_WC_Lobby_'+key||e.name==='Btn_WC_Lobby_'+key+' 복사');const r=[e.x*3.9,e.y*7.8,e.w*3.9,e.h*7.8];assert(r.every((n,i)=>Math.abs(n-[x,720,w,60][i])<.05),'footer token '+key);}}
assert(isDeepStrictEqual(JSON.parse(readFileSync(evidence+'/exports/r93-design.json')),d),'export differs');
const log=JSON.parse(readFileSync(evidence+'/flow-checks.json'));assert(log.every(x=>x.pass),'flow failure');const byId=new Map(d.screens.flatMap(s=>s.elements.map(e=>[e.id,e.name])));const covered=d.transitions.filter(t=>log.some(c=>c.pass&&c.action===byId.get(t.fromElement)));assert(covered.length===15,'uncovered native edges '+covered.length);
const notes=audit(d),missingActions=notes.filter(n=>n.text.endsWith('의 행동이 없습니다.')).length,missingEntry=notes.filter(n=>n.text.endsWith('에 진입 연결이 없습니다.')).length;
assert(missingActions===96&&missingEntry===1&&notes.length===97,'unexpected audit categories');
const result={revision:d.revision,validated:true,screens:d.screens.map(s=>({name:s.name,parts:s.elements.length})),parts:d.screens.reduce((n,s)=>n+s.elements.length,0),transitions:d.transitions.length,distinctTransitionsObserved:covered.length,productionRoles:assets.length,activeAssetRefs:refs.size,maxProductionBytes:Math.max(...assets.map(x=>x.bytes)),normalPressedPairs:pairs,designBytes:readFileSync(root+'/ui-studio/designs/ux-957138c6.json').length,exportDeepEqual:true,expectedAudit:{total:notes.length,pressOnlyMissingAction:missingActions,directHighLevelState:missingEntry},notes};
writeFileSync(evidence+'/saved-model-audit.json',JSON.stringify(result,null,2));console.log(JSON.stringify({...result,notes:undefined}));
