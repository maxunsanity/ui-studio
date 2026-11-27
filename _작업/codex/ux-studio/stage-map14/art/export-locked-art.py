from datetime import datetime
from pathlib import Path
from hashlib import sha256
import json
import shutil

from PIL import Image, ImageChops, ImageDraw

ROOT=Path('/Users/max/projest_max/ui-studio')
ART=ROOT/'_작업/codex/ux-studio/stage-map14/art'
AUTHOR=ROOT/'samples/monopoly-go/ui-studio/assets/authoring/stage-map14/locked-v001'
PROD=ROOT/'samples/monopoly-go/ui-studio/assets/production/stage-map14'
STAGE=ROOT/'src/tools/uxStudio/assets/import-staging/stage-map14'
NORMAL_MANIFEST=ROOT/'samples/monopoly-go/ui-studio/assets/authoring/stage-map14/v001/manifest.json'


def meta(path):
 data=path.read_bytes()
 result={'path':str(path),'relativePath':str(path.relative_to(ROOT)),'sha256':sha256(data).hexdigest(),'bytes':len(data)}
 try:
  im=Image.open(path)
  result.update(pixelSize=list(im.size),mode=im.mode,format=im.format)
  if 'A' in im.getbands():
   a=im.getchannel('A');h=a.histogram()
   result['alpha']={'extrema':list(a.getextrema()),'fullyTransparentPixels':h[0],'nearOpaquePixels251to255':sum(h[251:]),'corners':[a.getpixel(p) for p in [(0,0),(im.width-1,0),(0,im.height-1),(im.width-1,im.height-1)]],'genuineAlphaVerified':h[0]>0 and sum(h[251:])>0}
 except Exception:
  pass
 return result


def compare_alpha(normal,locked):
 result=[]
 for threshold in [16,128,250]:
  a=normal.point(lambda value:255 if value>=threshold else 0)
  b=locked.point(lambda value:255 if value>=threshold else 0)
  intersection=ImageChops.multiply(a,b).histogram()[255]
  union=ImageChops.lighter(a,b).histogram()[255]
  na,lb=a.getbbox(),b.getbbox()
  result.append({'alphaThreshold':threshold,'intersectionOverUnion':round(intersection/union,8),'normalBbox':list(na),'lockedBbox':list(lb),'bboxDifferenceLTRB':list(lb[i]-na[i] for i in range(4))})
 return result


