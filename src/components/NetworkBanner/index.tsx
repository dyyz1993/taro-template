/**
 * 顶部网络状态条
 * - 离线时显示，可点击重试
 * - 联网中不渲染
 */
import { View, Text } from '@tarojs/components'
import { Icon } from '@/components/Icon';
import { useNetworkStatus } from '@/utils/network';
import './index.scss';

interface NetworkBannerProps {
  onRetry?: () => void;
}

export function NetworkBanner({ onRetry }: NetworkBannerProps) {
  const { online, type } = useNetworkStatus();
  if (online) return null;

  return (
    <View className='tpl-net-banner' onClick={onRetry}>
      <Text className='tpl-net-banner__icon'><Icon name='wifi-off' size={20} color='#FFF' /></Text>
      <Text className='tpl-net-banner__text'>网络已断开{type !== 'unknown' && type !== 'none' ? `（${type}）` : ''}，请检查后点击重试</Text>
    </View>
  );
}
