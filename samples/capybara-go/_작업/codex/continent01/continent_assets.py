from pathlib import Path
from PIL import Image, ImageDraw
import json,shutil,hashlib,math
s=Path('/Users/max/projest_max/ui-studio/samples/capybara-go');root=s.parents[1];work=s/'_작업/codex/continent01';prod=s/'ui-studio/assets/production/continent';master=s/'ui-studio/assets/authoring/continent/v001';stage=root/'src/tools/uxStudio/assets/import-staging/capybara-go'
for p in [work,prod,master,stage]:p.mkdir(parents=True,exist_ok=True)
manifest=work/'assets.json';assets=json.loads(manifest.read_text())['assets'] if manifest.exists() else []
def add(role,im,method,source='',prompt=''):
 if any(a['role']==role for a in assets):return
 m=master/f'capybara_continent_{role}_v001.png'
 if source:shutil.copy2(source,m)
 else:im.save(m)
 if source and role=='ranking-scene':
  im=im.convert('RGB').resize((504,410),Image.Resampling.LANCZOS)
 elif source:
  im=im.convert('RGBA');bb=im.getchannel('A').point(lambda a:255 if a>=32 else 0).getbbox()
  if bb:im=im.crop((max(0,bb[0]-2),max(0,bb[1]-2),min(im.width,bb[2]+2),min(im.height,bb[3]+2)))
  im.putalpha(im.getchannel('A').point(lambda a:0 if a<4 else a));im.thumbnail((480,480),Image.Resampling.LANCZOS);fin=Image.new('RGBA',(im.width+8,im.height+8));fin.alpha_composite(im,(4,4));im=fin
 p=prod/f'capybara_continent_{role}_v001.webp';im.save(p,'WEBP',quality=92,method=6);shutil.copy2(p,stage/p.name)
 assert p.stat().st_size<=300000
 assets.append(dict(role=role,master=str(m),production=str(p),uiPath='/ui-studio/source/assets/import-staging/capybara-go/'+p.name,sha256=hashlib.sha256(p.read_bytes()).hexdigest(),method=method,source=source,prompt=prompt,applied=False))
for f in sorted(Path('work/capybara-guide').glob('continent-art-batch*.json')):
 for a in json.loads(f.read_text())['assets']:add(a['role'],Image.open(a['source']),'built-in imagegen; alpha32 bbox+2',a['source'],a['prompt'])
def geo(role,size,fn):
 im=Image.new('RGBA',size);fn(ImageDraw.Draw(im),im);add(role,im,'new geometry; source pixels0')

geo('base',(32,32),lambda d,im:d.rectangle((0,0,31,31),fill='#211e29'))
geo('arrival-strip',(504,40),lambda d,im:d.rectangle((0,0,503,39),fill=(10,31,49,190)))
geo('quest-header',(504,88),lambda d,im:(d.rectangle((0,0,503,87),fill='#714b3a'),d.rectangle((0,0,503,30),fill='#59392a'),d.line((0,0,503,0),fill='#241b22',width=4),d.rounded_rectangle((26,53,441,72),radius=5,fill='#090708',outline='#3e251c',width=2),d.rounded_rectangle((28,55,28+int(412*3/19),70),radius=4,fill='#ffb52c')))
geo('quest-row',(476,88),lambda d,im:(d.rounded_rectangle((1,1,474,86),radius=9,fill='#ffe7ba',outline='#9b642f',width=2),d.rounded_rectangle((2,2,473,31),radius=8,fill='#f3c587')))
for role,ratio in [('main',15/20),('talent',604/990),('tower',40/200)]:geo('progress-'+role,(130,16),lambda d,im,r=ratio:(d.rounded_rectangle((0,0,129,15),radius=4,fill='#111018'),d.rounded_rectangle((3,3,3+int(124*r),12),radius=3,fill='#08d20b')))
geo('footer',(504,88),lambda d,im:(d.rectangle((0,0,503,87),fill='#2c2938'),d.line((0,1,503,1),fill='#15121a',width=4)))
for role,size in [('back-button',(88,64)),('crew-button',(84,70))]:geo(role,size,lambda d,im:(d.rounded_rectangle((1,1,im.width-2,im.height-2),radius=7,fill='#55516f',outline='#17141f',width=3),d.line((8,6,im.width-8,6),fill='#716b91',width=3)))
geo('back-arrow',(52,42),lambda d,im:d.polygon([(2,21),(22,2),(22,12),(49,15),(49,29),(22,29),(22,40)],fill='#fffdf2',outline='#26232a',width=3))
def crew(d,im):
 d.rounded_rectangle((4,2,53,57),radius=6,fill='#f9e5bc',outline='#342a2d',width=3);d.rounded_rectangle((15,0,42,8),radius=3,fill='#dcb47c',outline='#342a2d',width=2)
 for y in [17,28,39]:d.ellipse((10,y,15,y+5),fill='#9a7153');d.line((21,y+2,44,y+2),fill='#8a624a',width=3)
 d.line((10,50,44,50),fill='#8a624a',width=3)
geo('crew-icon',(58,60),crew)
for role,c in [('green','#8aba1e'),('orange','#ee9c29'),('cyan','#26c9d8')]:geo('reward-'+role,(48,48),lambda d,im,c=c:d.rounded_rectangle((1,1,46,46),radius=3,fill=c,outline='#383021',width=2))
geo('power-badge',(44,44),lambda d,im:d.polygon([(22,1),(27,7),(34,4),(36,13),(42,16),(38,23),(43,31),(35,34),(34,42),(26,38),(20,43),(15,36),(6,39),(8,30),(1,25),(7,18),(3,11),(12,9),(14,2)],fill='#be001c',outline='#65132a',width=3))
for role,c in [('gold','#ffcf44'),('silver','#bbc3cf'),('bronze','#c68555')]:geo('rank-'+role,(44,36),lambda d,im,c=c:(d.polygon([(3,9),(11,13),(16,3),(23,12),(31,2),(34,13),(41,8),(40,31),(4,31)],fill=c,outline='#332b2d',width=2)))
for role,w,c in [('left',166,'#712935'),('center',134,'#264791'),('right',100,'#683199')]:geo('title-'+role,(w,24),lambda d,im,c=c:(d.polygon([(1,1),(im.width-9,1),(im.width-1,12),(im.width-9,22),(1,22)],fill=c,outline='#dbb55a',width=2),d.ellipse((3,3,20,20),outline='#f3d556',width=2),d.line((12,7,12,18),fill='#f3d556',width=2),d.line((7,15,12,19,17,15),fill='#f3d556',width=2)))
manifest.write_text(json.dumps({'assets':assets},ensure_ascii=False,indent=2)+'\n');print('continent assets',len(assets))