def main():
 normal=json.loads(NORMAL_MANIFEST.read_text())
 normal_by_role={asset['role']:asset for asset in normal['assets']}
 preserved={str(NORMAL_MANIFEST):meta(NORMAL_MANIFEST)['sha256']}
 for asset in normal['assets']:
  for kind in ['source','crop','production','staging','prompt']:
   preserved[asset[kind]['path']]=meta(Path(asset[kind]['path']))['sha256']
 baseline=ART/'locked-normal-preservation-baseline.json'
 if not baseline.exists():baseline.write_text(json.dumps(preserved,ensure_ascii=False,indent=2)+'\n')
 else:assert json.loads(baseline.read_text())==preserved
 jobs=json.loads((ART/'locked-export-jobs.json').read_text())['jobs']
 assets=[]
 sheet=Image.new('RGB',(1040,1120),'#e7edf4');draw=ImageDraw.Draw(sheet)
 for index,job in enumerate(jobs):
  role=job['role'];name=role+'_locked_v001';reference=normal_by_role[role]
  source=AUTHOR/f'{name}.source.png'
  shutil.copyfile(job['source'],source)
  prompt=AUTHOR/f'{name}.prompt.txt';prompt.write_text(job['prompt']+'\n')
  im=Image.open(source).convert('RGBA')
  original=Image.open(reference['source']['path']).convert('RGBA')
  assert im.size==original.size==(1254,1254)
  # State export reuses the original normal-state crop and output dimensions exactly.
  fixed_crop=tuple(reference['cropSpecification']['sourceCropBox'])
  output_size=tuple(reference['production']['pixelSize'])
  padding=reference['cropSpecification']['exportTransparentPaddingPx']
  content_size=(output_size[0]-2*padding,output_size[1]-2*padding)
  scaled=im.crop(fixed_crop).resize(content_size,Image.Resampling.LANCZOS)
  canvas=Image.new('RGBA',output_size,(0,0,0,0));canvas.alpha_composite(scaled,(padding,padding))
  png=AUTHOR/f'{name}.same-canvas.rgba.png';canvas.save(png,optimize=True)
  production=PROD/f'{name}.webp';canvas.save(production,lossless=True,exact=True,method=6)
  staging=STAGE/production.name;shutil.copyfile(production,staging)
  assert production.stat().st_size<=300000 and production.read_bytes()==staging.read_bytes()
  metrics=compare_alpha(original.getchannel('A'),im.getchannel('A'))
  exact=ImageChops.difference(original.getchannel('A'),im.getchannel('A')).getbbox() is None
  asset={
   'name':name,'role':role,'state':'locked','method':'Built-in image_gen precise-object-edit of locally viewed normal PNG; no CLI/API fallback',
   'normalSource':reference['source'],'normalProduction':reference['production'],'generationOriginalPath':job['source'],
   'prompt':meta(prompt),'source':meta(source),'sameCanvasPng':meta(png),'production':meta(production),'staging':meta(staging),
   'palette':'All surfaces desaturated dusty teal/cyan-gray; no separate golden padlock, ribbon, text or background baked in.',
   'stateCanvas':{'sourcePixelSize':list(im.size),'productionPixelSize':list(output_size),'sharedNormalCropBox':list(fixed_crop),'contentPixelSize':list(content_size),'paddingPx':padding,'independentStateTightCrop':False,'postGenerationTranslationOrScalingToRealign':False,'resample':'Original normal-state crop and content dimensions; Lanczos; same output canvas','nativeFit':'contain; same dimensions/position as normal state'},
   'silhouetteComparison':{'alphaExactlyEqual':exact,'metrics':metrics,'sourceBottomDifferencePxAtAlpha128':metrics[1]['bboxDifferenceLTRB'][3],'productionBottomDifferenceApproxPxAtAlpha128':round(metrics[1]['bboxDifferenceLTRB'][3]*content_size[1]/(fixed_crop[3]-fixed_crop[1]),4)},
   'unverified':['Exact silhouette preservation is not claimed: image_gen edit changed antialias contours by roughly1–2 source pixels; see measured alpha IoU/bounds.','Small surface detail/material rendering is regenerated, not a deterministic pixel recolor.','Native state swapping, final locked-state tint/contrast and actual browser rendering belong to parent.'],
  }
  assets.append(asset)
  original_product=Image.open(reference['production']['path']).convert('RGBA')
  for column,picture in enumerate([original_product,canvas]):
   # Same preview transform for both states; no separate fitting or recentering.
   x=column*520+(520-output_size[0])//2;y=index*560+28
   sheet.paste(picture,(x,y),picture)
   draw.text((column*520+12,index*560+536),role+(' / normal' if column==0 else ' / locked'),fill='#21354b')
 assert all(meta(Path(path))['sha256']==digest for path,digest in preserved.items())
 manifest={'schemaVersion':1,'pack':'stage-map14-locked-v001','createdAtKst':datetime.now().astimezone().isoformat(),'author':'codex art subagent','status':'제안(검수 대기)','assetCount':2,'originalNormalManifestUnchanged':True,'originalNormalFilesUnchanged':True,'preservationBaseline':str(baseline),'sourceReference':'Existing newly drawn littlemroom/monaco normal_v001; original screenshots not used as product pixels','tool':'built-in image_gen edit','assets':assets,'exportScript':str(ART/'export-locked-art.py'),'contactSheet':str(ART/'locked-contact-sheet.jpg'),'unverified':['No final visual acceptance or native-browser state-swap test in this art task.','Measured silhouette differences remain; state canvas/crop/output dimensions are shared exactly.']}
 (AUTHOR/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
 sheet.save(ART/'locked-contact-sheet.jpg',quality=94)
 print(json.dumps({'assetCount':2,'allBelow300KB':all(asset['production']['bytes']<=300000 for asset in assets),'allTrueAlpha':all(asset['production']['alpha']['genuineAlphaVerified'] for asset in assets),'allStagingSHAMatch':all(asset['production']['sha256']==asset['staging']['sha256'] for asset in assets),'originalNormalUnchanged':True,'manifest':str(AUTHOR/'manifest.json'),'assets':[{'name':asset['name'],'bytes':asset['production']['bytes'],'size':asset['production']['pixelSize'],'alpha128IoU':asset['silhouetteComparison']['metrics'][1]['intersectionOverUnion']} for asset in assets]},ensure_ascii=False))


if __name__=='__main__':main()
