
from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter,ImageChops
import json,hashlib,shutil,re,xml.etree.ElementTree as ET,datetime
R=Path('/Users/max/projest_max/ui-studio');A=R/'samples/monopoly-go/ui-studio/assets/authoring/roll-depth/v002';P=R/'samples/monopoly-go/ui-studio/assets/production/roll-depth';S=R/'src/tools/uxStudio/assets/import-staging/roll-depth';W=R/'_\uc791\uc5c5/codex/ux-studio/roll-depth'
A.mkdir(parents=True,exist_ok=True)
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def points(d):
 tok=re.findall('[MLQZ]|-?\\d+(?:\\.\\d+)?',d);out=[];cur=(0,0);i=0
 while i<len(tok):
  op=tok[i];i+=1
  if op in ['M','L']:cur=(float(tok[i]),float(tok[i+1]));i+=2;out.append(cur)
  elif op=='Q':
   a=cur;c=(float(tok[i]),float(tok[i+1]));b=(float(tok[i+2]),float(tok[i+3]));i+=4
   for j in range(1,33):
    t=j/32;out.append(((1-t)**2*a[0]+2*(1-t)*t*c[0]+t*t*b[0],(1-t)**2*a[1]+2*(1-t)*t*c[1]+t*t*b[1]))
   cur=b
  elif op=='Z':out.append(out[0])
 return out
def svgpath(pts):return 'M'+' L'.join(f'{x:.4f} {y:.4f}' for x,y in pts)+'Z'
assets=[]
def save(role,im,svg,contract):
 name='monopoly_roll_'+role+'_v002';paths=[A/(name+'.svg'),A/(name+'.png'),P/(name+'.webp'),S/(name+'.webp')];assert not any(p.exists() for p in paths);paths[0].write_text(svg);ET.parse(paths[0]);im.save(paths[1]);im.save(paths[2],format='WEBP',lossless=True,method=6,exact=True);shutil.copy2(paths[2],paths[3]);assert im.tobytes()==Image.open(paths[2]).convert('RGBA').tobytes();assert paths[2].stat().st_size<300000
 alpha=im.getchannel('A');bbox=alpha.point(lambda v:255 if v>4 else 0).getbbox()
 assets.append({'name':name,'role':role,'size':list(im.size),'sha256':sha(paths[2]),'path':'/ui-studio/source/assets/import-staging/roll-depth/'+name+'.webp','alphaBBoxAbove4':bbox,'sourceContract':{'referencePixelsCopied':False,'bakedText':False,'externalCastShadow':False,'fixedSilhouette':True,**contract},'files':{k:{'path':str(p.relative_to(R)),'sha256':sha(p),'bytes':p.stat().st_size} for k,p in zip(['svg','png','production','staging'],paths)}})
