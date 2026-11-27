# 공통 가이드 .21 추가안 — Racing09 / Tycoon10

codex(단이) · 2026-11-17 09:54 KST · **DRAFT / 제안(검수 대기)**

이 파일만 신규 작성했습니다. 공통 내장 가이드와 index는 **2026-11-17.20** 그대로이며 프로젝트 guide .4·이전 본문·기존 캡처를 보존합니다. 본체의 Tycoon 저장/QA 후 별도 쓰기 신호 전까지 제품 가이드·index에 반영하지 않습니다. 제품 파일 HMR을 일으키는 가이드 편집은 하지 않습니다.

이번 문서 담당의 확인은 로컬 가이드/보고/JSON 읽기, 원본09와 r200 폰 캡처 직접 보기, Pillow 파일 크기 확인입니다. 브라우저·HTTP·시험 재실행은0입니다. 아래 실제 UI 결과는 본체 기록이며 로컬 정적검사·그림 준비와 구분합니다.

## 현재 요약으로 옮길 문구

Racing09 최신 저장은 `ux-gjs-0d80d7fe` **r200·9화면·801부품/Racing35·18연결**입니다. r184의 기존8화면 전체와16연결은 보존됐습니다. 본체 native 조립33단위에 중앙 Content wrapper와 새 reward road band를 더한35부품이며, 준비 레시피만을 실제 조립으로 센 값이 아닙니다. 저장 파일 정적검사126/126과 실제14고유 자원의 HTTP200·응답/로컬 SHA 일치를 구분해 기록합니다.

Racing 실제 마지막 검수는 CSS1440×900/430×844/1920×1280에서 팝업명 `Modal_Event_RacingStarter`와 failed0/loading0/overflowX,Y0을 확인한 범위입니다. 이전 이름/요청 크기만 맞은 캡처는 중간 이력으로 보존합니다. Tycoon은 새 그림과 UI 기하 준비/측정 레시피 단계이며 **저장 revision·부품/연결 수·실제 조립/QA는 미확인**입니다.

최신 전체 소스 시험494/494·fail0·cancelled0·exit0은 Shop 단위의 이전 결과입니다. 본체 전달상 이후 제품 소스 변경0이며 Racing 단위에서 전체 시험을 다시 실행하지 않았습니다. 정적126과494를 더하거나 이번 재시험으로 적지 않습니다. **10장 최종 동등0/10·W/P/U/S0/4**를 유지합니다.

## AI_GUIDE / USER_GUIDE 추가안 — 복제와 순서

- 네이티브 Footer/Close 묶음을 복제하면 해당 Close 연결도 함께 복사됩니다. 새 Close 연결을 중복 생성하기 전에 현재 연결을 확인하고, 복사된 Shop 행동의 설명/이름을 Racing 용도로 고칩니다. stable ID와 기존 유효 연결을 불필요하게 재발급하지 않습니다.
- 부모 변경은 형제 표시 순서를 자동으로 바꾸지 않습니다. Racing에서 복제 Close가 Panel보다 앞선 기존 순서에 남아 가려졌습니다. native의 앞으로 가져오기로 Frame → Txt_Close → Btn_Close 순서를 정리한 뒤 실제 클릭 가능 여부를 다시 확인했습니다. 부모를 바꾼 것만으로 맨 앞에 왔다고 판단하지 않습니다.
- 키보드 검수는 이름·사각형 존재와 별개입니다. 본체는 Main SALE에서 열기, Close 클릭/Enter/Space·Escape와 SALE trigger 초점 복귀를 확인했습니다. 저장된 browser-checks는 클릭/Enter 열기/Escape/초점 기록을 담으며 Enter/Space Close는 본체 전달 범위입니다.
- Main SALE→Racing은 원본 버전/실제 진입 조건을 확인하지 못한 **시연 연결**입니다. 이 한계를 native 연결 설명에 남기고 실제 이벤트 노출·상점/구매 정책이 확정됐다고 하지 않습니다.
- 원본의 제목 각 줄·235%·525·54K·₩4,400·시간·가능 횟수는 그림과 분리한 native text입니다. 관찰된 fixture 문구를 실제 구매/보상/재화 지급·카운트다운 API로 해석하지 않습니다.

