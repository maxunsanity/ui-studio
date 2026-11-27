# 2점 투시와 작은 눌림
codex(단이) · 2026-11-17 16:21 KST · 진행 · 제안(검수 대기)

현중 원문 “이론적으로 연구한거 맞아? 위쪽이 짧아져야지…버튼이 너무 크게 눌려…살짝만”, “이런걸 참조하라는 거야”. 주신 소실점/눈높이 참고2장을 보존합니다. 기존r299/실패원화는보존하고, 자료요약만이아닌실제투영수렴/작은이동을검증합니다. 작업계획 docs/plans/20261117-two-point-small-press.md. backup docs/planning/_backup/20261117_단이/1621_two_point_small_press。


2026-11-17 16:49 KST

## 이번 보완 결과 — 보고완료·제안(검수 대기)

사용자가 제공한 눈높이선/소실점 자료 두 장을 실제 제작 도면에 적용했습니다. 이전의 원근 설명과 생성 프롬프트만으로 형상을 검증하지 못했던 점을 보완했습니다. 이번 결과는 입체 기하·작은 눌림 보완이며, 원본 시각 동등이나 전체 UI 완성을 뜻하지 않습니다.

### 원문·원본·연구

- 현중: “위쪽이 짧아져야지…원근인데…버튼이 너무 크게 눌려…살짝만”, “이런걸 참조하라는 거야”.
- 이번 참고: codex-clipboard-923c672c-c182-43aa-ac67-c9ae66c7ad38.png, codex-clipboard-4b9bbca8-814e-4f33-b6be-df5f4acbff42.png. 원본을 docs/reference/monopoly-go/two-point-20261117/에 보존했습니다. 최신 빨간 GO 참고 d06a127f와 이전707×387 원본의 차이도 유지하며, 사진에서 실제 Unity 카메라를 알아냈다고 하지 않습니다.
- 관련 원본: AGENTS.md, guide/THREE_D_BUTTON_GUIDE.md, COMMON_UI_RULES.md, COMMON_UI_TOKENS.json, 이전 1530 재분석 보고, r299 저장 설계, button state/press renderer와 관련 시험, 이번 projection.py/test_projection.py/generate_v002.py.
- 개념 근거: Scratchapixel “Building a Basic Perspective Projection Matrix” 본문을 읽고 깊이로 나누는 투영을 확인했습니다. 도면/좌표/코드는 자체 재현 모델입니다. Blender 실행이나 원본 엔진 분석을 했다고 하지 않습니다.

### 바꾼 것·전후

1. 카메라를 기울이지 않은 2점 투시를 계산했습니다. 고정된 눈높이와 두 소실점 (-1285,-1173)/(1515,-1173)을 사용하며, 같은3D 둥근 정사각형의 밑면/윗면/눌린면에서 별도 상태 그림을 출력했습니다. 프레임 안에 소실점을 억지로 모으지 않습니다.
2. 둥글리기 전 제작 기준 사각형: 먼 위쪽 절반84.5px < 가까운 아래쪽97.5px, 먼 기준변130.9208px < 가까운 기준변139.6648px. 두 방향의 모서리 연장선이 같은 소실점으로 수렴하는지 독립 외적 잔차로 검증했습니다. 이 값은 PNG 알파 경계나 원본 RectTransform 측정값이 아닙니다.
3. 밑면은 고정하고 높이만 낮춰 윗면의 최대 이동을2논리px로 제한했습니다. 실제 중앙의 투영 이동1.857px에 맞춰 native Content 그룹을2px로 설정했습니다. 종전5px를 줄인 제작 제안이며 모든 버튼에 강제할 공통 상수는 아닙니다.
4. 새 normal/pressed/disabled 전체 입체 그림3종 v002를 SVG/PNG/losslessWebP로 저장했습니다. 전 상태230×220, 텍스트/화살표/외부castshadow는 굽지 않았습니다. hover/selected는normal 재사용입니다. 서로 다른 그림5장을 새로 그렸다고 하지 않습니다.
5. 툴 native 속성으로 Img_Roll_GO_States를 Roll 직속으로 옮기고 위치/크기0,0,230,220 및 상태별 경로를 입력했습니다. Group_Roll_GO_Content에는 native GO/화살표/안내만 남겨 parent입력+2px 이동을 연결했습니다. fullgraphic에 중복 translate를 하지 않습니다. 중복된 나중 추가 FixedRim1개만 native삭제했습니다.
6. 저장·재읽기 r299→r300, 12화면941→940부품(Main180→179),20연결 유지입니다. 원래 Main175개 ID 및 다른11화면 전체·20edges는 deep equality 동일합니다. 저장 JSON 외부 편집0.
7. 가이드 .27→.28, 11문서 유지. THREE_D_BUTTON_GUIDE에 1/2/3점의 구분, 실제 계산/작은 눌림/이중 변형 방지/실패 사례를 기록하고 공통규칙·토큰·사용/AI가이드·기획/구조/진행·현재검수 안내를 함께 연결했습니다.
8. 눈높이/소실점 전체 도면, 국부 확대도, 사용자 참고, 기본/눌림 원화 및 실제 앱 결과를 독립 열람 문서로 만들었습니다. 기존 영상 UI 문서는 r299를 과거 반려 이력으로 보존하고 현재r300/미완료를 따로 표시했습니다.

