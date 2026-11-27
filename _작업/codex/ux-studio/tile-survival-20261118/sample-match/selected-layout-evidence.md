# Observed layout evidence for selected candidates

Raw percent coordinates and parent hierarchy are observed source values. Logical x/y/w/h below are recursively calculated from those stored percentages; they are not browser measurements. Source RectTransform is preserved in candidate-parts.json.

## Page_Capybara_Lobby

capybara-go / workspace-ac9e2a9e-65c0-4fe8-b67a-79a5a9ae42d7 / ux-gjs-4e64eb72 r90 / page / 504x894

|Part|Parent|logical x,y,w,h (calculated)|stored x,y,w,h (%)|text/font|source line|
|---|---|---|---|---|---:|
|Group_Lobby_Scene|(root)|0,0,504,894|0,0,100,100| / |1|
|BG_HUD_Top|(root)|0,0,504,64|0,0,100,7.15884| / |1|
|Btn_Lobby_Start|(root)|140,674,224,64|27.7778,75.3915,44.4444,7.15884| / |1|
|BG_Nav_Bottom|(root)|0,786,504,108|0,87.9195,100,12.0805| / |1|

Observed outgoing links: 12.
- Btn_Nav_Equipment -> navigate / Page_Capybara_Equipment / event=click / condition=always
- Btn_Nav_Shop -> navigate / Page_Capybara_Shop / event=click / condition=always
- Btn_Nav_Talent -> navigate / Page_Capybara_Talents / event=click / condition=always
- Btn_Nav_Chest -> navigate / Page_Capybara_Chests / event=click / condition=always
- Btn_HUD_Gold -> open / Popup_Capybara_GoldSources / event=click / condition=always
- Btn_Event_Privilege -> navigate / Page_Capybara_Privileges / event=click / condition=always
- Btn_Event_Fund -> open / Popup_Capybara_Funds / event=click / condition=always
- Btn_Event_Calendar -> open / Popup_Capybara_Calendar / event=click / condition=always
- Btn_HUD_Profile -> open / Popup_Capybara_Profile / event=click / condition=always
- Btn_Event_SevenDay -> open / Popup_Capybara_SevenDay / event=click / condition=always
- Btn_Event_RightExpand -> open / Overlay_Capybara_Events / event=click / condition=always
- Btn_Lobby_Start -> navigate / Page_Capybara_Adventure / event=click / condition=always

Explicit buttonState fields: 1.
- Example Btn_Lobby_Start: mode=tint; targetGraphic=element-98211cfa-7c3f-42cd-b84d-bbade22d72d4; selected=False; enabled=True; pressFeedback={"enabled": true, "target": "element-d8a9ad5d-5e27-4642-9f16-6e26ae87186e", "distance": 3, "shadow": {"enabled": true, "color": "#000000", "opacity": 0.12, "x": 0, "y": 1, "blur": 1}}

Observed assetRef examples:
- BG_HUD_Top.image: sha256-f63f50313c0dc48627e22024a3b9021145c596efc28a52b324b36680463ffaca.png
- BG_Nav_Bottom.image: sha256-3d08a12ccaebd0ae0c67b4c098d6a76625897ea5024179c4f1789343a0175fc6.png

## Page_Capybara_Equipment

capybara-go / workspace-ac9e2a9e-65c0-4fe8-b67a-79a5a9ae42d7 / ux-gjs-4e64eb72 r90 / page / 504x894

|Part|Parent|logical x,y,w,h (calculated)|stored x,y,w,h (%)|text/font|source line|
|---|---|---|---|---|---:|
|Img_Equipment_CharacterStatic|(root)|136,152,232,184|26.9841,17.0022,46.0317,20.5817| / |1|
|Txt_Equipment_Power|(root)|224,350,84,28|44.4444,39.1499,16.6667,3.13199|231.1K / 18|1|
|Scroll_Equipment_Inventory|(root)|0,580,504,222|0,64.877,100,24.8322| / |1|
|Group_Equipment_InventoryContent|Scroll_Equipment_Inventory|0,580,504,468|0,0,100,210.811| / |1|
|Slot_Equipment_Inventory_01|Group_Equipment_InventoryContent|6,586,92,96|1.19048,1.28205,18.254,20.5128| / |1|
|Slot_Equipment_Inventory_02|Group_Equipment_InventoryContent|106,586,92,96|21.0317,1.28205,18.254,20.5128| / |1|
|Slot_Equipment_Inventory_06|Group_Equipment_InventoryContent|6,700,92,96|1.19048,25.641,18.254,20.5128| / |1|