## TOOL_SPEC / ARCHITECTURE 추가안 — 중앙 콘텐츠와 독립 딤

Racing은 fullscreen modal의 화면 크기 **551×984 Content wrapper**를 가운데 유지하고 Panel/Title/Boost/Close를 그 안의 고정 부품으로 둡니다. root의 black.7 딤은 Content와 독립적으로 화면에 stretch합니다. engine dim=false, blocking=true, Escape 닫힘/Close 허용은 저장된 Racing 계약입니다. 화면에 맞추어 늘리는 딤과 비율을 유지한 offer 콘텐츠를 하나의 늘어나는 그림으로 합치지 않습니다.

본체 상세390×844/430×932에서 Content의 위·아래 여백이 거의 같아 가운데 배치가 유지됐습니다. 상세 편집의 축소된 DOM 좌표 관찰과 실제 preview CSS 크기를 섞지 않습니다. 제목/보상/가격 텍스트, 회색9slice fill·흰9slice rim, 녹색3slice CTA, 고정 원형 증가/Close 장식, 깃발/색종이/시계와 엔진 그림자는 독립 부품입니다. 임의 scene masking이나 원본과 같은 곡선/폰트를 새로 지원한다고 적지 않습니다.

재사용 자원은 원래 파일을 그대로 참조합니다. Racing UI manifest의 재사용3개에는 이미 준비된 Racing scene도 포함되므로 새 scene을 이중 합산하지 않습니다. 저장된14고유 참조는 신규 기하8+scene1+road band1+기존 white rim/green CTA/dice/cash4의 실제 참조 집합으로 확인된 수입니다.

## 캡처 규칙 추가안 — 이름보다 실제 대상과 크기

캡처 직전 실제 popup name, 충분히 안정된 opacity/연출, loading/failed, `innerWidth/innerHeight`와 넘침을 확인하고 저장 후 Pillow 파일 픽셀 크기를 별도로 적습니다. 선택된 탭에 viewport 설정이 적용됐는지 확인하며 페이지 확대율과 앱의 device/zoom을 구분합니다. 요청한1440이나 파일명으로 실제1440 검수를 추정하지 않습니다.

|증거 파일|본체가 측정한 실제 CSS/대상|로컬 파일 픽셀|가이드에서 사용할 범위|
|---|---|---|---|
|[racing-r200-phone1440.jpg](../../../docs/evidence/20261117-racing09/racing-r200-phone1440.jpg)|첫 단계 CSS1592×1675의 Racing 폰 영역|551×985|Racing 폰 이미지. 1440 검수 증거로 쓰지 않음|
|[racing-r200-desktop1440-phone-final.jpg](../../../docs/evidence/20261117-racing09/racing-r200-desktop1440-phone-final.jpg)|중간 CSS1029×643의 축소 Racing|237×422|확대율/viewport 진단 중간본. 1440 최종으로 쓰지 않음|
|[racing-r200-desktop-final.jpg](../../../docs/evidence/20261117-racing09/racing-r200-desktop-final.jpg)|최종 CSS1440×900, Racing|1440×900|정상1440 증거|
|[racing-r200-mobile-final.jpg](../../../docs/evidence/20261117-racing09/racing-r200-mobile-final.jpg)|최종 CSS430×844, Racing|430×843|모바일 CSS와 파일 높이1px 차이를 그대로 기재|
|[racing-r200-desktop1920-final.jpg](../../../docs/evidence/20261117-racing09/racing-r200-desktop1920-final.jpg)|CSS1920×1280이나 팝업은 Wins|1919×1280|다른 preview 조작 후 대상이 달라진 중간본. Racing 최종으로 쓰지 않음|
|[racing-r200-desktop1920-target-confirmed.jpg](../../../docs/evidence/20261117-racing09/racing-r200-desktop1920-target-confirmed.jpg)|최종 CSS1920×1280, Racing 대상 재확인|1919×1280|정상1920 Racing 증거. CSS와 파일 폭1px 차이 구분|

accepted browser check는 `desktop1440-final-measured`/`mobile430-final-measured`/`desktop1920-target-confirmed`와 `detail390`/`detail430`입니다. `desktop1440`/`desktop1440-final`/`desktop1920-final-measured`는 이름만으로 성공 목록에 넣지 않습니다. 최초 fade/loading 중간 이미지도 최종 검수로 세지 않습니다.

