// See all configuration options: https://remotion.dev/docs/config
// Each option also is available as a CLI flag: https://remotion.dev/docs/cli

// Note: When using the Node.JS APIs, the config file doesn't apply. Instead, pass options directly to the APIs

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.overrideWebpackConfig((currentConfiguration) => {
  const tailwindConfig = enableTailwind(currentConfiguration);
  return {
    ...tailwindConfig,
    resolve: {
      ...tailwindConfig.resolve,
      fallback: {
        ...tailwindConfig.resolve?.fallback,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
      },
    },
  };
});
