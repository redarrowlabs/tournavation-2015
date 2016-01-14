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
const insecurePort = environment.isProduction ? 80 : 3000;

const baseUrl = host + (port === '443' || port === '80' ? '' : ':' + port);
const apiBaseUrl = baseUrl + '/api/';
const scriptUrl = process.env.SCRIPT_HOST || 'http://localhost:8080';

module.exports = Object.assign({
  host: host,
  port: port,
  insecurePort: insecurePort,
  sslKeyPath: process.env.SSL_KEY_PATH,
  sslCertPath: process.env.SSL_CERT_PATH,
  baseUrl: baseUrl,
  apiBaseUrl: apiBaseUrl,
  scriptUrl: scriptUrl,
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
  cacheAge: 86400000,
  googleApiClientId: "73545608160-grie8h8aqsg3pimc0mfroim40ae8qp41.apps.googleusercontent.com",
  googleApiTokenInfoUrl: "https://www.googleapis.com/oauth2/v3/tokeninfo",
  cookieSecret: process.env.COOKIE_SECRET || "This should be an environment variable in production."
}, environment);
