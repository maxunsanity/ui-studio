# 클래시 로얄 선행 샘플 대조

작성 2026-11-18 16:16:07 KST · codex 하위 분석 · 제안(검수 대기)

두 샘플의 저장값만 분석했습니다. 실제 툴 제작·화면 검수·새 샘플 복사는 수행하지 않았습니다. **샘플 제작값과 클래시 원본 관찰/제안값을 구분합니다.** 이 하위는 클래시 영상을 직접 보지 않았고 부모 본체의 관찰 목록을 입력으로 사용했습니다.

| 실제 원본 | workspace / project | 판 / 논리크기 |
| --- | --- | --- |
| [tile](/Users/max/projest_max/ui-studio/samples/tile-survival/ui-studio/designs/ux-25ecc98a.json) | workspace-76e57701-a74e-4e37-a4f6-9e83c12cd6fc<br>ux-25ecc98a | r63; 504×894 |
| [mono](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json) | workspace-8e0f09e7-4699-4ac6-81b3-d545c7046ef6<br>ux-gjs-0d80d7fe | r354; 551×984 |

대상 영상 1080×2340, 새 논리 화면 **390×844는 제작 제안**입니다. 원본 프레임의 구역별 x/y/W/H는 배정에 없어 미측정입니다. 같은 비율 contain 계산 시 source scale 0.360683761, 표시 389.538×844, x offset 0.231입니다. 대상의 실제 UI 좌표/타이포그래피/safe area를 뜻하지 않습니다.

배치 숫자는 샘플 logicalSize에서 도구의 `resolveRect`로 계산한 화면 기준 **x,y,W,H 논리px**입니다. 소수3자리 반올림이며 JSON의 rawParentPercent·anchor에 원 저장값을 보존했습니다. inputOwner는 저장계약 계산이고 실제 DOM 입력 성공이 아닙니다.

| 후보 | 대상 / 적합 | 샘플 제작값 요약 | 반드시 변경/확인 |
| --- | --- | --- | --- |
| home_toolbar | 홈 상단 자원줄/하단 5탭<br>부분 적합 | nav 슬롯 가로 pitch 84; nav 슬롯 사이 여백 0; nav 아이콘→라벨 겹침 4; 상단 HUD 고정 높이 64; 하단 nav 고정 높이 64 | 상단 고정 HUD·하단 고정 nav를 중앙 장면과 형제로 두는 계층을 참고합니다. 샘플 nav는 6슬롯이고 중앙은 영지 그림입니다. 클래시 5탭·중앙 아레나·자원 종류/아이콘/라벨은 새 원본에 맞춥니다. |
| collection_four_columns | 컬렉션 4열 목록 / 덱 카드 유닛 참고<br>컬렉션 구조 적합·덱은 부분 | 가로 카드 크기 111; 세로 카드 크기 180; 가로 gap 8; 세로 gap 10; 왼쪽/오른쪽 여백 18; header→list 8; list→footer 8 | 4열·분리 초상/native 레벨·스크롤 본문/고정 상하단의 구조를 참고합니다. 덱은 이 유닛을 새 4×2 컨테이너에 조립할 후보이며 Tower 영역·덱 선택·교체 동작은 없습니다. |
| album_card_family | 카드 그림/제목/수량 분리 유닛<br>유닛만 부분 적합 | 가로/세로 gap 6; card W 164; card H 248; content padding top 25.59; content padding right 24; content padding bottom 24; content padding left 23 | 카드 그림·제목·진행수량과 입력 wrapper 분리, scroll viewport→content→카드 계층을 참고합니다. 샘플은 앨범 세트 3열 9장이고 클래시 컬렉션/덱은 4열 개별 카드입니다. |
| social_tabs_rows | 소셜/클랜 탭 + 세로 목록<br>목록/탭 구조만 부분 적합 | 반복 활동행 W 485.35; 반복 활동행 H 80; 반복 활동행 gap 4; 행 내부 이름 x offset 97; 행 내부 이름 y offset 8 | 헤더·선택 탭·scroll viewport·반복행·고정 닫기를 참고합니다. 샘플은 modal이고 클랜 목록은 전체 페이지 컨테이너와 하단 5탭을 별도로 검토해야 합니다. |
| shop_products | 세로 상점 / 상품 그림·수량·가격·구매 분리<br>부분 적합 | 상품 W 156.27; 상품 H 224.98; 상품 가로 pitch 167.05; 상품 가로 gap 10.78; 상품 세로 pitch 268.76; 상품 세로 gap 43.78 | 고정 HUD/프로모션·scroll 상품영역·고정 footer와 상품별 그림/수량/가격/버튼 분리를 참고합니다. 클래시 상점은 세로 섹션·서로 다른 offer 크기를 원본대로 재구성해야 합니다. |
| card_detail_surrogate | 카드 상세의 확대 그림/제목/하단 CTA 참고<br>근접 예제·직접 적합 없음 | nameplate→category gap 5; footer 고정 H 72; Close hit W/H 44; CTA 버튼 W 244; CTA 버튼 H 72 | 확대 전시 그룹·이름표·그림/native 글자 분리와 하단 CTA/Close만 참고합니다. 원본 카드 상세의 능력치/레벨/업그레이드 비용/확인 상태와 sheet 바닥 위치는 새로 정의해야 합니다. |

