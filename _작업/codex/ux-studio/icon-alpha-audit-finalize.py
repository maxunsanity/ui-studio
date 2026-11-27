from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
from collections import Counter
import json,re,math,textwrap
out=Path('/Users/max/projest_max/ui-studio/_작업/codex/ux-studio');p=out/'icon-alpha-audit.json';data=json.loads(p.read_text());assets={a['assetRef']:a for a in data['assets']}
manual={
122:('intentional_ui_background','Checkerboard contact-sheet review: full rectangular golden-ray pattern behind the weekly reward; alpha61..255 is intentional background artwork, not an icon.'),
138:('intentional_scene_or_background','Checkerboard contact-sheet review: full room/interior scene behind the album grand reward.'),
171:('intentional_photo_or_sns','Checkerboard contact-sheet review: rectangular illustrated person portrait. StickerArt is a misleading name for this photo/portrait content; opaque is intentional.'),
234:('intentional_scene_or_background','Checkerboard contact-sheet review: architectural showroom header/backdrop, using the declared source region.'),
351:('intentional_scene_or_background','Checkerboard contact-sheet review: full racing scene with people, vehicles and landscape.'),
352:('intentional_ui_background','Checkerboard contact-sheet review: full rectangular road/reward band used as a UI background.'),
366:('intentional_scene_or_background','Checkerboard contact-sheet review: full station/train landscape scene; runtime topArchHeight64 is a separate clipping property.')
}
manual_records=[]
for u in data['uses']:
 i=u['useIndex']
 if i in manual:
  category,basis=manual[i];u.update(classification=category,classificationBasis=basis,classificationConfidence='high');manual_records.append({'useIndex':i,'assetRef':u['assetRef'],'elementName':u['elementName'],'classification':category,'basis':basis})
 elif u['classification']=='needs_semantic_review':
  u.update(classification='standalone_icon_or_sprite',classificationBasis='Reviewed semantic name: MenuBars/GO/disc/rim/event object/pack/book/clipboard/pedestal/medallion/hinge/character/clock/pet or other isolated decorative UI sprite.',classificationConfidence='medium')
flags=[]
for u in data['uses']:
 a=u.get('regionAlpha')
 if not a:continue
 if u['classification']=='standalone_icon_or_sprite':
  reason=None
  if a['alphaMin']==255:reason='Standalone icon/sprite region is completely opaque.'
  elif a['alphaMin']>0:reason='Standalone icon/sprite region has no fully transparent pixel, including its rectangular outer extent.'
  elif all(v==255 for v in a['cornerAlpha'].values()):reason='All four rectangular source-region corners are opaque despite other transparency.'
  u['status']='suspect_opaque_icon' if reason else 'icon_has_transparency'
  if reason:flags.append({'useIndex':u['useIndex'],'screenName':u['screenName'],'elementName':u['elementName'],'assetRef':u['assetRef'],'reason':reason,'severity':'review'})
 else:u['status']='intentional_surface_or_photo_opaque_allowed' if a['alphaMin']==255 else 'intentional_surface_or_photo_with_alpha'
data['flags']=flags;data['summary'].update(classifications=dict(Counter(u['classification'] for u in data['uses'])),statuses=dict(Counter(u['status'] for u in data['uses'])),opaqueIconSuspectUses=len(flags),opaqueIconSuspectUniqueAssets=len(set(f['assetRef'] for f in flags)),standaloneIconSpriteUniqueAssets=len(set(u['assetRef'] for u in data['uses'] if u['classification']=='standalone_icon_or_sprite')),remainingSemanticReviewUses=0)
data['method']['flags']='Only standalone icon/sprite regions with no transparent pixels (alphaMin>0) or all four region corners alpha=255; intentional surfaces/scenes/photos are not failures.'
data['manualClassificationReview']={'contactSheet':str(out/'icon-alpha-audit-review.png'),'reviewedInAssistantImageView':True,'resolvedFalsePositive':171,'resolvedNonzeroAlphaBackground':122,'decisions':manual_records,'scopeNote':'Artwork semantics are classification judgments, not newly approved game policy. Opaque scenes/surfaces/photos remain explicitly listed and measured.'}
data['limitations']=['Alpha statistics cannot alone prove that every visible RGB backdrop has been removed; no alpha hit-test or runtime compositing claim is made.','Photographs/SNS portrait content, scenes, deliberate background patterns and 9/3-slice UI surfaces may intentionally be opaque.','No design, asset or source changes were made. The audit covers only assets referenced by the first-read revision.']
icons=[];seen=set()
for u in data['uses']:
 if u['classification']!='standalone_icon_or_sprite':continue
 key=(u['assetRef'],tuple(u['effectiveRegionXYWH']))
 if key in seen:continue
 seen.add(key);icons.append(u)
font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',10);contact_paths=[]
for page in range(math.ceil(len(icons)/48)):
 selected=icons[page*48:(page+1)*48];w,h=140,155;sheet=Image.new('RGBA',(w*8,h*math.ceil(len(selected)/8)),(245,246,248,255));d=ImageDraw.Draw(sheet)
 for index,u in enumerate(selected):
  x=index%8*w;y=index//8*h
  for yy in range(y+3,y+112,8):
   for xx in range(x+3,x+137,8):d.rectangle((xx,yy,min(xx+7,x+136),min(yy+7,y+111)),fill=(189,199,213,255) if ((xx-x)//8+(yy-y)//8)%2 else (255,255,255,255))
  im=Image.open(assets[u['assetRef']]['path']).convert('RGBA');rx,ry,rw,rh=u['effectiveRegionXYWH'];im=im.crop((rx,ry,rx+rw,ry+rh));im.thumbnail((128,104));sheet.alpha_composite(im,(x+70-im.width//2,y+57-im.height//2));d=ImageDraw.Draw(sheet)
  for j,line in enumerate([f"#{u['useIndex']} a={u['regionAlpha']['alphaMin']}..{u['regionAlpha']['alphaMax']}"]+textwrap.wrap(u['elementName'],24)[:2]):d.text((x+4,y+116+j*12),line,fill=(20,30,50,255),font=font)
  d.rectangle((x,y,x+w-1,y+h-1),outline=(130,140,155,255))
 path=out/f'icon-alpha-audit-icons-{page+1:02}.png';sheet.convert('RGB').save(path);contact_paths.append(str(path))
data['iconContactSheets']={'paths':contact_paths,'uniqueAssetRegionCells':len(icons),'purpose':'Checkerboard visual review aid. Raw alpha statistics and original asset hashes remain the audit basis.','reviewedInAssistantImageView':False}
p.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'summary':data['summary'],'manualDecisions':manual_records,'contactSheets':contact_paths},ensure_ascii=False,indent=2))
