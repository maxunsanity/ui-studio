# 타일 레시피 B · 최종 QA 체크리스트와 공통 경험 가이드 초안

작성자 codex(단이) · 2026-11-19 · 제안(검수 대기)

**상태: 레시피 정적 검토 초안 / 실제 native 화면 QA 아님.** 본체만 일반 UI로 조립·입력·저장·재열기·실화면 검수를 수행합니다. 이 파일은 공통 가이드에 아직 반영하지 않았습니다. 공통 가이드·카탈로그·저장 설계·제품 소스·원화 변경은 없습니다.

## 이번에 확인한 근거

- recipes/b-actions.json: TS19–TS31 중 TS25 제외 12가족, 347개 조립 행동.
- spec-b/existing-image-map.json: r63 고유 등록자원48개/93참조, 실제파일 크기·SHA·원본 선언.
- art/art-manifest.json: 새 atlas 파일·cell/권장region·alpha 경계. 새 atlas 4장을 실제 열어 확인했습니다.
- 현재 공통 guide/index.json 판은 2026-11-18.39. START_PROJECT_GUIDE.md, USER_GUIDE.md, TOOL_SPEC.md, AI_GUIDE.md 관련 계약을 읽었습니다.
- 정확 UI 필드 근거: src/tools/uxStudio/control-inspector.mjs의 입력 종류와 inspector 필드 정의, main.mjs:3263–3297, parts.mjs:2–21, controls.mjs:13–84 및 230–310.
- 본체의 경험 전달: raw 본문은 partRole=label을 명시해야 기본 백판이 사라짐. factory의 interaction.enabled와 buttonState.enabled가 별개라 본체가 UI helper에서 각각 보정함. 이 사실은 본체 보고이며 제가 실화면으로 재검증한 결과가 아닙니다.
- 저장원문 r69를 읽을 때 TS22가 일부 native 조립되어 있었습니다. 본체는 이후 실제 캡처에서 중복 글자가 없고 빈 compound label을 최종 QA 때 정리한다고 확인했습니다. 저장원문의 중간 텍스트만 보고 현재 실화면 중복이라고 결론내리지 않습니다.

## 확정한 레시피 보정과 남은 실화면 확인

본체 승인에 따라 아래 세 건만 action recipe에 보정했습니다. 모델/저장 설계는 수정하지 않았습니다.

| 가족/key | 보정 전 → 후 | 이유 |
|---|---|---|
| TS22/recruitType | h77 → h68, y506 유지 | tutorialName과3px, tutorialPortrait와5px의 rect 교차 제거 |
| TS28/subtitle | y207/h28 → y205/h24 | progress 숫자 rect와5px 교차 제거 |
| TS31/relationLabel | w63 → w55, x190 유지 | relation 텍스트 rect와3px 교차 제거 |

보정 후 explicit text끼리의 rect 교차는 0입니다. 이것은 glyph/실제 줄바꿈/DOM paint가 통과했다는 뜻이 아닙니다.

- TS26/power와 powerHelp rect의3px 교차는 실제 글자 잉크가 안 겹칠 수 있습니다. 5,744의 끝과 !의 간격을 실화면에서 확인합니다.
- TS30/title rect와 help 버튼 rect도 여백을 포함해 겹칩니다. 실제 제목 잉크와 ? 사이 간격을 확인합니다. 임의로 원문을 줄이지 않습니다.
- TS31/joined: 18px/245px폭의 긴 한줄은 실제 서체에 따라 넘칠 수 있습니다. native 한줄/실제폭을 확인하고 필요하면16px로 조정합니다. 이는 미측정 위험 판단입니다.
- TS27/title과 recruitIcon rect는7px 교차합니다. 원본처럼 글자와 카드 아이콘의 실제 잉크가 분리되는지 확인합니다. 필요시 title h54로 좁히는 제작 보정 후보입니다.
- TS30/name_jimmy와 floating claimChest rect의 교차는 지미 글자 자체와 겹친다는 뜻이 아닙니다. 도감 상자 원본도 하단 카드 위에 떠 있습니다. 실제 잉크와 클릭 소유자만 확인합니다.
- 관계pill/후보레벨/쿨다운/보상수량/진행문구처럼 원본이 아트 위에 표시한 글자는 의도한 겹침입니다. BG·이미지·native 글자를 합치지 않습니다.

