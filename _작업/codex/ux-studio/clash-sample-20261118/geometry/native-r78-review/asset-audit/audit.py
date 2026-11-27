"""Fixed r78 asset hash/size audit; writes only sibling audit.json."""
import hashlib
import json
import re
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
SNAPSHOT = HERE.parent / 'ux-ea29177e.r78.snapshot.json'
ASSETS = Path('/Users/max/projest_max/ui-studio/samples/clash-royale/ui-studio/assets')
PRIOR = HERE.parent.parent / 'native-r65-review/asset-audit/audit.json'
EXPECTED_SHA = 'f78b355b1f9e3b4faca3133e7c65003246268ecb7de29c3bae2f64cc0f15222a'
raw_snapshot = SNAPSHOT.read_bytes()
assert len(raw_snapshot) == 186410 and hashlib.sha256(raw_snapshot).hexdigest() == EXPECTED_SHA
snapshot = json.loads(raw_snapshot)
assert snapshot['projectId'] == 'ux-ea29177e' and snapshot['revision'] == 78
raw_prior = PRIOR.read_bytes()
prior = json.loads(raw_prior)
references, issues = [], []


def walk(node, pointer=''):
    if isinstance(node, dict):
        for key, value in node.items():
            if key in ('assetRef', 'src') and isinstance(value, str) and value:
                references.append({'pointer': pointer + '/' + key, 'resource': value})
            walk(value, pointer + '/' + key)
    elif isinstance(node, list):
        for index, value in enumerate(node):
            walk(value, pointer + '/' + str(index))


walk(snapshot)
new_counts = Counter(ref['resource'] for ref in references)
old_counts = Counter(ref['resource'] for asset in prior['resources'] for ref in asset['references'])
old_assets = {asset['assetRef']: asset for asset in prior['resources']}
assets = []
for resource in sorted(new_counts):
    path = ASSETS / resource
    record = {'assetRef': resource, 'references': [ref['pointer'] for ref in references if ref['resource'] == resource]}
    if not path.resolve().is_relative_to(ASSETS.resolve()) or not path.is_file():
        issues.append({'kind': 'missingOrOutsideAssets', 'assetRef': resource})
        assets.append(record)
        continue
    raw = path.read_bytes()
    actual_sha = hashlib.sha256(raw).hexdigest()
    match = re.fullmatch(r'sha256-([0-9a-f]{64})\.[A-Za-z0-9]+', path.name)
    record.update(exists=True, bytes=len(raw), sha256=actual_sha,
                  hashNameMatches=bool(match) and actual_sha == match.group(1),
                  within300000Bytes=len(raw) <= 300000,
                  sameShaAsR65=actual_sha == old_assets.get(resource, {}).get('sha256'))
    if not record['hashNameMatches']:
        issues.append({'kind': 'hashNameMismatch', 'assetRef': resource})
    if not record['within300000Bytes']:
        issues.append({'kind': 'oversize', 'assetRef': resource, 'bytes': len(raw)})
    if not record['sameShaAsR65']:
        issues.append({'kind': 'hashChangedSinceR65', 'assetRef': resource})
    assets.append(record)

comparison = {'r65References': sum(old_counts.values()), 'r78References': sum(new_counts.values()),
              'sameUniqueResourceSet': set(old_counts) == set(new_counts),
              'sameResourceReferenceCounts': old_counts == new_counts,
              'addedResources': sorted(set(new_counts) - set(old_counts)),
              'removedResources': sorted(set(old_counts) - set(new_counts)),
              'referenceCountChanges': {ref: {'r65': old_counts[ref], 'r78': new_counts[ref]}
                  for ref in sorted(set(old_counts) | set(new_counts)) if old_counts[ref] != new_counts[ref]}}
if not comparison['sameUniqueResourceSet'] or not comparison['sameResourceReferenceCounts']:
    issues.append({'kind': 'referenceSetOrCountChanged'})
assert SNAPSHOT.read_bytes() == raw_snapshot, 'Snapshot changed during audit'
assert PRIOR.read_bytes() == raw_prior, 'Prior r65 audit changed during audit'
summary = {'revision': snapshot['revision'], 'snapshotBytes': len(raw_snapshot),
           'uniqueResources': len(assets), 'references': len(references),
           'hashNameMatches': sum(asset.get('hashNameMatches', False) for asset in assets),
           'sameShaAsR65': sum(asset.get('sameShaAsR65', False) for asset in assets),
           'within300000Bytes': sum(asset.get('within300000Bytes', False) for asset in assets),
           'maxBytes': max((asset.get('bytes', 0) for asset in assets), default=0),
           'issueCounts': dict(Counter(issue['kind'] for issue in issues)), 'issueCount': len(issues)}
result = {'checkedAtUtc': datetime.now(timezone.utc).isoformat(), 'snapshot': str(SNAPSHOT),
          'snapshotSha256': EXPECTED_SHA, 'priorR65Audit': str(PRIOR),
          'priorR65AuditSha256': hashlib.sha256(raw_prior).hexdigest(),
          'scope': 'Static resource set/reference counts, actual-file SHA256 and 300000-byte limit only. No live design, browser, input coverage, pixel/MIME or source/resource changes.',
          'summary': summary, 'r65Comparison': comparison, 'assets': assets, 'issues': issues}
(HERE / 'audit.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'snapshotSha256': EXPECTED_SHA, **summary, 'r65Comparison': comparison}, ensure_ascii=False, indent=2))
raise SystemExit(1 if issues else 0)
