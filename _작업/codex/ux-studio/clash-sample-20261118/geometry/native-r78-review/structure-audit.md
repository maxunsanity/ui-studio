# Clash r78 정적 구조 검토

2026-11-18T08:54:50.740Z · codex 하위 · 제안(검수 대기)

고정 스냅샷 [원문](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/clash-sample-20261118/geometry/native-r78-review/ux-ea29177e.r78.snapshot.json) / SHA f78b355b1f9e3b4faca3133e7c65003246268ecb7de29c3bae2f64cc0f15222a. 실제 툴/브라우저 검수가 아닙니다. 원본 설계와 자원은 읽기만 했습니다.

4화면261부품10연결, 186410bytes/2,000,000bytes.

|검사|결과|
|---|---|
|counts4screens261parts10transitions|PASS|
|logical390x844AllScreens|PASS|
|modelValidateDocument|PASS|
|designBytesWithin2MB|PASS|
|finitePositiveRects|PASS|
|noNegativeScreenCoordinates|PASS|
|noScreenOutside|PASS|
|nav15UnitsCommonGeometryAndHierarchy|PASS|
|homeDeckHUDParentAnd10ChildrenPixelMatch|PASS|
|HUDExperienceFillRectAndMaterialMatch|PASS|
|deck8CardsCommonOuterVisualImage|PASS|
|deck8AtlasRegions|PASS|
|noParentModeImageWithoutActionOwner|PASS|
|transition10IDReferencesValid|PASS|
|transitionConditionsAllAlways|PASS|
|pureModelTransitionActions10|PASS|

## 지적/잔여

정해진 정적 항목에서 추가 지적0. 실화면/영상 동등과 실제 입력·스크롤·복귀는 본체 검수 범위입니다.

## 주요 규격

- Home/Deck/Social의 nav15개: outer78×66, x0/78/156/234/312, y778. icon48² local(15,0), label78×18 local(0,48), font14/line17/center.
- Deck8카드: outer90×131, visual86×126 local(4,5), image78×94 local(8,9), pitch94/152·gap4/21. 600×300 atlas의150²영역8개.
- Home/Deck HUD11쌍(parent+10children) 및 Experience Fill의 rect/재질을 별도 JSON에 기록했습니다.
- parent영역 바깥 자식은 0개이며 JSON의 parentOutside에서 부모overflow와 함께 구분합니다. screen 바깥은 0개입니다. 보이는 DOM 넘침/클리핑 검수로 확대하지 않습니다.

연결의 ID참조 유효성과 condition 실행결과를 분리했습니다. 10개 메모리모델 동작 중 10개가 대상행동에 도달했으며, 브라우저 입력 성공을 뜻하지 않습니다.

sourceDesignWrites0 / browserActions0 / asset originals writes0.
