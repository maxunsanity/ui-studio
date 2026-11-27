import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const source=await readFile('src/tools/uxStudio/main.mjs','utf8');
const guard=source.split('\n').find(line=>line.includes('.test(path))')).trim().slice('if (!'.length,-1);
for (const [path,allowed] of [
 ['/ui-studio/source/assets/ui-skins/test.png',true],
 ['/ui-studio/source/assets/../secret.png',false],
 ['/ui-studio/source/assets/%2e%2e/secret.png',false],
 ['https://example.com/test.png',false],
 ['/ui-studio/source/assets/test.svg',false]
]) assert.equal(vm.runInNewContext(guard,{path}),allowed,path);
console.log('Image import path guard: 5/5');
