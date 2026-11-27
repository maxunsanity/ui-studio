from PIL import Image,ImageDraw
from pathlib import Path
import json,hashlib
r=Path('/Users/max/projest_max/ui-studio/samples/pikmin');im=Image.new('RGBA',(480,480));d=ImageDraw.Draw(im)
d.ellipse((8,8,472,472),fill='#d5e8db',outline='#92c1b1',width=12)
d.ellipse((30,30,450,450),fill='#e8f1de')
d.ellipse((143,86,337,280),fill='#f8fbf6',outline='#96b6a9',width=12)
d.rounded_rectangle((84,288,396,422),radius=64,fill='#f8fbf6',outline='#96b6a9',width=12)
im=im.resize((120,120),Image.Resampling.LANCZOS);p=r/'ui-studio/assets/avatar-v001.webp';im.save(p,lossless=True,method=6)
m=r/'docs/ui/asset-manifest.json';a=json.loads(m.read_text());a.append({'file':p.name,'bytes':p.stat().st_size,'size':list(im.size),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()});m.write_text(json.dumps(a,ensure_ascii=False,indent=2)+'\n');print(p.stat().st_size)
