from pathlib import Path
from PIL import Image, ImageDraw
import json,shutil,hashlib,math
s=Path('/Users/max/projest_max/ui-studio/samples/capybara-go');root=s.parents[1];work=s/'_작업/codex/chest01';prod=s/'ui-studio/assets/production/chests';master=s/'ui-studio/assets/authoring/chests/v001';stage=root/'src/tools/uxStudio/assets/import-staging/capybara-go'
for p in [work,prod,master,stage]:p.mkdir(parents=True,exist_ok=True)
manifest=work/'assets.json';assets=json.loads(manifest.read_text())['assets'] if manifest.exists() else []
def add(role,im,method,source='',prompt=''):
 if any(a['role']==role for a in assets):return
 m=master/f'capybara_chest_{role}_v001.png'
 if source:shutil.copy2(source,m)
 else:im.save(m)
 if source:
  im=im.convert('RGBA');bb=im.getchannel('A').point(lambda a:255 if a>=32 else 0).getbbox()
  if bb:im=im.crop((max(0,bb[0]-2),max(0,bb[1]-2),min(im.width,bb[2]+2),min(im.height,bb[3]+2)))
  im.putalpha(im.getchannel('A').point(lambda a:0 if a<4 else a));im.thumbnail((480,480),Image.Resampling.LANCZOS);fin=Image.new('RGBA',(im.width+8,im.height+8));fin.alpha_composite(im,(4,4));im=fin
 p=prod/f'capybara_chest_{role}_v001.webp';im.save(p,'WEBP',quality=92,method=6);shutil.copy2(p,stage/p.name)
 assert p.stat().st_size<=300000
 assets.append(dict(role=role,master=str(m),production=str(p),uiPath='/ui-studio/source/assets/import-staging/capybara-go/'+p.name,sha256=hashlib.sha256(p.read_bytes()).hexdigest(),method=method,source=source,prompt=prompt,applied=False))
for f in sorted(Path('work/capybara-guide').glob('chest-art-batch*.json')):
 for a in json.loads(f.read_text())['assets']:add(a['role'],Image.open(a['source']),'built-in imagegen; alpha32 bbox+2',a['source'],a['prompt'])
def geo(role,size,fn):
 im=Image.new('RGBA',size);fn(ImageDraw.Draw(im),im);add(role,im,'new geometry; source pixels0')

