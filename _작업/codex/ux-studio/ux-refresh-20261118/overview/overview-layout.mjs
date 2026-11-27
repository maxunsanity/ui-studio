const folderID = value => typeof value === 'string' && /^[a-z][a-z0-9-]{0,47}$/.test(value);
const screenID = value => typeof value === 'string' && /^[\p{L}\p{N}_.:-]{1,128}$/u.test(value);
const modes = ['wireframe','detailed-wireframe','ui'];
const arrangements = ['grid','flow'];
const finitePosition = p => p && screenID(p.id) && ['x','y'].every(key => Number.isFinite(p[key]) && p[key] >= 0 && p[key] <= 1000000);

export function parseOverviewURL(href) {
 const params = new URL(href).searchParams;
 for (const key of ['workspace','project','screen','view','layout']) if (params.getAll(key).length > 1) throw Error('주소의 선택 정보가 중복되었습니다.');
 const read = key => params.has(key) ? params.get(key) : null;
 const workspaceId=read('workspace'),projectId=read('project'),screenId=read('screen'),presentationMode=read('view'),layout=read('layout');
 if (workspaceId !== null && !folderID(workspaceId)) throw Error('프로젝트 폴더 ID를 확인하세요.');
 if (projectId !== null && !folderID(projectId)) throw Error('설계 ID를 확인하세요.');
 if (screenId !== null && !screenID(screenId)) throw Error('화면 ID를 확인하세요.');
 if (presentationMode !== null && !modes.includes(presentationMode)) throw Error('제작 표현을 확인하세요.');
 if (layout !== null && !arrangements.includes(layout)) throw Error('캔버스 보기를 확인하세요.');
 return {workspaceId,projectId,screenId,presentationMode,layout};
}

export function overviewURL(stage,{workspaceId=null,projectId=null,screenId=null,presentationMode=null,layout=null}={}) {
 const paths={overview:'/ui-studio/canvas.html',detail:'/ui-studio/?editor=detail',sample:'/ui-studio/source/sample-preview.html'};
 if (!Object.hasOwn(paths,stage)) throw Error('알 수 없는 제작 단계입니다.');
 const url=new URL(paths[stage],'http://127.0.0.1');
 for (const [key,value] of [['workspace',workspaceId],['project',projectId],['screen',screenId],['view',presentationMode],['layout',stage==='overview'?layout:null]]) if (value !== null && value !== undefined) url.searchParams.set(key,value);
 parseOverviewURL(url.href);
 return url.pathname+url.search;
}

export function preferenceKey(identity,view='settings') {
 if (!['settings',...arrangements].includes(view)) throw Error('보기 설정 이름을 확인하세요.');
 const {workspaceId=null,projectId}=identity;
 if ((workspaceId!==null&&!folderID(workspaceId))||!folderID(projectId)) throw Error('보기 설정의 프로젝트를 확인하세요.');
 return 'ux-studio.overview.v1:'+ (workspaceId?'workspace:'+workspaceId:'legacy') + ':' + projectId + ':' + view;
}

export function cleanViewPreferences(value) {
 const saved=value&&typeof value==='object'?value:{};
 const positions=Array.isArray(saved.positions)?saved.positions.filter(finitePosition).map(({id,x,y})=>({id,x,y})):[];
 return {zoom:Number.isFinite(saved.zoom)&&saved.zoom>=.01&&saved.zoom<=2?saved.zoom:null,
  left:Number.isFinite(saved.left)&&saved.left>=0&&saved.left<=10000000?saved.left:0,
  top:Number.isFinite(saved.top)&&saved.top>=0&&saved.top<=10000000?saved.top:0,
  selected:screenID(saved.selected)?saved.selected:null,positions};
}

export function screenSize(design,screen) {
 const size=screen.logicalSize||design.designBasis?.logicalSize||{w:390,h:844};
 const w=size.w??size.width,h=size.h??size.height;
 if (![w,h].every(n=>Number.isFinite(n)&&n>0&&n<=10000)) throw Error('화면 기준 크기를 확인하세요.');
 return {w,h};
}

