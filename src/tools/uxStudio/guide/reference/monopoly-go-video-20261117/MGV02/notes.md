# MGV02 - 나의 쇼룸.mov

codex / source-video observation / review pending

11.04 seconds; native1920x1080 landscape24fps. The centered portrait game is in an emulator recording. Full native frames stay intact; gameROI [650, 28, 592, 1052] is an unscaled content crop, never551x984 source declaration.

## Counts

{"screens": 4, "states": 9, "screenTransitions": 4, "stateTransitions": 4, "observedChanges": 8, "initialContextRecords": 1, "transitionRecordsIncludingInitialContext": 9, "gridJPEG": 23, "denseJPEG": 35, "sceneJPEG": 4, "nativePNGs": 5, "stateGameCrops": 9, "contactSheetsViewed": 6}

Distinct surfaces are screens; counter/animation/scroll changes are separate states. Initial-context record is not an observed opening action. Counts are not UI construction/QA completion.

## Observed UI / existing ten-screen comparison

- **MGV02-S01 / 보드 메인**: existing family; live Korean values differ; saved ID=main
  144,506, 27/65, x10, 10/60.
- **MGV02-S02 / 메인 우측 메뉴**: existing family; saved labels English; saved ID=common-0e507f99-6097-4037-ac6c-aa0e7229cb07
  현중, 상점, 재산, 나의 쇼룸, 일일 선물, 지도, 보드 보고서, 같이 해요!, 설정, GO!CHAT.
- **MGV02-S03 / 토큰**: existing shell/shields; tokens body newly observed; saved ID=screen-a6493c49-cd67-4081-b900-dbe64315e15e
  토큰, 3, 신규.
  아래 진열장 두 줄의 어둠만 관찰했으며 소유 잠금 정책으로 단정하지 않습니다.
  토큰 외 다른3탭 몸체는 미관찰입니다.
- **MGV02-S04 / 버튼**: missing UI; saved ID=None
  버튼, 스타일 토큰, 장착.
  버튼은 항목 고유 제목으로 읽은 문자열입니다.
  장착·좌우 이동은 보이지만 누른 결과가 없습니다.
  상세 X 뒤 메인 복귀를 관찰했습니다. 쇼룸만으로 돌아가는 링크를 만들지 않습니다.

## Timeline

| observed interval | state | evidence |
|---|---|---|
| [0, 1.208333] | MGV02-S01-A 메인 초기 | frames/representatives/MGV02_R01_t00.500.png |
| [1.333333, 1.416667] | MGV02-S02-A 메뉴 딤/우측 시트 진입 | frames/dense_004.jpg |
| [1.5, 3.416667] | MGV02-S02-B 메뉴 안정 | frames/representatives/MGV02_R02_t02.000.png |
| [3.5, 3.916667] | MGV02-S03-A 토큰 화면 아래에서 진입 | frames/dense_015.jpg |
| [4, 8.208333] | MGV02-S03-B 토큰 진열 안정 | frames/representatives/MGV02_R03_t05.000.png |
| [8.333333, 8.916667] | MGV02-S04-A 강아지 확대/딤/이름판 등장 | frames/dense_024.jpg |
| [9, 10.208333] | MGV02-S04-B 장착/좌우/X 표시 완료 | frames/representatives/MGV02_R04_t09.500.png |
| [10.291667, 10.625] | MGV02-S04-C X 뒤 메인으로 해제 | frames/frame_00022.jpg |
| [10.708333, 11] | MGV02-S01-B 메인 복귀 | frames/representatives/MGV02_R05_t11.000.png |

## Unobserved / link boundary

- 장착 결과/적용 여부
- 좌우 토큰 교체
- 모자 이외3탭 내용
- 쇼룸/상세 i 안내
- 다른 메뉴8행/X 직접 결과
- Main방패 바로가기에서 토큰 탭으로 진입하는지

All unseen controls/Info/Equip/tabs/cards target null. Observed screen sequence/control correspondence does not prove exact click or game API. Three clips share7 unique canonical families; their repeated Main/Menu screens are not new unique UI.

## Capture quality / errors

- Native representative PNGs16 across three clips are direct decoded source frames, no added JPEG encode. Source MOV itself is compressed.
- Base/dense JPEG q:v3 and scene JPEG q:v4 are lossy review frames. State crop PNG made from JPEG retains JPEG artifacts; each state records this.
- requested/actual original PTS are separate in frames/index.json, dense_index.json and index.json.
- All 6 contactsheets were actually opened via view_image.
- Swift metadata own failure history is in meta.json; external handoff AVFoundation243decode errors are not claimed as our extraction test.
- Scene detector result: {"threshold": 0.1, "exitCode": 0, "selectedFrames": 4, "log": "frames/scene-detection.log", "meaning": "Source PTS scene candidates, manually observed separately; count is not UI count."}
- Source SHA unchanged: True
- First PTS 0.0 / last 11.0.

## Interop / outputs

screens.json: top-level screens with stable MGVxx-Sxx IDs; states include label/representative/gameCrop/originalSizePNG.
transitions.json: fromScreenId/toScreenId/observedWindowSeconds/trigger/null/visibleControlCandidate/observedOutcome.
index.json: frames/representatives/contactSheets/stateGameCrops.
No shared index HTML/combined inventory/design/source/guide/STATUS or second-project data changed.