## 자원·crop·alpha·보존 문구

Racing 원본에는 앞쪽 큰 차와 뒤쪽 작은 차2대, 총3대가 보이지만 새 scene에는 앞 큰 차와 보라 차2대만 있습니다. 뒤의 작은 노란 차가 누락된 차이를 명시하며 원본 동등을 주장하지 않습니다. 새 장면/기하/road band는 원본 스크린샷 픽셀을 잘라 붙인 완성 화면이 아닙니다.

- Racing scene은 새 생성 원본/프롬프트·RGBA를 보존한700×467의 불투명 비례 그림입니다. source 전체를 사용한 crop 없는 별도 장면이며 native 제목/보상/가격/버튼/UI를 포함하지 않습니다. production111772B, alpha255, production/staging SHA 및 lossless RGBA 일치는 해당 manifest의 로컬 준비 검증입니다.
- 신규 기하8종은 SVG/PNG/WebP를 보존하고 fill/frame·고정 glyph·ribbon을 나눕니다. source caps/edges/positive center/padding0은 개별 계약을 따릅니다. WebP<300000B, PNG↔WebP RGBA·production/staging SHA 일치와 기존 자원 보존은 준비 단계 검증이고, 실제14자원 HTTP/SHA는 별도 본체 실행 기록입니다.
- 새 reward road band는468×230의 불투명 고정 코드 그림입니다. 텍스트/보상/외부 cast shadow 없이 원본 도로/초록 보상 바탕을 근사했고 source screenshot crop이 아닙니다. 장면과 별도 native image로 놓습니다.
- Tycoon scene도 새700×467 불투명 전체 장면으로 원본/프롬프트/RGBA를 보존합니다. 상단 아치 UI/제목/진행/랭킹/보상/입력은 별도 조립 대상입니다. native9 아치의96px cap/edge 한계와 정확한 scene clip 미지원/미확인을 유지합니다.
- Tycoon 새 avatar3개는160², 제안 puppy120², blue pack82×120입니다. 각 새 생성 원본에서 투명 바깥 부분을 tight crop한 뒤 PNG/RGBA/lossless WebP를 보존했으며 **원본 스크린샷을 crop한 아이콘이 아닙니다**. manifest에 alpha0~255·PNG/WebP RGBA 일치·production/staging SHA·300000B 이하 및 기존 자원 무덮어쓰기 근거가 있습니다. avatar3 보존은 뒤 puppy/pack QA에도 기록돼 있습니다.
- 새 avatar는 허구의 musician/family/sailor 해석입니다. 원본 인물 관계/정체·악기 세부는 미확인입니다. pet 원종도 미확인이므로 puppy는 제작 제안이며 username 등으로 동물을 확정하지 않습니다. pack 티어/보상정책·가려진4위·self 사진/수치·미관찰 내용은 창작하지 않습니다.

## PROGRESS 추가안 — Racing 확정 범위 / Tycoon 대기

|항목|현재 초안에 기록할 사실|유지할 경계|
|---|---|---|
|Racing 저장|r200·9화면801부품/Racing35·18edges|기존 r1848화면 전체/16edges 보존|
|조립|실제 native recipe33단위+중앙 wrapper+road band|준비 레시피와 actual 조립/저장 구분|
|정적/자원|저장 파일126/126, 고유14자원 HTTP200/SHA 일치|원본 시각동등/실제 구매 시험이 아님|
|실제 입력|Close 클릭/키보드/Escape·Main SALE 초점 복귀 본체 확인|SALE 버전·진입조건 미확인 시연연결|
|실제 화면|Racing 대상의1440/430/1920 마지막 측정·failed0/loading0/overflow0, 상세390/430 중앙 여백|잘못된 대상/중간 크기 캡처를 최종으로 세지 않음|
|전체 소스 시험|Shop에서 시행한494/494가 최신; 이후 소스 변경0이라는 본체 전달|이번 Racing 재실행0; 정적126과 합산0|
|Tycoon 준비|scene1/UI기하6+재사용5, 신규 avatar3/puppy1/bluepack1 준비 manifest와 측정 recipe 진행|최신 actual 저장 revision·부품/연결·등록HTTP·입력/기기/Close/focus QA는 대기|
|전체 완료 경계|10장 최종 동등0/10·W/P/U/S0/4|원본 폰트/시각동등·게임/구매·7007/LSB native·최종 사용자 승인 미완료|

