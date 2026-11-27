// 현재 원문의 빈 로컬 앵커만 허용합니다. id 이외 속성·내용·HTML은 통과하지 않습니다.
function localIdAnchorLine(line: string): string | null {
  const match = line.trim().match(/^<a[ \t]+id="([a-z][a-z0-9]*(?:-[a-z0-9]+)*)"[ \t]*>[ \t]*<\/a>$/);
  return match ? `<a id="${esc(match[1])}"></a>` : null;
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** 종이 안의 상대 링크를 그 파일 기준으로 푼다. `./38.md` → `docs/planning/38.md` */
export function resolvePaperHref(
  fromPath: string,
  href: string,
): { kind: "hash" | "ext" | "local"; url: string; hash: string; search: string } {
  const t = href.trim();
  if (t.startsWith("#")) return { kind: "hash", url: t, hash: t, search: "" };
  if (/^[a-z][a-z0-9+.-]*:/i.test(t)) return { kind: "ext", url: t, hash: "", search: "" };
  const from = fromPath.replace(/\\/g, "/").replace(/^\/+/, "");
  const u = new URL(t, `https://local/${from}`);
  return { kind: "local", url: u.pathname.replace(/^\/+/, ""), hash: u.hash, search: u.search };
}

let linkFrom = "";
/** 10/30 아론: 기획서 목록(path → 문서 번호). 기획서 툴이 목록을 읽은 뒤 넣는다. 있으면 md 링크는 목록에 있는 경로일 때만 문서 번호로 바꾼다. */
let paperDocIndex: Map<string, string> | null = null;
export function setPaperDocIndex(rows: Iterable<{ path: string; no: string }> | null): void {
  paperDocIndex = rows ? new Map([...rows].map((r) => [r.path.replace(/^\/+/, ""), r.no] as const)) : null;
}
/** 링크 경로 → 문서 번호. 로그(.log.md)는 문서가 아니라 파일이므로 번호로 바꾸지 않는다(01_xxx.log.md → ?doc=01 이 되어 P134~P137 로그가 안 열리던 문제). */
export function paperDocNo(url: string): string | null {
  if (/\.log\.md$/i.test(url)) return null;
  if (paperDocIndex) return paperDocIndex.get(url) ?? null;
  const m = (url.split("/").pop() || "").match(/^(\d+)/);
  return m ? m[1] : null;
}
let headingIds = new Set<string>();

/** 제목 글자 → 앵커 id (GitHub식: 소문자·기호 제거·공백은 -). `#18-기존-기획과…` 링크가 이 id로 이동한다. */
function headingSlug(raw: string): string {
  const plain = raw
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*~]/g, "")
    .toLowerCase();
  const base = plain.replace(/[^\p{L}\p{N}\s_-]/gu, "").trim().replace(/\s+/g, "-") || "section";
  let id = base;
  for (let n = 1; headingIds.has(id); n += 1) id = `${base}-${n}`;
  headingIds.add(id);
  return id;
}

function splitCells(line: string): string[] {
  let s = line.trim();
  if (s.startsWith("|")) s = s.slice(1);
  if (s.endsWith("|")) s = s.slice(0, -1);
  return s.split("|").map((c) => c.trim());
}

function isSepRow(line: string): boolean {
  if (!line.includes("|") && !/^\s*:?-{2,}:?\s*$/.test(line)) return false;
  const cells = splitCells(line);
  // 빈 머리칸 `| |` 이면 구분선이 `--`(2칸)가 된다. `{3,}`면 표 전체가 파이프로 남음.
  return cells.length > 0 && cells.every((c) => /^:?-{2,}:?$/.test(c.replace(/\s/g, "")));
}

function isHr(line: string): boolean {
  return /^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line);
}

function eatTable(lines: string[], start: number): { html: string; next: number } {
  const header = splitCells(lines[start]).map((c) => `<th>${inline(c)}</th>`).join("");
  let i = start + 2;
  const body: string[] = [];
  while (i < lines.length && lines[i].includes("|") && !isSepRow(lines[i]) && !isHr(lines[i])) {
    const cells = splitCells(lines[i]).map((c) => `<td>${inline(c)}</td>`).join("");
    body.push(`<tr>${cells}</tr>`);
    i += 1;
  }
  return {
    html: `<table><thead><tr>${header}</tr></thead><tbody>${body.join("")}</tbody></table>`,
    next: i,
  };
}

/** 접힘 태그만 통과: 한 줄이 `<details>`·`<details open>`·`</details>`·`<summary>글</summary>` 조합일 때만. 나머지 HTML은 그대로 이스케이프. */
function detailsLine(line: string): string | null {
  const t = line.trim();
  if (!/^<\/?(details|summary)\b/i.test(t)) return null;
  const re = /^(?:<details(\s+open)?\s*>|<\/details\s*>|<summary\s*>(.*?)<\/summary\s*>)/i;
  let rest = t;
  const parts: string[] = [];
  while (rest) {
    const m = rest.match(re);
    if (!m) return null;
    const tok = m[0];
    if (/^<\/details/i.test(tok)) parts.push("</details>");
    else if (/^<details/i.test(tok)) parts.push(m[1] ? "<details open>" : "<details>");
    else parts.push(`<summary>${inline(m[2] ?? "")}</summary>`);
    rest = rest.slice(tok.length).trimStart();
  }
  return parts.join("");
}

