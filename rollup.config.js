const path = require('path');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');

module.exports = [
  {
    input: 'src/index.browser.js',
    output: {
      file: 'lib/fiberize.browser.js',
      format: 'umd',
      name: 'fiberize'
    },
    plugins: [
      resolve(),
      commonjs(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development')
      })
    ],
    treeshake: false
  },
  {
    input: 'src/index.js',
    output: {
      file: 'lib/fiberize.cjs.js',
      format: 'cjs'
    },
    external: ['invariant'],
    treeshake: false
  }
];
