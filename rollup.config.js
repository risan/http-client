import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

module.exports = {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/HttpClient.esm.js',
      format: 'esm',
    },
    {
      name: 'HttpClient',
      file: 'dist/HttpClient.umd.js',
      format: 'umd',
    },
    {
      name: 'HttpClient',
      file: 'dist/HttpClient.umd.min.js',
      format: 'umd',
      plugins: [terser()],
    },
  ],
  plugins: [
    json(),
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};