/** 읽기용 프리뷰. GFM 표·구분선·인용. 발란스 수치 렌더가 아님. */
export function renderMarkdown(src: string, fromPath = ""): string {
  linkFrom = fromPath;
  headingIds = new Set<string>();
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;
  let codeFence: { marker: string; length: number } | null = null;
  let skippedTitle = false;
  let inList: "ul" | "ol" | false = false;
  const flushList = () => {
    if (inList) {
      out.push(inList === "ol" ? "</ol>" : "</ul>");
      inList = false;
    }
  };

  while (i < lines.length) {
    const raw = lines[i];
    if (codeFence) {
      const closing = raw.match(/^ {0,3}(`{3,}|~{3,})[ \t]*$/);
      if (closing && closing[1][0] === codeFence.marker && closing[1].length >= codeFence.length) {
        out.push("</pre>");
        codeFence = null;
      } else {
        out.push(esc(raw));
      }
      i += 1;
      continue;
    }

    const opening = raw.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    // Backtick 정보 문자열에는 backtick이 올 수 없습니다. 닫힘은 같은 문자·열린 길이 이상만 허용합니다.
    if (opening && (opening[1][0] !== "`" || !opening[2].includes("`"))) {
      flushList();
      const isMermaid = opening[2].trim().toLowerCase() === "mermaid";
      out.push(isMermaid ? '<pre class="src" data-mermaid="1">' : '<pre class="src">');
      codeFence = { marker: opening[1][0], length: opening[1].length };
      i += 1;
      continue;
    }

    const anchor = localIdAnchorLine(raw);
    if (anchor !== null) {
      flushList();
      out.push(anchor);
      i += 1;
      continue;
    }

    const det = detailsLine(raw);
    if (det !== null) {
      flushList();
      out.push(det);
      i += 1;
      continue;
    }

    if (isHr(raw)) {
      flushList();
      out.push("<hr>");
      i += 1;
      continue;
    }

    if (raw.includes("|") && i + 1 < lines.length && isSepRow(lines[i + 1])) {
      flushList();
      const t = eatTable(lines, i);
      out.push(t.html);
      i = t.next;
      continue;
    }

    const h = raw.match(/^(#{1,3})\s+(.*)$/);
    if (h) {
      flushList();
      const n = h[1].length;
      if (!skippedTitle && n === 1) {
        skippedTitle = true;
        i += 1;
        continue;
      }
      out.push(`<h${n} id="${esc(headingSlug(h[2]))}">${inline(h[2])}</h${n}>`);
      i += 1;
      continue;
    }

    if (/^\s*\d+\.\s+/.test(raw)) {
      if (inList !== "ol") {
        flushList();
        out.push("<ol>");
        inList = "ol";
      }
      out.push(`<li>${inline(raw.replace(/^\s*\d+\.\s+/, ""))}</li>`);
      i += 1;
      continue;
    }
    if (/^\s*[-*]\s+/.test(raw)) {
      if (inList !== "ul") {
        flushList();
        out.push("<ul>");
        inList = "ul";
      }
      out.push(`<li>${inline(raw.replace(/^\s*[-*]\s+/, ""))}</li>`);
      i += 1;
      continue;
    }

    if (raw.startsWith(">")) {
      flushList();
      const quote: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        quote.push(lines[i].replace(/^>\s?/, ""));
        i += 1;
      }
      out.push(
        `<blockquote>${quote
          .filter((q) => q.trim())
          .map((q) => `<p>${inline(q)}</p>`)
          .join("")}</blockquote>`,
      );
      continue;
    }

    flushList();
    if (!raw.trim()) {
      out.push("");
      i += 1;
      continue;
    }
    out.push(`<p>${inline(raw)}</p>`);
    i += 1;
  }
  flushList();
  if (codeFence) out.push("</pre>");
  return out.join("\n");
}

function paperImg(alt: string, href: string): string {
  const r = resolvePaperHref(linkFrom, href);
  const src = r.kind === "ext" ? r.url : `/${r.url}${r.search || ""}`;
  return `<img src="${src}" alt="${alt}" loading="lazy">`;
}

function downloadName(path: string): string {
  const raw = path.split("/").pop() || "download.md";
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

/** 글자에 「다운로드」가 있으면 기획서 화면으로 열지 않고 파일로 받는다. */
function downloadAnchor(href: string, text: string): string | null {
  if (!text.includes("다운로드")) return null;
  const r = resolvePaperHref(linkFrom, href);
  let path = "";
  if (r.kind === "local") path = `/${r.url}`;
  else if (r.kind === "ext") {
    try {
      const u = new URL(r.url);
      if (!u.pathname.startsWith("/docs/")) return null;
      path = u.pathname;
    } catch {
      return null;
    }
  } else return null;
  const name = downloadName(path);
  return `<a href="${esc(path)}" data-file-download="1" download="${esc(name)}">${text}</a>`;
}

function paperAnchor(href: string, text: string): string {
  const dl = downloadAnchor(href, text);
  if (dl) return dl;
  const r = resolvePaperHref(linkFrom, href);
  if (r.kind === "hash") return `<a href="${esc(r.url)}">${text}</a>`;
  if (r.kind === "ext") {
    return `<a href="${esc(r.url)}" target="_blank" rel="noopener">${text}</a>`;
  }
  const hash = r.hash || "";
  const search = r.search || "";
  // 자체 툴 주소는 문서 파일이 아니라 face/doc/plan을 가진 화면 링크입니다.
  // inline()에서 한 번 escape한 query의 &만 복원하고 최종 속성은 다시 escape합니다.
  if (r.url === "docs/planning/planning-docs-tool.html") {
    const toolHref = `/${r.url}${search.replace(/&amp;/g, "&")}${hash}`;
    return `<a href="${esc(toolHref)}" data-planning-view="1">${text}</a>`;
  }
  if (/\.html?$/i.test(r.url)) {
    return `<a href="${esc(`/${r.url}${search}${hash}`)}" data-paper-path="${esc(r.url)}">${text}</a>`;
  }
  const no = paperDocNo(r.url);
  const tool = no
    ? `/docs/planning/planning-docs-tool.html?face=shelf&doc=${encodeURIComponent(no)}${hash}`
    : `/${r.url}${hash}`; // 10/30 11:30 이스라트: 번호 없는 md(S02_발란스툴.md 등)는 빈 툴 주소 대신 그 md 경로. iframe 안에서도 development-links.js가 받아 연다.
  return `<a href="${esc(tool)}" data-paper-path="${esc(r.url)}">${text}</a>`;
}

function inline(s: string): string {
  let t = esc(s);
  t = t.replace(/`([^`]+)`/g, "<code>$1</code>");
  t = t.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
  t = t.replace(/~~([^~]+)~~/g, "<s>$1</s>");
  // 10/30 11:30 이스라트: `[글](<경로>)` 꺾쇠 형식(공백·괄호가 든 경로)을 먼저 푼다. esc 뒤라 꺾쇠는 &lt; &gt;로 들어온다.
  t = t.replace(/!\[([^\]]*)\]\(&lt;(.+?)&gt;\)/g, (_m, alt, href) => paperImg(alt, href));
  t = t.replace(/\[([^\]]+)\]\(&lt;(.+?)&gt;\)/g, (_m, text, href) => paperAnchor(href, text));
  t = t.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, href) => (href.startsWith("<a ") ? _m : paperImg(alt, href)));
  t = t.replace(/\[([^\]]+)\]\((?!<a )([^)]+)\)/g, (_m, text, href) => paperAnchor(href, text));
  return t;
}