## 같은 역할 규격 점검

| 역할 가족 | 레시피 규격 | 결과 |
|---|---|---|
| 뒤로 wrapper | TS19/22/24/26/29/30 모두74×64 | 동일 |
| 뒤로 이미지 | 모두38×38, 원본44² contain | 동일 |
| footer | 위6화면504×76, y818 | 동일 |
| 2분할 행동 CTA | TS19 일괄/출격, TS24 1회/10회 모두200×64 | 동일 |
| 글자형 footer 탭 | TS26 속성/스킬, TS30 편지함/도감 모두200×64 | 크기 동일, x/상단위치는 소스 근사 variant 차이 |
| 모집 초상형 탭 | TS22 두 개141×72, 내부초상 약60×66 | 별도 variant. 글자형 탭과 억지로 합치지 않음 |
| 전투 스킬 카드 | TS20 두 개87×102, 초상79×91 | 동일 |
| 도감 주민 카드 | TS30 여섯 개130×172, 초상114×124, 이름122×26, 관계104×25 | 동일 |
| 스토리 탭 | TS31 네 개91×44 | 동일 |
| 같은 사건 헤더 | TS19/20 같은 양측초상54²·중앙122×67·수치20px | y만 다르고 같은 역할 |
| 일반 표제 | 소대/모집/채팅/도감28px·800 | 동일. 승리/해제/축하는 별도 큰표제 variant |

무료모집266×64, 전투복귀336×64, 친밀도CTA224×63은 원본 배치가 다른 별도 variant입니다. 단순히 모두 녹색이라는 이유로 같은 가로폭을 강제하지 않습니다. 최종H를64로 묶을지는 본체가 원본/실화면 비교로 정할 작은 제작 선택이며 현재 recipe는 근사를 보존했습니다.

## 3슬라이스와 9슬라이스는 입력 종류와 독립

| 정확한 기존 자원 | 실크기 | 방식 | 원본 분할(상우하좌) | 화면 edge | padding |
|---|---:|---|---|---|---|
| geometry/button-green3.webp |160×64|3|0,20,0,20|0,12,0,12|0,0,0,0|
| geometry/hud-blue9.webp |64²|9|8,8,8,8|3,3,3,3|0,0,0,0|
| geometry/paper-blue9.webp |96²|9|12,12,12,12|3 또는6, 용도별 r63 그대로|0,0,0,0|
| geometry-v003/hero-card-purple9-v003.webp |111×180|9|9,9,9,9|8,8,8,8|0,0,0,0|
| geometry-v003/hero-card-orange9-v003.webp |111×180|9|9,9,9,9|8,8,8,8|0,0,0,0|
| geometry-v003/hero-card-teal9-v003.webp |111×180|9|9,9,9,9|8,8,8,8|0,0,0,0|

경로는 모두 /ui-studio/source/assets/import-staging/tile-survival- 접두의 existing-image-map에 있는 정확 URL을 사용합니다. 위 표의 geometry는 tile-survival-geometry, geometry-v003는 tile-survival-geometry-v003입니다.

- Btn wrapper라도 BG가9slice일 수 있습니다. 버튼 기능 때문에 그림을3slice로 바꾸지 않습니다.
- 본체는 정보백판9 유닛 → native 종류button/자체동작으로 바꾸고9 BG/독립Txt를 유지하는 helper가 동작한다고 보고했습니다. button-green3 factory는3slice를 유지합니다.
- 프레임 방식 선택 selector는 select[data-skin-mode], 값 backplate=정보 백판·9슬라이스, button=버튼·3슬라이스입니다.
- 원본 분할·고정폭·내용여백은 [data-skin-field="slices.0~3"], edges.0~3, padding.0~3입니다. 테두리·중앙 확장은 repeat=stretch입니다.
- panel9 소스를 button3 틀에 가져온 뒤 기본 분할선을 그대로 두면 모서리가 깨질 수 있습니다. 원본파일 교체와 slice/edge 설정은 별도 확인합니다.
- native control.tabs의 tabSkin은 현재 **3slice만** 지원합니다(controls.mjs:61). 이 탭 프레임에9slice용 그림을 그대로 넣어9를 지원한다고 주장하지 않습니다.9slice 초상형 장식과 native 탭값/본문 선택을 함께 쓰는 경우 실제 paint·입력·선택 표시를 확인해야 합니다.

