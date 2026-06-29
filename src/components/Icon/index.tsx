// =====================================================================
// Icon 组件 — 平台自动选择
// weapp → index.weapp.tsx, H5 → index.h5.tsx
// 此文件作为类型兼容兜底，不引入 lucide-react
//
// 图标名采用 kebab-case（如 'chevron-left'），与 lucide-react 命名一致。
// weapp 端通过 SVG_PATHS 内置 path 渲染；H5 端通过 lucide-react 动态查表。
// 新增图标：在 index.weapp.tsx 的 SVG_PATHS 添加 path 即可（H5 端自动支持）。
// =====================================================================
import { CSSProperties } from 'react';
import { View, Image } from '@tarojs/components';

// 与 index.weapp.tsx 保持同步的通用图标集（此处仅用于类型兜底，实际渲染走平台分支）
const SVG_PATHS: Record<string, string> = {
  home: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  search: 'M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M21 21l-4.35-4.35'
};

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}

export function Icon({ name, size = 24, color, className, style }: IconProps) {
  const strokeColor = color || '#1A1A1A';
  const path = SVG_PATHS[name] || SVG_PATHS['home'];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${path}"/></svg>`;
  const dataUri = `data:image/svg+xml,${encodeURIComponent(svg)}`;

  return (
    <Image
      className={className}
      src={dataUri}
      style={{ width: `${size}rpx`, height: `${size}rpx`, display: 'inline-block', flexShrink: 0, ...style }}
    />
  );
}
