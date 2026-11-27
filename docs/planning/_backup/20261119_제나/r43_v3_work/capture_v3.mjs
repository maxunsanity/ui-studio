import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '/Users/max/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const WS = 'workspace-cfa517bd-d9e1-40c4-aa1f-576e182500ba';
const PROJECT = 'ux-31671dd8';
const OUT = '/Users/max/projest_max/ui-studio/docs/planning/_backup/20261119_제나/r44_shots';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = 'http://127.0.0.1:7018';

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ deviceScaleFactor: 3, viewport: { width: 1400, height: 1100 } });
await page.goto(`${BASE}/ui-studio/source/sample-preview.html?workspace=${WS}&project=${PROJECT}&screen=main&view=wireframe`, { waitUntil: 'networkidle' });
await page.waitForSelector('#sample-board .sample-screen, #sample-board .preview-screen, #sample-board [data-screen], #sample-board > *', { timeout: 20000 });
await page.waitForTimeout(500);

const results = await page.evaluate(async ({ BASE, WS, PROJECT }) => {
  const { mountSampleScreen, sampleSize } = await import('/ui-studio/source/sample-preview.mjs');
  const { canvasDevicePreview } = await import('/ui-studio/source/canvas-device-preview.mjs');
  const { clone, validateDocument } = await import('/ui-studio/source/model.mjs');
  const { renderPresentation } = await import('/ui-studio/source/presentation.mjs');

  const res = await fetch(`${BASE}/api/ux-studio/project?id=${PROJECT}&workspace=${WS}`, { cache: 'no-store' });
  const { document: design } = await res.json();
  validateDocument(design);
  const ingame = design.screens.find(s => s.id === 'main');
  const byName = (scr, name) => scr.elements.find(e => e.name === name);

  // host for 1:1 shots
  document.body.innerHTML = '<div id="cap-root" style="margin:0;padding:0;background:#fff;position:relative;"></div>';
  const root = document.getElementById('cap-root');

  window.__cap = { design, mountSampleScreen, canvasDevicePreview, clone, validateDocument, renderPresentation, sampleSize, ingame, byName, root };
  return {
    revision: design.revision,
    menus: ['Menu_AlbumFestival', 'Menu_ShieldMons', 'Menu_Info', 'Menu_Settings'].map(n => ({ name: n, id: byName(ingame, n)?.id })),
    modalId: design.screens.find(s => s.name === 'Modal_CharacterInfo')?.id
  };
}, { BASE, WS, PROJECT });

console.log('loaded', JSON.stringify(results, null, 2));

async function renderShot({ profile, view, menuOpen, screenId, width, height }) {
  await page.evaluate(async ({ profile, view, menuOpen, screenId }) => {
    const { design, mountSampleScreen, canvasDevicePreview, clone, sampleSize, root } = window.__cap;
    const shown = clone(design);
    const target = shown.screens.find(s => s.id === (screenId || 'main'));
    const p = canvasDevicePreview(target, { profile });
    target.logicalSize = { w: Math.round(p.logical.w), h: Math.round(p.logical.h) };
    root.replaceChildren();
    const host = document.createElement('div');
    host.id = 'cap-host';
    host.style.cssText = 'position:relative;margin:0;padding:0;overflow:hidden;background:#fff;';
    root.append(host);
    const viewer = mountSampleScreen(host, shown, {
      screenId: screenId || 'main',
      workspaceId: 'workspace-cfa517bd-d9e1-40c4-aa1f-576e182500ba',
      presentationMode: view
    });
    const board = host.querySelector('.sample-screen, .preview-screen, [data-screen]') || host.firstElementChild;
    const size = sampleSize(shown, shown.screens.find(s => s.id === (screenId || 'main')));
    // official short profile: keep design width, scale to device
    const scale = p.device.w / p.reference.w;
    board.style.transformOrigin = 'top left';
    if (profile === 'short') {
      host.style.width = p.device.w + 'px';
      host.style.height = p.device.h + 'px';
      if (board) {
        board.style.width = size.w + 'px';
        board.style.height = size.h + 'px';
        board.style.transform = 'scale(' + scale + ')';
      }
    } else {
      host.style.width = size.w + 'px';
      host.style.height = size.h + 'px';
      if (board) {
        board.style.width = size.w + 'px';
        board.style.height = size.h + 'px';
        board.style.transform = 'none';
      }
    }
    if (menuOpen && board) {
      // remount with menuState by re-calling renderPresentation on the board
      const { renderPresentation } = window.__cap;
      const scr = shown.screens.find(s => s.id === (screenId || 'main'));
      renderPresentation(scr, board, {
        presentationMode: view,
        mode: 'view',
        assetView: 'art',
        workspaceId: 'workspace-cfa517bd-d9e1-40c4-aa1f-576e182500ba',
        transitions: shown.transitions,
        menuState: menuOpen
      });
    }
    window.__cap.last = { host, board, size, scale: profile === 'short' ? scale : 1, device: p.device };
  }, { profile, view, menuOpen, screenId });
  await page.waitForTimeout(200);
  const loc = page.locator('#cap-host');
  await loc.waitFor({ state: 'visible' });
  const buf = await loc.screenshot({ type: 'png' });
  return buf;
}

function crop3x(buf, sx, sy, sw, sh, dw, dh) {
  // we'll crop after writing using a second python step; here just return full
  return buf;
}

const shots = [];
async function save(name, buf) {
  const path = `${OUT}/${name}`;
  await writeFile(path, buf);
  shots.push({ name, bytes: buf.length });
  console.log('wrote', name, buf.length);
}

// Closed lobby frames
for (const [profile, tag, w, h] of [['phone', '390', 390, 844], ['short', '360', 360, 640]]) {
  for (const view of ['wireframe', 'detailed-wireframe']) {
    const label = view === 'wireframe' ? 'wire' : 'detail';
    const buf = await renderShot({ profile, view, menuOpen: null, screenId: 'main', width: w, height: h });
    await save(`r44_${tag}_${label}.png`, buf);
  }
}

// Opened menus at 390 detailed-wireframe (and wire)
const menuIds = Object.fromEntries(results.menus.map(m => [m.name, m.id]));
const opens = [
  ['album', { [menuIds.Menu_AlbumFestival]: true }],
  ['shield', { [menuIds.Menu_ShieldMons]: true }],
  ['info', { [menuIds.Menu_Info]: true }],
  ['settings', { [menuIds.Menu_Settings]: true }]
];
for (const [tag, menuOpen] of opens) {
  for (const view of ['wireframe', 'detailed-wireframe']) {
    const label = view === 'wireframe' ? 'wire' : 'detail';
    const buf = await renderShot({ profile: 'phone', view, menuOpen, screenId: 'main' });
    await save(`r44_390_${label}_open_${tag}.png`, buf);
  }
}

// Character info modal
for (const view of ['wireframe', 'detailed-wireframe']) {
  const label = view === 'wireframe' ? 'wire' : 'detail';
  const buf = await renderShot({ profile: 'phone', view, menuOpen: null, screenId: results.modalId });
  await save(`r44_390_${label}_modal_character.png`, buf);
}

await browser.close();
console.log(JSON.stringify({ ok: true, out: OUT, shots }, null, 2));
