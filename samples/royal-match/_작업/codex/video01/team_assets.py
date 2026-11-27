# -*- coding: utf-8 -*-
from pathlib import Path
from PIL import Image,ImageDraw
import ast,json,hashlib,math
s=Path('/Users/max/projest_max/ui-studio/samples/royal-match');p=s/'_작업/codex/video01/assets.json';data=json.loads(p.read_text());script=ast.parse((s/'_작업/codex/video01/prepare_assets.py').read_text());env=dict(Image=Image,ImageDraw=ImageDraw,hashlib=hashlib,math=math,S=3,a=s/'ui-studio/assets/authoring/v001',p=s/'ui-studio/assets/production/v001',assets=[]);exec(compile(ast.Module(body=[n for n in script.body if isinstance(n,(ast.FunctionDef,ast.ClassDef))],type_ignores=[]),'native_geometry','exec'),env)
for v in ['normal','pressed']:env['make']('view-orange-'+v,(144,64),lambda im,d,w,h,v=v:env['btn'](im,d,w,h,v=='pressed','orange'))
def header(im,d,w,h):
 env['grad'](im,(14,0,w,h),'#ecb3a8','#ca897c',12);d=env['Pen'](ImageDraw.Draw(im));d.rectangle((14,h-12,w,h),fill='#ca897c');d.polygon([(14,12),(0,24),(14,36)],fill='#dfa396');d.line((14,h-1,w,h-1),fill='#8b594a',width=2)
env['make']('request-header',(382,48),header)
def bar(im,d,w,h):
 env['rr'](d,(0,0,w-1,h-1),'#f6a006',12,o='#88551d',w=2);env['rr'](d,(3,3,w-4,h-4),'#ffe6a3',9,o='#fff5cb',w=1)
env['make']('request-progress',(154,32),bar)
def fill(im,d,w,h):
 d.rectangle((9,0,w,h),fill='#4ed000');d.ellipse((0,0,18,h),fill='#4ed000');d.line((9,2,w,2),fill='#a9f450',width=2)
env['make']('request-progress-fill',(30,26),fill)
def disc(im,d,w,h):
 d.ellipse((1,4,w-2,h-1),fill='#166708',outline='#20481a',width=2);d.ellipse((2,0,w-3,h-5),fill='#a5dc3d',outline='#e8f698',width=2);env['grad'](im,(5,3,w-6,h-7),'#95ed2b','#249d00',25);d=env['Pen'](ImageDraw.Draw(im));d.arc((10,5,w-11,h-13),190,300,fill='#e9ffb0',width=3)
env['make']('circle-green',(60,60),disc)
def speech(im,d,w,h):
 d.polygon([(16,42),(12,59),(32,43)],fill='#fff1ba',outline='#b4904d',width=1);env['rr'](d,(2,5,w-4,48),'#fff1ba',10,o='#b4904d',w=1)
 for x in [18,30,42]:d.ellipse((x-4,23,x+4,31),fill='#d85a36')
env['make']('message-icon',(64,64),speech)
data['assets']=[a for a in data['assets']if a['role']not in{x['role']for x in env['assets']}]+env['assets'];p.write_text(json.dumps(data,ensure_ascii=False,indent=2));print(len(data['assets']))
