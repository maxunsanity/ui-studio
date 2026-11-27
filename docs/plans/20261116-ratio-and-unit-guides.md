# Ratio measurement and per-unit design guideline plan

Goal: Correct full-screen 3D-under-2D composition using measured source proportions; add actual zoom, independent parent/child selection and a unit redline guide linked to detail editing.
Architecture: Existing GrapesJS canvas and shared DOM renderer. Pure guide geometry from resolveRect; isolated native dialog for annotated actual unit preview. No new dependency or engine.
Spec: Latest direct user instructions and guide .8. User supplied551×984 reference and A~J redline example, explicitly requested implementation and parallel workers.
Constraints: Independent ui-studio root; no Kpop/Mono/protected reads, no server restart/package/automation; originalr4/r14 and reference images preserved; weekly90cap. No current design approval inferred.
Tasks:
- [ ] Independent source icon/ink bounds, spacing, centers and screen percentages, uncertainty noted.
- [ ] Pure buildDesignGuide: parent/screen coordinates, actual resolved responsive bounds, margins, sibling gaps and known fonts; test before implementation.
- [ ] Isolated guide dialog: actual artwork plus redline dimensions, child drill selection, detailed editing callback, safe text/focus/workspace.
- [ ] Basic canvas zoom + pointer-preserving wheel, independent nested selection and path/child controls; scoped regression.
- [ ] Integrate into full canvas and detail editor; preserve unsaved dirty choices.
- [ ] Correct sample 3D full bleed, SNS photo slot and top/bottom overlay sizing from source. Artwork completion is distinct from measured wireframe.
- [ ] Actual desktop/mobile zoom, parent/child guide and edit, measured guide coordinates, save/reopen and screenshots.
- [ ] Record approval-process rule in guide; save approved snapshot ONLY after explicit user approval.
Review focus: two coordinate bases; nested responsive and padding; hidden controls remain inert; iframe scale vs logical units; untrusted labels; dirty state/navigation; no fabricated source font sizes.

## 2026-11-16 implementation checkpoint (r29)

Measured source bounds (25 main / 67 total), pure responsive guide geometry, editable isolated guide, parent/child navigation, independent line colors/positions, image put/remove, canvas zoom, layer selection and resizable side panels are implemented. Actual main-editor edit/Undo, image put/remove, line drag/color persistence and file save/reopen were observed. Full npm test: 374/374, `_작업/codex/ux-studio/unit-guide-lower-final-tests.log`. Counts are verification results, not sample completion percentages.

The sample is schema4, logical551×984, one page,50 elements,zero transitions at r29. Upper HUD and lower GO/gauge/four-menu visuals were assembled through the actual tool. SNS photo82×82 and white7px circular frame are independent children of the retained96×96 component. Native9slice upper bar/gauge/lower body and fixed decorative crown are separate. Runtime DOM shadows are separate from image pixels.

Desktop1440 and1920 plus430px rendering was checked; final captures after the last visual changes and source-to-browser freshness remain under review. Whole-canvas guide Undo returned width230px and clean state after one Undo on fresh r29; the older r5 observation is not erased. A stale guide module in the running server was found during this check, so current line-color controls must be rechecked after explicitly approved7018 restart. The tool-only full suite passes, but this is not proof that every running tab uses current code.

Latest user steering supersedes the empty-scene presentation for this illustration sample only: redraw the supplied pastel park board with pond, trees and surrounding buildings, then apply it below all2D HUD/menu overlays. No3D engine or original screenshot pasted as production art. The new2D resource is prepared but not registered yet because the local7018 server restart was rejected by automatic approval review. Approval is pending in this chat. Files/r29 are preserved; automation remainsPAUSED. W/P/U/S acceptance0/4, no user visual approval inferred.
