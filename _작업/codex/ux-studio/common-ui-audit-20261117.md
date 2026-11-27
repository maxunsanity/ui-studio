# Monopoly 공통 UI 감사 — 2026-11-17

제안(검수 대기). 기준 r248, 10화면 모두551×984. 동일 역할 공통 규격을 스크린샷별 치수보다 우선합니다. 설계 파일과 resolveRect 계산만 읽었으며 실제 화면은 검사하지 않았습니다.

원본 `samples/monopoly-go/ui-studio/designs/backups/ux-gjs-0d80d7fe-r248-6d2588c6-62fc-4f05-8450-b4eada4a38f1.json` / SHA `fa61ae7b283cef60429536e4d381a48ed8a1fa4ba341f0e14dc74a9beb384799`.

## 하단 공통 비교

처음 요청한60안: Footer `[0,924,551,60]`, 선6, Close `[253.5,932,44,44]`, 글자28²@8/8. 이후 검토 후보72안: Footer `[0,912,551,72]`, 선6, optional title y8/h20, Close `[253.5,940,44,44]`, 글자 `[261.5,948,28,28]`. 모든 같은 가족에 제목 예약행을 유지하며 X 중심y962. 72안은 검토 후보이고 적용/승인 사실이 아닙니다.

| 가족 | Footer 현재 화면 rect | Close 현재 화면 rect | 72안 h / Close y 변화 | Footer ID |
|---|---|---|---|---|
| Build | `[0,898.72,551,85.28]` | `[253.5,935.76,44,44]` | h -13.28 / y 4.24 | `element-3e24bfb6-d26d-4697-9a3c-051abc1e2a0f` |
| Wins | `[0,925.1,551,58.9]` | `[253.5,933.1,44,44]` | h 13.1 / y 6.9 | `element-d820bd0d-9e5d-47a7-b614-cf0cb69069f0` |
| Friends | `[0,916.76,551,67.24]` | `[255.65,931.05,44,44]` | h 4.76 / y 8.95 | `element-001653c9-34c1-44ea-893c-a7ec0914477c` |
| Menu | `[0,908.02,551,75.98]` | `[253.5,920.02,44,44]` | h -3.98 / y 19.98 | `element-a3fc2bf7-fc60-4585-8fd7-b6238373fbd6` |
| Showroom | `[0,911.59,551,72.41]` | `[253.5,925.59,44,44]` | h -0.41 / y 14.41 | `element-2c764a65-2dc0-49c1-b1ca-5337555ea3a3` |
| Shop | `[0,926.74,551,57.26]` | `[253.5,933.37,44,44]` | h 14.74 / y 6.63 | `element-9bbbcb6f-baae-466b-bb74-8d81e6688f0e` |

6가족 모두 현재 Footer 높이가 다릅니다(57.26~85.28). Close 입력은 모두44²이지만 위치가 다르고, 독립28² 글자 영역은 아직 맞지 않습니다. Build/Wins는 버튼 자체×이며 별도 label이 필요합니다. Friends/Menu/Showroom/Shop의 기존 label ID는 JSON에 기록했습니다. Build/Wins/Friends에는 독립 top line이 없으며 기존 frame 안의 선을 native6px와 같다고 간주하지 않습니다.

Build의 `HUD_Build_Bottom`은551×272/y712이며 Footer 전용이 아닙니다. 72안은 기존 부모 안 BG [0,200,551,72], title [0,208,551,20], Close [253.5,228,44,44]입니다. HUD 전체를72로 줄이지 않습니다. 도시 문구 `NEW YORK CITY 3/15`를20px/line20으로 title행에 유지하는 variant를 명시합니다. 60안에서 가운데 title20+Close44는 이미64px라 선/간격 없이도 쌓을 수 없습니다. 72안은 title끝940과 Close시작940이 맞닿아 실제 fallback font 여유를 본체가 확인해야 합니다.

## 72안 본문 경계 보정 대상

