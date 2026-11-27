import {isHomeEntry} from './home-data.mjs';
if(isHomeEntry(location.href)){
 await import('./home.css');
 const {mountHome}=await import('./home.mjs');
 mountHome();
}else{
 await import('./overview.mjs');
}
