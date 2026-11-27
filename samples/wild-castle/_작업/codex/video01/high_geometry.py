# coding:utf-8
from PIL import Image,ImageDraw
from pathlib import Path
import json,hashlib
r=Path('/Users/max/projest_max/ui-studio/samples/wild-castle'); w=r/'_작업/codex/video01';a=json.loads((w/'assets.json').read_text());out=r/'ui-studio/assets/production/v003';master=r/'ui-studio/assets/authoring/v003'
def done(role,size,paint):
 im=Image.new('RGBA',(size[0]*4,size[1]*4));d=ImageDraw.Draw(im);paint(d,4);im=im.resize(size,Image.Resampling.LANCZOS);mp=master/(role+'.png');im.save(mp);p=out/(role+'.webp');im.save(p,'WEBP',lossless=True,method=6);b=p.read_bytes();a.append(dict(role=role,path=str(p),master=str(mp),sha256=hashlib.sha256(b).hexdigest(),size=list(size),bytes=len(b),method='Fresh code-native geometry, supersampled 4x'))
def trade(d,s,pressed):
 d.rounded_rectangle((0,2*s,130*s-1,44*s-1),radius=8*s,fill='#282346'); y=(3 if pressed else 0)*s
 d.rounded_rectangle((s,y,129*s,39*s+y),radius=7*s,fill='#6431be',outline='#b795ff',width=s)
 d.rounded_rectangle((3*s,y+s,127*s,y+34*s),radius=6*s,fill='#8850e6');d.line((7*s,y+3*s,122*s,y+3*s),fill='#b993ff',width=s)
for st in ['normal','pressed']:done('button-trade-'+st,(130,44),lambda d,s:trade(d,s,st=='pressed'))
def diamond(d,s):
 pts=[(27*s,0),(54*s-1,27*s),(27*s,54*s-1),(0,27*s)];d.polygon(pts,fill='#465361');d.polygon([(27*s,3*s),(51*s,27*s),(27*s,51*s),(3*s,27*s)],fill='#d5e0e6');d.line([(27*s,3*s),(51*s,27*s),(27*s,51*s),(3*s,27*s),(27*s,3*s)],fill='#fbffff',width=2*s)
done('menu-diamond',(54,54),diamond)
def lv(d,s):d.rounded_rectangle((0,0,108*s-1,25*s-1),radius=2*s,fill='#4d3025',outline='#7b6157',width=s)
done('hud-level-high',(108,25),lv)
(w/'assets.json').write_text(json.dumps(a,ensure_ascii=False,indent=2));print(len(a),max(x['bytes'] for x in a))