## home_toolbar — Page_TSV_Territory

화면 ID `main`; page; logical 504×894; safeArea 저장값 없음. presentation 저장값 없음.

| 실제 이름 / ID | 부모 ID | x,y,W,H | 폰트 / state | overflow / 입력 | slice / 자원 |
| --- | --- | --- | --- | --- | --- |
| [HUD_TSV_Top](/Users/max/projest_max/ui-studio/samples/tile-survival/ui-studio/designs/ux-25ecc98a.json:1)<br>`group-ccc9abdd-7b7c-4251-baf8-db31ba4570a8` | `main` | 0, 0, 504, 64 | —<br>미지정 | 미지정<br>none → 없음 | —<br>— |
| [BG_TSV_HUD_PowerCell](/Users/max/projest_max/ui-studio/samples/tile-survival/ui-studio/designs/ux-25ecc98a.json:1)<br>`element-8508e0d9-c1ac-45fc-8c53-c5e7e7c9ab59` | `group-ccc9abdd-7b7c-4251-baf8-db31ba4570a8` | 82, 3, 116, 24 | —<br>미지정 | 미지정<br>none → 없음 | 9slice src[5,5,5,5] edge[2,2,2,2] pad[0,0,0,0]<br>sha256-4d90275894d87… |
| [Txt_TSV_HUD_Power](/Users/max/projest_max/ui-studio/samples/tile-survival/ui-studio/designs/ux-25ecc98a.json:1)<br>`element-bbf566b8-d06b-4f58-94be-fcdaab065500` | `group-ccc9abdd-7b7c-4251-baf8-db31ba4570a8` | 86, 3, 112, 24 | size 17 / family 미지정 / weight 700 / line 21 / left / wrap 미지정<br>미지정 | 미지정<br>none → 없음 | —<br>— |
| [Img_TSV_HUD_Power](/Users/max/projest_max/ui-studio/samples/tile-survival/ui-studio/designs/ux-25ecc98a.json:1)<br>`element-64d5ed75-779d-439d-b2e7-f0d148242a11` | `group-ccc9abdd-7b7c-4251-baf8-db31ba4570a8` | 66, 3, 22, 25 | —<br>미지정 | 미지정<br>none → 없음 | image contain<br>sha256-1b58af09c6684… |
| [HUD_TSV_Nav](/Users/max/projest_max/ui-studio/samples/tile-survival/ui-studio/designs/ux-25ecc98a.json:1)<br>`group-43921518-07ac-44a3-a720-05a0e2ab4626` | `main` | 0, 830, 504, 64 | —<br>미지정 | 미지정<br>none → 없음 | —<br>— |
| [Btn_TSV_Nav_Heroes](/Users/max/projest_max/ui-studio/samples/tile-survival/ui-studio/designs/ux-25ecc98a.json:1)<br>`element-0829ac2b-fe35-4a88-9124-073e0f75dbc0` | `group-43921518-07ac-44a3-a720-05a0e2ab4626` | 84, 830, 84, 64 | —<br>tint; normal/hover/pressed/selected/disabled | 미지정<br>action → element-0829ac2b-fe35-4a88-9124-073e0f75dbc0 | —<br>— |
| [Img_TSV_Nav_Heroes](/Users/max/projest_max/ui-studio/samples/tile-survival/ui-studio/designs/ux-25ecc98a.json:1)<br>`element-0829ac2b-fe35-4a88-9124-073e0f75dbc0-image` | `element-0829ac2b-fe35-4a88-9124-073e0f75dbc0` | 102, 830, 48, 48 | —<br>미지정 | 미지정<br>parent → element-0829ac2b-fe35-4a88-9124-073e0f75dbc0 | image contain<br>sha256-b74e83ebe50a5… |
| [Txt_TSV_Nav_Heroes](/Users/max/projest_max/ui-studio/samples/tile-survival/ui-studio/designs/ux-25ecc98a.json:1)<br>`element-0829ac2b-fe35-4a88-9124-073e0f75dbc0-label` | `element-0829ac2b-fe35-4a88-9124-073e0f75dbc0` | 84, 874, 84, 20 | size 14 / family 미지정 / weight 미지정 / line 미지정 / align 미지정 / wrap 미지정<br>미지정 | 미지정<br>parent → element-0829ac2b-fe35-4a88-9124-073e0f75dbc0 | —<br>— |

연결 저장값:

