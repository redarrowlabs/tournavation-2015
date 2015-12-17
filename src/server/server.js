import express from "express";  
import React from "react";
import { renderToString } from 'react-dom/server';
import { match, RoutingContext } from 'react-router';
import { createLocation } from "history";
import createMemoryHistory from 'history/lib/createMemoryHistory';
import routes from "../shared/routes";
import config from '../config';
import compression from 'compression';

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

server.get('*', function (req, res) {
	let history = createMemoryHistory();
	let location = createLocation(req.url);

  match({ routes, history, location }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
    	var content = renderToString(<RoutingContext {...renderProps} />);
      res.status(200).render('index', {content:content});
    } else {
      res.status(404).send('Not found');
    }
  });
});

var s = server.listen(config.port, function () {  
  var host = s.address().address;
  var port = s.address().port;

  console.info('----\n==> ✅  %s is running, talking to API server on %s.', config.app.title, port);
  console.info('==> 💻  Open http://%s:%s in a browser to view the app.', host, port);
});