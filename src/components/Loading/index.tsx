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
    <View className={`dlm-loading ${fullscreen ? 'dlm-loading--full' : ''} ${inline ? 'dlm-loading--inline' : ''}`}>
      <View className='dlm-loading__spinner' />
      {text && <Text className='dlm-loading__text'>{text}</Text>}
    </View>
  );
}
