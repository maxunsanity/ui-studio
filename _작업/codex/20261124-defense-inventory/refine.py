from pathlib import Path
sdir=Path(__file__).parent
p=sdir/'design.mjs';s=p.read_text()
s=s.replace("const storage=readDesign('kpop-mons-ui').screens.find(screen=>screen.id==='mons-storage');","const mons=readDesign('kpop-mons-ui');\nconst storage=mons.screens.find(screen=>screen.id==='mons-storage');\nconst moodScreen=mons.screens.find(screen=>screen.id==='mons-guard');\nconst moodValues=new Map(moodScreen.elements.filter(e=>/^mons-guard\\.guard-\\d+-name$/.test(e.id)).map(e=>[e.text,Number(moodScreen.elements.find(part=>part.id===e.id.replace(/-name$/,'-status'))?.text.match(/기분 (\\d+)/)?.[1])]));")
s=s.replace("const oldWorld=get(battle,'building').image;", """const oldWorld=get(battle,'building').image;
const overlayPresentation={type:'modal',rootMode:'fullscreen',dim:false,autoCloseMs:0,blocking:true,dismissOnEscape:true,effect:'fade',durationMs:160};""")
s=s.replace("const x=14+i%3*122,y=267+Math.floor(i/3)*91;", "const x=14+i%3*122,y=267+Math.floor(i/3)*92;")
s=s.replace("x,y,116,86", "x,y,116,87").replace("x+24,y+14,68,47","x+24,y+17,68,36").replace("x+6,y+60,104,20","x+6,y+52,104,18")
s=s.replace("if(c.availability)label(prep,'card-'+c.key+'.unavailable',c.availability,x+56,y+4,35,15,{size:9,align:'right'});","""if(c.availability)label(prep,'card-'+c.key+'.availability',c.availability,x+68,y+37,42,14,{size:9,align:'right',color:'#5b6874'});
 const feeling=moodValues.get(c.name);
 const meterX=x+30,meterY=y+77;
 label(prep,'card-'+c.key+'.mood','기분',x+6,y+70,24,15,{size:9,color:'#526779'});
 shape(prep,'card-'+c.key+'.mood-track','기분 게이지','panel',meterX,meterY,55,3,{fill:'#d7dee4',radius:2});
 if(Number.isFinite(feeling))shape(prep,'card-'+c.key+'.mood-fill','기분 '+feeling,'panel',meterX,meterY,55*feeling/100,3,{fill:'#526f85',radius:2});
 label(prep,'card-'+c.key+'.mood-value',Number.isFinite(feeling)?String(feeling):'—',x+89,y+70,21,15,{size:9,align:'right',color:'#526779'});""")
s=s.replace("Math.ceil(cards.length/3)*91","Math.ceil(cards.length/3)*92")
s=s.replace("for(const key of ['ignore','defend'])get(prep,key).y=767/8.44;", """for(const key of ['ignore','defend'])get(prep,key).y=767/8.44;
d.transitions.find(t=>t.fromElement===prep.id+'.ignore').action='open';""")
s=s.replace("frame(battle,'owned',12,665,366,165", "frame(battle,'owned',12,716,366,115")
s=s.replace("24,666,117,22","24,725,117,22").replace("151,665,213,22","151,725,213,22").replace("x,689,61,58","x,751,61,60").replace("x+10,692,41,38","x+10,754,41,38").replace("x+2,729,57,15","x+2,793,57,15")
a=s.index("const opener=btn(d,battle,'skills'");b=s.index("const overlay=",a)
s=s[:a]+s[b:]
s=s.replace("presentation:{type:'modal',rootMode:'fullscreen',dim:false,autoCloseMs:0,blocking:true,dismissOnEscape:true,effect:'fade',durationMs:160}","presentation:{...overlayPresentation}")
s=s.replace("'선택 시간 8초 · 미선택 시 첫 후보 지급'","'후보 3장 중 한 장을 선택하세요'")
s=s.replace(" const at=result.elements.indexOf(get(result,'caption'));",""" result.kind='modal';
 result.presentation={...overlayPresentation,dim:true,dismissOnEscape:false};
 result.purpose='같은 전장 위에서 시설과 참여 몬스, 결과와 다음 동작을 보여 줍니다.';
 result.elements=result.elements.filter(e=>!['background','head','title'].includes(e.id.slice(result.id.length+1)));
 frame(result,'result-panel',14,403,362,407,'#f0f4f7');
 const panel=result.elements.pop();
 result.elements.unshift(panel);
 const at=result.elements.indexOf(get(result,'caption'));""")
s=s.replace("console.log('inventory',cards.length,'overlay opener',opener.id);","console.log('inventory',cards.length,'screens',d.screens.length);")
p.write_text(s)
p=Path('src/tools/uxStudio/consumer.mjs');s=p.read_text().replace("blockingOverlayIndex, canOverlayInput, closeOverlay","blockingOverlayIndex, canOverlayInput, openOverlay, closeOverlay")
s=s.replace("    return {\n        updateDesign(next)", """    return {
        showOverlay(id) {
            const screen = screenById(design, id);
            if (disposed || !screen || screen.kind === 'page' || runtime.overlays.length) return;
            runtime = openOverlay(design, runtime, id);
            paint();
        },
        updateDesign(next)""");p.write_text(s)
p=Path('src/tools/uxStudio/preview.mjs');s=p.read_text()
s=s.replace("let clockTimer;","let clockTimer, overlayTimer, overlayBasePage;")
s=s.replace("        const formation = previewEntry?.previewFormation;","""        const formation = previewEntry?.previewFormation;
        const overlays = previewEntry?.previewOverlays;
        const requestedOverlay = params.get('overlay');
        const timedOverlay = previewEntry?.previewTimedOverlay;""")
s=s.replace("                onRender: page => {\n                    if (formation)", """                onRender: page => {
                    if (overlayBasePage !== page.id) {
                        overlayBasePage = page.id;
                        clearTimeout(overlayTimer);
                        if (requestedOverlay && overlays?.[requestedOverlay] === page.id) {
                            queueMicrotask(() => consumer?.showOverlay(requestedOverlay));
                        } else if (timedOverlay?.page === page.id) {
                            overlayTimer = setTimeout(() => consumer?.showOverlay(timedOverlay.id), timedOverlay.delayMs);
                        }
                    }
                    if (formation)""")
s=s.replace("                                const current=consumer?.getState().page;\n                                if(current)backURL.searchParams.set('screen',current);","""                                const runtime = consumer?.getState();
                                if (runtime?.page) backURL.searchParams.set('screen',runtime.page);
                                const currentOverlay = runtime?.overlays.at(-1);
                                if (overlays?.[currentOverlay] === runtime?.page) backURL.searchParams.set('overlay',currentOverlay);
                                else backURL.searchParams.delete('overlay');""")
p.write_text(s)
