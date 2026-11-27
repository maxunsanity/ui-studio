from pathlib import Path
import json,html,re,shutil,datetime,hashlib
s=Path('/Users/max/projest_max/ui-studio/samples/royal-match');root=s.parents[1];pub=root/'src/tools/uxStudio/guide/reference/royal-match-video-20261118';doc=s/'docs/ui';ev=s/'docs/evidence/20261118-royal-match';ev.mkdir(parents=True,exist_ok=True)
for p in Path('/Users/max/Documents/Codex/2026-11-17/2/outputs/royal-qa').iterdir():
 if p.name!='14-welcome-mobile.jpg':shutil.copy2(p,ev/p.name)
d=json.loads((s/'ui-studio/designs/ux-9f500ab8.json').read_text());audit=json.loads((doc/'saved-data-audit.json').read_text());inv=json.loads((doc/'ui-inventory.json').read_text());screenNames={x['name']:x for x in d['screens']};suffix={x['name'].split('_')[-1]:x for x in d['screens']};stamp=datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).isoformat(timespec='minutes')
for item in inv['screens']:
 sc=suffix[item['name']];item.update(status='샘플 조립 v1 · 제안(검수 대기)',nativeScreenId=sc['id'],nativeScreenName=sc['name'],nativeRevision=d['revision'],nativeParts=len(sc['elements']),runtime='선택 화면 미리보기 검수 / 자동 진입 미연결'if item['name']=='Welcome'else'로비에서 연결 진입 확인',productionPreview='../evidence/20261118-royal-match/final390-'+sc['name']+'.jpg')
 if item['name']=='Shop':item['observed']=item['observed'].replace('왕의 보물','왕자의 보물')
inv['sampling']='2fps 114장 + 대표14장 + threshold .12 scene-cut36장. 정확한 cut PTS는 reference/video-analysis-20261118/scene-cuts/times.json.';inv['updatedAt']=stamp;(doc/'ui-inventory.json').write_text(json.dumps(inv,ensure_ascii=False,indent=2))
con=json.loads((doc/'connections.json').read_text());con['actualSaved']={'revision':d['revision'],'count':len(d['transitions']),'source':'saved-data-audit.json actualConnections'};con['verified']='r194 실제 13개 주요 연결 시나리오 통과. 42개 전이 전수 조작 시험으로 확대하지 않음.';con['remaining']=['Welcome→Lobby는 저장 연결만 존재, 자동 진입 미연결/실행 왕복 미검수','킹스컵 플레이·외부 계정/지원·구매/팀/친구 결과는 영상 미관찰로 미연결'];con['note']='planned는 최초 조사 계획. actualSaved와 실제 시험을 구분한다.';(doc/'connections.json').write_text(json.dumps(con,ensure_ascii=False,indent=2))
tok=json.loads((doc/'ui-tokens.json').read_text());tok['button'].update(mainSize=[214,100],standard=[240,80],lifeAdd=[114,74],wide=[378,76],half=[212,72],view=[144,64],lifeRow=[432,90]);tok['anchors']={'fullBackground':'stretch both; room cover','bottomNavAndMainButtons':'bottom left','ornatePopups':'center fixed','listViewport':'vertical stretch; cards fixed size','welcomeRewards':'center fixed cells128×128'};tok['input']='compound 자식은 부모 전달. 이미지형 버튼 위에 별도로 겹친 장식은 표시 전용(pointer-events:none).';(doc/'ui-tokens.json').write_text(json.dumps(tok,ensure_ascii=False,indent=2))
qa={'updatedAt':stamp,'revision':d['revision'],'stage':'제안(검수 대기) / 단계 기준판 미보존','desktopMobile':{'CSS1440x900':'5페이지+7팝업 연결/화면 확인, 이미지누락0·가로넘침0','CSS430x843':'5페이지+7팝업 및 퍼즐 확인, 이미지누락0·가로넘침0','device390x844':'native 선택 미리보기 14화면; 설계 폭504 유지→논리504×1091; 깨진이미지0·텍스트가로넘침0','pixelImages':'브라우저 확대/DPR 때문에 JPG픽셀은 CSS크기와 다름. 개별 파일 크기 정보는 evidence-manifest.json.'},'finalRuntimeSmoke':json.loads((ev/'final-runtime-r194.json').read_text()),'commonHoverFix':json.loads((ev/'hover-after-common-fix.json').read_text()),'finalLogical':json.loads((ev/'final-logical390-r194.json').read_text()),'toggle':json.loads((ev/'final-toggle-results.json').read_text()),'scroll':json.loads((ev/'final-scroll-results.json').read_text()),'keyboard':{'Escape':'설정 팝업 닫기 통과','Enter':'별 계속 닫기 통과','PageDown':'스크롤 컨테이너 tabIndex=-1에서 이동 안 함; 키보드 스크롤 통과 아님'},'limitations':['Welcome 자동 진입 미연결. 14번째 화면은 native 선택 미리보기로 검수; Collect→Lobby 실행 왕복 미검수','글꼴은 도구 대체 글꼴이며 원본 폰트 확정/픽셀 동일 판정 아님','실제 게임·보상·구매·계정·팀전송 제외','이번 UI 작업의 앱 공통소스/빌드/서버/7007 변경0; 1차의 홈 진입 개선과 구분']};qa['toggle']['historicalHoverLimitation']=qa['toggle'].pop('hoverLimitation',None);(doc/'runtime-qa.json').write_text(json.dumps(qa,ensure_ascii=False,indent=2))
# Produce readable static HTML without adding dependencies.
def inline(t):return re.sub(r'`([^`]+)`',r'<code>\1</code>',html.escape(t))
def mdhtml(text):
 out=[];table=False
 for line in text.splitlines():
  if line.startswith('|'):
   if not table:out.append('<table>');table=True
   if re.match(r'^\|[\s:|\-]+\|$',line):continue
   out.append('<tr>'+''.join('<td>'+inline(x.strip())+'</td>'for x in line.strip('|').split('|'))+'</tr>');continue
  if table:out.append('</table>');table=False
  if not line:continue
  if line.startswith('# '):out.append('<h1>'+inline(line[2:])+'</h1>')
  elif line.startswith('## '):out.append('<h2>'+inline(line[3:])+'</h2>')
  elif line.startswith('- '):out.append('<p class="item">• '+inline(line[2:])+'</p>')
  else:out.append('<p>'+inline(line)+'</p>')
 if table:out.append('</table>')
 return ''.join(out)
