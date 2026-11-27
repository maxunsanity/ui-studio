# 로얄매치 샘플 UI 제작
codex(단이·2차) · 2026-11-18 12:24 KST · 진행 / 제안(검수 대기)
지시: 로얄매치도 같은 방법으로 제작, 샘플 데이터.
영상56.95초/504×894. 원본읽기만·분석과제품분리. native별도 workspace 등록 예정. 기존샘플/서버변경0.

## 중간 갱신 · 2026-11-18T13:26 KST

원본 114프레임/대표14화면 조사서·샘플 표시값·공통 토큰·연결 계획 작성. 실제 native 저장 r29 / 3화면 / 88부품 / 1전이. 로비·레벨 준비·퍼즐 순서 조립 중이며 목표14화면 전체 완성 아님.

실제 입력은 AX setValue→Tab→재표시→저장값 확인. locator.fill의 이름/문구/이미지 경로 미반영을 확인해 해당 방식으로 제작 완료를 판정하지 않음. 공통규격 main214×100은 일반240×80 상태원화 contain 비율과 달라 전용 원화로 보정. 1차 공통HMR 대기 후 완료통지받아 재개.

## 중간 갱신 2026-11-18T14:54 KST

실제 native r101 / 14화면 / 456부품 / 41연결. 14화면은 틀 생성 수이며 순위표·공간·팀 본문은 이어 제작합니다. 상점 scroll-y client590/scrollHeight616, 직접 wheel후scrollTop0→25 확인. 설정 선택형 토글에서 첫 클릭후음악 손잡이왼쪽/회색, 나머지3개오른쪽/초록 확인. 전체검수 아님.

## 샘플 조립 결과 · 2026-11-18 17:05 KST

작성 codex(단이·2차) · 제안(검수 대기). 지시 원문: 「로얄매치도 같은 방법으로 제작해봐..」「샘플 데이터」. 다음 직접 지시 「킹샷은 지금꺼 끝나면 바로 진행해」.

### 결과와 바꾼 것

독립 samples/royal-match의 native 설계 ux-9f500ab8, workspace-fd5ecb11-2d17-4d9f-b610-f8989abc9fd4, r194. 14화면·573부품·42전이. 로비/레벨 준비/퍼즐 스틸/별/킹스컵/프로필/무료 생명/순위표/공간/팀/수집/설정/상점/복귀 선물 본문까지 조립했습니다. 화면 틀 수와 원본 디자인 동등 판정은 구분합니다.

- 원화·밑판·아이콘·퍼즐 스틸은 새로 제작했습니다. 분석 캡처는 제품 이미지로 쓰지 않았습니다. 168개 생산 역할 중 native 등록 참조116개, 실패/미사용 원화 보존. 글자·수량·가격·입력·프레임은 native 부품입니다.
- 하단5메뉴/선택 메뉴 확대/알림/밑판 순서, 메인214×100 정상·눌림, 토글, 팝업 닫기, 세로 목록, 공통 앵커를 적용했습니다. 복사 이름0. 연결은 ID를 유지했습니다. 외부에서 설계 JSON 수정/주입하지 않았습니다.
- 없던 docs/ui 조사서·표시값·규격·연결 계획·제작 가이드·실제 저장/검수 기록을 추가했습니다. 다른 AI용 PRODUCTION_GUIDE.md/production-guide.html와 AGENTS에 방법·실수를 기록했습니다. native 내보내기3종은 exports/native-r194/입니다.
- 실제 프로젝트 폴더 → 로얄 매치 조사서 보기 → Royal 정적 뷰어에서 14제작화면/가이드/데이터/검수 링크 확인. 공통 등록은1차 담당, 이번 창은 Royal 전용 reference 폴더만 반영했습니다.

### 읽은 원본

사용자 영상 /Users/max/projest_max/영상작업 모음/로얄매치.mov, 56.95초/504×894, SHA e3cf66330e843da6c2a1c345ac4f8bcedeb137a10393d99c2a31447f7dc53308. 2fps114장·scene-cut36장·대표14장·온보딩1장 보존. source.json/scene-cuts/times.json/ui-inventory.json 참조. 상위 AGENTS/공통 .35와1차 .36 안내, Capy r90 실제 부품·연결 데이터, native schema4/저장 계약을 대조했습니다. sample-reference-data.json이 실제 비교 데이터입니다.

### 실제 확인

