import { createWorkspaceStore } from './workspace-store.mjs';
import { readFeatureCatalog } from './catalog.mjs';
import { mkdir, lstat, readFile, readdir, open, rename, unlink, copyFile, realpath, link } from 'node:fs/promises';
import { resolve, join, relative, sep } from 'node:path';
import { randomUUID } from 'node:crypto';
import { validateDocument } from './model.mjs';
const ID = /^[a-z][a-z0-9-]{0,47}$/;
export async function ensureSafeRoot(root, dir) {
    root = await realpath(root);
    const rel = relative(root, resolve(dir));
    if (!rel || rel.startsWith('..') || rel.split(sep).includes('..'))
        throw Error('허용된 저장 폴더가 아닙니다.');
    let current = root;
    for (const part of rel.split(sep)) {
        current = join(current, part);
        try {
            await mkdir(current);
        }
        catch (e) {
            if (e.code !== 'EEXIST')
                throw e;
        }
        const st = await lstat(current);
        if (!st.isDirectory() || st.isSymbolicLink())
            throw Error('심볼릭 링크 저장은 허용하지 않습니다.');
    }
    return current;
}
async function readDocument(file) {
    try {
        const st = await lstat(file);
        if (st.isSymbolicLink() || !st.isFile())
            throw Error('저장 파일 형식 오류');
        return validateDocument(JSON.parse(await readFile(file, 'utf8')));
    }
    catch (e) {
        if (e.code === 'ENOENT')
            return null;
        throw e;
    }
}
export async function saveDocument(root, dir, document, expectedRevision) {
    validateDocument(document);
    if (expectedRevision !== null && (!Number.isSafeInteger(expectedRevision) || expectedRevision < 0))
        throw Error('저장 기준 버전 오류');
    if (document.revision !== (expectedRevision ?? 0))
        throw Error('문서와 기준 버전이 다릅니다.');
    dir = await ensureSafeRoot(root, dir);
    const lock = join(dir, '.save.lock');
    let handle;
    try {
        handle = await open(lock, 'wx', 0o600);
    }
    catch (e) {
        if (e.code === 'EEXIST') {
            const error = Error('다른 저장이 진행 중입니다. 잠시 후 다시 시도해 주세요.');
            error.status = 409;
            throw error;
        }
        throw e;
    }
    let temp;
    try {
        await handle.writeFile(String(process.pid));
        const file = join(dir, document.projectId + '.json');
        const before = await readDocument(file);
        if ((before?.revision ?? null) !== expectedRevision) {
            const error = Error('다른 탭 또는 AI가 먼저 저장했습니다. 새 버전과 비교한 뒤 다시 저장해 주세요.');
            error.status = 409;
            throw error;
        }
        const next = {
            ...document, revision: (before?.revision ?? 0) + 1, savedAt: new Date().toISOString()
        };
        validateDocument(next);
        const backups = await ensureSafeRoot(root, join(dir, 'backups'));
        if (before)
            await copyFile(file, join(backups, document.projectId + '-r' + before.revision + '-' + randomUUID() + '.json'));
        temp = join(dir, '.' + document.projectId + '-' + randomUUID() + '.tmp');
        const out = await open(temp, 'wx', 0o600);
        try {
            await out.writeFile(JSON.stringify(next, null, 2) + '\n');
            await out.sync();
        }
        finally {
            await out.close();
        }
        await rename(temp, file);
        temp = null;
        const reread = await readDocument(file);
        if (JSON.stringify(reread) !== JSON.stringify(next))
            throw Error('저장 후 재읽기 확인에 실패했습니다.');
        return reread;
    }
    finally {
        if (temp)
            await unlink(temp).catch(() => {
            });
        await handle.close();
        await unlink(lock).catch(() => {
        });
    }
}
// Baselines pin an already saved revision; they never replace the working design.
function baselineName(projectId, stage, revision) {
    if (!ID.test(projectId || '') || !['W', 'P', 'U'].includes(stage) || !Number.isSafeInteger(revision) || revision < 1)
        throw Error('기준판의 프로젝트·단계·저장 버전을 확인해 주세요.');
    return projectId + '-' + stage + '-r' + revision + '.json';
}
export async function readBaseline(root, dir, projectId, stage, revision) {
    const name = baselineName(projectId, stage, revision);
    const safe = await ensureSafeRoot(root, join(dir, 'baselines'));
    const document = await readDocument(join(safe, name));
    if (document && (document.projectId !== projectId || document.revision !== revision))
        throw Error('기준판 내용과 식별자가 다릅니다.');
    return document;
}
export async function listBaselines(root, dir, projectId) {
    if (!ID.test(projectId || '')) throw Error('프로젝트 ID 오류');
    const safe = await ensureSafeRoot(root, join(dir, 'baselines'));
    const items = [];
    for (const name of await readdir(safe)) {
        const match = /^(.*)-([WPU])-r([1-9][0-9]*)\.json$/.exec(name);
        if (!match || match[1] !== projectId) continue;
        const revision = Number(match[3]);
        const document = await readBaseline(root, dir, projectId, match[2], revision);
        if (document) items.push({stage: match[2], revision, name: document.name});
    }
    return items.sort((a, b) => b.revision - a.revision || 'WPU'.indexOf(a.stage) - 'WPU'.indexOf(b.stage));
}
export async function saveBaseline(root, dir, projectId, stage, expectedRevision) {
    const name = baselineName(projectId, stage, expectedRevision);
    dir = await ensureSafeRoot(root, dir);
    const document = await readDocument(join(dir, projectId + '.json'));
    if (!document || document.revision !== expectedRevision) {
        const error = Error('먼저 현재 설계를 저장하고 저장 버전을 확인해 주세요.');
        error.status = 409;
        throw error;
    }
    const safe = await ensureSafeRoot(root, join(dir, 'baselines'));
    const temp = join(safe, '.' + randomUUID() + '.tmp');
    const out = await open(temp, 'wx', 0o600);
    try {
        try {
            await out.writeFile(JSON.stringify(document, null, 2) + '\n');
            await out.sync();
        } finally {
            await out.close();
        }
        // Publish the complete file atomically without overwriting an existing baseline.
        try {
            await link(temp, join(safe, name));
        } catch (error) {
            if (error.code !== 'EEXIST') throw error;
            const before = await readBaseline(root, dir, projectId, stage, expectedRevision);
            if (JSON.stringify(before) !== JSON.stringify(document)) {
                const conflict = Error('이미 있는 기준판을 덮어쓸 수 없습니다.');
                conflict.status = 409;
                throw conflict;
            }
        }
        return await readBaseline(root, dir, projectId, stage, expectedRevision);
    } finally {
        await unlink(temp).catch(() => {});
    }
}
export default function uxSavePlugin(root, dir, options = {}) {
    const workspaces = createWorkspaceStore(root, dir, options);
    return {
        name: 'ux-studio-save', configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                const u = new URL(req.url || '/', 'http://127.0.0.1');
                if (!u.pathname.startsWith('/api/ux-studio/'))
                    return next();
                const send = (status, value) => {
                    res.statusCode = status;
                    res.setHeader('Content-Type', 'application/json; charset=utf-8');
                    res.setHeader('Cache-Control', 'no-store');
                    res.end(JSON.stringify(value));
                };
                try {
                    if (!/^127\.0\.0\.1:\d+$/.test(req.headers.host || ''))
                        return send(403, {
                            error: '허용되지 않은 호스트입니다.'
                        });
                    const origin = 'http://' + req.headers.host;
                    if (req.headers.origin && req.headers.origin !== origin)
                        return send(403, {
                            error: '같은 도구에서만 접근할 수 있습니다.'
                        });
                    const storage = writing => u.searchParams.has('workspace')
                        ? workspaces.storage(u.searchParams.get('workspace'), writing)
                        : Promise.resolve({root, dir});
                    if (req.method === 'GET' && u.pathname === '/api/ux-studio/workspaces')
                        return send(200, {workspaces: await workspaces.list()});
                    if (req.method === 'GET' && u.pathname === '/api/ux-studio/workspace')
                        return send(200, {workspace: await workspaces.get(u.searchParams.get('workspace'))});
                    if (req.method === 'GET' && u.pathname === '/api/ux-studio/workspace-guide')
                        return send(200, {text: await workspaces.guide(u.searchParams.get('workspace'), u.searchParams.get('file') || 'USER_GUIDE.md')});
                    const postRoutes = ['/api/ux-studio/project', '/api/ux-studio/baseline', '/api/ux-studio/workspace-select', '/api/ux-studio/workspace-decision'];
                    let body;
                    if (req.method === 'POST' && postRoutes.includes(u.pathname)) {
                        if (req.headers.origin !== origin || !req.headers['content-type']?.startsWith('application/json'))
                            return send(403, {error: '같은 도구의 JSON 저장만 허용합니다.'});
                        const chunks = [];
                        let size = 0;
                        for await (const c of req) {
                            size += c.length;
                            if (size > 2000000) return send(413, {error: '설계 파일이 너무 큽니다.'});
                            chunks.push(c);
                        }
                        body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
                        if (!body || typeof body !== 'object' || Array.isArray(body)) throw Error('요청 형식 오류');
                        if (u.pathname === '/api/ux-studio/workspace-select') {
                            if (Object.keys(body).length) throw Error('폴더는 네이티브 선택 창으로만 지정할 수 있습니다.');
                            return send(200, await workspaces.select());
                        }
                        if (u.pathname === '/api/ux-studio/workspace-decision') {
                            if (Object.keys(body).some(key => key !== 'decision')) throw Error('변환 선택 요청 형식 오류');
                            return send(200, {workspace: await workspaces.decision(u.searchParams.get('workspace'), body.decision)});
                        }
                    }
                    if (req.method === 'GET' && u.pathname === '/api/ux-studio/catalog')
                        return send(200, {
                            catalog: await readFeatureCatalog(root)
                        });
                    if (req.method === 'GET' && u.pathname === '/api/ux-studio/projects') {
                        const target = await storage(false);
                        const safe = await ensureSafeRoot(target.root, target.dir);
                        const projects = [];
                        for (const name of await readdir(safe))
                            if (name.endsWith('.json') && ID.test(name.slice(0, -5))) {
                                const d = await readDocument(join(safe, name));
                                projects.push({
                                    id: d.projectId, name: d.name, revision: d.revision
                                });
                            }
                        return send(200, {
                            projects
                        });
                    }
                    if (req.method === 'GET' && u.pathname === '/api/ux-studio/project') {
                        const id = u.searchParams.get('id');
                        if (!ID.test(id || ''))
                            return send(400, {
                                error: '프로젝트 ID 오류'
                            });
                        const target = await storage(false);
                        const safe = await ensureSafeRoot(target.root, target.dir);
                        const d = await readDocument(join(safe, id + '.json'));
                        return d ? send(200, {
                            document: d
                        }) : send(404, {
                            error: '아직 저장된 설계가 없습니다.'
                        });
                    }
                    if (req.method === 'GET' && u.pathname === '/api/ux-studio/baselines') {
                        const target = await storage(false);
                        return send(200, { baselines: await listBaselines(target.root, target.dir, u.searchParams.get('id')) });
                    }
                    if (req.method === 'GET' && u.pathname === '/api/ux-studio/baseline') {
                        const target = await storage(false);
                        const document = await readBaseline(target.root, target.dir, u.searchParams.get('id'), u.searchParams.get('stage'), Number(u.searchParams.get('revision')));
                        return document ? send(200, { document }) : send(404, { error: '기준판이 없습니다.' });
                    }
                    if (req.method === 'POST' && ['/api/ux-studio/project', '/api/ux-studio/baseline'].includes(u.pathname)) {
                        const target = await storage(true);
                        if (u.pathname === '/api/ux-studio/baseline') {
                            const document = await saveBaseline(target.root, target.dir, body.projectId, body.stage, body.expectedRevision);
                            return send(200, { document });
                        }
                        const { document, expectedRevision } = body;
                        if (expectedRevision === undefined)
                            throw Error('기준 버전이 없습니다.');
                        const d = await saveDocument(target.root, target.dir, document, expectedRevision);
                        return send(200, {
                            document: d
                        });
                    }
                    return send(405, {
                        error: '지원하지 않는 요청입니다.'
                    });
                }
                catch (e) {
                    return send(e.status || 400, {
                        error: e.message || '저장 요청 오류'
                    });
                }
            });
        }
    };
}
