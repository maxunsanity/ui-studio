from pathlib import Path
from PIL import Image, ImageDraw
import json,shutil,hashlib,math
s=Path('/Users/max/projest_max/ui-studio/samples/capybara-go');root=s.parents[1];work=s/'_작업/codex/seven01';prod=s/'ui-studio/assets/production/seven';master=s/'ui-studio/assets/authoring/seven/v001';stage=root/'src/tools/uxStudio/assets/import-staging/capybara-go'
for p in [work,prod,master,stage]:p.mkdir(parents=True,exist_ok=True)
manifest=work/'assets.json';assets=json.loads(manifest.read_text())['assets'] if manifest.exists() else []
def add(role,im,method,source='',prompt=''):
 if any(a['role']==role for a in assets):return
 m=master/f'capybara_seven_{role}_v001.png'
 if source:shutil.copy2(source,m)
 else:im.save(m)
 if source and role.endswith('-scene'):
  im=im.convert('RGB').resize((440,132),Image.Resampling.LANCZOS)
 elif source:
  im=im.convert('RGBA');bb=im.getchannel('A').point(lambda a:255 if a>=32 else 0).getbbox()
  if bb:im=im.crop((max(0,bb[0]-2),max(0,bb[1]-2),min(im.width,bb[2]+2),min(im.height,bb[3]+2)))
  im.putalpha(im.getchannel('A').point(lambda a:0 if a<4 else a));im.thumbnail((480,480),Image.Resampling.LANCZOS);fin=Image.new('RGBA',(im.width+8,im.height+8));fin.alpha_composite(im,(4,4));im=fin
 p=prod/f'capybara_seven_{role}_v001.webp';im.save(p,'WEBP',quality=92,method=6);shutil.copy2(p,stage/p.name)
 assert p.stat().st_size<=300000
 assets.append(dict(role=role,master=str(m),production=str(p),uiPath='/ui-studio/source/assets/import-staging/capybara-go/'+p.name,sha256=hashlib.sha256(p.read_bytes()).hexdigest(),method=method,source=source,prompt=prompt,applied=False))
for f in sorted(Path('work/capybara-guide').glob('seven-art-batch*.json')):
 for a in json.loads(f.read_text())['assets']:add(a['role'],Image.open(a['source']),'built-in imagegen; alpha32 bbox+2',a['source'],a['prompt'])
def geo(role,size,fn):
 im=Image.new('RGBA',size);fn(ImageDraw.Draw(im),im);add(role,im,'new geometry; source pixels0')



geo('panel',(444,642),lambda d,im:(d.rounded_rectangle((1,1,442,640),radius=6,fill='#34303f',outline='#17121b',width=4),d.rectangle((6,48,437,634),fill='#ffe4ae',outline='#b99868',width=4),d.rectangle((11,53,432,629),outline='#fff2c9',width=3)))
geo('ribbon',(350,60),lambda d,im:(d.polygon([(17,17),(0,37),(10,58),(44,58),(44,17)],fill='#e77000',outline='#6b370c',width=3),d.polygon([(333,17),(349,37),(338,58),(306,58),(306,17)],fill='#e77000',outline='#6b370c',width=3),d.rounded_rectangle((22,1,328,47),radius=5,fill='#ffb817',outline='#8d520b',width=2),d.line((27,3,322,3),fill='#ffe389',width=3),d.rectangle((23,44,327,52),fill='#d98b07')))
geo('rail',(428,64),lambda d,im:(d.line((45,34,398,34),fill='#242336',width=18),d.line((46,30,398,30),fill='#45415e',width=5)))
def starcoin(d,im):
 d.ellipse((2,2,37,37),fill='#ffd24a',outline='#604027',width=2);d.ellipse((6,6,33,33),fill='#a12320',outline='#fff3a2',width=2);points=[]
 for i in range(10):
  a=-math.pi/2+i*math.pi/5;r=12 if i%2==0 else 5.5;points.append((20+math.cos(a)*r,20+math.sin(a)*r))
 d.polygon(points,fill='#ffe65e')
geo('star-coin',(40,40),starcoin)
def chest(d,im):
 d.rounded_rectangle((2,10,37,31),radius=3,fill='#dc9523',outline='#553522',width=2);d.rectangle((6,4,33,15),fill='#ffc247',outline='#684329',width=2);d.rectangle((9,4,14,30),fill='#ffe2a0');d.rectangle((26,4,31,30),fill='#ffe2a0');d.rectangle((17,17,23,25),fill='#fff0a1',outline='#7d542a',width=1)
geo('milestone-chest',(40,34),chest)
geo('day-active',(90,48),lambda d,im:(d.polygon([(6,2),(68,2),(88,24),(68,46),(6,46),(1,41),(1,7)],fill='#ffa919',outline='#563c2d',width=3),d.polygon([(7,5),(65,5),(73,17),(8,17)],fill='#ffd370')))
geo('day-locked',(80,42),lambda d,im:(d.rounded_rectangle((1,1,78,40),radius=8,fill='#555766',outline='#24232b',width=3),d.line((8,5,71,5),fill='#6a6e7c',width=2)))
def lock(d,im):
 d.arc((7,2,25,24),180,360,fill='#dde5ef',width=5);d.arc((10,5,22,23),180,360,fill='#7d8a9d',width=2);d.rounded_rectangle((4,14,28,31),radius=3,fill='#c9d3e4',outline='#3e4657',width=2);d.ellipse((13,18,19,24),fill='#5c6681');d.rectangle((15,22,17,27),fill='#5c6681')
geo('lock',(32,34),lock)
geo('quest-row',(314,88),lambda d,im:(d.rounded_rectangle((1,1,312,86),radius=5,fill='#ffefcb',outline='#b08659',width=2),d.rectangle((3,3,310,25),fill='#f1cfa0')))
geo('timer-chip',(206,26),lambda d,im:d.rounded_rectangle((1,1,204,24),radius=12,fill='#8d2c10',outline='#55210e',width=1))
geo('help',(20,20),lambda d,im:d.ellipse((1,1,18,18),fill='#e5efff',outline='#42689b',width=2))
for role,c in [('red','#c4273a'),('orange','#e6a13b'),('purple','#8a22cd')]:geo('reward-'+role,(44,44),lambda d,im,c=c:(d.rectangle((1,1,42,42),fill=c,outline='#815125',width=2),d.rectangle((4,4,39,39),outline='#ffe58e',width=2)))
def ring(d,im):
 d.ellipse((6,15,35,34),fill='#f9b530',outline='#6c3e18',width=3);d.ellipse((13,20,29,28),fill='#b36a13',outline='#ffe294',width=2);d.polygon([(16,4),(29,2),(36,11),(29,20),(17,17),(12,9)],fill='#e82c3d',outline='#7d1727',width=2);d.polygon([(17,5),(27,5),(22,11),(15,10)],fill='#ff9b91')
geo('redgem-ring',(40,40),ring)
geo('list-fill',(32,32),lambda d,im:d.rectangle((0,0,31,31),fill='#e9bc82'))
manifest.write_text(json.dumps({'assets':assets},ensure_ascii=False,indent=2)+'\n');print('seven assets',len(assets))