- audit_sample.py: 설계453,798bytes<2,000,000, 이미지 최대284,510bytes<300,000, 누락자원0/SHA불일치0/잘못된부모0/없는연결대상0. native 내보낸 JSON과 저장본 구조적 동일.
- r194 preview.html: 5하단 이동+7팝업 열기/닫기+레벨 플레이→퍼즐, 13주요 시나리오 통과. 42전이 전수 조작 검수라고 확대하지 않습니다.
- CSS1440×900/430×843: 5페이지+7팝업 및 퍼즐 확인, 이미지누락·문서가로넘침0. 실제 CSS 실측으로 보정했고 viewport reset. 기기390×844는 폭504 유지로 논리504×1091이며, 최종 r194 native 선택 미리보기14화면에서 깨진이미지/텍스트가로넘침0. 최종 캡처는 final390-*; JPG물리픽셀은 evidence-manifest.json에 분리.
- Escape 설정 닫기/Enter 별 계속 닫기 통과. 음악 false/normal-off와 true/selected-on의 서로 다른 SHA 확인. 목록 native 버튼 드러내기에서 상점 scrollTop0→26.25, 공간0→812.5. PageDown은 tabIndex=-1에서 안 움직여 키보드 스크롤 통과로 세지 않았습니다. 이전r101 wheel 검사와 구분합니다.
- HTML4개의 상대 링크/자원 누락0, 문서·내보내기 JSON 파싱 통과. Python 작업파일4개 문법검사 통과. 최초 py_compile은 기본 Mac 캐시 쓰기 제한으로 실패, 자기 작업 폴더의 PYTHONPYCACHEPREFIX로 재검사 통과. 앱 빌드/공통 전체회귀는 이번 창에서 실행하지 않았습니다.

### 실수 교정과 미확인

아바타 왕관/털→매끈한 보라 괴물v003, 목표 우체통→하트봉투, 프로필 완성공간3→2, 왕의→왕자의 보물, 왕 컵 회색수염/보라옷 보존, 반색띠 밑판→연속 그라데이션, 하단 밑판 맨뒤/닫기 맨앞, 복제 카드 재부모/로컬좌표, 부모 없는 외부 장식 클릭차단→표시전용, 비동기 등록 캐시 오참조→기대 SHA option·저장참조 대조, type=color 입력, 시간초과 뒤 실제 저장 여부 확인을 가이드에 남겼습니다.

- Welcome 자동 진입 미연결. 선택 화면 내용/입력은 확인, Collect→Lobby 저장 연결만 있고 실행 왕복 미검수. 영상에 없는 로비 버튼을 추가하지 않았습니다.
- 선택 토글 위 hover가 normal-off를 먼저 보이는 공통 fallback 제한을1차에 공유. 포인터가 벗어난 on/off는 정상. 공통 수정 후 별도 갱신 예정입니다.
- 실게임/지급/결제/계정/외부지원/친구·팀 통신 제외. 미관찰 목적지·결과는 창작하지 않았습니다. 대체 폰트/디자인 동등 검수 대기/단계 기준판 미보존.
- 모노r354 SHA 236750b8fe6874ae32a6783cc3bd927f0f15bd92bc75b0daa87cc6f076ff9b91, 카피r90 SHA ca20064b6851e08c1acaa265e6482741baf0a9c33ddec7b98940fb790a1a1031 시작·끝 동일. 초기에 nested Capy/ui-studio 작업공간 선택 이력은 있으나 저장하지 않았습니다.
- 이번 창 공통JS/CSS/호스트/7007/LSB/서버재시작/빌드/예약/다른 담당 수정0, 커밋0. 1차의 홈 개선/hover 후보/Clash 제작과 구분합니다. 공유 Graphify 지도는 새 native 샘플/정적 문서 전체를 포함하지 않으며 최신으로 자칭하지 않습니다.

### 백업·증거·다음

native designs/backups/ revision별 보존. 루트 docs/planning/_backup/20261118_단이/royal_native_r36/, royal_native_r118_before_color/, royal_final_docs_20261118_165639/ 및 실패 원화 보존. 증거 samples/royal-match/docs/evidence/20261118-royal-match/. 뷰어 /ui-studio/source/guide/reference/royal-match-video-20261118/index.html.

판단 필요: 디자인 동등 검수와 Welcome 시작 훅. 공통 hover 결과 후속 기록 후, 현중 지시대로 다음 제작 단위는 독립 킹샷 샘플입니다.


## 공통 hover 해결 후속 · 2026-11-18 17:06 KST

1차 button-state.mjs:87 최소 수정 및 관련56/56·전체685/685 통과 보고(이번 창 실행 아님)를 받았습니다. Royal r194 실제 hover 유지 false/off SHA2805c9…→true/on SHA602f6e… 전환을 확인하여 기존 hover 제한을 해결로 정정합니다. native 설계/데이터 변경0. 증거 docs/evidence/20261118-royal-match/hover-after-common-fix.json/.jpg. Royal 조립 결과는 제안(검수 대기), Welcome 자동 진입 미연결은 유지. 현중 직접 요청에 따라 다음 킹샷으로 전환합니다.
