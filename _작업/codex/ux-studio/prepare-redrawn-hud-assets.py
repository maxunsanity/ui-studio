from pathlib import Path
from PIL import Image, ImageChops
from io import BytesIO
from datetime import datetime, timezone, timedelta
import hashlib, json

ROOT=Path('/Users/max/projest_max/ui-studio')
SOURCE=Path('/Users/max/.codex/generated_images/01a1c963-3e9b-7780-8bf1-4e583c60614e')
ASSETS=ROOT/'samples/monopoly-go/ui-studio/assets'
AUTHORING=ASSETS/'authoring/hud-top/v001'
PRODUCTION=ASSETS/'production/hud-top'
MIRROR=ROOT/'src/tools/uxStudio/assets/import-staging/hud-top'
STATS=PRODUCTION/'alpha-stats_v001.json'
MANIFEST=ASSETS/'asset-manifest.json'
REPORT=ROOT/'_작업/codex/ux-studio/redrawn-hud-assets.md'
LIMIT=300000
MAPPING=[
 ('exec-669d9e96-6458-4df0-9a7a-a855e1629cef.png','common_hud-top_bar-bg_normal_v001','HUD 상단 바탕'),
 ('exec-656ffece-f259-4dda-ba43-febbf4ba05b4.png','common_hud-top_cash-icon_normal_v001','현금 아이콘'),
 ('exec-a1c40db3-95f0-4dea-9d9f-7f8dbcfa82e7.png','common_hud-top_shield-icon_normal_v001','방패 아이콘'),
 ('exec-62a0d0e9-8891-495d-a976-41aa3b81ca01.png','common_hud-top_player-avatar_normal_v001','플레이어 아바타')
]

def digest(data): return hashlib.sha256(data).hexdigest()
def relative(path): return str(path.relative_to(ROOT))
def write_new(path,data):
 path.parent.mkdir(parents=True,exist_ok=True)
 with path.open('xb') as file: file.write(data)