Tycoon이 저장/검수되면 본체 신호에서 revision·화면/부품/연결·보존 baseline·정적/자원 수·실제 popup name/입력/포커스·CSS/PIL 크기·기기별 clip/스크롤/고정 영역·미확인을 받아 해당 대기 행만 새 사실로 바꿉니다. 준비 이미지의 manifest `UIApplied:false`를 현재 UI 전체 상태로 덮어 해석하지 않고 실제 등록/참조/QA 기록을 별도로 적습니다.

## EXISTING_GAME 공통 경계와 반영 방법

이번 새 UI와 독립 자원 준비는 원 게임 소스 변환, 실제 이벤트/결제/랭킹 API·정책 승인, 원본 screenshot/font 동등 승인과 별개입니다. 기존 guide .4·공통 .20 이하·원본/새그림/생성 프롬프트·이전 실패/중간 캡처·기존 화면/연결을 보존합니다. 외부 설계JSON 쓰기로 native 작업을 대체하지 않습니다.

현중의08:35 명시90% 제한 해제·7018 편집/검수 허용 이후 수동작업 맥락을 유지합니다. 이전91→92%와 현재 허용 계정 조회를 새 상한으로 만들지 않습니다. 기존 ui 자동화는 PAUSED이며 새 마감·상한·예약 재개·리셋·구매를 만들지 않습니다.

본체 신호 후 제품 가이드 반영 대상은 기존6MD의 역할별 절과 PROGRESS 현재 상단, index version입니다. 실제 쓰기 전 지정 backup 경로에 원문을 보존하고 원문 본문/프로젝트 .4 SHA 불변·색인 section 목록·로컬 링크를 확인합니다. README 등 추가 소유 범위는 별도 지시를 따릅니다. 이 초안 링크는 `_작업/codex/ux-studio/` 기준이므로 제품 가이드로 옮길 때 root 방향 `../../../`를 `../../../../` 기준으로 다시 맞춥니다.

## 읽은 근거

- [공통 .20 PROGRESS](../../../src/tools/uxStudio/guide/PROGRESS.md), [공통 색인](../../../src/tools/uxStudio/guide/index.json), 루트 AGENTS 최신 직접 재개/보존 규칙.
- [Racing09 본체 보고](../../../docs/collaboration/reports/20261117_0920_racing09_native.md), [원본09](../../../docs/reference/monopoly-go/20261116-ten-screens/09_event-offer.png), [측정 quick sheet](racing09-assembly-quick-sheet.md), [native recipe](racing09-native-recipe.mjs).
- [Racing 실제 UI/viewport 기록](../../../docs/evidence/20261117-racing09/browser-checks.json), [r200 정적/보존126검사](../../../docs/evidence/20261117-racing09/file-verification.json), [14자원 HTTP/SHA](../../../docs/evidence/20261117-racing09/asset-http-checks.json).
- [Racing scene manifest](racing-event-assets.json), [Racing 기하/reuse manifest](racing-ui-assets.json), [분리 road band](racing-road-band-assets.json).
- [Tycoon scene](tycoon-event-assets.json), [Tycoon 기하/reuse](tycoon-ui-assets.json), [Tycoon avatar3](tycoon-avatar-assets.json), [Tycoon puppy/pack](tycoon-pet-pack-assets.json), [Tycoon 측정 quick sheet](tycoon10-assembly-quick-sheet.md).
- [이전 Shop 전체494 시험 로그](shop-popup-final-tests.log). 본체 메시지의 실제 Racing native 복제/순서 수정·키보드/초점 및 Tycoon 준비 상태를 함께 사용했습니다.

## 초안 자체 확인

신규 파일만 작성했으므로 덮어쓸 기존 초안/백업 대상은 없었습니다. 공통6MD/README/index 및 프로젝트 guide .4 파일의 작성 전·후 SHA가 같습니다. 이 초안의 모든 로컬 링크 대상 존재와 위6개 JPG의 Pillow 픽셀 크기를 확인했습니다. 브라우저/HTTP/시험 재실행·제품 가이드/index/설계/소스/UI/공용 STATUS·보고 수정은0입니다.
