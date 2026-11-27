# Tile Survival 문서 마감 반영 계획 · 중지 시점 체크포인트

작성 codex(단이) 하위 에이전트 · 2026-11-19 · **스테이징 전용 / 제안(검수 대기)**

최신 사용자 요청은 **“이번을 마지막 작업으로 하고 그만해”**입니다. 본체는 현재 Building 단위 8개 행동까지만 마무리한 뒤 중지하며, 전체 QA를 계속하지 않습니다. 이 파일은 그 중지 직전까지 조사한 문서 반영안입니다. 아래 변경/명령은 실행하지 않았고 가이드·카탈로그·소스·설계·project metadata·공용 STATUS/보고를 쓰지 않았습니다. 이후 새 직접 지시 없이 문서 발행/생성기 실행·QA·서버 작업을 재개하지 않습니다.

## 현재 사실과 최종 수치 자리

- 본체 전달: 31가족 native 기본 화면은 r316에 조립됐고, r339 이후 기존 네 화면과 UI를 보완 중이었습니다. 전체 가족 최종 QA·원본 동등 승인·대표 W/P/U/S는 완료되지 않았습니다. **W/P/U/S 0/4·전체 동등 승인 0/31**을 유지합니다.
- 읽기 전용 설계는 조사 중 r340→r341→r343으로 계속 바뀌었습니다. r340은 31화면/1198부품/6전이였으나 마감값이 아닙니다. 중간 수치를 최종판에 복사하지 않습니다.
- 마감 기입: revision `<FINAL_REVISION>`, savedAt `<FINAL_SAVED_AT>`, SHA `<FINAL_SHA256>`, 부품 `<FINAL_PARTS>`, 전이 `<FINAL_EDGES>`, 가족별 실제 QA `<ACTUAL_QA_SCOPE>`, 미확인 `<REMAINING>`, 최종 보고 `<FINAL_REPORT>`.
- 실제 폴더 workspace `workspace-76e57701-a74e-4e37-a4f6-9e83c12cd6fc` / project `ux-25ecc98a` / 설계 `samples/tile-survival/ui-studio/designs/ux-25ecc98a.json`입니다. 이 설계는 읽기만 했습니다.
- 보호할 기존 사본: `samples/tile-survival/ui-studio/guide/` 전체와 `project.json`은 덮어쓰지 않습니다. ‘.4 보존’이라는 과거 호칭과 달리 현재 project.json:5의 실제 `guideVersion`은 **2026-11-18.35**입니다. 이 값을 갱신하는 계획이 아닙니다.

## 정본 파일과 반영 단위

아래는 **본체가 나중에 새 지시를 받았을 때 사용할 대상표**입니다. 이 체크포인트에서 적용하지 않습니다.

