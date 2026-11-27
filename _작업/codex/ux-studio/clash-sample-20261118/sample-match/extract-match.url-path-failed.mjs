import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { resolveRect, validateDocument } from '/Users/max/projest_max/ui-studio/src/tools/uxStudio/model.mjs';
import { inputMode, inputOwner } from '/Users/max/projest_max/ui-studio/src/tools/uxStudio/parts.mjs';

const root='/Users/max/projest_max/ui-studio';
const out=path.dirname(new URL(import.meta.url).pathname);
const hash=v=>crypto.createHash('sha256').update(v).digest('hex');
const round=v=>typeof v==='number'?Math.round(v*1000)/1000:v;
const rectRound=r=>Object.fromEntries(Object.entries(r).map(([k,v])=>[k,round(v)]));
const stamp=new Date();
const kst=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(stamp)+' KST';
const inputs={
 tile:'samples/tile-survival/ui-studio/designs/ux-25ecc98a.json',
 mono:'samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json'
};
const sources=Object.fromEntries(Object.entries(inputs).map(([key,relativePath])=>{
 const file=path.join(root,relativePath),raw=fs.readFileSync(file),doc=JSON.parse(raw);
 validateDocument(doc);
 const workspace=JSON.parse(fs.readFileSync(path.join(path.dirname(path.dirname(file)),'project.json')));
 return [key,{file,relativePath,raw:raw.toString(),sha256Before:hash(raw),doc,workspace}];
}));
const plans=[
 {key:'home_toolbar',source:'tile',screen:'Page_TSV_Territory',target:'홈 상단 자원줄/하단 5탭',fit:'부분 적합',
  choose:['HUD_TSV_Top','BG_TSV_HUD_PowerCell','Txt_TSV_HUD_Power','Img_TSV_HUD_Power','HUD_TSV_Nav','Btn_TSV_Nav_Heroes','Img_TSV_Nav_Heroes','Txt_TSV_Nav_Heroes'],
  compare:'상단 고정 HUD·하단 고정 nav를 중앙 장면과 형제로 두는 계층을 참고합니다. 샘플 nav는 6슬롯이고 중앙은 영지 그림입니다. 클래시 5탭·중앙 아레나·자원 종류/아이콘/라벨은 새 원본에 맞춥니다.',
  spacing:[['nav 슬롯 가로 pitch',84],['nav 슬롯 사이 여백',0],['nav 아이콘→라벨 겹침',4],['상단 HUD 고정 높이',64],['하단 nav 고정 높이',64]],
  limits:['6슬롯 중 Heroes만 유효 진입 연결입니다. 5탭의 각 목적지를 제공하지 않습니다.','기존 64px/84px 규격을 390폭에 그대로 강제하지 않습니다.']},
 {key:'collection_four_columns',source:'tile',screen:'Page_TSV_Heroes',target:'컬렉션 4열 목록 / 덱 카드 유닛 참고',fit:'컬렉션 구조 적합·덱은 부분',
  choose:['HUD_TSV_Heroes_Header','List_TSV_Heroes','HUD_TSV_Heroes_Footer','Card_TSV_Hero01','Card_TSV_Hero02','Card_TSV_Hero05','BG_TSV_Hero01','Img_TSV_Hero01','Txt_TSV_Hero01_Status','Btn_TSV_Heroes_Back'],
  compare:'4열·분리 초상/native 레벨·스크롤 본문/고정 상하단의 구조를 참고합니다. 덱은 이 유닛을 새 4×2 컨테이너에 조립할 후보이며 Tower 영역·덱 선택·교체 동작은 없습니다.',
  spacing:[['가로 카드 크기',111],['세로 카드 크기',180],['가로 gap',8],['세로 gap',10],['왼쪽/오른쪽 여백',18],['header→list',8],['list→footer',8]],
  limits:['실제 layout.type=grid가 아닌 개별 카드의 fixed rectTransform 배치입니다.','필터는 panel이며 control tabs/연결이 없습니다. 모집/영웅 상세는 미연결입니다.','보유카드 4×2+Tower·바텀시트 전용 계층은 없습니다.']},
 {key:'album_card_family',source:'mono',screen:'Page_Album_Sets',target:'카드 그림/제목/수량 분리 유닛',fit:'유닛만 부분 적합',
  choose:['Viewport_Album_Sets','Content_Album_Sets','Card_Album_Set01','Card_Album_Set02','Card_Album_Set04','Img_Album_Set01_Art','Txt_Album_Set01_Title','Txt_Album_Set01_Count'],
  compare:'카드 그림·제목·진행수량과 입력 wrapper 분리, scroll viewport→content→카드 계층을 참고합니다. 샘플은 앨범 세트 3열 9장이고 클래시 컬렉션/덱은 4열 개별 카드입니다.',
  spacing:[['가로/세로 gap',6],['card W',164],['card H',248],['content padding top',25.59],['content padding right',24],['content padding bottom',24],['content padding left',23]],
  limits:['3열 164×248을 클래시 카드 비율·4열에 직접 적용하지 않습니다.','카드 클릭→상세 연결은 없고 Back만 있습니다.','카드 level/희귀도/엘릭서/업그레이드 상태는 없습니다.']},
 {key:'social_tabs_rows',source:'mono',screen:'Modal_Friends_Timeline',target:'소셜/클랜 탭 + 세로 목록',fit:'목록/탭 구조만 부분 적합',
  choose:['Group_Friends_Panel','Frame_Friends_Panel','Tabs_Friends_Sections','Viewport_Friends_Timeline','Content_Friends_Timeline','Card_Friends_Activity02','Txt_Friends_Activity02_Name','Txt_Friends_Activity02_Message','Btn_Friends_Close'],
  compare:'헤더·선택 탭·scroll viewport·반복행·고정 닫기를 참고합니다. 샘플은 modal이고 클랜 목록은 전체 페이지 컨테이너와 하단 5탭을 별도로 검토해야 합니다.',
  spacing:[['반복 활동행 W',485.35],['반복 활동행 H',80],['반복 활동행 gap',4],['행 내부 이름 x offset',97],['행 내부 이름 y offset',8]],
  limits:['add/leaderboard는 미관찰 빈 본문입니다. timeline만 실제 내용이 있습니다.','친구 요청 Send/Reject 입력이 있어도 게임/API 연결은 없습니다.','클랜 참가·검색·채팅·정렬·클랜정보 연결을 제공하지 않습니다.']},
 {key:'shop_products',source:'mono',screen:'Modal_Shop_Store',target:'세로 상점 / 상품 그림·수량·가격·구매 분리',fit:'부분 적합',
  choose:['HUD_Shop','Group_Shop_HalloweenOffer','Viewport_Shop_Products','Group_Shop_Product01','Group_Shop_Product02','Group_Shop_Product04','Frame_Shop_Product01','Txt_Shop_Product01_Quantity','Btn_Shop_Product01_Buy','BG_Shop_Product01_Buy','Txt_Shop_Product01_Price','Group_Shop_Footer','element-2150dcd4-a557-4c1c-a738-c4b656154a50'],
  compare:'고정 HUD/프로모션·scroll 상품영역·고정 footer와 상품별 그림/수량/가격/버튼 분리를 참고합니다. 클래시 상점은 세로 섹션·서로 다른 offer 크기를 원본대로 재구성해야 합니다.',
  spacing:[['상품 W',156.27],['상품 H',224.98],['상품 가로 pitch',167.05],['상품 가로 gap',10.78],['상품 세로 pitch',268.76],['상품 세로 gap',43.78]],
  limits:['샘플은 modal/fullscreen이며 main/menu에서 open, footer close입니다. 하단 5탭 페이지와 같지 않습니다.','샘플 3열×2행 상품과 실제 클래시 세로 offer 구성은 다릅니다.','구매 버튼 tint 입력은 있으나 결제/재화 차감 transition은 없습니다.']},
 {key:'card_detail_surrogate',source:'mono',screen:'Modal_Showroom_TokenDetail',target:'카드 상세의 확대 그림/제목/하단 CTA 참고',fit:'근접 예제·직접 적합 없음',
  choose:['Group_TokenDetail_Nameplate','Frame_TokenDetail_Nameplate','Txt_TokenDetail_Name','Group_TokenDetail_Display','Img_TokenDetail_Buttons','Group_TokenDetail_EquipDock','Btn_TokenDetail_Equip','Txt_TokenDetail_Equip','Footer_TokenDetail','Btn_TokenDetail_Close'],
  compare:'확대 전시 그룹·이름표·그림/native 글자 분리와 하단 CTA/Close만 참고합니다. 원본 카드 상세의 능력치/레벨/업그레이드 비용/확인 상태와 sheet 바닥 위치는 새로 정의해야 합니다.',
  spacing:[['nameplate→category gap',5.05],['footer 고정 H',72],['Close hit W/H',44],['CTA 버튼 W',244],['CTA 버튼 H',72]],
  limits:['토큰 상세이며 카드 능력치/업그레이드 구조가 없습니다.','equip/info/previous/next는 입력 wrapper이나 유효 transition이 없습니다.','modal rootMode=fullscreen입니다. 바텀시트 동등 구조/동작으로 쓰지 않습니다.','명시 진입 transition은 없고 Close만 있습니다.']}
];
const assets=new Map();
function collectRefs(value,at,source){
 if(!value||typeof value!=='object')return;
 if(value.assetRef){
  const abs=path.join(path.dirname(path.dirname(source.file)),'assets',value.assetRef);
  const key=source.workspace.id+'/'+value.assetRef;
  if(!assets.has(key))assets.set(key,{workspace:source.workspace.id,assetRef:value.assetRef,path:abs,exists:fs.existsSync(abs),bytes:fs.existsSync(abs)?fs.statSync(abs).size:null,storedSize:value.sourceSize||((value.w&&value.h)?[value.w,value.h]:null),uses:[]});
  assets.get(key).uses.push(at);
 }
 for(const [k,v] of Object.entries(value))if(k!=='src')collectRefs(v,at+'.'+k,source);
}
const unique=a=>[...new Set(a)];
const matches=plans.map(p=>{
 const src=sources[p.source],s=src.doc.screens.find(s=>s.name===p.screen);assert(s);
 const byName=new Map(s.elements.map(e=>[e.name,e]));
 const selected=p.choose.map(n=>byName.get(n)||s.elements.find(e=>e.id===n));assert(selected.every(Boolean),'missing selected name '+p.key);
 const nodes=selected.map(e=>{
  const abs=resolveRect(s,e.id,s.logicalSize.w,s.logicalSize.h);
  const parent=e.parentId?s.elements.find(n=>n.id===e.parentId):null;
  const pb=parent?resolveRect(s,parent.id,s.logicalSize.w,s.logicalSize.h):{x:0,y:0,w:s.logicalSize.w,h:s.logicalSize.h};
  const owner=inputOwner(s,e.id,src.doc.transitions);
  const line=src.raw.slice(0,src.raw.indexOf('"id": "'+e.id+'"')).split('\n').length;
  const o={id:e.id,name:e.name,kind:e.kind,parentId:e.parentId||s.id,sourceLine:line,logicalRect:rectRound(abs),parentLocalRect:rectRound({...abs,x:abs.x-pb.x,y:abs.y-pb.y}),rawParentPercent:{x:e.x,y:e.y,w:e.w,h:e.h},anchor:e.rectTransform||null,inset:e.inset||null,useSafeArea:e.useSafeArea??null,layout:e.layout||null,overflow:e.overflow??null,font:e.kind==='text'||e.control?{size:e.fontSize??null,...e.typography}:null,text:e.text||null,input:{stored:e.interaction||null,effectiveMode:inputMode(e,src.doc.transitions),ownerId:owner?.id||null},state:e.buttonState||null,control:e.control||null,skin:e.skin||null,image:e.image||null,shadow:e.effects?.shadow||null,transitionIds:src.doc.transitions.filter(t=>t.fromScreen===s.id&&t.fromElement===e.id).map(t=>t.id)};
  if(o.image?.src?.startsWith('data:'))o.image={...o.image,src:'[embedded omitted; source unchanged]'};
  collectRefs({skin:e.skin,image:e.image,state:e.buttonState,control:e.control},p.key+'/'+e.id,src);
  return o;
 });
 const selectedIds=new Set(nodes.map(n=>n.id));
 return {key:p.key,fit:p.fit,target:p.target,source:p.source,workspaceId:src.workspace.id,projectId:src.doc.projectId,revision:src.doc.revision,screen:{id:s.id,name:s.name,kind:s.kind,logicalSize:s.logicalSize,safeArea:s.safeArea??null,skin:s.skin||null,presentation:s.presentation||null},comparison:p.compare,gapsAndSizes:p.spacing.map(([description,logicalPx])=>({description,logicalPx})),nodes,transitions:src.doc.transitions.filter(t=>t.fromScreen===s.id||t.targetScreen===s.id),limits:p.limits,assetRefs:unique([...assets.values()].filter(a=>a.uses.some(u=>u.startsWith(p.key+'/'))).map(a=>a.assetRef)),notes:['좌표와 폰트/상태는 저장된 샘플 제작값이며 대상 원본 게임 Unity 설정이 아닙니다.','logicalRect는 샘플 logicalSize에서 resolveRect한 화면 기준 좌표입니다. DOM·브라우저 실측이 아닙니다.','표의 rawPercent는 좌표 계산 이전 저장값입니다. fixed anchor가 있으면 그것이 우선합니다.']};
});
const refSummary={videoSizePx:{w:1080,h:2340},logicalSizeProposal:{w:390,h:844},directVideoInspectedByThisSubagent:false,provenance:'부모 본체가 배정에서 제공한 신규 영상 관찰·크기. 이 하위는 영상 파일/프레임을 직접 열지 않았습니다.',observations:['홈: 상단 자원줄/중앙 arena/하단 5탭','덱: 4×2카드+타워; 바텀시트와 전체페이지 컨테이너 구분 필요','컬렉션:4열 목록','카드상세+업그레이드','소셜:클랜 목록','상점:세로 구성'],sourceFramePixelRects:null,sourceFramePixelRectStatus:'이 배정에 원본 프레임 좌표 없음·미측정. 샘플 좌표로 대체하지 않음.',fitProposal:{method:'원본 비율을 보존해 새390×844에 contain할 경우에만 해당하는 계산 제안',scale:844/2340,contentRect:{x:round((390-1080*844/2340)/2),y:0,w:round(1080*844/2340),h:844},warning:'이 값은 제작 제안입니다. 실제 UI 영역 좌표·safeArea·탭높이·폰트 측정은 본체의 원본 대조가 우선합니다.'}};
const sourceMetadata=Object.fromEntries(Object.entries(sources).map(([key,s])=>[key,{path:s.file,workspaceId:s.workspace.id,guideVersion:s.workspace.guideVersion,projectId:s.doc.projectId,revision:s.doc.revision,schemaVersion:s.doc.schemaVersion,savedAt:s.doc.savedAt,screenCount:s.doc.screens.length,elementCount:s.doc.screens.reduce((n,v)=>n+v.elements.length,0),transitionCount:s.doc.transitions.length,sha256Before:s.sha256Before,sha256After:hash(fs.readFileSync(s.file))}]));
for(const s of Object.values(sourceMetadata))assert.equal(s.sha256Before,s.sha256After);
for(const m of matches)for(const n of m.nodes){assert(Object.values(n.logicalRect).every(Number.isFinite));assert(n.logicalRect.w>0&&n.logicalRect.h>0);}
assert([...assets.values()].every(a=>a.exists),'asset file missing');
const result={status:'제안(검수 대기) · 읽기 전용 선행대조',generatedAt:kst,scope:'허용된 두 샘플 JSON과 관련 저장계약의 읽기·해당 작업 폴더의 분석 산출만. 실제 툴 제작/브라우저/원본 영상 검수/샘플 복사/외부 설계 편집 없음.',method:{graphify:'프로젝트 root graphify-out/graph.json 부재 확인. 지정된 두 파일과 resolveRect/inputOwner 저장계약만 직접 조회; 지도 생성/전체스캔 없음.',rounding:'논리 계산값은 소수3자리 반올림; rawParentPercent/anchor는 원 저장값 보존',sourceValues:'모든 sample 좌표/폰트/skin/state는 샘플 제작값. Clash 원본 픽셀·Unity 설정으로 해석 금지',browserInspection:false,sourceDesignWrites:0},sources:sourceMetadata,targetReference:refSummary,matches,unmatched:[{target:'덱 4×2 + Tower',result:'직접 적합 샘플 없음',closest:'collection_four_columns',delta:'4열유닛만 참고. 두 줄 고정/별도 Tower영역/덱탭/교체 상태와 연결은 새 영상 근거로 제작.'},{target:'실제 바텀시트와 전체 페이지 전환',result:'선정 샘플은 page 또는 fullscreen modal. 실제 sheet 동등 샘플 없음.',closest:'social_tabs_rows / card_detail_surrogate',delta:'kind/presentation/root 및 고정/스크롤 범위를 섞지 않음. 부모영상 원본에서 시트 외곽과 배후·닫기 경로를 먼저 확인.'},{target:'카드 능력치·업그레이드',result:'직접 적합 샘플 없음',closest:'card_detail_surrogate / shop_products',delta:'확대그림/제목/CTA 분리만 참고. 비용·레벨·진행바·상태·성공화면·게임수치는 새 원본 필요.'}],assets:[...assets.values()],verification:{savedDocumentsValidated:2,matchFamilies:matches.length,extractedNodes:matches.reduce((n,v)=>n+v.nodes.length,0),assetFilesChecked:assets.size,missingAssets:0,sampleSourceHashesUnchanged:true,onlyOutputFolderWritten:out,notPerformed:['실제 브라우저/디자인 가이드 화면/상태·입력·스크롤·overflow·연결 실동작 검수','Clash 영상 원본 프레임 실측','W/P/U/S 완료판정·툴 제작·샘플 복사·게임연결']}};
fs.writeFileSync(path.join(out,'sample-match.json'),JSON.stringify(result,null,2)+'\n');
const fnum=n=>n===null||n===undefined?'미지정':String(round(n));
const rstr=r=>[r.x,r.y,r.w,r.h].map(fnum).join(', ');
const font=n=>n.font?[`size ${fnum(n.font.size)}`,n.font.family||'family 미지정',`weight ${fnum(n.font.weight)}`,`line ${fnum(n.font.lineHeight)}`,n.font.align||'align 미지정',n.font.wrap||'wrap 미지정'].join(' / '):'—';
const state=n=>n.state?n.state.mode+'; '+Object.keys(n.state.tints||n.state.images||{}).join('/'):(n.control?.type==='tabs'?'tabs value='+n.control.value:'미지정');
const skin=n=>n.skin?`${n.skin.mode}slice src[${n.skin.slices}] edge[${n.skin.edges}] pad[${n.skin.padding}]`:n.image?'image '+n.image.fit:'—';
const asset=n=>unique((()=>{const a=[];function f(v){if(!v||typeof v!=='object')return;if(v.assetRef)a.push(v.assetRef);for(const[k,x]of Object.entries(v))if(k!=='src')f(x);}f({image:n.image,skin:n.skin,state:n.state,control:n.control});return a;})()).map(x=>x.slice(0,20)+'…').join(' / ')||'—';
let md=`# 클래시 로얄 선행 샘플 대조\n\n작성 ${kst} · codex 하위 분석 · 제안(검수 대기)\n\n두 샘플의 저장값만 분석했습니다. 실제 툴 제작·화면 검수·새 샘플 복사는 수행하지 않았습니다. **샘플 제작값과 클래시 원본 관찰/제안값을 구분합니다.** 이 하위는 클래시 영상을 직접 보지 않았고 부모 본체의 관찰 목록을 입력으로 사용했습니다.\n\n| 실제 원본 | workspace / project | 판 / 논리크기 |\n| --- | --- | --- |\n`;
for(const [key,s]of Object.entries(result.sources))md+=`| [${key}](${s.path}) | ${s.workspaceId}<br>${s.projectId} | r${s.revision}; ${key==='tile'?'504×894':'551×984'} |\n`;
md+=`\n대상 영상 1080×2340, 새 논리 화면 **390×844는 제작 제안**입니다. 원본 프레임의 구역별 x/y/W/H는 배정에 없어 미측정입니다. 같은 비율 contain 계산 시 source scale ${(844/2340).toFixed(9)}, 표시 ${refSummary.fitProposal.contentRect.w}×844, x offset ${refSummary.fitProposal.contentRect.x}입니다. 대상의 실제 UI 좌표/타이포그래피/safe area를 뜻하지 않습니다.\n\n배치 숫자는 샘플 logicalSize에서 도구의 \`resolveRect\`로 계산한 화면 기준 **x,y,W,H 논리px**입니다. 소수3자리 반올림이며 JSON의 rawParentPercent·anchor에 원 저장값을 보존했습니다. inputOwner는 저장계약 계산이고 실제 DOM 입력 성공이 아닙니다.\n\n| 후보 | 대상 / 적합 | 샘플 제작값 요약 | 반드시 변경/확인 |\n| --- | --- | --- | --- |\n`;
for(const m of matches)md+=`| ${m.key} | ${m.target}<br>${m.fit} | ${m.gapsAndSizes.map(g=>g.description+' '+g.logicalPx).join('; ')} | ${m.comparison} |\n`;
for(const m of matches){
 md+=`\n## ${m.key} — ${m.screen.name}\n\n화면 ID \`${m.screen.id}\`; ${m.screen.kind}; logical ${m.screen.logicalSize.w}×${m.screen.logicalSize.h}; safeArea ${m.screen.safeArea===null?'저장값 없음':JSON.stringify(m.screen.safeArea)}. ${m.screen.presentation?'presentation '+JSON.stringify(m.screen.presentation):'presentation 저장값 없음'}.\n\n| 실제 이름 / ID | 부모 ID | x,y,W,H | 폰트 / state | overflow / 입력 | slice / 자원 |\n| --- | --- | --- | --- | --- | --- |\n`;
 for(const n of m.nodes)md+=`| [${n.name}](${result.sources[m.source].path}:${n.sourceLine})<br>\`${n.id}\` | \`${n.parentId}\` | ${rstr(n.logicalRect)} | ${font(n)}<br>${state(n)} | ${n.overflow??'미지정'}<br>${n.input.effectiveMode} → ${n.input.ownerId||'없음'} | ${skin(n)}<br>${asset(n)} |\n`;
 md+='\n연결 저장값:\n\n';
 for(const t of m.transitions)md+=`- \`${t.id}\`: \`${t.fromScreen}/${t.fromElement}\` — ${t.event}/${t.condition}/${t.action} → \`${t.targetScreen||'없음'}\`; 복귀 ${t.returnPolicy||'미지정'}; ${t.label||''}\n`;
 md+='\n한계:\n\n'+m.limits.map(x=>'- '+x).join('\n')+'\n';
}
md+=`\n## 적합 샘플 없음\n\n`+result.unmatched.map(u=>`- **${u.target}**: ${u.result} ${u.delta}`).join('\n')+`\n\n## 확인 범위\n\n- 현재 저장 JSON validateDocument 2개 통과, 후보 ${matches.length}개 / 노드 ${result.verification.extractedNodes}개 계산값 유한·크기 양수 확인.\n- 선택 노드의 참조 자원 ${assets.size}개 파일 존재 확인, 누락0. 전체 assetRef/경로·storedSize·bytes·실제사용 위치는 [sample-match.json](${out}/sample-match.json)에 있습니다.\n- 두 샘플 JSON의 전후 SHA256 동일. JSON 원본·샘플 자원·제품 소스·공용 STATUS/보고·서버·브라우저 변경0.\n- 실제 브라우저/디자인 가이드·이미지 로딩/alpha·폰트·overflow·mouse/Enter/Space·스크롤/닫기/복귀는 미검수입니다. 저장된 상태명·edge 존재를 실제 동작 성공으로 쓰지 않습니다.\n- Graphify root 지도는 없어서 지정 파일 직접 조회. 새 지도/전체스캔/보호파일 검색0.\n\n재현: \`node ${out}/extract-match.mjs\`. 분석 파일 재생성만 수행하고 기존 설계 JSON을 편집하지 않습니다.\n`;
fs.writeFileSync(path.join(out,'sample-match.md'),md);
console.log(JSON.stringify(result.verification,null,2));
console.log('outputs',path.join(out,'sample-match.json'),path.join(out,'sample-match.md'));
