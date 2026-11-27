# 버튼 상태 효과 두 방식 연결

작성자 codex(단이) · 2026-11-16 17:20 KST · 제안(검수 대기)

## 요청·읽은 원본

사용자가 승인한 기본 색/눌림/선택/비활성 및 상태별 이미지 변경을 실제 실행기에 연결하는 하위 소스 배정입니다. 원본은 docs/plans/20261116-monopoly-ten-screens.md, docs/plans/20261116-ai-for-ui-adoption.md, 기존 model/parts/main/layout-view/consumer/controls/notification/skins/asset-reference/commands 및 관련 시험을 읽었습니다. 기존 skin의 highlighted/pressed/selected/disabled 프레임 texture·CSS 상태를 새 일반 이미지 TargetGraphic 지원과 구분했습니다. 외부 스킬 설치·원문 코드 복사는 없습니다.

## 구현

- 새 `src/tools/uxStudio/button-state.mjs`: optional element.buttonState를 검증하고 실제 상태 표현을 담당합니다. config가 없는 기존 문서·runtime은 변경하지 않습니다. config는 `{enabled,mode:'tint'|'image',targetGraphic:'self'|descendantImageId,selectable,selected,tints:{normal,hover,pressed,selected,disabled},images?:{state:image}}`입니다. 기본 enabled/selectable/selected는 false입니다. 하위 대상은 같은 버튼 안의 실제 kind=image만 허용합니다. label/badge 전체/다른 버튼의 형제 이미지/누락 ID는 거부합니다.
- 기본 색 변화는 대상에만 sRGB SVG color-matrix를 곱하며 alpha를 유지합니다. 원본 파일·좌표·입력 영역을 바꾸지 않습니다. 기존 --ui-shadow 표현과 필터를 합성합니다. 새 그림자 자원·설정은 추가하지 않았습니다.
- 상태별 이미지는 기존 renderImagePart를 통해 자원 scope, sourceSize, region, fit, 이미지 오류 표현을 그대로 재사용합니다. 현재 상태 → normal → 대상의 기존 이미지 순으로 대체합니다. 텍스트는 별도 부품을 유지합니다. 효과 해제 시 이미 새로 렌더한 원본을 옛 controller가 덮지 않도록 보완했습니다.
- pointer hover/down/up/cancel/lost capture, focus/blur, Enter/Space down/up, repeat·Escape 취소를 처리합니다. 키보드는 release 한 번에만 활성화하며 기존 소비자·상세 편집의 keydown 합성 클릭과 중복하지 않습니다. touch pointerenter/tap focus는 hover로 남지 않습니다. interaction.enabled=false, pending, inert, 접힌 메뉴 상태는 입력/눌림을 막습니다. 기존 activate의 overlay/disabled 차단은 유지합니다.
- `model.mjs`: 검증 연결 및 명시 selectable에 한해 createRuntime/activate에서 선택 상태를 만듭니다. 새 runtime.buttonSelections[screenId][elementId]는 UI 표현용 선택 상태이며 설계 JSON의 기본 selected나 기존 게임 item selection을 변경하지 않습니다. 일시 hover/pressed/focus는 DOM에만 있고 저장·게임 값·알림 values에 섞이지 않습니다. 소비자 getState는 명시 선택 상태를 조회할 수 있고 updateState의 기존 flat primitive 표시 값 API는 유지합니다.
- `layout-view.mjs`/`consumer.mjs`: renderer의 additive runtime/buttonPreview/buttonElement 옵션으로 실제 페이지/overlay와 편집 상태 미리보기를 연결합니다. 기존 native controls·compound notification·slot DOM·부품 ID/부모는 보존합니다. 소비자 dispose/overlay 제거에서 controller와 임시 pointer listener를 해제합니다.
- `main.mjs`: '버튼 상태 효과', '효과 켜기', '효과 방식(기본 색 변화/상태별 이미지)', '효과 대상(버튼 전체/이미지 · 이름)', '선택 유지 · 누를 때 전환', '처음 선택됨', '상태 미리보기', 현재 상태 색/이미지 넣기/프로젝트 경로/이미지 해제를 추가했습니다. 명시 변경만 dirty/Undo에 기록하고 상태 미리보기는 보기 설정입니다. 이미지 업로드 중 선택·문서·상태가 바뀌면 늦은 결과를 적용하지 않습니다.
- 추가 승인한 `asset-reference.mjs`의 documentAssetImages에 상태 이미지 수집 한 줄을 추가했습니다. 기존 asset save/read/copy/검증과 동일한 경로를 사용합니다. main의 hasAssets도 새 상태 참조를 인식합니다. 기존 image/skin 계약은 보존했습니다.
- 추가 승인한 `commands.mjs`에서 paste/duplicate 시 targetGraphic의 자식 ID를 기존 ID map으로 치환합니다. self와 immutable 이미지 참조는 유지합니다.