## 입력·글자 분리에서 얻은 공통 경험 초안

1. raw 텍스트를 만들면 종류=text, 부품역할=텍스트(label)를 명시하고 글자·색·크기·줄높이를 입력합니다. 백판을 없애려고 전체 opacity를0으로 낮추면 글자까지 사라질 수 있으므로 역할을 바로잡습니다. 부모 이동 뒤 BG 뒤로 가려졌다면 새 글자를 중복 생성하지 말고 앞뒤 순서를 수정합니다.
2. 클릭 가능은 게임 입력=자체 동작(action), 사용 가능(interaction.enabled)으로 정합니다. 버튼 상태 효과의 효과 켜기(buttonState.enabled)는 tint/image 효과 설정이며 클릭 가능 스위치가 아닙니다.
3. visual 자식은 부모에 전달(parent), action이 필요 없는 장식은 표시 전용(none), 모달 본문처럼 바깥 닫기로 올라가면 안 되는 영역은 입력 차단(block)입니다. 중간 Group에서 전달이 끊기지 않는지도 확인합니다.
4. controls는 button 안에 중첩하지 않습니다. TS31처럼 fulltap 닫기와 story tabs를 함께 쓰려면 비버튼 모달root 아래에 전체화면 닫기면과 내용/입력차단 그룹을 형제로 두는 구조가 안전합니다. X·탭은 각각 자기 입력을 소유합니다. TS23/TS27처럼 별도 control이 없는 fulltap 화면은 전체입력 wrapper를 쓸 수 있습니다.
5. control 타입을 바꾸면 기본값/항목/필드가 다시 생성됩니다. 순서는 입력 종류 → options → value → panel 대상 → disabled/readonly → 저장입니다. checkbox나 타입 변경 후에는 현재 선택/새 필드를 다시 찾고 Tab/blur와 재표시를 확인합니다.
6. empty compound label 자체는 보이지 않는 빈 부품일 수 있습니다. 이미지/별도Txt가 있는 버튼의 wrapper와 입력은 유지하고, QA 때 사용하지 않는 빈 label만 구분해 정리합니다. 이름이나 text값만 보고 현재 보이는 중복 글자라고 단정하지 않습니다.
7. 일반 select/toggle/input 동작은 native 런타임 fixture값을 바꿀 뿐 실제 모집·재화·채팅발송·성장을 실행하지 않습니다. 실제 게임 결과가 관찰되지 않은 버튼에 새 API/가짜 결과를 연결하지 않습니다.

정확한 UI 항목:
- 부품 역할: select[data-part-field="partRole"], label=텍스트, image=이미지, background=바탕, container=구성 전체.
- 게임 입력: select[data-part-field="mode"], action=자체 동작, parent=부모에 전달, none=표시 전용, block=입력 차단.
- 사용 가능: input[data-part-field="enabled"] checkbox. 버튼 상태 효과: input[data-button-field="enabled"] checkbox. 서로 다른 필드입니다.
- 실제 입력 도형: select[data-part-field="shape"], rectangle/ellipse. 이 범위는 wrapper의X/Y/W/H입니다.
- 이 selector 목록은 현재 소스의 UI 정의를 읽은 근거입니다. 브라우저에서 실제 조작·존재 확인한 결과가 아닙니다.

## 필요한 실제 native control 7개와 reference key

아래 key는 action recipe의 참조 이름이며 새 engine ID가 아닙니다. 실제 element ID는 본체가 현재 UI에서 확인한 것을 선택합니다. 고유 이름/ID/부모/연결을 보존합니다.

