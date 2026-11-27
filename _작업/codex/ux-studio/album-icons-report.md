# Album illustration assets v001 — asset QA

Status: 제안(검수 대기). Built-in `image_gen` used for newly drawn original art; no screenshot pixels reused.

- 15 final WebP: 9 square round set illustrations, 5 banner reward objects, 1 closed vault/book.
- Final manifest: `_작업/codex/ux-studio/album-icon-assets.json` (all exact file paths, alpha statistics, source regions and SHA-256).
- Production: `samples/monopoly-go/ui-studio/assets/production/album-icons/`.
- Staging: `src/tools/uxStudio/assets/import-staging/album-icons/` (byte-identical copies).
- Authoring/master, PNG sprites, raw source cells, prompts, reproducible extraction and preview: `samples/monopoly-go/ui-studio/assets/authoring/album-icons/v001/`.
- Visual reference inspected: `docs/reference/monopoly-go/20261116-ten-screens/03_album.png`; preserved unchanged.

## Art and evidence

`prompt.txt` is the exact original generation prompt. `album-icons-master.png` is the selected 1254×1254 RGBA master. `cleanup-prompt.txt` and `album-icons-cleanup-attempt.png` preserve a second imagegen alpha-cleanup attempt; it was rejected because it introduced visible diffuse halos. Production uses the original master with deterministic silhouette alpha extraction and tight cropping, without repainting subjects. `extract-assets.py` records the exact extraction and export process. `production-contact-sheet.jpg` was visually inspected after export: all fifteen subjects are present, separated, and free of exterior colored speckles.

Observed fully: the first six set subjects and the five banner reward subject types. Observed partially: purple fan/curtain, yellow cat, ginger cat in the lower set row; unseen details and complete poses are artistic proposals. The small reference vault/book and its ornament are interpreted, with all letters omitted. Exact album names, totals, progress values and hidden content were not invented in the image assets. Subject-specific observed/inferred notes are in each manifest entry.

## Verification

Fresh export validation passed 15/15: readable WebP; each ≤300000 bytes and ≤4096px; true RGBA alpha including fully transparent pixels; square first nine; exact stored SHA-256; production/staging byte parity. Final edges are 253–299px and sizes are 21960–42178 bytes. Source master dimensions, cell dimensions, crop coordinates and output dimensions are recorded individually. All sprites retain smooth edge alpha; round illustrations retain unavoidable transparent square corners. No new packages installed.

## Limits

These are original illustrations matching the source concept, not exact copies of the proprietary drawing. Facial poses, clothing details and ornaments vary. Three partly visible set subjects contain proposed details. The cloche interior has a pale glass fill; the exterior background is transparent. Text, labels, numbers, UI frames and controls are intentionally absent. This asset-only QA did not inspect the resulting UI or claim pixel-perfect screen fidelity; root owns UI registration and screen checks.