|대상|역할/반영안|
|---|---|
|`src/tools/uxStudio/guide/index.json`|현재 공통 `.39`. 나중에 실제 읽은 최신판의 다음 판을 정하고 새 공통 노하우 문서 항목을 등록. 기존 프로젝트 사본 metadata는 보존|
|`src/tools/uxStudio/guide/NATIVE_ASSEMBLY_LESSONS.md` (제안 신규)|기존 `guide-final-draft.md`의 재사용 규칙을 한곳에 통합하되 아래 backend/control 완료 문단으로 옛 대기 표현 교체|
|`src/tools/uxStudio/guide/START_PROJECT_GUIDE.md`|기존 원본→샘플 데이터→native 제작 순서 보존, 새 노하우로 짧은 링크만 추가|
|`src/tools/uxStudio/guide/AI_GUIDE.md:578–582`|Tile `.36`의 r63/4부분/27미조립은 과거 상태로 표시하고 최신 기본조립/검수 한계 및 새 공통 노하우 링크 추가|
|`src/tools/uxStudio/guide/PROGRESS.md:874–878`|위와 같은 Tile 단위만 갱신. 타 게임의 r63/과거 시험 기록은 수정하지 않음|
|`samples/tile-survival/docs/PRODUCTION_GUIDE.md`|샘플 제작 안내의 서술 정본. 최신 상태표·31가족 native ID/제작 범위·실제 입력 결과·남은 QA를 추가. r63 절은 과거 snapshot으로 보존|
|`src/tools/uxStudio/guide/TILE_SURVIVAL_GUIDE.md`|위 정본의 메뉴용 사본. Markdown 링크 `](reference/`를 `](reference/tile-survival-video-20261118/`로 치환한 내용과 현재 정확히 일치|
|`samples/tile-survival/docs/reference/PRODUCTION_GUIDE.md` 및 `src/tools/uxStudio/guide/reference/tile-survival-video-20261118/PRODUCTION_GUIDE.md`|정본 링크의 `](reference/`를 `](`로 바꾼 사본. 두 reference 사본은 현재 같음|
|`samples/tile-survival/README.md:3,8,10`|r63·4부분/219·5/27미제작 및 현재 근거 링크 갱신|
|`samples/tile-survival/ui-studio/README.md:9`|인계 절의 옛 `.36`/r63·4부분/27명세 문구만 갱신. `guide/` 및 project.json 변경 없음|
|`_작업/codex/ux-studio/tile-survival-20261118/catalog/`|분석 카탈로그 생성 작업 정본. 아래 생성기/검증기를 먼저 바로잡은 뒤 산출|
|`samples/tile-survival/docs/reference/` 및 `src/tools/uxStudio/guide/reference/tile-survival-video-20261118/`|카탈로그 배포 사본 두 곳. 개별 HTML 수작업 편집으로만 상태를 바꾸지 않음|
|`docs/collaboration/reports/20261119_0832_단이_타일서바이벌_잔여제작마무리.md`|본체만 마지막 저장판·실제 완료 단위·중지 이유·못한 QA를 기록. 이번 하위는 무수정|
|`docs/collaboration/STATUS.md`|본체만 맨 끝에 중지/보고 상태를 추가. 이번 하위는 열람·수정하지 않음|

`catalog.md`라는 파일은 좁은 조사 범위에서 없었습니다. 현재 Markdown 카탈로그는 **inventory.md**입니다. 과거 r63 snapshot `native-actual-r63.json`과 그때의 browser-verification은 삭제/덮어쓰지 말고 과거 근거로 유지합니다.

## 공식 생성기와 현재 실행하면 안 되는 이유

공식 생성/검사 명령은 저장소 루트 기준 다음과 같습니다. **명령은 확인만 했고 실행하지 않았습니다.**

```sh
python3 _작업/codex/ux-studio/tile-survival-20261118/catalog/build_catalog.py
python3 _작업/codex/ux-studio/tile-survival-20261118/catalog/verify_catalog.py --no-write
```

