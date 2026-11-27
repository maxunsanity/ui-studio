import { mkdir, lstat, realpath, readFile, open, rename, unlink } from 'node:fs/promises';
import { resolve, join, relative, sep, dirname, basename, isAbsolute, parse } from 'node:path';
import { randomUUID, createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const runFile = promisify(execFile);
const ID = /^[a-z][a-z0-9-]{0,47}$/;
const GUIDE_FILES = ['README.md', 'USER_GUIDE.md', 'AI_GUIDE.md', 'TOOL_SPEC.md', 'ARCHITECTURE.md', 'EXISTING_GAME.md', 'PROGRESS.md', 'index.json'];
const DECISIONS = ['pending', 'convert', 'independent'];
let chooserOpen = false;
function fail(message, status = 400) { const error = Error(message); error.status = status; throw error; }
async function stat(path) {
    try { return await lstat(path); } catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}
function checkType(info, directory) {
    if (!info || info.isSymbolicLink() || !(directory ? info.isDirectory() : info.isFile()))
        fail('심볼릭 링크 또는 잘못된 프로젝트 파일·폴더 형식입니다.');
}
async function safeGameRoot(directory) {
    if (typeof directory !== 'string' || !isAbsolute(directory) || directory.includes('\0')) fail('올바른 프로젝트 폴더를 선택해 주세요.');
    const absolute = resolve(directory);
    let current = parse(absolute).root;
    for (const part of relative(current, absolute).split(sep).filter(Boolean)) {
        current = join(current, part); checkType(await stat(current), true);
    }
    if (absolute === parse(absolute).root) fail('최상위 시스템 폴더는 프로젝트로 열 수 없습니다.');
    return realpath(absolute);
}
async function safeChild(root, name, create = false) {
    const rel = relative(root, resolve(root, name));
    if (!rel || rel.startsWith('..') || isAbsolute(rel)) fail('프로젝트 저장 경로를 벗어났습니다.');
    let current = root;
    for (const part of rel.split(sep)) {
        current = join(current, part);
        if (create) { try { await mkdir(current); } catch (error) { if (error.code !== 'EEXIST') throw error; } }
        checkType(await stat(current), true);
    }
    return current;
}
async function textFile(file) { checkType(await stat(file), false); return readFile(file, 'utf8'); }
async function writeAtomic(directory, name, value) {
    const target = join(directory, name); const before = await stat(target);
    if (before) checkType(before, false);
    const temp = join(directory, '.' + name + '-' + randomUUID() + '.tmp');
    const output = await open(temp, 'wx', 0o600);
    try {
        try { await output.writeFile(JSON.stringify(value, null, 2) + '\n'); await output.sync(); }
        finally { await output.close(); }
        await rename(temp, target);
    } finally { await unlink(temp).catch(() => {}); }
}
function validateMeta(meta) {
    const allowed = ['schemaVersion','id','name','guideVersion','mode','conversionDecision','conversionDecidedAt','conversionStatus','createdAt'];
    if (!meta || typeof meta !== 'object' || Array.isArray(meta) || Object.keys(meta).some(key => !allowed.includes(key)) || meta.schemaVersion !== 1 || !ID.test(meta.id || '') || typeof meta.name !== 'string' || !meta.name.trim() || meta.name.length > 200 || /[\x00-\x1f]/.test(meta.name) || typeof meta.guideVersion !== 'string' || !meta.guideVersion || !DECISIONS.includes(meta.conversionDecision) || meta.mode !== meta.conversionDecision || !Number.isFinite(Date.parse(meta.createdAt)))
        fail('기존 ui-studio/project.json 형식이 맞지 않습니다. 원본을 보존한 채 확인해 주세요.');
    const status = meta.conversionDecision === 'convert' ? 'requested' : meta.conversionDecision === 'independent' ? 'independent' : 'not-requested';
    if (meta.conversionStatus !== status || (meta.conversionDecision === 'pending' ? meta.conversionDecidedAt !== null : !Number.isFinite(Date.parse(meta.conversionDecidedAt))))
        fail('기존 프로젝트의 변환 선택 기록이 올바르지 않습니다.');
    return meta;
}
async function workspaceAt(gameRoot) {
    const root = await safeGameRoot(gameRoot);
    const directory = await safeChild(root, 'ui-studio');
    const meta = validateMeta(JSON.parse(await textFile(join(directory, 'project.json'))));
    return {root, directory, meta};
}
function publicMeta(workspace) { return {...workspace.meta, directory: workspace.root}; }
async function writeMissing(directory, name, text) {
    const file = join(directory, name); const before = await stat(file);
    if (before) { checkType(before, false); return; }
    let output;
    try { output = await open(file, 'wx', 0o600); }
    catch (error) { if (error.code === 'EEXIST') {checkType(await stat(file), false); return;} throw error; }
    try { await output.writeFile(text); await output.sync(); } finally { await output.close(); }
}
export async function prepareFolderPicker(root, cache) {
    if (process.platform !== 'darwin') fail('네이티브 폴더 선택은 macOS에서 지원합니다.');
    const source = join(root, 'tools/ux-studio/folder-picker.swift');
    const sourceText = await textFile(source);
    const pickerCache = await safeChild(cache, 'folder-picker-cache', true);
    const bundleIdentifier = 'local.max.ux-studio-folder-picker';
    const info = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>CFBundleIdentifier</key><string>${bundleIdentifier}</string>
<key>CFBundleName</key><string>UI Studio Folder Picker</string>
<key>CFBundleDisplayName</key><string>UI 스튜디오 폴더 선택</string>
<key>CFBundleExecutable</key><string>UIStudioFolderPicker</string>
<key>CFBundlePackageType</key><string>APPL</string>
<key>CFBundleVersion</key><string>1</string>
<key>CFBundleShortVersionString</key><string>1.0</string>
<key>NSPrincipalClass</key><string>NSApplication</string>
<key>NSHighResolutionCapable</key><true/>
</dict></plist>
`;
    const hash = createHash('sha256').update(sourceText).update(info).digest('hex').slice(0,16);
    const bundle = await safeChild(pickerCache, 'UI Studio Folder Picker-' + hash + '.app', true);
    const contents = await safeChild(bundle, 'Contents', true);
    const executables = await safeChild(contents, 'MacOS', true);
    await writeMissing(contents, 'Info.plist', info);
    if (await textFile(join(contents, 'Info.plist')) !== info) fail('폴더 선택기 앱 정보가 변경되었습니다. 캐시 원본을 확인해 주세요.');
    const executable = join(executables, 'UIStudioFolderPicker');
    if (!await stat(executable)) {
        const modules = await safeChild(pickerCache, 'modules', true);
        const temporary = executable + '-' + randomUUID() + '.tmp';
        try {
            await runFile('/usr/bin/xcrun', ['swiftc', source, '-module-cache-path', modules, '-o', temporary], {timeout:120000, maxBuffer:1024*1024});
            checkType(await stat(temporary), false);
            await rename(temporary, executable);
        } finally { await unlink(temporary).catch(() => {}); }
    }
    checkType(await stat(executable), false);
    return {bundle, executable, bundleIdentifier};
}
async function nativeDirectory(root, cache) {
    const {executable} = await prepareFolderPicker(root, cache);
    const {stdout} = await runFile(executable, [], {maxBuffer:16384});
    const result = JSON.parse(stdout);
    if (result.cancelled === true) return null;
    if (typeof result.directory !== 'string') fail('폴더 선택 결과를 확인할 수 없습니다.');
    return result.directory;
}
export function createWorkspaceStore(projectRoot, legacyDirectory, options = {}) {
    const cache = dirname(resolve(legacyDirectory));
    const registryFile = join(cache, 'workspaces.json');
    const commonGuide = join(projectRoot, 'src/tools/uxStudio/guide');
    async function safeCache() {
        const root = await realpath(projectRoot);
        return safeChild(root, relative(root, cache), true);
    }
    async function registry() {
        const parent = await stat(cache);
        if (!parent) return {schemaVersion:1, workspaces:[]};
        await safeCache();
        if (!await stat(registryFile)) return {schemaVersion:1, workspaces:[]};
        const data = JSON.parse(await textFile(registryFile));
        if (!data || data.schemaVersion !== 1 || !Array.isArray(data.workspaces)) fail('프로젝트 폴더 목록 형식이 올바르지 않습니다.');
        const ids = new Set(); const roots = new Set();
        for (const item of data.workspaces) {
            if (!item || !ID.test(item.id || '') || typeof item.root !== 'string' || !isAbsolute(item.root) || ids.has(item.id) || roots.has(item.root)) fail('프로젝트 폴더 목록 항목이 올바르지 않습니다.');
            ids.add(item.id); roots.add(item.root);
        }
        return data;
    }
    async function locked(action) {
        await safeCache();
        let lock;
        try { lock = await open(join(cache, '.workspaces.lock'), 'wx', 0o600); }
        catch (error) { if (error.code === 'EEXIST') fail('다른 프로젝트 폴더 요청이 진행 중입니다. 잠시 후 다시 시도해 주세요.',409); throw error; }
        try { await lock.writeFile(String(process.pid)); return await action(); }
        finally { await lock.close(); await unlink(join(cache, '.workspaces.lock')).catch(() => {}); }
    }
    async function load(id) {
        if (!ID.test(id || '')) fail('프로젝트 폴더 ID 오류');
        const entry = (await registry()).workspaces.find(item => item.id === id);
        if (!entry) fail('등록되지 않은 프로젝트 폴더입니다. 폴더 찾기로 다시 열어 주세요.',404);
        const workspace = await workspaceAt(entry.root);
        if (workspace.root !== entry.root || workspace.meta.id !== id) fail('등록된 프로젝트 폴더와 식별자가 다릅니다.');
        return workspace;
    }
    async function copyGuides(workspace) {
        // Existing project guides are user-owned and are never overwritten.
        const guide = await safeChild(workspace.directory, 'guide', true);
        checkType(await stat(commonGuide), true);
        for (const file of GUIDE_FILES) await writeMissing(guide, file, await textFile(join(commonGuide,file)));
        await writeMissing(workspace.directory, 'README.md', '# UI 스튜디오 프로젝트\n\n상위 프로젝트의 AGENTS.md와 지침이 우선합니다. 공통 사용법은 [guide/USER_GUIDE.md](guide/USER_GUIDE.md), AI 작업 규칙은 [guide/AI_GUIDE.md](guide/AI_GUIDE.md), 이 프로젝트의 연결·변환 기록은 [integration.md](integration.md)를 읽어 주세요.\n\n설계는 designs/, 독립 자원은 assets/, 출력은 exports/에 저장합니다. 게임의 기존 UI는 폴더를 열었다는 이유로 변환되지 않습니다.\n');
        await writeMissing(workspace.directory, 'AGENTS.md', '# AI 진입점\n\n1. 상위 게임 프로젝트의 AGENTS.md와 최신 직접 지시를 먼저 따릅니다. 이 문서는 상위 지침을 변경하지 않습니다.\n2. README.md → guide/AI_GUIDE.md → guide/EXISTING_GAME.md → integration.md → project.json 순으로 읽습니다.\n3. conversionDecision=pending이면 설계 저장 전 사용자 선택이 필요합니다. independent이면 기존 게임 파일을 변경하지 않고 ui-studio 안에서만 독립 UI를 만듭니다.\n4. convert는 변환·연결 요청 기록이며 완료가 아닙니다. 별도 실제 게임 조사·백업·구현·회귀 검수 없이 전체 변환 완료를 주장하지 않습니다.\n5. 가이드 사본과 원본·설계·자원을 임의로 덮어쓰거나 삭제하지 않습니다. 현재 미완료 범위는 guide/PROGRESS.md를 확인합니다.\n');
        await writeMissing(workspace.directory, 'integration.md', '# 기존 게임 연결·변환 기록\n\n현재 선택은 project.json의 conversionDecision·conversionDecidedAt·conversionStatus가 정본입니다. 폴더 열기는 게임 루트 AGENTS.md·소스·저장파일을 읽거나 변경하지 않습니다.\n\n- pending: 사용자 선택 대기. 설계 읽기만 허용합니다.\n- independent: 기존 게임 UI를 변경하지 않고 ui-studio 내부에 독립 UI 소스를 저장합니다.\n- convert / requested: 사용자 변환·연결 요청만 기록했습니다. 자동 변환은 미구현이며 기존 게임 UI 조사·백업·연결 변경·회귀 검수를 거친 후 별도 결과를 남겨야 합니다.\n\n전체 변환 완료: 미실행·미검수. 기존 UI 목록·게임 연결·누락·미지원 화면: 아직 조사하지 않았습니다.\n');
    }
    return {
        async list() {
            const data = await registry(); const workspaces=[];
            for (const entry of data.workspaces) {
                try { workspaces.push(publicMeta(await load(entry.id))); }
                catch (error) { workspaces.push({id:entry.id,directory:entry.root,name:basename(entry.root),unavailable:true,error:error.message}); }
            }
            return workspaces;
        },
        async get(id) { return publicMeta(await load(id)); },
        async select() {
            if (chooserOpen) fail('폴더 선택 창이 이미 열려 있습니다.',409);
            chooserOpen = true;
            try {
                const directory = options.chooseDirectory ? await options.chooseDirectory() : await nativeDirectory(projectRoot, await safeCache());
                if (directory === null || directory === undefined) return {cancelled:true};
                return await locked(async () => {
                    const root = await safeGameRoot(directory);
                    const studio = join(root,'ui-studio'); const existing = await stat(studio);
                    let workspace;
                    if (existing) { checkType(existing,true); workspace = await workspaceAt(root); }
                    else {
                        const index = JSON.parse(await textFile(join(commonGuide,'index.json')));
                        if (typeof index.version !== 'string' || !index.version) fail('공통 가이드 판 정보가 없습니다.');
                        const meta={schemaVersion:1,id:'workspace-'+randomUUID(),name:basename(root),guideVersion:index.version,mode:'pending',conversionDecision:'pending',conversionDecidedAt:null,conversionStatus:'not-requested',createdAt:new Date().toISOString()};
                        validateMeta(meta);
                        await mkdir(studio);
                        await writeAtomic(studio,'project.json',meta);
                        workspace={root,directory:studio,meta};
                    }
                    const data=await registry();
                    const duplicate = data.workspaces.find(item => item.id === workspace.meta.id && item.root !== root);
                    if (duplicate) fail('다른 폴더에 같은 프로젝트 폴더 ID가 등록되어 있습니다. 복사본을 확인해 주세요.',409);
                    const sameRoot = data.workspaces.find(item => item.root === root);
                    if (sameRoot && sameRoot.id !== workspace.meta.id) fail('등록된 폴더와 프로젝트 ID가 다릅니다.');
                    for (const name of ['designs','assets','exports']) await safeChild(studio,name,true);
                    await copyGuides(workspace);
                    if (!sameRoot) {data.workspaces.push({id:workspace.meta.id,root}); await writeAtomic(cache,'workspaces.json',data);}
                    return {workspace:publicMeta(workspace)};
                });
            } finally { chooserOpen = false; }
        },
        async decision(id, decision) {
            if (!['convert','independent'].includes(decision)) fail('변환 요청 또는 독립 UI 작업을 선택해 주세요.');
            return locked(async () => {
                const workspace=await load(id);
                workspace.meta={...workspace.meta,mode:decision,conversionDecision:decision,conversionDecidedAt:new Date().toISOString(),conversionStatus:decision==='convert'?'requested':'independent'};
                validateMeta(workspace.meta); await writeAtomic(workspace.directory,'project.json',workspace.meta);
                return publicMeta(workspace);
            });
        },
        async storage(id, writing=false) {
            const workspace=await load(id);
            if (writing && workspace.meta.conversionDecision==='pending') fail('먼저 기존 UI 변환 요청 또는 독립 UI 작업을 선택해 주세요.',409);
            return {root:workspace.root,dir:await safeChild(workspace.directory,'designs')};
        },
        async guide(id, file) {
            const isProject = id !== null;
            const commonFile=file?.startsWith('guide/') ? file.slice(6) : file;
            const wrapper=isProject && ['README.md','AGENTS.md','integration.md'].includes(file);
            if (!wrapper && !GUIDE_FILES.includes(commonFile)) fail('허용된 가이드 파일이 아닙니다.');
            if (!isProject) return textFile(join(commonGuide,commonFile));
            const workspace=await load(id);
            const directory=wrapper ? workspace.directory : await safeChild(workspace.directory,'guide');
            return textFile(join(directory,wrapper?file:commonFile));
        }
    };
}
