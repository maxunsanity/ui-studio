from pathlib import Path
# Reuse the existing geometric authoring primitives only, without rerunning the 13 original assets.
base=Path('/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/friends-ui/generate-assets.py')
exec(base.read_text().split('# Separate reusable native nine-slice')[0])
BACKUP=ROOT/('docs/planning/_backup/20261116_단이/'+STAMP.strftime('%H%M%S')+'_friends_footer_star');BACKUP.mkdir(parents=True)
old=json.loads(MANIFEST.read_text());oldRecords=json.dumps(old['assets'],ensure_ascii=False,sort_keys=True)
oldhash={f['path']:f['sha256'] for a in old['assets'] for f in a['files'].values()}
preserve(MANIFEST);preserve(WORK/'friends-ui-v001-qa.json')
for role in ['pictogram-sticker-star','footer-fill3']:
 assert not (AUTHOR/('common_friends_'+role+'_normal_v001.svg')).exists()
# Separate small ornament star with no text, number, or outer shadow.
def star(cx,cy,outer,inner):
 return [(cx+math.sin(math.pi*i/5)*(outer if i%2==0 else inner),cy-math.cos(math.pi*i/5)*(outer if i%2==0 else inner)) for i in range(10)]
a=Art(64,64);a.poly(star(32,32,29,13.5),'#a77c21');a.poly(star(32,32,24.5,11.5),'#f4d24f');a.poly([(32,10),(35,29),(49,26),(36,35),(32,48),(30,31),(18,27),(29,27)],'#ffe67b')
save('pictogram-sticker-star',a,{'mode':'fixed-image','sourceSize':[64,64],'objectFit':'contain','noSlice':True,'stack':'separate small gold ornament above request sticker; no text replacement','targetLogicalExample':[21,21]})
# Full opaque rectangle. This native3 source supplies the top gold rule as part of the backplate.
a=Art(128,48);a.poly([(0,0),(128,0),(128,48),(0,48)],'#f4f1df');a.poly([(0,0),(128,0),(128,3),(0,3)],'#c3a13c');a.poly([(0,3),(128,3),(128,4),(0,4)],'#eadba3')
save('footer-fill3',a,{'threeSlice':three(128,48,16,16),'targetLogicalExample':[551,67],'stack':'opaque ivory footer backplate plus top gold rule; native Close icon above','sourceTopRulePx':{'gold':3,'highlight':1},'targetRulePolicy':'native3 stretches source height 48 to target height; rule thickness scales with target height','center':'opaque'})
# Supplement preview, separate from the original 13-asset contact sheet.
sheet=Image.new('RGBA',(680,235),'#343943');d=ImageDraw.Draw(sheet);font=ImageFont.truetype('/System/Library/Fonts/Menlo.ttc',14)
d.text((20,15),'Friends supplement: star + native3 footer',fill='white',font=font);sheet.alpha_composite(images['pictogram-sticker-star'],(20,60));sheet.alpha_composite(images['pictogram-sticker-star'].resize((21,21),Image.Resampling.LANCZOS),(105,80));d.text((20,133),'fixed 64x64 / logical example 21x21',fill='white',font=font)
im=images['footer-fill3'];out=Image.new('RGBA',(551,67));out.paste(im.crop((0,0,16,48)).resize((16,67)),(0,0));out.paste(im.crop((16,0,112,48)).resize((519,67)),(16,0));out.paste(im.crop((112,0,128,48)).resize((16,67)),(535,0));sheet.alpha_composite(out,(20,165));sp=WORK/'friends-ui-v001-footer-star-preview.png';sheet.convert('RGB').save(sp)
for p,h in oldhash.items():assert sha(ROOT/p)==h,p
assert oldRecords==json.dumps(old['assets'],ensure_ascii=False,sort_keys=True)
for a in assets:
 ET.parse(ROOT/a['files']['svgMaster']['path']);assert '<text' not in (ROOT/a['files']['svgMaster']['path']).read_text()
assert assets[1]['alpha']['center']==255
old['assets'].extend(assets);old['checks']['assetCount']=len(old['assets']);old['checks']['supplementContactSheet']=info(sp);old['checks']['original13FilesSHAUnchanged']=True
old.setdefault('supplements',[]).append({'atKST':STAMP.isoformat(timespec='seconds'),'purpose':'two requested geometric assets only: gold sticker star + footer native3','assetNames':[a['name'] for a in assets],'backupBeforeAppend':str(BACKUP.relative_to(ROOT)),'original13AssetRecordsAnd52FilesUnchanged':True,'preview':info(sp),'registration':None,'UIApplied':False})
MANIFEST.write_text(json.dumps(old,ensure_ascii=False,indent=2)+'\n');(WORK/'friends-ui-v001-qa.json').write_text(json.dumps(old['checks'],ensure_ascii=False,indent=2)+'\n')
qa={'addedAssetCount':2,'overallAssetCount':len(old['assets']),'original13RecordsUnchanged':True,'original52FilesSHAUnchanged':True,'svgParse':True,'PNGRGBAEqualsDecodedWebP':True,'productionMirrorSHAEqual':True,'footerCenterAlpha255':True,'maximumNewWebPBytes':max(a['files']['production']['bytes'] for a in assets),'productBrowserQA':False,'newAssets':assets}
(WORK/'friends-ui-footer-star-qa.json').write_text(json.dumps(qa,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'backup':str(BACKUP.relative_to(ROOT)),'original13FilesSHAUnchanged':True,'newAssets':[{'name':a['name'],'importPath':a['importPath'],'assembly':a['assembly'],'bytes':a['files']['production']['bytes']} for a in assets]},ensure_ascii=False,indent=2))