- `edge-8f2c6d91-ead8-4f49-add7-907c142f9857`: `screen-69d5b36b-cc28-4ecd-a95a-96be618354e2/element-759fb74d-e722-4af0-bc61-17d1d3a49dc8` — click/always/navigate → `main`; 복귀 대표 영지로 이동 · 자원차감/3초 타이머/완료처리 미구현; TSV03 00:38→00:41 · 영지 건설중 상태로 이동
- `edge-74af7c00-31f4-4af7-876a-69939170f3b5`: `main/element-0829ac2b-fe35-4a88-9124-073e0f75dbc0` — click/always/navigate → `screen-f6d00d61-09cc-45f5-bf29-fc0f2f6b5417`; 복귀 UI 시연 · 실제 게임 처리 없음; TSV02 하단 영웅 → 영웅 보유 목록
- `edge-772560f1-6a23-4ad5-a4c4-222ed5611483`: `main/element-039d35eb-e1f4-490a-805c-cde674440c99` — click/always/navigate → `screen-102560cd-a9db-4e4a-89ea-8138bd7bf0c6`; 복귀 정적 장면 선택 영역/온실 시연 · 실제3D선택 없음; TSV03 영지 건물 선택 → 온실 내부

한계:

- 6슬롯 중 Heroes만 유효 진입 연결입니다. 5탭의 각 목적지를 제공하지 않습니다.
- 기존 64px/84px 규격을 390폭에 그대로 강제하지 않습니다.

## collection_four_columns — Page_TSV_Heroes

화면 ID `screen-f6d00d61-09cc-45f5-bf29-fc0f2f6b5417`; page; logical 504×894; safeArea 저장값 없음. presentation 저장값 없음.

| 실제 이름 / ID | 부모 ID | x,y,W,H | 폰트 / state | overflow / 입력 | slice / 자원 |
| --- | --- | --- | --- | --- | --- |
| [HUD_TSV_Heroes_Header](/Users/max/projest_max/ui-studio/samples/tile-survival/ui-studio/designs/ux-25ecc98a.json:1)<br>`group-232cfc77-e31f-47ff-a2b0-f88c06239a9d` | `screen-f6d00d61-09cc-45f5-bf29-fc0f2f6b5417` | 0, 0, 504, 108 | —<br>미지정 | 미지정<br>none → 없음 | —<br>— |
| [List_TSV_Heroes](/Users/max/projest_max/ui-studio/samples/tile-survival/ui-studio/designs/ux-25ecc98a.json:1)<br>`group-e0be6b71-3ec5-42ba-b372-9aaff32baee3` | `screen-f6d00d61-09cc-45f5-bf29-fc0f2f6b5417` | 18, 116, 468, 694 | —<br>미지정 | scroll-y<br>none → 없음 | —<br>— |
| [HUD_TSV_Heroes_Footer](/Users/max/projest_max/ui-studio/samples/tile-survival/ui-studio/designs/ux-25ecc98a.json:1)<br>`group-dde3f332-3979-46a5-934b-d57f8e2a8686` | `screen-f6d00d61-09cc-45f5-bf29-fc0f2f6b5417` | 0, 818, 504, 76 | —<br>미지정 | 미지정<br>none → 없음 | —<br>— |
| [Card_TSV_Hero01](/Users/max/projest_max/ui-studio/samples/tile-survival/ui-studio/designs/ux-25ecc98a.json:1)<br>`group-3a3f4494-0292-4bde-8fc6-bed0dee78c98` | `group-e0be6b71-3ec5-42ba-b372-9aaff32baee3` | 18, 116, 111, 180 | —<br>미지정 | 미지정<br>none → 없음 | —<br>— |
| [Card_TSV_Hero02](/Users/max/projest_max/ui-studio/samples/tile-survival/ui-studio/designs/ux-25ecc98a.json:1)<br>`group-6b1224b0-e311-4258-830b-cce77ed90ec5` | `group-e0be6b71-3ec5-42ba-b372-9aaff32baee3` | 137, 116, 111, 180 | —<br>미지정 | 미지정<br>none → 없음 | —<br>— |
| [Card_TSV_Hero05](/Users/max/projest_max/ui-studio/samples/tile-survival/ui-studio/designs/ux-25ecc98a.json:1)<br>`group-c9d72508-b73c-41af-81c5-f1aaf702fd78` | `group-e0be6b71-3ec5-42ba-b372-9aaff32baee3` | 18, 306, 111, 180 | —<br>미지정 | 미지정<br>none → 없음 | —<br>— |
| [BG_TSV_Hero01](/Users/max/projest_max/ui-studio/samples/tile-survival/ui-studio/designs/ux-25ecc98a.json:1)<br>`element-5f4fb9fe-344f-4005-a942-df81f711f715` | `group-3a3f4494-0292-4bde-8fc6-bed0dee78c98` | 18, 116, 111, 180 | —<br>미지정 | 미지정<br>none → 없음 | 9slice src[9,9,9,9] edge[8,8,8,8] pad[0,0,0,0]<br>sha256-372a1d6a635bb… |
| [Img_TSV_Hero01](/Users/max/projest_max/ui-studio/samples/tile-survival/ui-studio/designs/ux-25ecc98a.json:1)<br>`element-a3557112-07d4-4b25-91bb-03576b6cc8a7` | `group-3a3f4494-0292-4bde-8fc6-bed0dee78c98` | 22, 120, 103, 154 | —<br>미지정 | 미지정<br>none → 없음 | image contain<br>sha256-5d000f8169206… |
| [Txt_TSV_Hero01_Status](/Users/max/projest_max/ui-studio/samples/tile-survival/ui-studio/designs/ux-25ecc98a.json:1)<br>`element-705a5f67-88c2-46f4-b425-ba75c513577b` | `group-3a3f4494-0292-4bde-8fc6-bed0dee78c98` | 26, 248, 96, 25 | size 18 / family 미지정 / weight 700 / line 22 / left / wrap 미지정<br>미지정 | 미지정<br>none → 없음 | —<br>— |
| [Btn_TSV_Heroes_Back](/Users/max/projest_max/ui-studio/samples/tile-survival/ui-studio/designs/ux-25ecc98a.json:1)<br>`element-5eed0a24-a228-4dce-81ac-eff668fea902` | `group-dde3f332-3979-46a5-934b-d57f8e2a8686` | 0, 824, 74, 64 | —<br>tint; normal/hover/pressed/selected/disabled | 미지정<br>action → element-5eed0a24-a228-4dce-81ac-eff668fea902 | —<br>— |

