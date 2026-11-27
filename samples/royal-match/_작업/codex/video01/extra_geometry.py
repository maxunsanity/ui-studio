# -*- coding: utf-8 -*-
from pathlib import Path
from PIL import Image,ImageDraw
import json,hashlib
s=Path('/Users/max/projest_max/ui-studio/samples/royal-match');p=s/'_작업/codex/video01/assets.json';data=json.loads(p.read_text());S=3
jobs=[('coin-card',(140,180),'coin'),('collection-card',(464,660),'cream'),('profile-info',(504,182),'slate'),('profile-records',(504,416),'slate'),('profile-cream',(472,304),'cream'),('settings-toggles',(488,200),'slate'),('settings-actions',(488,188),'slate'),('request-card',(368,140),'cream'),('rank-tabs',(504,90),'slate'),('panel-tall',(472,760),'panel'),('row-cream',(440,90),'cream'),('row-slate',(472,90),'slate'),('chat-notice',(480,36),'cyan'),('shop-special',(440,190),'shop'),('page-header',(504,100),'header')]
for role,(w,h),kind in jobs:
 im=Image.new('RGBA',(w*S,h*S));d=ImageDraw.Draw(im)
 def rr(box,fill,r=12,outline=None,width=1):d.rounded_rectangle(tuple(round(v*S)for v in box),radius=r*S,fill=fill,outline=outline,width=width*S)
 if kind=='panel':
  rr((1,4,w-2,h-1),'#11324a',28,'#102b39',4);rr((5,2,w-6,h-7),'#12a8e5',24,'#31d8ed',2);rr((11,6,w-12,h-13),'#ff9600',20,'#ffde3b',5);rr((20,16,w-21,h-23),'#005fa9',16,'#ffe172',3)
 elif kind=='coin':
  rr((1,1,w-2,h-2),'#ffad0a',12,'#9e540c',3);rr((7,6,w-8,h-8),'#fff0b6',9,'#d3be8a',2);rr((7,118,w-8,h-8),'#ffab00',6)
 elif kind=='header':
  d.rectangle((0,0,w*S,h*S),fill='#0558a1');d.line((0,(h-7)*S,w*S,(h-7)*S),fill='#ffdb43',width=3*S);d.line((0,(h-3)*S,w*S,(h-3)*S),fill='#ff9200',width=4*S)
 else:
  palette={'cream':('#c8b78d','#fff3bb','#e5d09f'),'slate':('#1b3549','#5d879f','#40677d'),'cyan':('#14798d','#73e4ee','#31b5cd'),'shop':('#d76a00','#ffe224','#ffad0d')};edge,top,bot=palette[kind];rr((1,4,w-2,h-1),edge,12,'#123347',2);rr((4,2,w-5,h-6),top,10);rr((8,h*.55,w-9,h-8),bot,8);d.line((12*S,5*S,(w-12)*S,5*S),fill='#fff2bb'if kind in ['cream','shop']else'#9bd1db',width=2*S)
 a=s/'ui-studio/assets/authoring/v001'/f'{role}.png';f=s/'ui-studio/assets/production/v001'/f'{role}.webp';im.save(a);im.thumbnail((1024,1024));im.save(f,'WEBP',quality=94,method=6);row=dict(role=role,path=str(f),authoring=str(a),size=list(im.size),bytes=f.stat().st_size,sha256=hashlib.sha256(f.read_bytes()).hexdigest(),method='new native geometry at target family dimensions, supersampled; no source pixels');data['assets']=[a for a in data['assets']if a['role']!=role]+[row]
p.write_text(json.dumps(data,ensure_ascii=False,indent=2));print(len(data['assets']))
