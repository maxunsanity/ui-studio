# -*- coding: utf-8 -*-
from pathlib import Path
from PIL import Image,ImageDraw
import ast,json,hashlib,math
s=Path('/Users/max/projest_max/ui-studio/samples/royal-match');p=s/'_작업/codex/video01/assets.json';data=json.loads(p.read_text());script=ast.parse((s/'_작업/codex/video01/prepare_assets.py').read_text());env=dict(Image=Image,ImageDraw=ImageDraw,hashlib=hashlib,math=math,S=3,a=s/'ui-studio/assets/authoring/v001',p=s/'ui-studio/assets/production/v001',assets=[]);exec(compile(ast.Module(body=[n for n in script.body if isinstance(n,(ast.FunctionDef,ast.ClassDef))],type_ignores=[]),'native_geometry','exec'),env)
for v in ['normal','pressed']:env['make']('view-green-'+v,(144,64),lambda im,d,w,h,v=v:env['btn'](im,d,w,h,v=='pressed','green'))
def card(im,d,w,h):
 rr=env['rr'];rr(d,(1,6,w-2,h-1),'#4f0018',24,o='#2f1222',w=3);rr(d,(4,2,w-5,h-8),'#bb002d',20,o='#ffca29',w=4);rr(d,(12,12,w-13,h-16),'#efb927',14,o='#fff27d',w=2);d.polygon([(0,20),(40,8),(w/2,0),(w-40,8),(w,20),(w,82),(w-40,72),(w/2,64),(40,72),(0,82)],fill='#bb002a',outline='#ffb900',width=4);d.line((2,20,42,10,w/2,3,w-42,10,w-2,20),fill='#ffe65f',width=2)
env['make']('area-card',(424,320),card)
def bar(im,d,w,h):
 env['rr'](d,(0,0,w-1,h-1),'#e5a51b',12,o='#703c0b',w=2);env['rr'](d,(3,3,w-4,h-4),'#004b77',9,o='#fff4a4',w=1)
env['make']('area-progress',(200,32),bar)
def fill(im,d,w,h):
 d.rectangle((9,0,w,h),fill='#4ed000');d.ellipse((0,0,18,h),fill='#4ed000');d.line((9,2,w,2),fill='#a9f450',width=2)
env['make']('area-progress-fill',(22,26),fill)
data['assets']=[a for a in data['assets']if a['role']not in{x['role']for x in env['assets']}]+env['assets'];p.write_text(json.dumps(data,ensure_ascii=False,indent=2));print(len(data['assets']))
