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
