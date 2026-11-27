from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageChops
import json, math, hashlib, shutil, datetime, xml.etree.ElementTree as ET

ROOT=Path('/Users/max/projest_max/ui-studio')
WORK=ROOT/'_작업/codex/ux-studio/friends-ui'
AUTHOR=ROOT/'samples/monopoly-go/ui-studio/assets/authoring/friends-ui/v001'
PROD=ROOT/'samples/monopoly-go/ui-studio/assets/production/friends-ui'
MIRROR=ROOT/'src/tools/uxStudio/assets/import-staging/friends-ui'
MANIFEST=ROOT/'_작업/codex/ux-studio/friends-ui-assets.json'
STAMP=datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9)))
BACKUP=ROOT/('docs/planning/_backup/20261116_단이/'+STAMP.strftime('%H%M')+'_friends_ui_assets')
for p in (WORK,AUTHOR,PROD,MIRROR,BACKUP):p.mkdir(parents=True,exist_ok=True)
preexisting=[]
def preserve(path):
 if path.exists():
  out=BACKUP/path.relative_to(ROOT);out.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(path,out);preexisting.append(str(path.relative_to(ROOT)))
def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def info(path):return {'path':str(path.relative_to(ROOT)),'bytes':path.stat().st_size,'sha256':sha(path)}
class Art:
 def __init__(self,w,h):self.w=w;self.h=h;self.s=4;self.im=Image.new('RGBA',(w*4,h*4));self.d=ImageDraw.Draw(self.im);self.svg=[]
 def rr(self,box,r,fill):
  x,y,w,h=box;self.d.rounded_rectangle((round(x*4),round(y*4),round((x+w)*4-1),round((y+h)*4-1)),radius=round(r*4),fill=fill)
  self.svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}"/>')
 def ellipse(self,box,fill):
  x,y,w,h=box;self.d.ellipse((round(x*4),round(y*4),round((x+w)*4-1),round((y+h)*4-1)),fill=fill)
  self.svg.append(f'<ellipse cx="{x+w/2}" cy="{y+h/2}" rx="{w/2}" ry="{h/2}" fill="{fill}"/>')
 def poly(self,pts,fill):
  self.d.polygon([(round(x*4),round(y*4)) for x,y in pts],fill=fill)
  self.svg.append('<polygon points="'+' '.join(f'{x:.3f},{y:.3f}' for x,y in pts)+f'" fill="{fill}"/>')
 def line(self,pts,fill,width=1):
  self.d.line([(round(x*4),round(y*4)) for x,y in pts],fill=fill,width=round(width*4),joint='curve')
  for x,y in [pts[0],pts[-1]]:self.d.ellipse((round((x-width/2)*4),round((y-width/2)*4),round((x+width/2)*4),round((y+width/2)*4)),fill=fill)
  self.svg.append('<polyline points="'+' '.join(f'{x:.3f},{y:.3f}' for x,y in pts)+f'" fill="none" stroke="{fill}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>')
 def clear_rr(self,box,r):
  x,y,w,h=box;mask=Image.new('L',self.im.size);d=ImageDraw.Draw(mask);d.rounded_rectangle((round(x*4),round(y*4),round((x+w)*4-1),round((y+h)*4-1)),radius=round(r*4),fill=255)
  self.im.paste((0,0,0,0),(0,0),mask);self.d=ImageDraw.Draw(self.im)
  self.svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="black"/>')
 def finish(self,mask=False):
  im=self.im.resize((self.w,self.h),Image.Resampling.LANCZOS)
  shapes=''.join(self.svg)
  if mask:
   # Last black rounded rectangle is the transparent center cutout, with all other shapes visible.
   outer=''.join(self.svg[:-1]);cut=self.svg[-1]
   shapes=f'<defs><mask id="ring"><rect width="100%" height="100%" fill="white"/>{cut}</mask></defs><g mask="url(#ring)">{outer}</g>'
  return im,f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" viewBox="0 0 {self.w} {self.h}">{shapes}</svg>\n'

