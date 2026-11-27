from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,math,hashlib,shutil
s=Path('/Users/max/projest_max/ui-studio/samples/capybara-go');root=s.parents[1];work=s/'_작업/codex/wheel01';master=s/'ui-studio/assets/authoring/wheel/v001';prod=s/'ui-studio/assets/production/wheel';stage=root/'src/tools/uxStudio/assets/import-staging/capybara-go'
for p in (work,master,prod,stage):p.mkdir(parents=True,exist_ok=True)
mf=work/'assets.json';assets=json.loads(mf.read_text())['assets'] if mf.exists() else []
def add(role,im,method='new geometry; source pixels0'):
 if any(a['role']==role for a in assets):return
 m=master/f'capybara_wheel_{role}_v001.png';im.save(m);p=prod/f'capybara_wheel_{role}_v001.webp';im.save(p,'WEBP',quality=95,method=6);shutil.copy2(p,stage/p.name)
 assert p.stat().st_size<=300000
 assets.append(dict(role=role,master=str(m),production=str(p),uiPath='/ui-studio/source/assets/import-staging/capybara-go/'+p.name,sha256=hashlib.sha256(p.read_bytes()).hexdigest(),bytes=p.stat().st_size,size=list(im.size),method=method,applied=False))
def geo(role,size,fn):
 im=Image.new('RGBA',size);fn(ImageDraw.Draw(im),im);add(role,im)
def glyph(kind):
 im=Image.new('RGBA',(52,52));d=ImageDraw.Draw(im)
 if kind=='stone':
  d.polygon([(16,3),(38,5),(47,24),(38,45),(14,47),(5,27)],fill='#00c9aa',outline='#194539',width=3);d.line([(29,12),(20,14),(15,26),(22,34),(35,33),(38,24),(26,24),(26,29)],fill='#008f83',width=5)
 elif kind=='grace':
  d.polygon([(15,6),(37,7),(47,23),(33,43),(14,42),(6,24)],fill='#8fd1df',outline='#41405d',width=3);d.polygon([(15,7),(37,8),(28,23),(7,24)],fill='#beedec');d.polygon([(28,23),(46,23),(32,42),(15,41)],fill='#8879d4')
 elif kind=='horseshoe':
  d.arc((7,3,45,44),0,310,fill='#5c3a17',width=13);d.arc((7,3,45,44),0,310,fill='#ffc544',width=8);d.ellipse((29,0,43,14),fill='#ffd766',outline='#755022',width=2)
 elif kind=='gold':
  d.ellipse((5,4,47,46),fill='#ffc635',outline='#75461b',width=3);d.ellipse((12,11,40,39),fill='#f69913',outline='#ffec8e',width=3)
 elif kind=='key':
  d.ellipse((6,18,28,43),fill='#ffca4e',outline='#74491f',width=3);d.ellipse((12,25,21,35),fill='#ffedb7',outline='#74491f',width=2);d.line((23,24,40,7),fill='#71431c',width=11);d.line((23,24,40,7),fill='#ffc347',width=7);d.line((32,12,40,20),fill='#71431c',width=7);d.line((32,12,40,20),fill='#ffce5b',width=4)
 elif kind=='feed':
  d.rounded_rectangle((8,17,44,34),radius=7,fill='#f9c677',outline='#704d2d',width=2)
  for x,y in [(6,12),(33,12),(6,28),(33,28)]:d.ellipse((x,y,x+12,y+12),fill='#ffce83',outline='#704d2d',width=2)
  d.rectangle((14,17,38,34),fill='#ffce83')
  for x,y in [(18,23),(29,28),(34,20)]:d.ellipse((x,y,x+3,y+3),fill='#a97741')
 elif kind=='egg':
  d.ellipse((10,4,42,47),fill='#905fc7',outline='#4c3446',width=3);d.rectangle((12,23,40,33),fill='#ffc24b',outline='#75522b',width=2);d.line((16,10,16,39),fill='#ffd175',width=3)
 else:
  d.rounded_rectangle((17,5,34,44),radius=3,fill='#af962a',outline='#573821',width=3)
  for y in (6,21,37):d.ellipse((12,y,39,y+10),fill='#f0b63b',outline='#60431f',width=2)
  d.ellipse((17,8,34,13),fill='#388d83')
 return im
