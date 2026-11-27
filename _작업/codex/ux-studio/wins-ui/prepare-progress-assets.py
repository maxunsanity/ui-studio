from pathlib import Path
from io import BytesIO
from datetime import datetime, timezone, timedelta
import hashlib
import json
from PIL import Image, ImageDraw

ROOT=Path('/Users/max/projest_max/ui-studio')
AUTHORING=ROOT/'samples/monopoly-go/ui-studio/assets/authoring/wins-ui/v001'
PRODUCTION=ROOT/'samples/monopoly-go/ui-studio/assets/production/wins-ui'
MIRROR=ROOT/'src/tools/uxStudio/assets/import-staging/wins-ui'
SCRATCH=ROOT/'_작업/codex/ux-studio/wins-ui'
MANIFEST=ROOT/'_작업/codex/ux-studio/wins-ui-assets.json'
BACKUP=ROOT/'docs/planning/_backup/20261116_단이/1934_wins_progress_capsules/wins-ui-assets.json'
before=json.loads(MANIFEST.read_text())
assert MANIFEST.read_bytes()==BACKUP.read_bytes(), 'Metadata changed since this task backup'
assert len(before['assets'])==5

def write_new(path,data):
    path.parent.mkdir(parents=True,exist_ok=True)
    with path.open('xb') as out:out.write(data)

def relative(path):return str(path.relative_to(ROOT))
def sha(data):return hashlib.sha256(data).hexdigest()

contract={'mode':'3','sourceSize':[128,32],'slices':[0,16,0,16],'edges':[0,18,0,18],'padding':[0,0,0,0],'order':'top right bottom left','repeat':'stretch','sourceCenter':[96,32],'minimumTargetWidthForPositiveCenter':37,'sourceRect':[0,0,128,32],'sourceCapWidth':16,'targetCapWidthLogicalPx':18,'crop':'none; preserve the complete 128x32 source','targetLogicalExamples':[[375.84,36.38],[64,36.38]],'targetCenterWidthsLogicalPx':[339.84,28],'assembly':'native CSS border-image, mode 3; use registered normal texture at w128/h32, slices 0 16 0 16 fill, edges 0px 18px 0px 18px, repeat stretch, zero padding. No text/image child needed.'}
entries=[];images=[]
for part,color,role in [('bg3','#5f614c','weekly-progress-dark-olive-background-3slice'),('fill3','#23bedf','weekly-progress-cyan-blue-fill-3slice')]:
    name=f'common_wins_weekly-progress-{part}_normal_v001'
    vector=f'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="32" viewBox="0 0 128 32"><rect width="128" height="32" rx="16" fill="{color}"/></svg>\n'.encode()
    image=Image.new('RGBA',(512,128),(0,0,0,0))
    ImageDraw.Draw(image).rounded_rectangle((0,0,511,127),radius=64,fill=color)
    image=image.resize((128,32),Image.Resampling.LANCZOS)
    png=BytesIO();image.save(png,format='PNG')
    webp=BytesIO();image.save(webp,format='WEBP',lossless=True,method=6,exact=True)
    encoded=webp.getvalue()
    assert len(encoded)<=300000
    with Image.open(BytesIO(encoded)) as decoded:
        assert decoded.size==(128,32) and decoded.convert('RGBA').tobytes()==image.tobytes()
    alpha=image.getchannel('A')
    assert alpha.getextrema()==(0,255) and alpha.getpixel((0,0))==0 and alpha.getpixel((64,16))==255
    # No 3-slice cap can encroach on its opaque source center band.
    assert alpha.crop((16,0,112,32)).getextrema()==(255,255)
    files={}
    for key,path,data in [('svgMaster',AUTHORING/(name+'.svg'),vector),('pngRasterMaster',AUTHORING/(name+'.png'),png.getvalue()),('production',PRODUCTION/(name+'.webp'),encoded),('importMirror',MIRROR/(name+'.webp'),encoded)]:
        write_new(path,data)
        files[key]={'path':relative(path),'bytes':len(data),'sha256':sha(data)}
    entries.append({'name':name,'role':role,'size':[128,32],'fill':color,'assembly':{'threeSlice':contract,'stack':'background' if part=='bg3' else 'above matching dark olive track; size by progress value'},'files':files,'importPath':'/ui-studio/source/assets/import-staging/wins-ui/'+name+'.webp','encoding':{'format':'WEBP','lossless':True,'method':6,'exact':True,'decodedRGBAEqualsPNG':True,'sameSourceSize':True},'alpha':{'range':[0,255],'center':255,'corners':[0,0,0,0],'bboxAlpha16':list(alpha.point(lambda x:255 if x>=16 else 0).getbbox()),'bboxAlpha128':list(alpha.point(lambda x:255 if x>=128 else 0).getbbox())},'excludes':['text','numbers','border','external shadow'],'status':'제안(검수 대기); generated only, not registered or applied'})
    images.append(image)

