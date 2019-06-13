const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const Yargs = require('yargs');
const md5 = require('md5');

var {
  argv
} = Yargs

const action = argv.action
const isDev = action === 'dev'
const reactSrc = isDev ? 'https://cdnjs.cloudflare.com/ajax/libs/react/16.6.3/umd/react.development.js' : 'https://cdnjs.cloudflare.com/ajax/libs/react/16.6.3/umd/react.production.min.js'
const reactDomSrc = isDev ? 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.6.3/umd/react-dom.development.js' : 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.6.3/umd/react-dom.production.min.js'
const reactRouterDomSrc = 'https://cdnjs.cloudflare.com/ajax/libs/react-router-dom/4.3.1/react-router-dom.min.js'

var sdkVersion = argv.sdkVersion
var SERVER = ''
var devServer = {
  contentBase: path.join(__dirname, 'build'),
  inline: true,
  port: 7001,
  // https: true
}
if (sdkVersion === true) {
  console.error('miss sdkVersion')
  process.exit()
}
var filename = isDev ? '[name].js' : `${sdkVersion}/[name].js?[hash:6]`
var chunkFilename = isDev ? '[name].js' : `${sdkVersion}/[name].js?[hash:6]`
var output = {
  path: path.join(__dirname, 'build'),
  filename,
  chunkFilename
}
switch (action) {
  case 'sg':
    SERVER = 'https://sdk-sg.pocketgamesol.com'
    output.publicPath = SERVER + '/jssdk/'
    break;
  case 'vn':
    SERVER = 'https://sdk-vn.pocketgamesol.com'
    output.publicPath = SERVER + '/jssdk/'
    break;
  case 'de':
    SERVER = 'https://desdk-cdn.pkmonquest.com'
    output.publicPath = SERVER + '/jssdk/'
    break;
  case 'dev':
    SERVER = 'https://sdk-test.changic.net.cn'
    output.publicPath = ''
    break
  case 'test':
    SERVER = 'https://sdk-test.changic.net.cn'
    output.publicPath = SERVER + '/jssdk/'
    break
}
var definePlugin = {
  FBVersion: JSON.stringify('v3.2'),
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
    sdk: path.join(__dirname, 'src/jssdk/main.ts'),
    shortcut: path.join(__dirname, 'src/add-shortcut/main.ts'),
    // index: path.join(__dirname, 'src/index/main.ts'),
  },

  resolve: {

    extensions: [".ts", ".tsx", ".js"],

    alias: {
      Base: path.join(__dirname, 'src/jssdk/Base'),
      DOM: path.join(__dirname, 'src/jssdk/DOM'),
      Src: path.join(__dirname, 'src/jssdk'),
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
      chunks: ['sdk'],
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
