const path = require('path');
const webpack = require('webpack');
const chalk = require('chalk');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const {argv} = require('yargs');
const params = {};
// 使用webpack-cli --env 获取参数名
if (typeof argv.env === 'string') {
  params[argv.env] = argv._[0];
} else if (Array.isArray(argv.env)) {
  // 多参数是数组
  const [actionKey, actionValue] = argv.env[0].split('=');
  if (argv._[0] === 'serve') {
    params[argv.env[1]] = argv._[1];
  } else {
    params[argv.env[1]] = argv._[0];
  }
  params[actionKey] = actionValue;
} else {
  // 分析打包文件
  params.sdkVersion = '3dbuyu';
}

if (!params.sdkVersion) {
  console.error(chalk.red('miss sdkVersion'));
  console.log(chalk.blue('Example: npm run build test'));
  process.exit(0);
}
const reactSrc = '//cdnjs.cloudflare.com/ajax/libs/react/17.0.1/umd/react.production.min.js';
const reactDomSrc =
  '//cdnjs.cloudflare.com/ajax/libs/react-dom/17.0.1/umd/react-dom.production.min.js';
const reactRouterDomSrc =
  '//cdnjs.cloudflare.com/ajax/libs/react-router-dom/5.2.0/react-router-dom.min.js';

let SERVER = '';
let publicPath = '';
switch (params.action) {
  case 'sg':
    SERVER = '//sdk-sg.pocketgamesol.com';
    publicPath = SERVER + '/jssdk/';
    break;
  case 'vn':
    SERVER = '//sdk-vn.pocketgamesol.com';
    publicPath = SERVER + '/jssdk/';
    break;
  case 'de':
    SERVER = '//sdk-de.pocketgamesol.com';
    publicPath = SERVER + '/jssdk/';
    break;
  case 'test':
    SERVER = '//sdk-test.changic.net.cn';
    publicPath = SERVER + '/jssdk/';
    break;
  default:
    // SERVER = '/api';
    SERVER = '//sdk-test.changic.net.cn';
    params.sdkVersion = 'dev';
    publicPath = '';
    break;
}

module.exports = {
  entry: {
    polyfills: path.join(__dirname, '../src/jssdk/polyfills.ts'),
    sdk: path.join(__dirname, '../src/jssdk/main.ts')
  },
  output: {
    filename: '[name].js',
    chunkFilename: `[contenthash:6].js`,
    path: path.resolve(__dirname, '../dist'),
    publicPath: publicPath,
    assetModuleFilename: 'img/[name]-[hash:4][ext]'
  },
  context: path.join(__dirname, '..'),
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      Src: path.join(__dirname, '../src')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'ts-loader'
            // options: {
            //   transpileOnly: true //去除编译检查可以让打包快1/3,需要检查就注释这个选项
            // }
          }
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
      VERSION: JSON.stringify(params.sdkVersion),
      FBVersion: JSON.stringify('v8.0'),
      reactSrc: JSON.stringify(reactSrc),
      reactDomSrc: JSON.stringify(reactDomSrc),
      reactRouterDomSrc: JSON.stringify(reactRouterDomSrc),
      SERVER: JSON.stringify(SERVER)
    }),
    new CleanWebpackPlugin()
  ]
};
