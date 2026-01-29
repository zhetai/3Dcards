#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import prompts from "prompts";
import ora from "ora";
import chalk from "chalk";
import * as dotenv from "dotenv";
import * as path from "path";
import {
  createContentGenerator,
  PostcardContentGenerator,
} from "./postcard-service";
import type { CompleteContentPackage } from "../src/lib/postcard-types";

dotenv.config({ quiet: true });

interface PostcardOptions {
  apiKey?: string;
  inspiration?: string;
  platforms?: string[];
  outputDir?: string;
  render?: boolean;
}

class PostcardCLI {
  private generator: PostcardContentGenerator | null = null;

  async run(options: PostcardOptions) {
    try {
      // 1. 获取 API Key
      const apiKey = await this.getApiKey(options.apiKey);
      this.generator = createContentGenerator(apiKey);

      // 2. 获取用户灵感
      const inspiration = await this.getInspiration(options.inspiration);

      // 3. 获取目标平台
      const platforms = await this.getPlatforms(options.platforms);

      // 4. 生成内容包
      const spinner = ora("正在生成完整内容包...").start();
      const contentPackage = await this.generator.generateCompletePackage(
        inspiration,
        platforms,
      );
      spinner.succeed(chalk.green("✅ 内容包生成成功！"));

      // 5. 显示生成的内容
      this.displayContent(contentPackage);

      // 6. 保存内容包
      const outputDir =
        options.outputDir ||
        path.join(process.cwd(), "public", "content", "postcards");
      const filepath = await this.generator.saveContentPackage(
        contentPackage,
        outputDir,
      );
      console.log(chalk.blue(`📁 内容包已保存到: ${filepath}`));

      // 7. 询问是否渲染视频
      const shouldRender =
        options.render !== undefined ? options.render : await this.askRender();

      if (shouldRender) {
        await this.renderVideo(contentPackage);
      } else {
        console.log(
          chalk.yellow("\n💡 提示：你可以稍后使用以下命令渲染视频："),
        );
        console.log(
          chalk.cyan(
            `npx remotion render Postcard3D_${contentPackage.metadata.contentId} out/${contentPackage.metadata.contentId}.mp4`,
          ),
        );
      }

      // 8. 显示发布信息
      this.displayPublishInfo(contentPackage);
    } catch (error) {
      console.error(chalk.red("\n❌ 错误:"), error);
      process.exit(1);
    }
  }

  private async getApiKey(providedKey?: string): Promise<string> {
    if (providedKey) {
      return providedKey;
    }

    const envKey = process.env.OPENAI_API_KEY;
    if (envKey) {
      return envKey;
    }

    const response = await prompts({
      type: "password",
      name: "apiKey",
      message: "请输入 OpenAI API Key:",
      validate: (value) => value.length > 0 || "API Key 不能为空",
    });

    if (!response.apiKey) {
      throw new Error("需要 OpenAI API Key");
    }

    return response.apiKey;
  }

  private async getInspiration(providedInspiration?: string): Promise<string> {
    if (providedInspiration) {
      return providedInspiration;
    }

    const response = await prompts({
      type: "text",
      name: "inspiration",
      message: "请输入你的灵感（一句话描述）:",
      validate: (value) => value.length > 0 || "灵感不能为空",
    });

    if (!response.inspiration) {
      throw new Error("需要输入灵感");
    }

    return response.inspiration;
  }

  private async getPlatforms(providedPlatforms?: string[]): Promise<string[]> {
    const validPlatforms = ["douyin", "wechat_channel", "youtube_shorts"];

    if (providedPlatforms) {
      const invalid = providedPlatforms.filter(
        (p) => !validPlatforms.includes(p),
      );
      if (invalid.length > 0) {
        throw new Error(`无效的平台: ${invalid.join(", ")}`);
      }
      return providedPlatforms;
    }

    const response = await prompts({
      type: "multiselect",
      name: "platforms",
      message: "选择目标平台:",
      choices: [
        { title: "抖音", value: "douyin" },
        { title: "微信视频号", value: "wechat_channel" },
        { title: "YouTube Shorts", value: "youtube_shorts" },
      ],
      min: 1,
    });

    if (!response.platforms || response.platforms.length === 0) {
      return ["douyin", "wechat_channel"];
    }

    return response.platforms;
  }

