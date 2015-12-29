var webpack = require("webpack");
var path = require("path");
var GlobalizePlugin = require("globalize-webpack-plugin");
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

module.exports = {
	target: "web",
	cache: false,
	context: path.join(__dirname),
	devtool: false,
	entry: {
		main: ["babel-polyfill", "./src/client/app.js"],
		vendor: [
			"globalize",
			"globalize/dist/globalize-runtime/number",
			"globalize/dist/globalize-runtime/plural",
			"globalize/dist/globalize-runtime/message",
			"globalize/dist/globalize-runtime/currency",
			"globalize/dist/globalize-runtime/date",
			"globalize/dist/globalize-runtime/relative-time"
		]
	},
	output: {
		path: path.join(__dirname, "static/dist"),
		filename: "app-bundle.js",
		publicPath: "dist/"
	},
	plugins: [
		new webpack.DefinePlugin({__CLIENT__: true, __SERVER__: false}),
		new webpack.DefinePlugin({"process.env": {NODE_ENV: '"production"'}}),
		new GlobalizePlugin({
			production: false,
			developmentLocale: "en",
			supportedLocales: ["en", "es"],
			messages: path.join(__dirname, "src/shared/globalization/[locale].json"),
			output: path.join(__dirname, "static/dist/i18n/[locale].[hash].js")
		}),
		new CommonsChunkPlugin( "vendor", "vendor.[hash].js" ),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		//new webpack.optimize.UglifyJsPlugin()
	],
	module: {
		loaders: [
			{test: /\.json$/, loaders: ["json"]},
			{test: /\.jsx?$/, loaders: ["babel?cacheDirectory&presets[]=es2015&presets[]=react&presets[]=stage-0"], exclude: /node_modules/}
		],
		postLoaders: [],
		noParse: /\.min\.js/
	},
	resolve: {
		alias: {
			react: path.join(__dirname, "node_modules/react")
		},
		modulesDirectories: [
			"src",
			"node_modules",
			"web_modules"
		],
		extensions: ["", ".json", ".js", '.jsx']
	},
	node:    {
		__dirname: true,
		fs: 'empty'
	}
};