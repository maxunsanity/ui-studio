from pathlib import Path
import json, re, shutil
from html import escape
from urllib.parse import urlencode
r=Path('/Users/max/projest_max/ui-studio')
ref=r/'src/tools/uxStudio/guide/reference'
ux=ref.parent.parent
folder=ref/'kpop-planning'/'snapshot'
stage=Path(__file__).parent
backup=r/'docs/planning/_backup/20261124_단이/건설HUD디펜스'
w='workspace-cfa517bd-d9e1-40c4-aa1f-576e182500ba'
hud='import-6604270d'
build='kpop-build-ui'
H='simulator_module_hud';B='simulator_module_building'
D={mode:json.loads((stage/(mode+'-saved.json')).read_text()) for mode in ('build','hud-defense')}
b=D['build'];h=D['hud-defense']
viewer='kpop-build/index.html'
hud_view='kpop-lobby/review-2/index.html'
origin='http://127.0.0.1:7007/docs/planning/삼중AI_공용_20260929/산출/기획서/'
guide='/ui-studio/source/guide/reference/'
plan=guide+'kpop-planning/index.html?doc=P265'
def url(page, p, screen, **extra):
 return '/ui-studio/'+page+'?'+escape(urlencode(dict(workspace=w,project=p,screen=screen,**extra)))
def art(p,s):return url('source/sample-preview.html',p,s,view='detailed-wireframe')
def preview(p,s):return url('preview.html',p,s)
def canvas(p,s):return url('canvas.html',p,s,view='detailed-wireframe',layout='grid')
def link(text,url):return f'<a href="{url}">{text}</a>'
def write(dest,value):
 if dest.is_file():
  dest_backup=backup/dest.relative_to(r)
  dest_backup.parent.mkdir(parents=True,exist_ok=True)
  if not dest_backup.exists():shutil.copy2(dest,dest_backup)
 dest.parent.mkdir(parents=True,exist_ok=True)
 dest.write_text(value)
def pack(data):return json.dumps(data,ensure_ascii=False,indent=2)+'\n'
def fields(section,title,notes):return dict(id=section,title=title,fields=[dict(label='제작 기준',value=n) for n in notes])
build_notes=[
 '3×3에 9개 시설. 상단은 로비 HUD, 바로 아래 돈·대전 방패·목록 보기.',
 '하단 시설 바로 관리는 3장 예시. 증설 가능·수리 필요·새로 짓기를 우선해 카드에서 해당 상세를 바로 연다. 모든 시설은 지도나 목록에서 선택한다.',
 '지도·목록 전체 화면, 상세 바텀시트, 구매 확인 가운데 모달. 공통 외곽 374×748, 캔버스 390×844.',
 '30단계를 본관 1~10, 부속 A 11~20, 부속 B 21~30으로 읽는다. 상세는 전체 단계, 3동 진행 바, 다음 대상 동, +1·최대 증설을 보여 준다. 비용·잔액·엔터재화는 연결 전 —.'
]
def_notes=[
 'HUD 왼쪽 1번 사다리 특가를 나쁜 기운으로 교체. 평상 62%는 검수값이고 가득 차면 자동 굴리기 멈춤.',
 '가득 찬 게이지를 눌러 경고. 방어 시작 → 3D 전투 → 스킬·보스·잔여 정리 → 결과.',
 '경고·게이지·일시정지·종료 확인은 모달, 스킬은 바텀시트, 전투와 결과는 전체 화면.',
 '방어 실패·그냥 두기에서 건설 파손 지도 진입. 방패·기분 소모는 출연권 대전에만.'
]
registry=ux/'planning-documents.json'
idx=json.loads(registry.read_text())
target=next(p for p in idx['projects'] if p['projectId']==hud and p['workspaceId']==w)
target['sections']=[s for s in target['sections'] if s['id'] not in ('bad-energy-defense','build-access')]+[
 fields('bad-energy-defense','HUD 부속 · 나쁜 기운 디펜스',def_notes),
 fields('build-access','건설 진입', ['하단 건설과 엔터파워 상세에서 도시 지도로 연결한다.','방어 실패 또는 그냥 두기의 수리 버튼은 디펜스 파손 상태로 진입한다.'])
]
target['canvasReview']['boards']=list(dict.fromkeys(target['canvasReview']['boards']+[s['id'] for s in h['screens'] if s['id'].startswith(('defense-','build-power'))]))
for s in h['screens']:
 sid=s['id']
 if sid.startswith('defense-'):target['screens'][sid]=dict(section='bad-energy-defense',elements={})
 if sid.startswith('build-power'):target['screens'][sid]=dict(section='build-access',elements={})
 if sid in ('main','main-solo','arrived','defense-full'):
  maps=target['screens'][sid]['elements']
  for key,sec in [('rail0.1','bad-energy-defense'),('dock.hammer','build-access'),('power','build-access')]:maps[sid+'.'+key]=sec
