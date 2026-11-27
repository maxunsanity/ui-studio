from pathlib import Path
from PIL import Image, ImageFilter
from collections import deque
import hashlib,json,shutil

ROOT=Path('/Users/max/projest_max/ui-studio')
AUTHOR=ROOT/'samples/monopoly-go/ui-studio/assets/authoring/tycoon-icons/v001'
PROD=ROOT/'samples/monopoly-go/ui-studio/assets/production/tycoon-icons'
STAGE=ROOT/'src/tools/uxStudio/assets/import-staging/tycoon-icons'
MANIFEST=ROOT/'_작업/codex/ux-studio/tycoon-avatar-assets.json'
INFO=[('musician',1,[75,573,64,64],['Dark brown face in profile, pale gray brimmed hat and light clothing, blue neck detail, golden brass wind instrument, red/orange circular background.','Musician motif observed from memory-only source enlargement; exact species/person identity not established from username.'],['Generic human jazz saxophonist is an illustration interpretation; exact instrument, suit and facial details are not asserted as source identity.']),('generic-family',2,[75,661,64,64],['Small group photograph inside avatar circle; individual identities, relationships and exact group size are not reliably established.'],['Entirely new fictional illustrated family of two adults and one child; this family relationship/group size is artistic substitution, not a claim about the photo.']),('sailor',3,[75,749,64,64],['Illustrated person with white/navy/gold captain cap, light shirt, dark blue lower clothing and brown steering-wheel-like ring/spokes; blue backdrop.'],['Generic young human helmsman, complete pose, wheel geometry and clothes are original illustration interpretation; no real identity or username-derived animal asserted.'])]
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
assets=[]
for role,rank,refbox,observed,inferred in INFO:
    base=f'common_tycoon-avatar-{role}_icon_normal_v001'
    source=AUTHOR/f'{role}-source.png'; prompt=AUTHOR/f'{role}-prompt.txt'
    im=Image.open(source).convert('RGBA'); w,h=im.size; alpha=im.getchannel('A'); vals=list(alpha.getdata())
    pending={i for i,v in enumerate(vals) if v>=128}; groups=[]
    while pending:
        start=pending.pop(); group=[start]; q=deque([start])
        while q:
            i=q.popleft();x,y=i%w,i//w
            for j in (i-1 if x else -1,i+1 if x+1<w else -1,i-w if y else -1,i+w if y+1<h else -1):
                if j in pending:pending.remove(j);q.append(j);group.append(j)
        groups.append(group)
    main=max(groups,key=len); md=[0]*(w*h)
    for i in main:md[i]=255
    support=Image.new('L',(w,h));support.putdata(md);support=support.filter(ImageFilter.MaxFilter(5))
    clean=Image.new('L',(w,h));clean.putdata([v if m and v>16 else 0 for v,m in zip(vals,support.getdata())]);im.putalpha(clean)
    bbox=clean.getbbox();tight=im.crop(bbox);side=max(tight.size);square=Image.new('RGBA',(side,side));square.alpha_composite(tight,((side-tight.width)//2,(side-tight.height)//2))
    tightpath=AUTHOR/f'{base}.tight.png';square.save(tightpath)
    final=square.resize((160,160),Image.Resampling.LANCZOS); png=AUTHOR/f'{base}.rgba.png'; final.save(png)
    dest=PROD/f'{base}.webp';final.save(dest,'WEBP',lossless=True,method=6,exact=True);shutil.copy2(dest,STAGE/dest.name)
    decoded=Image.open(dest).convert('RGBA'); a=decoded.getchannel('A')
    assert decoded.tobytes()==final.tobytes()
    assets.append({'role':f'tycoon-avatar-{role}','rankSlotObserved':rank,'name':dest.name,'relativePath':str(dest.relative_to(ROOT)),'stagingPath':str((STAGE/dest.name).relative_to(ROOT)),'width':160,'height':160,'bytes':dest.stat().st_size,'sha256':sha(dest),'source':{'originalPath':str(source.relative_to(ROOT)),'sourceSize':[w,h],'originalSHA256':sha(source),'sourceMode':Image.open(source).mode,'tightCropXYXY':list(bbox),'tightSquareSize':side,'tightPNGPath':str(tightpath.relative_to(ROOT)),'productionRGBAPath':str(png.relative_to(ROOT)),'productionRGBASHA256':sha(png)},'prompt':{'path':str(prompt.relative_to(ROOT)),'sha256':sha(prompt),'text':prompt.read_text()},'referenceRegionXYWH':refbox,'observed':observed,'inferred':inferred,'alpha':{'range':list(a.getextrema()),'zeroPixels':sum(v==0 for v in a.getdata()),'partialPixels':sum(0<v<255 for v in a.getdata()),'losslessRGBAEqualsProductionPNG':True},'encoding':'WebP lossless RGB and alpha, exact=True','uiApplied':False,'realIdentityReplicated':False,'screenshotPixelsReused':False})
manifest={'schemaVersion':1,'version':'v001','status':'제안(검수 대기)','count':3,'generator':'built-in image_gen; three separate new illustration calls','reference':{'path':'docs/reference/monopoly-go/20261116-ten-screens/10_tycoon.png','actuallyViewed':True,'rank1And3Enlargement':'4x NEAREST in-memory inspection only; no screenshot crop file saved or reused','photoPixelsReused':False},'sourceDocsRead':['AGENTS.md latest manual resume 2026-11-17 09:15 KST','_작업/codex/ux-studio/tycoon10-assembly-quick-sheet.json','_작업/codex/ux-studio/tycoon-ui-assets.json'],'authorization':'User direct manual resume with explicit90% lift; automation PAUSED, no new deadline or automation','alphaProcessing':'largest alpha>=128 connected silhouette, 2px dilation retaining source alpha>16 to remove exterior noise; tight crop, square canvas,160x160 LANCZOS. Existing screenshot pixels never used.','assets':assets,'qa':{'fileCount':3,'allBelow300000Bytes':all(a['bytes']<=300000 for a in assets),'all160Square':True,'allRGBAAlphaRange0to255':all(a['alpha']['range']==[0,255] for a in assets),'losslessRGBARoundtrip':True,'productionStagingByteParity':all((PROD/a['name']).read_bytes()==(STAGE/a['name']).read_bytes() for a in assets),'wholeUIComplete':False,'UIRegistered':False,'browserChecked':False,'existingAssetsOverwritten':False},'limitations':['All are new fictional concept-inspired avatars, no face identity replication or exact screenshot match.','Rank2 source relationships/identities are unknown; generic illustrated family is explicitly inferred.','Exact rank1 species/person and wind-instrument type are uncertain; generic human musician is an artistic interpretation, not username-derived animal.','No rank4, self SNS photo, game policies, unseen quantities, source text or layout invented.','Resource preparation only; root owns UI registration and screen QA. No source/UI/designJSON/guide/sharedreport/STATUS/server/automation changes.']}
MANIFEST.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
contact=Image.new('RGB',(600,200),'#e6e5dc')
for i,a in enumerate(assets):
    avatar=Image.open(PROD/a['name']).convert('RGBA');contact.paste(avatar,(i*200+20,20),avatar)
contact.save(AUTHOR/'avatars-contact-sheet.jpg',quality=94)
print(json.dumps([{'role':a['role'],'size':[a['width'],a['height']],'bytes':a['bytes'],'sha256':a['sha256']} for a in assets],indent=2))
