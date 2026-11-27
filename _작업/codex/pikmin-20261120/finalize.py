# coding: utf-8
from pathlib import Path
from PIL import Image
from datetime import datetime
from zoneinfo import ZoneInfo
import json, shutil

root=Path('/Users/max/projest_max/ui-studio')
sample=root/'samples/pikmin'
work=root/'_작업/codex/pikmin-20261120'
stage=Path('/Users/max/Documents/Codex/2026-11-17/2/pikmin-proof')
archive=work/'browser-stage'
evidence=sample/'docs/evidence/20261120'
evidence.mkdir(parents=True,exist_ok=True)
design=json.loads((sample/'ui-studio/designs/ux-f83f162e.json').read_text())
audit=json.loads((sample/'docs/ui/native-audit.json').read_text())
assert audit['revision']==design['revision']==51
assert audit['pass']==32 and audit['fail']==0
assert (sample/'ui-studio/designs/baselines/ux-f83f162e-P-r51.json').exists()
core=['mushroom-main','mushroom-detail','mushroom-select-0','mushroom-select-30','postcard-select-0','postcard-select-5','flower-bud','petals-unselected','petals-selected','flower-bloomed-detail','mushroom-start','flower-bloom']
names=core+['essence-popup','mushroom-limit','already-received','mushroom-rewards-scroll','mushroom-card-scroll','viewport-1440','viewport-430','viewport-430-petals','native-canvas-overview','final-preview-context']
for name in names:
    source=stage/(name+'.jpg')
    if not source.exists(): source=archive/source.name
    assert source.exists(),name
    if name in core:
        w,h=Image.open(source).size
        assert abs(w-390)<=2 and abs(h-844)<=2,(name,w,h)
    shutil.copy2(source,evidence/source.name)
checks=stage/'native-preview-checks.json'
if not checks.exists(): checks=archive/checks.name
shutil.copy2(checks,evidence/checks.name)
ui=json.loads(checks.read_text())
assert len(ui)==12 and all(not x['images']['bad'] for x in ui)
assert all(x['bounds']['w']==x['bounds']['sw'] and x['bounds']['h']==x['bounds']['sh'] for x in ui)
for name in ['Page_Pikmin_Petals','Page_Pikmin_PetalsSelected']:
    s=next(s for s in design['screens'] if s['name']==name)
    assert sum(e['name'].startswith('Btn_Petal_Add_') for e in s['elements'])==9
    assert sum(e['name'].startswith('Btn_Petal_Filter_') for e in s['elements'])==4

contact=Image.new('RGB',(1202,860),'#edf2ef')
for i,name in enumerate(['mushroom-main','mushroom-select-0','petals-unselected']):
    im=Image.open(evidence/(name+'.jpg')).convert('RGB').resize((390,844),Image.Resampling.LANCZOS)
    contact.paste(im,(8+i*398,8))
