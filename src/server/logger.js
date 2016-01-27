var bunyan = require('bunyan');
export default bunyan.createLogger({
	name: 'HealthHero',
  streams: [
      {
      	level: 'info',
        stream: process.stdout
      },
      {
        type: 'rotating-file',
      	level: 'info',
        path: 'HealthHero.log',
        period: '1d',
        count: 10
      }
  ]
});