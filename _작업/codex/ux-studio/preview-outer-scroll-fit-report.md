# Standalone 미리보기 높이 맞춤·외부 스크롤 보완

codex(단이) · 2026-11-16 18:45 KST · 제안(검수 대기)

## 진단

systematic-debugging에 따라 preview.mjs/consumer.mjs/스타일·실제 preview HTML을 확인했습니다. 본체 실제 증거는 r43,1600×900, body.scrollHeight1139/main→Build 뒤 scrollY238.75이며 Ctrl+Home에서 상단이 다시 보이는 상태입니다. 이미지 실패0이라는 본체 확인과 구분했습니다.

두 원인을 확인했습니다. 기존 fit은 viewport 폭만 사용하므로551×984 화면에 헤더·안내·여백을 더하면900px을 넘습니다. consumer는 같은 host에서 page DOM만 교체하므로 외부 document 스크롤은 유지됩니다. 소비자 내부 목록의 scrollTop 복원 기능과 다른 층의 문제입니다. 기존 공통 consumer API·논리 크기·기기 reflow는 수정하지 않았습니다.

## 최소 변경

- `src/tools/uxStudio/preview.mjs`: stage의 문서상단 좌표(rect.top+window.scrollY)와 하단 안내·margin/padding을 실제 DOM에서 측정해 가용 높이를 계산합니다. 폭·높이·최대1 중 작은 균일 scale을 사용하고551×984 원본 논리 크기는 유지합니다. 이미 스크롤된 문서에서도 동일 배율입니다. 상단 status 및 하단 action 안내가 바뀐 다음 fit을 계산합니다.
- host의 DOM paint를 MutationObserver로 감지한 뒤 public consumer.getState().page를 비교합니다. page가 실제로 바뀔 때만 window.scrollTo({left:0,top:0,behavior:'instant'})를 호출합니다. navigate/Back은 외부 문서를 위로 이동하고 초기·같은 page 피드백·overlay·list 갱신은 외부 scroll을 건드리지 않습니다. pagehide에서 observer를 해제합니다. element.scrollTop이나 runtime.scroll은 접근하지 않습니다.
- `styles.css`의 `.consumer-page #consumer-stage`에만 overflow:clip을 추가했습니다. transform으로 축소한 뒤에도 원래984px child layout overflow가 body를 다시 늘리지 않도록 하는 preview 외곽 경계입니다. 내부 list/ScrollRect 규칙은 변경하지 않았습니다.

## 확인

RED:1600×900/430×844에서 높이 초과2개와 page 전환 외부 스크롤 처리 부재1개를 재현했습니다. GREEN: 전용·기존 논리크기 preview 시험 **11/11 통과**, preview.mjs node --check exit0입니다. 명령·출력은 `preview-outer-scroll-fit-tests.log`에 있습니다. 전체 npm test는 실행하지 않았습니다.

전용 시험은 실제 preview 스크립트를 VM에서 실행하고, 실제 model.createRuntime/activate와 public getState 경계 fixture를 사용합니다.1600×900/430×844의 가용 W/H fit,1600×1800에서 불필요한 확대 없이 원본 크기 유지, 이미 scrollY238.75인 문서의 배율 불변, navigate/Back 외부0복귀, 같은 page feedback/overlay에서 외부scroll 유지, fixture 내부 list.scrollTop141 불변, observer 해제를 확인했습니다. 실제 DOM 픽셀·native scroll·실기기 검수가 아니라 이 경계의 자동 시험입니다.

본체가 명시 reload 후 실제 상/하단 동시 표시·Back·430px을 검수합니다. 이 하위는 브라우저/UI 조작·스크린샷을 수행하지 않았습니다. standalone에 기기 선택 메뉴나 논리 height reflow를 추가하지 않았습니다. 내부 ScrollRect/list 복귀 정책도 추가/변경하지 않았습니다.

main/consumer/설계 JSON/HTML/가이드/공용 보고·STATUS/서버/예약은 변경하지 않았습니다. 추가 패키지·빌드·서버 재시작·전체 시험·커밋 없음. 제품 소스는 preview.mjs와 preview 전용 CSS1줄뿐이며 이제 추가 쓰기 없이 안정화했습니다.

백업: `docs/planning/_backup/20261116_단이/184120_preview_outer_scroll_fit/`에 preview.mjs/styles.css/기존 logical-size-editor-preview.test.mjs를 보존했습니다. 새 전용 시험은 preview-viewport.test.mjs입니다.
