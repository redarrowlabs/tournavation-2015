import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import router from './router';

import config from '../../config';

var mongoose = require('mongoose');

export default server => {
  //connect to our database
  mongoose.connect(config.connectionString);

  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(bodyParser.json());

  // register routes
  server.use('/api', router);
}