"""Author native rounded-rectangle resources; never modifies existing source/assets."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageChops
import hashlib
import json

ROOT = Path('/Users/max/projest_max/ui-studio')
AUTHORING = ROOT / 'samples/monopoly-go/ui-studio/assets/authoring/hud-top/v004'
PRODUCTION = ROOT / 'samples/monopoly-go/ui-studio/assets/production/hud-top'
MIRROR = ROOT / 'src/tools/uxStudio/assets/import-staging/hud-top'
WIDTH, HEIGHT, RADIUS, STROKE, SCALE = 128, 64, 27, 4, 8
FILL = (240, 235, 219, 255)


def write_new(path, content):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open('xb') as stream:
        stream.write(content)


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def nine_slice(image, width, height):
    assert width >= RADIUS * 2 and height >= RADIUS * 2
    result = Image.new('RGBA', (width, height))
    source_x = (0, RADIUS, WIDTH - RADIUS, WIDTH)
    source_y = (0, RADIUS, HEIGHT - RADIUS, HEIGHT)
    target_x = (0, RADIUS, width - RADIUS, width)
    target_y = (0, RADIUS, height - RADIUS, height)
    for row in range(3):
        for column in range(3):
            size = (target_x[column + 1] - target_x[column], target_y[row + 1] - target_y[row])
            if min(size) <= 0:
                continue
            patch = image.crop((source_x[column], source_y[row], source_x[column + 1], source_y[row + 1]))
            if patch.size != size:
                patch = patch.resize(size, Image.Resampling.BILINEAR)
            result.paste(patch, (target_x[column], target_y[row]))
    return result


def create(role):
    stem = f'common_hud-top_bar-{role}-9slice_normal_v001'
    svg = '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="64" viewBox="0 0 128 64">'
    svg += '<rect width="128" height="64" rx="27" fill="#f0ebdb"/>' if role == 'fill' else '<rect x="2" y="2" width="124" height="60" rx="25" fill="none" stroke="#ffffff" stroke-width="4"/>'
    svg += '</svg>\n'
    svg_path = AUTHORING / (stem + '.svg')
    write_new(svg_path, svg.encode())
    high = Image.new('RGBA', (WIDTH * SCALE, HEIGHT * SCALE))
    draw = ImageDraw.Draw(high)
    draw.rounded_rectangle((0, 0, WIDTH * SCALE - 1, HEIGHT * SCALE - 1), radius=RADIUS * SCALE, fill=FILL if role == 'fill' else (255, 255, 255, 255))
    if role == 'frame':
        inset = STROKE * SCALE
        draw.rounded_rectangle((inset, inset, WIDTH * SCALE - 1 - inset, HEIGHT * SCALE - 1 - inset), radius=(RADIUS - STROKE) * SCALE, fill=(0, 0, 0, 0))
    image = high.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)
    png_path = AUTHORING / (stem + '.png')
    webp_path = PRODUCTION / (stem + '.webp')
    mirror_path = MIRROR / (stem + '.webp')
    assert not png_path.exists() and not webp_path.exists() and not mirror_path.exists()
    png_path.parent.mkdir(parents=True, exist_ok=True)
    image.save(png_path, optimize=True)
    webp_path.parent.mkdir(parents=True, exist_ok=True)
    image.save(webp_path, format='WEBP', lossless=True, quality=100, method=6, exact=True)
    write_new(mirror_path, webp_path.read_bytes())
    png = Image.open(png_path).convert('RGBA')
    decoded = Image.open(webp_path).convert('RGBA')
    assert png.size == decoded.size == (128, 64)
    assert png.tobytes() == decoded.tobytes()
    assert png.getpixel((0, 0))[3] == 0
    assert png.getpixel((64, 32))[3] == (255 if role == 'fill' else 0)
    assert webp_path.stat().st_size <= 300000
    for height in (54, 80, 110):
        rendered = nine_slice(png, 461, height)
        for left in (True, False):
            for top in (True, False):
                sx, sy = (0 if left else WIDTH - RADIUS), (0 if top else HEIGHT - RADIUS)
                tx, ty = (0 if left else 461 - RADIUS), (0 if top else height - RADIUS)
                assert png.crop((sx, sy, sx + RADIUS, sy + RADIUS)).tobytes() == rendered.crop((tx, ty, tx + RADIUS, ty + RADIUS)).tobytes()
        assert rendered.getpixel((230, height // 2))[3] == (255 if role == 'fill' else 0)
        preview = ROOT / f'_작업/codex/ux-studio/9slice-v004-{role}-461x{height}.png'
        assert not preview.exists()
        rendered.save(preview, optimize=True)
    return {
        'role': role, 'svg': str(svg_path), 'png': str(png_path), 'webp': str(webp_path), 'mirror': str(mirror_path),
        'importPath': '/ui-studio/source/assets/import-staging/hud-top/' + stem + '.webp',
        'sourceSize': [128, 64], 'outerRadiusPx': 27, 'outlinePx': 4 if role == 'frame' else 0,
        'color': '#f0ebdb' if role == 'fill' else '#ffffff', 'slice': [27, 27, 27, 27],
        'fixedEdges': [27, 27, 27, 27], 'padding': [0, 0, 0, 0], 'repeat': 'stretch',
        'positiveSourceCenter': [74, 10], 'minimumTargetSize': [54, 54], 'targetExample': [461, 54],
        'alphaBBox': list(png.getchannel('A').getbbox()), 'losslessRgbaEqual': True,
        'checks': '128x64, corner alpha0, center fill255/frame0, exact WebP RGBA, fixed corner checks at 461x54/80/110',
        'files': {kind: {'bytes': path.stat().st_size, 'sha256': digest(path)} for kind, path in [('svg', svg_path), ('png', png_path), ('webp', webp_path)]},
    }


records = [create('fill'), create('frame')]
metadata = ROOT / '_작업/codex/ux-studio/hud-top-9slice-v004-assets.json'
write_new(metadata, (json.dumps(records, ensure_ascii=False, indent=2) + '\n').encode())
print(json.dumps(records, ensure_ascii=False, indent=2))
