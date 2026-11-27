import {clone,validateDocument} from './model.mjs';
import {buildDesignGuide} from './design-guides.mjs';
import {isAutoLayoutChild,responsiveParentRect} from './responsive-layout.mjs';
import {encodeTransform} from './rect-transform.mjs';
import {uploadImageAsset} from './asset-client.mjs';
import {validateAssetRef,assetUrl} from './asset-reference.mjs';
/** A guide gesture is one validated design edit. Existing anchors and parent ownership survive. */
export function applyDesignGuideChange(source,screenId,elementId,change,size){
 const next=clone(source),screen=next.screens.find(s=>s.id===screenId),element=screen?.elements.find(e=>e.id===elementId);
 if(!element)throw Error('편집할 부품이 없습니다.');
 if(change.elementId!==undefined&&change.elementId!==elementId||change.screenId!==undefined&&change.screenId!==screenId)throw Error('선택 부품이 바뀌었습니다.');
 if(change.type==='rect'){
  if(isAutoLayoutChild(screen,element))throw Error('자동 배치 자식의 간격·크기는 부모 배치 설정에서 조절하세요.');
  const r=change.rect;if(!r||!['x','y','w','h'].every(k=>Number.isFinite(r[k])&&Math.abs(r[k])<=10000)||r.w<=0||r.h<=0)throw Error('위치와 크기를 확인하세요.');
  const guide=buildDesignGuide(next,screenId,elementId,size),p=responsiveParentRect(screen,element,guide.screen.width,guide.screen.height);
  if(element.rectTransform){const t=element.rectTransform;element.rectTransform=encodeTransform(p,{x:p.x+r.x,y:p.y+r.y,w:r.w,h:r.h},t.min,t.max,t.pivot);}
  else if(element.inset){element.inset=[r.y,p.w-r.x-r.w,p.h-r.y-r.h,r.x];}
  else Object.assign(element,{x:r.x/p.w*100,y:r.y/p.h*100,w:r.w/p.w*100,h:r.h/p.h*100});
 }else if(change.type==='image'){
  if(!['image','panel','button','card'].includes(element.kind))throw Error('이미지·영역·버튼·카드 부품을 선택하세요.');
  if(change.image===null)delete element.image;
  else if(change.image&&typeof change.image==='object'){element.image={...(element.image?.topArchHeight!==undefined?{topArchHeight:element.image.topArchHeight}:{}),...clone(change.image)};next.schemaVersion=Math.max(next.schemaVersion,2);}
  else throw Error('이미지 정보를 확인하세요.');
 }else if(change.type==='text'){
  if(typeof change.text!=='string'||!Number.isFinite(change.fontSize)||change.fontSize<=0)throw Error('글자와 글꼴 크기를 확인하세요.');
  element.text=change.text;element.fontSize=change.fontSize;
 }else throw Error('지원하는 가이드 편집을 선택하세요.');
 validateDocument(next);
 if(new TextEncoder().encode(JSON.stringify(next)).length>2000000)throw Error('전체 설계는2MB 이하여야 합니다.');
 return next;
}
/** Reuses the workspace asset contract; removing an image later never deletes its source file. */
export async function importGuideImage({file,path,assetRef}={},workspaceId=null,fetcher=globalThis.fetch){
 if([!!file,!!path,!!assetRef].filter(Boolean).length!==1)throw Error('이미지 파일이나 프로젝트 경로 하나를 선택하세요.');
 if(path||assetRef){
  if(path&&!/^\/ui-studio\/source\/assets\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.(?:png|jpg|jpeg|webp)$/.test(path))throw Error('프로젝트 이미지 경로만 넣으세요.');
  const url=assetRef?assetUrl(validateAssetRef(assetRef),workspaceId):path;
  const response=await fetcher(url,{redirect:'error',signal:AbortSignal.timeout(10000)});
  if(!response.ok)throw Error('프로젝트 이미지를 읽지 못했습니다.');
  file=await response.blob();
 }
 const asset=await uploadImageAsset(file,workspaceId,fetcher);
 return {src:'',assetRef:asset.assetRef,sourceSize:[asset.width,asset.height],fit:'contain',alt:'프로젝트 이미지'};
}
