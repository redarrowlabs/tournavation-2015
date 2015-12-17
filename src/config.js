const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

const host = process.env.HOST || 'http://localhost';
const port = process.env.PORT || 3000;
const apiHost = process.env.APIHOST || 'http://localhost';
const apiPort = process.env.APIPORT || 3000;

module.exports = Object.assign({
  host: host,
  port: port,
  apiHost: apiHost,
  apiPort: apiPort,
  apiBaseUrl: apiHost + ':' + apiPort + '/api',
  app: {
    title: 'HealthHero',
    description: 'Application for health monitoring.',
    meta: {
      charSet: 'utf-8',
      property: {
        'og:site_name': 'HealthHero',
        'og:locale': 'en_US',
        'og:title': 'HealthHero',
        'og:description': 'Application for health monitoring.'
      }
    }
  },
  connectionString: 'mongodb://localhost:27017/healthHeroesDb',
  cacheAge: 86400000
}, environment);
