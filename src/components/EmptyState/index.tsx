import { CSSProperties } from 'react';
import { View, Text } from '@tarojs/components';
import { Icon } from '@/components/Icon';
import './index.scss';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  desc?: string;
  action?: React.ReactNode;
  style?: CSSProperties;
}

export function EmptyState({ icon, title = '暂无数据', desc, action, style }: EmptyStateProps) {
  const iconNode = typeof icon === 'string' ? <Icon name={icon} size={48} color='#AEAEB2' /> : icon;
  return (
    <View className='dlm-empty' style={style}>
      <View className='dlm-empty__icon'>{iconNode || <Icon name="inbox" size={48} color='#AEAEB2' />}</View>
      <Text className='dlm-empty__title'>{title}</Text>
      {desc && <Text className='dlm-empty__desc'>{desc}</Text>}
      {action && <View className='dlm-empty__action'>{action}</View>}
    </View>
  );
}
