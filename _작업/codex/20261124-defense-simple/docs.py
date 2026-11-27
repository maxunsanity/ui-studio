from pathlib import Path
from html import escape
from urllib.parse import urlencode
import re,json,shutil
r=Path('/Users/max/projest_max/ui-studio');stage=Path(__file__).parent
backup=r/'docs/planning/_backup/20261124_단이/디펜스5분과5칸'
ref=r/'src/tools/uxStudio/guide/reference';snap=ref/'kpop-planning/snapshot'
ws='workspace-cfa517bd-d9e1-40c4-aa1f-576e182500ba'
def read(k):return json.loads((stage/(k+'-saved.json')).read_text())
d=read('defense-simple');h=read('hud-countdown');b=read('build-damage')
def write(p,v):
 bak=backup/p.relative_to(r)
 if p.exists() and not bak.exists():
  bak.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,bak)
 p.write_text(v)
def u(page,doc,screen,**extra):
 return '/ui-studio/'+page+'?'+escape(urlencode(dict(workspace=ws,project=doc['projectId'],screen=screen,**extra)))
def link(label,url):return f'<a href="{url}">{label}</a>'
def pic(rows,prefix):
 return '<div class="shots">'+''.join(f'<figure><img src="{prefix+filename}.png" width="220" alt="{label}" loading="lazy"><figcaption>{label}</figcaption></figure>' for filename,label in rows)+'</div>'
spec='/ui-studio/source/guide/reference/kpop-defense/index.html'
plan='/ui-studio/source/guide/reference/kpop-planning/index.html?doc=P265'
setup=u('preview.html',d,'defense-warning')
hud=u('preview.html',h,'defense-full')
board=u('canvas.html',d,'defense-warning',view='detailed-wireframe',layout='grid')
shots=[
 ('defense-r3-setup','습격 건물·5마리 편성 한 화면'),
 ('defense-r3-battle','시설 한 채의 전투 HUD'),
 ('defense-r3-success','지켜 낸 연습실과 몬스'),
 ('defense-r3-failed','파손된 연습실과 수리'),
 ('defense-r3-parts','일반 스킬·팀 피니시 15종')]
flow='나쁜 기운이 가득 차면 05:00 카운트 시작 → 게이지를 누르면 건설에 사용한 시설 이미지를 보여 주고, 같은 화면에 출격 슬롯 최대 5마리를 한 줄로 표시 → 방어하기 → 대표 전투 HUD → 결과.'
parts='일반 스킬 10종과 팀 피니시 5종을 서로 다른 이미지로 제작했습니다. 같은 부품 보드에서 각 이름과 핵심 역할을 확인합니다. 전투 HUD는 습격 시설의 내구도 한 줄, 웨이브와 적 수, 스킬 선택, 피니시, 멈춤을 표시합니다.'
outcomes='성공은 연습실을 지킨 몬스와 시설을 강조합니다. 실패는 한 단계 전 외형의 파손 표시와 방어에 참가한 몬스를 보여 줍니다. 기존 시설 단계는 유지하고 수리하면 파손 표시를 지웁니다. 수리는 건설의 같은 시설로 연결하며 수리비는 마지막 건설비의 50%입니다.'
pending='5분은 HUD 만충 대기 카운트입니다. 7018 미리보기에서 초 단위로 줄고 시설 확인 화면에도 이어집니다. 00:00 이후 자동 처리, 실시간 전투·건물 단계별 외형·편성 적용·보상 저장은 연결 또는 결정 대기입니다. 24단계/23단계 외형 표기와 연출은 검수 예시입니다.'
rows=[
 ('defense-warning','건물·출격 편성','한 화면 · 최대 5마리'),
 ('defense-battle','전투 HUD','대표 화면 · 시설 내구도 하나'),
 ('defense-success','성공','지킨 몬스·건물 · 보드 복귀'),
 ('defense-failed','실패','파손 건물·몬스 · 수리'),
 ('defense-ignore','그냥 두기','파손 결과 변형 · 수리'),
 ('defense-parts','관련 부품','아이콘 15종과 역할')]
