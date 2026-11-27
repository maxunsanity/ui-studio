# AI for UI 스킬 검토·적용 계획
작성자 codex(단이) · 2026-11-16 KST · 제안(검수 대기)

## 현중 직접 지시
“https://aiforui.dev/skills 이것도 작업에 적용할 수 있는지 검토해봐”, “할 수 있으면 기획에 넣던가..”. 현재 모노폴리 GO 제작과 새 UI 연결 작업은 계속한다.

## 검토 결론
UI 스튜디오 엔진을 교체할 라이브러리가 아니라 AI의 제작·검토 방법을 정리한 스킬 모음이다. 기존 순수 JS/GrapesJS 엔진에 필요한 점검 방법을 적용할 수 있다. 이미지 생성·원본 비율 측정·9슬라이스·부모/자식 설계·게임 연동 기능을 대신 구현해 주는 것은 아니다. 설치 명령을 실행하지 않았고 런타임 의존성을 추가하지 않았다. 공개 저장소의 MIT LICENSE를 확인했다. 원문을 제품에 재배포한다면 출처와 라이선스를 함께 보존하고 고정 commit/파일 해시를 기록한 뒤 반입한다. 이번에는 원문 코드 복사 없이 계획과 검수 방법만 채택한다.

## 기존 계획에 편입하는 항목
| 항목 | 적용 위치·시점 | 구체적 작업 | 수락 기준·경계 |
| --- | --- | --- | --- |
| learn-taste | 로비 각 단위 후, TOOL_SPEC의 단일 제작 표준 | 현중 원문→적용 부품 종류→규칙/수치→사용자 제시 이유→증거→상태를 기록. 기존 같은 규칙을 보강하고 중복 문서를 늘리지 않는다. 추정 이유와 미승인 시안은 확정 규칙으로 쓰지 않는다. | 동일 선상 메뉴80×92/icon64²/text80×22/badge28², 텍스트 form 이름, 알파 여백 crop, 9slice와 엔진 그림자 분리의 근거가 다음 AI에게 전달된다. 컴폼 후에만 승인판을 고정한다. |
| break-ui | 현재 공통 배지/텍스트 및 친구·상점·순위 목록 검수 | 실제 fixture/상태 입력 경계로 0·1·99·100이상, 긴 한글/영문 이름, 이모지, 빈 목록·항목1개, 이미지 누락을 주입한다. 개발 검수 경로에서만 전환하며 제품에 불필요한 시험 버튼을 넣지 않는다. | 수치/배지 넘침·아이콘 축소·줄바꿈·빈 상태·오류 복구를 실제 렌더에서 기록. 시험 수를 화면 완성률로 환산하지 않는다. |
| mobile-native | 전체 캔버스 기기 미리보기 및 최종 모바일 시험 | 논리 크기·미리보기·편집 확대를 구분한다. 터치에 hover가 붙어 남지 않도록 capability로 분기하고, 누름 피드백·취소·safe-area·화면 높이·키보드/입력 확대·스크롤 충돌을 점검한다. | 브라우저390×844/430 CSS 검수와 실제 폰 검수를 분리한다. 실물 하드웨어를 검수하지 않았다면 미검수로 남긴다. 접근성 확대를 차단하지 않는다. |
| emil-design-eng / animate | 버튼 상태 엔진과 메뉴/모달 연결 제작 | 기본 색 변화와 상태 이미지 교체를 각각 확인한다. 누름 즉시 반응·취소/blur 정상 복귀·disabled 입력 차단을 우선한다. 메뉴는 트리거 위치, 모달은 중심과 딤/복귀 동작을 확인한다. | 원본에 없는 연출 시간을 확정하지 않는다. 반복 편집·키보드 동작에 불필요한 지연을 추가하지 않는다. |
| animation-performance / remove-animations | 메뉴·모달·스크롤 실제 검수 | transform/opacity 중심으로 필요한 피드백만 유지하고 layout 재계산·전체 canvas repaint·큰 이미지·무분별한 will-change·불필요한 반복 연출을 조사한다. reduced-motion 환경도 확인한다. | 60fps 등 미측정 성능을 주장하지 않는다. 새 모션 패키지 설치를 선행 조건으로 만들지 않는다. |

## 이번 범위에서 사용하지 않는 항목
- animate-expo: React Native/Expo 전용이므로 현재 웹 엔진의 구현 경로가 아니다.
- ask-sonner: 현재 알림 라이브러리 도입이 필요한 문제가 없으므로 설치하지 않는다.
- pick-ui-library/prototype/apple-design/gestures: 필요한 세부 문제를 만났을 때 검토한다. 이미 승인된 원본 UI 방향을 바꾸거나 별도 프로토타입을 계속 늘리는 용도로 사용하지 않는다.
- 외부 스킬의 첫 응답·대기·승인 절차는 검토 대상 원문이며 이 프로젝트의 최신 사용자 지시를 대체하지 않는다. 이미 승인된 개발·수정·가이드 기록은 계속한다.

## 실행 순서
1. 현재 하단 공통 규격·공통 배지·W/H 가이드와 기기 미리보기 실제 검수를 마무리한다.
2. 버튼의 두 상태 효과 및 그림자를 메인에 적용하고 원본과 비교한다.
3. 10개 참조 화면을 명세 순서대로 조립하면서 진입·닫기·뒤로·복귀·스크롤/탭·딤/차단을 함께 연결한다.
4. 각 단위에서 위 fixture/모바일/피드백 검사를 수행하고 현중 수정 사항을 내장 가이드에 기록한다.
5. 현중 컴폼 판만 승인 상태로 고정한다. 목표 2026-11-17 08:00 KST, 계정 주간90%/조회 실패 중지 조건 우선.

## 확인한 공식 원본
- [목록](https://aiforui.dev/skills) / [공개 저장소](https://github.com/emilkowalski/skills) / [LICENSE](https://github.com/emilkowalski/skills/blob/main/LICENSE)
- [learn-taste 원문](https://raw.githubusercontent.com/emilkowalski/skills/main/skills/learn-taste/SKILL.md)
- [break-ui 원문](https://raw.githubusercontent.com/emilkowalski/skills/main/skills/break-ui/SKILL.md)
- [mobile-native 원문](https://raw.githubusercontent.com/emilkowalski/skills/main/skills/mobile-native/SKILL.md)
- [emil-design-eng 원문](https://raw.githubusercontent.com/emilkowalski/skills/main/skills/emil-design-eng/SKILL.md)
- [animation-performance](https://aiforui.dev/skills/animation-performance) / [remove-animations](https://aiforui.dev/skills/remove-animations)

검토 결과와 계획 편입은 완료했다. 자동 설치·전체 스킬 실행·실제 폰 검수·성능 측정·전체 샘플 완성을 뜻하지 않는다.
