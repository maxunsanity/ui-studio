# UI 프로젝트 폴더·내장설명서·독립 정본
작성자 codex(단이) · 시작 2026-11-16 09:10 KST · 갱신 2026-11-16 09:57 KST · 제안(검수 대기)

## 지시 원문
현중: 프로젝트 폴더로 구분, 폴더 안 기본가이드/AI사용법, 상시 가이드보기와 프로젝트전환, 다른프로젝트는 폴더찾기, ui-studio 생성, 개발중게임 공통룰. 기존UI는 변환 여부를 먼저 묻고 거절시 기존게임UI를 건드리지 않고 독립UI소스 저장. 모든규칙/기획서/어떻게제작·활용하는지툴안에 포함. 복수에이전트 동시작업. /Users/max/projest_max 에독립도구,영문폴더로정리. 케이팝은게임없고기획/시뮬레이터뿐. 모노폴리GO는샘플.

## 한 줄 결과
정식 툴은 /Users/max/projest_max/ui-studio/ 한 곳으로 정리. 독립 소스·기획/가이드7종·AI규칙·원문기획 사본 보존. Kpop은 기획서·시뮬레이터 원본이며 게임이 아님. 모노폴리GO는 검증용샘플. 7007 기존진입의 소스/API를 독립root로 연결. 최종영문폴더 npm test 208/208. 대표r14·3페이지+1모달·24부품·6연결 바이트보존, W/P/U/S0/4. 새폴더·전환·저장재열기/1440·430 실화면은 앱업데이트 이후 브라우저 권한/관리정책 거절로 미검수. 사용자는 차단한 적 없다고 정정했으며 실제거절원인 미확정.

## 읽은 원본
프로젝트/개인 AGENTS,공유수칙·STATUS·관련T04/재개·이전보고,Graphify좁힌코드지도(이관전구판),현재UX편집/저장/소비/Grapes/Native앱등록소스. 상세기획 T04_프로젝트폴더와_내장설명서_20261116.md. 신규정본 rootREADME/AGENTS·guide/.2. 복수담당은수신/공용보고를중복하지않고모듈/가이드/시험/리뷰로분담. 기록없는실행을관찰로주장하지않음.

## 바꾼 것
- 정본 /Users/max/projest_max/ui-studio. src/tools/uxStudio, tests/ux-studio, tools/ux-studio, scripts/start.mjs, package.json, README/AGENTS. 기존Kpop소스·원설계파일은삭제없이보존.
- kpop vite.config.ts: 기존 Kpop UX플러그인→독립root save-plugin·mount 연결, 외부허용은도구소스/필수HTML/관계도라이브러리 경로에한정. 직접7007kill/restart/build없음,설정변경에따른Vite자동적용. PID15304단일리스너확인은이름정리전시점관찰.
- 프로젝트 폴더 저장: nativeNSOpenPanel,등록workspace ID/문서projectId분리,명시동의pending/convert/independent,독립UI시원게임소스무수정,자동변환미구현. 저장/목록/기준판/소비/브라우저키·저장통지모두workspace범위연결.
- 최근폴더이동복구: 옛root ENOENT일때만같은ID의새경로등록,실제복사본은거부.
- 미저장전환 취소·저장실패보호,대상폴더읽기가능성전/후검증. 저장응답중새설계로바뀌어도이전revision이새문서에섞이지않도록보완.
- 안내7종+index2026-11-16.2: 처음읽기/사용설명서/AI규칙/툴기획/제작구조/기존게임변환·독립/진척. 안전text표시·Esc·닫기·초점복귀. 프로젝트별사본은자동덮어쓰지않음.
- 원문기획은독립root docs/reference/t04에출처·SHA256manifest와보존. 과거원문속상대링크·시험수는당시기록.

## 파일:줄 근거
```json
{
  "src/tools/uxStudio/main.mjs": {
    "const workspaceId": 22,
    "async function save": 183,
    "function showProjectManager": 234,
    "async function init": 2117
  },
  "src/tools/uxStudio/project-manager.mjs": {
    "export async function allowProjectSwitch": 13,
    "export async function openProjectManager": 25
  },
  "src/tools/uxStudio/workspace-store.mjs": {
    "export async function prepareFolderPicker": 76,
    "export function createWorkspaceStore": 123,
    "async decision": 217
  },
  "src/tools/uxStudio/manual.mjs": {
    "export async function openManual": 4
  },
  "src/tools/uxStudio/preview.mjs": {
    "const workspaceId": 4
  },
  "src/tools/uxStudio/grapes-pilot.mjs": {
    "const workspaceId": 9
  },
  "tools/ux-studio/mount.mjs": {
    "export function uiStudioMount": 2
  },
  "src/tools/uxStudio/guide/README.md": {
    "# UI": 1
  }
}
```

