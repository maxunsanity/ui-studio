from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
from datetime import datetime
from zoneinfo import ZoneInfo
from collections import Counter,defaultdict
from hashlib import sha256
import json,re,io,math
ROOT=Path('/Users/max/projest_max/ui-studio')
DESIGN=ROOT/'samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json'
ASSETS=ROOT/'samples/monopoly-go/ui-studio/assets'
OUT=ROOT/'_작업/codex/ux-studio'
now=lambda:datetime.now(ZoneInfo('Asia/Seoul')).isoformat()
started=now();raw=DESIGN.read_bytes();doc=json.loads(raw);first_hash=sha256(raw).hexdigest();uses=[];unregistered=[]
ref_re=re.compile(r'^sha256-([a-f0-9]{64})\.(png|jpg|webp)$')
def add(image,screen,element,path,role):
 if not isinstance(image,dict):return
 if image.get('assetRef'):
  uses.append({'screenId':screen['id'],'screenName':screen['name'],'elementId':element.get('id') if element else None,'elementName':element.get('name') if element else screen['name'],'elementKind':element.get('kind') if element else screen['kind'],'partRole':element.get('partRole') if element else None,'parentId':element.get('parentId') if element else None,'sourcePath':path,'sourceRole':role,'assetRef':image['assetRef'],'sourceSize':image.get('sourceSize') or ([image['w'],image['h']] if 'w' in image and 'h' in image else None),'region':image.get('region'),'fit':image.get('fit'),'topArchHeight':image.get('topArchHeight'),'alt':image.get('alt')})
 elif image.get('src') or image.get('asset'):
  unregistered.append({'screenId':screen['id'],'elementId':element.get('id') if element else None,'sourcePath':path,'kind':'built-in' if image.get('asset') else 'embedded-data'})
for screen in doc['screens']:
 for state,image in (screen.get('skin',{}).get('textures',{}) or {}).items():add(image,screen,None,'screen.skin.textures.'+state,'nine_slice_surface')
 for e in screen['elements']:
  add(e.get('image'),screen,e,'image','element_image')
  for state,image in (e.get('skin',{}).get('textures',{}) or {}).items():add(image,screen,e,'skin.textures.'+state,'nine_slice_surface')
  for state,image in (e.get('buttonState',{}).get('images',{}) or {}).items():add(image,screen,e,'buttonState.images.'+state,'button_state_image')
  for state,image in (e.get('control',{}).get('tabSkin',{}).get('textures',{}) or {}).items():add(image,screen,e,'control.tabSkin.textures.'+state,'tab_surface')
def stats(image):
 rgba=image.convert('RGBA');a=rgba.getchannel('A');hist=a.histogram();w,h=rgba.size;b=a.getbbox();corners={'topLeft':a.getpixel((0,0)),'topRight':a.getpixel((w-1,0)),'bottomLeft':a.getpixel((0,h-1)),'bottomRight':a.getpixel((w-1,h-1))};patch=min(5,w,h)
 boxes={'topLeft':(0,0,patch,patch),'topRight':(w-patch,0,w,patch),'bottomLeft':(0,h-patch,patch,h),'bottomRight':(w-patch,h-patch,w,h)}
 return {'size':[w,h],'alphaMin':a.getextrema()[0],'alphaMax':a.getextrema()[1],'transparentPixelCount':hist[0],'partialPixelCount':sum(hist[1:255]),'opaquePixelCount':hist[255],'nonzeroPixelCount':w*h-hist[0],'tightNonzeroBBoxLTRB':list(b) if b else None,'tightNonzeroBBoxXYWH':[b[0],b[1],b[2]-b[0],b[3]-b[1]] if b else None,'cornerAlpha':corners,'cornerPatchSize':patch,'cornerPatchAlphaRange':{k:list(a.crop(v).getextrema()) for k,v in boxes.items()}}
def classify(u):
 name=(u['elementName']+' '+(u.get('alt') or '')).lower()
 if u['sourceRole'] in ['nine_slice_surface','tab_surface']:return 'intentional_ui_surface',u['sourceRole'],'high'
 if re.search(r'sns|avatar|portrait|profile.?photo|user.?photo|친구.?사진|초상',name):return 'intentional_photo_or_sns','photo/avatar/SNS semantic name','high'
 if re.search(r'backdrop|board.?background|board.?bg|city.?background|img_scene|scene_|landscape|도시.?배경|배경.?도시',name):return 'intentional_scene_or_background','scene/backdrop semantic name','high'
 if u['partRole']=='background' or re.search(r'(^|_)(bg|background|fill)(_|$)',name):return 'intentional_ui_background','background role/name','medium'
 if re.search(r'icon|landmark|sticker|shield|hat|dice|cash|money|bank|gift|set\d|set_|ribbon|decoration|ornament|badge|crown|flag|goal|race|close|token|marker|tree|star|arrow|check|알림|아이콘|방패|주사위|리본|장식|건물',name):return 'standalone_icon_or_sprite','icon/decorative semantic name','medium'
 return 'needs_semantic_review','no decisive semantic name','low'
assets={};issues=[]
for ref in dict.fromkeys(u['assetRef'] for u in uses):
 match=ref_re.fullmatch(ref)
 if not match:assets[ref]={'assetRef':ref,'status':'invalid_asset_ref'};issues.append({'assetRef':ref,'type':'invalid_asset_ref'});continue
 path=ASSETS/ref
 if path.is_symlink() or not path.is_file():assets[ref]={'assetRef':ref,'path':str(path),'status':'missing_or_symlink'};issues.append({'assetRef':ref,'type':'missing_or_symlink'});continue
 try:
  data=path.read_bytes();im=Image.open(io.BytesIO(data));im.load();st=stats(im)
  assets[ref]={'assetRef':ref,'path':str(path),'fileSHA256':sha256(data).hexdigest(),'fileNameSHAMatches':sha256(data).hexdigest()==match.group(1),'fileBytes':len(data),'format':im.format,'originalMode':im.mode,'status':'readable','sourceAlpha':st}
 except Exception as e:assets[ref]={'assetRef':ref,'path':str(path),'status':'read_error','error':str(e)};issues.append({'assetRef':ref,'type':'read_error','error':str(e)})
