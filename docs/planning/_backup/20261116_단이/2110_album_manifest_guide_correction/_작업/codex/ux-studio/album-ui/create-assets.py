from pathlib import Path
from PIL import Image, ImageDraw
import json, hashlib, shutil, datetime, math
ROOT=Path('/Users/max/projest_max/ui-studio')
AUTHOR=ROOT/'samples/monopoly-go/ui-studio/assets/authoring/album-ui/v001'
PROD=ROOT/'samples/monopoly-go/ui-studio/assets/production/album-ui'
MIRROR=ROOT/'src/tools/uxStudio/assets/import-staging/album-ui'
SCRATCH=ROOT/'_작업/codex/ux-studio/album-ui'
for p in (AUTHOR,PROD,MIRROR,SCRATCH): p.mkdir(parents=True,exist_ok=True)
S=4
assets=[]
def canvas(w,h): return Image.new('RGBA',(w*S,h*S),(0,0,0,0))
def rgb(c): return tuple(bytes.fromhex(c.lstrip('#')))+(255,)
def cubic(p0,p1,p2,p3,n=40):
 return [tuple((1-t)**3*p0[j]+3*(1-t)**2*t*p1[j]+3*(1-t)*t*t*p2[j]+t**3*p3[j] for j in (0,1)) for t in [i/n for i in range(n+1)]]
def path(start,curves):
 pts=[start]; d=f'M{start[0]} {start[1]}'
 for a,b,c in curves:
  pts+=cubic(pts[-1],a,b,c)[1:]; d+=f'C{a[0]} {a[1]} {b[0]} {b[1]} {c[0]} {c[1]}'
 return pts,d