const pendingDocText = new Map<string, Promise<string>>();

/** 동시 선택은 한 요청을 공유하고, 다음 선택은 서버에 최신 원본을 재검증한다. */
export function fetchDocText(path: string): Promise<string> {
  const url = path.startsWith("/") ? path : `/${path}`;
  const pending = pendingDocText.get(url);
  if (pending) return pending;
  const request = (async () => {
    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error(`${path} HTTP ${res.status}`);
      return await res.text();
    } finally {
      pendingDocText.delete(url);
    }
  })();
  pendingDocText.set(url, request);
  return request;
}

let mermaidSeq = 0;
let mermaidLib: Promise<typeof import("mermaid").default> | null = null;

/** root 안의 fenced mermaid 블록을 SVG로 바꾼다. 파싱 실패하면 원래 코드(<pre>)를 그대로 둔다. */
export async function renderMermaidIn(root: ParentNode): Promise<void> {
  const blocks = Array.from(root.querySelectorAll<HTMLElement>('pre.src[data-mermaid="1"]'));
  if (!blocks.length) return;
  if (!mermaidLib) {
    mermaidLib = import("mermaid").then((m) => {
      m.default.initialize({ startOnLoad: false, securityLevel: "strict", theme: "default" });
      return m.default;
    });
  }
  let mermaid: typeof import("mermaid").default;
  try {
    mermaid = await mermaidLib;
  } catch (e) {
    mermaidLib = null;
    console.warn("[planningDocs] mermaid 로드 실패", e);
    return;
  }
  for (const pre of blocks) {
    if (!pre.isConnected || pre.dataset.mermaid !== "1") continue;
    pre.dataset.mermaid = "busy";
    const code = pre.textContent || "";
    const id = `pd-mmd-${++mermaidSeq}`;
    try {
      const { svg } = await mermaid.render(id, code);
      if (!pre.isConnected) continue;
      const fig = document.createElement("div");
      fig.className = "mermaid-fig";
      fig.innerHTML = svg;
      pre.replaceWith(fig);
    } catch (e) {
      pre.dataset.mermaid = "fail";
      document.getElementById(id)?.remove();
      document.getElementById(`d${id}`)?.remove();
      console.warn("[planningDocs] mermaid 파싱 실패 — 코드로 둔다", e);
    }
  }
}
