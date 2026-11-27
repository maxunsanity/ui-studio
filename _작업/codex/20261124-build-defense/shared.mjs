import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {validateDocument} from '/Users/max/projest_max/ui-studio/src/tools/uxStudio/model.mjs';
export const dir='/Users/max/projest_max/ui-guideline-israt/ui-studio/designs';
export const readDesign=id=>JSON.parse(readFileSync(dir+'/'+id+'.json'));
export const hud=readDesign('import-6604270d');
const hudMain=hud.screens.find(s=>s.id==='main');
export const photocard=readDesign('import-6b577b09');
export const skinBase=structuredClone(photocard.screens.find(s=>s.id==='list').elements.find(e=>e.id==='list.back').skin);
export const skin=tone=>({...structuredClone(skinBase),tone});
export const get=(s,key)=>s.elements.find(e=>e.id===s.id+'.'+key);
export const hex=(s,v)=>/^#[a-f0-9]{6}$/i.test(v??'')?v:s;
export const tone={white:'#ffffff',soft:'#eef1f4',mid:'#d3dce5',active:'#c5ccd3',muted:'#e3e7eb',ink:'#253342'};
export function saveDraft(name,d,assets={}){
 const folder=new URL('assets/',import.meta.url);mkdirSync(folder,{recursive:true});
 for(const e of (name==='hud'?[]:d.screens.flatMap(s=>s.elements))){
  if(e.image?.asset!==undefined||e.image?.assetRef)continue;
  const data=e.image?.src?.match(/^data:image\/(png|jpeg|webp);base64,(.+)$/s);
  if(!data||(!e.image.sourceSize&&data[1]!=='png'))continue;
  const bytes=Buffer.from(data[2],'base64');
  const ext=data[1]==='jpeg'?'jpg':data[1];
  const key='sha256-'+createHash('sha256').update(bytes).digest('hex')+'.'+ext;
  const local=new URL(key,folder);writeFileSync(local,bytes);
  assets[key]=fileURLToPath(local); e.image.src=''; e.image.assetRef=key;
  if(!e.image.sourceSize&&ext==='png')e.image.sourceSize=[bytes.readUInt32BE(16),bytes.readUInt32BE(20)];
 }
 validateDocument(d);
 writeFileSync(new URL(name+'.json',import.meta.url),JSON.stringify(d,null,2)+'\n');
 writeFileSync(new URL(name+'-assets.json',import.meta.url),JSON.stringify(assets));
}
const dockSlots=['cards','calendar','hammer','check','shop','person'];
export const hudIcon=key=>structuredClone(hudMain.elements.find(e=>e.id==='main.dock.'+key+'.img')?.image);
export function dock(screen, active) {
 const at=screen.elements.findIndex(e=>e.id===screen.id+'.dock');
 if(at<0)return;
 const existing=screen.elements.filter(e=>e.id===screen.id+'.dock'||e.id.startsWith(screen.id+'.dock.'));
 const items=[];
 for(const [i,key] of dockSlots.entries()){
  const x=.25+i*16.67;
  const label=existing.find(e=>e.id.endsWith('.'+key+'.label'));
  if(key===active)items.push({id:screen.id+'.dock.selected',kind:'panel',name:'선택 메뉴',partRole:'container',x:x+.5,y:92.15,w:15.1,h:7.3,text:'',skin:skin(tone.mid)});
  const image=hudIcon(key);
  if(image)items.push({id:screen.id+'.dock.'+key+'.img',kind:'image',name:image.alt,x:x+4.55,y:92.73,w:6.9,h:3.2,text:'',partRole:'image',image});
  if(label)items.push({...label,x,y:96.05,w:16.1,h:3.05});
 }
 screen.elements=screen.elements.filter(e=>!existing.includes(e));
 screen.elements.splice(at,0,existing[0],...items);
}
export function shape(s,key,name,kind,x,y,w,h,opts={}){
 const e={id:s.id+'.'+key,name,kind,x:x/3.9,y:y/8.44,w:w/3.9,h:h/8.44,text:'',partRole:opts.role??'container'};
 if(opts.fill)e.appearance={shape:'rounded',stroke:opts.fill,fill:opts.fill,strokeWidth:0,radius:opts.radius??0};
 if(opts.frame)e.skin=skin(opts.frame);
 if(opts.parentId)e.parentId=opts.parentId;
 s.elements.push(e);
 return e;
}
export function text(s,key,value,x,y,w,h,{size=13,weight=550,align='left',color=tone.ink,parentId,percent=false,wrap='nowrap'}={}) {
 const e=shape(s,key,value,'text',x,y,w,h,{role:'label'});
 if(percent)Object.assign(e,{x,y,w,h});
 Object.assign(e,{text:value,fontSize:size,typography:{family:'system',weight,lineHeight:Math.round(size*1.2),align,vertical:'middle',wrap,overflow:'ellipsis'},appearance:{textColor:color}});
 if(parentId)Object.assign(e,{parentId,interaction:{mode:'parent',enabled:true,shape:'rectangle',reason:''}});
 return e;
}
export function attach(d,s,e,action,to,payload) {
 const tr={id:e.id+'.link',fromScreen:s.id,fromElement:e.id,event:'click',condition:'always',action,targetScreen:to??null,label:e.name};
 if(payload)tr.payload=payload;
 d.transitions.push(tr);
}
export function btn(d,s,key,label,x,y,w,h,{action='navigate',to,payload,fill=tone.white,size=13,link=true}={}){
 const e=shape(s,key,label,'button',x,y,w,h,{frame:fill});
 e.interaction={mode:'action',enabled:true,shape:'rectangle',reason:''};
 if(label)text(s,key+'.label',label,3,0,94,100,{size,weight:750,align:'center',parentId:e.id,percent:true});
 if(link&&(to||['close','back','module','feedback'].includes(action)))attach(d,s,e,action,to,payload);
 return e;
}
