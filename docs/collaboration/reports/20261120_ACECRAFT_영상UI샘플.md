# ACECRAFT 영상 UI 샘플 제작
codex(단이) · 2026-11-20 17:11 KST · 진행 · 제안(검수 대기)

## 지시
현중: “이 게임 이름좀 찾아보고 이 두개의 영상에서 샘플 ui 찾아서 제작해줘”.
이전 타일3화면 보정과 별개 새 샘플, 다른 채팅 Pikmin/포토카드/타게임 작업과 분리. 루틴/7007/서버재시작 없음.

## 원본 / 식별
Desktop 2026-11-19 오후1.41.20.mov(113.08초), 오후1.43.19.mov(33.505초), 세로420×924.
영상의 Explorer Joey / Overdrive Tickets / Honk's Depot가 Apple 공식AppStore https://apps.apple.com/es/app/acecraft/id6499112583?eventid=6827963235 와 일치. ACECRAFT로 식별. 특정버전/계정정책은 영상 밖으로 확정하지 않음.
출처프레임/metadata/표본은 _작업/codex/ux-studio/unidentified-game-20261120/video-a 및video-b 보존. 1초전체표본과빠른전환보조표본이며 게임전체화면조사 아님.

## 작업계획
- [x] 기존 가이드/STATUS/직접지시/동시담당 대조, 두 영상 분담 분석과 공식이름검증.
- [x] 중복판틀/상태/연출을 분류하여 관찰 UI목록·타임스탬프·기존샘플대응/규격표 저장.
- [x] 별도 samples/acecraft를 정상 폴더찾기/독립프로젝트로 등록, 도구에서 신규설계 생성.
- [x] 새 그림/기하프레임을 준비하고 툴 직접유닛/글자/그림/부모/버튼/스크롤/탭/관찰연결 조립.
- [x] 저장/재열기/1440·430·기기390/이미지/입력 검수, actual캡처와가이드/샘플목록 갱신.

## 제작경계
영상/캡처는reference전용, 원화crop/전체한장붙이기제작 금지. 큰캐릭터/배경은 내장imagegen 신작, 기하UI는기존벡터제작구조로준비. 글자/금액/수량은native분리. 3/9slice·엔진외부그림자·입력wrapper·명명/규격준수.
사용자저장설계/projectmetadata 외부주입 금지. 신규게임폴더만shell준비, ui-studio저장공간은정상UI가생성. 필요한미지원은원인확인/백업/최소공통개발/회귀후검수.
게임결제/가챠결과/API는실행하지않고샘플의관찰UI/미리보기연결만구성. 미정숫자/원본폰트/보이지않는동작창작금지.

## 초기 중간 상태 · r3(과거)
현재 workspace-457652ed-0c01-4aec-bd2d-060a999c1178 / ux-96eff1ad. 새 로비 main 69조립동작과 일반UI 가독성보정 후 r3저장, 첫 미리보기 확인. 20보드 중 로비1개 조립, 모집Honk 다음보드 진행중. 이 수는 최종 시각동등/게임완성률이 아님.

분담 분석에서 작성한 19보드519개 action은 정상UI 조작 지침일 뿐 실제 조립수가 아님. 카탈로그초안·레시피 검토·신규원화 manifest는 _작업/codex/ux-studio/acecraft-20261120/ 아래 보존. UI형태 계획20개(로비1/모집3/목록상점획득7/모달9), CIN과동일틀변형은 분석자료로구분.

백업: docs/planning/_backup/20261120_단이/ACECRAFT_r1_조립전/ux-96eff1ad.json. native 저장/재읽기 r3확인. CSS1440/430 및390기기·연결/이미지/최종 재열기·최종캡처는미검수. 제품소스변경/7007/서버재시작0.


## 중간 · 2026-11-20 19시대 · r22
정상UI 저장된9보드(로비/모집3/메뉴·우편·친구·미션·팩상세),구매확인10번째조립중. 저장본r22의연결은0개로최종연결·재열기·폰/430/1440 검수는아직대기. 기획20개를실제완성20개로세지않음.

로비원본A7 재대조로모집→Pilot→Adventure/미확인4/Shop추정순서·관찰Lv60/477316·이벤트3구역과보조2구역 보완. 새16아이콘atlas로교체했고 공통footer420×82/5셀84×82/icon60²/caption80×20·14px를native편집으로맞췄음. Honk footer는부모그룹으로정리해관계/저장확인,다음PilotList에재사용예정. Switch의임시불투명plate는실그림을가리지않도록논리frame만남김(원본원형platform세부는미완료).

실제캡처 독립검토에서낮은제목대비2/닫기백판1을발견→r13 normalUI보정후새3장 재확인. 이전판과현재판은before-contrast 파일/hash로분리.

