# -*- coding: utf-8 -*-
from pathlib import Path
from PIL import Image,ImageDraw
import json,hashlib
s=Path('/Users/max/projest_max/ui-studio/samples/royal-match');p=s/'_작업/codex/video01/assets.json';data=json.loads(p.read_text());S=3
for on in [False,True]:
 im=Image.new('RGBA',(168*S,48*S));d=ImageDraw.Draw(im)
 def rr(b,c,r=10,o=None,w=1):d.rounded_rectangle(tuple(int(v*S)for v in b),radius=r*S,fill=c,outline=o,width=w*S)
 rr((0,3,167,47),'#153a4c',10,'#682b06',1);rr((1,0,166,45),'#ff9c00',10,'#ffe152',2);rr((5,4,162,41),'#4cad00'if on else'#37566b',8);rr((86 if on else 5,4,162 if on else 81,41),'#0073bd',8,'#06457a',2);d.line((int((95 if on else 14)*S),7*S,int((153 if on else 72)*S),7*S),fill='#59c2fa',width=2*S);a=s/'ui-studio/assets/authoring/v001'/('toggle-'+('on'if on else'off')+'.png');im.save(a);f=s/'ui-studio/assets/production/v001'/('toggle-'+('on'if on else'off')+'.webp');im.save(f,'WEBP',quality=96,method=6);role='toggle-'+('on'if on else'off');data['assets']=[x for x in data['assets']if x['role']!=role]+[dict(role=role,path=str(f),authoring=str(a),size=list(im.size),bytes=f.stat().st_size,sha256=hashlib.sha256(f.read_bytes()).hexdigest(),method='new common-canvas native UI geometry, state knob moves left/right, text separate')]
p.write_text(json.dumps(data,ensure_ascii=False,indent=2))
