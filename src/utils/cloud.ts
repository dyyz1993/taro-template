// =====================================================================
// 数据访问桥接层 — 双平台 + 三态切换
//
// 这是模板的核心抽象：业务代码统一调 dbQuery / dbAdd / dbUpdate / dbDelete，
// 底层根据平台和配置自动选择数据源：
//
//   weapp（微信小程序）→ wx.cloud.callFunction('db', ...)
//   H5（有 apiBase）  → fetch(`${apiBase}/${collection}`, ...)
//   H5（无 apiBase）  → localStorage mock（开箱即用，无需后端）
//
// H5 端 apiBase 可运行时注入：URL 加 ?api=<url> 即时切换并记忆，无需重新打包。
// =====================================================================

let _isCloudReady = false;
/** H5 真后端 base，形如 'https://xxx.ap-shanghai.app.tcloudbase.com/api'。空 = 用 mock */
let _apiBase = '';

/** 设置 H5 真后端 base。传空字符串恢复 mock 模式。 */
export function setApiBase(base: string): void {
  _apiBase = (base || '').replace(/\/+$/, '');
}
export function getApiBase(): string {
  return _apiBase;
}

// localStorage 记忆 H5 端 API base（跨刷新保留）
const API_BASE_STORAGE_KEY = '__taro_template_api_base';

/**
 * H5 端运行时注入 API base（构建后可配，无需重新打包）。
 *
 * 优先级：
 *   1. URL 参数 `?api=<url>`        —— 即时切换并记忆到 localStorage
 *      `?api=`（空）或 `?api=mock`  —— 清除，回退 mock 模式
 *   2. localStorage 记忆值           —— 恢复上次设置
 *   3. 都没有                        —— 空，走 mock（开发调试）
 *
 * 仅 H5 端有效；小程序端走 wx.cloud.callFunction，不受影响。
 */
export function initApiBaseFromEnv(): void {
  // #ifdef H5
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get('api');

  if (fromUrl !== null) {
    // URL 显式传参（含空串 / 'mock'）：以本次为准并持久化
    const base = fromUrl && fromUrl !== 'mock' ? fromUrl : '';
    setApiBase(base);
    try { localStorage.setItem(API_BASE_STORAGE_KEY, base); } catch {}
    return;
  }

  // 无 URL 参数：回退 localStorage 记忆
  try {
    const saved = localStorage.getItem(API_BASE_STORAGE_KEY);
    if (saved) setApiBase(saved);
  } catch {}
  // #endif
}

/**
 * 初始化微信云开发（仅 weapp 平台）。
 * @param envId 云开发环境 ID（必传，从 project.config.json 的 cloudbaseEnvId 读取）
 */
export async function initCloud(envId: string): Promise<void> {
  if (_isCloudReady) return;
  // #ifdef MP-WEIXIN
  try {
    // @ts-ignore
    if (typeof wx !== 'undefined' && (wx as any).cloud) {
      // @ts-ignore
      (wx as any).cloud.init({ env: envId, traceUser: true });
      _isCloudReady = true;
    }
  } catch (e) {
    console.warn('[cloud] init failed', e);
  }
  // #endif
  _isCloudReady = true;
}

/** 调用云函数（weapp 专用，H5 端走 mock） */
export async function callFn(name: string, data?: Record<string, unknown>): Promise<unknown> {
  // #ifdef MP-WEIXIN
  // @ts-ignore
  if (typeof wx !== 'undefined' && (wx as any).cloud) {
    // @ts-ignore
    const res = await (wx as any).cloud.callFunction({ name, data });
    if (res && res.result && (res.result as any).code !== 0) {
      throw new Error((res.result as any).msg || '云函数错误');
    }
    return (res?.result?.data ?? res?.result) as any;
  }
  // #endif
  return mockCloudFn(name, data);
}

