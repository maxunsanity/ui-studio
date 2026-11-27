// Renderer fixture only; CSS painting remains part of the parent's browser acceptance.
class Node extends EventTarget {
    constructor(tag, doc) {
        super(); this.tagName = tag.toUpperCase(); this.ownerDocument = doc; this.children = []; this.dataset = {}; this.style = {}; this.attributes = {}; this.className = '';
        this.classList = { contains: name => this.className.split(' ').includes(name), add: name => { this.className += ' ' + name; }, toggle: (name, on) => { this.className = this.className.split(' ').filter(s => s !== name).concat(on ? [name] : []).join(' '); } };
    }
    append(...nodes) { for (const n of nodes) { n.parentNode = this; this.children.push(n); } }
    replaceChildren(...nodes) {for(const node of this.children)node.parentNode=null;this.children=[];this.append(...nodes);}
    insertBefore(n, anchor) { n.remove(); const index=this.children.indexOf(anchor); n.parentNode=this; if(index<0)this.children.push(n);else this.children.splice(index,0,n); return n; }
    prepend(n) { n.parentNode = this; this.children.unshift(n); }
    remove() { if (this.parentNode) this.parentNode.children = this.parentNode.children.filter(n => n !== this); this.parentNode = null; }
    setAttribute(k, v) { this.attributes[k] = String(v); if (k === 'class') this.className = String(v); }
    getAttribute(k) { return this.attributes[k] ?? null; }
    removeAttribute(k) { delete this.attributes[k]; }
    get firstElementChild() { return this.children[0]; }
    get lastElementChild() { return this.children.at(-1); }
    matches(selector) { if(selector.includes(','))return selector.split(',').some(value=>this.matches(value));if(/^(button|input|select|textarea):not\(:disabled\)$/.test(selector))return this.tagName.toLowerCase()===selector.split(':')[0]&&!this.disabled;if(selector==='a[href]')return this.tagName==='A'&&this.getAttribute('href')!==null;if(selector==='[tabindex]:not([tabindex="-1"])')return Number.isInteger(this.tabIndex)&&this.tabIndex!==-1;if(selector==='[inert]')return !!this.inert||this.getAttribute('inert')!==null;if(selector==='[data-ui-control]')return !!this.dataset.uiControl;if(selector.startsWith('.ui-element[role=button]'))return this.classList.contains('ui-element')&&this.getAttribute('role')==='button'&&this.tagName!=='BUTTON';return selector.startsWith('.')?this.classList.contains(selector.slice(1)):this.tagName.toLowerCase()===selector; }
    closest(selector) { return this.matches(selector) ? this : this.parentNode?.closest(selector) || null; }
    getClientRects() { return this.hidden ? [] : [{}]; }
    focus() { if(this.disabled||this.closest('[inert]'))return;const previous=this.ownerDocument.activeElement;if(previous===this)return;if(previous)fire(previous,'blur');this.ownerDocument.activeElement=this;fire(this,'focus'); }
    click(){if(!this.disabled)fire(this,'click',{detail:0},true);}
    querySelectorAll(selector) {
        const direct = selector.startsWith(':scope > '), simple = direct ? selector.slice(9) : selector;
        const matches = n => n.matches(simple);
        return this.children.flatMap(n => [...(matches(n) ? [n] : []), ...(direct ? [] : n.querySelectorAll(selector))]);
    }
    querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
    contains(n) { return n === this || this.children.some(child => child.contains(n)); }
}
export function fire(node,type,values={},bubble=false){const event=new Event(type,{cancelable:true});for(const [key,value]of Object.entries({target:node,...values}))Object.defineProperty(event,key,{value,configurable:true});for(let current=node;current;current=bubble?current.parentNode:null){current.dispatchEvent(event);if(event.cancelBubble)break;}return event;}
export function fixture(t) {
    const previous = globalThis.document;
    const doc = { createElement: tag => new Node(tag, doc), createElementNS: (_ns, tag) => new Node(tag, doc) };
    globalThis.document = doc;
    t.after(() => { if (previous === undefined) delete globalThis.document; else globalThis.document = previous; });
    return doc.createElement('section');
}

