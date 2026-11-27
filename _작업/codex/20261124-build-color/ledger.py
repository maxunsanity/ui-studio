from pathlib import Path
from collections import Counter
from functools import lru_cache
from PIL import Image
from io import BytesIO
import csv,json,re,base64,hashlib
r=Path.cwd(); stage=Path(__file__).parent
root=Path('/Users/max/projest_max/ui-guideline-israt/ui-studio')
registry=json.loads((r/'src/tools/uxStudio/planning-documents.json').read_text())
ws='workspace-cfa517bd-d9e1-40c4-aa1f-576e182500ba'
entries=[e for e in registry['projects'] if e['workspaceId']==ws and e.get('planningTab') and e['planningTab']!='hud']
browser={p['projectId']:p for p in json.loads((stage/'browser.json').read_text())}
assert len(entries)==len(browser)==10
partsName=re.compile(r'부품|부속|부자재|리소스 보드')
sceneName=re.compile(r'3d|전장|월드맵|시설 외관|건설 맵|무대|월드 맵|location.art|world|stage.idol|전신|시설 사진|몬스.*(초상|이미지|기존 캐릭터)|장소 배경|방어.*시설',re.I)
physical=re.compile(r'^(sha256-[0-9a-f]{64}\.(png|webp|jpg))$')
@lru_cache(maxsize=None)
def color(ref):
    if ref.startswith('data:'):im=Image.open(BytesIO(base64.b64decode(ref.split(',',1)[1])))
    elif physical.fullmatch(ref):im=Image.open(root/'assets'/ref)
    else:return '색상 미분석'
    im=im.convert('RGBA')
    im.thumbnail((128,128))
    px=[(x,y,z) for x,y,z,a in im.getdata() if a>60]
    if not px:return '투명'
    return '컬러' if sum(max(p)-min(p)>12 for p in px)/len(px)>.015 else '흑백·저채도'
def frame(s):
    if s['kind']=='page':return '',None
    canvas=s.get('logicalSize') or {'w':390,'h':844}
    opted=s.get('presentation') or {}
    search=[]
    for e in s['elements']:
        if e.get('parentId') or e['kind'] not in ['panel','card','list']:continue
        key=e['id'].lower()
        named=any(x in key for x in ['.window','.panel','.sheet','.dialog','.surface'])
        if e['w']>55 and 10<e['h']<99 and (named or e.get('skin')):
            search.append((int(named),e['w']*e['h'],e))
    if not search:return opted.get('rootMode','window'),None
    e=max(search,key=lambda q:q[:2])[-1]
    return opted.get('rootMode','window'),{k:round(e[k]*canvas['w' if k in ('x','w') else 'h']/100,1) for k in ('x','y','w','h')}
