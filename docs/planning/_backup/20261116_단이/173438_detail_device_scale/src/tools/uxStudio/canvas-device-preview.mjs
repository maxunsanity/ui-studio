import {resolveResponsiveRect,validateLogicalSize} from './responsive-layout.mjs';

/** Shared device sizes; the design entry always uses the screen's authored logicalSize. */
export const DEVICE_PROFILES=Object.freeze(Object.fromEntries(Object.entries({
 design:{name:'설계 기준',w:390,h:844},
 phone:{name:'세로폰',w:390,h:844},
 fold:{name:'폴드 검토',w:690,h:844},
 tablet:{name:'태블릿 세로',w:768,h:1024},
 short:{name:'짧은 폰',w:360,h:640},
 phone430:{name:'큰 폰',w:430,h:932}
}).map(([id,profile])=>[id,Object.freeze(profile)])));

export function validateDevicePreview({profile='design',orientation='original',w=390,h=844}={}){
 if(!Object.hasOwn(DEVICE_PROFILES,profile)&&profile!=='custom')throw Error('미리보기 기기를 선택하세요.');
 if(!['original','portrait','landscape'].includes(orientation))throw Error('기기 방향을 선택하세요.');
 if(![w,h].every(n=>Number.isSafeInteger(n)&&n>0&&n<=10000))throw Error('기기 너비·높이는 1~10000px 정수로 입력하세요.');
 return {profile,orientation,w,h};
}

/** Width-match scaling plus a changed logical height makes anchors and percentages actually reflow. */
export function canvasDevicePreview(screen,settings){
 const {profile,orientation,w,h}=validateDevicePreview(settings),reference={...(screen.logicalSize||DEVICE_PROFILES.design)};
 delete reference.name;validateLogicalSize(reference);
 const basis=profile==='design'?reference:profile==='custom'?{w,h}:DEVICE_PROFILES[profile];
 const device={w:basis.w,h:basis.h};
 if(orientation==='portrait'&&device.w>device.h||orientation==='landscape'&&device.w<device.h)[device.w,device.h]=[device.h,device.w];
 const scale=device.w/reference.w,logical={w:reference.w,h:device.h/scale};
 for(const element of screen.elements||[])resolveResponsiveRect(screen,element.id,logical.w,logical.h);
 return {reference,device,logical,scale};
}

export function canvasDeviceStyles(preview){
 return {width:preview.logical.w+'px',height:preview.logical.h+'px',transform:`scale(${preview.scale})`,'transform-origin':'top left'};
}
