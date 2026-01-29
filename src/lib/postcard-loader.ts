import { staticFile } from "remotion";
import { CompleteContentPackageSchema } from "./postcard-types";

/**
 * Postcard 内容包加载器
 * 仅用于从文件加载已生成的内容包（不包含 OpenAI 生成功能）
 */
export class PostcardContentLoader {
  /**
   * 从文件加载内容包
   */
  async loadContentPackage(filepath: string): Promise<import("./postcard-types").CompleteContentPackage> {
    const res = await fetch(staticFile(filepath));
    const content = await res.json();
    const parsedContent = content;

    // 验证数据结构
    const validatedContent = CompleteContentPackageSchema.parse(parsedContent);

    return validatedContent;
  }
}