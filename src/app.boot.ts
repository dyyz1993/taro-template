// app.boot.ts — H5 端启动入口
// prebundle 关闭后需要手动提供 boot 文件
import { createReactApp } from '@tarojs/plugin-framework-react/dist/runtime';
import App from './app';

const appConfig = (require('./app.config').default || {}) as any;

createReactApp(App, appConfig);
