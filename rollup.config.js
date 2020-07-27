import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

import pkg from './package.json';

const name = 'formsy-react';
const input = 'src/index.ts';
const extensions = ['.js', '.ts'];
const babelConfig = {
  ...babelrc({ addExternalHelpersPlugin: false }),
  exclude: 'node_modules/**',
  extensions,
};
const common = { exports: 'named', sourcemap: true };
const plugins = [peerDepsExternal(), resolve({ extensions }), babel(babelConfig), commonjs()];

export default [
  // browser-friendly UMD build
  {
    input,
    output: { file: 'dist/formsy-react.umd.js', format: 'umd', name, ...common },
    plugins,
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input,
    output: [
      { file: pkg.main, format: 'cjs', ...common },
      { file: pkg.module, format: 'es', ...common },
    ],
    external: ['ms'],
    plugins,
  },
];
