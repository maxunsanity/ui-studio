# r86 explicit action 누락 감사와 원인

작성: codex 하위 에이전트 · 2026-11-19 · 제안(검수 대기)

결론: 검사 범위164개 planned action 중161개가 기대 이름으로 존재하고, **TS22 명시 text2개와 TS26 명시 text1개가 실제로 누락**되었습니다. 나머지 존재 action의 문구 불일치0, 전체 문서의 duplicate ID0, 각 대상 화면 duplicate name0입니다. 이 현상을 유닛 생성 이벤트 버그로 판단할 근거는 없습니다. 본체는 기존 factory 정리 과정의 실수임을 확인했습니다.

## 고정 근거와 범위

- 실제 r86: `/Users/max/projest_max/ui-studio/samples/tile-survival/ui-studio/designs/backups/ux-25ecc98a-r86-26c646d7-9661-417a-a2cd-f31fc8b9310c.json`
- savedAt `2026-11-19T01:40:26.566Z` / SHA256 `aff8f0a5ff08cccfbb392eb0c104fa602e3fdae76eae041c6106c7042d74b048`. 11화면494부품6연결.
- b-actions의 TS19/20/21/22/26 전체 actions, a-actions의 TS12 첫24 actions만 비교했습니다. TS12 남은10개는 미제작이라 제외했습니다. TS09는 별도 native 제작이라 이 recipe 대조에 포함하지 않았습니다.
- 공장 생성 부품은 recipe action이 아니면 필수 unit 수로 세지 않았습니다. 반대로 factory ID를 재사용했더라도 explicit action alias가 소유한 부품은 planned action으로 셌습니다.
- 기대 이름은 이미 `_TSV_`가 있으면 보존, 그 외 첫 접두 뒤 `_TSV_<family>_` 삽입. button의 비어 있지 않은 action.text는 wrapper.text가 아니라 자손 native text에서 비교했습니다. text action은 자기 unit의 text를 정확 비교했습니다.

|가족|비교한 actions|actual 부품|누락|문구 불일치|actual screen ID|
|---|---:|---:|---:|---:|---|
|TS19|22|30|0|0|`screen-ebc7aec9-56d6-4ef8-b634-7a2fc668eadf`|
|TS20|27|35|0|0|`screen-8e38890f-46d1-409b-a46c-cdb4573ab5f8`|
|TS21|19|25|0|0|`screen-83044942-f30b-4cb9-98e1-de69ac1da1ec`|
|TS22|30|41|2|0|`screen-0b93cc6f-8ab1-4c94-9538-1589f22f52f0`|
|TS26|42|55|1|0|`screen-f2adfdd1-8ef6-4586-88c2-05df8e58ef6b`|
|TS12|24|26|0|0|`screen-1758a682-9d35-49e4-8994-5de636ad3e2a`|

## 실제 누락3개 · native 복원 기준

|가족 / action key|현재 recipe 기대 이름|문구|ABS504×894 rect|recipe parent / 현재 부모 ID|
|---|---|---|---|---|
|TS22 / advancedLabel|`Txt_TSV_TS22_RecruitAdvanced`|고급|{'x': 142, 'y': 828, 'w': 69, 'h': 30}|tabAdvanced / `element-df7dd4dc-f02b-425a-96f6-2baefeb49cb0`|
|TS22 / normalLabel|`Txt_TSV_TS22_RecruitNormal`|일반|{'x': 284, 'y': 828, 'w': 69, 'h': 30}|tabNormal / `element-dcb5857e-f78c-497a-9d65-28516f1511eb`|
|TS26 / requiredCopy|`Txt_TSV_TS26_BuildingRequired`|Lv.4발전소 필요!|{'x': 238, 'y': 774, 'w': 211, 'h': 31}|root / `element-7508df8f-a04d-470b-a4da-782d27b47c26`|

세 문구는 r86의 같은 화면에서 다른 이름으로도 존재하지 않았습니다. 따라서 단순 rename 누락이 아니라 표시 내용까지 없어진 상태입니다. source나 model에 값을 주입하지 않고 본체가 native UI로 복원합니다.

현재 파일 b-actions.json의 requiredCopy.name은 `Txt_BuildingRequired`였습니다. 그래서 이 감사의 기대 이름은 `Txt_TSV_TS26_BuildingRequired`입니다. 본체 메시지의 `Txt_RequiredCopy`/`Txt_TSV_TS26_RequiredCopy`는 향후 구분명 후보와 구분합니다. 의도적으로 이름을 바꿀 때 recipe/alias/확인 기준을 함께 갱신해야 합니다.

## 직접 확인한 원인 연결