target['previewModules'][B]=dict(projectId=build,screenId='city',backModule=H,rememberOrigin=True)
for sid in ('defense-failed','defense-ignore'):
 target['previewModules'][sid+'.repair']=dict(projectId=build,screenId='city-damaged',backModule=H,rememberOrigin=True)
previewModules={H:dict(projectId=hud,screenId='main'),
'simulator_module_photocard':dict(projectId='import-6b577b09',screenId='list'),
'simulator_module_schedule':dict(projectId='kpop-schedule-ui',screenId='home'),
'simulator_module_mission':dict(projectId='kpop-mission-ui',screenId='daily'),
'simulator_module_shop':dict(projectId='kpop-shop-ui',screenId='featured'),
'simulator_module_profile':dict(projectId='kpop-profile-ui',screenId='team-info')}
buildScreens={}
for s in b['screens']:
 sid=s['id']
 sidSection='overview' if sid in ('city','city-damaged','facilities') else 'windows' if s['kind']!='page' else 'parts' if sid=='construction-parts' else 'flow'
 buildScreens[sid]=dict(section=sidSection,elements={})
entry=dict(workspaceId=w,projectId=build,title='건설 · 2차 작업 명세',viewer=viewer,planningDocument='P265',planningTab='build',homeMenuLabel='건설',overviewScreen='city',status='제안(검수 대기)',screens=buildScreens,previewModules=previewModules,canvasReview=dict(boards=list(buildScreens),parts='construction-parts'),sections=[
 fields('overview','건설 도시 지도',build_notes),
 fields('windows','시설 상세 · 확인',build_notes[2:]),
 fields('flow','건설·수리 결과', ['보드 진행 중에도 진입 가능. 확인/연출/결과/복귀 순서.']),
 fields('parts','공통 부품', ['삼동 쿼터뷰 · 비용/단계 · 증설 및 수리 상태 · 9슬라이스 창'])
])
idx['projects']=[p for p in idx['projects'] if not (p['projectId']==build and p['workspaceId']==w)]
idx['projects'].insert(idx['projects'].index(target)+1,entry)
for sid in ('city','city-damaged','facilities'):
 previewModules[sid+'.dock.hammer'] = dict(projectId=hud,screenId='main')
