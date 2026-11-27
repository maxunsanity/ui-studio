from pathlib import Path
from PIL import Image, ImageFilter
from collections import deque
import hashlib, json, shutil

ROOT=Path('/Users/max/projest_max/ui-studio')
AUTHOR=ROOT/'samples/monopoly-go/ui-studio/assets/authoring/album-icons/v002'
PROD=ROOT/'samples/monopoly-go/ui-studio/assets/production/album-icons'
STAGE=ROOT/'src/tools/uxStudio/assets/import-staging/album-icons'
roles=['green-yellow-bird','yellow-dog']
assets=[]
for role in roles:
    source=AUTHOR/f'{role}-master.png'
    im=Image.open(source).convert('RGBA'); w,h=im.size
    alpha=im.getchannel('A'); data=list(alpha.getdata())
    pending={i for i,a in enumerate(data) if a>=128}; groups=[]
    while pending:
        start=pending.pop(); group=[start]; q=deque([start])
        while q:
            i=q.popleft(); x,y=i%w,i//w
            for j in (i-1 if x else -1,i+1 if x+1<w else -1,i-w if y else -1,i+w if y+1<h else -1):
                if j in pending: pending.remove(j); q.append(j); group.append(j)
        groups.append(group)
    main=max(groups,key=len); md=[0]*(w*h)
    for i in main: md[i]=255
    support=Image.new('L',(w,h)); support.putdata(md); support=support.filter(ImageFilter.MaxFilter(5))
    cleaned=Image.new('L',(w,h)); cleaned.putdata([a if m and a>16 else 0 for a,m in zip(data,support.getdata())])
    im.putalpha(cleaned); bbox=cleaned.getbbox(); cropped=im.crop(bbox)
    side=max(cropped.size); square=Image.new('RGBA',(side,side)); square.alpha_composite(cropped,((side-cropped.width)//2,(side-cropped.height)//2))
    square.save(AUTHOR/f'common_album-{role}_icon_normal_v002.png')
    square.thumbnail((512,512),Image.Resampling.LANCZOS)
    name=f'common_album-{role}_icon_normal_v002.webp'; path=PROD/name
    square.save(path,'WEBP',quality=94,method=6,exact=True); shutil.copy2(path,STAGE/name)
    final=Image.open(path); a=final.getchannel('A')
    assets.append({'role':role,'name':name,'relativePath':str(path.relative_to(ROOT)),'stagingPath':str((STAGE/name).relative_to(ROOT)),'authoringPath':str((AUTHOR/f'common_album-{role}_icon_normal_v002.png').relative_to(ROOT)),'sourcePath':str(source.relative_to(ROOT)),'promptPath':str((AUTHOR/f'{role}-prompt.txt').relative_to(ROOT)),'sourceSize':{'width':w,'height':h,'cropBox':list(bbox),'tightSquareSize':side},'width':final.width,'height':final.height,'bytes':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'hasAlpha':final.mode=='RGBA','alphaExtrema':list(a.getextrema()),'alphaZeroPixels':sum(v==0 for v in a.getdata()),'alphaPartialPixels':sum(0<v<255 for v in a.getdata()),'observed':'lower center green/yellow bird with orange beak' if role==roles[0] else 'lower right yellow dog face','inferred':'lower body, full pose and hidden details are artistic proposal','supersedesRole':'yellow-cat' if role==roles[0] else 'ginger-cat','supersedesVersion':'v001'})
manifest={'version':'v002','status':'proposal-pending-review','count':2,'generator':'built-in image_gen, separate generation for each new illustration','reference':'docs/reference/monopoly-go/20261116-ten-screens/03_album.png','referenceUse':'visually inspected reference; no screenshot pixels reused','reason':'Correct earlier species misidentification of Set08/09; preserve all v001 assets unchanged','alphaProcessing':'largest alpha>=128 connected silhouette, 2px dilation retaining source alpha>16, tight crop, square canvas and maximum 512px export; no subject repaint','assets':assets}
(ROOT/'_작업/codex/ux-studio/album-icon-corrections.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
sheet=Image.new('RGB',(800,400),'#f3dfc6')
for i,a in enumerate(assets):
    item=Image.open(PROD/a['name']).convert('RGBA'); item.thumbnail((360,360),Image.Resampling.LANCZOS)
    sheet.paste(item,(i*400+(400-item.width)//2,(400-item.height)//2),item)
sheet.save(AUTHOR/'corrections-contact-sheet.jpg',quality=94)
print(json.dumps(assets,ensure_ascii=False,indent=2))
