// UI-only adaptation for common Studio .34 toolbar. Existing authoring helper stays unchanged.
import {create as base} from './native_ops_base.mjs';
export function create(t){const o=base(t);const menu='.studio-tools';
 o.duplicate=async id=>{await o.select(id);const before=await t.playwright.locator('.layer-select').evaluateAll(es=>es.map(e=>e.dataset.element));await o.detail(menu);await t.playwright.locator(menu).getByRole('button',{name:'복제',exact:true}).click();await t.getAXState({emit:false});const next=await t.playwright.locator('.layer-select.active').evaluate(e=>e.dataset.element);if(before.includes(next))throw Error('Duplicate did not create new native ID');return next;};
 o.order=async(id,name)=>{await o.select(id);await o.detail(menu);await t.playwright.locator(menu).getByRole('button',{name,exact:true}).click();await t.getAXState({emit:false});};
 return o;
}
