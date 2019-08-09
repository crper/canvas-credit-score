import autoExternal from 'rollup-plugin-auto-external';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import del from 'rollup-plugin-delete';
import { eslint } from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import serve from 'rollup-plugin-serve';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const name = 'CreditScore';

const devPlugin = [];

const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

// banner
const banner =
  `${'/*!\n' + ' * '}${pkg.name}.js v${pkg.version}\n` +
  ` * (c) 2019-${new Date().getFullYear()} ${pkg.author.name}(${
    pkg.author.email
  })\n` +
  ' * Released under the MIT License.\n' +
  ' */';
const footer = '/*powered by crper(crper@outlook.com) */';

const config = {
  input: './src/index.ts',

  // 排除部分库打包到bundle
  // https://rollupjs.org/guide/en#external-e-external
  external: [],

  // 插件
  plugins: [
    // Allows node_modules resolution
    resolve({ extensions }),

    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs(),

    // Compile TypeScript/JavaScript files
    babel({
      extensions,
      include: ['src/**'],
      exclude: 'node_modules/**'
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    del({ targets: 'dist/lib', force: true, verbose: true }),
    // Rollup plugin to automatically exclude package.json dependencies and peerDependencies from your bundle.
    // https://www.npmjs.com/package/rollup-plugin-auto-external
    autoExternal()
  ],

  // 输出
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'es'
    },
    {
      file: pkg.browser,
      format: 'umd',
      name,
      // https://rollupjs.org/guide/en#output-globals-g-globals
      globals: {}
    }
  ],
  watch: {
    include: 'src/**/*'
  }
};

// 针对生产版的额外配置
if (isProd) {
  config.output = config.output.map(item => {
    item['banner'] = banner;
    item['footer'] = footer;
    item['sourcemap'] = 'inline';
    return item;
  });
  config.plugins.push(
    terser({
      output: {
        comments: /crper/g
      }
    })
  );
}
// 针对开发版的额外配置
if (isDev) {
  // https://www.npmjs.com/package/rollup-plugin-livereload
  config.plugins.push(
    // https://github.com/TrySound/rollup-plugin-eslint
    eslint(),
    serve({
      open: true,
      contentBase: 'dist'
    })
  );
}

export default config;
