# 추가 자원 v002 — 신규 파일만 준비

제안(검수 대기). 실제 native브라우저 조립/등록/설계저장/재열기/클릭검수 **0**. 공통JS·기능소스·설계JSON·공용STATUS/보고·기존geometry/scene/heroes파일 수정0. 기존100행계획CSV도변경하지않았습니다.

새 최종WebP 총17종: 가구3(256×288공통슬롯/바닥y280), 건물기하10(128²), nav/quest4(128²). built-in image_gen은가구새3종+옷걸이배경제거재편집1회, 기하는직접SVG→기존AppKit→RGBA PNG→lossless WebP. 새패키지설치/서버동작0. 생성 원본과실패시안보존,별도authoring/staging폴더. 모두투명RGBA·alpha0..255·외곽모서리투명·300000B미만·authoring/staging바이트일치. 실제WebP view_image 확인. 정적자원검사를native화면검수로쓰지않습니다.

## 본체가 사용할 표

asset-resolution-v002.csv는기존계획표의그림행과선택가능한arrow/nav추가그림을native경로로매핑합니다. 설계payload/JSON/자동주입자료아닙니다. 본체가실제UI에서각image의프로젝트경로에입력하고assetRef·표시·저장재열기를확인해야합니다.

## 원본 관찰과 미확인

TSV03-01, TSV02@110s/425s를직접열어하단6슬롯을확인했습니다. 영웅·외출은문구관측. 나머지는잠금또는후반공급상자모티프이며메뉴이름미확인입니다. '임무/영지/이야기/소대'를하단이름으로확정하지않았습니다. 퀘스트두루마리는하단nav밖의별도좌하단입구입니다. 새quest-scroll은두루마리모티프의단순황갈색기하로,원본흰종이/푸른틀의정확재현이아닙니다. 새nav4는잠금/배지/문구를그림에굽지않았습니다.

건물조건 원본 TSV03-08의4보상메달과조건2행, TSV03-07의가구4카드를근거로했습니다. 화분은01/03재사용. 발전소는단순아이소메트릭기하제안이며정확한원작모델이아닙니다. 가구3D원화도source와재질/세부형태차이가있고원본동등/사용자승인아닙니다.

## 경로

- 가구: /ui-studio/source/assets/import-staging/tile-survival-furniture-v001/
- 건물: /ui-studio/source/assets/import-staging/tile-survival-building-icons-v001/
- nav: /ui-studio/source/assets/import-staging/tile-survival-nav-v001/
- 공통기존재사용: /ui-studio/source/assets/import-staging/tile-survival-geometry/ (wood-log, power-fist, population-hat, lock-white, diamond-purple 원본보존). 신규보상메달에는medal-power-fist를쓰면다른3메달과공통청록규격.

manifest와prompt/원본/검증기록은 furniture-resources-v001/, icon-resources-v001/, nav-resources-v001/ 안에있습니다. 최종17WebP의독립재검사: decodedRGBA/alpha/외곽/크기제한/authoring-staging일치17/17. root의실제nativeUI조립과검수는별도기록입니다.
