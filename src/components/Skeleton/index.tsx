import { View } from '@tarojs/components';
import './index.scss';

interface SkeletonProps {
  type?: 'card' | 'list' | 'text';
  count?: number;
}

export function Skeleton({ type = 'card', count = 3 }: SkeletonProps) {
  const items = Array.from({ length: count });

  if (type === 'text') {
    return (
      <View className='dlm-skeleton'>
        {items.map((_, i) => (
          <View key={i} className='dlm-skeleton__line' style={{ width: `${60 + Math.random() * 30}%` }} />
        ))}
      </View>
    );
  }

  if (type === 'list') {
    return (
      <View className='dlm-skeleton'>
        {items.map((_, i) => (
          <View key={i} className='dlm-skeleton__row'>
            <View className='dlm-skeleton__avatar' />
            <View className='dlm-skeleton__content'>
              <View className='dlm-skeleton__line' style={{ width: '70%' }} />
              <View className='dlm-skeleton__line' style={{ width: '40%' }} />
            </View>
          </View>
        ))}
      </View>
    );
  }

  // card
  return (
    <View className='dlm-skeleton'>
      <View className='dlm-skeleton__card-grid'>
        {items.map((_, i) => (
          <View key={i} className='dlm-skeleton__card'>
            <View className='dlm-skeleton__card-icon' />
            <View className='dlm-skeleton__line' style={{ width: '60%', margin: '0 auto' }} />
            <View className='dlm-skeleton__line' style={{ width: '40%', margin: '8rpx auto 0' }} />
          </View>
        ))}
      </View>
      <View className='dlm-skeleton__section'>
        <View className='dlm-skeleton__line' style={{ width: '50%' }} />
        <View className='dlm-skeleton__row' style={{ marginTop: '16rpx' }}>
          <View className='dlm-skeleton__avatar' />
          <View className='dlm-skeleton__content'>
            <View className='dlm-skeleton__line' style={{ width: '80%' }} />
            <View className='dlm-skeleton__line' style={{ width: '50%' }} />
          </View>
        </View>
      </View>
    </View>
  );
}
