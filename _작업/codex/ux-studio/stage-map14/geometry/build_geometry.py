from pathlib import Path
import json,hashlib,datetime,math,shutil
from PIL import Image,ImageDraw
R=Path('/Users/max/projest_max/ui-studio')
W=R/'_\uc791\uc5c5/codex/ux-studio/stage-map14/geometry';A=R/'samples/monopoly-go/ui-studio/assets/authoring/stage-map14/geometry-v001';P=R/'samples/monopoly-go/ui-studio/assets/production/stage-map14-geometry';S=R/'src/tools/uxStudio/assets/import-staging/stage-map14-geometry'
for p in [W,A,P,S]:p.mkdir(parents=True,exist_ok=True)
assets=[]
def export(name,im,svg,role,slices=None,edges=None):
 files={}
 for kind,p in [('svg',A/(name+'.svg')),('png',A/(name+'.png')),('production',P/(name+'.webp')),('staging',S/(name+'.webp'))]:
  assert not p.exists(),p
  if kind=='svg':p.write_text(svg)
  elif kind=='png':im.save(p)
  elif kind=='production':im.save(p,format='WEBP',lossless=True,exact=True,method=6)
  else:shutil.copy2(P/(name+'.webp'),p)
  files[kind]={'path':str(p.relative_to(R)),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
 assert im.tobytes()==Image.open(P/(name+'.webp')).convert('RGBA').tobytes()
 assert (P/(name+'.webp')).stat().st_size<300000
 assets.append({'name':name,'role':role,'sourceSize':list(im.size),'slices':slices,'edges':edges,'files':files,'path':'/ui-studio/source/assets/import-staging/stage-map14-geometry/'+name+'.webp','sha':files['production']['sha256']})
w,h=551,984;im=Image.new('RGBA',(w,h));dr=ImageDraw.Draw(im)
stops=[(0,(242,193,170)),(.36,(232,181,213)),(.63,(173,180,225)),(1,(41,189,218))]
for y in range(h):
 t=y/(h-1)
 a,b=next((a,b) for a,b in zip(stops,stops[1:]) if a[0]<=t<=b[0])
 k=(t-a[0])/(b[0]-a[0]);dr.line((0,y,w,y),fill=tuple(round(x+(z-x)*k) for x,z in zip(a[1],b[1]))+(255,))
svg=['<svg xmlns="http://www.w3.org/2000/svg" width="551" height="984" viewBox="0 0 551 984"><defs><linearGradient id="bg" x2="0" y2="1">']
for t,c in stops:svg.append(f'<stop offset="{t}" stop-color="#{c[0]:02x}{c[1]:02x}{c[2]:02x}"/>')
svg.append('</linearGradient></defs><rect width="551" height="984" fill="url(#bg)"/>')
for x,y,r in [(-15,75,39),(514,29,30),(72,315,42),(478,263,37),(421,581,44),(105,577,48),(474,835,45)]:
 for dx,dy,rr in [(-.65,.12,.7),(0,-.15,1),(.8,.08,.72),(1.35,.32,.5)]:
  cx=x+dx*r;cy=y+dy*r;rad=rr*r
  dr.ellipse((cx-rad,cy-rad,cx+rad,cy+rad),fill=(226,224,227,255))
  svg.append(f'<circle cx="{cx:.3f}" cy="{cy:.3f}" r="{rad:.3f}" fill="#e2e0e3"/>')
for x,y,r in [(173,43,17),(481,478,19),(108,799,16),(296,649,11)]:
 dr.ellipse((x-r,y-r*.65,x+r,y+r*.65),fill=(230,230,230,255));svg.append(f'<ellipse cx="{x}" cy="{y}" rx="{r}" ry="{r*.65}" fill="#e6e6e6"/>')
svg.append('</svg>');export('common_map_cloud-gradient_v001',im,''.join(svg),'opaque environment backdrop; no UI/header/footer/stage art')
w,h=512,96;ss=3;im=Image.new('RGBA',(w*ss,h*ss));dr=ImageDraw.Draw(im);svg=['<svg xmlns="http://www.w3.org/2000/svg" width="512" height="96" viewBox="0 0 512 96">']
def poly(points,color):
 dr.polygon([(round(x*ss),round(y*ss)) for x,y in points],fill=color)
 svg.append('<path d="M'+' L'.join(f'{x:.3f},{y:.3f}' for x,y in points)+'Z" fill="'+color+'"/>')
poly([(0,8),(69,12),(69,85),(0,80),(10,43)],'#c83c56');poly([(443,12),(512,8),(502,43),(512,80),(443,85)],'#c83c56')
poly([(26,8),(49,22),(49,88),(26,75)],'#a72a46');poly([(486,8),(463,22),(463,88),(486,75)],'#a72a46')
top=[(26+i*460/64,10+17*math.sin(math.pi*i/64)) for i in range(65)]
bottom=[(26+i*460/64,76+18*math.sin(math.pi*i/64)) for i in range(64,-1,-1)]
poly(top+bottom,'#ef5c76')
poly([(x,y) for x,y in top]+[(x,y+5) for x,y in reversed(top)],'#ff7889')
im=im.resize((w,h),Image.Resampling.LANCZOS);svg.append('</svg>');export('common_map_stage-ribbon3_v001',im,''.join(svg),'folded pink stage ribbon; separate native names',[0,48,0,48],[0,32,0,32])
manifest={'generatedAt':datetime.datetime.now().astimezone().isoformat(),'status':'proposal; native integration pending','reference':'MGV04-S01 stable-frame_00000.png; code-authored geometry, no source pixels copied','bakedText':False,'bakedExternalCastShadow':False,'newPackages':0,'assets':assets}
(A/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2));(W/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print(json.dumps([{'name':a['name'],'bytes':a['files']['production']['bytes'],'size':a['sourceSize']} for a in assets]))

