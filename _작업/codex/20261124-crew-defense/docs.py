from pathlib import Path
from html import escape
from urllib.parse import urlencode,quote
import re,json,shutil
r=Path('/Users/max/projest_max/ui-studio'); stage=Path(__file__).parent
backup=r/'docs/planning/_backup/20261124_단이/크루미션과디펜스분리'
ref=r/'src/tools/uxStudio/guide/reference'
snap=ref/'kpop-planning/snapshot'
ws='workspace-cfa517bd-d9e1-40c4-aa1f-576e182500ba'
def load(name):return json.loads((stage/(name+'-saved.json')).read_text())
h=load('hud-defense-split');d=load('defense');c=load('crew-mission')
hud=h['projectId'];defense=d['projectId'];crew=c['projectId']
base='/ui-studio/source/guide/reference/'
library=base+'kpop-planning/index.html?doc=P265'
defense_spec=base+'kpop-defense/index.html'
crew_spec=base+'kpop-crew/index.html'
source_path='/docs/planning/삼중AI_공용_20260929/산출/기획서/'
source_defense='http://127.0.0.1:7007'+quote(source_path+'산출_기획서_20261124_나쁜기운디펜스_와이어프레임.html')
source_crew='http://127.0.0.1:7007'+quote(source_path+'산출_기획서_20261124_크루미션_와이어프레임.html')
def write(p,text):
 saved=backup/p.relative_to(r)
 if p.exists() and not saved.exists():
  saved.parent.mkdir(parents=True,exist_ok=True)
  shutil.copy2(p,saved)
 p.parent.mkdir(parents=True,exist_ok=True)
 p.write_text(text)
def url(page,p,screen,**extra):
 return '/ui-studio/'+page+'?'+escape(urlencode(dict(workspace=ws,project=p,screen=screen,**extra)))
def art(p,s):return url('source/sample-preview.html',p,s,view='detailed-wireframe')
def preview(p,s):return url('preview.html',p,s)
def canvas(p,s):return url('canvas.html',p,s,view='detailed-wireframe',layout='grid')
def link(title,href):return f'<a href="{href}">{title}</a>'
def figs(rows,prefix):
 return '<div class="shots">'+''.join(f'<figure><img src="{prefix+file}.png" width="225" loading="lazy" alt="{title}"><figcaption>{title}</figcaption></figure>' for title,file in rows)+'</div>'
def table(ds,screens):
 s='<table><thead><tr><th>화면</th><th>유형</th><th>제작 기준</th></tr></thead><tbody>'
 kinds={'page':'전체 화면','modal':'가운데 모달','sheet':'하단 바텀시트','popover':'팝오버'}
 for board in sorted(screens,key=lambda a:(a.get('canvasPosition',{}).get('y',0),a.get('canvasPosition',{}).get('x',0))):
  id=board['id'];title=board['name'];kind=kinds.get(board.get('kind','page'),'전체 화면')
  if 'parts' in id:kind='부품 보드'
  purpose=board.get('purpose') or title
  s+=f'<tr><th>{link(escape(title),art(ds["projectId"],id))}<br><small>{id}</small></th><td>{kind}</td><td>{escape(purpose)}</td></tr>'
 return s+'</tbody></table>'