| 대상 | 현재 화면 rect / 끝 | y912 겹침 | native 보정 제안 / ID |
|---|---|---|---|
| Wins day count | `[111.11,880.98,325,32]` / 912.98 | 0.98 | Move native y upward at least0.98px to avoid y912; 6px gutter proposal gives y874,h32,bottom906 (-6.98). Keep text/value/ID.<br>`element-7b6142e4-35c9-4e48-ad79-3cc3b2f44e7c` |
| Wins clipboard body | `[10.2,105.68,525.49,819.42]` / 925.1 | 13.1 | Body extends to925.1 and candidate footer covers13.1px. At minimum fix DayCount; owner decides body bottom/clip within common boundary.<br>`element-8a3b4e4e-f074-46f1-b4b0-449fb64fcfa4` |
| Friends scroll viewport | `[24.75,328.71,505.8,584.85]` / 913.56 | 1.56 | Native viewport bottom912 => height583.29 at y328.71 (shrink1.56), or bottom906 with6px gutter => height577.29. Keep content636 and existing scroll records.<br>`element-c62d41db-9fa4-49e2-9ad1-f0ffbe27c701` |
| Shop product viewport | `[0,312.55,551,614.19]` / 926.74 | 14.74 | Native viewport bottom912 => height599.45 at y312.55 (shrink14.74). Keep scroll content/cards and max scroll behavior; no item removal.<br>`element-ca5280d4-3ce6-4926-a149-2923d32dc95d` |
| Showroom category bar | `[0,835.47,551,76.12]` / 911.59 | 0 | Bottom911.59 leaves0.41px before candidate footer912; no overlap by saved geometry.<br>`element-62d9768d-a143-45ce-beb5-7763359dd014` |
| Menu drawer | `[206.62,9.27,342.51,867.25]` / 876.52 | 0 | Bottom876.52 remains35.48px above candidate footer912.<br>`group-0d55c300-a6f2-47e0-b511-c561cf7121d4` |
| Build city text | `[0,908.72,551,32]` / 940.72 | 28.72 | Current text spans908.72..940.72. Candidate title belongs at920..940 inside footer,20px high; Close940..984. Treat as footer content, not body.<br>`element-c213d8da-6121-4e8b-8105-f4ce9ccdf858` |

Friends/Shop은 viewport 끝만 공통 경계에 맞추고 scroll content 전체 높이·레코드·카드를 유지해야 합니다. 스크롤 content가 viewport보다 긴 것은 Footer 겹침과 다릅니다. 위 수치는 저장 좌표의 겹침이며 실제 글자 가림 판정은 아닙니다.

## 별도 닫기/뒤로 변형

| 변형 | 현재 입력 / 앵커 | 공통 입력·글자 | 부모 / ID |
|---|---|---|---|
| Tycoon floating bottom Close | `[253.5,932,44,44]` / percentage-only | hit44² / glyph28²@[8,8] | Group_Tycoon_Content<br>`element-389bb5e2-3bf4-4c3e-817a-9078e2b664de` |
| Racing upper-right Close | `[487.48,117.07,44,44]` / top-fixed | hit44² / glyph28²@[8,8] | Group_Racing_Content<br>`element-3943db0c-520f-4ea3-b6cf-e6fe313ab494` |
| Album top-left Back | `[8,8,44,44]` / percentage-only | hit44² / glyph28²@[8,8] | Group_Album_Header<br>`element-fb8e453f-43eb-4d86-b2c5-e7ca157cc1fd` |

Tycoon은 bottom8/h44인 떠 있는 Close로 y932를 유지하는 별도 variant이며72 Footer y940으로 강제하지 않습니다. 현재 위치는 맞고 native bottom anchor는 미설정(percentage-only)입니다. Racing은 우측상단44/28, 기존40px disc 장식 variant이며 하단 바를 만들지 않습니다. Album은 top-left44/28 native `‹` Back이며 `×` Close와 의미·위치가 다릅니다.

## 상단 HUD 비교

기준 외곽 `[9,12,536,94]`, SNS+bar의 parent-local bar `[75,16,461,54]` → 화면 `[84,28,461,54]`. 이는 논리 outer top12/bar top28/h54이고 실제 OS safe-area 검수값은 아닙니다.

