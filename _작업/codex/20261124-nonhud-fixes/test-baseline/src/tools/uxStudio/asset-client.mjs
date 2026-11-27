import {MAX_ASSET_BYTES,MAX_ASSET_DIMENSION,validateAssetRef,validateAssetWorkspace,assetUrl,documentAssetImages} from './asset-reference.mjs';
function endpoint(workspace) {
    validateAssetWorkspace(workspace);
    return '/api/ux-studio/asset' + (workspace===null?'':'?workspace='+encodeURIComponent(workspace));
}
async function responseError(response) {
    let error;try{error=(await response.json()).error;}catch{}
    throw Error(error || '이미지 자원 요청을 처리하지 못했습니다.');
}
export async function uploadImageAsset(file,workspace,fetcher=globalThis.fetch) {
    if(!file || !Number.isSafeInteger(file.size) || file.size<1 || file.size>MAX_ASSET_BYTES || !['image/png','image/jpeg','image/webp'].includes(file.type))throw Error('PNG/JPEG/WebP300KB 이하 파일을 선택하세요.');
    const response=await fetcher(endpoint(workspace),{method:'POST',headers:{'Content-Type':file.type},body:file,redirect:'error'});
    if(!response.ok)return responseError(response);
    const {asset}=await response.json();
    validateAssetRef(asset?.assetRef);
    if(asset.mime!==file.type || asset.bytes!==file.size || ![asset.width,asset.height].every(n=>Number.isInteger(n)&&n>0&&n<=MAX_ASSET_DIMENSION))throw Error('이미지 자원 저장 응답의 종류·크기가 다릅니다.');
    return asset;
}
export async function copyDocumentAssets(document,sourceWorkspace,targetWorkspace,fetcher=globalThis.fetch) {
    validateAssetWorkspace(sourceWorkspace);validateAssetWorkspace(targetWorkspace);
    const refs=[...new Set(documentAssetImages(document).map(image=>validateAssetRef(image.assetRef)))];
    for(const ref of refs) {
        const response=await fetcher(assetUrl(ref,sourceWorkspace),{cache:'no-store',redirect:'error'});
        if(!response.ok)return responseError(response);
        const file=await response.blob(),asset=await uploadImageAsset(file,targetWorkspace,fetcher);
        if(asset.assetRef!==ref)throw Error('사본 이미지 자원 참조의 해시가 원본과 다릅니다. 설계 사본은 저장하지 않았습니다.');
    }
}
