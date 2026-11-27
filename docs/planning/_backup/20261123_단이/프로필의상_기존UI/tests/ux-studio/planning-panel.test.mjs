import test from 'node:test';
import assert from 'node:assert/strict';
import {planningSelection,planningPanelHTML,planningURL,readPlanningIndex} from '../../src/tools/uxStudio/planning-panel.mjs';
const entry={workspaceId:'w',projectId:'p',title:'로비 기획',viewer:'lobby/index.html',status:'로비 1차만 합의',sections:[{id:'overview',title:'전체',summary:'전체 설명',lines:[]},{id:'header',title:'프로필',summary:'<script>안됨</script>',lines:['누르면 팀 정보']}],screens:{main:{section:'overview',elements:{parent:'header'}}}};
const index={schemaVersion:1,projects:[entry]};
test('planning is scoped to workspace, project and registered screen',()=>{
 for(const context of [{workspaceId:'other',projectId:'p',screenId:'main'},{workspaceId:'w',projectId:'other',screenId:'main'},{workspaceId:'w',projectId:'p',screenId:'other'}])assert.equal(planningSelection(index,context),null);
 const result=planningSelection(index,{workspaceId:'w',projectId:'p',screenId:'main'});assert.equal(result.section.id,'overview');
});
test('selected child uses nearest linked ancestor; unrelated selection uses screen summary',()=>{
 const context={workspaceId:'w',projectId:'p',screenId:'main',elements:[{id:'child',parentId:'parent'},{id:'parent'}]};
 assert.equal(planningSelection(index,{...context,elementId:'child'}).section.id,'header');
 assert.equal(planningSelection(index,{...context,elementId:'unknown'}).section.id,'overview');
 context.elements=[{id:'a',parentId:'b'},{id:'b',parentId:'a'}];assert.equal(planningSelection(index,{...context,elementId:'a'}).section.id,'overview');
});
test('document URL only permits local guide HTML and valid anchors',()=>{
 assert.equal(planningURL('lobby/index.html','header'),'/ui-studio/source/guide/reference/lobby/index.html#header');
 for(const path of ['../secrets.html','https://evil.test/x.html','lobby//x.html','lobby/x.html?x=1'])assert.equal(planningURL(path,'header'),null);
 assert.equal(planningURL('lobby/index.html','x" onclick='),null);
});
test('panel shows actionable spec fields without workflow boilerplate',()=>{
 const selection=planningSelection(index,{workspaceId:'w',projectId:'p',screenId:'main',elementId:'parent'});const html=planningPanelHTML(selection);
 assert.doesNotMatch(html,/로비 1차만 합의/);assert.match(html,/&lt;script&gt;/);assert.doesNotMatch(html,/<script>/);assert.match(html,/#header/);assert.match(html,/작업 명세/);assert.equal(planningPanelHTML(null),'');
});
test('optional document service failures return an empty index without failing editor',async()=>{
 for(const fetcher of [async()=>{throw Error('offline')},async()=>({ok:false}),async()=>({ok:true,json:async()=>({projects:'broken'})})])assert.deepEqual(await readPlanningIndex(fetcher),{schemaVersion:1,projects:[]});
});
test('registered lobby sections resolve every mapped part and do not attach to unapproved screens',async()=>{
 const {readFile}=await import('node:fs/promises');const registry=JSON.parse(await readFile('src/tools/uxStudio/planning-documents.json','utf8'));const entry=registry.projects[0];
 for(const [elementId,sectionId]of Object.entries(entry.screens.main.elements))assert.equal(planningSelection(registry,{workspaceId:entry.workspaceId,projectId:entry.projectId,screenId:'main',elementId}).section.id,sectionId);
 assert.equal(planningSelection(registry,{workspaceId:entry.workspaceId,projectId:entry.projectId,screenId:'moving'}),null);
});
test('viewer dialog opens local section, closes and restores focus without touching design',()=>{
 const nodes=[],previous={focused:false,focus(){this.focused=true;}};
 const page={activeElement:previous,createElement(tag){const node=new EventTarget();node.tag=tag;node.children=[];node.style={};node.setAttribute=()=>{};node.append=(...n)=>node.children.push(...n);node.remove=()=>node.removed=true;node.showModal=()=>node.open=true;node.close=()=>{node.open=false;node.dispatchEvent(new Event('close'));};node.focus=()=>node.focused=true;nodes.push(node);return node;},body:{append(){}}};
 return import('../../src/tools/uxStudio/planning-panel.mjs').then(({openPlanningDocument})=>{
 openPlanningDocument('/ui-studio/source/guide/reference/lobby/index.html#header',page);const dialog=nodes.find(n=>n.tag==='dialog'),frame=nodes.find(n=>n.tag==='iframe'),close=nodes.find(n=>n.tag==='button');assert.equal(dialog.open,true);assert.match(frame.src,/#header$/);assert.equal(close.focused,true);close.onclick();assert.equal(dialog.removed,true);assert.equal(previous.focused,true);
 const before=nodes.length;openPlanningDocument('/ui-studio/source/guide/reference/../secret.html#header',page);assert.equal(nodes.length,before);
 });
});

test('part spec fields are rendered and direct selected-part anchor is preserved',()=>{const html=planningPanelHTML({entry,section:{id:'part-money',title:'돈',fields:[{label:'표시',value:'보유량'},{label:'동작',value:'누름 없음'}]}});assert.match(html,/<dt>표시<\/dt>/);assert.match(html,/보유량/);assert.match(html,/누름 없음/);assert.match(html,/#part-money/);assert.doesNotMatch(html,/합의|미합의|영역을 고르면/);});
test('outside original-document action opens the full image document, not the work summary',async()=>{
 const {planningActionsHTML}=await import('../../src/tools/uxStudio/planning-panel.mjs');assert.equal(typeof planningActionsHTML,'function');
 const html=planningActionsHTML({entry:{...entry,originalViewer:'lobby/source.html'},section:entry.sections[0]});assert.match(html,/원본 기획서/);assert.match(html,/lobby\/source\.html/);assert.doesNotMatch(html,/lobby\/index\.html/);assert.equal(planningActionsHTML(null),'');assert.equal(planningActionsHTML({entry:{...entry,originalViewer:'../escape.html'}}),'');
});
