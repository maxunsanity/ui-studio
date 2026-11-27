#!/usr/bin/env python3
"""Editable capsule geometry -> existing SVG renderer -> lossless delivery assets."""
from pathlib import Path
import json, hashlib, shutil, runpy, math, xml.etree.ElementTree as ET
from PIL import Image, ImageDraw, ImageFont, ImageChops
ROOT=Path('/Users/max/projest_max/ui-studio')
ART=ROOT/'_작업/codex/ux-studio/equip-state-finish-20261118/art'
AUTHOR=ROOT/'samples/monopoly-go/ui-studio/assets/authoring/equip-states/v001'
PROD=ROOT/'samples/monopoly-go/ui-studio/assets/production/equip-states/v001'
STAGE=ROOT/'src/tools/uxStudio/assets/import-staging/equip-states/v001'
RENDER=ROOT/'_작업/codex/ux-studio/unique-frames32/geometry/pillow_svg.py'
render_svg=runpy.run_path(str(RENDER))['render_svg']
W,H=244,72
NS={'s':'http://www.w3.org/2000/svg'}

def pill(x,y,w,h):
    r=h/2; k=r*0.5522847498307936
    return f'M{x+r:g},{y:g} H{x+w-r:g} C{x+w-r+k:.6f},{y:g} {x+w:g},{y+r-k:.6f} {x+w:g},{y+r:g} C{x+w:g},{y+r+k:.6f} {x+w-r+k:.6f},{y+h:g} {x+w-r:g},{y+h:g} H{x+r:g} C{x+r-k:.6f},{y+h:g} {x:g},{y+r+k:.6f} {x:g},{y+r:g} C{x:g},{y+r-k:.6f} {x+r-k:.6f},{y:g} {x+r:g},{y:g} Z'

def master(state):
    dy=1.5 if state=='pressed' else 0
    top,bottom,body=('#b9c2b5','#929f8e','#6e7d67') if state=='disabled' else ('#3cdb00','#10bb00','#2b8f00')
    svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="244" height="72" viewBox="0 0 244 72">
