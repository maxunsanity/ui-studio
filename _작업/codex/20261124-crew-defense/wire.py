from pathlib import Path
import json,shutil
r=Path('/Users/max/projest_max/ui-studio'); stage=Path(__file__).parent
backup=r/'docs/planning/_backup/20261124_단이/크루미션과디펜스분리'
src=r/'src/tools/uxStudio'
ws='workspace-cfa517bd-d9e1-40c4-aa1f-576e182500ba'
def load(mode):return json.loads((stage/(mode+'-saved.json')).read_text())
def write(p,value):
 saved=backup/p.relative_to(r)
 if not saved.exists() and p.exists():
  saved.parent.mkdir(parents=True,exist_ok=True)
  shutil.copy2(p,saved)
 p.parent.mkdir(parents=True,exist_ok=True)
 p.write_text(value)
def obj(p,d):write(p,json.dumps(d,ensure_ascii=False,indent=2)+'\n')
h=load('hud-defense-split'); d=load('defense'); c=load('crew-mission')
index=src/'planning-documents.json'
registry=json.loads(index.read_text())
def project(id):
 return next((x for x in registry['projects'] if x['workspaceId']==ws and x['projectId']==id),None)
def fields(id,title,*text):return dict(id=id,title=title,fields=[dict(label='제작 기준',value=p) for p in text])
hud=project(h['projectId']); crew=project(c['projectId']); build=project('kpop-build-ui')
hids={s['id'] for s in h['screens']};dids={s['id'] for s in d['screens']}
hud['canvasReview']['boards']=[x for x in hud['canvasReview']['boards'] if x in hids]
hud['screens']={k:v for k,v in hud['screens'].items() if k in hids}
hud['previewModules']={k:v for k,v in hud['previewModules'].items() if k.rsplit('.',1)[0] not in ('defense-failed','defense-ignore')}
M='simulator_module_bad_energy';H='simulator_module_hud';B='simulator_module_building'
hud['previewModules'][M]=dict(projectId=d['projectId'],screenId='defense-full',rememberOrigin=True)
hud['previewModules']['defense-full.roll']=dict(projectId=d['projectId'],screenId='defense-ignore',rememberOrigin=True)
hud['sections']=[x for x in hud['sections'] if x['id']!='bad-energy-defense']+[
 fields('bad-energy-defense','디펜스 진입 · 나쁜 기운 게이지','평상시 설명 · 가득 찬 게이지 선택으로 별도 디펜스의 습격 경고를 엽니다.','가득 찬 채 수동 굴림은 별도 디펜스의 그냥 두기 결과로 이어집니다.')]
for name in ('main','main-solo','arrived','defense-full'):
 if name in hud['screens']:
  hud['screens'][name]['elements'][name+'.rail0.1']='bad-energy-defense'
hud['screens']['defense-full']['elements']['defense-full.roll']='bad-energy-defense'
for id in ['defense-full','defense-gauge-help']:
 hud['screens'][id]['section']='bad-energy-defense'

cs=[s for s in c['screens'] if s['id'].startswith('crew-mission')]
crew['sections']=[x for x in crew['sections'] if x['id']!='crew-mission']+[
 fields('crew-mission','크루 미션 · 공동 목표와 내 미션','크루원·크루장 메인 메뉴 → 크루 미션. 1~8주 주간, 9주 월드. 받은 상태는 완료 표시.','공동 목표의 진행과 개인 미션을 같은 화면에 표시합니다. 보상은 기존 재화이며 예시 숫자·지급 정책은 확정값과 구분합니다.')]
crew['canvasReview']['boards']=list(dict.fromkeys(crew['canvasReview']['boards']+[s['id'] for s in cs]))
for s in cs:crew['screens'][s['id']]=dict(section='crew-mission',elements={})
for s in c['screens']:
 for e in s['elements']:
  if e['id'].startswith(s['id']+'.menu-mission') and s['id'] in crew['screens']:
   crew['screens'][s['id']]['elements'][e['id']]='crew-mission'

defense=project(d['projectId'])
if defense is None:
 defense={};registry['projects'].insert(registry['projects'].index(hud)+1,defense)
