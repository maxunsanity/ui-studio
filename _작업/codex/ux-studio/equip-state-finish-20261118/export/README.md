# Native JSON export size — scratch proposal

작성: codex · 2026-11-18T08:52:28+09:00 · 제안(검수 대기). 공유 source/HMR/model/브라우저/실제 다운로드 파일 변경 없음.

## Finding and minimal patch

- main.mjs:355–364 download(name,value,type='application/json') keeps strings verbatim and serializes objects with JSON.stringify(value,null,2). The third argument already means MIME; export-plan uses it for text/markdown;charset=utf-8. A third boolean compact argument would collide with that existing contract.
- Native case export at 1613–1615 currently passes the object, so pretty bytes can exceed the model.mjs:13–17 official 2,000,000-byte import limit even when compact data fits.
- Other current call sites are context (1617), export-plan (1623), export-handoff (1626), export-scenario (1629). They keep existing formatting. No separate storyboard download call was found in this main source.
- Candidate changes one line, main.mjs:1614: download(doc.projectId + '.json', JSON.stringify(doc));
- download helper, MIME, limits, imports and packages remain unchanged. The existing string branch already provides everything native compact JSON export needs.
- Final newline is deliberately omitted. A compact document of exactly 2,000,000 bytes is valid through readDesignFile, but adding a newline makes its exported file 2,000,001 bytes and invalid. This was reproduced as a failing candidate test before removing the newline.

## Evidence

- red.log: original snapshot, 6 tests, 3 pass / 3 expected failures because native export Blobs exceed the official import limit. Exit 1.
- newline-boundary-red.log: intermediate compact+newline candidate, 5 pass / 1 fail at exactly 2MB data. Exit 1.
- green.log: final compact-without-newline candidate, 6/6 pass. Exit 0.
- syntax.log: node --check modified-main.mjs, exit 0.
- Shared main source still matches original-main.mjs at final check.

The tests execute the actual extracted native command branch and actual download helper. A lightweight VM stub captures their real Blob and anchor/url operations. That Blob is imported using the real readDesignFile and complete validateDocument, with deep equality checking the loaded document and original object. The valid document fixtures are reused from tests/ux-studio/save-size.test.mjs without executing its file-writing tests. The exercised sizes include compact below 2MB / pretty over 2MB, 1,999,999 compact bytes, and exactly 2,000,000 compact bytes. Existing generic JSON, real export-plan/AI handoff/scenario branches, filename, MIME, URL revoke, click count and no mutation are checked. Expectations for generic pretty outputs are literal fixture text; the test does not replace the production serializer with its own.

## Re-run from repository root

```sh
MAIN_SOURCE="$PWD/_작업/codex/ux-studio/equip-state-finish-20261118/export/original-main.mjs" node --test _작업/codex/ux-studio/equip-state-finish-20261118/export/native-export-size.test.mjs
MAIN_SOURCE="$PWD/_작업/codex/ux-studio/equip-state-finish-20261118/export/modified-main.mjs" node --test _작업/codex/ux-studio/equip-state-finish-20261118/export/native-export-size.test.mjs
```

Potential product test destination after root authorization: tests/ux-studio/native-export-size.test.mjs. The test defaults its root to process.cwd() and MAIN_SOURCE to the shared main module; no product test file was created.

## Limits and handoff

No native browser download UI, disk download, actual design/Capy file, or screenshot was inspected or changed. VM fixtures cover the handler, byte serialization, Blob contract and official importer, not native save-dialog behavior. The full suite was not rerun for this one-line scratch export candidate; this assignment permits writes only under export/, while the repository suite creates temporary files elsewhere. Root retains backup, second dirty check, integration and broader checks.