def paint_stage(d,im):
 d.rectangle((0,0,503,893),fill='#211e2a')
 for y in range(44,494,92):
  for x in range(-80 if (y//92)%2 else 30,504,174):d.rounded_rectangle((x,y,x+108,y+39),radius=4,fill='#1e1b26')
 for y in range(494,894):
  t=(y-494)/400;d.line((0,y,503,y),fill=(int(70+26*t),int(43+12*t),int(49+15*t),255))
 d.line((0,494,503,494),fill='#2e1b25',width=4)
 for x in [-220,70,206,350,700]:d.line((252,390,x,894),fill='#36212a',width=4)
 d.ellipse((10,545,493,620),fill='#4a2933');d.ellipse((23,532,479,607),fill='#2e1c25',outline='#271820',width=4);d.ellipse((48,525,455,572),fill='#8c5d6b',outline='#4c303e',width=2);d.ellipse((150,542,355,560),fill='#472b37')
geo('stage',(504,894),paint_stage)
def flag(color,border,motif):
 def fn(d,im):
  d.polygon([(4,0),(355,0),(355,313),(328,342),(307,321),(53,321),(30,342),(4,313)],fill='#263b25',outline='#16131b',width=5)
  d.polygon([(23,0),(337,0),(337,298),(180,366),(23,298)],fill=border,outline='#211923',width=5)
  d.polygon([(41,0),(319,0),(319,285),(180,348),(41,285)],fill=color,outline='#173620',width=4)
  dark=tuple(max(0,int(color[i:i+2],16)*7//10) for i in [1,3,5])+(255,)
  d.polygon([(108,140),(180,71),(252,140),(180,211)],outline=dark,width=12)
  if motif=='paw':
   d.ellipse((151,145,209,192),fill=dark)
   for r in [(132,125,155,159),(155,110,176,146),(181,110,202,146),(205,125,228,159)]:d.ellipse(r,fill=dark)
  elif motif=='gem':
   pts=[(180+46*math.cos(math.radians(k)),144+46*math.sin(math.radians(k))) for k in range(0,360,60)];d.polygon(pts,fill=dark)
  else:
   d.polygon([(148,104),(212,104),(209,142),(190,163),(190,182),(205,188),(205,195),(155,195),(155,188),(170,182),(170,163),(151,142)],fill=dark)
   d.polygon([(180,121),(194,135),(180,150),(166,135)],fill=color)
 return fn
for role,c,b,m in [('bronze','#247d25','#ba7852','cup'),('silver','#006383','#a3a6c5','cup'),('gold','#ab123f','#ffaf06','cup'),('pet','#009b70','#abd44b','paw'),('amethyst','#bb00df','#542279','gem')]:geo('flag-'+role,(360,368),flag(c,b,m))
for role,c in [('tab-inactive','#ab41ee'),('tab-active','#ffc11a')]:geo(role,(90,52),lambda d,im,c=c:(d.rounded_rectangle((1,4,88,51),radius=7,fill='#483125'),d.rounded_rectangle((1,1,88,47),radius=7,fill=c,outline='#19141f',width=4)))
for role,c in [('open','#ffb80b'),('none','#939392')]:geo('button-'+role,(184,64),lambda d,im,c=c:(d.rounded_rectangle((1,3,182,63),radius=8,fill='#3b2428'),d.rounded_rectangle((1,1,182,59),radius=8,fill=c,outline='#19141f',width=3)))
geo('claim-button',(106,52),lambda d,im:(d.rounded_rectangle((1,3,104,51),radius=6,fill='#394a0b'),d.rounded_rectangle((1,1,104,47),radius=6,fill='#a7df12',outline='#1a2112',width=3)))
for side in ['left','right']:
 geo('arrow-'+side,(40,48),lambda d,im,s=side:d.polygon([(3 if s=='left' else 37,24),(36 if s=='left' else 4,3),(36 if s=='left' else 4,45)],fill='#ffe6ad',outline='#19141e',width=3))
geo('header-dim',(504,88),lambda d,im:d.rectangle((0,0,503,87),fill=(0,0,0,150)))
geo('points-bar',(310,22),lambda d,im:(d.rounded_rectangle((0,0,309,21),radius=5,fill='#9e5a08',outline='#252116',width=2),d.rectangle((3,3,306,17),fill='#ffc42b'),d.line((3,4,306,4),fill='#ffe46c',width=3)))
geo('points-badge',(60,64),lambda d,im:(d.polygon([(30,1),(56,14),(56,46),(30,62),(4,46),(4,14)],fill='#ffd32c',outline='#35192b',width=3),d.polygon([(30,9),(48,19),(48,42),(30,53),(12,42),(12,19)],fill='#a23554'),d.line((20,24,37,24),fill='#ffd32c',width=5),d.line((25,24,25,37),fill='#ffd32c',width=5),d.line((35,24,35,37),fill='#ffd32c',width=5)))
geo('reward-panel',(504,174),lambda d,im:(d.rectangle((0,0,503,173),fill='#1f1e29'),d.line((0,2,503,2),fill='#e8bb52',width=3),d.line((0,170,503,170),fill='#e8bb52',width=3)))
geo('reward-ribbon',(404,62),lambda d,im:(d.polygon([(0,24),(15,5),(389,5),(403,25),(390,48),(13,48)],fill='#dc6c05',outline='#211b1c',width=3),d.rounded_rectangle((22,0,381,46),radius=4,fill='#ffb91b',outline='#3a251e',width=3)))
geo('reward-slot',(80,80),lambda d,im:(d.rounded_rectangle((1,1,78,78),radius=6,fill='#04c8e5',outline='#12151c',width=3),d.rectangle((8,8,71,71),fill='#007e9d',outline='#42edff',width=2)))
manifest.write_text(json.dumps({'assets':assets},ensure_ascii=False,indent=2)+'\n');print('chest assets',len(assets))
