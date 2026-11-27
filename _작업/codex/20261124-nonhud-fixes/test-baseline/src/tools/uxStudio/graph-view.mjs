let library;
function loadLibrary() {
    if (window.vis)
        return Promise.resolve(window.vis);
    if (!library)
        library = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = '/ui-studio/source/vendor/vis-network.min.js';
            script.onload = () => resolve(window.vis);
            script.onerror = () => { script.remove(); library = null; reject(Error('관계도 로드 실패')); };
            document.head.append(script);
        });
    return library;
}
/** Retain the graph's DOM and viewport while unrelated inspector fields render. */
export function createFlowView({ onSelect, load = loadLibrary }) {
    let node, network, pending, latest, signature = '';
    function update() {
        if (!network || !latest)
            return;
        const key = JSON.stringify(latest);
        if (key === signature)
            return;
        signature = key;
        const { data, selectedScreen } = latest;
        network.setData({
            nodes: data.nodes.map(n => ({ ...n, shape: 'box', margin: 18, color: n.id === selectedScreen ? '#245350' : '#25394c', font: { color: '#edf6ff' }, borderWidth: 2 })),
            edges: data.edges.map(e => ({ ...e, arrows: 'to', font: { color: '#d9e6f3', strokeWidth: 0 }, color: '#8cb2ce' }))
        });
        network.fit({ animation: false });
    }
    function release() { network?.destroy(); network = null; node = null; latest = null; signature = ''; }
    return {
        mount(target, data, selectedScreen) {
            if (!target) {
                release();
                return Promise.resolve();
            }
            if (node && node !== target)
                target.replaceWith(node);
            else
                node = target;
            latest = { data, selectedScreen };
            if (network) {
                update();
                return Promise.resolve();
            }
            if (!pending)
                pending = load().then(vis => {
                    if (!node?.isConnected || network)
                        return;
                    network = new vis.Network(node, { nodes: [], edges: [] }, { physics: false, interaction: { hover: true }, edges: { smooth: false } });
                    network.on('click', onSelect);
                    update();
                }).catch(() => { if (node?.isConnected)
                    node.textContent = '관계도 뷰어를 읽지 못했습니다. 연결·조건에서 확인해 주세요.'; }).finally(() => { pending = null; });
            return pending;
        },
        fit() { network?.fit({ animation: true }); },
        release
    };
}
