from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,hashlib,shutil,datetime,ast,xml.etree.ElementTree as ET
R=Path('/Users/max/projest_max/ui-studio');W=R/'_작업/codex/ux-studio/shop-ui';A=R/'samples/monopoly-go/ui-studio/assets/authoring/shop-ui/v001';P=R/'samples/monopoly-go/ui-studio/assets/production/shop-ui';S=R/'src/tools/uxStudio/assets/import-staging/shop-ui';M=R/'_작업/codex/ux-studio/shop-ui-assets.json';t=datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9)));B=R/('docs/planning/_backup/'+t.strftime('%Y%m%d')+'_단이/'+t.strftime('%H%M%S')+'_shop_ui_assets')
for p in [W,A,P,S,B]:p.mkdir(parents=True,exist_ok=True)
assert not M.exists()
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def info(p):return {'path':str(p.relative_to(R)),'bytes':p.stat().st_size,'sha256':sha(p)}
s=(R/'_작업/codex/ux-studio/warehouse-ui/generate-assets.py').read_text();node=next(n for n in ast.parse(s).body if isinstance(n,ast.ClassDef) and n.name=='Art');exec(ast.get_source_segment(s,node),globals())
def poly(a,pts,c):
 ImageDraw.Draw(a.im).polygon([(round(x*4),round(y*4)) for x,y in pts],fill=c);a.svg.append('<polygon points="'+' '.join(f'{x},{y}' for x,y in pts)+f'" fill="{c}"/>')
def nine(w,h,s,e):return {'mode':'9','sourceSize':[w,h],'slices':[s]*4,'edges':[e]*4,'padding':[0]*4,'order':'top right bottom left','repeat':'stretch','sourceCenter':[w-2*s,h-2*s],'minimumTargetForPositiveCenter':[2*e+1,2*e+1],'crop':'none'}
def three(w,h,s,e):return {'mode':'3','sourceSize':[w,h],'slices':[0,s,0,s],'edges':[0,e,0,e],'padding':[0]*4,'order':'top right bottom left','repeat':'stretch','sourceCenter':[w-2*s,h],'minimumTargetForPositiveCenter':[2*e+1,1],'crop':'none'}
def fixed(w,h,target):return {'mode':'fixed-image','sourceSize':[w,h],'objectFit':'contain','noSlice':True,'preserveAspectRatio':True,'recommendedTarget':target,'padding':[0]*4}
reuse=[];guard={}
def reuse_asset(manifest,role,uses,override=None):
 mp=R/'_작업/codex/ux-studio'/manifest;guard[str(mp.relative_to(R))]=sha(mp);d=json.loads(mp.read_text());a=next(a for a in d['assets'] if a['role']==role);p=R/a['files']['production']['path'];q=R/a['files']['importMirror']['path'];assert sha(p)==sha(q)==a['files']['production']['sha256']
 for f in a['files'].values():guard[f['path']]=sha(R/f['path'])
 rec={'name':a['name'],'role':role,'shopUses':uses,'sourceSize':a['size'],'assembly':a['assembly'],'shopAssemblyOverride':override,'files':a['files'],'importPath':a['importPath'],'copiedOrModified':False};reuse.append(rec);return a