tables=[];all_assets=[];all_screens=[];overlap=[]
for p in entries:
    key=p['projectId']
    d=json.loads((root/'designs'/f'{key}.json').read_text())
    evidence=browser[key]
    assert {q['screen'] for q in evidence['checks']}=={s['id'] for s in d['screens']}
    docboards=set(p.get('canvasReview',{}).get('boards',[]))
    counts=Counter()
    boxes=[]
    for s in d['screens']:
        sid=s['id']; name=s['name']
        is_part=bool(partsName.search(name)) and s['kind']=='page'
        m=p['screens'].get(sid)
        checks=[v for v in evidence['checks'] if v['screen']==sid]
        assert len(checks)==2
        logical=s.get('logicalSize',{'w':390,'h':844})
        overlay=s.get('presentation',{})
        rootMode,box=frame(s)
        images=[];refmissing=[];gray=[];preserved=[];placeholder=[];vector=[]
        counts['screens']+=1
        counts['parts']+=is_part
        counts['mapped']+=m is not None
        counts['canvas']+=sid in docboards
        counts['overlay']+=s['kind']!='page'
        counts[s['kind']]+=1
        counts['fonts']+=sum(e.get('typography',{}).get('family') not in (None,'system') for e in s['elements'])
        nm=sum(1 for e in s['elements'] if e.get('skin',{}).get('mode')=='9')
        counts['9slice']+=nm
        for e in s['elements']:
            i=e.get('image') or {}
            if e['kind']=='image' and not any(i.get(k) for k in ('src','asset','assetRef')):placeholder.append(e['id'])
            a=e.get('appearance',{})
            if e['kind'] in ('panel','card','button') and not e.get('skin') and a.get('strokeWidth',0)>0 and a.get('radius',0)>0 and a.get('opacity',1)>0:
                vector.append(e['id'])
            candidates=[]
            if i:candidates.append(('이미지',i))
            for kind,textures in [('프레임',e.get('skin',{}).get('textures',{})),('탭',e.get('control',{}).get('tabSkin',{}).get('textures',{})),('버튼 상태',e.get('buttonState',{}).get('images',{}))]:
                candidates.extend((kind+' '+state,img) for state,img in textures.items() if isinstance(img,dict))
            for usage,img in candidates:
                ref=img.get('assetRef') or img.get('src') or img.get('asset') or ''
                if not ref:continue
                valid=not physical.fullmatch(ref) or (root/'assets'/ref).is_file()
                if not valid:refmissing.append(e['id']+' '+ref)
                # 3D designation is explicit for marked art, or a candidate based on the authored label.
                look='3D 명시' if img.get('preserveColor') else '3D 확인 후보' if usage=='이미지' and sceneName.search(' '.join([e['id'],e.get('name',''),img.get('alt','')])) else '2D 또는 분류 미표기'
                tint=color(ref) if valid and look.startswith('3D') else '색상 미분석'
                if look.startswith('3D') and tint=='흑백·저채도':gray.append(e['id'])
                if img.get('preserveColor'):preserved.append(e['id'])
                rec={'프로젝트':p['planningTab'],'화면 ID':sid,'부품 ID':e['id'],'용도':usage,'이름':img.get('alt') or e.get('name'),'리소스':ref if not ref.startswith('data:') else '내장 이미지 '+ref.split(';')[0][5:]+':'+hashlib.sha256(base64.b64decode(ref.split(',',1)[1])).hexdigest(),'분류':look,'원본 색상':tint,'실물 파일':valid,'부품 보드':is_part,'컬러 보존':bool(img.get('preserveColor'))}
                all_assets.append(rec);images.append(rec)
        if s.get('canvasPosition'):
            pos=s['canvasPosition'];boxes.append((sid,pos['x'],pos['y'],logical['w'],logical['h']))
        bad={e[0] for v in checks for e in v['bad'] if e[0]}; missing={e[0] for v in checks for e in v['missing'] if e[0]}
        text={e[0] for v in checks for e in v['text'] if e[0]}
        cnt=len([q for q in d['transitions'] if q['targetScreen']==sid])
        counts['image-refs']+=len([q for q in images if q['용도']=='이미지'])
        counts['missing']+=len(missing)
        counts['bad']+=len(bad)
        counts['refmissing']+=len(refmissing)
        counts['gray']+=len(set(gray))
        counts['preserved']+=len(preserved)
        counts['text']+=len(text)
        counts['vector']+=len(vector)
        counts['overflow']+=int(any(v['overflow'] for v in checks))
        counts['unresolved']+=sum(len(v['pending']) for v in checks)
        all_screens.append({'기능':p['planningTab'],'버전':d['revision'],'화면 ID':sid,'화면명':name,'종류':s['kind'],'부품 보드':is_part,'명세 매핑':m['section'] if m else '', '명세 부품 연결 수':len((m or {}).get('elements',{})), '보드 노출':sid in docboards, '요소 수':len(s['elements']),'9분할 요소 수':nm,'이미지·상태 참조 수':len(images),'벡터 외곽 후보':vector,'원본 흑백 3D 후보':sorted(set(gray)),'컬러 보존 지정':preserved,'파일 누락':refmissing,'오류 이미지':sorted(bad),'미등록 이미지 후보':sorted(missing),'빈 이미지 요소':placeholder,'텍스트 넘침 후보':sorted(text),'가로 넘침':any(v['overflow'] for v in checks),'뷰포트 검사':len(checks),'창 기준':rootMode,'창 프레임 후보':box,'프레젠테이션':overlay,'진입 연결 수':cnt})
    for idx,(a,x,y,w,h) in enumerate(boxes):
        for b,u,v,z,k in boxes[idx+1:]:
            width=min(x+w,u+z)-max(x,u);height=min(y+h,v+k)-max(y,v)
            if width>1 and height>1:overlap.append((p['planningTab'],a,b,round(width,1),round(height,1)))
    tables.append({'key':p['planningTab'],'id':key,'rev':d['revision'],'prev':evidence['revision'],'boards':[s['id'] for s in d['screens'] if partsName.search(s['name']) and s['kind']=='page'],'counts':dict(counts)})
report={'projects':tables,'screens':all_screens,'assetRows':len(all_assets),'overlap':overlap,'browserChecks':sum(len(q['checks']) for q in browser.values())}
(stage/'ledger.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
with (stage/'screen-audit.csv').open('w',newline='',encoding='utf-8-sig') as f:
 writer=csv.DictWriter(f,list(all_screens[0]));writer.writeheader();writer.writerows({k:json.dumps(v,ensure_ascii=False) if isinstance(v,(list,dict)) else v for k,v in q.items()} for q in all_screens)
with (stage/'resource-audit.csv').open('w',newline='',encoding='utf-8-sig') as f:
 writer=csv.DictWriter(f,list(all_assets[0]));writer.writeheader();writer.writerows(all_assets)
for p in tables:print(p)
print('overlap',len(overlap),'entries',len(all_screens),len(all_assets))
