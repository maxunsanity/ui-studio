// Storage location is the shared work/sample policy; conversion mode is unrelated.
export const STUDIO_DIRECTORY='/Users/max/projest_max/ui-studio';
export function workspaceKind(directory,toolDirectory=STUDIO_DIRECTORY){
 const root=toolDirectory.replace(/\/+$/,'');
 const path=typeof directory==='string'?directory.replace(/\/+$/,''):'';
 if(path===root||path.startsWith(root+'/_작업/'))return 'fixture';
 if(path===root+'/samples/folder-check'||path.startsWith(root+'/samples/folder-check/'))return 'fixture';
 const prefix=root+'/samples/';
 if(path.startsWith(prefix))return path.slice(prefix.length)&&!path.slice(prefix.length).includes('/')?'sample':'fixture';
 return 'project';
}
