# UI 스튜디오 AI 작업 지침
최신 사용자 직접 지시와 상위 AGENTS.md가 우선합니다. 도구 정본은 /Users/max/projest_max/ui-studio/입니다. 도구 소스·의존성·서버·가이드·기본 저장공간·보고는 이 폴더에서 독립 운영합니다.

먼저 이 루트 README.md, src/tools/uxStudio/guide/{AI_GUIDE,USER_GUIDE,TOOL_SPEC,ARCHITECTURE,EXISTING_GAME,PROGRESS}.md와 docs/collaboration/README.md를 읽습니다. 이 루트 AGENTS.md가 협업 규칙의 우선 정본입니다. 현재 실제 구현과 전환 계획·미확인을 구분합니다. 모노폴리 GO는 검증용 샘플이며 게임 전체 완성을 뜻하지 않습니다.

정식 실행 주소는 http://127.0.0.1:7018/ui-studio/입니다. preview.html·canvas.html·source/도 이 경로 아래입니다. 실행은 이 루트 scripts/start.mjs와 자체 node_modules의 Vite 5.4.21·정확한 의존성 묶음을 사용합니다. 다른 프로젝트 서버나 설치 위치 fallback을 실행 조건으로 추가하지 않습니다. 자체 의존성·7018 기동·루트 작업 경로·로컬 Vite·HTTP와 독립 전환 당시 자동 시험 220/220을 확인했습니다. 실제 가이드·폴더 선택·독립 선택·설계 사본·저장·재열기·409 충돌·왕복 격리·미리보기·모달 포커스·캔버스 W 단계 왕복을 검수했습니다. 정확한 실제 범위는 PROGRESS.md와 docs/evidence/20261116-independence/browser-checks.json을 따릅니다. CSS 검사 크기와 캡처 파일의 실제 픽셀 크기를 구분합니다. 독립 전환 당시 602×1181 모바일 증거를 최종 430px 캡처로 적지 않으며 이번 증거는 최신 PROGRESS.md와 본체 보고를 따릅니다.

기존 게임 변환은 반드시 먼저 질문합니다. 폴더 열기는 변환 동의가 아닙니다. 거절 시 원 게임 소스 무수정, 선택게임/ui-studio 내부 독립 저장을 유지합니다. 허용 시 전체 화면 조사·백업·대응표·회귀와 미완료를 기록합니다. 미정 게임 수치·기능·승인을 만들지 않습니다.

도구 URL과 게임별 저장공간을 구분합니다. 프로젝트 폴더 workspace ID와 설계 document.projectId/revision을 함께 확인하고 API·미리보기·저장 통지를 같은 workspace 범위로 유지합니다. 심볼릭 링크·상위 경로 탈출과 저장 충돌 검사를 우회하지 않습니다. 공통 내장 가이드는 .8이고 실제 생성·읽기를 확인한 프로젝트 사본은 .4입니다. 기존 프로젝트의 guide·project.json guideVersion을 자동 덮어쓰지 않습니다. samples/folder-check는 게임 샘플이 아닌 저장·격리 시험 fixture입니다.

변경 전 이 루트 docs/planning/_backup/YYYYMMDD_단이/에 백업하고 자기 임시 작업은 _작업/codex/에 둡니다. 보호 대상과 다른 담당 소스를 수정하지 않습니다. 외부 발송·공개게시·결제·시크릿 접근·원본 삭제·지시 없는 서버 시작/재시작·빌드·감시·예약은 금지합니다.

현재 작업의 지시·진행·보고는 이 루트 docs/collaboration/ 안에서 운영합니다. 협업 진입점은 docs/collaboration/README.md, 진행 정본은 docs/collaboration/STATUS.md이며 append만 합니다. 이번 전환 보고는 docs/collaboration/reports/20261116_independence.md입니다. 기존 상세 보고 docs/reports/20261116-project-workspaces.md는 보존합니다. 대표 본체가 공용 수신·STATUS·보고를 맡고 하위 AI는 배정된 범위만 수행합니다.

