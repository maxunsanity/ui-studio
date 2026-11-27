// Read-only common UI saved-model verification. No browser/HTTP/UI/design writes.
// Default: completed footer checks enforced, header mismatches expectedPending.
// Strict final: node _작업/codex/ux-studio/verify-common-ui.mjs --final [--json]
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {isDeepStrictEqual as equal} from 'node:util';
import {resolve,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../../..'),local=p=>resolve(root,p);
const args=process.argv.slice(2),final=args.includes('--final'),full=args.includes('--json');
if(args.some(a=>!['--final','--json'].includes(a)))throw Error('Only --final and --json are supported.');
const designPath='samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json';
const baselinePath='samples/monopoly-go/ui-studio/designs/backups/ux-gjs-0d80d7fe-r248-6d2588c6-62fc-4f05-8450-b4eada4a38f1.json';
const [bytes,oldBytes]=await Promise.all([readFile(local(designPath)),readFile(local(baselinePath))]);
const doc=JSON.parse(bytes),old=JSON.parse(oldBytes),sha=b=>createHash('sha256').update(b).digest('hex');
const {resolveRect,validateDocument}=await import(pathToFileURL(local('src/tools/uxStudio/model.mjs')));
const {inspectAsset}=await import(pathToFileURL(local('src/tools/uxStudio/asset-store.mjs')));
const closeBG='9077bed744487f5cb63244093020a3df075df16b1401a85c71896286b510b69a';
const footerLine='150bc918192c946962c0c7ac6b8a769fa3ed0c1fe9e52b1d52220039bc143918';
const checks=[],units=[],screenMap=new Map(doc.screens.map(s=>[s.name,s]));
const near=(a,b)=>Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=0.04;
const check=(stage,name,ok,detail)=>checks.push({stage,name,status:ok?'pass':stage==='header'&&!final?'expectedPending':'fail',...(detail===undefined?{}:{detail})});
const get=(s,name)=>{const es=s?.elements.filter(e=>e.name===name)??[];return es.length===1?es[0]:undefined;};
function unit(screenName,name,parent,rect,stage,kind,extra={}){
  units.push({screenName,name,parent,rect,stage,kind,...extra});
}
const footerDefs=[
 ['Page_Build_City','Build','HUD_Build_Bottom','BG_Build_Footer','Line_Build_Footer','Btn_Build_Back','Txt_Build_CloseGlyph'],
 ['Modal_Wins_QuickWins','Wins','Group_Wins_Footer','BG_Wins_Footer','Line_Wins_Footer','Btn_Wins_Close','Txt_Wins_CloseGlyph'],
 ['Modal_Friends_Timeline','Friends','Group_Friends_Footer','BG_Friends_Footer','Line_Friends_Footer','Btn_Friends_Close','Txt_Friends_Close_Label'],
 ['Modal_Main_Menu','Menu','Group_Menu_Footer','BG_Menu_Footer_Flat','Line_Menu_Footer','Btn_Menu_Close','Txt_Menu_Close'],
 ['Page_Showroom_Shields','Showroom','Group_Showroom_Footer','BG_Showroom_Footer','Line_Showroom_Footer','Btn_Showroom_Back','Txt_Showroom_Back'],
 ['Modal_Shop_Store','Shop','Group_Shop_Footer','BG_Shop_Footer','Line_Shop_Footer','Btn_Shop_Close','Txt_Shop_Close']
];
for(const [screen,role,parent,bg,line,close,glyph]of footerDefs){
 const build=role==='Build';
 if(!build)unit(screen,parent,'SCREEN',[0,912,551,72],'footer','panel',{role:'footer-container'});
 unit(screen,bg,parent,[0,build?200:0,551,72],'footer','panel',{global:[0,912,551,72],solidSHA:closeBG,role:'footer-background'});
 unit(screen,line,parent,[0,build?200:0,551,6],'footer','panel',{global:[0,912,551,6],solidSHA:footerLine,role:'footer-line'});
 unit(screen,close,parent,[253.5,build?228:28,44,44],'footer','button',{global:[253.5,940,44,44],role:'footer-close',glyphName:glyph});
 unit(screen,glyph,close,[8,8,28,28],'footer','text',{global:[261.5,948,28,28],role:'footer-glyph',font:[32,500,28],text:'×'});
}
unit('Page_Build_City','Txt_Build_City_Progress','HUD_Build_Bottom',[0,208,551,20],'footer','text',{global:[0,920,551,20],font:[20,700,20],role:'footer-title',text:'NEW YORK CITY 3/15'});
const topDefs=[
 {screen:'Page_Board',outer:'HUD_Top',bar:'Group_TopBar',bg:'BG_TopBar',frame:'Frame_TopBar',sns:'Group_SNSAvatar',snsImage:'Img_SNSAvatar',snsFrame:'Frame_SNSAvatar',cash:'Btn_HUD_Cash',cashImage:'Img_Cash',cashText:'Txt_HUD_Cash_Amount',menu:'Btn_Menu',menuImage:'Img_MenuBars',badge:'Badge_HUD_Menu',lines:[['Line_TopBar_Avatar',36],['Line_TopBar_Shield',276],['Line_TopBar_Menu',396]]},
 {screen:'Modal_Shop_Store',outer:'HUD_Shop',bar:'Group_Shop_TopBar',bg:'BG_Shop_TopBar',frame:'Frame_Shop_TopBar',sns:'Group_Shop_SNSAvatar',snsImage:'Img_Shop_SNSAvatar',snsFrame:'Frame_Shop_SNSAvatar',cash:'Group_Shop_Cash',cashImage:'Img_Shop_Cash',cashText:'Txt_Shop_HUD_Cash_Amount',lines:[['Line_Shop_TopBar_Avatar',36],['Line_Shop_TopBar_Dice',276]]},
 {screen:'Page_Build_City',outer:'HUD_Build_Top',bar:'Group_Build_TopBar',bg:'BG_Build_TopBar',frame:'Frame_Build_TopBar',cash:'Group_Build_Cash',cashImage:'Img_Build_Cash',cashText:'Txt_Build_Cash_Amount',menu:'Btn_Build_Menu',menuImage:'Img_Build_MenuBars',badge:'Badge_Notification_Build_Menu',lines:[['Line_Build_Level_Cash',112],['Line_Build_Cash_Houses',352],['Line_Build_Houses_Menu',472]],build:true}
];
for(const t of topDefs){
 const {screen,outer,bar}=t,bw=t.build?535:459;
 unit(screen,outer,'SCREEN',[8,12,535,96],'header','panel',{role:'header-outer',nativeTopAnchor:true});
 unit(screen,bar,outer,[t.build?0:76,16,bw,56],'header','panel',{role:'header-bar'});
 unit(screen,t.bg,bar,[0,0,bw,56],'header','panel',{role:'header-bar-background',percentFill:true});
 unit(screen,t.frame,bar,[0,0,bw,56],'header','panel',{role:'header-bar-frame',percentFill:true});
 if(t.sns){
  unit(screen,t.sns,outer,[0,0,96,96],'header','panel',{role:'SNS-group'});
  unit(screen,t.snsImage,t.sns,[7,7,82,82],'header','image',{role:'SNS-image'});
  unit(screen,t.snsFrame,t.sns,[0,0,96,96],'header','panel',{role:'SNS-frame'});
 }
 unit(screen,t.cash,bar,[t.build?128:52,11,214,34],'header',t.build||screen==='Modal_Shop_Store'?'panel':'button',{role:'cash-group'});
 unit(screen,t.cashImage,t.cash,[0,0,45,34],'header','image',{role:'cash-image'});
 unit(screen,t.cashText,t.cash,[58,0,156,34],'header','text',{role:'cash-text',font:[28,800,34]});
 if(t.menu){
  unit(screen,t.menu,outer,[483,22,44,44],'header','button',{role:'menu-hit'});
  unit(screen,t.menuImage,t.menu,[8,8,28,28],'header','image',{role:'menu-art'});
  unit(screen,t.badge,t.menu,[26,-8,18,18],'header','panel',{role:'menu-badge-decoration',allowParentOverhang:true});
 }
 for(const [name,x]of t.lines)unit(screen,name,bar,[x,8,2,40],'header','panel',{role:'bar-divider'});
}
unit('Page_Board','Btn_HUD_Shields','Group_TopBar',[292,10,88,36],'header','button',{role:'shield-group'});
for(const [name,x]of [['Img_HUD_Shield01',0],['Img_HUD_Shield02',20.33],['Img_HUD_Shield03',40.67],['Img_HUD_Shield04',61]])unit('Page_Board',name,'Btn_HUD_Shields',[x,0,27,36],'header','image',{role:'shield-art'});
unit('Modal_Shop_Store','Group_Shop_Dice','Group_Shop_TopBar',[292,10,146,36],'header','panel',{role:'dice-group'});
unit('Modal_Shop_Store','Img_Shop_HUD_Dice','Group_Shop_Dice',[0,0,36,36],'header','image',{role:'dice-art'});
unit('Modal_Shop_Store','Txt_Shop_HUD_Dice_Count','Group_Shop_Dice',[45,1,101,34],'header','text',{role:'dice-text',font:[28,800,34]});
unit('Page_Build_City','Group_Build_Level','Group_Build_TopBar',[8,10,96,36],'header','panel',{role:'level-group'});
unit('Page_Build_City','BG_Build_Level_Count','Group_Build_Level',[16,2,80,32],'header','panel',{role:'level-backing'});
unit('Page_Build_City','Img_Build_Level_Star','Group_Build_Level',[0,0,36,36],'header','image',{role:'level-star'});
unit('Page_Build_City','Txt_Build_Level_Count','Group_Build_Level',[34,1,62,34],'header','text',{role:'level-text',font:[28,800,34]});
unit('Page_Build_City','Group_Build_Houses','Group_Build_TopBar',[368,10,88,36],'header','panel',{role:'houses-group'});
unit('Page_Build_City','Img_Build_Houses','Group_Build_Houses',[0,0,36,36],'header','image',{role:'houses-art'});
unit('Page_Build_City','Txt_Build_Houses_Count','Group_Build_Houses',[48,1,40,34],'header','text',{role:'houses-text',font:[28,800,34]});

// Declared refinements preserve variant roots and semantics, not their old glyph boxes.
unit('Modal_Wins_QuickWins','Group_Wins_Clipboard','SCREEN',[10.2,105.68,525.49,800.32],'footer','panel',{role:'bounded-clipboard'});
for(const [screen,name,parent,text]of [
 ['Page_Album_Sets','Txt_Album_Back_Label','Btn_Album_Back','‹'],
 ['Modal_Event_RacingStarter','Txt_Racing_Close','Btn_Racing_Close','×'],
 ['Modal_Event_TycoonExpress','Txt_Tycoon_CloseGlyph','Btn_Tycoon_Close','×']
])unit(screen,name,parent,[8,8,28,28],'variants','text',{role:'navigation-glyph',font:[32,500,28],text});

const result={
 checkedAt:new Date().toISOString(),mode:final?'final':'in-progress',revision:doc.revision,baselineRevision:old.revision,designPath,baselinePath,designSHA256:sha(bytes),
 counts:{screens:doc.screens.length,parts:doc.screens.reduce((n,s)=>n+s.elements.length,0),transitions:doc.transitions.length},
 stages:{footer:'enforced after root r258 actual QA',header:final?'enforced':'mismatches expectedPending during native edits'},
 contracts:{logicalSize:[551,984],footer:{rect:[0,912,551,72],line:[0,912,551,6],hit:[253.5,940,44,44],glyph:[261.5,948,28,28],glyphFont:[32,500,28],glyphColor:'#72756d'},headerOuter:[8,12,535,96],SNSbarLocal:[76,16,459,56],buildBarLocal:[0,16,535,56],menuRootMeaning:'HUD outer-local [483,22,44,44]; absolute [491,34,44,44]',badgeVariant:'18sq at [26,-8] relative to menu hit is a decorative overhang; it must remain inside HUD96. No blanket overflow allowance.',flatBGSHA:closeBG,lineSHA:footerLine},
 limits:['Saved model/local assets only. No browser/AX/HTTP/UI manipulation or writes to design/source/guide/records.','Transparent root/label checks below verify model conditions suppressing native unit-surface and label plates, not observed DOM rgba or surface counts. Root owns actual DOM/render QA.','Default header expectedPending is not a completion claim. Strict final requires every header check. Assertion counts are not UI completion rates.','Album Back, Racing upper-right Close, Tycoon floating Close and unobserved content families are not forced into footer/header families; only the declared glyph28sq/font32/500/28 white refinements differ from r248.','No original font/pixel/game/API equivalence claimed.']
};
try{validateDocument(doc);check('structure','saved validateDocument',true);}catch(e){check('structure','saved validateDocument',false,e.message);}
check('structure','baseline r248 and899parts',old.revision===248&&old.screens.length===10&&old.screens.reduce((n,s)=>n+s.elements.length,0)===899);
check('structure','ten logical551x984 screens',doc.screens.length===10&&doc.screens.every(s=>equal(s.logicalSize,{w:551,h:984})));
check('structure','same screen IDs names kinds order and metadata',equal(doc.screens.map(({elements,...s})=>s),old.screens.map(({elements,...s})=>s)));
check('structure','all twenty original transitions unchanged',doc.transitions.length===20&&equal(doc.transitions,old.transitions));
const allowedNew=[
 ['Page_Build_City','Txt_Build_CloseGlyph','element-5e26bedc-dfc1-4f1e-bf20-9937a0fec415-label'],
 ['Modal_Wins_QuickWins','Txt_Wins_CloseGlyph','common-5f417889-56a9-4075-9da4-8c918f828fe1-close-label'],
 ['Modal_Friends_Timeline','Line_Friends_Footer','element-54e1de37-a7ce-4224-a6d7-2d84c6f5d775']
];
const missing=[],added=[],structuralProblems=[],outsideChanges=[],assetChanges=[],textChanges=[];
const editable=new Set(),headerIds=new Set(),footerIds=new Set(),baselineById=new Map();
for(const s of old.screens)for(const e of s.elements)baselineById.set(e.id,{screen:s.name,element:e});
for(const u of units){
 const base=old.screens.find(s=>s.name===u.screenName),e=base?.elements.find(e=>e.name===u.name);
 if(e){editable.add(e.id);(u.stage==='header'?headerIds:footerIds).add(e.id);}
}
for(const id of ['element-4ede6e35-a6c9-4bb4-a93f-ab683b1f3d9b','element-d820bd0d-9e5d-47a7-b614-cf0cb69069f0-frame']){editable.add(id);footerIds.add(id);}
const topAllIds=new Set();
for(const t of topDefs){
 const s=old.screens.find(s=>s.name===t.screen),ids=new Set([s.elements.find(e=>e.name===t.outer).id]);let count;
 do{count=ids.size;for(const e of s.elements)if(ids.has(e.parentId))ids.add(e.id);}while(count!==ids.size);
 for(const id of ids){editable.add(id);headerIds.add(id);topAllIds.add(id);}
}
const bodyNames=new Set(['Txt_Wins_Weekly_DayCount','Viewport_Friends_Timeline','Viewport_Shop_Products']);
for(const s of old.screens)for(const e of s.elements)if(bodyNames.has(e.name))editable.add(e.id);
const preciseRefinementProblems=[];
const navigationGlyphNames=new Set(['Txt_Album_Back_Label','Txt_Racing_Close','Txt_Tycoon_CloseGlyph']);
const expectedRefinedElement=be=>{
 if(be.name==='Group_Wins_Clipboard')return {...be,h:800.32/984*100};
 if(navigationGlyphNames.has(be.name))return {...be,x:8/44*100,y:8/44*100,w:28/44*100,h:28/44*100,fontSize:32,typography:{...be.typography,weight:500,lineHeight:28,strokeWidth:0},appearance:{...be.appearance,textColor:'#ffffff'}};
 return be;
};
for(const [id,b]of baselineById){
 if(b.element.name!=='Group_Wins_Clipboard'&&!navigationGlyphNames.has(b.element.name))continue;
 const actual=get(screenMap.get(b.screen),b.element.name),expected=expectedRefinedElement(b.element);
 const normalized=actual&&{...actual};
 if(actual?.name==='Group_Wins_Clipboard'&&Math.abs(actual.x-b.element.x)<=1e-12)normalized.x=b.element.x;
 if(!equal(normalized,expected))preciseRefinementProblems.push({id,name:b.element.name,actual,expected});
}
check('structure','only exact four declared refinement fields differ',preciseRefinementProblems.length===0,preciseRefinementProblems);
const renames=new Map([['element-4ede6e35-a6c9-4bb4-a93f-ab683b1f3d9b','Line_Build_Footer'],['element-d820bd0d-9e5d-47a7-b614-cf0cb69069f0-frame','Line_Wins_Footer']]);
const reparentNames=new Map([['Group_Shop_Cash','Group_Shop_TopBar'],['Group_Shop_Dice','Group_Shop_TopBar']]);
const emptyOldClose=new Set(['Btn_Build_Back','Btn_Wins_Close']);
const replaceTextureIds=new Set(footerDefs.flatMap(([sn,,,bg,line])=>{const s=old.screens.find(s=>s.name===sn);return [s.elements.find(e=>e.name===bg)?.id,s.elements.find(e=>e.name===line)?.id].filter(Boolean);}));
replaceTextureIds.add('element-4ede6e35-a6c9-4bb4-a93f-ab683b1f3d9b');replaceTextureIds.add('element-d820bd0d-9e5d-47a7-b614-cf0cb69069f0-frame');
const footerCloseNames=new Set(footerDefs.map(d=>d[5]));
for(const bs of old.screens){
 const s=doc.screens.find(s=>s.id===bs.id);
 for(const be of bs.elements){
  const e=s?.elements.find(e=>e.id===be.id);
  if(!e){missing.push({screen:bs.name,id:be.id,name:be.name});continue;}
  if(e.name!==(renames.get(be.id)??be.name))structuralProblems.push({id:e.id,field:'name',actual:e.name,expected:renames.get(be.id)??be.name});
  if(e.kind!==be.kind)structuralProblems.push({id:e.id,field:'kind',actual:e.kind,expected:be.kind});
  const permittedParent=reparentNames.get(be.name)?s.elements.find(p=>p.name===reparentNames.get(be.name))?.id:be.parentId;
  if(e.parentId!==permittedParent){
   const pending=reparentNames.has(be.name)&&!final;
   (pending?[]:structuralProblems).push({id:e.id,field:'parentId',actual:e.parentId,expected:permittedParent});
  }
  if(!editable.has(be.id)&&!equal(e,be))outsideChanges.push({screen:bs.name,id:e.id,name:e.name});
  if((e.text??'')!==(emptyOldClose.has(be.name)?'':be.text??''))textChanges.push({id:e.id,name:e.name,actual:e.text,expected:emptyOldClose.has(be.name)?'':be.text});
  if(be.image&&!equal(e.image,be.image))assetChanges.push({id:e.id,name:e.name,field:'image'});
  if(be.skin&&!replaceTextureIds.has(be.id)&&!footerCloseNames.has(be.name)&&!equal(e.skin,be.skin))assetChanges.push({id:e.id,name:e.name,field:'skin'});
 }
 for(const e of s?.elements??[])if(!bs.elements.some(b=>b.id===e.id))added.push({screen:s.name,id:e.id,name:e.name});
}
check('structure','all899 old IDs stay in original screen',missing.length===0,missing);
check('structure','old names kinds parents preserved except named native refinements',structuralProblems.length===0,structuralProblems);
check('structure','only three actual native parts added;902 total',result.counts.parts===902&&added.length===3&&allowedNew.every(([screen,name,id])=>added.some(a=>a.screen===screen&&a.name===name&&a.id===id)),added);
check('structure','unassigned old elements deepEqual r248',outsideChanges.length===0,outsideChanges);
check('structure','old native copy and values preserved except extracted twoClose glyphs',textChanges.length===0,textChanges);
check('structure','existing art/crops/other skins preserved',assetChanges.length===0,assetChanges);
const unitMap=new Map(units.map(u=>[u.screenName+'/'+u.name,u]));
const expectedGlobal=u=>{
 if(u.global)return u.global;
 if(u.parent==='SCREEN')return u.rect;
 const p=unitMap.get(u.screenName+'/'+u.parent);
 if(p){const pr=expectedGlobal(p);return [pr[0]+u.rect[0],pr[1]+u.rect[1],u.rect[2],u.rect[3]];}
 const s=screenMap.get(u.screenName),e=get(s,u.parent),r=e&&resolveRect(s,e.id,551,984);
 return r?[r.x+u.rect[0],r.y+u.rect[1],u.rect[2],u.rect[3]]:null;
};
for(const u of units){
 const s=screenMap.get(u.screenName),e=get(s,u.name);
 if(!e){check(u.stage,'present '+u.name,false,{screen:u.screenName});continue;}
 const p=u.parent==='SCREEN'?null:get(s,u.parent);
 let rr,localRect,err;
 try{const r=resolveRect(s,e.id,551,984),pr=p?resolveRect(s,p.id,551,984):{x:0,y:0};rr=[r.x,r.y,r.w,r.h];localRect=[r.x-pr.x,r.y-pr.y,r.w,r.h];}catch(x){err=x.message;}
 const expected=expectedGlobal(u),rightParent=u.parent==='SCREEN'?!e.parentId:Boolean(p)&&e.parentId===p.id;
 check(u.stage,'parent/local/global geometry '+u.name,e.kind===u.kind&&rightParent&&!!localRect&&localRect.every((v,i)=>near(v,u.rect[i]))&&!!expected&&rr.every((v,i)=>near(v,expected[i])),{screen:u.screenName,id:e.id,parentId:e.parentId,expectedParent:p?.id??null,actualLocal:localRect,expectedLocal:u.rect,actualGlobal:rr,expectedGlobal:expected,...(err?{error:err}:{})});
 if(u.nativeTopAnchor)check(u.stage,'native top anchor '+u.name,equal(e.rectTransform?.min,[0,1])&&equal(e.rectTransform?.max,[0,1])&&equal(e.rectTransform?.pivot,[0,1])&&equal(e.rectTransform?.sizeDelta,[535,96])&&near(e.rectTransform?.position?.[0],8)&&near(e.rectTransform?.position?.[1],-12),e.rectTransform);
 if(u.percentFill)check(u.stage,'barBG/frame native full-parent percent '+u.name,[e.x,e.y,e.w,e.h].every((v,i)=>near(v,[0,0,100,100][i])),[e.x,e.y,e.w,e.h]);
 if(u.font)check(u.stage,'native font '+u.name,e.kind==='text'&&near(e.fontSize,u.font[0])&&near(e.typography?.weight,u.font[1])&&near(e.typography?.lineHeight,u.font[2]),{fontSize:e.fontSize,typography:e.typography,expected:u.font});
 if(u.text!==undefined)check(u.stage,'exact native text '+u.name,e.text===u.text,{actual:e.text,expected:u.text});
 if(u.solidSHA){
  const sk=e.skin,im=sk?.textures?.normal;
  check(u.stage,'common flat native9 source '+u.name,sk?.mode==='9'&&equal(sk.slices,[0,0,0,0])&&equal(sk.edges,[0,0,0,0])&&equal(sk.padding,[0,0,0,0])&&im?.assetRef==='sha256-'+u.solidSHA+'.webp'&&im.w===32&&im.h===32,{assetRef:im?.assetRef,sourceSize:[im?.w,im?.h],mode:sk?.mode,slices:sk?.slices,edges:sk?.edges,padding:sk?.padding});
 }
 if(u.role==='footer-close'){
  const children=s.elements.filter(c=>c.parentId===e.id);
  check(u.stage,'transparent input compound and sole native glyph '+u.name,e.text===''&&!e.skin&&!e.image&&(e.component==='image-frame'||e.isGroup===true)&&e.partRole==='container'&&e.interaction?.mode==='action'&&e.interaction?.enabled===true&&e.interaction?.shape==='rectangle'&&!e.effects?.shadow?.enabled&&children.length===1&&children[0].name===u.glyphName&&children[0].kind==='text'&&children[0].partRole==='label'&&children[0].interaction?.mode==='parent',{component:e.component,isGroup:e.isGroup,skin:!!e.skin,image:!!e.image,interaction:e.interaction,children:children.map(c=>({id:c.id,name:c.name,parentId:c.parentId,kind:c.kind,partRole:c.partRole}))});
 }
 if(u.role==='navigation-glyph')check(u.stage,'explicit variant transparent white glyph '+u.name,e.partRole==='label'&&!e.skin&&!e.image&&e.interaction?.mode==='parent'&&e.typography?.align==='center'&&e.typography?.vertical==='middle'&&near(e.typography?.strokeWidth??0,0)&&e.appearance?.textColor?.toLowerCase()==='#ffffff',{typography:e.typography,color:e.appearance?.textColor,partRole:e.partRole});
 if(u.role==='footer-glyph')check(u.stage,'transparent native glyph label styling '+u.name,e.partRole==='label'&&!e.skin&&!e.image&&e.interaction?.mode==='parent'&&e.typography?.align==='center'&&e.typography?.vertical==='middle'&&near(e.typography?.strokeWidth??0,0)&&e.appearance?.textColor?.toLowerCase()==='#72756d',{partRole:e.partRole,interaction:e.interaction,typography:e.typography,color:e.appearance?.textColor});
 if(u.role==='menu-hit')check(u.stage,'header menu input '+u.name,e.interaction?.mode==='action'&&e.interaction?.enabled!==false&&e.interaction?.shape==='rectangle',e.interaction);
 if(u.role==='menu-badge-decoration'){
  const outer=get(s,topDefs.find(t=>t.screen===u.screenName).outer),or=outer&&resolveRect(s,outer.id,551,984);
  check(u.stage,'explicit badge overhang inside HUD '+u.name,!!or&&!!rr&&rr[0]>=or.x-.04&&rr[1]>=or.y-.04&&rr[0]+rr[2]<=or.x+or.w+.04&&rr[1]+rr[3]<=or.y+or.h+.04,{badge:rr,HUD:or&&[or.x,or.y,or.w,or.h],allowedOverhang:'menu hit only: y-8, still inside HUD96'});
 }
}
for(const hash of [closeBG,footerLine]){
 try{
  const p='samples/monopoly-go/ui-studio/assets/sha256-'+hash+'.webp',b=await readFile(local(p)),info=inspectAsset(b,'image/webp');
  check('assets','registered common flat SHA32sq '+hash,sha(b)===hash&&info.width===32&&info.height===32,{path:p,bytes:b.length,sourceSize:[info.width,info.height]});
 }catch(e){check('assets','registered common flat source readable '+hash,false,e.message);}
}
result.boundaryObservations=[];
for(const [sn,name]of [['Modal_Wins_QuickWins','Txt_Wins_Weekly_DayCount'],['Modal_Friends_Timeline','Viewport_Friends_Timeline'],['Modal_Shop_Store','Viewport_Shop_Products']]){
 const s=screenMap.get(sn),e=get(s,name),r=e&&resolveRect(s,e.id,551,984);
 if(r)result.boundaryObservations.push({screen:sn,name,id:e.id,rect:[r.x,r.y,r.w,r.h],bottom:r.y+r.h,footerTop:912,overlap:Math.max(0,r.y+r.h-912),meaning:'diagnostic only; no unrequested viewport/body normalization'});
}
result.navigationVariants=['Page_Album_Sets','Modal_Event_RacingStarter','Modal_Event_TycoonExpress'].map(name=>{
 const base=old.screens.find(s=>s.name===name),expected={...base,elements:base.elements.map(expectedRefinedElement)};
 return {screen:name,preservedExceptDeclaredGlyph:equal(screenMap.get(name),expected),rule:'Only exact glyph28sq/font32/500/28 white refinement; button root/placement/body/entry edges unchanged.'};
});
check('structure','separate variants deepEqual except exact declared glyph refinement',result.navigationVariants.every(v=>v.preservedExceptDeclaredGlyph),result.navigationVariants);
result.snapshotUnchangedAtEnd=sha(await readFile(local(designPath)))===result.designSHA256;
result.summary={passed:checks.filter(c=>c.status==='pass').length,expectedPending:checks.filter(c=>c.status==='expectedPending').length,failed:checks.filter(c=>c.status==='fail').length,assertions:checks.length,checkedUnits:units.length};
result.status=!result.snapshotUnchangedAtEnd?'snapshotChanged':result.summary.failed?'fail':result.summary.expectedPending?'expectedPending':'pass';
result.checks=checks;
console.log(JSON.stringify(full?result:{...result,checks:undefined,failures:checks.filter(c=>c.status==='fail'),pending:checks.filter(c=>c.status==='expectedPending')},null,2));
if(!result.snapshotUnchangedAtEnd)process.exitCode=2;else if(result.summary.failed||final&&result.summary.expectedPending)process.exitCode=1;
