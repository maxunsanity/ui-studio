const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const fail=()=>{throw Error('그림자 효과의 색·불투명도·거리·흐림 범위를 확인하세요.');};
export function validateEffects(effects){
 if(effects===undefined)return;
 if(!object(effects)||Object.keys(effects).some(key=>key!=='shadow'))fail();
 const shadow=effects.shadow;if(shadow===undefined)return;
 if(!object(shadow)||Object.keys(shadow).some(key=>!['enabled','color','opacity','x','y','blur'].includes(key))||typeof shadow.enabled!=='boolean'||typeof shadow.color!=='string'||!/^#[0-9a-f]{6}$/i.test(shadow.color))fail();
 for(const [key,min,max] of [['opacity',0,1],['x',-96,96],['y',-96,96],['blur',0,96]])if(!Number.isFinite(shadow[key])||shadow[key]<min||shadow[key]>max)fail();
}
export function shadowFilter(shadow){
 validateEffects(shadow===undefined?undefined:{shadow});
 if(!shadow?.enabled)return 'none';
 const rgb=[1,3,5].map(index=>parseInt(shadow.color.slice(index,index+2),16));
 return `drop-shadow(${shadow.x}px ${shadow.y}px ${shadow.blur}px rgba(${rgb.join(',')},${shadow.opacity}))`;
}
/** Alpha-based DOM paint effect; layout and pointer geometry remain unchanged. */
export function applyShadow(node,effects,{assetView='wire',shell=false}={}){
 if(effects===undefined&&!node._uiShadowApplied)return;
 validateEffects(effects);
 const active=effects?.shadow?.enabled&&assetView==='art'&&!shell;
 if(active){node.classList.add('has-ui-shadow');node.style.setProperty('--ui-shadow',shadowFilter(effects.shadow));node._uiShadowApplied=true;}
 else if(node._uiShadowApplied){node.classList.remove('has-ui-shadow');node.style.removeProperty('--ui-shadow');delete node._uiShadowApplied;}
}
