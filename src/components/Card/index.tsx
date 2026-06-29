import { PropsWithChildren, CSSProperties } from 'react';
import { View, Text } from '@tarojs/components';
import './index.scss';

interface CardProps {
  title?: string;
  extra?: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  bodyStyle?: CSSProperties;
}

export function Card({ title, extra, children, className = '', style, onClick, bodyStyle }: PropsWithChildren<CardProps>) {
  return (
    <View className={`tpl-card ${className}`} style={style} onClick={onClick}>
      {(title || extra) && (
        <View className='tpl-card__head'>
          {title && <Text className='tpl-card__title'>{title}</Text>}
          {extra && <View className='tpl-card__extra'>{extra}</View>}
        </View>
      )}
      <View className='tpl-card__body' style={bodyStyle}>
        {children}
      </View>
    </View>
  );
}