d_fig=[('습격 경고','defense-r2-warning'),('출격 편성','defense-r2-formation'),('보스와 전투 HUD','defense-r2-boss'),('실패와 수리','defense-r2-failed')]
c_fig=[('크루 미션 진행과 보상','crew-r9-mission'),('크루 미션 다 받음','crew-r9-mission-complete')]
dtable=table(d,d['screens'])
cs=[s for s in c['screens'] if s['id'].startswith('crew-mission')]
ctable=table(c,cs)
d_flow='HUD의 가득 찬 게이지 → 디펜스 습격 경고 → 출격 편성 확인 → 전투 → 결과 → 보드. 실패·그냥 두기의 수리는 건설의 해당 연습실로 연결합니다. 가득 찬 채 굴리면 그냥 두기 결과를 표시합니다.'
d_warning='대상은 파손되지 않은 연습실 중 단계가 가장 높은 곳이고 동률이면 무작위입니다. 경고에 대상·연습 중 아이돌·손실과 수리비·출격 몬스를 표시합니다. 방패는 출연권 대전에서 사용합니다.'
d_form='출격은 최대 10마리입니다. 그 습격에만 편성 수정을 반영하고 다음에는 단 × 기분 능력으로 다시 자동 편성합니다. 기분 70 이상 120%, 35~69는 100%, 35 미만은 70%이며 디펜스에서 기분을 차감하지 않습니다. 출격 몬스가 0마리면 건물 보석만으로 방어하는 상태입니다.'
d_battle='세로 전장에서 이동·공격·카메라는 자동입니다. 스킬 카드 선택, 팀 피니시, 멈춤을 제공하고 보스는 체력 3구간과 공격 예고를 표시합니다. 가득 찬 상태의 선택 대기에는 제한이 없습니다. 일반 적은 4분에 출현을 멈추고 교전 상한은 5분입니다.'
d_result='성공 시 처치 보상과 지킴 덤, 실패는 처치 보상만 표시합니다. 실패나 전투 건너뛰기로 연습실이 파손되면 수리비는 마지막 건설비의 50%입니다. 그냥 두기에는 게이지 초기화를 표시합니다.'
d_pending='2차 화면의 전투·편성·보상은 검수 상태 예시입니다. 기분 배율은 최신 기획을 표시하며 실게임 발란스·피해 계산·지급·저장은 연결 대기입니다.'
c_flow='크루원과 크루장 메인의 미션 메뉴를 눌러 엽니다. 크루가 없으면 해당 메뉴가 표시되지 않습니다. 위는 공동 목표 게이지와 단계 상자, 아래는 내 크루 미션의 진행·받기·완료입니다. 크루 회차마다 초기화하며 1~8주는 주간, 9주는 월드입니다.'
c_rules='단계에 도달한 공동 목표와 개인 달성 보상은 각 상태의 받기에서 확인합니다. 기존 재화와 보상 아이콘을 씁니다. 받을 메뉴 배지는 예시이며 합산 활동, 참가·중도 가입 자격, 보상군·수량과 미수령 처리는 결정 대기입니다.'
style='''body{margin:0;background:#f4f4f4;color:#252525;font:15px/1.6 system-ui,sans-serif}main{padding:22px 16px 56px;margin:auto;max-width:1060px}section{background:#fff;border:1px solid #ddd;border-radius:10px;padding:14px;margin:16px 0}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ddd;padding:7px;text-align:left;overflow-wrap:anywhere}.shots{display:flex;flex-wrap:wrap;gap:12px}.shots figure{margin:0;width:min(100%,225px)}img{max-width:100%;height:auto}small{color:#555}'''
d_links=' · '.join([link('편집 캔버스',canvas(defense,d['entryScreen'])),link('동작 미리보기',preview(defense,d['entryScreen'])),link('7018 UI 기획서',library+'#defense'),link('7007 클로드 1차',source_defense)])
write(ref/'kpop-defense/index.html',f'''<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>디펜스 · 2차 작업 명세</title><style>{style}</style><body><main><h1>디펜스 · 2차 작업 명세</h1><p>나쁜 기운 디펜스 r{d["revision"]} · {len(d["screens"])}개 편집 보드 · 제안(검수 대기)</p><p>{d_links}</p>
<section id="overview"><h2>진입과 습격 경고</h2><p>{d_flow}</p><p>{d_warning}</p>{figs(d_fig,'../kpop-planning/snapshot/assets/')}</section>
<section id="formation"><h2>출격 편성</h2><p>{d_form}</p></section>
<section id="battle"><h2>전투·스킬·보스</h2><p>{d_battle}</p></section>
<section id="result"><h2>보상·파손·수리</h2><p>{d_result}</p><p>{d_pending}</p></section>
<section id="parts"><h2>화면 및 공통 부품</h2>{dtable}</section></main></body></html>''')
c_intro=f'<section id="crew-mission"><h2>크루 미션 · 공동 목표와 내 미션</h2><p>7018 r{c["revision"]} · {link("크루 미리보기",preview(crew,"member"))} · {link("7007 클로드 1차",source_crew)}</p><p>{c_flow}</p><p>{c_rules}</p>{{figures}}{ctable}</section>'
cp=ref/'kpop-crew/index.html';s=cp.read_text()
s=re.sub(r'<section id="crew-mission">.*?</section>','',s,count=1,flags=re.S)
s=s.replace('</main>',c_intro.replace('{figures}',figs(c_fig,'../kpop-planning/snapshot/assets/'))+'</main>',1)
s=re.sub(r'<p>r\d+ · \d+개 화면·상태 · 제안',f'<p>r{c["revision"]} · {len(c["screens"])}개 화면·상태 · 제안',s,count=1)
write(cp,s)
hp=ref/'kpop-lobby/review-2/index.html';s=hp.read_text()
hud_section=f'<section id="bad-energy-defense"><h2>나쁜 기운 게이지 · 디펜스 진입</h2><p>HUD r{h["revision"]} · 평상시 게이지 설명 및 가득 찬 상태. 게이지를 누르면 별도 디펜스의 경고가 열립니다. 가득 찬 채 굴리면 그냥 두기 결과가 열립니다.</p><p>{link("디펜스 작업 명세",defense_spec)} · {link("게이지 가득 미리보기",preview(hud,"defense-full"))}</p></section>'
s=re.sub(r'<section id="bad-energy-defense">.*?</section>',lambda _:hud_section,s,count=1,flags=re.S)
write(hp,s)
P=snap/'papers/P265.html.txt';s=P.read_text()
if '<a href="#defense">디펜스</a>' not in s:
 s=s.replace('<a href="#build">건설</a></nav>','<a href="#build">건설</a><a href="#defense">디펜스</a></nav>',1)
 s=s.replace('main:has(#build:target) .tabs a[href="#build"] {','main:has(#build:target) .tabs a[href="#build"], main:has(#defense:target) .tabs a[href="#defense"] {',1)