write(registry,pack(idx))
library=ref/'kpop-planning'/'library-model.mjs'
ls=library.read_text().replace("'kpop-mons/index.html','kpop-crew/index.html','kpop-profile/index.html'", "'kpop-mons/index.html','kpop-crew/index.html','kpop-profile/index.html','kpop-build/index.html'")
assert 'kpop-build/index.html' in ls
write(library,ls)
def table(design,screens,notes):
 rows=[]
 kinds={'page':'전체 화면','sheet':'바텀시트','modal':'가운데 모달'}
 for s in design['screens']:
  sid=s['id']
  if sid not in screens:continue
  target=art(design['projectId'],sid)
  nexts=[t['label'] for t in design['transitions'] if t['fromScreen']==sid and t['label'] and t['action'] in ('open','navigate','close')]
  body=notes.get(sid,' · '.join(dict.fromkeys(nexts[:4])) or '편집 부품과 상태 확인')
  kind='부품 보드' if sid.endswith('-parts') else kinds.get(s['kind'],s['kind'])
  size='374 × 748' if s['kind'] in ('sheet','modal') else '390 × 844'
  rows.append(f'<tr><th scope="row">{link(escape(s["name"]),target)}<br><small>{sid}</small></th><td>{kind}</td><td>{size}</td><td>{escape(body)}</td></tr>')
 return '<table><thead><tr><th>화면</th><th>유형</th><th>논리 크기</th><th>동작·확인</th></tr></thead><tbody>'+''.join(rows)+'</tbody></table>'
btable=table(b,buildScreens,{
 'city':'9개 선택 + 하단 증설·수리·새로 짓기 바로 관리. 예능 방송국은 대전 파손, 댄스 연습실은 증설 예시.',
 'facilities':'지도와 같은 시설을 열고 닫을 때 원래 목록 유지.',
 'city-damaged':'디펜스 실패·그냥 두기에서 진입. 댄스 연습실 파손 선택.',
 'facility-repair-defense':'연습 중단, 도착 보상 감소. 수리비 확정 대기, 버튼은 결과 화면 검수.',
 'facility-detail':'세 동 현재 → 다음 비교. 한 단계 또는 최대 증설 확인으로 진입.',
 'facility-confirm':'선택한 시설의 비용과 잔액, 진행 또는 취소.',
 'construction-assembly':'대표 3D 컷. 연출 건너뛰기 → 결과.'
})
dtable=table(h,[s['id'] for s in h['screens'] if s['id'].startswith(('defense-','build-power'))],{
 'defense-full':'가득 찬 게이지 → 습격 경고. 자동 굴리기 멈춤. 수동 굴리기는 그냥 두기 검수 상태.',
 'defense-warning':'공격 대상, 손해, 출격 몬스. 방어하기 또는 그냥 두기.',
 'defense-battle':'시설 내구도 3동·경고·선택·일시정지.',
 'defense-skills':'3장 중 1장. 전투는 계속. 스킬 종류별 이미지.',
 'defense-boss':'3구간 체력, 포격 경고, 피니시.',
 'defense-cleanup':'새 적 출현 마감 뒤 잔여 적 정리. 두 결과를 검수.',
 'defense-failed':'피해 안내와 수리 진입 → 건설 파손 지도.',
 'defense-ignore':'피해 안내와 수리 진입 → 건설 파손 지도.',
 'defense-parts':'게이지 2상태·내구도·보스·창 크기·9슬라이스.'
})
unconfirmed='전투 편성 위치, 몬스 0마리일 때 행동, 난이도, 전투 방향은 기획 결정 대기입니다. 240초는 일반 적 출현 마감이고 전체 상한은 5분입니다. 디펜스 수리비 문구는 P104와 CSV가 충돌해 확인 중으로 표시했습니다.'
flow='도시 지도 → 시설 상세 → 증설 또는 수리 → 조립·결과 → 지도. 디펜스 피해에서는 파손 지도로 진입합니다.'
style='''body{margin:0;background:#f2f4f6;color:#253342;font:15px/1.65 system-ui,sans-serif} main{max-width:1100px;margin:auto;padding:24px 18px 60px}nav{display:flex;gap:16px;flex-wrap:wrap} section{background:white;border:1px solid #ccd5dc;border-radius:10px;margin:16px 0;padding:16px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #d3dbe3;padding:7px;text-align:left;vertical-align:top;overflow-wrap:anywhere}img{max-width:100%;height:auto}.shots{display:flex;flex-wrap:wrap;gap:16px}.shots figure{margin:0;width:min(100%,235px)}small{color:#556575}'''
def shot_rows(rows):
 return '<div class="shots">'+''.join(f'<figure><a href="{art(p,s)}"><img src="../kpop-planning/snapshot/assets/{img}.png" loading="lazy" alt="{escape(label)}" width="225"></a><figcaption>{escape(label)}</figcaption></figure>' for p,s,img,label in rows)+'</div>'
