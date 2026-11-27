#!/usr/bin/env python3
"""Clash sample original vector geometry. No source screenshots, design JSON or runtime writes."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageChops, ImageFont
import runpy, json, hashlib, shutil, datetime, sys, math, xml.etree.ElementTree as ET

ROOT=Path('/Users/max/projest_max/ui-studio')
WORK=ROOT/'_작업/codex/ux-studio/clash-sample-20261118/geometry'
AUTHOR=ROOT/'samples/clash-royale/ui-studio/assets/authoring/geometry-v001'
STAGE=ROOT/'src/tools/uxStudio/assets/import-staging/clash-royale-geometry'
HELPER=ROOT/'_작업/codex/ux-studio/unique-frames32/geometry/pillow_svg.py'
render_svg=runpy.run_path(str(HELPER))['render_svg']
NOW=datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).isoformat(timespec='seconds')
ASSETS=[]

def rr(x,y,w,h,r):
 return f'M{x+r},{y} H{x+w-r} Q{x+w},{y} {x+w},{y+r} V{y+h-r} Q{x+w},{y+h} {x+w-r},{y+h} H{x+r} Q{x},{y+h} {x},{y+h-r} V{y+r} Q{x},{y} {x+r},{y} Z'
def path(d,fill,stroke=None,sw=1,opacity=None):
 return '<path d="'+d+'" fill="'+fill+'"'+(f' stroke="{stroke}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"' if stroke else '')+(f' opacity="{opacity}"' if opacity is not None else '')+'/>'
def poly(points,fill,stroke=None,sw=1):
 return path('M'+' L'.join(f'{x},{y}' for x,y in points)+' Z',fill,stroke,sw)
def circle(cx,cy,r,fill,stroke=None,sw=1):
 return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}"'+(f' stroke="{stroke}" stroke-width="{sw}"'if stroke else '')+'/>'
def ellipse(cx,cy,rx,ry,fill,opacity=None):
 return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{fill}"'+(f' opacity="{opacity}"'if opacity is not None else '')+'/>'
def grad(name,stops,radial=False):
 tag='radialGradient' if radial else 'linearGradient'
 return f'<{tag} id="{name}" x1="0" y1="0" x2="0" y2="1">'+''.join(f'<stop offset="{p}" stop-color="{color}"'+(f' stop-opacity="{op}"'if op is not None else '')+'/>'for p,color,op in stops)+f'</{tag}>'
def svg(w,h,body,defs=''):
 return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><defs>{defs}</defs>{body}</svg>'
def add(name,w,h,body,defs='',mode=None,slices=None,edges=None,role='',center='',phase='core'):
 ASSETS.append(dict(name=name,w=w,h=h,svg=svg(w,h,body,defs),mode=mode,slices=slices,edges=edges,padding=[0,0,0,0],role=role,center=center,phase=phase))

def frame(name,w,h,outer,inner,gloss,radius,slice_px,edge_px):
 body=path(rr(0,0,w,h,radius),outer)+path(rr(2,2,w-4,h-4,max(1,radius-2)),inner)+path(rr(3,3,w-6,7,max(1,radius-3)),gloss,opacity=.55)
 add(name,w,h,body,mode='9',slices=[slice_px]*4,edges=[edge_px]*4,role='normal frame; text/input/shadow separate native',center='intentional opaque backplate')
frame('dark-resource-cell9-v001',160,40,'#14344e','#0a2339','#4c7e98',6,8,4)
frame('panel-blue9-v001',128,128,'#092b55','#176faa','#65c5ef',10,12,8)
frame('panel-white9-v001',128,128,'#b4cbd6','#eff7fa','#ffffff',10,12,8)
frame('panel-purple9-v001',128,128,'#38215e','#6e48aa','#b18de0',10,12,8)
# Dark center is deliberately opaque: this is a card backplate, not card artwork or a transparent art mask.
body=path(rr(0,0,96,128,8),'#66839c')+path(rr(1,1,94,126,7),'url(#silver)')+path(rr(5,5,86,118,5),'#10293f')+path(rr(7,7,82,5,2),'#2d536d')
add('card-silver9-v001',96,128,body,grad('silver',[(0,'#f0f8ff',None),(.35,'#aec9db',None),(1,'#7590a8',None)]),mode='9',slices=[10]*4,edges=[5]*4,role='card frame/backplate; portrait/level/elixir/native text separate',center='intentional opaque dark backplate #10293f; no card artwork')
for name,palette in [('gold',('#7b4108','#b96e0d','#ffe879','#f7b82b','#d98b13')),('green',('#184515','#2a701b','#bded60','#7fc937','#4f9e24')),('blue',('#083e80','#125aa2','#8be5ff','#3baded','#1c7cc8'))]:
 outline,side,highlight,face,bottom=palette
 defs=grad('face',[(0,highlight,None),(.23,face,None),(1,bottom,None)])
 body=path(rr(0,0,160,64,12),outline)+path(rr(2,2,156,60,10),side)+path(rr(3,2,154,54,9),'url(#face)')+path(rr(8,5,144,7,4),'#ffffff',opacity=.38)
 add(f'button-{name}3-v001',160,64,body,defs,mode='3',slices=[0,20,0,20],edges=[0,10,0,10],role='normal button front/bevel/side; no label, native input/shadow/state',center='opaque material face; bottom thickness is body, not external shadow')
body=path(rr(0,0,64,64,10),'#7a1c2d')+path(rr(2,2,60,60,8),'#af2940')+path(rr(3,2,58,55,7),'url(#red)')+path(rr(7,5,50,6,3),'#ffb3a5',opacity=.6)
add('button-close-red9-v001',64,64,body,grad('red',[(0,'#ff8273',None),(.3,'#ed4a4d',None),(1,'#bd2940',None)]),mode='9',slices=[10]*4,edges=[6]*4,role='normal close button body only; separate close glyph/native input',center='opaque red material')

# Coin and gem: compact vector symbols without letters/numbers.
body=ellipse(32,35,26,25,'#8b560c')+circle(32,30,26,'url(#gold)','#704c12',2)+circle(32,30,21,'#f8bd32','#ffeb8a',2)+poly([(32,14),(44,30),(32,46),(20,30)],'#e59b19')+poly([(32,14),(32,46),(25,30)],'#ffdc64')
add('glyph-coin-v001',64,64,body,grad('gold',[(0,'#fff4a6',None),(.4,'#fbd24d',None),(1,'#dc8d17',None)]),role='currency coin glyph',center='transparent exterior; no currency text')
body=poly([(16,10),(48,10),(59,28),(32,57),(5,28)],'#092c2e','#092c2e',3)+poly([(16,11),(48,11),(57,28),(32,54),(7,28)],'#23b943')+poly([(16,11),(32,11),(25,28),(7,28)],'#aeff75')+poly([(32,11),(48,11),(57,28),(40,28)],'#55e75f')+poly([(25,28),(40,28),(32,54)],'#1a8f37')+poly([(7,28),(25,28),(32,54)],'#56df4e')+poly([(16,11),(48,11),(40,15),(20,15)],'#e4ffc7')
add('glyph-gem-v001',64,64,body,role='currency gem glyph',center='transparent exterior; faceted material only')

# Remaining symbols share transparent 64 or48px canvases. No text is used.
body=poly([(8,23),(19,32),(22,10),(32,27),(43,10),(46,32),(57,23),(51,49),(13,49)],'#ffc843','#714510',2)+path(rr(12,44,40,11,3),'#f6b82c','#714510',2)+poly([(22,10),(22,41),(16,37)],'#ffe88a')+poly([(43,10),(43,41),(48,37)],'#df961b')
add('glyph-crown-v001',64,64,body,role='crown glyph',center='transparent exterior',phase='extra')
body=path('M16,12 H48 V27 Q48,42 34,45 V51 H44 V58 H20 V51 H30 V45 Q16,42 16,27 Z','#f5bf32','#774812',2)+path('M17,16 H7 V26 Q7,36 22,37','none','#e4a322',5)+path('M47,16 H57 V26 Q57,36 42,37','none','#e4a322',5)+path('M22,16 V27 Q22,35 29,37','none','#ffe989',4)
add('glyph-trophy-v001',64,64,body,role='trophy glyph',center='transparent exterior',phase='extra')
body=''.join(path(rr(7,y,34,6,3),'#eef8ff','#234e75',1)for y in [10,21,32])
add('glyph-menu-v001',48,48,body,role='three bar menu glyph',center='transparent exterior',phase='extra')
body=circle(18,21,8,'#bbdcf4','#22547c',2)+circle(46,21,8,'#bbdcf4','#22547c',2)+path('M4,52 V42 Q4,32 18,32 Q28,32 30,41 V52 Z','#9fc6e8','#22547c',2)+path('M34,52 V42 Q36,32 46,32 Q60,32 60,42 V52 Z','#9fc6e8','#22547c',2)+circle(32,17,10,'#f0f8ff','#22547c',2)+path('M16,55 V43 Q16,31 32,31 Q48,31 48,43 V55 Z','#e5f4ff','#22547c',2)
add('glyph-people-v001',64,64,body,role='social people glyph',center='transparent exterior',phase='extra')
body=path(rr(9,9,31,45,4),'#b6daef','#1d4c76',2)+path(rr(20,6,32,46,4),'#e8f8ff','#1d4c76',2)+path(rr(25,12,22,30,2),'#3b8dc9')+poly([(36,17),(43,28),(36,37),(29,28)],'#8fd9fa')+path(rr(25,46,22,3,1),'#6599bd')
add('glyph-cards-v001',64,64,body,role='card stack glyph; no portrait/level/value',center='transparent exterior',phase='extra')
blade='#e0eff7';edge='#3a5e7c';hilt='#f4bc38'
body=poly([(10,6),(20,10),(49,44),(42,50),(12,17)],blade,edge,2)+poly([(11,7),(15,16),(45,47),(48,44)],'#90b8d6')+path('M36,47 L49,36','none',hilt,7)+path('M45,48 L55,58','none',hilt,7)+poly([(54,6),(44,10),(15,44),(22,50),(52,17)],blade,edge,2)+poly([(53,7),(49,16),(19,47),(16,44)],'#ffffff')+path('M15,36 L28,49','none',hilt,7)+path('M19,48 L9,58','none',hilt,7)
add('glyph-swords-v001',64,64,body,role='crossed swords glyph',center='transparent exterior',phase='extra')
body=path(rr(11,28,42,29,3),'#dbeef7','#235780',2)+path(rr(25,39,14,18,1),'#5891b9')+path('M7,17 H57 L53,30 H11 Z','#df6358','#235780',2)+path('M10,17 L13,8 H51 L55,17 Z','#f18e69','#235780',2)+path('M19,17 H28 V29 H19 Z','#fff2cb')+path('M37,17 H46 V29 H37 Z','#fff2cb')+path(rr(15,37,8,10,1),'#85c9ed')
add('glyph-shop-v001',64,64,body,role='shop awning glyph',center='transparent exterior',phase='extra')
body=path('M28,57 Q7,43 12,15 M36,57 Q57,43 52,15','none','#a16a14',2)
for side in [-1,1]:
 for j in range(6):
  y=18+j*6;cx=32+side*(19-abs(j-1.7)*1.2)
  body+=ellipse(cx,y,4.8,2.8,'#f6cc5a')
body+=path('M25,58 Q32,53 39,58','none','#f6cc5a',3)
add('glyph-laurel-v001',64,64,body,role='laurel wreath glyph',center='transparent center and exterior',phase='extra')
body=poly([(24,5),(42,23),(32,23),(32,42),(16,42),(16,23),(6,23)],'#77dc58','#185e35',2)+poly([(24,9),(35,21),(27,21),(27,38),(20,38),(20,21),(13,21)],'#c0f48a')
add('glyph-arrowup-v001',48,48,body,role='upgrade up arrow glyph',center='transparent exterior',phase='extra')
body=path('M8,24 L19,35 L40,12','none','#174d36',10)+path('M8,22 L19,33 L40,10','none','#e6ffd2',6)
add('glyph-check-v001',48,48,body,role='check glyph',center='transparent exterior',phase='extra')
body=path('M12,12 L36,36 M36,12 L12,36','none','#803344',9)+path('M12,11 L36,35 M36,11 L12,35','none','#fff8ef',5)
add('glyph-close-v001',48,48,body,role='close cross glyph; separate from red button body',center='transparent exterior',phase='extra')
body=path('M32,4 C28,14 10,29 10,41 C10,53 19,61 32,61 C45,61 54,53 54,41 C54,29 36,14 32,4 Z','url(#elixir)','#5a237e',2)+path('M27,24 Q18,36 19,43 Q20,48 24,49','none','#f7b8ff',5)
add('glyph-elixir-v001',64,64,body,grad('elixir',[(0,'#f28bef',None),(.45,'#c55cdd',None),(1,'#8434af',None)]),role='elixir tear glyph',center='transparent exterior; no value text',phase='extra')

# Social symbols: source B-F04 viewed for silhouette only. Original vector geometry, no pixel copies.
body=poly([(14,15),(18,8),(30,8),(34,15)],'#f1fbff','#204b61',2)+path(rr(5,14,38,29,4),'#f1fbff','#204b61',2)+circle(24,28,9,'#d7e9f0','#204b61',2)+circle(24,28,6,'#6ba6ba')+circle(22,26,2,'#d8f8ff')+path(rr(34,18,5,3,1),'#2c6075')
add('glyph-camera-v001',48,48,body,role='Social camera glyph; white body/dark outline',center='transparent exterior; no text or frame',phase='extra')
body=poly([(15,5),(4,17),(11,17),(11,41),(19,41),(19,17),(26,17)],'#f4fcff','#244d65',2)+poly([(29,7),(37,7),(37,31),(44,31),(33,43),(22,31),(29,31)],'#f4fcff','#244d65',2)
add('glyph-sort-v001',48,48,body,role='Social sort up/down arrows; white glyph',center='transparent exterior; no text or frame',phase='extra')
body=path('M6,15 H42 M6,33 H42','none','#16546d',7)+path('M6,15 H42 M6,33 H42','none','#20cdb0',4)+ellipse(17,15,5,7,'#ffd449')+ellipse(32,33,5,7,'#ffd449')+path('M17,8 C11,8 11,22 17,22 C23,22 23,8 17,8 Z','none','#33664d',1.5)+path('M32,26 C26,26 26,40 32,40 C38,40 38,26 32,26 Z','none','#33664d',1.5)
add('glyph-filter-v001',48,48,body,role='Social filter two teal horizontal sliders; yellow knobs from visual reference',center='transparent exterior; no text or frame',phase='extra')

# Black shackle, yellow metal body, geometric keyhole. No letters or baked external shadow.
body=path('M18,31 V20 C18,2 46,2 46,20 V31','none','#101b26',9)+path('M20,28 V20 C20,6 44,6 44,20','none','#344352',2)+path(rr(9,27,46,34,5),'#765012')+path(rr(11,28,42,31,4),'url(#lockgold)')+path(rr(14,30,36,5,2),'#ffec91')+circle(32,43,4,'#342710')+poly([(30,45),(34,45),(36,54),(28,54)],'#342710')
add('glyph-lock-v001',64,64,body,grad('lockgold',[(0,'#ffe071',None),(.35,'#f8bf38',None),(1,'#d89a1a',None)]),role='Royal Pass lock glyph; black shackle/yellow metal body/geometric keyhole',center='transparent exterior; no label or numbers',phase='extra')

# Two original full backgrounds. Code geometry, no screenshot pixels or image embeds.
light=[];dark=[]
for y in range(-32,900,42):
 for x in range(-42,450,42):
  d='M'+f'{x+21},{y} L{x+42},{y+21} L{x+21},{y+42} L{x},{y+21} Z'
  (light if ((x//42+y//42)%2)==0 else dark).append(d)
body=path('M0,0 H390 V844 H0 Z','url(#bg)')+path(' '.join(light),'#66baf1',opacity=.09)+path(' '.join(dark),'#082a5b',opacity=.09)
add('full-background-blue-v001',390,844,body,grad('bg',[(0,'#1b66a7',None),(.5,'#155284',None),(1,'#0a2b56',None)]),role='original diamond tile blue full background',center='fully opaque background',phase='extra')
body=path('M0,0 H390 V844 H0 Z','url(#main)')+ellipse(34,230,250,290,'url(#cyan)',.6)+ellipse(360,170,170,260,'url(#pink)',.55)+path('M0,600 Q120,480 235,650 Q315,760 390,644 V844 H0 Z','#103c63',opacity=.4)+path('M0,700 Q140,600 300,750 Q360,800 390,745 V844 H0 Z','#214171',opacity=.5)
defs=grad('main',[(0,'#458398',None),(.45,'#5c94a1',None),(1,'#1f4c70',None)])+grad('cyan',[(0,'#85cfcb',.9),(1,'#85cfcb',0)],True)+grad('pink',[(0,'#eec6d9',.9),(1,'#eec6d9',0)],True)
add('full-background-main-teal-pink-v001',390,844,body,defs,role='original teal/pink abstract main backdrop; no arena/gameplay image',center='fully opaque background',phase='extra')

def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def export(phase):
 chosen=[a for a in ASSETS if phase=='all' or a['phase']=='core']
 for p in [WORK,AUTHOR,STAGE]:p.mkdir(parents=True,exist_ok=True)
 records=[]
 for a in chosen:
  name=a['name'];doc=ET.fromstring(a['svg'])
  forbidden=[n.tag.split('}')[-1]for n in doc.iter()if n.tag.split('}')[-1]in ['text','image','filter','foreignObject']]
  assert not forbidden
  (AUTHOR/f'{name}.svg').write_text(a['svg'])
  im=render_svg(a['svg']).convert('RGBA');assert im.size==(a['w'],a['h'])
  im.save(AUTHOR/f'{name}.png',optimize=True)
  im.save(AUTHOR/f'{name}.webp',lossless=True,exact=True,method=6)
  web=Image.open(AUTHOR/f'{name}.webp').convert('RGBA')
  assert im.tobytes()==web.tobytes()
  assert (AUTHOR/f'{name}.webp').stat().st_size<=300000
  shutil.copy2(AUTHOR/f'{name}.webp',STAGE/f'{name}.webp')
  assert sha(AUTHOR/f'{name}.webp')==sha(STAGE/f'{name}.webp')
  alpha=im.getchannel('A');amin,amax=alpha.getextrema()
  if name.startswith('full-background'):assert amin==amax==255
  elif name.startswith('glyph'):assert amin==0 and amax==255
  if a['mode']:
   top,right,bottom,left=a['slices'];assert left+right<a['w'] and top+bottom<a['h']
   assert a['padding']==[0,0,0,0]
  record={k:v for k,v in a.items()if k!='svg'}
  record.update({'status':'제안(검수 대기) · native 미등록','nativePath':'/ui-studio/source/assets/import-staging/clash-royale-geometry/'+name+'.webp','svg':str(AUTHOR/f'{name}.svg'),'png':str(AUTHOR/f'{name}.png'),'webp':str(AUTHOR/f'{name}.webp'),'staging':str(STAGE/f'{name}.webp'),'sha256':{ext:sha(AUTHOR/f'{name}.{ext}')for ext in ['svg','png','webp']},'webpBytes':(AUTHOR/f'{name}.webp').stat().st_size,'pngBytes':(AUTHOR/f'{name}.png').stat().st_size,'alphaRange':[amin,amax],'alphaBBox':alpha.getbbox(),'textBaked':False,'externalShadowBaked':False,'source':'new code-native SVG; no screenshot crops, image_gen or existing sample asset copies','nativeLabelInputShadow':'separate native elements; no runtime behavior in asset'})
  records.append(record)
 manifest={'generatedAt':NOW,'status':'제안(검수 대기)','phase':phase,'renderer':str(HELPER),'newDependencies':0,'sourceScreenshotReads':0,'sourceDesignWrites':0,'nativeRegistrations':0,'arrayOrder':'top,right,bottom,left; slices source px; edges logical px; padding0','navCompositionProposal':{'outerWH':[78,66],'iconWH':[48,48],'labelFontSize':14,'sameOuterForAllFive':True,'selectedOnlyIconMayScale':True,'nativeTextInputAndSelection':True},'assets':records}
 (WORK/'geometry-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
 (AUTHOR/'geometry-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
 # Contact sheet has labels solely for QA; never imported as a UI asset.
 cols=4;cw=210;ch=190;rows=math.ceil(len(records)/cols)
 sheet=Image.new('RGB',(cols*cw,rows*ch),'#172b3e');draw=ImageDraw.Draw(sheet)
 for i,r in enumerate(records):
  x=(i%cols)*cw;y=(i//cols)*ch
  for yy in range(y+20,y+155,12):
   for xx in range(x+8,x+202,12):draw.rectangle((xx,yy,xx+11,yy+11),fill=('#315168'if((xx//12+yy//12)%2)else'#254154'))
  im=Image.open(r['png']).convert('RGBA');im.thumbnail((180,128),Image.Resampling.LANCZOS)
  sheet.paste(im,(x+(cw-im.width)//2,y+22+(130-im.height)//2),im)
  draw.text((x+8,y+158),r['name'].replace('-v001',''),fill='white')
  draw.text((x+8,y+174),f"{r['w']}x{r['h']} {r['mode'] or 'image'} {r['webpBytes']}B",fill='#bddded')
 sheet.save(WORK/('geometry-core-contact-sheet.png'if phase=='core'else'geometry-contact-sheet.png'))
 lines=['# Clash geometry v001',f'\n{NOW} · codex · 제안(검수 대기)\n','SVG/PNG原画/lossless WebP는 authoring에 보존했습니다. WebP만 import-staging에 복사했습니다. native 등록/조립/브라우저 검수0.\n','직접 작성한 코드 SVG이며 원본 캡처·기존 샘플 자원 복사·폰트문자/수치/라벨·외부 그림자 굽기0. 프레임의 약한 베벨/바닥 두께는 재질이며 외부 그림자는 native 엔진에 둡니다. 카드판의 중앙은 의도된 불투명 어두운 백판입니다.\n','배열 순서 TRBL. slice=source px, edge=논리px, padding은 전부 [0,0,0,0]. normal 프레임만 준비했고 native 버튼 상태/연결은 별도입니다.\n','|name|source px|slice / edge / padding|native path|WebP bytes|','|---|---|---|---|---|']
 for r in records:lines.append(f"|{r['name']}|{r['w']}×{r['h']}|{r['slices']} / {r['edges']} / {r['padding']}|{r['nativePath']}|{r['webpBytes']}|")
 lines+=['\nSVG/PNG/WebP 각 SHA256·정확 경로·alpha·bbox는 geometry-manifest.json을 참고합니다. PNG↔WebP RGBA 동일·staging SHA 동일·금지 SVG 노드0·WebP300KB 이하를 검사했습니다.','\n공통 5nav는 outer78×66 / icon48² / native label14 제안으로 인계합니다. 선택 때 icon/선택그림만 확대하되 wrapper 크기는 유지합니다. 원본 영상의 정확한 크기/폰트/색/상태 동등 승인으로 쓰지 않습니다.']
 (WORK/'geometry-handoff.md').write_text('\n'.join(lines)+'\n')
 print(json.dumps({'phase':phase,'assets':len(records),'frames':sum(bool(r['mode'])for r in records),'glyphs':sum(r['name'].startswith('glyph')for r in records),'backgrounds':sum(r['name'].startswith('full-background')for r in records),'maxWebpBytes':max(r['webpBytes']for r in records),'nativeRegistrations':0,'manifest':str(WORK/'geometry-manifest.json')},ensure_ascii=False))

if __name__=='__main__':export('core'if'--core'in sys.argv else'all')