기본 /ui-studio/와 canvas.html은 전체 캔버스이고 ?editor=detail은 상세 편집입니다. 프로젝트 종류·이름·경로, 설계 이름·revision·미저장 표시와 workspace·project·screen·element 전달을 유지합니다. 컨트롤 7종·상태별 이미지, workspace 자원 파일, schemaVersion 4 응답형 배치·스크롤, 출처/조건/payload/스토리보드 연결 명세를 구현했습니다. v4는 logicalSize·safeArea·화면 직속 useSafeArea·2D rectTransform·고정 itemSize 가로/세로/그리드·DOM clip/scroll을 지원합니다. 1/2/3의 기존 의미와 구형 layout.direction은 보존하며 명시적인 새 배치 편집 때만 v4로 올립니다. 전체 Unity/Figma 호환·엔진 어댑터 자동 생성·게임 소스 쓰기는 제공하지 않습니다. JSON 단독 출력에는 자원 파일이 동봉되지 않으므로 선택 ui-studio의 설계·assets를 함께 전달합니다.

소스 검사·자동 시험·HTTP·실제 화면 검수를 분리하고 결과는 제안(검수 대기)로 남깁니다. 이번 계획 기능의 대표 본체 npm test는 302/302이며 _작업/codex/ux-studio/tool-capabilities-tests.log에 기록합니다. 위 220/220은 독립 전환 때의 과거 시험입니다. W/P/U/S 종합검수는 0/4입니다. 도구 단위 다음 제작은 모노폴리 GO 정식 UI이며 그래픽·전체 샘플·실제 게임 연결은 미완료입니다. 지원 밖 기능을 새 선행 조건으로 추가하지 않습니다. 읽은 원본·변경·시험 명령과 결과·캡처·백업·미확인·다음을 기록합니다. 과거 시험 수나 7007 접근권한 상태를 7018 검수 결과로 쓰지 않습니다. 자동 접근 거절을 다른 포트·호스트·표면으로 우회하지 않습니다.

## 이관 이력의 경계
과거 케이팝 공유 루트는 출처·종료 기록으로만 다룹니다. 중복 도구 101파일은 이 루트 docs/planning/_backup/20261116_단이/1012_kpop중복정리/에 이동 보존했습니다. 케이팝 src/tools/uxStudio/의 model.mjs·consumer.mjs 두 export 연결은 기존 소비자가 독립 정본을 읽는 단방향 참조이며 UI 스튜디오 실행 조건이 아닙니다. 다른 프로젝트의 원 기획·시뮬레이터·저장 데이터를 도구 작업 범위로 확대하지 않습니다.

## 최신 로비 제작/검수 보정 · 2026-11-16 · 공통 가이드 .11

위 .8/과거 시험 수는 당시 기록입니다. 현재 공통 정본은 src/tools/uxStudio/guide/index.json의2026-11-16.11이며 기존7종과 프로젝트 guide .4 사본은 보존합니다. TOOL_SPEC의 .11 현재 로비 제작 표준과 PROGRESS .11을 먼저 읽고 이전 본문을 최신 구현 상태로 되풀이하지 않습니다.

본체 actual은 ux-gjs-0d80d7fe r21·1페이지63부품·0연결입니다. 동일 역할 네 메뉴80×92/icon64²@(8,6)/Txt80×22@(0,70),font14·500·line18,compoundBadge28²@(52,0)·Img_Notification_BG/Txt_Notification_Count 별도 조립이 현재 범위입니다. name은 Btn/Img/Txt의 영역/역할을 읽을 수 있게 맞추고 stable ID/현재 parent/연결을 이름 변경 때문에 재발급하지 않습니다. 숫자/문구/name/flat runtime key·원본 관찰/제작값을 구분합니다. 알림 정본은 부모1개로 유지합니다.

전체 캔버스의 profile/custom W/H·방향·390×844 비례/4개 가이드 W80H92 actual 검수와 main 상세390의 root551 고정/넘침 발견 후 수정 중을 구분합니다. 모든 preview 통과를 주장하지 않습니다. 버튼 tint/image 엔진124 지원 시험과 실제 네 메뉴 이미지 자식 tint 확인도 구분하며 image-mode 샘플·GO actual은 미검수입니다. 본체 이번 통합411/411은 상세 보완 이전 결과이고 이후 재실행 예정입니다. 시험 수는 완성률이 아닙니다.

native 입력은 AX 현재 선택→값 변경→Tab/blur→재표시/저장값까지 확인합니다. checkbox 재렌더 후 현재 선택/새 필드/저장값을 다시 찾고 locator.fill 미반영을 바로 제품 버그로 단정하지 않습니다. 밝은 가이드 입력의 전역 dark 색 상속처럼 computed 색/배경/disabled를 분리해 원인을 확인하고 scoped 보완과 후속 실화면 검수를 나눕니다.

