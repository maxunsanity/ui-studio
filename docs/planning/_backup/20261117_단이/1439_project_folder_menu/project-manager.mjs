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
export async function openProjectManager({workspaceId = null, isDirty, save, navigate, guide, copyToWorkspace = null}) {
    const previous = document.activeElement;
    const dialog = document.createElement('dialog');
    dialog.setAttribute('aria-label', '프로젝트 폴더');
    dialog.style.cssText = 'width:min(720px,calc(100vw - 40px));max-height:85vh;box-sizing:border-box;padding:22px;border:1px solid #95a6b2;border-radius:14px;background:#f8fafc;color:#21313d;font:16px system-ui;overflow:auto';
    dialog.innerHTML = '<header style="display:flex;align-items:center;gap:12px;flex-wrap:wrap"><h2 style="margin:0;flex:1">프로젝트 폴더</h2><button type="button" data-close>닫기</button></header><p>샘플·게임 프로젝트 폴더를 선택하세요. 툴 소스 폴더와 구분하며, 선택 폴더 안의 ui-studio에 설계·자원·설명서를 보관합니다.</p><button type="button" data-folder>폴더 찾아 열기</button> <button type="button" data-guide>사용 설명서</button><p role="status" data-status></p><section data-choice></section><section data-list aria-label="최근 프로젝트"></section>';
    for (const button of dialog.querySelectorAll('button')) button.style.cssText = 'font:inherit;padding:9px 13px;margin:4px;border:1px solid #a4b7c2;border-radius:7px;background:white;color:#21313d;cursor:pointer';
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
        const list = dialog.querySelector('[data-list]');list.replaceChildren();
        const legacy = document.createElement('button');legacy.type='button';legacy.textContent='기존 공용 저장공간 열기';legacy.onclick=()=>activate(null).catch(showError);list.append(legacy);
        for (const meta of workspaces) {
            const row=document.createElement('div');row.style.cssText='padding:12px 0;border-bottom:1px solid #d8e1e7;overflow-wrap:anywhere';
            const button=document.createElement('button');button.type='button';button.textContent=meta.name + (meta.id === workspaceId ? ' · 현재 프로젝트' : ' 열기');
            button.disabled=!!meta.unavailable;button.onclick=()=>activate(meta).catch(showError);
            const path=document.createElement('p');path.textContent=meta.directory;path.style.cssText='font-size:13px;margin:6px 0';
            const mode=document.createElement('p');mode.textContent=meta.unavailable?'폴더를 읽을 수 없음 · 폴더 찾아 열기로 위치 확인':meta.conversionDecision==='independent'?'독립 UI · 기존 게임 수정 안 함':meta.conversionDecision==='convert'?'기존 UI 변환 요청 · 실제 진행은 연결 명세 확인':'변환 여부 선택 전';
            row.append(button,path,mode);
            if (copyToWorkspace) {
                const copy = document.createElement('button');copy.type='button';copy.textContent='현재 설계 사본 넣기';copy.disabled=!!meta.unavailable;
                copy.onclick=async()=>{copy.disabled=true;try{await copyInto(meta);}catch(error){showError(error);}finally{copy.disabled=!!meta.unavailable;}};
                row.append(copy);
            }
            if(meta.id===workspaceId){const change=document.createElement('button');change.type='button';change.textContent='작업 방식 다시 선택';change.onclick=async()=>{try{await decision(meta);await refresh();}catch(error){showError(error);}};row.append(change);}
            list.append(row);
        }
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
