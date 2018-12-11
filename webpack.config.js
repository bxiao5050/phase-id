const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const Chalk = require('chalk')
const Yargs = require('yargs')
const md5 = require('md5')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

var {
	argv
} = Yargs
var action = argv.action
var sdkVersion = 'v2.1.025'
var SERVER
var isTest = false
var output = {
	path: path.join(__dirname, 'build'),
	filename: action === 'build-fb' ? 'sdk/sdk.js' : 'sdk.js?[hash:6]',
	chunkFilename: action === 'build-fb' ? 'sdk/sdk_[name].js' : '[name].js?[hash:6]',
}
var devServer = {
	contentBase: path.join(__dirname, 'build'),
	inline: true,
	port: 7000,
	https: true
}
switch (action) {
	case 'build-fb':
		isTest = false
		SERVER = 'https://sdk-sg.pocketgamesol.com'
		output.publicPath = ''
		break;
	case 'test-sg':
		SERVER = 'https://sdk-sg.pocketgamesol.com'
		output.publicPath = SERVER + '/jssdk/test/'
		break;
	case 'build-sg':
		SERVER = 'https://sdk-sg.pocketgamesol.com'
		isTest = true
		output.publicPath = SERVER + '/jssdk/FBInstant/'
		break;
	case 'test-vn':
		SERVER = 'https://sdk-vn.pocketgamesol.com'
		output.publicPath = SERVER + '/jssdk/v2.1.1/'
		break;
	case 'build-vn':
		SERVER = 'https://sdk-vn.pocketgamesol.com'
		isTest = false
		output.publicPath = SERVER + '/jssdk/v2.1/'
		break;
}
var definePlugin = {
	FBVersion: JSON.stringify('v3.2'),
	PREFIX: JSON.stringify(md5('RoyalGame').slice(0, 4)),
	VERSION: JSON.stringify(sdkVersion),
	SERVER: JSON.stringify(SERVER),
	ACTION: JSON.stringify(action),
	isTest: isTest
}
var webpackConfig = {

	entry: {
		SDK: path.join(__dirname, 'src', 'Base.ts'),
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
				use: [{
					loader: 'babel-loader',
				}, ]
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			},
			{
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
			},
			{
				test: /\.(ts|tsx)$/,
				use: [
					'ts-loader'
				]
			},
			{
				test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
				use: [{
					loader: 'file-loader',
					options: {
						name: '[name]-[hash:4].[ext]',
						outputPath: action === 'build-fb' ? './sdk/img' : './img'
					}
				}]
			}
		]
	},

	plugins: [
		new HtmlWebpackPlugin({
			filename: "index.html",
			chunks: ['SDK'],
			inject: 'head',
			template: "./index.html"
		}),
		new webpack.ProvidePlugin({
			md5: 'md5',
			$: 'jquery'
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