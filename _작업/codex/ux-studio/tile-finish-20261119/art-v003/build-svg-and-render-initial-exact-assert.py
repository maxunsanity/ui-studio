#!/usr/bin/env python3
"""Original code-native glyphs; uses existing SVG raster workflow, no screenshot pixels."""
from pathlib import Path
import runpy, re, json, hashlib, copy, xml.etree.ElementTree as ET, shutil
from PIL import Image
REPO=Path('/Users/max/projest_max/ui-studio')
AUTHOR=REPO/'samples/tile-survival/ui-studio/assets/authoring/tile-finish-v003'
STAGE=REPO/'src/tools/uxStudio/assets/import-staging/tile-finish-20261119'
WORK=REPO/'_작업/codex/ux-studio/tile-finish-20261119/art-v003'
existing=runpy.run_path(str(REPO/'_작업/codex/ux-studio/unique-frames32/geometry/pillow_svg.py'))
render_svg=existing['render_svg']; absolute=existing['absolute']
INK='#347b8e';WHITE='#edfff9'
glyphs=[
 ('hero-book','<path d="M15 9H49Q51 9 51 11V53H17Q13 53 13 49V13Q13 9 15 9Z" fill="#e4fff8" stroke="#347b8e" stroke-width="2.2"/><path d="M21 10V47M16 47H50M17 51H50" fill="none" stroke="#347b8e" stroke-width="2"/><path d="M39 10H46V25L42.5 22L39 25Z" fill="#347b8e"/>'),
 ('hero-document-search','<path d="M14 10H47Q49 10 49 12V29Q43 26 37 29Q28 33 28 43Q28 49 32 54H14Q12 54 12 52V12Q12 10 14 10Z" fill="#edfff9" stroke="#347b8e" stroke-width="1.8"/><path d="M20 19H40M20 28H33M20 37H25" fill="none" stroke="#347b8e" stroke-width="4"/><circle cx="43" cy="43" r="10.5" fill="none" stroke="#347b8e" stroke-width="7.5"/><circle cx="43" cy="43" r="10.5" fill="none" stroke="#edfff9" stroke-width="5"/><path d="M50 50L58 58" fill="none" stroke="#347b8e" stroke-width="8" stroke-linecap="round"/><path d="M50 50L58 58" fill="none" stroke="#edfff9" stroke-width="5" stroke-linecap="round"/>'),
 ('role-rifle','<path d="M7 29H17L21 24H44V27H57V31H46V37H35L32 45H26L27 36H18L10 41H7Z" fill="#edfff9" stroke="#347b8e" stroke-width="2.2" transform="rotate(-38 32 32)"/><path d="M22 21H36V24H22Z" fill="#edfff9" stroke="#347b8e" stroke-width="1.5" transform="rotate(-38 32 32)"/>'),
 ('role-pistol','<path d="M12 19H51V27H30L27 49H18L19 31H12Z" fill="#edfff9" stroke="#347b8e" stroke-width="2.2" transform="rotate(-25 32 32)"/><path d="M30 28H38V35H29" fill="none" stroke="#347b8e" stroke-width="2" transform="rotate(-25 32 32)"/>'),
 ('role-shield','<path d="M32 8L50 15V30Q48 45 32 55Q16 45 14 30V15Z" fill="#edfff9" stroke="#347b8e" stroke-width="2.5"/><path d="M32 14L44 19V30Q42 40 32 48Q22 40 20 30V19Z" fill="none" stroke="#7bacae" stroke-width="2.2"/>'),
 ('growth-up-green','<path d="M32 7L53 31H42V57H22V31H11Z" fill="#71ec45" stroke="#276f36" stroke-width="3" stroke-linejoin="round"/><path d="M17 28L32 11L47 28M26 33V53" fill="none" stroke="#c2ff94" stroke-width="2.2" stroke-linejoin="round"/>'),
 ('growth-up-white','<path d="M32 7L53 31H42V57H22V31H11Z" fill="#edfff9" stroke="#347b8e" stroke-width="3" stroke-linejoin="round"/>')
]
def doc(children,w=64,h=64):
 return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">'+children+'</svg>'
def shifted_path(d,dx,dy):
 tokens=re.findall(r'[MLHVQCZ]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?',absolute(d))
 out=[];cmd='';idx=0
 for t in tokens:
  if t in 'MLHVQCZ':cmd=t;idx=0;out.append(t);continue
  v=float(t);v+=dy if cmd=='V' or (cmd in ('M','L','Q','C') and idx%2) else dx
  out.append(f'{v:g}');idx+=1
 return ' '.join(out)
def shift_element(e,dx,dy):
 a=e.attrib;tag=e.tag.split('}')[-1]
 if tag=='path':a['d']=shifted_path(a['d'],dx,dy)
 elif tag=='circle':a['cx']=str(float(a['cx'])+dx);a['cy']=str(float(a['cy'])+dy)
 elif tag=='rect':a['x']=str(float(a.get('x',0))+dx);a['y']=str(float(a.get('y',0))+dy)
 else:raise ValueError(tag)
 if 'transform' in a:
  m=re.fullmatch(r'rotate\(([^)]+)\)',a['transform']);angle,cx,cy=map(float,re.split(r'[ ,]+',m[1]));a['transform']=f'rotate({angle:g} {cx+dx:g} {cy+dy:g})'
 return e
atlas=ET.Element('svg',{'xmlns':'http://www.w3.org/2000/svg','width':'256','height':'128','viewBox':'0 0 256 128'})
for i,(name,children) in enumerate(glyphs):
 svg=doc(children);(AUTHOR/f'{name}-v003.svg').write_text(svg+'\n')
 render_svg(svg).save(AUTHOR/f'{name}-v003.png')
 root=ET.fromstring(svg);dx,dy=(i%4)*64,(i//4)*64
 for e in root:atlas.append(shift_element(copy.deepcopy(e),dx,dy))
# Remove namespaces from children so the saved atlas is plain editable SVG.
for e in atlas.iter():e.tag=e.tag.split('}')[-1]
svg=ET.tostring(atlas,encoding='unicode')
(AUTHOR/'hero-glyphs-atlas-v003.svg').write_text(svg+'\n')
render_svg(svg).save(AUTHOR/'hero-glyphs-atlas-v003.png')
shutil.copy2(AUTHOR/'hero-glyphs-atlas-v003.png',STAGE/'hero-glyphs-atlas-ui-v003.png')
png=Image.open(AUTHOR/'hero-glyphs-atlas-v003.png')
for i,(name,_) in enumerate(glyphs):
 original=Image.open(AUTHOR/f'{name}-v003.png')
 crop=png.crop(((i%4)*64,(i//4)*64,(i%4+1)*64,(i//4+1)*64))
 assert original.tobytes()==crop.tobytes(),name
print('Rendered',len(glyphs),'glyphs; atlas per-cell exact PNG match passed.')

