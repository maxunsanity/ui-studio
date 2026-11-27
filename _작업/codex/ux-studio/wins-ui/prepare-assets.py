from pathlib import Path
from io import BytesIO
from datetime import datetime, timezone, timedelta
import hashlib
import json
import math
from PIL import Image, ImageDraw, ImageChops

ROOT = Path('/Users/max/projest_max/ui-studio')
BASE = ROOT / 'samples/monopoly-go/ui-studio/assets'
AUTHORING = BASE / 'authoring/wins-ui/v001'
PRODUCTION = BASE / 'production/wins-ui'
MIRROR = ROOT / 'src/tools/uxStudio/assets/import-staging/wins-ui'
SCRATCH = ROOT / '_작업/codex/ux-studio/wins-ui'
MANIFEST = ROOT / '_작업/codex/ux-studio/wins-ui-assets.json'
SCALE = 4

def write_new(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists():
        if path.read_bytes() == data:
            return
        raise RuntimeError('Refusing to overwrite different existing bytes: '+str(path))
    with path.open('xb') as out:
        out.write(data)

def sha(data):
    return hashlib.sha256(data).hexdigest()

def rel(path):
    return str(path.relative_to(ROOT))

def svg(w, h, body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{body}</svg>\n'

def surface(w, h):
    return Image.new('RGBA', (w*SCALE, h*SCALE), (0, 0, 0, 0))

def rect(draw, box, radius, fill):
    x, y, w, h = box
    draw.rounded_rectangle((x*SCALE, y*SCALE, (x+w)*SCALE-1, (y+h)*SCALE-1), radius=radius*SCALE, fill=fill)

def finish(image, w, h):
    return image.resize((w, h), Image.Resampling.LANCZOS)

def line(draw, points, fill, width):
    scaled = [(round(x*SCALE), round(y*SCALE)) for x, y in points]
    draw.line(scaled, fill=fill, width=round(width*SCALE), joint='curve')
    radius = width*SCALE/2
    for x, y in scaled:
        draw.ellipse((round(x-radius), round(y-radius), round(x+radius), round(y+radius)), fill=fill)

def points_svg(points):
    return ' '.join(f'{x:.3f},{y:.3f}' for x, y in points)

def polyline_svg(points, color, width):
    return f'<polyline points="{points_svg(points)}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>'

def fill9():
    image = surface(128, 96)
    rect(ImageDraw.Draw(image), (0, 0, 128, 96), 27, '#f4f0dc')
    return svg(128, 96, '<rect width="128" height="96" rx="27" fill="#f4f0dc"/>'), finish(image, 128, 96)

def mission_row_fill9():
    image = surface(128, 96)
    rect(ImageDraw.Draw(image), (0, 0, 128, 96), 27, '#e3ddc9')
    return svg(128, 96, '<rect width="128" height="96" rx="27" fill="#e3ddc9"/>'), finish(image, 128, 96)

def frame9():
    image = surface(128, 96)
    draw = ImageDraw.Draw(image)
    for box, radius, color in [((0, 0, 128, 96), 27, '#d7a140'), ((2, 2, 124, 92), 25, '#f6d16a'), ((8, 8, 112, 80), 19, '#fffbdf')]:
        rect(draw, box, radius, color)
    rect(draw, (12, 12, 104, 72), 15, (0, 0, 0, 0))
    body = '<defs><mask id="rim"><rect width="128" height="96" fill="white"/><rect x="12" y="12" width="104" height="72" rx="15" fill="black"/></mask></defs>'
    body += '<g mask="url(#rim)"><rect width="128" height="96" rx="27" fill="#d7a140"/><rect x="2" y="2" width="124" height="92" rx="25" fill="#f6d16a"/><rect x="8" y="8" width="112" height="80" rx="19" fill="#fffbdf"/></g>'
    return svg(128, 96, body), finish(image, 128, 96)

def clipboard_clip():
    image = surface(253, 69)
    draw = ImageDraw.Draw(image)
    # The copper rail is an open wire shape; its middle is not a baked paper plate.
    rail = [(5, 23), (5, 57), (98, 57)]
    rail += [(98+57*t/24, 57-5*math.sin(math.pi*t/24)) for t in range(1, 25)]
    rail += [(248, 57), (248, 23), (5, 23)]
    line(draw, rail, '#c78148', 5)
    line(draw, rail, '#edb16d', 2)
    for box, radius, color in [((16, 1, 221, 28), 6, '#246f91'), ((19, 4, 215, 21), 4, '#56a2c2'), ((22, 6, 209, 4), 2, '#9bd1e4')]:
        rect(draw, box, radius, color)
    left = [(5, 34), (5, 55), (5.3, 58), (6.5, 60), (9, 61), (27, 61)]
    right = [(248, 34), (248, 55), (247.7, 58), (246.5, 60), (244, 61), (226, 61)]
    for path in (left, right):
        line(draw, path, '#276f89', 8)
        line(draw, [(x, y-1) for x, y in path], '#58a8c4', 3)
    body = polyline_svg(rail, '#c78148', 5) + polyline_svg(rail, '#edb16d', 2)
    body += '<rect x="16" y="1" width="221" height="28" rx="6" fill="#246f91"/><rect x="19" y="4" width="215" height="21" rx="4" fill="#56a2c2"/><rect x="22" y="6" width="209" height="4" rx="2" fill="#9bd1e4"/>'
    for path in (left, right):
        body += polyline_svg(path, '#276f89', 8) + polyline_svg([(x, y-1) for x, y in path], '#58a8c4', 3)
    return svg(253, 69, body), finish(image, 253, 69)

def reward_rays():
    w, h = 470, 255
    image = surface(w, h)
    pixels = image.load()
    top, bottom = (255, 230, 115), (219, 180, 61)
    for y in range(h*SCALE):
        ratio = y/(h*SCALE-1)
        color = tuple(round(a+(b-a)*ratio) for a,b in zip(top, bottom))+(255,)
        for x in range(w*SCALE):
            pixels[x,y] = color
    rays = Image.new('RGBA', image.size)
    draw = ImageDraw.Draw(rays)
    center = (425, 200)
    triangles = []
    for angle in range(-174, 187, 24):
        points = [center]+[(center[0]+900*math.cos(math.radians(a)), center[1]+900*math.sin(math.radians(a))) for a in (angle-3.6, angle+3.6)]
        triangles.append(points)
        draw.polygon([(round(x*SCALE),round(y*SCALE)) for x,y in points], fill=(255, 251, 181, 112))
    image = Image.alpha_composite(image, rays)
    mask = Image.new('L', image.size)
    rect(ImageDraw.Draw(mask), (0, 0, w, h), 2, 255)
    image.putalpha(mask)
    body = '<defs><linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#ffe673"/><stop offset="1" stop-color="#dbb43d"/></linearGradient><clipPath id="panel"><rect width="470" height="255" rx="2"/></clipPath></defs>'
    body += '<g clip-path="url(#panel)"><rect width="470" height="255" fill="url(#gold)"/>'
    body += ''.join(f'<polygon points="{points_svg(points)}" fill="#fffbb5" fill-opacity="{112/255:.8f}"/>' for points in triangles)+'</g>'
    return svg(w, h, body), finish(image, w, h)

NINE = {'mode':'9','sourceSize':[128,96],'slices':[27,27,27,27],'edges':[27,27,27,27],'padding':[0,0,0,0], 'order':'top right bottom left','repeat':'stretch','sourceCenter':[74,42],'minimumTargetForPositiveCenter':[55,55], 'crop':'none; preserve complete source including transparent corners'}
SPECS = [
    ('common_wins_clipboard-fill9_normal_v001', 'parchment-cream-fill9', fill9, {'nineSlice':NINE,'targetLogicalExample':[525.49,819.42],'stack':'bottom; below frame9 and all clipboard content'}),
    ('common_wins_clipboard-rim-frame9_normal_v001', 'gold-white-rim-frame9', frame9, {'nineSlice':NINE,'targetLogicalExample':[525.49,819.42],'stack':'above matching fill9, same x/y/w/h; preserve transparent center','rimBandsPx':{'outerGold':8,'innerWhite':4,'total':12},'contentInsetRecommendationPx':[27,27,27,27], 'contentInsetPolicy':'recommendation only; asset skin padding remains zero; parent owns approved layout'}),
    ('common_wins_clipboard-clip_normal_v001', 'fixed-blue-metal-clip', clipboard_clip, {'mode':'fixed-image','sourceSize':[253,69],'targetLogicalExample':[253.39,69.30],'objectFit':'contain','sourceRect':[0,0,253,69],'stack':'above clipboard top, centered; reference global x144.55/y86.62','noSlice':True}),
    ('common_wins_weekly-gold-rays_normal_v001', 'fixed-weekly-gold-panel-rays', reward_rays, {'mode':'fixed-image','sourceSize':[470,255],'targetLogicalExample':[469.37,254.66],'objectFit':'contain','sourceRect':[0,0,470,255],'stack':'behind weekly text/progress/rewards and separate frame','noSlice':True,'excludes':['frame','text','numbers','reward pack','progress bar','check icon','external shadow']}),
    ('common_wins_mission-row-fill9_normal_v001', 'beige-mission-row-fill9', mission_row_fill9, {'nineSlice':dict(NINE,edges=[16,16,16,16],minimumTargetForPositiveCenter=[33,33]),'targetLogicalExample':[440,100],'stack':'single row background; reuse for three rows','fill':'#e3ddc9','excludes':['text','icons','border','external shadow']}),
]

def nine_slice(image, size, edge=27):
    output = Image.new('RGBA', size)
    sx = [0, 27, image.width-27, image.width]
    sy = [0, 27, image.height-27, image.height]
    dx = [0, edge, size[0]-edge, size[0]]
    dy = [0, edge, size[1]-edge, size[1]]
    for y in range(3):
        for x in range(3):
            tile = image.crop((sx[x],sy[y],sx[x+1],sy[y+1]))
            tile = tile.resize((dx[x+1]-dx[x],dy[y+1]-dy[y]), Image.Resampling.NEAREST)
            output.paste(tile,(dx[x],dy[y]))
    return output

if MANIFEST.exists():
    raise RuntimeError('Refusing to overwrite previous metadata')
entries, previews = [], []
for stem, role, make, assembly in SPECS:
    destinations = [AUTHORING/(stem+'.svg'),AUTHORING/(stem+'.png'),PRODUCTION/(stem+'.webp'),MIRROR/(stem+'.webp')]
    vector, image = make()
    png = BytesIO(); image.save(png,format='PNG')
    webp = BytesIO(); image.save(webp,format='WEBP',lossless=True,method=6,exact=True)
    encoded = webp.getvalue()
    assert len(encoded)<=300000 and max(image.size)<=4096
    with Image.open(BytesIO(encoded)) as decoded:
        assert decoded.size==image.size and image.tobytes()==decoded.convert('RGBA').tobytes()
    payloads = [vector.encode(),png.getvalue(),encoded,encoded]
    for path,data in zip(destinations,payloads): write_new(path,data)
    alpha = image.getchannel('A')
    assert alpha.getextrema()[0] < 255 and alpha.getextrema()[1] == 255
    if 'frame9' in role:
        assert alpha.getpixel((64,48))==0
        assert alpha.crop((27,27,101,69)).getbbox() is None
    if role=='parchment-cream-fill9': assert alpha.getpixel((64,48))==255
    entry = {'name':stem,'role':role,'size':list(image.size),'assembly':assembly,
        'files':{key:{'path':rel(path),'bytes':len(data),'sha256':sha(data)} for key,path,data in zip(['svgMaster','pngRasterMaster','production','importMirror'],destinations,payloads)},
        'importPath':'/ui-studio/source/assets/import-staging/wins-ui/'+stem+'.webp',
        'encoding':{'format':'WEBP','lossless':True,'method':6,'exact':True,'decodedRGBAEqualsPNG':True,'sameSourceSize':True},
        'alpha':{'range':list(alpha.getextrema()),'center':alpha.getpixel((image.width//2,image.height//2)),'bboxAlpha16':list(alpha.point(lambda a:255 if a>=16 else 0).getbbox()),'bboxAlpha128':list(alpha.point(lambda a:255 if a>=128 else 0).getbbox()),'corners':[alpha.getpixel(p) for p in [(0,0),(image.width-1,0),(0,image.height-1),(image.width-1,image.height-1)]]},
        'status':'제안(검수 대기); generated only, not registered or applied'}
    entries.append(entry);previews.append(image)

paper = nine_slice(previews[0],(525,819))
rim = nine_slice(previews[1],(525,819))
assert rim.getpixel((262,409))[3]==0
assert paper.getpixel((262,409))[3]==255
assert ImageChops.difference(rim.crop((0,0,27,27)),previews[1].crop((0,0,27,27))).getbbox() is None
paper = Image.alpha_composite(paper,rim)
sheet = Image.new('RGBA',(1080,900),'#42454c')
sheet.alpha_composite(paper,(20,65))
sheet.alpha_composite(previews[2],(156,37))
sheet.alpha_composite(previews[3],(580,65))
draw = ImageDraw.Draw(sheet)
draw.text((20,10),'9-slice fill + rim: 525 x 819; clip 253 x 69',fill='white')
draw.text((580,38),'Fixed weekly gold panel / rays: 470 x 255',fill='white')
draw.text((580,345),'128 x 96 source assets at native size',fill='white')
sheet.alpha_composite(previews[0],(580,375)); sheet.alpha_composite(previews[1],(740,375))
draw.text((580,490),'Fill: solid center. Rim: transparent center.',fill='white')
draw.text((580,515),'No text, numbers, frame on rays, or cast shadows baked.',fill='white')
mission = nine_slice(previews[4],(440,100),16)
assert mission.getpixel((220,50)) == (227,221,201,255)
assert mission.getpixel((0,0))[3] == 0
sheet.alpha_composite(mission,(580,565))
draw.text((580,690),'Mission row: 440 x 100; source slices 27 / edges 16.',fill='white')
qa = BytesIO();sheet.convert('RGB').save(qa,format='PNG')
qa_path = SCRATCH/'wins-ui-v001-preview.png';write_new(qa_path,qa.getvalue())
manifest = {'version':1,'assetVersion':'v001','createdAtKST':datetime.now(timezone(timedelta(hours=9))).isoformat(timespec='seconds'),'author':'codex(단이)','status':'제안(검수 대기)',
    'reference':{'path':'docs/reference/monopoly-go/20261116-ten-screens/02_wins.png','size':[324,568],'use':'visual reference only; no screenshot pixels copied','sha256':sha((ROOT/'docs/reference/monopoly-go/20261116-ten-screens/02_wins.png').read_bytes()),'assemblyReference':'_작업/codex/ux-studio/wins-assembly-quick-sheet.md'},
    'creation':{'method':'new native SVG vector artwork, no ImageGen needed for geometric UI shapes','rasterization':'Pillow 4x supersampling, LANCZOS reduction; SVG and raster share the same declared shape geometry and colors','dependencies':'existing Pillow only; no package installed','sourcePreservation':'SVG and RGBA PNG masters retained; PNG/WebP source sizes unchanged; no source crop','prompt':'Create separate parchment cream fill9 and thick gold/white rim frame9, blue clipboard metal clip, gold weekly rays panel from the reference concept. Exclude text, numbers, logos, rewards, checks, UI controls and external drop shadows.'},
    'checks':{'assetCount':5,'eachWebPAtMost300000Bytes':True,'maximumDimensionAtMost4096':True,'productionMirrorSHAEqual':True,'decodedWebPRGBAEqualsPNG':True,'allSourcesHaveTransparentPixels':True,'native9FrameCenterTransparent':True,'native9FillCenterOpaque':True,'native9TopLeftCornerPreservedAt525x819':True,'native9SourcePositiveCenter':[74,42],'missionRowAt440x100HasOpaqueBeigeCenterAndTransparentCorners':True,'missionRowSourceSlices27RenderedEdges16':True},
    'preview':rel(qa_path),'assets':entries,'registration':None,'UIApplied':False,'visualApproval':False,
    'limitations':['Source rasterization uses the same geometry primitives as SVG; browser SVG rendering was not separately compared.','Clip and rays are fixed decorations, not scalable frames.','Reference is low resolution; this is a newly drawn geometric interpretation, not an assertion of exact reproduction.','No actual editor/browser registration or desktop/mobile product QA performed in this subtask.','Parent owns final layout, native text, frame composition and source-content hash registration.']}
write_new(MANIFEST,(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n').encode())
for entry in entries: print(json.dumps({'name':entry['name'],'size':entry['size'],'bytes':entry['files']['production']['bytes'],'sha256':entry['files']['production']['sha256'],'importPath':entry['importPath']},ensure_ascii=False))
print(json.dumps({'manifest':str(MANIFEST),'preview':str(qa_path),'checks':manifest['checks']},ensure_ascii=False))
