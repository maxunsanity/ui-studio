# Set08/09 species corrections v002

Status: 제안(검수 대기). Source `docs/reference/monopoly-go/20261116-ten-screens/03_album.png` and v001 contact sheet visually inspected before generation. The lower-center subject is a green/yellow bird with orange beak; the lower-right subject is a yellow dog. Prior yellow-cat/ginger-cat interpretation was incorrect.

Two separate built-in `image_gen` generation calls created new original illustrations, without reusing screenshot pixels. Each exact prompt and original 1254×1254 RGBA generator output is preserved here. Deterministic alpha silhouette extraction, tight cropping, square padding and 512px WebP export are recorded in `export-corrections.py`; no subject repaint was performed. The final `corrections-contact-sheet.jpg` was visually checked: clear bird beak/wings and clear dog nose/floppy ears; no cat identity, letters, badges, counts, UI, external shadows or exterior speckles.

Verification: 2/2 passed, both 512×512 true RGBA with alpha extrema 0–255, below 300000 bytes, stored SHA-256 verified, staging copies byte-identical. All fifteen v001 production hashes remain unchanged. Bird is 55048 bytes, SHA-256 `4285d8b2da148389df5915dafeeb19866b1092cc57e99ed5042948438b47a493`. Dog is 52348 bytes, SHA-256 `0399616cb5addea4c41bfa82977c87efafdeb272da781ee162ee33f5a0935d56`.

Manifest: `_작업/codex/ux-studio/album-icon-corrections.json`. Production/staging basenames are `common_album-green-yellow-bird_icon_normal_v002.webp` and `common_album-yellow-dog_icon_normal_v002.webp` in their existing album-icons directories. Full master dimensions, source crop boxes and output alpha statistics are in the manifest.

Limit: the source reveals only the tops of these two illustrations. Lower body, complete pose, bird background spires and dog collar are artistic proposals; species and observed colors are corrected. No exact source-copy or UI pixel-fidelity claim is made. Root owns UI replacement and actual screen checks. No v001 overwrite/deletion, product UI, common docs, STATUS, server, package installation or CLI network access occurred.
