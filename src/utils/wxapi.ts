import Taro from '@tarojs/taro';

/** 显示消息 */
export function toast(title: string, icon: 'success' | 'error' | 'loading' | 'none' = 'none', duration = 1500) {
  Taro.showToast({ title, icon, duration });
}

/** 弹窗确认 */
export function confirm(content: string, title = '提示'): Promise<boolean> {
  return new Promise((resolve) => {
    Taro.showModal({
      title,
      content,
      success: (res) => resolve(res.confirm),
      fail: () => resolve(false)
    });
  });
}

/** 扫码（weapp 调 wx.scanCode，H5 端返回空串需自行处理） */
export async function scanCode(onlyFromCamera = false): Promise<string> {
  // #ifdef MP-WEIXIN
  return new Promise((resolve, reject) => {
    // @ts-ignore
    wx.scanCode({
      onlyFromCamera,
      scanType: ['qrCode'],
      success: (res: any) => resolve(res.result as string),
      fail: reject
    });
  });
  // #endif
  // #ifdef H5
  // H5 端无原生扫码能力，返回空串。生产环境请接入 H5 扫码库或用输入框 fallback。
  return Promise.resolve('');
  // #endif
}

/** 获取当前位置 */
export async function getLocation(): Promise<{ lat: number; lng: number; address: string }> {
  // #ifdef MP-WEIXIN
  return new Promise((resolve, reject) => {
    // @ts-ignore
    wx.getLocation({
      type: 'gcj02',
      success: (res: any) => resolve({ lat: res.latitude, lng: res.longitude, address: '' }),
      fail: reject
    });
  });
  // #endif
  // #ifdef H5
  return Promise.resolve({ lat: 0, lng: 0, address: '' });
  // #endif
}

/** 选位置（带逆地理编码） */
export async function chooseLocation(): Promise<{ lat: number; lng: number; address: string }> {
  // #ifdef MP-WEIXIN
  return new Promise((resolve, reject) => {
    // @ts-ignore
    wx.chooseLocation({
      success: (res: any) => resolve({ lat: res.latitude, lng: res.longitude, address: res.address + res.name }),
      fail: reject
    });
  });
  // #endif
  // #ifdef H5
  return Promise.resolve({ lat: 0, lng: 0, address: '' });
  // #endif
}

/** 复制到剪贴板 */
export async function copyText(text: string): Promise<void> {
  Taro.setClipboardData({ data: text });
}

/** 调起授权 */
export async function authorize(scope: string): Promise<boolean> {
  // #ifdef MP-WEIXIN
  return new Promise((resolve) => {
    // @ts-ignore
    wx.authorize({
      scope,
      success: () => resolve(true),
      fail: () => resolve(false)
    });
  });
  // #endif
  // #ifdef H5
  return Promise.resolve(true);
  // #endif
}

/** 拨打电话 */
export function callPhone(phone: string) {
  Taro.makePhoneCall({ phoneNumber: phone, fail: () => {} });
}

/**
 * 发起订阅消息授权（一次性订阅）。
 * @param tmplId 模板消息 ID，在微信公众平台 → 订阅消息中申请
 */
export async function requestNotifySubscribe(tmplId: string): Promise<boolean> {
  // #ifdef MP-WEIXIN
  try {
    const res = await new Promise<any>((resolve, reject) => {
      // @ts-ignore
      wx.requestSubscribeMessage({ tmplIds: [tmplId], success: resolve, fail: reject });
    });
    return res?.[tmplId] === 'accept';
  } catch {
    return false;
  }
  // #endif
  return false;
}
