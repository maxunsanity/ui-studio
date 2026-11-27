# 2차 카피바라 제작 차단 — 정식 설계 2MB 계약 검토 요청
codex(단이·2차) · 2026-11-17 20:13 KST · 1차 엔진 담당 검토 요청 / 사용자 순차 제작 직접 지시

카피바라사본ux-gjs-525651fd r333은1979483bytes(17화면1661부품)까지정식저장됐다. 다음C11을마친현재native편집은2037553bytes/17화면1712부품102연결이며save-plugin.mjs:80의prettyJSON2000000bytes검사에거절된다. 편집은열린native탭에유지하고정식‘설계JSON내보내기’로완전보존했다. 소스수정/JSON외부편집/주입/서버재시작0.

근거 src/tools/uxStudio/save-plugin.mjs:46,80; model.mjs:13~16;main.mjs:1703,1912; design-guide-edit.mjs:29. 정식save가pretty바이트기준이라compact약1.19MB이어도거절된다. 전체28UI단위와여러관찰변형을한미리보기로연결하라는현중요구를완료하려면문서용량계약확대또는정식공유부품해결이필요하다. 300KB이미지제한과이미지별실물SHA검증은유지하고문서한도만별도조정하는최소범위를검토해달라. import/save/client/server/guide동일계약과경계시험이필요하며2차는공통파일을수정하지않는다.

보존 samples/capybara-go/_작업/codex/seven01/native-unsaved-export-v002.json (nativeexport원문,외부수정0),검증verification.json,보고 docs/collaboration/reports/20261117_seven01.md(샘플내). 제한변경중브라우저HMR/자동재열기로미저장편집을잃지않게native내보내기보존을우선했다. 저장재시도/재열기복구는2차가본체에서담당한다.

별도1차채팅전송은자동승인검토가현재수신자발송승인부족을이유로거절하여실행하지않았다. 이공용보고만남긴다. 사용자에게전송선택질문을남겼고답은아직받지못했다. 공용STATUS의다른담당기록과엔진파일은건드리지않았다.


## 2026-11-17 20:56 KST — 저장 형식 수정 검증
1차 명시 배정으로 src/tools/uxStudio/save-plugin.mjs 및 새 tests/ux-studio/save-size.test.mjs만 수정. 저장/기준판 모두 공백 없는 JSON과 마지막 줄바꿈의 동일 문자열을 바이트 검사하고 기록한다. 한도2,000,000B 그대로이며 입력·자산 검증/409/잠금/백업/원자적 발행/재읽기 보호 유지.

수정 전 유효 fixtures.items 보정 뒤6개 중4개 실패(공백 초과 저장·기준판 초과·정확 경계·초과 기준판),2개 통과. 수정 후6/6 통과. 전체 npm test:544/544 통과,실패/건너뜀0. 로그 _작업/codex/capacity01/save-size-red.log,save-size-green.log,full-tests.log. 소스단독차이 save-format.patch. 백업 프로젝트루트 docs/planning/_backup/20261117_단이/2055_capacity_save_format/. 소스·자동시험이며 실제서버저장/화면검수 아직 미수행.

1차 지시대로 서버재시작·새로고침0. native미저장 탭12 유지. native export v002는2037553B로 rawimport2MB보다 커서 live편집을 유지한 서버반영/nativeSave 절차를 1차와 확인 중. 외부설계JSON재작성/모델주입0. 소스모듈 import/export 연결 변경0, 코드지도 구조 갱신대상없음(새시험만추가). 상태: 소스검수대기,C11정식저장/소비미리보기검수대기.


## 2026-11-17 21:01 KST — 1차 읽기 리뷰 및 실행 반영 대기
1차가독립읽기리뷰에서serializer-only변경의차단결함없음을회신했다. 실행중7018은옛handler이며Vite재시작이프런트자동새로고침을일으킬수있어dirty12보존/재시작·reload보류를명시했다. root3프레임native작업저장후정상복구경로를조율한다. 서버반영·정식저장은현재외부협업대기.

이번정식Save재시도1회는기존2MB거절을표시했고편집유지됨. C11동작시험에서팝업1/실제이미지62개중failed0,17화면중SevenDay103부품표시를확인했다. CSS기기검수를이번에재실행한것으로쓰지않는다. 편집증거 outputs/카피바라고_용량수정_보존중인편집.png(작업채팅outputs); 샘플증거 _작업/codex/capacity01/held-editor.png. canonical r333/1661부품이고원문export v002 2037553B/1712부품/102연결/SHA84a4b10e5ddbeb89684ede93a4d8a847bca3b06a586cde7a51903cee9dc83523는불변.

독립준비로C14낚시축제원본확대관찰/네메뉴+뒤로/시간snapshot/미관찰목적지와공통규격recipe작성. 새원화후보v001은생성·프로젝트보존했으나원본보다큰하늘여백/주인공높이차이로selectedfalse/appliedfalse,production없음. 이는UI조립완료가아니다. C12/C13준비자원은유지하며서버저장경로가안전해지면C11저장→소비미리보기→C12/C13native조립순서.
