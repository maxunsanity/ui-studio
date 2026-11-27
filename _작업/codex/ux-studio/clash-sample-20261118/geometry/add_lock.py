from pathlib import Path
from PIL import Image
import runpy,json,hashlib,shutil,datetime,xml.etree.ElementTree as ET
WORK=Path('/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/clash-sample-20261118/geometry')
b=runpy.run_path(str(WORK/'build_geometry.py'))
a=next(a for a in b['ASSETS']if a['name']=='glyph-lock-v001')
AUTHOR,STAGE=b['AUTHOR'],b['STAGE']
m=json.loads((WORK/'geometry-manifest.json').read_text())
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
before={r['name']:{ext:sha(r[ext])for ext in ['svg','png','webp']}for r in m['assets']}
assert len(before)==24 and not any(r['name']==a['name']for r in m['assets'])
(WORK/'geometry-manifest.before-lock.json').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
name=a['name'];(AUTHOR/f'{name}.svg').write_text(a['svg'])
im=b['render_svg'](a['svg']).convert('RGBA');assert im.size==(64,64)and im.getchannel('A').getextrema()==(0,255)
im.save(AUTHOR/f'{name}.png',optimize=True);im.save(AUTHOR/f'{name}.webp',lossless=True,exact=True,method=6)
assert im.tobytes()==Image.open(AUTHOR/f'{name}.webp').convert('RGBA').tobytes()
shutil.copy2(AUTHOR/f'{name}.webp',STAGE/f'{name}.webp')
r={k:v for k,v in a.items()if k!='svg'}
r.update({'status':'제안(검수 대기) · native 미등록','nativePath':'/ui-studio/source/assets/import-staging/clash-royale-geometry/'+name+'.webp','svg':str(AUTHOR/f'{name}.svg'),'png':str(AUTHOR/f'{name}.png'),'webp':str(AUTHOR/f'{name}.webp'),'staging':str(STAGE/f'{name}.webp'),'sha256':{ext:sha(AUTHOR/f'{name}.{ext}')for ext in ['svg','png','webp']},'webpBytes':(AUTHOR/f'{name}.webp').stat().st_size,'pngBytes':(AUTHOR/f'{name}.png').stat().st_size,'alphaRange':[0,255],'alphaBBox':im.getchannel('A').getbbox(),'textBaked':False,'externalShadowBaked':False,'source':'new code-native SVG; no screenshot crops, image_gen or existing sample asset copies','nativeLabelInputShadow':'separate native elements; no runtime behavior in asset'})
assert r['webpBytes']<=300000 and sha(r['webp'])==sha(r['staging'])
assert all(n.tag.split('}')[-1]not in ['text','image','filter','foreignObject']for n in ET.fromstring(a['svg']).iter())
m['assets'].append(r);m['generatedAt']=datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).isoformat(timespec='seconds');m['phase']='all+lock'
for p in [WORK/'geometry-manifest.json',AUTHOR/'geometry-manifest.json']:p.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
for r0 in m['assets'][:-1]:assert {ext:sha(r0[ext])for ext in ['svg','png','webp']}==before[r0['name']]
with(WORK/'geometry-handoff.md').open('a')as f:f.write('\n## Lock追加\n\n`glyph-lock-v001.webp` 64×64, transparent exterior, black shackle + yellow metal body + geometric keyhole. slice/edgeなし, padding[0,0,0,0]. Native: '+r['nativePath']+'\n\nExisting24 SVG/PNG/WebP SHA unchanged; native registration0.\n')
(WORK/'glyph-lock-v001-validation.json').write_text(json.dumps({'asset':r,'existing24SourceHashesUnchanged':True,'nativeRegistrations':0},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'name':name,'nativePath':r['nativePath'],'size':[64,64],'bytes':r['webpBytes'],'sha256':r['sha256']['webp'],'prior24Unchanged':True,'assetsNow':len(m['assets'])},ensure_ascii=False))
