from pathlib import Path
from PIL import Image,ImageDraw
import json,hashlib
r=Path(__file__).resolve().parents[3];a=r/'ui-studio/assets/authoring/v004';p=r/'ui-studio/assets/production/v004';a.mkdir(parents=True,exist_ok=True);p.mkdir(parents=True,exist_ok=True)
m=r/'_작업/codex/video01/assets.json';data=json.loads(m.read_text())
def make(name,size,paint):
 im=Image.new('RGBA',size);d=ImageDraw.Draw(im);paint(d,*size);mp=a/(name+'.png');out=p/(name+'.webp');im.save(mp);im.save(out,lossless=True);b=out.read_bytes();data.append(dict(role=name,path=str(out),master=str(mp),sha256=hashlib.sha256(b).hexdigest(),size=list(size),bytes=len(b),method='fresh geometric drawing from shared layout tokens; no source pixels'))
def rr(fill,edge=None,radius=8,width=2):
 return lambda d,w,h:d.rounded_rectangle((1,1,w-2,h-2),radius,fill,edge,width)
make('clear',(2,2),lambda d,w,h:None)
make('event-tabs-bg',(390,76),rr('#68543e',radius=0))
make('tab-event-normal',(128,76),rr('#ae9472','#5f4934',10,2))
make('tab-event-selected',(128,76),rr('#f9edd7','#ffffff',10,3))
make('event-panel',(378,710),rr('#c3a786','#fffaf0',14,5))
make('event-tag',(146,24),lambda d,w,h:d.polygon([(0,0),(w-12,0),(w,12),(w-12,h),(0,h)],fill='#f2a62f'))
make('event-progress',(366,54),rr('#da8f16','#f4b93d',radius=0))
make('event-progress-track',(248,18),rr('#866123','#654716',7))
make('event-progress-fill',(57,18),rr('#ffcb28','#ffe173',7))
make('event-row',(366,92),rr('#f4dcb5','#aa8151',10,2))
def head(d,w,h):
 d.rounded_rectangle((0,0,w-1,h-1),7,fill='#ac7338');d.polygon([(205,0),(w,0),(w,h),(225,h)],fill='#e5ad44')
make('event-row-head',(366,24),head)
for n,c,e in [('blue','#3c8bbc','#66d0ed'),('purple','#8669cf','#b395ed'),('gold','#e8ab4a','#ffe094')]:make('reward-'+n+'-v002',(56,56),rr(c,e,5,3))
def up(d,w,h):
 d.rounded_rectangle((1,1,w-2,h-2),8,'#ffc42d','#a86b0a',2);d.polygon([(11,23),(22,10),(33,23),(27,23),(27,34),(17,34),(17,23)],fill='#d77c0c',outline='#fff4a0')
make('icon-up',(44,44),up)
make('nav-mask',(65,68),rr('#b0a68b',radius=0,width=0))
def mapicon(d,w,h):
 d.polygon([(4,10),(17,4),(30,10),(46,4),(49,43),(34,49),(20,43),(7,49)],fill='#e4dfcb',outline='#918771',width=3);d.line([(17,5),(20,42)],fill='#a99e85',width=2);d.line([(30,10),(34,48)],fill='#a99e85',width=2)
make('icon-map-normal',(52,52),mapicon)
make('badge-red',(14,14),lambda d,w,h:d.ellipse((0,0,w-1,h-1),fill='#e72925',outline='#7c271c',width=1))
make('badge-wide',(26,18),rr('#e72925','#7c271c',8,1))
# Idempotent manifest role entries.
by={x['role']:x for x in data};m.write_text(json.dumps(list(by.values()),ensure_ascii=False,indent=2));print('roles',len(by),'max',max(x['bytes'] for x in by.values()))
