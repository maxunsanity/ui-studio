import test from 'node:test';
import assert from 'node:assert/strict';
const layout = await import('./overview-layout.mjs').catch(() => ({}));
const screens = () => Array.from({length:7}, (_,i) => ({id:'screen-'+i,name:'화면 '+i,kind:i===3?'modal':'page',logicalSize:{w:i===1?550:390,h:i===2?980:844},canvasPosition:{x:999,y:999},elements:[]}));
const source = () => ({projectId:'design-a',entryScreen:'screen-2',screens:screens(),transitions:[
 {id:'next',fromScreen:'screen-2',targetScreen:'screen-0',action:'navigate'},
 {id:'open',fromScreen:'screen-0',targetScreen:'screen-3',action:'open'},
 {id:'cycle',fromScreen:'screen-3',targetScreen:'screen-2',action:'navigate'},
 {id:'feedback',fromScreen:'screen-0',targetScreen:'screen-4',action:'feedback'},
 {id:'back',fromScreen:'screen-3',action:'back'},
 {id:'broken',fromScreen:'screen-2',targetScreen:'missing',action:'navigate'}]});

test('grid wraps at five real boards without copying authored canvas coordinates', () => {
 assert.equal(typeof layout.gridLayout,'function');
 const d=source(),before=structuredClone(d),positions=layout.gridLayout(d);
 assert.equal(positions.length,7);
 assert.equal(new Set(positions.slice(0,5).map(p=>p.y)).size,1);
 assert.ok(positions[5].y > positions[2].y + positions[2].h);
 assert.equal(positions[5].x,positions[0].x);
 assert.ok(positions[2].x > positions[1].x + 550);
 assert.equal(positions[1].w,550);
 assert.notEqual(positions[0].x,999);
 assert.deepEqual(d,before);
});

test('flow starts at entryScreen, follows actual explicit targets, and separates disconnected screens', () => {
 assert.equal(typeof layout.flowLayout,'function');
 const d=source(),before=structuredClone(d),edges=layout.explicitEdges(d),positions=layout.flowLayout(d);
 assert.deepEqual(edges.map(e=>e.id),['next','open','cycle','feedback']);
 const at=id=>positions.find(p=>p.id===id);
 assert.ok(at('screen-2').x < at('screen-0').x);
 assert.ok(at('screen-0').x < at('screen-3').x);
 assert.equal(at('screen-2').connected,true);
 assert.equal(at('screen-1').connected,false);
 assert.ok(at('screen-1').x > at('screen-3').x);
 assert.equal(positions.length,7);
 assert.deepEqual(d,before);
});

test('view positions remain independent and drop unknown, duplicate and malformed local coordinates', () => {
 assert.equal(typeof layout.restorePositions,'function');
 const grid=layout.gridLayout(source()),flow=layout.flowLayout(source()),saved=[{id:'screen-0',x:207,y:403},{id:'screen-2',x:NaN,y:4},{id:'missing',x:1,y:1}];
 const restored=layout.restorePositions(flow,saved);
 assert.equal(restored.find(p=>p.id==='screen-0').x,207);
 assert.equal(restored.find(p=>p.id==='screen-0').y,403);
 assert.equal(restored.find(p=>p.id==='screen-2').x,flow.find(p=>p.id==='screen-2').x);
 assert.equal(grid[0].x,24);
 assert.equal(restored.length,7);
 assert.deepEqual(layout.restorePositions(flow,[{id:'screen-0',x:1,y:2},{id:'screen-0',x:3,y:4}]),flow);
});

test('URL parsing rejects duplicate selections and unsafe identities while preserving Korean screen IDs', () => {
 assert.equal(typeof layout.parseOverviewURL,'function');
 assert.deepEqual(layout.parseOverviewURL('http://localhost/ui-studio/canvas.html?workspace=folder-a&project=design-a&screen=%ED%99%94%EB%A9%B4.1&view=wireframe&layout=flow'),{workspaceId:'folder-a',projectId:'design-a',screenId:'화면.1',presentationMode:'wireframe',layout:'flow'});
 for (const query of ['workspace=folder-a&workspace=folder-b','project=design-a&project=design-b','screen=a&screen=b','view=ui&view=wireframe','layout=grid&layout=flow','workspace=','project=../a','screen=%3Cscript%3E','view=bogus','layout=bogus']) assert.throws(()=>layout.parseOverviewURL('http://localhost/ui-studio/canvas.html?'+query));
 assert.deepEqual(layout.parseOverviewURL('http://localhost/ui-studio/canvas.html'),{workspaceId:null,projectId:null,screenId:null,presentationMode:null,layout:null});
});

