// =====================================================================
// 页面路由配置
//
// pages 数组第一项 = 小程序默认入口页。
// tabBar 用 text-only 配置（无图标），如需图标参考下方注释。
// =====================================================================
export default defineAppConfig({
  pages: [
    'pages/index/index', // 首页（组件展示）
    'pages/demo/index'   // 示例页（Todo 数据层演示）
  ],
  window: {
    navigationStyle: 'custom', // 配合自定义 NavBar 组件；如用微信原生导航栏改为 default
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: 'Taro Template',
    navigationBarTextStyle: 'black',
    backgroundColor: '#F7F8FA'
  },
  tabBar: {
    color: '#AEAEB2',
    selectedColor: '#07C160',
    backgroundColor: '#FFFFFF',
    borderTopStyle: 'black',
    list: [
      { pagePath: 'pages/index/index', text: '首页' },
      { pagePath: 'pages/demo/index', text: '示例' }
    ]
  }
  // 如需带图标的 tabBar，下载图标到 src/assets/tabbar/ 后改成：
  // list: [
  //   { pagePath: 'pages/index/index', text: '首页',
  //     iconPath: 'assets/tabbar/home.png', selectedIconPath: 'assets/tabbar/home-active.png' },
  //   ...
  // ]
  // 如需用到定位等隐私接口，按需添加：
  // requiredPrivateInfos: ['getLocation', 'chooseLocation'],
  // permission: { 'scope.userLocation': { desc: '用于XX功能' } }
});
