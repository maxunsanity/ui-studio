# -*- coding: utf-8 -*-
from pathlib import Path
import json, datetime, shutil
r=Path('/Users/max/projest_max/ui-studio')
project=Path('/Users/max/projest_max/ui-guideline-israt/ui-studio')
designPath=project/'designs/ux-31671dd8.json'
d=json.loads(designPath.read_text())
stamp=datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).strftime('%Y-%m-%d %H:%M KST')
total=sum(len(s['elements']) for s in d['screens'])
p=r/'src/tools/uxStudio/planning-documents.json'
data=json.loads(p.read_text())
q=next(x for x in data['projects'] if x['projectId']==d['projectId'])
ev=next(x for x in q['sections'] if x['id']=='events')
for f in ev['fields']:
    if f['label']=='현재 제작 규격 r84':f['label']='현재 제작 규격 r92'
p.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
g=r/'src/tools/uxStudio/guide/WIREFRAME_HUD_GUIDE.md'
g.write_text(g.read_text()+'''\n## 최종 검수 보정 · 2026-11-19
- 현재 실제 저장본 r92, 로비/인게임17상태와 메뉴·정보창·규격9개로 총26화면입니다. 앨범 주간/월드는 전체 HUD 복제 대신 작은 비교 부품으로 추가했습니다.
- 앨범/페스티벌210×96·y61은 원문210×71과 다른 제작 검토안입니다. 표지, 수집/차트, 보상3종, 깃발, 기간/연료, 레이스·추천을 넣어 높이를 늘렸습니다. 원문 치수를 바꿔 승인값처럼 기록하지 않습니다.
- 자식으로 초상·이름·대사 또는 보상 칩을 나누면 부모 카드의 임시 표시 글을 지웁니다. 부모 안내 글과 자식 글을 겹쳐 그렸던 실수를 실제 화면에서 발견하고 수정했습니다.
- 텍스트를 빈칸으로 지울 때는 전체 선택 후 Backspace→Tab으로 커밋합니다. 빈 문자열 입력만 호출하면 기존 글이 남을 수 있으므로 저장본과 실화면을 함께 확인합니다.
- 화면 크기 검수 후 viewport를 원복하고 편집합니다. 임시 크기에서 조작 좌표가 어긋난 사례가 있었으며 저장 횟수를 내용 수정 성공으로 세지 않습니다.
- 저장본1,829,041bytes, 제한2,000,000bytes 대비170,959bytes 여유입니다. 이 값은 r92 실측이며 다음 작업 시 다시 확인합니다.
- 게임 자동 진행·1초 꾹 누르기 타이머·실제 판정/보상은 구현하지 않았습니다. 상태 시안과 수동 화면 연결을 게임 실행으로 설명하지 않습니다.
''')
w=project/'UI_WORK_ORDER.md'
t=w.read_text().replace('아직 선행 다른 화면 삭제가 미실행인 점을 확인한다.','참고 페이지 정리는 최신 실제 제작 절을 따른다.')
t=t.replace('현재 실제 저장본 r77 · 24화면 · 2855부품 · 130연결입니다.',f'현재 실제 저장본 r92 · 26화면 · {total}부품 · {len(d["transitions"])}연결입니다.')
t=t.replace('3버튼규격 틀이 있습니다.','3버튼규격 틀, 주간/월드 앨범 비교 부품이 있습니다.')
t+='\n최종 검수: 로비17상태 모두 실제 편집기 미리보기 진입, 390×844·누락 이미지0 확인. 관련 자동시험723/723. 대사/리액션/보상 칩의 부모 임시 글 중복 제거. 상세 증거·미검수 범위는 위 보고서를 읽습니다.\n'
w.write_text(t)
stage=Path('/Users/max/Documents/Codex/2026-11-17/2/browser-repair')
dest=r/'docs/collaboration/reports'
for suffix in ['main.jpg','dialogue.jpg','mobile.jpg','qa.json']:
    f=stage/('20261119_hud_native_resume_'+suffix)
    if f.exists():shutil.copy2(f,dest/f.name)
ids={s['id'] for s in d['screens']}
bad=[]
for s in d['screens']:
    elements={e['id'] for e in s['elements']}
    for e in s['elements']:
        if e.get('parentId') and e['parentId'] not in elements:bad.append(('parent',s['name'],e['id']))
for e in d['transitions']:
    if e.get('targetScreen') and e['targetScreen'] not in ids:bad.append(('target',e['id']))
print({'stamp':stamp,'revision':d['revision'],'elements':total,'transitions':len(d['transitions']),'bytes':designPath.stat().st_size,'referenceErrors':bad,'qaCount':len(json.loads((dest/'20261119_hud_native_resume_qa.json').read_text()))})
