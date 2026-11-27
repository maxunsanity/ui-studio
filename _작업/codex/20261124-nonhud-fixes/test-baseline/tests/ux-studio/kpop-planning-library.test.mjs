import {readFile} from 'node:fs/promises';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {filterDocuments,resolveReference} from '../../src/tools/uxStudio/guide/reference/kpop-planning/library-model.mjs';
const data=JSON.parse(await readFile(new URL('../../src/tools/uxStudio/guide/reference/kpop-planning/snapshot/catalog.json',import.meta.url)));
const {documents,assets}=data;
const find=id=>documents.find(doc=>doc.id===id);

test('latest HUD and photocard plans have independent on-site sources',async()=>{
  for(const id of ['W03','P258','P259']){
    const doc=find(id);
    assert.equal(doc.availability,'local');
    assert.ok((await readFile(new URL('../../src/tools/uxStudio/guide/reference/kpop-planning/snapshot/'+doc.file,import.meta.url))).length>0);
  }
  assert.notEqual(find('P258').file,find('P259').file);
  assert.ok(find('P176').recoveredFrom);
  assert.equal(new Set(documents.map(doc=>doc.key)).size,documents.length);
});

test('search supports document numbers, Korean text, archive and missing filters',()=>{
  assert.ok(filterDocuments(documents,{query:'hud 인게임'}).some(doc=>doc.id==='P258'));
  assert.ok(filterDocuments(documents,{scope:'history'}).every(doc=>doc.historical));
  assert.ok(filterDocuments(documents,{scope:'missing'}).every(doc=>doc.availability==='missing'));
  assert.ok(filterDocuments(documents,{scope:'all'}).length>filterDocuments(documents).length);
});

test('document and attachment links use the offline shelf where available',()=>{
  const one=find('W03'), two=find('P258');
  const lookup=new Map([[one.id,one],[two.path,two]]);
  assert.deepEqual(resolveReference('/docs/planning/planning-docs-tool.html?face=shelf&doc=W03#hud',two.path,lookup,assets),{url:'?doc=W03#hud',type:'paper'});
  assert.equal(resolveReference('/'+two.path,one.path,lookup,assets)?.url,'?doc=P258');
  const asset=Object.keys(assets)[0];
  assert.equal(resolveReference('/'+asset,one.path,lookup,assets)?.type,'asset');
  assert.equal(resolveReference('https://example.com/guide',one.path,lookup,assets),null);
  assert.equal(resolveReference('javascript:alert(1)',one.path,lookup,assets),null);
});

test('allowlisted studio previews keep the workspace, project and screen',()=>{
  const from=find('P100').path;
  const path='/ui-studio/preview.html?workspace=workspace-cfa517bd-d9e1-40c4-aa1f-576e182500ba&project=kpop-profile-ui&screen=audition-name';
  assert.deepEqual(resolveReference(path,from,new Map(),assets),{url:path,type:'studio'});
  assert.equal(resolveReference(path+'&return=https://example.com',from,new Map(),assets),null);
  assert.equal(resolveReference('https://example.com'+path,from,new Map(),assets),null);
  const spec='/ui-studio/source/guide/reference/kpop-profile/index.html#profile-application';
  assert.deepEqual(resolveReference(spec,from,new Map(),assets),{url:spec,type:'studio'});
});
