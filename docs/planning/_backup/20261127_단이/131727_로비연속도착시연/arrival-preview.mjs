// Studio-only arrival samples share the saved roll HUD and choose an authored outcome.
const TILE_COUNT = 40;
const tileId = number => 'board-tile-' + String(number).padStart(2, '0') + '-surface';
const offset = (tile, steps) => (tile - 1 + steps + TILE_COUNT) % TILE_COUNT + 1;
const point = tile => ({x:tile.x+tile.w/2,y:tile.y+tile.h/2});
const nextEdge = (d,id) => d.transitions.find(t=>t.fromElement===id+'.review-next');
const screenId = (screen,part) => screen.id+'.'+part;
const part = (screen,id) => screen.elements.find(e=>e.id===screenId(screen,id));
const copy = (scene,source) => source ? {...structuredClone(source),id:scene.id+source.id.slice(source.id.indexOf('.'))} : null;

function boardAt(scene, template, number, track) {
    const tile = part(template,tileId(number));
    if (!tile) return;
    const board = template.elements.filter(e=>e.id===template.id+'.01.world'||/^board-tile-\d{2}-(surface|engraving)$/.test(e.id.slice(template.id.length+1)));
    const marker = scene.elements.filter(e=>e.id.startsWith(scene.id+'.pawn-'));
    const base = marker.find(e=>e.id.endsWith('.pawn-base'));
    const {x,y}=point(tile);
    const markers=base?marker.map(e=>({
        ...e,parentId:undefined,x:x+(e.x-base.x-base.w/2)*.62,y:y+(e.y-base.y-base.h/2)*.51,w:e.w*.62,h:e.h*.51
    })):[];
    const route = track.map((pos,i)=>{
        const slot=part(template,tileId(pos));
        if (!slot) return null;
        return {id:screenId(scene,'arrival-outline-'+pos),name:pos+'번 이동 칸',kind:'panel',partRole:'background',
            text:'',x:slot.x,y:slot.y,w:slot.w,h:slot.h,
            appearance:{shape:'rounded',radius:5,stroke:'#ffffff',strokeWidth:i===track.length-1?2:1,fill:'#ffffff',opacity:i===track.length-1?.3:.15}};
    }).filter(Boolean);
    const remaining=scene.elements.filter(e=>!e.parentId?.endsWith('.board-camera')&&!e.id.endsWith('.board-camera')
        && !e.id.endsWith('.01.world')&&!/\.board-tile-|\.pawn-|\.tile-focus/.test(e.id));
    const baseBoard=board.map(src=>({...copy(scene,src),interaction:undefined}));
    scene.elements=[...baseBoard,...route,...markers,...remaining];
}

function setText(s,id,text) {
    const element=part(s,id);
    if(element)element.text=text;
}

function diceFaces(screen,dice) {
    const faces=['02.soft-card','04.soft-card'].map(key=>part(screen,key));
    const pip=part(screen,'03.die-pip');
    if(faces.some(face=>!face)||!pip)return;
    const patterns={1:[[0,0]],2:[[-1,-1],[1,1]],3:[[-1,-1],[0,0],[1,1]],4:[[-1,-1],[1,-1],[-1,1],[1,1]]};
    const fresh=faces.flatMap((face,i)=>patterns[dice[i]].map(([x,y],j)=>({...pip,id:screenId(screen,'arrival-die-pip-'+i+'-'+j),
      x:face.x+face.w/2-pip.w/2+x*face.w*.20,y:face.y+face.h/2-pip.h/2+y*face.h*.20})));
    screen.elements=screen.elements.flatMap(e=>e.id===faces[1].id?[e,...fresh]:e.id.endsWith('.die-pip')?[]:[e]);
}

export function applyArrivalScenario(d, scenario) {
    if(!scenario)return;
    const {tile,name,dice,next,terminal}=scenario;
    if(!Number.isInteger(tile)||tile<1||tile>TILE_COUNT||!Array.isArray(dice)||dice.length!==2||dice.some(i=>![1,2,3,4].includes(i)))return;
    const get=id=>d.screens.find(s=>s.id===id);
    const base=get('flow-01'),resolved=get('flow-03'),moving=get('flow-04'),arrival=get(next);
    if(!base||!resolved||!moving||!arrival||!nextEdge(d,'flow-04'))return;
    const steps=dice[0]+dice[1];
    const start=offset(tile,-steps);
    const route=Array.from({length:steps},(_,i)=>offset(start,i+1));
    diceFaces(resolved,dice);
    setText(resolved,'08.status-text',dice.join(' + ')+' = '+steps+'칸');
    boardAt(moving,base,route.at(-2)||tile,route);
    setText(moving,'pending-copy','도착 예정 · '+tile+'번 '+name);
    nextEdge(d,'flow-04').targetScreen=next;
    const arrivalScreens=next==='flow-05'&&terminal==='flow-09'?['flow-05','flow-06','flow-07','flow-08','flow-09']:[next];
    for(const id of arrivalScreens){
        const s=get(id);
        boardAt(s,base,tile,[tile]);
        setText(s,'success-copy','도착 성공 · '+tile+'번 '+name);
    }
    if(terminal){
        const edge=nextEdge(d,terminal);
        if(edge){
            Object.assign(edge,{action:'module',targetScreen:null,label:scenario.label,payload:{moduleId:'simulator_module_arrival_result',label:scenario.label}});
            delete edge.autoAfterMs;
        }
    }
}
