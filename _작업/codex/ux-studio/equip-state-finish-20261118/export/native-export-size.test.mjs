import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
const root=process.env.UI_STUDIO_ROOT||process.cwd();
const main=readFileSync(process.env.MAIN_SOURCE||root+'/src/tools/uxStudio/main.mjs','utf8');
const {readDesignFile,validateDocument,MAX_DOCUMENT_BYTES}=await import(pathToFileURL(root+'/src/tools/uxStudio/model.mjs'));
// Reuse existing valid large-layout fixtures without running their file-writing save tests.
const fixtureSource=readFileSync(root+'/tests/ux-studio/save-size.test.mjs','utf8');
const generators={assert,Buffer};vm.createContext(generators);vm.runInContext(fixtureSource.slice(fixtureSource.indexOf('function largeLayout()'),fixtureSource.indexOf("test('layout under")),generators);
const makeLarge=()=>structuredClone(generators.largeLayout());
const makeSized=n=>structuredClone(generators.sizedLayout(n));
function harness(doc){
 const blobs=[],anchors=[],revoked=[];const scope={Blob,doc,profiles:{design:{w:551,h:984}},profile:'design',expectedRevision:doc.revision,dirty:false,selectedScreen:doc.entryScreen,selectedElement:null,runtime:{events:[]},workspaceId:null,folderProject:null,selection:()=>null,screenById:(d,id)=>d.screens.find(s=>s.id===id),componentRoot:()=>null,inputOwner:()=>null,notify:()=>{},handoffMarkdown:()=> '# UI plan\n\n원문\n',buildHandoff:()=>({version:1,label:'handoff'}),URL:{createObjectURL:blob=>{blobs.push(blob);return 'blob:test-'+blobs.length;},revokeObjectURL:url=>revoked.push(url)},document:{createElement:tag=>{assert.equal(tag,'a');const a={click(){a.clicked=(a.clicked||0)+1;}};anchors.push(a);return a;}},setTimeout:callback=>callback()};vm.createContext(scope);
 const helper=main.indexOf('function download('),helperEnd=main.indexOf('function field(',helper);assert.ok(helper>=0&&helperEnd>helper);vm.runInContext(main.slice(helper,helperEnd),scope);
 const branch=main.indexOf("        case 'export':"),branchEnd=main.indexOf("        case 'glossary':",branch);assert.ok(branch>=0&&branchEnd>branch);vm.runInContext('function command(action){switch(action){'+main.slice(branch,branchEnd)+'}}',scope);
 return {scope,blobs,anchors,revoked,run:action=>scope.command(action)};
}
for(const [name,make,exact]of [['large valid document',makeLarge,false],['one byte below 2MB',()=>makeSized(1999999),false],['exact 2MB final Blob',()=>makeSized(2000000),true]])test('native export '+name+' imports through the official file reader without data loss',async()=>{
 const doc=make(),before=structuredClone(doc);validateDocument(doc);assert.ok(Buffer.byteLength(JSON.stringify(doc))<=MAX_DOCUMENT_BYTES);assert.ok(Buffer.byteLength(JSON.stringify(doc,null,2))>MAX_DOCUMENT_BYTES);
 const h=harness(doc);h.run('export');assert.equal(h.blobs.length,1);const blob=h.blobs[0];assert.ok(blob.size<=MAX_DOCUMENT_BYTES,'native export Blob must fit the official import limit');if(exact)assert.equal(blob.size,MAX_DOCUMENT_BYTES);
 assert.deepEqual(await readDesignFile(blob),before);assert.equal(blob.type,'application/json');assert.equal(h.anchors[0].download,'large-layout.json');assert.equal(h.anchors[0].href,'blob:test-1');assert.equal(h.anchors[0].clicked,1);assert.deepEqual(h.revoked,['blob:test-1']);assert.deepEqual(doc,before);
});
test('generic JSON helper still produces indented JSON with the same MIME and filename',async()=>{
 const h=harness(makeLarge()),value={version:1,nested:{label:'기존'}};h.scope.download('generic.json',value);assert.equal(await h.blobs[0].text(),'{\n  "version": 1,\n  "nested": {\n    "label": "기존"\n  }\n}');assert.equal(h.blobs[0].type,'application/json');assert.equal(h.anchors[0].download,'generic.json');assert.deepEqual(value,{version:1,nested:{label:'기존'}});
});
test('existing Markdown export keeps literal text, custom MIME and filename',async()=>{
 const h=harness(makeLarge());h.run('export-plan');assert.equal(await h.blobs[0].text(),'# UI plan\n\n원문\n');assert.equal(h.blobs[0].type,'text/markdown;charset=utf-8');assert.equal(h.anchors[0].download,'large-layout-UI기획.md');
});
test('existing handoff and scenario command outputs remain pretty JSON',async()=>{
 const h=harness(makeLarge());h.run('export-handoff');assert.equal(await h.blobs[0].text(),'{\n  "version": 1,\n  "label": "handoff"\n}');assert.equal(h.anchors[0].download,'large-layout-UI연결명세.json');
 h.run('export-scenario');assert.equal(await h.blobs[1].text(),'{\n  "projectId": "large-layout",\n  "revision": 0,\n  "profile": {\n    "w": 551,\n    "h": 984\n  },\n  "result": {\n    "events": []\n  }\n}');assert.equal(h.blobs[1].type,'application/json');assert.equal(h.anchors[1].download,'large-layout-동작시험.json');
});