def json_new(path,value): write_new(path,(json.dumps(value,ensure_ascii=False,indent=2)+'\n').encode())
def alpha_stats(image):
 rgba=image.convert('RGBA');alpha=rgba.getchannel('A');w,h=image.size;histogram=alpha.histogram()
 corners={'topLeft':(0,0),'topRight':(w-1,0),'bottomLeft':(0,h-1),'bottomRight':(w-1,h-1)}
 return {'format':image.format,'mode':image.mode,'size':[w,h],'hasAlphaChannel':'A' in image.getbands(),
  'alphaRange':list(alpha.getextrema()),'center':{'xy':[w//2,h//2],'alpha':alpha.getpixel((w//2,h//2))},
  'corners':{key:{'xy':list(point),'alpha':alpha.getpixel(point)} for key,point in corners.items()},
  'alphaBBox':list(alpha.getbbox()) if alpha.getbbox() else None,'alphaBBoxDefinition':'alpha > 0; [left, top, rightExclusive, bottomExclusive]',
  'pixelCounts':{'fullyTransparent':histogram[0],'fullyOpaque':histogram[255],'partiallyTransparent':w*h-histogram[0]-histogram[255]}}

if MANIFEST.exists() or STATS.exists() or REPORT.exists(): raise RuntimeError('Existing manifest/stats/report found: preserve before proceeding')
for source,stem,_ in MAPPING:
 if not (SOURCE/source).is_file(): raise RuntimeError('Missing generated PNG: '+source)
 for destination in [AUTHORING/(stem+'.png'),PRODUCTION/(stem+'.webp'),MIRROR/(stem+'.webp')]:
  if destination.exists(): raise RuntimeError('Refusing to overwrite '+str(destination))

created=datetime.now(timezone(timedelta(hours=9))).isoformat(timespec='seconds')
entries=[];stats=[]
for source,stem,role in MAPPING:
 original=SOURCE/source;original_bytes=original.read_bytes();original_hash=digest(original_bytes)
 master=AUTHORING/(stem+'.png');production=PRODUCTION/(stem+'.webp');mirror=MIRROR/production.name
 write_new(master,original_bytes)
 with Image.open(BytesIO(original_bytes)) as image:
  image.load()
  if image.format!='PNG' or image.mode not in ('RGB','RGBA') or max(image.size)>4096: raise RuntimeError('Unsupported source format/mode/dimensions: '+source)
  source_stats=alpha_stats(image);attempts=[];encoded=None;quality=None
  for candidate in range(95,-1,-5):
   buffer=BytesIO();image.save(buffer,format='WEBP',quality=candidate,alpha_quality=100,method=6,exact=True)
   candidate_bytes=buffer.getvalue();attempts.append({'quality':candidate,'bytes':len(candidate_bytes)})
   if len(candidate_bytes)<=LIMIT: encoded=candidate_bytes;quality=candidate;break
  if encoded is None: raise RuntimeError('Cannot meet existing 300000-byte limit without resizing: '+source)
  with Image.open(BytesIO(encoded)) as decoded:
   decoded.load();production_stats=alpha_stats(decoded)
   if decoded.format!='WEBP' or decoded.size!=image.size: raise RuntimeError('WebP format/dimensions changed')
   alpha_unchanged=ImageChops.difference(image.convert('RGBA').getchannel('A'),decoded.convert('RGBA').getchannel('A')).getbbox() is None
   if not alpha_unchanged: raise RuntimeError('WebP alpha channel changed: '+source)
 write_new(production,encoded);write_new(mirror,encoded)
 if digest(original.read_bytes())!=original_hash or digest(master.read_bytes())!=original_hash: raise RuntimeError('Generated/master PNG changed')
 if digest(production.read_bytes())!=digest(mirror.read_bytes()): raise RuntimeError('Import mirror differs')
 record={'humanName':stem,'role':role,'version':'v001','generatedOriginal':str(original),'originalSHA256':original_hash,
  'authoring':{'path':relative(master),'format':'PNG','bytes':len(original_bytes),'sha256':digest(master.read_bytes())},
  'production':{'path':relative(production),'format':'WEBP','bytes':len(encoded),'sha256':digest(encoded),'quality':quality,'method':6,'alphaQuality':100,'exact':True},
  'importMirror':{'path':relative(mirror),'sha256':digest(encoded),'role':'Temporary import mirror only; authoring source remains in workspace assets/authoring'},
  'size':source_stats['size'],'alpha':{'source':source_stats,'production':production_stats,'channelUnchanged':alpha_unchanged},
  'promptProvenance':{'reference':'Figma 302','method':'concept redraw','generator':'ImageGen (parent-generated PNG supplied to this task)','promptText':None,'promptTextStatus':'미확인: 이 하위 작업에는 프롬프트 전문이 제공되지 않았습니다.','captureFragments':'W reference only; not cropped or reused as U production pixels'},
  'registration':None,'QAapproved':False,'QAstatus':'제안(검수 대기); 최종 시각 승인은 현중만',
  'notes':['Format conversion only; no crop, resize, background removal or alpha edits.']+(['Cash v001 outer halo preserved unchanged; parent is reviewing a possible v002.'] if 'cash-icon' in stem else [])}
 entries.append(record);stats.append({'humanName':stem,'originalSHA256':original_hash,'source':source_stats,'production':production_stats,'alphaChannelUnchanged':alpha_unchanged,'encodingAttempts':attempts})
 print(json.dumps({'name':stem,'size':record['size'],'quality':quality,'bytes':len(encoded),'sourceCenterAlpha':source_stats['center']['alpha'],'sourceCornerAlpha':{key:value['alpha'] for key,value in source_stats['corners'].items()},'alphaBBox':source_stats['alphaBBox'],'alphaUnchanged':alpha_unchanged},ensure_ascii=False))
json_new(STATS,{'version':1,'assetVersion':'v001','createdAtKST':created,'maxProductionBytes':LIMIT,'maxDimension':4096,'assets':stats})
json_new(MANIFEST,{'version':1,'assetVersion':'v001','createdAtKST':created,'status':'제안(검수 대기)','sourcePolicy':'New ImageGen concept redraw from Figma 302 reference; capture fragments are W reference only.','deliveryContract':'Authoring PNG masters are retained. Import mirror is temporary. Final design must reference registered workspace content hashes only.','Slot_3D':'Empty host slot; no 3D artwork generated or inserted by this task.','registration':None,'QAapproved':False,'alphaStats':relative(STATS),'assets':entries})
lines=['# HUD 상단 새 그림 자원 준비 · v001','',f'작성자 codex(단이) · {created} · 제안(검수 대기)','',
 '부모가 ImageGen으로 생성한 PNG 4개를 원본 바이트 그대로 사람이 읽는 이름으로 보존하고, 동일 크기의 WebP 생산 사본을 만들었습니다. 이미지 생성 프롬프트 전문은 이 하위 작업에서 확인하지 않았으며, Figma 302 콘셉트 재제작이라는 부모 전달 근거를 manifest에 구분했습니다.','',
 '| 자원 | 원본 크기 | WebP quality | 생산 bytes | 중앙 alpha | 원본 PNG SHA-256 |','| --- | --- | --- | --- | --- | --- |']
for entry in entries:
 lines.append('| '+entry['humanName']+' | '+'×'.join(map(str,entry['size']))+' | '+str(entry['production']['quality'])+' | '+str(entry['production']['bytes'])+' | '+str(entry['alpha']['source']['center']['alpha'])+' | '+entry['originalSHA256']+' |')
lines+=['','## 보존·검증','',
 '- 원본 generated_images PNG 4개는 읽기만 했으며 authoring 사본의 SHA-256이 원본과 같습니다.',
 '- 생산 WebP 4개는 각각 300,000bytes 이하, 원본과 같은 크기, 최대 4096px 이하입니다. 다시 디코딩한 알파 채널 전체를 원본과 비교하여 4/4 완전 일치를 확인했습니다.',
 '- PNG 전체 RGB를 WebP에서도 무손실이라고 주장하지 않습니다. 요청된 quality 기반 RGB 형식 변환이며 알파는 그대로 보존했습니다.',
 '- 중앙·네 모서리의 실제 알파, 알파 범위, alpha>0 bbox, 투명/불투명/부분 투명 픽셀 수는 통계 JSON에 원본/생산 양쪽으로 기록했습니다.',
 '- import-staging 생산 사본 4개의 SHA-256은 workspace production 파일과 같습니다.',
 '- crop·크기 변경·배경 제거·픽셀 보정은 하지 않았습니다. cash v001의 외곽 halo도 그대로 보존했습니다.',
 '- 최종 시각 승인·화면 품질 검수는 현중 판단 대기입니다. 기존 설계·소스 코드·가이드·STATUS·3D 슬롯은 수정하지 않았습니다. 브라우저 검수·실제 UI 자원 등록은 수행하지 않았고 registration=null, QAapproved=false입니다.','',
 '## 경로','',f'- Authoring: `{relative(AUTHORING)}/`',f'- Production: `{relative(PRODUCTION)}/`',f'- 임시 import mirror: `{relative(MIRROR)}/`',f'- Manifest: `{relative(MANIFEST)}`',f'- Alpha 통계: `{relative(STATS)}`','',
 '## 판단 필요','', 'cash 외곽 halo의 v002 교체 여부와 네 자원의 최종 시각 승인은 부모/현중 검수로 남깁니다. 새 그림이 생성·보존되었다는 사실과 U 단계 시각 승인은 구분합니다.']
write_new(REPORT,('\n'.join(lines)+'\n').encode())
print(json.dumps({'writtenManifest':str(MANIFEST),'writtenStats':str(STATS),'writtenReport':str(REPORT),'count':len(entries)},ensure_ascii=False))
