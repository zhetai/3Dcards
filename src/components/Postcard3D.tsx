import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  random,
} from "remotion";
import { Canvas } from "@react-three/fiber";
import { Text, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import type { Postcard3DProps } from "../lib/postcard-types";
import { Postcard3DPropsSchema } from "../lib/postcard-types";

/**
 * 3D 明信片组件
 * 使用 Three.js 和 React Three Fiber 创建具有胶片质感的 3D 明信片
 */
export const Postcard3D: React.FC<Postcard3DProps> = ({ contentPackage }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 解析颜色
  const colors = useMemo(() => {
    if (!contentPackage?.visualAndAudioSpec?.colorPalette) {
      return {
        primary: "#ffffff",
        secondary: "#000000",
        text: "#000000",
      };
    }

    const parseColor = (colorStr: string) => {
      if (colorStr.includes("渐变")) {
        // 简化渐变处理，取第一个颜色
        const match = colorStr.match(/#[0-9a-fA-F]{6}/);
        return match ? match[0] : "#ffffff";
      }
      return colorStr;
    };
    return {
      primary: parseColor(
        contentPackage.visualAndAudioSpec.colorPalette.primary,
      ),
      secondary: parseColor(
        contentPackage.visualAndAudioSpec.colorPalette.secondary,
      ),
      text: parseColor(
        contentPackage.visualAndAudioSpec.colorPalette.textColor,
      ),
    };
  }, [contentPackage?.visualAndAudioSpec?.colorPalette]);

  if (!contentPackage) {
    return null;
  }

  const { coreContent } = contentPackage;

  // 计算总时长（每段文字 3 秒）
  const segmentDuration = 3 * fps; // 每段 3 秒

  // 场景组件
  const Scene = () => {
    const currentFrame = useCurrentFrame();

    // 背景平面
    const BackgroundPlane = () => {
      const rotation = spring({
        frame: currentFrame,
        fps,
        config: { damping: 20, stiffness: 50 },
      });

      return (
        // @ts-ignore
        // @ts-ignore
        <mesh rotation={[0, rotation, 0]} position={[0, 0, -2]}>
          // @ts-ignore
          {/* @ts-ignore */}
          // @ts-ignore
          <planeGeometry args={[16, 9]} />
          {/* @ts-ignore */}
          <meshBasicMaterial color={colors.primary} />
          // @ts-ignore
        </mesh>
      );
    };

    // 文字卡片
    const TextCard = ({ text, index }: { text: string; index: number }) => {
      const startFrame = index * segmentDuration;
      const endFrame = startFrame + segmentDuration;

      if (currentFrame < startFrame || currentFrame >= endFrame) {
        return null;
      }

      const localFrame = currentFrame - startFrame;
      const opacity = interpolate(localFrame, [0, 15], [0, 1], {
        extrapolateRight: "clamp",
      });

      const positionY = 1 - index * 0.8;

      return (
        <Text
          position={[0, positionY, 0]}
          fontSize={0.3}
          color={colors.text}
          anchorX="center"
          anchorY="middle"
          // @ts-ignore
          maxWidth={10}
        >
          {text}
          <meshBasicMaterial transparent opacity={opacity} />
        </Text>
      );
    };

    // 粒子系统
    const Particles = () => {
      const particleCount = 50;
      const positions = useMemo(() => {
        const pos = [];
        for (let i = 0; i < particleCount; i++) {
          pos.push(
            (random(`x-${i}`) - 0.5) * 10,
            (random(`y-${i}`) - 0.5) * 6,
            (random(`z-${i}`) - 0.5) * 2,
          );
        }
        // @ts-ignore
        // @ts-ignore
        // @ts-ignore
        return pos;
      }, []);

      return (
        <points>
          <bufferGeometry>
            // @ts-ignore
            <bufferAttribute
              attach="attributes-position"
              count={particleCount}
              array={new Float32Array(positions)}
              itemSize={3}
              // @ts-ignore
            />
            // @ts-ignore
          </bufferGeometry>
          <pointsMaterial size={0.05} color={colors.secondary} transparent />
        </points>
      );
      // @ts-ignore
      // @ts-ignore
      // @ts-ignore
    };

    return (
      <>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <OrbitControls enableZoom={false} enablePan={false} />

        {/* 灯光 */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight
          position={[-10, -10, -10]}
          intensity={0.5}
          color={colors.secondary}
        />

        {/* 背景 */}
        <BackgroundPlane />

        {/* 粒子 */}
        <Particles />

        {/* 文字 */}
        {coreContent.coreText.map((text, index) => (
          <TextCard key={index} text={text} index={index} />
        ))}
      </>
    );
  };

  return (
    <AbsoluteFill
      style={{
        background: colors.primary,
      }}
    >
      <Canvas>
        <Scene />
      </Canvas>

      {/* 叠加标题 */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 60,
          pointerEvents: "none",
        }}
      >
        <h1
          style={{
            color: colors.text,
            fontSize: 48,
            fontWeight: "bold",
            textShadow: `2px 2px 4px rgba(0,0,0,0.3)`,
            opacity: interpolate(frame, [0, 30], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          {coreContent.title}
        </h1>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 导出 schema 用于 Remotion 验证
export const postcard3DSchema = Postcard3DPropsSchema;
