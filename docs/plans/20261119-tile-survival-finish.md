# 타일 서바이벌 31종 제작·검수 마무리 계획

상태: 현중 직접 진행 승인 · 제안(검수 대기) · 2026-11-19 08:32 KST

지시: “그럼 진행하고 진행 또 안한게 있으면 검수해서 마무리해”. 타일만 진행하며 2차/다른 샘플은 수정하지 않습니다. 기존 계획 docs/plans/20261118-tile-survival-sample.md와31종 카탈로그가 기준입니다.

## 완료 기준

31분류 각각에 실제native화면·계층/규격·분리그림/텍스트·입력/상태·출처가 있어야 합니다. 원본관찰기반 연결/닫기·복귀,저장/재열기,모바일·데스크톱과자원/넘침을 확인하고 없는진입·게임API/3D는미확인으로분리합니다. 전체스크린샷붙임·명세만·빈틀을완성으로세지않습니다.
원본/실패/전후 revision·캡처·백업을보존하고 가이드/카탈로그에경험을갱신합니다. 세표현전환을제작단계완료로세지않으며 사용자최종승인을자칭하지않습니다.

## 실행 순서

- 기존r63/4화면/219부품/5연결 보존·31대상명세 대조.
- 하위A/B 원본15+12가족 명세,하위Art새원화 준비,본체nativeUI단일조립.
- TS09/22/26/19 우선으로 구역·계층→그림/문자→상태·연결→저장/캡처. 이후가족군별같은과정.
- 기존4화면 입력/상태·빈연결·가이드/크기·글자·자원·스크롤을재검수.
- 31화면별묶음/개별 실제보기·연결/저장재열기·정적모델/자원검토→가이드/목록최신화.
- 본체최종검토+독립검토 지적해결→검수통과/미확인/남은외부연동을구분해보고.

## 제약·판단

Ruling: 비Git 독립프로젝트이고 실제native단일작업공간이므로 worktree/커밋 대신수정전백업·revision·파일hash로보존합니다. 비용: 분기단위되돌림대신명시백업복구필요.
Ruling: 같은브라우저/native설계를여러하위가동시수정하지않습니다. 하위는읽기명세·새그림만독립처리합니다. root는UI입력으로만저장모델을변경합니다.
저장설계/프로젝트메타JSON외부주입0,원본읽기전용,보호파일/7007/서버재시작·빌드/새패키지/자동화/다른채팅발송0. 제품기능부족이실제드러날때만범용최소소스수정/백업/시험/GUI재검수.

## 31종 추적표

|ID|판틀|시작 상태|이번 결과|
|---|---|---|---|
|TS01|타이틀 / 로딩|specified-only|대기|
|TS02|게임 이용약관|specified-only|대기|
|TS03|영지 / 월드 공통 HUD|partial-native|대기|
|TS04|스토리 / 주민 대화|specified-only|대기|
|TS05|건물 내부 / 가구 선택|partial-native|대기|
|TS06|튜토리얼 대응 방식 2택|specified-only|대기|
|TS07|건물 업그레이드 조건|partial-native|대기|
|TS08|습격 예고 / 이동 안내|specified-only|대기|
|TS09|챕터 미션 노트|specified-only|대기|
|TS10|일반 건물 업그레이드 성공|specified-only|대기|
|TS11|발전소 레벨 증가 기록판|specified-only|대기|
|TS12|지휘관 정보 편집|specified-only|대기|
|TS13|생존자 파견|specified-only|대기|
|TS14|생존자 수용|specified-only|대기|
|TS15|근거지 편지함|specified-only|대기|
|TS16|주민 자원 교환|specified-only|대기|
|TS17|챕터 완료 보상|specified-only|대기|
|TS18|신규 챕터 소개 카드|specified-only|대기|
|TS19|소대 설정 / 출전|specified-only|대기|
|TS20|전투 HUD|specified-only|대기|
|TS21|전투 승리 / 통계|specified-only|대기|
|TS22|영웅 모집|specified-only|대기|
|TS23|신규 영웅 해제 소개|specified-only|대기|
|TS24|모집 결과 / 재모집|specified-only|대기|
|TS25|영웅 보유 목록|partial-native|대기|
|TS26|영웅 상세 / 성장|specified-only|대기|
|TS27|신규 기능 해제 배너|specified-only|대기|
|TS28|친밀도 상승 보상|specified-only|대기|
|TS29|채팅|specified-only|대기|
|TS30|생존자 도감|specified-only|대기|
|TS31|생존자 프로필 / 이야기|specified-only|대기|
