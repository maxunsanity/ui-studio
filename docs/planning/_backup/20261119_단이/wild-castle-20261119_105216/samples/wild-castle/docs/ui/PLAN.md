# Wild Castle UI Sample Implementation Plan

> For agentic workers: use executing-plans. Native UI authoring in this session; no delegation, no source/model injection.

**Goal:** 공식게임명 확인 후 영상의6대표UI를7018독립샘플로제작하고관찰된흐름/검수/조사서를보존한다.
**Architecture:** native Studio saved design+separate versioned new artwork+native text/controls; analytical JSON is not authored design JSON.
**Tech Stack:** existing UI Studio, built-in imagegen, PIL fresh geometry, bundled ffmpeg, native UI controls.
**Spec:** docs/ui/DESIGN.md

## Global Constraints
- 7018 only; other samples/common source/7007/server/original untouched.
- Source captures analysis only; bitmap artwork freshly generated. Prices/text separate native.
- native screen/part IDs and parent links persist W/P/U; no external design JSON/API authoring.
- 300000B per imported image,2000000B design; source/masters preserved.
- Unobserved values/targets are not invented; proposal/review pending, not approved equivalence.

## Review Focus
- Video padding must not become game UI; logical390×780 and anchors verified.
- Scroll sections share one Shop page; no duplicated page count.
- Duplicate native bundles must have correct parent/local coordinates/action ownership.
- Fixed hit areas with paired normal/pressed images and native label/front movement.
- Popup return, passive parts, disabled locks and missing destinations distinguished.

## Tasks
- [x] Identify game using official sources, sample full46.43seconds, stable captures and inventory.
- [x] Compare existing actual sample structures/geometry/states and state differences to user.
- [ ] Register own folder via native picker; read generated project instructions/identity.
- [ ] Build6screen structure/observed edges in native UI; save/reopen and W baseline.
- [ ] Implement native selection/scroll/feedback/popup links; validate and P baseline.
- [ ] Generate/inspect new stills and atlas artwork, preserve masters/prompts and capped production; apply through native uploads; U baseline.
- [ ] All6views atlogical390×780/CSS1440 and430, actualclick/return/scroll/selection/state; native export/reopen/read-only SHA/contracts.
- [ ] Studio research viewer/production guide/report/STATUS and final evidence; isolate known limitations.
