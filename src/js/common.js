const NONE = "none";

/**
 * Pages' ids
 */
const BY_PLAYER_PAGE = 0;
const BY_TEAM_PAGE = 1;

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
 * Method of HTMLSelectElement class
 * Reinitialize htmlSelectElement by clearing its content and making it disabled
 */
HTMLSelectElement.prototype.resetElement = function() {
	const id = this.id;
	const text = id.replace("_", " ");
	// "this" => an JavaScript DOM object
	// "$(this)" => convert "this" to a JQuery object
	$(this).empty();
	$(this).append(new Option("Select " + text + "...", NONE));
	$(this).prop("disabled", true);
};

/**
 * Promise that load json data from given url
 * @param {string} url Given url
 * @returns {Promise<any>}
 */
async function loadJSON(url) {
	return fetch(url)
		.then(response => {
			return response.json();
		})
		.catch(err => {
			console.log(err);
		})
}

/**
 * Method of Array class
 * Get unique objects in array according to given property name
 * @param {string} prop Property name
 * @returns {Array} Array of unique objects
 * @example
 * 		const a = [{b:"abc", c:"def"}, {b:"has", c:"def"}, {b:"has", c:"lol"}]
 * 		const result = a.distinct("c")
 * 		// result will be [{b:"abc", c:"def"}, {b:"has", c:"lol"}]
 */
Array.prototype.distinct = function(prop) {
	return this.filter((obj, pos, arr) => {
		return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
	});
};

/**
 * Load competitions data and get countries names and ids in corresponding htmlSelectElement
 * @param {string} url Url to competitions data
 */
function loadCountries(url, callingPageId) {
	loadJSON(url)
		.then(data => {
			console.log(data);

			const distinctByCountry = data.distinct("country_name")
				.sort((a, b) => a.country_name.localeCompare(b.country_name));
			console.log(distinctByCountry);

			distinctByCountry.forEach(competition => countryHtmlSelect.append(new Option(competition.country_name, competition.country_name)));
			$(countryHtmlSelect).prop("disabled", false);

			// event
			$(countryHtmlSelect).unbind("change");
			$(countryHtmlSelect).change(function (e) {
				e.stopImmediatePropagation();
				countryHtmlSelect.resetNextElements();
				if ($(this).val() !== NONE) {
					const competitionsByCountry = data.filter(competition => competition.country_name === $(this).val());
					loadCompetitions(competitionsByCountry, callingPageId);
				}
			});
		});
}

/**
 * Get competitions names and ids in corresponding htmlSelectElement
 * @param data Array containing competitions
 */
function loadCompetitions(data, callingPageId) {
	console.log(data);

	const distinctByCompetition = data.distinct("competition_id")
		.sort((a, b) => a.competition_name.localeCompare(b.competition_name));
	console.log(distinctByCompetition);

	distinctByCompetition.forEach(competition =>
		competitionHtmlSelect.append(new Option(
			competition.competition_name + " (" + competition.competition_gender + ")",
			competition.competition_id
		)));
	$(competitionHtmlSelect).prop( "disabled", false );

	// event
	$(competitionHtmlSelect).unbind("change");
	$(competitionHtmlSelect).change(function (e) {
		e.stopImmediatePropagation();
		competitionHtmlSelect.resetNextElements();
		const competitionId = Number($(this).val());
		if (competitionId) {
			const competitionsById = data.filter(competition => competition.competition_id === competitionId);
			loadSeasons(competitionsById, callingPageId);
		}
	});
}

/**
 * Get seasons names and ids in corresponding htmlSelectElement
 * @param data Array containing competitions
 * @param callingPageId Number of calling page
 */
function loadSeasons(data, callingPageId = BY_PLAYER_PAGE) {
	console.log(data);

	const distinctBySeason = data.distinct("season_id")
		.sort((a, b) => a.season_name.localeCompare(b.season_name) * -1); // -1 to invert the order
	console.log(distinctBySeason);

	distinctBySeason.forEach(competition => seasonHtmlSelect.append(new Option(competition.season_name, competition.season_id)));
	$(seasonHtmlSelect).prop( "disabled", false );

	// event
	$(seasonHtmlSelect).unbind("change");
	$(seasonHtmlSelect).change(function (e) {
		e.stopImmediatePropagation();
		seasonHtmlSelect.resetNextElements();
		const seasonId = Number($(this).val());
		if (seasonId) {
			const competitionsBySeason = data.find(competition => competition.season_id === seasonId);
			callingPageId == BY_PLAYER_PAGE ? loadHomeTeams(competitionsBySeason) : loadTeams(competitionsBySeason);
		}
	});
}

/**
 * Build statistics table
 * @param htmlTableId Id of the html table element (example "table-x)
 * @param eventsArray Array of size 2: first element for the events of
 * team 1, second element for events of team 2
 */
function buildStatsTable(htmlTableId, eventsArray) {
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
	$("#" + htmlTableId + " tfoot").empty()
		.append(`
	<tr>
		<td>` + stats.reduce((acc, stat) => acc + stat.team1Stat, 0) + `</td>
		<td>Total</td>
		<td>` + stats.reduce((acc, stat) => acc + stat.team2Stat, 0) + `</td>
	</tr>
	`);
}

/**
 * Update svg element with new by_player event
 * @param svg
 * @param filteredEvents Match events filteredEvents
 * @param bandwidth
 * @param valueScale
 */
function updateD3(svg, filteredEvents, bandwidth=10, valueScale=100) {
  // Clear svg
  svg.selectAll("g").remove();

  console.log("Represented events");
  console.log(filteredEvents);

  const maxX = 120;
  const maxY = 80;

  // Add X axis
  const x = d3.scaleLinear()
    .domain([0, maxX])
    .range([0, defaultWidth]);
  // Display X axis
  // svg.append("g")
  //   .call(d3.axisBottom(x));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, maxY])
    .range([0, defaultHeight]);
  // Display Y axis
  // svg.append("g")
  //   .call(d3.axisRight(y));

  // Prepare a color palette
  const color = d3.scaleLinear()
    .domain([0, 0.25, 0.5, 0.75, 1]) // Points per square pixel.
    .range(["rgba(0,23,255,0.5)", "rgba(255,233,0,0.5)", "rgba(255,111,0,0.5)", "rgba(255,0,0,0.5)"]);

  // compute the density filteredEvents
  const densityData = d3.contourDensity()
    .x(function (d) { return x(d.location[0]); })
    .y(function (d) { return y(d.location[1]); })
    .size([defaultWidth, defaultHeight])
    .bandwidth(bandwidth)
    (filteredEvents);

  // show the shape!
  svg.insert("g", "g")
    .selectAll("path")
    .data(densityData)
    .enter().append("path")
    .attr("d", d3.geoPath())
    .attr("fill", function(d) { return color(d.value * valueScale); });
}