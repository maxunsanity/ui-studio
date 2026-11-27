import {create as setup} from './native_setup_v5.mjs';
export function create(t,assets){const u=setup(t,assets),asset=u.asset;
 u.asset=async(id,role,...args)=>asset(id,role==='header'?'header-v002':role,...args);
 u.area=async(role,name,r,parent='화면 최상위',pw=390,ph=844)=>{const id=await u.image(role,name,r,parent,pw,ph);await u.o.props(id);await t.playwright.getByRole('combobox',{name:'UI 종류',exact:true}).selectOption({label:'영역'});await u.observe();return id;};
 return u;
}
