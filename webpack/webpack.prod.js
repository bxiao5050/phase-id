const path = require('path');
const webpack = require('webpack');
const {merge} = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');
const DeleteInjectScriptPlugin = require('./delete-inject-webpack-plugin');
// 测量打包时间时，注释 HtmlWebpackPlugin 二者有一定的冲突
// const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
// const smp = new SpeedMeasurePlugin();
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const common = require('./webpack.common.js');
const webpackConfig = merge(common, {
  mode: 'production',
  // devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [require('autoprefixer')()]
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
        type: 'asset'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new MiniCssExtractPlugin({
      // 所有选项都是可选的
      filename: '[name]-[contenthash:6].css',
      ignoreOrder: false // 忽略有关顺序冲突的警告
    })
    // new DeleteInjectScriptPlugin()
  ],
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 249856
    }
  },
  externals: {
    react: 'window.React',
    'react-dom': 'window.ReactDOM',
    'react-router-dom': 'window.ReactRouterDOM'
  }
});
// webpackConfig = smp.wrap(webpackConfig);
module.exports = webpackConfig;
