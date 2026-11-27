# 영웅·모집 4판틀 제작 준비 인계

작성: codex(단이) 하위 `tile_hero_ui` · 2026-11-18 13:33 KST · 제안(검수 대기)

신규 원화 13종(전신 2 + 서로 다른 영웅의 개별 초상 11), UI 이미지 등록용 ≤300KB 알파 WebP, 4판틀의 native 부품 명세를 준비했습니다. **이 하위가 실제 UI에 등록·조립·저장한 부품은 0개**입니다. 본체의 실제 조립 결과와 합산하거나 준비표를 저장 설계로 취급하지 않습니다.

## 작업 범위와 브라우저 경계

- 대상 샘플 폴더: `/Users/max/projest_max/ui-studio/samples/tile-survival/`
- workspace: `workspace-76e57701-a74e-4e37-a4f6-9e83c12cd6fc`
- 본체 설계 `ux-25ecc98a` 수정하지 않음. 이 하위에서 새 projectId/screenId 발급 없음.
- CUA 최초 `createBrowserTab('iab', ...)`가 `Browser is not available: iab`로 실패했고, `cua.getState()`의 browsers가 빈 배열이었습니다. 본체가 native 조립을 중앙 담당하기로 정정했습니다. 다른 탭·Chrome·네이티브 앱 우회 없음. CUA completion_summary 기록 완료.
- 외부 설계 JSON 주입, API를 통한 설계 생성, 제품/공통 소스 수정, 서버 재시작, 공용 STATUS/보고 폴더 조회·기록 없음.

## 읽고 본 원본

1. 공통 `START_PROJECT_GUIDE.md` 전체, `AI_GUIDE.md` 최근 .34/.35 및 영상 작업 안내, `USER_GUIDE.md` native 복사/단독 샘플/최근 .34/.35 절.
2. 선택 프로젝트 `ui-studio/{AGENTS.md,README.md,project.json,integration.md}`. independent 상태 확인.
3. `video-b/references/TSV03-04.jpg`, `TSV03-05.jpg`, `TSV03-06.jpg`, `TSV03-10.jpg`를 실제 이미지로 열었습니다(모두 504×894).
4. `video-b/inventory.json`의 위 4개 항목을 직접 읽었습니다. 구역 경계, 텍스트, 관측 연결/미관측을 분리했습니다.
5. `sample-match/match-candidates.md`, `selected-layout-evidence.md`. 본체가 이미 사용자에게 제시한 Capy r90 저장값 504×894, Equipment 5열 92×96/간격8·18, Chests CTA184×64/글자24를 참고했습니다. 이 하위는 원본 Capy 설계 JSON을 독립 재검수하지 않았습니다.
6. 내장 `imagegen` 스킬을 읽고 내장 `image_gen`으로 신규 원화와 초상 변형을 만들었습니다. API키/CLI/새패키지/Comfy 사용 없음.

## 원화와 파일

- [원화 연락시트](generated-assets-contact-sheet-v001.jpg)
- [최신 원화 매니페스트](asset-manifest-v004.json): 전체 프롬프트, 내장 도구, PNG 원본, WebP 사본, 크기/바이트/SHA/알파 경계.
- PNG 원본 정본: `samples/tile-survival/ui-studio/assets/authoring/heroes/`
- native 등록용 WebP 정본도 같은 폴더. root의 명시 요청에 따라 기존 PIL로 최대512×768 단순 축소·WebP quality90 포맷 변환만 했으며 원본은 보존했습니다.
- 등록용 사본: `src/tools/uxStudio/assets/import-staging/tile-survival-heroes/`
- 경로 입력: `/ui-studio/source/assets/import-staging/tile-survival-heroes/<이름>.webp`
- 모든 13 WebP가 RGBA, alpha0 포함, 49,574~101,664 bytes로 300KB 이하. 원본과 사본 SHA 일치 확인.
- PNG를 production 스크린샷에서 자르지 않았습니다. 다른 영웅에게 동일 이미지를 복제해 쓴 경우 0건. 전신과 동일인물 초상은 일관된 같은 영웅의 별도 자원입니다.
- 모든 아트는 **2D 스틸**이며 live3D/실제 3D 런타임 구현이 아닙니다.

|카드 슬롯|등록 파일|이름의 근거|
|---|---|---|
|01|sage-portrait-v001.webp|세이지는 상세에서 읽힌 이름|
|02|ghost-portrait-v001.webp|고스트는 영상 전환에서 식별|
|03|punk-portrait-v001.webp|공식 이름 미확인, 외형을 설명한 제작 파일명|
|04|showman-portrait-v001.webp|공식 이름 미확인, 제작 파일명|
|05|pink-scout-portrait-v001.webp|공식 이름 미확인, 모집 대표 인물과 같은 외형의 제작 파일명|
|06|lumberjack-portrait-v001.webp|공식 이름 미확인, 제작 파일명|
|07|martial-portrait-v001.webp|공식 이름 미확인, 제작 파일명|
|08|chef-portrait-v001.webp|공식 이름 미확인, 제작 파일명|
|09|redhair-portrait-v001.webp|공식 이름 미확인, 제작 파일명|
|10|twintails-portrait-v001.webp|공식 이름 미확인, 제작 파일명|
|11|ruster-portrait-v001.webp|러스터는 모집 결과에서 읽힌 이름|

전신: `sage-fullbody-v001.webp`, `pink-scout-fullbody-v001.webp`.

## native 조립 명세

