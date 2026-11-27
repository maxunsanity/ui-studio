from __future__ import annotations

from datetime import datetime
from hashlib import sha256
from pathlib import Path
import json
import shutil

from PIL import Image, ImageDraw, ImageFont

ROOT = Path('/Users/max/projest_max/ui-studio')
ART = ROOT / '_작업/codex/ux-studio/networth13/art'
AUTHOR = ROOT / 'samples/monopoly-go/ui-studio/assets/authoring/networth13/v001'
PRODUCTION = ROOT / 'samples/monopoly-go/ui-studio/assets/production/networth13'
STAGING = ROOT / 'src/tools/uxStudio/assets/import-staging/networth13'
SOURCE_REF = 'docs/reference/monopoly-go/video-analysis-20261117/MGV03/frames/game-crops/'

ROLE = {
    'property': ('소유지', 'E', '325', 'Brown cottage, grass, sandy approach path; observed portrait house scene.', [266, 792, 380, 947]),
    'shutdown': ('셧다운', 'E', '350', 'White-mustached gentleman in hard hat riding a dark wrecking ball with chain and floating cash.', [50, 578, 180, 742]),
    'rentgoal': ('임대료 목표', 'D', '500', 'Smiling dark-haired festive woman holding a red lucky-money pouch; generated pouch is text-free.', [266, 673, 380, 818]),
    'maximumdice': ('최대 주사위', 'E/F', '450/200', 'White-mustached top-hat gentleman and a clear jar of white dice, with red bow in E.', [51, 173, 184, 327]),
    'chance': ('복불복 카드', 'E', '400', 'Orange question-mark cards, green board tiles, purple tile and two pale dice. Generated art deliberately omits the question-mark glyph for native text separation.', [266, 379, 380, 534]),
    'reactions': ('반응', 'F', '225', 'Top-hat gentleman with arms open and three round reaction bubbles above him.', [266, 255, 382, 404]),
    'express': ('거물 익스프레스', 'D', '575', 'Two overlapping circular travel tokens with green rear token, blue front gentleman token and small gold star tab.', [268, 294, 380, 408]),
    'dicegeneration': ('주사위 생성', 'D', '600', 'Blue die with dark pips and green rightward double chevron.', [57, 105, 184, 204]),
}


def metadata(path: Path):
    content = path.read_bytes()
    result = {'path': str(path), 'relativePath': str(path.relative_to(ROOT)), 'bytes': len(content), 'sha256': sha256(content).hexdigest()}
    try:
        im = Image.open(path)
        result.update(format=im.format, mode=im.mode, pixelSize=list(im.size))
        if 'A' in im.getbands():
            alpha = im.getchannel('A')
            hist = alpha.histogram()
            result['alpha'] = {
                'extrema': list(alpha.getextrema()),
                'fullyTransparentPixels': hist[0],
                'fullyOpaquePixels': hist[255],
                'nearOpaquePixels251to255': sum(hist[251:]),
                'partialPixels1to254': sum(hist[1:255]),
                'corners': [alpha.getpixel(point) for point in [(0,0),(im.width-1,0),(0,im.height-1),(im.width-1,im.height-1)]],
                'genuineAlphaVerified': hist[0] > 0 and sum(hist[251:]) > 0,
            }
    except Exception:
        pass
    return result