| 가족 / recipe 참조 | 현재 필요한 control | options / 기본값 | 본문 연결과 주의 |
|---|---|---|---|
| TS21 tabAttack,tabDamage | Input_TSV_TS21_StatsTabs · tabs | attack → 공격&치료<br>damage → 받은 데미지<br>기본attack | Attack본문=이번2행. Damage본문=관측 안 됨·빈본문. 가짜 통계 생성 금지 |
| TS22 tabAdvanced,tabNormal | Input_TSV_TS22_RecruitTabs · tabs | advanced → 고급<br>normal → 일반<br>기본normal | 상단재화/뒤로는공통. Normal=일반무료5. Advanced는R02관측값만 별도상태로 만들 때 연결 |
| TS26 attributes,skills | Input_TSV_TS26_HeroDetailTabs · tabs | attributes → 속성<br>skills → 스킬<br>기본attributes | 능력/성장본문과 미관측스킬본문 분리. 영웅공통header/3D는본문밖 |
| TS29 stateTab,privateTab | Input_TSV_TS29_ChatTabs · tabs | state → 스테이트<br>private → 개인<br>기본state | 이번피드는state. Private본문 미관측·가짜채팅 생성 금지 |
| TS31 storyTabI/II/III/IV | Input_TSV_TS31_StoryTabs · tabs | story_i → 스토리 I<br>story_ii → 스토리 II<br>story_iii → 스토리 III<br>story_iv → 스토리 IV<br>기본story_i | I본문=정확한한문장. II–IV는미관측·본문복제금지. 비버튼 조상으로 구성 |
| TS24 skipBox,skipText | Input_TSV_TS24_SkipVideo · toggle | 기본false, group공백 | text=영상 스킵. 기존가짜checkbox박스/문구와중복표시하지않음. 토글이CIN03스킵게임동작을실제로구현한것은아님 |
| TS29 input,placeholder | Input_TSV_TS29_Message · input | value빈문자열, maxLength1000, validation none, required false | placeholder=영문 알파벳은 최대 1000자 입력할 수 있습니다. source문구기준. 실제발송없음 |

위 표의 options는 **한 줄에 value | 표시 이름** 형식으로 입력합니다. 표의 구분기호가 실제 줄바꿈을 대신한 설명이므로 textarea에는 항목별 새 줄을 넣습니다. value는 UI용 fixture key이며 제품 데이터 ID가 아닙니다.

TS30의 편지함/도감은 TS15↔TS30의 **화면간 내비**입니다. control.tabs의 panelId에 다른 화면 ID를 넣지 않습니다. Btn_MailboxTab/Btn_CatalogTab 외관과 정상 화면 연결로 둡니다. TS19 후보는 선택체크를 관찰했지만 실제 배치결과는 미관측이며 native toggle을 새 gameplay로 붙일 의무가 없습니다. TS20 자동/배속은 이번 대표가 잠금이므로 display/disabled 상태이며 새 dropdown/배속항목을 만들지 않습니다.

### 정확한 native control UI 설정 순서

1. 레이어에서 위 control용 비버튼 컨테이너를 선택합니다. 입력·선택 동작(details.control-inspector)을 엽니다.
2. select[data-control-field="type"]의 값: 공백=표시·일반 버튼, toggle=토글, tabs=선택 탭, toggle-group=단일 선택 목록, slider=슬라이더, scrollbar=스크롤바, dropdown=선택 상자, input=텍스트 입력.
3. 옵션형은 textarea[data-control-field="options"]에 한 줄씩 value | label을 입력합니다. input[data-control-field="value"]로 기본값을 명시합니다.
4. tabs는 select[data-control-field="panel.VALUE"]에서 같은 화면의 본문 root를 선택합니다. UI에는 본문이름 · 실제elementID가 표시됩니다. '연결 안 함'은 공백 값입니다. 대상은 탭 자신/상위부모/중복본문/겹친 계층이면 안 됩니다.
5. 글자표시는 select[data-control-field="labelMode"]: text=글자 표시, icon=아이콘만. icon은 보이는 글자만 숨기고 옵션label/ARIA이름은 유지합니다.
6. 탭 프레임·3슬라이스는 input[data-control-field="tabSkin.enabled"]. 우/좌 분할은 tabSkin.slices.1/.3, 우/좌 고정폭은 tabSkin.edges.1/.3입니다. 기본/선택 이미지 경로는 [data-tab-project-image="normal"] / [data-tab-project-image="selected"]입니다.
7. toggle 기본 켜짐은 input[data-control-field="value"] checkbox, 단일선택그룹은 [data-control-field="group"]입니다. 여기선 영상스킵이 독립이라 group은 비웁니다.
8. input 안내문구는 [data-control-field="placeholder"], 최대글자는 maxLength, 입력검사는 validation(none/email/number), 필수입력은 required checkbox입니다. 기본value는빈문자열, 필요 이상의 검증을 추가하지 않습니다.
9. 모든 control의 사용 불가=disabled, 읽기 전용=readonly checkbox를 확인합니다. interaction.enabled도 별개로true여야 실제시험에서 동작합니다.
10. 선택/checkbox재렌더 후 새 필드를 다시 찾고 Tab/blur → 재표시 → 저장 → 재열기합니다. 동작 시험에서 값이 바뀌어도 설계기본값이 바뀐 것으로 기록하지 않습니다.

