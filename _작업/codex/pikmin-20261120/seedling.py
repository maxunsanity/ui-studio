from pathlib import Path
from PIL import Image,ImageDraw
import hashlib,json
r=Path('/Users/max/projest_max/ui-studio/samples/pikmin');S=4
im=Image.new('RGBA',(120*S,140*S));d=ImageDraw.Draw(im)
def el(b,c,o=None,w=1):d.ellipse(tuple(int(x*S) for x in b),fill=c,outline=o,width=w*S)
def ln(p,c,w):d.line([(x*S,y*S) for x,y in p],fill=c,width=w*S,joint='curve')
def po(p,c):d.polygon([(x*S,y*S)for x,y in p],fill=c)
el((23,118,100,135),(65,90,57,30))
po([(32,76),(89,76),(82,125),(40,125)],'#b28150')
el((31,68,90,88),'#e0c2a2');el((37,73,84,86),'#6d4b35')
for y in range(85,119):ln([(40,y),(82,y)],(178+int((119-y)/5),125+int((119-y)/4),75,255),1)
ln([(60,80),(59,38),(69,21)],'#468e45',5)
el((18,29,60,52),'#559c48');el((21,28,59,44),'#91c45e')
el((61,12,105,35),'#6aaf4e');el((63,11,104,27),'#a0cf66')
ln([(27,36),(55,41)],'#c4e4a5',1);ln([(68,25),(97,19)],'#d1e8aa',1)
ln([(39,90),(43,116)],'#dbb48b',3)
im=im.resize((120,140),Image.Resampling.LANCZOS)
p=r/'ui-studio/assets/seedling-v001.webp';im.save(p,lossless=True,method=6)
m=r/'docs/ui/asset-manifest.json';a=json.loads(m.read_text());a=[x for x in a if x['file']!=p.name];a.append({'file':p.name,'bytes':p.stat().st_size,'size':list(im.size),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()});m.write_text(json.dumps(a,ensure_ascii=False,indent=2)+'\n');print('new seedling',p.stat().st_size)