Observed outgoing links: 5.
- Btn_Equipment_Nav_Adventure -> navigate / Page_Capybara_Lobby / event=click / condition=always
- Btn_Equipment_Nav_Shop -> navigate / Page_Capybara_Shop / event=click / condition=always
- Btn_Equipment_Nav_Talent -> navigate / Page_Capybara_Talents / event=click / condition=always
- Btn_Equipment_Nav_Chest -> navigate / Page_Capybara_Chests / event=click / condition=always
- Btn_HUD_Gold 복사 -> open / Popup_Capybara_GoldSources / event=click / condition=always

Explicit buttonState fields: 0.

Observed assetRef examples:
- Img_Equipment_CharacterStatic.image: sha256-ebd117b649eabdfeb3e0b0cbd50ee12635a62d99892a35d1c8bee114490e427f.webp

## Page_Capybara_Chests

capybara-go / workspace-ac9e2a9e-65c0-4fe8-b67a-79a5a9ae42d7 / ux-gjs-4e64eb72 r90 / page / 504x894

|Part|Parent|logical x,y,w,h (calculated)|stored x,y,w,h (%)|text/font|source line|
|---|---|---|---|---|---:|
|BG_Chests_Stage|(root)|0,0,504,894|0,0,100,100| / |1|
|Img_Chests_Central|BG_Chests_Stage|164,424,172,124|32.5397,47.4273,34.127,13.8702| / |1|
|Txt_Chests_Title|BG_Chests_Stage|88,234,328,42|17.4603,26.1745,65.0794,4.69799|브론즈 보물상자 / 26|1|
|Btn_Chests_Open|BG_Chests_Stage|160,582,184,64|31.746,65.1007,36.5079,7.15884| / |1|
|BG_Chests_Open|Btn_Chests_Open|160,582,184,64|0,0,100,100| / |1|
|Txt_Chests_Open|Btn_Chests_Open|160,582,184,64|0,0,100,100|보물상자 없음 / 24|1|
|Btn_Chests_Claim|BG_Chests_Stage|378,54,106,52|75,6.04027,21.0317,5.81655| / |1|
|Btn_Chests_Tab_Bronze|BG_Chests_Stage|8,684,90,52|1.5873,76.5101,17.8571,5.81655| / |1|
|Btn_Chests_Tab_Silver|BG_Chests_Stage|108,684,90,52|21.4286,76.5101,17.8571,5.81655| / |1|

Observed outgoing links: 11.
- Btn_Chests_Nav_Adventure -> navigate / Page_Capybara_Lobby / event=click / condition=always
- Btn_Chests_Nav_Equipment -> navigate / Page_Capybara_Equipment / event=click / condition=always
- Btn_Chests_Nav_Shop -> navigate / Page_Capybara_Shop / event=click / condition=always
- Btn_Chests_Nav_Talent -> navigate / Page_Capybara_Talents / event=click / condition=always
- Btn_Chests_Tab_Silver -> navigate / Page_Capybara_Chests_Silver / event=click / condition=always
- Btn_Chests_Tab_Gold -> navigate / Page_Capybara_Chests_Gold / event=click / condition=always
- Btn_Chests_Tab_Pet -> navigate / Page_Capybara_Chests_Pet / event=click / condition=always
- Btn_Chests_Tab_Amethyst -> navigate / Page_Capybara_Chests_Amethyst / event=click / condition=always
- Btn_Chests_Next -> navigate / Page_Capybara_Chests_Silver / event=click / condition=always
- Btn_Chests_Claim -> open / Popup_Capybara_ChestReward / event=click / condition=always
- Btn_HUD_Gold 복사 복사 -> open / Popup_Capybara_GoldSources / event=click / condition=always

Explicit buttonState fields: 0.

