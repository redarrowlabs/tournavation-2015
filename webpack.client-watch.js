var webpack = require("webpack");
var path = require("path");
var config = require("./webpack.client.js");
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

var host = process.env.HOST || "localhost";
var port = 8080;

config.cache = true;
config.debug = true;
config.devtool = "eval";

config.entry.main.unshift(
	"webpack-dev-server/client?http://" + host + ":" + port,
	"webpack/hot/only-dev-server"
);

var publicPath = "http://" + host + ":" + port + "/dist/";
config.output.filename = "app-bundle.js"
config.output.publicPath = publicPath;
config.output.hotUpdateMainFilename = "update/[hash]/update.json";
config.output.hotUpdateChunkFilename = "update/[hash]/[id].update.js";

config.plugins = [
	new webpack.DefinePlugin({__CLIENT__: true, __SERVER__: false}),
	new webpack.DefinePlugin({"process.env": {NODE_ENV: '"development"'}}),
	new webpack.HotModuleReplacementPlugin(),
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
  https:       false,    
  host:        host,
  port:        port,
	publicPath:  publicPath,
	contentBase: path.join(__dirname, "static"),
	hot:         true,
  debug:       true,
	inline:      true,
	lazy:        false,
	quiet:       true,
	noInfo:      false,
	headers:     {"Access-Control-Allow-Origin": "*"},
	stats:       {colors: true},
};

module.exports = config;