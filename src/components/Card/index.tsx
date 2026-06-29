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
    <View className={`dlm-card ${className}`} style={style} onClick={onClick}>
      {(title || extra) && (
        <View className='dlm-card__head'>
          {title && <Text className='dlm-card__title'>{title}</Text>}
          {extra && <View className='dlm-card__extra'>{extra}</View>}
        </View>
      )}
      <View className='dlm-card__body' style={bodyStyle}>
        {children}
      </View>
    </View>
  );
}
