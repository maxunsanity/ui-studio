# Wins modal 기존 UI 지원 범위 · 제안(검수 대기)
2026-11-16 · codex(단이). wins-assembly-quick-sheet.md 및 실제02_wins.png(324×568) view_image와 관련 source만 확인; UI/설계/제품 수정·실화면 검수 없음.
1. 원본은 메인HUD를 뒤에 두고 clipboard 전역[10.20,105.68,525.49,819.42]와 footer[0,925.10,551,58.90]를 전체551×984 안에 둡니다; HUD/SNS를 modal에 중복 복사하지 않습니다.
2. 현재 modal wrapper는 CSS90%×48%여서 기준551×984에서495.9×472.32입니다(styles.css:381~383,913~914); 상세 rootSize도 같은 비율입니다(main.mjs:2543~2559).
3. consumer는 presentation.type의 class만 주고 W/H를 별도로 설정하지 않습니다(consumer.mjs:59~67). 화면.logicalSize=551×984를 저장해도 이 wrapper가 fullscreen으로 바뀌지 않습니다.
4. 기존 UI 진입: 메인의 Wins 버튼 선택 → 오른쪽 ‘공통 연출’ → ‘공통 내용’의 ‘기본 모달’ → ‘어떤 형태로 띄울까요?’의 ‘모달 · 가운데 창’.
5. 노출 설정은 ‘나타나기’, ‘연출 시간 (ms)’, ‘자동 닫힘 (ms, 0은 유지)’, ‘뒤 화면 어둡게’; ‘▶ 화면 위에 띄우기’는 저장되지 않는 시연입니다(main.mjs:420~421,731~734).
6. ‘선택 버튼 동작을 이 연출로 지정’ → ‘공통 내용·배치 편집’으로 실제 modal을 만들고 부품을 조립할 수 있습니다; 이 지정은 해당 버튼의 이전 행동을 대체합니다(main.mjs:1400~1422).
7. 이 UI에는 root W/H·전체화면·root 투명 배경 선택 항목이 없습니다. 자식 ‘배치’/가이드 W/H와 ‘현재 화면 논리 크기’는 부모 modal wrapper 크기 설정을 대신하지 않습니다.
8. 따라서525×819 clipboard와 전체footer를 현90%×48%창에 보정%/부모밖 overflow로 억지 배치하지 않습니다. 기존 modal 기본 skin/백판도 원본 clipboard와 중복될 수 있습니다.
9. 최소 부족: 기본90%×48%는 보존하며, opt-in fullscreen/크기 계약과 root 투명 표시를 상세 rootSize·공통연출 UI·실제 drawOverlay·consumer에 동일하게 연결할 지원이 필요합니다; 현재는 미구현/새수정 권한 없음.
10. 크기 지원 후 조립 순서는 Clipboard BG/Frame→clip/native제목·timer→mission1개/3복제→weekly판·bar·그림·native문구→전체footer/닫기. 루트기준 확정 전 전역px를 현재modal%로 직접 옮기지 않습니다.
11. ‘연결·조건’의 메인 Wins 진입은 ‘겹쳐 열기’(open), 닫기는 ‘닫기’(close)·조건 ‘항상’이며 ‘이전 화면’(Back)과 구분합니다. dim/blocking/Escape는 기존 engine1개를 재사용하며 실제 포커스/닫기·저장재열기는 본체 검수입니다.
