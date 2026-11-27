# 保存 native r339 검토 · 제안(검수 대기)

2026-11-17 20:46:48 KST 저장판을 읽었습니다. 읽는 동안 inode/크기 안정,16화면·23연결입니다. 이후 저장판에 대한 검토로 확대하지 않습니다.

- r335 기존14화면은 ID 포함 전체 deep-equal입니다. 기존22연결도 내용·앞22개 순서가 동일합니다.
- 쇼룸27부품: 명판/카테고리/전시 그룹, 독립 빛살·전신 토큰·받침·앞 paw, 장착/frame/text, Close/좌우/glyph 분리를 확인했습니다.
- 실제 model.resolveRect로 Footer(0,912,551,72), line(0,912,551,6), Close hit(253.5,940,44,44), glyph(261.5,948,28,28)를 확인했습니다. Footer legacy x2%는 rectTransform이 덮으므로 오프셋 결함이 아닙니다.
- 장착/이전/다음/info는 전환 연결이 없어 미관찰 동작을 만들지 않았습니다. Close만1개 close/always 연결입니다. Class18부품은 제작 중이라 누락 판정을 하지 않았습니다.

## 수정 확인 항목

1. **P1 — cream extension 위에 Dim이 그려지는 저장 순서.** root siblings는 EquipExtension → Dim입니다. extension(0,852,551,60)이 Dim(0,0,551,912) 안에 들어가므로, 새로 마운트하면 alpha194 검정이 cream support 위에 합성됩니다. Dim을 extension보다 먼저 두고 재열기 화면으로 확인하세요. Footer72/hit44/glyph28은 유지합니다. 요소: `element-88614f39-ad85-45f8-b2c5-410065eaf4c4`, `element-c76f236a-c618-4401-95c8-b6163f4cfa02`. 근거: layout-view.mjs63–68,75–85의 sibling 순서와 snapshot rect.
2. **P2 — Close 연결 설명이 갤러리로 남음.** edge `element-614bc0fe-f9f0-4341-a3ff-dce9b2fdb53b` label=`재산 갤러리 닫기 · 보드 복귀`. 실제 출발은 토큰 상세입니다. stable ID/action/condition을 유지하고 설명만 정정하면 됩니다.

카테고리 label box 중심332는 source 추정306보다 오른쪽입니다. 실제 글자·화면을 보지 않아 실패로 단정하지 않았습니다. 장착 버튼은 normal texture+tint이며 별도 눌림 원화 완료를 주장할 수 없습니다.

이번은 파일·소스 계산 확인입니다. 브라우저, 실입력, 이미지404/넘침, 화면 동등·사용자 승인은 확인하지 않았습니다. 설계/공통 정본/Capy는 변경·열람하지 않았습니다.