### 실제 진입과 검수

7018 UI스튜디오 → 현재 monopoly-go 프로젝트 → Main → Roll 개별부품 → native 부모/크기/이미지 경로·Tab 확정 → Button State5슬롯 → Content2px/parent입력 → 저장 → 재읽기r300 → Play의 실제 mouse hold/release 및 Space hold/release → 390/430 기기 → “저장 UI 함께보기” 실제 링크 → 저장 preview → 가이드 문서선택 “입체 버튼 제작법” 순서입니다.

- mouse3초/Space3초: 정상→pressed 별도SHA 전환·복원, fullgraphic 위치고정, Content/글자만2px 이동. 엔진 그림자 normal rgba.28/0,4,4 → pressed rgba.12/0,1,1의 실제 computed filter를 확인했습니다. png에 외부 그림자를 굽지 않았습니다.
- 편집기 실제 CSS1600×900 / 반환캡처2000×1125. 브라우저 DPR/페이지확대에 따라 캡처 좌표가 다르므로 DOM과 실제 페인트를 대조해 하단477px급 crop을 만들었습니다. 파일명만으로 검수 크기를 주장하지 않습니다.
- 기기390×844 /430×932의 버튼/graphic 종횡비230/220 유지·이미지 실패0/대기0.
- 저장 preview 실제 CSS1440×900 및430×843: 가로넘침0, 실패0/대기0, graphic과wrapper 같은 비율.
- 도면 문서 실제 CSS1440×900 및430×843: 8이미지 실패0/대기0, 가로넘침0. native 가이드.28 본문/투영식/두변수치/작은눌림 규칙 표시를 직접 확인했습니다.
- 상태모드 변경 뒤 접힌 inspector에 입력을 시도한1회 timeout은 다시 펼쳐 정상 처리했습니다. 브라우저 viewport 설정 초기 응답은 요청크기와 달라 실제CSS 재확인/안정대기 후 위 크기를 검수했습니다. 이를 제품 결함으로 단정해 불필요한 소스를 바꾸지 않았습니다.

### 시험과 증거

