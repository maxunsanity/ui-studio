import {scopeURL} from './project-manager.mjs';
import {normalizePresentationMode} from './presentation.mjs';

import {STUDIO_DIRECTORY,workspaceKind} from './workspace-kind.mjs';
export {STUDIO_DIRECTORY};

export function projectContext({workspaceId = null, workspace = null, document, dirty = false, toolDirectory = STUDIO_DIRECTORY}) {
 if (workspaceId && (!workspace || workspace.id !== workspaceId)) throw Error('선택 프로젝트 폴더 정보를 확인하지 못했습니다.');
 const directory = workspace?.directory || toolDirectory + '/_작업/codex/ux-studio/projects';
 const kind = !workspaceId ? 'common' : workspaceKind(directory,toolDirectory);
 return {kind,name:workspace?.name || '공용 저장공간',directory,storageDirectory:workspaceId ? directory+'/ui-studio' : directory,toolDirectory,
  label:{common:'공용 저장공간',sample:'검증용 샘플',fixture:'저장 시험 폴더',project:'내 작업'}[kind],
  design:document ? `${document.name} · r${document.revision}${dirty ? ' · 미저장 수정' : ' · 저장됨'}` : '설계 읽는 중…'};
}

export function designURL(view, {workspaceId = null, projectId, screenId, elementId, presentationMode}) {
 const paths = {detail:'/ui-studio/?editor=detail',canvas:'/ui-studio/canvas.html',preview:'/ui-studio/preview.html',sample:'/ui-studio/source/sample-preview.html'};
 if (!Object.hasOwn(paths,view)) throw Error('알 수 없는 편집 화면입니다.');
 const url = new URL(paths[view],'http://127.0.0.1');
 if (projectId) url.searchParams.set('project',projectId);
 if (screenId) url.searchParams.set('screen',screenId);
 if (elementId) url.searchParams.set('element',elementId);
 if (presentationMode !== undefined) url.searchParams.set('view',normalizePresentationMode(presentationMode));
 return scopeURL(url.pathname+url.search,workspaceId);
}

// A saved local stage is not a server design: the caller compares its disk fingerprint.
export async function navigateDesign({dirty, destination, choose, save, navigate}) {
 let target = {...destination};
 if (dirty) {
  const choice = await choose();
  if (choice === 'save') {
   const saved = await save();
   if (!saved?.projectId) return false;
   target.projectId = saved.projectId;
  } else if (choice !== 'discard') return false;
 }
 navigate(designURL(target.view,target));
 return true;
}

export function chooseDesignNavigation() {
 return new Promise(resolve => {
  const previous = document.activeElement, dialog = document.createElement('dialog');
  dialog.className = 'canvas-choice';
  dialog.setAttribute('aria-label','저장하지 않은 캔버스 수정');
  dialog.innerHTML = '<h2>캔버스 수정 내용을 어떻게 할까요?</h2><p>상세 편집기는 파일에 저장한 설계를 엽니다. 단계 저장은 이 브라우저 안의 별도 보관입니다.</p><div><button value="save">사본 저장 후 이동</button><button value="discard">수정 버리고 이동</button><button value="cancel">계속 편집</button></div>';
  let choice = 'cancel';
  for (const button of dialog.querySelectorAll('button')) button.onclick = () => {choice = button.value;dialog.close();};
  dialog.addEventListener('close',()=>{dialog.remove();previous?.focus();resolve(choice);},{once:true});
  dialog.addEventListener('keydown',event=>event.stopPropagation());
  document.body.append(dialog);dialog.showModal();dialog.querySelector('[value="cancel"]').focus();
 });
}