labels=['스톤×100','천의 은총×10','황금 말굽쇠×10','골드×14.7K','금 열쇠×1','사료×300','펫 알×10','망원경×10'];kinds=['stone','grace','horseshoe','gold','key','feed','egg','telescope']
def wheel(d,im):
 d.ellipse((4,13,508,511),fill='#b85912',outline='#291b15',width=5);d.ellipse((4,3,508,507),fill='#ffbd2c',outline='#302318',width=5);d.ellipse((14,13,498,497),fill='#f7d05b',outline='#8c5026',width=5);d.ellipse((27,26,485,484),fill='#91614e',outline='#322520',width=5)
 for i in range(8):
  a=-112.5+i*45;d.pieslice((40,39,472,471),a,a+45,fill='#f6e1b3' if i!=7 else '#ed6a83',outline='#3c3226',width=4)
 d.ellipse((40,39,472,471),outline='#30261f',width=5)
 for i in range(8):
  th=math.radians(-90+i*45);sp=glyph(kinds[i]);x=256+math.cos(th)*128;y=255+math.sin(th)*128;im.alpha_composite(sp,(round(x-26),round(y-26)))
  txt=Image.new('RGBA',(190,36));td=ImageDraw.Draw(txt);f=ImageFont.truetype('/System/Library/Fonts/AppleSDGothicNeo.ttc',17,index=6);td.text((95,18),labels[i],font=f,fill='#fff8dc',stroke_width=2,stroke_fill='#3b382b',anchor='mm');txt=txt.rotate(-i*45,expand=True,resample=Image.Resampling.BICUBIC);tx=256+math.cos(th)*183;ty=255+math.sin(th)*183;im.alpha_composite(txt,(round(tx-txt.width/2),round(ty-txt.height/2)))
 for i in range(16):
  th=math.radians(i*22.5);x=256+math.cos(th)*222;y=255+math.sin(th)*222;d.ellipse((x-3,y-3,x+3,y+3),fill='#cac6c3',outline='#403a38',width=1)
 d.ellipse((185,184,327,326),fill='#f8c342',outline='#3c2919',width=4);d.ellipse((193,192,319,318),fill='#765133',outline='#bd8f39',width=4);d.ellipse((201,200,311,310),fill='#684a34',outline='#403321',width=3)
geo('wheel-static',(512,512),wheel)
def pointer(d,im):
 d.polygon([(5,20),(16,3),(49,3),(60,20),(32,92)],fill='#ffb72b',outline='#3a2031',width=4);d.polygon([(12,22),(20,10),(44,10),(53,22),(32,76)],fill='#e04a71',outline='#812a47',width=3);d.ellipse((26,16,39,29),fill='#ffbe69')
geo('pointer',(66,96),pointer)
geo('arrow',(52,72),lambda d,im:(d.polygon([(47,3),(4,36),(47,69)],fill='#fcbe28',outline='#593e14',width=4),d.polygon([(40,14),(13,36),(40,58)],fill='#a92bdb',outline='#6a195f',width=3),d.line((37,21,21,35),fill='#f78cff',width=3)))
geo('arrow-right',(52,72),lambda d,im:(d.polygon([(5,3),(48,36),(5,69)],fill='#fcbe28',outline='#593e14',width=4),d.polygon([(12,14),(39,36),(12,58)],fill='#a92bdb',outline='#6a195f',width=3),d.line((15,21,31,35),fill='#f78cff',width=3)))
geo('ribbon',(444,62),lambda d,im:(d.polygon([(26,18),(1,28),(10,56),(48,56),(48,18)],fill='#d97b15',outline='#624221',width=3),d.polygon([(418,18),(443,28),(434,56),(396,56),(396,18)],fill='#d97b15',outline='#624221',width=3),d.rounded_rectangle((24,2,420,49),radius=5,fill='#ffbe24',outline='#6c451e',width=3),d.line((29,5,414,5),fill='#ffe48a',width=3)))
geo('timer',(270,30),lambda d,im:d.rounded_rectangle((1,1,268,28),radius=14,fill=(39,26,20,230),outline='#91631e',width=2))
geo('bottom-panel',(474,94),lambda d,im:(d.rounded_rectangle((1,1,472,92),radius=8,fill='#ffc34c',outline='#4d3522',width=4),d.line((8,5,463,5),fill='#ffeb9e',width=2)))
geo('bottom-strip',(504,42),lambda d,im:d.rectangle((0,0,503,41),fill=(20,15,19,235)))
geo('small-counter',(102,26),lambda d,im:d.rounded_rectangle((1,1,100,24),radius=12,fill=(16,24,20,235),outline='#966a28',width=2))
for role,color in [('green-button','#a3c900'),('reward-orange','#f69022'),('reward-blue','#93a9b8'),('reward-red','#e44b68')]:
 geo(role,(212,50) if role=='green-button' else (60,60),lambda d,im,c=color:(d.rounded_rectangle((1,1,im.width-2,im.height-2),radius=4,fill='#424124',outline='#302622',width=3),d.rounded_rectangle((3,3,im.width-4,im.height-6),radius=3,fill=c,outline='#e5e4aa',width=2)))