css='body{font:16px/1.7 system-ui;color:#20354a;background:#edf2f7;margin:0}header{background:#153b57;color:white;padding:24px}main{max-width:1200px;margin:auto;padding:24px}nav{display:flex;flex-wrap:wrap;gap:12px;margin:16px 0}a{color:#175d9a}nav a{padding:8px 14px;background:white;border:1px solid #bacddd;border-radius:8px;text-decoration:none}section{display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:20px}article,.paper{padding:20px;background:white;border:1px solid #ccdae5;border-radius:14px}img{display:block;max-width:100%;height:auto;background:#172433}article img{max-height:430px;object-fit:contain;width:100%}h1{font-size:28px}h2{font-size:22px}code{background:#edf3f7;padding:2px 4px;overflow-wrap:anywhere}table{border-collapse:collapse;width:100%}td{border:1px solid #ccd8e0;padding:8px}.item{margin-left:12px}.note{padding:16px;background:#fff6d8;border-radius:10px}'
wrap=lambda title,body:'<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>'+html.escape(title)+'</title><style>'+css+'</style>'+body+'</html>'
(doc/'production-guide.html').write_text(wrap('로얄매치 샘플 제작 가이드','<main><nav><a href="research.html">조사서</a><a href="runtime-qa.json">검수 기록</a></nav><div class="paper">'+mdhtml((doc/'PRODUCTION_GUIDE.md').read_text())+'</div></main>'))
canvas='/ui-studio/canvas.html?workspace=workspace-fd5ecb11-2d17-4d9f-b610-f8989abc9fd4&project=ux-9f500ab8&view=ui&layout=grid';runtime='/ui-studio/preview.html?project=ux-9f500ab8&workspace=workspace-fd5ecb11-2d17-4d9f-b610-f8989abc9fd4'
nav='<nav>'+''.join('<a href="'+html.escape(u,quote=True)+'">'+t+'</a>'for t,u in [('전체 캔버스',canvas),('동작 시험',runtime),('제작 가이드','production-guide.html'),('샘플 표시값','sample-data.json'),('공통 규격','ui-tokens.json'),('연결 계획·실제 범위','connections.json'),('저장 데이터 검사','saved-data-audit.json'),('실화면 검수','runtime-qa.json')])+'</nav>'
body='<header><h1>로얄매치 · 샘플 UI 조사서</h1><p>영상 분석 → 실제 샘플 데이터 비교 → 새 그림과 native 부품 조립</p></header><main><p>r194 · 14화면 · 573부품 · 42연결 · 제안(검수 대기)</p>'+nav+'<p class="note">원본 캡처는 분석 전용입니다. 제작 그림은 모두 새로 그렸습니다. 13개 주요 연결 시나리오와 14화면 기기 검수를 했으며, Welcome 자동 진입 미연결과 공통 hover 수정 검수는 기록에 남겼습니다.</p><section>'
for item in inv['screens']:
 body+='<article id="'+item['id']+'"><h2>'+item['id']+' '+html.escape(item['title'])+'</h2><p>'+str(item['representativeSeconds'])+'초 · '+html.escape(item['kind'])+'</p><details><summary>영상 분석 원본</summary><img loading="lazy" src="'+item['reference']+'" alt="영상 분석 '+item['title']+'"></details><p>새로 제작한 native UI · 390×844 기기</p><img loading="lazy" src="'+item['productionPreview']+'" alt="제작 '+item['title']+'"><p>'+html.escape(item['observed'])+'</p><p>'+html.escape(item['runtime'])+'</p></article>'
