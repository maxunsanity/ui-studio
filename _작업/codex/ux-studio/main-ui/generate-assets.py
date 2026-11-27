from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import hashlib, json, shutil, datetime, xml.etree.ElementTree as ET

ROOT=Path('/Users/max/projest_max/ui-studio')
WORK=ROOT/'_작업/codex/ux-studio/main-ui'
AUTHOR=ROOT/'samples/monopoly-go/ui-studio/assets/authoring/main-ui/v001'
PROD=ROOT/'samples/monopoly-go/ui-studio/assets/production/main-ui'
MIRROR=ROOT/'src/tools/uxStudio/assets/import-staging/main-ui'
MANIFEST=ROOT/'_작업/codex/ux-studio/main-ui-assets.json'
STAMP=datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9)))
BACKUP=ROOT/('docs/planning/_backup/'+STAMP.strftime('%Y%m%d')+'_단이/'+STAMP.strftime('%H%M')+'_main_ui_assets')
for p in [WORK,AUTHOR,PROD,MIRROR,BACKUP]:p.mkdir(parents=True,exist_ok=True)
preexisting=[]
def preserve(p):
 if p.exists():
  dest=BACKUP/p.relative_to(ROOT);dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,dest);preexisting.append(str(p.relative_to(ROOT)))
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def info(p):return {'path':str(p.relative_to(ROOT)),'bytes':p.stat().st_size,'sha256':sha(p)}
def rgb(c):return tuple(bytes.fromhex(c[1:]))
class Art:
 def __init__(self,w,h):self.w=w;self.h=h;self.scale=4;self.im=Image.new('RGBA',(w*4,h*4));self.svg=[];self.index=0
 def shape(self,kind,box,color,r=0):
  x,y,w,h=box;d=ImageDraw.Draw(self.im);b=(round(x*4),round(y*4),round((x+w)*4)-1,round((y+h)*4)-1)
  if kind=='rect':
   d.rounded_rectangle(b,radius=round(r*4),fill=color);self.svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{color}"/>')
  else:
   d.ellipse(b,fill=color);self.svg.append(f'<ellipse cx="{x+w/2}" cy="{y+h/2}" rx="{w/2}" ry="{h/2}" fill="{color}"/>')
 def rr(self,box,r,color):self.shape('rect',box,color,r)
 def ellipse(self,box,color):self.shape('ellipse',box,color)
 def poly(self,pts,color):
  ImageDraw.Draw(self.im).polygon([(round(x*4),round(y*4)) for x,y in pts],fill=color)
  self.svg.append('<polygon points="'+' '.join(f'{x},{y}' for x,y in pts)+f'" fill="{color}"/>')
 def gradient(self,kind,box,top,bottom,r=0):
  x,y,w,h=box;mask=Image.new('L',self.im.size);d=ImageDraw.Draw(mask);b=(round(x*4),round(y*4),round((x+w)*4)-1,round((y+h)*4)-1)
  if kind=='rect':d.rounded_rectangle(b,radius=round(r*4),fill=255)
  else:d.ellipse(b,fill=255)
  layer=Image.new('RGBA',self.im.size);ld=ImageDraw.Draw(layer);a=rgb(top);bcol=rgb(bottom)
  for py in range(round(y*4),round((y+h)*4)):
   t=(py-y*4)/max(1,h*4-1);c=tuple(round(a[i]*(1-t)+bcol[i]*t) for i in range(3))+(255,);ld.line((0,py,self.w*4,py),fill=c)
  self.im.paste(layer,(0,0),mask);ident=f'grad{self.index}';self.index+=1
  self.svg.append(f'<defs><linearGradient id="{ident}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="{top}"/><stop offset="1" stop-color="{bottom}"/></linearGradient></defs>')
  if kind=='rect':self.svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="url(#{ident})"/>')
  else:self.svg.append(f'<ellipse cx="{x+w/2}" cy="{y+h/2}" rx="{w/2}" ry="{h/2}" fill="url(#{ident})"/>')
 def cut(self,kind,box,r=0):
  x,y,w,h=box;mask=Image.new('L',self.im.size);d=ImageDraw.Draw(mask);b=(round(x*4),round(y*4),round((x+w)*4)-1,round((y+h)*4)-1)
  if kind=='rect':
   d.rounded_rectangle(b,radius=round(r*4),fill=255);cut=f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="black"/>'
  else:
   d.ellipse(b,fill=255);cut=f'<ellipse cx="{x+w/2}" cy="{y+h/2}" rx="{w/2}" ry="{h/2}" fill="black"/>'
  self.im.paste((0,0,0,0),(0,0),mask);ident=f'cut{self.index}';self.index+=1
  self.svg=[f'<defs><mask id="{ident}"><rect width="100%" height="100%" fill="white"/>{cut}</mask></defs><g mask="url(#{ident})">'+''.join(self.svg)+'</g>']
 def finish(self):return self.im.resize((self.w,self.h),Image.Resampling.LANCZOS),f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" viewBox="0 0 {self.w} {self.h}">'+''.join(self.svg)+'</svg>\n'