/** H5 真后端调用（fetch API） */
async function callApi(
  method: string,
  path: string,
  payload?: any,
  headers?: Record<string, string>
): Promise<any> {
  if (!_apiBase) throw new Error('api base not set, call setApiBase() first');
  const url = new URL(_apiBase + path);
  if (method === 'GET' && payload) {
    // 把 payload 序列化到 query string
    if (payload.where) url.searchParams.set('where', JSON.stringify(payload.where));
    if (payload.page) url.searchParams.set('page', String(payload.page));
    if (payload.pageSize) url.searchParams.set('pageSize', String(payload.pageSize));
    if (payload.orderBy) url.searchParams.set('orderBy', payload.orderBy);
    if (payload.orderDir) url.searchParams.set('orderDir', payload.orderDir);
  }
  const resp = await fetch(url.toString(), {
    method,
    headers: { 'Content-Type': 'application/json', ...(headers || {}) },
    body: method === 'GET' || method === 'DELETE' ? undefined : JSON.stringify(payload || {})
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const body = await resp.json();
  if (body && body.code !== undefined && body.code !== 0) {
    throw new Error(body.msg || 'api error');
  }
  return body.data !== undefined ? body.data : body;
}

// =====================================================================
// 统一 CRUD 接口 —— 业务代码只关心这几个函数
// =====================================================================

/** 数据库操作路由（内部） */
async function dbCall(action: string, collection: string, extra: Record<string, any> = {}): Promise<any> {
  // #ifdef MP-WEIXIN
  // @ts-ignore
  if (typeof wx !== 'undefined' && (wx as any).cloud) {
    return callFn('db', { action, collection, ...extra });
  }
  // #endif
  // H5：优先走真后端
  if (_apiBase) {
    return dbCallApi(action, collection, extra);
  }
  return mockCloudFn('db', { action, collection, ...extra });
}

/** H5 真后端 CRUD 路由（与 cloudfunctions/api 云函数约定） */
async function dbCallApi(action: string, collection: string, extra: Record<string, any>): Promise<any> {
  if (action === 'query') {
    return await callApi('GET', `/${collection}`, {
      where: extra.where, page: extra.page, pageSize: extra.pageSize
    });
  }
  if (action === 'add') {
    return await callApi('POST', `/${collection}`, { action: 'add', doc: extra.doc });
  }
  if (action === 'update') {
    return await callApi('POST', `/${collection}`, { action: 'update', where: extra.where, update: extra.update });
  }
  if (action === 'remove') {
    return await callApi('DELETE', `/${collection}`, { where: extra.where });
  }
  if (action === 'count') {
    return await callApi('GET', `/${collection}/count`, { where: extra.where });
  }
  throw new Error(`unknown action: ${action}`);
}

// ---- 业务代码统一调用以下 5 个函数 ----

/** 查询集合，返回匹配的文档数组 */
export function dbQuery<T = any>(collection: string, where: Record<string, any> = {}): Promise<T[]> {
  return dbCall('query', collection, { where });
}

/** 新增文档，返回带 _id 的完整文档 */
export function dbAdd<T = any>(collection: string, doc: Record<string, any>): Promise<{ _id: string } & T> {
  return dbCall('add', collection, { doc });
}

/** 按条件更新，返回更新条数 */
export function dbUpdate(
  collection: string,
  where: Record<string, any>,
  update: Record<string, any>
): Promise<{ updated: number }> {
  return dbCall('update', collection, { where, update });
}

/** 按条件删除，返回删除条数 */
export function dbDelete(collection: string, where: Record<string, any>): Promise<{ deleted: number }> {
  return dbCall('remove', collection, { where });
}

/** 计数，返回匹配条数 */
export function dbCount(collection: string, where: Record<string, any> = {}): Promise<{ total: number }> {
  return dbCall('count', collection, { where });
}

// =====================================================================
// H5 端 Mock 实现（开发调试用，开箱即用无需后端）
//
// 用 localStorage 模拟一个最小可用的文档数据库：
//   - 支持精确匹配 + $in / $ne / $exists 操作符
//   - 集合按名动态创建，无需预定义
//   - _id 格式与云函数一致（24 位 hex）
// =====================================================================

const MOCK_DB_KEY = '__taro_template_mock_db';

/** 生成 24 位 hex id，模拟云函数 db.collection().add() 的 _id 格式 */
function mockId(): string {
  const ts = Date.now().toString(16).padStart(8, '0');
  const rand = Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0');
  const rand2 = Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0');
  return (ts + rand + rand2).slice(0, 24);
}

function readDB(): Record<string, any[]> {
  try {
    const raw = localStorage.getItem(MOCK_DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}
function writeDB(db: Record<string, any[]>): void {
  try { localStorage.setItem(MOCK_DB_KEY, JSON.stringify(db)); } catch {}
}

/** 检查一条记录是否匹配 where 条件（支持精确匹配 / $in / $ne / $exists） */
function matchRow(d: any, w: any): boolean {
  return Object.keys(w).every(k => {
    const v = w[k];
    if (v && typeof v === 'object') {
      if ('$in' in v) return Array.isArray(v.$in) && v.$in.includes(d[k]);
      if ('$ne' in v) return d[k] !== v.$ne;
      if ('$exists' in v) return (k in d) === !!v.$exists;
    }
    return d[k] === v;
  });
}

async function mockCloudFn(name: string, data?: any): Promise<any> {
  await new Promise(r => setTimeout(r, 80)); // 模拟网络延迟
  if (name !== 'db') return {};
  const { action, collection, where = {}, doc, update } = data;
  const db = readDB();
  const list = db[collection] || [];
  db[collection] = list;

  if (action === 'query') {
    return list.filter((d: any) => matchRow(d, where));
  }
  if (action === 'add') {
    const _id = mockId();
    const now = new Date().toISOString();
    const row = { _id, ...doc, createdAt: doc.createdAt || now, updatedAt: now };
    list.push(row);
    writeDB(db);
    return { _id, ...row };
  }
  if (action === 'update') {
    let n = 0;
    db[collection] = list.map((d: any) => {
      if (matchRow(d, where)) {
        n++;
        return { ...d, ...update, updatedAt: new Date().toISOString() };
      }
      return d;
    });
    writeDB(db);
    return { updated: n };
  }
  if (action === 'remove') {
    const kept = list.filter((d: any) => !matchRow(d, where));
    db[collection] = kept;
    writeDB(db);
    return { deleted: list.length - kept.length };
  }
  if (action === 'count') {
    return { total: list.filter((d: any) => matchRow(d, where)).length };
  }
  return null;
}
