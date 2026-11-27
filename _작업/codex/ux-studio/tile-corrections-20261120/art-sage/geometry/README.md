# Tile three-screen geometry v01

All assets are freshly authored SVG geometry; screenshots were reference only. Production PNG/WebP files contain no text or character art. Source pixels equal logical reference display pixels (1×). No outside transparent padding or baked external shadow.

Slice contract: left/top/right/bottom below are fixed caps in source pixels. At the native display size the exported display border widths must equal these values. Keep four corner cells unscaled. Horizontal 3-slices keep height 64 px and stretch only the middle horizontally. Fixed decorations/glyphs have no slice insets. All assets must import as full images (no source crop).

|Asset|Native W×H|Mode|L / T / R / B|Bytes|
|---|---|---|---|---|
|tile-jason-cream-paper9-v01|392×262|nineSlice|26 / 26 / 26 / 26|32335|
|tile-jason-teal-shell9-v01|414×356|nineSlice|26 / 26 / 26 / 26|47641|
|tile-jason-orange-top9-v01|392×166|nineSlice|38 / 38 / 38 / 38|21711|
|tile-shelter-blue-paper9-v01|466×606|nineSlice|22 / 22 / 22 / 22|73775|
|tile-shelter-header-blue9-v01|476×98|nineSlice|14 / 14 / 14 / 14|15224|
|tile-cta-green3-v01|164×64|threeSliceHorizontal|23 / 0 / 23 / 0|2640|
|tile-cta-orange3-v01|164×64|threeSliceHorizontal|23 / 0 / 23 / 0|2536|
|tile-close-orange-disc52-v01|52×52|fixed|0 / 0 / 0 / 0|4046|
|tile-clipboard-plate-handle-v01|212×112|fixed|0 / 0 / 0 / 0|13253|
|tile-binder-ring-v01|18×36|fixed|0 / 0 / 0 / 0|1178|
|tile-hero-blue-diamond-background-v01|504×894|fixed|0 / 0 / 0 / 0|23576|
|tile-glyph-people-v02|44×36|fixed|0 / 0 / 0 / 0|1951|
|tile-glyph-bed-v01|50×34|fixed|0 / 0 / 0 / 0|1408|
|tile-glyph-forward-v01|34×22|fixed|0 / 0 / 0 / 0|889|

All structured sourceSlice/exportInsets/displayInsets values are in geometry-delivery-v01.json. In this handoff exportInsets means the display fixed-border widths; it does not mean adding canvas padding. App-specific data was not edited.

Notes:
- Place clipboard plate behind paper; the square lower plate is deliberately occluded by paper.
- Jason binder-ring is a single fixed loop: use four instances, two at each side.
- Header blue has decorative dashed seams. Native 476×98 preserves the reference dash lengths; width stretching stretches its middle dashes. Keep native width for the reference layout.
- Orange top is intentionally plain: emblem/character/text are separate layers.
- Hero background is opaque; all other assets preserve alpha around rounded corners/silhouettes.
- Rendering: SVG → macOS AppKit NSImage → RGBA PNG; only background RGB was compressed to WebP at quality 94 to meet the 300000-byte import limit.
- Runtime nine-slice UI registration and target-screen visual QA remain the parent task.

## Sage tutorial portrait crop
Use the existing 640×960 sage-fullbody-v02.webp with UI-only source crop x=220, y=20, width=240, height=240 for hat/face/upper shoulders. No new portrait bitmap is needed. For wider shoulders, use x=205, y=10, width=280, height=280.

## Tutorial pointing glove
Production tile-tutorial-glove-v01.png is a 384×384 full-image transparent fixed bitmap, 69980 bytes. Cuff is upper-left, fingertip points lower-right. Apply rotation and yellow glow in native UI. No 9-slicing. Generation prompt and alpha/hash details are in tile-tutorial-glove-v01-manifest.json.

Population glyph latest is v02 (three people); earlier v01 is preserved but should not be imported for this reference.

## Additional fixed glyphs
- tile-glyph-close-white32-v01.png: 32×32 pure white X, transparent background, no border or shadow.
- tile-info-blue-disc44-v01.png: 44×44 blue info circle background only, no ? or i.
Both full-image fixed, zero slice/export/display insets. Metadata in geometry-small-glyphs-v01.json.

## Jason sparkle decorations
- tile-glyph-yellow-star32-v01.png: 32×32 yellow five-point star.
- tile-glyph-gold-dot24-v01.png: 24×24 golden disc.
Both fixed full-image transparent RGBA with zero insets and no baked external shadow/glow. Native engine may apply glow. Source/hash metadata: geometry-jason-sparkles-v01.json.
