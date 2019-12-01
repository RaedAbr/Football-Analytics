const NONE = "none";

/**
 * Data URLs
 */
const
	COMPETITIONS_URL = "https://raw.githubusercontent.com/RaedAbr/open-data/master/data/competitions.json",
	MATCHES_URL = "https://raw.githubusercontent.com/RaedAbr/open-data/master/data/matches/",
	LINEUP_URL = "https://raw.githubusercontent.com/RaedAbr/open-data/master/data/lineups/",
	EVENT_URL = "https://raw.githubusercontent.com/RaedAbr/open-data/master/data/events/";

/**
 * html objects' ids
 */
const
	COUNTRY_HTML_ID = "country",
	COMPETITION_HTML_ID = "competition",
	SEASON_HTML_ID = "season",
	GENDER_HTML_ID = "gender",
	HOME_TEAM_HTML_ID = "home_team",
	AWAY_TEAM_HTML_ID = "away_team",
	PLAYER_HTML_ID = "player";

/**
 * HTMLSelectElement tag objects
 */
const
	countryHtmlSelect = $("#" + COUNTRY_HTML_ID)[0],
	competitionHtmlSelect = $("#" + COMPETITION_HTML_ID)[0],
	seasonHtmlSelect = $("#" + SEASON_HTML_ID)[0],
	genderHtmlSelect = $("#" + GENDER_HTML_ID)[0],
	homeTeamHtmlSelect = $("#" + HOME_TEAM_HTML_ID)[0],
	awayTeamHtmlSelect = $("#" + AWAY_TEAM_HTML_ID)[0],
	playerHtmlSelect = $("#" + PLAYER_HTML_ID)[0],
	htmlSelectElements = [countryHtmlSelect, competitionHtmlSelect, seasonHtmlSelect, genderHtmlSelect,
		homeTeamHtmlSelect, awayTeamHtmlSelect, playerHtmlSelect];

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