| 화면/가족 | 외곽 현재 | bar parent-local 현재 | bar 화면 현재 | 외곽 ID / bar ID |
|---|---|---|---|---|
| Page_Board / SNS+bar | `[9,12,536,94]` | `[75,16,461,54]` | `[84,28,461,54]` | `group-b421c329-4b36-4333-921c-22d6d37b45db` / `element-83c6290c-ba9f-4ef1-9c9d-37f8332373d4` |
| Modal_Shop_Store / SNS+bar | `[10.1,4,534.16,91.61]` | `[76.12,17.51,454,52.54]` | `[86.22,21.51,454,52.54]` | `element-e5cee089-2d91-4d7a-92c4-3cd944c37248` / `element-f40a35a0-20f9-4805-973d-faee17940c6c` |
| Page_Build_City / no-photo content variant | `[0,0,551,80]` | `[15.67,15.74,526.19,55.1]` | `[15.67,15.74,526.19,55.1]` | `element-eec7d22a-09e0-464f-a13f-7a095f4f3224` / `element-f7a6ccde-d23b-4109-8996-c5b21edb48b6` |

Main 기준은 이미 일치합니다. Shop은 outer와 bar의 부모-local rect를 함께 맞춰야 합니다. 부모만 바꾸면 비율로 배치된 자식이 재계산되어 Main 값과 다르게 남습니다. Shop Cash는 HUD 자식, Main Cash는 bar 자식이므로 같은 Cash 규격을 적용할 때는 ID/값을 보존한 native 부모·local 보정이 필요합니다.

Build는 사진 없는 level/cash/houses/menu content variant입니다. 같은 outer [9,12,536,94], bar top28/h54를 유지하고 bar 폭만 full536/localx0으로 명시 제안합니다(화면 [9,28,536,54]). SNS 가족은 bar localx75/w461을 공유합니다.

Main SNS는96² local[0,-2], Menu 입력은 localy-6으로 외곽을 벗어납니다. 이 저장된 장식/입력 겹침을 엄격한94px 클립·안전 경계와 혼동하지 않습니다. 공통 가이드 담당이 의도된 overhang/containment를 명시해야 하며 이 감사는 정책을 확정하지 않습니다. Wins/Friends는 자체 HUD 없이 뒤의 Main을 참조하므로 HUD를 다시 복사하지 않습니다. Menu profile/Showroom arch/Album curtain/event title은 별도 content family입니다.

## 상단 부품·부모·px·앵커 전체 목록

parentSize와 rectPx는 실제 저장 부모 기준입니다. percentage-only는 명시 rectTransform 없음이며 JSON에는 raw percent/rectTransform도 모두 있습니다.

### Page_Board