연결 저장값:

- `edge-56e3ae03-9680-4c28-9ace-ce5599c62783`: `screen-f6d00d61-09cc-45f5-bf29-fc0f2f6b5417/element-5eed0a24-a228-4dce-81ac-eff668fea902` — click/always/back → `없음`; 복귀 UI 시연 · 실제 게임 처리 없음; TSV02 영웅 목록 → 영지 복귀
- `edge-74af7c00-31f4-4af7-876a-69939170f3b5`: `main/element-0829ac2b-fe35-4a88-9124-073e0f75dbc0` — click/always/navigate → `screen-f6d00d61-09cc-45f5-bf29-fc0f2f6b5417`; 복귀 UI 시연 · 실제 게임 처리 없음; TSV02 하단 영웅 → 영웅 보유 목록

한계:

- 실제 layout.type=grid가 아닌 개별 카드의 fixed rectTransform 배치입니다.
- 필터는 panel이며 control tabs/연결이 없습니다. 모집/영웅 상세는 미연결입니다.
- 보유카드 4×2+Tower·바텀시트 전용 계층은 없습니다.
- scroll-y 저장은 있으나 authored 크기에서 11카드 본문560이 viewport694보다 짧습니다. 실제 스크롤 발생을 뜻하지 않습니다.

## album_card_family — Page_Album_Sets

화면 ID `screen-1bf4e2ab-55de-4d8c-a28c-9e4d37fc04ca`; page; logical 551×984; safeArea 저장값 없음. presentation 저장값 없음.

