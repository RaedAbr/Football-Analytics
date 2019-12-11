const NONE = "none";

/**
 * Data URLs
 */
const
	BASE_URL = "https://raw.githubusercontent.com/RaedAbr/open-data/master/data/",
	COMPETITIONS_URL = BASE_URL + "competitions.json",
	MATCHES_URL = BASE_URL + "matches/",
	EVENT_URL = BASE_URL + "events/";

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
 * Build statistics table
 * @param htmlTableId Id of the html table element (example "table-x)
 * @param eventsArray Array of size 2: first element for the events of
 * team 1, second element for events of team 2
 */
function buildStatsTable(htmlTableId, eventsArray) {
	console.log("HELLO");
	const eventList1 = eventsArray[0].map(event => {return {name: event.type.name, id: event.type.id}});
	const eventList2 = eventsArray[1].map(event => {return {name: event.type.name, id: event.type.id}});

	const events = [...eventList1, ...eventList2].distinct("id");

	const statEntry = function (eventId, eventName, team1Stat, team2Stat) {
		return { eventId: eventId, eventName: eventName, team1Stat: team1Stat, team2Stat: team2Stat }
	};

	const stats = events.map(ev => {
		if (ev.id == 42) { // Ball Receipt
			ev.name = ev.name.slice(0, -1) // remove last char (the star char *)
		}
		return statEntry(
			ev.id,
			ev.name,
			eventList1.reduce((acc, event) => acc + (event.id == ev.id ? 1 : 0), 0),
			eventList2.reduce((acc, event) => acc + (event.id == ev.id ? 1 : 0), 0)
		)
	}).sort((a, b) => a.eventName.localeCompare(b.eventName));
	console.log(stats);

	$("#" + htmlTableId + " tbody").empty();
	stats.forEach(stat => {
		$("#" + htmlTableId + " tbody").append(`
						<tr>
							<td>` + stat.team1Stat + `</td>
							<td data-toggle="tooltip" title="` + eventsDescriptions[stat.eventId] + `">` + stat.eventName + `</td>
							<td>` + stat.team2Stat + `</td>
						</tr>
					`);
	});
	$("#total-" + htmlTableId + " tfoot").empty();
	$("#total-" + htmlTableId + " tfoot").append(`
	<tr>
		<td>` + stats.reduce((acc, stat) => acc + stat.team1Stat, 0) + `</td>
		<td>Total</td>
		<td>` + stats.reduce((acc, stat) => acc + stat.team2Stat, 0) + `</td>
	</tr>
	`);
}