# Taro Template

> Taro 4 + React 18 + TypeScript 跨端（weapp + H5）前端骨架模板。
> 一处代码，编译到微信小程序和 H5。内置双平台数据桥接层，开箱即用无需后端。

## 这是什么

一个从真实生产项目（二维码失物招领小程序）剥离业务后提炼的前端骨架。保留了所有经过踩坑验证的工程配置和基础设施，删掉了全部业务代码。拿来做新项目时，**只需要关心业务页面**，框架层不用动。

## 包含什么

| 层级 | 内容 |
|------|------|
| **构建** | Taro 4.1.9 + Webpack 5 + SCSS，含所有踩坑修复（prebundle 关闭 / libVersion patch） |
| **框架** | React 18 + TypeScript 5（strict） |
| **状态** | Zustand 4（已装好，按需创建 store） |
| **数据层** | `src/utils/cloud.ts` — 双平台桥接：weapp→云函数 / H5→localStorage mock 或 fetch 真后端 |
| **UI 组件库** | **NutUI-React-Taro 3.0.20**（60+ 组件，主题已覆盖为微信绿）。补全表单/弹层/列表等业务组件 |
| **手写组件** | 11 个基础组件（`tpl-` 前缀）：Button / Card / NavBar / Icon / Loading / EmptyState / ErrorBoundary / Skeleton / Spacer / PageContainer / NetworkBanner |
| **工具** | cloud / wxapi / storage / network / error / useAsync / validators / format |
| **样式** | 完整设计 Token（`styles/variables.scss`，变量已加 `tpl-` 前缀避免与 NutUI 冲突） |
| **示例页** | 首页（手写组件 + NutUI 组件展示）+ Todo 示例（验证数据层 CRUD） |

## NutUI 组件库

