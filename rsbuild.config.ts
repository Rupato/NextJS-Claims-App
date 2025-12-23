import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: './src/app/page.tsx',
    },
  },
  output: {
    filename: {
      js: '[name].js',
    },
  },
});
