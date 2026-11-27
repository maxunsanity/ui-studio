# 타일 서바이벌 native 독립 구조 검토 v002

codex(단이) · 2026-11-18T14:51:01+09:00 · 제안(검수 대기)

**저장본 r57 · 4화면 219부품 5연결의 구조 검토입니다. 실화면 검수/전체 동등 판정이 아닙니다.**

원본: /Users/max/projest_max/ui-studio/samples/tile-survival/ui-studio/designs/ux-25ecc98a.json:1
SHA256: 8bfa6e4dfe83b130d12f613d757f8d31c6c6d8e18c8e4dce4d161467bd70e60e
savedAt: 2026-11-18T05:44:33.147Z

## 결과 / 같은 규격

기존 schema validator={'passed': True}. duplicate ID=0, kind=text 빈 글자=0, image+skin 동시잔여=0.
자원 47개 파일존재/SHA 문제=0, sourceSize/WebP실제크기 불일치=0. HTTP/브라우저 로딩 검사는 하지 않았습니다.

|화면|부품|native글자|버튼|9/3slice|부모누락/순환|viewport밖|부모밖|engine shadow|
|---|---:|---:|---:|---|---|---:|---:|---:|
|Page_TSV_Territory|50|9|2|9/0|0/0|0|2|0|
|Page_TSV_BuildingInterior|48|15|1|8/1|0/0|0|0|0|
|Modal_TSV_BuildingUpgrade|43|17|1|4/1|0/0|0|1|0|
|Page_TSV_Heroes|78|14|2|18/1|0/0|0|0|0|

nav 6슬롯84×64=True, 가구4개110×170=True / gap=[10.0, 10.0, 10.0].
영웅11카드111×180=True, 가로gap=[8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0], 세로gap=[10, 10.0].

가구/hero 치수와 간격은 제작규격이며 원본 영상의 실측 값이 아닙니다. 부모·현재 resolveRect·RectTransform을 사용한 504×894 계산이며 실제 화면 측정이 아닙니다.

## 범위 / 의도된 돌출

- Page_TSV_Territory / BG_TSV_Territory_BuildingLevel: review intended label extension; inside viewport · delta={'left': 70, 'top': 142, 'right': -86.0, 'bottom': 6} · viewport 안. 정확 ID와 box는 JSON.
- Page_TSV_Territory / Txt_TSV_Territory_BuildingLevel: review intended label extension; inside viewport · delta={'left': 70, 'top': 142, 'right': -86.0, 'bottom': 6} · viewport 안. 정확 ID와 box는 JSON.
- Modal_TSV_BuildingUpgrade / Txt_TSV_Upgrade_New: parent-approved NEW top -2 overflow · delta={'left': 15.0, 'top': -2, 'right': -69.0, 'bottom': -111.0} · viewport 안. 정확 ID와 box는 JSON.

NEW의 부모 위2px는 본체가 명시한 의도된 돌출입니다. 영지 건물선택 영역의 Level_BG/Txt는 부모 밑6px가 더 나오지만 504×894 화면 안이며 잘림/터치 여부는 화면 검수 대상입니다. 같은 현상을 무조건 제품결함으로 판정하지 않습니다.

## 누락 검사2건 원인

- Modal_TSV_BuildingUpgrade의 닫기/복귀가 없습니다. → audit() only counts explicit close transitions; confirm navigate→main clears overlays and Escape policy exists. Not proof of absent return.
- Btn_TSV_Heroes_Recruit의 행동이 없습니다. → Recruit remains enabled action input without transition; recruitment screen unassembled. This is real assembly remaining, not product defect.

원본에 없는 X/Back을 audit 숫자0만 만들려고 추가하지 않습니다. 실제 부모 입력래퍼가 비어 있어도 자식 그림/텍스트가 있으면 정상 구조이며, 이번 kind=text의 빈 글자 수는 위와 같습니다.

## 연결 / 모델 함수 확인

- Page_TSV_BuildingInterior / Btn_TSV_Building_Upgrade → open / Modal_TSV_BuildingUpgrade / always / 참조유효=True
- Modal_TSV_BuildingUpgrade / Btn_TSV_Upgrade_Confirm → navigate / Page_TSV_Territory / always / 참조유효=True
- Page_TSV_Heroes / Btn_TSV_Heroes_Back → back / history back / always / 참조유효=True
- Page_TSV_Territory / Btn_TSV_Nav_Heroes → navigate / Page_TSV_Heroes / always / 참조유효=True
- Page_TSV_Territory / Btn_TSV_Territory_Building → navigate / Page_TSV_BuildingInterior / always / 참조유효=True
- 순수 모델 확인: main building entry = True
- 순수 모델 확인: building opens upgrade modal = True
- 순수 모델 확인: Escape policy drops modal = True
- 순수 모델 확인: confirm navigate main clears modal = True
- 순수 모델 확인: main hero entry = True
- 순수 모델 확인: Recruit remains explicitly unwired = True
- 순수 모델 확인: hero back returns main = True

entry에서 4화면 도달가능=True. 위 확인은 저장 데이터에 기존 모델 함수를 적용한 결과이며 native 클릭·실제 Escape·초점·반응형/스크롤 검수가 아닙니다.

## 잔여 / 보호

- 4 native screens are partial assembly; 31-family final visual equivalence verification remains0/31
- 27 other structural families not assembled
- Recruit/hero-detail/filter actions and related missing destinations remain to author in assigned scope
- Source close/cancel policy and exact font/material/Unity hierarchy not verified
- Actual GUI state, Escape/focus, 390/430/1440 responsiveness and soft shadow additions are parent tasks after this snapshot
- Additional hero source preparation does not imply registration or assembly unless referenced in this snapshot

종료 재읽기 r57 / SHA 8bfa6e4dfe83b130d12f613d757f8d31c6c6d8e18c8e4dce4d161467bd70e60e / 분석 중 변경=False. 결론은 읽은 snapshot에만 적용합니다.
- 산출은 scratch/native-review-v002.md/json 및 별도 제작가이드 후보입니다. 저장 JSON/제품/공용기록/서버/브라우저/기존 카탈로그 두 사본 변경0.
