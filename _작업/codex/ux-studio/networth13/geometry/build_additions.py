#!/usr/bin/env python3
"""Append requested assets; never regenerate the original 19 resources."""
from PIL import Image,ImageDraw,ImageFont
import json,hashlib,shutil,re
from build_geometry import Scene,gradient,star,rect,WORK,AUTHOR,PROD,STAGE,ROOT
NAMES=['background-full-551x984','next-red-ribbon3','current-arrow-gold']
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def build():
    manifest=json.loads((AUTHOR/'manifest.json').read_text());original=manifest['files'][:19]
    baseline={f['path']:sha(ROOT/f['path']) for a in original for f in a['files']}
    assert len(original)==19 and len(baseline)==133
    snapshot={'existingAssets':original,'hashes':baseline};bp=WORK/'additions-preservation-baseline.json'
    if bp.exists():assert json.loads(bp.read_text())==snapshot,'Existing 19 changed'
    else:bp.write_text(json.dumps(snapshot,ensure_ascii=False,indent=2)+'\n')
    bg=Scene(551,984)
    bg.path(rect(0,0,551,984),gradient((0,'#003c85'),(.30,'#007bbd'),(.68,'#0099d3'),(1,'#009ed8')))
    motifs=[(12,12,14,.055),(73,18,9,.045),(44,69,17,.04),(108,92,13,.055),(5,111,8,.05),(87,53,7,.035)]
    for tx in range(-128,679,128):
        for ty in range(-128,1112,128):
            for x,y,r,o in motifs:bg.path(star(x+tx,y+ty,r,.55,5),'#80e0ed',opacity=o)
    ribbon=Scene(140,40)
    ribbon.path('M1,14 L17,11 L19,32 L3,34 Q1,32 1,29 Z',gradient((0,'#db170c'),(1,'#a80000')),'#9c1007',.7)
    ribbon.path('M121,5 L139,7 V28 Q137,31 123,30 Z',gradient((0,'#c91205'),(1,'#9d0a00')),'#991207',.7)
    ribbon.path('M3,14 L13,19 L17,12 Z','#850a00');ribbon.path('M125,26 L138,29 L128,22 Z','#8e0b00')
    ribbon.path('M6,15 Q7,12 11,13 L127,3 Q134,2 134,6 V27 Q134,30 128,30 L15,39 Q6,39 6,33 Z',gradient((0,'#ff2418'),(.4,'#f5160d'),(1,'#d50000')),'#c81508',.8)
    ribbon.path('M10,14 L126,4 Q131,3 133,5',None,'#ff7b4a',.8);ribbon.path('M11,37 L127,28',None,'#b60900',.8)
    arrow=Scene(32,30)
    arrow.path('M16,2 Q17,2 18,4 L30,23 Q32,27 27,28 H5 Q0,27 2,23 L14,4 Q15,2 16,2 Z',gradient((0,'#fff394'),(.2,'#ffe85a'),(.62,'#ffc72a'),(1,'#e89c06')),'#b37900',1)
    arrow.path('M4,23 L15,5 Q16,4 17,5 L27,21',None,'#fff4a0',1);arrow.path('M5,27 H27',None,'#c18b00',1)
    assets=[
      dict(name=NAMES[0],scene=bg,kind='full-background',recommendedLogicalSize=[551,984],slice=None,edges=dict(fit='full-source 551x984',opaque=True,patternPeriod=[128,128],starAspect='preserved'),notes=['Full gradient top #003c85 to bottom #009ed8. Original star geometry repeats every 128px without tile stretching. No text, UI, or images.']),
      dict(name=NAMES[1],scene=ribbon,kind='horizontal-three-slice-ribbon',recommendedLogicalSize=[140,40],slice=[0,20,0,20],slice3=dict(left=20,right=20,center=100),edges=dict(left='fixed20',right='fixed20',center='stretch-x',y='fixed'),notes=['Source D 550 next-sequence ribbon directly viewed. Blank red fold ribbon; live text is separate.']),
      dict(name=NAMES[2],scene=arrow,kind='fixed-arrow',recommendedLogicalSize=[32,30],slice=None,edges=dict(scale='uniform'),notes=['Source F arrow above 538 directly viewed. Original tight transparent gold geometry; external shadow separate.'])]
    rendered={};entries=[]
    for a in assets:
        n=a['name'];s=a['scene'];im=s.render();rendered[n]=im
        (AUTHOR/f'{n}.svg').write_text(s.svg());im.save(AUTHOR/f'{n}.png',optimize=True);im.save(AUTHOR/f'{n}.webp',lossless=True,exact=True,method=6)
        for out in [PROD,STAGE]:
            for ext in ['png','webp']:shutil.copy2(AUTHOR/f'{n}.{ext}',out/f'{n}.{ext}')
        entry={k:v for k,v in a.items() if k!='scene'};entry.update(sourceSize=[s.w,s.h],status='proposal-review-pending',contentBounds=list(im.getbbox()),visibleBoundsAlpha8=list(im.getchannel('A').point(lambda v:255 if v>=8 else 0).getbbox()),sliceOrder='top,right,bottom,left',files=[])
        for base,label,exts in [(AUTHOR,'authoring',['svg','png','webp']),(PROD,'production',['png','webp']),(STAGE,'staging',['png','webp'])]:
            for ext in exts:
                p=base/f'{n}.{ext}';f=dict(role=label,file=p.name,path=str(p.relative_to(ROOT)),sha256=sha(p),bytes=p.stat().st_size,sourceSize=[s.w,s.h],slice=a['slice'],sliceOrder='top,right,bottom,left',edges=a['edges'],recommendedLogicalSize=a['recommendedLogicalSize'])
                if a.get('slice3'):f['slice3']=a['slice3']
                entry['files'].append(f)
        entries.append(entry)
    manifest['files']=[a for a in manifest['files'] if a['name'] not in NAMES]+entries;assert manifest['files'][:19]==original
    payload=json.dumps(manifest,ensure_ascii=False,indent=2)+'\n'
    for out in [AUTHOR,PROD,STAGE]:(out/'manifest.json').write_text(payload)
    checks=[]
    for a in assets:
        n=a['name'];p=Image.open(AUTHOR/f'{n}.png').convert('RGBA');w=Image.open(AUTHOR/f'{n}.webp').convert('RGBA');svg=(AUTHOR/f'{n}.svg').read_text();bb=p.getchannel('A').point(lambda v:255 if v>=8 else 0).getbbox()
        row=dict(name=n,pngWebpRGBAEqual=p.tobytes()==w.tobytes(),sourceSizeCorrect=list(p.size)==a['recommendedLogicalSize'],noTextOrImage=not bool(re.search(r'<(?:text|image|foreignObject)\b',svg)),noFilterOrExternalShadow=not bool(re.search(r'<filter\b|drop-shadow|feGaussianBlur',svg)),visibleBoundsAlpha8=list(bb),sourceSize=list(p.size))
        if a['kind']=='full-background':
            row['fullyOpaque']=p.getchannel('A').getextrema()==(255,255);row['eachFileBelow300KB']=all((AUTHOR/f'{n}.{e}').stat().st_size<300000 for e in ['svg','png','webp']);row['combinedFilesBelow300KB']=sum((AUTHOR/f'{n}.{e}').stat().st_size for e in ['svg','png','webp'])<300000;row['exactTopBottomColors']=p.getpixel((550,0))[:3]==(0,60,133) and p.getpixel((550,983))[:3]==(0,158,216)
        else:
            row['transparentCorners']=all(p.getpixel(pt)[3]==0 for pt in [(0,0),(p.width-1,0),(0,p.height-1),(p.width-1,p.height-1)]);row['tightVisibleMargins']=max(bb[0],bb[1],p.width-bb[2],p.height-bb[3])<=3
        checks.append(row)
    preserved=all(sha(ROOT/p)==h for p,h in baseline.items());entriesPreserved=json.loads((AUTHOR/'manifest.json').read_text())['files'][:19]==original
    booleans=[v for row in checks for v in row.values() if isinstance(v,bool)]+[preserved,entriesPreserved]
    result=dict(passed=all(booleans),assetCount=3,totalAssetCount=len(manifest['files']),existingAssetHashCount=len(baseline),existingFilesUnchanged=preserved,existing19ManifestEntriesUnchanged=entriesPreserved,assertions=len(booleans),failures=sum(not v for v in booleans),checks=checks,unverified=['Native image fill and live text assembly belong to parent.','SVG browser raster equivalence not checked.'])
    (WORK/'additions-validation.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    sheet=Image.new('RGBA',(830,1030),'#e5e8ee');sheet.alpha_composite(rendered[NAMES[0]],(16,24));d=ImageDraw.Draw(sheet);font=ImageFont.load_default();d.text((16,8),'551x984 FULL BACKGROUND / fixed star proportions',fill='#15324e',font=font)
    for x in range(585,825,12):
        for y in range(50,450,12):d.rectangle((x,y,x+11,y+11),fill='#c4d0dc' if ((x-585)//12+(y-50)//12)%2 else '#f0f3f6')
    sheet.alpha_composite(rendered[NAMES[1]],(607,80));sheet.alpha_composite(rendered[NAMES[2]],(661,180));sheet.alpha_composite(rendered[NAMES[1]].resize((210,60),Image.Resampling.LANCZOS),(586,285));sheet.alpha_composite(rendered[NAMES[2]].resize((64,60),Image.Resampling.LANCZOS),(659,368))
    d.text((585,460),'RIBBON 140x40 / caps20,20',fill='#15324e',font=font);d.text((585,480),'ARROW 32x30 / tight alpha',fill='#15324e',font=font);d.text((585,510),'No letters or cast shadow',fill='#15324e',font=font);sheet.convert('RGB').save(WORK/'geometry-additions-contact-sheet.png')
    print(json.dumps(result,ensure_ascii=False));assert result['passed']
if __name__=='__main__':build()
