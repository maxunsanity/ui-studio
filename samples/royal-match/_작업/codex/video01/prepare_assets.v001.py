# -*- coding: utf-8 -*-
from pathlib import Path
from PIL import Image,ImageDraw
import json,hashlib,shutil,math
s=Path('/Users/max/projest_max/ui-studio/samples/royal-match');a=s/'ui-studio/assets/authoring/v001';p=s/'ui-studio/assets/production/v001';a.mkdir(parents=True,exist_ok=True);p.mkdir(parents=True,exist_ok=True);assets=[]
def register(role,im,master,method):
 im.thumbnail((1024,1024),Image.Resampling.LANCZOS);f=p/(role+'.webp');im.save(f,'WEBP',quality=94,method=6)
 assert f.stat().st_size<=300000
 assets.append(dict(role=role,path=str(f),authoring=str(master),size=list(im.size),bytes=f.stat().st_size,sha256=hashlib.sha256(f.read_bytes()).hexdigest(),method=method))
for row in json.loads((s/'_작업/codex/video01/art-paths.json').read_text()):
 role=row['role'];src=Path(row['path']);master=a/(role+'.png');shutil.copy2(src,master);im=Image.open(src).convert('RGBA')
 if role not in ['room','room-v002','puzzle-still','throne-room']:
  bounds=im.getchannel('A').point(lambda v:255 if v>=32 else 0).getbbox()
  if bounds:im=im.crop((max(0,bounds[0]-12),max(0,bounds[1]-12),min(im.width,bounds[2]+12),min(im.height,bounds[3]+12)))
 register(role,im,master,'new built-in imagegen; source-reference pixels never reused; mechanical alpha32 bounds and WebP downsample')
S=3
class Pen:
 def __init__(self,d):self.d=d
 def __getattr__(self,n):
  def call(x,*args,**kw):
   def sc(v):return tuple(sc(z) for z in v) if isinstance(v,(tuple,list)) else v*S
   for k in ['width','radius']:
    if k in kw:kw[k]*=S
   return getattr(self.d,n)(sc(x),*args,**kw)
  return call
def rr(d,b,c,r=10,o=None,w=1):d.rounded_rectangle(b,radius=r,fill=c,outline=o,width=w)
def rgb(h):return tuple(int(h[i:i+2],16) for i in (1,3,5))
def grad(im,box,c1,c2,r=0):
 x0,y0,x1,y1=[int(x*S) for x in box];w=x1-x0;h=y1-y0;layer=Image.new('RGBA',(w,h));d=ImageDraw.Draw(layer);u=rgb(c1);v=rgb(c2)
 for y in range(h):
  t=y/max(1,h-1);d.line((0,y,w,y),fill=tuple(int(u[i]*(1-t)+v[i]*t) for i in range(3))+(255,))
 mask=Image.new('L',(w,h),0);ImageDraw.Draw(mask).rounded_rectangle((0,0,w-1,h-1),radius=r*S,fill=255);im.paste(layer,(x0,y0),mask)
def make(role,size,fn):
 im=Image.new('RGBA',(size[0]*S,size[1]*S));d=Pen(ImageDraw.Draw(im));fn(im,d,*size);f=a/(role+'.png');im.save(f);register(role,im,f,'new supersampled native UI geometry; no reference pixels')
def btn(im,d,w,h,pressed=False,color='green'):
 palettes={'green':('#79e700','#1fa200','#0b4f00','#b8ff39'),'orange':('#ffdb2a','#ff9600','#a94300','#fff07a'),'blue':('#178dd3','#00598c','#04394e','#61c7ff'),'purple':('#d357fa','#7908c6','#390368','#eea2ff'),'red':('#ff3b46','#c50018','#69000b','#ff858a')};t,b,edge,hi=palettes[color]
 rr(d,(1,6,w-2,h-1),'#182b24',13,o='#111f26',w=3);rr(d,(3,3,w-4,h-4),edge,11,o='#715b16',w=2);top=7 if pressed else 2;bottom=h-7 if pressed else h-12;grad(im,(6,top,w-6,bottom),t,b,9);d=Pen(ImageDraw.Draw(im));d.line((17,top+4,w-18,top+4),fill=hi,width=3);d.arc((w-48,top+6,w-15,top+18),185,340,fill=hi,width=3);d.line((15,bottom-3,w-16,bottom-3),fill=edge,width=3)
for c in ['green','orange','blue','purple','red']:
 for v in ['normal','pressed']:make('button-'+c+'-'+v,(240,80),lambda im,d,w,h,c=c,v=v:btn(im,d,w,h,v=='pressed',c))
def panel(im,d,w,h):
 rr(d,(1,4,w-2,h-1),'#11324a',28,o='#102b39',w=4);rr(d,(5,2,w-6,h-7),'#12a8e5',24,o='#31d8ed',w=2);rr(d,(11,6,w-12,h-13),'#ff9600',20,o='#ffde3b',w=5);rr(d,(20,16,w-21,h-23),'#005fa9',16,o='#ffe172',w=3);d.line((27,h-25,w-28,h-25),fill='#037fc1',width=2)
