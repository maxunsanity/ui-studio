from pathlib import Path
from PIL import Image, ImageDraw
import json,shutil,hashlib,math
s=Path('/Users/max/projest_max/ui-studio/samples/capybara-go');root=s.parents[1];work=s/'_작업/codex/privilege01';prod=s/'ui-studio/assets/production/privilege';master=s/'ui-studio/assets/authoring/privilege/v001';stage=root/'src/tools/uxStudio/assets/import-staging/capybara-go'
for p in [work,prod,master,stage]:p.mkdir(parents=True,exist_ok=True)
manifest=work/'assets.json';assets=json.loads(manifest.read_text())['assets'] if manifest.exists() else []
def add(role,im,method,source='',prompt=''):
 if any(a['role']==role for a in assets):return
 m=master/f'capybara_privilege_{role}_v001.png'
 if source:shutil.copy2(source,m)
 else:im.save(m)
 if source and role=='ranking-scene':
  im=im.convert('RGB').resize((504,410),Image.Resampling.LANCZOS)
 elif source:
  im=im.convert('RGBA');bb=im.getchannel('A').point(lambda a:255 if a>=32 else 0).getbbox()
  if bb:im=im.crop((max(0,bb[0]-2),max(0,bb[1]-2),min(im.width,bb[2]+2),min(im.height,bb[3]+2)))
  im.putalpha(im.getchannel('A').point(lambda a:0 if a<4 else a));im.thumbnail((480,480),Image.Resampling.LANCZOS);fin=Image.new('RGBA',(im.width+8,im.height+8));fin.alpha_composite(im,(4,4));im=fin
 p=prod/f'capybara_privilege_{role}_v001.webp';im.save(p,'WEBP',quality=92,method=6);shutil.copy2(p,stage/p.name)
 assert p.stat().st_size<=300000
 assets.append(dict(role=role,master=str(m),production=str(p),uiPath='/ui-studio/source/assets/import-staging/capybara-go/'+p.name,sha256=hashlib.sha256(p.read_bytes()).hexdigest(),method=method,source=source,prompt=prompt,applied=False))
for f in sorted(Path('work/capybara-guide').glob('privilege-art-batch*.json')):
 for a in json.loads(f.read_text())['assets']:add(a['role'],Image.open(a['source']),'built-in imagegen; alpha32 bbox+2',a['source'],a['prompt'])
def geo(role,size,fn):
 im=Image.new('RGBA',size);fn(ImageDraw.Draw(im),im);add(role,im,'new geometry; source pixels0')


geo('base',(32,32),lambda d,im:d.rectangle((0,0,31,31),fill='#201e29'))
geo('daily',(464,116),lambda d,im:(d.rounded_rectangle((1,1,462,114),radius=7,fill='#0296c8',outline='#07080d',width=3),d.rounded_rectangle((2,2,461,48),radius=6,fill='#005ab6'),d.polygon([(282,2),(460,2),(460,24),(294,24)],fill='#004398')))
geo('vip',(464,102),lambda d,im:(d.polygon([(1,24),(1,2),(100,2),(122,24),(455,24),(462,32),(462,94),(455,100),(8,100),(1,94)],fill='#a5e5f6',outline='#060a10',width=3),d.polygon([(2,23),(2,2),(100,2),(120,23)],fill='#468ba4')))
for role,color,head,h in [('ad','#009cdb','#005dba',286),('monthly','#8d2bea','#6220a8',416),('permanent','#ffb700','#d85900',274),('mining','#b58e54','#72532e',312)]:
 def panel(d,im,c=color,he=head):
  w,h=im.size;d.polygon([(1,24),(1,2),(100,2),(122,24),(w-9,24),(w-2,31),(w-2,h-9),(w-9,h-2),(9,h-2),(2,h-9)],fill=c,outline='#08090d',width=3);d.rectangle((3,24,w-4,66),fill=he)
  for y in range(70,h,68):
   for x in range(-20,w,68):d.polygon([(x,y),(x+34,y+34),(x,y+68),(x-34,y+34)],fill=tuple(min(255,int(c[i:i+2],16)+9) for i in [1,3,5]))
  d.line((3,66,w-4,66),fill='#452737',width=2)
 geo('panel-'+role,(464,h),panel)
