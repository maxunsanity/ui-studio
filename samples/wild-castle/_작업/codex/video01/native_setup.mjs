import {create as original} from './native_ks.mjs';
import {enhance as states} from './native_fast.mjs';
import {enhance as ui} from './native_ui_v3.mjs';
import {enhance as layouts} from './native_layouts.mjs';
export function create(t,assets){let u=original(t,assets);const nativeField=u.o.field;u=states(u);u.o.field=nativeField;return layouts(ui(u));}
