/**
 * 网络状态感知
 * - H5: navigator.onLine + online/offline 事件
 * - weapp: wx.onNetworkStatusChange + wx.getNetworkType
 * - 返回 { online, type }；type 在 H5 上为 'unknown' 或 'none'/'wifi'/'4g' 等
 */
import { useEffect, useState } from 'react';

export type NetType = 'wifi' | '2g' | '3g' | '4g' | '5g' | 'ethernet' | 'none' | 'unknown';
export interface NetStatus {
  online: boolean;
  type: NetType;
}

// 在 SSR / 测试环境下 navigator 不存在，假定在线
function readInitialH5(): NetStatus {
  if (typeof navigator === 'undefined') return { online: true, type: 'unknown' };
  return { online: navigator.onLine, type: 'unknown' };
}

async function readInitialWeapp(): Promise<NetStatus> {
  return new Promise((resolve) => {
    try {
      // @ts-ignore
      wx.getNetworkType({
        success: (res: any) => resolve({ online: res.networkType !== 'none', type: res.networkType as NetType }),
        fail: () => resolve({ online: true, type: 'unknown' })
      });
    } catch { resolve({ online: true, type: 'unknown' }); }
  });
}

// 根据平台给出合适的初始值，避免渲染时 online 状态闪烁
function getInitial(): NetStatus {
  // #ifdef H5
  return readInitialH5();
  // #endif
  // #ifdef MP-WEIXIN
  // 微信小程序：首屏渲染时假定在线，等 useEffect 里再校正
  return { online: true, type: 'unknown' };
  // #endif
  return { online: true, type: 'unknown' };
}

export function useNetworkStatus(): NetStatus {
  const [status, setStatus] = useState<NetStatus>(getInitial);

  useEffect(() => {
    let unbind: (() => void) | undefined;
    // #ifdef H5
    // H5 已经在 useState 初始化时拿到了 navigator.onLine，这里只挂事件
    const onOnline = () => setStatus({ online: true, type: 'unknown' });
    const onOffline = () => setStatus({ online: false, type: 'none' });
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    unbind = () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
    // #endif
    // #ifdef MP-WEIXIN
    readInitialWeapp().then(setStatus);
    // @ts-ignore
    const handler = (res: any) => setStatus({ online: res.isConnected, type: (res.networkType || 'unknown') as NetType });
    try { wx.onNetworkStatusChange(handler); } catch { /* ignore */ }
    unbind = () => {
      try { wx.offNetworkStatusChange?.(handler); } catch { /* ignore */ }
    };
    // #endif
    return () => unbind?.();
  }, []);

  return status;
}
