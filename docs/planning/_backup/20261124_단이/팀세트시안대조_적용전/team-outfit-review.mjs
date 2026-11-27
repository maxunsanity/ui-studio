// UI Studio preview state. The saved layouts and controls remain independently editable.
export function createTeamOutfitReview(config, {host, getRuntime, assetURL, storage, workspaceId, detailSize}) {
    const key='ux-studio.team-outfit-preview:'+workspaceId;
    const page=config.outfit;
    const controls=config.controls;
    const memberNames=config.members;
    const validSets=new Set(Object.keys(config.sets));
    const stageData=config.teamPages;
    let stored=null;
    try {stored=JSON.parse(storage.getItem(key));} catch {}
    let applied=stored&&Array.isArray(stored.sets)
        ? {sets:memberNames.map((_,i)=>validSets.has(stored.sets[i])?stored.sets[i]:null),shown:stored.shown!==false}
        : null;
    const summary=(look,total)=>{
        const names=look?.sets.slice(0,total).filter(Boolean)||[];
        const worn=names.length, types=[...new Set(names)];
        const set=types.length===1?types[0]:null;
        const label=worn?`${set||'세트 혼합'} 적용 · ${worn}/${total}명`:'세트 미적용';
        return {worn,set,label};
    };
    let committed=false,lastDisplay=true;
    const node=id=>host.querySelector(`[data-element="${id}"]`);
    const text=(id,value)=>{const label=node(id)?.querySelector(':scope > .element-text');if(label)label.textContent=value;};
    const show=(id,visible)=>{const element=node(id);if(element){element.style.visibility=visible?'':'hidden';element.style.opacity=visible?'1':'0';element.inert=!visible;}};
    const enable=(id,enabled)=>{
        const button=node(id);
        if(!button)return;
        if(button.tagName==='BUTTON')button.disabled=!enabled;
        button.setAttribute('aria-disabled',String(!enabled));
        button.inert=!enabled;
    };
    const persist=()=>{try{storage.setItem(key,JSON.stringify(applied));}catch{}};
    const selected=(values,total)=>memberNames.slice(0,total)
        .flatMap((_,i)=>(values[page+'.checked-'+i]??true)?[i]:[]);
    const setImage=(id,reference)=>{
        const image=node(id)?.querySelector('img');
        if(!image||!reference)return;
        const url=assetURL(reference,workspaceId);
        if(image.getAttribute('src')!==url)image.src=url;
        image.alt=reference.alt||'';
    };
    return function sync() {
        const runtime=getRuntime();
        if(!runtime)return;
        const values=runtime.controlValues?.[page]||{};
        const total=values[controls.formation]==='ten'?10:5;
        const set=validSets.has(values[controls.set])?values[controls.set]:config.initialSet;
        const selection=selected(values,total);
        const commit=values[controls.commit]===true;
        if(commit&&!committed&&selection.length){
            const sets=memberNames.map((_,i)=>selection.includes(i)?set:applied?.sets[i]||null);
            applied={sets,shown:true};
            lastDisplay=values[controls.display];
            persist();
        }
        committed=commit;
        const display=values[controls.display];
        if(applied&&typeof display==='boolean'&&display!==applied.shown&&display!==lastDisplay){
            applied={...applied,shown:display};
            persist();
        }
        lastDisplay=display;
        if(runtime.page===page){
            for(let i=0;i<memberNames.length;i++)show(page+'.checked-'+i,i<total);
            text(page+'.set-choice.item',set);
            setImage(page+'.set-choice.art',config.sets[set]);
            const preview=total===5&&set===config.initialSet;
            show(page+'.dress-stage.image',preview);
            show(page+'.stage-fallback',!preview);
            text(page+'.stage-fallback',total===10?'10인 단체 의상 이미지 준비 중':'연습복 이미지 준비 중');
            text(page+'.choose-label',`착용할 멤버 · ${selection.length}/${total}명`);
            enable(page+'.primary',selection.length>0);
        }
        if(runtime.overlays.includes(config.confirm)){
            text(config.confirm+'.set-name',set);
            setImage(config.confirm+'.set-image',config.sets[set]);
            text(config.confirm+'.set-note',`${selection.length}/${total}명에게 적용`);
            text(config.confirm+'.selected-members-0',selection.slice(0,5).map(i=>memberNames[i]).join(' · '));
            text(config.confirm+'.selected-members-1',selection.slice(5).map(i=>memberNames[i]).join(' · '));
            enable(config.confirm+'.confirm',selection.length>0);
        }
        const current=stageData[runtime.page];
        if(current){
            const fallback=runtime.page===config.appliedPage&&!applied
                ? {sets:memberNames.map((_,i)=>i<5?config.initialSet:null),shown:display??true}:null;
            const look=applied||fallback;
            const {worn,set,label}=summary(look,current.total);
            const shown=look?.shown!==false;
            const useSet=worn===5&&current.total===5&&shown&&set===config.initialSet;
            show(current.base,!useSet);
            show(current.uniform,useSet);
            show(runtime.page+'.hide-set',shown);
            show(runtime.page+'.show-set',!shown);
            enable(runtime.page+'.hide-set',worn>0);
            enable(runtime.page+'.show-set',worn>0);
            text(runtime.page+'.outfit-state',label);
            text(runtime.page+'.stage-caption.label',useSet?'세트 의상 표시':worn&&!shown?'세트 이미지 가림':worn?'세트 연출 준비 중':'현재 무대 의상');
        }
        if(runtime.page===config.detail){
            const detailTotal=detailSize??(applied?.sets.slice(5).some(Boolean)?10:5);
            const {worn,label}=summary(applied,detailTotal);
            text(config.detail+'.outfit-state',label);
            text(config.detail+'.outfit-visibility',worn?(applied.shown?'세트 이미지 표시 상태':'세트 이미지 가림'):'');
        }
    };
}
