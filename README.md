# 工具箱合集前端项目

这是一个基于Vue 3、Element Plus、TypeScript、Vite和Pinia构建的在线工具箱合集前端项目，旨在提供各种实用工具，方便用户在线使用。

## 技术栈

- Vue 3
- TypeScript
- Element Plus
- Vite
- Pinia
- Vue Router
- Axios

## 技术选型：vue + Element Plus + Axios + TypeScript + Vite + Pinia

## 功能特点

- 多种实用工具集合
- 响应式设计，适配各种屏幕尺寸
- 工具历史记录和收藏功能
- 工具分类展示
- 搜索功能

## 工具分类

- 文本工具：文本格式化、密码生成器、文本差异对比等
- 图片工具：图片压缩、二维码生成等
- 格式转换：JSON转XML、单位换算等
- 计算工具：各类计算器等

## 项目结构

```
toolbox-web/
├── public/                 # 公共资源
├── src/
│   ├── api/                # API请求
│   ├── assets/             # 静态资源
│   ├── components/         # 公共组件
│   ├── router/             # 路由配置
│   ├── stores/             # Pinia状态管理
│   ├── utils/              # 工具函数
│   ├── views/              # 页面视图
│   │   ├── layout/         # 布局组件
│   │   ├── tools/          # 工具页面
│   │   └── ...             # 其他页面
│   ├── App.vue             # 根组件
│   └── main.ts             # 入口文件
├── index.html              # HTML入口
├── package.json            # 依赖配置
├── tsconfig.json           # TypeScript配置
├── vite.config.ts          # Vite配置
└── README.md               # 项目说明
```

## 安装和使用

### 环境要求

- Node.js 16+
- npm 7+ 或 yarn 1.22+

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 开发环境运行

```bash
npm run dev
# 或
yarn dev
```

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

## 开发指南

1. 添加新工具需要在 `src/views/tools` 目录下创建对应的组件
2. 在 `src/router/index.ts` 中添加新工具的路由配置
3. 在 `src/stores/toolbox.ts` 中初始化数据时加入新工具的信息

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

[MIT](LICENSE)
