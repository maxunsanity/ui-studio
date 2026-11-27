from pathlib import Path
from html import escape
from collections import Counter
import json,shutil,re
r=Path.cwd()
stage=Path(__file__).parent
ref=r/'src/tools/uxStudio/guide/reference'
dest=ref/'kpop-planning/nonhud-audit';dest.mkdir(parents=True,exist_ok=True)
j=json.loads((stage/'ledger.json').read_text())
findings=json.loads((stage/'findings.json').read_text())
ws='workspace-cfa517bd-d9e1-40c4-aa1f-576e182500ba'
sample='/ui-studio/source/sample-preview.html?workspace='+ws+'&amp;view=detailed-wireframe'
spec={'defense':'defense','build':'build','photocard':'photocard','schedule':'schedule','relation':'relationship','mission':'mission','shop':'shop','mons':'mons','crew':'crew','profile':'profile'}
totals=Counter()
for q in j['projects']:totals.update(q['counts'])
assert j['browserChecks']==2*len(j['screens'])
assert all(q['prev']==q['rev'] for q in j['projects'])
for f in ['screen-audit.csv','resource-audit.csv','ledger.json']:
 shutil.copy2(stage/f,dest/f)
def td(value):
 return '<td>'+escape(str(value))+'</td>'
def cb(project,screen):
 return f'{sample}&amp;project={project}&amp;screen={screen}'
def report(p):
 k=p['key']; f=findings[k]; c=p['counts']; design=p['id']
 boards=' · '.join(f'<a href="{cb(design,b)}">{escape(b)}</a>' for b in p['boards']) or '없음'
 result=f'<section id="{k}"><h2>{escape(f["name"])} <small>r{p["rev"]} · {c["screens"]}화면</small></h2><p><a href="../index.html?doc=P265#{k}">UI 기획서</a> · <a href="../../kpop-{spec[k]}/index.html">작업 명세</a></p><p><strong>부품 보드</strong> {boards}</p><p>{escape(f["parts"])}</p>'
 result+='<ul class="findings">'
 for level,target,detail in f['issues']:
  result+=f'<li><span class="level">{escape(level)}</span><strong>{escape(target)}</strong><br>{escape(detail)}</li>'
 result+='</ul>'
 rows=[]
 for s in j['screens']:
  if s['기능']!=k:continue
  sid=s['화면 ID']; title=s['화면명']
  type={'page':'전체 화면','modal':'모달','sheet':'바텀시트'}.get(s['종류'],s['종류'])
  if s['부품 보드']:type='부품 보드'
  display=[]
  pset=s['프레젠테이션']
  if s['종류']!='page':
   display.append('전체 좌표' if s['창 기준']=='fullscreen' else '창 좌표')
   if 'blocking' in pset:display.append('입력 차단' if pset['blocking'] else '배후 활성')
   if 'dim' in pset:display.append('딤' if pset['dim'] else '딤 없음')
  for caption, field in [('흑백 3D 후보','원본 흑백 3D 후보'),('컬러 유지','컬러 보존 지정'),('텍스트 넘침 후보','텍스트 넘침 후보'),('9분할 확인 후보','벡터 외곽 후보')]:
   if s[field]:display.append(f'{caption} {len(s[field])}')
  rows.append(f'<tr><th scope="row"><a href="{cb(design,sid)}">{escape(title)}</a><br><code>{escape(sid)}</code></th>'+td(type)+td(s['이미지·상태 참조 수'])+td(s['명세 매핑'] or '미등록')+td(' · '.join(display) or '—')+'</tr>')
 return result+f'<details><summary>전 화면 {len(rows)}개 열기</summary><div class="scroll"><table><thead><tr><th>저장 화면·ID</th><th>유형</th><th>이미지·상태 참조</th><th>명세 연결</th><th>검사 메모</th></tr></thead><tbody>{"".join(rows)}</tbody></table></div></details></section>'
summary=[]
for p in j['projects']:
 c=p['counts'];f=findings[p['key']]
 summary.append(f'<tr><th scope="row"><a href="#{p["key"]}">{escape(f["name"])}</a></th>'+''.join(td(v) for v in (f'r{p["rev"]}',c['screens'],c.get('modal',0),c.get('sheet',0),c['parts'],c['mapped'],c['image-refs']))+'</tr>')
