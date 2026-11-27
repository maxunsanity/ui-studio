import {gridLayout} from './overview-layout.mjs';

const MENU_BOARD_HEIGHT=304;
const assets='/ui-studio/source/guide/reference/kpop-lobby/review-2/';

export function reviewGrid(design,review) {
 if(!Array.isArray(review?.boards)||!review.boards.includes(design.entryScreen))return gridLayout(design);
 const screens=design.screens.filter(screen=>review.boards.includes(screen.id));
 return gridLayout({...design,screens}).map(board=>board.id===review.parts
  ? {...board,h:board.h+MENU_BOARD_HEIGHT}
  : board);
}

export function appendReviewMenus(page,host,design,review,top) {
 const part=page.createElement('section');
 part.className='overview-review-menus';
 Object.assign(part.style,{position:'absolute',top:top+'px',left:'0',right:'0',height:MENU_BOARD_HEIGHT+'px',padding:'12px 18px',boxSizing:'border-box',background:'#f5f6f8',color:'#24313d',font:'16px/1.3 system-ui,sans-serif',borderTop:'1px solid #c3cbd4'});
 const heading=page.createElement('strong');
 heading.textContent='드롭다운 메뉴 · 공통 프레임';
 heading.style.fontSize='21px';
 part.append(heading);
 const group=page.createElement('div');
 Object.assign(group.style,{display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:'22px',marginTop:'8px'});
 for(const menu of review.menus||[]){
  const screen=design.screens.find(screen=>screen.id===menu.screen);
  if(!screen)continue;
  const column=page.createElement('section'),title=page.createElement('div'),list=page.createElement('div');
  title.textContent=screen.name+' · '+menu.direction;
  Object.assign(title.style,{fontWeight:'650',marginBottom:'6px',whiteSpace:'nowrap'});
  Object.assign(list.style,{border:'6px solid transparent',borderImage:'url('+assets+'dropdown-frame.png) 10 fill / 6px stretch'});
  const labels=screen.elements.filter(element=>element.kind==='text'&&element.partRole==='label');
  for(const [index,label] of labels.entries()){
   const row=page.createElement('div'),icon=page.createElement('span');
   Object.assign(row.style,{display:'flex',alignItems:'center',gap:'10px',height:'36px',paddingInline:'10px',borderTop:index?'1px solid #d7dce2':'none'});
   Object.assign(icon.style,{display:'inline-block',width:'18px',height:'18px',background:'url('+assets+'dropdown-icons.png) -'+(Number(menu.icons?.[index]||0)*18)+'px 0 / 162px 18px no-repeat'});
   row.append(icon,label.text);
   if(label.text==='개발 메뉴'){
    const note=page.createElement('small');note.textContent='개발용';note.style.marginLeft='auto';row.append(note);
   }
   if(label.text==='팀'){
    const note=page.createElement('small');note.textContent='팀이 있을 때';note.style.marginLeft='auto';row.append(note);
   }
   list.append(row);
  }
  column.append(title,list);group.append(column);
 }
 part.append(group);host.append(part);
}
