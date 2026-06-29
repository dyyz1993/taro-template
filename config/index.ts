import { defineConfig } from '@tarojs/cli';
import { Config } from '@tarojs/taro';
import * as path from 'path';

export default defineConfig(async (merge, { command, mode }) => {
  const baseConfig: Config = {
    // @ts-ignore — projectName 运行时需要，但不在 Config 类型定义中
    projectName: 'taro-template',
    designWidth: 750,
    deviceRatio: { 640: 2.34 / 2, 750: 1, 828: 1.81 / 2, 375: 2 / 1 },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: [
      '@tarojs/plugin-framework-react',
      '@tarojs/plugin-platform-weapp',
      '@tarojs/plugin-platform-h5'
    ] as unknown as Config['plugins'],
    defineConstants: {},
    copy: { patterns: [], options: {} },
    framework: 'react',
    compiler: 'webpack5',
    cache: { enable: false },
    // 关闭预编译，避免 webpack-virtual-modules 版本不兼容
    // 该配置必须同时出现在顶层和 h5/mini 中才生效
    prebundle: { enable: false },
    sass: {
      resource: ['src/styles/variables.scss', 'src/styles/mixins.scss']
    },
    mini: {
      webpackChain(chain) {
        chain.resolve.alias.set('@', path.resolve(__dirname, '..', 'src'));
        // 开发模式不压缩（调试方便），构建时压缩
        if (command !== 'build') chain.optimization.minimize(false);
      },
      postcss: {
        // NutUI 内部用 px + 自有缩放变量，必须把 nut- 前缀的选择器排除在 pxtransform 之外，否则组件会被二次缩放变形
        pxtransform: { enable: true, config: { selectorBlackList: ['nut-'] } },
        cssModules: { enable: false }
      }
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',
      output: { filename: 'js/[name].[hash:8].js', chunkFilename: 'js/[name].[chunkhash:8].js' },
      miniCssExtractPluginOption: { ignoreOrder: true, filename: 'css/[name].[hash].css' },
      postcss: { autoprefixer: { enable: true } },
      devServer: { port: 10086, host: '0.0.0.0', https: false },
      prebundle: { enable: false },
      webpackChain(chain) {
        chain.resolve.alias.set('@', path.resolve(__dirname, '..', 'src'));
      }
    }
  };

  if (process.env.NODE_ENV === 'development') {
    return merge({}, baseConfig, { defineConstants: { 'process.env.NODE_ENV': '"development"' } });
  }
  return merge({}, baseConfig, { defineConstants: { 'process.env.NODE_ENV': '"production"' } });
});
