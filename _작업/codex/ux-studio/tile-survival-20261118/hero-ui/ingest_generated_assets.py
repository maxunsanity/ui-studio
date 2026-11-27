import sys,json,shutil,pathlib,hashlib
from PIL import Image
D=pathlib.Path(__file__).parent;B=pathlib.Path('/Users/max/projest_max/ui-studio');A=B/'samples/tile-survival/ui-studio/assets/authoring/heroes';S=B/'src/tools/uxStudio/assets/import-staging/tile-survival-heroes';G=pathlib.Path('/Users/max/.codex/generated_images/01a1ecdd-aacb-7540-80bb-91552ea1785d')
spec=json.loads(sys.argv[1]);input_manifest=D/sys.argv[2];out_manifest=D/sys.argv[3]
m=json.loads(input_manifest.read_text())
for q in spec:
 src=G/q['source'];dst=A/q['name']
 if dst.exists():raise SystemExit('refuse overwrite '+str(dst))
 shutil.copy2(src,dst)
 im=Image.open(src).convert('RGBA');a=im.getchannel('A');h=a.histogram()
 o=dict(name=q['name'],source=str(src),production=str(dst),width=im.width,height=im.height,mode=im.mode,alphaExtrema=a.getextrema(),zeroAlphaCount=h[0],zeroAlphaFraction=h[0]/(im.width*im.height),alphaThreshold1BBox=a.getbbox(),sha256=hashlib.sha256(src.read_bytes()).hexdigest(),prompt=q['prompt'],generation='built-in image_gen',runtime='2D still',nativeRegistered=False)
 im.thumbnail((512,768),Image.Resampling.LANCZOS);w=A/pathlib.Path(q['name']).with_suffix('.webp').name
 if w.exists():raise SystemExit('refuse overwrite '+str(w))
 im.save(w,'WEBP',quality=90,method=6,exact=True);shutil.copy2(w,S/w.name)
 aa=Image.open(w).getchannel('A');bbox=aa.point(lambda x:255 if x>=128 else 0).getbbox()
 o['nativeDerivative']=dict(path=str(w),staging=str(S/w.name),nativeInputPath='/ui-studio/source/assets/import-staging/tile-survival-heroes/'+w.name,width=im.width,height=im.height,bytes=w.stat().st_size,sha256=hashlib.sha256(w.read_bytes()).hexdigest(),alphaExtrema=aa.getextrema(),alphaThreshold1BBox=aa.getbbox(),alphaThreshold128BBox=bbox,transform='Pillow thumbnail max512x768 Lanczos + WebP quality90; parent explicitly requested resize/format only; original preserved')
 assert w.stat().st_size <=300000
 m.append(o)
out_manifest.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
print('assets',len(m),'new',len(spec))
for o in m:print(o['name'],o['nativeDerivative']['bytes'])
