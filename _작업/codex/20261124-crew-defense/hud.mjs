import {readFileSync,writeFileSync} from 'node:fs';
import {validateDocument} from '/Users/max/projest_max/ui-studio/src/tools/uxStudio/model.mjs';
const url=name=>new URL(name,import.meta.url);
const h=JSON.parse(readFileSync(url('hud-base.json')));
const keep=new Set(['defense-full','defense-gauge-help']);
const moved=new Set(h.screens.filter(s=>s.id.startsWith('defense-')&&!keep.has(s.id)).map(s=>s.id));
h.screens=h.screens.filter(s=>!moved.has(s.id));
h.transitions=h.transitions.filter(t=>!moved.has(t.fromScreen)).map(t=>{
 if(!moved.has(t.targetScreen))return t;
 if(!['defense-full.rail0.1','defense-full.roll'].includes(t.fromElement))throw Error('이동 처리되지 않은 HUD 연결 '+t.fromElement);
 return {...t,action:'module',targetScreen:null,payload:{moduleId:'simulator_module_bad_energy',label:t.fromElement.endsWith('.roll')?'가득 찬 상태에서 굴리기':'나쁜 기운 디펜스',context:{entry:t.targetScreen==='defense-ignore'?'ignore':'warning'}}};
});
validateDocument(h);
writeFileSync(url('hud-defense-split.json'),JSON.stringify(h,null,2)+'\n');
writeFileSync(url('hud-defense-split-assets.json'),'{}');
console.log('HUD 현재',h.revision,'유지',h.screens.length,'이관',Array.from(moved).join(', '));
