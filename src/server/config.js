var convict = require('convict');

// Define a schema
var conf = convict({
  env: {
    doc: "The applicaton environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV"
  },
  host: {
    doc: "The IP address to bind.",
    format: "url",
    default: "http://localhost",
    env: "HOST",
  },
  port: {
    doc: "The port to bind.",
    format: "port",
    default: 3000,
    env: "PORT"
  },
  apiBaseUrl: {
    doc: "The API base URL.",
    format: "url",
    default: "http://localhost:3000/api/",
    env: "API"
  },
  connectionString: {
    doc: "The connection string to the MongoDB server.",
    format: String,
    default: "mongodb://localhost:27017/healthHeroesDb",
    env: "CONNECTION_STRING"
  },
  sslKeyPath: {
    doc: "The path to the SSL Key.",
    format: String,
    default: "C:\certs\self-signed.key",
    env: "SSL_KEY_PATH"
  },
  sslCertPath: {
    doc: "The path to the SSL Cert.",
    format: String,
    default: "C:\certs\self-signed.crt",
    env: "SSL_CERT_PATH"
  },
  cookieSecret: {
    doc: "The secret for session cookie.",
    format: String,
    default: "The secret for session cookie.",
    env: "COOKIE_SECRET"
  },
  scriptUrl: {
    doc: "The URL to get client scripts.",
    format: "url",
    default: "http://tournavation-db.cloudapp.net/",
    env: "SCRIPT_URL"
  },
  cacheAge: {
    doc: "Duration for server to cache responses.",
    format: "nat",
    default: 86400000
  },
  googleApiClientId: {
    doc: "The ClientID for the application install for accessing Google API.",
    format: String,
    default: "73545608160-grie8h8aqsg3pimc0mfroim40ae8qp41.apps.googleusercontent.com"
  },
  googleApiTokenInfoUrl: {
    doc: "The URL to access the Google Code Auth API.",
    format: "url",
    default: "https://www.googleapis.com/oauth2/v3/tokeninfo"
  },
  insecurePort: {
    doc: "The insecure port.",
    format: "port",
    default: "80"
  }
});

// Load environment dependent configuration
var env = conf.get('env');
conf.loadFile('./src/config/' + env + '.json');

// Perform validation
conf.validate({strict: true});

module.exports = conf;