1. `native-ui-scripts/tile-native-helpers.mjs:23`의 button helper는 Btn 이름에 대응하는 factory label을 `Txt_` 이름으로 만듭니다. 예를 들어 `Btn_TSV_TS22_RecruitAdvanced`는 `Txt_TSV_TS22_RecruitAdvanced` caption을 만들었습니다.
2. 뒤에 나오는 explicit text action advancedLabel의 name `Txt_RecruitAdvanced`에 prefix를 넣으면 **똑같은 `Txt_TSV_TS22_RecruitAdvanced`**가 됩니다. normalLabel과 requiredCopy도 같은 충돌 구조입니다.
3. `native-ui-scripts/tile-native-runner.mjs:8`의 `t.unit`은 같은 이름을 찾으면 새 unit을 만들지 않고 기존 ID를 pick/reparent/rect 후 반환합니다. 따라서 뒤의 explicit text action이 factory label을 **의도된 이름 재사용 경로로 소유**했습니다. 이것은 palette 생성 이벤트 실패의 증거가 아닙니다.
4. 보존 ledger `native-ui-scripts/tile-native-action-ledger.json`의 TS26 index42/total42에는 `aliases.requiredCopy = element-02239523-07cb-4444-8295-99aa6634f146-ui-label`이 기록되어 있습니다. 앞선 r72에서도 그 ID가 실제 조건문구와 Page 부모를 가졌습니다. TS22 앞선 r72의 두 explicit label도 각각 `element-df7dd4dc-f02b-425a-96f6-2baefeb49cb0-ui-label`, `element-dcb5857e-f78c-497a-9d65-28516f1511eb-ui-label`이었습니다.
5. 이후 cleanup에서 `-ui-label` suffix를 factory 잔여로 판단하여 삭제하면, 이미 explicit action이 소유한 이 세 native text도 삭제됩니다. 본체가 이 정리 실수를 확인했습니다. r86에서 세 이름·문구가 모두 사라진 결과와 일치합니다.

ID 중복은 없었습니다. **고유한 ID 하나가 factory 출신이라는 사실과, 나중에 explicit action이 그 ID를 소유한다는 사실은 동시에 참**입니다. 따라서 duplicate ID 검사만으로 이 손실을 막을 수 없습니다.

## 본체가 정한 보완 · 소스패치 요구 없음

- 앞으로 button factory caption 이름에 `_Caption`을 붙여 explicit text 이름과 구분합니다.
- button action.text가 비었으면 factory caption은 **다른 explicit action 실행 전에** 제거합니다. 뒤 단계에서 suffix로 정리하지 않습니다.
- empty caption을 없앴을 때 runner의 caption 색 지정은 `!a.text`에서 건너뜁니다. 없는 caption을 다시 select하지 않습니다.
- cleanup은 suffix만 보지 않습니다. explicit text action이 소유한 IDs를 reserve 집합으로 보존하고 실제 action/역할/text를 대조합니다.
- creation/name postcondition은 계속 유용합니다. 그러나 이번 확정 원인을 ‘실제 유닛 생성 이벤트 버그’라고 보고하지 않습니다.

## 검증 순서와 한계

- action별 기대 이름 정확1개, 자기/부모 ID와 역할, text 정확값을 확인하고 전체 필수 action coverage를 저장 뒤 다시 계산합니다.
- resume의 정상 name 재사용은 허용하되 ‘새 생성’과 ‘기존 재사용’을 로그에서 구분합니다. 새 생성 경로라면 생성 전후 owner ID 집합과 선택 ID를 비교합니다. factory 자식이 섞이는 제품이므로 모든 op의 부품 수를 무조건 +1로 고정하지 않습니다.
- cleanup 전후 coverage를 둘 다 비교하여 증가만이 아니라 삭제로 사라진 action도 찾습니다.
- 이번은 정상 파일 읽기로만 비교했습니다. GUI·API·소스·model·저장 JSON·공용 보고를 수정하지 않았습니다. 이 문서와 별도 guide-notes draft만 썼습니다.

## 후속 읽기와 완료 표현의 경계

본체 복원 도중인 r87(495부품)에서 조건문구 `Lv.4발전소 필요!`는 새 ID `element-e07f1ee3-f111-4579-967b-a6cbed7f6d6c` / 이름 `Txt_TSV_TS26_BuildingRequired`로 native 저장된 것을 파일에서 확인했습니다. 이때 TS22 두 문구는 아직 없었고 본체에 진행 중 상태로 전달했습니다. 이것은 native 동작·입력·최종3개 복원 완료를 검수한 결과가 아닙니다.
