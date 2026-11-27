import test from 'node:test';
import assert from 'node:assert/strict';
const client = await import('../../src/tools/uxStudio/project-manager.mjs').catch(() => ({}));
test('same design IDs resolve to separate workspace API, preview and local stage keys', () => {
 assert.equal(typeof client.scopeURL, 'function');
 assert.equal(client.scopeURL('/api/ux-studio/project?id=shared', 'ws-a'), '/api/ux-studio/project?id=shared&workspace=ws-a');
 assert.equal(client.scopeURL('/docs/planning/ux-runtime-preview.html?project=shared', 'ws-b'), '/docs/planning/ux-runtime-preview.html?project=shared&workspace=ws-b');
 assert.equal(client.scopeURL('/api/ux-studio/projects', null), '/api/ux-studio/projects');
 assert.notEqual(client.scopedKey('stage-shared-W', 'ws-a'), client.scopedKey('stage-shared-W', 'ws-b'));
 assert.equal(client.scopedKey('ux-studio.last-project', null), 'ux-studio.last-project');
 assert.throws(() => client.scopeURL('/api/ux-studio/projects', '../other'));
});
test('cancel or failed save never permits switching; discard is explicit', async () => {
 assert.equal(typeof client.allowProjectSwitch, 'function');
 let saves = 0;
 assert.equal(await client.allowProjectSwitch({dirty:true,choose:async()=> 'cancel',save:async()=>{saves++;return true;}}),false);
 assert.equal(saves,0);
 assert.equal(await client.allowProjectSwitch({dirty:true,choose:async()=> 'save',save:async()=> false}),false);
 assert.equal(await client.allowProjectSwitch({dirty:true,choose:async()=> 'save',save:async()=> true}),true);
 assert.equal(await client.allowProjectSwitch({dirty:true,choose:async()=> 'discard',save:async()=>{throw Error('must not save');}}),true);
 assert.equal(await client.allowProjectSwitch({dirty:false,choose:async()=>{throw Error('must not ask');}}),true);
});

test('unavailable destination blocks switch before discarding and is checked again after a choice', async () => {
 let asks=0, checks=0;
 assert.equal(await client.allowProjectSwitch({dirty:true,validate:async()=>false,choose:async()=>{asks++;return 'discard';}}),false);
 assert.equal(asks,0);
 assert.equal(await client.allowProjectSwitch({dirty:true,validate:async()=>++checks===1,choose:async()=> 'discard'}),false);
 assert.equal(checks,2);
});
