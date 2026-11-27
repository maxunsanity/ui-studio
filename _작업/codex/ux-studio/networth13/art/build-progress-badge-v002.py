from pathlib import Path
from hashlib import sha256
import importlib.util
import json
import shutil
import xml.etree.ElementTree as ET

from PIL import Image

ROOT=Path('/Users/max/projest_max/ui-studio')
ART=ROOT/'_작업/codex/ux-studio/networth13/art'
AUTHOR=ROOT/'samples/monopoly-go/ui-studio/assets/authoring/networth13/geometry-v001'
PROD=ROOT/'samples/monopoly-go/ui-studio/assets/production/networth13-geometry'
STAGE=ROOT/'src/tools/uxStudio/assets/import-staging/networth13-geometry'
NAME='progress-badge-538-blank-v002'
spec=importlib.util.spec_from_file_location('existing_geometry',ROOT/'_작업/codex/ux-studio/networth13/geometry/build_geometry.py')
geometry=importlib.util.module_from_spec(spec)
spec.loader.exec_module(geometry)


def sha(path):
 return sha256(path.read_bytes()).hexdigest()


def main():
 prior=json.loads((AUTHOR/'manifest.json').read_text())
 old=[entry for entry in prior['files'] if entry['name']!=NAME]
 baseline={file['path']:sha(ROOT/file['path']) for entry in old for file in entry['files']}
 snapshot=ART/'progress-badge-v002-preservation-baseline.json'
 if not snapshot.exists():
  snapshot.write_text(json.dumps({'entries':old,'hashes':baseline},ensure_ascii=False,indent=2)+'\n')
 else:
  assert json.loads(snapshot.read_text())=={'entries':old,'hashes':baseline}
 Scene,gradient,rr,star=geometry.Scene,geometry.gradient,geometry.rr,geometry.star
 gold=geometry.GOLD
 badge=Scene(150,88)
 badge.path('M9,19 L17,16 L17,12 L23,14 L26,10 L29,16 H43 L47,12 L52,16 H98 L103,12 L107,16 H121 L124,10 L127,14 L133,12 L133,16 L141,19 L136,28 H14 Z',gold,'#bc6d00',.8)
 badge.path('M10,73 L18,79 L18,84 L23,81 L28,86 L31,80 H119 L122,86 L127,81 L132,84 V79 L140,73 Z',gold,'#bc6d00',.8)
 badge.path(rr(2,20,146,60,14),gold,'#ba6b00',1.2)
 badge.path(rr(7,28,136,45,10),gradient((0,'#177ba6'),(.55,'#02688f'),(1,'#07537c')),'#ffe65b',1.6)
 badge.path('M55,27 Q54,6 67,6 Q75,0 83,6 Q96,6 95,27 Z',gold,'#ba6b00',1)
 badge.path(star(75,18,12,.5,10),'#24d4ee','#078ea9',.8)
 badge.path(star(75,18,7.2,.48),'#ffe135','#ffb700',.6)
 badge.path('M16,24 H52 M98,24 H134',None,'#fff39b',1.3)
 svg=AUTHOR/f'{NAME}.svg'
 svg.write_text(badge.svg())
 # Read back this SVG's supported path/linearGradient subset into the existing rasterizer.
 tree=ET.parse(svg).getroot();ns={'s':'http://www.w3.org/2000/svg'};paints={}
 for node in tree.findall('s:defs/s:linearGradient',ns):
  paints[node.attrib['id']]=gradient(*[(float(stop.attrib['offset']),stop.attrib['stop-color']) for stop in node],direction='horizontal' if node.attrib['x2']=='1' else 'vertical')
 def paint(value):
  if value in [None,'none']:return None
  return paints[value[5:-1]] if value.startswith('url(#') else value
 parsed=Scene(150,88)
 for node in tree.findall('s:path',ns):
  parsed.path(node.attrib['d'],paint(node.get('fill')),paint(node.get('stroke')),float(node.get('stroke-width',1)))
 im=parsed.render()
 assert im.tobytes()==badge.render().tobytes()
 im.save(AUTHOR/f'{NAME}.png',optimize=True)
 im.save(AUTHOR/f'{NAME}.webp',lossless=True,exact=True,method=6)
 for target in [PROD,STAGE]:
  for ext in ['png','webp']:
   shutil.copyfile(AUTHOR/f'{NAME}.{ext}',target/f'{NAME}.{ext}')
 entry={'name':NAME,'kind':'fixed-badge','recommendedLogicalSize':[141,83],'sourceSize':[150,88],'slice':None,'sliceOrder':'top,right,bottom,left','edges':{'scale':'uniform'},'status':'proposal-review-pending','contentBounds':list(im.getbbox()),'visibleBoundsAlpha8':list(im.getchannel('A').point(lambda value:255 if value>=8 else 0).getbbox()),'notes':['v002 taller150x88 source restores the scoreboard body height; original150x48 asset and name remain unchanged.','Use contain in141x83 parent: uniform141/150 scale yields141x82.72. Native numeric text is separate.','Source numeric safe rect [18,34,114,34], approximately [16.92,31.96,107.16,31.96] at141-wide parent. No text/numerals or external shadow in art.','Vector SVG paths/linear gradients are parsed by the existing4x Pillow rasterizer; native-browser SVG equivalence and final UI text alignment remain parent checks.'],'nativeNumericSafeRectSource':[18,34,114,34],'nativeNumericSafeRectAt141Wide':[16.92,31.96,107.16,31.96],'files':[]}
 for folder,role,extensions in [(AUTHOR,'authoring',['svg','png','webp']),(PROD,'production',['png','webp']),(STAGE,'staging',['png','webp'])]:
  for ext in extensions:
   path=folder/f'{NAME}.{ext}'
   entry['files'].append({'role':role,'file':path.name,'path':str(path.relative_to(ROOT)),'sha256':sha(path),'bytes':path.stat().st_size,'sourceSize':[150,88],'slice':None,'sliceOrder':'top,right,bottom,left','edges':{'scale':'uniform'},'recommendedLogicalSize':[141,83]})
 prior['files']=old+[entry]
 payload=json.dumps(prior,ensure_ascii=False,indent=2)+'\n'
 for folder in [AUTHOR,PROD,STAGE]:(folder/'manifest.json').write_text(payload)
 assert all(sha(ROOT/path)==digest for path,digest in baseline.items())
 assert json.loads((AUTHOR/'manifest.json').read_text())['files'][:-1]==old
 image_webp=Image.open(AUTHOR/f'{NAME}.webp').convert('RGBA')
 assert image_webp.tobytes()==im.tobytes()
 assert im.size==(150,88) and im.getchannel('A').getextrema()==(0,255)
 assert all(im.getpixel(point)[3]==0 for point in [(0,0),(149,0),(0,87),(149,87)])
 assert all(im.getpixel((75,y))[3]==255 and im.getpixel((75,y))[0]<40 for y in range(35,68))
 assert not any(node.tag.split('}')[-1] in ['text','image','foreignObject','filter'] for node in tree.iter())
 assert all((AUTHOR/f'{NAME}.{ext}').read_bytes()==(folder/f'{NAME}.{ext}').read_bytes() for folder in [PROD,STAGE] for ext in ['png','webp'])
 validation={'passed':True,'sourceSize':[150,88],'recommendedLogicalSize':[141,83],'preservedManifestEntries':len(old),'preservedFileHashes':len(baseline),'decodedPngWebpRGBAEqual':True,'svgReadbackRGBAEqual':True,'transparentCorners':True,'noTextImageFilter':True,'blueNumericAreaContinuousY35to67':True,'productionStagingHashesMatch':True,'files':entry['files'],'unverified':['Final native538 text alignment and actual browser rendering belong to parent.']}
 (ART/'progress-badge-v002-validation.json').write_text(json.dumps(validation,ensure_ascii=False,indent=2)+'\n')
 proof=Image.new('RGBA',(600,352),'#dce6f0');proof.alpha_composite(im.resize((600,352),Image.Resampling.NEAREST))
 proof.convert('RGB').save(ART/'progress-badge-v002-proof.png')
 print(json.dumps(validation,ensure_ascii=False))


if __name__=='__main__':main()
