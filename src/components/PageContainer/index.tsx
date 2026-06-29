import { PropsWithChildren, CSSProperties } from 'react';
import { View } from '@tarojs/components';
import { NavBar } from '@/components/NavBar';
import './index.scss';

interface PageContainerProps {
  title?: string;
  showBack?: boolean;
  background?: string;
  navRight?: React.ReactNode;
  navFixed?: boolean;
  noTabBar?: boolean;
  bodyStyle?: CSSProperties;
  className?: string;
}

export function PageContainer({
  title,
  showBack,
  background,
  navRight,
  navFixed,
  children,
  noTabBar,
  bodyStyle,
  className = ''
}: PropsWithChildren<PageContainerProps>) {
  return (
    <View className={`dlm-page ${className}`}>
      {title && <NavBar title={title} showBack={showBack} background={background} right={navRight} fixed={navFixed !== false} />}
      <View className='dlm-page__body' style={bodyStyle}>
        {children}
      </View>
    </View>
  );
}
