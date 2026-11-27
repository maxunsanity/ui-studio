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
