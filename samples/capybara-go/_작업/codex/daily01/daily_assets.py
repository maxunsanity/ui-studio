from pathlib import Path
from PIL import Image,ImageDraw
import json,shutil,hashlib,math
s=Path('/Users/max/projest_max/ui-studio/samples/capybara-go');root=s.parents[1];work=s/'_작업/codex/daily01';prod=s/'ui-studio/assets/production/daily';master=s/'ui-studio/assets/authoring/daily';stage=root/'src/tools/uxStudio/assets/import-staging/capybara-go'
for p in [work,prod,master,stage]:p.mkdir(parents=True,exist_ok=True)
manifest=work/'assets.json';assets=json.loads(manifest.read_text())['assets']if manifest.exists()else[]
def add(role,im,method,source='',prompt='',version=1):
 if any(a['role']==role for a in assets):return
 suffix=f'v{version:03d}';m=master/suffix/f'capybara_daily_{role}_{suffix}.png';m.parent.mkdir(parents=True,exist_ok=True)
 if source:shutil.copy2(source,m)
 else:im.save(m)
 if source and role=='daily-banner':im=im.convert('RGB').resize((504,150),Image.Resampling.LANCZOS)
 elif source:
  im=im.convert('RGBA');bb=im.getchannel('A').point(lambda a:255 if a>=32 else 0).getbbox()
  if bb:im=im.crop((max(0,bb[0]-2),max(0,bb[1]-2),min(im.width,bb[2]+2),min(im.height,bb[3]+2)))
  im.putalpha(im.getchannel('A').point(lambda a:0 if a<4 else a));im.thumbnail((480,480),Image.Resampling.LANCZOS);fin=Image.new('RGBA',(im.width+8,im.height+8));fin.alpha_composite(im,(4,4));im=fin
 p=prod/f'capybara_daily_{role}_{suffix}.webp';im.save(p,'WEBP',quality=92,method=6);shutil.copy2(p,stage/p.name);assert p.stat().st_size<=300000
 assets.append(dict(role=role,version=version,master=str(m),production=str(p),uiPath='/ui-studio/source/assets/import-staging/capybara-go/'+p.name,sha256=hashlib.sha256(p.read_bytes()).hexdigest(),method=method,source=source,prompt=prompt,applied=False))
selected=json.loads(Path('work/capybara-guide/daily-art-selected.json').read_text())
for a in selected['assets']:add(a['role'],Image.open(a['source']),'built-in imagegen; opaque banner or alpha32 bbox+2',a['source'],a['prompt'],a['version'])
rej=master/'rejected/v001';rej.mkdir(parents=True,exist_ok=True)
for a in selected['rejected']:shutil.copy2(a['source'],rej/(a['role']+'_v001.png'))
(rej/'rejected.json').write_text(json.dumps(selected['rejected'],ensure_ascii=False,indent=2)+'\n')
def geo(role,size,fn):
 im=Image.new('RGBA',size);fn(ImageDraw.Draw(im),im);add(role,im,'new geometry; source pixels0')
geo('base',(32,32),lambda d,im:d.rectangle((0,0,31,31),fill='#211f2b'))
geo('sale-strip',(504,88),lambda d,im:(d.rectangle((0,0,503,87),fill='#a50b3c',outline='#501c26',width=3),d.polygon([(0,1),(58,1),(100,86),(0,86)],fill='#d62e4d'),d.polygon([(300,1),(330,1),(280,86),(250,86)],fill='#a31344')))
for role,c in [('benefit','#18a139'),('discount','#08729d'),('priority','#733694'),('premium','#eb4537')]:
 def card(d,im,col=c):
  d.rounded_rectangle((1,1,224,252),radius=12,fill='#fae4bf',outline='#1d1721',width=4);d.rounded_rectangle((4,4,221,42),radius=8,fill=col);d.rectangle((4,32,221,42),fill=col);d.rounded_rectangle((18,50,207,182),radius=10,fill='#f7d9a9');d.line((13,246,211,246),fill='#c09569',width=3)
 geo('card-'+role,(226,254),card)
for role,c in [('red','#c91543'),('orange','#eaaa3f'),('blue','#a1b5dd'),('purple','#914ac9')]:geo('reward-'+role,(64,64),lambda d,im,c=c:(d.rounded_rectangle((1,1,62,62),radius=4,fill=c,outline='#46312e',width=3),d.rectangle((6,6,57,57),outline='#ffe4a4',width=2)))
def star(d,im):
 pts=[(3,5),(20,11),(36,2),(29,21),(37,36),(19,29),(3,37),(10,20)];d.polygon(pts,fill='#d4dff9',outline='#69255f',width=2);d.polygon([(3,5),(20,11),(19,21),(10,20)],fill='#fff0fb');d.polygon([(19,21),(29,21),(37,36),(19,29)],fill='#70b8ef')
geo('star',(40,40),star)
def chest(d,im):
 d.rounded_rectangle((3,8,40,38),radius=6,fill='#8793ac',outline='#3d4359',width=3);d.arc((4,0,39,26),180,360,fill='#b8c4d7',width=8);d.rectangle((4,16,39,20),fill='#d0d6e2',outline='#515771',width=1);d.rectangle((7,22,13,36),fill='#c0cada');d.rectangle((29,22,35,36),fill='#c0cada')
geo('mystery-chest',(44,40),chest)
def ticket(d,im):
 d.polygon([(2,2),(42,6),(39,31),(0,27)],fill='#f6dfac',outline='#715233',width=3);d.line((3,5,22,18,39,8),fill='#b8a073',width=2);d.polygon([(22,8),(29,11),(28,23),(21,27),(14,22),(15,12)],fill='#29376f',outline='#d9a950',width=2);d.polygon([(21,12),(25,17),(23,17),(23,22),(19,22),(19,17),(17,17)],fill='#fbf1f6')
geo('blue-shield-ticket',(44,34),ticket)
def burst(d,im):
 pts=[]
 for i in range(24):
  a=-math.pi/2+i*math.pi/12;r=26 if i%2==0 else 20;pts.append((27+math.cos(a)*r,27+math.sin(a)*r))
 d.polygon(pts,fill='#e51a33',outline='#34202d',width=3)
geo('value-burst',(54,54),burst)
for role,c in [('selected','#9824dc'),('unselected','#747c9f')]:geo('footer-'+role,(88,76),lambda d,im,c=c:d.rounded_rectangle((1,1,86,74),radius=9,fill=c,outline='#171722',width=4))
geo('bonus-frame',(64,64),lambda d,im:(d.rounded_rectangle((1,1,62,62),radius=6,fill='#c80e3d',outline='#ffda3b',width=3),d.polygon([(43,1),(61,1),(61,23),(54,17),(43,17)],fill='#ffda3b')))
def bonus_chest(d,im):
 d.rounded_rectangle((3,11,44,42),radius=4,fill='#a35c13',outline='#462d22',width=3);d.rectangle((10,3,37,14),fill='#fbd44d',outline='#67401e',width=2)
 for x in [4,35]:d.rectangle((x,12,x+9,40),fill='#ffd142',outline='#6a441b',width=2);d.rectangle((x-1,18,x+10,26),fill='#f0bd30',outline='#7c501d',width=1)
 d.arc((15,10,31,26),0,300,fill='#ffe679',width=5);d.line((21,10,21,17),fill='#ffe679',width=4)
geo('bonus-chest',(48,48),bonus_chest)
manifest.write_text(json.dumps({'assets':assets},ensure_ascii=False,indent=2)+'\n');print('daily assets',len(assets))
