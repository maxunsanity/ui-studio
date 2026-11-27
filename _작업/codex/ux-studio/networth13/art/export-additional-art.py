from datetime import datetime
import importlib.util
import json
from pathlib import Path
import shutil

from PIL import Image, ImageDraw

ART = Path('/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/networth13/art')
spec = importlib.util.spec_from_file_location('networth_export', ART / 'export-art.py')
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)
ROOT, AUTHOR, PRODUCTION, STAGING = base.ROOT, base.AUTHOR, base.PRODUCTION, base.STAGING

DETAILS = {
    'bluepropertyrent': {
        'displayRole': '파란색 소유지 임대료', 'threshold': 180,
        'observedRole': 'Three children in cyan/white and pink/white space-play suits, using blue toy ray blasters; a blue beam connects the play action.',
        'reference': 'docs/reference/monopoly-go/video-analysis-20261117/MGV03/frames/game-crops/MGV03-S02-F.png',
        'sourcePixelSize': [592, 1052], 'regionPx': [264, 667, 383, 819],
        'sourceType': 'original-PNG', 'sourceTimeSeconds': 5.0,
        'unverified': ['Room/space backdrop is intentionally omitted for an isolated transparent vignette. Final framing and reference scene equivalence remain parent checks.'],
    },
    'shieldprotection': {
        'displayRole': '방패', 'threshold': 160,
        'observedRole': 'Large gray-mustached older gentleman in brown medieval armor-like clothing, orange shield at right, wooden axe handle/gray axe head behind him and orange fire at left.',
        'reference': 'docs/reference/monopoly-go/video-analysis-20261117/MGV03/frames/game-crops/MGV03-S02-F.png',
        'sourcePixelSize': [592, 1052], 'regionPx': [50, 871, 172, 978],
        'sourceType': 'original-PNG', 'sourceTimeSeconds': 5.0,
        'unverified': ['Source F is clipped by the footer below the visible upper body. Exact lower-body/arm pose cannot be confirmed; a folded-arm pose was not claimed.', 'Generated waist-up framing and complete shield are a reconstruction from visible upper details, not full original-pose evidence.'],
    },
    'stickerreward': {
        'displayRole': '스티커로 보상 획득', 'threshold': 300,
        'observedRole': 'Swept black-haired gentleman with gold monocle, green formal clothing and white gloves holding a blue safe with gold rim and pale metal front; gold card/sticker stack floats upper-left.',
        'reference': 'docs/reference/monopoly-go/video-analysis-20261117/MGV03/frames/frame_00009.jpg',
        'sourcePixelSize': [1920, 1080], 'regionPx': [700, 212, 821, 368],
        'sourceType': 'JPEG-review-frame', 'sourceTimeSeconds': 4.0,
        'unverified': ['300 scene is sufficiently visible to identify gentleman/safe/cards. Exact tiny hardware and gold-card symbols are not readable; generated safe/cards intentionally have no text/symbols.'],
    },
}


