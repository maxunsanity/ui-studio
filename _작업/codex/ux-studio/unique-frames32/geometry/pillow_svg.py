"""Render only this pack's SVG subset using the project's existing Pillow Scene."""
from pathlib import Path
import math, re, runpy, xml.etree.ElementTree as ET
from PIL import Image, ImageDraw, ImageColor, ImageChops

base=runpy.run_path(str(Path(__file__).parents[2]/'networth13/geometry/build_geometry.py'))
Scene, flatten, rr, circle = (base[k] for k in ('Scene','flatten','rr','circle'))
S=4

def absolute(d):
    t=re.findall(r'[A-Za-z]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?',d)
    i=0;cmd=None;x=y=0;start=(0,0);control=None;out=[]
    arity={'M':2,'L':2,'H':1,'V':1,'Q':4,'T':2,'C':6}
    while i<len(t):
        if t[i].isalpha():cmd=t[i];i+=1
        c=cmd.upper();rel=cmd.islower()
        if c=='Z':
            out.append('Z');x,y=start;control=None;cmd=None;continue
        n=arity[c];v=list(map(float,t[i:i+n]));i+=n
        if c in ('M','L','Q','C','T') and rel:
            v=[a+(x if j%2==0 else y) for j,a in enumerate(v)]
        elif c=='H' and rel:v[0]+=x
        elif c=='V' and rel:v[0]+=y
        if c=='T':
            q=(2*x-control[0],2*y-control[1]) if control else (x,y)
            v=[*q,*v];c='Q'
        out.append(c+' '.join(map(str,v)))
        if c in ('M','L','Q','C'):x,y=v[-2:]
        elif c=='H':x=v[0]
        elif c=='V':y=v[0]
        control=tuple(v[:2]) if c=='Q' else None
        if c=='M':start=(x,y);cmd='l' if rel else 'L'
    return ' '.join(out)

def rgba(c):return ImageColor.getcolor(c,'RGBA')

def render_svg(svg):
    root=ET.fromstring(svg);w,h=int(root.get('width')),int(root.get('height'))
    scene=Scene(w,h);out=Image.new('RGBA',(w*S,h*S));defs={}
    for e in root.iter():
        kind=e.tag.split('}')[-1]
        if kind in ('linearGradient','radialGradient'):
            stops=[]
            for stop in e:
                p=stop.get('offset','0');p=float(p[:-1])/100 if p.endswith('%') else float(p)
                c=rgba(stop.get('stop-color','#000'));c=(*c[:3],round(c[3]*float(stop.get('stop-opacity','1'))))
                stops.append((p,c))
            defs[e.get('id')]={'stops':stops,'radial':kind=='radialGradient','vertical':e.get('x2','1')=='0'}
    def interp(stops,u):
        if u<=stops[0][0]:return stops[0][1]
        for (a,c),(b,d) in zip(stops,stops[1:]):
            if u<=b:
                v=(u-a)/(b-a);return tuple(round(c[j]*(1-v)+d[j]*v) for j in range(4))
        return stops[-1][1]
    def paint(value,bounds):
        if not value.startswith('url('):return Image.new('RGBA',out.size,rgba(value))
        g=defs[value[5:-1]];stops=g['stops'];p=Image.new('RGBA',out.size,stops[-1][1]);draw=ImageDraw.Draw(p)
        l,t,r,b=(v*S for v in bounds)
        if g['radial']:
            cx,cy=(l+r)/2,(t+b)/2;rx,ry=(r-l)/2,(b-t)/2
            for j in range(256,-1,-1):
                u=j/256;draw.ellipse((cx-u*rx,cy-u*ry,cx+u*rx,cy+u*ry),fill=interp(stops,u))
        else:
            lo,hi=(t,b) if g['vertical'] else (l,r)
            for j in range(math.floor(lo),math.ceil(hi)+1):
                u=max(0,min(1,(j-lo)/max(1,hi-lo)))
                draw.line((0,j,w*S,j) if g['vertical'] else (j,0,j,h*S),fill=interp(stops,u))
        return p
    def walk(e,inherited):
        kind=e.tag.split('}')[-1];a={**inherited,**e.attrib}
        if kind in ('defs','stop','linearGradient','radialGradient'):return
        if kind in ('svg','g'):
            for child in e:walk(child,a)
            return
        if kind=='path':d=a['d']
        elif kind=='rect':d=rr(float(a.get('x',0)),float(a.get('y',0)),float(a['width']),float(a['height']),float(a.get('rx',0)))
        elif kind in ('ellipse','circle'):
            cx,cy=float(a['cx']),float(a['cy']);rx=float(a.get('rx',a.get('r')));ry=float(a.get('ry',a.get('r')))
            pts=[(cx+rx*math.cos(j*math.tau/160),cy+ry*math.sin(j*math.tau/160)) for j in range(161)]
            d='M'+' L'.join(f'{x},{y}' for x,y in pts)+' Z'
        else:raise ValueError('Unsupported SVG element: '+kind)
        paths=flatten(absolute(d))
        if a.get('transform'):
            m=re.fullmatch(r'rotate\(([^)]+)\)',a['transform']);assert m,a['transform']
            angle,cx,cy=map(float,re.split(r'[ ,]+',m[1]));z=math.radians(angle)
            paths=[[(cx+(x-cx)*math.cos(z)-(y-cy)*math.sin(z),cy+(x-cx)*math.sin(z)+(y-cy)*math.cos(z)) for x,y in p] for p in paths]
        coords=[v for p in paths for v in p];bounds=(min(x for x,y in coords),min(y for x,y in coords),max(x for x,y in coords),max(y for x,y in coords))
        d=' '.join('M'+' L'.join(f'{x},{y}' for x,y in p) for p in paths)
        for target in ('fill','stroke'):
            value=a.get(target,'#000' if target=='fill' else 'none')
            if value=='none':continue
            if target=='fill':mask=scene.mask(d)
            else:
                mask=Image.new('L',out.size);draw=ImageDraw.Draw(mask);sw=float(a.get('stroke-width',1))*S
                for p in paths:
                    p=[(round(x*S),round(y*S)) for x,y in p]
                    draw.line(p,fill=255,width=max(1,round(sw)),joint='curve')
                    if a.get('stroke-linecap')=='round':
                        for x,y in (p[0],p[-1]):draw.ellipse((x-sw/2,y-sw/2,x+sw/2,y+sw/2),fill=255)
            alpha=float(a.get('opacity',1))*float(a.get(target+'-opacity',1))
            p=paint(value,bounds);mask=ImageChops.multiply(mask,p.getchannel('A'))
            if alpha!=1:mask=mask.point(lambda v:round(v*alpha))
            p.putalpha(mask);out.alpha_composite(p)
    walk(root,{})
    return out.resize((w,h),Image.Resampling.LANCZOS)
