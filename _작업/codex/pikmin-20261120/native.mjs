// Public UI actions only. Never accesses the page model or writes design JSON.
export function native(tab,manifest){
 const role=(r,n)=>tab.playwright.getByRole(r,{name:n,exact:true});
 const set=async(n,v,r='textbox')=>{await role(r,n).click();await tab.ax.pressKey(null,'super+a');await tab.ax.pressKey(null,'BACKSPACE');if(String(v))await tab.ax.typeText(null,String(v));await tab.ax.pressKey(null,'Tab');};
 const panel=async n=>{let b=role('button',n);if(await b.getAttribute('aria-pressed')!=='true')await b.click();};
 const props=async()=>{await panel('속성');await panel('설명·기능');};
 const rect=async(x,y,w,h)=>{await panel('선택 레이어');for(let[n,v]of[['X',x],['Y',y],['W',w],['H',h]])await role('spinbutton','레이어 '+n).fill(String(v));await role('button','수치 적용').click();};
 const cmd=async n=>{let m=tab.playwright.locator('summary').filter({hasText:'편집 도구'});if(!(await m.evaluate(e=>e.parentElement.open)))await m.click();await role('button',n).click();if(await m.evaluate(e=>e.parentElement.open))await m.click();};
 const select=async n=>{let exact=String(n).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');await role('tree','레이어 계층').getByRole('button',{name:new RegExp('^'+exact+'(?: 복사)* (?:구성 전체|하위 \\d+개|텍스트|이미지 자리|이미지|버튼|영역|바탕|프레임|카드|스크롤 목록) · ')}).click();};
 const font=async(sz,align='왼쪽',weight=400)=>{let m=tab.playwright.locator('summary').filter({hasText:'텍스트 · 크기와 줄맞춤'});let op=async()=>{if(!(await m.evaluate(e=>e.parentElement.open)))await m.click();};await op();await role('combobox','글자 가로 정렬').selectOption({label:align});await op();await role('combobox','글자 줄바꿈').selectOption({label:'여러 줄'});await op();await set('텍스트 크기 px',sz,'spinbutton');await op();await set('글자 굵기 1~1000',weight,'spinbutton');};
 const text=async(n,t,x,y,w,h,sz=14,align='왼쪽',weight=400)=>{await select('Txt_Pikmin_Base');await cmd('복제');await props();await set('요소 이름',n);await set('화면에 표시할 글',t);await font(sz,align,weight);await rect(x,y,w,h);};
 const image=async(n,file,x,y,w,h,fit='전체 맞춤')=>{await select('Img_Pikmin_Scene');await cmd('복제');await props();await set('요소 이름',n);let id=new URL(await tab.url()).searchParams.get('element'),ref='sha256-'+manifest.find(a=>a.file===file).sha256+'.webp';let sel=role('combobox','저장된 이미지 재사용');let vals=await sel.locator('option').evaluateAll(os=>os.map(o=>o.value));if(vals.includes(ref))await sel.selectOption(ref);else{let p=tab.playwright.waitForEvent('filechooser',{timeout:10000});await role('button','실제 이미지 넣기').click();let f=await p;await f.setFiles(['/Users/max/projest_max/ui-studio/samples/pikmin/ui-studio/assets/'+file]);}await tab.playwright.locator('.preview-canvas [data-element="'+id+'"] img[src*="'+ref+'"]').waitFor({state:'attached',timeout:10000});await select(n);await props();await role('combobox','이미지 맞춤').selectOption({label:fit});await set('불투명도',1,'spinbutton');await set('테두리 두께',0,'spinbutton');await set('모서리 둥글기',0,'spinbutton');await select(n);await rect(x,y,w,h);};
 const press=async()=>{await props();let m=tab.playwright.locator('summary').filter({hasText:'버튼 상태 효과'});if(!(await m.evaluate(e=>e.parentElement.open)))await m.click();let c=role('checkbox','효과 켜기');if(!(await c.evaluate(e=>e.checked)))await c.click();};
 const button=async(n,t,x,y,w,h,sz=14)=>{await text(n,t,x,y,w,h,sz,'가운데',500);await props();await role('combobox','UI 종류').last().selectOption({label:'버튼'});await role('combobox','게임 입력').last().selectOption({label:'자체 동작'});await tab.playwright.getByLabel('백판 색',{exact:true}).fill('#ffffff');await tab.playwright.getByLabel('테두리 색',{exact:true}).fill('#91c5bd');await tab.playwright.getByLabel('글자 색',{exact:true}).fill('#5caaa2');await set('테두리 두께',1,'spinbutton');await set('모서리 둥글기',Math.min(h/2,22),'spinbutton');await press();};
 const choose=async n=>{await role('button','화면').click();await tab.playwright.getByRole('button',{name:new RegExp('^[▣▱] '+n+' (페이지|팝업) · \\d+개 요소$')}).click();await role('button','레이어').click();};
 const blank=async n=>{await role('button','화면').click();let s=await tab.ax.get('state',{disableDiffing:true});let m=s.match(/(\d+) button \(collapsed\) ＋ 게임 화면 추가/);if(m){await tab.ax.click(Number(m[1]));s=await tab.ax.get();}let i=s.match(/(\d+) text field \(settable\) new-screen-name/);if(!i)throw Error('No new screen name field');await tab.ax.setValue(Number(i[1]),n);await tab.ax.pressKey(null,'Tab');await role('button','추가').click();await role('button','레이어').click();};
 const save=()=>role('button','파일에 저장').click();
 const roster=[['pink','서대신동의…',19],['pink','송학산 부근…',16],['pink','날개이',16],['pink','하늘이',16],['purple','서대신동의…',15],['red','케이크',14],['red','서대신동의…',13],['blue','물고리',13],['purple','무검이',12],['purple','뚱뚱이',12],['blue','송학산 부근…',11],['purple','부산중앙여…',11],['red','딸기이',11],['red','불태이',11],['red','까스이',11],['rock','돌돌이',10],['rock','바위 피크민',10],['red','빨강 피크민',10],['yellow','노랑 피크민',10],['blue','파랑 피크민',10]];
 const cell=async i=>{let[species,label,power]=roster[i],x=6+(i%5)*76,y=382+Math.floor(i/5)*92;await image('Btn_Pikmin_'+i,'pikmin-'+species+'-v001.webp',x,y,70,60);await select('Btn_Pikmin_'+i);await props();await role('combobox','UI 종류').last().selectOption({label:'버튼'});await role('combobox','게임 입력').last().selectOption({label:'자체 동작'});await tab.playwright.getByLabel('백판 색',{exact:true}).fill('#ffffff');await set('모서리 둥글기',8,'spinbutton');await press();await text('Txt_Pikmin_'+i+'_Power',String(power),x,y+46,24,18,14,'왼쪽',600);await props();await tab.playwright.getByLabel('글자 색',{exact:true}).fill('#d3b168');await text('Txt_Pikmin_'+i+'_Name',label,x,y+64,70,13,9,'가운데');await text('Txt_Pikmin_'+i+'_Hearts','♥♥',x,y+78,70,12,10,'가운데');await props();await tab.playwright.getByLabel('글자 색',{exact:true}).fill('#dd7a83');};
 const replace=async(n,file)=>{
  await select(n);await props();
  let previous=await role('combobox','UI 종류').last().evaluate(e=>e.value);
  await role('combobox','부품 역할').last().selectOption({label:'이미지'});
  let id=new URL(await tab.url()).searchParams.get('element');
  let ref='sha256-'+manifest.find(a=>a.file===file).sha256+'.webp';
  let picker=role('combobox','저장된 이미지 재사용');
  let values=await picker.locator('option').evaluateAll(os=>os.map(o=>o.value));
  if(values.includes(ref))await picker.selectOption(ref);
  else{
   let ready=tab.playwright.waitForEvent('filechooser',{timeout:10000});
   await role('button','실제 이미지 넣기').click();
   await (await ready).setFiles(['/Users/max/projest_max/ui-studio/samples/pikmin/ui-studio/assets/'+file]);
  }
  await tab.playwright.locator('.preview-canvas [data-element="'+id+'"] img[src*="'+ref+'"]').waitFor({state:'attached',timeout:10000});
  await select(n);await props();
  if(previous!=='image')await role('combobox','UI 종류').last().selectOption(previous);
 };
 return {set,panel,props,rect,cmd,select,font,text,image,replace,press,button,choose,blank,save,cell};
}