def main():
    manifest_path = AUTHOR / 'manifest.json'
    prior_bytes = manifest_path.read_bytes()
    manifest = json.loads(prior_bytes)
    original_roles = ['property', 'shutdown', 'rentgoal', 'maximumdice', 'chance', 'reactions', 'express', 'dicegeneration']
    original_records = [record for record in manifest['assets'] if record['role'] in original_roles]
    assert len(original_records) == 8
    original_file_hashes = {record['role']: {kind: base.metadata(Path(record[kind]['path']))['sha256'] for kind in ['source', 'crop', 'production', 'staging']} for record in original_records}
    backup_path = ART / 'manifest.before-additional-three.json'
    if not backup_path.exists():
        backup_path.write_bytes(prior_bytes)
    jobs = json.loads((ART / 'additional-export-jobs.json').read_text())['jobs']
    contact = Image.new('RGB', (840, 340), '#e7edf4')
    draw = ImageDraw.Draw(contact)
    records = []
    for index, job in enumerate(jobs):
        role = job['role']
        detail = DETAILS[role]
        stem = f'common_networth-{role}_illustration_normal_v001'
        source = AUTHOR / f'{stem}.source.png'
        shutil.copyfile(job['source'], source)
        prompt = AUTHOR / f'{stem}.prompt.txt'
        prompt.write_text(job['prompt'] + '\n')
        im = Image.open(source).convert('RGBA')
        alpha = im.getchannel('A')
        visible_bbox = alpha.point(lambda value: 255 if value >= 16 else 0).getbbox()
        assert visible_bbox is not None
        left, top, right, bottom = visible_bbox
        crop_bbox = (max(0,left-4),max(0,top-4),min(im.width,right+4),min(im.height,bottom+4))
        cropped = im.crop(crop_bbox)
        crop = AUTHOR / f'{stem}.crop.rgba.png'
        cropped.save(crop,optimize=True)
        exported = cropped.copy()
        exported.thumbnail((360,360),Image.Resampling.LANCZOS)
        canvas = Image.new('RGBA',(exported.width+16,exported.height+16),(0,0,0,0))
        canvas.alpha_composite(exported,(8,8))
        production = PRODUCTION / f'{stem}.webp'
        canvas.save(production,lossless=True,method=6,exact=True)
        staging = STAGING / production.name
        shutil.copyfile(production,staging)
        assert production.read_bytes()==staging.read_bytes()
        record = {
            'name': stem, 'role': role, 'displayRole': detail['displayRole'],
            'recommendedLogicalAspectRatio': '3:4 card artwork viewport, contain without stretching',
            'assetNaturalAspectRatio': round(canvas.width/canvas.height,6),
            'recommendedLogicalViewport': {'width': 108 if role=='stickerreward' else 116 if role=='bluepropertyrent' else 110, 'height': 141 if role!='shieldprotection' else 140, 'fit': 'contain', 'status': 'measure.json normalized native proposal, not source exact-pixel declaration'},
            'observedRole': detail['observedRole'],
            'referenceObservation': {'files': [detail['reference']], 'sourcePixelSize': detail['sourcePixelSize'], 'thresholdTextObserved': str(detail['threshold']), 'approximateRegionPx': detail['regionPx'], 'regionStatus': 'visual observation only; exact card geometry in separate measure.json', 'sourcePixelType': detail['sourceType'], 'sourceTimeSeconds': detail['sourceTimeSeconds'], 'actuallyViewedDirectly': True},
            'method': 'Built-in image_gen, original generation', 'inputScreenshotPixelsReused': False,
            'generationOriginalPath': job['source'], 'promptFile': str(prompt), 'prompt': base.metadata(prompt),
            'source': base.metadata(source), 'crop': base.metadata(crop), 'production': base.metadata(production), 'staging': base.metadata(staging),
            'cropSpecification': {'sourceAlphaBboxAllNonzero': list(alpha.getbbox()), 'visibleAlphaThreshold': 16, 'visibleBbox': list(visible_bbox), 'sourceCropBox': list(crop_bbox), 'sourceCropPaddingPx': 4, 'alphaPixelsAltered': False, 'maxExportContentEdgePx': 360, 'exportTransparentPaddingPx': 8, 'resample': 'Lanczos, uniform scale', 'webp': 'lossless exact'},
            'unverified': ['Newly drawn concept-matching illustration; source pixel equivalence/approval unverified.', 'Native card placement, clipping and actual-browser verification belong to parent task.', 'True generated alpha preserved; thin source edge fringes remain possible.', 'No source card text/threshold/frame/lock/title or external cast-shadow pixels are included.'] + detail['unverified'],
        }
        records.append(record)
        thumbnail=canvas.copy()
        thumbnail.thumbnail((240,280),Image.Resampling.LANCZOS)
        contact.paste(thumbnail,(index*280+(280-thumbnail.width)//2,16+(280-thumbnail.height)//2),thumbnail)
        draw.text((index*280+8,313),role,fill='#21354b')
    retained = [record for record in manifest['assets'] if record['role'] not in DETAILS]
    manifest['assets'] = retained + records
    manifest['assetCount'] = len(manifest['assets'])
    manifest['additionalArtBatch'] = {
        'updatedAtKst': datetime.now().astimezone().isoformat(),
        'rolesAdded': list(DETAILS), 'originalEightRecordsUnchanged': True,
        'originalEightFileHashesUnchanged': True,
        'observationsRead': ['_작업/codex/ux-studio/networth13/measure.md', '_작업/codex/ux-studio/networth13/measure.json'],
        'referenceImagesViewedDirectly': list(dict.fromkeys(d['reference'] for d in DETAILS.values())),
        'inspectionOnlyCrops': [str(ART/f'observation-only-{role}.png') for role in DETAILS],
        'inspectionOnlyCropsProductRegistered': False,
        'unobserved140': {'role': None, 'art': None, 'reason': 'Source illustration remains unobserved; no asset generated.'},
        'exportScript': str(ART/'export-additional-art.py'), 'backupManifest': str(backup_path),
    }
    assert original_records==[record for record in manifest['assets'] if record['role'] in original_roles]
    for record in original_records:
        for kind in ['source','crop','production','staging']:
            assert base.metadata(Path(record[kind]['path']))['sha256']==original_file_hashes[record['role']][kind]
    output=json.dumps(manifest,ensure_ascii=False,indent=2)+'\n'
    manifest_path.write_text(output)
    (ART/'manifest.json').write_text(output)
    contact.save(ART/'additional-contact-sheet.jpg',quality=94)
    print(json.dumps({'newAssets':len(records),'totalAssets':manifest['assetCount'],'newProductionBytes':sum(r['production']['bytes'] for r in records),'maxNewBytes':max(r['production']['bytes'] for r in records),'allAlphaVerified':all(r['production']['alpha']['genuineAlphaVerified'] for r in records),'originalEightRecordsUnchanged':True,'originalEightFileHashesUnchanged':True,'manifest':str(manifest_path)},ensure_ascii=False))


if __name__=='__main__':
    main()
