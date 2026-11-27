from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,hashlib,shutil,datetime,math,xml.etree.ElementTree as ET
R=Path('/Users/max/projest_max/ui-studio');W=R/'_작업/codex/ux-studio/warehouse-ui';A=R/'samples/monopoly-go/ui-studio/assets/authoring/warehouse-ui/v001';P=R/'samples/monopoly-go/ui-studio/assets/production/warehouse-ui';S=R/'src/tools/uxStudio/assets/import-staging/warehouse-ui';M=R/'_작업/codex/ux-studio/warehouse-ui-assets.json';stamp=datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9)));B=R/('docs/planning/_backup/'+stamp.strftime('%Y%m%d')+'_단이/'+stamp.strftime('%H%M%S')+'_warehouse_ui_assets')
for p in [W,A,P,S,B]:p.mkdir(parents=True,exist_ok=True)
assert not M.exists()
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def info(p):return {'path':str(p.relative_to(R)),'bytes':p.stat().st_size,'sha256':sha(p)}
art_path=R/'_작업/codex/ux-studio/warehouse-art-assets.json';art=json.loads(art_path.read_text());guard={str(art_path.relative_to(R)):sha(art_path)};reuse=[]
for a in art['assets']:
 for n in [a['relativePath'],a['stagingPath'],a['source']['rgbaPath'],a['source']['originalPath']]:guard[n]=sha(R/n)
for role in ['cabinet-background','orange-shield','shield-pedestal','top-hat']:
 a=next(x for x in art['assets'] if x['role']==role);p=R/a['relativePath'];q=R/a['stagingPath'];assert sha(p)==sha(q)==a['sha256'];reuse.append({'role':role,'name':a['name'],'sourceSize':a['size'],'files':{'production':info(p),'importMirror':info(q)},'importPath':'/ui-studio/source/assets/import-staging/warehouse-icons/'+a['name']+'.webp','copiedOrModified':False,'assembly':{'mode':'fixed-image','objectFit':'contain','noSlice':True,'preserveAspectRatio':True},'notes':('Reuse only upper architecture with proposed image.region; lower3cases are not reused for flexible frames.' if role=='cabinet-background' else 'Reuse existing prepared artwork; no regeneration or pixel mutation.')})
