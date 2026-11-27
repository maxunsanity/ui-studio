# Clash native r14 기본구조 검토

2026-11-18T16:54:21+09:00 · codex 하위 · 제안(검수 대기)

읽은 근거: `/Users/max/projest_max/ui-studio/samples/clash-royale/ui-studio/designs/ux-ea29177e.json` r14 / savedAt 2026-11-18T07:48:39.632Z / SHA 841ea31c9364e4707d6db7fbec4c782d6c13054dc18e1d01bb89aecc558db321. 초기 읽기전용 도구의 validateDocument와53부품 resolveRect/inputOwner 출력에 근거합니다.

보고 작성 시 실제 저장본은 r17로 진행됐습니다. r14 설계파일 사본 저장/복원 없이 최초 관찰 사실만 정리했으며 현재판 전체검토나 화면완료 판정이 아닙니다.

r14는 실제 Home1화면53부품0연결입니다. 4화면은 전체 계획 범위이며 저장4화면 완료로 읽지 않습니다.

|r14 실제 이름/ID|부모|x,y,W,H 논리px|
|---|---|---|
|BG_CR_Home<br>`element-57b07ae9-b286-4733-8fb2-c73484341d22`|`main`|[0, 0, 390, 844]|
|HUD_CR_Resources<br>`group-0bcaecff-a9fd-48cb-a822-42657192c182`|`main`|[7, 34, 374, 35]|
|HUD_CR_BottomNavigation<br>`group-6601936a-1859-45c0-878c-71de5e63110b`|`main`|[0, 778, 390, 66]|
|Btn_CR_Nav_Shop<br>`group-b7e95044-46b1-43ae-9996-cb3775ce511f`|`group-6601936a-1859-45c0-878c-71de5e63110b`|[0, 778, 78, 66]|
|Btn_CR_Nav_Cards<br>`element-94a1be36-83c7-45d4-9e00-51fdc0d7d1e0`|`group-6601936a-1859-45c0-878c-71de5e63110b`|[78, 778, 78, 66]|
|Btn_CR_Nav_Battle<br>`element-9bc72959-6590-4856-b7e6-527244bd12b7`|`group-6601936a-1859-45c0-878c-71de5e63110b`|[156, 778, 78, 66]|
|Btn_CR_Nav_Social<br>`element-af9872e8-91e5-4866-97e2-f3b13b5f6d34`|`group-6601936a-1859-45c0-878c-71de5e63110b`|[234, 778, 78, 66]|
|Btn_CR_Nav_Events<br>`element-68af66f8-bb84-4e9f-ba3e-9002dbbb8472`|`group-6601936a-1859-45c0-878c-71de5e63110b`|[312, 778, 78, 66]|
|Img_CR_Home_Menu<br>`element-22c5de57-7ca2-486a-8739-738281a41e65`|`main`|[334, 86, 42, 42]|
|Img_CR_Home_PracticeArena<br>`element-4d4a0723-b877-4957-bb8a-2e51589e748e`|`main`|[85, 350, 220, 200]|
|Btn_CR_Home_Battle<br>`group-dac4ad8b-d709-4706-8c0e-6d0989b87cbb`|`main`|[110, 650, 170, 80]|
|Txt_CR_Profile_Name<br>`element-89b055bf-8f43-43b5-ac69-14d958b6ebbe`|`main`|[8, 172, 145, 26]|
|Txt_CR_Profile_Clan<br>`element-7f913d7e-0f93-4cb9-8c2b-88b8b8bee44a`|`main`|[8, 197, 140, 19]|
|Img_CR_Profile_Trophy<br>`element-76b335b8-b793-4a1a-be55-e562911ac7d5`|`main`|[134, 170, 35, 35]|
|BG_CR_Home_RoyalPass<br>`element-a74815ff-d223-498b-917c-889f0b0682e6`|`main`|[235, 135, 145, 72]|
|Img_CR_Home_RoyalPass<br>`element-6d7bae0d-8e03-42ac-a878-1a01d6151841`|`main`|[281, 167, 40, 34]|

## 5nav 규격 정합

confirmed r14 storage fact


x0/78/156/234/312, outer78×66. 각 icon48×48, local x15/y0, label78×18 local y48, font14/weight700/line17/center. 5부모 모두 nav컨테이너 자식이며 이미지 input parent→각button owner가 유효.


## 입력 owner가 없는 parent 이미지

 제작 중 확인 메모


r14 8개 이미지가 interaction=parent지만 끝나는 조상에 action owner가 없음. 표시용이면 none으로 두는 의미가 명확하고, Menu를 누르는 기능이 필요하면 native button wrapper + image parent를 조립할 항목. 미관찰 동작을 새 연결로 만들라는 지시가 아님.


## 긴 프로필 문구 영역

potential rect collision; not observed browser defect


Name(8,172,145,26)와 Trophy(134,170,35,35) rect 교집합19×26; Clan(8,197,140,19)와 Trophy 교집합14×8. Name/Clan rect도 y197..198의1px 겹침. r14의 짧은 문구 실제 glyph가 겹친다는 뜻이 아님. 긴 문자열의 clip/ellipsis/예약 폭을 native에서 확인할 항목.


## 390 기본배치와 확대기기

scope limitation


390 기준 top resources(7,34,374,35), nav(0,778,390,66), arena(85,350,220,200), battle(110,650,170,80)는 화면안에 있음. nav rectTransform은 bottom-left fixed390×66이며 stretch-X는 아님. 430은 기기보기의 uniform fit인지 logical reflow인지 구분해 이후 실화면 검수할 항목; 이번430 검수0.


## 선택/연결/페이지 범위

expected work in progress


r14 저장본은 Page_CR_Home1화면53부품0transition, action button8개는 목적지 미연결. buttonState/selected 저장값도 없음. 4화면 제작 예정과 저장4화면 완료를 구분. 제작중 메모이며 완성 판정/새 연결 승인으로 쓰지 않음.


입력 parent→owner없음8개: Img_CR_Home_Menu, Img_CR_Home_PracticeArena, Img_CR_HUD_Experience, Img_CR_HUD_Gold, Img_CR_HUD_Gems, Img_CR_Profile_Trophy, Img_CR_Home_Crowns, Img_CR_Home_RoyalPass


## 범위

이번 하위는 설계/소스/공용보고·STATUS/브라우저를 변경하지 않았습니다. 저장 구조와 실제 화면을 구분하며, 실제 1440/430 및 상태·입력·링크·이미지·넘침 검수는 본체의 후속 범위입니다.

