# 상세·가이드 탐색 후보 — 2026-11-18

상태: 제안(검수 대기). 실소스/저장 설계/자원/서버/공용 STATUS·보고 변경 없음. 후보와 시험만 이 navigation/ 안에 생성했습니다.

## 반영 대상

- `src/tools/uxStudio/main.mjs`: 단계 경로·현재 화면·3표현 선택·미리보기, 파일/공유와 편집 도구 접기. 화면 Undo/Redo 버튼 제거, 기존 keyboard/history engine 보존.
- `src/tools/uxStudio/project-context.mjs`: `designURL`의 3표현 전달과 saved sample route.
- `src/tools/uxStudio/design-guide-view.mjs`: 같은 단계·project/screen·부모/자식 경로, 표현·미리보기 callback. 위치/선색/이미지/글자/편집 callback와 focus/close 보존. Guide renderStage는 이미 shared `renderPresentation`을 사용합니다.
- `src/tools/uxStudio/navigation.css`: 추가 CSS만 별도 보존. `styles.css` snapshot 끝에도 같은 내용이 포함되어 있으므로 한 번만 반영합니다.
- `tests/ux-studio/navigation.test.mjs`: 새 시험. 다른 세 test snapshot은 기존 guide/context/edit 회귀용 복사본이며 live test 교체 대상이 아닙니다.

`baseline/`와 `baseline-sha256.txt`는 후보 시작 시 원본입니다. `navigation.patch`는 위 4개 기존 source만의 unified diff이며 각각의 `.patch`도 제공합니다. 이후 source가 달라졌다면 snapshot 통째 덮어쓰기 대신 diff를 대조해 반영하세요. 후보 src의 나머지 `.mjs`는 원본을 읽는 symlink이며 복사 대상이 아닙니다. presentation.mjs symlink는 다른 하위 에이전트의 후보를 읽습니다.

## 정확한 API

```js
designURL('detail' | 'canvas' | 'preview' | 'sample', {
  workspaceId = null, projectId, screenId, elementId, presentationMode
})
```

기존 detail/canvas/preview 경로·query 순서를 보존합니다. 새 sample 경로는 `/ui-studio/source/sample-preview.html`. presentationMode를 전달한 경우에만 URL에 `view=wireframe|detailed-wireframe|ui`가 추가됩니다. invalid value는 shared normalizePresentationMode에 따라 ui. workspace 검증·escaping은 기존 scopeURL을 따릅니다. 기존 presentationMode 없는 호출 결과는 그대로입니다.

```js
openDesignGuide({
  document, screenId, elementId = null, workspaceId = null, size,
  onSelect, onEdit, onChange, onImportImage, // 기존 계약 그대로
  context = {projectName, dirty},
  presentationMode = 'ui',
  onNavigate({stage, screenId, elementId, presentationMode}), // stage overview|detail
  onPreview({screenId, elementId, presentationMode}),
  onPresentationChange(mode)
})
```

Guide onNavigate/onPreview는 최신 선택 child ID와 view를 캡처하고 dialog를 먼저 닫은 뒤 호출합니다. callback이 없으면 해당 action은 disabled입니다. guide 자신은 이동하지 않습니다. main은 overview 이동을 location.assign으로 실행하므로 기존 dirty beforeunload guard가 유지됩니다. detail은 같은 in-memory 설계/선택에 돌아옵니다. onChange 성공 후 guide는 미저장 상태로 표시합니다. 색상은 기존 workspace/screen/element별 로컬 보기 설정으로 유지합니다.

Shared `PRESENTATION_MODES`는 `{id,label}` 배열이며 문자열 배열이 아닙니다. main/context/guide는 `./presentation.mjs`를 import합니다.

`openCurrentPreview({screenId = selectedScreen,elementId = selectedElement,presentationMode = currentMode})`는 main 내부 함수입니다. 현재 doc clone을 `mountSampleScreen(host, snapshot, {screenId,workspaceId,presentationMode})`으로 표시하며 저장하거나 읽어오지 않습니다. modal도 선택 화면만 표시합니다. dirty 상태는 미저장 수정 포함, revision이 아직 없으면 파일 저장 전으로 표시합니다. 저장 샘플 링크는 별도 파일 메뉴에 남았습니다. resize fit·dialog keyboard 격리·viewer dispose·opener focus 복귀를 포함합니다. mountSampleScreen의 presentationMode 지원은 본체가 합칠 sample-preview 후보가 필요합니다.

## 본체 통합 경계

- main renderElements의 기존 renderLayout / applyOverlayRoot 등 실제 편집 렌더 호출은 본체가 presentationMode에 연결해야 합니다. 후보 main은 view state/URL/selector만 준비했습니다.
- main HTML은 styles.css 다음에 shared presentation.css를 별도 stylesheet로 1회 로드합니다(본체 반영). Guide iframe도 styles.css → presentation.css → iframe local style 순서로 로드합니다. main 미리보기의 표현도 본체 sample-preview mode 통합에 따릅니다.
- 현재 설계 미리보기 sample-panel은 저장 viewer와 동일하게 자기 root 안에서 overflow:hidden으로 clip합니다. presentation.css의 공용 sample-screen/panel 스타일도 본체가 반영합니다.
- 새 overview의 guide 호출에도 위 callbacks/context를 전달합니다. 기존 grape-pilot 호출은 새 callback이 없어 이동/미리보기 버튼이 disabled입니다. 기존 선택/가이드 편집은 계속 동작합니다.
- 기존 beforeunload handler·native save·history·tree·inspector·onChange edit logic은 원본 그대로입니다. main에서 직접 navigation을 intercepted하지 않았습니다.

## 시험

새 기능 시험 4개를 원본 후보에서 먼저 실행해 기능 부재로 실패한 결과 `red-tests.log`, preview/dirty 2개 실패 `preview-red-tests.log`, never-saved 표기 실패 `preview-unsaved-red.log`를 보존했습니다.

```sh
cd /Users/max/projest_max/ui-studio/_작업/codex/ux-studio/ux-refresh-20261118/navigation
node --test tests/ux-studio/navigation.test.mjs tests/ux-studio/design-guide-view.test.mjs tests/ux-studio/project-context.test.mjs tests/ux-studio/design-guide-edit.test.mjs
```

최신 GREEN 28/28·실패0: `green-tests.log` (새 6개 + 기존22개). 후보 3개 mjs의 node --check도 exit0.

실소스 baseline에서 `npm test` 583/583·실패0: `live-baseline-tests.log`. 후보 반영 후 전체 통합시험을 대신하지 않습니다. 실제 1440/430 브라우저·링크·자원404·overflow·native save/dirty guard 화면 검수는 이 하위 작업에서 수행하지 않았습니다. 본체 safe HMR 뒤 확인 대상입니다.

CSS 후속 보정: guide iframe stylesheet 순서와 현재 설계 sample-panel clip을 정리한 뒤 기존 guide/navigation 시험만 재실행했습니다. `css-followup-tests.log`: 20/20·실패0. 전체 suite는 이 CSS 후속에서 다시 실행하지 않았습니다. 실소스·기준 백업 변경 없음.
