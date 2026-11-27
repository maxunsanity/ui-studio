# 고유 프레임 3종 제작

작성자 codex(단이) · 2026-11-17 20:28 KST · 제안(검수 대기)

## 지시
현중 “분류해서 작업 계속 진행해”. 선별 3종 신규 제작 / 유사14종은 재사용 분류.

## 읽은 원본
AGENTS 최신절, collaboration README/STATUS, 최근 선별·용량보고, FRAME_SELECTION, 공통tokens, 원본MGV02-S04-B/MGV09-S12/S11, r335저장. 기존 Gallery/Map·2점투시 보고는 직전 읽은 이력을 이어감.

## 진행
시작 r335/14화면1144부품22연결/SHA b651bea0f3b52bfd71a090372d75789b2d894ff95ba52f7efee3475dba9c1e1a. 파일1,486,492bytes. 측정1·그림2 에이전트 병행, 본체 native 조립 담당.

## 백업
/Users/max/projest_max/ui-studio/docs/planning/_backup/20261117_단이/202816_unique_frames32

## 확인/미확인
현재 회차 신규 조립/저장/화면검수는 진행 예정. 538/538은 직전 제품 소스시험이며 이번 신규3종의 통과로 세지 않음. source/3D/game/7007/원본전체동등 미확인, W/P/U/S0/4 유지.

## 최종 제작 단위 보고 · 2026-11-17 21:52 KST

한 줄 결과: 선별한 고유 3종을 실제 7018 툴로 조립·저장·재열기했습니다. 같은 판틀의 14변형은 재사용 분류로 유지합니다. 상태는 제안(검수 대기)입니다.

### 바꾼 것과 근거

- 저장본 r335/14화면1144부품22연결 → **r352/17화면1277부품25연결**. 쇼룸28/클래스55/콩나무50, 합133개 새 부품입니다. 기존14화면 전체와22연결은 deep equality로 보존했습니다. 추가3연결은 Close/Back이고, 미확인 입구·장착·좌우·Info·트로피는 미연결입니다.
- 정본 `samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:49439` 쇼룸 / `:50631` 클래스 / `:52884` 콩나무. 1,646,761bytes, SHA256 `68c206de41f339d0884a717b619ceed077ab3fcfdc4d3e5082c8e426cbe059fb`.
- 새 원화3종과 편집 가능한 SVG 기하27종(교정 전후 포함)을 authoring/production/staging에 보존했습니다. 원본PNG·프롬프트·SHA를 남겼고 native 이미지 경로 입력+Tab으로 등록했습니다. 외부 설계JSON 편집0입니다.
- Footer72/Hit44/Glyph28, 3열148×281·Title148×42·Card84×114·IconSlot58×77·Amount48×38·Bean28×29를 맞췄습니다. ?는 native 장식 문자, 다른 아이콘은 contain 그림입니다. 444×281 공통 백판1개/구분선2개, 쇼룸 EquipDock102/extension60/버튼244×72, 콩나무 floatingClose44/28+40투명링입니다. 수치는 제작 제안이며 원본 Unity 설정·사용자 수치 승인으로 세지 않습니다.
- 복사 때 따라온 GalleryBack을 장착/좌우에서 제거하고, 닫기 설명·자식 이름·고정 앵커를 교정했습니다. extension이 딤 뒤에 있던 순서, 두 타이머 줄바꿈, cloudcap 이음색, 열마다 중복되던 백판과 그림자를 실제 화면으로 보완했습니다.

### 확인한 범위

1. 상세 툴의 화면 추가/복사/부품·속성/이미지경로/3·9slice/부모/이름/행동/기기/파일저장으로 제작했습니다. 정식 ‘현재 파일 다시 열기’로 r352 저장됨을 확인했습니다. 전체 캔버스17목록/새3이름, 부모 Panel_Beanstalk_Details 선택→동일 screen/element 상세링크도 확인했습니다. 화면 찾기는 화면 맞춤, 부품은 계층의 ‘레이어 선택’으로 고릅니다.
2. 미확인 입구를 저장하지 않으려고 별도 소비자 fixture를 사용했습니다. `guide/reference/monopoly-go-video-20261117/unique-frame-review.html:5`는 GET 저장본→메모리사본 배후에 QA열기1개→정식 mountDesignConsumer입니다. 실제 target 부품·행동은 저장본 그대로이며, 설계 POST/파일 수정/실제 게임 입구 구현은 없습니다. fixture 준비를 native 조립으로 세지 않습니다.
3. 소비자에서 3종 Close/Back click·Space 진입/Enter 닫기, 두 모달 Escape·배후 inert·호출버튼 초점 복귀·내부 Tab 유지 확인. 장착2초 mouse의 normal→pressed→hover와 엔진 drop-shadow(0,3,4,.3)를 확인했습니다. 별도3D pressed 원화 완성으로 세지 않습니다.
4. CSS1440×900/430×843 각각3종 최종 image failed/loading/가로·세로넘침0. 중간 fixture의 세로23px는 상태영역 높이를 계산해 0으로 보완했으며 진단값을 보존했습니다. CSS1920×1280 실제 JPEG2400×1600 / 폰 crop578×1032 / 복합캡처1920×1168을 구분합니다.
5. 실제 editor 기기390×844/430×932의6case에서 이미지실패0. 부모11쌍 가로세로비 최대차0.00000448, 누락0. 독립 preview의 전체 fit과 논리 기기 reflow를 구분했습니다.
6. 본체 `npm test > _작업/codex/ux-studio/unique-frames32/final-source-tests.log 2>&1`: **544/544 fail0·exit0**. `python3 _작업/codex/ux-studio/unique-frames32/verify_unit.py`: **1010검사 fail0·exit0**. 242저장자원 SHA/존재, 30신규보관자원 제한/미러, 동일 역할 규격, 기존14/22 보존을 확인했습니다. 시험 수는 완성률이 아닙니다.
7. 참조 경로·미러16검사, 실제 비교문서6그림 CSS1440/430 가로넘침0·failed/loading0. 툴 내 guide.32/13문서에서 FRAME_SELECTION의 최신 내용을 실제 선택했습니다. 뷰포트 임시 설정을 reset했고 작업영역 보기1371×1143도 원래 값으로 복원했습니다.

