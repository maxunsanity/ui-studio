import {readPlanningIndex} from '/ui-studio/source/planning-panel.mjs';

const element = (tag, text) => {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    return node;
};

function detail(title, id) {
    const node = element('details');
    if (id) node.id = id;
    node.append(element('summary', title));
    return node;
}

function fields(items = []) {
    const list = element('dl');
    for (const {label, value} of items) {
        if (value) list.append(element('dt', label), element('dd', value));
    }
    return list;
}

function tableView(table) {
    const node = element('table');
    const head = element('thead');
    const heading = element('tr');
    heading.append(...table.headers.map(value => element('th', value)));
    head.append(heading);
    const body = element('tbody');
    for (const row of table.rows) {
        const line = element('tr');
        line.append(...row.map(value => element('td', value)));
        body.append(line);
    }
    node.append(head, body);
    return node;
}

const index = await readPlanningIndex();
const entry = index.projects.find(project => location.pathname === '/ui-studio/source/guide/reference/' + project.viewer);
const host = document.getElementById('spec-parts');
const legacy = document.getElementById('legacy-tables');
if (!entry) {
    host.textContent = '현재 설계의 상세 명세를 읽지 못했습니다.';
} else {
    for (const section of entry.sections) {
        const list = (entry.parts || []).filter(part => part.area === section.id);
        if (!list.length) continue;
        const group = detail(section.title);
        for (const part of list) {
            const partNode = detail(part.title, part.id);
            partNode.append(fields(part.fields));
            if (part.sourceFields?.length) {
                const sources = detail(part.sourceLabel || '데이터·원문 근거');
                sources.append(fields(part.sourceFields));
                partNode.append(sources);
            }
            group.append(partNode);
        }
        host.append(group);
    }
    for (const section of entry.referenceSections || []) {
        const item = detail(section.title, 'history-' + section.id);
        item.append(fields(section.fields));
        for (const table of section.tables || []) {
            const rows = detail(table.title);
            rows.append(tableView(table));
            item.append(rows);
        }
        legacy.append(item);
    }
}

function revealSelectedPart() {
    const target = document.getElementById(location.hash.slice(1));
    if (!target || (target.tagName !== 'DETAILS' && !target.closest('details'))) return;
    for (let node = target; node; node = node.parentElement) {
        if (node.tagName === 'DETAILS') node.open = true;
    }
    target.scrollIntoView({block: 'start'});
}
window.addEventListener('hashchange', revealSelectedPart);
revealSelectedPart();
