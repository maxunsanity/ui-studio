#!/usr/bin/env python3
"""Three TS26 source-observed vector recreations; no original screenshot pixels used."""
from pathlib import Path
import copy,re,runpy,xml.etree.ElementTree as ET,shutil,json,hashlib
from PIL import Image,ImageChops
ROOT=Path('/Users/max/projest_max/ui-studio')
AUTHOR=ROOT/'samples/tile-survival/ui-studio/assets/authoring/tile-finish-v004'
STAGE=ROOT/'src/tools/uxStudio/assets/import-staging/tile-finish-20261119'
render=runpy.run_path(str(ROOT/'_작업/codex/ux-studio/unique-frames32/geometry/pillow_svg.py'))
HEX='<defs><linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff4ad"/><stop offset=".3" stop-color="#ffd676"/><stop offset=".74" stop-color="#ffbd48"/><stop offset="1" stop-color="#d9822f"/></linearGradient><linearGradient id="orange" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dd782b"/><stop offset="1" stop-color="#bc4f22"/></linearGradient></defs><path d="M32 3L56 17V47L32 61L8 47V17Z" fill="url(#gold)" stroke="#a8622f" stroke-width="1.8"/><path d="M32 7L52 19V45L32 57L12 45V19Z" fill="#ffe59a"/><path d="M32 12L48 21V43L32 52L16 43V21Z" fill="url(#orange)" stroke="#d18b40" stroke-width="1.2"/><path d="M12 18L32 7L52 18" fill="none" stroke="#fff9c9" stroke-width="2.5" stroke-linejoin="round"/><path d="M17 46L32 54L47 46" fill="none" stroke="#ffc65f" stroke-width="1.8"/><path d="M25 21L32 24L39 21L38 29L45 32L39 37L39 44L32 41L25 44L24 37L18 32L25 28Z" fill="#ffdf7b" stroke="#e9a847" stroke-width="1"/><path d="M32 25V40M22 32H42M26 25L38 39M38 25L26 39" fill="none" stroke="#fff0a6" stroke-width="1.3" stroke-linecap="round"/>'
ARROW_DEFS='<defs><linearGradient id="whiteArrow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0ffff"/><stop offset=".7" stop-color="#e4fdff"/><stop offset="1" stop-color="#b8efff"/></linearGradient></defs>'
LEFT='<path d="M39 6Q45 6 45 14Q45 18 41 22L33 30L41 38Q45 42 45 47Q45 56 38 56Q35 56 31 52L14 35Q9 30 14 25L31 10Q35 6 39 6Z" fill="url(#whiteArrow)" stroke="#095a73" stroke-width="3" stroke-linejoin="round"/><path d="M15 35L32 51Q36 55 40 53" fill="none" stroke="#78cde9" stroke-width="2.2" stroke-linecap="round"/>'
def shift_path(d,dx,dy,mirror=False):
 tokens=re.findall(r'[MLHVQCZ]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?',render['absolute'](d));out=[];cmd='';i=0
 for t in tokens:
  if t in 'MLHVQCZ':cmd=t;i=0;out.append(t);continue
  v=float(t);vertical=cmd=='V' or (cmd in ('M','L','Q','C') and i%2==1)
  if vertical:v+=dy
  else:v=(64-v if mirror else v)+dx
  out.append(f'{v:g}');i+=1
 return ' '.join(out)
def document(body):return '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">'+body+'</svg>'
# Reflection happens in editable vector coordinates, never by raster editing.
right_root=ET.fromstring(document(ARROW_DEFS+LEFT))
for e in right_root:
 if e.tag.split('}')[-1]=='path':e.attrib['d']=shift_path(e.attrib['d'],0,0,True)
RIGHT=''.join(ET.tostring(e,encoding='unicode') for e in right_root)
glyphs=[('hero-rank-hex',HEX),('hero-prev-chevron',ARROW_DEFS+LEFT),('hero-next-chevron',RIGHT)]
atlas=ET.Element('svg',{'xmlns':'http://www.w3.org/2000/svg','width':'192','height':'64','viewBox':'0 0 192 64'})
for i,(name,body) in enumerate(glyphs):
 svg=document(body);(AUTHOR/f'{name}-v004.svg').write_text(svg+'\n');render['render_svg'](svg).save(AUTHOR/f'{name}-v004.png')
 root=ET.fromstring(svg)
 for child in root:
  e=copy.deepcopy(child)
  if e.tag.split('}')[-1]=='path':e.attrib['d']=shift_path(e.attrib['d'],i*64,0)
  atlas.append(e)
for e in atlas.iter():e.tag=e.tag.split('}')[-1]
svg=ET.tostring(atlas,encoding='unicode');(AUTHOR/'hero-rank-chevrons-atlas-v004.svg').write_text(svg+'\n')
render['render_svg'](svg).save(AUTHOR/'hero-rank-chevrons-atlas-v004.png');shutil.copy2(AUTHOR/'hero-rank-chevrons-atlas-v004.png',STAGE/'hero-rank-chevrons-atlas-ui-v004.png')
img=Image.open(STAGE/'hero-rank-chevrons-atlas-ui-v004.png');assert img.size==(192,64) and img.mode=='RGBA';assert img.getchannel('A').getextrema()==(0,255)
for i,(n,_) in enumerate(glyphs):
 src=Image.open(AUTHOR/f'{n}-v004.png');cell=img.crop((i*64,0,(i+1)*64,64));a=src.getchannel('A');b=cell.getchannel('A')
 assert a.point(lambda v:255 if v>=32 else 0).getbbox()==b.point(lambda v:255 if v>=32 else 0).getbbox(),n
 assert max(abs(x-y) for x,y in zip(a.getdata(),b.getdata()))<=12,n
print('3 source-shaped glyphs rendered; visible bounds/alpha checks passed.')

