# MGV01 - 감옥 탈출 _@.mov

codex / source-video observation / review pending

9.5 seconds; native1920x1080 landscape24fps. The centered portrait game is in an emulator recording. Full native frames stay intact; gameROI [650, 28, 592, 1052] is an unscaled content crop, never551x984 source declaration.

## Counts

{"screens": 3, "states": 11, "screenTransitions": 3, "stateTransitions": 7, "observedChanges": 10, "initialContextRecords": 1, "transitionRecordsIncludingInitialContext": 11, "gridJPEG": 20, "denseJPEG": 54, "sceneJPEG": 0, "nativePNGs": 5, "stateGameCrops": 11, "contactSheetsViewed": 6}

Distinct surfaces are screens; counter/animation/scroll changes are separate states. Initial-context record is not an observed opening action. Counts are not UI construction/QA completion.

## Observed UI / existing ten-screen comparison

- **MGV01-S01 / 보드 메인**: existing family; board/dice/jail animation missing; saved ID=main
  발바닥 젤리 대회, 27/65, 2일 16시간, x10, 50/60.
  영상은 이미 주사위를 굴리는 중 시작합니다. 최초 GO 클릭은 미관찰입니다.
  호루라기 +10/감옥 철창은 보드 효과·전환 상태이며 별도 UI 화면으로 세지 않습니다.
- **MGV01-S02 / 더블 굴리기**: missing UI/state; saved ID=None
  더블 굴리기, 승리, x10, 굴리기 3회 남음, 굴리기 2회 남음, 굴리기 1회 남음, 굴리기 0회 남음, 탭하여 멈추기.
  3→2→1→0을 관찰했고 성공한 더블 결과는 없습니다.
  별도 닫기 X는 보이지 않습니다.
- **MGV01-S03 / 보석금 지불**: missing UI/state; saved ID=None
  보석금 지불, -41,550, 굴리기 0회 남음.
  별도 지불 버튼/닫기 X 없이 카드가 위로 퇴장한 뒤 보드 복귀가 보입니다.
  자동 지불 정책·금액 산식·API는 추정하지 않습니다.

## Timeline

| observed interval | state | evidence |
|---|---|---|
| [0, 1] | MGV01-S01-A 보드 주사위 굴림 진행 | frames/frame_00002.jpg |
| [1.125, 2] | MGV01-S01-B 호루라기 확대·+10 | frames/frame_00004.jpg |
| [2.125, 2.5] | MGV01-S01-C 감옥 철창/토큰 진입 | frames/dense_014.jpg |
| [2.625, 2.916667] | MGV01-S02-A 더블 카드 등장 | frames/dense_019.jpg |
| [3, 3.625] | MGV01-S02-B 남은 횟수3 | frames/representatives/MGV01_R01_t03.500.png |
| [3.708333, 4.916667] | MGV01-S02-C 남은 횟수2 | frames/representatives/MGV01_R02_t04.000.png |
| [5, 6.125] | MGV01-S02-D 남은 횟수1 | frames/representatives/MGV01_R03_t05.500.png |
| [6.208333, 7.333333] | MGV01-S02-E 남은 횟수0/빨강 | frames/representatives/MGV01_R04_t06.500.png |
| [7.5, 8.5] | MGV01-S03-A 보석금 -41,550 | frames/representatives/MGV01_R05_t08.000.png |
| [8.833333, 8.916667] | MGV01-S03-B 지불 카드 위로 퇴장 | frames/dense_048.jpg |
| [9, 9.458333] | MGV01-S01-D 보드 복귀/현금 감소 표시 | frames/dense_052.jpg |

## Unobserved / link boundary

- 최초 GO 클릭/감옥 진입 조건
- 각 주사위의 정확한 mouse-down
- 더블 성공·탈출 성공/보상
- 보석금 산식·잔액 결산 규칙
- Esc/닫기/스킵 링크
- 영상 끝 보드 복귀 애니메이션은 진행 중

All unseen controls/Info/Equip/tabs/cards target null. Observed screen sequence/control correspondence does not prove exact click or game API. Three clips share7 unique canonical families; their repeated Main/Menu screens are not new unique UI.

## Capture quality / errors

- Native representative PNGs16 across three clips are direct decoded source frames, no added JPEG encode. Source MOV itself is compressed.
- Base/dense JPEG q:v3 and scene JPEG q:v4 are lossy review frames. State crop PNG made from JPEG retains JPEG artifacts; each state records this.
- requested/actual original PTS are separate in frames/index.json, dense_index.json and index.json.
- All 6 contactsheets were actually opened via view_image.
- Swift metadata own failure history is in meta.json; external handoff AVFoundation243decode errors are not claimed as our extraction test.
- Scene detector result: {"threshold": 0.1, "exitCode": 1, "selectedFrames": 0, "error": "No filtered frames; MJPEG output initialization/non-full-range error at EOF. Base software decoding succeeded. Not source corruption.", "log": "frames/scene-detection-failed-0.10.log", "fallback": "Manual reviewed0.5s sheets select0.1s transition windows."}
- Source SHA unchanged: True
- First PTS 0.0 / last 9.458333.

## Interop / outputs

screens.json: top-level screens with stable MGVxx-Sxx IDs; states include label/representative/gameCrop/originalSizePNG.
transitions.json: fromScreenId/toScreenId/observedWindowSeconds/trigger/null/visibleControlCandidate/observedOutcome.
index.json: frames/representatives/contactSheets/stateGameCrops.
No shared index HTML/combined inventory/design/source/guide/STATUS or second-project data changed.
