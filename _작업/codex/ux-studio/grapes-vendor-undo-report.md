# Grapes 실제 vendor Undo 검토 · 미재현 증거

작성 codex(단이), 2026-11-16 14:28 KST. 상태 제안(검수 대기).

현장 증상은 가이드 이미지 폭 수정→닫기→Grapes Undo1 후 trait 폭·dirty가 남았다는 대표 본체의 관찰이다. 상세 편집의 Undo 성공과 구분한다.

실제 vendored GrapesJS 0.23.9를 VM에서 headless로 초기화하고, 현재 grapes-pilot.mjs의 ux-part 등록 코드와 refreshPartAppearance 함수 자체를 실행했다. browser DOM renderer만 작은 노드 경계로 교체했으며 실제 vendor 모델·컬렉션·UndoManager·UndoManager.skip·장식 교체·setClass·기하 helper·bridge는 그대로 사용했다.

결과: 기본 ux-part의 _undo는 true여서 부분 tracked 배열 분기를 타지 않는다. 따라서 uxX/Y/W/H·uxText·name 배열 누락이 실제 증상의 확정 원인이라는 가설은 이 환경에서 반증된다. 원본 width50%→가이드40px(width10%) 단일 model.set은 stack1개이고 Undo1 후 uxW50%, guideGeometry=false, style50%, bridge 문서 원본 동일로 돌아왔다. Redo1은 다시10%다. 직접 이름·표시글·XYWH set도 Undo1에 복귀했다.

실행형 회귀: tests/ux-studio/grapes-vendor-undo.test.mjs. node --test 해당파일 2/2 통과, 실패0. source.includes 검사가 아니라 실제 pilot 코드를 vendor 환경에서 실행한다.

프로덕션 소스·entry HTML은 수정하지 않았다. 필요한 코드 수정이 확인되지 않아 tracked 배열을 추정으로 확장하지 않았다. 신규 시험·본 하위 보고만 보존했다. 실제 브라우저 렌더·선택·저장/dirty와 기존 탭의 캐시·과거 history stack은 이 headless 확인에 포함되지 않는다. 대표 본체의 fresh Grapes 탭 실제 재시험으로 현장 증상 재현 여부를 분리 확인한다.
