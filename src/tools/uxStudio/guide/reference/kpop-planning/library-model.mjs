const shelves = {concept:'기획',screen:'화면',history:'이력',updates:'수정',drawer:'참고'};
const status = {live:'현행',lock:'잠금',locked:'잠금',draft:'초안',backup:'보관',deprecated:'폐기'};
export const availability = {local:'스튜디오 보관',missing:'원본 미확인',reference:'실행·참조'};
export const description = doc => [doc.id,doc.group,shelves[doc.shelf],status[doc.status],doc.availability==='local'?'':availability[doc.availability]].filter(Boolean).join(' · ');
const normalized = value => String(value ?? '').normalize('NFC').toLocaleLowerCase('ko');

export function filterDocuments(documents, {query='',group='',scope='current'}={}) {
  const words = normalized(query).trim().split(/\s+/).filter(Boolean);
  return documents.filter(doc => {
    if (group && doc.group !== group) return false;
    if (scope === 'current' && doc.historical) return false;
    if (scope === 'history' && !doc.historical) return false;
    if (['missing','reference'].includes(scope) && doc.availability !== scope) return false;
    const text = normalized([doc.id,doc.title,doc.group,doc.summary,doc.aliases].join(' '));
    return words.every(word=>text.includes(word));
  });
}

export function resolveReference(raw, from, lookup, assets) {
  if (!raw) return null;
  if (raw.startsWith('#')) return {url:raw,type:'anchor'};
  let url, path;
  try {
    url = new URL(raw, 'http://127.0.0.1:7007/'+from.split('/').map(encodeURIComponent).join('/'));
    path = decodeURIComponent(url.pathname).replace(/^\/+/, '').normalize('NFC');
  } catch { return null; }
  if (!['http:', 'https:'].includes(url.protocol)) return null;
  // Studio guide illustrations use the same validated asset references as the canvas.
  if (path === 'api/ux-studio/asset' && (raw.startsWith('/api/ux-studio/asset?') ||
      ['localhost:7018','127.0.0.1:7018'].includes(url.host))) {
    const params = url.searchParams;
    if (params.size !== 2 || url.hash ||
        !/^workspace-[a-z0-9-]+$/.test(params.get('workspace') || '') ||
        !/^sha256-[a-f0-9]{64}\.(png|jpg|jpeg|webp|gif|avif)$/.test(params.get('ref') || '')) return null;
    return {url:'/api/ux-studio/asset'+url.search,type:'asset'};
  }
  const studio = raw.startsWith('/ui-studio/') ||
    ['localhost:7018','127.0.0.1:7018'].includes(url.host);
  if (studio) {
    if (/^ui-studio\/source\/guide\/reference\/kpop-lobby\/review-2\/hud[0-9]+-[a-z0-9-]+\.png$/.test(path) &&
        !url.search && !url.hash) {
      return {url:'/'+path,type:'asset'};
    }
    if (path==='ui-studio/source/guide/KPOP_WORKFLOW_GUIDE.md' && !url.search) {
      return {url:'/'+path+url.hash,type:'studio'};
    }
    const guideRoot='ui-studio/source/guide/reference/';
    const guides=['kpop-lobby/review-2/index.html','kpop-intro/index.html','kpop-weekly-festival/index.html',
      'kpop-photocard/index.html','kpop-schedule/index.html',
      'kpop-new-flows/audition.html','kpop-new-flows/battle.html','kpop-new-flows/album.html','kpop-new-flows/broadcast.html',
      'kpop-followups/info-followup.html','kpop-rewards/lobby-rewards.html',
      'kpop-relationship/index.html','kpop-relationship/interaction.html','kpop-mission/index.html','kpop-shop/index.html',
      'kpop-mons/index.html','kpop-crew/index.html','kpop-profile/index.html','kpop-profile/information-assets.html','kpop-build/index.html','kpop-defense/index.html','kpop-build/index.html','kpop-build/index.html','kpop-build/index.html','kpop-build/index.html','kpop-build/index.html'];
    if (path.startsWith(guideRoot) && guides.includes(path.slice(guideRoot.length)) && !url.search) {
      return {url:'/'+path+url.hash,type:'studio'};
    }
    const preview=['ui-studio/preview.html','ui-studio/canvas.html','ui-studio/source/sample-preview.html'];
    if (preview.includes(path)) {
      const allowed=['workspace','project','screen','view','layout'];
      if (path==='ui-studio/preview.html') allowed.push('overlay');
      const keys=[...url.searchParams.keys()];
      if (new Set(keys).size!==keys.length || keys.some(key=>!allowed.includes(key)) ||
          !/^workspace-[a-z0-9-]+$/.test(url.searchParams.get('workspace')||'') ||
          !/^[a-z][a-z0-9-]{0,47}$/.test(url.searchParams.get('project')||'') ||
          (url.searchParams.has('overlay') && !/^[a-z0-9-]{1,80}$/.test(url.searchParams.get('overlay')))) return null;
      return {url:'/'+path+url.search+url.hash,type:'studio'};
    }
    return null;
  }
  if (!['localhost:7007','127.0.0.1:7007'].includes(url.host)) return null;
  const id = path.endsWith('planning-docs-tool.html') ? url.searchParams.get('doc') : null;
  const entry = lookup.get(id || path);
  if (entry) return {url:'?doc='+encodeURIComponent(entry.key)+url.hash,type:'paper'};
  if (Object.hasOwn(assets,path)) return {url:'./snapshot/'+assets[path],type:'asset'};
  return null;
}