body+='</section></main>';(doc/'research.html').write_text(wrap('로얄매치 샘플 UI 조사서',body))
# Only this Royal reference folder is writable; no shared guide registration/source edits.
pub.mkdir(parents=True,exist_ok=True);(pub/'evidence').mkdir(exist_ok=True)
for name in ['ui-inventory.json','sample-data.json','ui-tokens.json','connections.json','saved-data-audit.json','runtime-qa.json','sample-reference-data.json','PRODUCTION_GUIDE.md']:shutil.copy2(doc/name,pub/name)
for p in ev.glob('final390-*.jpg'):shutil.copy2(p,pub/'evidence'/p.name)
pubbody=body
for item in inv['screens']:
 pubbody=pubbody.replace(item['reference'],'references/'+Path(item['reference']).name).replace(item['productionPreview'],'evidence/'+Path(item['productionPreview']).name)
(pub/'index.html').write_text(wrap('로얄매치 샘플 UI 조사서',pubbody));guide=(doc/'production-guide.html').read_text().replace('href="research.html"','href="index.html"');(pub/'production-guide.html').write_text(guide)
(s/'README.md').write_text('''# 로얄매치 · UI 제작용 샘플

r194 · 14화면 · 573부품 · 42연결 · 제안(검수 대기). UI 스튜디오 7018 독립 샘플입니다.

- [조사서와 제작 화면](docs/ui/research.html)
- [다른 AI용 제작 가이드](docs/ui/production-guide.html)
- [샘플 표시값](docs/ui/sample-data.json) / [공통 규격](docs/ui/ui-tokens.json)
- [저장 검사](docs/ui/saved-data-audit.json) / [실화면 검수와 제한](docs/ui/runtime-qa.json)
- [native 내보내기](exports/native-r194/) / [작업 보고](docs/collaboration/reports/20261118_royal_match_sample.md)

workspace `workspace-fd5ecb11-2d17-4d9f-b610-f8989abc9fd4`, 설계 `ux-9f500ab8`.

원본 영상 캡처는 분석 전용이며 게임 장면도 새로 그린 스틸입니다. 실제 게임·지급·결제·계정·팀 통신은 없습니다. Welcome 자동 진입은 미연결이고 선택 미리보기로 확인합니다. 토글 hover는 1차 공통 수정 후 켜짐/꺼짐 그림 검수를 통과했습니다. 원본과 픽셀 동일/최종 승인 판정은 아닙니다. 내 작업에는 native 사본 준비를 사용하세요.
''')
work=s/'_작업/codex/video01';(work/'README.md').write_text('# 제작 기록\n\n이 폴더의 조립·자원 생성 스크립트는 해당 시점의 일회 작업 기록입니다. 이전 생성기/restore 코드를 무작정 재실행하지 마세요. 최신 native 설계와 PRODUCTION_GUIDE.md가 우선입니다. audit_sample.py는 저장본 읽기 검사이고 finalize_docs.py는 이 샘플의 조사서·정적 Royal 뷰어만 재생성합니다. UI 설계 JSON을 외부 수정/주입하지 않습니다.\n')
old=work/'write_research.py'
if not(work/'write_research.initial.py').exists():shutil.copy2(old,work/'write_research.initial.py')
old.write_text('raise SystemExit("Historical initial writer preserved as write_research.initial.py; do not overwrite final fixtures/research. Use finalize_docs.py for the latest viewer.")\n')
print('Updated Royal docs and isolated static viewer',pub,stamp)