r16에서저장그림선택뒤async완료확인없이crop한조작으로7/16 cell불일치와Scene잔여crop발견. r16백업/실패캡처보존, r17 native재선택·영역입력/배경전체보기 후16영역불일치0·Scene.region없음 확인. 교체완료 DOM확인→재선택→입력/적용값·대상ID검증으로자동조작순서를보완. 엔진제품결함으로단정하거나core코드수정하지않음.

보고/증거 보존: _작업/codex/ux-studio/acecraft-20261120/{recipe-review.json,visual-review-first6.json,atlas-r16-before.json,image-expectation-overrides.json,audit-r22-partial.json}; docs/evidence/20261120-acecraft/. 초기스테이지캡처실측420×924, r13/r17/r20/21추가캡처는현재전송폴더outputs/acecraft에저장후최종공용폴더로복사예정. 임시제어기·조립alias로그는Cua파일쓰기제약으로Documents/Codex작업공간을전송위치로썼고최종프로젝트작업폴더에도보존할예정. 파일기반로그/recipe는정상UI조작지침·증거이며saveddesign/projectmetadata주입이아님.

분석gallery 원본docs/reference/acecraft/·정적서비스사본src/tools/uxStudio/guide/reference/acecraft-video-20261120/에20종별reference보드를보존. 아직모두본체확인대기표시,최종actual매핑/브라우저검수대기. 공통index/guideVersion/runtime/7007/서버/자동화/타게임변경0.


## 중간 · 2026-11-20 20:25 KST · r35
정상 UI 저장 16화면/14연결, Chapter17번째 진행 중. 로비8012지폐 glyph·미션6개 설명 top/10px/12line·상품수량 대비 교정 후 r30, 닫기6개44px·28glyph/어두운outline r33, Pilot9카드 공통113×176·scroll viewport520px/공통footer16부품 normal copy r34, Limited shop r35. 같은-role shop 하단 Back40+4탭95/높이82 유지. 상점 재화 단일 문자열은 실제 UI 문제로 추가 발견하여 아이콘/수치 분리 공통헤더 준비. 최종20조립/연결·저장재열기/1440·430·390 검수는 아직 대기.


## 최종 결과 · 2026-11-20 21:13 KST · r45 · 제안(검수 대기)

두 영상의 게임은 **ACECRAFT(에이스크래프트)**입니다. 이번 대표 샘플 제작 단위는 정상 UI 조립·저장·기록까지 마무리했습니다. 최신 **ux-96eff1ad r45 / workspace-457652ed-0c01-4aec-bd2d-060a999c1178 / 20화면(11page·9modal)·800부품·29연결**입니다. 이 수를 전체 게임 완성률이나 원본 시각 동등성 승인으로 쓰지 않습니다.

### 산출과 제작
- 독립 저장은 `samples/acecraft/ui-studio/`입니다. 실제 툴의 유닛·속성·그림등록·부모/자식·복사/붙여넣기·저장으로 조립했습니다. 외부 설계JSON/모델/메시지 주입0, 원본 캡처 runtime 사용0입니다.
- 로비/파일럿/Honk·Radiant·Overdrive3모집/기간·챕터상점/Tempus상점/누적구매2형/Scott획득/메뉴·우편·친구·미션·상세·확인·아이템·보상·획득경로9팝업입니다.
- 새 원화·프레임·글자·가격/수량·입력 wrapper를 분리하고 3/9slice·기본tint버튼·엔진외부그림자 설정을 사용했습니다. global420×82/5셀84×82/glyph60²/caption80×20·14px, shop420×82/Back40+4셀95/caption91×38·14px, Pilot카드113×176/scroll-y뷰420×520을 적용했습니다.
- 분석 정본 `docs/reference/acecraft/`, 서비스사본 `src/tools/uxStudio/guide/reference/acecraft-video-20261120/`에 원본20참조+실제native20캡처를 나란히 표시하고 15신규자산기록·실ID·출처/추정/미확인을 연결했습니다. 캡처는 문서증거이며 제품 원화가 아닙니다.
- `samples/acecraft/ui-studio/guide/AI_GUIDE.md`에 제작규칙·실수와 수정방법·r45검수경계를 추가했습니다. 기존본문·공통index/guideVersion·다른게임을 보존했습니다.