test('stage links safely carry the same workspace, saved design, screen and presentation mode', () => {
 assert.equal(typeof layout.overviewURL,'function');
 const context={workspaceId:'folder-a',projectId:'design-a',screenId:'화면.1',presentationMode:'detailed-wireframe',layout:'flow'};
 const detail=new URL(layout.overviewURL('detail',context),'http://localhost');
 assert.equal(detail.pathname,'/ui-studio/');assert.equal(detail.searchParams.get('editor'),'detail');
 const sample=new URL(layout.overviewURL('sample',context),'http://localhost');assert.equal(sample.pathname,'/ui-studio/source/sample-preview.html');
 for(const url of [detail,sample]){assert.equal(url.searchParams.get('workspace'),'folder-a');assert.equal(url.searchParams.get('project'),'design-a');assert.equal(url.searchParams.get('screen'),'화면.1');assert.equal(url.searchParams.get('view'),'detailed-wireframe');}
 assert.throws(()=>layout.overviewURL('detail',{...context,workspaceId:'../unsafe'}));
 assert.throws(()=>layout.overviewURL('external',context));
});

test('local preference keys isolate workspace, project and arrangement, and sanitize broken values', () => {
 assert.equal(typeof layout.preferenceKey,'function');
 const a={workspaceId:'folder-a',projectId:'design-a'},b={workspaceId:'folder-b',projectId:'design-a'};
 assert.notEqual(layout.preferenceKey(a,'grid'),layout.preferenceKey(a,'flow'));
 assert.notEqual(layout.preferenceKey({workspaceId:null,projectId:'design-a'},'grid'),layout.preferenceKey({workspaceId:'common',projectId:'design-a'},'grid'));
 assert.notEqual(layout.preferenceKey(a,'flow'),layout.preferenceKey(b,'flow'));
 assert.notEqual(layout.preferenceKey(a,'grid'),layout.preferenceKey({...a,projectId:'design-b'},'grid'));
 assert.deepEqual(layout.cleanViewPreferences({zoom:Infinity,left:-2,top:'3',selected:'<x>',positions:[{id:'screen-0',x:2,y:4}]}),{zoom:null,left:0,top:0,selected:null,positions:[{id:'screen-0',x:2,y:4}]});
 assert.deepEqual(layout.cleanViewPreferences(null),{zoom:null,left:0,top:0,selected:null,positions:[]});
});

test('visibility uses scaled viewport coordinates and unmounts distant boards', () => {
 assert.equal(typeof layout.visibleBoardIds,'function');
 const boards=[{id:'a',x:24,y:40,w:390,h:844},{id:'b',x:1000,y:40,w:390,h:844}];
 assert.deepEqual(layout.visibleBoardIds(boards,{left:0,top:0,width:430,height:700,zoom:1},0),['a']);
 assert.deepEqual(layout.visibleBoardIds(boards,{left:980,top:0,width:430,height:700,zoom:1},0),['b']);
 assert.deepEqual(layout.visibleBoardIds(boards,{left:490,top:0,width:215,height:350,zoom:.5},0),['b']);
 assert.deepEqual(layout.visibleBoardIds(boards,{left:0,top:0,width:0,height:0,zoom:1},0),[]);
});

test('refresh coalesces concurrent save events and discards results after disposal', async () => {
 assert.equal(typeof layout.createOverviewRefresh,'function');
 const callbacks=[],seen=[],errors=[];let calls=0;
 const loader=layout.createOverviewRefresh({read:()=>{calls++;return new Promise(resolve=>callbacks.push(resolve));},apply:value=>seen.push(value),error:error=>errors.push(error)});
 const first=loader.refresh();loader.refresh();loader.refresh();assert.equal(calls,1);
 callbacks.shift()('first');await new Promise(setImmediate);assert.equal(calls,2);assert.deepEqual(seen,['first']);
 callbacks.shift()('latest');await first;assert.deepEqual(seen,['first','latest']);assert.deepEqual(errors,[]);
 const last=loader.refresh();loader.dispose();callbacks.shift()('disposed');await last;assert.deepEqual(seen,['first','latest']);
});

test('refresh error is surfaced once and retry remains usable', async () => {
 assert.equal(typeof layout.createOverviewRefresh,'function');
 const seen=[],errors=[];let attempt=0;
 const loader=layout.createOverviewRefresh({read:async()=>{if(++attempt===1)throw Error('404');return 'recovered';},apply:value=>seen.push(value),error:e=>errors.push(e.message)});
 await loader.refresh();await loader.refresh();assert.deepEqual(errors,['404']);assert.deepEqual(seen,['recovered']);
});
