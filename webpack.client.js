var webpack = require("webpack");
var path = require("path");
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

module.exports = {
	target: "web",
	cache: false,
	context: path.join(__dirname),
	devtool: false,
	debug: false,
	entry: {
		main: ["babel-polyfill", "./src/client/app.js"],
		vendor: [
	    "alt",
	    "alt-container",
	    "alt-utils/lib/ImmutableUtil",
	    "alt-utils/lib/withAltContext",
	    'alt-utils/lib/makeFinalStore',
	    "history",
	    "immutable",
	    "iso",
	    "lodash",
	    "moment",
	    "node-uuid",
	    "react",
	    "react-dom",
	    "react-router",
	    "superagent",
			"globalize",
			"globalize/dist/globalize-runtime/number",
			"globalize/dist/globalize-runtime/plural",
			"globalize/dist/globalize-runtime/message",
			"globalize/dist/globalize-runtime/date",
			"globalize/dist/globalize-runtime/relative-time",
			"cldr-data/supplemental/likelySubtags.json",
			"cldr-data/supplemental/numberingSystems.json",
			"cldr-data/supplemental/timeData.json",
			"cldr-data/supplemental/weekData.json",
			"cldr-data/supplemental/plurals.json",
			"cldr-data/supplemental/ordinals.json",
			"cldr-data/main/en/numbers.json",
			"cldr-data/main/en/ca-gregorian.json",
			"cldr-data/main/en/timeZoneNames.json",
			"cldr-data/main/en/dateFields.json",
			"cldr-data/main/en/units.json",
			"cldr-data/main/es/numbers.json",
			"cldr-data/main/es/ca-gregorian.json",
			"cldr-data/main/es/timeZoneNames.json",
			"cldr-data/main/es/dateFields.json",
			"cldr-data/main/es/units.json"
		]
	},
	output: {
		path: path.join(__dirname, "static/dist"),
		filename: "app-bundle.js",
		publicPath: "/static/dist/"
	},
	plugins: [
		new webpack.DefinePlugin({__CLIENT__: true, __SERVER__: false}),
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: '"production"',
				//HOST: '"https://localhost"',
				HOST: '"https://tournavation-db.cloudapp.net"',
				PORT: '"443"'
			}
		}),
		new CommonsChunkPlugin("vendor", "vendor-bundle.js"),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin()
	],
	module: {
		loaders: [
			{ test: /\.json$/, loaders: ["json"] },
			{
				test: /\.jsx?$/,
				loader: 'babel',
		      query: {
		        cacheDirectory: true,
		        plugins: [
		          'transform-runtime',
		          'transform-decorators-legacy',
		        ],
		        presets: ['es2015', 'react', 'stage-0'],
		      },
				exclude: /node_modules/},
		  { test: /\.css$/,  loader: "style-loader!css-loader?name=styles/[name].[ext]" },
			{ test: /\.scss$/, loader: "style-loader!css-loader!sass-loader?name=styles/[name].[ext]" },
			{ test: /\.sass$/, loader: "style-loader!css-loader!sass-loader?indentedSyntax=sass&name=styles/[name].[ext]" },
		  { test: /\.less$/, loader: "style-loader!css-loader!less-loader?name=styles/[name].[ext]" },
		  { test: /\.gif$/, loader: "url-loader?mimetype=image/png&name=images/[name].[ext]" },
		  { test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/, loader: "url-loader?mimetype=application/font-woff&name=fonts/[name].[ext]" },
		  { test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/, loader: "file-loader?name=fonts/[name].[ext]" }
		],
		postLoaders: [],
		noParse: /\.min\.js/
	},
	resolve: {
		alias: {
			react: path.join(__dirname, "node_modules/react"),
			cldr: path.join(__dirname, "node_modules/cldrjs/dist/cldr")
		},
		modulesDirectories: [
			"src",
			"node_modules",
			"web_modules"
		],
		extensions: ["", ".js", '.jsx', 'json', '.sass', '.scss', '.less', '.css']
	},
	node:    {
		__dirname: true,
		fs: 'empty'
	}
};