import React from "react";
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import { Router, match, RoutingContext } from 'react-router';
import AltContainer from 'alt-container';
import routes from './routes';

import Globalize from 'globalize';
import globalizeLocalizer from 'react-widgets/lib/localizers/globalize';
globalizeLocalizer(Globalize);
//import css from 'react-widgets/lib/less/react-widgets.less';

const runRouter = location =>
  new Promise(resolve => match({ routes, location }, (error, redirectLocation, renderProps) => {
		resolve({error, redirectLocation, renderProps});
  }));

export default async function({ flux, history, location, locale }) {
	console.log("*** Universal Render");
	Globalize.locale(locale);
  var msg = Globalize.formatMessage("home-title");
  console.log("*** MSG: " + msg);

	if (__CLIENT__) {
	console.log("*** Client Render");
		const element = (
      <AltContainer flux={ flux }>
        <Router
          history={ history }
          routes={ routes } />
      </AltContainer>
    );
    
		var mountNode = document.getElementById('react-main-mount');
		ReactDOM.render(element, mountNode);

    // Tell `alt-resolver` we have done the first render
    // next promises will be resolved
    flux.resolver.firstRender = false;
	} else {
		console.log("*** Server Render");
		const {error, redirectLocation, renderProps} = await runRouter(location);	
		
		if (error || redirectLocation || !renderProps) throw ({ error, redirectLocation });

  	const element = (
      <AltContainer flux={ flux }>
        <RoutingContext { ...renderProps } />
      </AltContainer>
    );

    let app;
    let fluxSnapshot;

    // Collect promises with a first render
    ReactDOMServer.renderToString(element);

    // Resolve them
    await flux.resolver.dispatchPendingActions();

    fluxSnapshot = flux.takeSnapshot();
    app = ReactDOMServer.renderToString(element);
		return {
			content: app,
			statusCode: 200
		};
	}	
};