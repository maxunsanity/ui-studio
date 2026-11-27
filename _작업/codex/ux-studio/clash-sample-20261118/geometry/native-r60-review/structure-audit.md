# Clash r60 정적 구조 검토

2026-11-18T08:41:33.048Z · codex 하위 · 제안(검수 대기)

고정 스냅샷 [원문](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/clash-sample-20261118/geometry/native-r60-review/ux-ea29177e.r60.snapshot.json) / SHA fa9091c6a9a432ef3ef3210ae5aa4ea488db822981ce75033f731a7c077c8ccd. 실제 툴/브라우저 검수가 아닙니다. 원본 설계와 자원은 읽기만 했습니다.

4화면261부품10연결, 177993bytes/2,000,000bytes.

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
|homeDeckHUDParentAnd10ChildrenPixelMatch|검토/교정 필요|
|HUDExperienceFillRectAndMaterialMatch|PASS|
|deck8CardsCommonOuterVisualImage|PASS|
|deck8AtlasRegions|PASS|
|noParentModeImageWithoutActionOwner|검토/교정 필요|
|transition10IDReferencesValid|PASS|
|transitionConditionsAllAlways|검토/교정 필요|
|pureModelTransitionActions10|검토/교정 필요|

## 지적/잔여

- HUD_PARENT_HEIGHT: Home parent H35 vs Deck H34 in r60; proportional child rects differ while fixed Fill stays97x19. Source raw snapshot preserved.
- PARENT_IMAGE_NO_OWNER: Display image uses parent mode but HUD container has no action owner. It is not a dangling transition; mark display-only none if that is the intended role.
- UNKNOWN_CONDITION: condition=unknown returns null and activate stops with a pending-condition message. Transition IDs remain structurally valid.

## 주요 규격

- Home/Deck/Social의 nav15개: outer78×66, x0/78/156/234/312, y778. icon48² local(15,0), label78×18 local(0,48), font14/line17/center.
- Deck8카드: outer90×131, visual86×126 local(4,5), image78×94 local(8,9), pitch94/152·gap4/21. 600×300 atlas의150²영역8개.
- Home/Deck HUD11쌍(parent+10children) 및 Experience Fill의 rect/재질을 별도 JSON에 기록했습니다.
- parent영역 바깥 자식은 0개이며 JSON의 parentOutside에서 부모overflow와 함께 구분합니다. screen 바깥은 0개입니다. 보이는 DOM 넘침/클리핑 검수로 확대하지 않습니다.

연결의 ID참조 유효성과 condition 실행결과를 분리했습니다. 10개 메모리모델 동작 중 1개가 대상행동에 도달했으며, 브라우저 입력 성공을 뜻하지 않습니다.

sourceDesignWrites0 / browserActions0 / asset originals writes0.
