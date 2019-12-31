const path = require('path');

const md5 = require('md5');
const Yargs = require('yargs');
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

const { argv } = Yargs;
const action = argv.action;
const sdkVersion = argv.sdkVersion
const isDev = action === 'dev';
const reactSrc = isDev ?
  '//cdnjs.cloudflare.com/ajax/libs/react/16.6.3/umd/react.development.js' :
  '//cdnjs.cloudflare.com/ajax/libs/react/16.6.3/umd/react.production.min.js';
const reactDomSrc = isDev ?
  '//cdnjs.cloudflare.com/ajax/libs/react-dom/16.6.3/umd/react-dom.development.js' :
  '//cdnjs.cloudflare.com/ajax/libs/react-dom/16.6.3/umd/react-dom.production.min.js';
const reactRouterDomSrc = '//cdnjs.cloudflare.com/ajax/libs/react-router-dom/4.3.1/react-router-dom.min.js';


var SERVER = '';
var devServer = {
  host: "0.0.0.0",
  contentBase: path.join(__dirname, 'build'),
  inline: true,
  port: 7001,
  // https: true
}
if (sdkVersion === true) {
  console.error('miss sdkVersion')
  process.exit()
}
var filename = isDev ? '[name].js' : `${ sdkVersion }/[name].js?[hash:6]`
var chunkFilename = isDev ? '[name].js' : `${ sdkVersion }/[name].js?[hash:6]`
var output = {
  path: path.join(__dirname, 'build'),
  filename,
  chunkFilename
}
switch (action) {
  case 'sg':
    SERVER = '//sdk-sg.pocketgamesol.com';
    output.publicPath = SERVER + '/jssdk/';
    break;
  case 'vn':
    SERVER = '//sdk-vn.pocketgamesol.com';
    output.publicPath = SERVER + '/jssdk/';
    break;
  case 'de':
    SERVER = '//desdk-cdn.pkmonquest.com';
    output.publicPath = SERVER + '/jssdk/';
    break;
  case 'test':
    SERVER = '//sdk-test.changic.net.cn';
    output.publicPath = SERVER + '/jssdk/';
    break;
  default:
    // SERVER = '/api';
    SERVER = '//sdk-test.changic.net.cn';
    output.publicPath = '';
    break;
}
var definePlugin = {
  FBVersion: JSON.stringify('v3.3'),
  PREFIX: JSON.stringify(md5('RoyalGame').slice(0, 4)),
  VERSION: JSON.stringify(sdkVersion),
  SERVER: JSON.stringify(SERVER),
  IS_DEV: isDev,
  IS_TEST: action === 'test',
  reactSrc: JSON.stringify(reactSrc),
  reactDomSrc: JSON.stringify(reactDomSrc),
  reactRouterDomSrc: JSON.stringify(reactRouterDomSrc),
}
var webpackConfig = {

  entry: {
    dev: path.join(__dirname, './src/jssdk/dev/index.ts'),
    sdk: path.join(__dirname, 'src/jssdk/main.ts'),
    shortcut: path.join(__dirname, 'src/add-shortcut/main.ts'),
    // index: path.join(__dirname, 'src/index/main.ts'),
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      Base: path.join(__dirname, 'src/jssdk/Base'),
      DOM: path.join(__dirname, 'src/jssdk/DOM'),
      Src: path.join(__dirname, 'src'),
      SDK: path.join(__dirname, 'src/jssdk')
    }
  },
  output: output,
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }, {
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: () => [
              require('autoprefixer')(),
            ]
          }
        },
        'sass-loader'
      ]
    }, {
      test: /\.(ts|tsx)$/,
      use: ['ts-loader']
    }, {
      test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name]-[hash:4].[ext]',
          outputPath: sdkVersion + '/img'
        }
      }]
    }]
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: isDev ? 'add-shortcut.html' : sdkVersion + '/' + 'add-shortcut.html',
      template: './src/add-shortcut.html',
      chunks: ['shortcut'],
      inject: 'body',
      minify: isDev ? false : {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      },
      templateParameters: {
        reactSrc,
        reactDomSrc,
        reactRouterDomSrc
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      chunks: isDev ? ['sdk', 'dev'] : ['sdk'],
      inject: 'body',
      minify: isDev ? false : {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      },
      templateParameters: {
        reactSrc,
        reactDomSrc,
        reactRouterDomSrc
      }
    }),
    new webpack.ProvidePlugin({
      md5: 'md5'
    }),
    new webpack.DefinePlugin(definePlugin),
  ],

  devServer: devServer,

  externals: {
    'react': 'window.React',
    'react-dom': 'window.ReactDOM',
    'react-router-dom': 'window.ReactRouterDOM',
  },
}

// argv.mode === 'production' &&
webpackConfig.plugins.push(
  new CleanWebpackPlugin([
    path.join(__dirname, 'build', '**/*'),
  ])
)

module.exports = webpackConfig