contact.save(evidence/'preview-contact.jpg',quality=94)
reports=root/'docs/collaboration/reports'
shutil.copy2(evidence/'preview-contact.jpg',reports/'20261120_pikmin_sample.jpg')
now=datetime.now(ZoneInfo('Asia/Seoul')).strftime('%Y-%m-%d %H:%M KST')
meta={'revision':51,'storedStates':15,'pagesIncludingStates':12,'overlays':3,'elements':525,'transitions':32,'nativeAudit':{'pass':32,'fail':0},'studioPageImageChecks':{'revision':49,'pages':12,'badImages':0,'overflow':0},'r51Followup':'Both petal states, quantity add common notice, saved runtime replay, desktop/mobile checks','browserViewportChecks':[{'width':1440,'height':1000,'scrollWidth':1440},{'width':430,'height':932,'scrollWidth':430,'badImages':0}],'viewportOverrideReset':True,'finalizedAt':now}
(evidence/'verification.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n')
report=reports/'20261120_pikmin_sample.md'
existing=report.read_text()
existing=existing.replace('17:03 KST · 진행 · 제안','17:03 KST · 보고완료 · 제안',1)
existing=existing.split('\n## 최종 보고')[0]
existing+=f'''
## 최종 보고 — {now}

작성자 codex(단이) · 제안(검수 대기). 지시 ID는 별도 없으며 현중의 현재 채팅 직접 요청입니다.

### 한 일
7018 UI 스튜디오에 독립 피크민 프로토타입 r51을 저장했습니다. 15개 저장 화면/상태(기본 페이지12·팝업/안내3), native 부품525개, 연결32개입니다. 서로 다른 판틀은10종이며 선택/개화/안내 상태 변형을15종의 독립 페이지 종류로 세지 않습니다. r49와 최종 r51 프로토타입 기준판을 모두 보존했습니다.

- 버섯: 지도·탐험 목록 → 핑크 상세 →0/30 → 자동30/30 → 시작 스틸 → 지도 복귀.
- 꽃: 꽃봉오리 → 꽃잎 선택/선택 완료 → 엽서0/5 → 자동5/5 → 개화 스틸 → 정수7 보상 → 개화 후 상세.
- 미선택 GO/다음 비활성, 복귀/취소, 보상 모달 닫기, 초과/기수령 토스트, 눌림 효과를 설정했습니다.
- 새 지도·버섯·꽃 장면, 간략 캐릭터/병/베리/아바타를 사용했습니다. 원본 캡처는 조사서에서만 보며 제품 이미지로 잘라 쓰지 않았습니다.
- 마지막 확대 대조에서 빠진 꽃잎 수량 옆 추가 버튼9개와4색 필터를 두 상태에 반영했습니다. 추가·검색·정렬·필터·미구현 셀/보라 상세는 공통 안내입니다.

### 읽은 원본과 저장 근거
두 원본 영상은 읽기 전용으로 분석했습니다. 47.98초428×940 영상24프레임, 63.9467초368×824 영상32프레임을2초 간격으로 추출하고 대표12관찰 상태를 정리했습니다. 매 프레임을 모두 분석했다고 주장하지 않습니다. iPhone 거리 경고와 영상 재생바·외부 편집 자막은 제외했습니다. 출처·SHA는 `samples/pikmin/docs/reference/sources.json:1`, 조사 상태는 `samples/pikmin/docs/ui/ui-inventory.json:1`입니다.

공통 시작/영상 제작 가이드와 실제 로얄매치 r194 Team/Profile의 배치·입력 분리를 참고했습니다. 타 게임의 원화·화면 크기·게임 수치를 그대로 가져오지 않았습니다. 실제 native 파일은 `samples/pikmin/ui-studio/designs/ux-f83f162e.json:1`, 독립 workspace는 `workspace-28ed8b09-fd50-4ef2-bca5-12a8be94d215`입니다.

### 바꾼 파일 — 전→후
- `samples/pikmin/`: 신규 별도 프로젝트 → 실제 도구에서 조립한15상태와 자원·기준판. 외부 설계 JSON 생성/주입이나 샘플 전용 실행 HTML/JS로 대체하지 않았습니다.
- `samples/pikmin/docs/ui/common-layout-tokens.json:1`: 화면별 임의 크기 대신390×844·역할별 장면/5열/3열/하단/추가 버튼 규격.
- `samples/pikmin/docs/ui/asset-manifest.json:1`: 새 그림 출처와 자원 크기·SHA. 실제 사용25개 content hash 자원 모두300KB 이하입니다.
- `src/tools/uxStudio/project-research.json:46`: 피크민 경로와 조사서 항목 추가. 이후 재생성 때 기존 항목은 다시 쓰지 않았습니다.
- `src/tools/uxStudio/guide/reference/pikmin/index.html:1`: 조사서·원본 분석 캡처·저장 화면 링크·연결 실행 링크·범위·이어받기 가이드.
- `samples/pikmin/AGENTS.md:1`, `docs/ui/PRODUCTION_GUIDE.md:1`, `README.md:1`: 다음 AI의 읽기/제작/검수 순서, 반복하지 않을 실수, 초기 생성기 재실행 주의.

### 이번 실제 확인
홈 → 샘플 피크민 → 전체 캔버스에서 r51·화면15개를 새로 열어 확인했습니다. 프로젝트 폴더 → 현재 피크민 → 조사서 → 이어받기 가이드도 실제 클릭했습니다. 조사서의 원본 캡처12개가 모두 로드되었습니다.

상세 편집 미리보기에서 두 흐름을 클릭했고, 별도 저장 실행 페이지에서도 버섯 흐름을 재진입했습니다. 비활성/활성 GO·다음, 공통 안내, 추가 버튼, 모달 닫고 원래 화면 유지, 토스트를 확인했습니다. 상세 본문 scrollTop85/내용500/창414, 가로 카드 scrollLeft97.5/내용488/창390도 실제 키보드로 확인했습니다.

r49에서 기본12페이지를 각각 열어 DOM 이미지 누락0·바깥 넘침0을 확인했습니다. r51에서 바뀐 두 꽃잎 상태는 다시 캡처하고 추가 버튼과 공통 안내를 재검수했습니다. 실제 저장 실행 화면을 CSS1440×1000과430×932에서 확인했고, 가로 넘침0이었습니다. 모바일 버섯/꽃잎 이미지 누락0. 스튜디오의430×932 기기 설정은 설계 폭390을 유지해 논리390×845로 표시됩니다. 임시 브라우저 크기는 검수 뒤 reset했습니다.

`node _작업/codex/pikmin-20261120/audit.mjs`: r51 문서 계약·자원/hash/300KB·모든 버튼 눌림 설정·공통 배치·비활성·연결·모달 복귀 등32통과/0실패. 결과 `samples/pikmin/docs/ui/native-audit.json`. 과거 다른 작업의 시험 수는 합산하지 않았습니다. 눌림 효과는 저장 설정과 실제 클릭으로 확인했으며 지속 누름 상태의 별도 캡처는 하지 않았습니다. 서버 JS/CSS를 변경하지 않아 빌드·서버 재시작은 하지 않았습니다.

증거: `samples/pikmin/docs/evidence/20261120/`. 개별15상태·스크롤·1440/430·전체 캔버스·전체 편집 문맥과 `verification.json`을 보존했습니다. 보고와 같은 이름의 `20261120_pikmin_sample.jpg`는 실제 브라우저 캡처3장을 나란히 배치한 검수 그림이며 제품 UI 이미지가 아닙니다. 최초 잘못 잘린 임시 캡처는 최종 증거에서 제외하고 자기 작업 폴더에 보존했습니다.

### 범위·미확인·판단 필요
자동 선택 중심의 대표 상태 시연입니다. 개별 선택 수 합산, 실재고·GPS·통신·실제 소비/보상·전투 엔진은 구현하지 않았습니다. 지도 꽃 버튼은 두 영상 사이의 시연 진입이며 원본에서 그 연결을 관찰한 것으로 주장하지 않습니다. 시작/개화는 새 스틸과 수동 진행 조작입니다.

원본의3D 캐릭터 장식·의상·실제 장소·유저 사진과 동일한 최종 원화는 아닙니다. 일부 이름/아바타는 간략한 샘플 표시입니다. 원화 충실도와 추가 실게임 동작의 범위는 현중 검수가 필요합니다. 구현 사실과 원화/기획 승인을 구분합니다.

다른 게임 설계·엔진·7007·기존 서버와 보호 파일을 이 작업에서 수정하지 않았습니다. 다른 채팅의 동시 변경을 본 작업으로 보고하지 않습니다. 커밋·외부 발송·예약 생성은 하지 않았습니다.

### 백업·이어받기
조사서 등록 전 백업: `docs/planning/_backup/20261120_단이/pikmin-research/project-research.json`.
native 이전판: `samples/pikmin/ui-studio/designs/backups/`.
기준판: `samples/pikmin/ui-studio/designs/baselines/ux-f83f162e-P-r49.json`, `ux-f83f162e-P-r51.json`.
새 그림 원본: `samples/pikmin/ui-studio/assets/authoring/`. 원본 영상은 수정하지 않았습니다.
폴더 준비 중 만든 공용 임시안 ux-bb5f93b4 r2는 최종 피크민 샘플이 아니며 삭제하지 않았습니다.

실행: http://127.0.0.1:7018/ui-studio/preview.html?project=ux-f83f162e&screen=main&view=ui&workspace=workspace-28ed8b09-fd50-4ef2-bca5-12a8be94d215
조사서: http://127.0.0.1:7018/ui-studio/source/guide/reference/pikmin/index.html
'''
report.write_text(existing)
plan=work/'plan.md'
plan.write_text(plan.read_text().replace('- [ ]','- [x]')+'\n最終 r51: 범위와 미구현은 최종 보고를 확인합니다.\n')
status=root/'docs/collaboration/STATUS.md'
row=f'| {now} | codex | 보고완료 | 피크민 별도 native 샘플 r51 ·15상태·32연결·프로토타입 기준판 | reports/20261120_pikmin_sample.md | 검수 대기 · native 검증32통과 ·1440/430 확인 ·커밋 없음 |'
with status.open('a') as f:f.write('\n'+row+'\n')
archive.mkdir(parents=True,exist_ok=True)
for p in stage.iterdir():
    if p.is_file():shutil.move(str(p),str(archive/p.name))
print(json.dumps({'time':now,'revision':51,'report':str(report),'evidence':str(evidence),'image':str(reports/'20261120_pikmin_sample.jpg'),'checks':audit['pass']},ensure_ascii=False))
