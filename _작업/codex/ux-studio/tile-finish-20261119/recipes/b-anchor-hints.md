# B 레시피 · native 앵커 저작 힌트

작성 codex(단이) · 2026-11-19 · 제안(검수 대기). 실제 native 검수가 아닌 저작 힌트입니다.

anchorPreset은 저장 모델 필드가 아니라 **본체가 normal UI에서 선택할 프리셋 힌트**입니다. 기존 rect·text·parent·fit·region 등은 바꾸지 않았습니다. 전체/우선3 JSON에 같은 힌트를 넣었습니다.

- selector: select[data-responsive-field="anchor.preset"].
- 지원 값: top-left, top-right, bottom-left, bottom-right, center, stretch, stretch-x, stretch-y. percent는 기존%로복귀하는 UI 값이며 이번새힌트로쓰지않았습니다.
- 근거: src/tools/uxStudio/responsive-inspector.mjs:4–8, :24–32, :77. 프리셋선택은 **현재 보이는 rect를 보존**해 앵커로 변환합니다.
- 따라서 먼저 기준 논리504×894에서 원래 rect를 확인/복원하고 프리셋을 선택합니다. 이미%때문에늘어진상태에서선택만하면늘어진H가고정될수있습니다. 선택뒤W/H·Tab/blur·저장/재읽기를확인합니다.
- root/Slot_3D는stretch. 상단fullwidthHUD는stretch-x,상단좌/우고정은top-left/top-right. footer는bottom-left로504×76을고정합니다.
- TS26 y>=525의power/rank/stats/EXP/건물조건/footer는bottom-left. previous/next는center로같은Xoffset과중앙Yoffset을보존하며header는위에남깁니다.
- TS22 recruitType/tutorial/freeCount/freeCTA/footer는bottom-left. 아트는center+고정504×420프레임이며fit=contain을유지합니다. 이미지자체를fill/stretch로늘리지않습니다. 상단currency/rewards/record는top-right입니다.
- TS29 feed와TS30 roster viewport는stretch-y. 주어진가로범위/상·하margin을유지하고높이만늘립니다. 그직속메시지/카드는top-left로픽셀크기를고정했습니다.
- 고정크기wrapper안의이미지/글자는기존%를유지해도부모H가변하지않으므로늘지않습니다. fullstretch3D의라벨은center를별도로명시했습니다.
- TS27/28 모달중앙구성은center로같이이동하고최하단안내만bottom-left입니다. TS31 outer는center/476×686고정,close는top-right,hint는bottom-left입니다. 고정outer안story는top-left/383높이를보존합니다.
- 새로만드는TS31 비버튼root/독립닫기면도전체stretch,내용frame은center입니다. tabs를nativebutton조상안에넣지않습니다.

현재 지원 경계:
- 자동배치부모의직속자식에는앵커를함께쓰지않습니다. 본체가viewport내부를nativegrid로바꾸면해당card의top-left힌트대신부모itemSize/grid를사용합니다.
- rectTransform과inset/부모맞춤여백은동시에지정하지않습니다. safeArea는화면직속부품에만지원됩니다.
- center는기존x/y를화면정중앙으로강제로옮기라는뜻이아닙니다. 현재rect의중심offset을보존합니다.
- 논리W504고정참고형제작입니다. 다른논리W전체재배치/Unity전체호환·동적텍스트자동높이·3D엔진연결을약속하는힌트가아닙니다.
- 기기보기/확대율/CSS크기와저장논리크기를구분합니다. 이메타데이터추가만으로nativeanchor가설정되거나반응형검수가통과한것이아닙니다.


## 가족별 key → preset

| 가족 | key → preset |
|---|---|
| TS19 | root → stretch; stage → stretch; stageLabel → center; title → top-left; encounter → stretch-x; tray → bottom-left; footer → bottom-left |
| TS20 | root → stretch; stage → stretch; stageLabel → center; encounter → stretch-x; pause → bottom-left; auto → bottom-left; speed → bottom-left; skills → bottom-left |
| TS21 | root → stretch; stage → stretch; stageLabel → center; speech → top-left; victory → bottom-left; stats → bottom-left; return → bottom-left |
| TS22 | root → stretch; title → top-left; currency → top-right; recruitArt → center; rewards → top-right; record → top-right; recruitType → bottom-left; tutorial → bottom-left; freeCount → bottom-left; recruitFree → bottom-left; footer → bottom-left |
| TS23 | root → stretch; stage → stretch; stageLabel → center; unlockTitle → top-left; rarity → bottom-left; nameRibbon → bottom-left; skills → bottom-left; continue → bottom-left |
| TS24 | root → stretch; header → stretch-x; gem → top-left; gemValue → top-left; gemPlus → top-left; ticket → top-left; ticketValue → top-left; ticketPlus → top-left; skipBox → top-right; skipText → top-right; resultCard → center; footer → bottom-left |
| TS26 | root → stretch; stage → stretch; stageLabel → center; name → top-left; class → top-left; rarity → top-left; profile → top-right; info → top-right; previous → center; next → center; powerIcon → bottom-left; power → bottom-left; powerHelp → bottom-left; rank → bottom-left; stats → bottom-left; expIcon → bottom-left; exp → bottom-left; buildingRequired → bottom-left; powerplant → bottom-left; requiredCopy → bottom-left; footer → bottom-left |
| TS27 | root → stretch; title → center; ribbon → center; recruitIcon → center; feature → center; hint → bottom-left |
| TS28 | root → stretch; congrats → center; subtitle → center; medal → center; track → center; fill → center; progress → center; endReward → center; endCount → center; survivor → center; before → center; relationArrow → center; after → center; rewardTitle → center; supplies → center; speed → center; mailbox → center; hint → bottom-left |
| TS29 | root → stretch; header → stretch-x; stateTab → top-left; privateTab → top-left; feed → stretch-y; system → top-left; rewardBanner → top-left; avatar01 → top-left; sender01 → top-left; bubble01 → top-left; avatar02 → top-left; sender02 → top-left; bubble02 → top-left; avatar03 → top-left; sender03 → top-left; bubble03 → top-left; avatar04 → top-left; sender04 → top-left; bubble04 → top-left; footer → bottom-left |
| TS30 | root → stretch; header → stretch-x; banner → top-left; rosterHeader → top-left; viewport → stretch-y; card_mia → top-left; card_jason → top-left; card_damon → top-left; card_om → top-left; card_susan → top-left; card_jimmy → top-left; claimAll → bottom-left; footer → bottom-left |
| TS31 | root → stretch; close → top-right; outer → center; story → top-left; hint → bottom-left |

Validation: 136 hints; {"stretch": 17, "center": 30, "top-left": 38, "stretch-x": 5, "bottom-left": 36, "top-right": 8, "stretch-y": 2}; non-hint semantic SHA256 unchanged=5a8d6a8d5a2a58ead823dc5b72ef1749f385d8cf3f5ac6950694697299b30c72.
