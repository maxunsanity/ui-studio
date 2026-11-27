export const HISTORY_LIMIT = 80;
export const HISTORY_BYTES = 8 * 1024 * 1024;
const sizes = new WeakMap();
function size(snapshot) {
    if (!sizes.has(snapshot))
        sizes.set(snapshot, new TextEncoder().encode(JSON.stringify(snapshot)).length);
    return sizes.get(snapshot);
}
/** The byte budget measures serialized UTF-8, not the JavaScript heap. */
export function pushSnapshot(stack, snapshot, maxEntries = HISTORY_LIMIT, maxBytes = HISTORY_BYTES) {
    stack.push(snapshot);
    let bytes = stack.reduce((sum, item) => sum + size(item), 0);
    while (stack.length > 1 && (stack.length > maxEntries || bytes > maxBytes))
        bytes -= size(stack.shift());
    return { entries: stack.length, bytes };
}

/** Synchronous document mutation: captured element references and whole-document replacement are supported. */
export function commitDocumentEdit(read, write, mutate, undo, redo) {
    const before = structuredClone(read());
    try {
        mutate();
    } catch (error) {
        write(before);
        throw error;
    }
    pushSnapshot(undo, before);
    redo.length = 0;
}
