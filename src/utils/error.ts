/**
 * 全局错误处理
 * - 全局未捕获 Promise rejection
 * - 全局 JS error
 * - useErrorBus：组件内上报错误并触发 toast
 */
import { useEffect, useState, useCallback } from 'react';
import { toast } from './wxapi';

type Listener = (msg: string) => void;
const listeners = new Set<Listener>();

/** 触发全局错误提示（仅对订阅者生效） */
export function reportError(msg: string) {
  console.error('[error]', msg);
  listeners.forEach(fn => {
    try { fn(msg); } catch { /* ignore */ }
  });
}

/** 内部用：根据类型决定是否弹 toast */
function showUserError(err: unknown) {
  const msg = err instanceof Error ? err.message : typeof err === 'string' ? err : '出错了，请稍后再试';
  // UI 层：toast + 控制台
  toast(msg, 'none', 2000);
  console.error('[globalError]', err);
}

/** 挂载到 app.tsx：监听未捕获错误 */
export function installGlobalErrorHandlers() {
  // #ifdef H5
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (e) => {
      e.preventDefault();
      showUserError(e.reason);
    });
    window.addEventListener('error', (e) => {
      showUserError(e.error || e.message);
    });
  }
  // #endif
  // #ifdef MP-WEIXIN
  try {
    // @ts-ignore
    if (typeof wx !== 'undefined' && wx.onError) {
      // @ts-ignore
      wx.onError((err: string) => showUserError(err));
    }
    // @ts-ignore
    if (typeof wx !== 'undefined' && wx.onUnhandledRejection) {
      // @ts-ignore
      wx.onUnhandledRejection((res: any) => showUserError(res?.reason || res));
    }
  } catch (e) { /* ignore */ }
  // #endif
}

/** 组件内订阅：拿到错误后可自行处理（默认 toast 一次） */
export function useErrorBus(): { message: string | null; clear: () => void } {
  const [message, setMessage] = useState<string | null>(null);
  const clear = useCallback(() => setMessage(null), []);

  useEffect(() => {
    const fn: Listener = (msg) => {
      setMessage(msg);
      toast(msg, 'none', 2000);
    };
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);

  return { message, clear };
}

/** 异步操作包装：自动捕获并 toast */
export async function safeAsync<T>(promise: Promise<T>, fallbackMsg = '操作失败'): Promise<T | undefined> {
  try {
    return await promise;
  } catch (e) {
    const msg = e instanceof Error ? e.message : fallbackMsg;
    showUserError(msg || fallbackMsg);
    return undefined;
  }
}

/** 兼容 Taro API：包一层 try */
export function safeCall<T extends (...args: any[]) => any>(fn: T, _fallbackMsg?: string): T {
  return ((...args: any[]) => {
    try {
      const r = fn(...args);
      if (r && typeof (r as any).catch === 'function') {
        (r as Promise<any>).catch((e: unknown) => showUserError(e));
      }
      return r;
    } catch (e) {
      showUserError(e);
      return undefined as any;
    }
  }) as T;
}
