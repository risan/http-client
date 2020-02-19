import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const { DEVELOPMENT } = process.env;

module.exports = {
  input: 'src/HttpClient.js',
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
    DEVELOPMENT
      ? null
      : {
          name: 'HttpClient',
          file: 'dist/HttpClient.umd.min.js',
          format: 'umd',
          plugins: [terser()],
        },
  ].filter(Boolean),
  plugins: [
    json(),
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};
