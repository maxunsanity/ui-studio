# 카피바라고 · 샘플 UI 프로젝트

사용자 직접 요청에 따른 별도 샘플입니다. 모노폴리 GO와 설계·자원·workspace를 분리합니다.

게임 화면은 2D 스틸샷만 사용하고 조작 가능한 UI와 미리보기 연결만 제작합니다. 전투·이동·추첨·게임 계산은 구현하지 않습니다.

현재는 영상 분석 준비 완료·제안(검수 대기)입니다. UI Studio workspace 등록/설계 조립/실제 미리보기 연결 검수는 아직 하지 않았습니다. `ui-studio/project.json`이나 설계 JSON을 외부에서 만들어 등록한 것처럼 처리하지 않습니다.

- [캡처·UI 목록·관찰 연결 보고서](reference/video-analysis-20261117/index.html)
- [상세 분석보고](reference/video-analysis-20261117/분석보고.md)
- [화면 목록](reference/video-analysis-20261117/ui-inventory.json)
- [연결·상태 명세](reference/video-analysis-20261117/ui-connections.json)
- 원본 보존 영상: reference/capybara-go-20261117.mov
- [진행 기록](docs/collaboration/STATUS.md)

다음 작업은 이 폴더를 도구의 정식 폴더 선택 경로로 열어 독립 UI workspace를 만들고 C01 로비에서 시작하는 UI들을 조립하는 것입니다. 기존 1차 모노폴리 GO workspace/설계/검수 포인터/작업 탭은 변경하지 않습니다. 로비에서 도달·복귀 가능한 28개 UI 단위의 58개 관찰 전환과 9개 상태 그룹을 명세로 두며 실제 입력·저장 재열기·1440/430px 검수 전에는 구현 완료로 표시하지 않습니다.
