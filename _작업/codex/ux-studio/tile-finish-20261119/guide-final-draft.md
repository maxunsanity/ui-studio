# Tile Survival · native 조립에서 재사용할 AI 규칙

작성 codex(단이) 하위 에이전트 · 2026-11-19 · **본체 통합용 초안 / 제안(검수 대기)**

공통 가이드 `.39`에 아직 반영하지 않은 초안입니다. 지정 레시피·기존 감사·현재 소스를 읽어 정리했으며, 하위 에이전트는 브라우저 조립·저장·실화면 QA를 수행하지 않았습니다. 이전 인수인계의 r100·12화면은 중간 이력입니다. 최신 본체 전달은 **관찰한 31 UI 가족 중 native 22화면(TS11 진행 중 포함)**이며 전체 31가족 최종 QA는 미완료입니다. 본체가 최종 저장판·가족별 제작/QA·증거를 별도로 채웁니다. 부품·레시피 수는 완성률이나 사용자 승인 근거가 아닙니다.

## 시작과 소유권

제공 원본 분석 → 비슷한 레이아웃 샘플 찾기 → 그 샘플의 실제 계층·크기·앵커·폰트·자원·상태·연결 데이터를 먼저 제시 → 재사용/차이 정리 → 정상 편집 UI 조립 순서를 따릅니다. 대상의 workspace/projectId/revision과 부모·자식 stable ID를 기록하고, 이름 정리 때문에 ID나 유효 연결을 재발급하지 않습니다. 레시피는 실행 명세이며 저장 설계에 주입할 모델이 아닙니다. [시작 가이드:39](/Users/max/projest_max/ui-studio/src/tools/uxStudio/guide/START_PROJECT_GUIDE.md:39), [레시피 A 계약:17](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/tile-finish-20261119/recipes/a-actions.json:17)

r86 감사에서는 TS22의 고급/일반, TS26의 발전소 필요 문구가 생성 뒤 정리 과정에서 사라졌습니다. factory caption과 explicit text의 이름이 같아 기존 ID를 재사용했고, 이후 `-ui-label` suffix만 보고 지우면서 explicit action의 부품도 삭제한 사례입니다. 생성 이벤트 실패로 보고하지 않습니다. [고정 감사:36](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/tile-finish-20261119/existing-audit/recipe-vs-actual-r86-rootcause.md:36)

- 자동 caption은 `Txt_…_Caption`, 직접 조립한 글자는 고유한 목적명으로 나눕니다. 이미 `_TSV_`가 있는 이름에 접두어를 다시 넣지 않습니다.
- 빈 caption은 다른 explicit action을 실행하기 전에 생성 단계에서 정리합니다. 사용 중인 caption을 나중에 이름·ID suffix만으로 삭제하지 않습니다.
- ID가 factory에서 나왔어도 현재 action ledger/alias가 소유하면 필수 부품입니다. 정리 전 소유 action·역할·실제 문구·부모를 확인하고 소유 ID를 보존합니다.
- 재개 시 같은 이름 재사용과 새 생성을 구분합니다. 각 action 뒤 기대 이름 정확 1개·kind/partRole·ID/부모·문구·rect를 확인하고, 정리 전후와 저장 뒤 필수 action coverage를 비교합니다. duplicate ID 0·실행 index/total 일치만으로 누락을 놓치지 않습니다.

현재 helper는 caption 구분과 빈 caption 즉시 제거를 포함합니다. 이 소스 확인이 모든 기존 화면의 복구·실검수 완료를 뜻하지는 않습니다. [helper:23](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/tile-finish-20261119/native-ui-scripts/tile-native-helpers.mjs:23), [재사용/접두어 runner:7](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/tile-finish-20261119/native-ui-scripts/tile-native-runner.mjs:7)

## 복제는 실제 하위 구조를 확인한 단순 버튼에만 사용

