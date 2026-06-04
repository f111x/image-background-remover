# Face Swap 工具产品设计说明书

> 更新日期：2026-06-04

## 1. 功能定位

**一句话**：上传两张图片——源图（提供人脸）和目标图（替换人脸）——AI 自动完成人脸替换。

**使用场景**：
- 创意娱乐（换脸玩梗）
- 电商模特展示
- 头像定制

---

## 2. 技术方案

**API**：Replicate `codeplugtech/face-swap`
- 价格：$0.0025/次
- 推理时间：约 26s
- 支持：单张人脸替换
- 输入格式：source_image（人脸源）+ target_image（目标图）

**前端**：
- 路由：`/tools/face-swap`
- 技术：Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
- 组件：`FaceSwapEditor` (`/components/tools/face-swap/face-swap.tsx`)
- API：`/api/face-swap/route.ts`

---

## 3. 工具属性

| 项目 | 值 |
|------|-----|
| **路由** | `/tools/face-swap` |
| **类型** | AI |
| **Credits** | 1 credit/次 |
| **登录要求** | 可选（Guest 可用，有水印） |
| **API** | `codeplugtech/face-swap` |
| **文件格式** | JPG / PNG / WEBP，最大 10MB |

---

## 4. 核心交互流程

```
上传源图（人脸）→ 上传目标图 → [处理] → 展示结果 → 下载
```

### 4.1 输入区

**源图上传区（Source）**
- 拖拽/点击上传
- 显示缩略图 + 移除按钮
- 标注"提供人脸"

**目标图上传区（Target）**
- 拖拽/点击上传
- 显示缩略图 + 移除按钮
- 标注"替换到此图"

### 4.2 Credits 显示（同 AI Editor）

```
登录用户 + 有积分: 💰 N credits available
登录用户 + 积分不足: 💰 N credits available (不足提示)
未登录用户: 👋 Guest Mode — No login required to try · Login to use credits
```

### 4.3 处理按钮

- 文字：`Swap Face`
- 状态：loading 时显示 spinner
- disabled 条件：无源图或无目标图或处理中

### 4.4 结果展示

- 透明棋盘格背景显示结果图
- 下载按钮（hover 显示）
- 结果无水印（登录用户）/ 有水印（Guest）

---

## 5. SEO 元信息

**title**：`Face Swap Online Free | ImageTools`
**description**：`Swap faces in any photo with AI. Upload a source face and target photo — get realistic face swaps in seconds. Free to try, supports JPG/PNG/WEBP.`
**keywords**：`face swap, AI face swap, swap faces, face replacement, deepfake alternative`

---

## 6. 工具导航（tools/page.tsx）

Face Swap 加入工具矩阵，与 Background Remover、Watermark Remover、AI Editor 并列展示。

---

## 7. 设计规范（色彩/组件）

沿用 ImageTools 统一设计系统：
- Gradient 主色：`#7c3aed → #ec4899`
- Guest 提示：`purple-500/20`
- Credits 充足：`yellow-500/20`
- Credits 不足：`red-500/20`