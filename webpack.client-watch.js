var webpack = require("webpack");
var path = require("path");
var config = require("./webpack.client.js");
//var GlobalizePlugin = require("globalize-webpack-plugin");
var ReactGlobalizePlugin = require('react-globalize-webpack-plugin');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

var host = process.env.HOST || "localhost";

config.cache = true;
config.debug = true;
config.devtool = "eval";

config.entry.main.unshift(
	"webpack-dev-server/client?http://" + host + ":8080",
	"webpack/hot/only-dev-server"
);

config.output.filename = "app-bundle.js"
config.output.publicPath = "http://" + host + ":8080/dist/";
config.output.hotUpdateMainFilename = "update/[hash]/update.json";
config.output.hotUpdateChunkFilename = "update/[hash]/[id].update.js";

config.plugins = [
	new webpack.DefinePlugin({__CLIENT__: true, __SERVER__: false}),
	new webpack.DefinePlugin({"process.env": {NODE_ENV: '"development"'}}),
		new webpack.HotModuleReplacementPlugin(),
	/*new ReactGlobalizePlugin({
			production: false,
			developmentLocale: "en",
			supportedLocales: ["en", "es"],
			messages: path.join(__dirname, "src/shared/globalization/[locale].json"),
			writeMessages: true,
			output: "i18n/[locale].js"
		}),*/
		new CommonsChunkPlugin("vendor", "vendor-bundle.js")
];

config.module.postLoaders =  [
	{
		test: /\.js$/,
		loaders: ["react-hot"],
		exclude: /node_modules/
	}
];

config.devServer = {
	publicPath:  "http://" + host + ":8080/dist/",
	contentBase: path.join(__dirname, "static"),
	hot:         true,
	inline:      true,
	lazy:        false,
	quiet:       true,
	noInfo:      false,
	headers:     {"Access-Control-Allow-Origin": "*"},
	stats:       {colors: true},
	host:        host
};

module.exports = config;