from pathlib import Path
import json,shutil
root=Path('/Users/max/projest_max/ui-studio')
stage=Path(__file__).parent
backup=root/'docs/planning/_backup/20261124_단이/마을건설현황'
ux=root/'src/tools/uxStudio'
w='workspace-cfa517bd-d9e1-40c4-aa1f-576e182500ba'
h=json.loads((stage/'hud-village-saved.json').read_text())
b=json.loads((stage/'build-village-saved.json').read_text())
entries=json.loads((stage/'entries.json').read_text())
def write(p,data):
 saved=backup/p.relative_to(root)
 if p.exists() and not saved.exists():
  saved.parent.mkdir(parents=True,exist_ok=True)
  shutil.copy2(p,saved)
 p.parent.mkdir(parents=True,exist_ok=True)
 p.write_text(data)
doc=ux/'planning-documents.json'
data=json.loads(doc.read_text())
hud=next(x for x in data['projects'] if x['workspaceId']==w and x['projectId']==h['projectId'])
build=next(x for x in data['projects'] if x['workspaceId']==w and x['projectId']==b['projectId'])
M='simulator_module_building';H='simulator_module_hud'
def target(screen):
 return dict(projectId=b['projectId'],screenId=screen,backModule=H,rememberOrigin=True)
for board in ('main','main-solo','arrived','defense-full'):
 for key,_,screen,*_ in entries:
  hud['previewModules'][f'{board}.village-{key}']=target(screen)
  if key in ('dance','broadcast'):hud['previewModules'][f'{board}.village-{key}.badge']=target(screen)
  hud['screens'][board]['elements'][f'{board}.village-{key}']='build-access'
  if key in ('dance','broadcast'):hud['screens'][board]['elements'][f'{board}.village-{key}.badge']='build-access'
 hud['screens'][board]['elements'][f'{board}.village-map']='build-access'
hud['previewModules'][M]=target('city')
for s in ('defense-failed','defense-ignore'):
 hud['previewModules'][s+'.repair']=target('facility-repair-defense')
for section in hud['sections']:
 if section['id']=='build-access':section['fields']=[
  dict(label='진입',value='보드 건물 및 지붕 위 상태 버튼, 건설 탭, 엔터파워 상세에서 선택한다. 로비 건물과 건설 카드가 동일 시설 화면을 사용한다.'),
  dict(label='상태',value='보유금과 다음 견적을 비교한다. 파손은 수리 필요, 30단계에는 증설 가능을 끈다. 현 UI 스튜디오 배지는 예시 상태다.')]
build['previewModules']={k:v for k,v in build['previewModules'].items() if k not in ('facilities.dock.hammer',)}
build['previewOriginExits']={
 'entries':[e[2] for e in entries]+['facility-repair-defense'],
 'elements':[e['id'] for s in b['screens'] if not s['id'].startswith('city') for e in s['elements'] if e['id'].endswith(('.back','.return'))]}
build['screens']={}
for s in b['screens']:
 id=s['id']
 sec='overview' if id.startswith('city') else 'parts' if id.endswith('parts') else 'flow' if id.startswith('construction') or 'restored' in id else 'windows'
 build['screens'][id]=dict(section=sec,elements={})
build['canvasReview']['boards']=[s['id'] for s in sorted(b['screens'],key=lambda s:(s['canvasPosition']['y'],s['canvasPosition']['x']))]
build['sections']=[dict(id=id,title=title,fields=[dict(label='기준',value=text)]) for id,title,text in [
 ('overview','건설 현황','9곳 3×3 한 화면 · 카드 안 세로로 꽉 찬 흑백 외관 · 전체 단계와 상태 레이어.'),
 ('windows','같은 마을에 집중','로비와 건설 현황에서 같은 시설 화면. 전체 0~30단계, 비용·효과, +1·최대, 파손 복구. 상단 카메라 컷과 하단 작업 패널을 유지.'),
 ('flow','건설·증설·수리 흐름','0단계 견적·첫 건설, 한 단계·최대 견적과 조립, 파손 원인별 수리와 단계 보존. 결과에서 현황 복귀 시 표시를 갱신.'),
 ('parts','공통 부품','사진 117×144 · 상태 배지 · 시설 단계 · 로비 건물 터치 면과 지붕 위 표식은 별도 편집 요소.')]]
write(doc,json.dumps(data,ensure_ascii=False,indent=2)+'\n')
preview=ux/'preview.mjs'
src=preview.read_text()
marker='''        const backModule = params.get('back');'''
addition='''        const originExits = index?.projects?.find(entry => entry.workspaceId === workspaceId && entry.projectId === id)?.previewOriginExits;
        if (origin && originExits?.entries?.includes(startScreen)) {
            const elements = new Set(originExits.elements);
            for (const transition of d.transitions) {
                if (elements.has(transition.fromElement)) Object.assign(transition, {
                    action:'module', targetScreen:null, payload:{moduleId:previewToken,label:'진입 화면으로 돌아가기'}
                });
            }
        }
'''
if 'const originExits = ' not in src:
 assert marker in src
 write(preview,src.replace(marker,marker+'\n'+addition,1))
