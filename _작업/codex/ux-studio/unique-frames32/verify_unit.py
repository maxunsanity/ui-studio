#!/usr/bin/env python3
"""Read-only final-save checks. Prints JSON; exits 1 on failed assertions. No writes."""
import hashlib
import json
import math
import os
from pathlib import Path
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[4]
DESIGN = ROOT / 'samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json'
BASELINE = ROOT / 'docs/evidence/20261117-networth-stage-map/confirmed-native-r335-design.json'
ASSETS = ROOT / 'samples/monopoly-go/ui-studio/assets'
WORK = ROOT / '_작업/codex/ux-studio/unique-frames32'
NAMES = ['Modal_Showroom_TokenDetail', 'Page_Tournament_ClassBenefits', 'Modal_Event_BeanstalkDetails']
EPS = 0.05
checks, warnings = [], []

def check(name, passed, detail=None):
    entry = {'check': name, 'pass': bool(passed)}
    if detail is not None:
        entry['detail'] = detail
    checks.append(entry)
    return bool(passed)

def close(actual, expected):
    return len(actual) == len(expected) and all(isinstance(a, (int, float)) and math.isfinite(a) and abs(a-b) <= EPS for a, b in zip(actual, expected))

def read_json(path):
    return json.loads(path.read_bytes())

def one(screen, name):
    found = [e for e in screen.get('elements', []) if e.get('name') == name]
    check('unique element: ' + name, len(found) == 1, len(found))
    return found[0] if len(found) == 1 else None

def dimensions(rect):
    return [rect[k] for k in ('x', 'y', 'w', 'h')]

def rect_check(screen, element, expected, name):
    if element is None:
        return False
    actual = native['rects'].get(screen['id'], {}).get(element['id'])
    return check(name, actual is not None and close(dimensions(actual), expected), {'actual': actual, 'expectedXYWH': expected})

def descendants(screen, parent):
    result, pending = {parent['id']}, [parent['id']]
    while pending:
        pid = pending.pop()
        for e in screen['elements']:
            if e.get('parentId') == pid and e['id'] not in result:
                result.add(e['id'])
                pending.append(e['id'])
    return result

NATIVE = r"""
import {readFileSync} from 'node:fs';
import {validateDocument,resolveRect} from './src/tools/uxStudio/model.mjs';
import {inputMode,inputOwner} from './src/tools/uxStudio/parts.mjs';
import {documentAssetImages} from './src/tools/uxStudio/asset-reference.mjs';
const d=JSON.parse(readFileSync(0,'utf8'));validateDocument(d);
const rects={},inputs={};
for(const s of d.screens){rects[s.id]={};inputs[s.id]={};for(const e of s.elements){
 rects[s.id][e.id]=resolveRect(s,e.id,s.logicalSize?.w??551,s.logicalSize?.h??984);
 inputs[s.id][e.id]={mode:inputMode(e,d.transitions),owner:inputOwner(s,e.id,d.transitions)?.id??null};
}}
process.stdout.write(JSON.stringify({rects,inputs,images:documentAssetImages(d)}));
"""

