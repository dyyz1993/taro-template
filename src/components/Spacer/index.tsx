import { View } from '@tarojs/components';

interface SpacerProps {
  height?: number;
  width?: number;
}

/** 透明占位组件，替代 View style={{ height: 'XXrpx' }} */
export function Spacer({ height, width }: SpacerProps) {
  return (
    <View
      style={{
        height: height ? `${height}rpx` : undefined,
        width: width ? `${width}rpx` : undefined,
        flexShrink: 0
      }}
    />
  );
}
