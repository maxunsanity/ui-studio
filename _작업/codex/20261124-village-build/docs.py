from pathlib import Path
from urllib.parse import urlencode
from html import escape
import json,re,shutil
root=Path('/Users/max/projest_max/ui-studio')
stage=Path(__file__).parent
backup=root/'docs/planning/_backup/20261124_단이/마을건설현황'
ref=root/'src/tools/uxStudio/guide/reference'
library=ref/'kpop-planning/snapshot'
w='workspace-cfa517bd-d9e1-40c4-aa1f-576e182500ba'
b=json.loads((stage/'build-village-saved.json').read_text());h=json.loads((stage/'hud-village-saved.json').read_text())
build=b['projectId'];hud=h['projectId']
guide='/ui-studio/source/guide/reference/'
plan=guide+'kpop-planning/index.html?doc=P265'
spec=guide+'kpop-build/index.html'
def write(p,value):
 saved=backup/p.relative_to(root)
 if p.exists() and not saved.exists():
  saved.parent.mkdir(parents=True,exist_ok=True)
  shutil.copy2(p,saved)
 p.write_text(value)
def url(page,p,screen,**extra):
 return '/ui-studio/'+page+'?'+escape(urlencode(dict(workspace=w,project=p,screen=screen,**extra)))
def art(p,s):return url('source/sample-preview.html',p,s,view='detailed-wireframe')
def preview(p,s):return url('preview.html',p,s)
def canvas(p,s):return url('canvas.html',p,s,view='detailed-wireframe',layout='grid')
def link(title,href):return f'<a href="{href}">{title}</a>'
captures=[
 ('건설 현황','build-r6-overview','city'),('같은 마을의 건물 확대','build-r6-zoom','facility-detail'),
 ('파손과 수리','build-r6-repair','facility-repair-battle')
]
def figs(prefix):
 return '<div class="shots">'+''.join(
  f'<figure><a href="{art(build,board)}"><img src="{prefix+asset}.png" width="225" loading="lazy" alt="{title}"></a><figcaption>{title}</figcaption></figure>'
  for title,asset,board in captures)+'</div>'
qtable='<table><thead><tr><th>화면</th><th>유형</th><th>상태와 동작</th></tr></thead><tbody>'
for s in sorted(b['screens'],key=lambda s:(s['canvasPosition']['y'],s['canvasPosition']['x'])):
 id=s['id'];steps=[t['label'] for t in b['transitions'] if t['fromScreen']==id and t['action'] in ('navigate','back','open') and t['label']]
 hint=' · '.join(dict.fromkeys(steps[:5]))
 if id.startswith('city'):hint='9시설 모두 한 화면에 표시. 카드에서 같은 마을의 해당 건물로 이동.'
 if id=='facility-confirm':hint='보유금으로 가능한 목표 단계·총비용·예상 잔액 확인. 연결 전 견적은 —.'
 if id=='facility-repair-defense':hint='나쁜 기운 파손은 도착 보상 감소와 연습 중단 표시. 수리비 마지막 건설비의 50%.'
 qtable+=f'<tr><th>{link(escape(s["name"]),art(build,id))}<br><small>{id}</small></th><td>{"부품 보드" if id=="construction-parts" else "전체 화면 · 390×844"}</td><td>{escape(hint or "시설 상태와 부품 배치 확인")}</td></tr>'