geo('bullet-row',(260,36),lambda d,im:d.rounded_rectangle((0,0,259,35),radius=4,fill=(31,13,24,100)))
geo('diamond',(18,22),lambda d,im:d.polygon([(9,2),(16,11),(9,20),(2,11)],fill='#ffb700',outline='#53352f',width=2))
geo('instant-strip',(146,36),lambda d,im:(d.rectangle((0,0,145,35),fill='#fe0063',outline='#570029',width=2),d.polygon([(145,0),(125,35),(145,35)],fill='#a90048')))
geo('daily-strip',(224,36),lambda d,im:d.rectangle((0,0,223,35),fill='#fe0063',outline='#570029',width=2))
geo('cashback',(102,68),lambda d,im:d.polygon([(8,1),(100,13),(94,49),(73,47),(54,66),(55,43),(1,35)],fill='#fa0060',outline='#1e1020',width=3))
geo('vip-frame',(60,60),lambda d,im:(d.rectangle((6,5,53,53),fill='#27454c',outline='#dfb33d',width=3),d.line((2,58,57,58),fill='#e9bc39',width=5),d.polygon([(39,8),(46,0),(48,9),(57,10),(49,15)],fill='#ed9821',outline='#6a4623',width=1),d.ellipse((39,4,45,10),fill='#5bc54c')))
for role,border,fill in [('monthly','#d5b6ff','#9847dd'),('permanent','#ffc847','#a72649')]:
 def ticket(d,im,bo=border,fi=fill):
  w,h=im.size;d.rounded_rectangle((4,10,w-5,h-11),radius=12,fill=bo,outline='#211924',width=5);d.rounded_rectangle((13,19,w-14,h-20),radius=5,fill=fi,outline='#50326b',width=3)
  for x in [5,w-6]:d.ellipse((x-13,h/2-16,x+13,h/2+16),fill=(0,0,0,0),outline='#211924',width=3)
  d.polygon([(w//2,3),(w//2+9,15),(w//2,27),(w//2-9,15)],outline=bo,width=3)
 geo('ticket-'+role,(176,132),ticket)
geo('vip-status',(108,40),lambda d,im:(d.rounded_rectangle((1,1,106,38),radius=6,fill='#727b7e',outline='#252b2e',width=3),d.line((8,5,100,5),fill='#a0a6a3',width=2)))
geo('perk-bar',(252,48),lambda d,im:(d.rounded_rectangle((1,1,250,46),radius=6,fill='#ffbf4d',outline='#774c26',width=2),d.polygon([(75,2),(92,2),(60,45),(43,45)],fill='#ffd577')))
geo('alert',(18,24),lambda d,im:d.rounded_rectangle((1,1,16,22),radius=5,fill='#ff156b',outline='#3e203a',width=2))
geo('reward-blue',(56,56),lambda d,im:(d.rounded_rectangle((1,1,54,54),radius=4,fill='#9ab0df',outline='#57496e',width=2),d.rectangle((5,5,50,49),outline='#dbe4f0',width=2)))
geo('reward-orange',(56,56),lambda d,im:(d.rounded_rectangle((1,1,54,54),radius=4,fill='#eb952e',outline='#8b5130',width=2),d.rectangle((5,5,50,49),outline='#ffe1a4',width=2)))
def pickaxe(d,im):
 d.line((15,43,34,15),fill='#33282e',width=10);d.line((15,43,34,15),fill='#9b633b',width=6);d.polygon([(8,20),(16,9),(30,5),(43,9),(48,20),(33,14),(22,16)],fill='#aab5cc',outline='#33303d',width=3)
geo('pickaxe',(52,52),pickaxe)
manifest.write_text(json.dumps({'assets':assets},ensure_ascii=False,indent=2)+'\n');print('privilege assets',len(assets))
