const { resolve } = require('path')
const isDev = process.env.NODE_ENV !== 'production'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const TransformModulesPlugin = require('webpack-transform-modules-plugin')
//moment.js 打包局部语言插件
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
const Dotenv = require('dotenv-webpack')

const cssLoaders = (preNumber) => [
  // 'vue-style-loader',
  'style-loader',
  {
    loader: 'css-loader',
    options: {
      sourceMap: isDev,
      importLoaders: preNumber + 1,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [
          'postcss-flexbugs-fixes',
          [
            'postcss-preset-env',
            {
              autoprefixer: {
                grid: true,
                flexbox: 'no-2009',
              },
            },
          ],
          'postcss-normalize',
        ],
      },
      sourceMap: isDev,
    },
  },
]

module.exports = {
  // target: isDev ? 'web' : 'browserslist',
  entry: {
    app: resolve(__dirname, '../src/main.js'),
  },
  output: {
    filename: `js/[name].js`,
    path: resolve(__dirname, '../dist'),
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': resolve(__dirname, '../src'),
      _tabbar: resolve(__dirname, '../src/views/tabbar'),
      _vuex: resolve(__dirname, '../src/vuex/modules'),
      'cube-ui': 'cube-ui/lib',
    },
  },
  externals: {},
  plugins: [
    // new webpack.DefinePlugin({
    //   process: {
    //     env: {},
    //   },
    // }),
    new VueLoaderPlugin(),
    new TransformModulesPlugin(),
    new MomentLocalesPlugin({
      localesToKeep: ['ja', 'zh-cn', 'zh-tw'],
    }),
    new Dotenv(),
  ],
  module: {
    rules: [
      {
        test: /.js$/,
        loader: 'babel-loader',
        options: { cacheDirectory: true },
        exclude: (file) => /node_modules/.test(file) && !/\.vue\.js/.test(file),
      },
      {
        test: /.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.css$/,
        use: cssLoaders(0),
      },
      {
        test: /\.scss$/,
        use: [
          ...cssLoaders(1),
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDev,
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          ...cssLoaders(1),
          {
            loader: 'less-loader',
            options: {
              sourceMap: isDev,
              lessOptions: {
                modifyVars: {
                  // 直接覆盖变量
                  'tabbar-background-color': '#4b4b4b',
                  'collapse-item-content-padding': '0',
                  'grid-item-content-background-color': 'unset',
                },
              },
            },
          },
        ],
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
        use: 'url-loader',
      },
      {
        test: /\.(ttf|woff|woff2|eot|otf)$/,
        use: 'url-loader',
      },
    ],
  },
}