| 부품 / ID | 부모 / parentSize | parent-local rectPx | native anchor |
|---|---|---|---|
| Group_TopBar<br>`element-83c6290c-ba9f-4ef1-9c9d-37f8332373d4` | HUD_Top<br>`[536,94]` | `[75,16,461,54]` | percentage-only |
| BG_TopBar<br>`element-83c6290c-ba9f-4ef1-9c9d-37f8332373d4-background` | Group_TopBar<br>`[461,54]` | `[0,0,461,54]` | percentage-only |
| Img_Cash<br>`element-83c6290c-ba9f-4ef1-9c9d-37f8332373d4-image` | Btn_HUD_Cash<br>`[214,34]` | `[0,0,45,34]` | percentage-only |
| Txt_HUD_Cash_Amount<br>`element-83c6290c-ba9f-4ef1-9c9d-37f8332373d4-label` | Btn_HUD_Cash<br>`[214,34]` | `[58,0,156,34]` | percentage-only |
| Frame_TopBar<br>`element-83c6290c-ba9f-4ef1-9c9d-37f8332373d4-frame` | Group_TopBar<br>`[461,54]` | `[0,0,461,54]` | percentage-only |
| Img_HUD_Shield01<br>`element-0d2733f8-2a6c-43c1-875c-5b88342b1304` | Btn_HUD_Shields<br>`[88,36]` | `[0,0,27,36]` | percentage-only |
| Img_HUD_Shield02<br>`element-b44d713d-5bfe-45dc-a9a3-7258c8664141` | Btn_HUD_Shields<br>`[88,36]` | `[20.33,0,27,36]` | percentage-only |
| Img_HUD_Shield03<br>`element-2f1c3d6a-35cf-497d-ad20-41bebd01f779` | Btn_HUD_Shields<br>`[88,36]` | `[40.67,0,27,36]` | percentage-only |
| Group_SNSAvatar<br>`element-3405c78e-3c78-4e54-8f7b-a367e83e3757` | HUD_Top<br>`[536,94]` | `[0,-2,96,96]` | percentage-only |
| Btn_Menu<br>`element-e8785ae7-4e1d-4a27-acd8-e119263d624f` | HUD_Top<br>`[536,94]` | `[471,-6,58,70]` | percentage-only |
| Btn_HUD_Cash<br>`group-60125bc9-5219-4616-a184-e63867609f40` | Group_TopBar<br>`[461,54]` | `[52,10,214,34]` | percentage-only |
| Btn_HUD_Shields<br>`group-41e56a24-ea67-4991-9af8-3cb43c446a11` | Group_TopBar<br>`[461,54]` | `[292,9,88,36]` | percentage-only |
| Img_MenuBars<br>`element-e8785ae7-4e1d-4a27-acd8-e119263d624f-image` | Btn_Menu<br>`[58,70]` | `[12,34,33,28]` | percentage-only |
| Line_TopBar_Avatar<br>`element-cdf600ff-bc6c-4c3b-83b3-2a9ead9e77a6` | Group_TopBar<br>`[461,54]` | `[35,7,3,40]` | percentage-only |
| Line_TopBar_Shield<br>`element-8e889f54-9ea1-434e-b075-3a8a6a97fae6` | Group_TopBar<br>`[461,54]` | `[276,7,3,40]` | percentage-only |
| Line_TopBar_Menu<br>`element-ab75de95-072d-44bf-be9c-9a8c97d8e944` | Group_TopBar<br>`[461,54]` | `[393,7,3,40]` | percentage-only |
| HUD_Top<br>`group-b421c329-4b36-4333-921c-22d6d37b45db` | SCREEN<br>`[551,984]` | `[9,12,536,94]` | top-fixed |
| Img_SNSAvatar<br>`element-3405c78e-3c78-4e54-8f7b-a367e83e3757-image` | Group_SNSAvatar<br>`[96,96]` | `[7,7,82,82]` | percentage-only |
| Frame_SNSAvatar<br>`element-3405c78e-3c78-4e54-8f7b-a367e83e3757-frame` | Group_SNSAvatar<br>`[96,96]` | `[0,0,96,96]` | percentage-only |
| Img_HUD_Shield04<br>`element-77f613af-5a8f-48a3-add9-e253132318fe` | Btn_HUD_Shields<br>`[88,36]` | `[61,0,27,36]` | percentage-only |
| Badge_HUD_Menu<br>`element-e4a6c711-459c-4117-890e-13180b44181c` | Btn_Menu<br>`[58,70]` | `[34,0,18,18]` | percentage-only |
| Img_Notification_BG<br>`element-21172b40-502c-41f2-8df1-858dfa5d8b3d` | Badge_HUD_Menu<br>`[18,18]` | `[0,0,18,18]` | percentage-only |
| Txt_Notification_Count<br>`element-a606ecfe-9903-45b1-9bd4-2c5eabf3aac5` | Badge_HUD_Menu<br>`[18,18]` | `[0,0,18,18]` | percentage-only |

### Modal_Shop_Store

