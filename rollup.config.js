import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

import pkg from './package.json';

const name = 'formsy-react',
  input = 'src/index.ts',
  extensions = ['.js', '.ts'],
  babelConfig = {
    ...babelrc({ addExternalHelpersPlugin: false }),
    exclude: 'node_modules/**',
    extensions,
  },
  common = { exports: 'named', sourcemap: true },
  plugins = [peerDepsExternal(), resolve({ extensions }), babel(babelConfig), commonjs()];
export default [
  // browser-friendly UMD build
  {
    input,
    output: { file: pkg.browser, format: 'umd', name, ...common },
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
