from pathlib import Path
from PIL import Image, ImageFilter
from collections import deque
import hashlib,json,shutil
ROOT=Path('/Users/max/projest_max/ui-studio')
AUTHOR=ROOT/'samples/monopoly-go/ui-studio/assets/authoring/tycoon-icons/v001/pet-pack'
PROD=ROOT/'samples/monopoly-go/ui-studio/assets/production/tycoon-icons'
STAGE=ROOT/'src/tools/uxStudio/assets/import-staging/tycoon-icons'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
assets=[]
for role,base in [('pet','common_tycoon-pet-score_icon_normal_v001'),('blue-pack','common_tycoon-pack-blue_icon_normal_v001')]:
 source=AUTHOR/f'{role}-source.png';prompt=AUTHOR/f'{role}-prompt.txt';im=Image.open(source).convert('RGBA');w,h=im.size; vals=list(im.getchannel('A').getdata());pending={i for i,a in enumerate(vals) if a>=128};groups=[]
 while pending:
  start=pending.pop();group=[start];q=deque([start])
  while q:
   i=q.popleft();x,y=i%w,i//w
   for j in (i-1 if x else -1,i+1 if x+1<w else -1,i-w if y else -1,i+w if y+1<h else -1):
    if j in pending:pending.remove(j);q.append(j);group.append(j)
  groups.append(group)
 main=max(groups,key=len);md=[0]*(w*h)
 for i in main:md[i]=255
 support=Image.new('L',(w,h));support.putdata(md);support=support.filter(ImageFilter.MaxFilter(5));a=Image.new('L',(w,h));a.putdata([v if m and v>16 else 0 for v,m in zip(vals,support.getdata())]);im.putalpha(a);box=a.getbbox();tight=im.crop(box);tight.save(AUTHOR/f'{base}.tight.png')
 if role=='pet':
  side=max(tight.size);final=Image.new('RGBA',(side,side));final.alpha_composite(tight,((side-tight.width)//2,(side-tight.height)//2));final=final.resize((120,120),Image.Resampling.LANCZOS)
 else:final=tight.copy();final.thumbnail((120,120),Image.Resampling.LANCZOS)
 png=AUTHOR/f'{base}.rgba.png';final.save(png);dest=PROD/f'{base}.webp';final.save(dest,'WEBP',lossless=True,method=6,exact=True);shutil.copy2(dest,STAGE/dest.name);decoded=Image.open(dest).convert('RGBA');aa=decoded.getchannel('A');assert decoded.tobytes()==final.tobytes()
 assets.append({'role':'shared-tycoon-pet-progress-and-score' if role=='pet' else 'tycoon-blue-reward-pack','name':dest.name,'relativePath':str(dest.relative_to(ROOT)),'stagingPath':str((STAGE/dest.name).relative_to(ROOT)),'width':final.width,'height':final.height,'bytes':dest.stat().st_size,'sha256':sha(dest),'source':{'originalPath':str(source.relative_to(ROOT)),'originalSHA256':sha(source),'sourceSize':[w,h],'cropBoxXYXY':list(box),'tightPNGPath':str((AUTHOR/f'{base}.tight.png').relative_to(ROOT)),'productionRGBAPath':str(png.relative_to(ROOT)),'productionRGBASHA256':sha(png)},'prompt':{'path':str(prompt.relative_to(ROOT)),'sha256':sha(prompt),'text':prompt.read_text()},'alpha':{'range':list(aa.getextrema()),'zeroPixels':sum(v==0 for v in aa.getdata()),'partialPixels':sum(0<v<255 for v in aa.getdata()),'losslessRGBAEqualsPNG':True},'encoding':'WebP lossless RGB and alpha, exact=True','bakedText':False,'bakedFrameOrRank':False,'externalCastShadow':False,'observed':(['Same small cream/tan seated animal motif at source10 left progress circle and rank-score pills; dark eyes/nose, cream muzzle/chest, brown ears/back, small raised tail.'] if role=='pet' else ['Blue/cyan crimped foil reward pack in source10 second/third row, pale yellow circular center motif and diagonal highlight; source M-like glyph excluded.','Source02 weekly purple pack and r184 Img_Wins_Weekly_Pack_purple match established glossy foil pack family; existing art preserved.']),'inferred':(['New generic cream/brown puppy is an explicit artistic proposal; exact original species/identity is not asserted.','Complete sitting pose, face/paw/tail detail and palette are newly drawn interpretation.'] if role=='pet' else ['New generic blue foil pack geometry and yellow circle/diamond geometric emblem are artistic proposals; no letter/brand replicated.','Reward tier, quantity, contents and policy remain unknown.']),'UIApplied':False})
old=json.loads((AUTHOR/'existing-avatars-sha256.json').read_text());preserved=all(sha(ROOT/p)==v for p,v in old.items());assert preserved
m={'schemaVersion':1,'version':'v001','status':'제안(검수 대기)','count':2,'generator':'built-in image_gen, two separate original generation calls','reference':{'source10':'docs/reference/monopoly-go/20261116-ten-screens/10_tycoon.png','source02':'docs/reference/monopoly-go/20261116-ten-screens/02_wins.png','source03':'docs/reference/monopoly-go/20261116-ten-screens/03_album.png','actuallyViewed':True,'source10Zoom':'4x NEAREST memory-only visual inspection, no persisted crop/no screenshot-pixel resource reuse','savedDesignRead':'samples/monopoly-go/ui-studio/designs/backups/ux-gjs-0d80d7fe-r184-73a36353-a67a-4f9e-b625-db1bbbdecbf1.json','existingWinsPurpleRole':'Img_Wins_Weekly_Pack_purple','existingWinsPurpleAssetRef':'sha256-e34c0b5999bdad93895272d889dd2af9e75e5050b2e7a3a3d6d94cf97fa99824.webp','existingWinsPurpleSourceSize':[376,417],'existingWinsPurpleViewed':'samples/monopoly-go/ui-studio/assets/production/wins-icons/common_wins-pack-purple_icon_normal_v001.webp'},'alphaProcessing':'Keep largest alpha>=128 connected silhouette plus2px support, preserve original alpha>16, remove exterior speckles. Tight crop, pet square120px; pack aspect-preserving max120px. No subject repaint.','assets':assets,'qa':{'allBelow300000Bytes':all(a['bytes']<=300000 for a in assets),'allHaveTrueAlpha':all(a['alpha']['range'][0]==0 and a['alpha']['range'][1]>240 for a in assets),'losslessPixelRoundtrip':True,'productionStagingByteParity':all((PROD/a['name']).read_bytes()==(STAGE/a['name']).read_bytes() for a in assets),'priorAvatar3ProductionSHAUnchanged':preserved,'UIApplied':False,'browserChecked':False,'wholeUIComplete':False},'limitations':['Pet original species/identity uncertain; generic puppy explicitly proposed.','No actual goal/progress, score rule, reward tier/quantity or API inferred.','No baked text, rank, circle frame or shadow; root assembles all UI/text/progress/rank/frames separately.','New resource preparation only; no UI/browser/source/designJSON/guide/sharedreport/STATUS/server/automation changes or past-art overwrites.']}
(ROOT/'_작업/codex/ux-studio/tycoon-pet-pack-assets.json').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
contact=Image.new('RGB',(320,160),'#e6e5dc')
for i,a in enumerate(assets):
 pic=Image.open(PROD/a['name']).convert('RGBA');contact.paste(pic,(i*160+(160-pic.width)//2,(160-pic.height)//2),pic)
contact.save(AUTHOR/'pet-pack-contact-sheet.jpg',quality=94)
print(json.dumps([{'name':a['name'],'size':[a['width'],a['height']],'bytes':a['bytes'],'sha256':a['sha256']} for a in assets],indent=2))
