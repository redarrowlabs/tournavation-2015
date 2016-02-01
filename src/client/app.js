import history from './history';
import universalRender from '../shared/universal-render';
import createFlux from '../shared/flux/create-flux';

const flux = createFlux(window.__CONFIG__);
const locale = window.__LOCALE__;

universalRender({flux, history, location, locale});