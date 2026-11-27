// 10/30 아론: 숫자로 시작하는 로그 파일(01_xxx.log.md)을 문서 번호(?doc=01)로 읽지 않고 파일 링크로 둔다. 진짜 문서 번호 링크는 그대로.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';

const root=fileURLToPath(new URL('../',import.meta.url));
const asModule=code=>import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const out=await build({stdin:{contents:"export {renderMarkdown,setPaperDocIndex,paperDocNo} from './src/tools/planningDocs/md.ts';",resolveDir:root},bundle:true,format:'esm',platform:'node',write:false,external:['mermaid'],logLevel:'silent'});
const {renderMarkdown,setPaperDocIndex,paperDocNo}=await asModule(out.outputFiles[0].text);
const FROM='docs/planning/삼중AI_공용_20260929/산출/20261015_방어진지보스3단_개발기획/01_몬스_건물주변배치.md';
const hrefs=html=>[...html.matchAll(/href="([^"]+)"/g)].map(m=>m[1].replaceAll('&amp;','&'));

for(const indexed of [false,true]){
 test(`로그(.log.md)는 문서 번호가 아니라 파일 링크 · 목록 ${indexed?'있음':'없음'}`,()=>{
  setPaperDocIndex(indexed?[{path:'docs/planning/001_OVERVIEW.md',no:'001'},{path:FROM.replace(/\.md$/,'.html'),no:'P134'}]:null);
  const [log]=hrefs(renderMarkdown('[로그](../20261015_방어진지보스3단_개발기획/01_몬스_건물주변배치.log.md)',FROM));
  assert.ok(!log.includes('doc='),log);
  assert.equal(decodeURI(log),'/'+FROM.replace(/\.md$/,'.log.md'));
  assert.equal(paperDocNo('docs/planning/x/01_a.log.md'),null);
 });
}
test('진짜 문서 번호 링크는 그대로 ?doc=번호, 목록에 없는 숫자 md는 파일 링크',()=>{
 setPaperDocIndex([{path:'docs/planning/001_OVERVIEW.md',no:'001'}]);
 const [doc,file]=hrefs(renderMarkdown('[개요](001_OVERVIEW.md) [본문](삼중AI_공용_20260929/02_x.md)','docs/planning/a.md'));
 assert.equal(doc,'/docs/planning/planning-docs-tool.html?face=shelf&doc=001');
 assert.ok(!file.includes('doc='),file);
 setPaperDocIndex(null);
 const [legacy]=hrefs(renderMarkdown('[개요](001_OVERVIEW.md)','docs/planning/a.md'));
 assert.equal(legacy,'/docs/planning/planning-docs-tool.html?face=shelf&doc=001');
 const [html]=hrefs(renderMarkdown('[P134](../20261015_방어진지보스3단_개발기획/01_몬스_건물주변배치.html)',FROM));
 assert.equal(decodeURI(html),'/'+FROM.replace(/\.md$/,'.html'));
});
