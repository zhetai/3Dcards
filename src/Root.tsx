import "./index.css";
import { Composition, getStaticFiles } from "remotion";
import { AIVideo, aiVideoSchema } from "./components/AIVideo";
import { Postcard3D, postcard3DSchema } from "./components/Postcard3D";
import { FPS, INTRO_DURATION } from "./lib/constants";
import { getTimelinePath, loadTimelineFromFile } from "./lib/utils";
import { PostcardContentLoader } from "./lib/postcard-loader";

export const RemotionRoot: React.FC = () => {
  const staticFiles = getStaticFiles();

  // 加载现有的故事时间线
  const timelines = staticFiles
    .filter((file) => file.name.endsWith("timeline.json"))
    .map((file) => file.name.split("/")[1]);

  // 加载 Postcard 内容包
  const postcardFiles = staticFiles
    .filter(
      (file) => file.name.endsWith(".json") && file.name.includes("postcards"),
    )
    .map((file) => file.name);

  return (
    <>
      {/* 原有的 AI Video 组合 */}
      {timelines.map((storyName) => (
        <Composition
          id={storyName}
          component={AIVideo}
          fps={FPS}
          width={1080}
          height={1920}
          schema={aiVideoSchema}
          defaultProps={{
            timeline: null,
          }}
          calculateMetadata={async ({ props }) => {
            const { lengthFrames, timeline } = await loadTimelineFromFile(
              getTimelinePath(storyName),
            );

            return {
              durationInFrames: lengthFrames + INTRO_DURATION,
              props: {
                ...props,
                timeline,
              },
            };
          }}
        />
      ))}

      {/* 新的 3D Postcard 组合 */}
      {postcardFiles.map((filepath) => {
        const contentId = filepath.split("/").pop()?.replace(".json", "") || "";
        return (
          <Composition
            id={`Postcard3D_${contentId}`}
            component={Postcard3D}
            fps={30}
            width={1080}
            height={1920}
            schema={postcard3DSchema}
            defaultProps={
              {} as {
                contentPackage?: import("./lib/postcard-types").CompleteContentPackage;
              }
            }
            calculateMetadata={async ({
              props,
            }: {
              props: {
                contentPackage?: import("./lib/postcard-types").CompleteContentPackage;
              };
            }) => {
              const loader = new PostcardContentLoader();
              const contentPackage = await loader.loadContentPackage(
                `public/${filepath}`,
              );

              // 计算视频时长：每段文字 3 秒
              const segmentDuration = 3 * 30; // 每段 3 秒 @ 30fps
              const durationInFrames =
                contentPackage.coreContent.coreText.length * segmentDuration;

              return {
                durationInFrames,
                props: {
                  ...props,
                  contentPackage,
                },
              };
            }}
          />
        );
      })}
    </>
  );
};
