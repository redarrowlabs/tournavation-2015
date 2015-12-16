require('shelljs/global');

process.argv.slice(2).forEach(function (dir) {
	rm('-rf', dir);   
});