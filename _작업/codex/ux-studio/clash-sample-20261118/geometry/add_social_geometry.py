from pathlib import Path
from PIL import Image,ImageDraw
import runpy,json,hashlib,shutil,datetime,xml.etree.ElementTree as ET
WORK=Path('/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/clash-sample-20261118/geometry')
b=runpy.run_path(str(WORK/'build_geometry.py'))
NAMES=['panel-white9-v001','glyph-camera-v001','glyph-sort-v001','glyph-filter-v001']
new=[next(a for a in b['ASSETS']if a['name']==name)for name in NAMES]
AUTHOR,STAGE=b['AUTHOR'],b['STAGE'];sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
m=json.loads((WORK/'geometry-manifest.json').read_text());assert len(m['assets'])==25
assert not any(r['name']in NAMES for r in m['assets'])
(WORK/'geometry-manifest.before-social.json').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
before={r['name']:{ext:sha(r[ext])for ext in ['svg','png','webp']}for r in m['assets']}
records=[]
ref='/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/clash-sample-20261118/video-b/representatives/B-F04-social.jpg'
for a in new:
 name=a['name'];assert a['padding']==[0,0,0,0]
 assert all(n.tag.split('}')[-1]not in ['text','image','filter','foreignObject','script']for n in ET.fromstring(a['svg']).iter())
 (AUTHOR/f'{name}.svg').write_text(a['svg']);im=b['render_svg'](a['svg']).convert('RGBA')
 assert im.size==(a['w'],a['h'])and im.getchannel('A').getextrema()==(0,255)
 im.save(AUTHOR/f'{name}.png',optimize=True);im.save(AUTHOR/f'{name}.webp',lossless=True,exact=True,method=6)
 assert im.tobytes()==Image.open(AUTHOR/f'{name}.webp').convert('RGBA').tobytes()
 shutil.copy2(AUTHOR/f'{name}.webp',STAGE/f'{name}.webp')
 r={k:v for k,v in a.items()if k!='svg'}
 r.update({'status':'제안(검수 대기) · native 미등록','nativePath':'/ui-studio/source/assets/import-staging/clash-royale-geometry/'+name+'.webp','svg':str(AUTHOR/f'{name}.svg'),'png':str(AUTHOR/f'{name}.png'),'webp':str(AUTHOR/f'{name}.webp'),'staging':str(STAGE/f'{name}.webp'),'sha256':{ext:sha(AUTHOR/f'{name}.{ext}')for ext in ['svg','png','webp']},'webpBytes':(AUTHOR/f'{name}.webp').stat().st_size,'pngBytes':(AUTHOR/f'{name}.png').stat().st_size,'alphaRange':[0,255],'alphaBBox':im.getchannel('A').getbbox(),'textBaked':False,'externalShadowBaked':False,'source':'new code-native SVG; source visual silhouette reference only; no screenshot crops, pixel copies, image_gen or prior sample asset copies','referenceImageViewed':ref,'nativeLabelInputShadow':'separate native elements; no runtime behavior in asset'})
 assert r['webpBytes']<=300000 and sha(r['webp'])==sha(r['staging'])
 if name=='panel-white9-v001':
  assert(a['w'],a['h'])==(128,128)and a['slices']==[12]*4 and a['edges']==[8]*4
  assert im.getpixel((64,64))==(239,247,250,255)
  for color in ['#eff7fa','#b4cbd6','#ffffff']:assert color in a['svg']
 records.append(r)
m['assets']+=records;m['phase']='all+lock+social';m['generatedAt']=datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).isoformat(timespec='seconds')
m['sourceScreenshotReads']=1;m['sourceScreenshotPixelReuse']=0;m['referenceImagesViewed']=[ref]
for p in[WORK/'geometry-manifest.json',AUTHOR/'geometry-manifest.json']:p.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
for old in m['assets'][:-4]:assert{ext:sha(old[ext])for ext in['svg','png','webp']}==before[old['name']]
sheet=Image.new('RGB',(640,180),'#243b4d');draw=ImageDraw.Draw(sheet)
for i,r in enumerate(records):
 x=i*160
 for yy in range(8,144,12):
  for xx in range(x+8,x+152,12):draw.rectangle((xx,yy,xx+11,yy+11),fill='#385a70'if(xx//12+yy//12)%2 else'#2c4c61')
 im=Image.open(r['png']).convert('RGBA');sheet.paste(im,(x+(160-im.width)//2,8+(128-im.height)//2),im)
 draw.text((x+8,149),r['name'].replace('-v001',''),fill='white')
 draw.text((x+8,164),str((r['w'],r['h']))+' '+str(r['webpBytes'])+'B',fill='#c4e4f2')
sheet.save(WORK/'social-geometry-contact-sheet.png')
(WORK/'social-geometry-validation.json').write_text(json.dumps({'newAssets':records,'prior25SourceHashesUnchanged':True,'nativeRegistrations':0,'browserActions':0,'referenceImageViewed':ref,'sourcePixelReuse':0},ensure_ascii=False,indent=2)+'\n')
with(WORK/'geometry-handoff.md').open('a')as f:
 f.write('\n## Social additions\n\nSource B-F04-social visually observed. Four new code-native vectors, no source pixel reuse.\n\n')
 for r in records:f.write(r['name']+' '+str((r['w'],r['h']))+' slice='+str(r['slices'])+' edge='+str(r['edges'])+' padding0; '+r['nativePath']+'\n\n')
print(json.dumps({'assetsNow':len(m['assets']),'new':[{'name':r['name'],'bytes':r['webpBytes'],'nativePath':r['nativePath'],'slice':r['slices'],'edge':r['edges']}for r in records],'prior25Unchanged':True},ensure_ascii=False))