flags=[];crop_cache={}
for index,u in enumerate(uses):
 u['useIndex']=index;category,why,confidence=classify(u);u.update({'classification':category,'classificationBasis':why,'classificationConfidence':confidence});asset=assets[u['assetRef']]
 if asset['status']!='readable':u['status']='asset_error';continue
 actual=asset['sourceAlpha']['size'];u['sourceSizeMatchesFile']=u['sourceSize'] is None or u['sourceSize']==actual
 if not u['sourceSizeMatchesFile']:issues.append({'useIndex':index,'assetRef':u['assetRef'],'type':'source_size_mismatch','declared':u['sourceSize'],'actual':actual})
 region=u['region'] or [0,0,*actual];u['effectiveRegionXYWH']=region
 if len(region)!=4 or not all(isinstance(v,int) for v in region) or region[0]<0 or region[1]<0 or min(region[2:])<=0 or region[0]+region[2]>actual[0] or region[1]+region[3]>actual[1]:u['status']='invalid_region';issues.append({'useIndex':index,'assetRef':u['assetRef'],'type':'invalid_region','region':region});continue
 key=(u['assetRef'],tuple(region))
 if key not in crop_cache:
  im=Image.open(asset['path']);x,y,w,h=region;crop_cache[key]=stats(im.crop((x,y,x+w,y+h)))
 alpha=crop_cache[key];u['regionAlpha']=alpha
 all_corners_opaque=all(v==255 for v in alpha['cornerAlpha'].values())
 if category=='standalone_icon_or_sprite' and alpha['alphaMin']==255:
  u['status']='suspect_opaque_icon';flags.append({'useIndex':index,'screenName':u['screenName'],'elementName':u['elementName'],'assetRef':u['assetRef'],'reason':'standalone icon/sprite region has no transparent pixels','severity':'review'})
 elif category=='standalone_icon_or_sprite' and all_corners_opaque:
  u['status']='suspect_opaque_icon_corners';flags.append({'useIndex':index,'screenName':u['screenName'],'elementName':u['elementName'],'assetRef':u['assetRef'],'reason':'all four source-region corners are fully opaque despite other transparency','severity':'review'})
 elif category=='needs_semantic_review':u['status']='semantic_review_needed'
 elif category.startswith('intentional_'):u['status']='intentional_surface_or_photo_opaque_allowed' if alpha['alphaMin']==255 else 'intentional_surface_or_photo_with_alpha'
 else:u['status']='icon_has_transparency'
final_raw=DESIGN.read_bytes();final_doc=json.loads(final_raw);final_hash=sha256(final_raw).hexdigest()
audit={'format':'ui-studio-icon-alpha-audit','version':1,'author':'codex','startedAtKST':started,'completedAtKST':now(),'scope':{'designPath':str(DESIGN),'assetDirectory':str(ASSETS),'firstReadRevision':doc.get('revision'),'firstReadSHA256':first_hash,'firstReadBytes':len(raw),'projectId':doc['projectId'],'screenCount':len(doc['screens']),'elementCount':sum(len(s['elements']) for s in doc['screens']),'lastObservedRevision':final_doc.get('revision'),'lastObservedSHA256':final_hash,'designChangedDuringAudit':final_hash!=first_hash,'basis':'All asset references and classification names are frozen from the first-read design bytes; end reread is only a change check.'},'method':{'library':'Pillow','alphaMode':'RGBA conversion; source RGB images therefore measure alpha 255','regionCoordinates':'source pixel XYWH; absent region means the full actual image','tightBBox':'nonzero alpha (>0), not visible-ink or crop policy','classification':'semantic names/roles plus manual image review where needed; opaque UI surfaces/scenes/photos are not icon failures','flags':'only standalone icon/sprite regions with alphaMin=255 or all four corners alpha=255','excluded':'appearance data, generated CSS/shape backgrounds, source-byte edits, masks, browser/runtime compositing, unreferenced assets, other projects','viewNote':'Image topArchHeight and nine-slice/runtime compositing can clip displayed edges; raw registered source/region alpha is reported separately and is not an alpha hit-test claim.'},'summary':{'uniqueRegisteredAssets':len(assets),'registeredImageUses':len(uses),'unregisteredImageUsesExcluded':len(unregistered),'classifications':dict(Counter(u['classification'] for u in uses)),'statuses':dict(Counter(u.get('status') for u in uses)),'opaqueIconSuspectUses':len(flags),'opaqueIconSuspectUniqueAssets':len(set(f['assetRef'] for f in flags)),'assetOrRegionIssueCount':len(issues)},'flags':flags,'issues':issues,'assets':list(assets.values()),'uses':uses,'unregisteredUsesExcluded':unregistered}
OUT.mkdir(parents=True,exist_ok=True);(OUT/'icon-alpha-audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'scope':audit['scope'],'summary':audit['summary'],'flags':flags,'reviewNeeded':[{'i':u['useIndex'],'screen':u['screenName'],'name':u['elementName'],'alpha':[u.get('regionAlpha',{}).get('alphaMin'),u.get('regionAlpha',{}).get('alphaMax')],'region':u['region']} for u in uses if u['classification']=='needs_semantic_review']},ensure_ascii=False,indent=2))
