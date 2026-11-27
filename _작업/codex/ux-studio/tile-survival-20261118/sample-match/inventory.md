# Existing sample inventory

Created 2026-11-18T12:56:11.575497+09:00 - readonly observations, proposed matches pending video review.

## Observed source identity

|sample|workspace|project|revision|savedAt|logicalSize|screens/links|
|---|---|---|---:|---|---|---:|
|monopoly-go|workspace-8e0f09e7-4699-4ac6-81b3-d545c7046ef6|ux-gjs-0d80d7fe|354|2026-11-18T00:03:56.750Z|551x984|17/25|
|capybara-go|workspace-ac9e2a9e-65c0-4fe8-b67a-79a5a9ae42d7|ux-gjs-4e64eb72|90|2026-11-18T01:59:19.154Z|504x894|27/123|

Workspace roots were checked against _work/codex/ux-studio/workspaces.json (actual Korean path is recorded in the source manifests). A nested /samples/capybara-go/ui-studio workspace also exists; the selected workspace is /samples/capybara-go.

## Screen search inventory

|sample|name|kind|parts|buttons/texts/images|explicit state|links|
|---|---|---|---:|---|---:|---:|
|monopoly-go|Page_Board|page|179|20/48/57|20|9|
|monopoly-go|Page_Build_City|page|79|7/10/16|7|1|
|monopoly-go|Modal_Wins_QuickWins|modal|47|1/10/16|1|1|
|monopoly-go|Page_Album_Sets|page|74|1/19/18|1|1|
|monopoly-go|Modal_Friends_Timeline|modal|88|3/27/16|3|1|
|monopoly-go|Modal_Main_Menu|modal|81|10/21/21|10|4|
|monopoly-go|Page_Showroom_Shields|page|89|7/9/42|5|1|
|monopoly-go|Modal_Shop_Store|modal|136|8/35/27|8|1|
|monopoly-go|Modal_Event_RacingStarter|modal|35|2/11/11|2|1|
|monopoly-go|Modal_Event_TycoonExpress|modal|98|2/28/28|1|1|
|monopoly-go|Modal_Jail_RollDoubles|modal|18|1/7/7|1|0|
|monopoly-go|Modal_Jail_BailPayment|modal|16|1/6/7|1|0|
|monopoly-go|Page_NetWorth_Gallery|page|189|2/37/92|0|1|
|monopoly-go|Page_StageMap_16_17_18|page|15|0/3/6|0|0|
|monopoly-go|Modal_Showroom_TokenDetail|modal|27|4/7/6|5|1|
|monopoly-go|Page_Tournament_ClassBenefits|page|55|3/17/13|3|1|
|monopoly-go|Modal_Event_BeanstalkDetails|modal|50|1/16/12|1|1|
|capybara-go|Page_Capybara_Lobby|page|160|29/50/71|1|12|
|capybara-go|Page_Capybara_Equipment|page|201|36/47/112|0|5|
|capybara-go|Page_Capybara_Shop|page|157|20/50/70|0|5|
|capybara-go|Page_Capybara_Talents|page|90|14/31/41|0|7|
|capybara-go|Page_Capybara_Talents_Upgrade|page|95|14/33/44|0|6|
|capybara-go|Page_Capybara_Chests|page|93|18/25/46|0|11|
|capybara-go|Page_Capybara_Chests_Bronze|page|93|18/25/46|0|10|
|capybara-go|Page_Capybara_Chests_Silver|page|93|18/25/46|0|11|
|capybara-go|Page_Capybara_Chests_Gold|page|93|18/25/46|0|11|
|capybara-go|Page_Capybara_Chests_Pet|page|93|18/25/46|0|11|
|capybara-go|Page_Capybara_Chests_Amethyst|page|93|18/25/46|0|10|
|capybara-go|Popup_Capybara_ChestReward|modal|8|1/2/5|0|1|
|capybara-go|Popup_Capybara_GoldSources|modal|36|4/12/20|0|1|
|capybara-go|Page_Capybara_Continent|page|78|5/32/41|0|1|
|capybara-go|Page_Capybara_Privileges|page|172|11/71/89|0|2|
|capybara-go|Popup_Capybara_Funds|modal|54|1/24/29|0|1|
|capybara-go|Popup_Capybara_SevenDay|modal|103|5/36/62|0|1|
|capybara-go|Popup_Capybara_Calendar|modal|66|1/24/41|0|1|
|capybara-go|Page_Capybara_Wheel|page|76|7/24/28|0|1|
|capybara-go|Popup_Capybara_Lava|modal|80|1/30/49|0|1|
|capybara-go|Popup_Capybara_Servers|modal|46|6/13/17|0|1|
|capybara-go|Popup_Capybara_Profile|modal|67|7/21/27|0|2|
|capybara-go|Overlay_Capybara_Events|modal|20|5/7/8|0|3|
|capybara-go|Page_Capybara_Adventure|page|52|5/19/22|5|3|
|capybara-go|Popup_Capybara_SkillSelect|modal|45|5/15/19|5|3|
|capybara-go|Popup_Capybara_MythicSkill|modal|24|1/7/15|1|1|
|capybara-go|Popup_Capybara_InstantWheel|modal|23|1/11/10|1|1|

## Reading the evidence

- screen-inventory.tsv: 44 screen IDs, kinds, logicalSize, counts, fonts and top-level region names.
- root-regions.tsv: all root regions, stored percentages and calculated logical boxes.
- screens/<sample>--<screenName>.json: scoped screen files for reading only needed candidates.
- candidate-parts.json: selected screens, parentId/path, raw coordinates/RectTransform, text/fonts/typography, image/skin assetRef, button state/targetGraphic/pressFeedback/shadow, and full outgoing transitions.
- inventory.json: purposes, type counts and provenance.

## Limits

- x/y/w/h are observed stored values. derivedLogicalBoxFromStoredPercent is computed recursively from parent percentages, not a renderer or screenshot measurement. RectTransform is also preserved and must be checked before implementation.
- Absent buttonState means the field is absent. Runtime default/disabled behavior was not inferred.
- Source files are minified single-line JSON: sourceLine=1; sourceJsonPointer and IDs give precise locations. Revision identity is checked; updated source revisions require rechecking.
- Source purposes distinguish fixtures and disconnected game logic. Sample navigation does not imply actual gameplay implementation.
- This worker inspected no video. Target screen labels came from the parent. Matches in match-candidates.md are proposals.
- No finished Royal Match sample used; no browser, HTTP, server, public reports, STATUS or protected play.html accessed.
