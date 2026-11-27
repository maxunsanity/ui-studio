import {renderMarkdown} from './markdown.mjs';
import {availability,description,filterDocuments,resolveReference} from './library-model.mjs';

const $ = id => document.getElementById(id);
const base = new URL('./',location.href);
const state = new URLSearchParams(location.search);
const studio = new URL('/ui-studio/',location.href);
for (const name of ['workspace','project','screen','view']) {
  if (state.has(name)) studio.searchParams.set(name,state.get(name));
}
$('studio').href = studio.href;
// 11/20 클로드(현중 「ui스튜디오와 기획서 툴 동시에 같은 서류를 볼 수 있게」): ?live=경로 = 케이팝몬스터즈 원본(7007)을 복사본 없이 바로 읽음
const LIVE = 'http://127.0.0.1:7007/';
const reader = $('reader');
const library = $('library');
const paper = $('paper');
function syncPaperHash() {
  const doc = paper.contentDocument;
  if (!doc) return;
  try {
    const id = decodeURIComponent(location.hash.slice(1));
    const target = doc.getElementById(id);
    if (!id || target) doc.location.hash = location.hash;
    target?.scrollIntoView();
  } catch {}
}
window.addEventListener('hashchange',syncPaperHash);
const catalog = await fetch('./snapshot/catalog.json')
  .then(response=>{if(!response.ok) throw new Error(response.status);return response.json();})
  .catch(()=>null);

if (!catalog && state.get('live')) {
  library.hidden=true; reader.hidden=false;
  void openLive(state.get('live'),new Map(),{},new URL('index.html',base));
} else if (!catalog) {
  $('counts').textContent='기획서 묶음을 열 수 없습니다. UI 스튜디오의 기획서 폴더를 확인해 주세요.';
} else {
  start(catalog);
}

