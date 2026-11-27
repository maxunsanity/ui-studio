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
- [x] Register own folder via native picker; read generated project instructions/identity.
- [x] Build6screen structure/observed edges in native UI; save/reopen and W baseline.
- [x] Implement native selection/scroll/feedback/popup links; validate and P baseline.
- [x] Generate/inspect new stills and atlas artwork, preserve masters/prompts and capped production; apply through native uploads; U baseline.
- [x] All6views atlogical390×780/CSS1440 and430, actualclick/return/scroll/selection/state; native export/reopen/read-only SHA/contracts.
- [x] Studio research viewer/production guide/report/STATUS and final evidence; isolate known limitations.

## 최종 범위 보정
- r93:7관찰상태(영상6+추가고레벨1),5판틀/576부품/15연결. W9/P76/U93은 보존판이며 사용자 승인/시각 동등성 통과가 아닙니다.
- 영상6화면 CSS1440×900/430×843 실제 검수. 고레벨 상세 미리보기는 CSS1440×900 및 논리390×844에서 공통 게임영역/하단 크기를 확인했습니다. 고레벨 독립 preview는 시작 화면으로 돌아가므로 전체 캔버스에서 명시 선택합니다.
- 재능/초상의 실제 선택 적용·미관찰 내부 페이지·상점 anchor jump/scrollspy·실게임은 구현 범위에서 제외했고 가이드에 남겼습니다. 눌림 전용96개+고레벨 진입 없음1개의 audit97은 알려진 상태입니다.
