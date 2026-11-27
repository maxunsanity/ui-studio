# 와일드 캐슬 TD — 영상 UI 샘플·하단 마을·고레벨 개선

작성자 codex(단이·2차) · 2026-11-19 11:00 KST · **제안(검수 대기)**

지시 ID: **현중 직접 요청(별도 번호 없음)**. 7018 독립 샘플 **ux-957138c6 r93**, workspace **workspace-279f493b-a942-4f5a-b176-d042ea9960f2**.

## 한 줄 결과
하단 빈칸에 마을을 추가하고4개 버튼의 규격/간격/눌림을 맞췄으며, 첨부의 레벨23 HUD·거래·주변 메뉴·영웅8칸을 별도 고레벨 로비 상태로 반영했습니다. 영상6+추가상태1=**7상태/5판틀/576부품/15연결**을 native UI에서 작성·저장·재읽기·내보내고 조사서 버튼까지 실제 열었습니다.

## 지시 원문과 읽은 원본
- 「이게임도 제작해야 돼..와일드 캐슬인가..하는것 같은데..이름 조사 다시 하고 이 프로젝트도 진행을 해」.
- 후속 「하단에 하나 비워져 있는데.. 고렙 되면 조금씩 달라지긴 하네..참고해서 개선해」.
- 원본 영상: /Users/max/projest_max/영상작업 모음/KakaoTalk_Video_2026-11-19-08-27-16.mp4 . 46.43초/1080×2340/30fps, SHA972593cc74bffd99dc31c7a76801302ea39efd2a1a1183cc2f9be72b99fad6a3. 영상 전체2fps93샘플/4접촉시트/33장면후보와 안정 캡처를 확인했습니다.
- 추가 참고 원본은 reference/WC07_UserHighLevel_20261119.png에 보존했습니다. 캐슬Lv18/4100,궁수Lv41/4600/6.4,레벨23/HP1150/MP220 등은 관찰 표시값이고 해금/발란스 정책이 아닙니다.
- 공식명 **와일드 캐슬 TD - 왕국 건설 타워 디펜스 / Wild Castle: Tower Defense TD**, Funovus. https://play.google.com/store/apps/details?hl=ko&id=com.wildsky.wildcastle 및 https://www.funovus.com/games/wild-castle/ 대조. 영상 제목 화면 확인으로 표현하지 않습니다.
- 루트 AGENTS.md/README.md·협업README·현재 공통guide .39의 시작/영상/UI절, 생성된 해당 샘플 ui-studio/AGENTS.md·README.md·project.json·integration.md, 실제 KingShot r129/Royal r194 저장 구조와 sample-reference-data.json을 읽었습니다. 모델/부품/입력 검증은 최신 model.mjs·parts.mjs·main.mjs 관련 절을 확인했습니다.

## 바꾼 것과 근거
| 파일·근거 | 전 → 후 |
|---|---|
| samples/wild-castle/ui-studio/designs/ux-957138c6.json:1 | 하단 빈칸 → native 마을 버튼. 상점/마을/리플레이80×60,전투98×60,간격4px |
| 같은 native 파일:1 | 영상 저레벨만 → 추가 참고의 고레벨 로비 상태. 새 필드 정지 그림,HUD/거래/주변 메뉴/영웅8칸 |
| 같은 native 파일:1 | 화면 높이에 따라 복제 부품이 커질 가능성 → 전 화면390×780 가운데 고정 게임영역, 긴 화면은 여백 |
| 같은 native 파일·Front_WC_High_* / interaction | 앞면 그룹의 표시전용 입력으로 가운데 클릭 실패 → 그룹/내부8부품 부모전달, 버튼 전체 클릭과 왕복 재검수 |
| docs/ui/ui-tokens.json·sample-data.json·ui-inventory.json | 제작 공통 크기, 관찰 표시값,7상태/5판틀을 분리 저장 |
| docs/ui/PRODUCTION_GUIDE.md:1 및 samples/wild-castle/AGENTS.md | 새 AI가 따를 순서·native 절차·한계·실수 방지를 프로젝트 안에 기록 |
| src/tools/uxStudio/project-research.json:41 | 쓰기 권한을 받은 등록 목록 파일에 해당 샘플1항목만 추가. 기존7항목 deep equality 유지 |
| src/tools/uxStudio/guide/reference/wild-castle-video-20261119/index.html:1 | 공식명·7원본/새UI 비교·실제 유사샘플 데이터·제작가이드를 정적 뷰어로 등록 |

모든 설계 변경은 실제 Studio UI로 수행했습니다. 외부에서 native 설계 JSON을 생성/수정하거나 API/콘솔로 주입하지 않았습니다. 게임/아이콘 그림은 신규 생성, 프레임 등은 새 기하UI입니다. 원본 게임 캡처는 분석용 그림에만 있고 제작 자원에 가져오지 않았습니다. 새 생성 atlas 셀의 기계적 분리와 own geometry 조합은 원본 게임 캡처 재사용과 구분합니다.