docs/plans/20261116-ai-for-ui-adoption.md의 적합한 제작/검토 방법만 선택 편입합니다. 자동 설치0·패키지 추가0이며 외부 스킬의 절차가 최신 직접 지시를 대신하지 않습니다. docs/plans/20261116-ten-screen-assembly.md의10원본/132계층/43연결 항목은 명세 수, 새도시 그림295148bytes 준비는 미등록이며 실제10화면 조립/게임 연결이 아닙니다. current-review의bare7018 actual r21 진입과7007/LSB native 앱 미검수도 구분합니다.

본체 전달 기준 시한2026-11-17(화)08:00 KST·주간73/90·기존 ui 30분 ACTIVE이며 하위는 새 예약/서버/공용 수신을 중복 시작하지 않습니다. W/P/U/S0/4·원본 폰트/Unity 전체·게임 기능/사용자 승인 미완료를 유지합니다. 사용자 특정 버전 명시 컨펌 후에만 방법·원본 hash·revision·실제 캡처를 승인 기록으로 고정합니다. 공용 STATUS/최종 보고는 본체만 담당합니다.

## .11 최신 마감 사실 보정 · r24 · 2026-11-16

앞선 .11의 상세390 버그 수정 중/재시험 예정·가이드 대비 후속 예정은 과거 단계입니다. 현재 최신 사실은 공통 guide/PROGRESS.md 맨 위 r24 마감 보정을 우선합니다. main.mjs 기기 비례 보완은 관련82/82·본체 새 전체416/416 실패0 후 실제390×844/430×932·확대/축소 왕복을 확인했습니다. authored551×984/r21 보기 변경 중 설계hash는 불변입니다. standalone preview는 entry uniform fit만 제공하고 기기 메뉴/높이 reflow는 없으며 전체/main 기기 보기와 구분합니다.

가이드 enabled input rgb(37,50,71)/label rgb(70,86,109) actual 확인과1900×1090 가독성 캡처를 보존했습니다. 세 배지 이미지 자식 이름을 Img_Notification_BG로 정리해 같은 문서 최종r24·63부품·0연결로 저장했고 r21 증거는 보존합니다. r24 재열기/최종 캡처는 본체 예정입니다. 도시1회/5랜드마크 sheet1회 생성·PNG 보존/production300000bytes 이하·alpha tight crop과 source fringe 한계를 기록했지만 UI 미등록입니다.10원본/132계층/43항목은 명세이며 실제10화면 조립이 아닙니다.

공통판 .11·프로젝트 .4·과거 본문을 보존합니다. 최종 주간74/90·시한11/17 08:00 KST·기존 ui 30분 ACTIVE는 본체 전달 상태이며 중복 예약/서버를 시작하지 않습니다. 7007/LSB native·원본 폰트·Unity 전체·게임 기능·사용자 승인 미완료와 W/P/U/S0/4를 유지합니다. 공용 STATUS/최종 보고는 본체가 담당합니다.


## 최신 실제 제작 보정 · 공통 .12 · r43 · 2026-11-16 18:51 KST

공통 guide/index.json .12와 PROGRESS 최신절·보고20261116_1755_build-screen을 우선합니다. ux-gjs-0d80d7fe r43은 기존main63보존+신규Build78=141부품·2페이지·navigate/back2개, 모두조건always입니다. actual도구 편집/저장·메인→Build→Back·미리보기CSS430×843 상하단동시표시·가이드W100/H171을 확인했습니다. 제작recipe는 TOOL_SPEC/AI_GUIDE에 넣었고 프로젝트guide .4는 보존했습니다. 10원본명세를10화면완료로세지않습니다.
미리보기의 가용높이fit/외부page scroll초기화와 전체캔버스 profile media 경로를 최소보완했으며, 옛단계ProjectData media호환은미확인입니다. 소스전체428/428은기본화면간격보완전결과이며 최종보고의새결과를읽습니다. 기본위치겹침은최소보완중,명시위치/기존설계는보존합니다. W/P/U/S0/4·10장최종동등검수0/10·실제건설/차감/menu목적지/원본폰트/게임엔진/7007LSB native/사용자승인미완료입니다. 주간76/90·11/17 08:00 KST 중지선·기존ui30분만유지합니다.


