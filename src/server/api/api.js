import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import router from './router';

import appConfig from '../../config';

const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const uuid = require('node-uuid');

export default server => {
  //connect to our database
  let connection = mongoose.connect(appConfig.connectionString);

  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(bodyParser.json());
  
  // Setup session store
  let sessionProperties = {
    secret: "Find a way to make this actually a secret rather than sitting in code",
    store: new MongoStore({ mongooseConnection: connection.connection }),
    genid: function(req) {
      return uuid.v4(); // use UUIDs for session IDs
    },
    resave: true,
    saveUninitialized: true,
    cookie: {}
  };
  if(appConfig.isProduction) {
      sessionProperties.cookie.secure = true;
  }
  server.use(session(sessionProperties));
  
  let ensureAuthenticated = function(req, res, next) {
    if(req.path != '/auth' && !req.session.user_id) {
        console.log("Api unauthenticated on " + req.path);
        res.status(401).send("Unauthenticated");
        return;
    } else {
        next();
    }
  }
  
  // register routes
  server.use('/api', ensureAuthenticated, router);
}