native `duplicate`는 wrapper뿐 아니라 모든 자손에 각각 새 UUID를 부여합니다. 내부 parent 계층·상태와 출발 링크는 새 ID에 맞춰 유지하지만, 선택 번들 최상위의 parent/inset/rectTransform/useSafeArea는 해제하고 화면 기준 legacy % rect에 x/y 각각 +2%를 줍니다. 복제 뒤 부모와 앵커를 다시 설정해야 하며 자손 ID를 `새wrapper-ui-label` 같은 suffix로 추측하지 않습니다. [복제 UI:2674](/Users/max/projest_max/ui-studio/src/tools/uxStudio/main.mjs:2674), [최상위 평탄화:20](/Users/max/projest_max/ui-studio/src/tools/uxStudio/commands.mjs:20), [ID/계층/상태/링크 재매핑:37](/Users/max/projest_max/ui-studio/src/tools/uxStudio/commands.mjs:37)

- 복제 원본은 실제 DOM 자손이 **background 1개 + 필요한 Caption 최대 1개**인 것으로 확인된 단순 Button만 고릅니다. 원본에 rich image/별도 본문·추가 Group·다른 action 소유 자식이 있으면 사용하지 않습니다.
- 복제 전후 자손 개수·role·직접 부모와 새 ID 집합을 확인합니다. label은 실제 조회 ID로 찾고, 기존 explicit action ID/alias는 보존합니다. 화면상 정상처럼 보여도 계획에 없는 복제 자손을 남기지 않습니다.
- 본체는 TS06에서 그림·본문 자손까지 복제된 것을 발견했고 r171에서 **실제 매핑으로 확인한 복제 extras만** 정상 UI로 제거했다고 전달했습니다. suffix 일괄 삭제로 처리한 것이 아닙니다. 삭제 뒤 필수 action coverage·실제 문구·부모/입력과 저장판을 다시 확인합니다.

본체는 실행 helper의 count/role/parent guard를 보완했다고 전달했습니다. 이 문서는 그 전달 사실과 제품 복제 소스를 구분합니다. 현재 디스크의 [보존 clone helper:2](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/tile-finish-20261119/native-ui-scripts/tile-native-clone.mjs:2)는 복제 전 count/role/parent guard가 없는 판이므로 최신 실행본·r171 증거는 본체 최종 기록에 연결해야 합니다.

## 그림·프레임·글자·입력은 따로 조립

| 부품 | 제작 규칙 |
|---|---|
| 입력 wrapper | 클릭 범위와 행동을 소유합니다. 시각 그림·글자·실루엣 크기와 구분합니다. |
| BG/Frame | 필요한 판 내부는 불투명, 부품 외곽은 실제 알파로 만듭니다. 가변 프레임은 3/9슬라이스로 source slices·화면 edges·content padding을 각각 설정합니다. 버튼 입력이라고 9슬라이스 그림을 3슬라이스로 바꾸지 않습니다. |
| Img | `kind=image`, `partRole=image`. 실제 별도 자원과 fit/atlas region을 사용합니다. 부모 bbox·알파 실루엣·입력 경계를 같은 크기로 취급하지 않습니다. |
| Txt | `kind=text`, `partRole=label`. 글자·가격·수량을 이미지에 굽지 않습니다. 기본 백판이 보이면 역할을 바로잡고, 글자가 뒤에 가렸으면 앞뒤 순서를 고칩니다. |
| Slot_3D | 원본 3D 구역은 빈 슬롯과 ‘3D 영역’ 표시로 남깁니다. 전체 화면 슬롯과 고정 높이의 부분 scene을 구분합니다. 캐릭터/월드 2D 그림이나 스크린샷으로 채우지 않고 HUD/본문/버튼은 별도 2D 부품으로 둡니다. |

배경만 지우려고 자식이 있는 wrapper의 opacity를 0으로 만들면 글자·그림도 함께 사라집니다. 투명 입력 wrapper는 `partRole=frame`으로 표면 fill을 없애고 부모 opacity는 1을 유지합니다. 반투명 dim/패널 색은 투명 frame 컨테이너 안의 **별도 `BG_<role>_Tint` leaf**에 `#RRGGBB` 색과 `appearance.opacity`를 나눠 적용합니다. Txt/Img는 이 leaf의 자식이 아닌 형제로 두어 완전 불투명을 유지합니다. 본체의 alpha 부모 보완도 group opacity를 낮추지 않고 이 구조로 분리했습니다. [실행 runner 분리:15](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/tile-finish-20261119/native-ui-scripts/tile-native-runner.mjs:15) 색 필드에 8자리 HEX나 rgba를 넣지 않습니다. 원화 알파와 유닛 전체 opacity도 별개입니다. [역할 검증:77](/Users/max/projest_max/ui-studio/src/tools/uxStudio/parts.mjs:77), [렌더 역할/opacity:154](/Users/max/projest_max/ui-studio/src/tools/uxStudio/layout-view.mjs:154), [6자리 색/opacity 계약:141](/Users/max/projest_max/ui-studio/src/tools/uxStudio/units.mjs:141), [3D 계약:199](/Users/max/projest_max/ui-studio/src/tools/uxStudio/guide/AI_GUIDE.md:199)

