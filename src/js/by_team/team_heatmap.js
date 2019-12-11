/**
 * html objects' ids
 */
const
	COUNTRY_HTML_ID = "country",
	COMPETITION_HTML_ID = "competition",
	SEASON_HTML_ID = "season",
	TEAM_HTML_ID = "team";

/**
 * HTMLSelectElement tag objects
 */
const
	countryHtmlSelect = $("#" + COUNTRY_HTML_ID)[0],
	competitionHtmlSelect = $("#" + COMPETITION_HTML_ID)[0],
	seasonHtmlSelect = $("#" + SEASON_HTML_ID)[0],
	teamHtmlSelect = $("#" + TEAM_HTML_ID)[0],
	htmlSelectElements = [countryHtmlSelect, competitionHtmlSelect, seasonHtmlSelect, teamHtmlSelect];

/**
 * main routine
 */
countryHtmlSelect.resetElement();
countryHtmlSelect.resetNextElements();
loadCountries(COMPETITIONS_URL);