from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,hashlib,shutil,datetime,xml.etree.ElementTree as ET
R=Path('/Users/max/projest_max/ui-studio');M=R/'_작업/codex/ux-studio/main-ui-assets.json';Q=R/'_작업/codex/ux-studio/main-ui/main-ui-v001-qa.json';d=json.loads(M.read_text());stamp=datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9)));B=R/('docs/planning/_backup/'+stamp.strftime('%Y%m%d')+'_단이/'+stamp.strftime('%H%M%S')+'_main_ui_tycoon_trophy');B.mkdir(parents=True,exist_ok=True)
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def info(p):return {'path':str(p.relative_to(R)),'bytes':p.stat().st_size,'sha256':sha(p)}
original={}
for a in d['assets']:
 for f in a['files'].values():
  p=R/f['path'];original[str(p.relative_to(R))]=sha(p);b=B/p.relative_to(R);b.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,b)
assert len(d['assets'])==12 and len(original)==48
for p in [M,Q]:
 b=B/p.relative_to(R);b.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,b)
name='common_main_tycoon-trophy-fixed_normal_v001';paths=[R/f'samples/monopoly-go/ui-studio/assets/authoring/main-ui/v001/{name}.svg',R/f'samples/monopoly-go/ui-studio/assets/authoring/main-ui/v001/{name}.png',R/f'samples/monopoly-go/ui-studio/assets/production/main-ui/{name}.webp',R/f'src/tools/uxStudio/assets/import-staging/main-ui/{name}.webp'];assert all(not p.exists() for p in paths)
im=Image.new('RGBA',(256,256));draw=ImageDraw.Draw(im);svg=[]
def poly(pts,color):
 draw.polygon([(round(x*4),round(y*4)) for x,y in pts],fill=color);svg.append('<polygon points="'+' '.join(f'{x},{y}' for x,y in pts)+f'" fill="{color}"/>')
def line(pts,color,width):
 draw.line([(round(x*4),round(y*4)) for x,y in pts],fill=color,width=round(width*4),joint='curve')
 for x,y in [pts[0],pts[-1]]:draw.ellipse((round((x-width/2)*4),round((y-width/2)*4),round((x+width/2)*4),round((y+width/2)*4)),fill=color)
 svg.append('<polyline points="'+' '.join(f'{x},{y}' for x,y in pts)+f'" fill="none" stroke="{color}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>')
# Two clearly open handles, independent of the bowl; all highlights stay inside the silhouette.
for flip in [False,True]:
 def tr(pts):return [(64-x if flip else x,y) for x,y in pts]
 line(tr([(17,12),(7,12),(6,18),(7,25),(11,31),(19,34),(23,31)]),'#3b3023',8)
 line(tr([(17,12),(7,12),(6,18),(7,25),(11,31),(19,34),(23,31)]),'#d5a635',4)
 line(tr([(7,16),(8,23),(11,27)]),'#fff4bb',1.5)
