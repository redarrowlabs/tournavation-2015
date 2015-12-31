import createBrowserHistory from 'history/lib/createBrowserHistory';
import universalRender from '../shared/universal-render';
import createFlux from '../shared/flux/create-flux';
import appConfig from '../config';

import Globalize from 'globalize';
/*Globalize.load(require("cldr-data").entireSupplemental());
Globalize.load(require("cldr-data").entireMainFor("en", "es"));*/
Globalize.load(
	require("cldr-data/main/en/ca-gregorian.json"),
	require("cldr-data/main/en/characters.json"),
	require("cldr-data/main/en/dateFields.json"),
	require("cldr-data/main/en/numbers.json"),
	require("cldr-data/main/es/ca-gregorian.json"),
	require("cldr-data/main/es/characters.json"),
	require("cldr-data/main/es/dateFields.json"),
	require("cldr-data/main/es/numbers.json"),
	require("cldr-data/supplemental/calendarData.json"),
	require("cldr-data/supplemental/dayPeriods.json"),
	require("cldr-data/supplemental/likelySubtags.json"),
	require("cldr-data/supplemental/numberingSystems.json"),
	require("cldr-data/supplemental/plurals.json"),
	require("cldr-data/supplemental/timeData.json"),
	require("cldr-data/supplemental/weekData.json")
);
Globalize.loadMessages(require("../shared/globalization/en.json"));
// prime globalization
Globalize.locale('en');

let history = createBrowserHistory();
const flux = createFlux(appConfig);

let locale = window.__LOCALE__;

universalRender({flux, history, location, locale});