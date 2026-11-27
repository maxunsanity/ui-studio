/**
 * Opens read-only common or selected-project guides without accessing editor state.
 */
export async function openManual({ workspaceId = null } = {}) {
    const opener = document.activeElement;
    const dialog = document.createElement('dialog');
    dialog.className = 'ux-studio-manual';
    const titleId = 'ux-manual-' + crypto.randomUUID();
    dialog.setAttribute('aria-labelledby', titleId);

    const style = document.createElement('style');
    style.textContent = `
.ux-studio-manual{width:min(960px,calc(100vw - 32px));height:min(820px,calc(100dvh - 32px));max-width:none;max-height:none;box-sizing:border-box;border:1px solid #bcc9c6;border-radius:14px;padding:0;color:#253330;background:#fbfdfc;font:14px/1.65 -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo",sans-serif}
.ux-studio-manual::backdrop{background:#172a2a88}
.ux-studio-manual[open]{display:flex;flex-direction:column}
.ux-studio-manual header{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 20px;border-bottom:1px solid #dce5e1;flex:none}
.ux-studio-manual h2{font-size:19px;margin:0}
.ux-studio-manual button,.ux-studio-manual select{font:inherit;color:inherit;background:white;border:1px solid #afc0b9;border-radius:6px;padding:7px 10px;max-width:100%;min-width:0}
.ux-studio-manual button{cursor:pointer}
.ux-studio-manual button:focus-visible,.ux-studio-manual select:focus-visible{outline:3px solid #4b9987;outline-offset:2px}
.ux-studio-manual .manual-controls{display:flex;gap:12px;flex-wrap:wrap;align-items:end;padding:12px 20px 4px;flex:none}
.ux-studio-manual label{display:flex;flex-direction:column;gap:4px;min-width:0}
.ux-studio-manual .manual-section{flex:1;min-width:150px}
.ux-studio-manual .manual-status{padding:6px 20px;margin:0;font-size:12px;color:#4e625a;overflow-wrap:anywhere;flex:none}
.ux-studio-manual .manual-content{box-sizing:border-box;min-height:0;margin:0;padding:20px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;word-break:normal;font:inherit;border-top:1px solid #dce5e1;flex:1;tab-size:2}
@media(max-width:520px){.ux-studio-manual{width:calc(100vw - 16px);height:calc(100dvh - 16px)}.ux-studio-manual header,.ux-studio-manual .manual-controls{padding-left:12px;padding-right:12px}.ux-studio-manual .manual-content{padding:12px}.ux-studio-manual .manual-status{padding-left:12px;padding-right:12px}.ux-studio-manual h2{font-size:17px}}
`;
    const make = (tag, text) => {
        const node = document.createElement(tag);
        if (text !== undefined) node.textContent = text;
        return node;
    };
    const header = make('header');
    const heading = make('h2', 'UI 스튜디오 가이드');
    heading.id = titleId;
    const close = make('button', '닫기');
    close.type = 'button';
    close.setAttribute('aria-label', '가이드 닫기');
    header.append(heading, close);

    const controls = make('div');
    controls.className = 'manual-controls';
    const sourceLabel = make('label', '안내 위치');
    const source = make('select');
    source.setAttribute('aria-label', '안내 위치');
    const commonOption = make('option', '공통 안내 · 정본');
    commonOption.value = 'common';
    source.append(commonOption);
    if (workspaceId !== null) {
        const projectOption = make('option', '선택 프로젝트 안내 · 사본');
        projectOption.value = 'project';
        source.append(projectOption);
    }
    sourceLabel.append(source);
    const sectionLabel = make('label', '문서');
    sectionLabel.className = 'manual-section';
    const section = make('select');
    section.setAttribute('aria-label', '가이드 문서');
    sectionLabel.append(section);
    const retry = make('button', '다시 읽기');
    retry.type = 'button';
    const visualGuide = make('a', '화면·게이지·검수 자료 보기');
    visualGuide.href = '/ui-studio/source/guide/reference/kpop-planning/common-ui-finish/index.html';
    visualGuide.target = '_blank';
    visualGuide.rel = 'noopener';
    visualGuide.hidden = true;
    controls.append(sourceLabel, sectionLabel, retry, visualGuide);
    const status = make('p');
    status.className = 'manual-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    const content = make('pre', '설명서를 읽는 중입니다…');
    content.className = 'manual-content';
    content.tabIndex = 0;
    content.setAttribute('aria-label', '가이드 내용');
    dialog.append(style, header, controls, status, content);

    const controller = new AbortController();
    let closed = false;
    let requestId = 0;
    let index = null;
    const sourceName = () => source.value === 'project' ? '프로젝트 사본' : '공통 정본';
    const current = id => !closed && id === requestId;
    async function readText(file, scope) {
        const url = scope === 'project'
            ? '/api/ux-studio/workspace-guide?' + new URLSearchParams({
                workspace: String(workspaceId), file: 'guide/' + file
            })
            : '/ui-studio/source/guide/' + encodeURIComponent(file);
        const response = await fetch(url, {cache: 'no-store', signal: controller.signal});
        if (!response.ok) throw Error('문서를 읽지 못했습니다 (HTTP ' + response.status + ').');
        if (scope === 'project') {
            const body = await response.json();
            if (typeof body.text !== 'string') throw Error('프로젝트 안내 응답의 문서 내용이 없습니다.');
            return body.text;
        }
        return response.text();
    }
    async function loadDocument() {
        const selected = index?.sections.find(item => item.file === section.value);
        if (!selected) return;
        const attempt = ++requestId;
        const scope = source.value;
        visualGuide.hidden = !(scope === 'common' && selected.id.startsWith('kpop-ui-finish-'));
        status.textContent = sourceName() + ' · ' + index.version + ' · 읽는 중…';
        content.textContent = '설명서를 읽는 중입니다…';
        content.scrollTop = 0;
        try {
            const text = await readText(selected.file, scope);
            if (!current(attempt)) return;
            content.textContent = text;
            status.textContent = sourceName() + ' · ' + index.version + ' · ' + selected.title +
                (scope === 'project' ? ' · 기존 프로젝트 사본은 자동 갱신하지 않습니다.' : '');
        } catch (error) {
            if (!current(attempt)) return;
            status.textContent = sourceName() + ' · 읽기 실패';
            content.textContent = error.message + '\n다시 읽기, 다른 문서 또는 공통 안내를 선택할 수 있습니다.';
        }
    }
    async function loadIndex() {
        const previous = section.value;
        const attempt = ++requestId;
        const scope = source.value;
        index = null;
        visualGuide.hidden = true;
        section.replaceChildren();
        status.textContent = sourceName() + ' · 목차 읽는 중…';
        content.textContent = '설명서 목차를 읽는 중입니다…';
        try {
            const parsed = JSON.parse(await readText('index.json', scope));
            if (!current(attempt)) return;
            if (!parsed || typeof parsed.version !== 'string' || !Array.isArray(parsed.sections) ||
                !parsed.sections.length || parsed.sections.some(item =>
                    !item || typeof item.id !== 'string' || typeof item.title !== 'string' ||
                    !/^[A-Z][A-Z0-9_]*\.md$/.test(item.file)))
                throw Error('설명서 목차 형식이 올바르지 않습니다.');
            index = parsed;
            for (const item of index.sections) {
                const option = make('option', item.title);
                option.value = item.file;
                section.append(option);
            }
            if (parsed.sections.some(item => item.file === previous)) section.value = previous;
            await loadDocument();
        } catch (error) {
            if (!current(attempt)) return;
            status.textContent = sourceName() + ' · 목차 읽기 실패';
            content.textContent = error.message + '\n다시 읽기 또는 다른 안내 위치를 선택하세요. 닫기도 사용할 수 있습니다.';
        }
    }
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('cancel', event => {
        event.preventDefault();
        dialog.close();
    });
    dialog.addEventListener('keydown', event => {
        event.stopPropagation();
        if (event.key === 'Escape') {
            event.preventDefault();
            dialog.close();
        }
    });
    dialog.addEventListener('close', () => {
        closed = true;
        controller.abort();
        dialog.remove();
        if (opener?.isConnected && typeof opener.focus === 'function') opener.focus();
    }, {once: true});
    source.addEventListener('change', () => { void loadIndex(); });
    section.addEventListener('change', () => { void loadDocument(); });
    retry.addEventListener('click', () => { void (index ? loadDocument() : loadIndex()); });
    document.body.append(dialog);
    dialog.showModal();
    close.focus();
    await loadIndex();
    return dialog;
}