### 가이드와 협업

FRAME_SELECTION.md:1의 현재 상태, :53의 재현 절차10단계에 판단·규격·원화·부모앵커·복사행동/그림자·명명·딤·3열·타이머·fixture 경험을 기록했습니다. PROGRESS/AI_GUIDE/TOOL_SPEC/COMMON_UI_RULES/README/USER_GUIDE/ARCHITECTURE와 index/tokens .32를 연결했습니다. 기존 프로젝트 guide.4는 보존했습니다.

분류 원문17항목/유사14제외 이력을 보존하고 새 source family 진행은7제작중/14내용미착수로 갱신했습니다. 이14개를 새 판틀 제작 목록이나 완료로 쓰지 않습니다. 원본9MOV/44기록/84상태/31family후보는 별도 분모입니다.

2차의 save-plugin compact 저장/기준판 보완은 독립 코드 읽기 리뷰(차단결함 없음)와 이번 본체544시험에 포함됐습니다. 2MB/300KB·검증·409·잠금·atomic·백업 유지. 실행7018은 아직 pretty handler 캐시이며, 2차 dirty 탭 때문에 서버 재시작/브라우저 reload를 보류했습니다. 카피 설계·자원은 본체가 수정/초기화하지 않았습니다. 새 설계에서 독립 작업하는 방법과 복사 주의점을 명시 승인된 기술 공유로 전달했습니다.

### 미완료와 다음

- W/P/U/S0/4·원본10장 최종동등0/10. 원본폰트·재질·미세9slice경계선, 장착의 별도입체눌림원화, 장착/좌우/Info/트로피·실제게임/미확인입구가 남았습니다. 새3종도 최종 시각 승인으로 세지 않습니다.
- 쇼룸 배후는 기존 Shield진열장 재사용이고 토큰목록 본문은 미조립입니다. 콩나무 관찰5000보상 tooltip은 미조립/trigger 미확인입니다. 유사14종은 내용·행동 완료가 아닙니다.
- 공통 연출 demo의 보조×와 runtime 소비자 닫기는 다릅니다. main.mjs:950 근방 HTMLbutton gate/별도 demoOverlay 때문에 role=button div의 저장 close를 소비자처럼 검증하지 못합니다. 이번 실제 성공은 위 fixture 범위입니다. 다음 툴 보완 대상으로 남기고, 2차 dirty 보존을 위해 공유 main/HMR/서버를 변경하지 않았습니다.
- 제품 실행모듈 import/export 변경0, 검수 HTML만 consumer의 공식 export를 사용합니다. Kpop Graphify지도/감시·보호파일·모노원본·타담당·7007 무변경. 신규예약/자동재개/reset/구매0, ui PAUSED·7018only 유지.

### 백업과 증거

- 최초 r335: `docs/planning/_backup/20261117_단이/202816_unique_frames32/`.
- 문서 백업: `docs/planning/_backup/20261117_단이/213649_guide32_publish/`. USER_GUIDE/ARCHITECTURE는 append 이전 접두 본문을 append-prefix-preservation에 보존했으며 사전 copy와 구분합니다.
- `docs/evidence/20261117-unique-frames32/`: confirmed-native-r352-design.json / file-verification.json / browser-qa.json / reference-verification.json / 3종 desktop·mobile·phone / three-frames-1920.jpg. 중간 문제 캡처는 diagnostic-r350/r351에 보존했습니다.
- 이번 구현·소스 시험·저장값·실제 브라우저·자료 분석·미확인·최종 승인을 구분합니다.