### 실제 UI 확인
1. 시작홈 acecraft 샘플 카드→전체캔버스20 진입, 현재 파일 다시 열기→저장됨r45 확인.
2. 전체20화면을 desktop CSS1440×900/mobile CSS430×843에서 각각 열어 stage/page 가로넘침0·일반img실패0 확인. 390×844/430×932 기기비율보기도 확인했습니다. 설계폭420을 유지하고 논리높이909/910로 재구성하는 보기이며 물리390px캡처를 주장하지 않습니다.
3. 로비 wireframe/detailed-wireframe/ui 왕복과 0/27/27그림 노출을 확인했습니다. 표현 전환은 W/P/U/S 단계 완료가 아닙니다.
4. Menu→Mail/Friends→Close→Menu, Menu Escape→로비 초점복원, Radiant→Missions→Close→Back, Overdrive→Limited↔Chapter→Tempus→Period↔Milestones 및 순차Back/추가상점탭을 클릭했습니다. Enter Menu/Space Mail/Escape2회·배후inert·triggerfocus 복원도 확인했습니다. 저장29연결을 모두 실행한 것은 아닙니다.
5. Pilot9 키보드 초점/Tab으로 scrollTop0→57.5(내용578/뷰520)와 하단 고정을 확인했습니다. 비초점frame의 PageDown 첫시도(scroll0)는 성공으로 세지 않았습니다.
6. 관리→사용설명서→선택프로젝트 안내 사본→AI작업·수정규칙에서 ACECRAFT부록 표시를 확인했습니다.
7. 비교갤러리는 desktop1440×900/mobile430×843 넘침0, 전체20/팝업9/‘로비’검색4(본문검색 포함),55그림 로드·실패0. 개별 링크→상세편집r45/main, 상단 링크→전체캔버스20을 실제 클릭했습니다.

캡처 `docs/evidence/20261120-acecraft/final-*.jpg`20장은 모두 실제420×924입니다. r44촬영17장과 r45수정후3장이며 전부r45촬영이라고 쓰지 않습니다. context실측은 `capture-dimensions-final.json`을 따릅니다. desktop-1440-lobby=[1800, 1125], mobile-430-lobby=[514, 1055]입니다.

### 이번 본체의 최신 read-only 재실행
정확한 명령·exit는 `normal-ui-execution/acecraft-final-verification.json`에 보존했습니다.
- `node .../audit-acecraft.mjs --design <정식설계> --assets <정식자원>`: exit0,20/800/29,오류0.
- `node .../audit-expected-images.mjs --design <정식설계> --maps-dir <정상조작로그> --overrides <명시변경>`: exit0,296bindings(127image·169skin)일치,미조립0·불일치0.
- `node .../audit-copied-ui.mjs --revision 45`: exit0,복제110부품의자산/영역/세계좌표/부모/규격일치,오류0.
검사전후 설계SHA동일 `52cc5afd5f27d7387d32afb3e78613bae6d7e93db8934660972c8be86d6276f1`. 경고3은 의도된 마지막미션/Chapter카드 clip과 길이가 다른 구매문장입니다. 검사 수를 완성률로 쓰지 않습니다. 제품core변경0이므로 과거 npm시험을 이번재실행으로 쓰지 않습니다.

### 발견·보완·한계
- 미션/bar겹침,Pack·Rewards수량대비,Pilot레벨/설명대비,8012지폐glyph,Chapter3옆sprite,Tempus가격/수량/한도분리와대비,Cumulative제목/HUD겹침을 native수정했습니다. 이전판과 독립검토 r30/r44/r45 캡처/hash를 보존했습니다. 지정 최신검토 범위의 잔여P1/P2없음이며 원본동등 판정은 아닙니다.
- `sample-preview.mjs:73`은 non-page를 정적 sample로 표시합니다. 단독PackBuy와 공통연출demo에서 이동하지 않는 것을 제품버그/연결성공으로 쓰지 않습니다. PackBuy→Confirm은 저장연결만 확인했으며, 확정입구가 없어 runtime검수대기입니다. 임시게임버튼/허위입구를 추가하지 않았습니다.
- 원화는 새 근사 제안입니다. 복장/포즈/역할아이콘/상품proxy·모집기호문자·9slice가는경계가 원본과 다릅니다. 일부 반복상품/보상행은 축약했고 Medal등 동일틀변형·전화/다이얼연출은 분석자료로 보존했습니다. 원본폰트·실게임API/결제/지급/추첨/가려진수치·다른기기전체·모든버튼상태는 미확인입니다.
- 7007/서버재시작/빌드/자동화/게임API/다른담당·다른프로젝트 변경0. core import/export 연결변경0으로 코드지도 재생성은 하지 않았습니다.

### 백업·전달
r1/r16설계와 실패판, `docs/planning/_backup/20261120_단이/`의 문서/갤러리 백업, `normal-ui-execution/`의 조작로그를 보존했습니다. CUA쓰기제약으로 Documents/Codex에 쓴 제어기·로그·캡처는 프로젝트 작업/공용증거로 복사했습니다. 최종 결정은 현중이며 이번 산출은 제안(검수 대기)입니다. 추가확장과 최종미술승인은 별도 판단입니다.
