# v4 새 화면 논리 크기 상속 보완

codex(단이) · 2026-11-16 18:04 KST · 제안(검수 대기)

본체 실제 재현: r24에서 Slot_3D 복사→새 Page_Build_City 추가→붙여넣기 시 새 화면에 logicalSize가 없어 '화면 논리 크기는 0보다 큰 10000px 이하 너비·높이여야 합니다.' 오류,0부품. source main.mjs new-screen은 모든 버전에서 크기 없는 화면을 생성했습니다.

제품 수정은 `src/tools/uxStudio/main.mjs` new-screen handler의4줄입니다. schemaVersion4에서만 선택한 page의 **저장 logicalSize**를 새 객체로 복사합니다. 모달 선택이면 entry page를 기준으로 합니다. 현재 기기390×844나 재flow logical551×1192는 기준으로 사용하지 않습니다. 새 page/modal 모두 모델v4의 필수 크기를 가집니다. v1/2/3는 기존 크기 필드 부재·schema/revision을 보존합니다. 다른 화면·원본 revision·entry를 바꾸거나 기존 잘못 생성된 화면을 소급 migrate하지 않습니다.

TDD: 실제 main handler/edited 함수를 VM에서 실행해 v4 page/modal·다른 page 상속·새 화면 paste 검증 실패4개와 legacy 성공3개를 RED로 확인한 뒤 보완했습니다. 순수 helper 추가나 새 UI·기능은 없습니다.

관련5개 파일 **36/36 통과**, main.mjs node --check exit0입니다. 새7개 시험에는551×984 상속/선택 page768×1024/모달에서 entry551×984/phone preview1192 상속 금지/한 번 Undo·dirty/기존 문서 불변/v1~3 보존이 있습니다. 실제 copySelection→pasteSelection 부모·자식2개→fixture r24 expected24 원자저장r25→파일 재열기·모델 검증도 통과했습니다. 메모리 원본 revision24는 유지됩니다. 정확한 명령·출력: `new-screen-logical-size-tests.log`.

제품 브라우저 새 화면→paste→save 검수는 대표 본체 담당이며 이 하위에서는 수행하지 않았습니다. 전체 npm test·서버·빌드·샘플 JSON·가이드·공용 보고/STATUS·외부 앱·7007은 변경/실행하지 않았습니다. 커밋하지 않았습니다.

백업: `docs/planning/_backup/20261116_단이/180102_new_screen_logical_size/src/tools/uxStudio/main.mjs`.

읽기 전용 조립 조사 메모 `build-tool-workflow.md`도 현재 상속 계약과 실제 UI 라벨로 정정했습니다. 그 메모의 복사 root 앵커 해제/offset·행동/배지 복사 범위 및 consumer 스크롤 미지원 관찰은 별도 기존 계약이며 이번 수정에 포함하지 않았습니다.