## 확인

TDD RED: 새 모듈 부재, 기존 cleanup이 효과 해제와 동시에 변경된 원본 이미지를 옛 이미지로 덮는 재현, 복제 targetGraphic이 옛 자식 ID를 가리켜 검증 실패하는 재현을 확인한 뒤 GREEN으로 수정했습니다.

관련 16개 시험 파일 **124/124 통과**. 정확한 명령과 로그는 `_작업/codex/ux-studio/button-state-tests.log`입니다. 전체 npm test는 대표 본체 담당으로 실행하지 않았습니다. node --check는 button-state/model/main/layout-view/consumer/asset-reference/commands 7개 모두 exit 0입니다.

자동 시험 범위: 실제 DOM renderer와 mountDesignConsumer에서 대상 tint/이미지 region/기본 원복, mouse pointerup/cancel, keyboard repeat/Escape/blur 취소·release 1회, disabled 차단, touch hover/focus 복귀, 명시 selectable의 runtime 선택, 효과 해제·원본 변경·텍스트/ID 보존. 기존 알림 compound·배지 values·native control·skin·shadow·legacy 문서를 함께 확인했습니다. 자원은 실제 scoped 저장/재열기, 누락 파일·크기 불일치 거부, 독립 JSON 왕복, cross-workspace hash 복사·중복 제거를 확인했습니다. 같은/다른 화면 복제의 대상 ID 치환 및 Grapes bridge/JSON source 왕복에서 config/target ID 보존, 기존 vendor Undo 회귀도 포함합니다.

## 미확인·손대지 않은 것

실제 브라우저 색/이미지 픽셀 표현, 1440/430 CSS 화면, 실제 터치 하드웨어·성능 측정 및 샘플의 효과 적용/그림 비교는 대표 본체 담당이며 이 작업에서는 수행하지 않았습니다. DOM 실행기 지원이며 Unity 구현 완료를 주장하지 않습니다. 새 native control 효과 UI는 추가하지 않았고 기존 control 상태 동작을 유지합니다. 기존 skin.defaultState의 편집 미리보기와 새 버튼 효과 선택 설정을 구분합니다.

샘플 JSON/원본 UI·자원·가이드·공유 STATUS·공용 보고·서버·7007·외부 앱은 수정하지 않았습니다. parts/controls/notification 소스는 검토 후 재사용했으며 수정하지 않았습니다. 패키지 설치·빌드·서버 시작/재시작·사용량 자체 조회·예약 변경 없음. 신규 모듈/import에 따른 지도 갱신 필요 여부는 대표 본체가 정본 담당 범위에서 판단해야 합니다.

## 백업

`docs/planning/_backup/20261116_단이/170519_button_states/`에 수정 전 소스 및 기존 관련 시험을 상대 경로로 보존했습니다. 새 모듈/새 시험은 원본이 없습니다. 커밋하지 않았습니다. 최종 결정은 현중 검수 대상입니다.