qtable+='</tbody></table>'
flow='로비 지도에서 건물 또는 지붕 배지 선택 → 해당 시설 확대. 건설 현황에서 9개 카드 중 선택 → 같은 시설 확대. 모두 같은 마을의 구도를 유지합니다. 최초 진입점에서 닫는 동작은 해당 진입점으로 복귀합니다.'
overview='건설 현황은 390×844에서 스크롤 없이 아홉 시설을 표시합니다. 3×3 카드 외곽 121×188, 흑백 건물 사진 117×144, 상태 배지와 이름·전체 단계는 편집 요소입니다. 시설 성장은 0~30단계 하나로 표시합니다.'
states='0단계는 짓기, 일반 시설은 +1 또는 최대, 돈 부족은 부족분 안내, 파손은 수리, 30단계는 완공입니다. 최대 견적은 목표 단계·단계 수·총비용·예상 잔액을 표시합니다. 수리비 기준은 대전과 디펜스 모두 마지막 건설비의 50%입니다.'
components='지도 원화·시설 확대 구도·카드 사진은 같은 검수 원화 기반입니다. 로비 건물 터치 면과 지붕 배지는 각기 독립 레이어입니다. 증설 가능 표시의 게임 조건은 보유금이 +1 견적 이상이고 아직 완공·파손 상태가 아닐 때입니다. 초기 시설은 짓기 가능 상태로 다룹니다.'
validation='증설 성공 후 25/30, 첫 건설 후 1/30, 수리 시 기존 단계 유지 및 파손 표시 해제를 검수 상태로 연결합니다. 연출은 같은 마을의 카메라 컷으로 표시하며 실제 카메라 이동·차감·시설 상태 갱신·저장 연동은 개발 범위입니다.'
style='''body{margin:0;background:#f4f4f4;color:#252525;font:15px/1.6 system-ui,sans-serif}main{padding:22px 14px 55px;margin:auto;max-width:1050px}section{background:#fff;border:1px solid #ddd;border-radius:10px;padding:13px;margin:15px 0}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ddd;padding:7px;text-align:left;overflow-wrap:anywhere}.shots{display:flex;flex-wrap:wrap;gap:12px}.shots figure{margin:0;width:min(100%,225px)}img{max-width:100%;height:auto}small{color:#555}'''
links=' · '.join([link('편집 캔버스',canvas(build,'city')),link('건설 미리보기',preview(build,'city')),link('로비에서 건물 선택',preview(hud,'main')),link('UI 기획서',plan+'#build')])
write(ref/'kpop-build/index.html',f'''<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>건설 · 2차 작업 명세</title><style>{style}</style><body><main><h1>건설 · 2차 작업 명세</h1><p>r{b["revision"]} · {len(b["screens"])}개 편집 보드 · 제안(검수 대기)</p><p>{links}</p>
<section id="overview"><h2>9시설 한 화면</h2><p>{overview}</p>{figs('../kpop-planning/snapshot/assets/')}</section>
<section id="windows"><h2>공통 시설 확대와 상태</h2><p>{flow}</p><p>{states}</p>{qtable}</section>
<section id="flow"><h2>증설·수리·복귀</h2><p>{validation}</p></section>
<section id="parts"><h2>공통 부품</h2><p>{components}</p><p>{link('부품 보드',art(build,'construction-parts'))}</p></section></main></body></html>''')
hd=ref/'kpop-lobby/review-2/index.html'
hs=hd.read_text()
s=f'<section id="build-access"><h2>로비 마을에서 건설</h2><p>{flow}</p><p>{components}</p><p>{link("로비 미리보기",preview(hud,"main"))} · {link("건설 작업 명세",spec)}</p><figure><img src="../../kpop-planning/snapshot/assets/hud-r19-village.png" width="225" alt="로비 마을의 지붕 위 증설 가능과 수리 필요"></figure></section>'
hs=re.sub(r'<section id="build-access">.*?</section>',lambda _:s,hs,count=1,flags=re.S)
hs=hs.replace('r17 · 25개 HUD 전체 편집 보드',f'r{h["revision"]} · 25개 HUD 전체 편집 보드')
write(hd,hs)
p=library/'papers/P265.html.txt';s=p.read_text()
s=re.sub(r'(<th scope="row">건설</th><td>)r\d+ · \d+개',lambda m:m[1]+f'r{b["revision"]} · {len(b["screens"])}개',s,count=1)
s=re.sub(r'(<th scope="row">HUD</th><td>)r\d+ · \d+개',lambda m:m[1]+f'r{h["revision"]} · {len(h["screens"])}개',s,count=1)
s=re.sub(r'7018 HUD r\d+',f'7018 HUD r{h["revision"]}',s,count=1)
a=s.index('<section class="tab" id="build">');end=s.index('</main>',a)
imgdir='산출_기획서_20261120_UI기획_그림/'
para='<p>'+overview+'</p>'
sections=[
 ('1. 목적 · 범위',para),('2. 화면 목록 · 흐름','<p>'+flow+'</p>'),
 ('3. 화면 깊이 · 뒤로','<p>현황은 전체 화면. 공통 시설 확대는 상단 마을 구도와 하단 작업 영역을 유지합니다. 견적·수리·결과는 같은 확대 상태에서 작업 영역 내용을 바꿉니다. 취소는 직전 시설로, 닫기는 진입한 곳으로 복귀합니다.</p>'),
 ('4. 화면별 상세',qtable),('5. 규칙 · 예외','<p>'+states+'</p>'),
 ('6. 리소스 · 데이터','<p>'+components+'</p>'),
 ('7. 남은 결정','<p>'+validation+'</p>'),
 ('8. 변경 기록',f'<p>2026-11-24 · 현중 선택 시안 반영 · 9시설 이미지 확대와 로비·현황 공통 카메라 · 건설 r{b["revision"]}.</p>'),
 ('9. 그림 발주','<p>기획사 마을 원화 1장 · 2차 검수용. 시설별 외관 클로즈업과 지붕 위 상태 표식은 이 원화를 기준으로 제작합니다.</p>')
]
tab=f'<section class="tab" id="build"><h2 class="tt">건설 UI 기획서</h2><p class="meta">7018 r{b["revision"]} · {link("작업 명세",spec)} · {link("건설 미리보기",preview(build,"city"))}</p>{para}{figs(imgdir)}'+''.join(f'<details><summary>{label}</summary><div>{body}</div></details>' for label,body in sections)+'</section>\n'
s=s[:a]+tab+s[end:]
a=s.index('<section class="tab" id="hud">');end=s.index('<section class="tab" id="photocard">')
part=s[a:end];part=re.sub(r'<div class="village-manage">.*?</div>','',part,flags=re.S)
position=part.index('<details')
intro=f'<div class="village-manage"><h3>로비 마을 건물 직접 선택</h3><p>{flow}</p><p>{link("로비 미리보기",preview(hud,"main"))} · {link("건설 현황","#build")}</p></div>'
part=part[:position]+intro+part[position:]
part=part.replace('시설 상세 아래 판(본관 · 부속 A · 부속 B) · 최대 증설 확인 창 · 조립 장면','건설 현황 또는 로비의 건물 → 같은 마을에서 확대·견적·증설·수리')
write(p,s[:a]+part+s[end:])
cat=library/'catalog.json';d=json.loads(cat.read_text())
rootkey=next(p['path'] for p in d['documents'] if p['id']=='P265').rsplit('/',1)[0]+'/'+imgdir
for name in ['hud-r19-village',*[c[1] for c in captures]]:
 d['assets'][rootkey+name+'.png']='assets/'+name+'.png'
write(cat,json.dumps(d,ensure_ascii=False,indent=2)+'\n')
