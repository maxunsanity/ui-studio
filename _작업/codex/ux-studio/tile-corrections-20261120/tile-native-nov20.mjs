import {install} from './tile-native-helpers.mjs';
import {installRunner} from './tile-native-runner.mjs';
import {installExtras} from './tile-native-extras.mjs';
export async function setup(th,write){
 const t={p:th.playwright};install(t,th,write);await installRunner(t,th,write);installExtras(t,th,write);
 t.screen=async id=>{let cl=t.p.getByRole('button',{name:'유닛 도구 닫기',exact:true});if(await cl.isVisible())await cl.click();await t.p.getByRole('button',{name:'화면',exact:true}).click();await t.p.locator('button[data-screen="'+id+'"]').click();await t.p.getByRole('button',{name:'레이어',exact:true}).click();};
 t.rect=async r=>{await t.pane('layer');let preset=null;if(!await t.p.locator('[data-transform-field="x"]').count()){preset=await t.p.locator('[data-responsive-field="anchor.preset"]').evaluate(e=>e.value);await t.set('[data-responsive-field="anchor.preset"]','percent');}for(let k of ['x','y','w','h'])if(r[k]!==undefined)await t.set('[data-transform-field="'+k+'"]',r[k]);if(preset&&preset!=='percent')await t.set('[data-responsive-field="anchor.preset"]',preset);};
 t.unit=async(label,name,r)=>{let old=(await t.names()).find(x=>x.name===name);if(old){await t.pick(old.id);await t.parent('');await t.rect(r);return old.id;}await t.screen(new URL(await th.url()).searchParams.get('screen'));let bucket=label==='네모 백판 도구'?'도형 도구 모음':/본문|이미지 자리|제목|프로필/.test(label)?'텍스트·정보 도구 모음':'게임 UI 종류 도구 모음';await t.p.getByRole('button',{name:bucket,exact:true}).click();await t.p.getByRole('button',{name:label,exact:true}).click();await t.p.locator('#preview-canvas').click();let id=await t.p.locator('button.layer-select.active[data-element]').getAttribute('data-element');await t.name(name);await t.rect(r);return id;};
 t.newArtBase='/ui-studio/source/assets/import-staging/tile-corrections-20261120/';
 t.setSkin=async(path,mode='backplate',s=[22,22,22,22],edge=s)=>{await t.tab('general');await t.set(await t.p.locator('[data-skin-mode]').count()?'[data-skin-mode]':'[data-skin-field="preset"]',mode);await t.skin(t.newArtBase+path);for(let i=0;i<4;i++){await t.set('[data-skin-field="slices.'+i+'"]',s[i]);await t.set('[data-skin-field="edges.'+i+'"]',edge[i]);}};
 t.abs=async(id,r,parent)=>{await t.pick(id);await t.parent('');await t.rect(r);if(parent)await t.parent(parent);};
 t.replaceImage=async(id,path,region)=>{await t.pick(id);await t.tab('general');await t.set('[data-project-image]',t.newArtBase+path);await t.p.locator('[data-project-image]:placeholder-shown').waitFor({state:'visible',timeout:15000});if(region)await t.crop(region);};
 return t;
}
