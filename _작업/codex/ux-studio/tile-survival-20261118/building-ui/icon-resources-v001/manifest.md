# 건물 UI 신규 기하 아이콘 v001

- 작성: codex(단이), 제안(검수 대기)
- 실제 열람 원본: _작업/codex/ux-studio/tile-survival-20261118/video-b/references/TSV03-08.jpg (온실 업그레이드 보상·조건 화면)
- SVG 직접 작성 → 기존 macOS AppKit으로 PNG 렌더 → 기존 Pillow로 lossless WebP 인코딩·검증. 새 설치 0.
- 원본 영상 픽셀 재사용 0, 문자·숫자·NEW 내장 0, 외부 drop-shadow 0, native 조립 0.
- 각 아이콘: 128×128. RGBA PNG/WebP 모두 alpha 0..255, 가장자리 완전 투명, 알파 tight bbox 16..112 범위 안.
- 10종 × SVG/PNG/WebP = 30파일. authoring/staging 각 형식의 바이트 및 SHA-256 일치. 각 파일 ≤300,000 bytes.
- manifest.csv: 30파일 경로·RGBA·tight bbox·용량·SHA-256. reuse.csv: 기존 5종 읽기 전용 재사용 경로.
- powerplant-requirement: 저해상도 발전소 조건을 위한 단순 아이소메트릭 기하 모티프 새 시안입니다. 건물 외형 확정값이 아닙니다.
- 별도 NEW 텍스트와 수치·조건명은 UI 텍스트로 조립해야 합니다.

| 이름 | PNG alpha tight bbox (x0,y0,x1,y1; right/bottom exclusive) | WebP bytes |
|---|---|---|
| check-green | 17,27,111,102 | 3194 |
| arrow-right-green | 20,24,110,104 | 2806 |
| medal-arrow-up | 18,19,110,110 | 6114 |
| medal-survivor-up | 18,19,110,110 | 6314 |
| medal-sofa | 18,19,110,110 | 5810 |
| lock-navy-silver | 28,19,100,108 | 3926 |
| metal-ingot | 21,27,108,89 | 4004 |
| tomato | 16,16,112,111 | 7028 |
| powerplant-requirement | 22,24,107,110 | 4104 |
| medal-power-fist | 18,19,110,110 | 6590 |

검증: python3 _작업/codex/ux-studio/tile-survival-20261118/building-ui/icon-resources-v001/encode-and-verify.py

미수행: 브라우저·서버·실제 UI 조립·UI 클릭 검수. 기존 파일/공통 JS/설계 JSON/공용 STATUS·보고 수정 0.