for kind in ['key','stone','gold','telescope','grace','horseshoe','feed','egg']:add('item-'+kind,glyph(kind))
geo('item-stone-blue',(52,52),lambda d,im:(d.polygon([(14,4),(38,5),(49,25),(36,47),(12,45),(3,24)],fill='#07b7e5',outline='#153f7c',width=3),d.line([(30,13),(20,14),(13,26),(23,36),(37,30),(34,22),(25,24)],fill='#1465b1',width=6)))
def exchange(d,im):
 d.rounded_rectangle((5,22,91,65),radius=5,fill='#b77626',outline='#31283d',width=3);d.rounded_rectangle((9,4,87,37),radius=10,fill='#f5ba29',outline='#30243b',width=4)
 for x in (20,66):d.rectangle((x,7,x+9,62),fill='#ffe391',outline='#78501d',width=2)
 d.rectangle((9,30,86,38),fill='#ffdc6a');d.polygon([(48,25),(56,31),(56,46),(48,52),(40,46),(40,31)],fill='#8949ba',outline='#f7d269',width=2);d.polygon([(44,35),(48,38),(52,35),(53,40),(48,45),(43,40)],fill='#fcd445')
geo('exchange-chest',(98,70),exchange)
def privilege(d,im):
 d.ellipse((1,1,70,70),fill='#903dd3',outline='#2e2442',width=3);d.rounded_rectangle((9,22,60,59),radius=3,fill='#ffc834',outline='#50341c',width=3);d.rectangle((7,17,62,29),fill='#ffdf69',outline='#62401f',width=2);d.rectangle((29,20,39,59),fill='#fff1a8',outline='#946020',width=1);d.ellipse((14,5,34,21),fill='#ffe592',outline='#624320',width=2);d.ellipse((34,5,54,21),fill='#ffd16b',outline='#624320',width=2);d.ellipse((43,44,69,70),fill='#ffd555',outline='#684728',width=2);d.ellipse((47,48,65,66),fill='#e7f0df',outline='#567385',width=1);d.line((56,49,56,57,61,60),fill='#d87926',width=2)
geo('privilege',(72,72),privilege)
geo('draw-token',(28,28),lambda d,im:(d.ellipse((1,1,26,26),fill='#ffd369',outline='#57452d',width=2),d.ellipse((5,5,22,22),fill='#f5f3d5',outline='#647f92',width=2),d.line((14,6,14,14,19,17),fill='#ca622d',width=2)))
mf.write_text(json.dumps({'assets':assets},ensure_ascii=False,indent=2)+'\n')
data=dict(unit='C19',title='보물 탐험대',status='새그림준비·native미조립',logicalSize=[504,894],timer='3일 23:50:37 후 종료',lucky=0,drawTokens=0,segments=labels,milestones=[{'item':'key','qty':10,'progress':'0/60'},{'item':'token','qty':10,'progress':'0/120'},{'item':'stone','qty':5,'progress':'0/180'}],guarantee='300회 뽑기 진행 후 반드시 한정 보상 획득',draws=[{'label':'뽑기 1회','cost':1},{'label':'뽑기 10회','cost':10}],recent='にゃんたろー 획득: 망원경×10',unobserved=['뽑기결과','양옆다음원판','확률표','교환/특혜목적지'],staticBoundary='원판의8구역그림·회전배치문구는정적게임영역스틸로새로제작. 중심행운값/외부타이틀/타이머/카운터/누적보상/버튼/최근획득은별도native표시. 회전·확률·재화차감·보상생성없음.')
(work/'wheel-ui-data.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n');print('wheel assets',len(assets),'max bytes',max(a['bytes'] for a in assets))