buildfig=[(build,'city','build-r4-city','도시 지도'),(build,'facility-detail','build-r4-detail','시설 상세'),(build,'city-damaged','build-r4-damaged','디펜스 파손 지도')]
deffig=[(hud,'defense-full','hud-r17-defense-full','HUD 가득'),(hud,'defense-warning','hud-r17-defense-warning','습격 경고'),(hud,'defense-boss','hud-r17-defense-boss','보스 및 내구도')]
build_head=f'<h1>건설 · 2차 작업 명세</h1><p>r{b["revision"]} · {len(b["screens"])}개 편집 보드 · 제안(검수 대기)</p>'
build_nav='<nav>'+link('편집 캔버스',canvas(build,'city'))+link('동작 미리보기',preview(build,'city'))+link('UI 기획서',plan+'#build')+'</nav>'
write(ref/viewer,f'''<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>건설 · 2차 작업 명세</title><style>{style}</style><body><main>{build_head}{build_nav}
<section id="overview"><h2>도시 지도와 바로 관리</h2><p>{flow}</p><p>{' '.join(build_notes)}</p><p>UI 스튜디오 모노폴리 GO 건설 샘플의 상단 재화, 큰 시설 영역, 하단 단계·비용 카드의 구조를 참고했습니다. 케이팝몬스터즈의 9곳은 3×3으로 전부 표시하고 아래에는 우선 관리 3장 예시만 배치했습니다.</p>{shot_rows(buildfig)}</section>
<section id="windows"><h2>창과 화면별 규격</h2>{btable}</section>
<section id="flow"><h2>진입과 복귀</h2><p>HUD 하단 건설 또는 엔터파워 상세에서 들어갑니다. 건설 상세 바텀시트를 닫으면 원래 지도나 목록으로 돌아갑니다. 전투 결과의 수리하기는 파손 지도에서 해당 연습실을 강조합니다.</p><p>표준 규칙은 P81·P106과 7007 건설 1차를 따릅니다. 표와 연결해야 하는 비용·효과는 —이며 최대 증설 확인 기준·수리 순서는 검수 대기입니다.</p></section>
<section id="parts"><h2>리소스와 부품</h2><p>facility_growth_blender_v01의 기존 모델 8종을 같은 쿼터뷰로 렌더했습니다. 아카데미는 현재 사용 가능한 모델을 확인하지 못해 공통 건설 아이콘을 씁니다. 모델이나 재화 그림과 문구는 별도 레이어입니다.</p><p>3D 연출 프레임은 2차 대표 컷입니다. 시뮬레이터 비용 차감과 저장은 게임 연동 대기입니다.</p>{link('공통 부품 보드',art(build,'construction-parts'))}</section>
</main></body></html>''')

hp=ref/hud_view
hs=hp.read_text()
extra=f'''<section id="bad-energy-defense"><h2>HUD 부속 · 나쁜 기운 디펜스</h2><p>r{h['revision']} · {len(h['screens'])}개 HUD 전체 편집 보드 · 제안(검수 대기)</p><p>{' '.join(def_notes)}</p>
<p>{link('게이지 가득 동작 미리보기',preview(hud,'defense-full'))} · {link('HUD 부속 편집 캔버스',canvas(hud,'defense-full'))} · {link('HUD UI 기획서',plan+'#hud')}</p>
{shot_rows(deffig)}{dtable}<p>{unconfirmed}</p>
<p>전투 장면은 기존 시설과 몬스 자료를 사용한 2차 대표 컷입니다. 선택·보스·결과 흐름은 검수용 상태이며 시뮬레이터 전투 판정과 재화 저장은 연동 대기입니다.</p></section>
<section id="build-access"><h2>건설 진입</h2><p>하단 건설과 엔터파워 상세에서 <a href="{guide+viewer}">건설 도시 지도</a>를 엽니다. 디펜스 실패와 그냥 두기의 수리 버튼은 댄스 연습실이 파손된 지도에서 시작합니다.</p></section>'''
hs=re.sub(r'<section id="bad-energy-defense">.*?</section>\s*<section id="build-access">.*?</section>', '',hs,flags=re.S)
if '</main>' in hs:hs=hs.replace('</main>',extra+'</main>',1)
else:hs+=extra
write(hp,hs)

