import json, shutil, hashlib
from pathlib import Path
from PIL import Image, ImageDraw
ROOT=Path(__file__).resolve().parents[3]
OUT=ROOT/'ui-studio/assets/production/v001'; MASTER=ROOT/'ui-studio/assets/authoring/v001'
OUT.mkdir(parents=True,exist_ok=True); MASTER.mkdir(parents=True,exist_ok=True)
manifest=[]
def save(role,im,method,master=None):
 p=OUT/(role+'.webp'); im.save(p,'WEBP',quality=88,method=6)
 assert p.stat().st_size<=300000,(role,p.stat().st_size)
 manifest.append(dict(role=role,path=str(p),master=str(master or MASTER/(role+'.png')),sha256=hashlib.sha256(p.read_bytes()).hexdigest(),size=list(im.size),bytes=p.stat().st_size,method=method))
for batch in [1,2,3]:
 for a in json.loads((ROOT/f'_작업/codex/video01/generated-batch{batch}.json').read_text()):
  p=MASTER/(a['role']+'.png'); shutil.copy2(a['path'],p); im=Image.open(p); im.thumbnail((1024,1200) if a['role'].startswith('town') else (960,640) if 'banner' in a['role'] else (480,480));save(a['role'],im,'fresh built-in imagegen; aspect-preserving production resize',p)
def art(role,w,h,fn):
 im=Image.new('RGBA',(w*3,h*3)); d=ImageDraw.Draw(im); fn(d,3,w,h);im=im.resize((w,h),Image.Resampling.LANCZOS);im.save(MASTER/(role+'.png'));save(role,im,'fresh deterministic geometric UI drawing; no reference pixels')
def panel(d,s,w,h,fill='#f0e4c8',border='#99876a'):
 d.rounded_rectangle((1*s,1*s,(w-1)*s,(h-1)*s),radius=5*s,fill=fill,outline=border,width=2*s)
 d.line((4*s,4*s,(w-4)*s,4*s),fill='#fff7e2',width=2*s)
for role,w,h,fill,border in [('paper',390,428,'#f0e4c8','#aa936d'),('modal',366,440,'#f1e5cb','#a88e66'),('header',390,42,'#9b8866','#70634c'),('nav',390,68,'#b0a68b','#796f55'),('hud',390,62,'#173d2bcc','#173d2bcc'),('chat',390,44,'#173d2bcc','#173d2bcc'),('quest',300,35,'#253c42bb','#253c42bb'),('row',366,92,'#faf4e6','#c6b697'),('reward',56,56,'#ddc6a4','#8d7457'),('reward-blue',56,56,'#a8cadc','#6d8da5'),('reward-purple',56,56,'#bb9dc4','#82658c'),('card',168,200,'#c0b38c','#75684c'),('card-selected',168,200,'#a5be88','#548343'),('bar',200,12,'#3a483a','#6a7858'),('bar-fill',200,12,'#83b53e','#456c2e'),('dim',390,844,'#101810b0','#101810b0')]:
 art(role,w,h,lambda d,s,w,h,f=fill,b=border:panel(d,s,w,h,f,b))
for color,front,edge,base in [('teal','#58acaa','#2e7474','#225252'),('gold','#efb940','#a77a2e','#76592d'),('green','#8eae53','#56753d','#405932'),('gray','#b1b3a8','#777c73','#575e56')]:
 for state,dy in [('normal',0),('pressed',2)]:
  def button(d,s,w,h,dy=dy,f=front,e=edge,b=base):
   d.rounded_rectangle((2*s,6*s,(w-2)*s,(h-1)*s),radius=4*s,fill=b,outline='#4c4b3e',width=s)
   d.rounded_rectangle((2*s,(2+dy)*s,(w-2)*s,(h-7+dy)*s),radius=4*s,fill=f,outline=e,width=2*s)
   d.line((7*s,(5+dy)*s,(w-7)*s,(5+dy)*s),fill='#fff5c380',width=s)
  art('button-'+color+'-'+state,168,48,button)
