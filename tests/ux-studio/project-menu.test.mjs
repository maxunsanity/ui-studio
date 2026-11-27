import test from 'node:test';
import assert from 'node:assert/strict';
import * as menu from '../../src/tools/uxStudio/project-manager.mjs';

test('current project is separate from recent games and test fixtures without losing a workspace',()=>{
 const workspaces=[{id:'mono',directory:'/games/monopoly',name:'monopoly-go'},{id:'fixture',directory:'/tests/folder',name:'folder-check'},{id:'capy',directory:'/games/capy',name:'capybara-go'}];
 const entries=[{directory:'/games/monopoly',title:'모노폴리 GO',viewer:'mono/index.html'},{directory:'/tests/folder',kind:'test'},{directory:'/games/capy',title:'카피바라고',viewer:'capy/index.html'}];
 assert.equal(typeof menu.projectMenuGroups,'function');
 const result=menu.projectMenuGroups(workspaces,'capy',entries);
 assert.deepEqual(result.current,workspaces[2]);
 assert.deepEqual(result.recent,[workspaces[0]]);
 assert.deepEqual(result.tools,[workspaces[1]]);
 assert.deepEqual(menu.projectMenuGroups(workspaces,'fixture',entries).current,workspaces[1]);
 const unknown={id:'other',directory:'/another/capy',name:'capybara-go'};
 assert.deepEqual(menu.projectMenuGroups([unknown],null,entries).recent,[unknown]);
});

test('research viewer only accepts fixed reference HTML paths, never external URLs or traversal',()=>{
 assert.equal(typeof menu.projectResearchURL,'function');
 assert.equal(menu.projectResearchURL('capybara-go-video-20261117/index.html'),'/ui-studio/source/guide/reference/capybara-go-video-20261117/index.html');
 for(const value of ['https://other.test/a.html','file:///secret.html','../secret.html','a/../b.html','/absolute.html','%2e%2e/a.html','a\\b.html','a.html?x=1',null])assert.equal(menu.projectResearchURL(value),null);
});
