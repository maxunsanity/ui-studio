from pathlib import Path
from PIL import Image, ImageDraw
import json,shutil,hashlib,math
s=Path('/Users/max/projest_max/ui-studio/samples/capybara-go');root=s.parents[1];work=s/'_작업/codex/gold01';prod=s/'ui-studio/assets/production/gold-popup';master=s/'ui-studio/assets/authoring/gold-popup/v001';stage=root/'src/tools/uxStudio/assets/import-staging/capybara-go'
for p in [work,prod,master,stage]:p.mkdir(parents=True,exist_ok=True)
manifest=work/'assets.json';assets=json.loads(manifest.read_text())['assets'] if manifest.exists() else []
def add(role,im,method,source='',prompt=''):
 if any(a['role']==role for a in assets):return
 m=master/f'capybara_gold_{role}_v001.png'
 if source:shutil.copy2(source,m)
 else:im.save(m)
 if source:
  im=im.convert('RGBA');bb=im.getchannel('A').point(lambda a:255 if a>=32 else 0).getbbox()
  if bb:im=im.crop((max(0,bb[0]-2),max(0,bb[1]-2),min(im.width,bb[2]+2),min(im.height,bb[3]+2)))
  im.putalpha(im.getchannel('A').point(lambda a:0 if a<4 else a));im.thumbnail((480,480),Image.Resampling.LANCZOS);fin=Image.new('RGBA',(im.width+8,im.height+8));fin.alpha_composite(im,(4,4));im=fin
 p=prod/f'capybara_gold_{role}_v001.webp';im.save(p,'WEBP',quality=92,method=6);shutil.copy2(p,stage/p.name)
 assert p.stat().st_size<=300000
 assets.append(dict(role=role,master=str(m),production=str(p),uiPath='/ui-studio/source/assets/import-staging/capybara-go/'+p.name,sha256=hashlib.sha256(p.read_bytes()).hexdigest(),method=method,source=source,prompt=prompt,applied=False))
for f in sorted(Path('work/capybara-guide').glob('gold-art-batch*.json')):
 for a in json.loads(f.read_text())['assets']:add(a['role'],Image.open(a['source']),'built-in imagegen; alpha32 bbox+2',a['source'],a['prompt'])
def geo(role,size,fn):
 im=Image.new('RGBA',size);fn(ImageDraw.Draw(im),im);add(role,im,'new geometry; source pixels0')

def paint_popup(d,im):
 d.rounded_rectangle((1,2,446,600),radius=7,fill='#777083',outline='#211c28',width=3)
 d.rectangle((6,44,441,592),fill='#ffe7ba');d.rounded_rectangle((4,3,443,46),radius=5,fill='#2e2b3b');d.rectangle((9,8,438,23),fill='#3d384c');d.line((5,47,442,47),fill='#161721',width=3)
 d.polygon([(8,574),(17,578),(8,582)],fill='#e4bb87');d.polygon([(429,591),(440,578),(440,591)],fill='#f8d39f')
geo('panel',(448,602),paint_popup)
geo('divider',(420,30),lambda d,im:(d.line((0,15,127,15),fill='#876443',width=3),d.line((293,15,419,15),fill='#876443',width=3)))
geo('offer-row',(420,100),lambda d,im:d.rounded_rectangle((1,1,418,98),radius=8,fill='#ffc84b',outline='#8b5126',width=2))
geo('method-row',(420,74),lambda d,im:d.rounded_rectangle((1,1,418,72),radius=8,fill='#ffdaa9',outline='#906039',width=2))
geo('item-slot',(84,84),lambda d,im:(d.rounded_rectangle((1,1,82,82),radius=7,fill='#75b000',outline='#2c310d',width=3),d.rectangle((8,8,75,75),fill='#518c00',outline='#bde85b',width=3)))
geo('reward-slot',(60,60),lambda d,im:(d.rounded_rectangle((1,1,58,58),radius=5,fill='#ffcc51',outline='#93460e',width=2),d.rectangle((5,5,54,54),fill='#ed9e35')))
geo('value-badge',(64,60),lambda d,im:d.polygon([(32,1),(38,8),(48,4),(51,14),(61,16),(57,27),(63,36),(53,42),(52,53),(41,51),(32,59),(24,51),(13,54),(11,43),(1,37),(6,27),(2,17),(13,14),(16,5),(25,8)],fill='#d72d42',outline='#3a2430',width=3))
geo('close',(52,52),lambda d,im:(d.ellipse((1,1,50,50),fill='#32313e',outline='#918ca3',width=4),d.arc((5,5,46,46),190,295,fill='#ccc9d7',width=2)))
manifest.write_text(json.dumps({'assets':assets},ensure_ascii=False,indent=2)+'\n');print('gold assets',len(assets))
