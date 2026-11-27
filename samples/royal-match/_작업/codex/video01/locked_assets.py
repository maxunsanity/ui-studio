# -*- coding: utf-8 -*-
from pathlib import Path
from PIL import Image,ImageDraw
import ast,json,hashlib,math,shutil
s=Path('/Users/max/projest_max/ui-studio/samples/royal-match');p=s/'_작업/codex/video01/assets.json';data=json.loads(p.read_text());b=Path('/Users/max/.codex/generated_images/01a1e71f-f14c-7b22-aaee-d41c9a6520e2')
for role,fn in [('garden-locked','exec-98bcf98f-589a-4038-8fdc-cb481f90ec4e.png'),('lock','exec-8ca31b7b-4370-47d6-a47f-5521ff2916e6.png')]:
 a=s/'ui-studio/assets/authoring/v001'/f'{role}.png';shutil.copy2(b/fn,a);im=Image.open(a).convert('RGBA');im.thumbnail((768,768));f=s/'ui-studio/assets/production/v001'/f'{role}.webp';im.save(f,'WEBP',quality=90,method=6);data['assets'].append(dict(role=role,path=str(f),authoring=str(a),size=list(im.size),bytes=f.stat().st_size,sha256=hashlib.sha256(f.read_bytes()).hexdigest(),method='new imagegen locked-area scene/icon, mechanical downsample'))
script=ast.parse((s/'_작업/codex/video01/prepare_assets.py').read_text());env=dict(Image=Image,ImageDraw=ImageDraw,hashlib=hashlib,math=math,S=3,a=s/'ui-studio/assets/authoring/v001',p=s/'ui-studio/assets/production/v001',assets=[]);exec(compile(ast.Module(body=[n for n in script.body if isinstance(n,(ast.FunctionDef,ast.ClassDef))],type_ignores=[]),'native_geometry','exec'),env)
node=next(n for n in ast.parse((s/'_작업/codex/video01/area_assets.py').read_text()).body if isinstance(n,ast.FunctionDef)and n.name=='card');palette={'#4f0018':'#223746','#2f1222':'#162b36','#bb002d':'#527180','#ffca29':'#a0bbc5','#efb927':'#7897a4','#fff27d':'#b3ced6','#bb002a':'#4c6c7c','#ffb900':'#819fac','#ffe65f':'#b6d3df'}
for n in ast.walk(node):
 if isinstance(n,ast.Constant)and isinstance(n.value,str):n.value=palette.get(n.value,n.value)
ns={'env':env};exec(compile(ast.Module(body=[node],type_ignores=[]),'native_locked_geometry','exec'),ns);env['make']('area-card-locked',(424,320),ns['card']);data['assets']+=env['assets'];p.write_text(json.dumps(data,ensure_ascii=False,indent=2));print(len(data['assets']))
