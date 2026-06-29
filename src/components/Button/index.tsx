import { PropsWithChildren, CSSProperties } from 'react';
import { View } from '@tarojs/components';
import './index.scss';

interface ButtonProps {
  type?: 'primary' | 'secondary' | 'warning' | 'danger' | 'ghost' | 'orange';
  size?: 'lg' | 'md' | 'sm';
  block?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
  /** 在底部固定 */
  fixedBottom?: boolean;
}

/** 主按钮（绿色填充） */
export function PrimaryButton({ children, fixedBottom, block, onClick, disabled, loading, className = '', style }: PropsWithChildren<ButtonProps>) {
  return (
    <View
      className={`dlm-btn-wrap ${fixedBottom ? 'dlm-btn-wrap--fixed' : ''} ${className}`}
      style={style}
    >
      <View
        className={`dlm-btn dlm-btn--primary ${block ? 'is-block' : ''} ${disabled || loading ? 'is-disabled' : ''}`}
        onClick={() => !disabled && !loading && onClick?.()}
      >
        {loading ? '加载中...' : children}
      </View>
    </View>
  );
}

/** 次按钮（白底绿边） */
export function SecondaryButton({ children, fixedBottom, block, onClick, disabled, className = '', style }: PropsWithChildren<ButtonProps>) {
  return (
    <View
      className={`dlm-btn-wrap ${fixedBottom ? 'dlm-btn-wrap--fixed' : ''} ${className}`}
      style={style}
    >
      <View
        className={`dlm-btn dlm-btn--secondary ${block ? 'is-block' : ''} ${disabled ? 'is-disabled' : ''}`}
        onClick={() => !disabled && onClick?.()}
      >
        {children}
      </View>
    </View>
  );
}

/** 通用按钮 */
export function Button({ children, type = 'primary', size = 'lg', block, disabled, loading, onClick, className = '', style, fixedBottom }: PropsWithChildren<ButtonProps>) {
  return (
    <View
      className={`dlm-btn-wrap ${fixedBottom ? 'dlm-btn-wrap--fixed' : ''} ${className}`}
      style={style}
    >
      <View
        className={`dlm-btn dlm-btn--${type} dlm-btn--${size} ${block ? 'is-block' : ''} ${disabled || loading ? 'is-disabled' : ''}`}
        onClick={() => !disabled && !loading && onClick?.()}
      >
        {loading ? '加载中...' : children}
      </View>
    </View>
  );
}
