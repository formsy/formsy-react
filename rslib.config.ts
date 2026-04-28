import { defineConfig } from '@rslib/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';

export default defineConfig({
  lib: [
    {
      format: 'esm',
      dts: true,
    },
    {
      format: 'cjs',
      dts: true,
    },
  ],
  source: {
    transformImport: [
      {
        libraryName: 'lodash',
        customName: 'lodash/{{ member }}',
      },
    ],
    entry: {
      index: './src/index.ts',
    },
  },
  output: {
    cleanDistPath: true,
    distPath: './dist',
  },
  plugins: [pluginTypeCheck(), pluginReact()],
});