storefill=reuse_asset('wins-ui-assets.json','parchment-cream-fill9',['cream store panel background'])
storeframe=reuse_asset('wins-ui-assets.json','gold-white-rim-frame9',['gold/white store panel frame'])
cardfill=reuse_asset('friends-ui-assets.json','panel-fill9',['three-column product card ivory fill'])
whiteframe=reuse_asset('menu-ui-assets.json','drawer-white-frame9',['white offer frame','white product card frame'],{'offer':nine(128,96,27,40),'productCard':nine(128,96,27,24),'reason':'Same white rim source; match new purple fill geometry with source27/logical40 corners for488x195 offer, preserve original24 edge for cards.'})
green=reuse_asset('friends-ui-assets.json','button-send3',['green price button normal'],{'threeSlice':three(128,48,24,16),'recommendedTarget':[128,44],'pressed':'No new raster; existing engine tint proposal#bdbdbd. Source pressed state unobserved.'})
assets=[];images={}
def save(role,art,assembly,observed,inferred):
 name='common_shop_'+role+'_normal_v001';im,svg=art.finish();paths=[A/(name+'.svg'),A/(name+'.png'),P/(name+'.webp'),S/(name+'.webp')];assert all(not p.exists() for p in paths);paths[0].write_text(svg);im.save(paths[1]);im.save(paths[2],format='WEBP',lossless=True,method=6,exact=True);shutil.copy2(paths[2],paths[3]);ET.parse(paths[0]);prod=Image.open(paths[2]).convert('RGBA');assert prod.tobytes()==Image.open(paths[1]).convert('RGBA').tobytes();assert paths[2].read_bytes()==paths[3].read_bytes();assert paths[2].stat().st_size<300000;al=prod.getchannel('A');w,h=prod.size
 a={'name':name,'role':role,'size':[w,h],'assembly':assembly,'observed':observed,'inferred':inferred,'files':dict(zip(['svgMaster','pngRasterMaster','production','importMirror'],map(info,paths))),'importPath':'/ui-studio/source/assets/import-staging/shop-ui/'+name+'.webp','encoding':{'format':'WEBP','lossless':True,'method':6,'exact':True,'decodedRGBAEqualsPNG':True},'alpha':{'range':list(al.getextrema()),'center':al.getpixel((w//2,h//2)),'corners':[al.getpixel(p) for p in [(0,0),(w-1,0),(0,h-1),(w-1,h-1)]],'bboxAlpha16':list(al.point(lambda v:255 if v>16 else 0).getbbox() or []),'bboxAlpha128':list(al.point(lambda v:255 if v>128 else 0).getbbox() or [])},'sourceContract':{'referencePixelsCopied':False,'bakedText':False,'bakedNumbers':False,'bakedProductsOrCharacters':False,'bakedNotifications':False,'externalCastShadow':False,'defaultRuntimeShadow':{'enabled':False},'sourceRect':[0,0,w,h]},'status':'제안(검수 대기); prepared only, not registered/UI-applied'};assets.append(a);images[role]=prod;return a
# Purple panel: no reward art, characters, values, frame or price baked.
a=Art(128,96);a.gradient('rect',(0,0,128,96),20,'#4a2778','#57384e');save('offer-purple-fill9',a,{'nineSlice':nine(128,96,27,40),'recommendedTarget':[488,195],'stack':'below reused white frame and separate inner native panel/text/product/character images'},'Source08 top offer uses a purple panel with a rounded white edge.','New simple purple gradient; source colored rays/character art are not embedded. Reuse existing white frame with same source27/edge40 contract.')
# Bonus ribbon: folded red/pink interior bands only, no text/count or sparkles.
a=Art(160,64);poly(a,[(8,4),(151,4),(160,24),(151,60),(8,60),(0,34)],'#b90041');poly(a,[(8,4),(151,4),(151,45),(8,60),(0,34)],'#f40950');poly(a,[(8,4),(151,4),(140,19),(7,43),(0,34)],'#e61a4d');save('bonus-red-ribbon3',a,{'threeSlice':three(160,64,24,16),'recommendedTarget':[132,48],'stack':'below native bonus label and separate dice artwork'},'Product cards show a red/pink folded bonus ribbon.','New simplified folded silhouette/bands; no exact original sparkle or product bonus policy inferred.')
# Horizontal gold trim/divider; straight whole texture can fill a native3 center.
a=Art(32,16);a.gradient('rect',(0,0,32,16),0,'#f3e3b3','#c9af66');save('gold-horizontal-divider3',a,{'threeSlice':three(32,16,0,0),'recommendedTarget':[551,20],'alternativeTarget':[92,2],'stack':'horizontal store shelf/heading trim; fully opaque center-only source'},'Source store has gold horizontal shelf/heading trim.','New internal gold gradient, no external shelf shadow; thin heading rules may use a native gold panel instead.')
# A single reusable peach wax candle with an orange/yellow flame.
a=Art(64,96);poly(a,[(32,1),(44,15),(46,24),(42,33),(34,39),(23,35),(18,26),(21,17),(29,9)],'#ff941f');poly(a,[(32,13),(39,24),(37,33),(30,35),(25,30),(26,23)],'#ffe470');a.rr((10,40,44,49),8,'#b87559');a.rr((13,40,38,43),6,'#e6ac86');a.ellipse((9,33,46,18),'#ffe8bc');a.rr((12,40,8,19),4,'#ffe8bc');a.rr((29,41,8,11),4,'#ffe8bc');a.rr((43,40,7,16),3,'#ffe8bc');a.line([(31,35),(32,41)],'#8d694a',2);save('header-candle-fixed',a,fixed(64,96,[32,48]),'Header decoration visibly includes peach wax candles and orange/yellow flames.','One simple reusable new candle, exact drips/flame shape and count are not original pixel claims; root positions duplicates.')
# A small dark purple bat silhouette, no text/emoji or invented character.
a=Art(96,56)
for flip in [False,True]:
 pts=[(44,18),(27,8),(10,12),(2,31),(15,27),(21,43),(31,36),(41,48)]
 poly(a,[(96-x if flip else x,y) for x,y in pts],'#31205b')
a.ellipse((39,17,18,30),'#31205b');a.ellipse((40,7,16,18),'#31205b');poly(a,[(40,10),(40,2),(47,9)],'#31205b');poly(a,[(49,9),(56,2),(56,11)],'#31205b');a.line([(7,27),(14,16),(27,12)],'#5c4089',1.5);a.line([(89,27),(82,16),(69,12)],'#5c4089',1.5);save('header-bat-fixed',a,fixed(96,56,[48,28]),'Header has small purple bat-wing silhouettes among candle/lavender decorations.','One simplified new bat silhouette. No exact original species, character or count inferred; clouds/wisps not newly invented.')
def sliced(im,size,c):
 sw,sh=im.size;w,h=size;t,r,b,l=c['slices'];et,er,eb,el=c['edges'];assert sw>l+r and sh>t+b and w>el+er and h>et+eb;xs=[0,l,sw-r,sw];ys=[0,t,sh-b,sh];dx=[0,el,w-er,w];dy=[0,et,h-eb,h];out=Image.new('RGBA',size)
 for iy in range(3):
  for ix in range(3):
   box=(xs[ix],ys[iy],xs[ix+1],ys[iy+1]);tw=dx[ix+1]-dx[ix];th=dy[iy+1]-dy[iy]
   if box[2]>box[0] and box[3]>box[1] and tw>0 and th>0:out.paste(im.crop(box).resize((tw,th),Image.Resampling.LANCZOS),(dx[ix],dy[iy]))
 return out
def existing(a):return Image.open(R/a['files']['production']['path']).convert('RGBA')
def fit(im,size):
 q=im.copy();q.thumbnail(size,Image.Resampling.LANCZOS);out=Image.new('RGBA',size);out.alpha_composite(q,((size[0]-q.width)//2,(size[1]-q.height)//2));return out
sheet=Image.new('RGB',(1440,1320),'#343e49');sd=ImageDraw.Draw(sheet);font=ImageFont.truetype('/System/Library/Fonts/Menlo.ttc',16);small=ImageFont.truetype('/System/Library/Fonts/Menlo.ttc',13)
def label(x,y,text,f=font):sd.text((x,y),text,fill='white',font=f)
def put(im,pos):sheet.paste(im,pos,im)
label(24,18,'Shop08 |5 new textures +5 reused sources | resources only, no native screen assembly claim')
label(24,47,'All text/amounts/prices/product dice/cash/packs/characters/input/shadows remain separate.',small)
offer=sliced(images['offer-purple-fill9'],(488,195),nine(128,96,27,40));offer.alpha_composite(sliced(existing(whiteframe),(488,195),nine(128,96,27,40)));put(offer,(24,90));label(24,301,'Offer488x195 / source128x96 slices27 edges40',small)
store=Image.new('RGBA',(551,606))
for a in [storefill,storeframe]:store.alpha_composite(sliced(existing(a),store.size,a['assembly']['nineSlice']))
for y in [64,328]:
 for x in [27,202,377]:
  card=Image.new('RGBA',(148,224));card.alpha_composite(sliced(existing(cardfill),card.size,cardfill['assembly']['nineSlice']));card.alpha_composite(sliced(existing(whiteframe),card.size,nine(128,96,27,24)));card.alpha_composite(sliced(images['bonus-red-ribbon3'],(132,48),three(160,64,24,16)),(8,126));card.alpha_composite(sliced(existing(green),(128,44),three(128,48,24,16)),(10,174));store.alpha_composite(card,(x,y))
store.alpha_composite(sliced(images['gold-horizontal-divider3'],(551,20),three(32,16,0,0)),(0,299));put(store,(24,354));label(24,977,'QA-only store551x606; six empty cards148x224',small)
y=105
for a in assets:
 role=a['role'];label(625,y,role,small);label(625,y+24,'source'+str(a['size']),small);put(fit(images[role],(128,96)),(1040,y-5));target=a['assembly']['recommendedTarget'];c=a['assembly'].get('nineSlice',a['assembly'].get('threeSlice'));out=sliced(images[role],target,c) if c else fit(images[role],target)
 if role in ['offer-purple-fill9','gold-horizontal-divider3']:out=fit(out,(220,90))
 put(out,(1190,y));y+=177
label(625,1020,'Store Wins paired native9: source128x96 slices27 edges27.',small)
label(625,1047,'Cards Friends fill +Menu white frame: slices27 edges24.',small)
label(625,1074,'Green Friends send3: caps24 edges16; proposed runtime pressed tint, no new raster.',small)
label(625,1101,'All padding0. Source/target centers positive. Frames/character art stay separate.',small)
label(24,1160,'SVG+PNG preserved | lossless WebP RGBA=PNG | production/staging SHA equal | no cast shadow baked',small)
contact=W/'shop-ui-v001-contact-sheet.png';sheet.save(contact)
for a in assets:
 assert '<text' not in (R/a['files']['svgMaster']['path']).read_text()
 if a['role']=='gold-horizontal-divider3':assert a['alpha']['range']==[255,255]
 else:assert all(v==0 for v in a['alpha']['corners'])
assert all(sha(R/p)==v for p,v in guard.items());checks={'newAssetCount':5,'reusedSourceCount':5,'allSVGParse':True,'PNGWebPRGBAEqual':True,'productionStagingSHAEqual':True,'allNewBelow300000Bytes':True,'totalNewWebPBytes':sum(a['files']['production']['bytes'] for a in assets),'maximumNewWebPBytes':max(a['files']['production']['bytes'] for a in assets),'allSourceAndTargetSliceCentersPositive':True,'existingProtectedFileCount':len(guard),'existingFilesAndManifestsSHAUnchanged':True,'contactSheet':info(contact),'visualQA':'pending decoded-production contact inspection','UIApplied':False,'productBrowserQA':False};manifest={'version':1,'assetVersion':'v001','createdAtKST':t.isoformat(timespec='seconds'),'author':'codex(단이)','status':'제안(검수 대기)','reference':{'path':'docs/reference/monopoly-go/20261116-ten-screens/08_shop.png','size':[818,1449],'sha256':sha(R/'docs/reference/monopoly-go/20261116-ten-screens/08_shop.png'),'actuallyViewed':True,'pixelsCopied':False},'readSources':['docs/plans/20261116-ten-screen-assembly.md:115-121','_작업/codex/ux-studio/wins-ui-assets.json','_작업/codex/ux-studio/menu-ui-assets.json','_작업/codex/ux-studio/warehouse-ui-assets.json','_작업/codex/ux-studio/friends-ui-assets.json','_작업/codex/ux-studio/main-ui-assets.json'],'reuse':reuse,'assets':assets,'creation':{'method':'New code-native SVG geometry with Pillow4x supersampling/LANCZOS PNG masters; no imagegen','sourceRendererEquivalence':'SVG parses; independent SVG browser pixel equivalence untested','sourcePreservation':'SVG+PNG retained; no screenshot pixels copied'},'assemblyRules':['Native9/3 order top-right-bottom-left, repeat stretch, padding0; source/target centers must stay positive.','Offer uses new128x96 purple fill with slices27/edges40 and reused Menu white frame at identical rect/edges40;488x195 example.','Store uses paired Wins cream clipboard-fill9/gold-white-rim-frame9 source128x96/slices27/edges27; example551x606.','Cards use Friends ivory panel-fill9 +Menu white frame source128x96/slices27/edges24;148x224 example repeated3columns/2rows.','Green price uses existing Friends send3 source128x48/caps24/edges16, target128x44. Native labels/prices stay separate. No pressed raster created; existing engine tint is a proposal, source press state unknown.','Red bonus ribbon160x64/caps24/edges16, target132x48. Product dice/amounts and labels are separate.','Gold divider32x16/source3all0 can fill straight horizontal trim; thin heading line may use a native gold panel.','Candle64x96/32x48 and bat96x56/48x28 are separate fixed decorations, no exact original quantity/shape claim.','QA reference composites and resource preparation do not constitute editor registration, screen assembly, gameplay purchase/price policy, source pixel equality or approval.'],'checks':checks,'backup':{'path':str(B.relative_to(R)),'newFilesOnly':True,'existingSHAInventory':'existing-readonly-sha256.json'},'usagePolicy':{'startWeeklyUsedPercent':89,'midWeeklyUsedPercent':89,'stopAtWeeklyPercent':90,'endRead':'pending'},'registration':None,'UIApplied':False,'visualApproval':False,'limitations':['No actual native editor/browser/UI/source/designJSON/report/STATUS/intake/server/build/7007/package/protected-file/secret action.','Source08 values/prices/bonuses/characters and exact font/state/game policies are not baked or established.','Simple geometric interpretation of observed purple/red/gold/cream surfaces and candle/bat motifs.']};M.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n');(W/'shop-ui-v001-qa.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2)+'\n');(B/'existing-readonly-sha256.json').write_text(json.dumps(guard,ensure_ascii=False,indent=2)+'\n');print(json.dumps(checks,ensure_ascii=False,indent=2));print('NEW',[(a['role'],a['files']['production']['bytes']) for a in assets])
