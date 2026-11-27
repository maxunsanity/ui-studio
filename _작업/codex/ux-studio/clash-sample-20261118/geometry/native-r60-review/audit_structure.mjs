import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {validateDocument,resolveRect,createRuntime,activate,MAX_DOCUMENT_BYTES} from '/Users/max/projest_max/ui-studio/src/tools/uxStudio/model.mjs';
import {inputMode,inputOwner} from '/Users/max/projest_max/ui-studio/src/tools/uxStudio/parts.mjs';
const input=process.argv[2];assert(input&&/\.snapshot\.json$/.test(input));
const raw=fs.readFileSync(input),doc=JSON.parse(raw),out=path.dirname(input);
assert([60,65].includes(doc.revision));validateDocument(doc);
const round=n=>Math.round(n*1000000)/1000000;
const R=r=>Object.fromEntries(Object.entries(r).map(([k,v])=>[k,round(v)]));
const same=(a,b,keys=['x','y','w','h'])=>keys.every(k=>Math.abs(a[k]-b[k])<1e-6);
const fileLine=id=>raw.toString().slice(0,raw.toString().indexOf('"id": "'+id+'"')).split('\n').length;
const node=(s,e)=>({screenId:s.id,screen:s.name,id:e.id,name:e.name,parentId:e.parentId||s.id,line:fileLine(e.id),rect:R(resolveRect(s,e.id,390,844)),input:inputMode(e,doc.transitions),ownerId:inputOwner(s,e.id,doc.transitions)?.id||null,anchor:e.rectTransform||null,overflow:e.overflow||null});
const find=(s,n)=>s.elements.find(e=>e.name===n);
const checks=[],check=(name,ok,details)=>checks.push({name,ok,details});
const all=doc.screens.flatMap(s=>s.elements.map(e=>node(s,e)));
const invalid=all.filter(n=>!Object.values(n.rect).every(Number.isFinite)||n.rect.w<=0||n.rect.h<=0);
const negative=all.filter(n=>n.rect.x<-.000001||n.rect.y<-.000001);
const screenOutside=all.filter(n=>n.rect.x<-.001||n.rect.y<-.001||n.rect.x+n.rect.w>390.001||n.rect.y+n.rect.h>844.001);
const parentOutside=[];
for(const s of doc.screens)for(const e of s.elements){if(!e.parentId)continue;const p=s.elements.find(n=>n.id===e.parentId),r=resolveRect(s,e.id,390,844),pr=resolveRect(s,p.id,390,844);if(r.x<pr.x-.001||r.y<pr.y-.001||r.x+r.w>pr.x+pr.w+.001||r.y+r.h>pr.y+pr.h+.001)parentOutside.push({...node(s,e),parentName:p.name,parentRect:R(pr),parentOverflow:p.overflow??'unspecified/visible'});}
check('counts4screens261parts10transitions',doc.screens.length===4&&all.length===261&&doc.transitions.length===10,{screens:doc.screens.length,parts:all.length,transitions:doc.transitions.length});
check('logical390x844AllScreens',doc.screens.every(s=>s.logicalSize.w===390&&s.logicalSize.h===844));
check('modelValidateDocument',true);check('designBytesWithin2MB',raw.length<=MAX_DOCUMENT_BYTES,{bytes:raw.length,limit:MAX_DOCUMENT_BYTES});
check('finitePositiveRects',invalid.length===0,{count:all.length,invalid});check('noNegativeScreenCoordinates',negative.length===0,{negative});check('noScreenOutside',screenOutside.length===0,{screenOutside});
const roles=['Shop','Cards','Battle','Social','Events'],nav=[],navIssues=[];
for(const s of doc.screens){const parent=find(s,'HUD_CR_BottomNavigation');if(!parent)continue;
 for(const [i,role]of roles.entries()){
  const btn=find(s,'Btn_CR_Nav_'+role),bg=find(s,'BG_CR_Nav_'+role),img=find(s,'Img_CR_Nav_'+role),txt=find(s,'Txt_CR_Nav_'+role);assert(btn&&bg&&img&&txt);
  const br=resolveRect(s,btn.id,390,844),gr=resolveRect(s,bg.id,390,844),ir=resolveRect(s,img.id,390,844),tr=resolveRect(s,txt.id,390,844);
  const result={screen:s.name,role,button:node(s,btn),background:node(s,bg),image:node(s,img),text:node(s,txt),font:{size:txt.fontSize,...txt.typography},selectedStored:btn.buttonState?.selected??null};
  const ok=same(br,{x:i*78,y:778,w:78,h:66})&&same(gr,br)&&same(ir,{x:i*78+15,y:778,w:48,h:48})&&same(tr,{x:i*78,y:826,w:78,h:18})&&txt.fontSize===14&&txt.typography?.lineHeight===17&&txt.typography?.align==='center'&&btn.parentId===parent.id&&bg.parentId===btn.id&&img.parentId===btn.id&&txt.parentId===btn.id&&inputOwner(s,img.id,doc.transitions)?.id===btn.id;
  result.ok=ok;nav.push(result);if(!ok)navIssues.push(result);
 }
}
check('nav15UnitsCommonGeometryAndHierarchy',nav.length===15&&navIssues.length===0,{units:nav.length,issues:navIssues});
const home=doc.screens.find(s=>s.name==='Page_CR_Home'),deck=doc.screens.find(s=>s.name==='Page_CR_Deck');
const names=['HUD_CR_Resources','BG_CR_HUD_Experience','BG_CR_HUD_Gold','Txt_CR_HUD_Gold','Img_CR_HUD_Gold','BG_CR_HUD_Gems','Txt_CR_HUD_Gems','Img_CR_HUD_Gems','Fill_CR_HUD_Experience','Txt_CR_HUD_Experience','Img_CR_HUD_Experience'];
const hud=names.map(name=>{const h=find(home,name),d=find(deck,name);assert(h&&d);const hn=node(home,h),dn=node(deck,d);return{name,home:hn,deck:dn,rectSame:same(hn.rect,dn.rect),appearanceFillSame:h.appearance?.fill===d.appearance?.fill,skinSame:JSON.stringify(h.skin??null)===JSON.stringify(d.skin??null),fontSame:h.fontSize===d.fontSize&&JSON.stringify(h.typography??null)===JSON.stringify(d.typography??null)};});
check('homeDeckHUDParentAnd10ChildrenPixelMatch',hud.every(h=>h.rectSame),{matched:hud.filter(h=>h.rectSame).length,total:hud.length,mismatches:hud.filter(h=>!h.rectSame)});
check('HUDExperienceFillRectAndMaterialMatch',hud.find(h=>h.name==='Fill_CR_HUD_Experience').rectSame&&hud.find(h=>h.name==='Fill_CR_HUD_Experience').appearanceFillSame&&hud.find(h=>h.name==='Fill_CR_HUD_Experience').skinSame);
const cardNames=['Knight','Archer','Gargoyle','Arrows','Fireball','Giant','Robot','Musketeer'],cards=[];
for(const [i,name]of cardNames.entries()){
 const c=find(deck,'Card_CR_'+name),v=find(deck,'BG_CR_Card_'+name),im=find(deck,'Img_CR_Card_'+name);assert(c&&v&&im);
 const cr=resolveRect(deck,c.id,390,844),vr=resolveRect(deck,v.id,390,844),ir=resolveRect(deck,im.id,390,844);
 const ok=same(cr,{x:7+(i%4)*94,y:205+Math.floor(i/4)*152,w:90,h:131})&&same(vr,{x:cr.x+4,y:cr.y+5,w:86,h:126})&&same(ir,{x:cr.x+8,y:cr.y+9,w:78,h:94})&&v.parentId===c.id&&im.parentId===c.id;
 const expectedRegion=[i%4*150,Math.floor(i/4)*150,150,150];
 cards.push({name,outer:node(deck,c),visual:node(deck,v),image:node(deck,im),imageRegion:im.image?.region,expectedRegion,regionOK:JSON.stringify(im.image?.region)===JSON.stringify(expectedRegion),imageFit:im.image?.fit,ok});
}
check('deck8CardsCommonOuterVisualImage',cards.length===8&&cards.every(c=>c.ok),{cards:cards.length,outer:[90,131],visual:[86,126],image:[78,94],xPitch:94,xGap:4,yPitch:152,yGap:21});
check('deck8AtlasRegions',cards.every(c=>c.regionOK)&&new Set(cards.map(c=>JSON.stringify(c.imageRegion))).size===8);
const orphanImages=doc.screens.flatMap(s=>s.elements.filter(e=>e.kind==='image'&&inputMode(e,doc.transitions)==='parent'&&!inputOwner(s,e.id,doc.transitions)).map(e=>node(s,e)));
check('noParentModeImageWithoutActionOwner',orphanImages.length===0,{orphanImages});
const transitionRefs=doc.transitions.map(t=>{const s=doc.screens.find(s=>s.id===t.fromScreen),e=s?.elements.find(e=>e.id===t.fromElement),target=t.targetScreen?doc.screens.find(s=>s.id===t.targetScreen):null;return{...t,sourceScreenExists:!!s,sourceElementExists:!!e,sourceName:e?.name||null,targetExists:!t.targetScreen||!!target,inputOwnerId:s&&e?inputOwner(s,e.id,doc.transitions)?.id||null:null,ok:!!s&&!!e&&(!t.targetScreen||!!target)};});
check('transition10IDReferencesValid',transitionRefs.length===10&&transitionRefs.every(t=>t.ok));
check('transitionConditionsAllAlways',doc.transitions.every(t=>t.condition==='always'),{conditions:doc.transitions.reduce((o,t)=>(o[t.condition]=(o[t.condition]||0)+1,o),{})});
const modelTransitions=[];
for(const t of doc.transitions){let r=createRuntime(doc);if(t.action==='close'){r.overlays=[t.fromScreen];r.focusStack=[null];}else r.page=t.fromScreen;
 const n=activate(doc,r,t.fromScreen,t.fromElement);
 const passed=t.action==='navigate'?n.page===t.targetScreen:t.action==='open'?n.overlays.includes(t.targetScreen):t.action==='close'?!n.overlays.includes(t.fromScreen):false;
 modelTransitions.push({id:t.id,action:t.action,condition:t.condition,sourceName:transitionRefs.find(x=>x.id===t.id).sourceName,passed,pageBefore:r.page,pageAfter:n.page,overlaysBefore:r.overlays,overlaysAfter:n.overlays,message:n.message});
}
check('pureModelTransitionActions10',modelTransitions.every(t=>t.passed),{passed:modelTransitions.filter(t=>t.passed).length,total:10,scope:'memory-only model call; not browser/native visual QA'});
const findings=[];
if(!hud.every(h=>h.rectSame))findings.push({severity:'needs correction',code:'HUD_PARENT_HEIGHT',details:'Home parent H35 vs Deck H34 in r60; proportional child rects differ while fixed Fill stays97x19. Source raw snapshot preserved.',nodes:hud.filter(h=>!h.rectSame)});
if(orphanImages.length)findings.push({severity:'needs input-role cleanup',code:'PARENT_IMAGE_NO_OWNER',details:'Display image uses parent mode but HUD container has no action owner. It is not a dangling transition; mark display-only none if that is the intended role.',nodes:orphanImages});
if(modelTransitions.some(t=>!t.passed))findings.push({severity:'navigation blocked in model',code:'UNKNOWN_CONDITION',details:'condition=unknown returns null and activate stops with a pending-condition message. Transition IDs remain structurally valid.',transitions:modelTransitions.filter(t=>!t.passed)});
if(screenOutside.length||negative.length||invalid.length||navIssues.length||cards.some(c=>!c.ok))findings.push({severity:'geometry issue',code:'RECT_OR_FAMILY',screenOutside,negative,invalid,navIssues,cards:cards.filter(c=>!c.ok)});
const result={generatedAt:new Date().toISOString(),status:findings.length?'STATIC_FINDINGS':'STATIC_CHECKS_PASS',proposalStatus:'제안(검수 대기); nativeGUI/시각동등/실게임 승인 아님',snapshot:{path:input,revision:doc.revision,sha256:crypto.createHash('sha256').update(raw).digest('hex'),bytes:raw.length,savedAt:doc.savedAt},counts:{screens:doc.screens.length,parts:all.length,transitions:doc.transitions.length,kinds:doc.screens.reduce((o,s)=>(o[s.kind]=(o[s.kind]||0)+1,o),{}),byScreen:doc.screens.map(s=>({id:s.id,name:s.name,kind:s.kind,parts:s.elements.length,logicalSize:s.logicalSize}))},checks,findings,nav,hud,cards,orphanImages,parentOutside,transitionRefs,modelTransitions,allRects:all,notPerformed:['브라우저 1440/430/390 실제 그림·스크롤·이미지로딩·입력·닫기·초점복귀','기획/영상 원본 시각동등·폰트glyph·게임/구매·재화/해제/정책판정','원본설계/자원/제품소스 수정·공용STATUS/report 수정'],sourceDesignWrites:0,browserActions:0};
fs.writeFileSync(path.join(out,'structure-audit.json'),JSON.stringify(result,null,2)+'\n');
let md=`# Clash r${doc.revision} 정적 구조 검토\n\n${result.generatedAt} · codex 하위 · 제안(검수 대기)\n\n고정 스냅샷 [원문](${input}) / SHA ${result.snapshot.sha256}. 실제 툴/브라우저 검수가 아닙니다. 원본 설계와 자원은 읽기만 했습니다.\n\n4화면261부품10연결, ${raw.length}bytes/2,000,000bytes.\n\n|검사|결과|\n|---|---|\n`;
for(const c of checks)md+=`|${c.name}|${c.ok?'PASS':'검토/교정 필요'}|\n`;
md+='\n## 지적/잔여\n\n';
md+=findings.length?findings.map(f=>'- '+f.code+': '+f.details).join('\n'):'정해진 정적 항목에서 추가 지적0. 실화면/영상 동등과 실제 입력·스크롤·복귀는 본체 검수 범위입니다.';
md+='\n\n## 주요 규격\n\n- Home/Deck/Social의 nav15개: outer78×66, x0/78/156/234/312, y778. icon48² local(15,0), label78×18 local(0,48), font14/line17/center.\n- Deck8카드: outer90×131, visual86×126 local(4,5), image78×94 local(8,9), pitch94/152·gap4/21. 600×300 atlas의150²영역8개.\n- Home/Deck HUD11쌍(parent+10children) 및 Experience Fill의 rect/재질을 별도 JSON에 기록했습니다.\n- parent영역 바깥 자식은 '+parentOutside.length+'개이며 JSON의 parentOutside에서 부모overflow와 함께 구분합니다. screen 바깥은 '+screenOutside.length+'개입니다. 보이는 DOM 넘침/클리핑 검수로 확대하지 않습니다.\n\n연결의 ID참조 유효성과 condition 실행결과를 분리했습니다. 10개 메모리모델 동작 중 '+modelTransitions.filter(t=>t.passed).length+'개가 대상행동에 도달했으며, 브라우저 입력 성공을 뜻하지 않습니다.\n\nsourceDesignWrites0 / browserActions0 / asset originals writes0.\n';
fs.writeFileSync(path.join(out,'structure-audit.md'),md);
console.log(JSON.stringify({revision:doc.revision,status:result.status,counts:result.counts,checks:checks.map(c=>[c.name,c.ok]),orphanImages:orphanImages.length,parentOutside:parentOutside.length,findings:findings.map(f=>f.code),out:path.join(out,'structure-audit.json')},null,2));
