var gulp = require('gulp');
var nodeDebug = require('gulp-node-debug');
var env = require('gulp-env');

gulp.task('set-env-dev', function () {
  env({
    vars: {
      "NODE_DEBUG": "true",
      "NODE_ENV": "development",
      "NODE_PATH": "./src",
      "HOST": "http://localhost",
      "PORT": 3000,
      "SCRIPT_HOST": "http://localhost:8080"
    }
  })
});


gulp.task('debug-start', function() { 
  gulp.src(['app.js'])
    .pipe(nodeDebug({
        debugPort: 5858,
        webHost: '0.0.0.0',
        webPort: 8081,
        debugBrk: false,
        nodejs: ['--harmony'],
        script: ['babel.server.js'],
        saveLiveEdit: false,
        preload: true,
        inject: true,
        hidden: [],
        stackTraceLimit: 50,
        sslKey: '',
        sslCert: ''
    }));
});

gulp.task('debug', ['set-env-dev', 'debug-start'])