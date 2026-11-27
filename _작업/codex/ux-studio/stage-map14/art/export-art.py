from datetime import datetime
from hashlib import sha256
from pathlib import Path
import io
import json
import shutil

from PIL import Image, ImageDraw

ROOT=Path('/Users/max/projest_max/ui-studio')
ART=ROOT/'_작업/codex/ux-studio/stage-map14/art'
AUTHOR=ROOT/'samples/monopoly-go/ui-studio/assets/authoring/stage-map14/v001'
PRODUCTION=ROOT/'samples/monopoly-go/ui-studio/assets/production/stage-map14'
STAGING=ROOT/'src/tools/uxStudio/assets/import-staging/stage-map14'
MGV04='docs/reference/monopoly-go/video-analysis-20261117/MGV04/'
MGV05='docs/reference/monopoly-go/video-analysis-20261117/MGV05/'
DETAIL={
 'tokyo':{'stageNumber':16,'observedLabel':'도쿄','role':'Red torii with muted green cap and gold accent, pink cherry trees, pale stone approach path on a small green island.','sourceRegionsApproxPx':[[MGV04+'frames/game-crops/stable-frame_00001.png',[117,758,479,1054]]],'colorEvidence':'Colored Tokyo visible in both MGV04 stable0/3s frames.','limitations':['Generated shrine, stone lanterns and garden details extend the visible source motif; exact ornament equivalence is unverified.']},
 'littlemroom':{'stageNumber':17,'observedLabel':'리틀 M의 방','role':'Open cream/yellow room with two arched white-grid windows; turquoise toy castle on reddish table, treasure chest, blocks, toy biplane and rolled paper.','sourceRegionsApproxPx':[[MGV04+'frames/game-crops/stable-frame_00001.png',[147,320,469,620]]],'colorEvidence':'Unlocked colored stage17 directly observed at MGV04 stable3s and MGV05 stable21s.','limitations':['Toy-castle geometry, clock position and tiny props are a new illustration interpretation, not exact source reconstruction.']},
 'monaco':{'stageNumber':18,'observedLabel':'모나코','role':'Cream/pink city buildings with pale blue windows, elevated gold racing-figure trophy, gray looping racetrack with red-orange/white curbs, two small racing cars and green shrubs.','sourceRegionsApproxPx':[[MGV04+'frames/game-crops/stable-frame_00001.png',[143,0,471,211]],[MGV05+'frames/game-crops/stable-frame_00003.png',[99,382,349,584]]],'colorEvidence':'MGV04 stage18 is gray locked; actual unlocked colors directly observed from MGV05-S04-B at21s. No unobserved color proposal was required.','limitations':['Building/track/trophy details are newly painted variations of the observed scene; exact source geometry is unverified.','Locked gray state must be expressed as native engine tint; no padlock or gray-state artwork was baked into this source.']},
}


def meta(path):
 data=path.read_bytes()
 record={'path':str(path),'relativePath':str(path.relative_to(ROOT)),'bytes':len(data),'sha256':sha256(data).hexdigest()}
 try:
  im=Image.open(path)
  record.update(format=im.format,mode=im.mode,pixelSize=list(im.size))
  if 'A' in im.getbands():
   a=im.getchannel('A');h=a.histogram()
   record['alpha']={'extrema':list(a.getextrema()),'fullyTransparentPixels':h[0],'fullyOpaquePixels':h[255],'nearOpaquePixels251to255':sum(h[251:]),'partialPixels1to254':sum(h[1:255]),'corners':[a.getpixel(p) for p in [(0,0),(im.width-1,0),(0,im.height-1),(im.width-1,im.height-1)]],'genuineAlphaVerified':h[0]>0 and sum(h[251:])>0}
 except Exception:
  pass
 return record


