import { PropsWithChildren, CSSProperties } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Icon } from '@/components/Icon';
import './index.scss';

interface NavBarProps {
  title?: string;
  showBack?: boolean;
  /** 在左上角显示首页图标，扫码入口页可用 */
  showHome?: boolean;
  /** 返回失败 / 点首页时跳转的目标 tab 路径（默认首页） */
  homePath?: string;
  background?: string;
  color?: string;
  right?: React.ReactNode;
  fixed?: boolean;
  /** 直接放页面根时使用 true */
  root?: boolean;
  style?: CSSProperties;
}

function getMetrics() {
  if (process.env.TARO_ENV === 'weapp') {
    const menuRect = Taro.getMenuButtonBoundingClientRect?.();
    const sys = Taro.getSystemInfoSync?.();
    const statusBarHeight = sys?.statusBarHeight || 20;
    const menuGap = menuRect ? menuRect.top - statusBarHeight : 4;
    // 导航栏总高度 = 状态栏 + 胶囊下沿 + 底部留白
    // 胶囊高度通常 ~32px，顶边距 ~48px → 胶囊下沿 ~80px
    // 标准 navHeight ≈ 86～88px
    const navHeight = menuRect ? menuRect.bottom + 6 : 88;
    const windowWidth = sys?.windowWidth || 375;
    // 胶囊宽度约 87px，留出右侧避免标题被挡住
    const rightGap = menuRect ? windowWidth - menuRect.right + 12 : 0;
    return { statusBarHeight, menuGap, navHeight, windowWidth, rightGap };
  }
  return { statusBarHeight: 0, menuGap: 4, navHeight: 44, windowWidth: 375, rightGap: 0 };
}

/**
 * 自定义导航栏
 * - 自动计算状态栏高度
 * - 自动处理右上角胶囊留白
 */
export function NavBar({
  title,
  showBack = true,
  showHome = false,
  homePath = '/pages/index/index',
  background = '#FFFFFF',
  color = '#1A1A1A',
  right,
  fixed = true,
  root = false,
  style
}: PropsWithChildren<NavBarProps>) {
  const { statusBarHeight, menuGap, navHeight, windowWidth, rightGap } = getMetrics();

  const innerStyle: CSSProperties = {
    height: `${navHeight}px`,
    paddingTop: `${statusBarHeight}px`,
    background,
    color
  };

  const centerStyle: CSSProperties = {
    marginRight: `${Math.max(rightGap, menuGap)}px`,
    height: `${navHeight - statusBarHeight}px`
  };

  return (
    <View className={`dlm-navbar ${fixed ? 'dlm-navbar--fixed' : ''} ${root ? 'dlm-navbar--root' : ''}`} style={{ ...innerStyle, ...style }}>
      <View className='dlm-navbar__inner' style={centerStyle}>
        {showBack && (
          <View className='dlm-navbar__back' onClick={() => Taro.navigateBack({ fail: () => Taro.switchTab({ url: homePath }) })}>
            <Text className='iconfont icon-back'>‹</Text>
          </View>
        )}
        {showHome && (
          <View className='dlm-navbar__home' onClick={() => Taro.switchTab({ url: homePath })}>
            <Icon name='home' size={32} color='#1A1A1A' />
          </View>
        )}
        {title && <View className='dlm-navbar__title'>{title}</View>}
        {right && <View className='dlm-navbar__right'>{right}</View>}
      </View>
    </View>
  );
}