def screen_section(id):
 if 'part' in id:return 'parts'
 if 'formation' in id:return 'formation'
 if any(word in id for word in ('success','failed','ignore')):return 'result'
 if any(word in id for word in ('battle','boss','skill','pause','quit','cleanup')):return 'battle'
 return 'overview'
defense.update(dict(
 workspaceId=ws,projectId=d['projectId'],title='디펜스 · 2차 작업 명세',
 viewer='kpop-defense/index.html',planningDocument='P265',planningTab='defense',
 homeMenuLabel='디펜스',overviewScreen=d['entryScreen'],status='제안(검수 대기)',
 canvasReview={'boards':[s['id'] for s in sorted(d['screens'],key=lambda s:(s.get('canvasPosition',{}).get('y',0),s.get('canvasPosition',{}).get('x',0)))]},
 sections=[
 fields('overview','디펜스 · 진입과 경고','HUD의 가득 찬 게이지 → 습격 경고. 가득 찬 채 굴림은 그냥 두기 결과. 습격 대상은 파손되지 않은 최고 단계 연습실, 동률이면 무작위.'),
 fields('formation','몬스 출격 편성','최대 10마리. 해당 습격 한 번에만 바뀐 편성을 적용. 다음에는 단 × 기분 능력 순으로 자동. 기분 70 이상 120%, 35~69 100%, 35 미만 70%.'),
 fields('battle','전투와 보스','이동·공격·카메라는 자동. 선택 카드·피니시·멈춤. 4분에 일반 적 출현 종료, 전투 최대 5분.'),
 fields('result','결과와 복귀','실패는 처치 보상만. 성공 때 지킴 덤. 전투를 안 하면 게이지 0과 파손. 수리비는 마지막 건설비의 50%. 건설의 해당 연습실 상세로 연결.'),
 fields('parts','디펜스 공통 부품','몬스 슬롯·기분과 능력·내구도·스킬 카드·보스와 결과 상태의 반복 부품.')],
 screens={s['id']:dict(section=screen_section(s['id']),elements={}) for s in d['screens']},
 previewEntryActions={'defense-full':'defense-full.rail0.1'},
 previewModules={H:dict(projectId=h['projectId'],screenId='main'),B:dict(projectId=build['projectId'],screenId='facility-repair-defense',backModule=M,rememberOrigin=True)}
))
defense['previewModules']['defense-full.back-hud']=dict(projectId=h['projectId'],screenId='defense-full')
for t in d['transitions']:
 e=t['fromElement']
 if t['action']=='module' and t.get('payload',{}).get('moduleId')==B:
  defense['previewModules'][e]=dict(projectId=build['projectId'],screenId='facility-repair-defense',backModule=M,rememberOrigin=True)
 if t['action']=='module' and t.get('payload',{}).get('moduleId')==H and (t['fromScreen']=='defense-warning' or e.endswith('.back-hud')):
  defense['previewModules'][e]=dict(projectId=h['projectId'],screenId='defense-full')
build['previewModules'][M]=dict(projectId=d['projectId'],screenId='defense-full')
assert 'defense-ignore' in dids
assert d['entryScreen'] in dids
obj(index,registry)
reader=src/'guide/reference/kpop-planning/library-model.mjs'
data=reader.read_text()
if "'kpop-defense/index.html'" not in data:
 mark="'kpop-build/index.html'"
 assert mark in data
 write(reader,data.replace(mark,mark+",'kpop-defense/index.html'",1))
preview=src/'preview.mjs'
data=preview.read_text()
if 'previewEntryActions' not in data:
 data=data.replace('        if (consumer)\n            consumer.updateDesign(d);','        const firstMount = !consumer;\n        if (consumer)\n            consumer.updateDesign(d);',1)
 marker='        fit();syncPreviewPage();'
 assert marker in data
 data=data.replace(marker,marker+'''
        if (firstMount) {
            const entry = index?.projects?.find(project => project.workspaceId===workspaceId && project.projectId===id);
            const action = entry?.previewEntryActions?.[d.entryScreen];
            if (d.transitions.some(transition => transition.fromScreen===d.entryScreen && transition.fromElement===action && transition.action==='open')) {
                Array.from(host.querySelectorAll('[data-element]'))
                    .find(element => element.dataset.element===action)?.click();
            }
        }''',1)
 write(preview,data)
