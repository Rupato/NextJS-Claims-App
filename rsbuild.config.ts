import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';

export default defineConfig({
  plugins: [pluginReact(), pluginNodePolyfill()],
  source: {
    entry: {
      index: './src/main.tsx',
    },
    define: {
      __dirname: JSON.stringify(process.cwd()),
    },
  },
  output: {
    filename: {
      js: '[name].js',
    },
  },
  environments: {
    web: {
      source: {
        define: {
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        },
      },
    },
  },
  tools: {
    postcss: {},
  },
});
