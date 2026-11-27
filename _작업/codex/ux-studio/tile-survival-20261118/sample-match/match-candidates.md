# Proposed matches to parent-supplied video types

These are layout candidates, not confirmed visual matches. This worker did not inspect video. Sample data below was observed in saved JSON.

|Target type|Observed sample screen|Reuse scope|Difference|
|---|---|---|---|
|Territory base|Page_Capybara_Lobby|HUD, static scene, side events and bottom navigation|No building/tile editor.|
|Hero list/detail|Page_Capybara_Equipment|Static character, six side slots and 5-column scroll inventory|Equipment UI, not hero-specific roster/details.|
|Recruitment|Page_Capybara_Chests|Central target, odds/count/progress, open/reward and five category tabs|Chest opening; no hero recruitment animation.|
|Recruitment result|Popup_Capybara_ChestReward|Full-screen close input, reward title/item/frame|Single item result; no hero rarity/multi-result structure.|
|Building editing panel|Page_Build_City|Scene and bottom five priced selection cards|No placement, movement or rotation editor.|
|Relationship increase|Page_Capybara_Talents_Upgrade|Power toast with current value, arrow and increase value|Only increase presentation; not a relationship UI.|
|Character story|Page_Capybara_Adventure|Upper scene, separate log panels and bottom progress action|No speaker portrait/name, branching choices or relationship gauge.|
|Chapter mission modal|Popup_Capybara_SevenDay|Dimmed modal, header/progress, scrollable four quest cards|Event/day template, not a chapter-specific modal.|
|Chapter mission modal alternate|Modal_Wins_QuickWins|Clipboard modal, three mission rows and weekly rewards|Mostly display-only missions; reward logic disconnected.|
|Chapter mission rows|Page_Capybara_Continent|Three quest rows with count, two rewards and move button|Page template; requires modal container if reused.|

No screen named Hero, Recruit or Story exists in Capybara r90. No new UI sample was created. All recorded image/skin references are observed existing sample references; reuse into Tile Survival has not been approved or applied.