function start({documents,assets,createdAt}) {
  const lookup = new Map();
  for (const doc of documents) {
    for (const value of [doc.key,doc.id,doc.path,doc.pairPath].filter(Boolean)) {
      const key = value.normalize('NFC');
      if (!lookup.has(key)) lookup.set(key,doc);
    }
  }
  const localAssets = Object.fromEntries(Object.entries(assets).map(([path,file])=>[path.normalize('NFC'),file]));
  const listURL = new URL('index.html',base);
  for (const name of ['workspace','project','screen','view','q','group','scope']) {
    if (state.has(name)) listURL.searchParams.set(name,state.get(name));
  }
  $('back').href = listURL.href;
  if (state.get('live')) {
    library.hidden=true;
    reader.hidden=false;
    void openLive(state.get('live'),lookup,localAssets,listURL);
    return;
  }
  const requested = state.get('doc');
  if (requested) {
    library.hidden=true;
    reader.hidden=false;
    const entry=lookup.get(requested);
    if (entry) void openEntry(entry,lookup,localAssets,listURL,state.get('format'));
    else notice('기획서를 찾을 수 없습니다.','이 주소에 해당하는 문서를 찾을 수 없습니다.');
    return;
  }
  const group = $('group'), query = $('query'), scope = $('scope');
  const more = $('more');
  for (const value of [...new Set(documents.map(doc=>doc.group).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ko'))) {
    group.add(new Option(value,value));
  }
  group.value=state.get('group') || '';
  query.value=state.get('q') || '';
  scope.value=state.get('scope') || 'current';
  if (!scope.value) scope.value='current';
  let limit=36;
  const update=(change=false)=>{
    if (change) limit=36;
    const filter={query:query.value, group:group.value, scope:scope.value};
    const visible=filterDocuments(documents,filter).reverse();
    const href=new URL(listURL);
    for (const [key,value] of [['q',filter.query],['group',filter.group],['scope',filter.scope]]) {
      if (value) href.searchParams.set(key,value);
      else href.searchParams.delete(key);
    }
    if (change) history.replaceState(null,'',href);
    $('counts').textContent=visible.length
      ? `${visible.length.toLocaleString('ko-KR')}개 표시 · 전체 ${documents.length.toLocaleString('ko-KR')}개 · ${createdAt.slice(0,10)} 기준`
      : '조건에 맞는 기획서가 없습니다.';
    $('list').replaceChildren(...visible.slice(0,limit).map(doc=>card(doc,href)));
    more.hidden=visible.length<=limit;
  };
  query.addEventListener('input',()=>update(true));
  group.addEventListener('change',()=>update(true));
  scope.addEventListener('change',()=>update(true));
  more.addEventListener('click',()=>{limit+=36;update();});
  update();
}

function card(doc,listURL) {
  const anchor=document.createElement('a');
  anchor.className='card';
  const url=new URL(listURL);
  url.searchParams.set('doc',doc.key);
  anchor.href=url.href;
  const meta=document.createElement('div'), name=document.createElement('strong'), summary=document.createElement('p');
  meta.className='meta';meta.textContent=description(doc);
  name.textContent=doc.title;
  summary.textContent=doc.summary;
  anchor.append(meta,name);
  if (doc.summary) anchor.append(summary);
  return anchor;
}

function notice(title,message) {
  const box=$('unavailable');
  box.hidden=false;
  box.replaceChildren();
  const heading=document.createElement('strong'), detail=document.createElement('p');
  heading.textContent=title;detail.textContent=message;
  box.append(heading,detail);
}

async function openEntry(entry,lookup,assets,listURL,format) {
  $('document-title').textContent=entry.title;
  document.title=entry.title+' · 케이팝몬스터즈 기획서';
  $('document-meta').textContent=description(entry)+(entry.recoveredFrom?' · 보관본':'');
  $('summary').textContent=entry.summary;
  if (entry.availability!=='local') {
    notice(availability[entry.availability],entry.path);
    return;
  }
  const usePair=entry.pair&&format!=='html';
  const file=usePair?entry.pair:entry.file;
  const from=usePair?entry.pairPath:entry.path;
  const display=usePair?'md':entry.format;
  const original=$('original');
  original.hidden=false;
  original.href='./snapshot/'+file;
  original.download=from.split('/').at(-1);
  if (['P264','P265'].includes(entry.id)) {
    const link=$('live-original'), url=new URL('index.html',base);
    url.searchParams.set('live',entry.path);
    url.hash=location.hash;
    link.href=url.href; link.hidden=false;
  }
  if (entry.pair) {
    const alternate=$('switch'),url=new URL(location.href);
    url.searchParams.set('format',usePair?'html':'text');
    alternate.hidden=false;
    alternate.href=url.href;
    alternate.textContent=usePair?'HTML 원본 보기':'텍스트 기획서 보기';
  }
  try {
    const response=await fetch('./snapshot/'+(entry.preview||file));
    if (!response.ok) throw new Error(response.status);
    const text=await response.text();
    showPaper(display==='md'?renderMarkdown(text,from):text,from,display,lookup,assets,listURL);
  } catch {
    notice('문서 파일을 열 수 없습니다.',from);
  }
}

async function openLive(path,lookup,assets,listURL) {
  const url=new URL(path.split('/').map(encodeURIComponent).join('/'),LIVE);
  $('document-meta').textContent='케이팝몬스터즈 원본 · 기획서 툴(7007)과 같은 파일';
  const original=$('original');
  original.hidden=false; original.removeAttribute('download'); original.href=url.href; original.textContent='기획서 툴 원본';
  try {
    const response=await fetch(url);
    if (!response.ok) throw new Error(response.status);
    const text=await response.text();
    const md=path.endsWith('.md');
    const title=md?(text.match(/^#\s+(.+)$/m)?.[1]||path):(text.match(/<title>([^<]*)<\/title>/i)?.[1]||path);
    $('document-title').textContent=title; document.title=title+' · 케이팝몬스터즈 기획서';
    showPaper(md?renderMarkdown(text,path):text,path,md?'md':'html',lookup,assets,listURL,url);
  } catch {
    notice('원본을 열 수 없습니다.','기획서 툴(7007)이 켜져 있는지 확인해 주세요 · '+path);
  }
}

function showPaper(html,from,format,lookup,assets,listURL,liveBase=null) {
  // Parse inside an inert template. The displayed document has its own scroll and cannot run author scripts.
  const template=document.createElement('template');
  template.innerHTML=html;
  const body=template.content;
  body.querySelectorAll('script,base,meta,iframe,embed,object,form,input,button').forEach(node=>node.remove());
  const map=raw=>resolveReference(raw,from,lookup,assets);
  const absolute=url=>new URL(url,base).href;
  const localAsset=raw=>{
    if (/^data:image\/(png|jpe?g|gif|webp|avif);base64,/i.test(raw)) return raw;
    if (liveBase) { try { const u=new URL(raw,liveBase); return u.origin===new URL(LIVE).origin?u.href:null; } catch { return null; } }
    const result=map(raw);
    return result?.type==='asset'?absolute(result.url):null;
  };
  const rewriteCss=css=>css.replace(/url\(\s*(['"]?)(.*?)\1\s*\)/gi,(_,quote,raw)=>`url("${localAsset(raw)||'about:blank'}")`);
  for (const node of body.querySelectorAll('*')) {
    for (const {name,value} of Array.from(node.attributes)) {
      if (/^on/i.test(name)||['ping','target','action','formaction','srcdoc','srcset'].includes(name)) node.removeAttribute(name);
      if (['src','poster','background'].includes(name)) {
        const safe=localAsset(value);
        if (safe) node.setAttribute(name,safe);
        else node.removeAttribute(name);
      }
      if (name==='style') node.setAttribute(name,rewriteCss(value));
    }
    if (node.tagName==='STYLE') node.textContent=rewriteCss(node.textContent);
    if (!node.hasAttribute('href')) continue;
    const href=node.getAttribute('href');
    if (liveBase && node.tagName==='A' && !href.startsWith('#')) {
      try {
        const u=new URL(href,liveBase);
        const p=decodeURIComponent(u.pathname).replace(/^\/+/,'');
        if (u.origin===new URL(LIVE).origin && /\.(html|md)$/.test(p)) {
          const destination=new URL(listURL); destination.search=''; destination.searchParams.set('live',p); destination.hash=u.hash;
          node.href=destination.href; node.dataset.navigate='paper';
        } else { node.href=u.href; node.dataset.navigate='paper'; }
      } catch { node.removeAttribute('href'); }
      continue;
    }
    const target=map(href);
    if (node.tagName==='LINK') {
      if (node.rel==='stylesheet'&&target?.type==='asset') node.href=absolute(target.url);
      else node.remove();
    } else if (node.tagName==='A'&&target?.type==='paper') {
      const destination=new URL(listURL);
      const internal=new URL(target.url,base);
      destination.searchParams.set('doc',internal.searchParams.get('doc'));
      destination.hash=internal.hash;
      node.href=destination.href;
      node.dataset.navigate='paper';
    } else if (node.tagName==='A'&&target?.type==='studio') {
      node.href=absolute(target.url);
      node.dataset.navigate='paper';
    } else if (target?.type==='asset') {
      node.setAttribute('href',absolute(target.url));
      if (node.tagName==='A') {
        node.dataset.navigate='asset';
        try { node.title=decodeURIComponent(href.split('/').at(-1)); } catch {}
      }
    } else if (target?.type!=='anchor') {
      node.removeAttribute('href');
      node.title='원본에 등록된 경로 '+href;
    }
  }
  const policy=`default-src 'none'; img-src ${location.origin}${liveBase?' '+new URL(LIVE).origin:''} data:; style-src 'unsafe-inline' ${location.origin}; font-src ${location.origin}; media-src ${location.origin};`;
  const css=format==='md'
    ? 'body{max-width:980px;margin:0 auto;padding:clamp(14px,4vw,40px);font:15px/1.7 system-ui,sans-serif;color:#222936;overflow-wrap:anywhere}h1,h2,h3{line-height:1.35}h2{margin-top:1.65em;border-bottom:1px solid #ddd;padding-bottom:.2em}table{border-collapse:collapse;display:block;overflow:auto}td,th{border:1px solid #d9ddeb;padding:6px 10px}th{background:#f1f0fa}pre{overflow:auto;white-space:pre-wrap;background:#f4f4f8;padding:12px}'
    : 'body{margin-block:0}';
  paper.addEventListener('load',()=>{
    const doc=paper.contentDocument;
    if (!doc) return;
    doc.addEventListener('click',event=>{
      const anchor=event.target.closest?.('a');
      const raw=anchor?.getAttribute('href')||'';
      if(raw.startsWith('#')) { event.preventDefault(); doc.location.hash=raw.slice(1); return; } // 11/20 클로드: 문서 안 이동(탭 · 목차)은 바깥 페이지를 다시 열지 않게
      if(!anchor?.dataset.navigate) return;
      event.preventDefault();
      if(anchor.dataset.navigate==='asset') {
        const download=document.createElement('a');
        download.href=anchor.href;
        download.download=anchor.getAttribute('title')||anchor.href.split('/').at(-1);
        download.click();
      }
      else location.assign(anchor.href);
    });
    syncPaperHash();
  },{once:true});
  paper.srcdoc=`<!doctype html><html lang="ko"><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${policy}"><style>${css}img,video{max-width:100%;height:auto}a{overflow-wrap:anywhere}</style><body>${template.innerHTML}</body></html>`;
  paper.hidden=false;
}