| 실제 이름 / ID | 부모 ID | x,y,W,H | 폰트 / state | overflow / 입력 | slice / 자원 |
| --- | --- | --- | --- | --- | --- |
| [Viewport_Album_Sets](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`group-87429c2f-99c9-459d-9adb-ae2705532856` | `screen-1bf4e2ab-55de-4d8c-a28c-9e4d37fc04ca` | 0, 359.41, 551, 624.59 | —<br>미지정 | scroll-y<br>none → 없음 | —<br>— |
| [Content_Album_Sets](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-e30e66f5-5e57-407d-bf14-fb9f75ba243c` | `group-87429c2f-99c9-459d-9adb-ae2705532856` | 0, 359.41, 551, 806 | —<br>미지정 | visible<br>none → 없음 | —<br>— |
| [Card_Album_Set01](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-aca889c0-962d-44b8-b2ac-e86b0790d30b` | `element-e30e66f5-5e57-407d-bf14-fb9f75ba243c` | 23, 385, 164, 248 | —<br>미지정 | 미지정<br>none → 없음 | —<br>— |
| [Card_Album_Set02](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-8622b40e-de5e-461d-b57a-29984b78d4d9` | `element-e30e66f5-5e57-407d-bf14-fb9f75ba243c` | 193, 385, 164, 248 | —<br>미지정 | 미지정<br>none → 없음 | —<br>— |
| [Card_Album_Set04](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-ec35afd1-e1f6-4371-8766-7b5f62ac1d36` | `element-e30e66f5-5e57-407d-bf14-fb9f75ba243c` | 23, 639, 164, 248 | —<br>미지정 | 미지정<br>none → 없음 | —<br>— |
| [Img_Album_Set01_Art](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-aca889c0-962d-44b8-b2ac-e86b0790d30b-image` | `element-aca889c0-962d-44b8-b2ac-e86b0790d30b` | 28, 395, 154, 154 | —<br>미지정 | 미지정<br>none → 없음 | image contain<br>sha256-8eccb069ebb27… |
| [Txt_Album_Set01_Title](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-aca889c0-962d-44b8-b2ac-e86b0790d30b-label` | `element-aca889c0-962d-44b8-b2ac-e86b0790d30b` | 23, 505, 164, 64 | size 26 / system / weight 900 / line 28 / center / wrap<br>미지정 | 미지정<br>none → 없음 | —<br>— |
| [Txt_Album_Set01_Count](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-91ca6081-7afe-494a-8756-cfe2f9b8c59d` | `element-aca889c0-962d-44b8-b2ac-e86b0790d30b` | 47, 583, 116, 30 | size 24 / system / weight 700 / line 28 / center / nowrap<br>미지정 | 미지정<br>none → 없음 | —<br>— |

연결 저장값:

- `edge-aa5110ff-c030-4e5a-8b30-2a6b06f963bf`: `screen-1bf4e2ab-55de-4d8c-a28c-9e4d37fc04ca/element-fb8e453f-43eb-4d86-b2c5-e7ca157cc1fd` — click/always/back → `없음`; 복귀 미정; 앨범에서 이전 화면으로
- `edge-2f1462c9-11f2-4ad8-874e-c8158c7f0f9d`: `main/element-0ff9acf5-d0f0-499f-b23f-b3cf49c1b5e1` — click/always/navigate → `screen-1bf4e2ab-55de-4d8c-a28c-9e4d37fc04ca`; 복귀 미정; 앨범 열기

한계:

- 3열 164×248을 클래시 카드 비율·4열에 직접 적용하지 않습니다.
- 카드 클릭→상세 연결은 없고 Back만 있습니다.
- 카드 level/희귀도/엘릭서/업그레이드 상태는 없습니다.

## social_tabs_rows — Modal_Friends_Timeline

화면 ID `common-1ea9535b-40a5-4941-a33b-57bf7b381aea`; modal; logical 551×984; safeArea 저장값 없음. presentation {"type":"modal","effect":"fade","durationMs":240,"autoCloseMs":0,"dim":true,"blocking":true,"dismissOnEscape":true,"closePolicy":"allow","rootMode":"fullscreen"}.

| 실제 이름 / ID | 부모 ID | x,y,W,H | 폰트 / state | overflow / 입력 | slice / 자원 |
| --- | --- | --- | --- | --- | --- |
| [Group_Friends_Panel](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-7173ad88-7bec-42c6-940c-01ead9054ea2` | `common-1ea9535b-40a5-4941-a33b-57bf7b381aea` | 10.76, 119.53, 531.63, 797.23 | —<br>미지정 | 미지정<br>none → 없음 | —<br>— |
| [Frame_Friends_Panel](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-7173ad88-7bec-42c6-940c-01ead9054ea2-frame` | `element-7173ad88-7bec-42c6-940c-01ead9054ea2` | 10.76, 119.53, 531.63, 797.23 | —<br>미지정 | 미지정<br>none → 없음 | 9slice src[27,27,27,27] edge[24,24,24,24] pad[0,0,0,0]<br>sha256-1ea09a227cb85… |
| [Tabs_Friends_Sections](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`common-1ea9535b-40a5-4941-a33b-57bf7b381aea-body` | `element-7173ad88-7bec-42c6-940c-01ead9054ea2` | 24.75, 227.32, 506.88, 94.98 | size 24 / family 미지정 / weight 800 / line 30 / align 미지정 / wrap 미지정<br>tabs value=timeline | 미지정<br>action → common-1ea9535b-40a5-4941-a33b-57bf7b381aea-body | 3slice src[0,24,0,24] edge[0,16,0,16] pad[0,0,0,0]<br>sha256-f86eb565bf6a7… / sha256-717ac02e4a5f4… |
| [Viewport_Friends_Timeline](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-c62d41db-9fa4-49e2-9ad1-f0ffbe27c701` | `element-7173ad88-7bec-42c6-940c-01ead9054ea2` | 24.75, 328.71, 505.8, 583.29 | —<br>미지정 | scroll-y<br>none → 없음 | —<br>— |
| [Content_Friends_Timeline](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-2ad1bafc-6f50-42d0-ad27-952698286dbf` | `element-c62d41db-9fa4-49e2-9ad1-f0ffbe27c701` | 24.75, 328.71, 505.8, 634.304 | —<br>미지정 | visible<br>none → 없음 | —<br>— |
| [Card_Friends_Activity02](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-3e3d4c4d-10a6-4b24-9159-e15d91b25fa2` | `element-a53d05fc-7b40-4ab2-a9c5-3e11f89853dd` | 33.36, 543.715, 485.35, 84 | —<br>미지정 | 미지정<br>none → 없음 | —<br>— |
| [Txt_Friends_Activity02_Name](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-3f8c3fc8-3f7f-4b08-ada0-0dca0e6c0f64` | `element-3e3d4c4d-10a6-4b24-9159-e15d91b25fa2` | 130.36, 551.715, 310, 28 | size 23 / family 미지정 / weight 900 / line 28 / left / wrap<br>미지정 | 미지정<br>none → 없음 | —<br>— |
| [Txt_Friends_Activity02_Message](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-7a0985db-14e9-473a-818d-4494b5905f13` | `element-3e3d4c4d-10a6-4b24-9159-e15d91b25fa2` | 130.36, 579.715, 329, 42 | size 16 / family 미지정 / weight 700 / line 20 / left / wrap<br>미지정 | 미지정<br>none → 없음 | —<br>— |
| [Btn_Friends_Close](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`common-1ea9535b-40a5-4941-a33b-57bf7b381aea-close` | `element-001653c9-34c1-44ea-893c-a7ec0914477c` | 253.5, 940, 44, 44 | —<br>tint; normal/hover/pressed/selected/disabled | 미지정<br>action → common-1ea9535b-40a5-4941-a33b-57bf7b381aea-close | —<br>— |

연결 저장값:

- `edge-4b9f52e5-6fa1-4da3-9a34-dcc8e7d9b63e`: `common-1ea9535b-40a5-4941-a33b-57bf7b381aea/common-1ea9535b-40a5-4941-a33b-57bf7b381aea-close` — click/always/close → `없음`; 복귀 선택/스크롤 유지; 닫고 원래 화면 유지
- `edge-0e60b1d4-0bdc-40c6-971d-42c39bf99957`: `main/element-a32e91d5-a51a-4dd6-b55a-f4bad1c1089a` — click/always/open → `common-1ea9535b-40a5-4941-a33b-57bf7b381aea`; 복귀 원래 화면 선택/스크롤 유지; Btn_BottomNav_Friends → 공통 모달

한계:

- add/leaderboard는 미관찰 빈 본문입니다. timeline만 실제 내용이 있습니다.
- 친구 요청 Send/Reject 입력이 있어도 게임/API 연결은 없습니다.
- 클랜 참가·검색·채팅·정렬·클랜정보 연결을 제공하지 않습니다.

## shop_products — Modal_Shop_Store

화면 ID `screen-8bda5052-36bc-4d68-812f-58c535aa4bc7`; modal; logical 551×984; safeArea 저장값 없음. presentation {"effect":"fade","durationMs":240,"autoCloseMs":0,"dim":false,"blocking":true,"dismissOnEscape":true,"closePolicy":"allow","type":"modal","rootMode":"fullscreen"}.

| 실제 이름 / ID | 부모 ID | x,y,W,H | 폰트 / state | overflow / 입력 | slice / 자원 |
| --- | --- | --- | --- | --- | --- |
| [HUD_Shop](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-e5cee089-2d91-4d7a-92c4-3cd944c37248` | `screen-8bda5052-36bc-4d68-812f-58c535aa4bc7` | 8, 12, 535, 96 | —<br>미지정 | 미지정<br>none → 없음 | —<br>— |
| [Group_Shop_HalloweenOffer](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-41312b24-130b-4001-be4d-3a89a79a7b60` | `screen-8bda5052-36bc-4d68-812f-58c535aa4bc7` | 30.31, 85.55, 488.36, 194.67 | —<br>미지정 | 미지정<br>none → 없음 | —<br>— |
| [Viewport_Shop_Products](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-ca5280d4-3ce6-4926-a149-2923d32dc95d` | `screen-8bda5052-36bc-4d68-812f-58c535aa4bc7` | 0, 312.55, 551, 599.45 | —<br>미지정 | scroll-y<br>none → 없음 | —<br>— |
| [Group_Shop_Product01](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-7d63fba0-2ea8-4307-b2d3-7305816d081d` | `element-ca5280d4-3ce6-4926-a149-2923d32dc95d` | 33.01, 412.92, 156.27, 224.98 | —<br>미지정 | 미지정<br>none → 없음 | —<br>— |
| [Group_Shop_Product02](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-7301ed62-3c4b-4050-b23d-30038f05bafa` | `element-ca5280d4-3ce6-4926-a149-2923d32dc95d` | 200.06, 412.92, 156.27, 224.98 | —<br>미지정 | 미지정<br>none → 없음 | —<br>— |
| [Group_Shop_Product04](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-7f8158a3-e12d-40f0-9bd3-e503d4bdd810` | `element-ca5280d4-3ce6-4926-a149-2923d32dc95d` | 33.01, 681.68, 156.27, 224.98 | —<br>미지정 | 미지정<br>none → 없음 | —<br>— |
| [Frame_Shop_Product01](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-f0927c74-e104-4c70-a230-12bcc160be8f` | `element-7d63fba0-2ea8-4307-b2d3-7305816d081d` | 33.01, 412.92, 148.19, 224.98 | —<br>미지정 | 미지정<br>none → 없음 | 9slice src[27,27,27,27] edge[24,24,24,24] pad[0,0,0,0]<br>sha256-6f02da9ecc27c… |
| [Txt_Shop_Product01_Quantity](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-b3b204d5-4ed8-486e-8729-1df683e3d4b0` | `element-7d63fba0-2ea8-4307-b2d3-7305816d081d` | 41.09, 433.13, 132.02, 47.15 | size 42 / family 미지정 / weight 900 / line 48 / center / wrap 미지정<br>미지정 | 미지정<br>none → 없음 | —<br>— |
| [Btn_Shop_Product01_Buy](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-f84a68f4-4dd6-49bf-8db2-f7f021c52b4f` | `element-7d63fba0-2ea8-4307-b2d3-7305816d081d` | 42.44, 580.64, 129.33, 44.46 | —<br>tint; normal/hover/pressed/selected/disabled | 미지정<br>action → element-f84a68f4-4dd6-49bf-8db2-f7f021c52b4f | —<br>— |
| [BG_Shop_Product01_Buy](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-aeb8dea2-ddd1-4e48-9f5b-84f434819694` | `element-f84a68f4-4dd6-49bf-8db2-f7f021c52b4f` | 42.44, 580.64, 129.33, 44.46 | —<br>미지정 | 미지정<br>none → 없음 | 3slice src[0,24,0,24] edge[0,16,0,16] pad[0,0,0,0]<br>sha256-ea2db7909fff4… |
| [Txt_Shop_Product01_Price](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-c8dd5e75-cee1-4fe7-864d-26c6cb3b8a7a` | `element-f84a68f4-4dd6-49bf-8db2-f7f021c52b4f` | 44.46, 583.33, 125.29, 36.37 | size 26 / family 미지정 / weight 900 / line 30 / center / wrap 미지정<br>미지정 | 미지정<br>parent → element-f84a68f4-4dd6-49bf-8db2-f7f021c52b4f | —<br>— |
| [Group_Shop_Footer](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-9bbbcb6f-baae-466b-bb74-8d81e6688f0e` | `screen-8bda5052-36bc-4d68-812f-58c535aa4bc7` | 0, 912, 551, 72 | —<br>미지정 | 미지정<br>none → 없음 | —<br>— |
| [Btn_Shop_Close](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-2150dcd4-a557-4c1c-a738-c4b656154a50` | `element-9bbbcb6f-baae-466b-bb74-8d81e6688f0e` | 253.5, 940, 44, 44 | —<br>tint; normal/hover/pressed/selected/disabled | 미지정<br>action → element-2150dcd4-a557-4c1c-a738-c4b656154a50 | —<br>— |

연결 저장값:

- `element-457d901d-7097-40a4-805a-60d8139881f2`: `screen-8bda5052-36bc-4d68-812f-58c535aa4bc7/element-2150dcd4-a557-4c1c-a738-c4b656154a50` — click/always/close → `없음`; 복귀 선택/스크롤 유지; 상점에서 이전 화면으로
- `edge-506502d9-4bdf-4f27-a3e2-0bd60a633ee1`: `main/group-60125bc9-5219-4616-a184-e63867609f40` — click/always/open → `screen-8bda5052-36bc-4d68-812f-58c535aa4bc7`; 복귀 원래 화면 선택/스크롤 유지; Btn_HUD_Cash → Modal_Shop_Store
- `edge-e02e9639-d038-4cb4-9a17-5b86f75a5fbb`: `common-0e507f99-6097-4037-ac6c-aa0e7229cb07/element-f4306411-a796-4c73-bf8a-3173f48433d9` — click/always/open → `screen-8bda5052-36bc-4d68-812f-58c535aa4bc7`; 복귀 메뉴 선택 유지; 메뉴 SHOP → 상점 팝업

한계:

- 샘플은 modal/fullscreen이며 main/menu에서 open, footer close입니다. 하단 5탭 페이지와 같지 않습니다.
- 샘플 3열×2행 상품과 실제 클래시 세로 offer 구성은 다릅니다.
- 구매 버튼 tint 입력은 있으나 결제/재화 차감 transition은 없습니다.
- scroll-y 저장은 있으나 authored 두 상품행은 viewport 안에 들어갑니다. 긴 세로 상점 스크롤 동등 검수는 아닙니다.

## card_detail_surrogate — Modal_Showroom_TokenDetail

화면 ID `screen-fb2afd7d-f997-4bc8-90f5-40439ae2af76`; modal; logical 551×984; safeArea 저장값 없음. presentation {"effect":"fade","durationMs":240,"autoCloseMs":0,"dim":false,"blocking":true,"dismissOnEscape":true,"closePolicy":"allow","type":"modal","rootMode":"fullscreen","hideBaseElements":[]}.

| 실제 이름 / ID | 부모 ID | x,y,W,H | 폰트 / state | overflow / 입력 | slice / 자원 |
| --- | --- | --- | --- | --- | --- |
| [Group_TokenDetail_Nameplate](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`group-7491c1cf-787c-48ff-95e6-9c85ba291964` | `screen-fb2afd7d-f997-4bc8-90f5-40439ae2af76` | 103, 35, 345, 73 | —<br>미지정 | 미지정<br>none → 없음 | —<br>— |
| [Frame_TokenDetail_Nameplate](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-8a0c2ae7-82e6-48ec-a723-a8c61a9f9ce8` | `group-7491c1cf-787c-48ff-95e6-9c85ba291964` | 103, 35, 345, 73 | —<br>미지정 | 미지정<br>none → 없음 | 9slice src[24,26,24,26] edge[24,26,24,26] pad[0,0,0,0]<br>sha256-44bc79d189208… |
| [Txt_TokenDetail_Name](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-3a6ed7f0-1da4-4147-a565-2ae064cae861` | `group-7491c1cf-787c-48ff-95e6-9c85ba291964` | 117, 44, 318, 52 | size 34 / family 미지정 / weight 800 / line 40 / center / wrap 미지정<br>미지정 | 미지정<br>none → 없음 | —<br>— |
| [Group_TokenDetail_Display](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`group-c416f5ac-971f-4191-8cff-7a4177a6c127` | `screen-fb2afd7d-f997-4bc8-90f5-40439ae2af76` | 85, 210, 386, 531 | —<br>미지정 | 미지정<br>none → 없음 | —<br>— |
| [Img_TokenDetail_Buttons](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-8c0206c1-233a-4db2-8873-e05e4588ba79` | `group-c416f5ac-971f-4191-8cff-7a4177a6c127` | 218, 280, 128, 219 | —<br>미지정 | 미지정<br>none → 없음 | image contain<br>sha256-cc9a3c273b06e… |
| [Group_TokenDetail_EquipDock](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`group-a633e3a8-b611-4838-ab14-db5b2bc317ac` | `screen-fb2afd7d-f997-4bc8-90f5-40439ae2af76` | 0, 810, 551, 102 | —<br>미지정 | 미지정<br>none → 없음 | —<br>— |
| [Btn_TokenDetail_Equip](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-295e8f60-a574-43a7-bf35-df897fabd91c` | `group-a633e3a8-b611-4838-ab14-db5b2bc317ac` | 153.5, 810, 244, 72 | —<br>image; normal/pressed/disabled | 미지정<br>action → element-295e8f60-a574-43a7-bf35-df897fabd91c | 3slice src[0,40,0,40] edge[0,40,0,40] pad[5,12,5,12]<br>sha256-e2bab5af10314… / sha256-bd864c5b55ff5… / sha256-f77ecd3e214eb… |
| [Txt_TokenDetail_Equip](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-dbf6e59d-81c2-449b-960d-b52c8b2cf8a1` | `element-295e8f60-a574-43a7-bf35-df897fabd91c` | 167.5, 819, 216, 48 | size 42 / family 미지정 / weight 800 / line 46 / center / wrap 미지정<br>미지정 | 미지정<br>parent → element-295e8f60-a574-43a7-bf35-df897fabd91c | —<br>— |
| [Footer_TokenDetail](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-ae932b51-e274-4903-b949-47489e3bbfae` | `screen-fb2afd7d-f997-4bc8-90f5-40439ae2af76` | 0, 912, 551, 72 | —<br>미지정 | 미지정<br>none → 없음 | —<br>— |
| [Btn_TokenDetail_Close](/Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json:1)<br>`element-d80d00ba-8baf-46fb-875f-b60f69128491` | `element-ae932b51-e274-4903-b949-47489e3bbfae` | 253.5, 940, 44, 44 | —<br>tint; normal/hover/pressed/selected/disabled | 미지정<br>action → element-d80d00ba-8baf-46fb-875f-b60f69128491 | —<br>— |

연결 저장값:

- `element-614bc0fe-f9f0-4341-a3ff-dce9b2fdb53b`: `screen-fb2afd7d-f997-4bc8-90f5-40439ae2af76/element-d80d00ba-8baf-46fb-875f-b60f69128491` — click/always/close → `없음`; 복귀 호출한 보드로 복귀; 게임 API 없음; 토큰 확대 상세 닫기

한계:

- 토큰 상세이며 카드 능력치/업그레이드 구조가 없습니다.
- equip/info/previous/next는 입력 wrapper이나 유효 transition이 없습니다.
- modal rootMode=fullscreen입니다. 바텀시트 동등 구조/동작으로 쓰지 않습니다.
- 명시 진입 transition은 없고 Close만 있습니다.

## 적합 샘플 없음

- **덱 4×2 + Tower**: 직접 적합 샘플 없음 4열유닛만 참고. 두 줄 고정/별도 Tower영역/덱탭/교체 상태와 연결은 새 영상 근거로 제작.
- **실제 바텀시트와 전체 페이지 전환**: 선정 샘플은 page 또는 fullscreen modal. 실제 sheet 동등 샘플 없음. kind/presentation/root 및 고정/스크롤 범위를 섞지 않음. 부모영상 원본에서 시트 외곽과 배후·닫기 경로를 먼저 확인.
- **카드 능력치·업그레이드**: 직접 적합 샘플 없음 확대그림/제목/CTA 분리만 참고. 비용·레벨·진행바·상태·성공화면·게임수치는 새 원본 필요.

## 확인 범위

- 현재 저장 JSON validateDocument 2개 통과, 후보 6개 / 노드 58개 계산값 유한·크기 양수 확인.
- 선택 노드의 참조 자원 16개 파일 존재 확인, 누락0. 전체 assetRef/경로·storedSize·bytes·실제사용 위치는 [sample-match.json](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/clash-sample-20261118/sample-match/sample-match.json)에 있습니다.
- 두 샘플 JSON의 전후 SHA256 동일. JSON 원본·샘플 자원·제품 소스·공용 STATUS/보고·서버·브라우저 변경0.
- 실제 브라우저/디자인 가이드·이미지 로딩/alpha·폰트·overflow·mouse/Enter/Space·스크롤/닫기/복귀는 미검수입니다. 저장된 상태명·edge 존재를 실제 동작 성공으로 쓰지 않습니다.
- Graphify root 지도는 없어서 지정 파일 직접 조회. 새 지도/전체스캔/보호파일 검색0.

재현: `node /Users/max/projest_max/ui-studio/_작업/codex/ux-studio/clash-sample-20261118/sample-match/extract-match.mjs`. 분석 파일 재생성만 수행하고 기존 설계 JSON을 편집하지 않습니다.
