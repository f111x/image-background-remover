# 🖼️ Image Background Remover

简单、快速、免费的在线图片背景去除工具。使用 AI 一键去除图片背景。

## ✨ 功能特点

- 📤 **拖放上传** - 支持拖放或点击上传图片
- 🤖 **AI 智能处理** - 使用 Remove.bg API 进行背景去除
- ⚡ **快速响应** - 5-10 秒内完成处理
- 📥 **一键下载** - 直接下载透明背景 PNG
- 🔒 **隐私保护** - 图片仅内存处理，不保存任何数据

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local` 并填入你的 Remove.bg API Key：

```bash
cp .env.example .env.local
```

编辑 `.env.local`：

```
REMOVE_BG_API_KEY=your_api_key_here
```

### 3. 获取 API Key

1. 访问 [Remove.bg API](https://www.remove.bg/api) 注册账号
2. 免费额度：每月 50 张图片
3. 超过免费额度后：$0.02/张

### 4. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看效果。

### 5. 构建生产版本

```bash
npm run build
npm start
```

## 📁 项目结构

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── remove-background/
│   │   │       └── route.ts      # API 路由
│   │   ├── globals.css           # 全局样式
│   │   ├── layout.tsx            # 布局
│   │   └── page.tsx              # 主页面
│   └── lib/
├── public/
├── .env.example                   # 环境变量示例
└── package.json
```

## 🎨 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **AI API**: Remove.bg

## 📋 支持格式

| 格式 | 扩展名 | 最大大小 |
|------|--------|----------|
| JPEG | .jpg, .jpeg | 5MB |
| PNG | .png | 5MB |
| WebP | .webp | 5MB |

## 🔧 开发

```bash
# 代码检查
npm run lint

# 类型检查
npm run type-check
```

## 📄 License

MIT