try:
    with DESIGN.open('rb') as stream:
        before = os.fstat(stream.fileno())
        snapshot = stream.read()
    after = DESIGN.stat()
    document, baseline = json.loads(snapshot), read_json(BASELINE)
    check('snapshot remained the same published file during read', (before.st_ino, before.st_size, before.st_mtime_ns) == (after.st_ino, after.st_size, after.st_mtime_ns))
    check('saved document <= 2,000,000 UTF-8 bytes', len(snapshot) <= 2000000, len(snapshot))
    check('baseline is r335 / 14 screens / 22 edges', baseline.get('revision') == 335 and len(baseline['screens']) == 14 and len(baseline['transitions']) == 22)
    current = {s['id']: s for s in document['screens']}
    for old in baseline['screens']:
        check('original screen unchanged: ' + old['name'], current.get(old['id']) == old)
    check('original 22 edges unchanged and same prefix order', document['transitions'][:len(baseline['transitions'])] == baseline['transitions'])
    original_ids = {s['id'] for s in baseline['screens']}
    new_screens = [s for s in document['screens'] if s['id'] not in original_ids]
    check('exactly the 3 specified new screen names', sorted(s['name'] for s in new_screens) == sorted(NAMES), [s['name'] for s in new_screens])
    screens = {s['name']: s for s in new_screens}
    process = subprocess.run(['node', '--input-type=module', '-e', NATIVE], cwd=ROOT, input=snapshot, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=60)
    if process.returncode:
        raise ValueError('Native model validation/geometry failed: ' + process.stderr.decode('utf8', 'replace')[-2500:])
    native = json.loads(process.stdout)
    check('actual native validateDocument / resolveRect / inputOwner APIs completed', True)
    for s in new_screens:
        check(s['name'] + ': logical basis551x984', s.get('logicalSize') == {'w': 551, 'h': 984})
        for e in s['elements']:
            if str(e.get('text', '')).strip():
                check('separate native text: ' + e['name'], e.get('kind') == 'text' and e.get('partRole') == 'label' and not e.get('image') and not e.get('skin'))
            if e.get('kind') == 'button':
                mode = native['inputs'][s['id']][e['id']]
                check('action hit owns input: ' + e['name'], mode == {'mode': 'action', 'owner': e['id']}, mode)
        close_hits = [e for e in s['elements'] if e.get('kind') == 'button' and e['name'].endswith('_Close')]
        check(s['name'] + ': one Close hit', len(close_hits) == 1, len(close_hits))
        if len(close_hits) == 1:
            hit = close_hits[0]
            glyphs = [e for e in s['elements'] if e.get('parentId') == hit['id'] and e.get('text') == '×']
            edges = [t for t in document['transitions'] if t['fromScreen'] == s['id'] and t['fromElement'] == hit['id']]
            action = 'back' if s['kind'] == 'page' else 'close'
            check(s['name'] + ': one local Close/back always edge', len(edges) == 1 and edges[0]['action'] == action and edges[0]['condition'] == 'always', edges)
            check(s['name'] + ': one separate Close glyph', len(glyphs) == 1)
            floating = s['name'] == NAMES[2]
            y = 932 if floating else 940
            rect_check(s, hit, [253.5, y, 44, 44], s['name'] + ': Close hit44 placement')
            if len(glyphs) == 1:
                rect_check(s, glyphs[0], [261.5, y+8, 28, 28], s['name'] + ': Close glyph28 placement')
                check(s['name'] + ': glyph forwards input to Close', native['inputs'][s['id']][glyphs[0]['id']]['owner'] == hit['id'])
            for edge in edges:
                if '갤러리' in edge.get('label', ''):
                    warnings.append({'metadata': edge['id'], 'message': 'Copied Gallery Close label; rename for this screen without changing semantics.'})
    for name, suffix in [(NAMES[0], 'TokenDetail'), (NAMES[1], 'Class')]:
        s = screens.get(name)
        if s:
            rect_check(s, one(s, 'Footer_' + suffix), [0, 912, 551, 72], name + ': common Footer72')
            rect_check(s, one(s, 'Line_' + suffix + '_Footer'), [0, 912, 551, 6], name + ': common line6')
    showroom = screens.get(NAMES[0])
    if showroom:
        for name in ['Group_TokenDetail_Nameplate', 'Group_TokenDetail_Category', 'Group_TokenDetail_Display', 'FX_TokenDetail_WarmRays', 'Img_TokenDetail_Buttons', 'Img_TokenDetail_Pedestal', 'Img_TokenDetail_Pedestal_Paw']:
            one(showroom, name)
        ext, dim = one(showroom, 'BG_TokenDetail_EquipExtension'), one(showroom, 'BG_TokenDetail_Dim')
        rect_check(showroom, ext, [0, 852, 551, 60], 'Showroom: explicit extension60')
        rect_check(showroom, one(showroom, 'Btn_TokenDetail_Equip'), [153.5, 810, 244, 72], 'Showroom: Equip244x72')
        if ext and dim:
            by_id = {e['id']: e for e in showroom['elements']}
            def paint_path(element):
                path = []
                while element:
                    path.insert(0, showroom['elements'].index(element))
                    element = by_id.get(element.get('parentId'))
                return path
            check('Showroom: Dim paints before extension', paint_path(dim) < paint_path(ext), {'dimPath': paint_path(dim), 'extensionPath': paint_path(ext)})
    # Unknown controls and entry routes must not acquire invented transitions.
    expected_unknown = {NAMES[0]: ['Equip', 'Previous', 'Next', 'Info'], NAMES[1]: ['Info', 'Trophy']}
    for screen_name, suffixes in expected_unknown.items():
        s = screens.get(screen_name)
        if not s:
            continue
        for suffix in suffixes:
            hits = [e for e in s['elements'] if e.get('kind') == 'button' and e['name'].endswith('_' + suffix)]
            check(screen_name + ': unknown control exists ' + suffix, len(hits) == 1)
            for hit in hits:
                family = descendants(s, hit)
                found = [t for t in document['transitions'] if t['fromElement'] in family]
                check('unknown control has no invented edge: ' + hit['name'], not found, found)
    new_ids = {s['id'] for s in new_screens}
    check('new entries remain unset', not any(t.get('targetScreen') in new_ids for t in document['transitions']))
    for t in document['transitions'][len(baseline['transitions']):]:
        s = current.get(t['fromScreen'])
        e = next((e for e in s['elements'] if e['id'] == t['fromElement']), None) if s else None
        check('new transition is a local Close/back only: ' + t['id'], s is not None and s['id'] in new_ids and e is not None and e['name'].endswith('_Close') and t['action'] in ['close', 'back'] and not t.get('targetScreen'))
    bean = screens.get(NAMES[2])
    if bean:
        check('Beanstalk: no invented cream footer', not any(e['name'].startswith('Footer_') for e in bean['elements']))
        expected_names = ['Group_Beanstalk_Tile_' + k for k in ['Chance', 'Community', 'Railroad']]
        groups = [e for e in bean['elements'] if e['name'].startswith('Group_Beanstalk_Tile_')]
        check('Beanstalk: exactly3 named tile peer groups', sorted(e['name'] for e in groups) == sorted(expected_names))
        check('Beanstalk: tile groups share one parent', len({g.get('parentId') for g in groups}) == 1)
        tile_parent = one(bean, 'Group_Beanstalk_Tiles')
        shared_panel = one(bean, 'BG_Beanstalk_ThreeColumnPanel')
        if tile_parent:
            tr = native['rects'][bean['id']][tile_parent['id']]
            check('Beanstalk: unified tile parent444x281', tile_parent.get('isGroup') is True and close([tr['w'], tr['h']], [444, 281]), tr)
            check('Beanstalk: all3 columns direct children of unified tile parent', len(groups) == 3 and all(g.get('parentId') == tile_parent['id'] for g in groups))
            if shared_panel:
                check('Beanstalk: shared panel direct child before3 columns', shared_panel.get('parentId') == tile_parent['id'] and len(groups) == 3 and all(bean['elements'].index(shared_panel) < bean['elements'].index(g) for g in groups))
                rect_check(bean, shared_panel, [tr['x'], tr['y'], 444, 281], 'Beanstalk: one shared panel444x281 local0,0')
        check('Beanstalk: no duplicated per-column backgrounds', not any(e['name'].startswith('BG_Beanstalk_Tile_') for e in bean['elements']))
        role_rects = {'header': [0, 14, 148, 42], 'card': [32, 88, 84, 114], 'icon': [45, 103, 58, 77], 'amount': [32, 238, 48, 38], 'bean': [83, 242, 28, 29]}
        for group in groups:
            gr = native['rects'][bean['id']][group['id']]
            check(group['name'] + ': isGroup148x281', group.get('isGroup') is True and close([gr['w'], gr['h']], [148, 281]), gr)
            children = [e for e in bean['elements'] if e.get('parentId') == group['id']]
            classified = {}
            for child in children:
                name = child['name']
                role = 'header' if name.endswith('_Title') else 'card' if name.startswith('Frame_') else 'amount' if name.endswith('_BeanAmount') else 'bean' if name.endswith('_Bean') else 'icon' if name.endswith('_Symbol') or name.startswith('Img_') else None
                if role in classified or role is None:
                    check(group['name'] + ': unique known child role ' + name, False, role)
                else:
                    classified[role] = child
            check(group['name'] + ': exactly5 common functional roles', set(classified) == set(role_rects) and len(children) == 5, list(classified))
            for role, child in classified.items():
                r = native['rects'][bean['id']][child['id']]
                local = [r['x']-gr['x'], r['y']-gr['y'], r['w'], r['h']]
                check(group['name'] + ': common ' + role + ' box', close(local, role_rects[role]), {'actualLocal': local, 'expectedLocal': role_rects[role]})
                # A native '?' glyph and raster chest/train are the same functional icon role.
                if role == 'icon':
                    check(group['name'] + ': icon render kind', child['kind'] in ['image', 'text'])
    geometry = read_json(ASSETS / 'authoring/unique-frames32/geometry/manifest.json')
    art = read_json(WORK / 'art-assets.json')
    required_geometry = {'dim-black', 'token-nameplate9', 'token-paw', 'token-pedestal', 'equip-button3', 'class-header9', 'class-speech9', 'class-speech-tail', 'class-ribbon3', 'class-cream9', 'class-book', 'class-token', 'bean-body9', 'bean-cloud-cap', 'bean-columns9', 'bean-icon', 'bean-tile9', 'bean-chest', 'bean-train', 'showroom-warm-rays-v001', 'class-token-v002', 'bean-open-chest-v002', 'class-portrait-benefit-v001', 'class-rail-coin-v001', 'class-trophy-v001', 'bean-cloud-cap-v002'}
    geometry_names = {asset['name'] for asset in geometry}
    check('geometry manifest preserves25 and includes cloud-cap-v002', required_geometry <= geometry_names, {'actualCount': len(geometry), 'missingRequired': sorted(required_geometry-geometry_names)})
    check('art manifest has3 assets', len(art) == 3, len(art))
    manifest_assets = geometry + art
    check('new manifest asset names unique', len({a['name'] for a in manifest_assets}) == len(manifest_assets))
    prefix = '/ui-studio/source/assets/import-staging/unique-frames32/'
    for asset in manifest_assets:
        if not check('allowed staging path: ' + asset['name'], asset['path'].startswith(prefix)):
            continue
        relative = Path(asset['path'][len(prefix):])
        if not check('bounded asset path: ' + asset['name'], not relative.is_absolute() and '..' not in relative.parts):
            continue
        staging = ROOT / 'src/tools/uxStudio/assets/import-staging/unique-frames32' / relative
        production = ASSETS / 'production/unique-frames32' / relative
        if not check('prod/staging files exist: ' + asset['name'], staging.is_file() and production.is_file()):
            continue
        a, b = staging.read_bytes(), production.read_bytes()
        check('prod/staging identical<=300KB SHA: ' + asset['name'], a == b and 0 < len(a) <= 300000 and hashlib.sha256(a).hexdigest() == asset['sha'], {'bytes': len(a), 'sha': hashlib.sha256(a).hexdigest()})
    refs = {image['assetRef'] for image in native['images']}
    for ref in sorted(refs):
        valid = re.fullmatch(r'sha256-([a-f0-9]{64})\.(png|jpg|webp)', ref)
        if not check('saved asset ref format: ' + ref, valid is not None):
            continue
        path = ASSETS / ref
        if check('saved asset exists: ' + ref, path.is_file()):
            data = path.read_bytes()
            check('saved asset SHA and<=300KB: ' + ref, 0 < len(data) <= 300000 and hashlib.sha256(data).hexdigest() == valid.group(1))
    summary = {'revision': document['revision'], 'savedAt': document.get('savedAt'), 'screens': len(document['screens']), 'elements': sum(len(s['elements']) for s in document['screens']), 'transitions': len(document['transitions']), 'newScreenElements': {s['name']: len(s['elements']) for s in new_screens}, 'newManifestAssets': len(manifest_assets), 'savedUniqueAssetRefs': len(refs), 'nativeTextLeavesInNewScreens': sum(bool(str(e.get('text', '')).strip()) for s in new_screens for e in s['elements'])}
except Exception as error:
    check('validation completed without exception', False, str(error))
    summary = {}

failed = [c for c in checks if not c['pass']]
report = {'status': 'pass' if not failed else 'fail', 'scope': 'Read-only native document/source/asset checks; not live browser or visual-equivalence approval.', 'summary': summary, 'assertions': len(checks), 'failures': failed, 'warnings': warnings, 'limitations': ['Text/art separation is structural only; baked lettering in raster pixels cannot be proved absent by this script.', 'No browser, input gesture, scroll, image404, physical device or final user approval checks.', 'No files are written by this script. Redirect stdout to the assigned measure directory when evidence is needed.']}
print(json.dumps(report, ensure_ascii=False, indent=2))
sys.exit(1 if failed else 0)
