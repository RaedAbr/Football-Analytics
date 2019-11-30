const
	NONE = "none",
	COMPETITIONS_URL = "https://raw.githubusercontent.com/statsbomb/open-data/master/data/competitions.json",
	MATCHES_URL = "https://raw.githubusercontent.com/statsbomb/open-data/master/data/matches/",
	LINEUP_URL = "https://raw.githubusercontent.com/statsbomb/open-data/master/data/lineups/",
	EVENT_URL = "https://raw.githubusercontent.com/statsbomb/open-data/master/data/events/";

const
	COUNTRY_HTML_ID = "country",
	COMPETITION_HTML_ID = "competition",
	SEASON_HTML_ID = "season",
	GENDER_HTML_ID = "gender",
	HOME_TEAM_HTML_ID = "home_team",
	AWAY_TEAM_HTML_ID = "away_team",
	PLAYER_HTML_ID = "player";

const
	// SELECT_HTML_IDS = [COUNTRY_HTML_ID, COMPETITION_HTML_ID, SEASON_HTML_ID, GENDER_HTML_ID,
	// 	HOME_TEAM_HTML_ID, AWAY_TEAM_HTML_ID, PLAYER_HTML_ID],
	countryHtmlSelect = $("#" + COUNTRY_HTML_ID)[0],
	competitionHtmlSelect = $("#" + COMPETITION_HTML_ID)[0],
	seasonHtmlSelect = $("#" + SEASON_HTML_ID)[0],
	genderHtmlSelect = $("#" + GENDER_HTML_ID)[0],
	homeTeamHtmlSelect = $("#" + HOME_TEAM_HTML_ID)[0],
	awayTeamHtmlSelect = $("#" + AWAY_TEAM_HTML_ID)[0],
	playerHtmlSelect = $("#" + PLAYER_HTML_ID)[0],
	htmlSelectElements = [countryHtmlSelect, competitionHtmlSelect, seasonHtmlSelect, genderHtmlSelect,
		homeTeamHtmlSelect, awayTeamHtmlSelect, playerHtmlSelect];

countryHtmlSelect.resetElement();
countryHtmlSelect.resetNextElements();
loadCountries(COMPETITIONS_URL);