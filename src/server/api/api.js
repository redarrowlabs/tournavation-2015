import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import router from './router';

import appConfig from '../config';

import log from '../logger';

const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const uuid = require('node-uuid');

export default server => {
  //connect to our database
  let connection = mongoose.connect(appConfig.get('connectionString'));

  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(bodyParser.json());
  
  // Setup session store
  let sessionProperties = {
    secret: appConfig.get('cookieSecret'),
    store: new MongoStore({ mongooseConnection: connection.connection }),
    genid: function(req) {
      return uuid.v4(); // use UUIDs for session IDs
    },
    resave: true,
    saveUninitialized: true,
    cookie: {}
  };
  if(appConfig.get('env') === 'production') {
      sessionProperties.cookie.secure = true;
  }
  server.use(session(sessionProperties));
  
  let ensureAuthenticated = function(req, res, next) {
    log.info("*** API @ " + req.url);
    if(req.path != '/auth' && !req.session.user_id) {
        log.info("Api unauthenticated on " + req.path);
        res.status(401).send("Unauthenticated");
        return;
    } else {
        next();
    }
  }
  
  // register routes
  server.use('/api', ensureAuthenticated, router);
}