/**
 * Jest 全局 setup：localStorage polyfill
 * H5 端的 mock DB 依赖 localStorage，需要在 node env 下提供最小实现
 */
class LocalStorageMock {
  constructor() { this.store = new Map(); }
  get length() { return this.store.size; }
  key(i) { return Array.from(this.store.keys())[i] || null; }
  getItem(k) { return this.store.has(k) ? this.store.get(k) : null; }
  setItem(k, v) { this.store.set(String(k), String(v)); }
  removeItem(k) { this.store.delete(k); }
  clear() { this.store.clear(); }
}

const ls = new LocalStorageMock();
// 同时挂到 global、globalThis、window（如果存在）以兼容不同作用域
try { Object.defineProperty(globalThis, 'localStorage', { value: ls, writable: true, configurable: true }); } catch {}
try { (global).localStorage = ls; } catch {}
try { if (typeof window !== 'undefined') window.localStorage = ls; } catch {}
