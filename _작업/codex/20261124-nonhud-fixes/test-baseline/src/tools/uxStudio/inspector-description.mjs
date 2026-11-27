// Read-only description shown at the top of the detail editor's right panel.
// Editing stays in 속성 → 설명·기능; this only displays saved purpose/info (no schema change).
const DEFAULT_UNIT_INFO = '와이어프레임 유닛 · 기능은 연결·조건에서 지정';
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function selectionDescriptionHTML(screen, element) {
    const lines = element
        ? [element.purpose, element.info === DEFAULT_UNIT_INFO ? '' : element.info]
        : [screen?.purpose];
    const text = lines.map(v => String(v ?? '').trim()).filter(Boolean);
    const label = element ? '부품 설명' : '화면 설명';
    const body = text.length
        ? text.map(v => `<p>${esc(v).replace(/\n/g, '<br>')}</p>`).join('')
        : '<p class="subtle">아직 설명이 없습니다. 속성 → 설명·기능에서 적습니다.</p>';
    return `<section class="inspector-description" aria-label="${label}"><small>${label}</small>${body}</section>`;
}
