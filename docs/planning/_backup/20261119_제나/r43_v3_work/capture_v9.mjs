import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '/Users/max/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const WS = 'workspace-cfa517bd-d9e1-40c4-aa1f-576e182500ba';
const PROJECT = 'ux-31671dd8';
const OUT = '/Users/max/projest_max/ui-studio/docs/planning/_backup/20261119_제나/r49_shots';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = 'http://127.0.0.1:7018';

const FLYOUTS = {
  album: { name: 'Menu_AlbumFestival', x: 90, y: 138, w: 210, h: 84 },
  shield: { name: 'Menu_ShieldMons', x: 234, y: 400, w: 150, h: 84 },
  info: { name: 'Menu_Info', x: 244, y: 650, w: 140, h: 126 },
  settings: { name: 'Menu_Settings', x: 244, y: 49, w: 140, h: 108 }
};

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
  document.body.innerHTML = '<div id="cap-root" style="margin:0;padding:0;background:#fff;position:relative;"></div>';
  const root = document.getElementById('cap-root');
  window.__cap = { design, mountSampleScreen, canvasDevicePreview, clone, validateDocument, renderPresentation, sampleSize, root };
  return {
    revision: design.revision,
    modalId: design.screens.find(s => s.name === 'Modal_CharacterInfo')?.id
  };
}, { BASE, WS, PROJECT });

console.log('loaded', JSON.stringify(results));

async function renderShot({ profile, view, openFlyout, screenId }) {
  await page.evaluate(async ({ profile, view, openFlyout, screenId, FLYOUTS }) => {
    const { design, mountSampleScreen, canvasDevicePreview, clone, sampleSize, root } = window.__cap;
    const shown = clone(design);
    const target = shown.screens.find(s => s.id === (screenId || 'main'));
    if (openFlyout && target.id === 'main') {
      const spec = FLYOUTS[openFlyout];
      const wrap = target.elements.find(e => e.name === spec.name);
      if (!wrap) throw new Error('missing flyout ' + spec.name);
      wrap.x = spec.x / 390 * 100;
      wrap.y = spec.y / 844 * 100;
      wrap.w = spec.w / 390 * 100;
      wrap.h = spec.h / 844 * 100;
    }
    const p = canvasDevicePreview(target, { profile });
    target.logicalSize = { w: Math.round(p.logical.w), h: Math.round(p.logical.h) };
    root.replaceChildren();
    const host = document.createElement('div');
    host.id = 'cap-host';
    host.style.cssText = 'position:relative;margin:0;padding:0;overflow:hidden;background:#fff;';
    root.append(host);
    mountSampleScreen(host, shown, {
      screenId: screenId || 'main',
      workspaceId: 'workspace-cfa517bd-d9e1-40c4-aa1f-576e182500ba',
      presentationMode: view
    });
    const board = host.querySelector('.sample-screen, .preview-screen, [data-screen]') || host.firstElementChild;
    const size = sampleSize(shown, shown.screens.find(s => s.id === (screenId || 'main')));
    const scale = p.device.w / p.reference.w;
    if (board) board.style.transformOrigin = 'top left';
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
    window.__cap.last = { host, board, size, device: p.device };
  }, { profile, view, openFlyout, screenId, FLYOUTS });
  await page.waitForTimeout(200);
  const loc = page.locator('#cap-host');
  await loc.waitFor({ state: 'visible' });
  return await loc.screenshot({ type: 'png' });
}

const shots = [];
async function save(name, buf) {
  const path = `${OUT}/${name}`;
  await writeFile(path, buf);
  shots.push({ name, bytes: buf.length });
  console.log('wrote', name, buf.length);
}

for (const [profile, tag] of [['phone', '390'], ['short', '360']]) {
  for (const view of ['wireframe', 'detailed-wireframe']) {
    const label = view === 'wireframe' ? 'wire' : 'detail';
    const buf = await renderShot({ profile, view, openFlyout: null, screenId: 'main' });
    await save(`r49_${tag}_${label}.png`, buf);
  }
}

for (const tag of ['album', 'shield', 'info', 'settings']) {
  for (const view of ['wireframe', 'detailed-wireframe']) {
    const label = view === 'wireframe' ? 'wire' : 'detail';
    const buf = await renderShot({ profile: 'phone', view, openFlyout: tag, screenId: 'main' });
    await save(`r49_390_${label}_open_${tag}.png`, buf);
  }
}

for (const view of ['wireframe', 'detailed-wireframe']) {
  const label = view === 'wireframe' ? 'wire' : 'detail';
  const buf = await renderShot({ profile: 'phone', view, openFlyout: null, screenId: results.modalId });
  await save(`r49_390_${label}_modal_character.png`, buf);
}

await browser.close();
console.log(JSON.stringify({ ok: true, out: OUT, revision: results.revision, shots }, null, 2));
