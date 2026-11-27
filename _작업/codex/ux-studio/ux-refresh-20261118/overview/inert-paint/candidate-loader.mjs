import {pathToFileURL} from 'node:url';
const sourceRoot=new URL('../../../../../../src/tools/uxStudio/',import.meta.url);
const candidate=process.env.OVERVIEW_CANDIDATE_DIR;
const replacements=new Map(candidate?['overview.mjs','button-state.mjs'].map(name=>[new URL(name,sourceRoot).href,pathToFileURL(candidate+'/'+name).href]):[]);
const candidateModules=new Set(replacements.values());
export function resolve(specifier,context,nextResolve){
 if(candidateModules.has(context.parentURL)&&specifier.startsWith('./'))specifier=new URL(specifier,sourceRoot).href;
 const result=nextResolve(specifier,context);
 return replacements.has(result.url)?{...result,url:replacements.get(result.url)}:result;
}
