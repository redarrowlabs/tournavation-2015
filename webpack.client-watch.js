var webpack = require("webpack");
var config = require("./webpack.client.js");

var host = process.env.HOST || "localhost";

config.cache = true;
config.debug = true;
config.devtool = "eval-sourcemap";

config.entry.unshift(
	"webpack-dev-server/client?http://" + host + ":8080",
	"webpack/hot/only-dev-server"
);

config.output.filename = "app-bundle.js"
config.output.publicPath = "http://" + host + ":8080/dist/";
config.output.hotUpdateMainFilename = "update/[hash]/update.json";
config.output.hotUpdateChunkFilename = "update/[hash]/[id].update.js";

config.plugins = [
	new webpack.DefinePlugin({__CLIENT__: true, __SERVER__: false}),
	new webpack.HotModuleReplacementPlugin()
];

config.module.loaders = [
	{
    test:    /\.jsx?$/,
    exclude: /node_modules/,
    loaders: ['babel-loader']
  }
];

config.module.postLoaders =  [
	{test: /\.js$/, loaders: ["react-hot"], exclude: /node_modules/}
];

config.devServer = {
	publicPath:  "http://" + host + ":8080/dist/",
	contentBase: "./static",
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