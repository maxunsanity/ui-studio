from pathlib import Path
from PIL import Image, ImageDraw
import json,shutil,hashlib,math
s=Path('/Users/max/projest_max/ui-studio/samples/capybara-go');root=s.parents[1];work=s/'_작업/codex/fund01';prod=s/'ui-studio/assets/production/fund';master=s/'ui-studio/assets/authoring/fund/v001';stage=root/'src/tools/uxStudio/assets/import-staging/capybara-go'
for p in [work,prod,master,stage]:p.mkdir(parents=True,exist_ok=True)
manifest=work/'assets.json';assets=json.loads(manifest.read_text())['assets'] if manifest.exists() else []
def add(role,im,method,source='',prompt=''):
 if any(a['role']==role for a in assets):return
 m=master/f'capybara_fund_{role}_v001.png'
 if source:shutil.copy2(source,m)
 else:im.save(m)
 if source and role.endswith('-scene'):
  im=im.convert('RGB').resize((424,148),Image.Resampling.LANCZOS)
 elif source:
  im=im.convert('RGBA');bb=im.getchannel('A').point(lambda a:255 if a>=32 else 0).getbbox()
  if bb:im=im.crop((max(0,bb[0]-2),max(0,bb[1]-2),min(im.width,bb[2]+2),min(im.height,bb[3]+2)))
  im.putalpha(im.getchannel('A').point(lambda a:0 if a<4 else a));im.thumbnail((480,480),Image.Resampling.LANCZOS);fin=Image.new('RGBA',(im.width+8,im.height+8));fin.alpha_composite(im,(4,4));im=fin
 p=prod/f'capybara_fund_{role}_v001.webp';im.save(p,'WEBP',quality=92,method=6);shutil.copy2(p,stage/p.name)
 assert p.stat().st_size<=300000
 assets.append(dict(role=role,master=str(m),production=str(p),uiPath='/ui-studio/source/assets/import-staging/capybara-go/'+p.name,sha256=hashlib.sha256(p.read_bytes()).hexdigest(),method=method,source=source,prompt=prompt,applied=False))
for f in sorted(Path('work/capybara-guide').glob('fund-art-batch*.json')):
 for a in json.loads(f.read_text())['assets']:add(a['role'],Image.open(a['source']),'built-in imagegen; alpha32 bbox+2',a['source'],a['prompt'])
def geo(role,size,fn):
 im=Image.new('RGBA',size);fn(ImageDraw.Draw(im),im);add(role,im,'new geometry; source pixels0')


geo('panel',(454,588),lambda d,im:(d.rounded_rectangle((1,1,452,586),radius=4,fill='#363043',outline='#15111b',width=4),d.rectangle((5,5,448,48),fill='#292530'),d.line((5,49,448,49),fill='#17111a',width=3),d.rectangle((7,52,446,580),fill='#ffe5af',outline='#a67d4b',width=3),d.rectangle((11,56,442,576),outline='#f7d0a7',width=3)))
geo('card-frame',(424,148),lambda d,im:d.rounded_rectangle((1,1,422,146),radius=8,outline='#17171b',width=3))
geo('progress-strip',(424,28),lambda d,im:d.rectangle((0,0,423,27),fill=(0,0,0,145)))
geo('status',(88,22),lambda d,im:d.rounded_rectangle((1,1,86,20),radius=3,fill='#9ca7bd',outline='#424054',width=2))
geo('roudbibi-description',(284,78),lambda d,im:d.rectangle((0,0,283,77),fill=(95,107,0,140)))
geo('talent-description',(284,70),lambda d,im:d.rectangle((0,0,283,69),fill=(0,46,66,170)))
geo('tower-header',(424,36),lambda d,im:(d.rounded_rectangle((1,1,422,35),radius=6,fill='#29275d',outline='#151520',width=3),d.rectangle((320,3,418,35),fill='#b89362')))
def pass_scene(d,im):
 w,h=im.size
 for y in range(h):
  p=y/(h-1);d.line((0,y,w,y),fill=(255,int(151-77*p),int(45+24*p)))
 d.ellipse((-80,-130,170,90),fill='#a52135');d.rectangle((0,94,w,h),fill='#be374d');d.line((0,88,w,88),fill='#ffc07a',width=3)
 d.polygon([(262,81),(291,81),(286,89),(268,89)],fill='#a72942');d.line((274,62,274,82),fill='#a72942',width=3);d.polygon([(274,64),(274,77),(286,77)],fill='#a72942')
geo('battlepass-scene',(424,148),pass_scene)
def clock(d,im):
 d.ellipse((3,4,20,21),outline='#f7c847',width=2);d.line((12,8,12,13,16,15),fill='#f7c847',width=2);d.rectangle((9,0,15,3),fill='#f7c847')
geo('clock',(24,24),clock)
for role,color in [('coin','#ffc855'),('diamond','#bfe42a'),('talent','#a858df')]:
 def progress_icon(d,im,c=color):
  d.polygon([(9,1),(15,5),(17,12),(11,17),(3,14),(1,6)],fill=c,outline='#33303d',width=2)
 geo('progress-'+role,(18,18),progress_icon)
geo('dim',(32,32),lambda d,im:d.rectangle((0,0,31,31),fill=(0,0,0,150)))
manifest.write_text(json.dumps({'assets':assets},ensure_ascii=False,indent=2)+'\n');print('fund assets',len(assets))
