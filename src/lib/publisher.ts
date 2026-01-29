import type { CompleteContentPackage, ContentMetadata, CoreContent } from "./postcard-types";
import * as fs from "fs/promises";
import * as path from "path";

/**
 * 平台发布辅助模块
 * 提供各平台的发布文案和元数据
 */
export class PlatformPublisher {
  private contentPackage: CompleteContentPackage;
  private videoPath: string;

  constructor(contentPackage: CompleteContentPackage, videoPath: string) {
    this.contentPackage = contentPackage;
    this.videoPath = videoPath;
  }

  /**
   * 获取抖音发布信息
   */
  getDouyinPublishInfo() {
    return {
      title: this.contentPackage.platformCopy.forDouyin.postTitle,
      description: this.contentPackage.coreContent.extendedDescription,
      hashtags: this.contentPackage.platformCopy.forDouyin.hashtags,
      interactionPrompt: this.contentPackage.platformCopy.forDouyin.interactionPrompt,
      videoPath: this.videoPath,
      platform: "douyin" as const,
    };
  }

  /**
   * 获取微信视频号发布信息
   */
  getWeChatChannelPublishInfo() {
    return {
      title: this.contentPackage.platformCopy.forWeChatChannel.postTitle,
      description: this.contentPackage.coreContent.extendedDescription,
      hashtags: this.contentPackage.platformCopy.forWeChatChannel.hashtags,
      videoPath: this.videoPath,
      platform: "wechat_channel" as const,
    };
  }

  /**
   * 获取 YouTube Shorts 发布信息
   */
  getYouTubeShortsPublishInfo() {
    return {
      title: this.contentPackage.coreContent.title,
      description: this.contentPackage.coreContent.extendedDescription,
      tags: this.contentPackage.platformCopy.forDouyin.hashtags,
      videoPath: this.videoPath,
      platform: "youtube_shorts" as const,
    };
  }

  /**
   * 生成发布报告
   */
  async generatePublishReport(outputDir: string): Promise<string> {
    const report: {
      metadata: ContentMetadata;
      content: CoreContent;
      platforms: Record<string, unknown>;
      videoPath: string;
    } = {
      metadata: this.contentPackage.metadata,
      content: this.contentPackage.coreContent,
      platforms: {},
      videoPath: this.videoPath,
    };

    if (this.contentPackage.metadata.targetPlatforms.includes("douyin")) {
      report.platforms.douyin = this.getDouyinPublishInfo();
    }

    if (this.contentPackage.metadata.targetPlatforms.includes("wechat_channel")) {
      report.platforms.wechat_channel = this.getWeChatChannelPublishInfo();
    }

    if (this.contentPackage.metadata.targetPlatforms.includes("youtube_shorts")) {
      report.platforms.youtube_shorts = this.getYouTubeShortsPublishInfo();
    }

    const filename = `${this.contentPackage.metadata.contentId}_publish.json`;
    const filepath = path.join(outputDir, filename);

    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(filepath, JSON.stringify(report, null, 2), "utf-8");

    return filepath;
  }

  /**
   * 生成发布文案文件（用于复制粘贴）
   */
  async generateCopyTextFiles(outputDir: string): Promise<string[]> {
    const files: string[] = [];

    if (this.contentPackage.metadata.targetPlatforms.includes("douyin")) {
      const douyinInfo = this.getDouyinPublishInfo();
      const douyinText = `【抖音发布文案】

标题: ${douyinInfo.title}

描述: ${douyinInfo.description}

标签: ${douyinInfo.hashtags.join(" ")}

互动引导: ${douyinInfo.interactionPrompt}

---
视频文件: ${this.videoPath}
`;

      const douyinFile = path.join(outputDir, `${this.contentPackage.metadata.contentId}_douyin.txt`);
      await fs.writeFile(douyinFile, douyinText, "utf-8");
      files.push(douyinFile);
    }

    if (this.contentPackage.metadata.targetPlatforms.includes("wechat_channel")) {
      const wechatInfo = this.getWeChatChannelPublishInfo();
      const wechatText = `【微信视频号发布文案】

标题: ${wechatInfo.title}

描述: ${wechatInfo.description}

标签: ${wechatInfo.hashtags.join(" ")}

---
视频文件: ${this.videoPath}
`;

      const wechatFile = path.join(outputDir, `${this.contentPackage.metadata.contentId}_wechat.txt`);
      await fs.writeFile(wechatFile, wechatText, "utf-8");
      files.push(wechatFile);
    }

    return files;
  }

  /**
   * 打印发布信息到控制台
   */
  printPublishInfo() {
    console.log("\n" + "=".repeat(60));
    console.log("📱 平台发布信息");
    console.log("=".repeat(60) + "\n");

    if (this.contentPackage.metadata.targetPlatforms.includes("douyin")) {
      const douyinInfo = this.getDouyinPublishInfo();
      console.log("🎵 抖音发布:");
      console.log(`   标题: ${douyinInfo.title}`);
      console.log(`   描述: ${douyinInfo.description}`);
      console.log(`   标签: ${douyinInfo.hashtags.join(" ")}`);
      console.log(`   互动: ${douyinInfo.interactionPrompt}\n`);
    }

    if (this.contentPackage.metadata.targetPlatforms.includes("wechat_channel")) {
      const wechatInfo = this.getWeChatChannelPublishInfo();
      console.log("💬 微信视频号发布:");
      console.log(`   标题: ${wechatInfo.title}`);
      console.log(`   描述: ${wechatInfo.description}`);
      console.log(`   标签: ${wechatInfo.hashtags.join(" ")}\n`);
    }

    if (this.contentPackage.metadata.targetPlatforms.includes("youtube_shorts")) {
      const youtubeInfo = this.getYouTubeShortsPublishInfo();
      console.log("▶️  YouTube Shorts 发布:");
      console.log(`   标题: ${youtubeInfo.title}`);
      console.log(`   描述: ${youtubeInfo.description}`);
      console.log(`   标签: ${youtubeInfo.tags.join(", ")}\n`);
    }

    console.log("=".repeat(60));
  }
}

/**
 * 工厂函数：创建发布器
 */
export function createPublisher(
  contentPackage: CompleteContentPackage,
  videoPath: string
): PlatformPublisher {
  return new PlatformPublisher(contentPackage, videoPath);
}