## 이번 확인과 증거
- **저장·모델:** native r93 재열기, native JSON/기획/연결명세3내보내기. exported design과 저장본 deep equality. validator 통과. 441674B<2MB, 최대 페이지235부품<400.
- **그림:** 제작121역할SHA, 활성101참조의 등록본SHA,11normal/pressed 상태쌍의 같은 크기·다른SHA 확인. 최대287164B<300000B. source/authoring/production v001..v003 보존.
- **실제 동작:** 로비→부족안내→닫기/상점, 상점/전투 왕복, 재능/프로필 열기/닫기, 고레벨에서 열었던 상태로의 복귀를 실제 눌렀습니다. 저장15연결 전부 실제 성공 기록과 대응합니다. 반복 관찰 수를 새 단위 시험 수로 합산하지 않습니다.
- **컨트롤:** 상점 세로 목록 scrollTop0→1433.93(관찰 당시 client674/scrollHeight2108),마지막 속도 상품 접근, native 탭 Enter 선택을 확인했습니다. 이는 선택 표시이며 섹션 anchor jump/scrollspy가 아닙니다.
- **화면:** 영상6화면의 CSS1440×900 및 CSS430×843에서 넘침0/표시 이미지 누락0. 실제 캡처 파일은 데스크톱1800×1125,모바일537×1055이며 CSS와 파일 픽셀을 구분합니다. 고레벨은 상세 미리보기 CSS1440×900와 논리390×844에서 게임영역/하단 같은 행·동일 논리높이60을 확인했습니다.
- **조사서:** 파일·공유→프로젝트 폴더→와일드 캐슬 TD 조사서 보기 링크를 실제 눌러 새 뷰어 탭을 열었습니다. 7카드/14이미지/이미지누락0/가로넘침0을 확인했고 고레벨 비교 영역으로 이동해 캡처했습니다.
- **기준판:** W r9/P r76/U r93, 이전 U r82도 유지했습니다. 기준판 보존은 단계 승인/최종동등 판정이 아닙니다.
- 실행 명령: `node samples/wild-castle/_작업/codex/video01/audit_final.mjs` exit0. 이번 공통 실행 코드 변경이 없어 npm 전체시험/빌드/서버 재시작은 실행하지 않았고 과거 시험 수를 합산하지 않았습니다.
- 증거: samples/wild-castle/docs/evidence/20261119-wild-castle/ 안의 saved-model-audit.json,flow-checks.json,*-capture.json,*-context.jpg,*-native.jpg,exports/r93-*,project-folder-context.jpg,research-viewer-context.jpg,research-viewer-check.json. native-contact-r93.jpg와lobby-level-comparison-r93.jpg를 직접 시각 확인했습니다.

## 미확인·남은 범위 / 판단 필요
- **원본 시각 동등성·원본 폰트·세부 텍스처/장식은 미승인**입니다. 새 그림은 해석 시안이며 영상과 픽셀 동일을 주장하지 않습니다.
- 마을/거래/메일/주변메뉴/이름수정/설정/결제 내부는 자료가 없어 만들지 않았습니다. 해당 버튼은 눌림만 제공합니다. 실제 전투·성장·해금·잔액·구매는 구현하지 않았습니다.
- 상점의 골드 직접 점프/스크롤 추적, 다른 재능 선택의 설명 갱신, 초상 선택의 프로필 실제 적용은 미구현입니다. 기본 관찰 선택 표시를 유지합니다.
- native audit97은 **눌림 전용96개 + 진입 링크 없는 고레벨 관찰상태1개**입니다. 모달 닫기 누락은 없습니다. 경고를 감추려고 없는 게임 목적지를 만들지 않았습니다.
- 고레벨 상태는 전체 캔버스에서 명시 선택합니다. 독립 동작 preview는 시작 로비로 돌아갈 수 있으므로 screen 쿼리만 보고 상태를 단정하지 않습니다.
- 고레벨 상태의 독립 CSS430 preview는 제공 표면 제약으로 확인하지 않았고, 상세 논리390×844와 동작시험으로 구분 검수했습니다. 사용자 최종 판단은 아트/배치 시안 검수입니다.

## 협업·손대지 않은 것
1차에 등록 요청을 먼저 전달했고 응답 전 마지막 등록 목록1파일 쓰기 권한을 받아 백업/중복확인 후 직접 추가했습니다. 뒤이어 중복 실행하지 말라는 완료 전달을 보냈습니다. 1차의 실제 확인 회신 수신으로 표현하지 않습니다. 다른 샘플/공통 실행 코드/7007/기존 서버/의존성/예약/원본은 이번 창에서 수정·빌드·재시작하지 않았습니다. 지도 대상 import/export 연결 변경은 없습니다. 커밋하지 않았습니다.

## 백업과 인계
문서/등록 목록은 docs/planning/_backup/20261119_단이/wild-castle-*에, 이번 보고 교체 전 사본은 docs/planning/_backup/20261119_단이/wild-castle-final-report-110019에 보존했습니다. native W/P/U와 새 그림/원본/미채택판도 남아 있습니다. 작업 보조/현재 인계는 samples/wild-castle/_작업/codex/video01/입니다. 관찰 캡처→UI 목록/표시값→native 저장→실검수→조사서가 연결됩니다.

## 바로 열기
- 고레벨 캔버스: http://127.0.0.1:7018/ui-studio/canvas.html?workspace=workspace-279f493b-a942-4f5a-b176-d042ea9960f2&project=ux-957138c6&screen=screen-6d58551d-7afc-4e5c-a3e4-c1273236db0a&view=ui
- 조사서/가이드: http://127.0.0.1:7018/ui-studio/source/guide/reference/wild-castle-video-20261119/index.html