| 부품 / ID | 부모 / parentSize | parent-local rectPx | native anchor |
|---|---|---|---|
| Group_Shop_TopBar<br>`element-f40a35a0-20f9-4805-973d-faee17940c6c` | HUD_Shop<br>`[534.16,91.61]` | `[76.12,17.51,454,52.54]` | percentage-only |
| BG_Shop_TopBar<br>`element-485cc3d3-4a92-4f6a-9299-aa420f77f76f` | Group_Shop_TopBar<br>`[454,52.54]` | `[0,0,454,52.54]` | percentage-only |
| Img_Shop_Cash<br>`element-d5e63aaa-ef83-47d6-9bb0-b82b96fe1a36` | Group_Shop_Cash<br>`[182.55,38.39]` | `[0,4.72,41.09,29.64]` | percentage-only |
| Txt_Shop_HUD_Cash_Amount<br>`element-cfbeddf0-3912-4797-8997-4bc16fef43da` | Group_Shop_Cash<br>`[182.55,38.39]` | `[56.58,6.74,125.96,26.27]` | percentage-only |
| Frame_Shop_TopBar<br>`element-ceadff13-bccd-40c9-a7ec-2b3fcbfd2810` | Group_Shop_TopBar<br>`[454,52.54]` | `[0,0,454,52.54]` | percentage-only |
| Group_Shop_SNSAvatar<br>`element-1c4c8133-5a9c-433d-b926-76b32a9b1e88` | HUD_Shop<br>`[534.16,91.61]` | `[1.35,0,92.96,92.96]` | percentage-only |
| Group_Shop_Cash<br>`element-b14b186c-a1e1-49b0-92ec-b36a2c464ace` | HUD_Shop<br>`[534.16,91.61]` | `[127.98,24.92,182.55,38.39]` | percentage-only |
| Group_Shop_Dice<br>`element-9adedfc8-e501-4554-8e78-a31a41640aa7` | HUD_Shop<br>`[534.16,91.61]` | `[396.07,24.92,112,38.39]` | percentage-only |
| Line_Shop_TopBar_Avatar<br>`element-95da3fea-264f-4f67-96f5-1bb22374cf66` | Group_Shop_TopBar<br>`[454,52.54]` | `[35.03,6.07,1.35,37.05]` | percentage-only |
| Line_Shop_TopBar_Dice<br>`element-60186a90-24af-4083-9b7b-4de77e06a4b1` | Group_Shop_TopBar<br>`[454,52.54]` | `[284.26,6.07,1.35,37.05]` | percentage-only |
| Img_Shop_SNSAvatar<br>`element-c50b8527-6fb9-4002-9ef0-cd792f6b258b` | Group_Shop_SNSAvatar<br>`[92.96,92.96]` | `[6.78,6.78,79.4,79.4]` | percentage-only |
| Frame_Shop_SNSAvatar<br>`element-72f0330c-1719-4a45-b3c1-076493e6ceae` | Group_Shop_SNSAvatar<br>`[92.96,92.96]` | `[0,0,92.96,92.96]` | percentage-only |
| HUD_Shop<br>`element-e5cee089-2d91-4d7a-92c4-3cd944c37248` | SCREEN<br>`[551,984]` | `[10.1,4,534.16,91.61]` | top-fixed |
| Img_Shop_HUD_Dice<br>`element-b003c5cc-ab92-4820-ac64-9f34ff24bb29` | Group_Shop_Dice<br>`[112,38.39]` | `[0,0,33.68,38.39]` | percentage-only |
| Txt_Shop_HUD_Dice_Count<br>`element-6ec826b4-e53a-4564-89dd-e232f9d1635a` | Group_Shop_Dice<br>`[112,38.39]` | `[40.42,7.41,61.3,25.6]` | percentage-only |

### Page_Build_City

