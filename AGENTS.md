# Agent Instructions

本项目使用 **bd** (beads) 进行问题跟踪。运行 `bd onboard` 开始使用。

## 项目概述

**3Dcards** 是一个基于 Remotion 的 AI 视频生成项目，用于创建高质量的 TikTok 和 Instagram 视频。该项目包含一个强大的 CLI 工具，可以自动生成故事脚本、图像和语音旁白，使用 OpenAI 和 ElevenLabs API。

### 核心技术栈

- **框架**: Remotion 4.0.410 + React 19.2.3
- **语言**: TypeScript 5.9.3
- **样式**: TailwindCSS 4.0.0
- **AI 集成**: OpenAI (脚本/图像生成) + ElevenLabs (语音合成)
- **开发工具**: ESLint, Prettier

### 项目结构

```
3Dcards/
├── cli/                    # CLI 工具 - 故事生成器
│   ├── cli.ts             # CLI 入口点
│   ├── service.ts         # OpenAI 和 ElevenLabs API 服务
│   └── timeline.ts        # 时间线生成逻辑
├── src/
│   ├── components/        # Remotion 组件
│   │   ├── AIVideo.tsx   # 主视频组件
│   │   ├── Background.tsx # 背景组件
│   │   ├── Subtitle.tsx  # 字幕组件
│   │   └── Word.tsx      # 单词高亮组件
│   ├── lib/
│   │   ├── constants.ts  # 项目常量 (FPS, 尺寸等)
│   │   ├── types.ts      # TypeScript 类型定义
│   │   └── utils.ts      # 工具函数
│   ├── index.ts          # Remotion 入口
│   ├── Root.tsx          # 根组件 - 动态加载时间线
│   └── index.css         # 全局样式
├── public/
│   └── content/          # 生成的内容存储
│       └── [story-name]/
│           ├── descriptor.json   # 故事元数据
│           ├── timeline.json     # 时间线配置
│           ├── images/           # 生成的图像
│           └── audio/            # 生成的音频
└── .opencode/
    └── skills/remotion-best-practices/  # Remotion 最佳实践文档
```

## 快速参考

### 基本命令

```bash
bd ready              # 查找可用工作
bd show <id>          # 查看问题详情
bd update <id> --status in_progress  # 领取工作
bd close <id>         # 完成工作
bd sync               # 与 git 同步
```

### 开发命令

```bash
# 安装依赖
npm i

# 启动开发服务器 (预览视频)
npm run dev

# 构建项目
npm run build

# 生成新的故事时间线
npm run gen

# 代码检查和类型检查
npm run lint

# 升级 Remotion
npx remotion upgrade

# 渲染视频
npx remotion render
```

### 环境配置

创建 `.env` 文件 (参考 `.env.example`):

```env
OPENAI_API_KEY=
ELEVENLABS_API_KEY=
```

## 工作流程

### 创建新视频

1. **配置 API 密钥**: 设置 OpenAI 和 ElevenLabs API 密钥
2. **生成故事**: 运行 `npm run gen`，输入故事标题和主题
3. **预览视频**: 运行 `npm run dev` 在 Remotion Studio 中预览
4. **渲染视频**: 使用 `npx remotion render` 渲染最终视频

### 故事生成流程

CLI 工具会自动执行以下步骤:

1. 使用 OpenAI 生成故事脚本
2. 生成每段文本的图像描述
3. 使用 OpenAI DALL-E 生成图像
4. 使用 ElevenLabs 生成带时间戳的语音
5. 生成 timeline.json (包含元素、文本、音频时间线)

### 时间线结构

时间线包含三个主要部分:

- **Elements**: 背景图像，包含进入/退出过渡效果和动画
- **Text**: 文本内容，带有位置和动画配置
- **Audio**: 音频文件，与文本同步

## 开发规范

### 代码风格

- 使用 TypeScript 严格模式
- 遵循 ESLint 配置 (@remotion/eslint-config-flat)
- 使用 Prettier 格式化代码
- 使用 Zod 进行运行时类型验证

### Remotion 最佳实践

项目包含完整的 Remotion 最佳实践文档 (`.opencode/skills/remotion-best-practices/`):

- **3D**: 使用 Three.js 和 React Three Fiber
- **动画**: 基础动画技能
- **资源**: 导入图像、视频、音频和字体
- **音频**: 音频和声音处理
- **字幕**: TikTok 风格字幕和单词高亮
- **图表**: 数据可视化模式
- **过渡**: 场景过渡模式
- 等更多...

### 关键常量 (src/lib/constants.ts)

- `FPS`: 30 (视频帧率)
- `INTRO_DURATION`: 1 秒 (30 帧)
- `IMAGE_WIDTH`: 1024
- `IMAGE_HEIGHT`: 1792

### 视频规格

- 分辨率: 1080x1920 (9:16 竖屏)
- 帧率: 30 FPS
- 输出格式: JPEG

## 远程部署

要将项目部署为远程服务:

1. 使用 `remotion bundle` 构建模板
2. 更新 `Root.tsx` 使用远程时间线 URL
3. 将生成的资源 (图像和音频) 上传到服务器
4. 在时间线中使用 URL 而非文件名

## Landing the Plane (会话完成)

**结束工作会话时**, 必须完成以下所有步骤。在 `git push` 成功之前工作不算完成。

**强制工作流程:**

1. **为剩余工作创建问题** - 为需要跟进的任务创建问题
2. **运行质量门** (如果代码已更改) - 测试、linters、构建
3. **更新问题状态** - 关闭已完成的工作，更新进行中的项目
4. **推送到远程** - 这是强制性的:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # 必须显示 "up to date with origin"
   ```
5. **清理** - 清除 stashes，清理远程分支
6. **验证** - 所有更改已提交并推送
7. **交接** - 为下一次会话提供上下文

**关键规则:**
- 在 `git push` 成功之前工作不算完成
- 绝不在推送前停止 - 这会将工作滞留在本地
- 绝不说 "准备好推送,等你来" - 你必须自己推送
- 如果推送失败，解决并重试直到成功

## 常见问题

### Remotion 问题

如果遇到 Remotion 问题，升级以获取修复:

```bash
npx remotion upgrade
```

如果没有帮助，[在此提交问题](https://github.com/remotion-dev/remotion/issues/new)。

### CLI 生成

使用 `bun` 或 `tsx` 运行 CLI:

```bash
npm run gen
# 或直接运行
bun cli/cli.ts
tsx cli/cli.ts
```

### 自定义语音

在 `cli/service.ts` 的 `generateVoice()` 函数中替换 ElevenLabs 的语音 ID。

可以从 ElevenLabs 网站获取语音 ID:
```
https://elevenlabs.io/app/voice-library?voiceId=<VOICE_ID>
```

## 贡献指南

此模板的源代码在 [Remotion Monorepo](https://github.com/remotion-dev/remotion/tree/main/packages/template-ai-video) 中。

不要在此处发送 PR，这里只是一个镜像。

## 许可证

请注意，对于某些实体，需要公司许可证。[在此阅读条款](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)。

## 致谢

感谢 [@webmonch](https://github.com/webmonch) 贡献此模板！