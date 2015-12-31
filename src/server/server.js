import express from "express";
import locale from 'express-locale';
import { createLocation } from "history";
import appConfig from '../config';
import compression from 'compression';

import createFlux from '../shared/flux/create-flux';
import universalRender from '../shared/universal-render';

import api from './api/api';

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
  let location = createLocation(req.url);

  try {
    console.log("*** Server @ " + req.url + " for: " + req.locale.code);
    const { content, statusCode } = await universalRender({flux, location, locale: req.locale.code});

    res
      .status(statusCode)
      .render('index',
        {
          content,
          scriptUrl: appConfig.scriptUrl,
          locale: req.locale.code
        });
  } catch (err) {
    console.log(err);
    const { error, redirectLocation } = err;
    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else {
      res.status(404).send('Not found');
    }
  }
};

server.get('*', webServer);

var s = server.listen(appConfig.port, function () {  
  var host = s.address().address;
  var port = s.address().port;

  console.info('----\n==> ✅  %s is running, talking to API server on %s.', appConfig.app.title, port);
  console.info('==> 💻  Open http://%s:%s in a browser to view the app.', host, port);
});