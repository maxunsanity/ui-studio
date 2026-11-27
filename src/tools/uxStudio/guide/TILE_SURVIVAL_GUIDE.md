## 2026-11-20 최신 보정 · r358 · 첨부3화면

아래 r63/4가족·27미제작 표는 **과거 스냅샷**입니다. 현재 저장판은 `ux-25ecc98a r358`·31화면/1213부품/6연결이며, 31구조가족의 화면은 모두 있습니다. 화면 존재를 완성·원본동등·모든동작 구현으로 세지 않습니다. 대표 W/P/U/S0/4와 원본 최종동등0/31은 유지합니다.

이번 직접 승인 범위는 TS26 세이지 상세·TS16 제이슨 교환·TS14 생존자 수용, 세 화면의 최신 첨부 상태 보정입니다. 이전판r345는 백업과 저장 이력에 보존했습니다. 기존28화면과6연결은 원문 대조로 동일합니다. 카피바라고·킹샷·타게임·7007·서버·자동화는 바꾸지 않았습니다.

|화면|이번 적용|관찰·미확인 경계|
|---|---|---|
|TS26 HeroDetail|새 투명 세이지 전신·같은 그림의 native 초상crop·청색다이아 배경·native 대사/업그레이드/손안내·전투력4,300/용량10|새 정적 원화로 live3D아님. EXP분모는가려져 `53,500 / 1…`로 일부만 표시. 가려진 가디언/레벨은 기존fixture로남아 신규확인값이 아님|
|TS16 ResidentExchange|새 제이슨 bust·별/점장식·크림종이/주황상판/청록외판·고리·주황닫기/다음에·녹색교환/보상타일|글자/수량/비용은 별도 native. wood1000·5분x1/보상x10은 관찰fixture, 실제교환API없음|
|TS14 SurvivorAccept|피오나/블레인 새 초상·인구6/침대6/대기2·선택체크/수용CTA제거·침대확장문구/forward/손안내·금속클립·사람/침대그림|기존4+2/수잔·지미 수용가능판과 혼합하지 않음. 실제침대확장/수용처리 API없음|

### 다른 AI가 같은 패턴으로 보정할 순서

1. 같은 화면이라도 관찰 상태부터 분리합니다. 수용가능/침대가득참, 성장후/튜토리얼직전은 수치·CTA가 달라집니다. 기존판은 revision/백업 보존 후 현재 첨부를 같은ID에서 보정하고 출처 상태를 적습니다.
2. 기존 샘플의 실제 x/y/W/H·폰트·부모·slice를 먼저 읽습니다. 이번근거는 `_작업/codex/ux-studio/tile-corrections-20261120/measure/`입니다. 스크린샷 픽셀을 원본 엔진 설정이라고 쓰지 않습니다.
3. 캐릭터는 내장 imagegen으로 각각 새로 그립니다. UI/문자/프레임/바닥투영을 그림에 굽지 않습니다. 같은 세이지 그림의 초상은 툴 image.region으로 지정합니다. 피오나 [34,7,455,504], 블레인 [4,5,455,504]는 512² production의 crop이며130×144 표시의 종횡을 유지합니다.
4. 투명 alpha와 실루엣/여백·전체 어깨/모자/기타를 육안 확인합니다. PNG/WebP≤300000B 자원을 정상 프로젝트경로 입력+Tab으로 등록하고, 가져오기 완료 뒤 원본영역/배치/부모를 적용합니다. 모델 JSON 외부주입으로 제작하지 않습니다.
5. 종이/외판은9슬라이스, CTA는3슬라이스, 금속클립/고리/아이콘/캐릭터는 고정비율 이미지입니다. source slice와 display edge를 각각 입력합니다. 제작수치는 원본 Unity slice가 아닙니다. 본문·이름·금액·개수·EXP·버튼말은 native text로 분리합니다.
6. 버튼 자식의 입력은 parent, 표시 그림/말풍선은 none을 확인합니다. 이미지나 글자만 눌러 입력이 끊기는지 실제 마우스/키보드로 확인합니다. 미연결이면 공통 미연결 안내가 나오는 것과 실제 게임 행동을 구분합니다.
7. 고정 그림·대사·CTA를 폰의 논리높이에 비례해 찌그러뜨리지 않습니다. 세이지 전신 center, 하단 대사/손/CTA bottom anchor, 장식 배경 stretch를 각각 분리했습니다. 이미 앵커가 있으면 정상 UI에서 기존%배치로 수치편집 후 앵커복원하고 재검수합니다.
8. 상세 편집→미리보기→design/390기기→CSS1440/430→파일저장→재열기→현재revision/capture로 확인합니다. 브라우저 CSS크기·DPR·캡처픽셀은 각각 기록합니다. 색상 input은 details열기→fill→재표시/저장확인하며 일반text는 native키입력+Tab으로 확정합니다.

### 실제 검수와 남은 차이

실제 브라우저 CSS1440×900·CSS430×843, 기기논리390×844를 확인했습니다. 세화면 일반 img깨짐0/문서가로넘침0, SVG이미지와프레임은실제표시+등록파일hash로대조했습니다. 교환mouse·다음에Enter·업그레이드Space·침대확장mouse는 공통 미연결 안내를 확인했습니다. 새 목적지나 게임차감/성장/확장을 구현했다는 뜻이 아닙니다.

팝업은 사용자 규칙대로 배후게임화면을 넣지 않고 단독 딤으로 보여줍니다. 원본blur장면을 통째복제하지 않습니다. 그림자는 엔진 effects로 외판/CTA에 분리했습니다. 원본폰트·미세재질·눌림원본·모든영상동등은 미확인입니다.

**열린문제:** custom 3/9슬라이스의 분할경계가 가는선으로 보입니다. 원본PNG의 내부alpha틈은없고, slice0 비교시선소멸/26복원시재현했습니다. 정수slice28 및 transform/filter/pixelated/실제border폭 비교로 해결되지 않았습니다. source제품 CSS를 추측수정하지 않았고 가변프레임 계약도 없애지 않았습니다. 별도 공통 렌더 보완 항목입니다.

최신 보고: `docs/collaboration/reports/20261120_0851_단이_타일서바이벌_3화면보정.md` · 증거: `docs/evidence/20261120-tile-three/` · 원화/계약: `_작업/codex/ux-studio/tile-corrections-20261120/art-*/`.

---

# 타일 서바이벌 UI스튜디오 제작 가이드

작성자 codex(단이) · 2026-11-18T15:25:55+09:00 · **제안(검수 대기)**

이 문서는 4개 영상에서 분류한 UI를 실제 UI스튜디오 부품으로 제작할 때의 범위와 조립 규칙입니다. **분석된 구조 가족 31종 가운데 native 부분 조립은 4가족이며, 전체 가족의 동등 검수 통과는 0/31입니다.** 나머지 27가족은 명세만 있고 미제작입니다. 대표 W/P/U/S 종합 검수는 **0/4**입니다. 4화면이 있다는 사실을 31가족 제작 완료나 게임 구현 완료로 바꾸어 해석하지 않습니다.