### 탭/입력 시험의 실제 기준

- tabs: 클릭·Tab·방향키/Home/End·선택상태·하나의본문만표시·숨은본문inert/입력차단·초점복귀.
- toggle: 기본해제/클릭·Space전환·readonly/disabled가의도대로차단되는지. 실제영상스킵게임로직완료로쓰지않음.
- input: 기본값빈칸·placeholder·native입력/선택/Tab·1000자상한·저장기본값대runtime값분리. Send를실제발송했다는기록없음.
- TS31: 본문 안 클릭은닫기안됨, 바깥닫기/X/Escape는선택한정책대로, 닫힌뒤TS30수잔카드초점/스크롤복귀. Escape/바깥닫기의원본정확정책은관측범위를넘어확정하지않음.
- native scroll-y는 TS29 feed/TS30 viewport에서만. scrollbar control을 추가한다고 실제본문 overflow 스크롤이 생기는 것은 아닙니다.

### 저장 r69에서 읽은 TS22 ID 참고

- screen: screen-0b93cc6f-8ab1-4c94-9538-1589f22f52f0.
- Advanced wrapper: element-df7dd4dc-f02b-425a-96f6-2baefeb49cb0.
- Normal wrapper: element-dcb5857e-f78c-497a-9d65-28516f1511eb.
- Free CTA: element-9d452f28-0489-4964-9000-8b187584cc66.
- Back: element-336cea2f-3745-42d6-b3bf-f0bddd0fa33b.

이후 native 편집중이므로 최신현재값이라고 보장하지 않습니다. 다음가족의 native ID를 예상해서 만들지 않습니다.

## 이미지 fit/region 최종 점검

- 레시피67 image참조/90 skin참조가 가리키는25파일은 모두존재·300000bytes이하이고 region이 원본범위 안입니다. 이것은 실제 HTTP/렌더/등록성공 증거와 다릅니다.
- TS30 주민6명은 같은150²cell+같은114×124 box/contain입니다. 카드별멋대로crop하여얼굴크기를다르게만들지않습니다.
- TS31 수잔은 같은원화를119×151 box/150²region으로contain하므로 세로여백이 생길수있습니다. 프로필variant에서 실제 여백이 크면 atlas의alpha bbox [168,151,115,144]를검토할수있지만카드6명공통region을한꺼번에바꾸지않습니다.
- TS22 recruitTrio의312×190 region을504×420 contain으로넣으면 실제그림높이는약308이고 위아래여백이생깁니다. 아트를늘리거나cover로바꿔얼굴을자르기전에 의도한새홍보삽화배치인지확인합니다.
- TS30 community의312×190 region/450×192 contain은 가로여백이생기는제작배치입니다. 원본전체폭아트동등이라고쓰지않습니다.
- atlas cell밖다른인물이보이면 x/y뿐아니라w/h와이미지영역적용버튼을확인합니다. 필드[data-image-region="0/1/2/3"]는X/Y/W/H, 실행은 button[data-action="image-region-apply"]입니다. 원본전체보기는 image-region-reset입니다.
- source region 변경은 원본파일을보존하고표시구간만바꿉니다. 부모bbox/입력/알파실루엣의크기를같은것으로취급하지않습니다.

## 최종 실제 QA 체크리스트 (아직 수행 안 함)

