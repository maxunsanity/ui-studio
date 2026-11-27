# 타일 서바이벌 UI 샘플 제작 계획
상태 제안(검수 대기), 현중 새 샘플 데이터 제작 직접요청.

목표: 4영상에서 발견한 서로 다른 UI 판틀을 실제 UI스튜디오 참고샘플과 자료로 구성한다. 게임판정/전투/3D런타임을 만들지 않는다.

기존 경로를 재사용한다. samples/tile-survival의 독립 UI workspace, 504×894 논리화면, native 프레임/그림/텍스트/입력·상태·연결로 조립하며 기존 툴 지원만 사용한다. 전체캡처 한장으로 제작을 대신하지 않는다. 원본프레임은 참조 카탈로그에만 두고 production은 새원화/기하자원과 native문구를 쓴다.

- [x] 영상4개를분석한다: root1,하위2/3/4. 5초·6초 coarse와전환정밀확인. 카메라/숫자/인물변형은같은판틀상태로합친다.
- [x] 첫영지UI 유사샘플실제데이터를먼저제시: Capy r90 504×894/장면504×894/HUD504×64/Nav504×108. 타일은상단얇은자원줄·건물하단시트라는차이를기록한다. 정확원본Unity설정이아님.
- [x] 실제 macOS폴더선택→독립UI→workspace/project r1기준판저장.
- [ ] 카탈로그의원본시간/분류/부품/상태·연결/미확인과참고자료HTML을통합한다.
- [ ] 영지부터구역W→상태·이동P→새원화U→저장재열기·반응형 검수한후 다음판틀을구성한다. parentchild와ID/네이밍·동일역할규격은유지한다. 매단위before/after/파일:줄/백업/시험/캡처를기록한다.
- [ ] 다른판틀은각각같은순서로만든다: 건물정보/조건,대화/선택,미션/보상,영웅/모집,주민/교환/이야기,소대/전투HUD/결과,채팅/기타고유창. 최종대상수는통합카탈로그를따르며로컬군수를합산하지않는다.
- [ ] 샘플보기/조사서와홈연결,가이드경험/규격갱신,자료링크·넘침·이미지·저장/재열기와미확인마감.

제약: 다른샘플/2차RoyalMatch/LSB설정보존, 샘플JSON외부수정금지, 새서버·패키지·빌드·자동화·7007변경없음. 방법/표현전환/테스트수를UI완성률로세지않는다. 원본동등·비관찰탭·실제게임API는미확인.


## First publication 2026-11-18 / review pending
- [x] 4 source videos catalogued:31 families,52 reference frames,44 observed transitions,45 proposed link examples.
- [x] Native partial representatives: territory50/building48/upgrade43/heroes78=219 parts;5 links; r63 saved/reopened.
- [x] GUI:8 size/screen states,6 runtime scenarios,tablet scroll/button tint;full673 tests and related43 after guide publishing.
- [x] Home sample card,guide.36/16 docs,source catalog1251 static checks,final screenshots and handoff.
- [ ] Remaining27 families native assembly and original complete visual-equivalence;TS09/TS22/TS26/TS19 next.

Original broad tasks above remain pending where all31-family production was described. This publication completes the first usable sample dataset, not all31 production screens or game implementation.