for kind,ds in [('HUD',h),('크루',c)]:
 s=re.sub(r'(<th scope="row">'+kind+r'</th><td>)r\d+ · \d+개',lambda m:m[1]+f'r{ds["revision"]} · {len(ds["screens"])}개',s,count=1)
if '<th scope="row">디펜스</th>' not in s:
 end=s.index('</tbody>',s.index('id="current-reviews"'))
 row=f'<tr><th scope="row">디펜스</th><td>r{d["revision"]} · {len(d["screens"])}개</td><td>습격 경고 · 출격 편성 · 전투 · 실패 수리</td><td>{link("캔버스",canvas(defense,d["entryScreen"]))} · {link("작업 명세",defense_spec)}</td></tr>'
 s=s[:end]+row+s[end:]
a=s.index('<section class="tab" id="hud">');end=s.index('<section class="tab" id="photocard">')
hud_segment=s[a:end]
hud_segment=re.sub(r'7018 HUD r\d+',f'7018 HUD r{h["revision"]}',hud_segment,count=1)
hud_div=f'<div class="bad-energy-native"><h3>나쁜 기운 게이지 · 디펜스 진입</h3><p>HUD는 평상시 설명과 가득 찬 게이지 상태를 표시합니다. 경고 이후는 별도 디펜스에서 진행합니다.</p><p>{link("디펜스 탭","#defense")} · {link("별도 작업 명세",defense_spec)}</p></div>'
hud_segment=re.sub(r'<div class="bad-energy-native">.*?(?=<div class="village-manage">|<details)',lambda _:hud_div,hud_segment,count=1,flags=re.S)
hud_segment=hud_segment.replace('전투 편성 위치, 몬스 0마리일 때 행동, 난이도, 전투 방향은 기획 결정 대기입니다. 240초는 일반 적 출현 마감이고 전체 상한은 5분입니다. 디펜스 수리비 문구는 P104와 CSV가 충돌해 확인 중으로 표시했습니다.','편성·전투·결과는 디펜스 탭을 따릅니다. 수리비는 마지막 건설비의 50%입니다.')
hud_segment=hud_segment.replace('H-13 나쁜 기운 고리 2상태 · H-14 악귀와 보스 상태용 아이콘 · H-15 스킬 카드 아이콘 3종. 모두 2차 검수용. 전장 대표 컷의 3D 사용 위치는 HUD 작업 명세를 따릅니다.','H-13 나쁜 기운 고리 2상태. 전투·편성·보상 그림 발주는 디펜스 탭 9번을 따릅니다.')
if '디펜스 전투 독립 프로젝트 분리' not in hud_segment:
 hud_segment=hud_segment.replace('건설 진입과 나쁜 기운 디펜스 부속 저장판 반영 · 현중 직접 요청.</p>','건설 진입과 나쁜 기운 디펜스 부속 저장판 반영 · 현중 직접 요청.</p><p>2026-11-24 · 현중 직접 요청 · 디펜스 전투 독립 프로젝트 분리. HUD 게이지에서 진입.</p>')
