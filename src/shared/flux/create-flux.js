import Alt from 'alt';
import makeFinalStore from 'alt-utils/lib/makeFinalStore';

import AltResolver from './alt-resolver';
import ClientApi from '../client-api';

import * as stores from '../stores/index';
import * as actions from '../actions/index';

/**
Flux (Alt) container.
Keeps Stores, Actions, Resolver, and Client Api.
**/
class Flux extends Alt {

  constructor(appConfig) {
    super();

    // Bind AltResolve to flux instance
    //   - access to it in actions with `alt.resolve`
    //     for resolving async actions before server render
    this.resolver = new AltResolver();
    this.resolve = ::this.resolver.resolve;

    // Bind the ApiClient as well
    this.api = new ClientApi(appConfig.apiBaseUrl);

    // Load actions into alt
    Object.keys(actions).forEach(key => this.addActions(key, actions[key]));
    // Load stores into alt
    Object.keys(stores).forEach(key => this.addStore(key, stores[key]));

    // Our `FinalStore` for using `connect-alt`
    this.FinalStore = makeFinalStore(this);
  }

}

export default function (appConfig) { return new Flux(appConfig); }