def nine(w,h,s,e):return {'mode':'9','sourceSize':[w,h],'slices':[s]*4,'edges':[e]*4,'padding':[0]*4,'order':'top right bottom left','repeat':'stretch','sourceCenter':[w-2*s,h-2*s],'minimumTargetForPositiveCenter':[2*e+1,2*e+1],'crop':'none; preserve full source and transparent corners'}
def three(w,h,s,e):return {'mode':'3','sourceSize':[w,h],'slices':[0,s,0,s],'edges':[0,e,0,e],'padding':[0]*4,'order':'top right bottom left','repeat':'stretch','sourceCenter':[w-2*s,h],'minimumTargetForPositiveCenter':[2*e+1,1],'sourceCapWidth':s,'targetCapWidthLogicalPx':e,'crop':'none; preserve full source'}
def fixed(w,h):return {'mode':'fixed-image','sourceSize':[w,h],'objectFit':'contain','noSlice':True,'preserveAspectRatio':True,'padding':[0]*4}
assets=[];images={}
def save(role,art,assembly,uses,notes=None):
 name=f'common_main_{role}_normal_v001';im,svg=art.finish();paths=[AUTHOR/(name+'.svg'),AUTHOR/(name+'.png'),PROD/(name+'.webp'),MIRROR/(name+'.webp')]
 for p in paths:preserve(p)
 paths[0].write_text(svg);im.save(paths[1]);im.save(paths[2],format='WEBP',lossless=True,method=6,exact=True);shutil.copy2(paths[2],paths[3]);ET.parse(paths[0])
 decoded=Image.open(paths[2]).convert('RGBA');assert im.tobytes()==decoded.tobytes();assert sha(paths[2])==sha(paths[3]);assert paths[2].stat().st_size<=300000
 alpha=decoded.getchannel('A');w,h=decoded.size
 entry={'name':name,'role':role,'size':[w,h],'uses':uses,'assembly':assembly,'files':dict(zip(['svgMaster','pngRasterMaster','production','importMirror'],map(info,paths))),'importPath':'/ui-studio/source/assets/import-staging/main-ui/'+name+'.webp','encoding':{'format':'WEBP','lossless':True,'method':6,'exact':True,'decodedRGBAEqualsPNG':True,'sameSourceSize':True},'alpha':{'range':list(alpha.getextrema()),'center':alpha.getpixel((w//2,h//2)),'corners':[alpha.getpixel(p) for p in [(0,0),(w-1,0),(0,h-1),(w-1,h-1)]],'bboxAlpha16':list(alpha.point(lambda v:255 if v>16 else 0).getbbox() or []),'bboxAlpha128':list(alpha.point(lambda v:255 if v>128 else 0).getbbox() or [])},'sourceContract':{'referencePixelsCopied':False,'bakedText':False,'bakedNumbers':False,'bakedNotifications':False,'externalCastShadow':False,'defaultRuntimeShadow':{'enabled':False},'sourceRect':[0,0,w,h]},'status':'제안(검수 대기); generated only, not registered or UI-applied'}
 if notes:entry['notes']=notes
 assets.append(entry);images[role]=decoded;return entry

# 1. Editable banner geometry; all badges, progress labels, title and art stay separate.
a=Art(256,160);a.gradient('rect',(0,0,256,160),'#ff9a31','#ffdb7b',64)
save('event-banner-fill9',a,{'nineSlice':nine(256,160,64,24),'recommendedTarget':[292,84],'stack':'below track, separate event artwork, text, and matching frame9'},['top event banner'])
a=Art(256,160);a.rr((0,0,256,160),64,'#fffef7');a.rr((8,8,240,144),56,'#e9bc53');a.cut('rect',(11,11,234,138),53)
save('event-banner-frame9',a,{'nineSlice':nine(256,160,64,24),'recommendedTarget':[292,84],'stack':'above same-rect banner fill9; transparent center'},['top event banner'])
# 2. Unfilled 0/5 track.
a=Art(160,48);a.gradient('rect',(0,0,160,48),'#4b351d','#624927',24)
save('event-progress-track3',a,{'threeSlice':three(160,48,24,16),'recommendedTarget':[242,26],'stack':'above banner fill, below native count and separate end icons'},['top event 0/5 progress track'])
# 3 + 6. One common time capsule for top and side events.
a=Art(160,48);a.rr((0,0,160,48),24,'#dfd9ca');a.rr((1.5,1.5,157,45),22.5,'#fffdf4')
save('event-time-pill3',a,{'threeSlice':three(160,48,24,16),'recommendedTargets':{'bannerTimer':[96,30],'sideEventTimer':[80,30]},'stack':'opaque fill and thin rim in one texture; native timer text is separate'},['ivory top banner timer pill','common white side-event timer ribbon'],['These observed white capsules share one asset rather than duplicate identical timer geometry.'])
# 4. Right-side circular event fill plus independent white rim.
a=Art(128,128);a.gradient('ellipse',(0,0,128,128),'#70d7b1','#199b7d')
save('event-badge-fill-fixed',a,{**fixed(128,128),'recommendedTarget':[80,80],'stack':'below fixed white rim and event artwork/count'},['right circular green/teal event badge'])
a=Art(128,128);a.ellipse((0,0,128,128),'#fffef7');a.cut('ellipse',(6,6,116,116))
save('event-badge-rim-fixed',a,{**fixed(128,128),'recommendedTarget':[80,80],'stack':'same-rect rim above green badge fill; center alpha0'},['right circular event white rim'])
# 5. Tall Tycoon capsule; the white/gold base ornament stays entirely in bottom fixed slice.
a=Art(128,192);a.gradient('rect',(0,0,128,192),'#9bd977','#69b854',48)
save('tycoon-capsule-fill9',a,{'nineSlice':nine(128,192,48,24),'recommendedTarget':[80,124],'stack':'below matching capsule frame and separate event artwork/title'},['right tall Tycoon event capsule'])
a=Art(128,192);a.rr((0,0,128,192),48,'#fffef5');a.rr((6,6,116,180),42,'#ded7a9');a.cut('rect',(8,8,112,176),40)
a.rr((12,148,104,32),16,'#fffef4');a.rr((20,151,88,25),12.5,'#d8c85a')
# Three small leaves on each side; no trophy or other icon.
for flip in [False,True]:
 def pts(v):return [(128-x if flip else x,y) for x,y in v]
 a.poly(pts([(25,169),(9,166),(2,158),(14,157),(25,164)]),'#fffef4')
 a.poly(pts([(23,162),(9,153),(8,148),(18,151),(27,158)]),'#fffef4')
 a.poly(pts([(28,168),(18,179),(7,179),(15,170)]),'#fffef4')
save('tycoon-capsule-frame9',a,{'nineSlice':nine(128,192,48,24),'recommendedTarget':[80,124],'stack':'same rect above capsule fill; center transparent; bottom white/gold ornament in fixed bottom48 source slice','bottomDecorationSourceY':[144,192]},['right tall Tycoon white frame and blank gold base decoration'],['No trophy, title, timer or notification is baked.'])
# 7. Gold multiplier circle; x50 remains a native separate label.
a=Art(128,128);a.ellipse((0,0,128,128),'#fffef5');a.ellipse((5,5,118,118),'#edc467');a.gradient('ellipse',(9,9,110,110),'#ffcf39','#ffa526')
save('multiplier-disc-fixed',a,{**fixed(128,128),'recommendedTarget':[80,80],'stack':'native x50 label above; external shadow owned by engine'},['gold roll multiplier circle with white rim'])
# 8. Left-side time ribbons. White border and coloured interior are one horizontal3 texture.
for role,color in [('event-time-ribbon-purple3','#913c86'),('event-time-ribbon-red3','#ed2941')]:
 a=Art(160,48);a.poly([(0,0),(160,0),(152,24),(160,48),(0,48),(8,24)],'#fffef7');a.poly([(5,4),(155,4),(148,24),(155,44),(5,44),(12,24)],color)
 save(role,a,{'threeSlice':three(160,48,24,12),'recommendedTarget':[84,26],'stack':'below separate native timer text; white border inside silhouette'},['left event coloured time ribbon'])

# The contact sheet renders decoded production WebPs, never PNG masters.
def sliced(im,size,c):
 sw,sh=im.size;w,h=size;t,r,b,l=c['slices'];et,er,eb,el=c['edges'];assert sw>l+r and sh>t+b;assert w>el+er and h>et+eb
 xs=[0,l,sw-r,sw];ys=[0,t,sh-b,sh];dx=[0,el,w-er,w];dy=[0,et,h-eb,h];out=Image.new('RGBA',size)
 for iy in range(3):
  for ix in range(3):
   box=xs[ix],ys[iy],xs[ix+1],ys[iy+1];tw=dx[ix+1]-dx[ix];th=dy[iy+1]-dy[iy]
   if box[2]>box[0] and box[3]>box[1] and tw>0 and th>0:out.paste(im.crop(box).resize((tw,th),Image.Resampling.LANCZOS),(dx[ix],dy[iy]))
 return out
byrole={a['role']:a for a in assets}
def render(role,size):
 a=byrole[role];c=a['assembly'].get('nineSlice',a['assembly'].get('threeSlice'))
 return sliced(images[role],size,c) if c else images[role].resize(size,Image.Resampling.LANCZOS)
def combo(roles,size):
 out=Image.new('RGBA',size)
 for role in roles:out.alpha_composite(render(role,size))
 return out
font=ImageFont.truetype('/System/Library/Fonts/Menlo.ttc',17);small=ImageFont.truetype('/System/Library/Fonts/Menlo.ttc',14)
sheet=Image.new('RGB',(1500,1690),'#343e49');d=ImageDraw.Draw(sheet)
def label(x,y,s,f=font):d.text((x,y),s,fill='#fffef5',font=f)
def place(im,xy):sheet.paste(im,xy,im)
label(24,18,'Main05 v001 | production WebP source + native target QA | text shown here is QA-only')
label(24,50,'11 new textures | padding0 | no baked typography/count/notification/cast shadow',small)
rows=[('event-banner-fill9',[292,84]),('event-banner-frame9',[292,84]),('event-progress-track3',[242,26]),('event-time-pill3',[96,30]),('event-badge-fill-fixed',[80,80]),('event-badge-rim-fixed',[80,80]),('tycoon-capsule-fill9',[80,124]),('tycoon-capsule-frame9',[80,124]),('multiplier-disc-fixed',[80,80]),('event-time-ribbon-purple3',[84,26]),('event-time-ribbon-red3',[84,26])]
y=96
for role,target in rows:
 a=byrole[role];source=images[role];c=a['assembly'].get('nineSlice',a['assembly'].get('threeSlice'));source.size
 label(24,y,role,small);label(24,y+24,'source '+str(a['size'])+' -> target '+str(target),small)
 if c:label(24,y+48,'slices '+str(c['slices'])+' edges '+str(c['edges']),small)
 thumb=images[role].copy();thumb.thumbnail((256,106));place(thumb,(615,y+4));place(render(role,target),(950,y+4));y+=132
label(24,1560,'Assembly targets use decoded production. Frames stay separate; fixed circles remain square.',small)
label(24,1584,'banner 292x84 | time 96x30/80x30 common | badge80sq | Tycoon80x124 | ribbon84x26',small)
label(24,1608,'SVG + PNG retained. WebP RGBA equals PNG; staging bytes equal production. Product registration: parent.',small)
contact=WORK/'main-ui-v001-contact-sheet.png';preserve(contact);sheet.save(contact)
assembly=Image.new('RGB',(1120,560),'#309e74');ad=ImageDraw.Draw(assembly)
ad.text((24,18),'Blank native assembly / production WebP / labels & event artwork remain separate',fill='white',font=small)
place_at=lambda im,xy: assembly.paste(im,xy,im)
place_at(combo(['event-banner-fill9','event-banner-frame9'],(584,168)),(40,90));place_at(render('event-progress-track3',(484,52)),(90,151));place_at(render('event-time-pill3',(192,60)),(236,250))
place_at(combo(['event-badge-fill-fixed','event-badge-rim-fixed'],(160,160)),(700,90));place_at(render('event-time-pill3',(160,60)),(700,235))
place_at(combo(['tycoon-capsule-fill9','tycoon-capsule-frame9'],(120,248)),(912,70));place_at(render('event-time-pill3',(160,60)),(892,300))
place_at(render('multiplier-disc-fixed',(128,128)),(80,355));place_at(render('event-time-ribbon-purple3',(168,52)),(310,368));place_at(render('event-time-ribbon-red3',(168,52)),(310,442))
assembly_path=WORK/'main-ui-v001-assembly-preview.png';preserve(assembly_path);assembly.save(assembly_path)
for a in assets:
 if 'frame9' in a['role'] or 'rim-fixed' in a['role']:assert a['alpha']['center']==0,a['name']
 else:assert a['alpha']['center']==255,a['name']
 if 'ribbon-' in a['role']:
  al=images[a['role']].getchannel('A');assert al.getpixel((0,24))==0 and al.getpixel((159,24))==0,a['name']
 else:assert all(x==0 for x in a['alpha']['corners']),a['name']
 assert '<text' not in (ROOT/a['files']['svgMaster']['path']).read_text()
checks={'assetCount':len(assets),'allSVGParse':True,'eachWebPAtMost300000Bytes':True,'maximumWebPBytes':max(a['files']['production']['bytes'] for a in assets),'productionMirrorSHAEqual':True,'decodedWebPRGBAEqualsPNG':True,'framesCenterAlpha0':True,'fillsCenterAlpha255':True,'roundedAssetsCornerAlpha0':True,'notchRibbonMidSideAlpha0':True,'nativeTargetSourceAndDestinationCentersPositive':True,'textElementsInSVG':0,'externalCastShadowAbsentByConstruction':True,'contactSheet':info(contact),'assemblyPreview':info(assembly_path),'visualQA':'local decoded-production contact sheet and native target assembly inspected; no text/icons/counts/notification/cast shadow baked; product browser remains untested','productBrowserQA':False,'registration':None,'UIApplied':False}
preserve(MANIFEST)
manifest={'version':1,'assetVersion':'v001','createdAtKST':STAMP.isoformat(timespec='seconds'),'author':'codex(단이)','status':'제안(검수 대기)','reference':{'path':'docs/reference/monopoly-go/20261116-ten-screens/05_main.png','size':[709,1269],'sha256':sha(ROOT/'docs/reference/monopoly-go/20261116-ten-screens/05_main.png'),'use':'actual view; visual reference only; no screenshot pixels copied'},'readOnlyDesign':{'path':'samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json','revisionObserved':72,'mainElementCountObserved':63,'notModifiedByThisTask':True},'reuseReview':{'basis':'friends-ui-assets.json native9/native3 padding0, transparent separate frame, retained source masters, lossless WebP and staging equality','existingExactConceptualTexturesFound':False,'withinNewSetReuse':[{'texture':'event-time-pill3','roles':['top event timer','side white event-time ribbon'],'reason':'both observed timer backgrounds use a small white/ivory capsule; text is separate'}]},'creation':{'method':'New SVG geometric source with parallel Pillow4x supersampling/LANCZOS PNG raster master; decoded production rendered for contact QA','dependencies':'existing Pillow only; no new package','sourcePreservation':'SVG+PNG masters retained, no crop','sourceRendererEquivalence':'SVG parses; independent SVG browser raster-vs-PNG pixel equivalence not checked','textAndNumbers':'none in asset files; contact labels are QA-only','castShadow':'none baked; parent owns separate engine effects.shadow'},'assemblyRules':['For native9/native3 use full sourceSize, slices/edges in top-right-bottom-left order, repeat stretch, padding0.','Fill and transparent frame use identical target rect, frame above fill. Text, icon artwork, counts, notification badges and shadows are separate elements.','Horizontal3 has zero top/bottom slices and logical edges; source full height stretches to target height.','Fixed circles must keep1:1 width/height with contain. Never use native9 on circles.','Tycoon white/gold ornament is entirely within bottom fixed source slice144..192; no trophy or title is baked.'],'assets':assets,'checks':checks,'backup':{'path':str(BACKUP.relative_to(ROOT)),'preexistingFilesBackedUp':preexisting,'newAssetPathsWereAbsentAtInitialPreflight':True,'priorSelfGeneratedAttemptBackedUp':bool(preexisting)},'registration':None,'UIApplied':False,'visualApproval':False,'limitations':['New geometric interpretation, not original pixel or font equality.','No product source, design JSON, guide, common report, STATUS, server, build or7007 action.','No title, game art, trophy, count, notification or external cast shadow baked.','Product editor registration and actual browser rendering remain parent-owned.']}
MANIFEST.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n');(WORK/'main-ui-v001-qa.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2)+'\n')
(BACKUP/'creation-inventory.json').write_text(json.dumps({'newFilesOnly':not preexisting,'existingFilesBackedUp':preexisting,'assetManifest':str(MANIFEST.relative_to(ROOT))},ensure_ascii=False,indent=2)+'\n')
print(json.dumps(checks,ensure_ascii=False,indent=2));print('manifest',MANIFEST)
