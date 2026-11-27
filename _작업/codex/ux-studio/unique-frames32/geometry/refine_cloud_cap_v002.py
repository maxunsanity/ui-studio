from pathlib import Path
import runpy,json,hashlib,shutil
from PIL import Image
P=Path('/Users/max/projest_max/ui-studio');W=Path(__file__).parent
A=P/'samples/monopoly-go/ui-studio/assets/authoring/unique-frames32/geometry'
D=P/'samples/monopoly-go/ui-studio/assets/production/unique-frames32/geometry'
S=P/'src/tools/uxStudio/assets/import-staging/unique-frames32/geometry'
render=runpy.run_path(str(W/'pillow_svg.py'))['render_svg']
rows=json.loads((A/'manifest.json').read_text());before=[dict(r) for r in rows];name='bean-cloud-cap-v002'
assert len(rows)==25 and name not in {r['name'] for r in rows}
for r in rows:assert hashlib.sha256((D/(r['name']+'.webp')).read_bytes()).hexdigest()==r['sha']
svg=(A/'bean-cloud-cap.svg').read_text();assert svg.count('fill="#81dff2"')==1
# The final 2% is the exact body color, preserving that color through downsampling.
defs='<defs><linearGradient id="bodyTransition" x2="0" y2="1"><stop stop-color="#81dff2"/><stop offset=".98" stop-color="#00bddc"/><stop offset="1" stop-color="#00bddc"/></linearGradient></defs>'
svg=svg.replace('><path','>'+defs+'<path',1).replace('fill="#81dff2"','fill="url(#bodyTransition)"')
for base,ext in [(A,'svg'),(A,'png'),(D,'webp'),(S,'webp')]:assert not (base/(name+'.'+ext)).exists()
im=render(svg);old=Image.open(A/'bean-cloud-cap.png').convert('RGBA')
assert im.size==(551,330) and im.getchannel('A').tobytes()==old.getchannel('A').tobytes()
assert {im.getpixel((x,329)) for x in range(551)}=={(0,189,220,255)}
(A/(name+'.svg')).write_text(svg);im.save(A/(name+'.png'));im.save(D/(name+'.webp'),'WEBP',lossless=True,exact=True,method=6);shutil.copy2(D/(name+'.webp'),S/(name+'.webp'))
b=(D/(name+'.webp')).read_bytes();assert len(b)<=300000
wp=Image.open(D/(name+'.webp')).convert('RGBA');assert wp.tobytes()==im.tobytes()
row={'name':name,'path':'/ui-studio/source/assets/import-staging/unique-frames32/geometry/'+name+'.webp','sha':hashlib.sha256(b).hexdigest(),'sourceSize':[551,330],'bytes':len(b),'slices':None,'edges':None}
rows.append(row);assert rows[:25]==before
(W/'manifest.before-cloud-refinement.json').write_text(json.dumps(before,ensure_ascii=False,indent=2))
(A/'manifest.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
validation={'newAsset':row,'original25Unchanged':True,'silhouetteAlphaUnchanged':True,'all551BottomPixelsExactlyBodyRGBA':[0,189,220,255],'pngWebpRGBAEqual':True,'stagingBytesEqual':b==(S/(name+'.webp')).read_bytes(),'bodyUnmodified':True,'sourceSizeUnchanged':True,'oldVersionPreserved':True,'failures':0,'gradient':'#81dff2 -> #00bddc at98%, then exact color through100% for resampling-safe seamless join. No rect/ratio/silhouette/cloud changes.'}
(W/'cloud-cap-v002-validation.json').write_text(json.dumps(validation,ensure_ascii=False,indent=2)+'\n');print(json.dumps(validation))
