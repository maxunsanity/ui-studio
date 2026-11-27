from pathlib import Path
from PIL import Image, ImageDraw
import json,shutil,hashlib,math
s=Path('/Users/max/projest_max/ui-studio/samples/capybara-go');root=s.parents[1];work=s/'_작업/codex/shop01';prod=s/'ui-studio/assets/production/shop';master=s/'ui-studio/assets/authoring/shop/v001';stage=root/'src/tools/uxStudio/assets/import-staging/capybara-go'
for p in [work,prod,master,stage]:p.mkdir(parents=True,exist_ok=True)
manifest=work/'assets.json';assets=json.loads(manifest.read_text())['assets'] if manifest.exists() else []
def add(role,im,method,source='',prompt=''):
 if any(a['role']==role for a in assets):return
 m=master/f'capybara_shop_{role}_v001.png'
 if source:shutil.copy2(source,m)
 else:im.save(m)
 if source:
  im=im.convert('RGBA');bb=im.getchannel('A').point(lambda a:255 if a>=32 else 0).getbbox()
  if bb:im=im.crop((max(0,bb[0]-2),max(0,bb[1]-2),min(im.width,bb[2]+2),min(im.height,bb[3]+2)))
  im.putalpha(im.getchannel('A').point(lambda a:0 if a<4 else a));im.thumbnail((480,480),Image.Resampling.LANCZOS);fin=Image.new('RGBA',(im.width+8,im.height+8));fin.alpha_composite(im,(4,4));im=fin
 p=prod/f'capybara_shop_{role}_v001.webp';im.save(p,'WEBP',quality=92,method=6);shutil.copy2(p,stage/p.name)
 assert p.stat().st_size<=300000
 assets.append(dict(role=role,master=str(m),production=str(p),uiPath='/ui-studio/source/assets/import-staging/capybara-go/'+p.name,sha256=hashlib.sha256(p.read_bytes()).hexdigest(),method=method,source=source,prompt=prompt,applied=False))
for f in sorted(Path('work/capybara-guide').glob('shop-art-batch*.json')):
 for a in json.loads(f.read_text())['assets']:add(a['role'],Image.open(a['source']),'built-in imagegen; alpha32 bbox+2',a['source'],a['prompt'])
def geo(role,size,fn):
 im=Image.new('RGBA',size);fn(ImageDraw.Draw(im),im);add(role,im,'new geometry; source pixels0')
def panel(role,size,base,top,footer=None):
 def fn(d,im):
  w,h=size;d.rounded_rectangle((1,3,w-2,h-1),radius=13,fill='#080a0d');d.rounded_rectangle((2,1,w-3,h-6),radius=11,fill=base,outline='#0b0b10',width=3)
  cx=w*.30;cy=h*.62
  for k in range(0,360,28):
   p=[(cx,cy)]+[(cx+1200*math.cos(math.radians(a)),cy+1200*math.sin(math.radians(a))) for a in [k,k+10]];d.polygon(p,fill=top)
  d.rectangle((5,5,w-6,42),fill=top)
  if footer:d.rectangle((5,h-52,w-6,h-8),fill=footer)
  # keep rounded edges after rays using mask
  mask=Image.new('L',size);ImageDraw.Draw(mask).rounded_rectangle((2,1,w-3,h-6),radius=11,fill=255);im.putalpha(mask)
  d.rounded_rectangle((2,1,w-3,h-6),radius=11,outline='#0b0b10',width=4)
 geo(role,size,fn)
geo('section',(504,44),lambda d,im:(d.rectangle((0,0,503,43),fill='#744c40'),d.line((0,1,503,1),fill='#302124',width=4),d.line((0,41,503,41),fill='#302124',width=4),*[d.line((x,y,x+12,y),fill='#543b36',width=3) for x in [0,490] for y in [15,29]]))
panel('package',(470,220),'#ff9b0d','#ff8307','#da4b2c');panel('season',(470,146),'#ff9010','#8e0037');panel('limited',(470,224),'#ff8f0a','#f33326');panel('legend',(470,220),'#ff8d05','#f54806');panel('adventurer',(230,330),'#00c4d3','#0899a5');panel('hero',(230,330),'#ab49ee','#7e32cb')
for role,color in [('orange-button','#ff9d03'),('green-button','#9ddd00'),('cyan-button','#00c4e9'),('tab-active','#f6ba22'),('tab-inactive','#302627')]:
 geo(role,(118,48),lambda d,im,c=color:(d.rounded_rectangle((1,3,116,47),radius=7,fill='#4c2921'),d.rounded_rectangle((1,1,116,43),radius=7,fill=c,outline='#211820',width=3)))
geo('bubble',(220,96),lambda d,im:(d.rounded_rectangle((18,0,219,95),radius=6,fill='#720e13'),d.polygon([(0,52),(24,48),(24,72)],fill='#720e13')))
geo('bubble-blue',(216,66),lambda d,im:(d.rounded_rectangle((1,0,215,54),radius=6,fill='#003e65'),d.polygon([(88,50),(102,65),(117,50)],fill='#003e65')))
geo('bubble-purple',(216,66),lambda d,im:(d.rounded_rectangle((1,0,215,54),radius=6,fill='#3d066a'),d.polygon([(88,50),(102,65),(117,50)],fill='#3d066a')))
geo('progress',(380,20),lambda d,im:d.rounded_rectangle((0,0,379,19),radius=10,fill='#050505'))
geo('tabs-base',(504,70),lambda d,im:(d.rectangle((0,0,503,69),fill='#4e3937'),d.line((0,1,503,1),fill='#211a22',width=4),d.line((0,67,503,67),fill='#211a22',width=4)))
geo('key',(36,36),lambda d,im:(d.ellipse((16,2,32,18),fill='#efbb2d',outline='#9f4f0d',width=3),d.line((21,16,7,31),fill='#efbb2d',width=7),d.line((8,24,13,29),fill='#efbb2d',width=4)))
manifest.write_text(json.dumps({'assets':assets},ensure_ascii=False,indent=2)+'\n');print('shop assets',len(assets))
