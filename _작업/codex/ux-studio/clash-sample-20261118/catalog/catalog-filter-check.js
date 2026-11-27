
'use strict';
const input=document.getElementById('q'),kind=document.getElementById('kind'),out=document.getElementById('found'),cards=[...document.querySelectorAll('.family')];
function filterCatalog(){const q=input.value.trim().toLocaleLowerCase('ko'),k=kind.value;let count=0;for(const card of cards){const show=(k==='all'||card.dataset.kind===k)&&(!q||card.dataset.search.includes(q));card.hidden=!show;if(show)count++;}out.textContent=count+' / '+cards.length+'항목';}
input.addEventListener('input',filterCatalog);kind.addEventListener('change',filterCatalog);filterCatalog();
