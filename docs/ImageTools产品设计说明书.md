# ImageTools 产品设计说明书（整合版）

> 最后更新：2026-04-22

---

## 一、产品定位与愿景

**一句话定位**：ImageTools 是一个 AI 驱动的在线图片处理工具箱，提供从基础（背景消除、水印去除）到实用（图片转PDF）的完整工具链，面向需要快速处理图片的普通用户和小型电商卖家。

**核心价值主张**：
- 无需登录即可试用（降低门槛）
- AI 能力赋能（非 AI 工具免费，AI 工具收费）
- 简洁直观，无需学习

---

## 二、功能总览（4个工具）

| # | 工具 | 类型 | 登录要求 | Credits | 水印 |
|---|------|------|---------|---------|------|
| 1 | Background Remover | AI | 可选 | 1credit/次 | Guest 有水印 |
| 2 | Watermark Remover | AI | 可选 | 1credit/次 | Guest 有水印 |
| 3 | AI Editor | AI | 可选 | 2credits/次 | Guest 有水印 |
| 4 | Image to PDF | 工具 | 多图需登录 | **免费** | **无** |

---

## 三、各工具详细说明

### 工具 1 — Background Remover（AI 背景消除）

| 项目 | 说明 |
|------|------|
| **路由** | `/tools/background-remover` |
| **API** | Remove.bg API |
| **核心流程** | 上传图片 → 点击处理 → 下载透明背景PNG |
| **文件格式** | JPG / PNG / WEBP，最大 10MB |
| **免费额度** | 新注册用户 2 credits（1credit=1次） |
| **Guest 限制** | 可用，但结果有水印 |

---

### 工具 2 — Watermark Remover（AI 水印去除）

| 项目 | 说明 |
|------|------|
| **路由** | `/tools/watermark-remover` |
| **API** | Replicate SDXL Image Inpainting |
| **核心流程** | 上传图片 → 用画笔涂抹水印区域 → 点击处理 → 下载 |
| **画笔控制** | Paint / Erase 模式，尺寸 5-100 可调，Undo 支持（20步） |
| **文件格式** | JPG / PNG / WEBP，最大 10MB |
| **Guest 限制** | 可用，但结果有水印 |

---

### 工具 3 — AI Editor（AI 图片生成/编辑）

| 项目 | 说明 |
|------|------|
| **路由** | `/tools/ai-editor` |
| **API** | Replicate Flux Schnell |
| **核心流程** | 输入文字 prompt → 可选上传主图 → 可选添加9张参考图风格 → 生成图片 |
| **免费额度** | 2 credits/generation |
| **Guest 限制** | 可用，但结果有水印 |
| **示例 Prompt** | 预置 6 个快速示例按钮（Artistic/Urban/Cute/Landscape/Portrait/Fantasy） |

---

### 工具 4 — Image to PDF（图片转PDF）

| 项目 | 说明 |
|------|------|
| **路由** | `/tools/image-to-pdf` |
| **技术** | `jspdf`（纯前端，无服务端成本） |
| **核心流程** | 上传图片 → 配置布局 → 生成并下载 PDF |
| **登录规则** | 单图免登录；2张及以上必须登录 |
| **Credits** | **完全免费，无积分消耗** |
| **水印** | **无** |

**PDF 布局设置项：**

| 选项 | 可选值 |
|------|--------|
| Page Size | A4 / Letter / Legal |
| Orientation | 纵向 / 横向 |
| Images per page | 1 / 2 / 4 / 6 / 9 |
| Image fit | Fit（完整显示）/ Fill（裁切填满）/ Center（居中留白）|
| Page margin | 0 / 5mm / 10mm / 15mm |
| Max files | 20 张 |

---

## 四、工具导航页面 `/tools`

现有 4 个工具卡片：Background Remover、Watermark Remover、AI Editor、Image to PDF（新增）

---

## 五、通用设计规范

**色彩系统：**

| 用途 | 色值 |
|------|------|
| 主色（Gradient 起点） | `#7c3aed` (purple-600) |
| 主色（Gradient 终点） | `#ec4899` (pink-600) |
| Guest 提示背景 | `purple-500/20` |
| Credits 充足 | `yellow-500/20` |
| Credits 不足 | `red-500/20` |

**Credits 显示规范（各工具通用）：**
```
登录用户 + 有积分: 💰 N credits available
登录用户 + 积分不足: 💰 N credits available (不足提示)
未登录用户: 👋 Guest Mode — No login required to try · Login to use credits
```

**水印提示规范：**
```
Guest 结果: 免费计划 — 图片将添加水印（黄色背景提示）
登录用户: 已登录 — 无水印（绿色背景提示）
订阅用户: 订阅用户 — 无水印（绿色背景提示）
```

---

## 六、技术架构

| 项目 | 说明 |
|------|------|
| **前端框架** | Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 |
| **部署** | Vercel |
| **数据库/认证** | Supabase（Auth + Profiles + Credits + UsageHistory） |
| **AI 服务** | Remove.bg（背景消除）、Replicate SDXL Inpainting（水印）、Replicate Flux Schnell（生图） |
| **PDF 生成** | `jspdf`（纯前端） |
| **UI 组件库** | shadcn/ui (Radix UI + Tailwind) |

---

## 七、已知 Bug 与修复状态

### P0（致命，已修复）
- [x] Canvas 坐标亚像素偏移（Retina 屏幕笔刷不准）
- [x] Undo 后红色遮罩层不重绘

### P1（严重，部分修复）
- [x] Guest 模式提示文字不清晰 → 已修复
- [x] AI Editor "batch mode" 误导文案 → 已修复
- [ ] Pricing 购买流程 → 需配置 PayPal 环境变量

### P2（一般，进行中）
- [x] 移动端 touch 事件处理不完善 → 已修复
- [ ] FAQ "Google sign-in" 文案 → 低优先级

---

## 八、待完成事项

- [ ] 配置 PayPal 环境变量（`PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET`）使购买功能可用
- [ ] 中文字体嵌入 PDF（`NotoSansSC` TTF）
- [ ] 同步更新 `translations.ts`（目前主要用 `i18n.tsx`）
