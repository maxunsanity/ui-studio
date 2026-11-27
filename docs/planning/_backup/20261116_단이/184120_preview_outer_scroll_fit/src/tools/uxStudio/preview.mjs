import {projectContext} from './project-context.mjs';
import { scopeURL } from './project-manager.mjs';
import './styles.css';
import { mountDesignConsumer } from './consumer.mjs';
const workspaceId = new URL(location.href).searchParams.get('workspace') || null;
const id = new URL(location.href).searchParams.get('project'), status = document.querySelector('#consumer-status'), host = document.querySelector('#consumer-phone');
let consumer, loading = false, requestedRevision = 0, channel, dirtyRequest = false, folderProject;
async function load() {
    if (loading) {
        dirtyRequest = true;
        return;
    }
    loading = true;
    try {
        if (!/^[a-z][a-z0-9-]{0,47}$/.test(id || ''))
            throw Error('설계 ID를 확인하세요.');
        const response = await fetch(scopeURL('/api/ux-studio/project?id=' + encodeURIComponent(id), workspaceId), {
            cache: 'no-store'
        });
        if (!response.ok)
            throw Error('저장한 설계를 읽지 못했습니다.');
        const { document: d } = await response.json();
        if(workspaceId&&!folderProject){const meta=await fetch(scopeURL('/api/ux-studio/workspace',workspaceId),{cache:'no-store'});if(!meta.ok)throw Error('프로젝트 폴더 정보를 읽지 못했습니다.');folderProject=(await meta.json()).workspace;}
        const context=projectContext({workspaceId,workspace:folderProject,document:d});
        document.querySelector('#preview-project').textContent=context.label+' · '+context.name+' · '+context.directory;
        if (consumer)
            consumer.updateDesign(d);
        else
            consumer = mountDesignConsumer(host, d, {
                workspaceId,
                onAction: e => {
                    document.querySelector('#action-output').textContent = e.type === 'control-change' ? e.element + ' · 값 ' + String(e.value) + (e.valid ? '' : ' · ' + e.message) : e.moduleId + ' · 연결 요청 수신 (게임 실행 없음)';
                }
            });
        const size = d.screens.find(screen => screen.id === d.entryScreen)?.logicalSize || d.designBasis?.logicalSize || {w:390,h:844};
        host.style.width = (size.w ?? size.width ?? 390) + 'px';
        host.style.height = (size.h ?? size.height ?? 844) + 'px';
        fit();
        status.textContent = d.name + ' · r' + d.revision + ' · 공통 UI 설계 반영됨';
        requestedRevision = Math.max(requestedRevision, d.revision);
    }
    catch (e) {
        status.textContent = e.message;
    }
    finally {
        loading = false;
        if (dirtyRequest) {
            dirtyRequest = false;
            load();
        }
    }
}
document.querySelector('#refresh-design').onclick = load;
if ('BroadcastChannel' in window) {
    channel = new BroadcastChannel('ux-studio-design');
    channel.onmessage = e => {
        if (e.data?.type === 'design.saved' && (e.data.workspace || null) === workspaceId && e.data.projectId === id && Number.isSafeInteger(e.data.revision) && e.data.revision > requestedRevision) {
            requestedRevision = e.data.revision;
            load();
        }
    };
}
window.addEventListener('pagehide', () => {
    channel?.close();
    consumer?.dispose();
}, {
    once: true
});
load();
function fit() {
    const width = parseFloat(host.style.width) || 390, height = parseFloat(host.style.height) || 844, scale = Math.min(1, (document.documentElement.clientWidth - 36) / width), stage = document.querySelector('#consumer-stage');
    host.style.transform = 'scale(' + scale + ')';
    stage.style.width = width * scale + 'px';
    stage.style.height = height * scale + 'px';
}
window.addEventListener('resize', fit);