pp=folder/'papers/P265.html.txt'
p=pp.read_text()
if '<section class="tab" id="build">' not in p:
 p=p.replace('<a href="#profile">프로필·의상</a></nav>','<a href="#profile">프로필·의상</a><a href="#build">건설</a></nav>',1)
 p=p.replace('main:has(#profile:target) .tabs a[href="#profile"] {','main:has(#profile:target) .tabs a[href="#profile"], main:has(#build:target) .tabs a[href="#build"] {',1)
u=f'<tr><th scope="row">건설</th><td>r{b["revision"]} · {len(b["screens"])}개</td><td>지도 · 시설 상세 · 증설 · 파손 수리</td><td>{link("캔버스",canvas(build,"city"))} · {link("작업 명세",guide+viewer)}</td></tr>'
p=re.sub(r'<tr><th scope="row">건설</th><td>r\d+.*?</tr>',u,p,count=1,flags=re.S)
if '<th scope="row">건설</th>' not in p:
 end=p.index('</tbody>',p.index('id="current-reviews"'))
 p=p[:end]+u+p[end:]
p=p.replace('r15 · 11개</td><td>팀·솔로·판 진행 중 프로필 진입, 정보 메뉴와 출발 위치 복귀',f'r{h["revision"]} · {len(h["screens"])}개</td><td>팀·솔로 HUD, 건설 진입, 나쁜 기운 디펜스 부속',1)
a=p.index('<section class="tab" id="hud">');end=p.index('<section class="tab" id="photocard">')
part=re.sub(r'7018 HUD r\d+', f'7018 HUD r{h["revision"]}',p[a:end])
p=re.sub(r'(<th scope="row">HUD</th><td>)r\d+ · \d+개',lambda m:m[1]+f'r{h["revision"]} · {len(h["screens"])}개',p,count=1)
a=p.index('<section class="tab" id="hud">');end=p.index('<section class="tab" id="photocard">')
part=part.replace('7018 r15 프로필·의상 반영','7018 현행 프로필·의상과 건설·디펜스 반영').replace('7018 HUD r15',f'7018 HUD r{h["revision"]}')
part=part.replace('사다리 특가(고정) · 황금 바자','나쁜 기운 게이지(왼쪽 첫 칸) · 황금 바자').replace('좌우 이벤트 칸 10자리','좌우 이벤트 9칸 + 나쁜 기운 1칸').replace('13(기획) · 2차 10','2차 이벤트 9 · 게이지 1').replace('2차: 사다리 특가 · 황금 바자','2차: 황금 바자').replace('2차 검수용 10종','2차 검수용 이벤트 9종')
section=f'<div class="bad-energy-native"><h3>나쁜 기운 디펜스 · HUD 부속</h3><p>{" ".join(def_notes)}</p><p>{link("부속 작업 명세",guide+hud_view+"#bad-energy-defense")} · {link("게이지 가득 상태",preview(hud,"defense-full"))} · {link("건설", "#build")}</p>{shot_rows(deffig).replace("../kpop-planning/snapshot/assets/","산출_기획서_20261120_UI기획_그림/")}</div>'
for old,new in {
 '이벤트 칸 10개':'이벤트 9개 · 나쁜 기운 게이지 1개',
 '이벤트 창 10개':'이벤트 창 9개',
 '<tr><td>출연권 대전 · 나쁜 기운 디펜스</td><td>장면 바뀜</td><td>칸 도착 도전 · 디펜스</td></tr>':'<tr><td>출연권 대전</td><td>장면 바뀜</td><td>해당 칸 도착</td></tr><tr><td>나쁜 기운 디펜스</td><td>경고 모달 → 전체 화면</td><td>가득 찬 HUD 게이지 선택</td></tr>',
 '칸 도착 콘텐츠(도전 · 디펜스)는 장면이 바뀌고 끝나면 그 칸으로. 도중 ← 없음(포기만)':'칸 도착 도전은 끝나면 그 칸으로 복귀. 나쁜 기운 디펜스는 게이지가 가득 찬 뒤 눌러 진입하고 전투 중 포기만 가능',
 '<td>도전 · 디펜스</td><td>장면 바뀜</td><td>건물 고르기 → 10초 공격 → 보상 확인</td><td>끝나면 그 칸</td>':'<td>출연권 대전</td><td>장면 바뀜</td><td>건물 고르기 → 10초 공격 → 보상 확인</td><td>끝나면 그 칸</td></tr><tr><td>나쁜 기운 디펜스</td><td>경고 모달 → 전체 화면</td><td>경고 → 전투 → 결과</td><td>보드 또는 파손 시설 수리</td>',
 '왼쪽 5 · 오른쪽 5':'왼쪽 게이지 1 + 이벤트 4 · 오른쪽 이벤트 5',
 '황금 바자 · 세일 · 행운 상자 · 골라담기 · 오늘의 3종':'황금 바자 · 세일 상자 · 골라담기 · 오늘의 3종',
 '위쪽은 나쁜 기운 게이지':'별도 띠 표시',
 '자동 중 나쁜 기운 가득 · 출연권 대전 · 허브 도착이면 자동을 멈춤(제안 · 남은 결정 8).':'나쁜 기운이 가득 차면 자동 굴리기를 멈춥니다. 출연권 대전과 허브 도착의 자동 중지는 남은 결정 8을 확인합니다.',
 '자동 중 멈춤</td><td>나쁜 기운 가득 · 출연권 대전 · 허브 도착':'자동 중 멈춤</td><td>나쁜 기운 가득은 확정 · 출연권 대전과 허브 도착은 결정 대기',
 '나쁜 기운 가득(칸 상관없음)</td><td>디펜스':'나쁜 기운 가득 후 왼쪽 게이지 선택(칸 무관)</td><td>디펜스 경고 모달'
}.items():part=part.replace(old,new)
part=part.replace('src="assets/hud-r17-defense-', 'src="산출_기획서_20261120_UI기획_그림/hud-r17-defense-')
part=re.sub(r'(<div class="bad-energy-native">).*?(?=<details)', '',part,count=1,flags=re.S) if 'bad-energy-native' in part else part
if 'bad-energy-native' not in part:
 part=re.sub(r'<p>2026-11-24 · 건설 진입과 나쁜 기운 디펜스 부속 저장판 반영 · 현중 직접 요청.</p>', '',part)
 part=re.sub(r'<p>H-13 나쁜 기운 고리.*?</p>', '',part,count=1)
 part=re.sub(r'<p>전투 편성 위치, 몬스 0마리.*?</p>', '',part,count=1)
 cut=part.index('<details')
 part=part[:cut]+section+part[cut:]
 for marker,addition in [
  ('5. 규칙 · 예외',f'<p>{unconfirmed}</p>'),
  ('8. 변경 기록','<p>2026-11-24 · 건설 진입과 나쁜 기운 디펜스 부속 저장판 반영 · 현중 직접 요청.</p>'),
  ('9. 그림 발주','<p>H-13 나쁜 기운 고리 2상태 · H-14 악귀와 보스 상태용 아이콘 · H-15 스킬 카드 아이콘 3종. 모두 2차 검수용. 전장 대표 컷의 3D 사용 위치는 HUD 작업 명세를 따릅니다.</p>')
 ]:
  key='<summary>'+marker+'</summary>'
  if key in part:
   start=part.index('<div>',part.index(key))+5
   part=part[:start]+addition+part[start:]
