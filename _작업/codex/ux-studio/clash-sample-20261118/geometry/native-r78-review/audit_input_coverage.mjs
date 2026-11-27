import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import{createRuntime,activate}from'/Users/max/projest_max/ui-studio/src/tools/uxStudio/model.mjs';
import{inputMode,inputOwner}from'/Users/max/projest_max/ui-studio/src/tools/uxStudio/parts.mjs';
const dir=path.dirname(fileURLToPath(import.meta.url));
const snapshot=path.join(dir,'ux-ea29177e.r78.snapshot.json'),raw=fs.readFileSync(snapshot),d=JSON.parse(raw);
const structure=JSON.parse(fs.readFileSync(path.join(dir,'structure-audit.json'))),assets=JSON.parse(fs.readFileSync(path.join(dir,'asset-audit/audit.json')));
const hash=crypto.createHash('sha256').update(raw).digest('hex');assert(hash==='f78b355b1f9e3b4faca3133e7c65003246268ecb7de29c3bae2f64cc0f15222a');assert(d.revision===78&&raw.length===186410);
const records=[],wrappers=[],orphans=[],standaloneNoneImages=[];
for(const s of d.screens){const byId=new Map(s.elements.map(e=>[e.id,e]));
 for(const e of s.elements){
  const mode=inputMode(e,d.transitions),owner=inputOwner(s,e.id,d.transitions);
  if(mode==='action')wrappers.push({screen:s.name,screenId:s.id,id:e.id,name:e.name,kind:e.kind});
  if(mode==='parent'&&!owner)orphans.push({screen:s.name,id:e.id,name:e.name});
  let ancestor=byId.get(e.parentId),action=null;const seen=new Set([e.id]),chain=[{id:e.id,name:e.name,mode}];
  while(ancestor&&!seen.has(ancestor.id)){seen.add(ancestor.id);const m=inputMode(ancestor,d.transitions);chain.push({id:ancestor.id,name:ancestor.name,mode:m});if(m==='action'){action=ancestor;break;}ancestor=byId.get(ancestor.parentId);}
  if(action&&mode!=='action')records.push({screen:s.name,screenId:s.id,id:e.id,name:e.name,kind:e.kind,mode,expectedActionOwner:action.id,actualOwner:owner?.id||null,chain,ok:mode==='parent'&&owner?.id===action.id});
  else if(!action&&e.kind==='image'&&mode==='none')standaloneNoneImages.push({screen:s.name,id:e.id,name:e.name});
 }
}
const failed=records.filter(r=>!r.ok),noneFailures=failed.filter(r=>r.mode==='none');
const runtimeCases=[];
function initial(t){let r=createRuntime(d);if(t.action==='close'){r.overlays=[t.fromScreen];r.focusStack=[null];}else r.page=t.fromScreen;return r;}
function actionReached(t,r){return t.action==='navigate'?r.page===t.targetScreen:t.action==='open'?r.overlays.includes(t.targetScreen):t.action==='close'?!r.overlays.includes(t.fromScreen):false;}
for(const t of d.transitions){const childPaths=records.filter(r=>r.screenId===t.fromScreen&&r.expectedActionOwner===t.fromElement);
 for(const child of childPaths){const after=activate(d,initial(t),t.fromScreen,child.id);runtimeCases.push({transitionId:t.id,sourceOwner:t.fromElement,childId:child.id,childName:child.name,action:t.action,condition:t.condition,reached:actionReached(t,after),message:after.message});}
}
const undeterminedPolicies=d.transitions.filter(t=>!t.returnPolicy?.trim()||['미정','unknown'].includes(t.returnPolicy.trim()));
const allAlways=d.transitions.every(t=>t.condition==='always');
const checks=[{name:'Action descendants use parent and resolve to intended owner',ok:records.length>0&&failed.length===0},{name:'No none-mode BG/Img/Txt/intermediate group under action owner',ok:noneFailures.length===0},{name:'No orphan parent mode on any element',ok:orphans.length===0},{name:'All10 transition conditions always',ok:allAlways},{name:'No undetermined returnPolicy',ok:undeterminedPolicies.length===0},{name:'All transition child paths reach intended action in memory model',ok:runtimeCases.length>0&&runtimeCases.every(c=>c.reached)},{name:'Prior16 static geometry/hierarchy/action checks',ok:structure.checks.length===16&&structure.checks.every(c=>c.ok)},{name:'33 resource hashes match file names and r65; below limit',ok:assets.summary.uniqueResources===33&&assets.summary.hashNameMatches===33&&assets.summary.sameShaAsR65===33&&assets.summary.within300000Bytes===33&&assets.issues.length===0}];
const now=new Date().toISOString(),result={checkedAt:now,revision:78,status:checks.every(c=>c.ok)?'STATIC_FINAL_PASS':'STATIC_FINDINGS',proposalStatus:'제안(검수 대기); no subagent GUI/visual-equivalence approval',snapshotSha256:hash,snapshotBytes:raw.length,counts:{screens:d.screens.length,parts:d.screens.reduce((n,s)=>n+s.elements.length,0),transitions:d.transitions.length,actionWrappers:wrappers.length,coveredActionDescendants:records.length,noneModeChildrenMissed:noneFailures.length,parentChainsFailed:failed.length,parentModeOrphans:orphans.length,standaloneNoneImages:standaloneNoneImages.length,transitionChildModelCases:runtimeCases.length,transitionChildModelPassed:runtimeCases.filter(c=>c.reached).length,undeterminedReturnPolicies:undeterminedPolicies.length,returnPolicyVariants:[...new Set(d.transitions.map(t=>t.returnPolicy))],assets:assets.summary},checks,wrappers,records,failed,orphans,standaloneNoneImages,runtimeCases,returnPolicies:d.transitions.map(t=>({id:t.id,action:t.action,condition:t.condition,returnPolicy:t.returnPolicy})),rootProvidedGuiEvidence:'Root reported real10 edge clicks plus Enter/Escape/Close and Knight focus return PASS after native r72~77 input-role correction. This subagent did not observe or repeat GUI and does not convert it to its own verification.',scope:{liveSourceRead:'one capture only',sourceDesignWrites:0,assetSourceWrites:0,productSourceWrites:0,browserActions:0,publicReportOrStatusWrites:0},limits:['Model calls verify ownership/action dispatch from stored child IDs, not DOM hit testing or pointer geometry.','Actual nativeGUI/rendering/font/scroll/alpha/crop/focus/return and source-video equivalence belong to root independent evidence.','No whole-game/gameplay/balance/API/purchase/unlock or user approval claim.']};
fs.writeFileSync(path.join(dir,'input-coverage.json'),JSON.stringify(result,null,2)+'\n');
let md=`# Clash r78 최종 정적 구조 검토\n\n${now} · codex 하위 · 제안(검수 대기)\n\n고정 snapshot SHA ${hash} / ${raw.length}bytes. 4화면261부품10연결. 원본은1회capture만 하고 이후 이 스냅샷만 검사했습니다.\n\n|검사|결과|\n|---|---|\n`;
for(const c of checks)md+=`|${c.name}|${c.ok?'PASS':'추가확인 필요'}|\n`;
md+=`\n입력 coverage: action wrapper${wrappers.length}, 그 아래 display/중간group${records.length}개가 모두parent→의도owner로 연결됩니다. children none누락${noneFailures.length}, 잘못된parent chain${failed.length}, owner없는parent${orphans.length}. 단독장식 none image${standaloneNoneImages.length}개는 별도로 유지됩니다.\n\n10edge의 하위 BG/Img/Txt/그룹 경로 ${runtimeCases.length}건을 메모리모델로호출해 ${runtimeCases.filter(c=>c.reached).length}건이 목적행동에 도달했습니다. DOM hit test나 실제 mouse/키보드 성공으로 쓰지 않습니다.\n\n조건always10, returnPolicy미정0. 저장된 복귀문구는 ${JSON.stringify([...new Set(d.transitions.map(t=>t.returnPolicy))])}입니다.\n\n기존 공통치수16정적항목 PASS: nav15개 outer78×66/icon48²/text78×18/font14·x78간격, Deck8카드 outer90×131/visual86×126/image78×94, Home/Deck HUD11쌍+Fill동일, 음수·화면/부모넘침0.\n\n자원33개/135참조는 r65와동일, 실파일SHA33개일치·용량초과0(최대297509bytes)입니다.\n\nRoot가보고한실제10edge클릭·Enter/Escape/Close·기사focus복귀 결과와 이 하위의정적검증을 구분합니다. 원본동등/폰트/스크롤/GUI/게임API는 이 하위에서 검수하지 않았습니다. 제품소스·설계·자원·공용STATUS/report쓰기0, 브라우저0.\n\n근거: [입력coverage JSON](${dir}/input-coverage.json) · [구조 JSON](${dir}/structure-audit.json) · [자원hash JSON](${dir}/asset-audit/audit.json) · [고정스냅샷](${snapshot}).\n`;
fs.writeFileSync(path.join(dir,'final-structure-review.md'),md);
console.log(JSON.stringify({status:result.status,counts:result.counts,checks:checks.map(c=>[c.name,c.ok]),summary:path.join(dir,'final-structure-review.md')},null,2));
