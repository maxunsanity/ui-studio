# -*- coding: utf-8 -*-
from pathlib import Path
from PIL import Image,ImageDraw
import ast,json,hashlib,math
s=Path('/Users/max/projest_max/ui-studio/samples/royal-match');p=s/'_작업/codex/video01/assets.json';data=json.loads(p.read_text());script=ast.parse((s/'_작업/codex/video01/prepare_assets.py').read_text());env=dict(Image=Image,ImageDraw=ImageDraw,hashlib=hashlib,math=math,S=3,a=s/'ui-studio/assets/authoring/v001',p=s/'ui-studio/assets/production/v001',assets=[]);exec(compile(ast.Module(body=[n for n in script.body if isinstance(n,(ast.FunctionDef,ast.ClassDef))],type_ignores=[]),'native_geometry','exec'),env)
for family,size in [('price',(114,54)),('wide',(378,76)),('half',(212,72)),('row',(114,74))]:
 for c in ['green','orange','blue','purple','red']:
  for v in ['normal','pressed']:
   env['make'](family+'-'+c+'-'+v,size,lambda im,d,w,h,c=c,v=v:env['btn'](im,d,w,h,v=='pressed',c))
data['assets']=[a for a in data['assets']if a['role']not in {x['role']for x in env['assets']}]+env['assets'];p.write_text(json.dumps(data,ensure_ascii=False,indent=2));print(len(data['assets']))
