# 타일 서바이벌 native 구조 독립 검토 v001

codex(단이) · 2026-11-18T14:12:09+09:00 · 제안(검수 대기)

**r35 저장 JSON 첫 2화면 검토이며 실화면 검수가 아닙니다.**

원본: /Users/max/projest_max/ui-studio/samples/tile-survival/ui-studio/designs/ux-25ecc98a.json:1
SHA256: 8d2363d24a14456d6fd7ba40fda5a1e9c98e75430737ee6ca3991ae2a8ef36b0
읽은 시각 2026-11-18T14:12:09+09:00 / savedAt 2026-11-18T05:10:22.684Z

최초 r27·14:04:36 KST(SHA a29642f2e490efbaf2f1f64608628c15b714447e619c2c1e053034f01afc39e5)에서 Upgrade BG의 흰 헬멧 인물 image 잔여를 발견하여 본체에 먼저 전달했습니다. 아래 결과는 이번 snapshot에 한정합니다.

## 조립 잔여

- 이번 snapshot에 image+skin 동시 잔여 없음. r27 이후 저장 데이터가 정리되었다는 소스 확인이며 화면 확인은 아닙니다.

## 첫 두 화면 구조

|화면|부품|native글자|이미지|버튼|9/3slice|부모누락/순환|계산상 화면밖/부모밖|
|---|---:|---:|---:|---:|---|---|---|
|Page_TSV_Territory|19|4|11|1|2/0|0/0|0/0|
|Page_TSV_BuildingInterior|48|15|12|1|8/1|0/0|0/0|

기존 schema validator(첫 두 화면만): {'passed': True, 'scope': 'first two screens; cross-scope transitions excluded'}. 이미지 미등록 슬롯 0. 자원 17개 파일존재/SHA 문제 0, sourceSize/실제 WebP크기 불일치 0. HTTP 미검사.

## 가구 카드

|카드|부모|계산 x,y,w,h|
|---|---|---|
|Card_TSV_Furniture01|group-303c5234-25ac-4bd3-ade5-6ff538539085|[10.0, 714, 110, 170.0]|
|Card_TSV_Furniture02|group-303c5234-25ac-4bd3-ade5-6ff538539085|[130.0, 714, 110, 170.0]|
|Card_TSV_Furniture03|group-303c5234-25ac-4bd3-ade5-6ff538539085|[250.0, 714, 110, 170.0]|
|Card_TSV_Furniture04|group-303c5234-25ac-4bd3-ade5-6ff538539085|[370.0, 714, 110, 170.0]|

110×170 일치=True, gap=[10.0, 10.0, 10.0]. 부모 비율과 현재 resolveRect로 계산했으며 실측이 아닙니다.

## 명명 / native 글자 / slice / 가시범위

- 역할별 Img/Txt/BG/Btn/HUD/Card/Scene/Panel 명명을 사용합니다. 중복 이름·부모누락/순환·화면/부모 밖 계산은 JSON 목록과 위 표를 따릅니다.
- Nav Lock02 미존재는 해당 슬롯의 영웅 버튼이므로 번호만으로 결함 판정하지 않습니다.
- 수치·이름·가구 레벨점·생산량·버튼 라벨은 kind=text로 그림과 분리되어 있습니다. 실제 텍스트 맞춤과 원본서체는 미검수입니다.
- Upgrade는 source 좌우20/edge 좌우12의 3slice, 원화160×64입니다. 나머지 프레임의 9slice와 등록크기를 확인했지만 모서리 시각 품질은 미검수입니다.
- 카드가 정적 그룹이며 스크롤/입력 예시가 아직 없는 것은 조립 잔여이며 제품결함으로 확대하지 않습니다.
- targetGraphic=self는 자식 글자까지 tint 영향을 주는 지원 방식이며 원하는 눌림 표현인지는 후속 화면 검수 항목입니다.

## 조립 잔여 / 미확인


### territory

- Quest strip/progress, gem wallet/badge, clock/meal and contextual/event entries beyond saved parts
- World action markers, tutorial examples, Heroes/outside destinations and screen wiring

### building

- Current 4 static cards still need selected/unlocked/cost/growth variants and input examples
- If additional cards are authored, decide horizontal rail/scroll; absence is unfinished scope, not a product defect
- Resource/building data variants, return/help behavior and screen wiring

### visualQA

- Browser/keyboard/390/430/1440, clipping, HTTP asset loading, text fit and state/transition behavior not checked
- Source font/material/pixel equivalence and actual game/3D calculations not checked
- Upgrade targetGraphic=self is supported whole-wrapper tint including child text; verify desired pressed appearance later

## 보존 / snapshot 경계

- 신규 조건창은 bootstrap/사본 image+skin 잔여만 검색했습니다(0건). 창의 전체 미조립 상태는 결함으로 평가하지 않았습니다.
- 종료 재읽기 r35 / SHA 8d2363d24a14456d6fd7ba40fda5a1e9c98e75430737ee6ca3991ae2a8ef36b0 / 분석 중 변경=False. 본체의 동시 native 저장과 구분합니다.
- 수정은 scratch/catalog의 native-review-v001.md/json만입니다. 저장 JSON·제품 소스·다른 샘플·공용 보고/STATUS·서버·브라우저 변경0.
- 구조 검사 결과를 실화면 통과나 제작 완료/승인으로 사용하지 않습니다.