- [ ] 같은 workspace/project/revision에서 저장·재열기하고347레시피행이실제완성률이라는표현을쓰지않는다.
- [ ] desktop1440·mobile430·논리390×844에서 글자잉크/이미지/넘침/고정header/footer를확인한다.
- [ ] 버튼 실제mouse·Enter·Space와normal/pressed복원을확인한다. 효과켜짐과사용가능을따로확인한다.
- [ ] raw text는kind=text/partRole=label, image는kind=image/partRole=image인지확인한다. 이미지의남은기본text값만보고중복표시라고단정하지않는다.
- [ ] click시wrapper/action하나만실행되고모든시각자식/중간Group의parent전달이유지된다.
- [ ] 5개tabs/1toggle/1input의기본값·runtime·본문/inert·실제키보드입력을확인한다. 미래게임로직으로확대하지않는다.
- [ ] TS30하단은page내비이며다른screen을panelId로연결하지않는다.
- [ ] 3slice/9slice원본분할·edge·padding·현재native저장값을각기확인한다.
- [ ] 새그림등록/실제표시·HTTP실패/404·atlas영역누출을확인한다.
- [ ] TS20가짜종료버튼0,TS28미관측배경복귀0,TS31가상스토리0,미관측숫자창작0을확인한다.
- [ ] TS23스킬3종·TS26정보/총아이콘·TS29일부원문/emoji 같은미확인을본체최종증거와맞춘다. 아트담당추가배정은수령/등록/화면확인후에만완료로쓴다.
- [ ] 관찰링크는실제진입→나감→복귀를보고하고미관측입구는아래목록처럼결과미확인으로남긴다.

## 원문/가이드 근거 위치

- /Users/max/projest_max/ui-studio/src/tools/uxStudio/guide/index.json · 공통판 .39.
- /Users/max/projest_max/ui-studio/src/tools/uxStudio/guide/START_PROJECT_GUIDE.md · 원본→샘플데이터→native제작·저장/검수분리.
- /Users/max/projest_max/ui-studio/src/tools/uxStudio/guide/USER_GUIDE.md:195 · 입력역할과행동; :211 · 독립그림/native글자; :346 · text label/앞뒤순서.
- /Users/max/projest_max/ui-studio/src/tools/uxStudio/control-inspector.mjs:4 · 입력종류; :55 · control UI필드; :60 · tabs/본문/3slice; :75 ·input검증.
- /Users/max/projest_max/ui-studio/src/tools/uxStudio/controls.mjs:69 · 같은화면탭본문; :95 · 실제입력활성조건; :195 · native필드생성; :311 · 중첩nativebutton계약.
- /Users/max/projest_max/ui-studio/src/tools/uxStudio/main.mjs:3270 · 역할; :3271 · 게임입력; :3272 · 사용가능; :3290 · frame방식.
- /Users/max/projest_max/ui-studio/src/tools/uxStudio/parts.mjs:2 · 역할; :5 · 입력mode; :13 · 입력소유자탐색.

아래부록의action key는본체가현재native키맵과대조하기위한전체입구목록입니다. nativeID를발명하거나게임동작이관찰됐다고표시하는목록이아닙니다.

## 부록 · 66개 버튼 입구 reference key 전체


### TS19

| key | role name | label | link evidence |
|---|---|---|---|
| candidate | Btn_CandidateGhost | (image/child label/fulltap; empty own text) | visible entrance only; result not observed |
| back | Btn_Back | (image/child label/fulltap; empty own text) | caller/unknown; 아이콘관찰·정확복귀미확인 |
| deployAll | Btn_DeployAll | 일괄 출전 | visible entrance only; result not observed |
| startBattle | Btn_StartBattle | 출격 | TS20; TSV02 210→215초 sequence_observed |

### TS20

| key | role name | label | link evidence |
|---|---|---|---|
| pause | Btn_Pause | Ⅱ | visible entrance only; result not observed |
| auto | Btn_Auto | 자동 | visible entrance only; result not observed |
| speed | Btn_Speed | x1 | visible entrance only; result not observed |
| skill_sage | Btn_Skill_sage | (image/child label/fulltap; empty own text) | visible entrance only; result not observed |
| skill_lucky | Btn_Skill_lucky | (image/child label/fulltap; empty own text) | visible entrance only; result not observed |

### TS21

| key | role name | label | link evidence |
|---|---|---|---|
| tabAttack | Btn_AttackHealing | 공격&치료 | visible entrance only; result not observed |
| tabDamage | Btn_ReceivedDamage | 받은 데미지 | visible entrance only; result not observed |
| return | Btn_ReturnBase | 근거지 복귀 | TS03; TSV02 226→230초 sequence_observed |

### TS22

