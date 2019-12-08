const NONE = "none";

/**
 * Tactical Positions Guide
 */
const positionGuide = function (abbreviation, name) {
	return {abbreviation: abbreviation, name: name};
};
const POSITIONS_GUIDE = {
	1: positionGuide("GK", "Goalkeeper"),
	2: positionGuide("RB", "Right Back"),
	3: positionGuide("RCB", "Right Center Back"),
	4: positionGuide("CB", "Center Back"),
	5: positionGuide("LCB", "Left Center Back"),
	6: positionGuide("LB", "Left Back"),
	7: positionGuide("RWB", "Right Wing Back"),
	8: positionGuide("LWB", "Left Wing Back"),
	9: positionGuide("RDM", "Right Defensive Midfield"),
	10: positionGuide("CDM", "Center Defensive Midfield"),
	11: positionGuide("LDM", "Left Defensive Midfield"),
	12: positionGuide("RM", "Right Midfield"),
	13: positionGuide("RCM", "Right Center Midfield"),
	14: positionGuide("CM", "Center Midfield"),
	15: positionGuide("LCM", "Left Center Midfield"),
	16: positionGuide("LM", "Left Midfield"),
	17: positionGuide("RW", "Right Wing"),
	18: positionGuide("RAM", "Right Attacking Midfield"),
	19: positionGuide("CAM", "Center Attacking Midfield"),
	20: positionGuide("LAM", "Left Attacking Midfield"),
	21: positionGuide("LW", "Left Wing"),
	22: positionGuide("RCF", "Right Center Forward"),
	23: positionGuide("ST", "Striker"),
	24: positionGuide("LCF", "Left Center Forward"),
	25: positionGuide("SS", "Secondary Striker")
};

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
	// GENDER_HTML_ID = "gender",
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
	// genderHtmlSelect = $("#" + GENDER_HTML_ID)[0],
	homeTeamHtmlSelect = $("#" + HOME_TEAM_HTML_ID)[0],
	awayTeamHtmlSelect = $("#" + AWAY_TEAM_HTML_ID)[0],
	playerHtmlSelect = $("#" + PLAYER_HTML_ID)[0],
	htmlSelectElements = [countryHtmlSelect, competitionHtmlSelect, seasonHtmlSelect, /*genderHtmlSelect,*/
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