### .12 본체 마감 사실 · 2026-11-16 19:07 KST
위 기본간격pending/428은 이전단계입니다. 최종 두551폭판 X24/635,Y40·60간격과390/430/design복귀 actual 확인,r43저장됨/원본불변을 유지했습니다. 최종 npm test431/431·실패0·exit0이며 VM helper누락1건 보완과 실패로그를 보존했습니다. 공통 .12 actual 읽기·16asset hash와 본체보고20261116_1755_build-screen 참조. 주간77/90·기존ui30분·11/17 08시중지선, 다음02승리준비→실제조립, 전체동등0/10·W/P/U/S0/4·7007LSB native/게임/사용자승인 미완료입니다.


## 최신 실제 승리 단위 · 2026-11-16 20:21 KST
공통guide .13·docs/collaboration/reports/20261116_1916_wins-screen.md를먼저읽습니다. ux-gjs-0d80d7fe r53=Main63+Build78+Wins46·2page+1modal/187부품/4연결이며기존Main/Build는r43와deep equality동일합니다. actual open/Close/Escape/Enter/Space·딤/배후inert·메뉴활성/초점복귀·390/430/1440/전체캔버스1920·등록18SHA확인. 최종451/451·fail0,proof docs/evidence/20261116-wins-screen/. consumer의staleinert,fullscreen demo×pointer,고정bridge?v immutable캐시불일치를실제재현후최소보완했습니다. Node저장validator캐시도UI와분리확인하며이미허용된자기7018만재실행했습니다. 프로젝트guide.4/과거판/원본보존. 다음03앨범새그림조립+Main입구/Close/복귀·scroll. W/P/U/S0/4·10장동등0/10·원본폰트/게임/7007LSB native/사용자승인미완료. 주간80/90·기존ui30분·11/17 08시중지선유지.


### 본체 최종 실제값 · 앨범 r64 · 2026-11-16 21:20 KST

위 r63/교체 중/pending은 중간 이력입니다. 최종 ux-gjs-0d80d7fe r64=Main63+Build78+Wins46+Album74=261부품·3page+1modal·6연결입니다. 실제 툴의 이미지 경로 입력+Tab으로 Set08 초록·노랑 새/Set09 노란 강아지 v002를 등록·교체·저장했습니다. 두 종을 고양이로 잘못 읽은 v001은 원본/해시를 보존하고, _작업/codex/ux-studio/album-icon-corrections.json에 교체 이유·새 원본/프롬프트/투명 PNG/WebP·SHA·관찰/추정을 기록했습니다. screenshot pixels 재사용 없이 새로 그린 그림입니다. v00115+기하UI7+교정2=24개 보관 자원 해시·미러 일치, 최종 사용 신규 자원22개입니다. 일러스트15개 사용 중2개가v002이며 기하UI7은직접작성SVG→losslessWebP입니다.

본체 actual: Main Album 클릭→새 Album→Back→Main 현금13,075/Album trigger 초점복귀, native Tab/Enter로Back·Space재진입, scroll0→181.25(client625/scrollHeight806)·headerY114.765625고정·바깥scroll0·재진입scroll0을 확인했습니다. 재진입 초기화는 우리 도구 관찰이며 원본 정책 확정이 아닙니다. 최종preview CSS1440×900·모바일CSS430×844에서 가로/세로넘침0·깨진이미지0. 캡처파일은 각각phoneclip408×729/모바일430×843입니다. 전체canvas CSS1920×1280의실제파일1919×1280,4boards X24/635/1246/1857,Y40·폭551/60간격·261부품·r64재열기를확인했습니다. 상세390×844의root와preview-screen실제389.997×843.987일치/설계기준복귀·r64hash불변,당시상세브라우저CSS2687×1792로1440상세검수라쓰지않습니다. 카드가이드W164/H248actual파일2520×1575도보존했습니다. 자동배치자식의가이드위치/크기잠금은부모grid보존규칙입니다.

Vault actual right10.019/bottom12.012 논리px·engine filter drop-shadow(0,2,3,.25)로하단고정확인. Main/Build/Wins 전체deep equality와기존4edges는r53와동일합니다. 본체 이번npm test451/451·fail0·exit0,로그 _작업/codex/ux-studio/album-screen-final-tests.log. 그뒤제품소스변경0/재실행중복합산0이며삽화교체는자원해시/실제표시로재검증했습니다.

