// Axis-aligned layout only. Editor/schema activation follows complete caller integration.
const pair = value => Array.isArray(value) && value.length === 2 && value.every(Number.isFinite);
export function validateTransform(t) {
    if (!t || ![t.min,t.max,t.pivot,t.position,t.sizeDelta].every(pair))
        throw Error('앵커 배치 값은 유한한 숫자 두 개씩이어야 합니다.');
    for (let i=0;i<2;i++)
        if (t.min[i]<0 || t.max[i]>1 || t.min[i]>t.max[i] || t.pivot[i]<0 || t.pivot[i]>1)
            throw Error('앵커·피벗 범위와 최소/최대 순서를 확인하세요.');
    return t;
}
function validateRect(r) {
    if (!r || !['x','y','w','h'].every(k=>Number.isFinite(r[k])) || r.w<=0 || r.h<=0)
        throw Error('배치 영역은 유한한 위치와 양수 크기여야 합니다.');
}
export function resolveTransform(parent,t) {
    validateRect(parent);validateTransform(t);
    const {min,max,pivot,position,sizeDelta}=t;
    const w=parent.w*(max[0]-min[0])+sizeDelta[0],h=parent.h*(max[1]-min[1])+sizeDelta[1];
    const ax=parent.w*(min[0]+(max[0]-min[0])*pivot[0]);
    const ay=parent.h*(min[1]+(max[1]-min[1])*pivot[1]);
    const rect={x:parent.x+ax+position[0]-w*pivot[0],y:parent.y+parent.h-ay-position[1]-h*(1-pivot[1]),w,h};
    validateRect(rect);return rect;
}
export function encodeTransform(parent,rect,min,max,pivot) {
    validateRect(parent);validateRect(rect);
    validateTransform({min,max,pivot,position:[0,0],sizeDelta:[0,0]});
    const sizeDelta=[rect.w-parent.w*(max[0]-min[0]),rect.h-parent.h*(max[1]-min[1])];
    const position=[rect.x-parent.x+rect.w*pivot[0]-parent.w*(min[0]+(max[0]-min[0])*pivot[0]),
        parent.h-(rect.y-parent.y)-rect.h*(1-pivot[1])-parent.h*(min[1]+(max[1]-min[1])*pivot[1])];
    const result={min:[...min],max:[...max],pivot:[...pivot],position,sizeDelta};
    resolveTransform(parent,result);return result;
}
export function adjustTransform(parent,t,dx,dy,resize=false) {
    if (![dx,dy].every(Number.isFinite)) throw Error('이동량을 확인하세요.');
    const rect=resolveTransform(parent,t);
    if (resize) {rect.w+=dx;rect.h+=dy;} else {rect.x+=dx;rect.y+=dy;}
    return encodeTransform(parent,rect,t.min,t.max,t.pivot);
}
// Call resolveTransform with the actual parent first to reject non-positive stretched sizes.
export function transformStyles(t) {
    validateTransform(t);
    const calc=(fraction,px)=>`calc(${fraction*100}% ${px<0?'-':'+'} ${Math.abs(px)}px)`;
    return {
        left:calc(t.min[0],t.position[0]-t.sizeDelta[0]*t.pivot[0]),
        top:calc(1-t.max[1],-t.position[1]-t.sizeDelta[1]*(1-t.pivot[1])),
        width:calc(t.max[0]-t.min[0],t.sizeDelta[0]),
        height:calc(t.max[1]-t.min[1],t.sizeDelta[1])
    };
}
