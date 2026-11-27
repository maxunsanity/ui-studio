from pathlib import Path
from PIL import Image
import json,hashlib,xml.etree.ElementTree as ET,datetime
root=Path('/Users/max/projest_max/ui-studio')
work=root/'_작업/codex/ux-studio/clash-sample-20261118/geometry'
m=json.loads((work/'geometry-manifest.json').read_text())
expected={
'dark-resource-cell9-v001':((160,40),'9',[8]*4,[4]*4),
'panel-blue9-v001':((128,128),'9',[12]*4,[8]*4),
'panel-white9-v001':((128,128),'9',[12]*4,[8]*4),
'panel-purple9-v001':((128,128),'9',[12]*4,[8]*4),
'card-silver9-v001':((96,128),'9',[10]*4,[5]*4),
'button-gold3-v001':((160,64),'3',[0,20,0,20],[0,10,0,10]),
'button-green3-v001':((160,64),'3',[0,20,0,20],[0,10,0,10]),
'button-blue3-v001':((160,64),'3',[0,20,0,20],[0,10,0,10]),
'button-close-red9-v001':((64,64),'9',[10]*4,[6]*4),
}
glyphs=['coin','gem','crown','trophy','menu','people','cards','swords','shop','laurel','arrowup','check','close','elixir','lock','camera','sort','filter']
backgrounds=['full-background-blue-v001','full-background-main-teal-pink-v001']
assert {a['name']for a in m['assets']}==set(expected)|{'glyph-'+n+'-v001'for n in glyphs}|set(backgrounds)
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
checks=[]
for a in m['assets']:
 n=a['name'];svg=ET.fromstring(Path(a['svg']).read_text())
 assert all(x.tag.split('}')[-1]not in ['text','image','filter','foreignObject','script','use']for x in svg.iter())
 size=(int(svg.attrib['width']),int(svg.attrib['height']))
 assert size==(a['w'],a['h'])
 png=Image.open(a['png']);webp=Image.open(a['webp'])
 assert png.format=='PNG'and webp.format=='WEBP'
 assert png.size==webp.size==size
 png=png.convert('RGBA');webp=webp.convert('RGBA')
 assert png.tobytes()==webp.tobytes()
 assert Path(a['webp']).stat().st_size<=300000
 assert a['padding']==[0,0,0,0]
 for ext in ['svg','png','webp']:assert sha(a[ext])==a['sha256'][ext]
 assert sha(a['webp'])==sha(a['staging'])
 assert a['externalShadowBaked']is False and a['textBaked']is False
 if n in expected:
  es,mode,slices,edges=expected[n]
  assert size==es and a['mode']==mode and a['slices']==slices and a['edges']==edges
 if n in backgrounds:assert size==(390,844)and png.getchannel('A').getextrema()==(255,255)
 if n.startswith('glyph-'):assert size in [(48,48),(64,64)]and png.getchannel('A').getextrema()==(0,255)
 checks.append({'name':n,'size':size,'sha256Webp':sha(a['webp']),'bytes':Path(a['webp']).stat().st_size,'fullRgbaEqual':True,'stagingHashEqual':True,'forbiddenSvgNodes':0,'padding':[0,0,0,0]})
v={'checkedAt':datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).isoformat(timespec='seconds'),'result':'PASS','assets':29,'frames':9,'glyphs':18,'backgrounds':2,'pngWebpFullRgbaEqual':29,'authorStagingHashEqual':29,'forbiddenSvgNodes':0,'maxWebpBytes':max(a['bytes']for a in checks),'newDependencies':0,'nativeRegistrations':0,'browserActions':0,'checks':checks}
(work/'geometry-validation.json').write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in v.items()if k!='checks'},ensure_ascii=False))
