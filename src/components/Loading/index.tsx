/**
 * 通用加载占位（页内 / 全屏）
 */
import { View, Text } from '@tarojs/components';
import './index.scss';

interface LoadingProps {
  text?: string;
  fullscreen?: boolean;
  inline?: boolean;
}

export function Loading({ text = '加载中…', fullscreen, inline }: LoadingProps) {
  return (
    <View className={`tpl-loading ${fullscreen ? 'tpl-loading--full' : ''} ${inline ? 'tpl-loading--inline' : ''}`}>
      <View className='tpl-loading__spinner' />
      {text && <Text className='tpl-loading__text'>{text}</Text>}
    </View>
  );
}
