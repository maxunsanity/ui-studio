// Same native controls, fewer redundant focus changes. No model access.
export function enhance(u){const{t,o}=u;
 u.observe=()=>t.playwright.domSnapshot();
 o.select=async id=>{if(!await t.playwright.locator('.layer-tree').count())await t.playwright.getByRole('button',{name:'레이어',exact:true}).click();const active=await t.playwright.locator('.layer-select.active').evaluateAll(es=>es.map(e=>e.dataset.element));if(!active.includes(id))await t.playwright.locator('.layer-select[data-element="'+id+'"]').click();};
 o.duplicate=async id=>{await o.select(id);await o.detail('.studio-tools');await t.playwright.locator('.studio-tools').getByRole('button',{name:'복제',exact:true}).click();await t.playwright.domSnapshot();return t.playwright.locator('.layer-select.active').evaluate(e=>e.dataset.element);};
 o.box=async(id,r,w,h,preset)=>{await o.select(id);await o.panel('선택 레이어');if(!await t.playwright.getByRole('combobox',{name:'레이어 수치 단위',exact:true}).count()){await o.detail('.responsive-inspector');await t.playwright.getByRole('combobox',{name:'앵커',exact:true}).selectOption({label:'기존 % 배치'});await t.playwright.domSnapshot();}await o.rect(id,r,w,h);if(preset){await o.detail('.responsive-inspector');await t.playwright.getByRole('combobox',{name:'앵커',exact:true}).selectOption({label:preset});await t.playwright.domSnapshot();}};
 o.remove=async id=>{await o.props(id);await t.playwright.getByRole('button',{name:'요소와 하위 요소 삭제',exact:true}).click();await t.playwright.domSnapshot();};
 return u;
}