base=ET.fromstring((R/'samples/monopoly-go/ui-studio/assets/authoring/roll-depth/v001/monopoly_roll_go-front_v001.svg').read_text());old=points(base.find('{http://www.w3.org/2000/svg}path').attrib['d'])
for state,top,bottom,edge in [('normal',(255,106,0),(255,77,0),'#ff920c'),('hover',(255,114,0),(255,84,0),'#ffa222'),('pressed',(238,96,0),(235,68,0),'#e97d08'),('selected',(255,125,0),(255,92,0),'#ffcc36'),('disabled',(174,174,166),(136,136,129),'#c5c5ba')]:
 w,h,ss=200,170,4;pts=[(x*w/214,y*h/194) for x,y in old];mask=Image.new('L',(w*ss,h*ss));ImageDraw.Draw(mask).polygon([(round(x*ss),round(y*ss)) for x,y in pts],fill=255);im=Image.new('RGBA',mask.size);dr=ImageDraw.Draw(im)
 for y in range(h*ss):
  t=y/(h*ss-1);color=tuple(round(top[i]*(1-t)+bottom[i]*t) for i in range(3));dr.line((0,y,w*ss,y),fill=color+(255,))
 im.putalpha(mask);glow=Image.new('RGBA',im.size);gd=ImageDraw.Draw(glow);gd.line([(round(x*ss),round(y*ss)) for x,y in pts],fill=edge,width=round(3*ss),joint='curve');glow=glow.filter(ImageFilter.GaussianBlur(.7*ss));glow.putalpha(ImageChops.multiply(glow.getchannel('A'),mask));im=Image.alpha_composite(im,glow);ImageDraw.Draw(im).line([(round(x*ss),round(y*ss)) for x,y in pts],fill=edge,width=round(.8*ss),joint='curve')
 im=im.resize((w,h),Image.Resampling.LANCZOS);d=svgpath(pts);a='#%02x%02x%02x'%top;b='#%02x%02x%02x'%bottom
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><defs><linearGradient id="face" x2="0" y2="1"><stop stop-color="{a}"/><stop offset="1" stop-color="{b}"/></linearGradient><clipPath id="clip"><path d="{d}"/></clipPath><filter id="soft"><feGaussianBlur stdDeviation=".7"/></filter></defs><path d="{d}" fill="url(#face)"/><g clip-path="url(#clip)"><path d="{d}" fill="none" stroke="{edge}" stroke-width="3" filter="url(#soft)"/><path d="{d}" fill="none" stroke="{edge}" stroke-width=".8"/></g></svg>'
 save('go-front-'+state,im,svg,{'material':'surface gradient and inner bevel only; not an external cast shadow','reference':'05_main plus enlarged lower HUD; palette/state style proposals'})
w,h,ss=210,170,4;pts=[(x*w/214,y*h/194) for x,y in old];mask=Image.new('L',(w*ss,h*ss));ImageDraw.Draw(mask).polygon([(round(x*ss),round(y*ss)) for x,y in pts],fill=255);im=Image.new('RGBA',mask.size);dr=ImageDraw.Draw(im)
for y in range(h*ss):
 t=y/(h*ss-1);c=tuple(round(a*(1-t)+b*t) for a,b in zip((201,60,0),(171,42,0)));dr.line((0,y,w*ss,y),fill=c+(255,))
im.putalpha(mask);im=im.resize((w,h),Image.Resampling.LANCZOS);d=svgpath(pts)
save('go-fixed-rim',im,f'<svg xmlns="http://www.w3.org/2000/svg" width="210" height="170" viewBox="0 0 210 170"><defs><linearGradient id="body" x2="0" y2="1"><stop stop-color="#c93c00"/><stop offset="1" stop-color="#ab2a00"/></linearGradient></defs><path d="{d}" fill="url(#body)"/></svg>',{'material':'physical lower sidewall, 29 logical px below face; separate engine cast shadow'})
# The outer contour is a union, not two overlapping white outlines.
svg=ET.fromstring((R/'samples/monopoly-go/ui-studio/assets/authoring/bottom-nav/v005/common_bottom-nav_crown-fill-fixed_normal_v001.svg').read_text());p=points(svg.find('{http://www.w3.org/2000/svg}path').attrib['d']);p=[(x,y+18) for x,y in p];w,h,ss=274,298,4;mask=Image.new('L',(w*ss,h*ss));md=ImageDraw.Draw(mask);md.polygon([(round(x*ss),round(y*ss)) for x,y in p],fill=255);cx,cy,rr=232.67,41.89,41
md.ellipse(tuple(round(v*ss) for v in (cx-rr,cy-rr,cx+rr,cy+rr)),fill=255)
# Four-neighbour connectivity is a production check for the joined lobe.
lo=mask.resize((w,h),Image.Resampling.NEAREST);on={(x,y) for y in range(0,178) for x in range(w) if lo.getpixel((x,y))>128};q=[(233,42)];seen={q[0]}
while q:
 x,y=q.pop()
 for v in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
  if v in on and v not in seen:seen.add(v);q.append(v)
