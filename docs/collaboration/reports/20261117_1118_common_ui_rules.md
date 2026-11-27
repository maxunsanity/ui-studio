# 공통 UI 규격·투명 아이콘 보정

codex(단이) · 2026-11-17 11:18 KST · 제안(검수 대기)

## 최신 지시
현중: ‘하단 라인이 모두 안맞아…x 버튼…배경 안빠진 icon은 있으면 안돼…가이드에 박아서 공통적으로 작업해’, ‘공통적으로 가야 되는 크기는 모두 가이드’, ‘스샷이나 이미지는 상황에 따라 틀리기 때문에 그걸 기준으로 하지 말고 공통적인 가이드 라인 규칙’, ‘경험은 모두 가이드…잘 나온게 있으면 작업 규칙…준수’, ‘2차…카피바라 고…겹치지 않게 하고 지식을 공유해’.

r248/10화면899부품20연결을 백업하고, 각 화면의 공통 footer/header/close의 실제 저장값과 visible shape를 비교합니다. 같은 역할 family의 수치/기준선/부모좌표/아이콘·텍스트 영역을 토큰 정본으로 정한 뒤 native UI로 보정합니다. screenshots는 구성/모티프 참고이며 공통 규격을 덮지 않습니다. 투명 버튼 hit와 native glyph/아이콘, 별도 의도된 바탕·9slice 프레임·engine효과를 구분합니다. 외부설계JSON수정0/7018만/7007제외/예약PAUSED/보호범위유지.

## 순서
1. 현재10화면 audit·공통family/variant규칙·백업.
2. 불필요 X skin/appearance 제거·하단 기준선/크기 통일,상단 같은family 정렬.
3. 실제기기/클릭·닫기·재열기·캡처,가이드·토큰·실패경험 기록.
4. 완료 뒤 사용자 제공 모노폴리 영상9개를 시간/화면/동작/출처로 정리해 기존제작분과 비교. 빠진UI를 순차추가하고 연결근거가없으면 미연결로 남깁니다. 이 후속은 현재 공통보정을 건너뛰는 지시가 아닙니다.

## 병행 경계
2차 capybara-go 샘플·영상·설계·자원은 수정하지 않습니다. 현중의 명시 지식공유에 따라 2차에 인수파일/공통규격후보/7018범위/VIDEO보존을 전달했습니다. 공통 가이드는 current bytes/해시 대조·최소병합,프로젝트토큰은샘플별분리. 실제수정·시험·캡처·미확인은 아래 후속 기록에 추가합니다.


## 공통 보정 단위 검수 · r277 · 2026-11-17 12:10 KST

native UI로 r248→r277을 저장했습니다. 10화면·902부품·20연결이며 원899개ID/모든20연결을 보존했습니다. Wins/Build는 기존버튼 skin/표면을 분해해 불필요 BG/빈image/frame만 제거하고 독립 glyph를 남겼습니다. Friends skin도 native 종류→panel/프레임없음→button으로 해제했습니다. Footer는6가족 모두 [0,912,551,72],line6,hit[253.5,940,44,44],glyph[261.5,948,28,28],font32/500/line28/#72756d입니다. optional title20행을 예약해 Build도 같은X기준선을 씁니다. 동일 공통fill9 SHA9077.../line9 SHA150bc...를 재사용하고 box와icon을 구분했습니다.

Main/Shop/Build header outer[8,12,535,96],bar globaly28/h56,SNS96/image82·Menuhit44/icon28/badge18,같은cash전역[136,39,214,34]과우측slot[376,38]을 맞췄습니다. SNS있는bar폭459/사진없는Build535는 명시variant이며 부모가달라local값을변환했습니다. Main/Build는같은메뉴이미지SHA를재사용합니다. Footer는문서basis폭551의하단고정이며 기기보기는basis를비례축소합니다. 실제가로stretch를검수한것으로과장하지않도록토큰설명을실제상태로보정했습니다. 원본safearea확정값은없어null입니다.

본문 Footer 겹침도 보완했습니다. WinsClipboard끝906으로6gap을두고,Friendsviewport세로늘림/top209.18/bottom4.76(부모기준),Shopviewport상단312.55/하단72를유지하는stretch로끝912를맞췄습니다. scrollcontent길이/레코드/상품은삭제하지않았습니다. Album/Racing/Tycoon의위치variant는보존하고glyph만8/8/28/28·32/500/28로공유했습니다.

검증: `node _작업/codex/ux-studio/verify-common-ui.mjs --final`→171/171/실패0/대기0/exit0,90정밀units와기존ID/연결/허용변경밖deep equality·SHA검사. 실제6Footer는같은기준선/44hit/28glyph이며rootcomputed background rgba(0,0,0,0),directSurface0,skinfalse,유일label자식으로확인했습니다. 모바일CSS430×843에서6경로각Click/Close/Back복귀·가로넘침0/failed0/loading0. Desktop3headerDOM은Main/Shopcashglobal136/39동일,Build추가4px보정후읽기검사일치. CSS1920×1280의최종10화면모두별도실행해rawPNG/crop을보존했으며전부overflow0/failed0/loading0입니다. raw2400×1600과phone551×984를구분하고임시viewport를reset했습니다.

증거 `docs/evidence/20261117-common-ui/{file-verification,browser-checks}.json`, `footer-common-r277-comparison.png`(실제Build/Wins footer두crop), `current-screens/*-r277-{full,phone}.png` 및metadata.json. 아이콘감사는r273고정으로168등록/411참조 중독립icon97자원228참조의실제region alpha0/의심0·SHA/size/region오류0,사진/SNS/scene/의도된backplate는별도분류했습니다. 끝r277로변경된것과리소스불변을구분했습니다. `_작업/codex/ux-studio/icon-alpha-audit.json`/체크시트가근거이며이알파검사가최종눈검수를대체하지않습니다.

제품소스변경0/새패키지0이며502/502는이전최종제품source시험입니다(이번숫자와합산안함). 공통guide.22/index기존VIDEO포함9문서,COMMON_UI_RULES.md·COMMON_UI_TOKENS.json 단일정본을등록하고기존7MD에는진입만추가했습니다. 원칙은사용자지시,수치/시안은제안·컨펌대기입니다. `.22 guide22-checks.json`의840로컬링크/140경로·tokenRef10검사와2차VIDEO14절/프로젝트guide.4/별도capybara토큰보존을확인했습니다. 후속root토큰관찰값/앵커설명보정은1205백업에남겼습니다. 복제후parent누락,앵커부품의legacy패널부재,도구성공≠등록성공,실측CSS/PNG차이도규칙에남겼습니다.

백업 `1118_common_ui_rules/`(r248와guide),`115756_common_ui_guide22/`,`1205_common_tokens_actual/`. 2차에실제정본경로/규격·방법을공유했고카피바라프로젝트/설계/자원/탭은수정하지않았습니다. 현재7007제외/7018만/기존uiPAUSED/수동작업/새시한·상한·예약0·보호범위유지. W/P/U/S0/4·최종10장동등0/10·실게임/폰트/승인미완료는유지합니다.

다음은현중이명시한모노폴리9개영상의HTML인벤토리를2차예시형식으로먼저완성하고기존10화면과대조합니다. 영상에서외부앱/스토어가보이면별도분류하며실제연결/설치/메시지발송을하지않습니다. 관찰불명확한링크는빈칸으로두고누락UI를이후순차구성합니다.