| key | role name | label | link evidence |
|---|---|---|---|
| gemPlus | Btn_GemPlus | + | visible entrance only; result not observed |
| ticketPlus | Btn_TicketPlus | + | visible entrance only; result not observed |
| rewards | Btn_Rewards | 보상품 보기 | visible entrance only; result not observed |
| record | Btn_RecruitRecord | 모집 기록 | visible entrance only; result not observed |
| recruitFree | Btn_RecruitFree | 무료 모집 | CIN03; TSV02 272→275초 / TSV03 69→70초 sequence_observed |
| back | Btn_Back | (image/child label/fulltap; empty own text) | TS03; TSV03 30→31초/84→85초 |
| tabAdvanced | Btn_RecruitAdvanced | (image/child label/fulltap; empty own text) | visible entrance only; result not observed |
| tabNormal | Btn_RecruitNormal | (image/child label/fulltap; empty own text) | visible entrance only; result not observed |

### TS23

| key | role name | label | link evidence |
|---|---|---|---|
| root | Page_TSV_NewHero | (image/child label/fulltap; empty own text) | TS24; 288→290초시퀀스·터치안내관찰,정확입력미확인 |

### TS24

| key | role name | label | link evidence |
|---|---|---|---|
| gemPlus | Btn_GemPlus | + | visible entrance only; result not observed |
| ticketPlus | Btn_TicketPlus | + | visible entrance only; result not observed |
| back | Btn_Back | (image/child label/fulltap; empty own text) | TS22; TSV02 326→328초 / TSV03 73→74초 |
| one | Btn_RecruitOne | (image/child label/fulltap; empty own text) | visible entrance only; result not observed |
| ten | Btn_RecruitTen | (image/child label/fulltap; empty own text) | visible entrance only; result not observed |

### TS26

| key | role name | label | link evidence |
|---|---|---|---|
| profile | Btn_HeroProfile | (image/child label/fulltap; empty own text) | visible entrance only; result not observed |
| info | Btn_HeroInfo | (image/child label/fulltap; empty own text) | visible entrance only; result not observed |
| previous | Btn_PreviousHero | (image/child label/fulltap; empty own text) | visible entrance only; result not observed |
| next | Btn_NextHero | (image/child label/fulltap; empty own text) | visible entrance only; result not observed |
| powerHelp | Btn_PowerHelp | ! | visible entrance only; result not observed |
| promote | Btn_HeroPromote | (image/child label/fulltap; empty own text) | visible entrance only; result not observed |
| buildingRequired | Btn_BuildingRequired | (image/child label/fulltap; empty own text) | visible entrance only; result not observed |
| back | Btn_Back | (image/child label/fulltap; empty own text) | TS25; TSV02 305→306초,TSV03 20→21초 |
| attributes | Btn_AttributesTab | 속성 | visible entrance only; result not observed |
| skills | Btn_SkillsTab | 스킬 | visible entrance only; result not observed |

### TS27

| key | role name | label | link evidence |
|---|---|---|---|
| root | Modal_TSV_FeatureUnlock | (image/child label/fulltap; empty own text) | TS03; 357→358초영지복귀·정확입력미확인 |

### TS28

| key | role name | label | link evidence |
|---|---|---|---|
| mailbox | Btn_OpenMailbox | 편지함으로 | TS15; TSV02 444→445초 / TSV03 91→92초 |

### TS29

| key | role name | label | link evidence |
|---|---|---|---|
| gift | Btn_Gift | 선물 | visible entrance only; result not observed |
| egg | Btn_GoldenEgg | (image/child label/fulltap; empty own text) | visible entrance only; result not observed |
| settings | Btn_ChatSettings | (image/child label/fulltap; empty own text) | visible entrance only; result not observed |
| stateTab | Btn_StateTab | 스테이트 | visible entrance only; result not observed |
| privateTab | Btn_PrivateTab | 개인 | visible entrance only; result not observed |
| back | Btn_Back | (image/child label/fulltap; empty own text) | TS03; TSV03 11→12초 |
| channel | Btn_ChatChannel | (image/child label/fulltap; empty own text) | visible entrance only; result not observed |
| emoji | Btn_Emoji | (image/child label/fulltap; empty own text) | visible entrance only; result not observed |
| send | Btn_SendMessage | 발송 | visible entrance only; result not observed |