assert (130,120) in seen,'lobe must connect to the central backplate'
fill=Image.new('RGBA',mask.size,'#faf6e7');fill.putalpha(mask)
er6=mask.filter(ImageFilter.MinFilter(49));er9=mask.filter(ImageFilter.MinFilter(73));white=ImageChops.subtract(mask,er6);gold=ImageChops.subtract(er6,er9)
clip=Image.new('L',mask.size);ImageDraw.Draw(clip).rectangle((0,0,w*ss,178*ss),fill=255);white=ImageChops.multiply(white,clip);gold=ImageChops.multiply(gold,clip)
frame=Image.new('RGBA',mask.size);a=Image.new('RGBA',mask.size,'#fffef7');a.putalpha(white);frame=Image.alpha_composite(frame,a);a=Image.new('RGBA',mask.size,'#e5de91');a.putalpha(gold);frame=Image.alpha_composite(frame,a)
d=svgpath(p);shape=f'<g id="shape"><path d="{d}"/><circle cx="{cx}" cy="{cy}" r="{rr}"/></g>'
fillSVG=f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><g fill="#faf6e7"><path d="{d}"/><circle cx="{cx}" cy="{cy}" r="{rr}"/></g></svg>'
frameSVG=f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><defs>{shape}<filter id="er6"><feMorphology operator="erode" radius="6"/></filter><filter id="er9"><feMorphology operator="erode" radius="9"/></filter><mask id="white"><use href="#shape" fill="white"/><use href="#shape" fill="black" filter="url(#er6)"/></mask><mask id="gold"><use href="#shape" fill="white" filter="url(#er6)"/><use href="#shape" fill="black" filter="url(#er9)"/></mask><clipPath id="top"><rect width="{w}" height="178"/></clipPath></defs><g clip-path="url(#top)"><rect width="{w}" height="{h}" fill="#fffef7" mask="url(#white)"/><rect width="{w}" height="{h}" fill="#e5de91" mask="url(#gold)"/></g></svg>'
save('center-dock-fill',fill.resize((w,h),Image.Resampling.LANCZOS),fillSVG,{'outerContour':'single connected union of fixed crown and multiplier lobe','insideOpaque':True,'separateFrame':True})
save('center-dock-frame',frame.resize((w,h),Image.Resampling.LANCZOS),frameSVG,{'outerContour':'one perimeter; no internal circle seam','whiteThicknessLogical':6,'goldThicknessLogical':3,'bottomOpenToSharedBar':True})
measure={'reference':'docs/reference/monopoly-go/20261116-ten-screens/05_main.png','sourceSize':[709,1269],'basis':[551,984],'scaleX':551/709,'scaleY':984/1269,'observationMethod':'manual contour comparison + RGB connected components; not Unity source geometry','pixelUncertainty':{'interior':2,'outerBevel':6},'observed':{'brightFrontInterior':[234,919,239,218],'frontBottomY':1137,'bodyBottomY':1174,'bodyWidthApprox':265,'depthYSourceApprox':37,'multiplierCenterApprox':[487,938]},'commonChosen':{'goHit':[230,220],'front':[200,170],'frontLocal':[15,10],'rim':[210,170],'rimLocal':[10,39],'faceToBodyDepth':29,'centerGroup':[288,298],'crownLocal':[14,0,274,298],'multiplierLocal':[209.67,4.89,74,74]},'v001Corrections':['front214x194 was oversized/tall and9px high','rim offset22 was too thin','multiplier was moved left/down instead of joining the original lobe','overlapping circle frame created a false internal seam'],'sourceLayerObservation':'inferred reproduction hierarchy; actual Unity hierarchy unconfirmed','status':'proposal awaiting actual native QA/user review'}
m={'version':2,'preparedAt':datetime.datetime.now().astimezone().isoformat(),'assets':assets,'measurement':measure,'status':'new drawing/preparation; native application pending'}
for p in [A/'manifest.json',W/'manifest-v002.json']:p.write_text(json.dumps(m,ensure_ascii=False,indent=2))
(W/'measurements-v002.json').write_text(json.dumps(measure,ensure_ascii=False,indent=2))
print(len(assets),'v002 resources; joined-lobe connectivity passed; no reference pixels copied')

