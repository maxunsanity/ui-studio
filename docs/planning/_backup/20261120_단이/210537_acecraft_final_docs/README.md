# ACECRAFT UI sample

**상태: r34 · 15/20보드 부분 작성 / 최종 확인 대기.** 본체가 전달한 중간 저장 기준입니다. 전체20보드 완성·최종 저장/재열기·연결·실제 화면·사용자 승인은 아직 확인하지 않았습니다. 최종 실적은 본체가 실제 결과로 갱신합니다.

공식 게임명은 **ACECRAFT**입니다. 원본의 SP Explorer Joey / Special Recruit / Overdrive Tickets가 [공식 App Store 이벤트](https://apps.apple.com/es/app/acecraft/id6499112583?eventid=6827963235) 문구와 일치해 식별했습니다. 별도 게임 구현이 아닌 영상 UI 분석과 native sample 조립 작업입니다.

## 바로 보기

- [현재 sample 제작 규칙 · AI_GUIDE 끝의 ACECRAFT 전용 추가절](ui-studio/guide/AI_GUIDE.md)
- [도구에서 제공하는 분석 갤러리](http://127.0.0.1:7018/ui-studio/source/guide/reference/acecraft-video-20261120/index.html)
- [분석 문서 정본](../../docs/reference/acecraft/index.html) · [분석 데이터](../../docs/reference/acecraft/data.json)
- [UI 스튜디오 전체 캔버스](http://127.0.0.1:7018/ui-studio/?workspace=workspace-457652ed-0c01-4aec-bd2d-060a999c1178&project=ux-96eff1ad)
- [저장 sample 보기](http://127.0.0.1:7018/ui-studio/preview.html?workspace=workspace-457652ed-0c01-4aec-bd2d-060a999c1178&project=ux-96eff1ad)

Workspace는 workspace-457652ed-0c01-4aec-bd2d-060a999c1178, project는 ux-96eff1ad입니다. 링크에 두 ID를 명시하며 기본 시작 화면의 다른 검수판으로 대신하지 않습니다. 위 링크를 문서에 기록한 것과 실제 브라우저에서 통과한 것은 구분합니다.

## 원본 영상2개

|영상|로컬 원본|길이|논리 화면|
|---|---|---|---|
|A|[화면 기록 2026-11-19 오후 1.41.20.mov](</Users/max/Desktop/화면 기록 2026-11-19 오후 1.41.20.mov>)|113.08초|420×924|
|B|[화면 기록 2026-11-19 오후 1.43.19.mov](</Users/max/Desktop/화면 기록 2026-11-19 오후 1.43.19.mov>)|33.505초|420×924|

원본 mov는 읽기 전용입니다. 파일명 시각과 영상 프레임 시점은 별도이며 갤러리에 요청·실제 디코딩 시점을 구분했습니다. A의1초 표본114장, B의1초 표본34장과 보조42장을 분석했고 오디오는 분석하지 않았습니다. 짧은 전환은 빠졌을 수 있습니다.

## native 제작과 추정의 경계

- 계획은 로비 포함20대표 보드(페이지11·팝업9)이며, 계획 수와 현재15부분 작성 실적은 다릅니다. 갤러리의 ‘본체확인대기’도 제작 완료를 뜻하지 않습니다.
- 프레임·glyph·새 원화·native 문구·가격/수량·입력 root를 분리하고 실제 툴의 정상 UI로 조립합니다. 저장 JSON·모델·iframe 메시지 주입으로 조립을 대신하지 않습니다.
- 원본 캡처는 분석 문서에서만 봅니다. runtime에 원본 전체 화면이나 잘라낸 UI를 넣지 않습니다.
- 그림은 새로 만든 근사 제안입니다. 토끼 복장·곰/비행기 포즈·초상·일반 기호·상자 대체가 원본과 다르며 원본 캐릭터/품목의 동일 복제를 주장하지 않습니다.
- 부모·앵커·같은 역할 규격·버튼 상태·투명 no-skin 입력·이미지 source 대기 후 crop·scroll-y와 반복행 축약은 AI_GUIDE 전용 추가절을 따릅니다.
- 관찰한 문구·수치와 추정·미확인을 나눕니다. 통화 이름·가려진 수량·보이지 않은 목적지·확률·발란스를 창작하지 않습니다. 친구 이름은 가상 제안입니다.
- Medal은 Tempus의 내용 변형, 전화/다이얼은 연출 분석, 보상 슬롯 수·포즈·카운터·같은 상품 스크롤은 같은 구조의 상태로 묶었습니다.
- 가격·Go·Claim·Recruit는 UI 역할입니다. 실제 결제·IAP·계정 재화 변경·게임 엔진 모집/보상은 구현하거나 실행하지 않습니다.

## 남은 확인

본체는 실제20보드 여부와 저장 revision·ID, 재열기, 입력/닫기/복귀·스크롤, 이미지404·넘침·가격/글자, 1440 데스크톱·430 모바일 표시를 확인한 뒤 최종 가이드와 개발 상태를 갱신합니다. 현재 문서 작성은 브라우저·모델·STATUS·project metadata·guideVersion을 변경하지 않았습니다.

작성: codex(단이) · 2026-11-20T20:21:58+09:00 · 제안(검수 대기)
