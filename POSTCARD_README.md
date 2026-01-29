# AI 深度明信片 - 完整使用指南

## 📖 概述

AI 深度明信片是一个基于 Remotion + Three.js 的智能视频生成系统，能够根据你的一句话灵感，自动生成完整的 3D 明信片视频和跨平台发布文案。

### 核心功能

- ✨ **智能内容生成**: 使用 GPT-4 生成深度文案、视觉风格和平台适配文案
- 🎨 **3D 视频渲染**: 使用 Three.js 和 React Three Fiber 创建精美的 3D 明信片
- 📱 **多平台支持**: 自动生成抖音、微信视频号、YouTube Shorts 的发布文案
- 🎭 **胶片质感**: 支持多种视觉风格和动画情绪
- 💾 **内容包管理**: 完整的内容包保存和加载机制

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env` 文件：

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. 创建你的第一个明信片

```bash
npm run postcard
```

或使用交互式命令：

```bash
bun cli/postcard.ts create
```

## 📝 使用流程

### 步骤 1: 输入灵感

系统会提示你输入灵感，例如：

```
请输入你的灵感（一句话描述）:
> 生成一个关于'春天与遗忘'的、带有胶片质感的哲学明信片
```

### 步骤 2: 选择目标平台

选择你要发布的平台：

```
选择目标平台:
  ✓ 抖音
  ✓ 微信视频号
  ○ YouTube Shorts
```

### 步骤 3: 自动生成内容

系统会自动生成：

- 📝 **核心标题**: 最具冲击力的主题句
- 📖 **主体文案**: 三段式深度文案
- 🎨 **视觉风格**: 颜色方案、动画情绪、风格关键词
- 📱 **平台文案**: 各平台的标题、标签和互动引导

### 步骤 4: 预览和渲染

在 Remotion Studio 中预览，然后渲染视频：

```bash
npx remotion render Postcard3D_<content_id> out/<content_id>.mp4
```

### 步骤 5: 发布

使用生成的发布文案在各平台发布视频。

## 🎨 视觉风格选项

系统支持以下动画情绪：

- 宁静舒缓
- 深沉思考
- 温柔治愈
- 诗意流淌
- 空灵神秘

常见的风格关键词：

- 胶片质感
- 柔焦
- 浅景深
- 复古色调
- 微光粒子
- 极简主义
- 赛博朋克

## 📊 内容包结构

生成的完整内容包包含：

```json
{
  "metadata": {
    "contentId": "唯一标识",
    "generationTimestamp": "生成时间",
    "sourceInspiration": "用户输入",
    "targetPlatforms": ["douyin", "wechat_channel"]
  },
  "coreContent": {
    "title": "核心标题",
    "coreText": ["段落1", "段落2", "段落3"],
    "extendedDescription": "扩展描述"
  },
  "platformCopy": {
    "forDouyin": {
      "postTitle": "抖音标题",
      "hashtags": ["标签1", "标签2"],
      "interactionPrompt": "互动引导"
    },
    "forWeChatChannel": {
      "postTitle": "视频号标题",
      "hashtags": ["标签1", "标签2"]
    }
  },
  "visualAndAudioSpec": {
    "styleKeywords": ["关键词1", "关键词2"],
    "colorPalette": {
      "primary": "主色",
      "secondary": "辅色",
      "textColor": "文本色"
    },
    "animationMood": "动画情绪",
    "musicSuggestion": "音乐建议"
  }
}
```

## 🔧 高级用法

### 命令行参数

```bash
bun cli/postcard.ts create \
  --api-key "your-api-key" \
  --inspiration "你的灵感" \
  --platforms douyin wechat_channel \
  --output-dir "./output" \
  --render
```

参数说明：

- `--api-key, -k`: OpenAI API Key
- `--inspiration, -i`: 用户灵感
- `--platforms, -p`: 目标平台（多个）
- `--output-dir, -o`: 输出目录
- `--render, -r`: 是否立即渲染视频

### 重新加载内容包

```typescript
import { PostcardContentGenerator } from "./cli/postcard-service";

const generator = new PostcardContentGenerator(apiKey);
const contentPackage = await generator.loadContentPackage("public/content/postcards/xxx.json");
```

### 自定义发布文案

```typescript
import { createPublisher } from "./src/lib/publisher";

const publisher = createPublisher(contentPackage, videoPath);
const douyinInfo = publisher.getDouyinPublishInfo();
```

## 📁 项目结构

```
3Dcards/
├── src/
│   ├── components/
│   │   ├── Postcard3D.tsx      # 3D 明信片组件
│   │   └── AIVideo.tsx         # 原有 AI 视频组件
│   ├── lib/
│   │   ├── postcard-types.ts   # 类型定义
│   │   ├── publisher.ts        # 发布辅助模块
│   │   └── utils.ts            # 工具函数
│   └── Root.tsx                # Remotion 根组件
├── cli/
│   ├── postcard.ts             # Postcard CLI
│   ├── postcard-service.ts     # 内容生成服务
│   └── cli.ts                  # 原有 CLI
└── public/
    └── content/
        └── postcards/          # 生成的内容包
```

## 🎯 最佳实践

### 1. 灵感输入

✅ 好的灵感：

- "春天与遗忘的哲学思考"
- "城市夜空的孤独感"
- "时间流逝的诗意表达"

❌ 不好的灵感：

- "做个视频"（太模糊）
- "关于爱情"（太宽泛）
- "123"（无意义）

### 2. 平台选择

- **抖音**: 适合快节奏、视觉冲击强的内容
- **微信视频号**: 适合文艺、深度内容
- **YouTube Shorts**: 适合国际化、教育类内容

### 3. 视觉风格

根据文案内容选择合适的视觉风格：

- 哲学类 → 深沉思考、诗意流淌
- 情感类 → 温柔治愈、宁静舒缓
- 科技类 → 赛博朋克、空灵神秘

## 🐛 故障排除

### 问题 1: OpenAI API 调用失败

**解决方案**:
- 检查 API Key 是否正确
- 确认账户有足够的配额
- 检查网络连接

### 问题 2: 视频渲染失败

**解决方案**:
- 确保所有依赖已安装
- 检查 Three.js 版本兼容性
- 查看控制台错误信息

### 问题 3: 内容包格式错误

**解决方案**:
- 删除生成的内容包
- 重新运行生成命令
- 检查 OpenAI 返回的 JSON 格式

## 📚 扩展开发

### 添加新的平台

在 `src/lib/postcard-types.ts` 中添加平台类型：

```typescript
export const PlatformCopySchema = z.object({
  forDouyin: PlatformCopyDouyinSchema,
  forWeChatChannel: PlatformCopyWeChatChannelSchema,
  forXiaohongshu: PlatformCopyXiaohongshuSchema, // 新增
});
```

### 自定义 3D 效果

修改 `src/components/Postcard3D.tsx` 中的场景组件：

```typescript
const Scene = () => {
  // 添加自定义 3D 效果
  return (
    <>
      <Custom3DEffect />
      {/* ... */}
    </>
  );
};
```

### 集成音乐

在内容包中添加音乐字段：

```typescript
export const VisualAndAudioSpecSchema = z.object({
  // ...
  musicUrl: z.string().optional(),
});
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

详见 LICENSE.md

---

**Happy Creating! 🎨✨**