[최신 부품표](native-assembly-spec-v002.csv)는 **조립용 읽기 표**입니다. 설계 가져오기/JSON 대체/툴 직접 편집 결과가 아닙니다. 221행 중 note 1행을 제외한 UI 제안은 220부품(Heroes92, HeroDetail53, Recruit42, RecruitResult33)입니다. 부품 수는 완성률이 아닙니다.

각 행에 page, parentname, Btn/Img/Txt 이름, native 종류, 논리 x/y/w/h, 부모 대비 %, 텍스트, 폰트 제안, 원화, 상태, 관측 연결, 주의가 있습니다. 원본 프레임 픽셀 관찰을 공통 규격으로 정규화한 **제작 제안**입니다. 원본 Unity 좌표/Canvas/Prefab/앵커/피벗/서체/버튼 히트박스라고 주장하지 않습니다.

|판틀|주요 규격/분리|
|---|---|
|Heroes · 영웅 목록|504×894, 제목41h, 필터4개, 4열11카드. 카드111×180/가로8/세로10, x20·139·258·377/y116·306·496. wrapper/프레임/개별초상/계열슬롯/진행받침/진행문구 분리. 하단 Back73×66, 모집333×61.|
|HeroDetail · 상세|세이지 이름·SR·계열, 전신284×382 contain, 좌우 화살표, 전투력/별/3열 능력, 업그레이드334×63, EXP와 버튼 라벨 별도 2줄, 하단 Back/속성/스킬.|
|Recruit · 모집|주황 무대/전신422×568/고급모집 native 제목, 상단 재화/보조기능, CTA200×61 두 개, 비용/라벨 별도 2줄, 하단 Back/고급·일반 탭. 무료 상태는 동일 page의 상태그룹으로 이어 만들며 별도판틀로 늘리지 않음.|
|RecruitResult · 결과|상단 재화/빈 스킵체크, 140×449 세로결과카드, 러스터 초상·x3·이름 개별, 하단 Back/재모집2개, 비용/라벨 분리.|

- 같은 역할 카드/CTA는 같은 외곽 규격·글자 기준선·native tint 상태를 사용하도록 제안했습니다.
- Btn wrapper의 입력과 Img targetGraphic, Txt 글자를 따로 만들고 자식은 부모 입력 전달을 확인해야 합니다.
- 제작표의 `%`는 부모 기준으로 계산했습니다. 파일 import로 생성하지 않고 본체가 native 속성에 직접 입력합니다.
- 실제 장면/텍스처 원화는 인물만 제작했습니다. 카드 프레임/배경/버튼은 native 기본 프레임 또는 tint 제작 제안이며, 전용3·9슬라이스 이미지 원화·입체 normal/pressed 그림을 만들었다고 주장하지 않습니다.
- 한글 폰트는 도구 기본 sans 및 18/22/24/28px 계열의 제작 제안입니다. 원본 서체/자간·외곽선 동등은 미확인입니다.
- 계열/무기/화살표/별/재화는 제작 식별용 native 기호/슬롯 제안이 포함되어 있습니다. 최종 아이콘 원화와 바꾸지 않은 상태를 완료로 세지 않습니다.

## 관측 연결과 상태 경계

|출발|행동|도착/결과|근거/구현 경계|
|---|---|---|---|
|Heroes|세이지·고스트 카드|HeroDetail|14→15초,17→18초 관측. 상세 세이지 대표 1개 우선; 고스트 콘텐츠는 같은 판틀의 상태.|
|HeroDetail|Back|Heroes|20→21초 관측.|
|Heroes|Back|영지|24→25초 관측, 본체 영지와 통합 시 연결.|
|Heroes|모집 버튼|Recruit|버튼 표시만 관측, 직접 클릭 연속 전환은 미확인. 연결하면 제작 제안임을 구분.|
|Recruit|Back|영지|30→31초,84→85초 관측.|
|Recruit 일반 무료|무료 모집|모집 연출→RecruitResult|69→70→71/72초 관측. 연출을 생략한 결과 직결은 제작 제안, 실제 추첨 아님.|
|RecruitResult|Back|Recruit 일반 무료소진|73→74초 관측.|
|HeroDetail|업그레이드|레벨5→10/제한 상태|영상18~20초에서 관측했으나 수치 계산·강화 API 구현 없음. 표시는 관측 상태를 쓰고 실행은 비활성 권장.|

유료 1회/10회·재모집, 영상스킵 토글 결과, 필터 결과, 잠금영웅, 스킬/승급/프로필/좌우 전환, 보상품 보기/모집 기록·재화추가는 미관측입니다. 기본 native hover/pressed/disabled 확인과 게임 결과를 구분합니다. 경제·업그레이드 값은 창작하지 않았고 영상 정적 표시값을 승인된 게임 데이터로 쓰지 않습니다.

## 실제 확인과 미완료

[준비 파일 검사](preparation-checks-v001.json): 13원본/13WebP 존재·사본 SHA·300KB·RGBA/alpha0, 221행 고유이름/부모 존재/원화 참조 누락0 확인. 연락시트를 실제로 열어 파란 바탕에서 투명 외곽과 인물 구별을 확인했습니다. 원본 PNG·이전 manifest/CSV는 보존했습니다.

미완료: 모든 native 등록/220부품 조립/화면ID·부품ID/관측 연결 적용/파일 저장/revision/재열기/390·430·1440 실화면/동작시험/키보드·버튼상태/넘침·404·화면 캡처. 이 하위는 위 UI 검수를 했다고 쓰지 않습니다. 원본 폰트/Unity 설정/픽셀동등·실게임 추첨·강화·데이터/API·기획 승인도 미완료입니다.

본체는 native UI로 필요한 대표 구성부터 조립한 뒤 실제 저장판 revision·부품수·연결·검수로 별도 마감합니다.
