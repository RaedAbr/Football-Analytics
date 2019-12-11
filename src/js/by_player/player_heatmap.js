/**
 * html objects' ids
 */
const
	COUNTRY_HTML_ID = "country",
	COMPETITION_HTML_ID = "competition",
	SEASON_HTML_ID = "season",
	HOME_TEAM_HTML_ID = "home_team",
	AWAY_TEAM_HTML_ID = "away_team";

/**
 * HTMLSelectElement tag objects
 */
const
	countryHtmlSelect = $("#" + COUNTRY_HTML_ID)[0],
	competitionHtmlSelect = $("#" + COMPETITION_HTML_ID)[0],
	seasonHtmlSelect = $("#" + SEASON_HTML_ID)[0],
	homeTeamHtmlSelect = $("#" + HOME_TEAM_HTML_ID)[0],
	awayTeamHtmlSelect = $("#" + AWAY_TEAM_HTML_ID)[0];
	htmlSelectElements = [countryHtmlSelect, competitionHtmlSelect, seasonHtmlSelect, /*genderHtmlSelect,*/
		homeTeamHtmlSelect, awayTeamHtmlSelect];

/**
 * span tag JQuery objects
 */
const
	matchDateSpan = $("#match_date"),
	matchKickoffSpan = $("#kick_off"),
	matchWeek = $("#match_week"),
	matchReferee = $("#referee"),
	matchStadium = $("#stadium"),
	matchStadiumCountrySpan = $("#stadium-country"),
	homeScore = $("#home-score"),
	awayScore = $("#away-score"),
	spanElements = [matchDateSpan, matchKickoffSpan, matchWeek, matchReferee, matchStadium, matchStadiumCountrySpan,
		homeScore, awayScore];

/**
 * main routine
 */
countryHtmlSelect.resetElement();
countryHtmlSelect.resetNextElements();
loadCountries(COMPETITIONS_URL);

// const url = EVENT_URL + "265958.json";
// updateD3(url, 6758, 10, 100);