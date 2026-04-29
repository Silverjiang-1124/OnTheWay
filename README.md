# OnTheWay 🏔️ — 户外徒步助手

重装徒步行程管理 & 装备打包助手。帮助户外爱好者规划行程、管理装备、打包清单、记录游记。

## 技术栈

- **框架**: React 19 + TypeScript
- **构建**: Vite 8 + `@tailwindcss/vite`
- **样式**: Tailwind CSS v4（自定义户外色板）
- **图标**: lucide-react（语义化图标）
- **路由**: React Router DOM v7
- **状态管理**: React Context API + localStorage 持久化
- **包管理**: npm

## 快速开始

```bash
npm install
npm run dev        # 启动开发服务器
npm run build      # 生产构建
npm run preview    # 预览构建产物
```

## 功能

| 功能 | 说明 |
| ------ | ------- |
| 🎒 **装备库** | 装备 CRUD，按分类筛选、网格展示 |
| 🗺️ **行程管理** | 创建/编辑/删除行程，切换待出发/已完成状态 |
| 📋 **打包清单** | 从装备库导入装备到行程，按负责人筛选，勾选打包状态 |
| 📝 **行程计划** | HTML 格式的详细计划，可折叠查看 |
| ✍️ **游记评分** | 星级评分 + 文字记录 |
| 📤 **导出** | 打印/PDF、复制文字摘要 |
| 👥 **多人协作** | 装备分配人（我/公共/队友），头像组展示 |

## 项目结构

```text
OnTheWay/
├── src/
│   ├── components/
│   │   └── Layout.tsx       # 桌面侧边栏 + 移动底部导航
│   ├── pages/
│   │   ├── Home.tsx          # 仪表盘
│   │   ├── GearLibrary.tsx   # 装备库 (CRUD)
│   │   ├── TripList.tsx      # 行程列表
│   │   ├── TripForm.tsx      # 创建/编辑行程
│   │   └── TripDetail.tsx    # 行程详情 + 打包清单 + 游记
│   ├── store/
│   │   ├── useStore.tsx      # Context + localStorage 状态管理
│   │   └── seedData.ts       # 种子数据
│   ├── types/
│   │   └── index.ts          # TypeScript 类型定义
│   ├── style.css             # Tailwind 入口 + 自定义主题 + 打印样式
│   ├── App.tsx               # 路由配置
│   └── main.tsx              # 入口
├── agent/                    # 行程规划对话记录
├── index.html
└── vite.config.ts
```

## 设计规范

采用"硬核户外"设计风格：

- **色板**: 大地灰 `#F8F9F4` 背景、深夜丛林绿 `#0F1A13` 侧边栏、翡翠绿 `#059669` 交互色
- **组件**: 大圆角 `rounded-3xl`、细腻边框 `border-slate-100`、hover 阴影过渡
- **交互**: `active:scale-95` 点击物理反馈
- **图标**: lucide-react 语义化图标
- **响应式**: 桌面 w-64 侧边栏 / 移动端底部固定导航
