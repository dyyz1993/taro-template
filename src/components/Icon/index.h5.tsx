// =====================================================================
// Icon 组件 — H5 专用
// 用 lucide-react React 组件渲染
// =====================================================================
import { CSSProperties } from 'react';
import { View } from '@tarojs/components';
import * as Lucide from 'lucide-react';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}

export function Icon({ name, size = 24, color, className, style }: IconProps) {
  const strokeColor = color || '#1A1A1A';
  const LucideIcon = (Lucide as any)[toPascalCase(name)];
  if (LucideIcon) {
    return (
      <View
        className={className}
        style={{
          width: `${size}rpx`,
          height: `${size}rpx`,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          verticalAlign: 'middle',
          ...style
        }}
      >
        <LucideIcon size={size} color={strokeColor} />
      </View>
    );
  }
  return null;
}

/** home → Home, qr-code → QrCode */
function toPascalCase(kebab: string): string {
  return kebab
    .split('-')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}