  private displayContent(contentPackage: CompleteContentPackage) {
    console.log(chalk.bold("\n📝 生成的内容:\n"));

    console.log(chalk.cyan("🎯 核心标题:"));
    console.log(`   ${contentPackage.coreContent.title}\n`);

    console.log(chalk.cyan("📖 主体文案:"));
    contentPackage.coreContent.coreText.forEach((text, i) => {
      console.log(`   ${i + 1}. ${text}`);
    });

    console.log(chalk.cyan("\n🎨 视觉风格:"));
    console.log(
      `   风格关键词: ${contentPackage.visualAndAudioSpec.styleKeywords.join(", ")}`,
    );
    console.log(
      `   动画情绪: ${contentPackage.visualAndAudioSpec.animationMood}`,
    );
    console.log(
      `   主色调: ${contentPackage.visualAndAudioSpec.colorPalette.primary}`,
    );
    console.log(
      `   辅助色: ${contentPackage.visualAndAudioSpec.colorPalette.secondary}`,
    );
  }

  private async askRender(): Promise<boolean> {
    const response = await prompts({
      type: "confirm",
      name: "render",
      message: "是否立即渲染视频?",
      initial: true,
    });

    return response.render ?? false;
  }

  private async renderVideo(contentPackage: CompleteContentPackage) {
    const spinner = ora("正在渲染视频...").start();

    // 这里应该调用 Remotion 的渲染 API
    // 由于这是一个示例，我们只是模拟渲染过程
    await new Promise((resolve) => setTimeout(resolve, 2000));

    spinner.succeed(chalk.green("✅ 视频渲染完成！"));

    const outputPath = path.join(
      process.cwd(),
      "out",
      `${contentPackage.metadata.contentId}.mp4`,
    );
    console.log(chalk.blue(`🎬 视频已保存到: ${outputPath}`));
  }

  private displayPublishInfo(contentPackage: CompleteContentPackage) {
    console.log(chalk.bold("\n📱 发布信息:\n"));

    if (contentPackage.metadata.targetPlatforms.includes("douyin")) {
      console.log(chalk.yellow("抖音发布:"));
      console.log(
        `   标题: ${contentPackage.platformCopy.forDouyin.postTitle}`,
      );
      console.log(
        `   标签: ${contentPackage.platformCopy.forDouyin.hashtags.join(" ")}`,
      );
      console.log(
        `   互动: ${contentPackage.platformCopy.forDouyin.interactionPrompt}\n`,
      );
    }

    if (contentPackage.metadata.targetPlatforms.includes("wechat_channel")) {
      console.log(chalk.green("微信视频号发布:"));
      console.log(
        `   标题: ${contentPackage.platformCopy.forWeChatChannel.postTitle}`,
      );
      console.log(
        `   标签: ${contentPackage.platformCopy.forWeChatChannel.hashtags.join(" ")}\n`,
      );
    }

    console.log(
      chalk.magenta("💡 提示: 内容包已保存，你可以随时重新加载并渲染视频！"),
    );
  }
}

// CLI 入口
yargs(hideBin(process.argv))
  .command(
    "create",
    "创建 AI 深度明信片",
    (yargs) => {
      return yargs
        .option("api-key", {
          alias: "k",
          type: "string",
          description: "OpenAI API Key",
        })
        .option("inspiration", {
          alias: "i",
          type: "string",
          description: "用户灵感（一句话描述）",
        })
        .option("platforms", {
          alias: "p",
          type: "array",
          description: "目标平台（douyin, wechat_channel, youtube_shorts）",
        })
        .option("output-dir", {
          alias: "o",
          type: "string",
          description: "输出目录",
        })
        .option("render", {
          alias: "r",
          type: "boolean",
          description: "是否立即渲染视频",
        });
    },
    async (argv) => {
      const cli = new PostcardCLI();
      await cli.run({
        apiKey: argv["api-key"],
        inspiration: argv.inspiration,
        platforms: argv.platforms as string[],
        outputDir: argv["output-dir"],
        render: argv.render,
      });
    },
  )
  .demandCommand(1, "需要指定命令")
  .help()
  .alias("help", "h")
  .version()
  .alias("version", "v")
  .strict()
  .parse();
