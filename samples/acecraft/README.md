# ACECRAFT UI sample

**상태: r45 · 대표20보드 / 800부품 / 29연결 저장·재열기 확인 · 제안(검수 대기).** 2개 영상에서 고른 UI 샘플이며 전체 게임·원본 시각 동등성·사용자 승인을 뜻하지 않습니다.

공식 게임명은 **ACECRAFT**입니다. 원본의 SP Explorer Joey / Special Recruit / Overdrive Tickets가 [공식 App Store 이벤트](https://apps.apple.com/es/app/acecraft/id6499112583?eventid=6827963235) 문구와 일치해 식별했습니다. 별도 게임 구현이 아닌 영상 UI 분석과 native sample 조립 작업입니다.

## 바로 보기

- [현재 sample 제작 규칙 · AI_GUIDE 끝의 ACECRAFT 전용 추가절](ui-studio/guide/AI_GUIDE.md)
- [도구에서 제공하는 분석 갤러리](http://127.0.0.1:7018/ui-studio/source/guide/reference/acecraft-video-20261120/index.html)
- [분석 문서 정본](../../docs/reference/acecraft/index.html) · [분석 데이터](../../docs/reference/acecraft/data.json)
- [UI 스튜디오 전체 캔버스](http://127.0.0.1:7018/ui-studio/canvas.html?workspace=workspace-457652ed-0c01-4aec-bd2d-060a999c1178&project=ux-96eff1ad)
- [저장 sample 보기](http://127.0.0.1:7018/ui-studio/source/sample-preview.html?workspace=workspace-457652ed-0c01-4aec-bd2d-060a999c1178&project=ux-96eff1ad)

Workspace는 workspace-457652ed-0c01-4aec-bd2d-060a999c1178, project는 ux-96eff1ad입니다. 링크에 두 ID를 명시하며 기본 시작 화면의 다른 검수판으로 대신하지 않습니다. 위 링크를 문서에 기록한 것과 실제 브라우저에서 통과한 것은 구분합니다.

## 원본 영상2개

|영상|로컬 원본|길이|논리 화면|
|---|---|---|---|
|A|[화면 기록 2026-11-19 오후 1.41.20.mov](</Users/max/Desktop/화면 기록 2026-11-19 오후 1.41.20.mov>)|113.08초|420×924|
|B|[화면 기록 2026-11-19 오후 1.43.19.mov](</Users/max/Desktop/화면 기록 2026-11-19 오후 1.43.19.mov>)|33.505초|420×924|

원본 mov는 읽기 전용입니다. 파일명 시각과 영상 프레임 시점은 별도이며 갤러리에 요청·실제 디코딩 시점을 구분했습니다. A의1초 표본114장, B의1초 표본34장과 보조42장을 분석했고 오디오는 분석하지 않았습니다. 짧은 전환은 빠졌을 수 있습니다.

## native 제작과 추정의 경계

- 로비 포함20대표 보드(페이지11·팝업9)를 정상 UI로 저장했습니다. 같은 틀의 변형·연출과 반복 목록 전체는 별도 분석/축약 범위이며, 20이라는 수가 전체 게임 완성률은 아닙니다.
- 프레임·glyph·새 원화·native 문구·가격/수량·입력 root를 분리하고 실제 툴의 정상 UI로 조립합니다. 저장 JSON·모델·iframe 메시지 주입으로 조립을 대신하지 않습니다.
- 원본 캡처는 분석 문서에서만 봅니다. runtime에 원본 전체 화면이나 잘라낸 UI를 넣지 않습니다.
- 그림은 새로 만든 근사 제안입니다. 토끼 복장·곰/비행기 포즈·초상·일반 기호·상자 대체가 원본과 다르며 원본 캐릭터/품목의 동일 복제를 주장하지 않습니다.
- 부모·앵커·같은 역할 규격·버튼 상태·투명 no-skin 입력·이미지 source 대기 후 crop·scroll-y와 반복행 축약은 AI_GUIDE 전용 추가절을 따릅니다.
- 관찰한 문구·수치와 추정·미확인을 나눕니다. 통화 이름·가려진 수량·보이지 않은 목적지·확률·발란스를 창작하지 않습니다. 친구 이름은 가상 제안입니다.
- Medal은 Tempus의 내용 변형, 전화/다이얼은 연출 분석, 보상 슬롯 수·포즈·카운터·같은 상품 스크롤은 같은 구조의 상태로 묶었습니다.
- 가격·Go·Claim·Recruit는 UI 역할입니다. 실제 결제·IAP·계정 재화 변경·게임 엔진 모집/보상은 구현하거나 실행하지 않습니다.

## 검수와 남은 경계

- 저장 파일 r45 재열기, 시작 화면 acecraft 샘플 카드→전체 캔버스20 진입을 확인했습니다.
- CSS1440×900·430×843에서20화면씩 표시/가로넘침/일반 이미지 로딩 확인,390×844·430×932 기기보기와 로비3표현 전환을 확인했습니다. 논리 크기와 캡처 픽셀을 구분합니다.
- 로비→메뉴→우편/친구→닫기/메뉴 복귀,이벤트→미션→복귀,상점 탭/Back,Enter·Space·Escape와초점복귀,파일럿목록57.5px scroll을 실제 UI에서 확인했습니다.
- 29연결을 모두 실행한 것은 아닙니다. 단독 팝업 sample/미리보기는 의도적으로 정적이며 PackBuy→Confirm은 저장 연결만 확인했습니다. 대응 입구/실결제/추첨·지급 결과와 미확인 목적지는 미연결 또는 동작 미검수로 둡니다.
- 새 그림/초상·상품 proxy,원본폰트/세부9slice 경계/게임 동등성,상점 일부 상품과 마일스톤 반복행 축약,기기 전체/모든 입력상태는 미완료 또는 미검수입니다.
- 근거: [작업 보고](../../docs/collaboration/reports/20261120_ACECRAFT_영상UI샘플.md), [실제 캡처](../../docs/evidence/20261120-acecraft/), [가이드](ui-studio/guide/AI_GUIDE.md).


작성: codex(단이) · 2026-11-20T20:21:58+09:00 · 제안(검수 대기)
