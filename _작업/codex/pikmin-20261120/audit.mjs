import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {validateDocument,createRuntime,activate} from '../../../src/tools/uxStudio/model.mjs';
const root='/Users/max/projest_max/ui-studio',sample=path.join(root,'samples/pikmin');
const d=JSON.parse(fs.readFileSync(path.join(sample,'ui-studio/designs/ux-f83f162e.json'),'utf8'));
let count=0;const checked=[];function check(n,f){f();count++;checked.push(n);}
const screen=n=>d.screens.find(s=>s.name===n),base=n=>n.replace(/(?: 복사)+$/g,''),el=(s,n)=>s.elements.find(e=>base(e.name)===n);
check('native document contract',()=>validateDocument(d));
check('15 stored UI states',()=>assert.equal(d.screens.length,15));
check('independent main entry',()=>assert.equal(d.entryScreen,screen('Page_Pikmin_Mushrooms').id));
check('all logical canvases 390x844',()=>d.screens.forEach(s=>assert.deepEqual(s.logicalSize,{w:390,h:844})));
let used=new Set();for(const s of d.screens)for(const e of s.elements)if(e.image?.assetRef)used.add(e.image.assetRef);
check('all used assets exist, have correct content hash and <=300KB',()=>{for(const name of used){const b=fs.readFileSync(path.join(sample,'ui-studio/assets',name));assert.ok(b.length<=300000,name);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),name.match(/^sha256-(.*)\.webp$/)[1]);}});
check('every native button has press state enabled',()=>d.screens.flatMap(s=>s.elements).filter(e=>e.kind==='button').forEach(e=>assert.equal(e.buttonState?.enabled,true,e.name)));
for(const [a,b]of [['Page_Pikmin_MushroomSelect','Page_Pikmin_MushroomSelected'],['Page_Pikmin_PostcardSelect','Page_Pikmin_PostcardSelected']]){
 check(a+' disabled GO',()=>assert.equal(el(screen(a),'Btn_GO').interaction.enabled,false));
 check(b+' enabled GO',()=>assert.equal(el(screen(b),'Btn_GO').interaction.enabled,true));
 check(a+' shared 5-column geometry',()=>{for(let i=0;i<20;i++)for(const k of ['x','y','w','h'])assert.equal(el(screen(a),'Btn_Pikmin_'+i)[k],el(screen(b),'Btn_Pikmin_'+i)[k]);});
}
check('petals Next disabled until selected state',()=>{assert.equal(el(screen('Page_Pikmin_Petals'),'Btn_Next').interaction.enabled,false);assert.equal(el(screen('Page_Pikmin_PetalsSelected'),'Btn_Next').interaction.enabled,true);});
for(const n of ['Popup_Pikmin_Limit','Popup_Pikmin_AlreadyReceived'])check(n+' nonblocking 2500ms toast',()=>{const p=screen(n).presentation;assert.equal(p.type,'toast');assert.equal(p.dim,false);assert.equal(p.autoCloseMs,2500);});
let r=createRuntime(d);const click=(n,s=d.screens.find(s=>s.id===r.page))=>r=activate(d,r,s.id,el(s,n).id);const at=n=>assert.equal(r.page,screen(n).id);
for(const [n,to]of [['Btn_Mushroom_Card','Page_Pikmin_MushroomDetail'],['Btn_Join','Page_Pikmin_MushroomSelect']])check('mushroom '+n,()=>{click(n);at(to)});
check('disabled GO cannot start',()=>{click('Btn_GO');at('Page_Pikmin_MushroomSelect')});
for(const[n,to]of [['Btn_Auto','Page_Pikmin_MushroomSelected'],['Btn_GO','Page_Pikmin_MushroomStart'],['Btn_Return_Map','Page_Pikmin_Mushrooms'],['Btn_Flower_Entry','Page_Pikmin_FlowerDetail'],['Btn_Flower_Petals','Page_Pikmin_Petals'],['Btn_Petal_1','Page_Pikmin_PetalsSelected'],['Btn_Next','Page_Pikmin_PostcardSelect'],['Btn_Auto','Page_Pikmin_PostcardSelected'],['Btn_GO','Page_Pikmin_Bloom']])check('flow '+n+' -> '+to,()=>{click(n);at(to)});
check('essence modal opens above bloom',()=>{click('Btn_Essence');assert.equal(r.overlays.length,1);at('Page_Pikmin_Bloom')});
check('essence closes preserving bloom',()=>{click('Btn_Close',screen('Popup_Pikmin_Essence'));assert.equal(r.overlays.length,0);at('Page_Pikmin_Bloom')});
check('bloomed detail entry',()=>{click('Btn_Flower_Detail');at('Page_Pikmin_FlowerBloomed')});
check('already received toast opens',()=>{click('Btn_Flower_Petals');assert.equal(r.overlays.length,1)});
check('unlinked button common notice',()=>{r=createRuntime(d);click('Btn_Tab_0');assert.equal(r.message,'아직 연결된 화면이 없습니다.')});
const result={revision:d.revision,title:d.title??d.name,screens:d.screens.length,elements:d.screens.reduce((n,s)=>n+s.elements.length,0),transitions:d.transitions.length,usedAssets:used.size,pass:count,fail:0,checked};
fs.writeFileSync(path.join(sample,'docs/ui/native-audit.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
