/**
 * 全局错误边界（React ErrorBoundary）
 * - 捕获子树渲染错误，避免整页白屏
 * - 用户态：友好降级 + 重试
 * - 开发者态：console 上报原始 error / info
 */
import { Component, ErrorInfo, PropsWithChildren, ReactNode } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';

interface State {
  hasError: boolean;
  errMsg?: string;
}

interface Props {
  /** 自定义降级 UI（不传则用默认） */
  fallback?: (err: Error | undefined, reset: () => void) => ReactNode;
  /** 错误回调（用于上报埋点） */
  onError?: (error: Error, info: ErrorInfo) => void;
  /** 点「回首页」时 reLaunch 的目标路径 */
  homePath?: string;
}

export class ErrorBoundary extends Component<PropsWithChildren<Props>, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errMsg: error?.message || '页面出错了' };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // 真实项目里这里接 Sentry / 自家埋点
    console.error('[ErrorBoundary]', error, info);
    this.props.onError?.(error, info);
  }

  reset = () => {
    this.setState({ hasError: false, errMsg: undefined });
  };

  goHome = () => {
    try {
      Taro.reLaunch({ url: this.props.homePath || '/pages/index/index' });
    } catch {
      // ignore
    }
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback) {
      return this.props.fallback(new Error(this.state.errMsg), this.reset);
    }

    return (
      <View className='dlm-error'>
        <View className='dlm-error__icon'>⚠️</View>
        <Text className='dlm-error__title'>页面遇到点问题</Text>
        <Text className='dlm-error__desc'>{this.state.errMsg}</Text>
        <View className='dlm-error__actions'>
          <View className='dlm-error__btn' onClick={this.reset}>重试</View>
          <View className='dlm-error__btn dlm-error__btn--primary' onClick={this.goHome}>回首页</View>
        </View>
      </View>
    );
  }
}