Observed assetRef examples:
- BG_Chests_Stage.image: sha256-ca5ae13d18c634010a79887e20475d1becfc01e07c6540826021da958adb9d31.webp
- Img_Chests_Central.image: sha256-bf9c25f4d1f7464ac034cc0fbdd09037ab140d3d966e18cdca16f952ec66bb81.webp
- BG_Chests_Open.image: sha256-fcc0177668f8e8ac612c376356be3da46d5dd78875d4fd5a5dd5453ce2ac0902.webp

## Popup_Capybara_ChestReward

capybara-go / workspace-ac9e2a9e-65c0-4fe8-b67a-79a5a9ae42d7 / ux-gjs-4e64eb72 r90 / modal / 504x894

|Part|Parent|logical x,y,w,h (calculated)|stored x,y,w,h (%)|text/font|source line|
|---|---|---|---|---|---:|
|Btn_ChestReward_Close|(root)|0,0,504,894|0,0,100,100| / |1|
|BG_ChestReward_Dim|Btn_ChestReward_Close|0,0,504,894|0,0,100,100| / |1|
|BG_ChestReward_Panel|Btn_ChestReward_Close|0,334,504,174|0,37.3602,100,19.4631| / |1|
|BG_ChestReward_Ribbon|Btn_ChestReward_Close|50,294,404,62|9.92063,32.8859,80.1587,6.93512| / |1|
|Txt_ChestReward_Title|Btn_ChestReward_Close|90,302,324,38|17.8571,33.7808,64.2857,4.25056|보상 / 28|1|
|BG_ChestReward_ItemSlot|Btn_ChestReward_Close|212,382,80,80|42.0635,42.7293,15.873,8.94855| / |1|
|Img_ChestReward_Gold|Btn_ChestReward_Close|220,390,64,64|43.6508,43.6242,12.6984,7.15884| / |1|
|Txt_ChestReward_Close|Btn_ChestReward_Close|90,758,324,32|17.8571,84.7875,64.2857,3.57942|클릭하여 닫기 / 18|1|

Observed outgoing links: 1.
- Btn_ChestReward_Close -> navigate / Page_Capybara_Chests_Bronze / event=click / condition=always

Explicit buttonState fields: 0.

Observed assetRef examples:
- BG_ChestReward_Dim.image: sha256-fc93bcb85cfd9ee95b039d5431fb909d80223b3bf14b46fca01d0c550bb9ce85.webp
- BG_ChestReward_Panel.image: sha256-9a0b4b6ba1efcc850ab5aae7a86fd93c31126b231e518fc4c942d90e060261c9.webp
- BG_ChestReward_Ribbon.image: sha256-6d2e6027aea6f5ac3473f165f2891dc3071050c254ffa547a19f273465f08b79.webp
- BG_ChestReward_ItemSlot.image: sha256-17a433016d45a32c1b26046e41f67c0e074f259dde75ec0e6403afafc880b728.webp
- Img_ChestReward_Gold.image: sha256-680fc17968b6c1f95f06168f59d756975cb47904e1aaee9a18955f83931e154e.webp

## Page_Build_City

monopoly-go / workspace-8e0f09e7-4699-4ac6-81b3-d545c7046ef6 / ux-gjs-0d80d7fe r354 / page / 551x984

|Part|Parent|logical x,y,w,h (calculated)|stored x,y,w,h (%)|text/font|source line|
|---|---|---|---|---|---:|
|Slot_Build_Scene|(root)|0,0,551,984|0,0,100,100| / |1|
|Btn_Build_Landmark01|HUD_Build_Bottom|6.5,714,100,171|1.17967,0.735294,18.1488,62.8676| / |1|
|Txt_Build_Landmark01_Price|Btn_Build_Landmark01|42.5,850,58,28|36,79.5322,58,16.3743|240 / 24|1|
|Btn_Build_Landmark02|HUD_Build_Bottom|116.25,714,100,171|21.098,0.735294,18.1488,62.8676| / |1|
|HUD_Build_Top|(root)|0,0,551,80|0,0,100,8.13008| / |1|
|HUD_Build_Bottom|(root)|0,712,551,272|0,72.3577,100,27.6423| / |1|

Observed outgoing links: 1.
- Btn_Build_Back -> back / (no target) / event=click / condition=always

Explicit buttonState fields: 7.
- Example Btn_Build_Landmark01: mode=tint; targetGraphic=element-8902fb67-9905-456f-9e9f-4dfe55495e71-image; selected=False; enabled=True; pressFeedback=null

