import express from "express";
import locale from 'express-locale';
import { createLocation } from "history";
import appConfig from '../config';
import compression from 'compression';

import createFlux from '../shared/flux/create-flux';
import universalRender from '../shared/universal-render';

import api from './api/api';
var fs = require('fs');
var http = require('http');
var https = require('https');

import Globalize from 'globalize';
Globalize.load(require("cldr-data").entireSupplemental());
Globalize.load(require("cldr-data").entireMainFor("en", "es"));
Globalize.loadMessages(require("../shared/globalization/en"));
// prime globalization
Globalize.locale('en');

const server = global.server = express();

// server locale
server.use(locale({
  'default': 'en_US',
  'priority': ['accept-language', 'cookie', 'default'],
  'cookie': {'name': 'locale'}
}));

// serve static assets normally
server.use(express.static('static', {maxAge: appConfig.cacheAge}));
// add content compression middle-ware
server.use(compression());
// Set view path
server.set('views', 'views');
// set up Jade
server.set('view engine', 'jade');

// init the api
api(server);

const flux = createFlux(appConfig);

const webServer = async function(req, res) {
  if(req.path != '/' && req.path != '/favicon.ico' && !req.session.user_id) {
    console.log("Page unauthenticated on " + req.path);
    res.redirect('/');
    return;
  }  
  
  let location = createLocation(req.url);

  try {
    let cookie = req.get('Cookie');
    flux.api.saveCookie(cookie);
      
    console.log("*** Server @ " + req.url + " for: " + req.locale.code);
    const { content, statusCode } = await universalRender({flux, location, locale: req.locale.code});

    res
      .status(statusCode)
      .render('index',
        {
          content,
          scriptUrl: appConfig.scriptUrl,
          locale: req.locale.code,
          googleApiClientId: appConfig.googleApiClientId
        });
  } catch (err) {
    console.log(err);
    const { error, redirectLocation } = err;
    if (error) {
      res.status(500).send(error.toJSON());
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else {
      res.status(404).send('Not found');
    }
  }
};

server.get('*', webServer);

let appServer = null;
// In production, redirect incoming requests on the insecure http port to the secured https port
if(appConfig.isProduction) {
    let redirectServer = http.createServer(function(req, res){
        let redirect = appConfig.host + ":" + appConfig.port + req.url;
        console.log("*** Request on insecure URL http://" + req.headers['host'] + req.url + " redirected to " + redirect);
        res.writeHead(301, { "Location": redirect });
        res.end();
    }).listen(appConfig.insecurePort, function () {  
        let host = redirectServer.address().address;
        let port = redirectServer.address().port;
        console.info('----\n==> ✅  HTTP redirect is running on http://%s:%s', host, port);
    });
    
    let httpsOptions = {
        key: fs.readFileSync(appConfig.sslKeyPath),
        cert: fs.readFileSync(appConfig.sslCertPath),
    };
    appServer = https.createServer(httpsOptions, server);
} else {
    appServer = http.createServer(server);    
}

appServer.listen(appConfig.port, function () {  
  let host = appServer.address().address;
  let port = appServer.address().port;

  console.info('----\n==> ✅  %s is running, talking to API server on %s.', appConfig.app.title, port);
  console.info('==> 💻  Open http://%s:%s in a browser to view the app.', host, port);
});