[분석 갤러리](reference/tile-survival-video-20261118/index.html) · [기계 판독 카탈로그](reference/tile-survival-video-20261118/catalog.json) · [관측 목록](reference/tile-survival-video-20261118/inventory.md) · [영상 시각·출처](reference/tile-survival-video-20261118/timestamp-manifest.json) · [기존 샘플 계층 근거](reference/tile-survival-video-20261118/sample-evidence.json) · [현재 native 저장 근거 r63](reference/tile-survival-video-20261118/native-actual-r63.json)

> 배포 위치: 최종 `samples/tile-survival/docs/PRODUCTION_GUIDE.md`에서 `reference/`를 여는 상대경로입니다. 공통 내장 `reference/tile-survival-video-20261118/PRODUCTION_GUIDE.md` 사본에서는 링크의 `reference/` 접두어를 제거해 같은 폴더의 index/catalog 파일을 엽니다. 후보 원문은 작업 폴더에 보존했고 본체가 샘플 폴더와 툴 내장 가이드에 배포했습니다. 아래 후보 작성 이력과 현재 배포 상태는 구분합니다.

## 1. 상태와 증거의 경계

### 대상 native 제작 상태 — 본체 전달 r63

다음 값은 **본체가 직접 검사해 전달한 r63의 부분 제작 상태**입니다. 이 문서 작업자는 [native-actual-r63.json](reference/tile-survival-video-20261118/native-actual-r63.json)을 직접 읽어 수치와 근거를 대조했습니다. 대상 저장 JSON이나 GUI를 독립 재검사한 결과가 아니며, 이후 revision을 최신이라고 추정하지 않습니다. 본체가 수행한 개별 GUI·반응형·입력 검수 결과는 아래 8절에 전달 근거로 반영했습니다. 증거 파일 복사와 대표 W/P/U/S 종합 검수·원본 전체 동등 검수는 구분합니다.

|항목|r63 전달값 / 근거|
|---|---|
|Workspace|`workspace-76e57701-a74e-4e37-a4f6-9e83c12cd6fc`|
|Project / revision|`ux-25ecc98a` / `r63`|
|저장 시각|`2026-11-18T05:59:17.270Z`|
|본체 직접 확인 시각|`2026-11-18T15:18:39+09:00`|
|저장 JSON SHA256|`3411e858552f46daac63ceb2a23de6da680cd3e294234435f619c0ea8fea3df4`|
|논리 캔버스|504×894|
|부분 조립|TS03 영지 50 + TS05 건물 48 + TS07 조건 43 + TS25 영웅 78 = **4화면·219부품**|
|저장 연결|**5개**. 저장 필드 수이며 GUI 클릭 통과 수가 아님|
|미제작|**27가족은 명세만 있음**|
|동등 / 대표 W/P/U/S 종합 검수|전체 가족 **0/31** / 대표 W/P/U/S **0/4**|
|후속 native 편집|HUD resource 4개 custom texture 등록·선택 wrapper 6px 자식 돌출 해소 계산·HeroList `scroll-y=true` 저장. 태블릿 PageDown의 scrollTop87.5 확인은 본체 GUI 수행 결과로 별도 기록|
|저장 검사|schema 통과·skin 프레임 **42개 전부 normal custom 등록**·missing0·고유 등록 참조 **48개**·실제 파일 누락0·SHA 불일치0·엔진 shadow **20개**|

|현재 r63 저장 화면|가족|부품|skin 프레임|엔진 shadow|
|---|---|---:|---:|---:|
|Page_TSV_Territory|TS03|50|9|1|
|Page_TSV_BuildingInterior|TS05|48|9|5|
|Modal_TSV_BuildingUpgrade|TS07|43|5|2|
|Page_TSV_Heroes|TS25|78|19|12|

skin 42개는 9slice39개·3slice3개이며 모두 normal texture가 등록되어 있습니다. 고유 등록 참조 48개는 전체 참조를 중복 제거한 수입니다. HUD resource 4개 등록을 “고유 새 파일 4개 추가”로 해석하지 않습니다. 과거 r57의 고유 참조 47개와도 서로 다른 snapshot으로 구분합니다. 위 검사는 source JSON과 등록 파일의 근거이며 브라우저 로딩·실제 화면의 외관/입력 통과 수가 아닙니다.