# Simple native icon family; high resolution geometry retained as individual masters.
def icon(role,d,s,w,h):
 def poly(p,fill='#f8f4df',outline='#645b43',width=2):d.polygon([(x*s,y*s) for x,y in p],fill=fill,outline=outline,width=width*s)
 def box(r,fill,outline='#665139',width=2):d.rounded_rectangle(tuple(x*s for x in r),radius=2*s,fill=fill,outline=outline,width=width*s)
 def line(p,fill='#f7f2de',width=4):d.line([(x*s,y*s) for x,y in p],fill=fill,width=width*s,joint='curve')
 if role=='gem':
  poly([(6,22),(17,9),(45,9),(58,22),(32,56)],'#42c6eb','#21788d');poly([(17,9),(24,22),(32,56),(6,22)],'#91e2f6');poly([(45,9),(40,22),(32,56),(58,22)],'#218eae');line([(7,22),(57,22)],'#c0f4fc',2)
 elif role=='bread':
  d.ellipse((5*s,18*s,59*s,47*s),fill='#d18a35',outline='#774d25',width=2*s);d.ellipse((7*s,14*s,58*s,40*s),fill='#f1ba56',outline='#a56e2d',width=2*s)
  for x in [20,30,40]:line([(x,19),(x+6,30)],'#fff0b2',3)
 elif role=='wood':
  for y in [19,32]:
   box((8,y,50,y+15),'#a66c3b');d.ellipse((40*s,y*s,58*s,(y+16)*s),fill='#ddaf6e',outline='#795536',width=2*s);d.ellipse((45*s,(y+5)*s,54*s,(y+12)*s),outline='#a77a48',width=s)
 elif role in ['stone','iron']:
  fill='#b1bfc4' if role=='stone' else '#788491'
  poly([(5,48),(9,30),(23,23),(32,34),(46,20),(58,32),(57,51)],fill);poly([(9,30),(23,23),(25,42),(5,48)],'#d4d9d5' if role=='stone' else '#9aa8ad')
 elif role=='clock':
  d.ellipse((7*s,7*s,57*s,57*s),fill='#f1e6c9',outline='#706b4e',width=4*s);line([(32,17),(32,33),(44,33)],'#47797a',4)
 elif role=='gift':
  box((7,26,57,57),'#dca548');box((4,20,60,31),'#f8c85b');box((28,20,36,58),'#e76445');line([(32,20),(19,8),(10,13),(32,22),(49,8),(56,14),(32,22)],'#e55240',6)
 elif role=='crown':poly([(6,17),(18,27),(31,8),(44,27),(58,17),(52,49),(12,49)],'#efd16a','#987137')
 elif role=='scroll':
  poly([(14,8),(52,8),(47,54),(8,54)],'#f3e1b4','#9a7545');line([(22,21),(42,21)],'#ad8e5b',2);line([(21,31),(40,31)],'#ad8e5b',2);line([(19,41),(36,41)],'#ad8e5b',2)
 elif role=='swords':
  poly([(9,7),(20,9),(52,43),(43,52)],'#f9f8e9');poly([(55,7),(44,9),(12,43),(21,52)],'#e9ebdf');line([(5,41),(22,58)],'#a89a6b',5);line([(42,58),(59,41)],'#a89a6b',5)
 elif role=='helmet':
  poly([(11,47),(13,22),(25,12),(32,6),(38,13),(51,23),(53,47),(40,55),(39,34),(32,39),(25,34),(24,55)],'#f5f3e0');poly([(16,27),(27,31),(25,36),(17,33)],'#786f50');poly([(47,27),(36,31),(38,36),(46,33)],'#786f50')
 elif role=='bag':
  poly([(19,9),(26,6),(34,13),(43,6),(47,11),(38,23),(47,36),(51,48),(43,57),(21,57),(12,49),(16,35),(26,23)],'#f7f3de');line([(23,24),(41,24)],'#9b9174',3)
 elif role=='shop':
  box((12,29,53,57),'#f8f3dc');poly([(6,24),(15,8),(49,8),(59,24)],'#f7f3de');box((26,38,39,57),'#8d856c');line([(8,28),(56,28)],'#a29778',3)
 elif role=='flag':
  line([(15,6),(15,58)],'#f8f4e0',4);poly([(20,10),(53,10),(53,52),(36,43),(20,52)],'#f5f1dc')
 elif role=='map':
  poly([(5,15),(23,7),(42,14),(59,7),(56,51),(40,58),(22,51),(6,58)],'#497f77');line([(23,8),(22,51)],'#dbd5b4',3);line([(42,14),(40,58)],'#dbd5b4',3);line([(12,41),(20,30),(31,36),(45,22),(50,29)],'#bb694b',3)
 elif role=='mail':
  box((5,14,59,51),'#f2f1e6');line([(7,17),(32,36),(57,17)],'#8d8b7a',3)
 elif role=='close':line([(16,16),(48,48)],'#f9f4e0',5);line([(48,16),(16,48)],'#f9f4e0',5)
 elif role=='back':line([(39,12),(19,32),(39,52)],'#fff9e8',5)
 elif role=='check':line([(11,32),(26,46),(54,15)],'#4e9a49',7)
 elif role=='lock':
  d.arc((18*s,5*s,46*s,43*s),180,360,fill='#b7ab8d',width=5*s);box((12,27,52,57),'#c9bea1');box((28,36,36,49),'#766d56')
 elif role=='worker':
  d.ellipse((19*s,8*s,45*s,36*s),fill='#edc39a',outline='#655344',width=2*s);poly([(14,57),(14,43),(25,34),(39,34),(50,43),(50,57)],'#b2a58a');poly([(17,18),(23,6),(41,6),(47,20)],'#806047')
 elif role=='food':line([(19,8),(19,55)],'#e7d488',4);line([(12,8),(12,24),(26,24),(26,8)],'#e7d488',3);line([(46,8),(40,23),(45,29),(45,55)],'#e7d488',5)
 elif role=='fist':poly([(15,54),(8,31),(12,18),(20,18),(21,8),(30,9),(32,17),(42,11),(48,18),(48,37),(39,55)],'#b9dcd9','#577e78')
 elif role=='crate':
  box((7,12,57,56),'#bd8c4d');line([(9,22),(55,22)],'#684f32',4);line([(9,45),(55,45)],'#684f32',4);line([(15,15),(15,54)],'#edba71',4);line([(49,15),(49,54)],'#edba71',4)
 elif role=='stove':
  box((8,28,56,56),'#a6a99f');box((15,8,49,32),'#b37b49');box((17,35,39,56),'#4a433b');poly([(21,51),(27,39),(32,49),(36,43),(37,54)],'#ef9638');box((43,5,53,31),'#929c95')
 elif role=='table':poly([(6,24),(41,13),(59,24),(24,37)],'#cfa05e');line([(13,28),(13,53)],'#8d613c',6);line([(49,29),(49,53)],'#8d613c',6)
 elif role=='shelf':
  box((9,7,55,57),'#9f713e');box((14,13,50,25),'#493e2f');box((14,31,50,43),'#493e2f');box((14,49,50,53),'#493e2f')
 elif role=='sink':box((8,25,56,57),'#b4b9ac');box((13,29,51,42),'#6d8a88');line([(36,26),(36,12),(45,12),(45,19)],'#c0c8b6',4)
 else: raise ValueError(role)
for r in ['gem','bread','wood','stone','iron','clock','gift','crown','scroll','swords','helmet','bag','shop','flag','map','mail','close','back','check','lock','worker','food','fist','crate','stove','table','shelf','sink']:
 art('icon-'+r,64,64,lambda d,s,w,h,r=r:icon(r,d,s,w,h))
(ROOT/'_작업/codex/video01/assets.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print(len(manifest),'roles',max(a['bytes'] for a in manifest),'max bytes')
