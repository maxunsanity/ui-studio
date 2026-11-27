import json, struct, math
from pathlib import Path
from PIL import Image, ImageDraw
base=Path('/Users/max/projest_max/kpopmonsters/data/res/facility_growth_blender_v01/models')
out=Path(__file__).parent/'art'
def read(path):
 b=path.read_bytes()
 n=struct.unpack_from('<I',b,12)[0]
 j=json.loads(b[20:20+n])
 data=b[28+n:]
 def arr(i):
  a=j['accessors'][i];v=j['bufferViews'][a['bufferView']]
  f={5126:'f',5125:'I',5123:'H',5121:'B'}[a['componentType']]*{'SCALAR':1,'VEC3':3,'VEC4':4}[a['type']]
  step=struct.calcsize('<'+f)
  pos=v.get('byteOffset',0)+a.get('byteOffset',0)
  stride=v.get('byteStride',step)
  return [struct.unpack_from('<'+f,data,pos+k*stride) for k in range(a['count'])]
 for mesh in j['meshes']:
  for p in mesh['primitives']:
   a=p['attributes']; verts=arr(a['POSITION']); norm=arr(a['NORMAL']); cols=arr(a['COLOR_0']); idx=[i[0] for i in arr(p['indices'])]
   for k in range(0,len(idx),3):
    i=idx[k];yield [verts[j] for j in idx[k:k+3]],norm[i],cols[i][:3]
def proj(p):
 x,y,z=p
 return (.82*x-.57*z,-.33*x-.81*y-.47*z,.47*x-.57*y+.66*z)
def scene(name,fid,lv,arena=False):
 faces=[]
 for slot,l,off in [('main',10,(0,0,0)),('annex_a',10,(-3.5,0,-.3)),('annex_b',lv,(3.4,0,.5))]:
  for verts,norm,c in read(base/f'{fid}_{slot}_L{10 if name=="hq-max" else l:02d}.glb'):
   points=[proj(tuple(x+y for x,y in zip(v,off))) for v in verts]
   light=.62+.38*max(0,sum(a*b for a,b in zip(norm,(-.31,.82,.42))))
   l=round(48+192*(.28*c[0]+.55*c[1]+.17*c[2])**.5*light)
   faces.append((sum(p[2] for p in points),points,l))
 w,h=(620,560) if arena else (420,260)
 im=Image.new('RGBA',(w*2,h*2),(44,49,58,255) if arena else (0,0,0,0))
 d=ImageDraw.Draw(im)
 xs=[p[0] for _,ps,_ in faces for p in ps]; ys=[p[1] for _,ps,_ in faces for p in ps]
 xmid=(min(xs)+max(xs))/2;ymid=(min(ys)+max(ys))/2
 scale=min((w-40)/(max(xs)-min(xs)),(h-28)/(max(ys)-min(ys)))*(0.75 if arena else 1)
 def xy(x,y):return (round((w/2+(x-xmid)*scale)*2),round(((h*.48 if arena else h/2)+(y-ymid)*scale)*2))
 if arena:
  for a in range(-25,26):
   for b in range(-25,26):
    if (a+b)%2:continue
    pts=[proj((a+xx,0,b+yy)) for xx,yy in [(0,0),(1,0),(1,1),(0,1)]]
    d.polygon([xy(x,y) for x,y,_ in pts],fill=(52,57,65,255))
 for _,ps,l in sorted(faces,key=lambda f:-f[0]):
  col=(l,l,l,255)
  d.polygon([xy(x,y) for x,y,_ in ps],fill=col,outline=col)
 im.resize((w,h),Image.Resampling.LANCZOS).save(out/(name+'.png'),optimize=True)
for fid in ['production','hq','vocal','dance','rap','fanshop','broadcast','visual']:
 scene(fid,fid,4)
scene('dance-up','dance',5)
scene('dance-arena','dance',4,True)
scene('hq-arena','hq',4,True)
for count in (62,100):
 im=Image.new('RGBA',(128,128));d=ImageDraw.Draw(im)
 d.ellipse((9,9,119,119),fill='#e4e9ed',outline='#a2aeba',width=10)
 d.arc((9,9,119,119),-90,-90+360*count/100,fill='#334758' if count<100 else '#8d4b3d',width=10)
 d.polygon([(64,30),(39,70),(61,70),(55,99),(90,57),(69,57),(76,30)],fill='#334758' if count<100 else '#8d4b3d')
 im.save(out/f'gauge-{count}.png')

scene('hq-max','hq',10)
for name in ('enemy-mark','boss-mark','skill-0','skill-1','skill-2'):
 im=Image.new('RGBA',(96,96));d=ImageDraw.Draw(im)
 if name.endswith('mark'):
  d.ellipse((15,19,81,80),fill='#b9c3cb',outline='#252e38',width=4)
  d.polygon([(18,39),(22,12),(40,25),(56,25),(74,11),(79,42)],fill='#b9c3cb')
  d.ellipse((29,41,44,58),fill='#27313b');d.ellipse((52,41,67,58),fill='#27313b')
  d.arc((36,56,59,75),10,170,fill='#27313b',width=4)
  if name=='boss-mark':d.polygon([(10,35),(5,11),(34,23),(48,7),(62,23),(90,11),(85,35)],fill='#9d5548',outline='#66392f')
 else:
  d.rounded_rectangle((9,9,87,87),18,fill='#e0e6eb',outline='#566c7a',width=3)
  if name=='skill-0':
   d.ellipse((39,22,57,40),fill='#374d5f')
   for x in (28,62):
    d.line([(48,47),(x,63)],fill='#374d5f',width=6);d.ellipse((x-6,61,x+6,73),fill='#374d5f')
  elif name=='skill-1':
   for y in (37,55):d.polygon([(24,y),(48,y-18),(72,y),(72,y+11),(48,y-7),(24,y+11)],fill='#374d5f')
  else:
   d.polygon([(48,19),(55,38),(76,39),(60,52),(66,73),(48,61),(29,73),(36,52),(20,39),(41,38)],fill='#374d5f')
 im.save(out/(name+'.png'))
