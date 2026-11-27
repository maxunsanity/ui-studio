# HUD 상단 새 그림 자원 준비 · v001

작성자 codex(단이) · 2026-11-16T13:00:31+09:00 · 제안(검수 대기)

부모가 ImageGen으로 생성한 PNG 4개를 원본 바이트 그대로 사람이 읽는 이름으로 보존하고, 동일 크기의 WebP 생산 사본을 만들었습니다. 이미지 생성 프롬프트 전문은 이 하위 작업에서 확인하지 않았으며, Figma 302 콘셉트 재제작이라는 부모 전달 근거를 manifest에 구분했습니다.

| 자원 | 원본 크기 | WebP quality | 생산 bytes | 중앙 alpha | 원본 PNG SHA-256 |
| --- | --- | --- | --- | --- | --- |
| common_hud-top_bar-bg_normal_v001 | 2172×724 | 95 | 71464 | 253 | 046d712903f831c4e0ab0ffb2b2df9a467b355596bfe303459431231c0e7bfa6 |
| common_hud-top_cash-icon_normal_v001 | 1536×1024 | 95 | 96080 | 253 | cedd0a59235d72ef6725c126b4c46e56d9e5eac216d5c1069a4949ea5ec0b408 |
| common_hud-top_shield-icon_normal_v001 | 1263×1246 | 95 | 108742 | 254 | ac0bb7efd3101b88e6ec8e23ba6766d88e193e4b98eeca76b9e0d8fc649011fd |
| common_hud-top_player-avatar_normal_v001 | 1254×1254 | 95 | 137102 | 253 | e6157088569bc4dc39d2182d6b1d7c29b29bbbbc3748ba733d47d08b438482ee |

## 보존·검증

- 원본 generated_images PNG 4개는 읽기만 했으며 authoring 사본의 SHA-256이 원본과 같습니다.
- 생산 WebP 4개는 각각 300,000bytes 이하, 원본과 같은 크기, 최대 4096px 이하입니다. 다시 디코딩한 알파 채널 전체를 원본과 비교하여 4/4 완전 일치를 확인했습니다.
- PNG 전체 RGB를 WebP에서도 무손실이라고 주장하지 않습니다. 요청된 quality 기반 RGB 형식 변환이며 알파는 그대로 보존했습니다.
- 중앙·네 모서리의 실제 알파, 알파 범위, alpha>0 bbox, 투명/불투명/부분 투명 픽셀 수는 통계 JSON에 원본/생산 양쪽으로 기록했습니다.
- import-staging 생산 사본 4개의 SHA-256은 workspace production 파일과 같습니다.
- crop·크기 변경·배경 제거·픽셀 보정은 하지 않았습니다. cash v001의 외곽 halo도 그대로 보존했습니다.
- 최종 시각 승인·화면 품질 검수는 현중 판단 대기입니다. 기존 설계·소스 코드·가이드·STATUS·3D 슬롯은 수정하지 않았습니다. 브라우저 검수·실제 UI 자원 등록은 수행하지 않았고 registration=null, QAapproved=false입니다.

## 경로

- Authoring: `samples/monopoly-go/ui-studio/assets/authoring/hud-top/v001/`
- Production: `samples/monopoly-go/ui-studio/assets/production/hud-top/`
- 임시 import mirror: `src/tools/uxStudio/assets/import-staging/hud-top/`
- Manifest: `samples/monopoly-go/ui-studio/assets/asset-manifest.json`
- Alpha 통계: `samples/monopoly-go/ui-studio/assets/production/hud-top/alpha-stats_v001.json`

## 판단 필요

cash 외곽 halo의 v002 교체 여부와 네 자원의 최종 시각 승인은 부모/현중 검수로 남깁니다. 새 그림이 생성·보존되었다는 사실과 U 단계 시각 승인은 구분합니다.


## 실제 알파와 불투명 요구의 구분

네 원본의 중앙 alpha는 바탕253·현금253·방패254·아바타253입니다. 현금 v001은 alpha 최댓값254이고 완전 불투명(255) 픽셀이0개입니다. 가장자리 안티앨리어싱과 별개로 중앙도 완전255는 아니므로 불투명 바탕 요구를 통과했다고 기록하지 않습니다. 원본 보존 지시 때문에 알파 수정은 수행하지 않았습니다.

## cash v002 시안 보존 · rejected-visual

부모가 표시를 검토한 결과 halo가 더 커진 듯 보여 미채택이라고 전달한 v002 PNG를 바이트 그대로 authoring/hud-top/v002/에 보존했습니다. 이 하위에서 독립 시각 비교를 수행한 것으로 적지 않습니다. 생산 WebP·import mirror·v001 파일은 바꾸지 않았습니다.

- PNG: `samples/monopoly-go/ui-studio/assets/authoring/hud-top/v002/common_hud-top_cash-icon_normal_v002.png`
- 판 기록: `samples/monopoly-go/ui-studio/assets/authoring/hud-top/v002/common_hud-top_cash-icon_normal_v002.rejected-visual.json`
- SHA-256: `cbc333f1a599520a2e1207973b2f77d1b37fa82d1767167a8d36098f0eb3a0f1`
- 상태: `rejected-visual`, `production=null`, `registration=null`, `QAapproved=false`
- Manifest/report 갱신 전 백업: `docs/planning/_backup/20261116_단이/130132_redrawn_hud_v002_record/`


## Alpha 임계값 bbox 추가

`alpha>128`, `alpha>240` 기준의 bbox와 정규화 UV를 source/production 통계에 함께 추가했습니다. 이미지 파일은 바꾸지 않았습니다. bbox는 우측·하단을 포함하지 않는 `[left,top,right,bottom]`입니다. 바탕의 alpha>240 영역은 `[22,249,2150,479]`, 즉 X22/Y249/W2128/H230입니다. 부모가 제안한 불투명 하층은 이 하위 작업에서 구현·화면 검증하지 않았으며 PNG 자체의 중앙 alpha253이라는 사실은 그대로 유지됩니다.

| 자원 | alpha>128 bbox | alpha>240 bbox |
| --- | --- | --- |
| common_hud-top_bar-bg_normal_v001 | [21, 248, 2151, 480] | [22, 249, 2150, 479] |
| common_hud-top_cash-icon_normal_v001 | [341, 182, 1199, 847] | [342, 183, 1198, 847] |
| common_hud-top_shield-icon_normal_v001 | [98, 71, 1162, 1178] | [99, 71, 1161, 1178] |
| common_hud-top_player-avatar_normal_v001 | [70, 94, 1163, 1195] | [71, 96, 1162, 1194] |


## 가져오기 계약 재확인

생산 WebP 4개를 현재 `asset-store.mjs`의 `inspectAsset`으로 읽기 전용 검증하여 종류·크기·300,000bytes 한도 4/4 통과를 확인했습니다. 실제 자원 POST 등록은 수행하지 않았습니다. 원본/master SHA-256 보존은 v001 4개와 rejected-v002 1개, 총5/5 통과이며 production/import mirror 일치는4/4입니다.
