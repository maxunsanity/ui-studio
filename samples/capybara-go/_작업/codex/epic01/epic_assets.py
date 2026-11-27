from pathlib import Path
from PIL import Image, ImageDraw
import json,shutil,hashlib,math
s=Path('/Users/max/projest_max/ui-studio/samples/capybara-go');root=s.parents[1];work=s/'_작업/codex/epic01';prod=s/'ui-studio/assets/production/epic';master=s/'ui-studio/assets/authoring/epic/v001';stage=root/'src/tools/uxStudio/assets/import-staging/capybara-go'
for p in [work,prod,master,stage]:p.mkdir(parents=True,exist_ok=True)
manifest=work/'assets.json';assets=json.loads(manifest.read_text())['assets'] if manifest.exists() else []
def add(role,im,method,source='',prompt=''):
 if any(a['role']==role for a in assets):return
 m=master/f'capybara_epic_{role}_v001.png'
 if source:shutil.copy2(source,m)
 else:im.save(m)
 if source and role=='ranking-scene':
  im=im.convert('RGB').resize((504,410),Image.Resampling.LANCZOS)
 elif source:
  im=im.convert('RGBA');bb=im.getchannel('A').point(lambda a:255 if a>=32 else 0).getbbox()
  if bb:im=im.crop((max(0,bb[0]-2),max(0,bb[1]-2),min(im.width,bb[2]+2),min(im.height,bb[3]+2)))
  im.putalpha(im.getchannel('A').point(lambda a:0 if a<4 else a));im.thumbnail((480,480),Image.Resampling.LANCZOS);fin=Image.new('RGBA',(im.width+8,im.height+8));fin.alpha_composite(im,(4,4));im=fin
 p=prod/f'capybara_epic_{role}_v001.webp';im.save(p,'WEBP',quality=92,method=6);shutil.copy2(p,stage/p.name)
 assert p.stat().st_size<=300000
 assets.append(dict(role=role,master=str(m),production=str(p),uiPath='/ui-studio/source/assets/import-staging/capybara-go/'+p.name,sha256=hashlib.sha256(p.read_bytes()).hexdigest(),method=method,source=source,prompt=prompt,applied=False))
for f in sorted(Path('work/capybara-guide').glob('epic-art-batch*.json')):
 for a in json.loads(f.read_text())['assets']:add(a['role'],Image.open(a['source']),'built-in imagegen; alpha32 bbox+2',a['source'],a['prompt'])
def geo(role,size,fn):
 im=Image.new('RGBA',size);fn(ImageDraw.Draw(im),im);add(role,im,'new geometry; source pixels0')


def panel(d,im):
 w,h=im.size
 d.rounded_rectangle((1,1,w-2,h-2),radius=5,fill='#09abd6',outline='#194662',width=3);d.rounded_rectangle((12,40,w-13,h-12),radius=15,fill='#0879bc')
 d.polygon([(2,400),(w-2,350),(w-2,380),(2,448)],fill='#36c7d3');d.polygon([(2,458),(w-2,406),(w-2,h-2),(2,h-2)],fill='#34bdc7')
 for x,y in [(22,30),(90,200),(444,31),(431,321),(188,500),(56,552)]:d.ellipse((x,y,x+3,y+3),fill='#6adce4')
geo('panel',(462,586),panel)
geo('scroll-fill',(32,32),lambda d,im:d.rectangle((0,0,31,31),fill='#0879bc'))
geo('ribbon',(402,60),lambda d,im:(d.polygon([(28,4),(3,24),(10,55),(38,55),(38,4)],fill='#006a9c',outline='#123948',width=3),d.polygon([(374,4),(399,24),(392,55),(364,55),(364,4)],fill='#006a9c',outline='#123948',width=3),d.rounded_rectangle((22,1,379,43),radius=3,fill='#03c4e1',outline='#176c83',width=2),d.rectangle((24,41,377,47),fill='#0488af')))
geo('cashback',(194,90),lambda d,im:(d.polygon([(2,2),(192,2),(192,62),(115,62),(94,87),(97,63),(2,63)],fill='#fb0663',outline='#441d2f',width=4),d.rectangle((6,8,188,19),fill='#ff1b7c')))
for role,lower in [('active','#ff8700'),('locked','#0b63bd')]:
 def step(d,im,lo=lower):
  d.rounded_rectangle((1,1,402,142),radius=12,fill=lo,outline='#2d2832',width=4);d.rounded_rectangle((4,4,399,86),radius=10,fill='#ffe7bc');d.rectangle((4,72,399,85),fill='#ffe7bc');d.rounded_rectangle((21,20,382,66),radius=5,fill='#f3d09e')
 geo('step-'+role,(404,144),step)
geo('down-arrow',(48,28),lambda d,im:d.polygon([(2,2),(46,2),(46,9),(24,26),(2,9)],fill='#cff31b',outline='#223e30',width=3))
for role,c in [('orange','#ef9c29'),('purple','#8b2bd0')]:geo('reward-'+role,(64,64),lambda d,im,c=c:(d.rounded_rectangle((1,1,62,62),radius=4,fill=c,outline='#452f25',width=3),d.rectangle((6,6,57,57),outline='#ffe3a9',width=2)))
manifest.write_text(json.dumps({'assets':assets},ensure_ascii=False,indent=2)+'\n');print('epic assets',len(assets))