export function gridLayout(design) {
 const boards=design.screens.map(screen=>({id:screen.id,...screenSize(design,screen)}));
 const columns=Array.from({length:5},(_,column)=>Math.max(0,...boards.filter((_,i)=>i%5===column).map(b=>b.w)));
 let y=48;
 return boards.map((board,index)=>{
  const column=index%5;
  if(index>0&&column===0)y+=Math.max(...boards.slice(index-5,index).map(b=>b.h))+100;
  return {...board,x:24+columns.slice(0,column).reduce((sum,w)=>sum+w+80,0),y,connected:null};
 });
}

/** Only saved explicit destinations create graph edges; back/close never gain guessed targets. */
export function explicitEdges(design) {
 const ids=new Set(design.screens.map(screen=>screen.id));
 return (design.transitions||[]).filter(edge=>ids.has(edge.fromScreen)&&typeof edge.targetScreen==='string'&&ids.has(edge.targetScreen)).map(edge=>({...edge}));
}

export function flowLayout(design) {
 const boards=design.screens.map(screen=>({id:screen.id,...screenSize(design,screen)})),edges=explicitEdges(design),levels=new Map();
 if(boards.some(board=>board.id===design.entryScreen))levels.set(design.entryScreen,0);
 const queue=[...levels.keys()];
 for(let i=0;i<queue.length;i++) for(const edge of edges.filter(edge=>edge.fromScreen===queue[i])) if(!levels.has(edge.targetScreen)){levels.set(edge.targetScreen,levels.get(queue[i])+1);queue.push(edge.targetScreen);}
 const maxLevel=Math.max(0,...levels.values()),columnWidth=Math.max(390,...boards.map(board=>board.w))+160,rowHeight=Math.max(844,...boards.map(board=>board.h))+110;
 const rows=new Map();let disconnected=0;
 return boards.map(board=>{
  const connected=levels.has(board.id),column=connected?levels.get(board.id):maxLevel+2+(disconnected%5);
  const row=connected?(rows.get(column)||0):Math.floor(disconnected/5);
  if(connected)rows.set(column,row+1);else disconnected++;
  return {...board,x:24+column*columnWidth,y:48+row*rowHeight,connected};
 });
}

export function restorePositions(boards,saved=[]) {
 if(!Array.isArray(saved))return boards.map(board=>({...board}));
 const valid=saved.filter(finitePosition),ids=valid.map(p=>p.id);
 if(new Set(ids).size!==ids.length)return boards.map(board=>({...board}));
 const positions=new Map(valid.map(p=>[p.id,p]));
 return boards.map(board=>positions.has(board.id)?{...board,x:positions.get(board.id).x,y:positions.get(board.id).y}:{...board});
}

export function boardExtent(boards) {
 return {w:Math.max(200,...boards.map(board=>board.x+board.w))+32,h:Math.max(200,...boards.map(board=>board.y+board.h))+32};
}

export function visibleBoardIds(boards,{left,top,width,height,zoom},overscan=240) {
 if(!(width>0&&height>0&&Number.isFinite(zoom)&&zoom>0))return [];
 return boards.filter(b=>(b.x+b.w)*zoom>=left-overscan&&b.x*zoom<=left+width+overscan&&(b.y+b.h)*zoom>=top-overscan&&(b.y-36)*zoom<=top+height+overscan).map(b=>b.id);
}

/** One active read plus one coalesced follow-up prevents stale refresh races. */
export function createOverviewRefresh({read,apply,error}) {
 let pending=null,queued=false,disposed=false;
 return {
  refresh(){
   if(disposed)return Promise.resolve();
   if(pending){queued=true;return pending;}
   pending=(async()=>{do{queued=false;try{const value=await read();if(!disposed)await apply(value);}catch(reason){if(!disposed)error(reason);}}while(queued&&!disposed);})().finally(()=>{pending=null;});
   return pending;
  },
  dispose(){disposed=true;queued=false;}
 };
}