본체는 factory label이 BG 안쪽을 부모로 가져 좌표·입력 경계가 어긋난 사례를 전달했습니다. label을 Btn의 직접 자식으로 옮긴 뒤 **새 부모 기준 local rect**를 다시 설정하고 BG와 label의 입력을 `parent`로 유지합니다. 이번 helper의 `x4/y0/W−8/H`는 해당 제작값이며 모든 게임의 고정 규격은 아닙니다. [본체 경험 초안:307](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/tile-finish-20261119/spec-b/guide-addendum-draft.md:307)

## 입력 전달과 실제 컨트롤

버튼의 시각 자식과 중간 Group은 owner까지 매 단계 `parent`여야 합니다. `none`은 표시 전용, `block`은 전달을 멈추는 입력 차단입니다. `interaction.enabled`는 실제 사용 가능, `buttonState.enabled`는 눌림 등 시각 효과이므로 각각 확인합니다. [입력 owner 탐색:12](/Users/max/projest_max/ui-studio/src/tools/uxStudio/parts.mjs:12), [UI 필드:3271](/Users/max/projest_max/ui-studio/src/tools/uxStudio/main.mjs:3271)

편집 입력·체크·탭을 그림/글자로만 흉내 낸 상태로 마감하지 않습니다. 타입 → 항목 → 기본값 → 같은 화면 본문 → disabled/readonly 순서로 기존 native control을 설정합니다. 타입을 바꾸면 기본 control이 다시 만들어지므로 새 필드를 다시 찾습니다. control 자신과 모든 조상은 native button 안에 중첩하지 않습니다. 전체면 닫기와 본문 control이 함께 있으면 비버튼 root 아래 닫기면과 본문/차단 그룹을 형제로 둡니다. [타입 초기화:9](/Users/max/projest_max/ui-studio/src/tools/uxStudio/control-inspector.mjs:9), [native 필드 생성:197](/Users/max/projest_max/ui-studio/src/tools/uxStudio/controls.mjs:197), [조상 button 제한:154](/Users/max/projest_max/ui-studio/src/tools/uxStudio/controls.mjs:154)

- TS12 닉네임, TS29 채팅란은 실제 input으로 입력/선택/Tab을 확인합니다. 보이는 문구만으로 편집 가능이라 쓰지 않습니다.
- TS21/22/26/29/31의 본문 선택은 tabs 계약을 사용합니다. options는 한 줄에 `value | label`, panelId는 **같은 화면**의 겹치지 않는 본문입니다. 현재 tabs의 tabSkin은 normal/selected 3슬라이스만 지원합니다.
- TS24 영상 스킵은 실제 toggle 값으로 확인합니다. TS30 편지함↔도감은 화면 간 내비이므로 다른 screen ID를 tabs.panelId로 넣지 않습니다. 레시피의 ‘bottom tabs’ 표현보다 이 연결 계약을 우선합니다.
- runtime 입력값과 저장 설계의 기본값을 구분합니다. 미관측 탭 본문·채팅·통계·선택 결과를 복제하거나 발명하지 않습니다. 값 변화는 실제 게임 발송/모집/API 완료가 아닙니다.

근거: [A의 native 입력 요구:689](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/tile-finish-20261119/recipes/a-actions.json:689), [B control 매핑:91](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/tile-finish-20261119/spec-b/guide-addendum-draft.md:91), [tabSkin/같은 화면 계약:61](/Users/max/projest_max/ui-studio/src/tools/uxStudio/controls.mjs:61), [숨은 본문 inert:170](/Users/max/projest_max/ui-studio/src/tools/uxStudio/controls.mjs:170)

## 같은 역할 규격과 앵커