p=p[:a]+part+p[end:]
folds=[
 ('1. 목적 · 범위','<p>9개 시설의 상태 확인과 증설·수리. 판 진행 중에도 건설 메뉴를 열 수 있습니다.</p>'),
 ('2. 화면 목록 · 흐름','<p>'+flow+'</p>'),
 ('3. 화면 깊이 · 뒤로','<p>지도·목록·조립·결과는 전체 화면. 시설 상세는 바텀시트, 건설 확인은 모달. 창 외곽 374 × 748. 시트를 닫으면 직전 지도·목록으로 복귀합니다.</p>'),
 ('4. 화면별 상세',btable),
 ('5. 규칙 · 예외','<p>P81 건설·증설, P106 건물 성장, P104 나쁜 기운 디펜스. 시설은 0~30단계, 본관과 부속 A·B가 성장합니다. 파손 원인은 출연권 대전과 나쁜 기운 디펜스 두 가지입니다.</p>'),
 ('6. 리소스 · 데이터','<p>facility_growth_blender_v01 기존 GLB에서 추출한 쿼터뷰. 건물·단계·비용 연결 기준은 building_master_level.csv와 construction-ui.json입니다.</p>'),
 ('7. 남은 결정','<p>최대 증설 확인 기준, 아카데미 모델 연결, 수리 우선 여부, 디펜스 수리비, 시뮬레이터 비용·저장 연동. 하단 바로 관리 카드 3장의 자동 노출 기준은 제안 상태입니다.</p>'),
 ('8. 변경 기록',f'<p>2026-11-24 · 현중 직접 요청에 따라 7018 r{b["revision"]} 세부 와이어프레임 반영. 모노폴리 GO 건설 구조를 9시설에 맞게 적용했습니다.</p>'),
 ('9. 그림 발주','<p>G-01 시설 그림 9종 · 기존 모델 렌더 8종/아카데미 임시. G-02 파손·완공·증설 상태는 각 카드 상태층으로 분리합니다. 버튼과 창은 H-10 9슬라이스를 재사용합니다.</p>')
]
buildContent=f'<section class="tab" id="build"><h2 class="tt">건설 UI 기획서</h2><p class="meta">7018 r{b["revision"]} · 2차 세부 와이어프레임 · 제안(검수 대기) · {link("작업 명세",guide+viewer)} · {link("동작 미리보기",preview(build,"city"))}</p><p>{" ".join(build_notes[:2])}</p>'+shot_rows(buildfig).replace('../kpop-planning/snapshot/assets/','산출_기획서_20261120_UI기획_그림/')+''.join('<details><summary>'+t+'</summary><div>'+s+'</div></details>' for t,s in folds)+'</section>'
assert '</main>' in p
if '<section class="tab" id="build">' in p:
 start=p.index('<section class="tab" id="build">')
 end=p.index('</main>',start)
 p=p[:start]+buildContent+'\n'+p[end:]
else:p=p.replace('</main>',buildContent+'\n</main>',1)
write(pp,p)
catalog=folder/'catalog.json'
cat=json.loads(catalog.read_text())
doc=next(d for d in cat['documents'] if d['id']=='P265')
if not doc['title'].endswith('건설)'):doc['title']=doc['title'].removesuffix(')')+' · 건설)'
doc['summary']='2차 세부 와이어프레임과 화면 기획. 건설과 HUD 부속 나쁜 기운 디펜스 포함.'
if '나쁜 기운 디펜스' not in doc['aliases']:doc['aliases']+=',건설,나쁜 기운 디펜스'
rootkey=doc['path'].rsplit('/',1)[0]+'/산출_기획서_20261120_UI기획_그림/'
for _,_,img,_ in buildfig+deffig:cat['assets'][rootkey+img+'.png']='assets/'+img+'.png'
write(catalog,pack(cat))