table='<table><thead><tr><th>보드</th><th>역할</th></tr></thead><tbody>'+''.join(f'<tr><th>{link(title,u("source/sample-preview.html",d,id,view="detailed-wireframe"))}</th><td>{kind}</td></tr>' for id,title,kind in rows)+'</tbody></table>'
style='''body{margin:0;background:#f1f3f5;color:#25313a;font:15px/1.6 system-ui,sans-serif}main{padding:24px 16px 58px;max-width:1040px;margin:auto}section{background:#fff;border:1px solid #ddd;border-radius:8px;padding:14px;margin:14px 0}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:7px;text-align:left}.shots{display:flex;flex-wrap:wrap;gap:12px}.shots figure{margin:0;width:min(100%,220px)}img{max-width:100%;height:auto}'''
write(ref/'kpop-defense/index.html',f'''<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>디펜스 · 2차 작업 명세</title><style>{style}</style><body><main><h1>디펜스 · 2차 작업 명세</h1><p>r{d["revision"]} · {len(rows)}보드 · 제안(검수 대기)</p><p>{link("HUD 카운트 미리보기",hud)} · {link("습격 건물·편성 미리보기",setup)} · {link("편집 캔버스",board)} · {link("7018 기획서",plan+"#defense")}</p>
<section id="overview"><h2>5분 카운트와 출격 편성</h2><p>{flow}</p>{pic(shots[:1],'../kpop-planning/snapshot/assets/')}</section>
<section id="battle"><h2>전투 HUD</h2><p>{parts}</p>{pic(shots[1:2],'../kpop-planning/snapshot/assets/')}</section>
<section id="result"><h2>몬스와 시설 결과 연출</h2><p>{outcomes}</p>{pic(shots[2:4],'../kpop-planning/snapshot/assets/')}</section>
<section id="parts"><h2>공통 부품과 아이콘</h2>{pic(shots[4:],'../kpop-planning/snapshot/assets/')}{table}<p>{pending}</p></section></main></body></html>''')
hud_file=ref/'kpop-lobby/review-2/index.html';s=hud_file.read_text()
v=f'<section id="bad-energy-defense"><h2>나쁜 기운 게이지 · 5분 카운트</h2><p>{flow}</p><p>{link("HUD 카운트 미리보기",hud)} · {link("디펜스 작업 명세",spec)}</p>{pic([("hud-r21-countdown","나쁜 기운 가득 · 5분 카운트")],"../../kpop-planning/snapshot/assets/")}</section>'
s=re.sub(r'<section id="bad-energy-defense">.*?</section>',lambda _:v,s,count=1,flags=re.S)
write(hud_file,s)
build=ref/'kpop-build/index.html';s=build.read_text()
s=re.sub(r'(<h1>건설 · 2차 작업 명세</h1><p>)r\d+',lambda m:m[1]+f'r{b["revision"]}',s,count=1)
if 'id="defense-facade"' not in s:s=s.replace('</main>','<section id="defense-facade"><h2>디펜스 파손 외형</h2><p>'+outcomes+'</p><p>'+link('디펜스 결과 명세',spec+'#result')+'</p></section></main>',1)
write(build,s)
p=snap/'papers/P265.html.txt';s=p.read_text()
for title,doc in [('HUD',h),('디펜스',d),('건설',b)]:
 s=re.sub(r'(<th scope="row">'+title+r'</th><td>)r\d+ · \d+개',lambda m:m[1]+f'r{doc["revision"]} · {len(doc["screens"])}개',s,count=1)
s=re.sub(r'7018 HUD r\d+',f'7018 HUD r{h["revision"]}',s,count=1)
s=s.replace('project=kpop-defense-ui&amp;screen=defense-full','project=kpop-defense-ui&amp;screen=defense-warning')
s=s.replace('project=kpop-defense-ui&amp;screen=defense-full&amp;', 'project=kpop-defense-ui&amp;screen=defense-warning&amp;')
s=s.replace('7018 r6 · <a href="/ui-studio/source/guide/reference/kpop-build/index.html"',f'7018 r{b["revision"]} · <a href="/ui-studio/source/guide/reference/kpop-build/index.html"',1)
s=re.sub(r'<div class="bad-energy-native">.*?</div>',lambda _:f'<div class="bad-energy-native"><h3>만충 시 5분 카운트</h3><p>{flow}</p><p>{link("디펜스 탭","#defense")} · {link("HUD 미리보기",hud)}</p></div>',s,count=1,flags=re.S)
start=s.index('<section class="tab" id="defense">');end=s.index('</main>',start)
def f(label,body):return f'<details><summary>{label}</summary><div>{body}</div></details>'
imgdir='산출_기획서_20261120_UI기획_그림/'
sections=[
 ('1. 목적 · 범위','<p>건설과 같은 시설 한 채를 나쁜 기운 디펜스에서 지킵니다.</p>'),
 ('2. 화면 목록 · 흐름','<p>'+flow+'</p>'),
 ('3. 화면 깊이 · 뒤로','<p>시설 확인과 편성은 같은 전체 화면입니다. 닫으면 HUD 카운트로 돌아갑니다.</p>'),
 ('4. 화면별 상세',table),
 ('5. 규칙 · 예외','<p>'+outcomes+'</p>'),
 ('6. 리소스 · 데이터','<p>건설의 댄스 연습실 이미지 1장, 몬스 초상, 15종의 스킬과 피니시 아이콘, 결과 상태 레이어를 사용합니다.</p>'),
 ('7. 남은 결정','<p>'+pending+'</p>'),
 ('8. 변경 기록','<p>2026-11-24 · 5분 카운트, 일렬 5칸, 한 시설, 성공과 파손 연출의 최신 지시 반영.</p>'),
 ('9. 그림 발주','<p>'+parts+'</p>')]
tab=f'<section class="tab" id="defense"><h2 class="tt">디펜스 UI 기획서</h2><p class="meta">나쁜 기운 · 7018 r{d["revision"]} · {link("작업 명세",spec)} · {link("미리보기",setup)}</p><p>{flow}</p>{pic(shots[:1],imgdir)}'+''.join(f(label,body) for label,body in sections)+'</section>\n'
write(p,s[:start]+tab+s[end:])
catalog=snap/'catalog.json';j=json.loads(catalog.read_text())
item=next(x for x in j['documents'] if x['id']=='P265')
key=item['path'].rsplit('/',1)[0]+'/'+imgdir
for name,_ in shots+[('hud-r21-countdown','HUD')]:j['assets'][key+name+'.png']='assets/'+name+'.png'
write(catalog,json.dumps(j,ensure_ascii=False,indent=2)+'\n')
