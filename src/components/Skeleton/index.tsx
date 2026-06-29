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
      <View className='tpl-skeleton'>
        {items.map((_, i) => (
          <View key={i} className='tpl-skeleton__line' style={{ width: `${60 + Math.random() * 30}%` }} />
        ))}
      </View>
    );
  }

  if (type === 'list') {
    return (
      <View className='tpl-skeleton'>
        {items.map((_, i) => (
          <View key={i} className='tpl-skeleton__row'>
            <View className='tpl-skeleton__avatar' />
            <View className='tpl-skeleton__content'>
              <View className='tpl-skeleton__line' style={{ width: '70%' }} />
              <View className='tpl-skeleton__line' style={{ width: '40%' }} />
            </View>
          </View>
        ))}
      </View>
    );
  }

  // card
  return (
    <View className='tpl-skeleton'>
      <View className='tpl-skeleton__card-grid'>
        {items.map((_, i) => (
          <View key={i} className='tpl-skeleton__card'>
            <View className='tpl-skeleton__card-icon' />
            <View className='tpl-skeleton__line' style={{ width: '60%', margin: '0 auto' }} />
            <View className='tpl-skeleton__line' style={{ width: '40%', margin: '8rpx auto 0' }} />
          </View>
        ))}
      </View>
      <View className='tpl-skeleton__section'>
        <View className='tpl-skeleton__line' style={{ width: '50%' }} />
        <View className='tpl-skeleton__row' style={{ marginTop: '16rpx' }}>
          <View className='tpl-skeleton__avatar' />
          <View className='tpl-skeleton__content'>
            <View className='tpl-skeleton__line' style={{ width: '80%' }} />
            <View className='tpl-skeleton__line' style={{ width: '50%' }} />
          </View>
        </View>
      </View>
    </View>
  );
}