def render_three(image,width,height,scale=8):
    # Floating logical geometry is quantized only for this diagnostic PNG.
    out=Image.new('RGBA',(round(width*scale),round(height*scale)))
    destination=[0,round(18*scale),round((width-18)*scale),round(width*scale)]
    source=[0,16,112,128]
    for i in range(3):
        strip=image.crop((source[i],0,source[i+1],32))
        strip=strip.resize((destination[i+1]-destination[i],out.height),Image.Resampling.LANCZOS)
        out.paste(strip,(destination[i],0))
    assert out.getpixel((out.width//2,out.height//2))[3]==255
    assert out.getpixel((0,0))[3]==0
    return out

sheet=Image.new('RGBA',(1000,500),'#ece9e2');draw=ImageDraw.Draw(sheet)
draw.text((20,15),'Progress capsule native 3-slice; left/right source 16 -> logical edges 18',fill='#222222')
for index,(width,height) in enumerate(contract['targetLogicalExamples']):
    y=70+index*180
    draw.text((20,y-25),f'{width} x {height} logical px; center {round(width-36,2)} px',fill='#222222')
    for row,image in enumerate(images):
        rendered=render_three(image,width,height)
        shown=rendered.resize((round(width*2),round(height*2)),Image.Resampling.LANCZOS)
        sheet.alpha_composite(shown,(20,y+row*80))
preview=SCRATCH/'wins-progress-3slice-v001-preview.png'
buffer=BytesIO();sheet.convert('RGB').save(buffer,format='PNG');write_new(preview,buffer.getvalue())

manifest=json.loads(json.dumps(before))
manifest['assets'].extend(entries)
assert manifest['assets'][:5]==before['assets']
manifest['checks']['assetCount']=7
manifest['checks']['progressCapsules']={'count':2,'sourceSize':[128,32],'slices':[0,16,0,16],'edges':[0,18,0,18],'padding':[0,0,0,0],'targetsLogicalPx':contract['targetLogicalExamples'],'sourceCentersOpaque':True,'transparentCorners':True,'RGBAWebPExact':True,'targetCentersPositive':True,'previewQuantization':'diagnostic raster at 8 samples per logical px, fractional destination edges rounded only for the preview; actual CSS variables retain 18px edges'}
manifest['supplements']=manifest.get('supplements',[])+[{'atKST':datetime.now(timezone(timedelta(hours=9))).isoformat(timespec='seconds'),'purpose':'Two textless native 3-slice progress capsules only','assets':[e['name'] for e in entries],'preview':relative(preview),'backupBeforeAppend':relative(BACKUP),'rasterization':'New native SVG rect/capsule geometry; Pillow 4x supersampling/LANCZOS raster derivative. No reference pixels used.','oldAssetRecordsUnchanged':True,'registration':None,'UIApplied':False}]
MANIFEST.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
for entry in entries:print(json.dumps({'name':entry['name'],'size':entry['size'],'bytes':entry['files']['production']['bytes'],'sha256':entry['files']['production']['sha256'],'importPath':entry['importPath']},ensure_ascii=False))
print(json.dumps({'manifest':str(MANIFEST),'preview':str(preview),'preservedOldAssetRecords':5,'contract':contract},ensure_ascii=False))
