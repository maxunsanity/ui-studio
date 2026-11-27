# -*- coding: utf-8 -*-
from pathlib import Path
from PIL import Image,ImageDraw
import ast,json,hashlib,math
s=Path('/Users/max/projest_max/ui-studio/samples/royal-match');p=s/'_작업/codex/video01/assets.json';data=json.loads(p.read_text());script=ast.parse((s/'_작업/codex/video01/prepare_assets.py').read_text());env=dict(Image=Image,ImageDraw=ImageDraw,hashlib=hashlib,math=math,S=3,a=s/'ui-studio/assets/authoring/v001',p=s/'ui-studio/assets/production/v001',assets=[]);exec(compile(ast.Module(body=[n for n in script.body if isinstance(n,(ast.FunctionDef,ast.ClassDef))],type_ignores=[]),'native_geometry','exec'),env)
for family,size,colors in [('square',(64,64),['green','red']),('social',(324,110),['blue'])]:
 for c in colors:
  for v in ['normal','pressed']:env['make'](family+'-'+c+'-'+v,size,lambda im,d,w,h,c=c,v=v:env['btn'](im,d,w,h,v=='pressed',c))
env['make']('rank-green-row',(488,82),lambda im,d,w,h:env['btn'](im,d,w,h,False,'green'))
env['make']('gold-disc',(64,64),lambda im,d,w,h:(d.ellipse((1,3,w-2,h-1),fill='#b86400',outline='#743b08',width=2),d.ellipse((3,1,w-4,h-5),fill='#ffbb05',outline='#ffe885',width=3),d.ellipse((9,7,w-10,h-11),fill='#ffb90d',outline='#e58e00',width=2)))
data['assets']=[a for a in data['assets']if a['role']not in{x['role']for x in env['assets']}]+env['assets'];p.write_text(json.dumps(data,ensure_ascii=False,indent=2));print(len(data['assets']))
