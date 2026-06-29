// 简易本地存储
export function setItem<T>(key: string, value: T): void {
  try {
    // #ifdef MP-WEIXIN
    // @ts-ignore
    if (typeof wx !== 'undefined' && wx.setStorageSync) wx.setStorageSync(key, value);
    // #endif
    // #ifdef H5
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, JSON.stringify(value));
    // #endif
  } catch (e) { console.warn('setItem', e); }
}

export function getItem<T = any>(key: string, fallback?: T): T | undefined {
  try {
    // #ifdef MP-WEIXIN
    // @ts-ignore
    if (typeof wx !== 'undefined' && wx.getStorageSync) {
      const v = wx.getStorageSync(key);
      return (v === '' || v === undefined) ? fallback : v;
    }
    // #endif
    // #ifdef H5
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      try { return JSON.parse(raw); } catch { return raw as any; }
    }
    // #endif
    return fallback;
  } catch { return fallback; }
}

export function removeItem(key: string): void {
  try {
    // #ifdef MP-WEIXIN
    // @ts-ignore
    if (typeof wx !== 'undefined' && wx.removeStorageSync) wx.removeStorageSync(key);
    // #endif
    // #ifdef H5
    if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
    // #endif
  } catch {}
}
