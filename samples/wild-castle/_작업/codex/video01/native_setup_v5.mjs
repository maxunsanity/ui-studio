import {create as setup} from './native_setup_v4.mjs';
export function create(t,assets){const u=setup(t,assets),o=u.o,field=o.field,text=u.text;
 o.field=async(name,value,css)=>{if(css)await o.detail(css);let q=t.playwright.getByRole('textbox',{name,exact:true});if(!await q.count())q=t.playwright.getByRole('spinbutton',{name,exact:true});if(await q.count()){const current=await q.evaluate(e=>e.value);if(current===String(value))return;}return field(name,value,css);};
 u.text=async(...args)=>{const id=await text(...args);u.textBase=id;return id;};
 u.ib=async(role,name,label,r,size=13)=>{const id=await o.duplicate(u.buttonBase),p=await o.parts(id);for(const [ix,n]of [[0,name],[1,'Img_'+name.replace(/^Btn_/,'')+'_Art'],[2,'Txt_'+name.replace(/^Btn_/,'')+'_Label']])await o.rename(p[ix].id,n);await u.clear(id);await o.parent(id,'화면 최상위');await o.box(id,r,390,780,'왼쪽 위 고정');await o.box(p[1].id,[Math.round((r[2]-36)/2),0,36,36],r[2],r[3]);await o.box(p[2].id,[0,r[3]-22,r[2],20],r[2],r[3]);await o.props(p[2].id);await o.field('화면에 표시할 글',label);await o.font(p[2].id,size,800,size+6,'#fff4dc');await u.asset(p[1].id,role);await u.input(id,'자체 동작');await u.tint(id);await o.order(id,'맨 앞으로');return{id,img:p[1].id,txt:p[2].id,parts:p};};
 return u;
}
