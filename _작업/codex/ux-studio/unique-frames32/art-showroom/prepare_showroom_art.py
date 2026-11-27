from pathlib import Path
from PIL import Image
import hashlib
import json
import shutil

root = Path('/Users/max/projest_max/ui-studio')
raw = Path('/Users/max/.codex/generated_images/01a1e942-e53f-79c1-95ae-790f625206c8/exec-87f84597-c5bf-4f0a-9b53-7e91dbe9c039.png')
author = root / 'samples/monopoly-go/ui-studio/assets/authoring/unique-frames32/showroom'
prod = root / 'samples/monopoly-go/ui-studio/assets/production/unique-frames32/showroom'
scratch = root / '_작업/codex/ux-studio/unique-frames32/art-showroom'
base = 'showroom_buttons-figurine_normal_v001'
master = author / (base + '.png')
out = prod / (base + '.webp')
for target in (master, out):
    if target.exists():
        raise SystemExit('Refusing to overwrite: ' + str(target))
shutil.copy2(raw, master)
im = Image.open(master).convert('RGBA')
alpha = im.getchannel('A')
bboxes = {str(t): alpha.point(lambda a: 255 if a > t else 0).getbbox() for t in (0, 16, 128)}
# Production-only removal of generator low-alpha exterior noise. Master unchanged.
clean = alpha.point(lambda a: 0 if a <= 16 else a)
im.putalpha(clean)
bbox = clean.getbbox()
tight = im.crop(bbox)
quality = 92
tight.save(out, 'WEBP', quality=quality, method=6, exact=True)
if out.stat().st_size > 300000:
    raise SystemExit('WebP exceeds production limit: ' + str(out.stat().st_size))
check = Image.open(out).convert('RGBA')
check_a = check.getchannel('A')
assert check_a.getextrema() == (0, 255)
assert check_a.getbbox() == (0, 0, *check.size)
assert check.size == tight.size

def info(p):
    image = Image.open(p)
    a = image.getchannel('A')
    return {
        'path': str(p), 'bytes': p.stat().st_size,
        'sha256': hashlib.sha256(p.read_bytes()).hexdigest(),
        'width': image.width, 'height': image.height, 'mode': image.mode,
        'alphaExtrema': a.getextrema(),
        'alphaBbox': {str(t): a.point(lambda x: 255 if x > t else 0).getbbox() for t in (0, 16, 128)},
    }

record = {
    'status': 'proposal-awaiting-review',
    'generation': 'built-in image_gen; new character illustration using observed source as reference only',
    'sourceReference': str(root / 'docs/reference/monopoly-go/video-analysis-20261117/MGV02/frames/game-crops/MGV02-S04-B.png'),
    'sourceRole': 'observation-only; no screenshot pixels used in asset',
    'rawGeneration': str(raw),
    'prompt': str(author / (base + '.prompt.txt')),
    'master': info(master),
    'production': info(out),
    'processing': {'removedAlphaAtOrBelow': 16, 'cropInMasterPixels': bbox,
        'originalAlphaBboxes': bboxes, 'resized': False,
        'format': 'WebP lossy RGB with alpha', 'quality': quality, 'method': 6,
        'externalShadow': False, 'textBakedIn': False,
        'masterPreservedByteForByte': master.read_bytes() == raw.read_bytes()},
    'limitations': ['New illustration, not pixel-identical to source; bow and eye proportions are an interpretation.',
        'No original camera/font/material/Unity settings available.',
        'No live 3D; static raster reference character only.',
        'Asset prepared only; not registered or applied in UI; no browser QA by this agent.']
}
(scratch / 'asset-verification.json').write_text(json.dumps(record, ensure_ascii=False, indent=2) + '\n')
# Preview for inspection only; never used as production background.
canvas = Image.new('RGBA', check.size, '#e8e8e8')
canvas.alpha_composite(check)
canvas.convert('RGB').save(scratch / 'showroom-preview-on-gray.jpg', quality=90)
print(json.dumps(record, ensure_ascii=False, indent=2))
