import test from 'node:test';
import assert from 'node:assert/strict';
import * as controls from '../../src/tools/uxStudio/controls.mjs';
import * as model from '../../src/tools/uxStudio/model.mjs';
import {applyControlConfig,controlInspectorHTML} from '../../src/tools/uxStudio/control-inspector.mjs';
const options=[{value:'a',label:'Alpha'},{value:'b',label:'Beta'},{value:'c',label:'Blocked',disabled:true}];
const element=(id,control)=>({id,name:id,kind:'panel',x:0,y:0,w:50,h:10,text:'Label',control});
const design=elements=>({schemaVersion:3,projectId:'choice-style-test',revision:0,name:'Choice style',entryScreen:'page',screens:[{id:'page',name:'Page',kind:'page',elements}],transitions:[],fixtures:{balance:0,items:[]}});
class TestNode extends EventTarget {
    constructor(tag, doc) { super(); this.tagName = tag.toUpperCase(); this.ownerDocument = doc; this.children = []; this.dataset = {}; this.style = {}; this.attributes = {}; this.className = ''; this.value = ''; this.hidden = false; this.disabled = false; this.tabIndex = 0; }
    append(...nodes) { for (const node of nodes) { node.parentNode = this; this.children.push(node); } }
    remove() { if (this.parentNode) this.parentNode.children.splice(this.parentNode.children.indexOf(this), 1); this.parentNode = null; }
    setAttribute(key, value) { this.attributes[key] = String(value); }
    removeAttribute(key) { delete this.attributes[key]; }
    getAttribute(key) { return this.attributes[key] ?? null; }
    contains(node) { return node === this || this.children.some(n => n.contains(node)); }
    closest(selector) { if (selector === 'button' && this.tagName === 'BUTTON' || selector === '[inert]' && this.inert) return this; return this.parentNode?.closest(selector) || null; }
    querySelectorAll(selector) {
        const match = n => selector === '.ui-element' ? n.className.split(' ').includes('ui-element') : selector.startsWith(':scope > .') ? n.className.split(' ').includes(selector.slice(10)) : n.tagName.toLowerCase() === selector;
        const direct = this.children.filter(match);
        return selector.startsWith(':scope') ? direct : this.children.flatMap(n => [...(match(n) ? [n] : []), ...n.querySelectorAll(selector)]);
    }
    querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
    focus() { this.ownerDocument.activeElement = this; }
    setCustomValidity(message) { this.validationMessage = message; }
}
function dom(screen) {
    const doc = { createElement: tag => new TestNode(tag, doc), activeElement: null }, root = doc.createElement('section');
    for (const e of screen.elements) {
        const node = doc.createElement('div'); node.className = 'ui-element'; node.dataset = { screen: screen.id, element: e.id };
        const text = doc.createElement('span'); text.className = 'element-text'; node.append(text); root.append(node);
    }
    return root;
}