# Dark outline, inner gold stem and wide plinth. Keep the base visible at18px.
poly([(27,34),(37,34),(37,46),(43,48),(47,56),(47,62),(17,62),(17,56),(21,48),(27,46)],'#3b3023')
poly([(30,36),(34,36),(34,48),(41,50),(43,54),(21,54),(23,50),(30,48)],'#d8a638')
poly([(20,57),(44,57),(44,59),(20,59)],'#f4ce5c')
# Broad cup with gently narrowing lower body; internal shading is not an external shadow.
poly([(13,3),(51,3),(50,17),(47,29),(42,37),(36,40),(28,40),(22,37),(17,29),(14,17)],'#3b3023')
poly([(17,7),(47,7),(46,18),(43,28),(39,34),(34,37),(29,37),(25,34),(21,27),(18,17)],'#efc74c')
poly([(39,7),(47,7),(46,18),(43,28),(39,34),(34,37),(31,37),(36,30),(39,20)],'#c4912a')
line([(19,9),(20,18),(24,28)],'#fff8cd',3)
line([(20,8),(43,8)],'#fff5be',1.5)
paths[0].write_text('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">'+''.join(svg)+'</svg>\n');im=im.resize((64,64),Image.Resampling.LANCZOS);im.save(paths[1]);im.save(paths[2],format='WEBP',lossless=True,method=6,exact=True);shutil.copy2(paths[2],paths[3]);ET.parse(paths[0]);prod=Image.open(paths[2]).convert('RGBA');assert prod.tobytes()==Image.open(paths[1]).convert('RGBA').tobytes();assert sha(paths[2])==sha(paths[3]);assert paths[2].stat().st_size<=300000
alpha=prod.getchannel('A');bbox16=list(alpha.point(lambda v:255 if v>16 else 0).getbbox());bbox128=list(alpha.point(lambda v:255 if v>128 else 0).getbbox());entry={'name':name,'role':'tycoon-trophy-fixed','size':[64,64],'uses':['tiny trophy artwork on Tycoon gold base; separate from flexible frame and timer text'],'assembly':{'mode':'fixed-image','sourceSize':[64,64],'objectFit':'contain','noSlice':True,'preserveAspectRatio':True,'padding':[0,0,0,0],'recommendedTarget':[18,18],'stack':'above separate Tycoon gold-base decoration; below any independent native timer text'},'files':dict(zip(['svgMaster','pngRasterMaster','production','importMirror'],map(info,paths))),'importPath':'/ui-studio/source/assets/import-staging/main-ui/'+name+'.webp','encoding':{'format':'WEBP','lossless':True,'method':6,'exact':True,'decodedRGBAEqualsPNG':True,'sameSourceSize':True},'alpha':{'range':list(alpha.getextrema()),'center':alpha.getpixel((32,32)),'corners':[alpha.getpixel(p) for p in [(0,0),(63,0),(0,63),(63,63)]],'bboxAlpha16':bbox16,'bboxAlpha128':bbox128},'sourceContract':{'referencePixelsCopied':False,'bakedText':False,'bakedNumbers':False,'bakedNotifications':False,'externalCastShadow':False,'defaultRuntimeShadow':{'enabled':False},'sourceRect':[0,0,64,64],'silhouette':'two open handles, gold cup, stem and plinth with dark outline and internal white highlights'},'status':'제안(검수 대기); generated only, not registered or UI-applied'};d['assets'].append(entry)
# View both source and actual18px target, using decoded production and alpha compositing.
sheet=Image.new('RGB',(880,360),'#343e49');sd=ImageDraw.Draw(sheet);font=ImageFont.truetype('/System/Library/Fonts/Menlo.ttc',16)
for y,text in [(20,'Tycoon trophy / newly drawn SVG + PNG / decoded production WebP'),(50,'source64x64 -> fixed18x18 | two handles + cup + stem/base'),(80,'Transparent tight artwork | dark outline / white highlight | no cast shadow')]:sd.text((24,y),text,fill='white',font=font)
small=prod.resize((18,18),Image.Resampling.LANCZOS);sheet.paste(prod,(40,160),prod);sheet.paste(small,(210,183),small);large=small.resize((144,144),Image.Resampling.NEAREST);sheet.paste(large,(330,130),large);sd.rounded_rectangle((540,150,730,230),radius=30,fill='#d8c85a');sheet.paste(small,(626,181),small);sd.text((24,308),'18px output shown at native size and8x nearest zoom; no emoji/font used.',fill='white',font=font)
contact=R/'_작업/codex/ux-studio/main-ui/main-ui-v001-tycoon-trophy-preview.png';sheet.save(contact)
assert alpha.getpixel((0,0))==0 and alpha.getpixel((63,0))==0 and alpha.getpixel((0,63))==0 and alpha.getpixel((63,63))==0;assert bbox16[0]<=3 and bbox16[1]<=3 and bbox16[2]>=61 and bbox16[3]>=62;assert all(sha(R/path)==hash for path,hash in original.items())
qa={'assetCount':13,'newAssetCount':1,'originalAssetCount':12,'original48SourceProductionStagingFilesSHAUnchanged':True,'sourceSize':[64,64],'targetSize':[18,18],'bboxAlpha16':bbox16,'bboxAlpha128':bbox128,'productionMirrorSHAEqual':True,'decodedWebPRGBAEqualsPNG':True,'allSVGParse':True,'externalCastShadow':False,'bakedText':False,'contactSheet':info(contact),'production':info(paths[2]),'backup':str(B.relative_to(R)),'visualQA':'pending direct production/18px preview inspection','productBrowserQA':False}
d['checks']['assetCount']=13;d['checks']['maximumWebPBytes']=max(a['files']['production']['bytes'] for a in d['assets']);d['checks']['original12All48FilesSHAUnchanged']=True;d['checks']['tycoonTrophySupplementContactSheet']=info(contact);d['checks']['contactSheetScope']='Original11 sheet preserved; orange ribbon and trophy shown in their supplement previews';d['supplements'].append({'createdAtKST':stamp.isoformat(timespec='seconds'),'role':'tycoon-trophy-fixed','backup':str(B.relative_to(R)),'checks':qa});M.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n');Q.write_text(json.dumps(d['checks'],ensure_ascii=False,indent=2)+'\n');(R/'_작업/codex/ux-studio/main-ui/tycoon-trophy-qa.json').write_text(json.dumps(qa,ensure_ascii=False,indent=2)+'\n');(B/'original-files-sha256.json').write_text(json.dumps(original,ensure_ascii=False,indent=2)+'\n');print(json.dumps(qa,ensure_ascii=False,indent=2))
