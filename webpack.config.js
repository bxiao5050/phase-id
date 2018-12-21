const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const Yargs = require('yargs')
const md5 = require('md5')

var {
	argv
} = Yargs

var action = argv.action
var isDev = action === 'dev'
var sdkVersion = argv.sdkVersion
var SERVER = ''
var devServer = {
	contentBase: path.join(__dirname, 'build'),
	inline: true,
	port: 7001,
	https: true
}
if (sdkVersion === true) {
	console.error('miss sdkVersion')
	process.exit()
}
var filename = isDev ? 'sdk.js' : `${sdkVersion}/sdk.js`
var chunkFilename = isDev ? '[name].js?[hash:8]' : `${sdkVersion}/[name].js`
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
		output.publicPath = ''
		break
}
var definePlugin = {
	FBVersion: JSON.stringify('v3.2'),
	PREFIX: JSON.stringify(md5('RoyalGame').slice(0, 4)),
	VERSION: JSON.stringify(sdkVersion),
	SERVER: JSON.stringify(SERVER),
	ACTION: JSON.stringify(action),
}
var webpackConfig = {

	entry: {
		SDK: path.join(__dirname, 'src', 'Main.ts'),
	},

	resolve: {
		extensions: [".ts", ".tsx", ".js"],
		alias: {
			Base: path.join(__dirname, 'src/Base'),
			SDK: path.join(__dirname, 'src/SDK'),
			FBinstant: path.join(__dirname, 'src/FBinstant'),
			DOM: path.join(__dirname, 'src/DOM'),
			Src: path.join(__dirname, 'src'),
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
			filename: isDev ? 'index.html' : sdkVersion + '/' + 'login.html',
			template: 'index.html',
			// chunks: ['SDK'],
			inject: false,
		}),
		new webpack.ProvidePlugin({
			md5: 'md5'
		}),
		new webpack.DefinePlugin(definePlugin),
	],

	devServer: devServer
}

argv.mode === 'production' && webpackConfig.plugins.push(
	new CleanWebpackPlugin([
		path.join(__dirname, 'build', '**/*.js'),
		path.join(__dirname, 'build', '**/*.zip')
	])
)

module.exports = webpackConfig