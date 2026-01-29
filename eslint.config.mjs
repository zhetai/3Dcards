import { config } from "@remotion/eslint-config-flat";

export default [
  ...config,
  {
    files: ["src/components/Postcard3D.tsx"],
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