WorldHUD 표시값은 본체가 직접 확인한 **TSV02 요청425초·실제424.97833초 원본**의 `35,372 / 01:31 / 6/6 / 13.11K / gems740`입니다. 해당 프레임과 출처 연결은 [TS03 분석 카드](reference/tile-survival-video-20261118/index.html#TS03)의 본체 제공 근거를 따릅니다. 이 문서 작업자가 프레임을 다시 육안 확인한 값이 아니며, 제품 발란스 승인값도 아닙니다.

### 과거 snapshot의 보존

r6의 영지 1화면·8부품·0연결과 r57의 4화면·219부품·5연결은 **이전 상태 기록**입니다. r57의 `effects.shadow=0`이나 부모 아래 6px 돌출을 r63의 현재 미수정 상태로 쓰지 않습니다. 본체는 r63 source 근거를 두 카탈로그에 동기화했다고 전달했습니다. 후보 작성자는 한 파일만 작성했고, 본체가 최종 읽기 검토 후 두 카탈로그 및 가이드에 배포했습니다.

직접 읽은 `native-review-v002.md/json`은 **2026-11-18 14:51:01 KST의 r57** 구조 검토 자료이며 r63 후속 편집의 검사 결과가 아닙니다. 당시 저장 시각은 `2026-11-18T05:44:33.147Z`, SHA256은 `8bfa6e4dfe83b130d12f613d757f8d31c6c6d8e18c8e4dce4d161467bd70e60e`입니다. 근거 위치는 `/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/tile-survival-20261118/native-review-v002.md` 및 같은 이름 `.json`입니다.

당시 v002에서 schema 통과, duplicate ID·부모누락·순환·빈 native 글자·image+skin 동시잔여는 0으로 기록되었습니다. native 글자 55개가 비어 있지 않고 등록 참조 47개의 파일/SHA/실크기 불일치는 0이었습니다. nav6·가구4·영웅11 규격 계산, 모델 함수 확인 7건, entry에서 4화면 도달 검사가 통과한 **저장데이터/순수 모델 결과**이며 브라우저/native 클릭·실제 Escape·초점·스크롤·반응형 시험이 아닙니다. 이 과거 검사 수치를 r63에서 전부 재실행한 것처럼 표현하지 않습니다.

### 원본 관찰 / 제작 규격 / 미확인

|구분|다루는 내용|해석|
|---|---|---|
|원본 영상 관찰|TSV01~04의 프레임, 표시 문구·상태·화면 전환 순서|카탈로그에 기록된 관찰. 이 문서 작업자는 영상을 새로 재생하거나 모든 프레임을 재검수하지 않음|
|영상 좌표|각 가족 `regions.boundsPx`|504×894 참조 프레임에서의 육안 근사 구역. 정확 hitbox·브라우저 실측·원본 엔진 좌표가 아님|
|기존 샘플 저장 관찰|C r90 / M r354의 부모·백분율 좌표·폰트·상태·연결 필드|저장 JSON 근거. 타일 서바이벌 원본과의 시각 동등성이나 적용 완료의 증거가 아님|
|제작 규격|이 가이드의 504×894, nav·가구·영웅 카드 규격, 이름·분리·slice 규칙|대상 샘플을 만들기 위한 규격·제안. 원본에서 정밀 실측한 숫자로 쓰지 않음|
|native 제작 상태|본체가 전달한 r63의 4화면·219부품·5연결과 후속 native 편집|저장 검사·실제 화면·최종 동등 검수를 각각 구분. r6/r57은 과거 snapshot|
|미확인|원본 Unity 계층·정확한 원본 서체·원본 slice 경계·게임 연동·픽셀 동등성|추정으로 확정하지 않음|

영상의 전환 근거 `sequence_observed`는 커서와 전후 화면의 순서를 뜻합니다. 실제 게임 입력 이벤트 로그를 검사했다는 뜻이 아닙니다. `visible_only`는 표시만 확인한 컨트롤이고, `planned-example-not-applied`는 제작할 연결 예시입니다. native 저장 연결 5개와도 구분합니다.

## 2. 4영상에서 통합한 31개 구조 가족

출처는 [카탈로그](reference/tile-survival-video-20261118/catalog.json)의 `sources`, `families[*].sourceObservations` 및 각 가족의 참조 프레임입니다. TSV01은 타이틀·초기 튜토리얼, TSV02는 영지·건물·전투·모집·영웅·주민의 넓은 범위, TSV03은 반복 상태와 채팅·생존자 도감/프로필, TSV04는 짧은 챕터 수령/완료 흐름의 근거입니다. 내용·수치·인물 변형은 같은 구조로 묶었습니다.

아래 제작 상태는 본체가 전달한 r63 부분 제작 범위에 대응합니다. 27가족의 미제작은 명세만 있는 상태입니다. `screen/sheet/modal/overlay`는 관측 구조의 분류이며 원본 Unity 객체 형식이 아닙니다.

|ID|구조 가족|유형|영상별 로컬 관측 ID|대상 제작 범위|
|---|---|---|---|---|
|[TS01](reference/tile-survival-video-20261118/index.html#TS01)|타이틀 / 로딩|screen|TSV01-TS01|미제작|
|[TS02](reference/tile-survival-video-20261118/index.html#TS02)|게임 이용약관|modal|TSV01-TS02|미제작|
|[TS03](reference/tile-survival-video-20261118/index.html#TS03)|영지 / 월드 공통 HUD|screen|TSV02-F01, TSV03-01, TSV01-TS03|부분 조립 · 50부품|
|[TS04](reference/tile-survival-video-20261118/index.html#TS04)|스토리 / 주민 대화|sheet|TSV01-TS04, TSV02-F15|미제작|
|[TS05](reference/tile-survival-video-20261118/index.html#TS05)|건물 내부 / 가구 선택|sheet|TSV02-F03, TSV03-07, TSV01-TS05|부분 조립 · 48부품|
|[TS06](reference/tile-survival-video-20261118/index.html#TS06)|튜토리얼 대응 방식 2택|modal|TSV01-TS06|미제작|
|[TS07](reference/tile-survival-video-20261118/index.html#TS07)|건물 업그레이드 조건|sheet|TSV02-F04, TSV03-08, TSV01-TS07|부분 조립 · 43부품|
|[TS08](reference/tile-survival-video-20261118/index.html#TS08)|습격 예고 / 이동 안내|modal|TSV01-TS08|미제작|
|[TS09](reference/tile-survival-video-20261118/index.html#TS09)|챕터 미션 노트|modal|TSV02-F12, TSV04-01, TSV01-TS09|미제작|
|[TS10](reference/tile-survival-video-20261118/index.html#TS10)|일반 건물 업그레이드 성공|overlay|TSV02-F05|미제작|
|[TS11](reference/tile-survival-video-20261118/index.html#TS11)|발전소 레벨 증가 기록판|overlay|TSV02-F06, TSV03-02|미제작|
|[TS12](reference/tile-survival-video-20261118/index.html#TS12)|지휘관 정보 편집|modal|TSV02-F07|미제작|
|[TS13](reference/tile-survival-video-20261118/index.html#TS13)|생존자 파견|sheet|TSV02-F08|미제작|
|[TS14](reference/tile-survival-video-20261118/index.html#TS14)|생존자 수용|modal|TSV02-F09|미제작|
|[TS15](reference/tile-survival-video-20261118/index.html#TS15)|근거지 편지함|screen|TSV02-F10, TSV03-13|미제작|
|[TS16](reference/tile-survival-video-20261118/index.html#TS16)|주민 자원 교환|modal|TSV02-F11, TSV03-11|미제작|
|[TS17](reference/tile-survival-video-20261118/index.html#TS17)|챕터 완료 보상|overlay|TSV02-F13, TSV04-02|미제작|
|[TS18](reference/tile-survival-video-20261118/index.html#TS18)|신규 챕터 소개 카드|overlay|TSV02-F14|미제작|
|[TS19](reference/tile-survival-video-20261118/index.html#TS19)|소대 설정 / 출전|screen|TSV02-F17|미제작|
|[TS20](reference/tile-survival-video-20261118/index.html#TS20)|전투 HUD|screen|TSV02-F18|미제작|
|[TS21](reference/tile-survival-video-20261118/index.html#TS21)|전투 승리 / 통계|screen|TSV02-F19|미제작|
|[TS22](reference/tile-survival-video-20261118/index.html#TS22)|영웅 모집|screen|TSV02-F20, TSV03-06|미제작|
|[TS23](reference/tile-survival-video-20261118/index.html#TS23)|신규 영웅 해제 소개|screen|TSV02-F22|미제작|
|[TS24](reference/tile-survival-video-20261118/index.html#TS24)|모집 결과 / 재모집|screen|TSV02-F23, TSV03-10|미제작|
|[TS25](reference/tile-survival-video-20261118/index.html#TS25)|영웅 보유 목록|screen|TSV02-F24, TSV03-04|부분 조립 · 78부품|
|[TS26](reference/tile-survival-video-20261118/index.html#TS26)|영웅 상세 / 성장|screen|TSV02-F25, TSV03-05|미제작|
|[TS27](reference/tile-survival-video-20261118/index.html#TS27)|신규 기능 해제 배너|overlay|TSV02-F26|미제작|
|[TS28](reference/tile-survival-video-20261118/index.html#TS28)|친밀도 상승 보상|overlay|TSV02-F27, TSV03-12|미제작|
|[TS29](reference/tile-survival-video-20261118/index.html#TS29)|채팅|screen|TSV03-03|미제작|
|[TS30](reference/tile-survival-video-20261118/index.html#TS30)|생존자 도감|screen|TSV03-14|미제작|
|[TS31](reference/tile-survival-video-20261118/index.html#TS31)|생존자 프로필 / 이야기|modal|TSV03-15|미제작|

동일 건물의 이름·생산량·가구 목록, 동일 영웅의 초상·등급·레벨·수치, 모집의 일반/고급·무료/소진, 미션의 보상·완료 여부는 상태나 데이터로 처리합니다. 이것을 별도 가족 수로 늘리지 않습니다. TS10 일반 건물 성공과 TS11 발전소 기록판은 중앙 몸체가 달라 분리합니다. TS17 챕터 보상과 TS28 친밀도 보상도 본문과 CTA가 달라 분리합니다.

### 공통 부품 4군 — 가족 수에 가산하지 않음

|ID|군|호스트와 제작 경계|
|---|---|---|
|COMP01|월드 포인트 / 비용 / 건물 타이머|TS03·TS05에 붙는 마커·레벨·비용 pill·타이머·선물 준비 표시. 월드 지형 렌더링 자체와 분리|
|COMP02|튜토리얼 손 / 말풍선 / 강조|목표 변경형 손·말풍선·초상·이름·설명·강조. 실제 좌표 추적과 입력 차단 정책은 미확인|
|COMP03|토스트 / 부유 보상 / 완료 피드백|한 줄 토스트·퀘스트 pill·증가 배너·자원 이동·초상 말풍선. 문구 변경을 새 화면으로 세지 않음|
|COMP04|축하 공통 장식|TS10·11·17·27·28의 dim·제목·리본·색종이·보상 장식. 중앙 본문 구조까지 공통화했다고 간주하지 않음|

### 시네마틱 3군 — 분석 reference만 유지

|ID|분석 대상|출처|제작 경계|
|---|---|---|---|
|CIN01|초기 3D 도입 / 울타리 방어|TSV01|인물·카메라·방어 연출은 UI 가족에서 제외|
|CIN02|설계 노트 열림|TSV01 65·70초 부근|표지→도면 시퀀스. 입력 UI 구조를 확인한 장면이 아님|
|CIN03|모집 열차|TSV02·03|일반/고급의 광원·문·철로 변화는 같은 연출군. 영상 제작·재생 동작은 미완료|

OS Google Play 업데이트 알림, Steam/Shift+Tab, 커서, 뷰어 툴팁은 게임 UI에서 제외합니다. 5초 간격 등 추출 간격 사이의 짧은 화면 누락 가능성이 있어 “원본 UI 전체를 빠짐없이 복원했다”고 쓰지 않습니다.

## 3. 대상 샘플의 제작 규격

다음 숫자는 **제작 규격**입니다. 영상에서 정확하게 관측한 원본 치수라는 뜻이 아닙니다.

|제작 항목|규격|적용 경계|
|---|---|---|
|화면 논리 크기|**504×894**|내부 조립의 기준 좌표. 표시 배율과 실제 장치 픽셀은 별도|
|하단 nav|**6슬롯, 슬롯마다 84×64**|6×84=504. 아이콘·라벨·배지를 슬롯 아래 별도 자식으로 배치|
|가구 선택 카드|**110×170, 카드 간 gap 10**|TS05용 제작 규격. 기존 Monopoly 카드 치수를 그대로 복사한 값이 아님|
|영웅 카드|**111×180, 가로 gap 8 / 세로 gap 10**|TS25용 제작 규격. 기존 Equipment의 장비 슬롯과 다른 규격|

슬롯과 카드의 부모 좌표를 먼저 고정하고 아이콘·라벨·배지를 그 부모 기준으로 둡니다. 편집기의 부모 백분율 좌표와 전역 논리 좌표를 섞지 않습니다. 스크롤은 viewport와 content를 분리하고, content의 자식은 content 기준으로 계산합니다. 범위를 벗어난 content 높이를 화면 전체 높이로 잘못 환산하지 않습니다.

v002 저장 데이터 계산에서는 위 nav6·가구4·영웅11 규격이 일치했습니다. 본체는 이후 영웅 태블릿/폰 GUI에서 11카드·111×180 유지와 스크롤 결과를 확인했다고 전달했습니다(8절). 개별 GUI 통과를 모든 가족의 상태·slice 늘림·원본 동등 검수 완료로 넓히지 않습니다. 정렬 수치를 맞추기 위해 원본에 없는 버튼이나 새 기능을 추가하지 않습니다.

## 4. 실제 기존 샘플에서 재사용할 수 있는 것

### 저장 원본과 추적 경로

[기존 샘플 계층 데이터](reference/tile-survival-video-20261118/sample-evidence.json)의 provenance에 원본 경로·revision·SHA가 있습니다. 이 문서 작업에서는 아래 두 저장 원본을 읽어 SHA가 provenance와 일치하는 것을 확인했습니다. 선택된 10화면의 계층·좌표·폰트·상태 등 핵심 보존 필드도 원본과 대조했습니다. 목적 설명 같은 일부 필드는 추출 자료에 생략되어 있으므로 전체 JSON을 동일 복제했다고 표현하지 않습니다.

|기호|실제 샘플 저장 snapshot|논리 크기|원본 화면 / 연결 전체 수|
|---|---|---|---|
|C|Capybara GO · `ux-gjs-4e64eb72 r90`|**504×894**|27화면 / 123연결|
|M|Monopoly GO · `ux-gjs-0d80d7fe r354`|**551×984**|17화면 / 25연결|

- C 원본: `/Users/max/projest_max/ui-studio/samples/capybara-go/ui-studio/designs/ux-gjs-4e64eb72.json`
- C SHA256: `ca20064b6851e08c1acaa265e6482741baf0a9c33ddec7b98940fb790a1a1031`
- M 원본: `/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json`
- M SHA256: `236750b8fe6874ae32a6783cc3bd927f0f15bd92bc75b0daa87cc6f076ff9b91`

아래 pointer는 C 또는 M 원본 JSON 기준입니다. 부품 단위 근거는 [sample-evidence.json](reference/tile-survival-video-20261118/sample-evidence.json)의 동일 `name`·`id`·`sourceJsonPointer`로 찾습니다. 원본은 한 줄 JSON이므로 임의의 파일 줄 번호 대신 pointer와 요소 ID를 사용합니다.

|원본 pointer|실제 화면|부품 수|저장 fontSize 목록|명시 buttonState 수|출발 연결 수|
|---|---|---:|---|---:|---:|
|C /screens/0|Page_Capybara_Lobby|160|12,14,16,18,20,32,34|1|12|
|C /screens/1|Page_Capybara_Equipment|201|12,14,16,18,20|0|5|
|C /screens/5|Page_Capybara_Chests|93|14,16,18,20,24,26|0|11|
|C /screens/11|Popup_Capybara_ChestReward|8|18,28|0|1|
|M /screens/1|Page_Build_City|79|18,20,24,28,32,40|7|1|
|C /screens/4|Page_Capybara_Talents_Upgrade|95|12,14,16,18,20,24,28,30|0|6|
|C /screens/23|Page_Capybara_Adventure|52|12,14,15,16,17,18,26,28,30|5|3|
|C /screens/16|Popup_Capybara_SevenDay|103|12,14,18,28,36|0|1|
|M /screens/2|Modal_Wins_QuickWins|47|14,18,20,22,24,32,40,46|1|1|
|C /screens/13|Page_Capybara_Continent|78|12,14,18,20,24,26|0|1|

명시 `buttonState=0`은 해당 화면에 이 필드가 없다는 뜻입니다. 모든 버튼이 작동하지 않는다거나 상태가 전혀 없다는 결론으로 넓히지 않습니다. 출발 연결 수는 JSON의 전이 레코드 수이며 화면에서 모두 성공했다고 검수한 수가 아닙니다.

### 부모·치수·폰트·간격과 재사용 차이

여기 적은 논리 x/y/w/h는 저장된 백분율과 부모 계층을 재귀 계산한 값입니다. 브라우저 실측이나 게임 원본 RectTransform 복원이 아닙니다. 저장 원본에 별도 `rectTransform`이 있어도 이 표의 백분율 환산값과 같은 값이라고 가정하지 않습니다.

|실제 샘플 근거|관측한 조립/치수·폰트|재사용 범위|타일 서바이벌에서 새로 필요한 부분|
|---|---|---|---|
|C Lobby|root `Group_Lobby_Scene` 504×894, root HUD 504×64, nav 배경 y786·504×108, 시작 wrapper (140,674)·224×64|정지 장면과 HUD·이벤트·nav의 독립 계층|타일/건물 선택, 자원·건설 상태, 하단 **6×84×64** 규격. 기존 nav 배경 108 높이를 새 슬롯 64 높이와 혼동하지 않음|
|C Equipment|`Scroll_Equipment_Inventory` root (0,580)·504×222 → content 504×468 → 슬롯 92×96. 첫 두 슬롯 (6,586)/(106,586), 다음 행 y700. 가로 gap **8**, 세로 gap **18**|초상/아이콘·프레임·수치 분리, 스크롤 viewport/content/카드 계층|5열 장비 목록이며 Hero 완제품이 아님. TS25의 **111×180·gap8/10**, 속성 필터·보유/미보유·조각·성장 표시는 별도 제작|
|C Chests|`BG_Chests_Stage` 아래 중앙 그림 172×124, 제목 328×42·font26, `Btn_Chests_Open` 184×64 아래 BG와 독립 `Txt_Chests_Open`·font24|모집 로비의 중앙 대상·종류탭·회수/재화 표시와 wrapper/skin/text 분리|보물상자 샘플. 영웅 모집권·일반/고급·무료/소진·열차 연출·영웅 결과는 새로 구성|
|C ChestReward|root 전면 입력 `Btn_ChestReward_Close` 504×894 아래 dim·panel 504×174·리본 404×62·제목 font28·아이템 슬롯80×80·닫기안내 font18|전면 입력 wrapper와 보상 제목/아이템/장식 분리|단일 아이템 결과. 영웅 등급·영웅/조각 구분·재모집 CTA와 다름. 저장 동작도 `close`가 아니라 Bronze 화면으로 `navigate`|
|M Build|`HUD_Build_Bottom` root (0,712)·551×272 아래 카드 **100×171**, 첫 x6.5·둘째 x116.25 → 가로 gap **9.75**. 카드 아래 가격 font24|장면과 하단 가격 카드의 부모 구조·독립 글자·스킨·엔진 그림자|배치/이동/회전 편집기가 아님. 대상 가구 **110×170·gap10**은 별도 규격이며 551×984 좌표를 그대로 복사하지 않음|
|C Talents Upgrade|root 증가 toast 504×64, 현재값 font24, 화살표30×36, 증가값 font30|현재값→화살표→증가값의 분리 표시|전투력 증가 예시. 관계 단계·친밀도 진행·편지함 CTA는 없음|
|C Adventure|root 장면504×410, 로그488×74 및488×100, 두 본문 font18, 하단 진행264×108|장면·서사 글자·진행 입력의 분리|화자 초상/이름·주민 프로필·분기 선택·스토리 탭·친밀도는 없음|
|C SevenDay|root 패널444×642 → scroll314×360 → content314×376 → 과제314×88·세로 gap8, 제목 font14|모달/스크롤/반복 미션행 계층|이벤트/일차 화면. 챕터 노트 외형·모두 수령·완료 보상 흐름은 신규|
|M QuickWins|clipboard525.49×800.32 아래 과제 **440×97.6691**, 세로 gap 약**7.8135**, 설명 font22·lineHeight28·`family=system`|클립보드·반복 3미션·독립 보상 문구|표시 중심이며 과제 판정·보상은 미연결. 대상 챕터 규칙/수령 동작을 그대로 가져올 수 없음|
|C Continent|root 목록504×310 아래 미션476×88·3행, 제목font18, 이동 wrapper128×48|미션행 내부의 제목·개수·보상·이동 입력 분리|페이지 템플릿이므로 챕터 모달 컨테이너·전체 수령/완료 흐름은 별도|

정확 근거 예: C `/screens/5/elements/58`의 `Txt_Chests_Title`은 font26·weight700·lineHeight32, `/screens/5/elements/64`의 `Txt_Chests_Open`은 font24·weight700·lineHeight28·`interaction.mode=parent`입니다. 이 값들은 기존 샘플 저장값입니다. 원본 게임의 서체명이나 대상 샘플의 승인된 글자 크기로 취급하지 않습니다. C 선택 화면들에는 명시 서체 family가 없고, M의 일부 텍스트에는 `system`이 있습니다. 어느 쪽도 타일 서바이벌 원본 서체 확인 근거가 아닙니다.

C r90에 Hero·Recruit·Story라는 이름의 완성 화면이 있다는 근거는 없습니다. 위 재사용은 **부품 구조와 조립 방식의 후보**이며 자산 복사·적용 승인이나 시각 동등 검수와 다릅니다. 이 문서 작업은 기존 샘플 파일과 자산을 수정하거나 대상에 복사하지 않았습니다.

### 실제 상태와 연결의 참고 범위

- C Lobby의 시작 wrapper에는 `buttonState.mode=tint`, `enabled=true`, `selected=false`와 `pressFeedback.distance=3`이 저장되어 있습니다. press shadow는 opacity0.12·x0·y1·blur1입니다. 이것은 해당 샘플 값이며 대상 규격으로 자동 채택하지 않습니다.
- M Build 카드1은 `buttonState.mode=tint`와 별도 `targetGraphic`을 사용합니다. normal/hover/pressed/selected/disabled tint 필드가 있지만 이 문서 작업에서 각각 눌러 보지는 않았습니다.
- C Lobby는 Equipment로 `navigate`, 금화 출처로 `open` 등 12개 출발 연결이 있습니다. Equipment는 nav 중심 5개, Chests는 종류별 다른 화면 이동/보상 열기 등 11개입니다. Chests의 “열기” CTA 자체가 완성된 모집 흐름으로 연결되었다고 보장하지 않습니다.
- ChestReward의 전면 입력은 `navigate → Page_Capybara_Chests_Bronze`, M Build의 뒤로는 `back`, SevenDay와 QuickWins의 닫기는 `close`입니다. 이름이 “Close”인 버튼도 실제 action을 확인하고 사용합니다.
- Adventure의 진행은 스킬 선택을 `open`하는 UI 예시입니다. SevenDay의 미션 이동, QuickWins의 보상 판정, Continent의 이동 CTA가 게임 로직까지 연결되었다는 근거는 없습니다.

## 5. native 부품의 이름·자산·텍스트·부모 규약

다음은 대상 제작 규약이며 원본 Unity 계층을 복원한 결과가 아닙니다. 기존 4화면의 이름을 문서에 맞추려고 임의로 바꾸지 않습니다.

|역할|명명 예시 / 규칙|
|---|---|
|화면|`Page_TSV_Territory`, `Page_TSV_Heroes`처럼 범위와 목적을 드러냄. 이후 modal/sheet/overlay는 실제 도구 형식에 맞춤|
|영역·부모|`Group_TSV_*`, `HUD_TSV_*`, `Scroll_TSV_*`, `Content_TSV_*`|
|입력 wrapper|`Btn_TSV_*`, `Card_TSV_Hero01` 등. hitbox·입력·선택 상태·전이의 기준|
|그림·장식|`Img_TSV_*`, `BG_TSV_*`, `Frame_TSV_*`, `Icon_TSV_*`, `Badge_TSV_*`|
|글자|`Txt_TSV_*`. 제목·본문·레벨·수량·가격·라벨을 그림과 독립|
|반복 인스턴스|`01..NN` 같은 안정된 suffix를 사용하고, 이름/순서 변경과 콘텐츠 ID를 구분|
|새 자산 파일|`tsv_<역할>_<의미>_<상태>_v001.webp/png` 같은 규칙을 제안. 상태가 없으면 생략하고 원본·버전을 보존|

### 자산과 slice

새 원화는 텍스트·가격·개수·인물 이름을 굽지 않은 프레임/그림/아이콘으로 준비합니다. 제품에 등록할 때 파일명, assetRef, 출처, 크기, 상태, slice, 사용 화면/부품을 추적합니다. 기존 샘플의 해시 assetRef는 “그 샘플에 존재한다”는 근거이며 대상에 자동 등록되었다는 뜻이 아닙니다.

- **9slice:** 패널·카드·일반 버튼처럼 양방향으로 늘어나는 판틀. 네 모서리/테두리 두께를 보존하고 중앙을 늘립니다. slice 경계는 새 원화에서 정합니다.
- **3slice:** 가로 pill·리본/긴 탭 등 한 축만 늘어나는 부품의 제작 후보. 양 끝을 보존하고 가운데만 늘립니다. 원본 게임이 3slice였다고 주장하지 않습니다. v002의 r57에는 건물·조건·영웅 화면에 3slice가 각 1개 기록되어 있고 실제 늘림 결과는 GUI에서 확인합니다.
- **일반 image:** 장면·인물 원화·초상·의미가 있는 일러스트는 임의 slice로 늘이지 않습니다. 적합한 contain/cover/clip을 확인합니다.
- **상태 스킨:** normal/pressed는 같은 캔버스·기준점·외곽 크기·바닥 위치를 사용합니다. pressed용 원화를 원본 영상에서 관측하지 않았다면 신규 제작 제안으로 표시합니다.

M Build의 실제 예시는 `BG_Build_Landmark01`의 `skin.mode=9`, `slices=[27,27,27,27]`, `edges=[18,18,18,18]`, 128×64 normal texture와 별도 `effects.shadow`입니다. 그림자 값은 opacity0.25·x0·y3·blur4입니다. 이 숫자는 M r354의 관측값이며 대상의 slice 경계/그림자 정답이 아닙니다.

**엔진 shadow는 프레임/스킨과 별도 설정합니다.** 새 그림에 그림자를 중복으로 구워 넣어 엔진 그림자와 겹치게 만들지 않습니다. r57의 shadow0은 과거 기록입니다. r63 저장 근거에는 활성 엔진 shadow 20개가 있으며, 실제 그림자 외관·겹침·눌림 상태는 본체의 후속 GUI 증거로 확인합니다.

### nativeText와 입력 부모

`nativeText`는 도구의 편집 가능한 텍스트 부품으로 글자를 분리한다는 제작 규약입니다. 기존 샘플 JSON의 모든 요소에 `nativeText`라는 필드가 저장되어 있다는 뜻이 아닙니다. 기존 근거에는 `kind=text`, `fontSize`, `typography`, 독립 `Txt_*` 요소가 있습니다.

`Btn/Card wrapper → BG/Frame + Img/Icon + Txt + Badge` 순서로 입력과 시각 자식을 나눕니다. 표시 자식은 `interaction=parent/none` 등 실제 도구에 맞춰 부모 입력을 방해하지 않게 설정합니다. 같은 동작을 wrapper와 label 양쪽에 중복 연결하지 않습니다. 텍스트 줄바꿈·정렬·외곽선·lineHeight는 native 설정으로 확인합니다.

부모 밖으로 나온 자식은 의도와 화면 경계를 함께 검토합니다. 과거 r57의 NEW 글자는 부모 위 2px가 본체가 명시한 의도였고, 영지 선택 Level_BG/Txt는 부모 아래 6px가 나왔습니다. 본체는 후속 native 편집으로 해당 선택 wrapper를 수정했고, r63 근거의 부모 높이170/자식 하단530 계산에서 이전 6px 돌출 해소가 확인되었습니다. 과거 상태를 현재 미수정값으로 남기지 않습니다. 의도적 장식을 일괄 clamp하거나 audit0을 만들려고 원본에 없는 UI를 추가하지 않으며, 부모 계산 오류와 의도된 장식을 구분합니다. 최신 저장 계산과 실제 표시/입력 결과는 각각 확인합니다.

## 6. 상태·입력·연결을 조립하는 순서

1. 대상 가족·원본 대표·관찰 상태를 정합니다. 카탈로그의 `sourceObservations/references/controls/states`를 먼저 읽고 `observedLinks`와 `plannedLinks`를 나눕니다.
2. native 도구에서 화면과 부모를 만들고 프레임·그림·텍스트·입력 wrapper를 각각 편집합니다. **사용자 프로젝트 저장 JSON에 외부 스크립트로 값을 주입하거나 덮어써 조립하지 않습니다.**
3. 새 원화를 등록한 뒤 해당 native 부품에서 참조하고 9/3slice·텍스트·그림자·상태를 설정합니다. **frame import의 비동기 작업 완료 → 자원 필드의 등록값 → 미리보기 → 저장 반영**을 확인한 뒤 다음 부품 편집으로 이동합니다. 업로드 시작만 보고 완료로 기록하지 않습니다. 참조 그림을 통째 화면 이미지로 넣어 부품 조립을 대신하지 않습니다.
4. 관찰된 상태를 예시 데이터로 만듭니다. selected/disabled/locked/claimed/조건충족을 해당 부모/카드/CTA에 연결하고 표시 문구와 색만으로 동작을 추정하지 않습니다.
5. 실제로 만든 화면 사이에만 도구의 전이를 연결합니다. `navigate/open/close/back`과 돌아갈 화면·상태 유지·전달값을 기록합니다. 대상이 미제작이면 미연결로 남기고 존재하는 것처럼 연결하지 않습니다.
6. 도구에서 저장하고 revision·readback·실제 화면·클릭 결과를 확인합니다. 상태 수·연결 수와 실제 통과 수는 별도로 보고합니다.

속성 입력은 **현재 native 선택 확인 → 키 입력 → Tab/blur로 값 확정 → 같은 대상의 재표시 값 확인 → 저장값 확인** 순서로 합니다. 값이 바뀌지 않거나 도구가 늦게 반응하면 비동기 완료와 선택 대상을 다시 확인합니다. 도구 응답성·비동기 실패를 사용자 저장 JSON의 임의 데이터 주입이나 외부 스크립트 덮어쓰기로 대신하지 않습니다.

r63 저장 근거에서 HeroList의 native `scroll-y=true`를 확인했습니다. 이후 본체는 태블릿 PageDown으로 scrollTop87.5가 된 실제 GUI 결과와 폰 표시를 확인했다고 전달했습니다(8절). 저장 설정 확인·PageDown 실검수·미실행 터치 동작·전체 상태 동등 검수는 각각 구분합니다.

TS07의 구체적인 관찰은 TSV01 210/215/220초 모두 조건 부족·회색 CTA이며, **215초를 충족 상태로 쓰지 않습니다.** 조건 충족·녹색 CTA는 TSV02 101초 근거입니다. 명칭·문구·숫자는 fixture로 취급하고 제품 발란스 승인값으로 넘기지 않습니다.

직접 읽은 v002의 r57 검토에서는 조건 모달에 `action=close`가 없지만 확인 `navigate→main`과 Escape 정책이 있습니다. 단순 audit 규칙의 미통과를 없애기 위해 원본에 없는 닫기 버튼을 추가하지 않습니다. 본체는 이후 runtime에서 실제 조건창 진입·Escape의 건물 focus 복귀·Confirm의 영지 이동을 확인했다고 전달했습니다(8절). 이것이 원본 게임의 미관찰 취소 정책까지 복원했다는 뜻은 아닙니다.

`Btn_TSV_Heroes_Recruit`는 action/enabled 상태이나 아직 연결이 없다는 v002 검토 결과입니다. 이는 실제 미조립 범위로 남깁니다. 모집 화면이 없는 상태에서 연결 수만 채우거나 게임 모집 기능이 작동한다고 쓰지 않습니다.

화면 전환 예시의 데이터 키는 `contentId`, 선택/활성 상태, 표시 문구와 값 같은 UI fixture입니다. 실제 전투 계산·계정·결제·보상 지급·생산/공사 시간·가구 배치/회전·채팅 발송은 이 샘플의 검증 범위에 들어가지 않습니다.

## 7. 영웅 그림과 추가 소스의 상태

현재 부분 제작본의 **`Page_TSV_Heroes`에는 `Card_TSV_Hero01..11` 11카드와 등록된 참조 이미지가 실제로 있다**는 본체 전달값과 과거 v002 근거를 구분해 유지합니다. 기존 11카드까지 “원화 준비만·미등록·미조립”이라고 표시하지 않습니다. 다만 카드 존재를 개별 영웅의 완전한 상세·성장·필터·모집 동작 검수와 혼동하지 않습니다.

본체가 전달할 **추가 영웅 소스는 준비만인 범위로 현재 저장본의 참조 목록과 분리**합니다. 이 문서 작업에는 추가 소스의 구체적인 파일명·등록 manifest·assetRef·등록/조립 완료 증거가 없으므로 해당 부분은 미확인입니다. 준비 파일 수를 native 등록 이미지 수나 조립 카드 수에 합산하지 않습니다.

추가 소스를 사용할 때는 준비 → 제품 자산 등록 → 카드 참조 → 부모/치수/상태 조립 → native 저장 → 화면 확인을 각각 기록합니다. 미등록/미참조/미조립인 항목은 그 상태를 유지해 보고합니다. 원본 영상 프레임이나 캡처를 영웅 원화로 등록하지 않습니다.

## 8. reference 사용과 실제 검수

**원본 영상 프레임과 캡처는 분석 reference 전용입니다.** [참조 갤러리](reference/tile-survival-video-20261118/index.html)의 JPG를 잘라 버튼·아이콘·카드·초상·배경 같은 제품 리소스로 사용하지 않습니다. 프레임 전체를 제품 화면에 올려 결과를 흉내내지 않습니다. 새 원화와 native 부품으로 조립합니다. 실제 native UI를 검수한 화면 캡처도 검증 증거로 보존하며 UI 제품 자산으로 전용하지 않습니다.

### 본체가 수행한 개별 GUI·입력·시험 결과

아래는 **본체의 실제 수행 결과를 전달받아 요약한 내용**입니다. 이 문서 작업자가 GUI를 직접 조작하거나 다시 검수한 결과가 아닙니다. 증거 예정 위치는 `samples/tile-survival/docs/evidence/20261118-tile-survival/browser-verification.json`입니다. 본체가 복사할 예정이며, 이 문서 작업자는 해당 파일을 읽거나 존재를 확인하지 않았습니다. 복사 전 경로를 클릭 가능한 증거 링크로 만들지 않습니다.

|수행 범위|본체가 확인해 전달한 결과|해석·제한|
|---|---|---|
|저장 viewer DOM|4screens × CSS1440×900 / CSS430×844 = **8상태**, pending0·broken0·overflowX0·stage overflow0|이 조합의 로딩/넘침 검사. 원본 전체 시각 동등 검수 수가 아님|
|채택 전체 viewport 캡처|데스크톱 CSS1440×900 → 실제 JPG1800×1125 / 모바일 CSS430×843 → 실제 JPG537×1055|모바일 CSS 높이843은 기기 픽셀 반올림 결과이며 위 DOM 검사 높이844와 구분|
|캡처 확정 순서|빠른 캡처 중 compositor가 완료되지 않은 장면을 제외하고 **화면 선택 → 별도 관찰 call → 최종 캡처**로 교체|최종 채택본과 제외된 초기 캡처를 혼동하지 않음|
|runtime 입력/전환|저장5연결 + Escape 추가 **6시나리오 모두 통과**|아래 runtime 실행 시험이며 정적 sample preview와 구분|
|Hero 태블릿|CSS768×1024, 논리504×672, list468×472 / content높이560, PageDown 후 scrollTop87.5|실제 스크롤 확인. 카드11개·카드111×180 유지|
|Hero 폰|CSS390×844 → 논리504×1091 / list높이891, CSS430×932 → 논리504×1092 / list높이892, broken0|실행한 크기의 표시 결과. 모든 기기·입력 방식의 전수검수는 아님|
|Recruit native preview|normal matrix1 → pressed0.741176 → disabled0.6 → normal1 복원|tint/행렬 확인. depth/image variants는 미등록이며 모집 목적지는 미조립|
|전체 회귀시험|본체가 **이번에 `npm test` 재실행: 673/673 통과·fail0·exit0**|소스 구조검사·DOM8상태·runtime6시나리오와 합산하지 않음|

runtime 6시나리오의 전달 순서는 `WorldBuilding→Building`, `Building→upgradeDialog(inert=true)`, `Escape→Building(focus return)`, 조건창 재진입 후 `Confirm(Enter)→World`, `World→Heroes`, `Back(Space)→World`입니다. 정적 sample preview는 navigation하지 않는 설계이므로, 정적 화면 선택·캡처를 이 runtime 실행 시험과 같은 검수로 기록하지 않습니다.

이 개별 통과 결과 이후에도 **대표 W/P/U/S 종합 검수0/4·원본 전체 동등 검수0/31**을 유지합니다. W/P/U/S를 단순히 “대표 4화면”으로 대응시키지 않습니다. 원본 Unity 계층·정확한 서체·게임 연동·전 가족 상태/원화/slice의 픽셀 동등성은 여전히 미확인입니다.

가족별 완료 기록에는 다음 증거가 필요합니다.

|확인 대상|남길 근거|현재 검수 상태|
|---|---|---|
|native 저장|workspace/project/revision/savedAt/SHA/readback|직접 읽은 r63 저장 근거의 본체 검사값. 대상 저장본·GUI 독립 재검수 없음. v002는 과거 r57|
|계층·부모|wrapper·skin·text·badge·scroll/content 분리와 실제 참조|저장 근거 대조 + 본체 전달 viewer DOM8상태·runtime 모달 inert 확인. 원본 Unity 동등성은 미확인|
|제작 규격|504×894·nav6×84×64·가구110×170gap10·영웅111×180gap8/10|v002 저장 계산 일치 + 본체 Hero 태블릿/폰 11카드111×180 유지 확인 전달. 전체 동등 검수와 구분|
|원화·slice·shadow|새 자산 출처, import 완료·등록/미리보기/저장, 텍스트 분리, slice·그림자|r63 skin42 normal 등록·참조48·shadow20 + 본체 viewer broken0 전달. 개별 slice/그림자의 원본 동등성은 미완료|
|native 텍스트|긴 이름·수량·본문의 줄바꿈/잘림·폰트/lineHeight·편집 가능 여부|v002 55개 빈 글자0. 본체 viewer 넘침0 전달과 원본 서체·전수 글자 동등 미확인을 구분|
|상태|normal/pressed/selected/disabled/locked/claimed/조건충족의 관찰 근거와 결과|본체 Recruit normal/pressed/disabled tint 확인 전달. depth/image variants 미등록·전체 상태 검수 미완료|
|입력·연결|실제 진입→선택/확인→뒤로/닫기, 모달 inert, Escape, 스크롤 결과|본체 runtime6시나리오 및 Hero PageDown 통과 전달. 정적 preview와 구분·모집 목적지는 미조립|
|대조|같은 기준 크기에서 reference와 native 화면 비교·차이·캡처 경로|전체 동등 검수0/31 / 대표 W/P/U/S 종합 검수0/4. 개별 GUI 통과와 구분|
|완료 범위|가족별 partial/명세만/검수대기를 구분한 기록|4가족 부분 조립·27가족 명세만(미제작)|

캡처와 GUI 검수 자료를 붙일 때는 본체가 실제 수행한 화면 진입·저장 revision·표시 크기·상태·클릭 순서와 파일 경로를 적습니다. 소스/JSON 검사를 실제 플레이·반응형·모바일·입력 검수로 표현하지 않습니다. 수행하지 않은 검수는 그대로 미확인으로 둡니다.

## 9. 읽은 원본과 후보 작성 이력

이 문서 작업자가 직접 읽고 대조한 범위는 아래와 같습니다.

- 작업 루트 `/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/tile-survival-20261118/` 아래 `catalog/catalog.json`, `catalog/inventory.md`, `catalog/sample-evidence.json`
- 같은 작업 루트의 `sample-match/inventory.json`, `sample-match/selected-layout-evidence.md`, `sample-match/match-candidates.md`
- provenance가 지정한 C r90·M r354 원본 저장 JSON 두 파일. 수정 없이 읽어 저장 hash 및 선택 10화면의 계층·좌표·폰트·상태 핵심 필드를 대조
- 카탈로그 `index.html`의 가족 앵커 구조를 좁게 확인
- `catalog/native-actual-r63.json`을 직접 읽어 r63 시각·SHA·4/219/5·skin42·고유참조48·shadow20·scroll-y·돌출 해소·검수0/31 및0/4 근거를 대조. 대상 저장 JSON/GUI를 직접 검사한 작업은 아님
- 본체가 전달한 viewer DOM8상태·최종 캡처 크기/선택 절차·runtime6시나리오·Hero 태블릿/폰·Recruit tint·이번 npm test673/673 결과를 8절에 반영. 예정 `browser-verification.json`은 읽거나 존재를 확인하지 않음
- `native-review-v002.md/json`을 직접 읽어 r57 수치·SHA·현재 카드·규격·모델 확인·audit 근거를 대조. 대상 저장본·브라우저·최종 GUI 증거를 이 작업자가 독립 확인한 자료가 아님. 과거 돌출 의도와 r63 후속 편집·WorldHUD425초 관찰값·후속 GUI 검수 경계는 본체 메시지도 근거로 사용

후보 작성 당시 산출은 `catalog/production-guide-candidate.md` 한 파일이었으며, 현재 배포 문서는 본체가 별도로 검토·발행했습니다. 갱신 전 기존 후보는 지정 위치 `catalog/_backup/20261118_final_r63/production-guide-candidate.md`에 보존했습니다(SHA256 `71cde6b6d71c278bfcdd75842fcb855be776104543374b1d22bb6beb207b8094`). 사용자 프로젝트 저장 JSON, 제품 소스, 공용 지시·STATUS·보고, 다른 샘플, 서버, 브라우저, 카탈로그 두 사본은 수정하지 않았습니다. 최종 정책·시각 동등 검수·모든 가족 제작 완료는 아직 확정하지 않습니다.


## Published package
The root published this guide after the native r63 GUI checks. The earlier candidate and r57 snapshot remain preserved. Native sample data has 4 partial families; 27 families remain specified only.
