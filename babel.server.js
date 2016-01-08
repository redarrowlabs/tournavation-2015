//  enable runtime transpilation to use ES6/7 in node
require("babel-core/register");
require("babel-polyfill");

/**
 * Define isomorphic constants.
 */
global.__CLIENT__ = false;
global.__SERVER__ = true;

if (process.env.NODE_ENV !== "production") {
	if (!require("piping")({hook: true, includeModules: false})) {
		return;
	}
}

try {
	require("./src/server/server");
}
catch (error) {
	console.error(error.stack);
}
