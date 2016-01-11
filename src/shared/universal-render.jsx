import Iso from 'iso';
import React from "react";
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import { Router, match, RoutingContext } from 'react-router';
import AltContainer from 'alt-container';
import routes from './routes';

import Globalize from 'globalize';

const bootstrap = () =>
  new Promise((resolve) =>
    Iso.bootstrap((initialState, container) =>
      resolve({ initialState, container })));

const runRouter = location =>
  new Promise(resolve => match({ routes, location }, (error, redirectLocation, renderProps) => {
		resolve({error, redirectLocation, renderProps});
  }));

export default async function({ flux, history, location, locale }) {
	Globalize.locale(locale);

	if (__CLIENT__) {

    const { container, initialState } = await bootstrap();
    flux.bootstrap(initialState);

		const element = (
      <AltContainer flux={ flux }>
        <Router
          history={ history }
          routes={ routes } />
      </AltContainer>
    );
    
		//var mountNode = document.getElementById('react-main-mount');
		ReactDOM.render(element, container);

    // Tell `alt-resolver` we have done the first render
    // next promises will be resolved
    flux.resolver.firstRender = false;
	} else {
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
			content: Iso.render(app, fluxSnapshot),
			statusCode: 200
		};
	}	
};