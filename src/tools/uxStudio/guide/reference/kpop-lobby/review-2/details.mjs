import {readPlanningIndex} from '../../../../planning-panel.mjs';

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


const index = await readPlanningIndex();
const entry = index.projects.find(project => location.pathname === '/ui-studio/source/guide/reference/' + project.viewer);
const host = document.getElementById('spec-parts');
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
            group.append(partNode);
        }
        host.append(group);
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
