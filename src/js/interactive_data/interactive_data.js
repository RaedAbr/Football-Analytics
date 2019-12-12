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
	// GENDER_HTML_ID = "gender",
	TEAM_HTML_ID = "team";

/**
 * HTMLSelectElement tag objects
 */
const
	countryHtmlSelect = $("#" + COUNTRY_HTML_ID)[0],
	competitionHtmlSelect = $("#" + COMPETITION_HTML_ID)[0],
	seasonHtmlSelect = $("#" + SEASON_HTML_ID)[0],
	// genderHtmlSelect = $("#" + GENDER_HTML_ID)[0],
	teamHtmlSelect = $("#" + TEAM_HTML_ID)[0],
	htmlSelectElements = [countryHtmlSelect, competitionHtmlSelect, seasonHtmlSelect, /*genderHtmlSelect,*/
		teamHtmlSelect];

/**
 * events description dictionary
 */
const eventsDescriptions = {
	42: "The receipt or intended receipt of a pass",
	2: "An attempt to recover a loose ball",
	3: "Player loses ball to an opponent as a result of being tackled by a defender without attempting a dribble",
	4: "A duel is an 50-50 contest between two players of opposing sides in the match",
	5: "Signals the stop of the camera to capture gameplay for a replay/video cut",
	6: "Blocking the ball by standing in its path.",
	8: "Offside infringement. Cases resulting from a shot or clearance (non-pass). For passes resulting in an offside check pass outcomes section",
	9: "Action by a defending player to clear the danger without an intention to deliver it to a teammate",
	10: "Preventing an opponent's pass from reaching their teammates by moving to the passing lane/reacting to intercept it",
	14: "An attempt by a player to beat an opponent",
	16: "An attempt to score a goal, made with any (legal) part of the body",
	17: "Applying pressure to an opposing player who’s receiving, carrying or releasing the ball",
	18: "Signals referee whistle to start a match period",
	19: "Substitution",
	20: "An own goal scored against the team",
	21: "A foul won is defined as where a player wins a free-kick or penalty for their team after being fouled by an opposing player",
	22: "Any infringement that is penalised as foul play by a referee. Offside are not tagged as a foul committed",
	23: "Actions that can be done by the goalkeeper",
	24: "When a player receives a card due to an infringement outside of play",
	25: "An own goal scored for the team",
	26: "A player returns to the pitch after a Player Off event",
	27: "A player goes/ is carried out of the pitch without a substitution",
	28: "Player shields ball going out of bounds to prevent opponent from keeping it in play",
	30: "Ball is passed between teammates",
	33: "2 players challenging to recover a loose ball",
	34: "Signals the referee whistle to finish a match part",
	35: "Indicates the players in the starting 11, their position and the team’s formation",
	36: "Indicates a tactical shift made by the team, shows the players’ new positions and the team’s new formation",
	37: "When a player is judged to make an on-the-ball mistake that leads to a shot on goal",
	38: "Player loses ball due to bad touch",
	39: "Player is dribbled past by an opponent",
	40: "A stop in play due to an injury",
	41: "Referee drops the ball to continue the game after an injury stoppage",
	43: "A player controls the ball at their feet while moving or standing still"
};

/**
 * main routine
 */
loadAll(COMPETITIONS_URL);