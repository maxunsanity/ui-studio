# 케이팝몬스터즈 UI 인수인계

codex(단이) / 2026-11-19 / 제안(검수 대기)

## 정본
- 프로젝트: 케이팝몬스터즈 / 설계: 케이팝몬스터즈 UI / r52.
- 폴더: /Users/max/projest_max/ui-guideline-israt/ui-studio (물리 경로 유지).
- workspace-cfa517bd-d9e1-40c4-aa1f-576e182500ba / ux-31671dd8.
- 7018 독립 UI. 실제 게임 소스 연결은 미실행. 기존 guideVersion .35 유지.
- r51에서 이름/revision/savedAt만 변경. 기존 screens/transitions/fixtures 동일.

## 현재 화면
| 화면 | 요소 수 |
|---|---:|
| G1_Ingame | 147 |
| Ref_MonopolyGO_Main | 4 |
| Ref_CapybaraGO_Lobby | 4 |
| G1_Lobby | 18 |
| Modal_CharacterInfo | 15 |
| Page_Relation | 2 |
| Page_Crew | 2 |
| Page_MonsLobby | 2 |
| Page_MyAlbum | 2 |
| Page_Festival | 2 |
| Modal_ShieldInfo | 5 |
| G1_Ingame_Moving | 162 |

총12화면/365요소/16연결. 이 중2개는 외부 샘플의 배치 참고이며 게임 완성 페이지 수가 아닙니다.

## 습득한 구조와 규칙
- 기본390x844. 인게임: 게임영역699 / 액션77 / 하단68px, 상단50px는 오버레이.
- 상단 프로필/컨디션(프로필 자식)/팀명/등급/나쁜 기운/엔터파워/팬/설정.
- 필러 위 띠: 돈170 / 주사위84 / 방패와 몬스96, 간격과 패딩6.
- 좌우 레일 각5개: 아이콘/이름/시간/배지 분리.
- 하단6개: 포토카드/스케줄/건설/미션/상점/정보. 동일 부모 규격 유지.
- Moving은 필러를 줄이고 보드를 키운 상태안. 게임영역697/액션77/하단70으로 기본과 차이 있음.
- 부모 기준 좌표와 루트 좌표 구분. stable ID/부모/연결 유지.
- 새 그림은 다시 제작하고 입력/텍스트/원화/엔진 그림자 분리. 동일 역할은 공통 규격 적용.
- 편집은 실제 툴에서. 일반 입력은 Tab/blur 확정 뒤 저장/재열기 검증.
- 가이드에 포함된 다른 샘플 이력과 시험 수를 이 프로젝트 진척으로 쓰지 않음.

## 미완료와 주의
- G1_Lobby는18요소의 공간 배치안. 인게임147요소처럼 상세 제작된 상태가 아님.
- 관계/크루/몬스 로비/내 앨범/페스티벌은 제목과 복귀 버튼 각2개뿐. 본문 UI 미제작.
- Menu_AlbumFestival/ShieldMons/Settings/Info는 x128.205%로 화면 밖에 있음. 이전 기록의 수동 펼침 캡처와 실제 탭 자동 펼침을 구분.
- 프로필/아이돌은 같은 캐릭터 모달로 연결. 개별 탭 자동 선택 구현 미확인.
- Moving은 들어오는 연결1개, 나가는 연결0개. 결과와 복귀 흐름 미완성.
- 기본 인게임 액션영역은 비어 있는 배치가 남음. Moving의 버튼 상태안과 구분.
- 상세 편집 누락 점검39건 표시. 버튼 눌림/전수 이동/닫기/복귀는 이번 검수 안 함.
- 예시 수치10,000,000/50/20/80은 실제 발란스 승인값 아님.

## 저장 연결
- 프로필 → 캐릭터 정보창 팀 탭 / open
- 아이돌(멤버) → 캐릭터 정보창 개별 탭 / open
- 관계 전체 화면 / navigate
- 응원 크루 전체 화면 / navigate
- 방패 설명 팝업 / open
- 몬스 로비 전체 화면 / navigate
- 내 앨범 전체 화면 / navigate
- 페스티벌 전체 화면 / navigate
- 캐릭터 정보창 닫기 / close
- 방패 팝업 닫기 / close
- 관계에서 로비로 / back
- 크루에서 로비로 / back
- 몬스 로비에서 로비로 / back
- 내 앨범에서 로비로 / back
- 페스티벌에서 로비로 / back
- 주사위 굴리기 → ① 이동 중 / navigate

## 확인 근거와 범위
- 프로젝트 AGENTS/README, AI_GUIDE 최신 .34/.35 및 공통 제작 절차, EXISTING_GAME 독립 규칙, integration, project metadata 확인.
- 제나 r41-r50 STATUS 기록과 저장 r51 전체 화면/요소/연결 대조. 최신 Moving 추가 확인.
- 실제7018 홈→내 작업→전체 캔버스→상세 편집→설계명 입력→파일 저장→홈 재진입 확인.
- 프로젝트 표시명 변경 UI가 없어 project.json.name만 백업 후 수정. 설계명은 실제 편집기에서 변경/저장.
- 이름 변경 전후 화면/요소/연결/fixture 동일 검사 통과. 16연결 출발 요소/대상 화면 정적 참조 유효.
- UI 배치 변경 없음. 반응형 재검수/게임 실행/7007/서버 재시작/자동화 실행 없음.
- 독립 폴더에 Graphify 지도 없음. 관련 파일 직접 조회. 코드 연결 변경 없어 지도 갱신 대상 없음.
- 백업: /Users/max/projest_max/ui-studio/docs/planning/_backup/20261119_단이/1406_kpop_rename_handover