collision=''.join('<tr>'+td(findings[k]['name'])+td(a)+td(b)+td(f'{w:g} × {h:g}')+'</tr>' for k,a,b,w,h in j['overlap'])
guide='../../../KPOP_WORKFLOW_GUIDE.md'
style='''
html{color:#223142;background:#eef2f5;font:15px/1.65 system-ui,sans-serif}body{margin:0}main{max-width:1080px;margin:auto;padding:26px 16px 70px}h1{font-size:29px;margin:0 0 10px}section{background:white;border:1px solid #cfd9e0;border-radius:10px;padding:16px 18px;margin:16px 0}h2{margin:0 0 6px;font-size:21px}h2 small{font-size:13px;color:#526879}a{color:#174e78}a:focus-visible,summary:focus-visible{outline:2px solid #174e78;outline-offset:2px}.scroll{overflow-x:auto}table{width:100%;min-width:640px;border-collapse:collapse;font-size:13px}th,td{padding:8px 10px;text-align:left;border:1px solid #dbe2e7;vertical-align:top}thead{background:#e9eff3}code{font-size:12px;overflow-wrap:anywhere}details{margin-top:14px}summary{cursor:pointer;font-weight:700}details .scroll{margin-top:10px}.findings{padding-left:22px}.findings li{margin:8px 0}.level{display:inline-block;min-width:62px;color:#6a4c31;font-size:12px;font-weight:700}.level+strong{overflow-wrap:anywhere}nav{display:flex;gap:7px 14px;flex-wrap:wrap}p{margin:6px 0 12px}
'''
head='<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>7018 HUD 제외 세부 와이어프레임 전수 검수</title><style>'+style+'</style></head><body><main>'
body=f'''<h1>HUD 제외 세부 와이어프레임 전수 검수</h1>
<p>2026-11-24 KST · 케이팝몬스터즈 UI 스튜디오 · 검수 대기</p>
<nav><a href="screen-audit.csv">366개 화면 전수표 CSV</a><a href="resource-audit.csv">2D·3D 리소스 사용 목록 CSV</a><a href="ledger.json">화면별 검사 세부 JSON</a><a href="{guide}">케이팝몬스터즈 UI 제작 가이드</a></nav>
<section id="scope"><h2>범위와 결과</h2>
<p>현재 7018의 비HUD 세부 와이어프레임 10개 프로젝트, {len(j["screens"])}개 화면을 430px·1440px에서 총 {j["browserChecks"]}회 열었습니다. 현행 HUD와 구형 G1 HUD·재작업 설계는 범위에서 제외했습니다.</p>
<p>브라우저의 이미지 로딩 실패 {totals["bad"]}개, 참조 파일 누락 {totals["refmissing"]}개, 가로 넘침 {totals["overflow"]}개입니다. 표의 이미지·상태 참조는 사용 위치별 집계라 같은 자원이 재사용될 때 반복됩니다.</p>
<p>창 종류·정렬·닫기 정책은 저장 설정을 전수 비교했습니다. 주요 문제는 동작 런타임으로 재현했습니다. 모든 버튼의 마우스 순회와 실제 게임의 상태·수치 검증은 이번 검사 범위에서 빠져 있습니다.</p>
<p>리소스 목록의 3D 후보는 레이어명과 대체 텍스트로 분류했습니다. 흑백·저채도 후보는 실제 3D인지와 원본 컬러가 있는지 확인이 필요합니다. 텍스트 넘침 후보 {totals["text"]}개에는 의도적인 말줄임이 포함될 수 있습니다.</p>
<div class="scroll"><table><thead><tr><th>기능</th><th>저장판</th><th>화면</th><th>모달</th><th>바텀시트</th><th>부품 보드</th><th>명세 연결 화면</th><th>이미지 참조</th></tr></thead><tbody>{''.join(summary)}</tbody></table></div></section>
<section id="priority"><h2>먼저 확인할 문제</h2>
<ul><li>스케줄 그림 도감의 퍼즐과 이야기 완료에서 창이 사라지거나 X가 동작하지 않습니다.</li><li>크루 미션 보상 모달이 전체 화면 두 장으로 겹치고 닫으면 미션을 건너뜁니다. 크루는 전용 부품 보드도 없습니다.</li><li>몬스 팩의 보유·교환 동선, 상점 루비 부족 복귀, 포토카드 결과 복귀, 관계도의 아래 시트 마스크, 미션 수령 전 닫기에서 기획과 차이가 있습니다.</li><li>저장 캔버스 좌표에서 건설·미션·상점·프로필의 11쌍이 겹칩니다.</li></ul></section>'''
body+=''.join(report(p) for p in j['projects'])
body+=f'<section id="overlap"><h2>저장 캔버스에서 겹친 11쌍</h2><div class="scroll"><table><thead><tr><th>기능</th><th>화면 A</th><th>화면 B</th><th>겹치는 픽셀</th></tr></thead><tbody>{collision}</tbody></table></div></section>'
body+='<section id="color"><h2>3D 컬러 규칙</h2><p>3D 원본은 컬러를 유지합니다. 이미지 내용의 「3D 원본 색상 유지」를 켜면 세부 와이어프레임의 회색 필터 없이 그려집니다. 디펜스의 3D 전장과 신규 악귀·보스·효과 19개 이미지를 적용했습니다. 기존 화면의 흑백 3D 후보는 화면 전수표와 리소스 사용 목록에 남겼습니다.</p></section>'
(dest/'index.html').write_text(head+body+'</main></body></html>\n')
print('audit',len(j['screens']),totals['modal'],totals['sheet'],j['assetRows'])