def main():
 jobs=json.loads((ART/'export-jobs.json').read_text())['jobs']
 records=[]
 contact=Image.new('RGB',(1120,420),'#e7edf4')
 draw=ImageDraw.Draw(contact)
 for index,job in enumerate(jobs):
  role=job['role'];detail=DETAIL[role]
  stem=f'common_stage-map-{role}_diorama_normal_v001'
  source=AUTHOR/f'{stem}.source.png'
  shutil.copyfile(job['source'],source)
  prompt=AUTHOR/f'{stem}.prompt.txt'
  prompt.write_text(job['prompt']+'\n')
  im=Image.open(source).convert('RGBA');alpha=im.getchannel('A')
  visible=alpha.point(lambda v:255 if v>=16 else 0).getbbox()
  assert visible is not None
  l,t,r,b=visible
  cropbox=(max(0,l-4),max(0,t-4),min(im.width,r+4),min(im.height,b+4))
  cropped=im.crop(cropbox)
  crop=AUTHOR/f'{stem}.crop.rgba.png'
  cropped.save(crop,optimize=True)
  edge=480
  while True:
   scaled=cropped.copy();scaled.thumbnail((edge,edge),Image.Resampling.LANCZOS)
   canvas=Image.new('RGBA',(scaled.width+16,scaled.height+16),(0,0,0,0))
   canvas.alpha_composite(scaled,(8,8))
   data=io.BytesIO();canvas.save(data,format='WEBP',lossless=True,method=6,exact=True)
   if len(data.getvalue())<=300000:
    break
   edge-=16
   assert edge>=256
  production=PRODUCTION/f'{stem}.webp'
  production.write_bytes(data.getvalue())
  staging=STAGING/production.name
  shutil.copyfile(production,staging)
  assert production.read_bytes()==staging.read_bytes()
  record={
   'name':stem,'role':role,'stageNumberObserved':detail['stageNumber'],'stageTitleObserved':detail['observedLabel'],
   'artType':'isolated transparent newly painted 2D diorama illustration',
   'recommendedLogicalAspectRatio':round(canvas.width/canvas.height,6),'fit':'contain without stretching',
   'observedRole':detail['role'],'colorEvidence':detail['colorEvidence'],
   'referenceObservation':{'regionsApproxPx':detail['sourceRegionsApproxPx'],'regionStatus':'visual approximate illustration region; not exact geometry measurement','actuallyViewedDirectly':True},
   'method':'built-in image_gen original generation; no CLI/API fallback','inputScreenshotPixelsReused':False,'new3DEngineIntroduced':False,
   'generationOriginalPath':job['source'],'prompt':meta(prompt),'source':meta(source),'crop':meta(crop),'production':meta(production),'staging':meta(staging),
   'cropSpecification':{'sourceAlphaBboxAllNonzero':list(alpha.getbbox()),'visibleAlphaThreshold':16,'visibleBbox':list(visible),'sourceCropBox':list(cropbox),'sourceCropPaddingPx':4,'alphaPixelsAltered':False,'exportContentMaxEdgePx':edge,'exportTransparentPaddingPx':8,'resample':'Lanczos uniform scale','webp':'lossless exact, <=300000 bytes'},
   'nativeSeparation':{'ribbon':True,'stageNumberAndLabel':True,'padlock':True,'lockedTint':True,'mapCloudBackground':True,'pathAndPawn':True,'externalCastShadow':True},
   'unverified':['New illustration, 제안(검수 대기); final visual equivalence and user approval remain unverified.','Tiny source geometry and original projection parameters were not measured. Painted miniature viewpoint is a reconstruction.','Native editor placement, browser rendering, tint and animation checks belong to parent task.','Generated alpha is preserved; thin source antialias/fringe remains possible.']+detail['limitations'],
  }
  records.append(record)
  thumb=canvas.copy();thumb.thumbnail((350,350),Image.Resampling.LANCZOS)
  x=index*373
  contact.paste(thumb,(x+(373-thumb.width)//2,12+(350-thumb.height)//2),thumb)
  draw.text((x+14,385),f"{detail['stageNumber']} / {role}",fill='#21354b')
 references=[MGV04+'frames/game-crops/stable-frame_00000.png',MGV04+'frames/game-crops/stable-frame_00001.png',MGV05+'frames/game-crops/stable-frame_00003.png']
 manifest={
  'schemaVersion':1,'screen':'stage-map','referenceScreens':['MGV04-S01','MGV05-S04'],'createdAtKst':datetime.now().astimezone().isoformat(),'author':'codex art subagent','status':'제안(검수 대기)','assetCount':len(records),
  'scope':'Illustration resources only; no browser, product code, saved design, guide, STATUS/report or other-project writes.',
  'referenceImagesViewedDirectly':[meta(ROOT/p) for p in references],
  'metadataRead':[MGV04+'screens.json',MGV04+'meta.json',MGV05+'screens.json',MGV05+'meta.json'],
  'videoComparison':{'MGV04':{'sourceHash':'d74b905c786e1041107ab483d7279f5fa44cbf939af4891624b4e58b637179db','stagesObserved':[16,17,18],'stage17States':['gray locked0s','colored unlocked3s'],'cropPixelSize':[610,1080]},'MGV05':{'sourceHash':'272a31011defdec398fb7ea1288de40ba3d7d82162840387868456f7b291b191','stagesObserved':[17,18,19],'stage18States':['gray locked18.5s metadata','colored unlocked21s direct image'],'cropPixelSize':[442,1080]},'sameCanonicalFamily':True,'overlapStages':[17,18],'additionalStage19ArtGenerated':False,'stage19Reason':'Different visible next-stage data; requested art set remains only16/17/18.'},
  'pawnAndHand':{'separateAssets':[],'reason':'No moving pawn or hand is clearly visible in directly viewed stable reference crops; no extra character/UI asset invented.','unverified':'Transition frames were not inspected by this art task.'},
  'assets':records,'exportScript':str(ART/'export-art.py'),'contactSheet':str(ART/'contact-sheet.jpg'),
  'unverified':['Actual native integration and map animation remain parent-task work.','Generated geometric/decorative variations do not establish exact original-art equivalence.'],
 }
 output=json.dumps(manifest,ensure_ascii=False,indent=2)+'\n'
 (AUTHOR/'manifest.json').write_text(output)
 (ART/'manifest.json').write_text(output)
 contact.save(ART/'contact-sheet.jpg',quality=94)
 print(json.dumps({'assetCount':len(records),'totalBytes':sum(r['production']['bytes'] for r in records),'maxBytes':max(r['production']['bytes'] for r in records),'allTrueAlpha':all(r['production']['alpha']['genuineAlphaVerified'] for r in records),'allStagingSHAMatch':all(r['production']['sha256']==r['staging']['sha256'] for r in records),'manifest':str(AUTHOR/'manifest.json')},ensure_ascii=False))


if __name__=='__main__':
 main()
