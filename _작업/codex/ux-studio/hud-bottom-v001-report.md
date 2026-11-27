# 하단 내비게이션 개별 자원4종

codex(단이) 하위 작업 · 2026-11-16 14:33 KST 확인 · 제안(검수 대기)

## 지시와 원본
사용자가 추가한 하단 화면을 기준으로 승리 클립보드·짓기 망치·앨범 카드·친구 악수만 각각 독립 자원으로 새로 그린다. 배지/숫자/글자·백판·캐릭터·GO·3D 배경을 그림에 합치지 않는다. 그림자는 별도 DOM 실행기 효과이며 원본 자원에 굽지 않는다. 제품 설계·UI 소스·공용 문서는 본체 담당이다.

- 실제 참조: /var/folders/dn/m763zzn15514kpgp2jhdyft40000gn/T/codex-clipboard-b73309cf-fde7-4c0d-88d7-4ebf6de464c2.png 를 view_image로 먼저 읽었다. authoring/v001/reference_bottom-nav_user-20261116.png에 바이트 복사 보존했다.
- 좌표 원본: _작업/codex/ux-studio/20261116-board-measurements/independent-measurements.json의 기존67개 목록에서 네 nav_*_icon을 읽었다. source551×984 기준 victory[17,898,44,59], build[92,898,65,61], album[391,898,69,62], friends[477,901,67,55]이며 가시 외곽 불확실성±2px이다. 빌드 망치 우상단은 배지에 가려 원래 모양 일부가 미확인이다.
- 첨부 하단 crop의 픽셀·원본551×984의 좌표·이번 생성1254×1254의 source region을 서로 섞지 않는다. 위 네 box는 새 자원을 배치하기 위한 원본 관찰값이며 이 작업에서 제품 배치를 변경하지 않았다.

## 생성
imagegen 스킬의 built-in 모드만 사용했다. 각 아이콘 별도 최초4회, 망치/친구의 강조선 내부를 흰색으로 바꾸는 한정 보정2회로 총6회 호출했다. CLI/API 키·새 패키지·하위 에이전트는 쓰지 않았다.

- 승리: 골드 클립보드와 흰 종이·골드 원 안 흰 체크.
- 짓기: 기울어진 골드 망치·흰 외곽선·흰 강조선2개. 첫 생성본의 골드 강조선은 후보로 보존하고 보정본을 선택했다.
- 앨범: 골드 카드3장·흰 외곽·상단 흰 별3개·흰 타원 안 골드 실크햇.
- 친구: 골드/흰색 악수·흰 외곽·흰 강조선3개. 첫 생성본의 골드 강조선은 보정했다.

정확한 최초/보정 프롬프트: samples/monopoly-go/ui-studio/assets/authoring/hud-bottom/v001/generation-prompts_v001.json. 원본 PNG와 초기 후보를 보존했다. 기존 파일은 덮어쓰지 않았다.

## 저장·검증
PNG: samples/monopoly-go/ui-studio/assets/authoring/hud-bottom/v001/

WebP: samples/monopoly-go/ui-studio/assets/production/hud-bottom/

등록용 사본: src/tools/uxStudio/assets/import-staging/hud-bottom/

파일 stem은 common_bottom-nav_victory/build/album/friends_normal_v001이다. 전부 실제 sourceSize1254×1254이며 WebP quality95다. PNG는 생성 원본과 바이트가 같고 크롭/리사이즈/마스크·그림자 추가를 하지 않았다. WebP는 크기와 alpha 전체가 PNG와 정확히 같다. RGB는 형식 변환에 따른 손실 압축이므로 무손실이라고 주장하지 않는다.

|자원|WebP bytes|권장 source region x/y/w/h|
|---|---:|---|
|victory|64592|248 / 137 / 747 / 987|
|build|75916|160 / 228 / 842 / 825|
|album|92216|111 / 214 / 1025 / 867|
|friends|105720|125 / 224 / 999 / 825|

알파 임계값16의 주요 가시 경계로 타이트한 region을 제안했다. alpha1은 극저 alpha 잡티까지 포함하므로 긴 여백을 만드는 잘못된 region으로 사용하지 않는다. 임계값1/16/128 bbox와 전체 경로·원본 SHA-256·WebP SHA-256·품질·프롬프트 경로·기존 원본 target box는 _작업/codex/ux-studio/hud-bottom-v001-assets.json에 있다.

4개 모두300000bytes 이하, PNG/WebP 크기 동일, ImageChops alpha 차이 없음, production/import 사본 바이트/해시 동일을 검증했다. 소스 그림의 참조 대비 곡선·흰 외곽선 밀도·골드 면의 미세한 색 변화는 최종 검수 대기다. 극저 alpha(<16)의 외곽 찌꺼기가 남아 있으며 코드로 지우지 않았다. 그림에 cast shadow·백판·글자·배지를 추가하지 않았지만 실제 UI에서 투명 경계·비율을 대조하는 검수는 아직 하지 않았다.

## 코드 변경과 나머지 경계
이번 추가 배정 중 소스 관련 변경은 명시된 tests/ux-studio/catalog.test.mjs:93의 consumer 예상 의존성 목록에 visual-effects.mjs를 추가한 한 줄뿐이다. 추가 모듈은 외부 import가 없으며 경량 DOM 효과다. 그 한 줄은 기존 실제 graph 불일치 RED를 확인한 뒤 백업 후 수정했고 scoped8/8 통과했다. 효과 단위의 기존 변경·검증은 visual-shadow-report.md에 별도로 기록했다.

본체가 제품 소스·실제 UI 자원 등록·assetRef·region/배치·상태·사본 저장/재열기·공용 문서·전체 시험을 맡는다. 이 작업의 생성·형식 변환을 실제 게임 UI 검수나 제작 승인으로 표시하지 않는다. 서버/빌드/예약·기존 자원·설계는 수정하지 않았다.