## Page_Capybara_Talents_Upgrade

capybara-go / workspace-ac9e2a9e-65c0-4fe8-b67a-79a5a9ae42d7 / ux-gjs-4e64eb72 r90 / page / 504x894

|Part|Parent|logical x,y,w,h (calculated)|stored x,y,w,h (%)|text/font|source line|
|---|---|---|---|---|---:|
|BG_TalentsUpgrade_PowerToast|(root)|0,250,504,64|0,27.9642,100,7.15884| / |1|
|Img_TalentsUpgrade_Power|(root)|160,250,48,58|31.746,27.9642,9.52381,6.4877| / |1|
|Txt_TalentsUpgrade_Power|(root)|210,260,90,36|41.6667,29.0828,17.8571,4.02685|231.1K / 24|1|
|Img_TalentsUpgrade_Arrow|(root)|302,260,30,36|59.9206,29.0828,5.95238,4.02685| / |1|
|Txt_TalentsUpgrade_Delta|(root)|338,254,100,46|67.0635,28.4116,19.8413,5.14541|369 / 30|1|

Observed outgoing links: 6.
- Btn_Talents_Nav_Adventure 복사 -> navigate / Page_Capybara_Lobby / event=click / condition=always
- Btn_Talents_Nav_Equipment 복사 -> navigate / Page_Capybara_Equipment / event=click / condition=always
- Btn_Talents_Nav_Shop 복사 -> navigate / Page_Capybara_Shop / event=click / condition=always
- Btn_Talents_Nav_Chest 복사 -> navigate / Page_Capybara_Chests / event=click / condition=always
- Btn_Talents_HUD_Gold 복사 -> open / Popup_Capybara_GoldSources / event=click / condition=always
- Btn_TalentsUpgrade_Continent -> navigate / Page_Capybara_Continent / event=click / condition=always

Explicit buttonState fields: 0.

Observed assetRef examples:
- BG_TalentsUpgrade_PowerToast.image: sha256-58df9e08c520e90b8d983b2c73ce26403da42de1921084fa2f39d7a0cd478dd0.webp
- Img_TalentsUpgrade_Power.image: sha256-db3371a4cc0100bb1302d2cd096b268e56f216cae0887fcbd73f91e75251ab1f.webp
- Img_TalentsUpgrade_Arrow.image: sha256-86915a24700beda5cc33fe389b0b13a737977b08d7d5c04ebb42fcec185408cf.png

## Page_Capybara_Adventure

capybara-go / workspace-ac9e2a9e-65c0-4fe8-b67a-79a5a9ae42d7 / ux-gjs-4e64eb72 r90 / page / 504x894

|Part|Parent|logical x,y,w,h (calculated)|stored x,y,w,h (%)|text/font|source line|
|---|---|---|---|---|---:|
|Group_Adventure_Scene|(root)|0,0,504,410|0,0,100,45.8613| / |1|
|Btn_Adventure_Progress|(root)|120,744,264,108|23.8095,83.2215,52.381,12.0805| / |1|
|BG_Adventure_Log1|(root)|8,478,488,74|1.5873,53.4676,96.8254,8.2774| / |1|
|BG_Adventure_Log2|(root)|8,586,488,100|1.5873,65.5481,96.8254,11.1857| / |1|
|Txt_Adventure_Log1|(root)|24,488,450,48|4.7619,54.5861,89.2857,5.36913|수상한 표식을 발견했습니다. / 18|1|
|Txt_Adventure_Log2|(root)|24,600,452,64|4.7619,67.1141,89.6825,7.15884|보물이 있다는 표식입니다. 루드비히가 숨겨둔 보물 위치인 것 같습니다. / 18|1|

Observed outgoing links: 3.
- Btn_Adventure_Progress -> open / Popup_Capybara_SkillSelect / event=click / condition=always
- Btn_Adventure_Big -> open / Popup_Capybara_MythicSkill / event=click / condition=always
- Btn_Adventure_Medium -> open / Popup_Capybara_InstantWheel / event=click / condition=always

