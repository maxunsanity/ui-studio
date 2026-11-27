import {planningPreviewTarget,readPlanningIndex} from './planning-panel.mjs';
import {projectContext} from './project-context.mjs';
import {normalizePresentationMode} from './presentation.mjs';
import { scopeURL } from './project-manager.mjs';
import './styles.css';
import { mountDesignConsumer } from './consumer.mjs';
const params = new URL(location.href).searchParams;
const workspaceId = params.get('workspace') || null;
const id = params.get('project'), status = document.querySelector('#consumer-status'), host = document.querySelector('#consumer-phone');
let consumer, loading = false, requestedRevision = 0, channel, dirtyRequest = false, folderProject, previewPage = null;
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
        const startScreen = params.get('screen');
        const backModule = params.get('back');
        if (workspaceId && startScreen && d.screens.some(screen => screen.id===startScreen && screen.kind==='page')) {
            d.entryScreen = startScreen;
            if (backModule && planningPreviewTarget(await readPlanningIndex(),{workspaceId,projectId:id,moduleId:backModule})) {
                const back = d.transitions.find(t => t.fromScreen===startScreen && t.action==='back');
                if(back) Object.assign(back,{action:'module',payload:{moduleId:backModule,label:'이전 화면'}});
            }
        }
        if(workspaceId&&!folderProject){const meta=await fetch(scopeURL('/api/ux-studio/workspace',workspaceId),{cache:'no-store'});if(!meta.ok)throw Error('프로젝트 폴더 정보를 읽지 못했습니다.');folderProject=(await meta.json()).workspace;}
        const context=projectContext({workspaceId,workspace:folderProject,document:d});
        document.querySelector('#preview-project').textContent=context.label+' · '+context.name+' · '+context.directory;
        if (consumer)
            consumer.updateDesign(d);
        else
            consumer = mountDesignConsumer(host, d, {
                simulatePurchases: true,
                presentationMode: normalizePresentationMode('ui', workspaceId),
                workspaceId,
                onAction: async e => {
                    if (workspaceId && e.type === 'ui.action' && e.action === 'module.open') {
                        const target = planningPreviewTarget(await readPlanningIndex(), {workspaceId, projectId:id, moduleId:e.moduleId, elementId:e.elementId});
                        if (target) {
                            const url = new URL(location.href);
                            url.search = new URLSearchParams({workspace:workspaceId, project:target.projectId}).toString();
                            if(target.screenId)url.searchParams.set('screen',target.screenId);
                            if(target.backModule)url.searchParams.set('back',target.backModule);
                            location.assign(url.href);
                            return;
                        }
                    }
                    document.querySelector('#action-output').textContent = e.type === 'control-change' ? e.element + ' · 값 ' + String(e.value) + (e.valid ? '' : ' · ' + e.message) : e.moduleId + ' · 연결 요청 수신 (게임 실행 없음)';
                    fit();
                }
            });
        const size = d.screens.find(screen => screen.id === d.entryScreen)?.logicalSize || d.designBasis?.logicalSize || {w:390,h:844};
        host.style.width = (size.w ?? size.width ?? 390) + 'px';
        host.style.height = (size.h ?? size.height ?? 844) + 'px';
        status.textContent = d.name + ' · r' + d.revision + ' · 공통 UI 설계 반영됨';
        fit();syncPreviewPage();
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
    pageObserver?.disconnect();
    consumer?.dispose();
}, {
    once: true
});
load();
function fit() {
    const width = parseFloat(host.style.width) || 390, height = parseFloat(host.style.height) || 844, stage = document.querySelector('#consumer-stage'), viewport = document.documentElement;
    let heightScale=1;
    if(Number.isFinite(viewport.clientHeight)&&viewport.clientHeight>0){
        const rect=stage.getBoundingClientRect(),footer=document.querySelector('#action-output'),footerRect=footer.getBoundingClientRect(),px=value=>parseFloat(value)||0;
        const bottom=Math.max(0,footerRect.bottom-rect.bottom)+px(window.getComputedStyle(footer).marginBottom)+px(window.getComputedStyle(document.body).paddingBottom);
        const available=viewport.clientHeight-(rect.top+(window.scrollY||0))-bottom;
        heightScale=Math.max(1,available)/height;
    }
    const scale=Math.max(.001,Math.min(1,(viewport.clientWidth-36)/width,heightScale));
    host.style.transform = 'scale(' + scale + ')';
    stage.style.width = width * scale + 'px';
    stage.style.height = height * scale + 'px';
}
window.addEventListener('resize', fit);
function syncPreviewPage(){
    if(!consumer)return;
    const page=consumer.getState().page;
    if(previewPage!==null&&page!==previewPage)window.scrollTo({left:0,top:0,behavior:'instant'});
    previewPage=page;
}
// Observe the public page state after the consumer paints; overlay/list updates keep outer scroll.
const pageObserver=typeof MutationObserver==='function'?new MutationObserver(syncPreviewPage):null;
pageObserver?.observe(host,{childList:true,subtree:true,attributes:true,attributeFilter:['data-screen']});
