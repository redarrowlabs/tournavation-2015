import express from "express";
import { createLocation } from "history";
import config from '../config';
import compression from 'compression';

import createFlux from '../shared/flux/createFlux';
import universalRender from '../shared/universal-render';

import api from './api/api';

const server = global.server = express();

// serve static assets normally
server.use(express.static('static', {maxAge: config.cacheAge}));
// add content compression middle-ware
server.use(compression());
// Set view path
server.set('views', 'views');
// set up Jade
server.set('view engine', 'jade');

// init the api
api(server);

const flux = createFlux();

const webServer = async function(req, res) {
  let location = createLocation(req.url);

  try {
    const { content, statusCode } = await universalRender({ flux, location });
    res.status(statusCode).render('index', {content:content});
  } catch (err) {
    console.log(err);
    const { error, redirectLocation } = err;
    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else {
      res.status(404).send('Not found silly');
    }
  }
};

server.get('*', webServer);

var s = server.listen(config.port, function () {  
  var host = s.address().address;
  var port = s.address().port;

  console.info('----\n==> ✅  %s is running, talking to API server on %s.', config.app.title, port);
  console.info('==> 💻  Open http://%s:%s in a browser to view the app.', host, port);
});