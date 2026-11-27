# 킹샷 UI 샘플

원본 영상·PNG를 분석해 새 그림과 네이티브 요소로 제작한 독립 샘플입니다. 제안(검수 대기)이며 원본 게임·게임 로직을 변경하지 않습니다.

- [전체 캔버스](http://127.0.0.1:7018/ui-studio/canvas.html?workspace=workspace-a771ea01-59b3-4b4b-a323-b7f2b8c10886&project=ux-8d104ce4&view=ui&layout=grid)
- [조사서](http://127.0.0.1:7018/ui-studio/source/guide/reference/kingshot-video-20261118/index.html)
- [작업 가이드](docs/ui/PRODUCTION_GUIDE.md)
- [원본 수치](docs/ui/sample-data.json) / [공통 규격](docs/ui/ui-tokens.json)
- [검수 증거](docs/evidence/20261118-kingshot/) / [보고](docs/collaboration/reports/20261118_kingshot_sample.md)

저장본 ux-8d104ce4 r129: 15화면·460요소·20연결. 논리390×844. 실제 클릭 검수13연결, 로컬 런타임 모의 시험20연결, 입력 조작13건, 실제 CSS1440/430에서30화면 검수. 수량은 서로 다른 검수 범위이며 합산하지 않습니다.

프로젝트 폴더 메뉴의 킹샷 ‘조사서 보기’로 문서를 엽니다. 홈 샘플 보기→전체 캔버스→화면 선택→미리보기는 단독 UI 확인입니다. 연결 시험은 상세 편집→편집 도구→동작 시험을 사용합니다. 별도 ‘동작 시험 보기’ 창은 시작 마을에서 출발합니다.

대화·병종 선택·승리·주민 배치·챕터 보상·주민 도착의 자동 진입은 원본의 정확한 진입 조건이 없어 연결하지 않았습니다. 이 중7행동은 실제 진입·복귀 미검수이며 로컬 런타임 모의 시험과 단독 표시 검수만 확인했습니다. 실제 전투·차감·건설·배분·시간 진행은 없습니다. 원본과 완전 동일하다는 의미가 아닙니다.