make('panel',(472,600),panel)
def ribbon(im,d,w,h):
 d.polygon([(0,28),(32,12),(w//2,1),(w-32,12),(w,28),(w,98),(w-32,83),(w//2,72),(32,83),(0,98)],fill='#008ac8',outline='#58cde6',width=3);d.polygon([(0,35),(32,19),(w//2,8),(w-32,19),(w,35),(w,85),(w-32,72),(w//2,62),(32,72),(0,85)],fill='#075ca7',outline='#ffad00',width=5);d.line((2,36,35,22,w//2,12,w-35,22,w-2,36),fill='#ffe576',width=2)
make('ribbon',(480,108),ribbon)
make('cream-card',(420,300),lambda im,d,w,h:(rr(d,(1,1,w-2,h-2),'#d8cd9e',16,o='#1c4c66',w=3),grad(im,(7,7,w-7,h-7),'#fff6ba','#f4e7af',12)))
make('slate-card',(472,160),lambda im,d,w,h:(rr(d,(1,1,w-2,h-2),'#1c374a',12),grad(im,(4,4,w-4,h-5),'#5b839a','#42677d',10),Pen(ImageDraw.Draw(im)).line((12,6,w-13,6),fill='#99b0ba',width=2)))
make('bar-blue',(504,90),lambda im,d,w,h:(grad(im,(0,0,w,h),'#0063ac','#075299'),Pen(ImageDraw.Draw(im)).line((0,h-5,w,h-5),fill='#ffae00',width=5),Pen(ImageDraw.Draw(im)).line((0,h-10,w,h-10),fill='#ffdf4d',width=2)))
make('nav-bar',(504,84),lambda im,d,w,h:(grad(im,(0,0,w,h),'#0791ed','#0072c2'),Pen(ImageDraw.Draw(im)).line((0,3,w,3),fill='#ffde55',width=4),Pen(ImageDraw.Draw(im)).line((0,9,w,9),fill='#9c6000',width=2)))
make('nav-active',(100,84),lambda im,d,w,h:(grad(im,(0,4,w,h),'#0ea4ff','#0065b2'),Pen(ImageDraw.Draw(im)).line((0,9,w,9),fill='#84d8ff',width=2)))
make('pill-cream',(148,44),lambda im,d,w,h:(rr(d,(0,2,w-1,h-1),'#687179',11),grad(im,(3,3,w-3,h-3),'#fff6d0','#e0d19a',8)))
make('close-red',(60,60),lambda im,d,w,h:(d.ellipse((1,4,w-2,h-1),fill='#790315',outline='#54000a',width=2),d.ellipse((3,1,w-4,h-6),fill='#ee001c',outline='#b10019',width=3),d.arc((8,5,w-9,h-12),190,315,fill='#ff626b',width=4)))
make('dim',(16,16),lambda im,d,w,h:d.rectangle((0,0,w,h),fill=(0,0,0,180)))
make('slate-bg',(16,16),lambda im,d,w,h:d.rectangle((0,0,w,h),fill='#2d4759'))
make('nav-clear',(16,16),lambda im,d,w,h:d.rectangle((0,0,w,h),fill=(0,0,0,0)))
def heart(im,d,w,h):
 d.polygon([(w/2,h*.94),(w*.07,h*.43),(w*.04,h*.25),(w*.15,h*.09),(w*.33,h*.05),(w*.5,h*.20),(w*.67,h*.05),(w*.85,h*.09),(w*.96,h*.25),(w*.93,h*.43)],fill='#c4001c',outline='#6b1320',width=3);d.ellipse((7,3,w*.53,h*.6),fill='#ff263f');d.ellipse((w*.39,3,w-7,h*.6),fill='#f2102f');d.polygon([(9,h*.38),(w/2,h*.86),(w-8,h*.38)],fill='#ed0828');d.arc((11,7,w*.46,h*.36),190,290,fill='#ffacb6',width=4)
make('heart',(64,64),heart)
def star(im,d,w,h):
 pts=[]
 for i in range(10):
  ang=-math.pi/2+i*math.pi/5;r=w*(.47 if i%2==0 else .23);pts.append((w/2+math.cos(ang)*r,h/2+math.sin(ang)*r))
 d.polygon(pts,fill='#ffc615',outline='#cf7000',width=2)
 for i in range(0,10,2):d.polygon([(w/2,h/2),pts[i],pts[(i+1)%10]],fill='#ffe97a')
make('star',(64,64),star)
def coin(im,d,w,h):
 d.ellipse((1,3,w-2,h-1),fill='#c77800',outline='#914000',width=2);d.ellipse((3,1,w-4,h-5),fill='#ffbd00',outline='#ffe577',width=3);d.ellipse((9,7,w-10,h-11),fill='#ffca20',outline='#e69500',width=2);d.polygon([(18,36),(15,21),(24,26),(32,16),(40,26),(49,21),(46,36)],fill='#f58d00',outline='#ffe36d',width=2)
make('coin',(64,64),coin)
def gear(im,d,w,h):
 for i in range(12):
  ang=i*math.pi/6;x=w/2+22*math.cos(ang);y=h/2+22*math.sin(ang);d.ellipse((x-6,y-6,x+6,y+6),fill='#ffe6a0',outline='#714c16',width=1)
 d.ellipse((10,10,w-10,h-10),fill='#f5d878',outline='#815620',width=2);d.ellipse((23,23,w-23,h-23),fill='#076bad',outline='#39445b',width=2)
make('gear',(64,64),gear)
(s/'_작업/codex/video01/assets.json').write_text(json.dumps({'assets':assets},ensure_ascii=False,indent=2));print(len(assets),'assets <=300KB')