def polygon(draw,pts,color): draw.polygon([(round(x*S),round(y*S)) for x,y in pts],fill=color)
def record(role,w,h,elements,im,assembly):
 name=f'common_album_{role}_normal_v001'
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">'+''.join(elements)+'</svg>\n'
 paths={'svgMaster':AUTHOR/(name+'.svg'),'pngRasterMaster':AUTHOR/(name+'.png'),'production':PROD/(name+'.webp'),'importMirror':MIRROR/(name+'.webp')}
 paths['svgMaster'].write_text(svg)
 im=im.resize((w,h),Image.Resampling.LANCZOS)
 # Canonical invisible pixels retain no irrelevant RGB payload.
 px=im.load()
 for y in range(h):
  for x in range(w):
   if px[x,y][3]==0: px[x,y]=(0,0,0,0)
 im.save(paths['pngRasterMaster'])
 im.save(paths['production'],format='WEBP',lossless=True,quality=100,method=6,exact=True)
 shutil.copyfile(paths['production'],paths['importMirror'])
 decoded=Image.open(paths['production']).convert('RGBA')
 assert im.tobytes()==decoded.tobytes(),name
 assert paths['production'].stat().st_size<=300000
 assert paths['production'].read_bytes()==paths['importMirror'].read_bytes()
 def info(p): return {'path':str(p.relative_to(ROOT)),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
 alpha=im.getchannel('A')
 assets.append({'name':name,'role':role,'size':[w,h],'assembly':assembly,'files':{k:info(v) for k,v in paths.items()},'importPath':'/ui-studio/source/assets/import-staging/album-ui/'+name+'.webp','encoding':{'format':'WEBP','lossless':True,'method':6,'exact':True,'decodedRGBAEqualsPNG':True,'sameSourceSize':True},'alpha':{'range':list(alpha.getextrema()),'center':alpha.getpixel((w//2,h//2)),'corners':[alpha.getpixel(p) for p in [(0,0),(w-1,0),(0,h-1),(w-1,h-1)]]},'status':'제안(검수 대기); generated only, root owns registration and placement'})
 return im
previews=[]
# Fixed decorative curtain: newly drawn broad cloth folds; no UI or reward pixels.
w,h=551,359
im=canvas(w,h);dr=ImageDraw.Draw(im);dr.rectangle((0,0,w*S,h*S),fill='#dc676d');els=[f'<rect width="{w}" height="{h}" fill="#dc676d"/>']
for side in (0,1):
 for a,b,color in [(0,27,'#d36067'),(93,123,'#cf5c64'),(173,198,'#c7505b')]:
  pts,d=path((a,0),[((a-18,80),(a-70,201),(a-160,359)),((a-147,359),(a-126,359),(b-160,359)),((b-70,201),(b-18,80),(b,0))])
  if side: pts=[(w-x,y) for x,y in pts]
  polygon(dr,pts,color)
  els.append(f'<path d="{d}Z" fill="{color}"'+(f' transform="translate({w} 0) scale(-1 1)"' if side else '')+'/>')
previews.append(record('header-curtain',w,h,els,im,{'mode':'fixed','sourceSize':[w,h],'repeat':'none','crop':'none','stack':'decorative header background only; native title/banner/rewards/UI above'}))
# Seamless low-contrast peach botanical/paisley tile.
w=h=192;im=canvas(w,h);dr=ImageDraw.Draw(im);dr.rectangle((0,0,w*S,h*S),fill='#f9d6a1');els=['<rect width="192" height="192" fill="#f9d6a1"/>']
# Repeated motif geometry extends over edges, making opposite edges periodic.
for ox in (-192,0,192):
 for oy in (-192,0,192):
  for mx,my,flip in [(17,20,1),(113,116,-1)]:
   def P(x,y):return (ox+mx+flip*x,oy+my+y)
   pts,d=path(P(0,0),[(P(-30,-3),P(-40,27),P(-16,38)),(P(6,49),P(29,25),P(12,7)),(P(0,-5),P(-18,6),P(-10,19)),(P(-4,28),P(6,21),P(1,15))])
   dr.line([(round(x*S),round(y*S)) for x,y in pts],fill='#efc991',width=5*S,joint='curve');els.append(f'<path d="{d}" fill="none" stroke="#efc991" stroke-width="5" stroke-linecap="round"/>')
   for a,b,c in [((20,43),(48,20),(48,54)),((-21,62),(-43,38),(-43,70))]:
    pp,dd=path(P(*a),[(P(*b),P(*c),P(*a))]);polygon(dr,pp,'#f0cb94');els.append(f'<path d="{dd}Z" fill="#f0cb94"/>')
   p,q=P(5,43),P(0,71)
   dr.line([(p[0]*S,p[1]*S),(q[0]*S,q[1]*S)],fill='#f1cc95',width=3*S);els.append(f'<path d="M{p[0]} {p[1]}L{q[0]} {q[1]}" stroke="#f1cc95" stroke-width="3"/>')
tile=im.resize((192,192),Image.Resampling.LANCZOS)
tile.save(AUTHOR/'common_album_body-botanical-tile_repeat-master_v001.png')
(AUTHOR/'common_album_body-botanical-tile_repeat-master_v001.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">'+''.join(els)+'</svg>\n')
body=canvas(551,984)
for yy in range(0,984*S,192*S):
 for xx in range(0,551*S,192*S): body.paste(im,(xx,yy))
bodyels=['<defs><pattern id="botanical" width="192" height="192" patternUnits="userSpaceOnUse">'+''.join(els)+'</pattern></defs><rect width="551" height="984" fill="url(#botanical)"/>']
previews.append(record('body-botanical-tile',551,984,bodyels,body,{'mode':'fixed','sourceSize':[551,984],'repeat':'none; motif precomposed into source for ordinary image component','motifPeriod':[192,192],'crop':'none','retainedRepeatMasters':['samples/monopoly-go/ui-studio/assets/authoring/album-ui/v001/common_album_body-botanical-tile_repeat-master_v001.svg','samples/monopoly-go/ui-studio/assets/authoring/album-ui/v001/common_album_body-botanical-tile_repeat-master_v001.png'],'stack':'full page background below header and all collection artwork and labels'}))
# Source cap is 27; destination cap explicitly 8, no skin padding.
for role,frame in [('banner-fill9',False),('banner-frame9',True)]:
 w,h=128,96;im=canvas(w,h);dr=ImageDraw.Draw(im)
 dr.rounded_rectangle((0,0,w*S-1,h*S-1),radius=27*S,fill='#fffdf7' if frame else '#fff7e8')
 if frame:
  dr.rounded_rectangle((24*S,24*S,(w-24)*S-1,(h-24)*S-1),radius=3*S,fill=(0,0,0,0))
  els=['<path fill="#fffdf7" fill-rule="evenodd" d="M27 0H101Q128 0 128 27V69Q128 96 101 96H27Q0 96 0 69V27Q0 0 27 0ZM27 24Q24 24 24 27V69Q24 72 27 72H101Q104 72 104 69V27Q104 24 101 24Z"/>']
 else: els=['<rect width="128" height="96" rx="27" fill="#fff7e8"/>']
 a={'nineSlice':{'mode':'9','sourceSize':[128,96],'slices':[27]*4,'edges':[8]*4,'padding':[0]*4,'order':'top right bottom left','repeat':'stretch','sourceCenter':[74,42],'minimumTargetForPositiveCenter':[17,17],'crop':'none'},'stack':'above matching fill9; center transparent' if frame else 'below frame9; center opaque'}
 previews.append(record(role,w,h,els,im,a))
for role,color in [('progress-bg3','#656449'),('progress-fill3','#1dc5e7')]:
 w,h=128,32;im=canvas(w,h);dr=ImageDraw.Draw(im);dr.rounded_rectangle((0,0,w*S-1,h*S-1),radius=16*S,fill=color)
 els=[f'<rect width="128" height="32" rx="16" fill="{color}"/>']
 a={'threeSlice':{'mode':'3','sourceSize':[128,32],'slices':[0,16,0,16],'edges':[0,12,0,12],'padding':[0]*4,'order':'top right bottom left','repeat':'stretch','sourceCenter':[96,32],'sourceCapWidth':16,'targetCapWidthLogicalPx':12,'minimumTargetWidthForPositiveCenter':25,'crop':'none; preserve complete 128x32 source'},'stack':'track' if role=='progress-bg3' else 'above matching track; width owned by root progress value'}
 previews.append(record(role,w,h,els,im,a))
# Fixed pale ballroom backdrop, separate from native fill/frame and reward imagery.
w,h=498,204;im=canvas(w,h);dr=ImageDraw.Draw(im);els=[]
def rect(x,y,ww,hh,color):
 dr.rectangle((x*S,y*S,(x+ww)*S-1,(y+hh)*S-1),fill=color)
 els.append(f'<rect x="{x}" y="{y}" width="{ww}" height="{hh}" fill="{color}"/>')
def poly(points,color):
 polygon(dr,points,color);els.append('<polygon points="'+' '.join(f'{x},{y}' for x,y in points)+f'" fill="{color}"/>')
def oval(cx,cy,rx,ry,color):
 dr.ellipse(((cx-rx)*S,(cy-ry)*S,(cx+rx)*S-1,(cy+ry)*S-1),fill=color)
 els.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{color}"/>')
rect(0,0,498,204,'#f2dfc5');rect(0,0,498,12,'#fff0d9')
poly([(0,0),(114,25),(114,151),(0,173)],'#f5e4cc');poly([(498,0),(384,25),(384,151),(498,173)],'#f5e4cc')
rect(114,20,270,132,'#edddc7');rect(127,29,244,112,'#f5e9d5')
rect(157,29,5,112,'#fdf4e3');rect(336,29,5,112,'#fdf4e3')
# Pale back arched architectural panel.
oval(249,57,39,35,'#fcf2df');rect(210,57,78,84,'#fcf2df');rect(217,58,64,83,'#eadcc7');oval(249,58,32,28,'#eadcc7');rect(246,31,6,110,'#fff3df')
for x in (17,57,419,459):
 rect(x,14,25,130,'#fff9e9');rect(x+4,20,17,118,'#fffdf3');rect(x+11,20,3,118,'#f0dfc5');rect(x+4,66,17,5,'#f0dfc5')
for x in (99,381):
 rect(x,11,17,144,'#fff1d7');rect(x-5,9,27,10,'#fff7e5');rect(x-4,145,25,12,'#e5cda9');rect(x+3,21,5,122,'#fff9e9')
rect(0,151,498,53,'#cdb99e')
poly([(114,151),(384,151),(435,204),(61,204)],'#d6c4aa')
for x in (-100,20,139,249,359,478,598):
 poly([(247+(x-249)*0.5,151),(251+(x-249)*0.5,151),(x+3,204),(x-3,204)],'#bda98e')
rect(0,173,498,2,'#dfceb4');rect(0,197,498,2,'#c2ae93')
# Two small hanging gold lamps; all tones stay within the decorative background.
for x in (128,371):
 rect(x-1,0,2,27,'#d6b875');oval(x,28,5,7,'#e9c578');oval(x,37,9,6,'#f7d79a');oval(x,42,13,4,'#e5bd6e');oval(x,35,4,4,'#fff4cf');rect(x-2,43,4,5,'#d8b06a')
previews.append(record('banner-room-background',498,204,els,im,{'mode':'fixed','sourceSize':[498,204],'repeat':'none','crop':'none','stack':'above native banner fill9; below reward/character images and native text; white frame9 above'}))
assert len(assets)==7
assert assets[2]['alpha']['center']==255 and assets[3]['alpha']['center']==0
metadata={'version':1,'assetVersion':'v001','createdAtKST':datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).isoformat(timespec='seconds'),'author':'codex(단이)','status':'제안(검수 대기)','reference':{'path':'docs/reference/monopoly-go/20261116-ten-screens/03_album.png','size':[441,731],'use':'visual reference only; no screenshot pixels copied'},'creation':{'method':'New SVG geometric art and shared Pillow geometric raster generation; no ImageGen, external assets, package installation, baked text/UI or external cast shadows','rasterization':'Pillow 4x supersampling then LANCZOS; retained SVG/PNG masters. SVG and raster share shape intent; SVG renderer equivalence not tested.'},'checks':{'assetCount':7,'eachWebPAtMost300000Bytes':True,'maximumDimensionAtMost4096':True,'productionMirrorSHAEqual':True,'decodedWebPRGBAEqualsPNG':True,'native9FrameCenterTransparent':True,'native9FillCenterOpaque':True,'progressCapsTransparentCorners':all(a['alpha']['corners']==[0]*4 for a in assets[-2:]),'contract':'native9 source 27 / logical edges 8 / padding 0; native3 slices 0 16 0 16 / logical edges 0 12 0 12 / padding 0'},'assets':assets,'registration':None,'UIApplied':False,'visualApproval':False,'limitations':['Reference is low resolution; art is a new geometric interpretation.','No product code, UI/design JSON, guides, STATUS or shared reports modified.','No editor registration, native module validation, desktop/mobile browser QA performed by this asset-only task.','Header is a fixed decorative texture; body is a precomposed fixed 551x984 decoration using a 192x192 motif period. Native text/rewards/characters/cards must be separate.','SVG masters retained; browser SVG rendering was not pixel-compared with Pillow PNG masters.'],'preview':'_작업/codex/ux-studio/album-ui/album-ui-v001-preview.png'}
(ROOT/'_작업/codex/ux-studio/album-ui-assets.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+'\n')
board=Image.new('RGB',(760,650),'#b5b7bb');board.paste(previews[0],(0,0),previews[0]);board.paste(tile,(560,0));
for y in range(359,650,192):
 for x in range(0,551,192):board.paste(tile,(x,y))
for i in (2,3):board.paste(previews[i],(570,220+(i-2)*110),previews[i])
for i in (4,5):board.paste(previews[i],(570,460+(i-4)*50),previews[i])
board.paste(previews[6].resize((498,204)),(20,85))
board.save(SCRATCH/'album-ui-v001-preview.png')
print(json.dumps({'count':len(assets),'metadata':str(ROOT/'_작업/codex/ux-studio/album-ui-assets.json'),'assets':[{'name':a['name'],'size':a['size'],'bytes':a['files']['production']['bytes'],'centerAlpha':a['alpha']['center']} for a in assets]},ensure_ascii=False))
