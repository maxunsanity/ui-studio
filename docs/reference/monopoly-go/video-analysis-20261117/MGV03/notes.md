# MGV03 - 레벨.mov

codex / source-video observation / review pending

7.96 seconds; native1920x1080 landscape24fps. The centered portrait game is in an emulator recording. Full native frames stay intact; gameROI [650, 28, 592, 1052] is an unscaled content crop, never551x984 source declaration.

## Counts

{"screens": 3, "states": 11, "screenTransitions": 2, "stateTransitions": 8, "observedChanges": 10, "initialContextRecords": 1, "transitionRecordsIncludingInitialContext": 11, "gridJPEG": 17, "denseJPEG": 29, "sceneJPEG": 2, "nativePNGs": 6, "stateGameCrops": 11, "contactSheetsViewed": 5}

Distinct surfaces are screens; counter/animation/scroll changes are separate states. Initial-context record is not an observed opening action. Counts are not UI construction/QA completion.

## Observed UI / existing ten-screen comparison

- **MGV03-S01 / 메인 우측 메뉴 · 재산**: existing family; saved labels English; saved ID=common-0e507f99-6097-4037-ac6c-aa0e7229cb07
  현중, 상점, 재산, 나의 쇼룸, 일일 선물, 지도, 보드 보고서, 같이 해요!, 설정, GO!CHAT.
  영상은 메뉴가 이미 열린 상태에서 시작합니다. 이 영상의 Main→Menu 진입은 미관찰입니다.
- **MGV03-S02 / 재산 갤러리**: missing UI; saved ID=None
  재산, 갤러리, 538, 다음 순서, 주사위 생성, 거물 익스프레스, 보드 보상, 임대료 목표, 최대 주사위, 복불복 카드, 셧다운, 소유지, 스티커로 보상 획득, 반응, 파란색 소유지 임대료.
  제목과 하단X는 유지되고 아래 단계가 보이도록 목록이 움직입니다.
  538 표시는 스크롤 중 세로 위치가 바뀌고 위에 머무는 구간도 있습니다. 고정 절대y 정책은 미확인입니다.
  파일명 레벨과 실제 제목 재산 갤러리는 구분합니다.538을 Build레벨/밸런스 규칙으로 옮기지 않습니다.
- **MGV03-S03 / 보드 메인 복귀**: existing family; live Korean values differ; saved ID=main
  144,506, 27/65, x10, 10/60.

## Timeline

| observed interval | state | evidence |
|---|---|---|
| [0, 0] | MGV03-S01-A 재산 행 위 커서/초기 메뉴 | frames/representatives/MGV03_R01_t00.000.png |
| [0.125, 0.625] | MGV03-S02-A 재산 문 닫힘 | frames/representatives/MGV03_R02_t00.625.png |
| [0.708333, 1] | MGV03-S02-B 닫힌 문/갤러리 제목 | frames/dense_009.jpg |
| [1.125, 1.208333] | MGV03-S02-C 문 열리고 목록 진입 | frames/dense_012.jpg |
| [1.208333, 2.5] | MGV03-S02-D 538 부근/550 다음 순서 | frames/representatives/MGV03_R03_t01.500.png |
| [3, 3.5] | MGV03-S02-E 중간 단계400/350/325 | frames/representatives/MGV03_R04_t03.500.png |
| [4, 6.333333] | MGV03-S02-F 낮은 단계300~140 스크롤 | frames/representatives/MGV03_R05_t05.000.png |
| [6.416667, 6.625] | MGV03-S02-G X 뒤 딤/문 닫힘 | frames/frame_00014.jpg |
| [6.708333, 7.208333] | MGV03-S02-H 닫힌 문으로 퇴장 | frames/dense_023.jpg |
| [7.333333, 7.416667] | MGV03-S03-A 문 열리며 Main 노출 | frames/dense_027.jpg |
| [7.5, 7.916667] | MGV03-S03-B 메인 안정 복귀 | frames/representatives/MGV03_R06_t07.500.png |

## Unobserved / link boundary

- Main→Menu 최초 진입(시작 전)
- 갤러리 i 안내
- 마일스톤 클릭 목적지/획득 API
- 잠금해제/550보상 지급/575거물 익스프레스 진입 조건
- 140카드 잘린 제목과 더 아래 구간

All unseen controls/Info/Equip/tabs/cards target null. Observed screen sequence/control correspondence does not prove exact click or game API. Three clips share7 unique canonical families; their repeated Main/Menu screens are not new unique UI.

## Capture quality / errors

- Native representative PNGs16 across three clips are direct decoded source frames, no added JPEG encode. Source MOV itself is compressed.
- Base/dense JPEG q:v3 and scene JPEG q:v4 are lossy review frames. State crop PNG made from JPEG retains JPEG artifacts; each state records this.
- requested/actual original PTS are separate in frames/index.json, dense_index.json and index.json.
- All 5 contactsheets were actually opened via view_image.
- Swift metadata own failure history is in meta.json; external handoff AVFoundation243decode errors are not claimed as our extraction test.
- Scene detector result: {"threshold": 0.1, "exitCode": 0, "selectedFrames": 2, "log": "frames/scene-detection.log", "meaning": "Source PTS scene candidates, manually observed separately; count is not UI count."}
- Source SHA unchanged: True
- First PTS 0.0 / last 7.916667.

## Interop / outputs

screens.json: top-level screens with stable MGVxx-Sxx IDs; states include label/representative/gameCrop/originalSizePNG.
transitions.json: fromScreenId/toScreenId/observedWindowSeconds/trigger/null/visibleControlCandidate/observedOutcome.
index.json: frames/representatives/contactSheets/stateGameCrops.
No shared index HTML/combined inventory/design/source/guide/STATUS or second-project data changed.
