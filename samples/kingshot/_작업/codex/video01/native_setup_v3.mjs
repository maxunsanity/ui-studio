import {create as setup} from './native_setup_v2.mjs';
export function create(t,assets){const u=setup(t,assets),o=u.o;
 u.setCheck=async(q,value)=>{if(await q.evaluate(e=>e.checked)!==value)await q.click();await t.playwright.domSnapshot();};
 u.tint=async id=>{await o.props(id);await o.detail('.button-state-inspector');await u.setCheck(t.playwright.getByRole('checkbox',{name:'효과 켜기',exact:true}),true);await o.detail('.button-state-inspector');await t.playwright.getByRole('combobox',{name:'효과 방식',exact:true}).selectOption({label:'기본 색 변화'});await u.observe();};
 return u;
}
