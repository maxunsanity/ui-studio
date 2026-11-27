# native action 소유권·factory caption 정리 보정 초안

작성: codex 하위 에이전트 · 2026-11-19 · 본체 통합용 제안(검수 대기)

이 파일은 공통 가이드 수정본이 아닌 독립 초안입니다. 본체가 검토한 뒤 허용된 정본에만 반영합니다.

## r86에서 확인한 교훈

TS22의 고급/일반 글자와 TS26의 발전소 필요 문구는 explicit text action이었습니다. 생성 당시 button factory caption과 name이 같아 runner의 기존 이름 재사용 경로를 탔고, alias는 `-ui-label` ID를 소유했습니다. 이후 suffix만 보고 factory 잔여를 지운 cleanup이 이 explicit action unit도 지웠습니다. 실제 생성 이벤트가 실패했다는 근거는 없습니다. 본체는 자신의 정리 실수로 확인했습니다.

## 제작·재개·정리 규칙

1. **caption과 explicit text의 이름 공간을 나눕니다.** Btn의 자동 caption은 `Txt_..._Caption`, 직접 조립하는 text는 recipe의 고유한 목적명으로 둡니다. prefix 변환은 이미 `_TSV_`가 들어 있으면 다시 붙이지 않습니다.
2. **빈 caption은 즉시 정리합니다.** button action.text가 비어 있으면 factory caption을 button 생성 단계에서 제거한 뒤 다음 explicit action을 실행합니다. runner의 caption 색 지정은 `!a.text`일 때 건너뜁니다.
3. **ID suffix는 삭제 권한이 아닙니다.** `-ui-label`, `-ui-image`, `-ui-background`는 출생 경로만 나타낼 수 있습니다. explicit action ledger/alias가 소유한 ID는 reserve 집합으로 보존합니다. 현재 text가 비어 있는지, icon-only 버튼의 미사용 caption인지, 어떤 action의 부모·자식인지 확인한 후 normal native UI에서만 제거합니다.
4. **name 재사용을 새 생성과 구분합니다.** 재개 때 정상 action을 재사용하는 것은 가능하지만, 기존 factory child가 우연히 같은 이름을 가진 경우를 조용히 동일 action으로 처리하지 않습니다. 의도적 재사용이면 action 소유권과 이유를 기록합니다.
5. **단계별 postcondition을 남깁니다.** action 기대 이름 정확1개·원하는 kind/partRole·자기/부모 ID·문구·예정 rect를 재표시하고, 저장 뒤 mandatory action coverage를 다시 계산합니다. 새 생성 경로에는 생성 전후 owner ID 집합과 새 선택 ID를 확인합니다. factory 자식 수가 op별로 달라 단순 +1 규칙을 강요하지 않습니다.
6. **cleanup 뒤에도 coverage를 재검사합니다.** 완료 index/total과 duplicate ID0만으로 완성을 주장하지 않습니다. 계획 action이 모두 살아 있는지, 이름과 문구가 맞는지, 삭제 과정에서 coverage가 줄지 않았는지 확인합니다.
7. **복원은 native UI에서 합니다.** 저장 JSON/model 주입이나 screen 전용 코드로 누락을 채우지 않습니다. 정확한 원본 문구만 복원하고 값·게임 동작을 창작하지 않습니다.

## r86 수락 기준 예시

- TS19 22/22, TS20 27/27, TS21 19/19, TS22 30/30, TS26 42/42, TS12 제작한 첫24/24의 기대 action name/역할/문구가 보존됩니다.
- TS12 미제작10개·TS09 별도 native 조립은 이 수치에 섞지 않습니다.
- icon-only factory caption 삭제는 planned action unit의 소실로 세지 않지만, explicit action이 소유한 factory ID 삭제는 실제 손실로 셉니다.
- 모델 검사·파일 readback·실제 GUI 입력/렌더 검수를 각각 구분합니다. 이번 r86 비교 자체는 파일 기반 감사이며 GUI 완료 근거가 아닙니다.

근거: 같은 폴더 `recipe-vs-actual-r86-rootcause.md`의 고정 r86 snapshot/정확 ID/ledger/runner 근거를 따릅니다. 이번 보정은 새 패키지·서버·제품 소스 변경을 요구하지 않습니다.
