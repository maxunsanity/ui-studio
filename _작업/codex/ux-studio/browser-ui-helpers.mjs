export function createUIHelpers(){
const ui={};
ui.state=t=>t.ax.get('state',{disableDiffing:true});
ui.select=async(t,id)=>{if(!await t.playwright.locator('.layer-tree').count())await t.playwright.getByRole('button',{name:'레이어',exact:true}).click();const l=t.playwright.locator('.layer-tree .layer-select[data-element="'+id+'"]');if(!await l.innerText())throw Error('Missing visible layer '+id);await l.click();};
ui.props=async(t,id)=>{await ui.select(t,id);await t.playwright.getByRole('button',{name:'속성',exact:true}).click();await t.playwright.getByRole('button',{name:'설명·기능',exact:true}).click();};
ui.details=async(t,css)=>{if(!await t.playwright.locator(css).evaluate(e=>e.open))await t.playwright.locator(css+' > summary').click();};
ui.field=async(t,name,value,kind)=>{const a=await ui.state(t);const lines=a.split('\n').filter(l=>/^\s*\d+\s/.test(l)&&kind.test(l)&&(l.endsWith(' '+name)||l.includes(' '+name+',')));if(lines.length!==1)throw Error('Field count '+name+' '+lines.length);await t.ax.setValue(Number(lines[0].match(/^\s*(\d+)/)[1]),String(value));await t.ax.pressKey(null,'Tab');};
ui.edit=(t,n,v)=>ui.field(t,n,v,/text field|text entry area|color well/);
ui.num=async(t,n,v,css)=>{if(css)await ui.details(t,css);await ui.field(t,n,v,/stepper/);};
ui.rectPx=async(t,id,r,w,h)=>{await ui.select(t,id);await t.playwright.getByRole('button',{name:'선택 레이어',exact:true}).click();await t.playwright.getByRole('combobox',{name:'레이어 수치 단위',exact:true}).selectOption({label:'%'});const p=[100*r[0]/w,100*r[1]/h,100*r[2]/w,100*r[3]/h];for(let i=0;i<4;i++)await t.playwright.getByRole('spinbutton',{name:'레이어 '+['X','Y','W','H'][i],exact:true}).fill(String(p[i]));await t.playwright.getByRole('button',{name:'수치 적용',exact:true}).click();};
ui.parent=async(t,id,name)=>{await ui.select(t,id);await t.playwright.getByRole('button',{name:'선택 레이어',exact:true}).click();await t.playwright.getByRole('combobox',{name:'부모 레이어',exact:true}).selectOption({label:name});};
ui.command=async(t,name)=>{const d=t.playwright.locator('.edit-menu');if(!await d.evaluate(e=>e.open))await d.locator('summary').click();await d.getByRole('button',{name,exact:true}).click();};
ui.duplicate=async(t,id)=>{await ui.select(t,id);await ui.command(t,'복제');const n=await t.playwright.evaluate(()=>document.querySelector('.layer-select.active')?.dataset.element);if(n===id)throw Error('Duplicate did not create a layer');return n;};
ui.children=async(t,id)=>{await ui.select(t,id);return t.playwright.locator('.layer-select[data-element="'+id+'"]').evaluate(e=>[...e.closest('.layer-item').querySelectorAll('.layer-select')].map(n=>({id:n.dataset.element,name:n.innerText.split('\n')[0]})));};
ui.save=t=>t.playwright.getByRole('button',{name:'파일에 저장',exact:true}).click();
ui.screen=async(t,name)=>{await t.playwright.getByRole('button',{name:'화면',exact:true}).click();const l=(await ui.state(t)).split('\n').find(l=>l.includes(' button ▣ '+name+' ')&&l.endsWith('개 요소'));if(!l)throw Error('Page not found '+name);await t.ax.click(Number(l.match(/^\s*(\d+)/)[1]));};
ui.skinArrays=async(t,values)=>{const groups=['원본 분할 px (상·우·하·좌)','화면 고정폭 px (상·우·하·좌)','내용 여백 px (상·우·하·좌)'];for(let k=0;k<3;k++)for(let i=0;i<4;i++){const a=await ui.state(t);const lines=a.slice(a.indexOf('container '+groups[k])).split('\n');const l=lines.find(l=>/stepper/.test(l)&&l.includes(' '+['상','우','하','좌'][i]+','));await t.ax.setValue(Number(l.match(/^\s*(\d+)/)[1]),String(values[k][i]));await t.ax.pressKey(null,'Tab');}};
return ui;
}
