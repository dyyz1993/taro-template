import { PropsWithChildren } from 'react';
import { useLaunch } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { initCloud, initApiBaseFromEnv } from '@/utils/cloud';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { NetworkBanner } from '@/components/NetworkBanner';
import { installGlobalErrorHandlers } from '@/utils/error';
import './styles/global.scss';

/**
 * 应用入口。
 *
 * 启动时做三件事：
 *   1. 安装全局错误处理器（wx.onError / unhandledrejection）
 *   2. H5 端从 URL ?api= 注入后端 base（可选）
 *   3. weapp 端初始化微信云开发
 *
 * 如需接入登录态（wx.login → openid），在 useLaunch 里追加：
 *   const openid = await callFn('db', { action: 'getOpenid' });
 * 并用 Zustand store 持久化（参考下方注释）。
 */
function App({ children }: PropsWithChildren) {
  useLaunch(() => {
    installGlobalErrorHandlers();
    initApiBaseFromEnv();
    // weapp 端初始化云开发：envId 从 project.config.json 的 cloudbaseEnvId 读取
    // #ifdef MP-WEIXIN
    // initCloud('your-cloud-env-id');
    // #endif
  });

  return (
    <View className='app-root'>
      <NetworkBanner />
      <ErrorBoundary>{children}</ErrorBoundary>
    </View>
  );
}

export default App;
