const NONE = "none";

/**
 * Data URLs
 */
const
	BASE_URL = "https://raw.githubusercontent.com/RaedAbr/open-data/master/data/",
	COMPETITIONS_URL = BASE_URL + "competitions.json",
	MATCHES_URL = BASE_URL + "matches/",
	LINEUP_URL = BASE_URL + "lineups/",
	EVENT_URL = BASE_URL + "events/";

/**
 * html objects' ids
 */
const
	COUNTRY_HTML_ID = "country",
	COMPETITION_HTML_ID = "competition",
	SEASON_HTML_ID = "season",
	GENDER_HTML_ID = "gender",
	TEAM_HTML_ID = "team";

/**
 * HTMLSelectElement tag objects
 */
const
	countryHtmlSelect = $("#" + COUNTRY_HTML_ID)[0],
	competitionHtmlSelect = $("#" + COMPETITION_HTML_ID)[0],
	seasonHtmlSelect = $("#" + SEASON_HTML_ID)[0],
	genderHtmlSelect = $("#" + GENDER_HTML_ID)[0],
	teamHtmlSelect = $("#" + TEAM_HTML_ID)[0],
	htmlSelectElements = [countryHtmlSelect, competitionHtmlSelect, seasonHtmlSelect, genderHtmlSelect,
		teamHtmlSelect];

/**
 * span tag JQuery objects
 */
// const
// 	wonHTMLPanel = $("#won-panel"),
// 	lostHTMLPanel = $("#lost-panel");

/**
 * main routine
 */
// const url = EVENT_URL + "265958.json";
// fetch(url)
// 	.then(response => {return response.json()})
// 	.then(data => {
// 		data = data.filter(event => (event.location && event.player) &&
// 			// event.player.id === 6758 &&
// 			event.team.id === 217 && // 217 => Barcelona
// 			(event.position.id >= 9 && event.position.id <= 20) && // [9..20] => Midfield positions
// 			event.type.id === 30)/*.slice(0, 2)*/; // 30 => "pass"
// 		console.log(data);
// 		updateD3(data, 1, 200);
// 	});
countryHtmlSelect.resetElement();
countryHtmlSelect.resetNextElements();
loadCountries(COMPETITIONS_URL);