def main():
    jobs = json.loads((ART / 'export-jobs.json').read_text())
    records = []
    contact = Image.new('RGB', (1120, 640), '#e7edf4')
    draw = ImageDraw.Draw(contact)
    for index, job in enumerate(jobs['jobs']):
        role = job['role']
        stem = f'common_networth-{role}_illustration_normal_v001'
        source = AUTHOR / f'{stem}.source.png'
        shutil.copyfile(job['source'], source)
        (AUTHOR / f'{stem}.prompt.txt').write_text(job['prompt'] + '\n')
        if job['editPrompt']:
            (AUTHOR / f'{stem}.edit-prompt.txt').write_text(job['editPrompt'] + '\n')
        im = Image.open(source).convert('RGBA')
        alpha = im.getchannel('A')
        # Export only: determine a visible crop; do not manufacture/remove alpha pixels.
        visible_bbox = alpha.point(lambda value: 255 if value >= 16 else 0).getbbox()
        assert visible_bbox is not None
        left, top, right, bottom = visible_bbox
        crop_bbox = (max(0, left - 4), max(0, top - 4), min(im.width, right + 4), min(im.height, bottom + 4))
        cropped = im.crop(crop_bbox)
        crop_path = AUTHOR / f'{stem}.crop.rgba.png'
        cropped.save(crop_path, optimize=True)
        export = cropped.copy()
        export.thumbnail((360, 360), Image.Resampling.LANCZOS)
        canvas = Image.new('RGBA', (export.width + 16, export.height + 16), (0, 0, 0, 0))
        canvas.alpha_composite(export, (8, 8))
        production = PRODUCTION / f'{stem}.webp'
        canvas.save(production, lossless=True, method=6, exact=True)
        staging = STAGING / production.name
        shutil.copyfile(production, staging)
        assert production.read_bytes() == staging.read_bytes()
        title, letter, threshold, observed, region = ROLE[role]
        reference = [SOURCE_REF + f'MGV03-S02-{part}.png' for part in letter.split('/')]
        unverified = [
            'New concept-matching illustration; not a pixel-identical recreation or approval.',
            'Native engine placement, card viewport clipping and final on-device rendering are parent-task checks.',
            'Generated alpha is preserved; near-opaque interiors are mostly alpha 252/253, and fine source edge fringe remains.',
            'Original card copy, threshold numerals, card frame, lock and external shadow remain native-engine responsibilities.',
        ]
        if role == 'shutdown':
            unverified.append('Chain continues through the upper source edge; it is an intentional edge-connected prop, not a complete freestanding chain.')
        if role == 'reactions':
            unverified.append('First generation had haze and was rejected; selected source is the dedicated background-extraction edit with isolated subjects.')
        record = {
            'name': stem, 'role': role, 'displayRole': title,
            'recommendedLogicalAspectRatio': '3:4 card artwork viewport, contain without stretching',
            'assetNaturalAspectRatio': round(canvas.width / canvas.height, 6),
            'recommendedLogicalViewport': {'width': 84, 'height': 112, 'fit': 'contain', 'status': 'production suggestion, not source measurement'},
            'observedRole': observed,
            'referenceObservation': {'files': reference, 'sourcePixelSize': [592, 1052], 'thresholdTextObserved': threshold, 'approximateRegionPx': region, 'regionStatus': 'visual observation only; exact geometry delegated to measurement agent'},
            'method': 'Built-in image_gen, original generation' + (' plus dedicated image_gen background-extraction edit' if role == 'reactions' else ''),
            'inputScreenshotPixelsReused': False,
            'generationOriginalPath': job['source'],
            'promptFile': str(AUTHOR / f'{stem}.prompt.txt'),
            'prompt': metadata(AUTHOR / f'{stem}.prompt.txt'),
            'source': metadata(source), 'crop': metadata(crop_path), 'production': metadata(production), 'staging': metadata(staging),
            'cropSpecification': {'sourceAlphaBboxAllNonzero': list(alpha.getbbox()), 'visibleAlphaThreshold': 16, 'visibleBbox': list(visible_bbox), 'sourceCropBox': list(crop_bbox), 'sourceCropPaddingPx': 4, 'alphaPixelsAltered': False, 'maxExportContentEdgePx': 360, 'exportTransparentPaddingPx': 8, 'resample': 'Lanczos, uniform scale', 'webp': 'lossless exact'},
            'unverified': unverified,
        }
        if job['editPrompt']:
            record['editPromptFile'] = str(AUTHOR / f'{stem}.edit-prompt.txt')
            record['editPrompt'] = metadata(AUTHOR / f'{stem}.edit-prompt.txt')
        records.append(record)
        thumb = canvas.copy()
        thumb.thumbnail((240, 260), Image.Resampling.LANCZOS)
        column, row = index % 4, index // 4
        x, y = column * 280, row * 320
        contact.paste(thumb, (x + (280-thumb.width)//2, y+18+(260-thumb.height)//2), thumb)
        draw.text((x+12,y+294),role,fill='#21354b')

    rejected = AUTHOR / 'common_networth-reactions_illustration_normal_v001.rejected-haze.source.png'
    shutil.copyfile(jobs['rejected']['source'], rejected)
    reuse = []
    for role, filename, reason, decision in [
        ('maximumdice', 'samples/monopoly-go/ui-studio/assets/production/album-icons/common_album-reward-dice-stack_icon_normal_v001.webp', 'Existing newly drawn dice stack lacks gentleman, jar and red bow seen in reference. Not used as this gallery illustration.', 'reviewed-not-selected'),
        ('property', 'samples/monopoly-go/ui-studio/assets/production/build-hud/common_build-house-stack_icon_normal_v001.webp', 'Existing small green house counters differ from observed brown cottage scene. Not used as property illustration.', 'reviewed-not-selected'),
        ('boardreward', 'samples/monopoly-go/ui-studio/assets/production/build-landmarks/common_build-liberty_landmark_normal_v001.webp', 'Existing newly drawn green Liberty monument is a plausible reusable central figure for D/550 board reward. Original also shows a gray city-board base and turquoise check, which remain absent from this candidate. Parent may reuse with separate native composition.', 'candidate-only-not-registered'),
    ]:
        reuse.append({'role': role, 'decision': decision, 'reason': reason, 'file': metadata(ROOT / filename)})
    manifest = {
        'schemaVersion': 1, 'screen': 'net-worth-gallery', 'referenceScreen': 'MGV03-S02',
        'createdAtKst': datetime.now().astimezone().isoformat(), 'author': 'codex subagent networth_art',
        'status': '제안(검수 대기)', 'assetCount': len(records),
        'scope': 'New isolated illustration resources only; no product code, saved design, guide, STATUS or report edits.',
        'tool': 'built-in image_gen only; no API/CLI fallback',
        'referenceImagesViewedDirectly': [SOURCE_REF+f'MGV03-S02-{letter}.png' for letter in 'DEF'],
        'constraints': ['No screenshot product registration', 'No text or threshold numeral pixels', 'No gallery card frame, padlock or title pixels', 'No external cast shadow/drop-shadow baked into art', 'Preserve genuine generated alpha', 'Uniform aspect-preserving export'],
        'exportScript': str(ART / 'export-art.py'), 'assets': records, 'reuseReview': reuse,
        'rejectedSources': [{'file': metadata(rejected), 'reason': jobs['rejected']['reason']}],
        'unverified': ['Actual browser/native-editor rendering belongs to parent task.', 'Source typography and exact scene equivalence remain unverified.'],
    }
    (AUTHOR / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n')
    (ART / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n')
    contact.save(ART / 'contact-sheet.jpg', quality=94)
    print(json.dumps({'assets': len(records), 'productionBytes': sum(item['production']['bytes'] for item in records), 'maxProductionBytes': max(item['production']['bytes'] for item in records), 'allAlphaVerified': all(item['production']['alpha']['genuineAlphaVerified'] for item in records), 'allStagingHashesMatch': all(item['production']['sha256']==item['staging']['sha256'] for item in records), 'manifest': str(AUTHOR / 'manifest.json')}, ensure_ascii=False))


if __name__ == '__main__':
    main()
