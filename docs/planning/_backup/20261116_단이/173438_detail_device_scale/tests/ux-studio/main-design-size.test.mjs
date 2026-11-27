import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import {readFile} from 'node:fs/promises';
test('detail design profile uses authored size while device profiles remain independent',async()=>{
 const text=await readFile('src/tools/uxStudio/main.mjs','utf8');const fn=text.slice(text.indexOf('function rootSize('),text.indexOf('function quickTransform('));
 const scope={profiles:{design:{w:390,h:844},phone:{w:390,h:844}},profile:'design',doc:{entryScreen:'main'},screenById:()=>({logicalSize:{w:551,h:984}})};vm.createContext(scope);vm.runInContext(fn,scope);
 assert.equal(scope.rootSize({kind:'page',logicalSize:{w:551,h:984}}).w,551);
 assert.equal(scope.rootSize({kind:'page',logicalSize:{w:551,h:984}}).h,984);
 scope.profile='phone';assert.equal(scope.rootSize({kind:'page',logicalSize:{w:551,h:984}}).w,390);
});
