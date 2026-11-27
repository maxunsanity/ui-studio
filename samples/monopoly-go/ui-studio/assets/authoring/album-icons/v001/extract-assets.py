from pathlib import Path
from PIL import Image, ImageFilter
from collections import deque
import hashlib, json, shutil

ROOT = Path('/Users/max/projest_max/ui-studio')
AUTHOR = ROOT / 'samples/monopoly-go/ui-studio/assets/authoring/album-icons/v001'
PROD = ROOT / 'samples/monopoly-go/ui-studio/assets/production/album-icons'
STAGE = ROOT / 'src/tools/uxStudio/assets/import-staging/album-icons'
WORK = ROOT / '_작업/codex/ux-studio'
ROLES = ['golden-dog', 'pearl-cat', 'peacock-lady', 'spa-cat', 'garden-fountain', 'party-cat', 'purple-curtain', 'yellow-cat', 'ginger-cat', 'reward-laughing-cat', 'reward-dice-stack', 'reward-bird-cloche', 'reward-gold-safe', 'reward-roller-cat', 'vault-book']
im = Image.open(AUTHOR / 'album-icons-master.png').convert('RGBA')
assets = []
for idx, role in enumerate(ROLES):
    col, row = idx % 4, idx // 4
    box = (round(col*im.width/4), round(row*im.height/4), round((col+1)*im.width/4), round((row+1)*im.height/4))
    cell = im.crop(box)
    cell.save(AUTHOR / f'raw-cell-{idx+1:02d}.png')
    alpha = cell.getchannel('A')
    w,h = cell.size
    data = list(alpha.getdata())
    pending = {i for i,a in enumerate(data) if a >= 128}
    groups = []
    while pending:
        start = pending.pop()
        group = [start]
        q = deque([start])
        while q:
            i = q.popleft()
            x,y = i%w,i//w
            for j in (i-1 if x else -1, i+1 if x+1<w else -1, i-w if y else -1, i+w if y+1<h else -1):
                if j in pending:
                    pending.remove(j); q.append(j); group.append(j)
        groups.append(group)
    main = max(groups,key=len)
    mask = Image.new('L', (w,h))
    md = [0]*(w*h)
    for i in main: md[i]=255
    mask.putdata(md)
    mask = mask.filter(ImageFilter.MaxFilter(5))
    cleaned = Image.new('L',(w,h))
    cleaned.putdata([a if m and a > 16 else 0 for a,m in zip(data,mask.getdata())])
    cell.putalpha(cleaned)
    bbox = cleaned.getbbox()
    result = cell.crop(bbox)
    if idx < 9:
        side = max(result.size)
        square = Image.new('RGBA',(side,side))
        square.alpha_composite(result, ((side-result.width)//2,(side-result.height)//2))
        result = square
    png = AUTHOR / f'common_album-{role}_icon_normal_v001.png'
    result.save(png)
    name = f'common_album-{role}_icon_normal_v001.webp'
    path = PROD / name
    result.save(path,'WEBP',quality=94,method=6,exact=True)
    shutil.copy2(path, STAGE/name)
    out = Image.open(path)
    aa = out.getchannel('A')
    assets.append({'id':role,'role':role,'name':name,'file':name,'relativePath':str(path.relative_to(ROOT)), 'stagingPath':str((STAGE/name).relative_to(ROOT)), 'authoringPath':str(png.relative_to(ROOT)), 'width':out.width,'height':out.height,'sourceSize':{'masterWidth':im.width,'masterHeight':im.height,'cellWidth':w,'cellHeight':h,'cropBox':list(bbox)},'bytes':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'hasAlpha':out.mode=='RGBA','alphaExtrema':list(aa.getextrema()),'alphaZeroPixels':sum(v==0 for v in aa.getdata()),'alphaPartialPixels':sum(0<v<255 for v in aa.getdata()),'observedVsInferred': 'partial reference subject; unseen lower details are artistic proposal' if 6<=idx<=8 else 'visible subject observed in screenshot; newly drawn pose/details are artistic proposal', 'category':'set-illustration' if idx<9 else 'banner-reward' if idx<14 else 'vault-book', 'mainOpaqueComponentPixels':len(main)})
manifest = {'version':'v001','status':'proposal-pending-review','generator':'built-in image_gen','reference':'docs/reference/monopoly-go/20261116-ten-screens/03_album.png','referenceUse':'visual subject/style reference only; no source screenshot pixels used','master':'samples/monopoly-go/ui-studio/assets/authoring/album-icons/v001/album-icons-master.png','prompt':'samples/monopoly-go/ui-studio/assets/authoring/album-icons/v001/prompt.txt','cleanupAttempt':'samples/monopoly-go/ui-studio/assets/authoring/album-icons/v001/album-icons-cleanup-attempt.png','cleanupAttemptSelected':False,'alphaProcessing':'Keep largest alpha>=128 connected silhouette per cell, dilate 2px to preserve antialias, retain source alpha>16 inside this support, zero exterior speckles. Tight crop; first 9 square canvas. No subject repainting.','count':len(assets),'setIllustrations':9,'bannerRewards':5,'vaultBooks':1,'assets':assets}
(WORK/'album-icon-assets.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
sheet = Image.new('RGB',(800,800),'#f3dfc6')
for i,a in enumerate(assets):
    item=Image.open(PROD/a['file']).convert('RGBA'); item.thumbnail((170,170),Image.Resampling.LANCZOS)
    sheet.paste(item,((i%4)*200+(200-item.width)//2,(i//4)*200+(200-item.height)//2),item)
sheet.save(AUTHOR/'production-contact-sheet.jpg',quality=94)
print(json.dumps([{'role':a['role'],'size':[a['width'],a['height']],'bytes':a['bytes'],'crop':a['sourceSize']['cropBox']} for a in assets],indent=2))