album_path=R/'_작업/codex/ux-studio/album-icon-assets.json';album=json.loads(album_path.read_text());dice=next(a for a in album['assets'] if a['role']=='reward-dice-stack');dp=R/dice['relativePath'];dq=R/dice['stagingPath'];assert sha(dp)==sha(dq)==dice['sha256'];guard[str(album_path.relative_to(R))]=sha(album_path);guard[dice['relativePath']]=sha(dp);guard[dice['stagingPath']]=sha(dq)
reuse.append({'role':'category-dice-reuse-candidate','name':dice['name'],'sourceSize':[dice['width'],dice['height']],'files':{'production':info(dp),'importMirror':info(dq)},'importPath':'/ui-studio/source/assets/import-staging/album-icons/'+dice['name'],'copiedOrModified':False,'assembly':{'mode':'fixed-image','objectFit':'contain','noSlice':True,'preserveAspectRatio':True},'notes':'Existing available dice image is a5-die stack; source07 category looks like one beige die. Reuse candidate only, not a claim of identical silhouette. No new dice art generated under this scope.'})
class Art:
 def __init__(self,w,h):self.w=w;self.h=h;self.im=Image.new('RGBA',(w*4,h*4));self.svg=[];self.index=0
 def rr(self,box,r,c):
  x,y,w,h=box;ImageDraw.Draw(self.im).rounded_rectangle((round(x*4),round(y*4),round((x+w)*4)-1,round((y+h)*4)-1),radius=round(r*4),fill=c);self.svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{c}"/>')
 def ellipse(self,box,c):
  x,y,w,h=box;ImageDraw.Draw(self.im).ellipse((round(x*4),round(y*4),round((x+w)*4)-1,round((y+h)*4)-1),fill=c);self.svg.append(f'<ellipse cx="{x+w/2}" cy="{y+h/2}" rx="{w/2}" ry="{h/2}" fill="{c}"/>')
 def line(self,pts,c,w):
  d=ImageDraw.Draw(self.im);d.line([(round(x*4),round(y*4)) for x,y in pts],fill=c,width=round(w*4),joint='curve')
  for x,y in [pts[0],pts[-1]]:d.ellipse((round((x-w/2)*4),round((y-w/2)*4),round((x+w/2)*4),round((y+w/2)*4)),fill=c)
  self.svg.append('<polyline points="'+' '.join(f'{x:.3f},{y:.3f}' for x,y in pts)+f'" fill="none" stroke="{c}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>')
 def gradient(self,kind,box,r,top,bottom):
  x,y,w,h=box;mask=Image.new('L',self.im.size);md=ImageDraw.Draw(mask);b=(round(x*4),round(y*4),round((x+w)*4)-1,round((y+h)*4)-1)
  if kind=='rect':md.rounded_rectangle(b,radius=round(r*4),fill=255)
  else:md.ellipse(b,fill=255)
  layer=Image.new('RGBA',self.im.size);ld=ImageDraw.Draw(layer);rgb=lambda c:tuple(bytes.fromhex(c[1:]));a=rgb(top);z=rgb(bottom)
  for py in range(round(y*4),round((y+h)*4)):
   t=(py-y*4)/max(h*4-1,1);ld.line((0,py,self.w*4,py),fill=tuple(round(a[i]*(1-t)+z[i]*t) for i in range(3))+(255,))
  self.im.paste(layer,(0,0),mask);ident='grad'+str(self.index);self.index+=1;self.svg.append(f'<defs><linearGradient id="{ident}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="{top}"/><stop offset="1" stop-color="{bottom}"/></linearGradient></defs>')
  if kind=='rect':self.svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="url(#{ident})"/>')
  else:self.svg.append(f'<ellipse cx="{x+w/2}" cy="{y+h/2}" rx="{w/2}" ry="{h/2}" fill="url(#{ident})"/>')
 def cut_rr(self,box,r):
  x,y,w,h=box;mask=Image.new('L',self.im.size);ImageDraw.Draw(mask).rounded_rectangle((round(x*4),round(y*4),round((x+w)*4)-1,round((y+h)*4)-1),radius=round(r*4),fill=255);self.im.paste((0,0,0,0),(0,0),mask);self.svg=['<defs><mask id="cut"><rect width="100%" height="100%" fill="white"/>'+f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="black"/></mask></defs><g mask="url(#cut)">'+''.join(self.svg)+'</g>']
 def finish(self):return self.im.resize((self.w,self.h),Image.Resampling.LANCZOS),f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" viewBox="0 0 {self.w} {self.h}">'+''.join(self.svg)+'</svg>\n'
def nine(w,h,s,e):return {'mode':'9','sourceSize':[w,h],'slices':[s]*4,'edges':[e]*4,'padding':[0]*4,'order':'top right bottom left','repeat':'stretch','sourceCenter':[w-2*s,h-2*s],'minimumTargetForPositiveCenter':[2*e+1,2*e+1],'crop':'none'}
def three(w,h,s,e):return {'mode':'3','sourceSize':[w,h],'slices':[0,s,0,s],'edges':[0,e,0,e],'padding':[0]*4,'order':'top right bottom left','repeat':'stretch','sourceCenter':[w-2*s,h],'minimumTargetForPositiveCenter':[2*e+1,1],'crop':'none'}
def fixed(w,h,target):return {'mode':'fixed-image','sourceSize':[w,h],'objectFit':'contain','noSlice':True,'preserveAspectRatio':True,'padding':[0]*4,'recommendedTarget':target}
assets=[];images={}
def save(role,artwork,assembly,observed,inferred):
 name='common_warehouse_'+role+'_normal_v001';im,svg=artwork.finish();paths=[A/(name+'.svg'),A/(name+'.png'),P/(name+'.webp'),S/(name+'.webp')];assert all(not p.exists() for p in paths);paths[0].write_text(svg);im.save(paths[1]);im.save(paths[2],format='WEBP',lossless=True,method=6,exact=True);shutil.copy2(paths[2],paths[3]);ET.parse(paths[0]);prod=Image.open(paths[2]).convert('RGBA');assert im.tobytes()==prod.tobytes();assert sha(paths[2])==sha(paths[3]);assert paths[2].stat().st_size<300000;al=prod.getchannel('A');w,h=prod.size
 a={'name':name,'role':role,'size':[w,h],'assembly':assembly,'observed':observed,'inferred':inferred,'files':dict(zip(['svgMaster','pngRasterMaster','production','importMirror'],map(info,paths))),'importPath':'/ui-studio/source/assets/import-staging/warehouse-ui/'+name+'.webp','encoding':{'format':'WEBP','lossless':True,'method':6,'exact':True,'decodedRGBAEqualsPNG':True},'alpha':{'range':list(al.getextrema()),'center':al.getpixel((w//2,h//2)),'corners':[al.getpixel(p) for p in [(0,0),(w-1,0),(0,h-1),(w-1,h-1)]],'bboxAlpha16':list(al.point(lambda v:255 if v>16 else 0).getbbox() or []),'bboxAlpha128':list(al.point(lambda v:255 if v>128 else 0).getbbox() or [])},'sourceContract':{'referencePixelsCopied':False,'bakedText':False,'bakedNumbers':False,'bakedProducts':False,'bakedNotifications':False,'externalCastShadow':False,'defaultRuntimeShadow':{'enabled':False},'sourceRect':[0,0,w,h]},'status':'제안(검수 대기); preparation only, no editor registration/UI application'};assets.append(a);images[role]=prod;return a
# Shared fill and frame for three identical native cases. Products/tints remain separate.
a=Art(160,112);a.gradient('rect',(0,0,160,112),8,'#a6b2bc','#bdc8cd');save('case-fill9',a,{'nineSlice':nine(160,112,24,14),'recommendedTarget':[455,165],'stack':'below separate products, metallic frame9 and fixed hinges'},'Source07 has three blue-gray framed glass display rows.','New neutral blue-gray opaque fill. Original warm interior/reflections and lower-row muting are not treated as ownership/lock policy.')
a=Art(160,112);a.rr((0,0,160,112),8,'#728490');a.rr((2,2,156,108),6,'#f5f9f7');a.rr((5,5,150,102),4,'#aebfc8');a.rr((9,9,142,94),2.5,'#6c7d89');a.rr((11,11,138,90),1.5,'#e5eeee');a.cut_rr((12.5,12.5,135,87),1)
save('case-metallic-frame9',a,{'nineSlice':nine(160,112,24,14),'recommendedTarget':[455,165],'stack':'above same-rect fill9 and product image layers; center transparent; separate fixed hinges at either side'},'Source frames have light white edges and blue-gray metal borders.','New nested rim geometry; source corner/edge widths are not asserted pixel-identical. No product, reflection or outer cast shadow baked.')
# One symmetric hinge image reused at both ends of every case.
a=Art(24,64);a.rr((0,0,24,64),5,'#8a99a2');a.rr((2,1,20,61),4,'#f8fbfa');a.rr((4,5,16,53),2,'#d8e1e4');a.line([(5,31),(19,31)],'#aebdc6',1)
save('case-hinge-fixed',a,{**fixed(24,64,[14,40]),'reuse':'same fixed artwork for left/right hinge; no mirroring required'},'Each source case has small pale vertical hinges on both sides.','Simple symmetric metal block with internal seam, no external shadow.')
# Selected category button is a perspective oval in source, rather than a resizable round box.
a=Art(128,80);a.ellipse((0,0,128,80),'#b5a178');a.ellipse((2,0,124,76),'#fff5c8');a.ellipse((5,2,118,71),'#d69d20');a.gradient('ellipse',(6,3,116,63),0,'#ffe86b','#ffc72c')
save('category-selected-bg-fixed',a,fixed(128,80,[80,50]),'Second category has a gold rounded/oval backing under its separate shield-like glyph.','Source perspective oval is preserved as fixed8:5 artwork; other tab backing can use native shapes/colors. No glyph baked.')
# White circular selection background; green check is a separate native glyph.
a=Art(96,96);a.ellipse((0,0,96,96),'#fffef5');a.ellipse((3,3,90,90),'#a1d879');a.ellipse((7,7,82,82),'#fffef8')
save('selection-check-bg-fixed',a,{**fixed(96,96,[40,40]),'separateNativeLabel':{'text':'✓','colorProposal':'#4dbd43','fontPolicy':'parent chooses native typography; original font unknown'}},'Second equipped slot has a white/green circular selection mark with green check.','Blank white/green-rimmed circle only; check is not baked.')
# Grey subheader count pill; numeral2 remains native.
a=Art(128,40);a.rr((0,0,128,40),12,'#b0a5a1')
save('subheader-count-pill3',a,{'threeSlice':three(128,40,20,12),'recommendedTarget':[82,26],'stack':'below separate native owned-count label'},'A small muted gray-brown pill under the title contains2.','New solid color from worksheet approximation; no count or ownership state baked.')
# Fourth category face/emblem; use geometry, not a font/emoji.
a=Art(64,64);a.ellipse((5,5,54,54),'#9d8a74');a.ellipse((8,7,48,47),'#c5b39a');a.ellipse((20,21,5,6),'#8d7861');a.ellipse((39,21,5,6),'#8d7861');pts=[]
for i in range(25):
 t=i/24;pts.append(((1-t)*(1-t)*20+2*(1-t)*t*32+t*t*44,(1-t)*(1-t)*36+2*(1-t)*t*49+t*t*36))
a.line(pts,'#8d7861',3);a.line([(17,15),(23,12)],'#e0cfb9',2)
save('category-smile-fixed',a,fixed(64,64,[40,40]),'Fourth category is a small beige round smiling/emblem-like glyph; red dot is separate.','Face contour/eyes/mouth are a simplified new geometric reading of the small source. Not an emoji or a native text symbol.')
# Decode production for source/native target QA, including the observed third-row clip.
def sliced(im,size,c):
 sw,sh=im.size;w,h=size;t,r,b,l=c['slices'];et,er,eb,el=c['edges'];assert sw>l+r and sh>t+b and w>el+er and h>et+eb;xs=[0,l,sw-r,sw];ys=[0,t,sh-b,sh];dx=[0,el,w-er,w];dy=[0,et,h-eb,h];out=Image.new('RGBA',size)
 for iy in range(3):
  for ix in range(3):
   box=(xs[ix],ys[iy],xs[ix+1],ys[iy+1]);tw=dx[ix+1]-dx[ix];th=dy[iy+1]-dy[iy]
   if box[2]>box[0] and box[3]>box[1] and tw>0 and th>0:out.paste(im.crop(box).resize((tw,th),Image.Resampling.LANCZOS),(dx[ix],dy[iy]))
 return out
def fit(im,size):
 q=im.copy();q.thumbnail(size,Image.Resampling.LANCZOS);out=Image.new('RGBA',size);out.alpha_composite(q,((size[0]-q.width)//2,(size[1]-q.height)//2));return out
by={a['role']:a for a in assets};case=Image.new('RGBA',(455,165))
for role in ['case-fill9','case-metallic-frame9']:case.alpha_composite(sliced(images[role],case.size,by[role]['assembly']['nineSlice']))
for pos in [(1,63),(440,63)]:case.alpha_composite(fit(images['case-hinge-fixed'],(14,40)),pos)
viewport=Image.new('RGBA',(463,466),'#dac7b9')
for y in [0,167,334]:viewport.alpha_composite(case,(2,y))
sheet=Image.new('RGB',(1460,1150),'#343e49');sd=ImageDraw.Draw(sheet);font=ImageFont.truetype('/System/Library/Fonts/Menlo.ttc',16);small=ImageFont.truetype('/System/Library/Fonts/Menlo.ttc',13)
def label(x,y,text,f=font):sd.text((x,y),text,fill='white',font=f)
def put(im,pos):sheet.paste(im,pos,im)
label(24,18,'Warehouse07 |7 new geometric textures | prepared resources only, not screen completion')
label(24,47,'Decoded production: identical455x165 cases at y0/167/334; viewport463x466 clips row3.',small);put(viewport,(24,90));label(24,577,'No products or policy tint baked. Hinges fixed14x40.',small)
y=95
for a in assets:
 role=a['role'];label(530,y,role,small);label(530,y+23,'source'+str(a['size']),small);im=images[role];put(fit(im,(160,90)),(980,y-4))
 c=a['assembly'].get('nineSlice',a['assembly'].get('threeSlice'));target=a['assembly']['recommendedTarget']
 if c:label(530,y+44,'slices'+str(c['slices'])+' edges'+str(c['edges']),small)
 display=sliced(im,target,c) if c else fit(im,target)
 if role in ['case-fill9','case-metallic-frame9']:display=display.resize((228,83),Image.Resampling.LANCZOS)
 put(display,(1190,y));y+=127
# Reuse thumbnails shown without copying or modifying their source files.
for i,role in enumerate(['shield-pedestal','top-hat','orange-shield','category-dice-reuse-candidate']):
 a=next(x for x in reuse if x['role']==role);im=Image.open(R/a['files']['production']['path']).convert('RGBA');put(fit(im,(96,70)),(24+i*120,660));label(24+i*120,742,role.replace('category-','')[:15],small)
label(24,812,'REUSE art above; dice stack is a candidate, not source single-die equivalence.',small)
label(24,841,'Architecture proposal: source551x984 image.region[0,0,551,364].',small)
label(24,870,'Use native region only; no cropped derivative created; lower3glass cases excluded.',small)
label(24,899,'Separate proposal: arch[0,0,551,217], alcove/shelf[0,217,551,147].',small)
label(24,941,'Fixed gold tab source128x80 preserves observed oval; check circle has no check baked.',small)
label(24,970,'Text/count/native check, products, badge, input and runtime shadow remain separate.',small)
label(24,999,'SVG+PNG retained; WebP lossless RGBA=PNG; production=staging SHA; padding0.',small)
contact=W/'warehouse-ui-v001-contact-sheet.png';sheet.save(contact)
for a in assets:
 assert all(v==0 for v in a['alpha']['corners']),a['name'];assert '<text' not in (R/a['files']['svgMaster']['path']).read_text()
 if 'frame9' in a['role']:assert a['alpha']['center']==0
 else:assert a['alpha']['center']==255
unchanged=all(sha(R/p)==hash for p,hash in guard.items());assert unchanged
checks={'newAssetCount':len(assets),'reusedResourceCount':len(reuse),'allSVGParse':True,'eachWebPBelow300000Bytes':True,'maximumNewWebPBytes':max(a['files']['production']['bytes'] for a in assets),'totalNewWebPBytes':sum(a['files']['production']['bytes'] for a in assets),'decodedWebPRGBAEqualsPNG':True,'productionMirrorSHAEqual':True,'allCornerAlpha0':True,'frameCenterAlpha0':True,'fillsAndFixedCenterAlpha255':True,'nativeSliceCentersPositive':True,'existingArtProtectedFileCount':len(guard),'existingArtAndManifestSHAUnchanged':True,'contactSheet':info(contact),'visualQA':'pending direct decoded production contact inspection','productBrowserQA':False,'registration':None,'UIApplied':False}
regions={'status':'proposal from actual viewed generated master/production; approximate±4px; parent verifies image.region in native editor','productionSourceSize':[551,984],'combinedUpperArchitectureRegionXYWH':[0,0,551,364],'separateUpperArchRegionXYWH':[0,0,551,217],'separateOpenAlcoveAndShelfRegionXYWH':[0,217,551,147],'basis':'Existing art manifest places first glass case around production y368.64; proposed upper region stops before that frame. Upper architecture is fixed aspect artwork, not native9.','sourcePixelsModified':False,'croppedDerivativeCreated':False,'regionAPI':'Use full original sourceSize551x984 plus integer image.region; no PNG pixel edit or new image file.'}
manifest={'version':1,'assetVersion':'v001','createdAtKST':stamp.isoformat(timespec='seconds'),'author':'codex(단이)','status':'제안(검수 대기)','reference':{'path':'docs/reference/monopoly-go/20261116-ten-screens/07_shields.png','size':[294,530],'sha256':sha(R/'docs/reference/monopoly-go/20261116-ten-screens/07_shields.png'),'actuallyViewed':True,'pixelsCopied':False},'readSources':['docs/plans/20261116-ten-screen-assembly.md:107-113','_작업/codex/ux-studio/warehouse07-assembly-quick-sheet.md','_작업/codex/ux-studio/warehouse07-assembly-quick-sheet.json','_작업/codex/ux-studio/warehouse-art-assets.json','samples/monopoly-go/ui-studio/assets/authoring/warehouse-icons/v001/warehouse-architecture.source.png','samples/monopoly-go/ui-studio/assets/production/warehouse-icons/common_warehouse-cabinet_background_normal_v001.webp','samples/monopoly-go/ui-studio/assets/authoring/warehouse-icons/v001/warehouse-art-contact-sheet.jpg','_작업/codex/ux-studio/album-icon-assets.json'],'observed':['Three same-role pale blue-gray metal cases; third row partly clipped by category area.','Original case fronts retain warm taupe behind glass; new case blue-gray fill is a neutral production interpretation, not an original sampled value.','Second category gold backing looks oval from perspective; green check/owned2/title are separate native marks.','Lower two rows look muted; disabled/unowned/locked state and game policy remain unconfirmed.'],'creation':{'method':'New SVG geometry with matching Pillow4x supersampling/LANCZOS PNG raster masters','dependencies':'existing Pillow only','sourcePreservation':'SVG+PNG retained','sourceRendererEquivalence':'SVG parses; independent browser SVG raster equality not checked','shadow':'No external cast shadow baked; separate runtime effects'},'architectureRegionProposal':regions,'reuse':reuse,'assets':assets,'assemblyRules':['All native9/3 order top-right-bottom-left, repeat stretch, padding0. Same-rect fill/frame; frame center transparent.','Case source160x112/slices24/edges14; use one target455x165 template for all3rows, y0/167/334 in viewport463x466. Third-row partial visibility is clipping, not a shorter third template.','Fixed hinges24x64 target14x40 contain; one symmetric asset on both left/right.','Gold selected tab128x80 target80x50 fixed oval; check96sq target40sq with separate native green✓.','Count128x40 caps20/logical12/padding0 target82x26; count2 is native text.','Gold pedestal/top-hat/orange shield are existing art; no duplicate created. Existing dice stack is a reuse candidate with explicit silhouette limit.','Full empty-cabinet art includes3cases and must not be counted as flexible native UI; upper architecture may be shown using image.region proposal only.','No resource preparation, shape guide or reference rendering constitutes actual UI assembly, game connection or approval.'],'checks':checks,'backup':{'path':str(B.relative_to(R)),'newFilesOnly':True,'existingArtSHAInventory':'existing-art-readonly-sha256.json'},'usagePolicy':{'startWeeklyUsedPercent':87,'startReadSucceeded':True,'stopAtWeeklyPercent':90,'endRead':'parent/subagent completion gate pending'},'registration':None,'UIApplied':False,'visualApproval':False,'limitations':['Original font/marks/pixel equality and actual native UI/browser/game/API/category states unverified.','No UI/source/design JSON/guide/shared report/STATUS/existing asset/server/build/automation/7007/protected-file/secret mutation or access.','Geometry only; no text, products, price/count/notification, state policy or external cast shadow baked.']};M.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n');(W/'warehouse-ui-v001-qa.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2)+'\n');(B/'existing-art-readonly-sha256.json').write_text(json.dumps(guard,ensure_ascii=False,indent=2)+'\n');(B/'creation-inventory.json').write_text(json.dumps({'manifest':str(M.relative_to(R)),'newTextures':[a['name'] for a in assets]},ensure_ascii=False,indent=2)+'\n');print(json.dumps(checks,ensure_ascii=False,indent=2))
