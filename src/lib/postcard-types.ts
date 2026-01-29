import { z } from "zod";

// 完整内容包的类型定义
export const ContentMetadataSchema = z.object({
  contentId: z.string(),
  generationTimestamp: z.string(),
  sourceInspiration: z.string(),
  targetPlatforms: z.array(
    z.enum(["douyin", "wechat_channel", "youtube_shorts"]),
  ),
});

export const CoreContentSchema = z.object({
  title: z.string().max(20),
  coreText: z.array(z.string()),
  extendedDescription: z.string().max(300),
});

export const PlatformCopyDouyinSchema = z.object({
  postTitle: z.string().max(55),
  hashtags: z.array(z.string()).min(3).max(8),
  interactionPrompt: z.string(),
});

export const PlatformCopyWeChatChannelSchema = z.object({
  postTitle: z.string().max(60),
  hashtags: z.array(z.string()),
});

export const PlatformCopySchema = z.object({
  forDouyin: PlatformCopyDouyinSchema,
  forWeChatChannel: PlatformCopyWeChatChannelSchema,
});

export const ColorPaletteSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  textColor: z.string(),
});

export const VisualAndAudioSpecSchema = z.object({
  styleKeywords: z.array(z.string()),
  colorPalette: ColorPaletteSchema,
  animationMood: z.enum([
    "宁静舒缓",
    "深沉思考",
    "温柔治愈",
    "诗意流淌",
    "空灵神秘",
  ]),
  musicSuggestion: z.string(),
});

export const CompleteContentPackageSchema = z.object({
  metadata: ContentMetadataSchema,
  coreContent: CoreContentSchema,
  platformCopy: PlatformCopySchema,
  visualAndAudioSpec: VisualAndAudioSpecSchema,
});

// 导出类型
export type ContentMetadata = z.infer<typeof ContentMetadataSchema>;
export type CoreContent = z.infer<typeof CoreContentSchema>;
export type PlatformCopyDouyin = z.infer<typeof PlatformCopyDouyinSchema>;
export type PlatformCopyWeChatChannel = z.infer<
  typeof PlatformCopyWeChatChannelSchema
>;
export type PlatformCopy = z.infer<typeof PlatformCopySchema>;
export type ColorPalette = z.infer<typeof ColorPaletteSchema>;
export type VisualAndAudioSpec = z.infer<typeof VisualAndAudioSpecSchema>;
export type CompleteContentPackage = z.infer<
  typeof CompleteContentPackageSchema
>;

// Remotion 组件 Props
export const Postcard3DPropsSchema = z.object({
  contentPackage: CompleteContentPackageSchema.optional(),
});

export type Postcard3DProps = z.infer<typeof Postcard3DPropsSchema>;

// LLM 系统提示词模板
export const SYSTEM_PROMPT_TEMPLATE = `你是一位哲思诗人兼短视频内容策略师。请根据用户灵感，生成一份完整的短视频内容包。

要求：
1. 一个有力的核心标题（不超过20字）
2. 三段式主体文案（每段不超过15字）
3. 一段扩展描述（不超过300字）
4. 为抖音和视频号分别准备带话题的发布标题和标签
5. 提供视觉风格、色彩和动画情绪的关键词

整体风格需统一、有深度且易于视觉化。

请严格以 JSON 格式返回，包含以下结构：
{
  "metadata": {
    "contentId": "timestamp_hash",
    "generationTimestamp": "ISO8601",
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
      "postTitle": "标题+标签",
      "hashtags": ["标签1", "标签2", ...],
      "interactionPrompt": "互动引导"
    },
    "forWeChatChannel": {
      "postTitle": "视频号标题",
      "hashtags": ["标签1", "标签2", ...]
    }
  },
  "visualAndAudioSpec": {
    "styleKeywords": ["关键词1", "关键词2", ...],
    "colorPalette": {
      "primary": "主色",
      "secondary": "辅色",
      "textColor": "文本色"
    },
    "animationMood": "动画情绪",
    "musicSuggestion": "音乐建议"
  }
}`;
