# 추가 기하 3종 — 제안(검수 대기)

2026-11-17 codex. 원래 19종 제작물은 다시 생성하지 않았습니다. `additions-preservation-baseline.json`과 전후 SHA256을 비교하여 기존 133파일 및 manifest 기존 19항목이 그대로임을 확인했습니다.

- `background-full-551x984`: 551×984 opaque SVG/PNG/lossless WebP. 기존과 같은 원래 별 도형을 128px 주기로 반복하고 배경 자체에 세로 gradient를 입혔습니다. 별 비율을 바꾸는 타일 확대가 없습니다. 위 #003c85, 아래 #009ed8 실제 픽셀 검증. SVG 95,856B / PNG 22,439B / WebP 9,970B, 합계 128,265B로 300KB 미만입니다.
- `next-red-ribbon3`: 140×40. source D의 550 앞 리본을 다시 `view_image`로 관찰했습니다. 양끝의 뒤 접힘·전면의 기울어진 붉은 면을 원본 코드 기하로 제작했습니다. 3slice left20/right20/center100. manifest의 9slice 호환 값은 [0,20,0,20]이며 별도 slice3도 포함합니다. 글자는 분리입니다.
- `current-arrow-gold`: 32×30. source F의 538 위 ▲를 다시 `view_image`로 관찰해 새 기하로 제작했습니다. 금색 면/가장자리 베벨 포함, 외곽 cast shadow 없음, 투명 코너와 여백 3px 이하를 확인했습니다.

제작은 `build_additions.py`, 검증은 `additions-validation.json`, 실물로 본 proof는 `geometry-additions-contact-sheet.png`입니다. production/staging PNG·WebP 및 세 위치 manifest에 새 3항목만 추가했습니다. 기존 메타데이터와 19항목은 그대로 보존했습니다. 브라우저·제품 코드·공용 보고·STATUS는 변경하지 않았습니다. Native UI 배치/글자/엔진 그림자는 부모 본체의 후속 검수 범위입니다.
