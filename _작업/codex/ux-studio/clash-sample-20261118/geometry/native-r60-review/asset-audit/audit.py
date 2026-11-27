"""Read only r60 resource audit. Writes only its sibling audit.json."""
import base64
import hashlib
import io
import json
import re
import subprocess
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import unquote_to_bytes
from PIL import Image

HERE = Path(__file__).resolve().parent
SNAPSHOT = HERE.parent / 'ux-ea29177e.r60.snapshot.json'
ASSETS = Path('/Users/max/projest_max/ui-studio/samples/clash-royale/ui-studio/assets')
LIMIT = 300000
raw_snapshot = SNAPSHOT.read_bytes()
document = json.loads(raw_snapshot)
assert document['projectId'] == 'ux-ea29177e' and document['revision'] == 60
assert (len(document['screens']), sum(len(s['elements']) for s in document['screens']), len(document['transitions'])) == (4, 261, 10)
references, data_uris, issues = [], [], []


def walk(node, path='', screen=None, element=None):
    if isinstance(node, dict):
        if re.fullmatch(r'/screens/\d+', path):
            screen = {'id': node['id'], 'name': node['name']}
        if re.fullmatch(r'/screens/\d+/elements/\d+', path):
            element = {'id': node['id'], 'name': node['name']}
        for key, value in node.items():
            child_path = path + '/' + key
            if key in ('assetRef', 'src') and isinstance(value, str) and value:
                category = next((kind for kind in ('buttonState', 'control', 'image', 'skin') if '/' + kind + '/' in child_path), 'other')
                references.append({'path': child_path, 'resource': value, 'category': category,
                                   'screen': screen, 'element': element,
                                   'declaredPixels': node.get('sourceSize', [node.get('w'), node.get('h')])})
            walk(value, child_path, screen, element)
    elif isinstance(node, list):
        for index, value in enumerate(node):
            walk(value, path + '/' + str(index), screen, element)
    elif isinstance(node, str) and node.startswith('data:'):
        data_uris.append((path, node))


def inspect_image(raw):
    with Image.open(io.BytesIO(raw)) as image:
        result = {'pixels': list(image.size), 'format': image.format, 'mime': Image.MIME.get(image.format)}
        image.verify()
    return result


walk(document)
resources = []
for ref in sorted(set(r['resource'] for r in references if not r['resource'].startswith('data:'))):
    related = [r for r in references if r['resource'] == ref]
    path = ASSETS / ref
    record = {'assetRef': ref, 'path': str(path), 'references': related}
    if not path.resolve().is_relative_to(ASSETS.resolve()):
        issues.append({'kind': 'pathOutsideAssets', 'assetRef': ref})
        resources.append(record)
        continue
    record['exists'] = path.is_file()
    if not record['exists']:
        issues.append({'kind': 'missing', 'assetRef': ref, 'references': related})
        resources.append(record)
        continue
    raw = path.read_bytes()
    record.update(bytes=len(raw), sha256=hashlib.sha256(raw).hexdigest())
    record['fileMime'] = subprocess.check_output(['file', '-b', '--mime-type', str(path)], text=True).strip()
    try:
        record.update(inspect_image(raw))
    except Exception as error:
        issues.append({'kind': 'imageInvalid', 'assetRef': ref, 'errorType': type(error).__name__})
        resources.append(record)
        continue
    expected_mime = {'.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp'}.get(path.suffix.lower())
    if record['mime'] != expected_mime or record['fileMime'] != record['mime']:
        issues.append({'kind': 'mimeMismatch', 'assetRef': ref, 'extensionMime': expected_mime, 'decodedMime': record['mime'], 'fileMime': record['fileMime']})
    if len(raw) > LIMIT:
        issues.append({'kind': 'oversize', 'assetRef': ref, 'bytes': len(raw), 'references': related})
    match = re.fullmatch(r'sha256-([0-9a-f]{64})\.[A-Za-z0-9]+', Path(ref).name)
    record['hashNameChecked'] = bool(match)
    if match and record['sha256'] != match.group(1):
        issues.append({'kind': 'hashMismatch', 'assetRef': ref, 'references': related})
    for use in related:
        if use['declaredPixels'] != record['pixels']:
            issues.append({'kind': 'pixelMismatch', 'assetRef': ref, 'actualPixels': record['pixels'], 'reference': use})
    resources.append(record)

inline_records = []
for path, uri in data_uris:
    record = {'path': path}
    try:
        header, payload = uri.split(',', 1)
        parameters = header[5:].split(';')
        raw = base64.b64decode(payload, validate=True) if parameters[-1] == 'base64' else unquote_to_bytes(payload)
        record.update(bytes=len(raw), declaredMime=parameters[0], sha256=hashlib.sha256(raw).hexdigest(), **inspect_image(raw))
        if record['declaredMime'] != record['mime']:
            issues.append({'kind': 'dataUriMimeMismatch', 'path': path})
        if len(raw) > LIMIT:
            issues.append({'kind': 'dataUriOversize', 'path': path, 'bytes': len(raw)})
    except Exception as error:
        issues.append({'kind': 'dataUriInvalid', 'path': path, 'errorType': type(error).__name__})
    inline_records.append(record)

assert SNAPSHOT.read_bytes() == raw_snapshot, 'Snapshot changed during audit'
summary = {'projectId': document['projectId'], 'revision': document['revision'], 'screens': len(document['screens']),
           'parts': sum(len(s['elements']) for s in document['screens']), 'transitions': len(document['transitions']),
           'references': len(references), 'uniqueResources': len(resources), 'dataUris': len(data_uris),
           'referenceTypes': dict(Counter(r['category'] for r in references)),
           'formats': dict(Counter(r.get('format') for r in resources)),
           'hashNameChecked': sum(r.get('hashNameChecked', False) for r in resources),
           'maxBytes': max((r.get('bytes', 0) for r in resources), default=0),
           'issueCounts': dict(Counter(issue['kind'] for issue in issues)), 'issueCount': len(issues)}
result = {'checkedAtUtc': datetime.now(timezone.utc).isoformat(), 'snapshot': str(SNAPSHOT),
          'snapshotSha256': hashlib.sha256(raw_snapshot).hexdigest(), 'limitBytes': LIMIT, 'summary': summary,
          'resources': resources, 'dataUris': inline_records, 'issues': issues,
          'scope': 'Static file existence, path containment, MIME/signature metadata, pixels, byte length and SHA256 only; no browser/HTTP/render/runtime inspection; no source/resource changes.'}
(HERE / 'audit.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'snapshotSha256': result['snapshotSha256'], **summary}, ensure_ascii=False, indent=2))
raise SystemExit(1 if issues else 0)