def nine(w,h,s,e):return {'mode':'9','sourceSize':[w,h],'slices':[s]*4,'edges':[e]*4,'padding':[0]*4,'order':'top right bottom left','repeat':'stretch','sourceCenter':[w-s*2,h-s*2],'minimumTargetForPositiveCenter':[e*2+1,e*2+1],'crop':'none; preserve full source and transparent corners'}
def three(w,h,s,e):return {'mode':'3','sourceSize':[w,h],'slices':[0,s,0,s],'edges':[0,e,0,e],'padding':[0]*4,'order':'top right bottom left','repeat':'stretch','sourceCenter':[w-s*2,h],'sourceCapWidth':s,'targetCapWidthLogicalPx':e,'minimumTargetWidthForPositiveCenter':2*e+1,'crop':'none; preserve full source'}
assets=[];images={}
def save(role,art,assembly,mask=False,state='normal',notes=None):
 name=f'common_friends_{role}_{state}_v001'; im,svg=art.finish(mask)
 paths=[AUTHOR/(name+'.svg'),AUTHOR/(name+'.png'),PROD/(name+'.webp'),MIRROR/(name+'.webp')]
 for p in paths:preserve(p)
 paths[0].write_text(svg);im.save(paths[1]);im.save(paths[2],format='WEBP',lossless=True,method=6,exact=True);shutil.copy2(paths[2],paths[3])
 decoded=Image.open(paths[2]).convert('RGBA');assert decoded.tobytes()==im.tobytes(),name+' RGBA';assert sha(paths[2])==sha(paths[3]);assert paths[2].stat().st_size<300000
 alpha=im.getchannel('A');w,h=im.size
 entry={'name':name,'role':role,'size':[w,h],'assembly':assembly,'files':dict(zip(['svgMaster','pngRasterMaster','production','importMirror'],map(info,paths))),'importPath':'/ui-studio/source/assets/import-staging/friends-ui/'+name+'.webp','encoding':{'format':'WEBP','lossless':True,'method':6,'exact':True,'decodedRGBAEqualsPNG':True,'sameSourceSize':True},'alpha':{'range':list(alpha.getextrema()),'center':alpha.getpixel((w//2,h//2)),'corners':[alpha.getpixel(p) for p in [(0,0),(w-1,0),(0,h-1),(w-1,h-1)]],'bboxAlpha16':list(alpha.point(lambda x:255 if x>16 else 0).getbbox() or []),'bboxAlpha128':list(alpha.point(lambda x:255 if x>128 else 0).getbbox() or [])},'sourceContract':{'referencePixelsCopied':False,'bakedText':False,'bakedNumbers':False,'externalCastShadow':False,'defaultRuntimeShadow':{'enabled':False},'sourceRect':[0,0,w,h]},'status':'제안(검수 대기); generated only, not registered or UI-applied'}
 if notes:entry['notes']=notes
 assets.append(entry);images[role]=im;return entry

# Separate reusable native nine-slice panel fill and transparent thin frame.
a=Art(128,96);a.rr((0,0,128,96),20,'#f4f1df');save('panel-fill9',a,{'nineSlice':nine(128,96,27,24),'stack':'below matching frame9 and all native text/content','fill':'#f4f1df'})
a=Art(128,96);a.rr((0,0,128,96),20,'#cbb367');a.rr((2,2,124,92),18,'#eadb9c');a.clear_rr((3.25,3.25,121.5,89.5),16.75);save('panel-frame9',a,{'nineSlice':nine(128,96,27,24),'stack':'above matching fill9; use same rect; center alpha 0','contentInsetRecommendationPx':[24]*4,'contentInsetPolicy':'recommendation only; native skin padding remains zero'},True)
# Corner leaves remain fixed and do not travel through a nine-slice stretch.
for side in ['left','right']:
 a=Art(64,64)
 def tr(pts):return [(64-x if side=='right' else x,y) for x,y in pts]
 a.line(tr([(14,52),(45,17)]),'#d5cc9f',3)
 for x,y,sgn in [(20,45,-1),(26,38,1),(32,31,-1),(38,24,1)]:
  a.poly(tr([(x,y+3),(x+sgn*12,y-3),(x+sgn*10,y-11),(x+2,y-5)]),'#d5cc9f')
 a.poly(tr([(41,22),(43,10),(49,9),(48,17)]),'#d5cc9f')
 save('panel-leaf-'+side,a,{'mode':'fixed-image','sourceSize':[64,64],'objectFit':'contain','noSlice':True,'stack':'separate decoration near panel top '+side+' corner; never bake into flexible panel'})
# Separate timeline row paper and thin beige frame.
a=Art(128,64);a.rr((0,0,128,64),12,'#eee9d6');save('timeline-row-fill9',a,{'nineSlice':nine(128,64,18,12),'stack':'below matching row frame and row contents','fill':'#eee9d6'})
a=Art(128,64);a.rr((0,0,128,64),12,'#d6cba7');a.clear_rr((1.5,1.5,125,61),10.5);save('timeline-row-frame9',a,{'nineSlice':nine(128,64,18,12),'stack':'above matching row fill9; center alpha 0'},True)
# Flat-bottom tabs: top corners only; each has its own native three-slice source.
for role,color,rim,state in [('tab-selected3','#e2c35a','#c4a846','selected'),('tab-idle3','#f5f2e3','#c8b56b','normal')]:
 a=Art(128,64);a.rr((0,0,128,80),20,rim);a.rr((1.5,1.5,125,78.5),18.5,color)
 save(role,a,{'threeSlice':three(128,64,24,16),'stack':'native tab background only; text and notification badge are separate','bottom':'flat; source extends rounded rectangle below source bounds'},state=state)
# Colored controls, no outer drop shadow. Text belongs to the native button label.
for role,color,low in [('button-send3','#72bc18','#4c9210'),('button-reject3','#e5aa29','#cb841c')]:
 a=Art(128,48);a.rr((0,0,128,48),24,low);a.rr((1,0,126,43),22,color)
 save(role,a,{'threeSlice':three(128,48,24,16),'stack':'button fill only; native label above; runtime shadow off by default','center':'opaque'},notes=['Lower dark band is inside the opaque button silhouette, not an external cast shadow.'])
# Overlapping blank sticker/ticket request pictogram.
a=Art(96,80)
a.poly([(11,21),(48,9),(70,56),(32,70)],'#7c897c');a.poly([(14,22),(47,13),(66,54),(33,66)],'#eeeeda')
a.poly([(41,15),(85,25),(76,68),(32,58)],'#697d74');a.poly([(43,19),(81,28),(73,64),(36,55)],'#ecebd8')
a.poly([(53,29),(62,32),(66,28),(70,34),(67,39),(73,44),(68,49),(61,47),(58,53),(52,49),(54,43),(47,40),(50,35)],'#32aeb0')
a.line([(53,40),(65,42)],'#176d73',2)
save('pictogram-ticket-request',a,{'mode':'fixed-image','sourceSize':[96,80],'objectFit':'contain','noSlice':True,'stack':'small row-end pictogram; blank overlapping stickers'})
# Grey cat: independent eyes, open grey eye surround; no band or eye mask.
a=Art(96,104)
a.poly([(20,40),(15,8),(34,20),(47,18),(62,20),(81,8),(77,42)],'#42444b')
a.poly([(23,30),(20,15),(34,26)],'#c58d91');a.poly([(64,26),(77,15),(72,32)],'#c58d91')
a.ellipse((15,22,66,68),'#5f6268');a.ellipse((21,43,54,44),'#777a7e')
a.ellipse((27,41,16,21),'#eee9d4');a.ellipse((54,41,16,21),'#eee9d4')
a.ellipse((34,46,5,12),'#22262b');a.ellipse((58,46,5,12),'#22262b')
a.ellipse((31,63,34,22),'#a7a5a1');a.poly([(41,64),(55,64),(48,71)],'#bc8589');a.line([(48,71),(48,76)],'#35363b',2)
a.ellipse((40,76,16,15),'#b75c70');a.line([(48,79),(48,86)],'#8c3e53',1.5)
a.line([(22,66),(11,63)],'#414249',1.5);a.line([(22,72),(10,73)],'#414249',1.5);a.line([(72,66),(85,63)],'#414249',1.5);a.line([(72,72),(86,73)],'#414249',1.5)
save('pictogram-greycat-head',a,{'mode':'fixed-image','sourceSize':[96,104],'objectFit':'contain','noSlice':True,'stack':'small row-end cat head'},notes=['Grey cat with two visible pale eyes and tongue; no eye mask. Simple newly drawn geometric interpretation.'])
# Blank red-headed calendar; all numerical content remains native text if ever required.
a=Art(80,96);a.rr((9,7,62,82),9,'#666c64');a.rr((11,9,58,78),7,'#eeeede');a.rr((11,9,58,30),7,'#d72a39');a.poly([(11,26),(69,26),(69,37),(11,37)],'#d72a39');a.line([(21,8),(21,16)],'#879083',4);a.line([(59,8),(59,16)],'#879083',4)
save('pictogram-calendar-red',a,{'mode':'fixed-image','sourceSize':[80,96],'objectFit':'contain','noSlice':True,'stack':'small row-end blank calendar pictogram'})

# Tool-independent reference assembly: copy the nine or three source regions, fixed logical edges.
def slice_image(im,size,contract):
 w,h=size;out=Image.new('RGBA',size);t,r,b,l=contract['slices'];et,er,eb,el=contract['edges'];sw,sh=im.size
 xs=[0,l,sw-r,sw];ys=[0,t,sh-b,sh];dx=[0,el,w-er,w];dy=[0,et,h-eb,h]
 for iy in range(3):
  for ix in range(3):
   box=(xs[ix],ys[iy],xs[ix+1],ys[iy+1]);tw=dx[ix+1]-dx[ix];th=dy[iy+1]-dy[iy]
   if box[2]>box[0] and box[3]>box[1] and tw>0 and th>0:
    p=im.crop(box).resize((tw,th),Image.Resampling.LANCZOS);out.paste(p,(dx[ix],dy[iy]))
 return out
# A 3-slice has no vertical fixed edges; processing the center row is the expected case.
font=ImageFont.truetype('/System/Library/Fonts/Menlo.ttc',15)
sheet=Image.new('RGBA',(1200,1050),'#343943');d=ImageDraw.Draw(sheet)
def caption(x,y,s):d.text((x,y),s,fill='#ffffff',font=font)
caption(24,18,'Friends UI v001 | newly drawn geometry | no text baked into assets')
panel=Image.new('RGBA',(520,700))
for role in ['panel-fill9','panel-frame9']:
 e=next(x for x in assets if x['role']==role);panel.alpha_composite(slice_image(images[role],panel.size,e['assembly']['nineSlice']))
panel.alpha_composite(images['panel-leaf-left'].resize((45,45)),(8,8));panel.alpha_composite(images['panel-leaf-right'].resize((45,45)),(467,8));sheet.alpha_composite(panel,(24,70));caption(24,780,'panel native9 520 x 700; leaves separate')
for role,x in [('tab-selected3',568),('tab-idle3',776)]:
 e=next(v for v in assets if v['role']==role);sheet.alpha_composite(slice_image(images[role],(190,64),e['assembly']['threeSlice']),(x,90));caption(x,165,role)
for y,size in [(220,(580,92)),(340,(400,70))]:
 row=Image.new('RGBA',size)
 for role in ['timeline-row-fill9','timeline-row-frame9']:
  e=next(v for v in assets if v['role']==role);row.alpha_composite(slice_image(images[role],size,e['assembly']['nineSlice']))
 sheet.alpha_composite(row,(568,y))
caption(568,425,'row native9: 580 x 92 / 400 x 70')
for role,x in [('button-reject3',568),('button-send3',816)]:
 e=next(v for v in assets if v['role']==role);sheet.alpha_composite(slice_image(images[role],(200,54),e['assembly']['threeSlice']),(x,485));caption(x,550,role)
for role,x in [('pictogram-ticket-request',600),('pictogram-greycat-head',780),('pictogram-calendar-red',960)]:
 im=images[role];sheet.alpha_composite(im,(x,625));caption(x-20,740,role.replace('pictogram-',''))
caption(24,855,'native9 panel: source 128x96, slices 27, edges 24, padding 0')
caption(24,885,'native9 row: source 128x64, slices 18, edges 12, padding 0')
caption(24,915,'native3 tabs/buttons: source caps 24, logical cap edges 16, padding 0')
caption(24,945,'transparent frames: center alpha 0; fills/buttons: center alpha 255')
caption(24,975,'QA composite only. Product editor/browser rendering remains parent-owned.')
sheet_path=WORK/'friends-ui-v001-contact-sheet.png';preserve(sheet_path);sheet.convert('RGB').save(sheet_path)
for a in assets:
 ET.parse(ROOT/a['files']['svgMaster']['path'])
 if 'frame9' in a['role']:assert a['alpha']['center']==0
 if 'fill9' in a['role'] or 'button-' in a['role']:assert a['alpha']['center']==255
qa={'assetCount':len(assets),'allSVGParse':True,'eachWebPAtMost300000Bytes':True,'maximumWebPBytes':max(a['files']['production']['bytes'] for a in assets),'productionMirrorSHAEqual':True,'decodedWebPRGBAEqualsPNG':True,'native9FramesCenterAlpha0':True,'native9FillsAndButtonsCenterAlpha255':True,'externalCastShadowAbsentByConstruction':True,'textElementsInSVG':sum('<text' in (ROOT/a['files']['svgMaster']['path']).read_text() for a in assets),'contactSheet':info(sheet_path),'productBrowserQA':False,'registration':None,'UIApplied':False}
preserve(MANIFEST)
manifest={'version':1,'assetVersion':'v001','createdAtKST':STAMP.isoformat(timespec='seconds'),'author':'codex(단이)','status':'제안(검수 대기)','reference':{'path':'docs/reference/monopoly-go/20261116-ten-screens/04_friends.png','size':list(Image.open(ROOT/'docs/reference/monopoly-go/20261116-ten-screens/04_friends.png').size),'use':'actual view; visual reference only; no screenshot pixels copied'},'reuseReview':['album-ui-assets.json native9/native3 zero padding and transparent frame contract','wins-ui-assets.json separate fill/frame, retained masters, lossless encoding and import mirror contract'],'creation':{'method':'New SVG geometric artwork with matching Pillow 4x supersampling/LANCZOS raster masters','dependencies':'existing Pillow 11.3.0 only; no package installation; rsvg-convert unavailable on PATH','sourcePreservation':'SVG + PNG masters retained; no source crop','sourceRendererEquivalence':'SVG parses; independent browser SVG-vs-PNG pixel equivalence not checked','textAndNumbers':'none in asset files; contact sheet labels are QA-only','castShadow':'none baked; runtime effects.shadow defaults off; parent owns runtime shadow decisions'},'checks':qa,'assets':assets,'backup':{'path':str(BACKUP.relative_to(ROOT)),'preexistingFilesBackedUp':preexisting,'newAssetPathsWereAbsent':not preexisting},'registration':None,'UIApplied':False,'visualApproval':False,'limitations':['New geometric interpretation of low-resolution reference, not original font/pixel equality.','No product source, design JSON, common guide, STATUS or report changed.','No editor registration, product browser QA, build, server or 7007 action in this asset subtask.','Fixed corner leaves and pictograms must stay separate from flexible native9/native3 backgrounds.']}
MANIFEST.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
(WORK/'friends-ui-v001-qa.json').write_text(json.dumps(qa,ensure_ascii=False,indent=2)+'\n')
(BACKUP/'creation-inventory.json').write_text(json.dumps({'newFilesOnly':not preexisting,'existingFilesBackedUp':preexisting,'assetManifest':str(MANIFEST.relative_to(ROOT))},ensure_ascii=False,indent=2)+'\n')
print(json.dumps(qa,ensure_ascii=False,indent=2))
print('manifest',MANIFEST)
