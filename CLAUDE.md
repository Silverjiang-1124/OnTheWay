# OnTheWay 户外徒步助手 — CLAUDE.md

项目：OnTheWay 户外徒步助手
技术栈：React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + lucide-react
路由：React Router DOM v7
状态管理：React Context API + localStorage
入口：npm run dev / npm run build

## 目录结构

- `src/pages/` — 5 个页面：Home（仪表盘）、GearLibrary（装备库）、TripList（行程列表）、TripForm（表单）、TripDetail（详情）
- `src/components/Layout.tsx` — 桌面 w-64 侧边栏 + 移动端底部导航
- `src/store/StoreProvider.tsx` — Context 状态管理、localStorage 持久化和数据迁移（key: `ontheway_data`）
- `src/store/storeContext.ts` — Store Context 定义
- `src/store/useStore.ts` — Store hook
- `src/store/seedData.ts` — 种子数据：24 件装备 + 千八线示例行程
- `src/types/index.ts` — 类型定义（GearItem, Trip, TripGear, GearCategory 等）
- `src/style.css` — Tailwind v4 入口 + `@theme` 自定义色板 + 打印样式
- `agent/` — 行程规划对话记录目录

## 设计规范

- 色板：bg=#F8F9F4, sidebar=#0F1A13, accent=#059669(emerald-600)
- 组件：rounded-3xl, border-slate-100, shadow-sm hover:shadow-lg, active:scale-95
- 标题：font-extrabold，标签：font-black text-[10px] tracking-wider uppercase
- 图标：lucide-react（语义化，勿用 emoji）
- 分类图标：sleep=Moon, kitchen=ChefHat, clothing=Shirt, food=Apple, electronics=Smartphone, other=Ellipsis
- 状态色：待出发=amber, 已完成=accent, 我=accent, 公共=amber, 队友=blue
- 响应式：桌面侧边栏 w-64 → 移动端 fixed bottom-0 h-16 导航

## 核心类型

- `GearItem`: id, name, category, brand?, weight?, quantity, notes?, createdAt
- `Trip`: id, title, location, startDate, endDate, route?, trackUrl?, plan?, distance?, elevation?, members[], gearList[], journal?, rating?, status, createdAt
- `TripGear`: gearId, packed, assignee?（'我'|'公共'|'队友'）
- `GearCategory`: 'sleep'|'kitchen'|'clothing'|'food'|'electronics'|'other'

## Store API（useStore hook）

gearItems / trips — 数据
addGear / updateGear / deleteGear — 装备 CRUD
addTrip / updateTrip / deleteTrip — 行程 CRUD
togglePacked — 打包勾选
addGearToTrip / removeGearFromTrip — 行程装备管理

## 当前数据迁移规则

- `CURRENT_VERSION = 6`，本地数据 key 为 `ontheway_data`。
- 启动时按装备名称匹配 `seedGear`，只补齐缺失的 `brand`、`weight`、`notes`，不会覆盖用户已有值。
- 启动时会追加本地不存在的新 seed 装备，例如 `3L水袋（满水）`。
- `3L水袋（满水）` 当前重量为 `3000g`，表示 3L 水重量；水袋空包自重未计入。
- 云岭睡袋当前重量 `1300g`，备注为按云岭 Primaloft 相关款估算。

## Agent 协作注意

- 本项目由 Codex 与 Claude agent 协作维护；接手前先看 `README.md`、`ITERATION.md` 和最近 git diff。
- 不要直接清空或覆盖用户 localStorage 数据；seed 数据调整必须兼容已有装备和行程。
- 行程计划当前不再用 iframe，使用 sanitizer 后页面内渲染，保留示例 HTML 视觉样式。
- 生成或改写行程计划时，不能只输出纯文本；请输出可直接写入 `Trip.plan` 的 HTML 片段，并优先使用 `.otw-plan` 计划样式类：`.otw-plan-hero`、`.otw-plan-grid`、`.otw-plan-stat`、`.otw-plan-card`、`.otw-plan-timeline`、`.otw-plan-alert`。
- 计划内容需要面向分享和打印/PDF：标题、日期、地点、关键参数、按天时间线、风险/补给/交通信息都应结构化展示。
- 提交前必须跑 `npm run lint` 和 `npm run build`。

## 常用操作

- `npm run dev` — 启动开发服务器
- `npm run build` — ts检查 + 生产构建
- `npm run lint` — ESLint
- 添加页面 → `src/pages/` 中创建组件，在 `src/App.tsx` 注册路由
