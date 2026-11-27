import test from 'node:test';
import assert from 'node:assert/strict';
const kinds = await import('../../src/tools/uxStudio/workspace-kind.mjs').catch(()=>({}));
const home = await import('../../src/tools/uxStudio/home-data.mjs').catch(()=>({}));
const root='/Users/max/projest_max/ui-studio';
const meta=(id,directory,extra={})=>({id,name:id,directory,conversionDecision:'independent',...extra});
const response=(body,status=200)=>({ok:status<400,status,json:async()=>body});
test('home classification follows actual storage boundaries, not names or conversion mode',()=>{
 assert.equal(typeof kinds.workspaceKind,'function');
 for(const slug of ['monopoly-go','capybara-go','royal-match','future-sample'])assert.equal(kinds.workspaceKind(root+'/samples/'+slug),'sample');
 assert.equal(kinds.workspaceKind(root+'/samples/folder-check'),'fixture');
 assert.equal(kinds.workspaceKind(root+'/samples/capybara-go/ui-studio'),'fixture');
 assert.equal(kinds.workspaceKind(root),'fixture');
 assert.equal(kinds.workspaceKind('/Games/monopoly-go'),'project');
 assert.equal(kinds.workspaceKind(root+'/samples-backup/game'),'project');
});
test('bare home is distinct from explicit project, workspace, canvas and detail entries',()=>{
 assert.equal(typeof home.isHomeEntry,'function');
 assert.equal(home.isHomeEntry('http://localhost:7018/ui-studio/'),true);
 assert.equal(home.isHomeEntry('http://localhost:7018/ui-studio/?v=cache'),true);
 for(const path of ['/ui-studio/canvas.html','/ui-studio/?workspace=workspace-demo','/ui-studio/?project=ux-demo','/ui-studio/?editor=detail'])assert.equal(home.isHomeEntry('http://localhost:7018'+path),false);
});
test('home separates registered work and dynamic samples; a failed folder does not hide other work',async()=>{
 assert.equal(typeof home.readHomeCatalog,'function');
 const workspaces=[meta('workspace-work','/Games/My Game'),meta('workspace-royal',root+'/samples/royal-match'),meta('workspace-nested',root+'/samples/capybara-go/ui-studio'),meta('workspace-offline','/Games/Offline',{unavailable:true})];
 const calls=[];
 const fetcher=async url=>{calls.push(url);const u=new URL(url,'http://local');
  if(u.pathname.endsWith('/workspaces'))return response({workspaces});
  if(u.pathname.endsWith('project-research.json'))return response({projects:[]});
  if(u.searchParams.get('workspace')==='workspace-work')return response({projects:[{id:'ux-one',name:'One',revision:3},{id:'ux-two',name:'Two',revision:1}]});
  if(u.searchParams.get('workspace')==='workspace-royal')return response({projects:[]});
  throw Error('offline');
 };
 const result=await home.readHomeCatalog(fetcher,{preferredProject:()=> 'ux-two'});
 assert.deepEqual(result.work.map(x=>x.workspace.id),['workspace-work','workspace-offline']);
 assert.deepEqual(result.samples.map(x=>x.workspace.id),['workspace-royal']);
 assert.equal(result.hidden.length,1);
 assert.equal(result.work[0].designs[0].id,'ux-two');
 assert.ok(result.work[1].error);
 assert.equal(result.samples[0].designs.length,0);
 assert.equal(calls.some(url=>url.includes('workspace-nested')||url.includes('workspace-offline')),false);
});
test('each readable folder fails independently and keeps an explicit empty workspace route',async()=>{
 const fetcher=async url=>{const u=new URL(url,'http://local');if(u.pathname.endsWith('/workspaces'))return response({workspaces:[meta('workspace-a','/Games/a'),meta('workspace-b','/Games/b')]});if(u.pathname.endsWith('project-research.json'))return response({},404);if(u.searchParams.get('workspace')==='workspace-a')return response({error:'gone'},404);return response({projects:[]});};
 const result=await home.readHomeCatalog(fetcher);
 assert.ok(result.work[0].error);assert.equal(result.work[1].error,null);
 assert.equal(home.openWorkspaceURL(result.work[1]),'/ui-studio/?editor=detail&workspace=workspace-b');
 const link=new URL(home.openWorkspaceURL({workspace:meta('workspace-z','/Games/z'),designs:[{id:'ux-current',name:'Current',revision:9}]}),'http://local');
 assert.equal(link.pathname,'/ui-studio/canvas.html');assert.equal(link.searchParams.get('workspace'),'workspace-z');assert.equal(link.searchParams.get('project'),'ux-current');
});
test('catalog validates API identities before creating links; server failure is visible',async()=>{
 await assert.rejects(()=>home.readHomeCatalog(async()=>response({error:'server offline'},503)),/server offline|503/);
 const fetcher=async url=>url.endsWith('/workspaces')?response({workspaces:[meta('../bad','/Games/bad')]}):response({projects:[]});
 await assert.rejects(()=>home.readHomeCatalog(fetcher),/목록|폴더|ID/);
});
test('copy from sample rejects source/sample/fixture destinations before any write',async()=>{
 assert.equal(typeof home.copySampleToWorkspace,'function');
 const entry={workspace:meta('workspace-sample',root+'/samples/royal-match'),designs:[{id:'ux-sample',name:'Sample',revision:1}]};
 let writes=0;
 const fetcher=async(url,options={})=>{if(options.method==='POST')writes++;return response({workspace:meta('workspace-other',root+'/samples/capybara-go')});};
 await assert.rejects(()=>home.copySampleToWorkspace(entry,'workspace-sample',fetcher),/다른|작업|샘플/);
 await assert.rejects(()=>home.copySampleToWorkspace(entry,'workspace-other',fetcher),/작업|샘플/);
 assert.equal(writes,0);
});
test('copy creates a distinct design only in the approved work folder and preserves sample input',async()=>{
 const entry={workspace:meta('workspace-sample',root+'/samples/royal-match'),designs:[{id:'ux-sample',name:'Sample',revision:1}]},before=JSON.stringify(entry);
 const source={schemaVersion:1,projectId:'ux-sample',revision:1,name:'Sample',entryScreen:'main',screens:[{id:'main',name:'Main',kind:'page',purpose:'',elements:[]}],transitions:[],fixtures:{items:[],balance:0}};
 const calls=[];
 const fetcher=async(url,options={})=>{calls.push([url,options]);const u=new URL(url,'http://local');
  if(u.pathname.endsWith('/workspace'))return response({workspace:meta('workspace-work','/Games/New Game')});
  if(options.method==='POST'){const body=JSON.parse(options.body);assert.equal(u.searchParams.get('workspace'),'workspace-work');assert.equal(body.expectedRevision,null);assert.notEqual(body.document.projectId,source.projectId);return response({document:{...body.document,revision:1}});}
  return response({document:structuredClone(source)});
 };
 const copied=await home.copySampleToWorkspace(entry,'workspace-work',fetcher);
 assert.notEqual(copied.document.projectId,'ux-sample');assert.equal(copied.document.revision,1);assert.equal(JSON.stringify(entry),before);assert.equal(calls.filter(([,o])=>o.method==='POST').length,1);
});

test('registered reference samples are listed without a workspace or unsafe viewer URLs',async()=>{
 const reference={kind:'reference',title:'보드 연출',viewer:'board-motion/index.html'};
 const fetcher=async url=>{
  if(url.endsWith('/workspaces'))return response({workspaces:[]});
  if(url.endsWith('project-research.json'))return response({projects:[reference,{...reference,viewer:'../unsafe.html'},{...reference,viewer:'https://example.test/index.html'}]});
  return response({projects:[]});
 };
 const result=await home.readHomeCatalog(fetcher);
 assert.deepEqual(result.samples.map(item=>item.referenceURL),['/ui-studio/source/guide/reference/board-motion/index.html']);
 assert.equal(result.samples[0].title,'보드 연출');
 assert.equal(result.samples[0].workspace,undefined);
});
