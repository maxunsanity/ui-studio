import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {createSkin,validateSkin,applySkin} from '../../../../src/tools/uxStudio/skins.mjs';

const root=new URL('../../../../',import.meta.url);
const manifest=JSON.parse(await readFile(new URL('_작업/codex/ux-studio/wins-ui-assets.json',root),'utf8'));
const entries=manifest.assets.filter(asset=>asset.role.endsWith('-3slice'));
assert.equal(entries.length,2);
for(const entry of entries){
    const bytes=await readFile(new URL(entry.files.production.path,root));
    const skin={...createSkin('button'),tone:entry.fill,slices:[0,16,0,16],edges:[0,18,0,18],padding:[0,0,0,0],textures:{normal:{src:'data:image/webp;base64,'+bytes.toString('base64'),w:128,h:32}}};
    validateSkin(skin);
    const props=new Map(),node={classList:{toggle(){}},style:{setProperty:(key,value)=>props.set(key,value)},dataset:{}};
    applySkin(node,skin);
    assert.equal(props.get('--skin-slices'),'0 16 0 16 fill');
    assert.equal(props.get('--skin-edges'),'0px 18px 0px 18px');
    assert.equal(props.get('--skin-padding'),'0px 0px 0px 0px');
    assert.equal(props.get('--skin-repeat'),'stretch');
    for(const [width,height] of entry.assembly.threeSlice.targetLogicalExamples){
        assert.equal(skin.edges[1]+skin.edges[3],36);
        assert.ok(width-36>0 && height>0);
        assert.equal(skin.slices[0]+skin.slices[2],0);
    }
    console.log(entry.name,'PASS actual validateSkin/applySkin; source 128x32, caps 16->18, both target centers positive');
}
console.log('2/2 native-contract checks passed; browser CSS painting remains parent acceptance. Root:',fileURLToPath(root));