Explicit buttonState fields: 5.
- Example Btn_Adventure_Progress: mode=tint; targetGraphic=element-ba5f43d8-a421-4f9e-85ed-fc7556cf036c; selected=False; enabled=True; pressFeedback={"enabled": true, "target": "element-79ec2e18-4ea2-4560-a98e-716f5cd4cc90", "distance": 3, "shadow": {"enabled": true, "color": "#000000", "opacity": 0.12, "x": 0, "y": 1, "blur": 1}}

Observed assetRef examples:
- BG_Adventure_Log1.image: sha256-4fd867ef669b003316cad591a364105921c4eb6b460d51c5b4d3ac399c8783db.webp
- BG_Adventure_Log2.image: sha256-0a18fe8426057e56659db18948a33a3bec9768689f3c9b1d69fecc8a4dff3945.webp

## Popup_Capybara_SevenDay

capybara-go / workspace-ac9e2a9e-65c0-4fe8-b67a-79a5a9ae42d7 / ux-gjs-4e64eb72 r90 / modal / 504x894

|Part|Parent|logical x,y,w,h (calculated)|stored x,y,w,h (%)|text/font|source line|
|---|---|---|---|---|---:|
|BG_SevenDay_Panel|(root)|30,98,444,642|5.95238,10.962,88.0952,71.8121| / |1|
|Scroll_SevenDay_Quests|BG_SevenDay_Panel|140,350,314,360|24.7748,39.2523,70.7207,56.0748| / |1|
|BG_SevenDay_QuestContent|Scroll_SevenDay_Quests|140,350,314,376|0,0,100,104.444| / |1|
|BG_SevenDay_Quest1|BG_SevenDay_QuestContent|140,350,314,88|0,0,100,23.4043| / |1|
|Txt_SevenDay_Quest1_Title|BG_SevenDay_Quest1|148,354,230,22|2.54777,4.54545,73.2484,25|메인 스테이지58 완료 / 14|1|
|Btn_SevenDay_Quest1_Move|BG_SevenDay_Quest1|364,392,80,34|71.3376,47.7273,25.4777,38.6364| / |1|
|BG_SevenDay_Quest2|BG_SevenDay_QuestContent|140,446,314,88|0,25.5319,100,23.4043| / |1|
|BG_SevenDay_Quest3|BG_SevenDay_QuestContent|140,542,314,88|0,51.0638,100,23.4043| / |1|
|BG_SevenDay_Quest4|BG_SevenDay_QuestContent|140,638,314,88|0,76.5957,100,23.4043| / |1|

Observed outgoing links: 1.
- Btn_SevenDay_Close -> close / (no target) / event=click / condition=always

Explicit buttonState fields: 0.

Observed assetRef examples:
- BG_SevenDay_Panel.image: sha256-36647a36140ecd10e1a7a99542c6b873339ac64d32da5c5920977df79642011d.webp
- Scroll_SevenDay_Quests.image: sha256-597968538e7c962d583ff588fd086a93f8ce28a8f252bf51f599495181b341ec.webp
- BG_SevenDay_QuestContent.image: sha256-597968538e7c962d583ff588fd086a93f8ce28a8f252bf51f599495181b341ec.webp
- BG_SevenDay_Quest1.image: sha256-48fb2eb87dd1d2acf7c258c279bb5ef73bea8e3531d09a8dde60dd7cce21fa8b.webp
- BG_SevenDay_Quest2.image: sha256-48fb2eb87dd1d2acf7c258c279bb5ef73bea8e3531d09a8dde60dd7cce21fa8b.webp
- BG_SevenDay_Quest3.image: sha256-48fb2eb87dd1d2acf7c258c279bb5ef73bea8e3531d09a8dde60dd7cce21fa8b.webp

## Modal_Wins_QuickWins

monopoly-go / workspace-8e0f09e7-4699-4ac6-81b3-d545c7046ef6 / ux-gjs-0d80d7fe r354 / modal / 551x984

