import {create as setup} from './native_setup.mjs';
export function create(t,assets){const u=setup(t,assets),o=u.o;
 u.tint=async id=>{await o.props(id);await o.detail('.button-state-inspector');await t.playwright.getByRole('checkbox',{name:'효과 켜기',exact:true}).check();await o.detail('.button-state-inspector');await t.playwright.getByRole('combobox',{name:'효과 방식',exact:true}).selectOption({label:'기본 색 변화'});await u.observe();};
 const close=u.close;u.close=async(...args)=>{const id=await close(...args);await u.tint(id);return id;};
 return u;
}
