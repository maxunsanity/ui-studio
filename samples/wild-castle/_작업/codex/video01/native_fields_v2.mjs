export function enhance(u){const {t,o}=u;
 o.field=async(name,value,css)=>{if(css)await o.detail(css);let q=t.playwright.getByRole('textbox',{name,exact:true});if(!await q.count())q=t.playwright.getByRole('spinbutton',{name,exact:true});const current=await q.evaluate(e=>({value:e.value,type:e.type}));if(current.value===String(value))return;if(current.type==='color'){await q.fill(String(value));await t.playwright.getByRole('textbox',{name:'요소 이름',exact:true}).click();}else{await q.press('ControlOrMeta+A');if(String(value)==='')await q.press('Backspace');else await q.pressSequentially(String(value));await q.press('Tab');}await t.playwright.domSnapshot();};
 return u;
}