|Part|Parent|logical x,y,w,h (calculated)|stored x,y,w,h (%)|text/font|source line|
|---|---|---|---|---|---:|
|Group_Wins_Clipboard|(root)|10.2,105.68,525.49,800.32|1.85118,10.7398,95.3702,81.3333| / |1|
|Card_Wins_Mission01|Group_Wins_Clipboard|52.72,322.515,440,97.6691|8.0915,27.0936,83.7314,12.2038| / |1|
|Card_Wins_Mission02|Group_Wins_Clipboard|52.72,427.998,440,97.6691|8.0915,40.2736,83.7314,12.2038| / |1|
|Card_Wins_Mission03|Group_Wins_Clipboard|52.72,533.48,440,97.6691|8.0915,53.4537,83.7314,12.2038| / |1|
|Txt_Wins_Mission01_Description|Card_Wins_Mission01|124.72,338.142,276,66.415|16.3636,16,62.7273,68|출발(을)를 1회 지나세요 / 22|1|

Observed outgoing links: 1.
- Btn_Wins_Close -> close / (no target) / event=click / condition=always

Explicit buttonState fields: 1.
- Example Btn_Wins_Close: mode=tint; targetGraphic=self; selected=False; enabled=True; pressFeedback=null

## Page_Capybara_Continent

capybara-go / workspace-ac9e2a9e-65c0-4fe8-b67a-79a5a9ae42d7 / ux-gjs-4e64eb72 r90 / page / 504x894

|Part|Parent|logical x,y,w,h (calculated)|stored x,y,w,h (%)|text/font|source line|
|---|---|---|---|---|---:|
|BG_Continent_QuestHeader|(root)|0,408,504,88|0,45.6376,100,9.8434| / |1|
|BG_Continent_QuestList|(root)|0,496,504,310|0,55.481,100,34.6756| / |1|
|BG_Continent_Quest_Main|BG_Continent_QuestList|14,504,476,88|2.77778,2.58065,94.4444,28.3871| / |1|
|Txt_Continent_Quest_Main_Title|BG_Continent_Quest_Main|22,506,284,26|1.68067,2.27273,59.6639,29.5455|메인 챕터 클리어 / 18|1|
|Btn_Continent_Quest_Main_Move|BG_Continent_Quest_Main|354,540,128,48|71.4286,40.9091,26.8908,54.5455| / |1|
|BG_Continent_Quest_Talent|BG_Continent_QuestList|14,606,476,88|2.77778,35.4839,94.4444,28.3871| / |1|
|BG_Continent_Quest_Tower|BG_Continent_QuestList|14,708,476,88|2.77778,68.3871,94.4444,28.3871| / |1|

Observed outgoing links: 1.
- Btn_Continent_Back -> back / (no target) / event=click / condition=always

Explicit buttonState fields: 0.

Observed assetRef examples:
- BG_Continent_QuestHeader.image: sha256-db356f726e6e6906d3e2da7bcedf966ce8da1c9c4b8b3fdd5cb56438d7f93a9e.webp
- BG_Continent_QuestList.image: sha256-c264d94d3c3ff214f8ddce062a383745020e777c7ffea1a30611d002d812a047.webp
- BG_Continent_Quest_Main.image: sha256-55c88ecbeebffdd244a3355749404482c1c479bbdad6e4a41a28872ef34b24e5.webp
- BG_Continent_Quest_Talent.image: sha256-55c88ecbeebffdd244a3355749404482c1c479bbdad6e4a41a28872ef34b24e5.webp
- BG_Continent_Quest_Tower.image: sha256-55c88ecbeebffdd244a3355749404482c1c479bbdad6e4a41a28872ef34b24e5.webp

## Calculated spacing examples

- Page_Capybara_Equipment: Slot_Equipment_Inventory_01 -> Slot_Equipment_Inventory_02: horizontal gap=8.0000 logical px (calculated).
- Page_Capybara_Equipment: Slot_Equipment_Inventory_01 -> Slot_Equipment_Inventory_06: vertical gap=18.0000 logical px (calculated).
- Page_Build_City: Btn_Build_Landmark01 -> Btn_Build_Landmark02: horizontal gap=9.7500 logical px (calculated).
- Modal_Wins_QuickWins: Card_Wins_Mission01 -> Card_Wins_Mission02: vertical gap=7.8135 logical px (calculated).
- Popup_Capybara_SevenDay: BG_SevenDay_Quest1 -> BG_SevenDay_Quest2: vertical gap=8.0000 logical px (calculated).

Source files are minified single-line JSON. Use sourceJsonPointer plus element ID in per-screen files for exact location. Each selected screen is available separately under screens/.
