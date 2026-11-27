# Tile native controls: normal UI action recipe

Proposal awaiting review. Action instructions, not a saved design model. Exact existing IDs and text are in controls-native-recipes.json. Root editing is concurrent: inspect current selected screen/element/revision before acting. Future TS29/31 IDs must come from normal UI assembly.

## Ordering that matters

Existing button to control: input mode none -> action -> control type. main.mjs:2010 removes buttonState when mode is not action. Simply unchecking effect enabled leaves the object; button-state.mjs:23 rejects any buttonState plus control, even disabled.

Text/textarea commit: fresh locator -> Meta+A -> pressSequentially -> Tab. Empty: Meta+A -> Backspace -> Tab. Refind after rerender; use selectOption/setChecked for select/checkbox. Fill-only success is not persistence proof.

Tabs: observed panel wrapper first, raw native strip next, options lines first, initial value next, actual panel ID last. Unknown body remains unlinked. Selecting it really hides the linked known panel without inventing alternate content. That is explicitly partial content coverage.

Choice fields are now allowed: root reported approved own7018 restart and saved/reopened r242/r244 with TS12 square32/#36ca5c actual native tests. The previous validator limitation is superseded. This subagent performed no restart/browser test. TS24 owner is26px;18px fits its4px padding on both sides, while copying32px would overflow.

## Raw owner and preserved visual labels

Use Unit add -> raw rectangle backplate tool (not compound info/backplate/button tool), obtain actual generated ID, blank text, frame role, stroke0, parent, local logical rect, action enabled, no buttonState. JSON rects are absolute504x894 logical pixels; convert to parent-local in normal fields. Parent first, geometry second, then audit anchors: moveInto preserving absolute position is not proof all responsive anchors remain equivalent.

Native tabs has equal contiguous cells, gap0/padding0, one common normal/selected tabSkin. It cannot encode per-option colors/icons/gaps. Preserve existing separate Txt/Img as common-parent siblings above the strip: labelMode icon suppresses native visual labels while option labels remain accessible; foreground mode none makes image/text pointer-events:none, so clicks reach native strip. Display-only panels still intercept and must stay behind. Move old roots mode none/back; foreground labels/icons mode none/front, preserving absolute positions/IDs/assets. Do not claim original spacing/pixel equivalence.

## Family minimum

|Family|Native state|Known body|Unfinished boundary|
|---|---|---|---|
|TS21|attack/damage tabs, attack default|existing two rows10parts in new raw wrapper|damage unlinked; no duplicate numbers|
|TS22|advanced/normal tabs, normal default|existing trio/type/tutorial/free count/free CTA in normal wrapper|advanced unlinked; no new text/count/panel|
|TS26|attributes/skills tabs, attributes default|existing HeroStats group|skills unlinked; rank/power/condition scope unconfirmed|
|TS24|existing raw box -> togglefalse|original separate video label kept|no playback behavior|
|TS06|two grouped toggles lefttrue/rightfalse|exclusive values only|description does not switch; optional tabs alternative below|
|TS14|two independent toggles bothtrue|no group property|no population/beds/accept effects|
|TS29 future|state/private tabs + native input|state uses actual feed|private/send unknown; blank native placeholder/value, maxLength1000|
|TS31 future|story-i..iv tabs, i default|actual story panel onlyi|ii-iv unlinked; no copied story/chest rewards|

Toggle owner text should be one ASCII space when keeping external separate label. Empty string falls back to technical element name. Set TS06 rightfalse before lefttrue to avoid intermediate two-true validation. TS14 group stays absent; both independent checkboxes may be true/false. Static TS06 left highlight lines and TS14 Shade/Check do not respond to native values: retain IDs/assets but opacity0, and let native checked marker own actual selection.

TS06 grouped toggles cannot hide the known left description or show unknown right copy. If hiding is required, JSON tabsAlternative binds only known left-description panel, right unlinked. Native cells become contiguous188px versus original separated164px cards with48px gap; root decides this visual tradeoff. Confirmation must not run invented branches.

## Verification

Edit mode deliberately disables native controls. Save/reopen, then use play/consumer. Scope actual DOM to .ui-element[data-screen][data-element] > .ui-control, avoiding editor layer-list duplicates. Check selected/checked/value, aria-selected, known panel display:none/inert and restoration, keyboard/click, inactive panel focus, and separate foreground labels still passing clicks through. Runtime typing changes runtime state, not authored defaults/game server.

Read saved design only after normal UI save to prove fields persisted and buttonState absent. Check CSS1440x900/430x844 failures/overflow/focus and record actual capture pixels separately. Unknown alternative bodies stay empty and explicitly incomplete. Source inspection/recipe checks are not actual screen passes.

No product source, saved design, browser, project metadata, shared STATUS/report, server, or routine was changed by this subagent. No product tests rerun. Root Graphify map was absent; targeted controls/inspector/model/layout source reading was used.
