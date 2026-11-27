// Keep the existing per-image import contract when moving bytes out of design JSON.
export const MAX_ASSET_BYTES = 300000;
export const MAX_ASSET_DIMENSION = 4096;
const REF = /^sha256-[a-f0-9]{64}\.(png|jpg|webp)$/;
const WORKSPACE = /^[a-z][a-z0-9-]{0,47}$/;
export function validateAssetRef(ref) {
    if (typeof ref !== 'string' || !REF.test(ref)) throw Error('이미지 자원 참조 형식이 올바르지 않습니다.');
    return ref;
}
export function validateAssetWorkspace(workspace) {
    if (workspace !== null && (typeof workspace !== 'string' || !WORKSPACE.test(workspace))) throw Error('이미지의 프로젝트 폴더 ID 오류');
    return workspace;
}
export function currentAssetWorkspace(location = globalThis.location) {
    if (!location || !/^\/ui-studio(?:\/|$)/.test(location.pathname)) throw Error('이미지의 프로젝트 폴더 범위를 명시해 주세요.');
    const params = new URLSearchParams(location.search);
    if (params.getAll('workspace').length > 1) throw Error('이미지의 프로젝트 폴더 ID가 중복되었습니다.');
    return validateAssetWorkspace(params.has('workspace') ? params.get('workspace') : null);
}
export function assetUrl(ref, workspace = currentAssetWorkspace()) {
    validateAssetRef(ref); validateAssetWorkspace(workspace);
    const params = new URLSearchParams({ref});
    if (workspace !== null) params.set('workspace',workspace);
    return '/api/ux-studio/asset?' + params;
}
export function assetSource(image, workspace) {
    return image?.assetRef ? assetUrl(image.assetRef,workspace) : image?.src || '';
}
export function documentAssetImages(document) {
    const images=[];
    for (const screen of document.screens || []) {
        images.push(...Object.values(screen.skin?.textures || {}));
        for (const element of screen.elements || []) {
            if (element.image) images.push(element.image);
            images.push(...Object.values(element.skin?.textures || {}));
        }
    }
    return images.filter(image=>image.assetRef !== undefined);
}
