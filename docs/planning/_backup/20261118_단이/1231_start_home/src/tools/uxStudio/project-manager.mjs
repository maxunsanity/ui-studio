// Folder project identity is separate from each saved design's projectId.
export function scopeURL(path, workspaceId = null) {
    const url = new URL(path, 'http://127.0.0.1');
    if (workspaceId) {
        if (!/^[a-z][a-z0-9-]{0,63}$/.test(workspaceId)) throw Error('프로젝트 폴더 ID를 확인하세요.');
        url.searchParams.set('workspace', workspaceId);
    }
    return url.pathname + url.search + url.hash;
}
export function scopedKey(key, workspaceId = null) {
    return workspaceId ? key + ':workspace:' + workspaceId : key;
}
export async function allowProjectSwitch({dirty, choose, save, validate = async () => true}) {
    if (!await validate()) return false;
    if (dirty) {
        const choice = await choose();
        if (choice !== 'discard' && (choice !== 'save' || (await save()) !== true)) return false;
    }
    return (await validate()) === true;
}
export function emptyDesign(name, id) {
    return {schemaVersion:1, projectId:id, revision:0, name:name || '새 UI 설계', entryScreen:'main',
        screens:[{id:'main',name:'첫 화면',kind:'page',purpose:'',elements:[]}], transitions:[], fixtures:{items:[],balance:0}};
}
export function projectMenuGroups(workspaces, workspaceId, research = []) {
    const current = workspaces.find(meta => meta.id === workspaceId) || null;
    const other = workspaces.filter(meta => meta.id !== workspaceId);
    const isTool = meta => research.some(entry => entry.directory === meta.directory && entry.kind === 'test');
    return {current, recent: other.filter(meta => !isTool(meta)), tools: other.filter(isTool)};
}
export function projectResearchURL(file) {
    if (typeof file !== 'string' || !/^[a-z0-9][a-z0-9/_-]*\.html$/.test(file) || file.split('/').some(part => !part || part === '.' || part === '..')) return null;
    return '/ui-studio/source/guide/reference/' + file;
}
export async function openProjectManager({workspaceId = null, isDirty, save, navigate, guide, copyToWorkspace = null}) {
    const previous = document.activeElement;
    const dialog = document.createElement('dialog');
    dialog.setAttribute('aria-label', '프로젝트 폴더');
    dialog.className = 'project-folder-dialog';
    dialog.style.cssText = 'width:min(720px,calc(100vw - 40px));max-height:85vh;box-sizing:border-box;padding:22px;border:1px solid #95a6b2;border-radius:14px;background:#f8fafc;color:#21313d;font:16px system-ui;overflow:auto';
    dialog.innerHTML = `<style>
      .project-folder-dialog button,.project-folder-dialog .research-link{font:inherit;padding:9px 13px;margin:0;border:1px solid #a4b7c2;border-radius:8px;background:#fff;color:#21313d;cursor:pointer;text-decoration:none;box-sizing:border-box}
      .project-folder-dialog button:disabled{cursor:default;opacity:.5}
      .project-folder-dialog .primary{background:#206da3;color:#fff;border-color:#206da3}
      .project-folder-dialog .actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
      .project-folder-dialog .project-card{padding:14px;margin:10px 0;border:1px solid #d8e1e7;border-radius:10px;background:#fff;overflow-wrap:anywhere}
      .project-folder-dialog .current-card{border-color:#76a9cc;background:#edf6fc}
      .project-folder-dialog h3{font-size:15px;margin:20px 0 8px;color:#405767}
      .project-folder-dialog .card-title{font-size:17px;margin:0 0 10px;font-weight:700}
      .project-folder-dialog .muted{font-size:13px;color:#536977}
      .project-folder-dialog details{margin-top:12px}
      .project-folder-dialog summary{cursor:pointer;color:#405767;padding:5px 0}
      .project-folder-dialog .folder-path{font-size:12px;margin:8px 0;color:#536977;overflow-wrap:anywhere}
      .project-folder-dialog [data-manage]{border-top:1px solid #d8e1e7;padding-top:12px;margin-top:20px}
      .project-folder-dialog select{font:inherit;color:#21313d;background:#fff;border:1px solid #a4b7c2;border-radius:6px;padding:8px;max-width:100%}
      .project-folder-dialog :is(button,a,summary,select):focus-visible{outline:3px solid #206da3;outline-offset:2px}
    </style><header class="actions"><h2 style="margin:0;flex:1;font-size:20px">프로젝트 폴더</h2><button type="button" data-close>닫기</button></header>
    <p class="muted">프로젝트를 열거나 영상 조사서를 확인하세요.</p>
    <div class="actions"><button type="button" class="primary" data-folder>폴더 찾아 열기</button><button type="button" data-guide>사용 설명서</button></div>
    <p role="status" data-status></p><section data-choice></section>
    <section data-current aria-label="현재 프로젝트"></section><section data-list aria-label="다른 프로젝트"></section>
    <details data-manage><summary>추가 관리</summary><section data-tools aria-label="시험용 프로젝트"></section><div data-copy></div><div class="actions" data-advanced></div></details>`;
    document.body.append(dialog);
    let pendingChoice = null;
    const status = dialog.querySelector('[data-status]'), choiceHost = dialog.querySelector('[data-choice]');
    dialog.addEventListener('close', () => {pendingChoice?.('cancel');dialog.remove();previous?.focus();}, {once:true});
    dialog.querySelector('[data-close]').onclick = () => dialog.close();
    dialog.querySelector('[data-guide]').onclick = () => guide?.();
    const request = async (path, options) => {
        const response = await fetch('/api/ux-studio/' + path, {cache:'no-store', ...options});
        const data = await response.json();
        if (!response.ok) throw Error(data.error || '프로젝트를 열지 못했습니다.');
        return data;
    };
    dialog.addEventListener('keydown', event => event.stopPropagation());
    const choose = (text, choices) => new Promise(resolve => {
        pendingChoice?.('cancel');
        choiceHost.replaceChildren();
        const box = document.createElement('fieldset'), legend = document.createElement('legend');
        legend.textContent = text; box.append(legend);
        pendingChoice = value => {pendingChoice = null;box.remove();resolve(value);};
        for (const [value,label] of choices) {
            const button = document.createElement('button');button.type='button';button.textContent=label;
            button.style.cssText='font:inherit;padding:10px;margin:6px;max-width:100%';
            button.onclick=()=>pendingChoice?.(value);box.append(button);
        }
        choiceHost.append(box);box.querySelector('button')?.focus();
    });
    const decision = async meta => {
        const selected = await choose('기존 UI 변환·연결 여부를 먼저 선택하세요.',
            [['convert','기존 UI 변환·연결 요청'],['independent','변환 안 함 · 독립 UI로 저장'],['cancel','취소']]);
        if (selected === 'cancel') return null;
        return (await request('workspace-decision?workspace=' + encodeURIComponent(meta.id), {
            method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({decision:selected})
        })).workspace;
    };
    const activate = async meta => {
        if (meta?.unavailable) throw Error('이 프로젝트 폴더를 읽을 수 없습니다. 폴더 찾아 열기로 위치를 다시 확인하세요.');
        if (meta?.conversionDecision === 'pending') {meta = await decision(meta);if (!meta) return;}
        if (!await allowProjectSwitch({dirty:isDirty(),save,
            validate: async () => {if (meta?.id) await request('workspace?workspace=' + encodeURIComponent(meta.id));return true;},
            choose:()=>choose('현재 설계에 저장하지 않은 수정이 있습니다.', [['save','저장 후 전환'],['discard','수정 버리고 전환'],['cancel','취소']])})) {
            status.textContent='현재 프로젝트를 유지했습니다.';return;
        }
        if (!dialog.isConnected) return;
        navigate(meta?.id || null);
        dialog.close();
    };
    const copyInto = async meta => {
        if (meta?.unavailable) throw Error('이 프로젝트 폴더를 읽을 수 없습니다. 폴더 찾아 열기로 위치를 다시 확인하세요.');
        if (meta?.conversionDecision === 'pending') {
            const decided = await decision(meta);
            if (!decided) return;
            Object.assign(meta, decided);
        }
        if (!dialog.isConnected) return;
        status.textContent = '현재 설계 사본을 저장하는 중…';
        const copied = await copyToWorkspace(meta.id);
        if (dialog.isConnected) status.textContent = '사본 저장 완료 · ' + copied.projectId + ' · ' + meta.name + ' 열기 버튼으로 프로젝트를 여세요.';
    };
    const refresh = async () => {
        const {workspaces} = await request('workspaces');
        let research = [];
        try {
            const response = await fetch('/ui-studio/source/project-research.json', {cache:'no-store'});
            const data = response.ok ? await response.json() : null;
            if (Array.isArray(data?.projects)) research = data.projects;
        } catch { /* Project opening remains available if the optional research index is missing. */ }
        const groups = projectMenuGroups(workspaces, workspaceId, research);
        const current = dialog.querySelector('[data-current]'), list = dialog.querySelector('[data-list]'), tools = dialog.querySelector('[data-tools]');
        current.replaceChildren(); list.replaceChildren(); tools.replaceChildren();
        const heading = (host, text) => {const h=document.createElement('h3');h.textContent=text;host.append(h);};
        const card = (meta, host, selected = false) => {
            const entry = research.find(item => item.directory === meta.directory);
            const row=document.createElement('article');row.className='project-card'+(selected?' current-card':'');
            const title=document.createElement('p');title.className='card-title';title.textContent=(entry?.title || meta.name)+(selected?' · 현재 프로젝트':'');
            const actions=document.createElement('div');actions.className='actions';
            const button=document.createElement('button');button.type='button';button.textContent=selected?'열려 있음':'열기';button.setAttribute('aria-label',(entry?.title || meta.name)+' 열기');
            button.disabled=selected || !!meta.unavailable;button.onclick=()=>activate(meta).catch(showError);actions.append(button);
            const url=projectResearchURL(entry?.viewer);
            if(url){const link=document.createElement('a');link.className='research-link';link.textContent='조사서 보기 ↗';link.setAttribute('aria-label',(entry.title || meta.name)+' 조사서 보기');link.href=url;link.target='_blank';link.rel='noopener noreferrer';actions.append(link);}
            else {const note=document.createElement('span');note.className='muted';note.textContent=entry?.kind==='test'?'시험용 프로젝트':'등록된 조사서 없음';actions.append(note);}
            const info=document.createElement('details'), summary=document.createElement('summary');summary.textContent='폴더 정보';info.append(summary);
            const path=document.createElement('p');path.className='folder-path';path.textContent=meta.directory;info.append(path);
            const mode=document.createElement('p');mode.className='muted';mode.textContent=meta.unavailable?'폴더를 읽을 수 없음 · 폴더 찾아 열기로 위치 확인':meta.conversionDecision==='independent'?'독립 UI · 기존 게임 수정 안 함':meta.conversionDecision==='convert'?'기존 UI 변환 요청':'변환 여부 선택 전';info.append(mode);
            row.append(title,actions,info);host.append(row);
        };
        if(groups.current){heading(current,'현재 프로젝트');card(groups.current,current,true);}
        if(groups.recent.length){heading(list,'다른 프로젝트');for(const meta of groups.recent)card(meta,list);}
        if(groups.tools.length){heading(tools,'시험용 프로젝트');for(const meta of groups.tools)card(meta,tools);}
        const copyHost=dialog.querySelector('[data-copy]');copyHost.replaceChildren();
        if(copyToWorkspace && workspaces.length){
            heading(copyHost,'설계 사본 저장');
            const label=document.createElement('label');label.textContent='대상 프로젝트 ';
            const select=document.createElement('select');select.setAttribute('aria-label','사본을 넣을 프로젝트');
            for(const meta of workspaces){const option=document.createElement('option');option.value=meta.id;option.textContent=research.find(item=>item.directory===meta.directory)?.title || meta.name;option.disabled=!!meta.unavailable;select.append(option);}
            const first=workspaces.find(meta=>!meta.unavailable);if(first)select.value=first.id;
            label.append(select);
            const copy=document.createElement('button');copy.type='button';copy.textContent='현재 설계 사본 넣기';copy.disabled=!first;
            copy.onclick=async()=>{const meta=workspaces.find(item=>item.id===select.value);if(!meta)return;copy.disabled=true;try{await copyInto(meta);}catch(error){showError(error);}finally{copy.disabled=!workspaces.some(item=>!item.unavailable);}};
            const actions=document.createElement('div');actions.className='actions';actions.append(label,copy);copyHost.append(actions);
        }
        const advanced=dialog.querySelector('[data-advanced]');advanced.replaceChildren();advanced.style.marginTop='18px';
        if(groups.current){const change=document.createElement('button');change.type='button';change.textContent='작업 방식 다시 선택';change.onclick=async()=>{try{await decision(groups.current);await refresh();}catch(error){showError(error);}};advanced.append(change);}
        const legacy=document.createElement('button');legacy.type='button';legacy.textContent='기존 공용 저장공간 열기';legacy.onclick=()=>activate(null).catch(showError);advanced.append(legacy);
    };
    const showError = error => {status.textContent=error.message || String(error);};
    dialog.querySelector('[data-folder]').onclick=async event=>{
        const button=event.currentTarget;button.disabled=true;status.textContent='macOS 폴더 선택 창에서 게임 폴더를 고르세요.';
        try {
            const selected=await request('workspace-select',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});
            if (!dialog.isConnected) return;
            if(selected.cancelled){status.textContent='폴더 선택을 취소했습니다.';return;}
            status.textContent='선택한 폴더를 확인했습니다.';
            await activate(selected.workspace);
        } catch(error){showError(error);} finally{button.disabled=false;}
    };
    dialog.showModal();
    try {await refresh();} catch(error){showError(error);}
}
