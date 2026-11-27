from pathlib import Path
from PIL import Image, ImageDraw
import json,shutil,hashlib,math
s=Path('/Users/max/projest_max/ui-studio/samples/capybara-go');root=s.parents[1];work=s/'_작업/codex/talent01';prod=s/'ui-studio/assets/production/talents';master=s/'ui-studio/assets/authoring/talents/v001';stage=root/'src/tools/uxStudio/assets/import-staging/capybara-go'
for p in [work,prod,master,stage]:p.mkdir(parents=True,exist_ok=True)
manifest=work/'assets.json';assets=json.loads(manifest.read_text())['assets'] if manifest.exists() else []
def add(role,im,method,source='',prompt=''):
 if any(a['role']==role for a in assets):return
 m=master/f'capybara_talent_{role}_v001.png'
 if source:shutil.copy2(source,m)
 else:im.save(m)
 if source:
  im=im.convert('RGBA');bb=im.getchannel('A').point(lambda a:255 if a>=32 else 0).getbbox()
  if bb:im=im.crop((max(0,bb[0]-2),max(0,bb[1]-2),min(im.width,bb[2]+2),min(im.height,bb[3]+2)))
  im.putalpha(im.getchannel('A').point(lambda a:0 if a<4 else a));im.thumbnail((480,480),Image.Resampling.LANCZOS);fin=Image.new('RGBA',(im.width+8,im.height+8));fin.alpha_composite(im,(4,4));im=fin
 p=prod/f'capybara_talent_{role}_v001.webp';im.save(p,'WEBP',quality=92,method=6);shutil.copy2(p,stage/p.name)
 assert p.stat().st_size<=300000
 assets.append(dict(role=role,master=str(m),production=str(p),uiPath='/ui-studio/source/assets/import-staging/capybara-go/'+p.name,sha256=hashlib.sha256(p.read_bytes()).hexdigest(),method=method,source=source,prompt=prompt,applied=False))
for f in sorted(Path('work/capybara-guide').glob('talent-art-batch*.json')):
 for a in json.loads(f.read_text())['assets']:add(a['role'],Image.open(a['source']),'built-in imagegen; alpha32 bbox+2',a['source'],a['prompt'])
def geo(role,size,fn):
 im=Image.new('RGBA',size);fn(ImageDraw.Draw(im),im);add(role,im,'new geometry; source pixels0')

def backdrop(d,im):
 pix=im.load()
 for y in range(894):
  for x in range(504):
   glow=max(0,1-(((x-252)/300)**2+((y-250)/255)**2)**.5)
   if y<470:c=(int(84+51*glow),int(48+26*glow),int(143+56*glow),255)
   else:c=(63,41,105,255) if y<598 or y>=734 else (43,28,75,255)
   pix[x,y]=c
 d.polygon([(115,40),(390,40),(504,337),(0,337)],fill=(112,71,180,70))
 d.rectangle((0,336,503,381),fill=(64,37,112,100));d.ellipse((75,340,434,402),fill=(65,36,112,255));d.ellipse((150,355,369,387),fill=(52,28,96,255))
geo('backdrop',(504,894),backdrop)
geo('progress',(504,22),lambda d,im:(d.rectangle((0,0,503,21),fill='#241936',outline='#160e24',width=2),d.rectangle((0,1,109,18),fill='#ffb911'),d.line((0,1,109,1),fill='#ffed69',width=2)))
geo('level-marker',(46,46),lambda d,im:d.polygon([(23,1),(29,7),(38,7),(39,16),(45,23),(39,29),(39,38),(29,39),(23,45),(16,39),(7,38),(7,29),(1,23),(7,16),(7,7),(16,7)],fill='#a95bd3',outline='#21192f',width=3))
geo('card',(132,180),lambda d,im:(d.rounded_rectangle((1,2,130,179),radius=9,fill='#fdf0cd',outline='#201b25',width=3),d.rounded_rectangle((3,3,128,29),radius=7,fill='#ffdaa2'),d.rectangle((3,143,128,175),fill='#efc58c'),d.line((3,143,128,143),fill='#dcb982',width=2),d.ellipse((40,42,90,94),fill='#ffe0ab')))
geo('knowledge-button',(126,52),lambda d,im:(d.rounded_rectangle((1,3,124,51),radius=9,fill='#71411f'),d.rounded_rectangle((1,1,124,47),radius=9,fill='#ffe64a',outline='#2b2030',width=3),d.polygon([(11,44),(61,3),(85,3),(36,44)],fill='#fff286')))
geo('coin-capsule',(70,40),lambda d,im:d.rounded_rectangle((1,3,68,38),radius=8,fill='#00c6ec',outline='#312442',width=3))
geo('preview',(48,48),lambda d,im:(d.rounded_rectangle((9,8,44,43),radius=4,fill='#e9dcab',outline='#302b43',width=3),d.line((30,16,38,16),fill='#8b7562',width=3),d.line((29,22,38,22),fill='#8b7562',width=3),d.line((18,27,8,43),fill='#a2b6cb',width=7),d.ellipse((1,0,30,29),fill='#c5ecf6',outline='#30324b',width=3),d.ellipse((7,5,23,19),fill='#f1fbff')))
geo('stat-sword',(52,52),lambda d,im:(d.polygon([(16,31),(33,5),(46,2),(44,17),(24,38)],fill='#b5dce4',outline='#28332f',width=3),d.line((8,43,21,30),fill='#9b4c12',width=7),d.line((9,25,28,42),fill='#ffca4b',width=6)))
geo('upgrade-toast',(504,64),lambda d,im:(d.rectangle((0,0,503,63),fill=(21,15,24,220)),d.line((0,2,503,2),fill='#d1a14c',width=3),d.line((0,60,503,60),fill='#d1a14c',width=3)))
manifest.write_text(json.dumps({'assets':assets},ensure_ascii=False,indent=2)+'\n');print('talent assets',len(assets))
