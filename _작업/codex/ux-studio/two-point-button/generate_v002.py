
from pathlib import Path
import sys,math,json,hashlib,shutil,datetime
from PIL import Image,ImageDraw
R=Path('/Users/max/projest_max/ui-studio');W=R/'_\uc791\uc5c5/codex/ux-studio/two-point-button';sys.path.insert(0,str(W))
from projection import model,project,vertices,vanishing_points,ring,world_ring
c=model();A=R/'samples/monopoly-go/ui-studio/assets/authoring/button-states/v002';P=R/'samples/monopoly-go/ui-studio/assets/production/button-states';S=R/'src/tools/uxStudio/assets/import-staging/button-states'
for p in [A,P,S]:p.mkdir(parents=True,exist_ok=True)
def path(points):return 'M'+' L'.join(f'{x:.6f},{y:.6f}' for x,y in points)+'Z'
def col(rgb):return '#%02x%02x%02x'%tuple(max(0,min(255,round(n))) for n in rgb)
assets=[]
for state,z in [('normal',c['height']),('pressed',c['height']-c['press']),('disabled',c['height'])]:
 ss=4;im=Image.new('RGBA',(230*ss,220*ss));dr=ImageDraw.Draw(im);svg=[]
 def polygon(pts,color):
  dr.polygon([(round(x*ss),round(y*ss)) for x,y in pts],fill=color)
  svg.append('<path d="'+path(pts)+'" fill="'+color+'"/>')
 def rgbstate(rgb):
  if state=='disabled':
   grey=round(.25*rgb[0]+.6*rgb[1]+.15*rgb[2]);return (grey,grey,grey)
  return tuple(v*(.98 if state=='pressed' else 1) for v in rgb)
 xy=world_ring();base=ring(c,0);outer=ring(c,z-.014);inner=ring(c,z,.028);n=len(xy)
 polygon(base,col(rgbstate((162,48,10))))
 for i in sorted(range(n),key=lambda i:(xy[i][1]+xy[(i+1)%n][1])/2,reverse=True):
  j=(i+1)%n;dx=xy[j][0]-xy[i][0];dy=xy[j][1]-xy[i][1];length=math.hypot(dx,dy);light=max(0,(dy/length*-.65+-dx/length*-.65));v=.80+.20*light
  polygon([base[i],base[j],outer[j],outer[i]],col(rgbstate((188*v,62*v,12*v))))
 for i in range(n):
  j=(i+1)%n;mx=(xy[i][0]+xy[j][0])/2;my=(xy[i][1]+xy[j][1])/2;light=max(0,min(1,.5-.24*mx-.24*my))
  polygon([outer[i],outer[j],inner[j],inner[i]],col(rgbstate((245+10*light,111+39*light,20+12*light))))
 mask=Image.new('L',im.size);ImageDraw.Draw(mask).polygon([(round(x*ss),round(y*ss)) for x,y in inner],fill=255);face=Image.new('RGBA',im.size);fd=ImageDraw.Draw(face)
 ymin=min(y for x,y in inner)*ss;ymax=max(y for x,y in inner)*ss
 top=rgbstate((241,108,29));bottom=rgbstate((240,79,12))
 for y in range(im.height):
  t=max(0,min(1,(y-ymin)/(ymax-ymin)));rgb=tuple(round(a*(1-t)+b*t) for a,b in zip(top,bottom));fd.line((0,y,im.width,y),fill=rgb+(255,))
 face.putalpha(mask);im=Image.alpha_composite(im,face).resize((230,220),Image.Resampling.LANCZOS)
 gradient='<defs><linearGradient id="top" x1="0" y1="0" x2="0" y2="1"><stop stop-color="'+col(top)+'"/><stop offset="1" stop-color="'+col(bottom)+'"/></linearGradient></defs>'
 svg.append('<path d="'+path(inner)+'" fill="url(#top)"/>')
 name='UI_Main_Roll_Button_'+state.title()+'_v002';files={'svg':A/(name+'.svg'),'png':A/(name+'.png'),'production':P/(name+'.webp'),'staging':S/(name+'.webp')}
 assert not any(p.exists() for p in files.values())
 files['svg'].write_text('<svg xmlns="http://www.w3.org/2000/svg" width="230" height="220" viewBox="0 0 230 220">'+gradient+''.join(svg)+'</svg>')
 im.save(files['png']);im.save(files['production'],format='WEBP',lossless=True,exact=True,method=6);shutil.copy2(files['production'],files['staging'])
 assert Image.open(files['production']).convert('RGBA').tobytes()==im.tobytes()
 assert files['production'].stat().st_size<300000 and im.getpixel((0,0))[3]==0
 assets.append({'state':state,'name':name,'size':[230,220],'sha256':hashlib.sha256(files['production'].read_bytes()).hexdigest(),'path':'/ui-studio/source/assets/import-staging/button-states/'+name+'.webp','alphaBBox':im.getchannel('A').point(lambda v:255 if v>4 else 0).getbbox(),'files':{k:{'path':str(p.relative_to(R)),'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'bytes':p.stat().st_size} for k,p in files.items()}})
q=vertices(c,c['height']);p=vertices(c,c['height']-c['press']);d=lambda a,b:math.dist(q[a],q[b])
qa={'model':c,'vertices':q,'pressedVertices':p,'base':vertices(c,0),'vanishingPoints':vanishing_points(c),'farHalf':q['left'][1]-q['far'][1],'nearHalf':q['near'][1]-q['left'][1],'farEdge':d('far','left'),'nearEdge':d('near','left'),'maxCornerMovement':max(math.dist(q[k],p[k]) for k in q),'contentMovement':project((0,0,c['height']-c['press']),c)[1]-project((0,0,c['height']),c)[1],'status':'measured construction proposal, not source camera identification or visual equivalence'}
manifest={'version':2,'at':datetime.datetime.now().astimezone().isoformat(),'method':'same 3D rounded-square master, fixed two-point pinhole projection; offline SVG/PNG generation, no 3D runtime','referencePixelsCopied':False,'bakedText':False,'bakedExternalShadow':False,'assets':assets,'geometry':qa,'stateAliases':{'hover':'normal','selected':'normal'},'status':'native application/visual review pending'}
for dst in [A/'manifest.json',W/'manifest-v002.json']:dst.write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
(W/'geometry-qa.json').write_text(json.dumps(qa,ensure_ascii=False,indent=2))
print(json.dumps(qa,ensure_ascii=False,indent=2))

