"""New native UI artwork only; refuses to overwrite any existing resource."""
from pathlib import Path
from PIL import Image, ImageDraw
import hashlib
import io
import json
import math

ROOT = Path('/Users/max/projest_max/ui-studio')
WORK = ROOT / '_작업/codex/ux-studio'
ASSETS = ROOT / 'samples/monopoly-go/ui-studio/assets'
SCALE = 8
CREAM, GOLD = '#faf6e7', '#d7d079'


def fresh(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open('xb') as stream:
        stream.write(data)


def rounded(layers, radius, size=(128, 64)):
    high = Image.new('RGBA', (size[0]*SCALE, size[1]*SCALE))
    draw = ImageDraw.Draw(high)
    for inset, color in layers:
        draw.rounded_rectangle((inset*SCALE, inset*SCALE, (size[0]-inset)*SCALE-1, (size[1]-inset)*SCALE-1), radius=(radius-inset)*SCALE, fill=color)
    return high.resize(size, Image.Resampling.LANCZOS)


def nine_slice(image, size, slices):
    width, height = size
    top, right, bottom, left = slices
    sw, sh = image.size
    assert width >= left+right and height >= top+bottom
    assert sw-left-right > 0 and sh-top-bottom > 0
    sx, sy = [0,left,sw-right,sw], [0,top,sh-bottom,sh]
    dx, dy = [0,left,width-right,width], [0,top,height-bottom,height]
    result = Image.new('RGBA', size)
    for row in range(3):
        for col in range(3):
            target = (dx[col+1]-dx[col],dy[row+1]-dy[row])
            if min(target) <= 0:
                continue
            patch = image.crop((sx[col],sy[row],sx[col+1],sy[row+1]))
            if patch.size != target:
                patch = patch.resize(target,Image.Resampling.BILINEAR)
            result.paste(patch,(dx[col],dy[row]))
    for ix, iy, ox, oy in [(0,0,0,0),(sw-right,0,width-right,0),(0,sh-bottom,0,height-bottom),(sw-right,sh-bottom,width-right,height-bottom)]:
        cw, ch = (left if ix == 0 else right), (top if iy == 0 else bottom)
        assert image.crop((ix,iy,ix+cw,iy+ch)).tobytes() == result.crop((ox,oy,ox+cw,oy+ch)).tobytes()
    return result


def asset(component, stem, svg, image, config, targets=()):
    author = ASSETS / 'authoring' / component / 'v005'
    buffers = {}
    for kind in ['png','webp']:
        stream = io.BytesIO()
        if kind == 'png': image.save(stream,format='PNG',optimize=True)
        else: image.save(stream,format='WEBP',lossless=True,quality=100,method=6,exact=True)
        buffers[kind] = stream.getvalue()
    buffers['svg'] = (svg+'\n').encode()
    paths = {kind:author/(stem+'.'+kind) for kind in ['svg','png','webp']}
    for kind,path in paths.items(): fresh(path,buffers[kind])
    production = ASSETS/'production'/component/(stem+'.webp')
    mirror = ROOT/'src/tools/uxStudio/assets/import-staging'/component/(stem+'.webp')
    fresh(production,buffers['webp']);fresh(mirror,buffers['webp'])
    png = Image.open(io.BytesIO(buffers['png'])).convert('RGBA')
    webp = Image.open(io.BytesIO(buffers['webp'])).convert('RGBA')
    assert png.size == webp.size == image.size
    assert png.tobytes() == webp.tobytes()
    assert all(len(buffers[kind]) <= 300000 for kind in ['png','webp'])
    for size in targets: nine_slice(png,size,config['slices'])
    return {'component':component,'stem':stem,'sourceSize':list(image.size),'authoring':{kind:str(path) for kind,path in paths.items()},
        'production':str(production),'mirror':str(mirror),'importPath':'/ui-studio/source/assets/import-staging/'+component+'/'+stem+'.webp',
        'files':{kind:{'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()} for kind,data in buffers.items()},
        'losslessRgbaEqual':True,'alphaBBox':list(png.getchannel('A').getbbox()),'sliceCornerChecks':[list(s) for s in targets],**config}


def svg(size, content):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{size[0]}" height="{size[1]}" viewBox="0 0 {size[0]} {size[1]}">{content}</svg>'


def nine_config(radius, target, **extra):
    return {'mode':'9','slices':[radius]*4,'fixedEdges':[radius]*4,'padding':[0,0,0,0],'repeat':'stretch',
        'positiveSourceCenter':[128-radius*2,64-radius*2],'minimumTargetSize':[radius*2]*2,'targetSourceRect':target,**extra}


records=[]
records.append(asset('hud-top','common_hud-top_bar-frame-9slice_normal_v002',
    svg((128,64),'<rect x="3" y="3" width="122" height="58" rx="24" fill="none" stroke="#ffffff" stroke-width="6"/>'),
    rounded([(0,'#ffffff'),(6,(0,0,0,0))],27),nine_config(27,[84,16,461,54],outerRadiusPx=27,whiteStrokePx=6),
    [(461,54),(461,80),(461,110),(54,54)]))

gauge_fill=rounded([(0,'#27c4ef')],18)
gauge_frame=rounded([(0,'#ffffff'),(3,'#635f49'),(5,(0,0,0,0))],18)
records.append(asset('bottom-gauge','common_bottom-gauge_fill-9slice_normal_v001',
    svg((128,64),'<rect width="128" height="64" rx="18" fill="#27c4ef"/>'),gauge_fill,
    nine_config(18,[184,928,181,37],outerRadiusPx=18,fill='#27c4ef'),[(181,37),(240,48),(300,64),(36,36)]))
records.append(asset('bottom-gauge','common_bottom-gauge_frame-9slice_normal_v001',
    '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="64" viewBox="0 0 128 64"><path fill="#ffffff" fill-rule="evenodd" d="M18 0H110A18 18 0 0 1 128 18V46A18 18 0 0 1 110 64H18A18 18 0 0 1 0 46V18A18 18 0 0 1 18 0Z M18 3H110A15 15 0 0 1 125 18V46A15 15 0 0 1 110 61H18A15 15 0 0 1 3 46V18A15 15 0 0 1 18 3Z"/><path fill="#635f49" fill-rule="evenodd" d="M18 3H110A15 15 0 0 1 125 18V46A15 15 0 0 1 110 61H18A15 15 0 0 1 3 46V18A15 15 0 0 1 18 3Z M18 5H110A13 13 0 0 1 123 18V46A13 13 0 0 1 110 59H18A13 13 0 0 1 5 46V18A13 13 0 0 1 18 5Z"/></svg>',gauge_frame,
    nine_config(18,[184,928,181,37],outerRadiusPx=18,whiteStrokePx=3,darkStrokePx=2,darkColor='#635f49'),[(181,37),(240,48),(300,64),(36,36)]))

body_fill=Image.new('RGBA',(128,64),CREAM)
body_frame=Image.new('RGBA',(128,64));draw=ImageDraw.Draw(body_frame);draw.rectangle((0,0,127,6),fill='#ffffff');draw.rectangle((0,7,127,14),fill=GOLD)
records.append(asset('bottom-nav','common_bottom-nav_body-fill-9slice_normal_v001',svg((128,64),f'<rect width="128" height="64" fill="{CREAM}"/>'),body_fill,
    nine_config(16,[0,864,551,120],fill=CREAM),[(551,120),(430,120),(700,160),(32,32)]))
records.append(asset('bottom-nav','common_bottom-nav_body-frame-9slice_normal_v001',svg((128,64),f'<path fill="#ffffff" d="M0 0H128V7H0Z"/><path fill="{GOLD}" d="M0 7H128V15H0Z"/>'),body_frame,
    nine_config(16,[0,864,551,120],whiteTopPx=7,goldTopPx=8,goldColor=GOLD),[(551,120),(430,120),(700,160),(32,32)]))

# Fixed crown upper boundary, reconstructed from the source551x984 white-rim samples.
segments=[((0,160),(18,160),(17,148),(12,136)),((12,136),(6,124),(2,118),(5,108)),
    ((5,108),(20,84),(56,48),(89,22)),((89,22),(108,7),(118,0),(130,0)),
    ((130,0),(145,0),(159,11),(180,28)),((180,28),(211,55),(244,85),(254,106)),
    ((254,106),(260,118),(256,128),(252,139)),((252,139),(248,152),(249,160),(260,160))]
curve=[]; normals=[]
for segment in segments:
    for index in range(81):
        if curve and index == 0: continue
        t=index/80;u=1-t;p0,p1,p2,p3=segment
        point=tuple(u**3*p0[k]+3*u*u*t*p1[k]+3*u*t*t*p2[k]+t**3*p3[k] for k in [0,1])
        dx,dy=[3*u*u*(p1[k]-p0[k])+6*u*t*(p2[k]-p1[k])+3*t*t*(p3[k]-p2[k]) for k in [0,1]]
        length=math.hypot(dx,dy);curve.append(point);normals.append((-dy/length,dx/length))
inner7=[(p[0]+n[0]*7,p[1]+n[1]*7) for p,n in zip(curve,normals)]
inner15=[(p[0]+n[0]*15,p[1]+n[1]*15) for p,n in zip(curve,normals)]


def path(points):
    return 'M'+' L'.join(f'{x:.4f} {y:.4f}' for x,y in points)+'Z'


def polygon_image(polygons):
    high=Image.new('RGBA',(260*SCALE,280*SCALE));draw=ImageDraw.Draw(high)
    for points,color in polygons:draw.polygon([(round(x*SCALE),round(y*SCALE)) for x,y in points],fill=color)
    return high.resize((260,280),Image.Resampling.LANCZOS)


fill_points=curve+[(260,280),(0,280)]
white_points=curve+list(reversed(inner7));gold_points=inner7+list(reversed(inner15))
crown_fill=polygon_image([(fill_points,CREAM)])
crown_frame=polygon_image([(white_points,'#ffffff'),(gold_points,GOLD)])
fixed={'mode':'fixed-art','slices':None,'fixedEdges':None,'padding':[0,0,0,0],'fixedTargetSize':[260,280],
    'targetSourceRect':[145,704,260,280],'fit':'contain','minimumTargetSize':None,'resizableNineSlice':False,
    'measurementBasis':{'raisedOutline':[147,704,257,161],'flatTopY':864,'referenceCanvas':[551,984]},
    'geometryStatus':'native cubic reconstruction proposal; source pixel outline observations have +-2px uncertainty'}
records.append(asset('bottom-nav','common_bottom-nav_crown-fill-fixed_normal_v001',svg((260,280),f'<path fill="{CREAM}" d="{path(fill_points)}"/>'),crown_fill,{**fixed,'fill':CREAM}))
records.append(asset('bottom-nav','common_bottom-nav_crown-frame-fixed_normal_v001',svg((260,280),f'<path fill="#ffffff" d="{path(white_points)}"/><path fill="{GOLD}" d="{path(gold_points)}"/>'),crown_frame,{**fixed,'whiteStrokePx':7,'goldStrokePx':8,'goldColor':GOLD}))

# Resource-only QA composite, no source screenshot pixels, GO/icons/text or 3D scene.
preview=Image.new('RGBA',(551,280),'#80919d')
preview.alpha_composite(nine_slice(body_fill,(551,120),[16]*4),(0,160))
preview.alpha_composite(nine_slice(body_frame,(551,120),[16]*4),(0,160))
preview.alpha_composite(crown_fill,(145,0));preview.alpha_composite(crown_frame,(145,0))
preview.alpha_composite(nine_slice(gauge_fill,(181,37),[18]*4),(184,224))
preview.alpha_composite(nine_slice(gauge_frame,(181,37),[18]*4),(184,224))
buffer=io.BytesIO();preview.save(buffer,format='PNG');fresh(WORK/'board-ui-v005-native-preview.png',buffer.getvalue())
metadata={'status':'제안(검수 대기)','authoringVersion':'v005','referenceCanvas':[551,984],
    'sourceMeasurements':'_작업/codex/ux-studio/20261116-board-measurements/independent-measurements.json',
    'referenceCropObservedSize':[1178,657],'cropIsNotPercentDenominator':True,
    'previousWorkerBasis':'_작업/codex/ux-studio/hud-top-9slice-v004-report.md',
    'reuseExistingUpperFill':'/ui-studio/source/assets/import-staging/hud-top/common_hud-top_bar-fill-9slice_normal_v001.webp',
    'noRasterShadows':True,'noSourceScreenshotPixels':True,'noProductCodeOrDesignWrites':True,'resources':records}
fresh(WORK/'board-ui-resources-v005.json',(json.dumps(metadata,ensure_ascii=False,indent=2)+'\n').encode())
print(json.dumps({'count':len(records),'metadata':str(WORK/'board-ui-resources-v005.json'),'preview':str(WORK/'board-ui-v005-native-preview.png'),'files':[{r['stem']:r['files']['webp']['bytes']} for r in records]},ensure_ascii=False))