### TS30

| key | role name | label | link evidence |
|---|---|---|---|
| help | Btn_CatalogHelp | ? | visible entrance only; result not observed |
| card_mia | Btn_Survivor_mia | (image/child label/fulltap; empty own text) | visible entrance only; result not observed |
| card_jason | Btn_Survivor_jason | (image/child label/fulltap; empty own text) | visible entrance only; result not observed |
| card_damon | Btn_Survivor_damon | (image/child label/fulltap; empty own text) | visible entrance only; result not observed |
| card_om | Btn_Survivor_om | (image/child label/fulltap; empty own text) | visible entrance only; result not observed |
| card_susan | Btn_Survivor_susan | (image/child label/fulltap; empty own text) | TS31; TSV03 95→96초 |
| card_jimmy | Btn_Survivor_jimmy | (image/child label/fulltap; empty own text) | visible entrance only; result not observed |
| claimAll | Btn_ClaimAll | (image/child label/fulltap; empty own text) | visible entrance only; result not observed |
| back | Btn_Back | (image/child label/fulltap; empty own text) | TS03; TSV03 97→98초 |
| mailboxTab | Btn_MailboxTab | 근거지 편지함 | TS15; 공통탭과TS15대응 |
| catalogTab | Btn_CatalogTab | 생존자 도감 | visible entrance only; result not observed |

### TS31

| key | role name | label | link evidence |
|---|---|---|---|
| root | Modal_TSV_SurvivorProfile | (image/child label/fulltap; empty own text) | TS30; 화면안내관찰·직접입력미확인 |
| close | Btn_Close | × | TS30; TSV03 96→97초 |
| relationHelp | Btn_RelationHelp | ? | visible entrance only; result not observed |
| storyReward | Btn_StoryReward | (image/child label/fulltap; empty own text) | visible entrance only; result not observed |
| storyTabI | Btn_StoryTabI | 스토리 I | visible entrance only; result not observed |
| storyTabII | Btn_StoryTabII | 스토리 II | visible entrance only; result not observed |
| storyTabIII | Btn_StoryTabIII | 스토리 III | visible entrance only; result not observed |
| storyTabIV | Btn_StoryTabIV | 스토리 IV | visible entrance only; result not observed |


## 본체 전달 후속 경험 · compound label/입력 commit/앵커

이 절은 본체가 실제 native 조립에서 보고한 경험입니다. 하위 명세 담당이 브라우저로 재검증한 결과가 아니며, 공통 가이드 반영 전 초안입니다.

- factory compound label이 BG-inner를 부모로 갖고 localrect도 BG기준이어서 글자/입력경계가 wrapper밖으로 나오는 사례를 본체가 확인했습니다.
- normal UI에서 label을 **Btn root의 직접자식**으로 옮긴 뒤 localrect=(x4,y0,wBtn−8,hBtn)을 설정합니다. BG도Btn의직접시각자식으로두고BG/label은부모입력전달을유지합니다. 부모변경뒤원래좌표를BG기준그대로해석하지않습니다.
- 본체는새helper에이를적용하고먼저만든신규5화면을같은방식으로보정중이라고전달했습니다. 보정완료/최종저장/실제전체QA는본체의최종증거를따릅니다.
- 별도image/text가있는버튼은빈factorylabel이불필요할수있습니다. **text가빈label만**정리하고wrapper·시각자식·입력·ID·유효연결을보존합니다. 현재보이는label을삭제하지않습니다.
- click과pressed표현을함께검수하려면interaction.enabled와buttonState.enabled를각각확인합니다. 하나는실제입력가능,다른하나는시각상태효과입니다. TS20대표의자동/배속잠금은본체가interaction=false로명시했습니다.
- fill/type/paste 호출성공만으로정상UI입력commit을판정하지않습니다. 본체는이경로에서값이미반영된사례를확인했고,실제key입력+Tab후재표시·저장원문으로검증합니다. 실패만보고제품소스bug라고단정하지않습니다.
- 새%root의H변경은고정wrapper까지늘릴수있습니다. recipes/b-anchor-hints.md의anchorPreset을기준504×894에서normalUI로선택하고고정W/H·상하단margin·기기보기왕복을확인합니다. metadata를추가한것과실제앵커적용은별개입니다.
