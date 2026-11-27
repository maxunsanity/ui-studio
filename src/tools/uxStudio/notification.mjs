const fail=()=>{throw Error('알림 배지의 표시 방식·수치·실행 값 키를 확인하세요.');};
const count=value=>Number.isSafeInteger(value)&&value>=0;
export const createNotification=()=>({enabled:false,mode:'count',value:0,hideZero:true,maxDisplay:99});
export function validateNotification(notification){
 if(notification===undefined)return;
 if(!notification||typeof notification!=='object'||Array.isArray(notification)||Object.keys(notification).some(key=>!['enabled','mode','value','hideZero','maxDisplay','valueKey'].includes(key)))fail();
 if(typeof notification.enabled!=='boolean'||!['count','dot'].includes(notification.mode)||!count(notification.value)||typeof notification.hideZero!=='boolean'||!Number.isInteger(notification.maxDisplay)||notification.maxDisplay<1||notification.maxDisplay>999)fail();
 if(notification.valueKey!==undefined&&(typeof notification.valueKey!=='string'||!/^[a-zA-Z0-9_.-]{1,128}$/.test(notification.valueKey)))fail();
}
/** Flat host values override a saved default; dots use the same count/zero rule. */
export function formatNotification(notification,values={}){
 if(notification===undefined)return null;
 validateNotification(notification);
 if(!notification.enabled)return {text:'',hidden:true};
 const value=notification.valueKey&&Object.hasOwn(values,notification.valueKey)?values[notification.valueKey]:notification.value;
 if(!count(value))fail();
 return {text:notification.mode==='dot'?'':value>notification.maxDisplay?notification.maxDisplay+'+':String(value),hidden:notification.hideZero&&value===0};
}
