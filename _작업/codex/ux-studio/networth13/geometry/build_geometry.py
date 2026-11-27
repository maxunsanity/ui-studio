#!/usr/bin/env python3
"""Networth13 original geometry; Pillow rasterizer, no screenshot pixel reads."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageColor, ImageFont, ImageChops
import math, json, re, hashlib, shutil, random, datetime
ROOT = Path('/Users/max/projest_max/ui-studio')
WORK = ROOT/'_작업/codex/ux-studio/networth13/geometry'
AUTHOR = ROOT/'samples/monopoly-go/ui-studio/assets/authoring/networth13/geometry-v001'
PROD = ROOT/'samples/monopoly-go/ui-studio/assets/production/networth13-geometry'
STAGE = ROOT/'src/tools/uxStudio/assets/import-staging/networth13-geometry'
S = 4
ASSETS=[]

def color(c):
    if isinstance(c, tuple): return c
    return ImageColor.getcolor(c, 'RGBA')

def gradient(*stops, direction='vertical'):
    return {'stops':[(float(p),c) for p,c in stops], 'direction':direction}

def rr(x,y,w,h,r):
    return f'M{x+r},{y} H{x+w-r} Q{x+w},{y} {x+w},{y+r} V{y+h-r} Q{x+w},{y+h} {x+w-r},{y+h} H{x+r} Q{x},{y+h} {x},{y+h-r} V{y+r} Q{x},{y} {x+r},{y} Z'

def rect(x,y,w,h): return f'M{x},{y} H{x+w} V{y+h} H{x} Z'
def circle(x,y,r):
    k=.5522847498*r
    return f'M{x+r},{y} C{x+r},{y+k} {x+k},{y+r} {x},{y+r} C{x-k},{y+r} {x-r},{y+k} {x-r},{y} C{x-r},{y-k} {x-k},{y-r} {x},{y-r} C{x+k},{y-r} {x+r},{y-k} {x+r},{y} Z'
def star(cx,cy,r,ratio=.47,n=5,rot=-math.pi/2):
    p=[(cx+math.cos(rot+i*math.pi/n)*(r if i%2==0 else r*ratio),cy+math.sin(rot+i*math.pi/n)*(r if i%2==0 else r*ratio)) for i in range(n*2)]
    return 'M'+' L'.join(f'{x:.3f},{y:.3f}' for x,y in p)+' Z'
def scale_y(d, factor):
    tokens=re.findall(r'[MLHVQCZ]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?',d)
    cmd=None;index=0;out=[]
    for token in tokens:
        if token in 'MLHVQCZ':cmd=token;index=0;out.append(token);continue
        value=float(token);vertical=cmd=='V' or (cmd in ['M','L','Q','C'] and index%2==1)
        out.append(f'{value*factor if vertical else value:.5f}');index+=1
    return ' '.join(out)

def sparkle(cx,cy,r):
    return f'M{cx},{cy-r} Q{cx+r*.13},{cy-r*.13} {cx+r},{cy} Q{cx+r*.13},{cy+r*.13} {cx},{cy+r} Q{cx-r*.13},{cy+r*.13} {cx-r},{cy} Q{cx-r*.13},{cy-r*.13} {cx},{cy-r} Z'

# All shape geometry is shared between SVG and Pillow export.
def flatten(d):
    t=re.findall(r'[MLHVQCZmlhvqcz]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?',d)
    i=0; cmd=None; x=y=0; paths=[]; points=[]; start=(0,0)
    def number():
        nonlocal i
        v=float(t[i]);i+=1;return v
    while i<len(t):
        if re.match(r'[A-Za-z]',t[i]): cmd=t[i];i+=1
        if cmd=='M':
            if points: paths.append(points)
            x=number();y=number();points=[(x,y)];start=(x,y);cmd='L'
        elif cmd=='L': x=number();y=number();points.append((x,y))
        elif cmd=='H': x=number();points.append((x,y))
        elif cmd=='V': y=number();points.append((x,y))
        elif cmd=='Q':
            a,b,c,e=number(),number(),number(),number(); ox,oy=x,y
            steps=max(8,int(math.hypot(c-ox,e-oy)/2))
            for j in range(1,steps+1):
                u=j/steps;v=1-u;points.append((v*v*ox+2*v*u*a+u*u*c,v*v*oy+2*v*u*b+u*u*e))
            x,y=c,e
        elif cmd=='C':
            a,b,c,e,f,g=number(),number(),number(),number(),number(),number();ox,oy=x,y
            steps=max(12,int(math.hypot(f-ox,g-oy)/2))
            for j in range(1,steps+1):
                u=j/steps;v=1-u;points.append((v**3*ox+3*v*v*u*a+3*v*u*u*c+u**3*f,v**3*oy+3*v*v*u*b+3*v*u*u*e+u**3*g))
            x,y=f,g
        elif cmd=='Z':
            points.append(start);paths.append(points);points=[];x,y=start;cmd=None
        else: raise ValueError(f'unsupported path {cmd}')
    if points:paths.append(points)
    return paths

class Scene:
    def __init__(self,w,h):self.w=w;self.h=h;self.shapes=[]
    def path(self,d,fill=None,stroke=None,sw=1,opacity=1,clip=None):
        self.shapes.append(dict(d=d,fill=fill,stroke=stroke,sw=sw,opacity=opacity,clip=clip));return self
    def mask(self,d):
        im=Image.new('L',(self.w*S,self.h*S));draw=ImageDraw.Draw(im)
        for p in flatten(d):draw.polygon([(round(x*S),round(y*S)) for x,y in p],fill=255)
        return im
    def paint(self,fill):
        if not isinstance(fill,dict):return Image.new('RGBA',(self.w*S,self.h*S),color(fill))
        out=Image.new('RGBA',(self.w*S,self.h*S));draw=ImageDraw.Draw(out);stops=fill['stops'];vertical=fill['direction']=='vertical';steps=(self.h if vertical else self.w)*S
        for i in range(steps):
            u=i/max(1,steps-1)
            for a in range(len(stops)-1):
                if u<=stops[a+1][0]:break
            p,c=stops[a];q,e=stops[a+1];v=max(0,min(1,(u-p)/(q-p)));c=color(c);e=color(e);rgba=tuple(round(c[j]*(1-v)+e[j]*v) for j in range(4))
            draw.line((0,i,self.w*S,i) if vertical else (i,0,i,self.h*S),fill=rgba)
        return out
    def render(self):
        out=Image.new('RGBA',(self.w*S,self.h*S))
        for sh in self.shapes:
            clip=self.mask(sh['clip']) if sh['clip'] else None
            if sh['fill'] is not None:
                m=self.mask(sh['d'])
                if clip:m=ImageChops.multiply(m,clip)
                if sh['opacity']!=1:m=m.point(lambda v:round(v*sh['opacity']))
                p=self.paint(sh['fill']);m=ImageChops.multiply(m,p.getchannel('A'));p.putalpha(m);out.alpha_composite(p)
            if sh['stroke']:
                m=Image.new('L',out.size);draw=ImageDraw.Draw(m)
                for p in flatten(sh['d']):draw.line([(round(x*S),round(y*S)) for x,y in p],fill=255,width=max(1,round(sh['sw']*S)),joint='curve')
                if clip:m=ImageChops.multiply(m,clip)
                if sh['opacity']!=1:m=m.point(lambda v:round(v*sh['opacity']))
                p=self.paint(sh['stroke']);m=ImageChops.multiply(m,p.getchannel('A'));p.putalpha(m);out.alpha_composite(p)
        return out.resize((self.w,self.h),Image.Resampling.LANCZOS)
    def svg(self):
        defs=[];nodes=[]
        for n,sh in enumerate(self.shapes):
            attrs=[f'd="{sh["d"]}"']
            for kind in ['fill','stroke']:
                paint=sh[kind]
                if isinstance(paint,dict):
                    gid=f'{kind}{n}';v=paint['direction']=='vertical';end='x1="0" y1="0" x2="0" y2="1"' if v else 'x1="0" y1="0" x2="1" y2="0"'
                    stops=''.join(f'<stop offset="{p:g}" stop-color="{c[:7]}"'+(f' stop-opacity="{int(c[7:9],16)/255:.4f}"' if len(c)==9 else '')+'/>' for p,c in paint['stops'])
                    defs.append(f'<linearGradient id="{gid}" {end}>{stops}</linearGradient>');attrs.append(f'{kind}="url(#{gid})"')
                else: attrs.append(f'{kind}="{paint if paint is not None else "none"}"')
            if sh['stroke']:attrs.extend([f'stroke-width="{sh["sw"]}"','stroke-linejoin="round"','stroke-linecap="round"'])
            if sh['opacity']!=1:attrs.append(f'opacity="{sh["opacity"]}"')
            if sh['clip']:
                defs.append(f'<clipPath id="clip{n}"><path d="{sh["clip"]}"/></clipPath>');attrs.append(f'clip-path="url(#clip{n})"')
            nodes.append('<path '+' '.join(attrs)+'/>')
        return f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" viewBox="0 0 {self.w} {self.h}"><defs>'+''.join(defs)+'</defs>'+''.join(nodes)+'</svg>\n'

GOLD=gradient((0,'#fffac0'),(.16,'#ffe965'),(.38,'#ffbe0c'),(.69,'#efa500'),(1,'#b96900'))
GOLD_H=gradient((0,'#aa5700'),(.17,'#ffdc2e'),(.42,'#fff78b'),(.65,'#e8a204'),(1,'#a95c00'),direction='horizontal')
FAMILIES={
'silver-cyan':dict(outer='#187da8',rim=gradient((0,'#e6ffff'),(.14,'#a1eaff'),(.48,'#6ac9e8'),(.82,'#b6f6ff'),(1,'#278bb9')),body=gradient((0,'#a9e7f6'),(.5,'#64c4e8'),(1,'#9de8f6')),inner=GOLD,plate=gradient((0,'#5ba8df'),(.6,'#548fcb'),(1,'#6fb7e7')),crease='#e8ffff',shape='soft-scallop',plateEdge='#9bdcef'),
'bronze-orange':dict(outer='#7b3900',rim=gradient((0,'#f3a039'),(.13,'#d8790d'),(.48,'#be5700'),(.8,'#ae4500'),(1,'#cf7107')),body=gradient((0,'#c36a0a'),(1,'#a74700')),inner=gradient((0,'#fff4c9'),(1,'#f4d6a5')),plate=gradient((0,'#9a4600'),(1,'#803200')),crease='#ffbc61',shape='miter-shoulder',plateEdge='#c76a12'),
'prismatic-purple-gold':dict(outer='#8c8500',rim=GOLD,body=gradient((0,'#8881df'),(.3,'#a78ce7'),(.53,'#a0c7e3'),(.7,'#ec9ed8'),(1,'#c77ce3')),inner=gradient((0,'#f5deff'),(.5,'#e3c9f8'),(1,'#fff0fe')),plate=gradient((0,'#76a3ca'),(.6,'#6aa5c0'),(1,'#83bfc3')),crease='#fff0ae',shape='single-crown',plateEdge='#b3d7de'),
'gold-highlight':dict(outer='#b56c00',rim=GOLD,body=gradient((0,'#fff04a'),(.4,'#ffd31b'),(1,'#ffbd00')),inner=gradient((0,'#ca2df5'),(.3,'#a912e9'),(.7,'#cf36f4'),(1,'#e861fc')),plate=gradient((0,'#efa800'),(1,'#d57d00')),crease='#fffabb',shape='double-crown',plateEdge='#ffdc3f')}

def add(name,scene,kind,logical,slices=None,edges=None,notes=None,checks=None):
    ASSETS.append(dict(name=name,scene=scene,kind=kind,recommendedLogicalSize=logical,slice=slices,edges=edges or {},notes=notes or [],checks=checks or {}))

for family,p in FAMILIES.items():
    s=Scene(128,128)
    if family=='bronze-orange':
        outer='M10,2 H118 L126,10 V118 L118,126 H10 L2,118 V10 Z'
        body='M12,7 H116 L121,12 V116 L116,121 H12 L7,116 V12 Z'
        inner=rect(18,17,92,94);hole=rect(22,21,84,86)
    else:
        outer=rr(2,2,124,124,15 if family=='silver-cyan' else 14)
        body=rr(7,7,114,114,11);inner=rr(17,17,94,94,2);hole=rr(22,22,84,84,1)
    s.path(outer,p['rim'],p['outer'],1.5)
    s.path(body,p['body'])
    # Bevel shade stays on the surface; no external cast shadow.
    s.path('M8,22 V111 Q8,120 17,120 H110 L119,111 V22',None,'#132e4c',1,opacity=.16)
    s.path('M12,5 H113 Q123,5 123,15',None,p['crease'],1.6,opacity=.9)
    if family!='bronze-orange':
        s.path('M-12,48 L42,-6 H68 L-12,73 Z','#ffffff',opacity=.2,clip=body)
        s.path('M67,134 L130,71 V93 L88,134 Z','#ffffff',opacity=.21,clip=body)
    else:
        s.path('M3,13 L18,27 V112 L3,121 Z','#f19022',opacity=.5)
        s.path('M125,13 L110,27 V112 L125,121 Z','#8c3600',opacity=.45)
    s.path(inner,p['inner'])
    # Transparent center is made explicitly at export; the SVG uses evenodd frame cutout.
    s.path(hole,'#000000')
    add('card-frame-'+family,s,'nine-slice-frame',[180,250],[24,24,24,24],dict(top='stretch',right='stretch',bottom='stretch',left='stretch',center='transparent'),['Place separate crest header over top edge. Center cutout carries no illustration, label, or shadow.'],dict(cutout=hole,transparentCorners=True))
    h=Scene(160,58)
    if family=='silver-cyan':
        crest='M4,22 Q8,25 12,19 Q39,2 63,11 L80,18 L97,11 Q121,2 148,19 Q152,25 156,22 L154,43 Q151,53 141,54 H19 Q9,53 6,43 Z'
        glint='M9,20 Q37,2 63,12 L80,20 L97,12 Q124,2 151,20'
    elif family=='bronze-orange':
        crest='M4,23 L11,15 V10 Q11,3 23,3 H137 Q149,3 149,10 V15 L156,23 V49 L147,55 H13 L4,49 Z'
        glint='M15,13 V10 Q15,7 25,7 H135 Q145,7 145,13'
    elif family=='prismatic-purple-gold':
        crest='M4,31 L13,23 V13 Q13,7 26,7 H57 L80,0 L103,7 H134 Q147,7 147,13 V23 L156,31 V51 Q153,56 145,56 H15 Q7,56 4,51 Z'
        glint='M17,18 V14 Q17,11 28,11 H58 L80,4 L102,11 H132 Q143,11 143,18'
    else:
        crest='M3,31 L15,23 L22,13 H47 L61,0 L80,15 L99,0 L113,13 H138 L145,23 L157,31 V48 Q153,55 144,55 H16 Q7,55 3,48 Z'
        glint='M7,29 L18,25 L25,17 H49 L61,4 L80,19 L99,4 L111,17 H135 L142,25 L153,29'
    h.path(crest,p['rim'],p['outer'],1.2)
    if family=='prismatic-purple-gold':h.path('M15,30 H145 V51 H15 Z',p['body'],clip=crest)
    h.path(glint,None,p['crease'],2)
    h.path('M13,51 H147',None,p['outer'],1,opacity=.28)
    if family=='prismatic-purple-gold':h.path(star(80,18,8,.49),GOLD,'#c39109',.6)
    add('card-crest-'+family,h,'fixed-header',[158,58],None,dict(scale='uniform'),['Crest includes no number plate. Overlap frame top; family silhouette differs from reference observation.'],dict(transparentCorners=True))
    plate=Scene(136,38);plate.path(rr(1,1,134,36,11),p['plate'],p['plateEdge'],1.5)
    plate.path('M12,3 H124',None,'#ffffff',1,opacity=.2)
    add('number-plate-'+family,plate,'nine-slice-plate',[128,36],[12,12,12,12],dict(top='stretch',right='stretch',bottom='stretch',left='stretch',center='stretch'),['No numbers or rank star baked in. Keep live number and separately supplied symbol above plate.'],dict(transparentCorners=True))

lock=Scene(48,58)
lock.path('M11,27 V17 C11,1 37,1 37,17 V27 H29 V17 C29,10 19,10 19,17 V27 Z',GOLD,'#8b5b00',1.4)
lock.path('M15,23 V17 C15,7 33,7 33,17 V23',None,'#fff2a2',1.5)
lock.path(rr(3,23,42,32,12),GOLD,'#875500',1.6)
lock.path(rr(7,27,34,24,8),gradient((0,'#ffe45a'),(1,'#df9e00')),'#ffd952',1)
lock.path(circle(24,36,3.4),'#704200')
lock.path('M22,38 H26 L27,46 H21 Z','#704200')
lock.path('M12,29 Q24,26 36,29',None,'#fff6ad',1.3)
add('gold-padlock',lock,'icon',[32,38],None,dict(scale='uniform'),['Shackle opening and outside remain transparent. Keyhole is geometry.'],dict(transparentCorners=True))

rail=Scene(44,128)
rail.path(rect(2,0,40,128),'#ac6900')
rail.path(rect(3,0,8,128),GOLD_H)
rail.path(rect(33,0,8,128),GOLD_H)
rail.path(rect(11,0,22,128),gradient((0,'#16475d'),(.26,'#4989b3'),(.58,'#347a9e'),(1,'#1e5169'),direction='horizontal'))
rail.path(rect(12,0,2.5,128),'#8fd9f6',opacity=.36)
rail.path(rect(30,0,2,128),'#b1f2ff',opacity=.45)
rail.path(rect(4,0,1,128),'#fff8a8')
rail.path(rect(39,0,1,128),'#fff2a2')
rail.path(rect(1,0,1,128),'#623c00',opacity=.7)
add('progress-rail-gold-glass',rail,'vertical-rail',[42,900],[0,10,0,10],dict(top='repeat-y or stretch-y',bottom='repeat-y or stretch-y',left='fixed',right='fixed',seamlessY=True),['No endpoints: repeat/stretch vertically. Filled geometry is separate and clipped by live progress.'])

fill=Scene(44,128);clip=rect(11,0,22,128)
fill.path(clip,gradient((0,'#49c3e3'),(.35,'#b3f1f3'),(.66,'#69d4df'),(1,'#f4e69c'),direction='horizontal'))
rng=random.Random(53813)
for j in range(43):
    x=rng.uniform(11,33);y=rng.uniform(9,119);r=rng.uniform(3.2,7.5);c=rng.choice(['#ffe900','#ffd61a','#fff341','#ffdc00','#17cce6','#00aed3','#42e4e9'])
    rotation=rng.uniform(-2,-.7)
    for yy in (y-128,y,y+128):fill.path(star(x,yy,r,.46,5,rot=rotation),c,clip=clip)
for x,y in [(16,22),(29,68),(18,107)]:
    fill.path(sparkle(x,y,3),'#ffffff',opacity=.8,clip=clip)
add('progress-fill-star-glitter',fill,'vertical-fill',[42,900],[0,10,0,10],dict(top='repeat-y',bottom='repeat-y',left='fixed',right='fixed',seamlessY=True),['Small abstract stars are geometry; no screenshot pixels. Repeat at original aspect, clip extent to progress.'])

badge=Scene(150,62)
# Body maintains 150x48 logical nameplate area; raised crest extends above.
badge.path('M9,13 L17,10 L17,7 L23,9 L26,5 L29,10 H43 L47,6 L52,10 H98 L103,6 L107,10 H121 L124,5 L127,9 L133,7 L133,10 L141,13 L136,20 H14 Z',GOLD,'#bc6d00',.8)
badge.path('M10,48 L18,53 L18,58 L23,55 L28,60 L31,54 H119 L122,60 L127,55 L132,58 V53 L140,48 Z',GOLD,'#bc6d00',.8)
badge.path(rr(2,15,146,39,13),GOLD,'#ba6b00',1.2)
badge.path(rr(7,20,136,28,8),gradient((0,'#177ba6'),(.55,'#02688f'),(1,'#07537c')),'#ffe65b',1.6)
badge.path('M56,17 Q55,4 68,4 Q75,-1 82,4 Q95,4 94,17 Z',GOLD,'#ba6b00',1)
badge.path(star(75,12,9,.5,10),'#24d4ee','#078ea9',.8)
badge.path(star(75,12,5.6,.48),'#ffe135','#ffb700',.6)
badge.path('M15,18 H53 M97,18 H136',None,'#fff39b',1.3)
badge.h=48
for shape in badge.shapes:
    shape['d']=scale_y(shape['d'],48/62)
add('progress-badge-538-blank',badge,'fixed-badge',[150,48],None,dict(scale='uniform'),['Blank numeric field; total badge source and recommended size are 150x48 including raised crest and bottom scroll. Live 538 belongs in renderer.'],dict(transparentCorners=True))

scroll=Scene(184,42)
scroll.path('M3,8 Q16,16 39,7 Q55,2 73,14 Q79,18 88,16 L92,18 L96,16 Q105,18 111,14 Q129,2 145,7 Q168,16 181,8 Q181,24 168,30 Q147,38 127,27 Q111,18 99,22 Q97,28 92,28 Q87,28 85,22 Q73,18 57,27 Q37,38 16,30 Q3,24 3,8 Z','#3c8196')
scroll.path('M4,6 Q17,14 40,5 Q55,0 74,12 Q79,16 88,14 L92,17 L96,14 Q105,16 110,12 Q129,0 144,5 Q167,14 180,6 Q179,20 166,25 Q147,32 128,22 Q112,14 99,18 Q97,24 92,24 Q87,24 85,18 Q72,14 56,22 Q37,32 18,25 Q5,20 4,6 Z',GOLD,'#aa6800',1.3)
scroll.path('M9,8 Q20,16 41,8 Q57,3 74,14 M110,14 Q127,3 143,8 Q164,16 175,8',None,'#fff7aa',2)
scroll.path(circle(92,18,3.2),gradient((0,'#fff88d'),(1,'#eea800')))
add('title-gold-scroll',scroll,'ornament',[170,39],None,dict(scale='uniform'),['No letters or title shadow included. Surface bottom blue line is an intrinsic bevel.'],dict(transparentCorners=True))

crest=Scene(72,64)
crest.path(star(36,30,29,.76,10),'#13c4e4','#087aab',2)
crest.path(star(36,28,26,.77,10),'#59eaf2')
crest.path(star(36,30,20,.48),GOLD,'#e1a70e',1)
crest.path(star(36,29,16.2,.48),gradient((0,'#fff592'),(1,'#ffd51d')))
add('title-star-crest',crest,'ornament',[58,52],None,dict(scale='uniform'),['Reference-inspired abstract title emblem, separated from title letters and external shadow.'],dict(transparentCorners=True))

bg=Scene(128,128);bg.path(rect(0,0,128,128),'#039bcf')
# Periodic star field; all copies share geometry and opacity at tile edges.
for cx,cy,r,o in [(12,12,14,.055),(73,18,9,.045),(44,69,17,.04),(108,92,13,.055),(5,111,8,.05),(87,53,7,.035)]:
    for ox in (-128,0,128):
        for oy in (-128,0,128):bg.path(star(cx+ox,cy+oy,r,.55,5),'#80e0ed',opacity=o)
add('background-blue-star-tile',bg,'repeat-texture',[128,128],None,dict(x='repeat',y='repeat',seamlessXY=True),['Seamless flat-blue base with subtle star surface texture. Apply live background gradient independently if needed.'])


def nine_slice(im,w,h,slices):
    t,r,b,l=slices;out=Image.new('RGBA',(w,h));xs=[0,l,im.width-r,im.width];ys=[0,t,im.height-b,im.height];dx=[0,l,w-r,w];dy=[0,t,h-b,h]
    for j in range(3):
        for i in range(3):
            piece=im.crop((xs[i],ys[j],xs[i+1],ys[j+1]));piece=piece.resize((dx[i+1]-dx[i],dy[j+1]-dy[j]),Image.Resampling.LANCZOS);out.alpha_composite(piece,(dx[i],dy[j]))
    return out

def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()

def export():
    for path in [WORK,AUTHOR,PROD,STAGE]:path.mkdir(parents=True,exist_ok=True)
    manifest={'pack':'networth13-geometry-v001','status':'proposal-review-pending','generatedAt':datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).isoformat(),'referenceObservation':['MGV03-S02-D.png','MGV03-S02-E.png','MGV03-S02-F.png'],'creationMethod':'Original code geometry; shared vector path scene; Pillow 4x supersampling. Reference images viewed only; zero reference-pixel extraction. No new dependencies.','externalCastShadow':False,'textAndNumbersBaked':False,'illustrationBaked':False,'files':[],'unverified':['Native UX Studio assembly by parent is pending.','SVG and Pillow rasterizers share geometry but pixel-equivalent SVG rendering was not verified in browser.','Family color fidelity is visual interpretation; no screenshot pixels sampled.'],'drafts':[]}
    rendered={}
    for a in ASSETS:
        n=a['name'];s=a['scene'];im=s.render();svg=s.svg()
        cutout=a['checks'].get('cutout')
        if cutout:
            # Punch from alpha only. SVG output uses one shared mask on every path.
            m=s.mask(cutout).resize(im.size,Image.Resampling.LANCZOS);im.putalpha(ImageChops.subtract(im.getchannel('A'),m))
            svg=svg.replace('</defs>','<mask id="framehole"><rect width="128" height="128" fill="white"/><path d="'+cutout+'" fill="black"/></mask></defs><g mask="url(#framehole)">').replace('</svg>','</g></svg>')
        rendered[n]=im
        (AUTHOR/f'{n}.svg').write_text(svg)
        im.save(AUTHOR/f'{n}.png',optimize=True)
        im.save(AUTHOR/f'{n}.webp',lossless=True,exact=True,method=6)
        for target in [PROD,STAGE]:
            for ext in ['png','webp']:shutil.copy2(AUTHOR/f'{n}.{ext}',target/f'{n}.{ext}')
        entry={k:v for k,v in a.items() if k not in ['scene','checks']};entry['sourceSize']=[s.w,s.h];entry['contentBounds']=list(im.getbbox()) if im.getbbox() else None;entry['visibleBoundsAlpha8']=list(im.getchannel('A').point(lambda v:255 if v>=8 else 0).getbbox());entry['sliceOrder']='top,right,bottom,left';entry['files']=[]
        for base,label,exts in [(AUTHOR,'authoring',['svg','png','webp']),(PROD,'production',['png','webp']),(STAGE,'staging',['png','webp'])]:
            for ext in exts:
                path=base/f'{n}.{ext}';entry['files'].append({'role':label,'file':path.name,'path':str(path.relative_to(ROOT)),'sha256':sha(path),'bytes':path.stat().st_size,'sourceSize':[s.w,s.h],'slice':a['slice'],'sliceOrder':'top,right,bottom,left','edges':a['edges'],'recommendedLogicalSize':a['recommendedLogicalSize']})
        manifest['files'].append(entry)
    (AUTHOR/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    for p in [PROD,STAGE]:shutil.copy2(AUTHOR/'manifest.json',p/'manifest.json')
    # Proof sheet is intentionally isolated from importable assets.
    W=1180;H=1190;sheet=Image.new('RGBA',(W,H),'#d8e0e7');d=ImageDraw.Draw(sheet)
    for x in range(0,W,16):
        for y in range(0,H,16):
            if (x//16+y//16)%2==0:d.rectangle((x,y,x+15,y+15),fill='#edf0f4')
    font=ImageFont.load_default()
    d.rectangle((0,0,W,40),fill='#18334d');d.text((16,14),'NETWORTH13 / ORIGINAL CODE GEOMETRY / V001 / PROPOSAL',font=font,fill='white')
    for j,(family,p) in enumerate(FAMILIES.items()):
        x=26+j*235;y=82;d.text((x,55),family,font=font,fill='#193047')
        frame=nine_slice(rendered['card-frame-'+family],180,250,[24]*4)
        sheet.alpha_composite(frame,(x,y+45))
        header=rendered['card-crest-'+family];sheet.alpha_composite(header,(x+10,y))
        plate=rendered['number-plate-'+family];sheet.alpha_composite(plate,(x+22,y+20))
        d.text((x,y+312),'180x250 nine-slice preview',font=font,fill='#193047')
        sheet.alpha_composite(rendered['card-frame-'+family],(x,y+345))
        sheet.alpha_composite(rendered['card-crest-'+family],(x,y+490))
        sheet.alpha_composite(rendered['number-plate-'+family],(x,y+555))
    x=998
    for j in range(7):sheet.alpha_composite(rendered['progress-rail-gold-glass'],(x,68+j*128))
    for j in range(4):sheet.alpha_composite(rendered['progress-fill-star-glitter'],(x,68+3*128+j*128))
    sheet.alpha_composite(rendered['progress-badge-538-blank'],(x-53,440))
    sheet.alpha_composite(rendered['gold-padlock'],(1070,90))
    d.text((980,1000),'rail repeat / no shadow',font=font,fill='#193047')
    sheet.alpha_composite(rendered['title-gold-scroll'],(30,760));sheet.alpha_composite(rendered['title-star-crest'],(250,747));sheet.alpha_composite(rendered['progress-badge-538-blank'],(360,748));sheet.alpha_composite(rendered['gold-padlock'],(550,750))
    d.text((30,825),'Title scroll / crest / blank badge / separate padlock',font=font,fill='#193047')
    tile=rendered['background-blue-star-tile']
    for j in range(2):
        for i in range(6):sheet.alpha_composite(tile,(26+i*128,870+j*128))
    d.text((30,1142),'Background tile 6x2 / alpha and PNG-WebP RGBA checks in validation.json',font=font,fill='#193047')
    sheet.convert('RGB').save(WORK/'geometry-contact-sheet.png')
    # No screenshot opens here: only own output files used for validation.
    checks=[]
    for a in ASSETS:
        n=a['name'];png=Image.open(AUTHOR/f'{n}.png').convert('RGBA');webp=Image.open(AUTHOR/f'{n}.webp').convert('RGBA');svg=(AUTHOR/f'{n}.svg').read_text();row={'name':n,'size':list(png.size),'pngWebpRGBAEqual':png.tobytes()==webp.tobytes(),'noTextNodes':not re.search(r'<(?:text|image|foreignObject)\b',svg),'noFilterOrExternalShadow':not re.search(r'<filter\b|drop-shadow|feGaussianBlur',svg)}
        if a['checks'].get('transparentCorners'):row['transparentCornerPixels']=all(png.getpixel(xy)[3]==0 for xy in [(0,0),(png.width-1,0),(0,png.height-1),(png.width-1,png.height-1)])
        if a['kind']=='nine-slice-frame':row['transparentCenter']=png.getpixel((64,64))[3]==0;alpha=png.getchannel('A');row['cornerSafeWithinSlice24']=len({alpha.crop((0,y,128,y+1)).tobytes() for y in range(25,103)})==1 and len({alpha.crop((x,0,x+1,128)).tobytes() for x in range(25,103)})==1
        if n in ['progress-rail-gold-glass','progress-fill-star-glitter']:row['topBottomRGBAEqual']=png.crop((0,0,44,1)).tobytes()==png.crop((0,127,44,128)).tobytes()
        row['contentBounds']=list(png.getbbox());visible=png.getchannel('A').point(lambda v:255 if v>=8 else 0).getbbox();row['visibleBoundsAlpha8']=list(visible);margins=[visible[0],visible[1],png.width-visible[2],png.height-visible[3]];row['visibleMargins']=margins;row['noExcessWhitespace']=max(margins)<=max(10,round(min(png.size)*.12));checks.append(row)
    booleans=[v for row in checks for k,v in row.items() if isinstance(v,bool)]
    validation={'passed':all(booleans),'checks':checks,'booleanAssertions':len(booleans),'failures':sum(not v for v in booleans),'contactSheet':str((WORK/'geometry-contact-sheet.png').relative_to(ROOT)),'proofMethod':'PNG↔lossless WebP decoded RGBA byte equality; alpha corners; center cutout; SVG node/filter audit; rail seam equality. Text labels exist only on proof sheet.','unverified':manifest['unverified']}
    (WORK/'validation.json').write_text(json.dumps(validation,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'assets':len(ASSETS),'assertions':len(booleans),'failures':validation['failures'],'manifest':str(AUTHOR/'manifest.json'),'contactSheet':str(WORK/'geometry-contact-sheet.png')},ensure_ascii=False))
    if not validation['passed']:raise SystemExit(1)

if __name__=='__main__':export()