| 부품 / ID | 부모 / parentSize | parent-local rectPx | native anchor |
|---|---|---|---|
| Group_Build_TopBar<br>`element-f7a6ccde-d23b-4109-8996-c5b21edb48b6` | HUD_Build_Top<br>`[551,80]` | `[15.67,15.74,526.19,55.1]` | percentage-only |
| BG_Build_TopBar<br>`element-5e62da42-ba9a-49ed-8871-2f85d1c0382b` | Group_Build_TopBar<br>`[526.19,55.1]` | `[0,0,526.19,55.1]` | percentage-only |
| Img_Build_Cash<br>`element-17ee3393-29bc-4009-acdd-c1fe93136913` | Group_Build_Cash<br>`[157.99,36.74]` | `[1.3,1.3,41.8,34.1]` | percentage-only |
| Txt_Build_Cash_Amount<br>`element-406d176c-d691-4131-8d7f-5971874bbf98` | Group_Build_Cash<br>`[157.99,36.74]` | `[58.8,2,99,32]` | percentage-only |
| Frame_Build_TopBar<br>`element-da828a07-4294-4b03-958e-6f5e852cdbe7` | Group_Build_TopBar<br>`[526.19,55.1]` | `[0,0,526.19,55.1]` | percentage-only |
| Img_Build_Houses<br>`element-b83d0716-08c2-4898-9e9d-8ac5e27f7207` | Group_Build_Houses<br>`[79.65,35.42]` | `[0,0,41.8,34.1]` | percentage-only |
| Btn_Build_Menu<br>`element-06f95a8c-9148-43e8-85c9-fe5df4522d2c` | HUD_Build_Top<br>`[551,80]` | `[478,5,65,66]` | percentage-only |
| Group_Build_Cash<br>`element-bcdcf6f6-5495-4b38-a06f-0538fc11b99a` | Group_Build_TopBar<br>`[526.19,55.1]` | `[124.04,10.5,157.99,36.74]` | percentage-only |
| Group_Build_Houses<br>`element-2690e6be-e07d-4f05-a115-1e91e850d3c3` | Group_Build_TopBar<br>`[526.19,55.1]` | `[368.2,10.5,79.65,35.42]` | percentage-only |
| Img_Build_MenuBars<br>`element-b4735c71-a89f-4e40-9ccc-48d9baae8b85` | Btn_Build_Menu<br>`[65,66]` | `[19.5,26.5,24.8,26.2]` | percentage-only |
| Line_Build_Level_Cash<br>`element-763a125e-a9fe-46c6-ab03-b762912d215e` | Group_Build_TopBar<br>`[526.19,55.1]` | `[109.68,10.5,1.3,35.4]` | percentage-only |
| Line_Build_Cash_Houses<br>`element-e3f0d4d1-d1d1-49a2-9c82-b0584e12a111` | Group_Build_TopBar<br>`[526.19,55.1]` | `[348.62,10.5,1.3,35.4]` | percentage-only |
| Line_Build_Houses_Menu<br>`element-88e71a6b-54a6-4546-936b-ac953e59170b` | Group_Build_TopBar<br>`[526.19,55.1]` | `[463.52,10.5,1.3,35.4]` | percentage-only |
| HUD_Build_Top<br>`element-eec7d22a-09e0-464f-a13f-7a095f4f3224` | SCREEN<br>`[551,984]` | `[0,0,551,80]` | top-fixed |
| Txt_Build_Houses_Count<br>`element-b43b8ef6-7785-4e45-92a8-a6dc8c19f2fb` | Group_Build_Houses<br>`[79.65,35.42]` | `[56.1,2,23,31]` | percentage-only |
| BG_Build_Level_Count<br>`element-2dba5ec8-ac11-492c-bf55-cb1ded106e85` | Group_Build_Level<br>`[100.54,35.42]` | `[15,2,84,31]` | percentage-only |
| Img_Build_Level_Star<br>`element-4f215546-df2f-4d54-a364-a0d98997b120` | Group_Build_Level<br>`[100.54,35.42]` | `[0,0,35.42,35.42]` | percentage-only |
| Group_Build_Level<br>`element-3b9e092f-c0da-46d5-9a26-cc193ebff9d0` | Group_Build_TopBar<br>`[526.19,55.1]` | `[6.53,10.5,100.54,35.42]` | percentage-only |
| Txt_Build_Level_Count<br>`element-11aae658-6f12-4673-874d-eafdb3c7c6aa` | Group_Build_Level<br>`[100.54,35.42]` | `[35.42,0,65.12,35.42]` | percentage-only |
| Badge_Notification_Build_Menu<br>`element-f9ad9ef0-2f09-4c3c-9c4d-056eb7ce05a5` | Btn_Build_Menu<br>`[65,66]` | `[40.4,0.3,23.5,23.5]` | percentage-only |
| Img_Notification_BG<br>`element-5908ba8b-74fb-4547-9c44-81008a2b7400` | Badge_Notification_Build_Menu<br>`[23.5,23.5]` | `[0,0,23.5,23.5]` | percentage-only |
| Txt_Notification_Count<br>`element-a2db9f68-ca9c-45d8-b1a0-0d6a6182ab75` | Badge_Notification_Build_Menu<br>`[23.5,23.5]` | `[0,0,23.5,23.5]` | percentage-only |

## 한계와 보존

쓴 파일은 이 JSON/Markdown 두 개입니다. 설계·소스·자원·가이드·공용 STATUS/보고·브라우저·HTTP·capybara에는 쓰거나 실행하지 않았습니다. ID·게임 값·연결은 변경하지 않았습니다. 실제 모바일/데스크톱 입력·복귀·overflow·글자맞춤과 승인 여부는 미검수입니다. native label의 appearance.fill만으로 배경색을 판단하지 않습니다.

r248 원본 SHA 읽기 전후 불변: true. 종료 시 canonical revision: 249.