s=s[:a]+hud_segment+s[end:]
a=s.index('<section class="tab" id="crew">');end=s.index('<section class="tab" id="profile">')
crew_seg=s[a:end]
crew_seg=crew_seg.replace('크루 재화 · 레벨 · 미션 없음','크루 공동 목표와 내 미션을 미션 메뉴에서 확인').replace('크루 재화 · 크루 레벨 · 크루 미션 · 크루 홍보','크루 재화 · 크루 레벨 · 크루 홍보').replace('크루 재화 · 미션 · 레벨 · 홍보 화면 없음','크루 미션을 메인 메뉴에서 열며 크루 재화·레벨·홍보 화면 생략')
crew_seg=re.sub(r'7018 r\d+ 프로필·의상 반영',f'7018 r{c["revision"]} 크루 미션 반영',crew_seg,count=1)
crew_seg=re.sub(r'7018 2차 저장판 r\d+</strong>　\d+개',f'7018 2차 저장판 r{c["revision"]}</strong>　{len(c["screens"])}개',crew_seg,count=1)
crew_seg=re.sub(r'<section id="crew-mission">.*?</section>','',crew_seg,count=1,flags=re.S)
imgdir='산출_기획서_20261120_UI기획_그림/'
at=crew_seg.index('<details')
crew_seg=crew_seg[:at]+c_intro.replace('{figures}',figs(c_fig,imgdir))+crew_seg[at:]
s=s[:a]+crew_seg+s[end:]
def fold(t,v):return f'<details><summary>{t}</summary><div>{v}</div></details>'
dsections=[
 ('1. 목적 · 범위','<p>'+d_warning+'</p>'),
 ('2. 화면 목록 · 흐름','<p>'+d_flow+'</p>'),
 ('3. 화면 깊이 · 뒤로','<p>HUD 설명 다음 습격 경고는 공통 모달. 편성과 전투는 전체 화면이고 선택·멈춤과 결과는 화면별 작업 명세에서 창 유형을 확인합니다.</p>'),
 ('4. 화면별 상세',dtable),
 ('5. 규칙 · 예외','<p>'+d_form+'</p><p>'+d_battle+'</p><p>'+d_result+'</p>'),
 ('6. 리소스 · 데이터','<p>7007 P104, 11/24 디펜스 1차 와이어프레임, bad_energy_rule 및 economy_rule. 기존 몬스·시설·전장 시안 재사용.</p>'),
 ('7. 남은 결정','<p>'+d_pending+'</p>'),
 ('8. 변경 기록','<p>2026-11-24 · 현중 직접 요청으로 7018 디펜스 별도 프로젝트 및 기획 탭 추가. 크루 미션 별도 반영.</p>'),
 ('9. 그림 발주','<p>편성 슬롯·기분막대·능력 배율, 스킬 카드·보스, 처치 보상. 편집 부품과 2차 대표 컷입니다.</p>')
]
dt=f'<section class="tab" id="defense"><h2 class="tt">디펜스 UI 기획서</h2><p class="meta">나쁜 기운 · 7018 r{d["revision"]} · {link("작업 명세",defense_spec)} · {link("미리보기",preview(defense,d["entryScreen"]))}</p><p>{d_flow}</p>'+figs(d_fig,imgdir)+''.join(fold(t,v) for t,v in dsections)+'</section>'
if '<section class="tab" id="defense">' in s:
 a=s.index('<section class="tab" id="defense">')
 b=s.index('</main>',a)
 s=s[:a]+dt+'\n'+s[b:]
else:s=s.replace('</main>',dt+'\n</main>',1)
s=re.sub(r'(<th scope="row">디펜스</th><td>)r\d+ · \d+개',lambda m:m[1]+f'r{d["revision"]} · {len(d["screens"])}개',s,count=1)
write(P,s)

catalog=snap/'catalog.json';obj=json.loads(catalog.read_text())
item=next(x for x in obj['documents'] if x['id']=='P265')
if '디펜스)' not in item['title']:item['title']=item['title'].removesuffix(')')+' · 디펜스)'
item['summary']='2차 세부 와이어프레임과 화면 기획. 크루 미션과 별도 디펜스 포함.'
if '크루 미션' not in item['aliases']:item['aliases']+=',크루 미션,디펜스'
key=item['path'].rsplit('/',1)[0]+'/'+imgdir
for _,name in c_fig+d_fig:obj['assets'][key+name+'.png']='assets/'+name+'.png'
write(catalog,json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