같은 family/variant의 wrapper·아이콘·글자·기준선·입력 W/H를 맞춥니다. B 레시피 예시는 뒤로 wrapper 74×64/아이콘 38², 일반 2분할 CTA 200×64, 주민 카드 130×172입니다. 초상 탭·큰 단일 CTA 등 다른 variant를 색이 같다는 이유로 같은 폭에 억지로 맞추지는 않습니다. 이 값은 Tile 제작안이며 다른 게임에 강제하지 않습니다. [규격 비교:36](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/tile-finish-20261119/spec-b/guide-addendum-draft.md:36)

레시피 rect는 절대 논리 504×894이고 parent는 앞선 action key입니다. 정상 UI에서 실제 부모 기준 좌표로 옮깁니다. `anchorPreset`은 UI 저작 힌트이며 저장 모델 필드나 적용 완료 증거가 아닙니다. 먼저 기준 크기에서 rect를 복원한 뒤 앵커를 고릅니다. 프리셋은 현재 rect를 보존하므로, 이미 늘어난 H에 프리셋만 적용하면 잘못된 H가 고정됩니다.

전체 root/전체 3D 슬롯은 stretch, 부분 scene·고정 버튼/아이콘/글자는 필요한 높이를 보존하는 앵커, 가변 viewport는 stretch-y로 나눕니다. 고정 wrapper 안 자식 %와 가변 root 아래 자식 %를 구분합니다. center는 화면 정중앙으로 강제 이동하는 뜻이 아닙니다. 자동 배치 자식은 부모 itemSize/grid가 크기를 정하므로 자식 앵커·inset·safeArea를 혼합하지 않습니다. [앵커 변환:24](/Users/max/projest_max/ui-studio/src/tools/uxStudio/responsive-inspector.mjs:24), [배치 해석/제한:32](/Users/max/projest_max/ui-studio/src/tools/uxStudio/responsive-layout.mjs:32), [B 앵커 힌트:5](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/tile-finish-20261119/recipes/b-anchor-hints.md:5)

본체는 TS13의 214px 부분 scene을 세로 stretch로 두었을 때 논리 높이 672에서 계산 H가 −8이 된 것을 확인했습니다. 정상 UI에서 **stretch-x로 바꿔 H214를 보존**한 뒤 r165의 3개 논리 높이 responsive resolver 검사가 통과했다고 전달했습니다. 한 크기에서 양수인 배치만 확인하지 말고 지원할 짧은/기준/긴 높이에서 모든 rect의 양수 H/W를 확인합니다. 디스크 레시피의 [scene 힌트:1854](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/tile-finish-20261119/recipes/a-actions.json:1854)는 아직 stretch인 이전 판이므로 실제 보정과 구분하고 재사용 전에 맞춥니다. 수치 시험 통과를 세 기기의 실화면 QA로 적지 않습니다. [양수 rect 검증:44](/Users/max/projest_max/ui-studio/src/tools/uxStudio/responsive-layout.mjs:44)

## UI 입력 commit과 비동기 가져오기

필드 호출 성공과 저장값 반영을 구분합니다. 본체의 일반 text/number/textarea 입력 경로는 현재 선택 확인 → 전체 선택 → `pressSequentially` → Tab → 재표시값 확인 → 저장/재열기입니다. select는 selectOption, checkbox는 현재 상태를 읽고 setChecked로 조작하며, 재렌더 뒤 locator/현재 선택을 다시 확인합니다. fill/type/paste만 성공하고 값이 안 바뀌어도 즉시 제품 버그로 단정하지 않습니다. [현재 helper 입력:5](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/tile-finish-20261119/native-ui-scripts/tile-native-helpers.mjs:5)

이미지/프레임 경로 입력+Tab 뒤에는 fetch·decode·workspace 업로드가 끝난 것을 확인하고 다음 선택/편집을 합니다. 프레임/탭 import는 도중 선택이 바뀌면 취소됩니다. 필드 초기화, 원본 크기·assetRef/실제 그림 표시를 확인한 뒤 fit/region을 설정합니다. atlas는 X/Y/W/H 네 값을 모두 입력하고 ‘이미지 영역 적용’을 누릅니다. 조각이 맞아도 전체 HTTP/알파/실제 paint 통과를 대신하지 않습니다. [비동기 프레임 선택 보호:1732](/Users/max/projest_max/ui-studio/src/tools/uxStudio/main.mjs:1732), [일반 이미지 가져오기:1936](/Users/max/projest_max/ui-studio/src/tools/uxStudio/main.mjs:1936), [이미지/프레임 UI:3279](/Users/max/projest_max/ui-studio/src/tools/uxStudio/main.mjs:3279)

