import history from './history';
import universalRender from '../shared/universal-render';
import createFlux from '../shared/flux/create-flux';
import moment from 'moment';

import 'react-widgets/lib/less/react-widgets.less';

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
	require("cldr-data/supplemental/calendarPreferenceData.json"),
	require("cldr-data/supplemental/characterFallbacks.json"),
	require("cldr-data/supplemental/languageData.json"),
	require("cldr-data/supplemental/languageMatching.json"),
	require("cldr-data/supplemental/likelySubtags.json"),
	require("cldr-data/supplemental/measurementData.json"),
	require("cldr-data/supplemental/metaZones.json"),
	require("cldr-data/supplemental/numberingSystems.json"),
	require("cldr-data/supplemental/ordinals.json"),
	require("cldr-data/supplemental/parentLocales.json"),
	require("cldr-data/supplemental/plurals.json"),
	require("cldr-data/supplemental/primaryZones.json"),
	require("cldr-data/supplemental/references.json"),
	require("cldr-data/supplemental/territoryContainment.json"),
	require("cldr-data/supplemental/territoryInfo.json"),
	require("cldr-data/supplemental/timeData.json"),
	require("cldr-data/supplemental/weekData.json"),
	require("cldr-data/supplemental/windowsZones.json")
);
Globalize.loadMessages(require("../shared/globalization/en.json"));
Globalize.loadMessages(require("../shared/globalization/es.json"));
// prime globalization
Globalize.locale('en');
moment.locale('en');

const flux = createFlux(window.__CONFIG__);

let locale = window.__LOCALE__;

universalRender({flux, history, location, locale});