- python3 _작업/codex/ux-studio/two-point-button/test_projection.py :5/5. 먼저 missingmodule RED 기록 후 투영 구현으로 GREEN. 먼변 단축/수렴/밑면·작은변위/수직대응/카메라뒤점 거절.
- node --test tests/ux-studio/button-press-depth.test.mjs tests/ux-studio/button-state-editor.test.mjs tests/ux-studio/control-visual.test.mjs :33/33. 이번 제품 runtime source변경0이므로 전체516개를 이번 재실행으로 세지 않습니다.
- docs/evidence/20261117-two-point-small-press/native-r300-qa.json : 이번 실제 입력/기기/저장preview 측정20항목 통과.
- 로컬 자원검증: 전상태230×220/투명 모서리, PNG와losslessWebP RGBA 일치, manifestSHA/그림도면XML 유효.
- 영상문서 verify-video-inventory.py:2000/2000. 로컬 문서·공개사본·9MOV해시·모델보존·저장된 실제측정자료 검사이며 2000번 새 실조작/완성률이 아닙니다. r299의34개 측정은 과거 자료라고 구분했습니다.
- 실제 캡처: docs/evidence/20261117-two-point-small-press/r300-normal-editor.jpg, r300-pressed-editor.jpg, r300-normal-bottom.png, r300-pressed-bottom.png.
- 같은 폴더 model-preservation.json, native-r300-qa.json, guide-proof-qa.json. 기하수치/RED/GREEN/renderer로그는 _작업/codex/ux-studio/two-point-button/에 보존했습니다.
- 도면 정본 docs/reference/monopoly-go/two-point-20261117/index.html. 열람 URL http://127.0.0.1:7018/ui-studio/source/guide/reference/two-point-button-20261117/index.html.

### 보존·미완료·다음

원본 GO 서체·세부 광택/재질·원본 눌림 프레임 동등은 미완료입니다. 사용자 참고는 제작 방향이며 원본카메라/정확한 눌림 수치를 관찰한 것으로 바꾸지 않습니다. 이번 기하와 작은 눌림을 기초로 서체/표면/접합을 다음에 대조합니다.

전체 제작은 진행 중: 대표W/P/U/S0/4·초기10화면 최종동등승인0/10. 영상 신규21가족중2진행/19미착수·쇼룸부분1. GO 실제 주사위/소모/자동굴림 등 게임기능은 구현했다고 하지 않습니다. 원본r299·실패생성3원화·기존자원은 보존했습니다. 다른 프로젝트·2차Capybara설계/자원·7007·Kpop·보호파일 변경0. 7018만 작업, 자동화uiPAUSED 유지. 제품source/서버설정/재시작/빌드/새패키지/커밋0.

백업: docs/planning/_backup/20261117_단이/1621_two_point_small_press/, 1636_guide28_two_point/, 1641_inventory_r300/ 및 이번보고 직전 closeout백업. 원본 미삭제, 설계 사전r299 복원가능. 산출은 제안(검수 대기), 최종판단 현중.


### 파일:줄 근거
- _작업/codex/ux-studio/two-point-button/projection.py:2 camera/model, :5 perspective divide, :11 VP, :13 rounded master.
- _작업/codex/ux-studio/two-point-button/generate_v002.py:14 state heights, :26 body/bevel, :38 asset output, :45 geometry record.
- samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:4 r300, :1385 Img_Roll_GO_States, :5936 Btn_Roll_GO, :5979 distance2, :7578 Group_Roll_GO_Content.
- src/tools/uxStudio/guide/THREE_D_BUTTON_GUIDE.md:1 latest.28, :17 formula, :33 near/far, :36 subtlepress, :41 hierarchy.
- src/tools/uxStudio/guide/index.json:2 version.28; COMMON_UI_TOKENS.json:400 r300proposal/:458 history/:492 states.
- tools/ux-studio/current-review.json:5 current review r300.
- public bundle refresh:230files107443131bytes; verify-video-inventory.py rerun2000PASS/source9unchanged/HTML98targets.
- 가이드 .27의 이전상태 보존구역을 명시해 과거r299를 현재값으로 오인하지 않도록 했습니다.
- 현중 지식공유 지시에 따라 2차 Capybara GO 채팅에 .28의 투시/이중이동 방지 방법만 공유했습니다. 그 프로젝트에 제안2px를 강제하지 않았고 같은 작업을 새로 배정하지 않았습니다.