<defs><linearGradient id="face-gradient" x1="0" y1="0" x2="0" y2="1"><stop stop-color="{top}"/><stop offset="1" stop-color="{bottom}"/></linearGradient></defs>
<!-- Fixed orthographic front: circular ends, no perspective/GO-diamond coordinates. -->
<!-- The extrusion base remains at y=72; only the rim and green face move when pressed. -->
<path id="extruded-side" d="{pill(0,7,244,65)}" fill="{body}"/>
<path id="front-rim" d="{pill(0,dy,244,65)}" fill="#fffef8"/>
<!-- Face bottom coincides with rim bottom, so there is no horizontal white bottom ring. -->
<path id="front-face" d="{pill(5,5+dy,234,60)}" fill="url(#face-gradient)"/>
</svg>
'''
    return svg

def element_render(svg,element_id):
    tree=ET.fromstring(svg)
    for child in list(tree):
        if child.tag.endswith('path') and child.get('id')!=element_id:tree.remove(child)
    return render_svg(ET.tostring(tree,encoding='unicode'))

def bounds_alpha(im,threshold=8):
    return list(im.getchannel('A').point(lambda v:255 if v>=threshold else 0).getbbox())

def center_coverage_bottom(im):
    # Inspect lower edge coverage only; antialiasing gives a subpixel edge estimate.
    return 60 + sum(im.getpixel((122,y))[3] for y in range(60,72))/255

def three_slice(im,width):
    out=Image.new('RGBA',(width,72))
    out.paste(im.crop((0,0,40,72)),(0,0))
    out.paste(im.crop((40,0,204,72)).resize((width-80,72),Image.Resampling.LANCZOS),(40,0))
    out.paste(im.crop((204,0,244,72)),(width-40,0))
    return out

for folder in (ART,AUTHOR,PROD,STAGE):folder.mkdir(parents=True,exist_ok=True)
shutil.copy2(ROOT/'samples/monopoly-go/ui-studio/assets/authoring/unique-frames32/geometry/equip-button3.svg',ART/'equip-button3.original.svg')
rows=[]; rendered={}; tests=[]
for state in ('normal','pressed','disabled'):
    name=f'equip-button3_{state}_v001'; svg=master(state)
    (AUTHOR/f'{name}.svg').write_text(svg)
    im=render_svg(svg);im.save(AUTHOR/f'{name}.png',optimize=True)
    im.save(AUTHOR/f'{name}.webp','WEBP',lossless=True,exact=True,method=6)
    for folder in (PROD,STAGE):shutil.copy2(AUTHOR/f'{name}.webp',folder/f'{name}.webp')
    webp=Image.open(AUTHOR/f'{name}.webp').convert('RGBA');data=(AUTHOR/f'{name}.webp').read_bytes()
    face=element_render(svg,'front-face');rim=element_render(svg,'front-rim');side=element_render(svg,'extruded-side')
    dy=1.5 if state=='pressed' else 0
    row=dict(state=state,name=name,sourceSvg=str((AUTHOR/f'{name}.svg').relative_to(ROOT)),sourcePng=str((AUTHOR/f'{name}.png').relative_to(ROOT)),sourceWebp=str((AUTHOR/f'{name}.webp').relative_to(ROOT)),production=str((PROD/f'{name}.webp').relative_to(ROOT)),staging=str((STAGE/f'{name}.webp').relative_to(ROOT)),bytes=len(data),sha256=hashlib.sha256(data).hexdigest(),canvas=[244,72],alphaBoundsThreshold8=bounds_alpha(im),faceBoundsThreshold8=bounds_alpha(face),rimBoundsThreshold8=bounds_alpha(rim),sideBoundsThreshold8=bounds_alpha(side),geometry=dict(faceTop=5+dy,faceBottom=65+dy,rimTop=dy,rimBottom=65+dy,baseBottom=72,centerX=122,faceTranslationY=dy,sideThicknessAtCenter=7-dy,capRadius=32.5,faceCapRadius=30),recommendedSlice=[0,40,0,40],recommendedEdges=[0,40,0,40])
    row['observedRaster']=dict(faceBoundsAlpha128=bounds_alpha(face,128),rimBoundsAlpha128=bounds_alpha(rim,128),sideBoundsAlpha128=bounds_alpha(side,128),centerFaceCoverageBottom=center_coverage_bottom(face),centerBaseCoverageBottom=center_coverage_bottom(side),centerSideExposureCoverageEstimate=center_coverage_bottom(side)-center_coverage_bottom(face),coverageTolerancePx=0.27,coverageNote='Existing 4x Pillow polygon renderer includes the boundary sample; raster edge estimate can extend approximately 0.25 px beyond SVG geometry. Alpha128 integer bounds are not subpixel vector bounds.')
    checks=dict(canvas244x72=im.size==(244,72),pngWebpDecodedRGBAEqual=im.tobytes()==webp.tobytes(),webpUnder300000Bytes=len(data)<=300000,sourceProductionStagingByteEqual=all(data==(p/f'{name}.webp').read_bytes() for p in (PROD,STAGE)),allCornersTransparent=all(im.getpixel(p)[3]==0 for p in ((0,0),(243,0),(0,71),(243,71))),baseAt72=side.getchannel('A').getpixel((122,71))==255,noBakedTextImageOrFilter=all(token not in svg for token in ('<text','<image','<filter','foreignObject','drop-shadow')),noWhiteBottomRing=all(max(im.getpixel((122,y))[:3])-min(im.getpixel((122,y))[:3])>20 if state!='disabled' else max(im.getpixel((122,y))[:3])<170 for y in range(math.ceil(65+dy)+1,72)),centerFlatFrom40To204=all(im.crop((x,0,x+1,72)).tobytes()==im.crop((122,0,123,72)).tobytes() for x in range(40,204)))
    for width in (180,244,320):
        sliced=three_slice(im,width); sliced.save(ART/f'{name}_3slice-{width}.png')
        checks[f'width{width}LeftCapUnchanged']=sliced.crop((0,0,40,72)).tobytes()==im.crop((0,0,40,72)).tobytes()
        checks[f'width{width}RightCapUnchanged']=sliced.crop((width-40,0,width,72)).tobytes()==im.crop((204,0,244,72)).tobytes()
        checks[f'width{width}BottomFixed']=bounds_alpha(sliced)[3]==72
    rendered[state]=im;row['checks']=checks;rows.append(row);tests.extend(checks.values())

# Observed pixel transitions supplement vector coordinates; thresholds include AA.
normal=rendered['normal'];pressed=rendered['pressed']
normal_side=element_render(master('normal'),'extruded-side')
pressed_side=element_render(master('pressed'),'extruded-side')
state_checks=dict(extrudedBodyPixelIdentical=normal_side.tobytes()==pressed_side.tobytes(),commonBottomRowPixelIdentical=normal.crop((0,71,244,72)).tobytes()==pressed.crop((0,71,244,72)).tobytes(),sameCanvasAllStates=len({im.size for im in rendered.values()})==1,pressedMovesFrontOnlyBy1point5=rows[1]['geometry']['faceTop']-rows[0]['geometry']['faceTop']==1.5,sideThicknessNormal7Pressed5point5=rows[0]['geometry']['sideThicknessAtCenter']==7 and rows[1]['geometry']['sideThicknessAtCenter']==5.5)
state_checks['observedFrontShiftWithin0point04px']=abs(rows[1]['observedRaster']['centerFaceCoverageBottom']-rows[0]['observedRaster']['centerFaceCoverageBottom']-1.5)<0.04
state_checks['observedNormalSideBetween6point5and7']=6.5<=rows[0]['observedRaster']['centerSideExposureCoverageEstimate']<=7
state_checks['observedPressedSideWithinRasterQuarterPixel']=abs(rows[1]['observedRaster']['centerSideExposureCoverageEstimate']-5.5)<=0.27
tests.extend(state_checks.values())
manifest=dict(schemaVersion=1,createdKST='2026-11-18',status='proposal-awaiting-review',referenceImages=['docs/reference/monopoly-go/video-analysis-20261117/MGV02/frames/game-crops/MGV02-S04-B.png','docs/evidence/20261117-unique-frames32/showroom-phone.jpg'],referenceRead='Both reference images visually inspected before geometry creation.',originalVectorPreserved=str((ART/'equip-button3.original.svg').relative_to(ROOT)),renderMethod='Existing project Pillow SVG subset renderer, 4x supersampling. Circular capsule cubic paths shared by saved SVG masters and raster exports.',renderScript=str(RENDER.relative_to(ROOT)),stateReuse={'hover':'normal','selected':'normal'},layout=dict(canvas=[244,72],centerX=122,baseBottom=72,heightFixed=72,scaling='horizontal-three-slice-only',sliceOrder='top,right,bottom,left',slice=[0,40,0,40],edges=[0,40,0,40],fixedLeftCap=[0,0,40,72],stretchCenter=[40,0,204,72],fixedRightCap=[204,0,244,72],verifiedWidths=[180,244,320]),assumptions=['Capsule orthographic front with circle end profiles; no copied GO diamond or two-point perspective coordinates.','White rim is approximately 5 px along top and sides. Front green and rim end at the same baseline; no white bottom ring.','Normal face y=5..65, fixed extrusion base y=72. Pressed front/rim only translate +1.5 px; side exposure becomes 5.5 px.','Green face gradient #3cdb00 to #10bb00; side #2b8f00. Palette is an implementation proposal, not an extracted/approved product constant.','Disabled preserves geometry with gray palette; hover and selected reuse the normal asset.','No baked text, icon, external cast shadow, or separate pressed tray. Alpha canvas remains identical and is not recropped.'],assets=rows,stateChecks=state_checks)
for folder in (AUTHOR,PROD,STAGE):(folder/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')

# Comparison includes labels only on proof sheet, never on delivery images.
font=ImageFont.load_default(size=18); small=ImageFont.load_default(size=14)
sheet=Image.new('RGBA',(1040,650),'#e9e6d8');d=ImageDraw.Draw(sheet)
d.text((24,18),'EQUIP / same 244 x 72 alpha canvas / fixed base y=72',font=font,fill='#243022')
for i,state in enumerate(('normal','pressed','disabled')):
    x=24+i*342;d.text((x,58),state.upper(),font=font,fill='#243022')
    d.rounded_rectangle((x,88,x+300,192),12,fill='#c6c3b6')
    sheet.alpha_composite(rendered[state],(x+28,102));d.line((x+8,174,x+292,174),fill='#ad9c7b',width=1)
    d.text((x,203),f'face +{rows[i]["geometry"]["faceTranslationY"]} / side {rows[i]["geometry"]["sideThicknessAtCenter"]} px',font=small,fill='#32442c')
d.text((24,254),'Horizontal 3-slice / caps 40 px unchanged / height 72 px',font=font,fill='#243022')
for j,width in enumerate((180,244,320)):
    y=299+j*112
    for i,state in enumerate(('normal','pressed','disabled')):
        x=24+i*342
        sliced=three_slice(rendered[state],width);sheet.alpha_composite(sliced,(x,y))
        d.text((x,y+76),f'{width} x 72 / {state}',font=small,fill='#32442c')
sheet.convert('RGB').save(ART/'equip-states-comparison.png')
validation=dict(passed=all(tests),assertions=len(tests),failures=sum(not x for x in tests),stateChecks=state_checks,assets=[dict(state=r['state'],bytes=r['bytes'],sha256=r['sha256'],checks=r['checks'],alphaBoundsThreshold8=r['alphaBoundsThreshold8'],faceBoundsThreshold8=r['faceBoundsThreshold8'],rimBoundsThreshold8=r['rimBoundsThreshold8'],observedRaster=r['observedRaster']) for r in rows],comparison=str((ART/'equip-states-comparison.png').relative_to(ROOT)))
(ART/'validation.json').write_text(json.dumps(validation,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(validation,ensure_ascii=False,indent=2))
assert validation['passed']