模板集成了 [NutUI-React-Taro](https://nutui.jd.com/taro/react/3x/)（京东开源，Taro 官方推荐），60+ 组件开箱即用，补全了手写组件缺少的表单类、弹层类、列表类。

### 用法

```tsx
import { Button as NutButton, Input, Switch, Cell, Tag, Dialog } from '@nutui/nutui-react-taro';

// 同名组件加别名，避免与手写 Button 冲突
<NutButton type='primary'>NutUI 按钮</NutButton>
<Input placeholder='输入框' />
<Switch defaultChecked />
```

完整组件列表见 [NutUI 官方文档](https://nutui.jd.com/taro/react/3x/)。

### 主题定制

模板已把 NutUI 默认的京东红 `#ff0f23` 覆盖成微信绿 `#07C160`（在 `src/styles/global.scss` 的 `page` 选择器里）：

```scss
page {
  --nutui-color-primary: #07C160;
  --nutui-color-primary-stop-1: #06AE56;
  // ...
}
```

改主题色只需改这几个 CSS 变量，所有 NutUI 组件自动跟随。

### 和手写组件的关系

- 手写组件用 `tpl-` 前缀（`tpl-btn`），NutUI 用 `nut-` 前缀（`nut-button`），**命名空间隔离，样式互不干扰**
- SCSS 变量也已隔离：手写的加 `$tpl-` 前缀，NutUI 用 `$color-`（但默认读 `--nutui-` CSS 变量）
- 两者可并存：简单场景用手写组件（更轻量），复杂表单/列表用 NutUI

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 开发小程序（watch 模式，编译到 dist/）
npm run dev:weapp
# 然后用微信开发者工具打开本项目根目录（会读 dist/）

# 3. 开发 H5
npm run dev:h5
# 浏览器打开 http://localhost:10086

# 4. 生产构建
npm run build:weapp:prod
npm run build:h5:prod
```

## 关键配置（用之前必看）

### 1. 替换 appid

`project.config.json` 里默认是 `touristappid`（游客模式，无法预览真机）。换成你自己的小程序 appid：

```json
{ "appid": "wx你的appid" }
```

或通过环境变量（构建时自动注入）：
```bash
TARO_APPID=wx你的appid npm run build:weapp
```

### 2. 接入微信云开发（可选）

如果要连后端，在 `src/app.tsx` 的 `useLaunch` 里取消注释：

```tsx
// #ifdef MP-WEIXIN
initCloud('your-cloud-env-id');
// #endif
```

`envId` 从[微信云开发控制台](https://console.cloud.tencent.com/tcb)获取。

### 3. H5 端切换后端（运行时可配，无需重新打包）

H5 端访问时 URL 加参数即可对接真后端：

```
https://你的H5站点.com/?api=https://xxx.ap-shanghai.app.tcloudbase.com/api
```

- `?api=<url>` — 即时切换 + 记忆到 localStorage
- `?api=` 或 `?api=mock` — 清除，回退 localStorage mock

不带参数时默认走 localStorage mock，**开箱即用无需后端**。

## 数据层用法（cloud.ts）

业务代码统一调这 5 个函数，底层自动路由：

```ts
import { dbQuery, dbAdd, dbUpdate, dbDelete, dbCount } from '@/utils/cloud';

// 查询
const todos = await dbQuery<Todo>('todos', { done: false });

// 新增
const { _id } = await dbAdd<Todo>('todos', { text: '买牛奶', done: false });

// 更新
await dbUpdate('todos', { _id }, { done: true });

// 删除
await dbDelete('todos', { _id });

// 计数
const { total } = await dbCount('todos');
```

三态自动切换：
- **weapp** → `wx.cloud.callFunction('db', ...)`（需部署云函数）
- **H5 + apiBase** → `fetch('/api/todos', ...)`（需后端）
- **H5 无 apiBase** → localStorage mock（开发调试，开箱即用）

## 换成你的业务

1. **改类型**：创建 `src/types/index.ts` 定义你的业务模型
2. **建 store**：在 `src/store/` 下用 Zustand 创建状态（参考 `cloud.ts` 的 CRUD）
3. **写页面**：在 `src/pages/` 下加页面，记得在 `src/app.config.ts` 注册路由
4. **加图标**：在 `src/components/Icon/index.weapp.tsx` 的 `SVG_PATHS` 加 path（H5 端自动支持 lucide-react）
5. **删示例**：删掉 `pages/demo/`，把 `pages/index/` 改成你的首页

## 关键坑点（踩过的，别再踩）

### ⚠️ babel.config.js 不要加 `useBuiltIns: 'usage'`

否则会触发 core-js 的 `isCallable` 用 `document.all` 检测 IE，形成 vendors↔taro 循环依赖，项目启动报 `Cannot read property 'F' of undefined`。本模板的 babel.config.js 只有一行：

```js
module.exports = { presets: [['taro', { framework: 'react', ts: true }]] };
```

### ⚠️ `prebundle: { enable: false }` 必须配两次

`config/index.ts` 的顶层和 mini/h5 配置里都要有，否则 webpack-virtual-modules 版本不兼容。

### ⚠️ libVersion 必须 ≥ 3.4.0

`scripts/patch-weapp-config.js` 会在 build 后把 libVersion 升级到 3.4.0。Taro 4 用了 3.0+ 基础库特性，默认的 2.32.3 会报错。**不要删 patch 步骤**。

### ⚠️ 条件编译用 `process.env.TARO_ENV`

```tsx
// ✅ 正确（编译时常量，被 tree-shake）
{process.env.TARO_ENV === 'h5' && <View>仅 H5</View>}

// ❌ 错误（JSX 注释格式预处理不认）
{/* #ifdef H5 */}
{/* #endif */}
```

### ⚠️ WXSS 不支持 `*` 通配符

会报 `unexpected token *`。用具体标签名或 class。

### ⚠️ NutUI 必须配 `selectorBlackList: ['nut-']`

`config/index.ts` 的 `mini.postcss.pxtransform` 必须加 `selectorBlackList: ['nut-']`，否则 NutUI 组件（内部用 px + 自有缩放变量）会被 pxtransform 二次缩放，尺寸变形。模板已配好，**不要删**。

### ⚠️ 手写 SCSS 变量必须加 `tpl-` 前缀

因为 `config/index.ts` 的 `sass.resource` 会把 `variables.scss` 全局注入每个 SCSS 文件（含 NutUI 的）。如果你的变量叫 `$color-primary`，会和 NutUI 同名变量冲突。模板已把所有手写变量改成 `$tpl-color-primary` 等，**新增变量请保持 `tpl-` 前缀**。

## 目录结构

```
taro-template/
├── config/index.ts          # Taro 编译配置
├── scripts/patch-weapp-config.js  # build 后补丁（libVersion 升级）
├── project.config.json      # 微信开发者工具配置（换 appid）
├── src/
│   ├── app.tsx              # 应用入口
│   ├── app.config.ts        # 路由 + tabBar 配置
│   ├── app.boot.ts          # H5 启动入口
│   ├── components/          # 11 个通用组件
│   ├── utils/               # 8 个工具模块（cloud.ts 是核心）
│   ├── styles/              # 设计 Token + 全局样式
│   └── pages/               # 示例页面（首页 + Todo）
├── babel.config.js          # ⚠️ 极简，别改
├── tsconfig.json            # TS 配置（@/* 路径别名）
└── jest.config.js           # 测试配置
```

## 技术栈版本

| 依赖 | 版本 |
|------|------|
| Taro | 4.1.9 |
| React | 18.2 |
| TypeScript | 5.4 |
| Zustand | 4.5 |
| Webpack | 5.90 |
| Sass | 1.71 |
| Jest | 29.7 |
| ESLint | 8.57 |