## 소스 지원과 현재 사용 가능한 저장 경로

현재 소스의 조립 함수는 기존 schemaVersion 4를 3으로 낮추지 않도록 `Math.max(d.schemaVersion, 3)`를 사용합니다. 토글의 선택 표시는 선택적 `choiceShape/choiceSize/choiceColor`, native input의 외형은 appearance를 읽습니다. 새 필드 없는 기존 control은 기본 경로를 유지합니다. [schema 보존:157](/Users/max/projest_max/ui-studio/src/tools/uxStudio/skins.mjs:157), [선택 필드 검증:42](/Users/max/projest_max/ui-studio/src/tools/uxStudio/controls.mjs:42), [선택/input 외형:276](/Users/max/projest_max/ui-studio/src/tools/uxStudio/controls.mjs:276), [inspector:78](/Users/max/projest_max/ui-studio/src/tools/uxStudio/control-inspector.mjs:78)

본체 전달 기준 통합 소스 시험은 696/696이지만 이 초안 작성자가 재실행한 결과는 아닙니다. 실행 중 backend의 구 validator는 별도이며 서버 재시작 승인이 대기 중입니다. 새 선택 필드의 native 저장은 아직 수행하지 않았습니다. 따라서 소스 통과를 현재 서버 저장 호환·실화면 합격으로 확대하지 않습니다. 본체가 승인/서버 상태·실제 저장 왕복 증거를 확인한 뒤 이 문단을 갱신합니다. 이 초안은 서버 시작·재시작 권한을 부여하지 않습니다.

## 본체 최종 QA 체크리스트

아래는 **수행할 항목**이며 하위 에이전트의 통과 기록이 아닙니다.

- [ ] 최종 workspace/projectId/revision·31가족별 제작/미제작·QA/미검수·증거를 대조한다.
- [ ] 필수 action 이름·역할·문구·부모/자식·ID를 정리 전후/저장 뒤 확인하고, caption 충돌·누락·복제 extras가 없는지 확인한다. 단순 버튼만 실제 DOM 자손 count/role/parent로 복제하고 새 ID를 suffix로 추측하지 않는다.
- [ ] 그림·프레임·native 글자·입력 분리, 불투명 판/알파 외곽, leaf opacity, 빈 3D 슬롯을 확인한다.
- [ ] 같은 variant의 크기/기준선·3/9 slices/edges/padding·atlas region/fit·자원 등록과 실제 표시를 확인한다.
- [ ] 1440px·430px·논리 390×844에서 앵커/고정 크기·긴 글 잉크/줄바꿈·고정 header/footer·스크롤/넘침·이미지/링크 실패를 확인한다. 짧은/기준/긴 높이의 rect 양수 검사와 실화면 QA를 구분하고 CSS/논리/캡처 픽셀을 따로 기록한다.
- [ ] mouse·Enter·Space의 단일 입력 owner, parent 전달, enabled와 시각상태, 눌림/해제 복원을 확인한다.
- [ ] input/toggle/tabs의 기본값과 runtime 값·키보드·disabled/readonly·한 본문 표시/inert를 확인한다. 가짜 입력/미관측 본문을 남기지 않는다.
- [ ] 관측 연결의 실제 진입→닫기/Back→복귀·배후 차단·초점을 시험한다. 미관측 입구/목적지/게임 결과는 미확인으로 남긴다.
- [ ] 비동기 자원 적용 완료·저장·같은 문서 재열기·다른 workspace 격리를 확인하고 새 선택 필드는 실행 validator와 저장 왕복까지 따로 검증한다.
- [ ] 원본 관찰/제작 제안/추정/미확인, 소스 시험/파일 대조/실화면을 분리한다. 전체 시각 동등·게임 구현·사용자 승인 완료를 주장하지 않는다.

**본체 마감 기입란:** 최종 revision `미기입` · native 가족 `미기입/31` · 최종 QA `미기입/31` · 신규 선택 필드 저장 검증 `미기입` · 실제 캡처/보고 `미기입`.
