import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseCsv } from '../../simulator/csv.mjs';
export async function readFeatureCatalog(root) {
    const [csv, menu, frame] = await Promise.all(['simulator_module.csv', 'menu.json', 'mobile-frame.json'].map(n => readFile(resolve(root, 'data/simulator', n), 'utf8')));
    const rows = parseCsv(csv, 'UI 기능 목록'), config = JSON.parse(menu), common = JSON.parse(frame), groups = new Map();
    for (const g of config.groups) {
        for (const id of g.module_ids)
            groups.set(id, g.id);
        for (const sub of g.submenus || [])
            for (const id of sub.module_ids)
                groups.set(id, sub.label);
    }
    const aliases = config.module_aliases || {}, known = new Set(rows.map(r => r.simulator_module_id));
    if (known.size !== rows.length || Object.values(aliases).some(id => !known.has(id)))
        throw Error('기능 목록 참조 오류');
    return {
        version: 1, registeredCount: rows.length, sourceRefs: ['data/simulator/simulator_module.csv', 'data/simulator/menu.json', 'data/simulator/mobile-frame.json'], modules: rows.filter(r => !aliases[r.simulator_module_id]).map(r => ({
            id: r.simulator_module_id, label: config.module_labels?.[r.simulator_module_id] || r.label_ko, description: r.description, docId: r.doc_no, group: groups.get(r.simulator_module_id) || '기타', aliases: Object.keys(aliases).filter(id => aliases[id] === r.simulator_module_id), status: 'registered', sourceRef: 'data/simulator/simulator_module.csv'
        })), common: {
            layout: common.layout, currencies: common.currencies.map(({ key, label }) => ({
                key, label
            })), gauges: common.gauges, information: common.information, menus: common.menus.map(({ id, label, moduleId, row, columnSpan }) => ({
                id, label, moduleId, row, columnSpan
            })), events: common.events.map(({ id, label, available }) => ({
                id, label, available
            }))
        }
    };
}
