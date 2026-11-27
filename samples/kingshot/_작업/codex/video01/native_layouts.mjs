// Every element/connection below is created through visible Studio controls.
export function enhance(u){const{t,o}=u;
 u.close=async(name,r,action='닫기',target='')=>{const id=await u.image('icon-'+(action==='닫기'?'close':'back'),name,r);await o.props(id);await t.playwright.getByRole('combobox',{name:'UI 종류',exact:true}).selectOption({label:'버튼'});await u.input(id,'자체 동작');await u.action(id,action,target,action==='닫기'?'닫기':'이전 · 마을');return id;};
 u.shell=async(name,y,h)=>{const z=await u.image('dim','BG_KS_'+name+'_Dim',[0,0,390,844]);await o.order(z,'맨 뒤로');await u.image('modal','BG_KS_'+name+'_Paper',[12,y,366,h]);await u.image('header','BG_KS_'+name+'_Header',[12,y,366,36]);};
 u.title=async(name,title,y)=>{await u.text('Txt_KS_'+name+'_Title',title,[36,y+3,318,29],20,'#fff7df');await u.close('Btn_KS_'+name+'_Close',[334,y-4,44,44]);};
 return u;
}
