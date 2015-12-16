import express from 'express';
import bodyParser from 'body-parser';
//import PrettyError from 'pretty-error';
import http from 'http';
import router from './router';

import config from '../../config';

var mongoose = require('mongoose');

/*
//connect to our database
mongoose.connect(config.connectionString);

//const pretty = new PrettyError();
const app = express();
const server = new http.Server(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// register routes
app.use('/api', router);

if (config.apiPort) {
  const runnable = app.listen(config.apiPort, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> 🌎  API is running on port %s', config.apiPort);
    console.info('==> 💻  Send requests to http://%s:%s', config.apiHost, config.apiPort);
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}*/

export default server => {
  //connect to our database
  mongoose.connect(config.connectionString);

  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(bodyParser.json());

  // register routes
  server.use('/api', router);
}