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
| 🎒 **装备库** | 装备 CRUD，按分类筛选、网格展示，内置常用重装徒步装备重量 |
| 🗺️ **行程管理** | 创建/编辑/删除行程，切换待出发/已完成状态 |
| 📋 **打包清单** | 从装备库导入装备到行程，按负责人筛选，勾选打包状态 |
| 📝 **行程计划** | 计划片段直接在页面内渲染，保留示例样式并做 HTML 安全清理 |
| ✍️ **游记评分** | 星级评分 + 文字记录 |
| 📤 **导出** | 打印/PDF、复制文字摘要 |
| 👥 **多人协作** | 装备分配人（我/公共/队友），头像组展示 |

## 当前装备数据

- 种子装备包含 24 件，已补齐主要装备重量：背包、帐篷、登山杖、睡袋、净水瓶、3L 满水水袋、衣物、急救包、药盒、头灯等。
- `3L水袋（满水）` 按每次出发装满 3L 计入 `3000g`；水袋空包自重未计入，后续可按实际型号或实称重量修正。
- 应用启动时会用种子数据补齐本地装备缺失的 `brand`、`weight`、`notes`，并追加新增种子装备；不会覆盖用户已手工填写的重量。

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
│   │   ├── StoreProvider.tsx # Context + localStorage 状态管理和数据迁移
│   │   ├── storeContext.ts   # Store Context
│   │   ├── useStore.ts       # Store hook
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

## Agent 协作说明

- 本项目当前由 Codex 与 Claude agent 协作维护，变更前先查看 `CLAUDE.md` 和 `ITERATION.md`。
- 涉及装备 seed 的改动需要同时考虑已有浏览器 `localStorage` 数据；新增装备或补字段应通过 StoreProvider 的启动同步逻辑兼容老数据。
- 提交前运行 `npm run lint` 和 `npm run build`。

## 设计规范

采用"硬核户外"设计风格：

- **色板**: 大地灰 `#F8F9F4` 背景、深夜丛林绿 `#0F1A13` 侧边栏、翡翠绿 `#059669` 交互色
- **组件**: 大圆角 `rounded-3xl`、细腻边框 `border-slate-100`、hover 阴影过渡
- **交互**: `active:scale-95` 点击物理反馈
- **图标**: lucide-react 语义化图标
- **响应式**: 桌面 w-64 侧边栏 / 移动端底部固定导航