## 확인
- 최종영문root npm test → 208pass/0fail; 로그 _작업/codex/ux-studio/english-folder-tests.log. 해당회차최종수만기재(35/200/202등중간재실행중복합산안함).
- 새 비동기저장회귀는실패4건재현뒤6/6통과, 이동복구실패재현뒤통과. 단일기능시험수를완성률로세지않음.
- main/preview/Grapes/mount/start문법검사통과. nativehelper Swift컴파일/bundleID/plist/selfcheck통과.
- 앱업데이트전 실제7007r14열기→가이드열기→기존게임규칙문서읽기→Esc닫기(초점가이드버튼복귀)→프로젝트폴더창→nativeNSOpenPanel열기. 끝까지폴더전환완료로세지않음. 사용자가선택한영문저장공간은설계0개확인후보존.
- 앱업데이트·폴더영문화후Browser7007접근거절. 사용자직접허용·설정해제알림·전체파일권한변경뒤에도같은저장권한/관리정책거절. 새팝업미표시. 자기앱설정창조작도시스템금지응답. 이를사용자가실제로차단한증거로해석하지않음. 다른브라우저/호스트/우회제어로검수를대체하지않음.
- 현재1440/430·저장전환/재열기실화면·현재캡처미검수. 과거캡처를최신으로제시하지않음. 이번기능의7007목록→T04카드→실행전체진입검수미실시.
- 대표ux-gjs-61ad2d1f r14 /3page+1modal/24parts/6links. 이관사본과Kpop원본바이트동일. _작업/codex/ux-studio/20261116-transfer-check.json 참조.

## 백업과 정본
Kpop docs/planning/_backup/20261116_단이/0910_프로젝트폴더·0934_네이티브폴더선택기번들·0955_독립프로젝트보고.
독립root docs/planning/_backup/20261116_단이/0940_독립시험·0940_독립가이드·0945_이동복구·0950_영문폴더정리. duplicate-workspace는삭제아닌이동보존. 현재한글UI스튜디오폴더없음.

## 손대지 않은 것·미확인·다음
보호파일및Mono/다른host/발란스/3D/운영표미접근·미수정. 외부발송/공개게시/결제/시크릿/새패키지/새예약없음. 기존ui heartbeat PAUSED유지.
실화면접근복구가다음필수. 공식안내 Settings > Browser > Agent permissions 에서7007주소의사이트별권한을확인하는사용자조작필요. 채팅동의만으로정책초기화됐다고주장하지않음.
이후두폴더실제전환/동의선택/취소/저장재열기/preview·Grapes범위/1440·430검수와캡처. 실제게임전체변환미구현,대표정식그래픽·상점·보상·이벤트·설정등전유형샘플미완료. 코드이관/import새연결이공용Graphify구판에미반영되어갱신필요. 커밋없음.


## 2026-11-16 10:05 KST · 기본 주소404 보완
현중: 케이팝폴더밖이라안열리는지/포트변경질문. 확인: 7007리스너PID15304실행중, HEAD /404·실제툴HTML/JS/CSS200. UI스튜디오분리자체의전면불통이나포트충돌은확인되지않음. 기본주소에진입페이지가없던문제는 tools/ux-studio/mount.mjs의 /·/index.html→302 /docs/planning/ux-studio.html 로수정(query보존/no-store). 독립실행 scripts/start.mjs에도동일mount재사용. 다른기획서/시뮬레이터URL은그대로next. 별도포트변경이나서버프로세스재시작/빌드없음.
선행회귀3중1실패확인→보완후3/3, 최종npm test211/211(로그 독립root/_작업/codex/ux-studio/root-entry-tests.log). 실제7007/ HEAD302·Location툴주소확인. 이는HTTP진단·서버연결시험이며브라우저화면검수아님. Browser7007자동접근거부는별개로유지,포트/호스트/다른표면으로우회하지않음. 백업 독립root/docs/planning/_backup/20261116_단이/1005_기본주소진입. 대표r14·W/P/U/S0/4유지. 다음사용자기본주소재열기및정상승인후실화면검수.