test('choice style saves only on toggle controls and leaves legacy defaults unchanged',()=>{
 for(const type of ['toggle','toggle-group'])for(const choiceSize of [8,32,96]){
  const e=element('field',{...controls.createControl(type),choiceShape:'square',choiceSize,choiceColor:'#21C54B'}),d=design([e]),before=structuredClone(d);
  model.validateDocument(d);assert.deepEqual(d,before);
 }
 const native=controls.createControl('toggle'),before=structuredClone(native);controls.validateControl(native);assert.deepEqual(native,before);
 controls.validateControl({...native,choiceShape:'native'});
});
test('choice style rejects invalid shapes, sizes, colors and unrelated control types',()=>{
 for(const patch of [{choiceShape:'circle'},{choiceShape:null},{choiceSize:7},{choiceSize:97},{choiceSize:'32'},{choiceSize:NaN},{choiceSize:Infinity},{choiceColor:'#abc'},{choiceColor:'green'},{choiceColor:'#00gg00'},{choiceColor:123}])
  assert.throws(()=>controls.validateControl({type:'toggle',...patch}),/컨트롤/);
 for(const type of ['input','tabs','dropdown','slider','scrollbar'])for(const patch of [{choiceShape:'square'},{choiceSize:32},{choiceColor:'#21c54b'}])
  assert.throws(()=>controls.validateControl({...controls.createControl(type),...patch}),/컨트롤/);
});
test('choice inspector edits optional fields immutably and removes cleared size or color',()=>{
 for(const type of ['toggle','toggle-group']){
  const original=element('field',controls.createControl(type)),before=structuredClone(original);
  let next=applyControlConfig(original,'choiceShape','square');next=applyControlConfig(next,'choiceSize','32');next=applyControlConfig(next,'choiceColor','#21c54b');
  assert.equal(next.control.choiceShape,'square');assert.equal(next.control.choiceSize,32);assert.equal(next.control.choiceColor,'#21c54b');assert.deepEqual(original,before);assert.equal(next.id,'field');
  next=applyControlConfig(next,'choiceSize','');next=applyControlConfig(next,'choiceColor','');assert.equal(Object.hasOwn(next.control,'choiceSize'),false);assert.equal(Object.hasOwn(next.control,'choiceColor'),false);
  assert.equal(applyControlConfig(next,'choiceShape','native').control.choiceShape,'native');
  assert.throws(()=>applyControlConfig(next,'choiceSize','7'));assert.throws(()=>applyControlConfig(next,'choiceColor','red'));
 }
});
test('native inspector exposes square style only for toggles and does not write defaults',()=>{
 for(const type of ['toggle','toggle-group']){
  const e=element('field',controls.createControl(type)),before=JSON.stringify(e),html=controlInspectorHTML(e);
  assert.match(html,/data-control-field="choiceShape"/);assert.match(html,/value="native" selected/);assert.match(html,/data-control-field="choiceSize"[^>]*value=""[^>]*min="8" max="96"/);assert.match(html,/data-control-field="choiceColor"/);assert.equal(JSON.stringify(e),before);
 }
 for(const type of ['input','tabs','slider','dropdown'])assert.doesNotMatch(controlInspectorHTML(element('field',controls.createControl(type))),/data-control-field="choice(?:Shape|Size|Color)"/);
});
test('square grouped toggles keep native radio semantics, single selection, and appearance colors',()=>{
 const style={choiceShape:'square',choiceSize:32,choiceColor:'#21c54b'},one=element('one',{type:'toggle',group:'gender',value:true,...style}),two=element('two',{type:'toggle',group:'gender',...style});
 one.appearance={fill:'#334455',stroke:'#ccddee',strokeWidth:2,radius:5};
 const d=design([one,two]),screen=d.screens[0],root=dom(screen),before=structuredClone(d);controls.attachControls(root,screen,model.createRuntime(d));
 const [first,second]=root.querySelectorAll('input');
 assert.equal(first.type,'radio');assert.equal(first.name,second.name);assert.equal(first.dataset.choiceShape,'square');assert.equal(first.style.width,'32px');assert.equal(first.style.height,'32px');assert.equal(first.style.fontSize,'32px');assert.equal(first.style.color,'#21c54b');assert.equal(first.style.backgroundColor,'#334455');assert.equal(first.style.borderColor,'#ccddee');assert.equal(first.style.borderWidth,'2px');assert.equal(first.style.borderRadius,'5px');assert.equal(second.style.borderRadius,'0px');
 second.checked=true;second.dispatchEvent(new Event('change'));assert.equal(first.checked,false);assert.equal(second.checked,true);assert.deepEqual(d,before);
 const box=root.children[0].querySelector(':scope > .ui-control');one.control.choiceShape='native';controls.attachControls(root,screen,model.createRuntime(d));assert.equal(root.querySelector('input'),first);assert.equal(root.children[0].querySelector(':scope > .ui-control'),box);assert.equal(first.dataset.choiceShape,undefined);
 for(const key of ['width','height','fontSize','color','backgroundColor','borderColor','borderWidth','borderRadius'])assert.equal(first.style[key],'',key+' restores native CSS');
});
test('square option lists remain a radiogroup and readonly selection remains blocked',()=>{
 const e=element('list',{type:'toggle-group',options,value:'a',choiceShape:'square',choiceSize:32,choiceColor:'#21c54b'}),screen=design([e]).screens[0],root=dom(screen);controls.attachControls(root,screen);
 const box=root.children[0].querySelector(':scope > .ui-control'),fields=root.querySelectorAll('input');assert.equal(box.getAttribute('role'),'radiogroup');assert.ok(fields.every(f=>f.type==='radio'&&f.name===fields[0].name&&f.dataset.choiceShape==='square'));assert.equal(fields[2].disabled,true);
 fields[1].dispatchEvent(new Event('change'));assert.equal(fields[0].checked,false);assert.equal(fields[1].checked,true);
 e.control.readonly=true;controls.attachControls(root,screen);fields[1].dispatchEvent(new Event('change'));assert.equal(fields[0].checked,true);assert.equal(fields[1].checked,false);
});
test('legacy native controls have no square attributes or custom marker dimensions',()=>{
 const screen=design([element('single',{type:'toggle'}),element('radio',{type:'toggle',group:'g'}),element('list',{type:'toggle-group',options,value:'a'})]).screens[0],root=dom(screen);controls.attachControls(root,screen);
 const fields=root.querySelectorAll('input');assert.equal(fields[0].type,'checkbox');assert.equal(fields[1].type,'radio');for(const field of fields){assert.equal(field.dataset.choiceShape,undefined);assert.equal(field.style.width,undefined);assert.equal(field.style.color,undefined);}
});

test('choice configuration rejects hidden style edits on unrelated controls even when cleared',()=>{
 const input=element('field',controls.createControl('input'));
 for(const field of ['choiceShape','choiceSize','choiceColor'])assert.throws(()=>applyControlConfig(input,field,''));
});
