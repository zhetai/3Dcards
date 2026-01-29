import OpenAI from "openai";
import {
  CompleteContentPackageSchema,
  CompleteContentPackage,
  SYSTEM_PROMPT_TEMPLATE,
} from "../src/lib/postcard-types";
import * as crypto from "crypto";

export class PostcardContentGenerator {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  /**
   * 生成完整内容包
   */
  async generateCompletePackage(
    inspiration: string,
    platforms: string[] = ["douyin", "wechat_channel"]
  ): Promise<CompleteContentPackage> {
    const timestamp = new Date().toISOString();
    const contentId = this.generateContentId(inspiration, timestamp);

    const systemPrompt = SYSTEM_PROMPT_TEMPLATE;

    const userPrompt = `请为以下灵感生成完整的短视频内容包：\n\n"${inspiration}"\n\n目标平台：${platforms.join(", ")}`;

    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
          {
            role: "assistant",
            content: "请严格以 JSON 格式返回，不要包含任何其他文字说明。",
          },
        ],
        temperature: 0.8,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("LLM 返回了空内容");
      }

      // 解析 JSON
      let parsedContent: any;
      try {
        parsedContent = JSON.parse(content);
      } catch (parseError) {
        throw new Error(`无法解析 LLM 返回的 JSON: ${parseError}`);
      }

      // 更新 metadata 中的 contentId 和 sourceInspiration
      parsedContent.metadata.contentId = contentId;
      parsedContent.metadata.sourceInspiration = inspiration;
      parsedContent.metadata.generationTimestamp = timestamp;
      parsedContent.metadata.targetPlatforms = platforms;

      // 验证数据结构
      const validatedContent = CompleteContentPackageSchema.parse(parsedContent);

      return validatedContent;
    } catch (error) {
      console.error("生成内容包时出错:", error);
      throw error;
    }
  }

  /**
   * 生成内容 ID
   */
  private generateContentId(inspiration: string, timestamp: string): string {
    const hash = crypto
      .createHash("md5")
      .update(inspiration)
      .digest("hex")
      .substring(0, 8);
    const datePart = timestamp.replace(/[:-]/g, "").replace("T", "_").substring(0, 15);
    return `${datePart}_${hash}`;
  }

  /**
   * 保存内容包到文件
   */
  async saveContentPackage(
    contentPackage: CompleteContentPackage,
    outputDir: string
  ): Promise<string> {
    const fs = await import("fs/promises");
    const path = await import("path");

    const filename = `${contentPackage.metadata.contentId}.json`;
    const filepath = path.join(outputDir, filename);

    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(filepath, JSON.stringify(contentPackage, null, 2), "utf-8");

    return filepath;
  }

  /**
   * 从文件加载内容包
   */
  async loadContentPackage(filepath: string): Promise<CompleteContentPackage> {
    const fs = await import("fs/promises");

    const content = await fs.readFile(filepath, "utf-8");
    const parsed = JSON.parse(content);
    return CompleteContentPackageSchema.parse(parsed);
  }
}

/**
 * 工厂函数：创建内容生成器
 */
export function createContentGenerator(apiKey: string): PostcardContentGenerator {
  return new PostcardContentGenerator(apiKey);
}