생성기는 인자가 없고 `ROOT/BASE/OUT`를 고정합니다(:7–18). 입력은 video-a2/inventory.json, video-b/inventory.json, sample-match/{inventory,candidate-parts}.json, 프레임/출처 자료 및 `catalog/native-actual-r63.json`입니다. 작업 catalog/ 아래 sample-evidence.json·catalog.json·timestamp-manifest.json·index.html·inventory.md·references/*.jpg를 씁니다(:114,118,193–194,224,231). **두 배포 사본으로 복사하는 기능은 없습니다.** :118의 shutil.copy2는 분석 JPG를 작업 references/로 가져올 뿐입니다. 별도 공식 배포 명령은 발견하지 못했습니다.

현재 생성기를 그대로 실행하면 r63 상태를 다시 씁니다. 바꿀 정확한 지점은 다음과 같습니다.

|파일:줄|현재 고정/과거 내용|나중에 바꿀 기준|
|---|---|---|
|build_catalog.py:17–18|r63 snapshot 읽기 + revision63/component219 단언|새 **문서용** 최종 snapshot 파일을 읽고 식별자·31가족 unique/실제 수치와 대조. 저장 설계는 읽기만 함|
|:161–162|부분조립 가족 조건·actualAssembly revision63/snapshot명|실제 snapshot의 모든 screenFamilies와 revision/파일명 사용|
|:181|전체 조립 미완료 + r63 상태를 각 가족에 반복|native 기본조립과 남은 원화/입력/QA를 가족별로 구분|
|:190,192|inputProvenance r63, targetActual 4/219/5/27, status/notVerified|새 snapshot 경로와 실제 수치. finalVisualEquivalence 0/31·representativeW_P_U_S 0/4는 유지|
|:207–209|가족 HTML r63/명세만 문구|q.revision·q.screenName·q.elementCount와 QA 대기 문구를 동적으로 표시. 과거 HUD 관찰 근거는 보존|
|:223,226–227,230|HTML/MD 머리말·직접 확인 설명의 4/27/r63|현재 summary 변수 하나를 HTML/MD에서 재사용하고 읽기/실화면 검증 주체 구분|
|verify_catalog.py:17,20,24–27,109|4부분/27명세, r63/219/5, skins42/shadows20 단언·출력|현재 snapshot과 카탈로그 일치·31 ID/부품 합/자원 존재·SHA 검사. 예전 수치 자체를 합격 조건으로 두지 않음|
|verify_catalog.py:54|다른 샘플 원본 SHA 재읽기|이번 범위는 다른 게임 열람/수정 금지이므로 그대로 실행하지 않음. 과거 sample-evidence의 보존 SHA 확인과 현재 Tile snapshot 검증을 구분할 방법을 본체가 범위 안에서 결정|

검증기는 기본 실행 시 verification.json을 씁니다(:8–9,110). `--no-write`도 다른 입력과 다른 샘플의 과거 출처를 읽으므로 이번 조사에서는 실행하지 않았습니다. 생성기는 최신 browser-verification이나 guide를 생성하지 않으므로 이를 생성기 성공으로 완료 표시하지 않습니다.

향후 새 문서 snapshot 제안 이름은 `native-actual-20261119-final.json`입니다. 기존 r63 파일에 최신 값을 덮어쓰는 방법은 쓰지 않습니다. 핵심 연결용 코드 초안은 다음과 같고, snapshot 값/실제 파일이 준비된 뒤에만 적용합니다.

```python
NATIVE_SNAPSHOT = 'native-actual-20261119-final.json'
native = load(OUT / NATIVE_SNAPSHOT)
native_by_family = {q['familyId']: q for q in native['screenFamilies']}
assert len(native_by_family) == len(native['screenFamilies']) == 31
assert set(native_by_family) == {f'TS{i:02}' for i in range(1, 32)}
# 기존 family status enum 유지: 기본 조립은 full completion이 아님.
f['status'] = 'partial-native' if sid in native_by_family else 'specified-only'
if sid in native_by_family:
    f['actualAssembly'] = {
        **native_by_family[sid], 'revision': native['revision'],
        'sourceSnapshotFile': NATIVE_SNAPSHOT,
        'sourceSha256': native['sha256'], 'readAtKST': native['readAtKST'],
        'finalVisualEquivalence': 'unverified', 'representativeW_P_U_S': '0/4'
    }
# targetActual는 기존 4/219/5/27을 native[...]와 len(native_by_family)에서 산출.
# partialFamilyCount=31은 native 기본조립 수이며 시각/기능 승인 31을 뜻하지 않음.
```

새 snapshot이 기존 native-actual-r63.json의 assets/skinFrames/worldHUD425Values 등을 대체할 필드를 제공하는지도 먼저 맞춥니다. 기존 관찰 문구와 plannedComponentHierarchy를 실제 원본 Unity 계층으로 승격하지 않습니다. HTML/MD의 관측 링크와 실제 저장 전이 수는 계속 별개입니다.

## 붙여 넣을 최신 문안 초안

### 1. 공통 노하우 문서의 backend 대기 절 교체

다음 문안은 `guide-final-draft.md`의 ‘재시작 승인 대기/선택 필드 미저장’이라는 과거 문단을 대체합니다. 현재 하위 파일 자체는 수정하지 않았습니다.

> 2026-11-19 12:46 KST, 사용자가 현재 7018 서버 재시작을 승인한 뒤 본체는 구 PID 47381을 종료하고 자신이 시작한 PID 21943(exec 4352)으로 바꿨다고 전달했습니다. 이전 소스 통합 시험은 696/696이며 이번 문서 작업자가 재실행한 결과가 아닙니다. 선택 필드는 native r242에서 저장하고 r244로 재열었습니다. TS12에서 Female 클릭·Other Space·재열기 None 기본값 및 native input appearance computed를 본체가 확인했습니다. 이로써 당시 구 validator/미저장 문제는 해당 저장 왕복으로 해소됐으며, 새 서버 재시작 권한이나 모든 화면 QA 완료를 뜻하지 않습니다.

재사용할 교훈은 ‘현재 소스 통과 → 실행 backend 버전 확인 → 승인된 자기 서버 갱신 → 새 필드 native 저장/재열기 → 실제 입력 확인’을 분리하는 것입니다. PID는 이번 사건 기록이며 일반 가이드의 실행 명령이나 재시작 대상 상수가 아닙니다.

### 2. 실제 control/표시 기록

> TS12의 성별 4개는 commander-gender 단일 선택 그룹의 native toggle이며 choiceShape=square/size32/color=#36ca5c를 저장했습니다. TS29는 State에 실제 feed를 연결하고 Private는 미관측이라 본문 미연결로 남겼습니다. r281에서 선택 시 feed 숨김/복원과 maxLength1000 native 입력을 실제 타이핑해 확인했다고 본체가 전달했습니다. TS31은 Story I에 관측한 한 문장 본문을 연결하고 II–IV는 미관측이라 미연결입니다. r317에서 스크롤/본문 자식의 고정 크기를 보완했습니다. TS30의 편지함/도감 하단은 TS15/현재 TS30의 **화면 간 navigation**이므로 ordinary Btn이 맞고 same-screen tabs를 요구하지 않습니다. 이 사례의 입력값은 fixture이며 채팅 발송·성장·스토리 보상 로직은 구현 완료가 아닙니다.

실제 읽은 control ID(중간 snapshot 기준, 최종판에서 다시 대조):

|역할|ID|
|---|---|
|TS12 nickname|element-332f477d-0635-48d2-bd37-2ddfc4125fbc|
|TS12 Male/Female|element-6076482c-9905-4a7c-83f8-b076465f2fae / element-335e5f28-c864-4045-8a90-b923e41145d8|
|TS12 Other/None|element-2c2463c1-b89f-47f2-a438-9a30a2e7e693 / element-e32298ef-8154-4a67-a998-fade3299a481|
|TS29 Message/Tabs|element-b38ea675-f884-4632-a144-6e06e06b2dec / element-52e2398e-c7b8-4f92-9faf-a1d290247be1|
|TS29 State feed|element-f57f1f98-8af0-4cf6-9ebb-8b59f5f37d09|
|TS31 Story tabs/body|element-e8b5af1f-d8f8-4b4e-9790-0094ccd49c74 / element-fdc3f347-49bd-476c-839d-11d15c9470af|
|TS30 Mailbox/Catalog Btn|element-2156e28c-9ed9-441e-bb34-bf4191ec3b20 / element-612ac0f0-056e-4373-85f5-e61b6a0a5edf|

이번 하위는 UI를 재실행하지 않았습니다. 실제 있는 증거는 `docs/evidence/20261119-tile-finish/commander-r244-native-square.jpg`, `chat-r281-native.jpg`, `profile-r316-native.jpg`입니다. 이 캡처 존재만으로 모든 동작/최종판의 실검수를 주장하지 않습니다.

### 3. 샘플 README와 제작 가이드 머리말

```markdown
상태: 제안(검수 대기) · r<FINAL_REVISION>

4개 영상에서 분류한 31 UI 가족의 native 기본 화면을 조립했습니다.
현재 저장판은 31화면·<FINAL_PARTS>부품·<FINAL_EDGES>연결이며,
가족별 실검수 범위와 미완료는 <FINAL_REPORT>를 따릅니다.
원본 전체 시각 동등 승인 0/31·대표 W/P/U/S 0/4입니다.
기본 화면 존재·저장 성공·시험 수를 전체 기능/최종 시각 승인으로 세지 않습니다.
원본 캡처는 분석 전용이며 글자·입력은 native, 원화·프레임은 별도 자원입니다.
현재 직접 작업은 사용자의 마지막 작업 요청에 따라 중지했습니다.
```

가이드에는 최신 상태표를 먼저 두고 종전 r63 4가족 절은 **2026-11-18 과거 snapshot**으로 내립니다. 31행 상태표는 `native 기본 조립 / 실제 QA 범위 / 남은 차이 / native screen ID / 증거`를 구분합니다. 27가족 ‘명세만’이라는 현재형은 제거하되 실제 남은 원화·동작·검수는 계속 미완료로 남깁니다. 과거 673시험/8 DOM상태/6 runtime시나리오는 오늘 재실행 수로 쓰지 않습니다.

### 4. 메인 원화·Hero 단위 문안

> 메인 Event/Quick01/Quick02 세 그림은 새 image_gen v006 투명 원화로 만들고 본체가 r327에 적용했습니다. 제작 manifest는 samples/tile-survival/ui-studio/assets/authoring/tile-finish-20261119/main-remaining-art-manifest-v006.json입니다. 두 Quick 입력은 48×48 원형 표현·zero edges·ellipse 입력으로 보완했습니다. 옛 2D 장면 leaf를 제거하고 빈 3D 슬롯을 분리했습니다. Quick01의 정확한 정체와 클릭 경로는 미확인입니다. 영웅 37 leaf·12 owner의 native 보완은 본체 전달 당시 진행 중이므로 최종 저장판과 실제 확인 범위를 읽기 전 완료로 쓰지 않습니다.

v006 실제 등록 참조는 중간 읽기 r343의 main에 존재했습니다: Event `sha256-bd2d2f92e3271b29f6393642faefc955a9e71f33220e3d79e26061e64b74029c.png`, Quick01 `sha256-cec851671f02726e14ef7db8eb0050c20e6feee107537b132e42854a761f7dde.png`, Quick02 `sha256-a24c18d0aa8f5e0dbaf8d03050dd7a8fd6c37e6f68505c28cc4a682c5b64db6f.png`입니다. 신규 3D slot ID는 `element-5068e135-ac31-4a00-960c-cee2b0bb60f6`입니다. 이는 중간 파일 읽기이며 최종 GUI 증거가 아닙니다.

### 5. 공통 가이드 메뉴에 넣을 항목 초안

```json
{"id":"native-assembly-lessons","title":"native 조립 노하우 · 소유권·복제·입력·앵커","file":"NATIVE_ASSEMBLY_LESSONS.md"}
```

현재 common index version은 `2026-11-18.39`입니다. 다음 판 후보 `2026-11-19.40`은 아직 발행하지 않았으며 재개 시 최신 index를 읽어 충돌 없이 정합니다. common guide에 새 교훈을 한 번만 싣고 Tile 가이드에는 사례/실제 QA와 링크를 둡니다. 기존 프로젝트 guide/를 common판으로 복제하지 않습니다.

## 31가족 native 화면 ID 체크포인트

r340–r343 읽기에서 이름/ID를 확인한 표입니다. 마지막 Building 단위 뒤 최종 저장판과 다시 대조해야 하며, 이 표는 미관측 navigation edge를 만들라는 지시가 아닙니다.

|가족|native screen 이름|screen ID|
|---|---|---|
|TS01|Page_TSV_TitleLoading|screen-dcec609c-59d1-443c-ad3c-8b48eef3acba|
|TS02|Modal_TSV_Terms|screen-d5f55c58-a7bb-4cbc-9e64-35395fb748b4|
|TS03|Page_TSV_Territory|main|
|TS04|Modal_TSV_StoryDialogue|screen-7ea94531-c5eb-4d31-bb3c-3ce4e31e643e|
|TS05|Page_TSV_BuildingInterior|screen-102560cd-a9db-4e4a-89ea-8138bd7bf0c6|
|TS06|Modal_TSV_TutorialChoice|screen-028c9a6e-a9cf-49ec-8864-49abd823e618|
|TS07|Modal_TSV_BuildingUpgrade|screen-69d5b36b-cc28-4ecd-a95a-96be618354e2|
|TS08|Modal_TSV_RaidAlert|screen-0fa34452-0f62-436a-92ca-7f6fce0f5e59|
|TS09|Modal_TSV_ChapterMissions|screen-aad12b04-07ae-41fa-bb5b-1a77d0d39ec5|
|TS10|Modal_TSV_BuildingUpgradeSuccess|screen-4015f298-30f7-4fbf-b042-a0add19e86fe|
|TS11|Modal_TSV_PowerplantRecord|screen-9bf413cc-5622-499b-bfb1-1ea1603fa73e|
|TS12|Modal_TSV_CommanderEdit|screen-1758a682-9d35-49e4-8994-5de636ad3e2a|
|TS13|Modal_TSV_SurvivorDispatch|screen-f4966921-9881-47f6-b0a7-3413f089f768|
|TS14|Modal_TSV_SurvivorAccept|screen-fbb6e6b2-36d3-4574-b754-b2b2cc8a923c|
|TS15|Page_TSV_Mailbox|screen-92ec1599-925c-470b-94ec-98ed3c53bc23|
|TS16|Modal_TSV_ResidentExchange|screen-4673cfcd-95d2-4370-9c42-a3aaaec902e4|
|TS17|Modal_TSV_ChapterRewards|screen-05546a68-83df-4200-bca1-d9419ad88e71|
|TS18|Modal_TSV_NewChapter|screen-828c01ff-738c-450b-9e7b-e5dfd502fcb4|
|TS19|Page_TSV_Formation|screen-ebc7aec9-56d6-4ef8-b634-7a2fc668eadf|
|TS20|Page_TSV_Battle|screen-8e38890f-46d1-409b-a46c-cdb4573ab5f8|
|TS21|Page_TSV_BattleResult|screen-83044942-f30b-4cb9-98e1-de69ac1da1ec|
|TS22|Page_TSV_Recruit|screen-0b93cc6f-8ab1-4c94-9538-1589f22f52f0|
|TS23|Page_TSV_NewHero|screen-a7cb4e9c-e30c-4850-9138-91cef6adb8b7|
|TS24|Page_TSV_RecruitResult|screen-0defcffd-60c1-4c6a-8971-d667f62dd6b4|
|TS25|Page_TSV_Heroes|screen-f6d00d61-09cc-45f5-bf29-fc0f2f6b5417|
|TS26|Page_TSV_HeroDetail|screen-f2adfdd1-8ef6-4586-88c2-05df8e58ef6b|
|TS27|Modal_TSV_FeatureUnlock|screen-d16e799c-5fd0-4bdc-bece-19a496a7d8dc|
|TS28|Modal_TSV_RelationReward|screen-091a5aba-9551-42ce-9854-8914286188c5|
|TS29|Page_TSV_Chat|screen-55e55104-dc49-424c-a520-6b219b52abff|
|TS30|Page_TSV_SurvivorCatalog|screen-64930003-496e-4209-b8b8-1c43885a1edc|
|TS31|Modal_TSV_SurvivorProfile|screen-8a5360d6-6302-4cd2-9c0e-613df87dcf9c|

## 아직 하지 않은 것 / 재개할 경우의 순서

1. 지금은 중지합니다. 최종 Building 저장판의 수치/증거는 본체가 자기 보고에 기록합니다. 하위는 더 조사하거나 QA를 계속하지 않습니다.
2. 나중에 새 지시가 있으면 최종 설계 읽기 전용 snapshot·캡처/실제 시험 결과를 먼저 고정하고 위 자리표시자를 채웁니다. 문서 자체가 최종 QA를 대신하지 않습니다.
3. 허용 대상 원문을 백업한 뒤 guide-final-draft의 최신 문단을 통합하고, 샘플 제작 가이드/README를 갱신합니다. guide/ 사본과 project.json은 제외합니다.
4. 생성기/검증기의 옛 숫자 조건을 snapshot 기반으로 맞추고 작업 카탈로그를 재생성합니다. 원본 52 JPG·source 관측과 이전 snapshot 보존을 확인합니다.
5. 허용된 Tile 산출만 두 reference 사본에 동기화합니다. guide 사본은 위 상대링크 변환으로 생성하고 존재하지 않는 최종 증거에 링크하지 않습니다.
6. 링크·31가족 ID·JSON 수치 일치·HTML 검색/필터·모바일 문서 넘침을 실제로 수행한 범위만 검증합니다. 과거 verification/browser 파일을 오늘 결과로 재사용하지 않습니다.
7. 본체가 최종 보고와 STATUS append를 남깁니다. 미완료 전체 QA/동등 승인/게임 API·미관측 탭/목적지·사용자 최종 시각 승인·Hero 진행 단위를 분리합니다.

현재 스테이징: 이 파일과 기존 `guide-final-draft.md`뿐입니다. 후자는 22화면/구 validator 대기라는 **옛 중간 초안**을 포함하므로 단독으로 발행하지 말고 위 최신 교체 문단과 본체 최종값을 먼저 통합해야 합니다.