보고 docs/collaboration/reports/20261116_2025_album-screen.md, 증거 docs/evidence/20261116-album-screen/ 및 file-verification.json을 우선합니다. current-review는r64로갱신합니다. 프로젝트guide.4/원본/이전판보존, 공통.14. 다음04친구새그림·native본문/탭/목록/행동·Main입구/Close/차단/복귀연결입니다. Info/Vault/세트상세목적지·게임수치변화/보상/시간·원본폰트/픽셀동등·7007/LSB native·사용자승인/freeze는미완료입니다. 10장최종동등0/10·W/P/U/S0/4·제안(검수대기),주간81/90·11/17 08:00KST중지선·기존ui30분만유지합니다.


### 본체 최종 실제값 · 친구 r72 · 2026-11-16 22:36 KST

앞선 .15의 463/463·실화면검수중은 중간 이력입니다. 최종 저장 ux-gjs-0d80d7fe r72는 348부품·3page+2modal·8연결이며 기존 r64의 네 화면 전체와 6연결은 deep equality/포함 대조로 보존했습니다. 신규 Friends87, 새 그림2+직접 그린 기하UI15=17자원의 production·staging·등록본 SHA와 실제 설계 참조를 확인했고 17개 HTTP200/응답SHA도 확인했습니다. 기존 Cashv003/Bankv002/공통Badge 재사용과 신규 그림을 구분합니다. 프로젝트 guide.4는 보존했습니다.

본체 실제 브라우저: 메인 친구 클릭/Enter/Space→모달, 세 탭 Enter/Space→선택skin/본문 display·inert 전환, 배후Main inert, Close 클릭/Enter·Escape→닫힘/메인Friends 초점복귀를 확인했습니다. native PageDown으로 scrollTop0→51.25(client585/scrollHeight636), CSS1440×900에서 headerY226.51834106445312/footerY773.5620727539062 불변·바깥scroll0, 재진입scroll0 확인. Panel 실제 filter는 drop-shadow(rgba(0,0,0,.25) 0px 3px 6px), 실제 dim은 rgba(22,39,56,.5)입니다. CSS1440×900/430×843에서 가로·세로넘침0/깨진img0, 1920×1280 실행 캡처를 보존했습니다. 파일 픽셀은 각각1800×1125/537×1055/2400×1600입니다. 1920 증거는 전체캔버스가 아닌 독립 미리보기이며 상세편집1920 증거도 별도로 보존했습니다.

검수 중 구탭24의 미저장 재열기 경로가 응답하지 않아 한 번 질문했지만, 새 탭25/29의 저장 r72 읽기와 최종 키보드·마우스 검수는 성공했습니다. 원인을 Mac잠금/제품결함으로 확정하지 않습니다. 즉시 읽은 Enter Close와 PageDown은 240ms 연출/브라우저 스크롤 중간값일 수 있어 후속 안정 프레임을 확인합니다. 에디터 선택목록에도 data-element가 있으므로 computed 검사는 .ui-element로 범위를 좁힙니다. CSS border-image는 document.images 검사 밖이므로 HTTP/SHA를 별도로 확인했습니다.

최종 소스 검토에서 복제된 tabs의 panelId가 원본문을 가리키는 결함을 확인해 commands.mjs의 번들 ID 재매핑/범위 밖 참조 해제/삭제·그룹해제의 지워진 참조 정리를 보완했습니다. 관련6RED→GREEN 뒤 본체 최종 npm test469/469·fail0·cancelled0·exit0. 로그 _작업/codex/ux-studio/friends-screen-final-verified-tests.log, 실제 Panel 복제→Undo(저장안함)도 확인했습니다. 이 최종 시험 뒤 제품 소스 변경0입니다. workspace 누락 의심은 실제 root metadata 상속으로 해소했고 소스수정 없이 두 workspace 소비자20/20을 확인했습니다. 실제 결함으로 기록하지 않습니다.

근거는 docs/collaboration/reports/20261116_2125_friends-screen.md와 docs/evidence/20261116-friends-screen/{browser-checks,file-verification,asset-http-checks}.json 및 JPG입니다. 구체적인 안정 프레임·입력 성공은 이 최종 절을 우선합니다. 실제 Send/Reject API·원본에 없는 두 탭 본문·Jaime 본문/초상·원본 폰트/픽셀동등·7007/LSB native·게임연결/사용자승인·W/P/U/S0/4·10장 최종동등0/10은 미완료입니다. 다음05 메인 신규 배경은 준비 파일이며 아직 미등록/미조립,06메뉴/07창고/08상점/09·10이벤트 순서로 이어갑니다. 주간84/90·11/17 08:00KST 중지선·기존ui30분만 유지합니다.
