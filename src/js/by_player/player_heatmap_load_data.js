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
 * Method of HTMLSelectElement class
 * Reinitialize all next htmlSelectElement of the current htmlSelectElement.
 * All elements are saved in "htmlSelectElements" array
 */
HTMLSelectElement.prototype.resetNextElements = function() {
	const nextHTMLSelectElements = htmlSelectElements.slice(htmlSelectElements.indexOf(this) + 1);
	nextHTMLSelectElements.flat(1).forEach(el => el.resetElement())
	spanElements.forEach(el => el.html("-"));
	$("#home-heatmap > svg").empty();
	$("#away-heatmap > svg").empty();
	$("#home-formation").empty();
	$("#away-formation").empty();
	$("#players-tabs").hide();
	$("[id^=tr-]").remove();
	$("input[type=checkbox]").prop("checked", false);
};

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
 * Load competitions data and get countries names and ids in corresponding htmlSelectElement
 * @param {string} url Url to competitions data
 */
function loadCountries(url) {
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
					loadCompetitions(competitionsByCountry);
				}
			});
		});
}

/**
 * Get competitions names and ids in corresponding htmlSelectElement
 * @param data Array containing competitions
 */
function loadCompetitions(data) {
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
			loadSeasons(competitionsById);
		}
	});
}

/**
 * Get seasons names and ids in corresponding htmlSelectElement
 * @param data Array containing competitions
 */
function loadSeasons(data) {
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
			loadHomeTeams(competitionsBySeason);
		}
	});
}

/**
 * Load all maches in a competition and get home teams names and ids in corresponding htmlSelectElement
 * @param competition Specific competitions
 */
function loadHomeTeams(competition) {
	console.log(competition);
	const url = MATCHES_URL +	competition.competition_id + "/" + competition.season_id + ".json";
	console.log(url);
	loadJSON(url)
		.then(matches => {
			console.log(matches);

			const distinctHomeTeams = matches.map(match => {
				return {
					team_id: match.home_team.home_team_id,
					team_name: match.home_team.home_team_name
				}
			}).distinct("team_id")
				.sort((a, b) => a.team_name.localeCompare(b.team_name));
			console.log(distinctHomeTeams);

			distinctHomeTeams.forEach(team => homeTeamHtmlSelect.append(new Option(team.team_name, team.team_id)));
			$(homeTeamHtmlSelect).prop( "disabled", false );

			// event
			$(homeTeamHtmlSelect).unbind("change");
			$(homeTeamHtmlSelect).change(function () {
				homeTeamHtmlSelect.resetNextElements();
				const homeTeamId = Number($(this).val());
				if (homeTeamId) {
					const matchesForHomeTeam = matches.filter(match => match.home_team.home_team_id === homeTeamId);
					loadAwayTeams(matchesForHomeTeam);
				}
			})
		});
}

/**
 * Get away teams names and ids on specific matches in corresponding htmlSelectElement
 * @param matches Specific matches
 */
function loadAwayTeams(matches) {
	console.log(matches);
	const distinctAwayTeams = matches.map(match => {
		return {
			team_id: match.away_team.away_team_id,
			team_name: match.away_team.away_team_name
		}
	}).distinct("team_id")
		.sort((a, b) => a.team_name.localeCompare(b.team_name));
	console.log(distinctAwayTeams);

	distinctAwayTeams.forEach(team => awayTeamHtmlSelect.append(new Option(team.team_name, team.team_id)));
	$(awayTeamHtmlSelect).prop( "disabled", false );

	// event
	$(awayTeamHtmlSelect).unbind("change");
	$(awayTeamHtmlSelect).change(function () {
		awayTeamHtmlSelect.resetNextElements();
		const awayTeamId = Number($(this).val());
		if (awayTeamId) {
			const match = matches.find(match =>
				match.home_team.home_team_id === Number($(homeTeamHtmlSelect).val()) &&
				match.away_team.away_team_id === awayTeamId);
			console.log("Selected match:");
			console.log(match);
			updateInformations(match);
			loadPlayers(match);
		}
	})
}

/**
 * Load all players in specific match and get them in corresponding htmlSelectElement
 * @param match Specific match
 */
function loadPlayers(match) {
	console.log(match);
	loadJSON(EVENT_URL + match.match_id + ".json")
		.then(events => {
			// starting event (id = 35): Indicates the players in the starting 11, their position and the team’s formation.
			const startingEvent = events.filter(event => event.type.id === 35);
			console.log("starting event");
			console.log(startingEvent);
			let homeTeamInfo, awayTeamInfo;
			if (startingEvent[0].team.id === match.home_team.home_team_id) {
				homeTeamInfo = startingEvent[0];
				awayTeamInfo = startingEvent[1];
			} else {
				homeTeamInfo = startingEvent[1];
				awayTeamInfo = startingEvent[0];
			}
			const homeFormation = homeTeamInfo.tactics.formation.toString().split("")
				.reduce((acc, char) => acc + char + "-", "").slice(0, -1);
			$("#home-formation").html(homeFormation);
			const awayFormation = awayTeamInfo.tactics.formation.toString().split("")
				.reduce((acc, char) => acc + char + "-", "").slice(0, -1);
			$("#away-formation").html(awayFormation);

			[homeTeamInfo, awayTeamInfo].forEach((teamInfo, index) => {
				// let optgroup = $('<optgroup/>')
				// 	.attr('label', teamInfo.team.name)
				// 	.appendTo($(playerHtmlSelect));
				$("#players-heading" + index).html(teamInfo.team.name);
				const players = teamInfo.tactics.lineup;

				// function compare( a, b ) {
				// 	if ( a.position.id < b.position.id ){
				// 		return -1;
				// 	}
				// 	if ( a.position.id > b.position.id ){
				// 		return 1;
				// 	}
				// 	return 0;
				// }
				// console.log(players);
				// console.log(players.sort(compare));
				// players.sort(compare)
				// 	.forEach(player =>  {
				// 		const option = new Option(
				// 			player.jersey_number + " - " + player.player.name + " (" + POSITIONS_GUIDE[player.position.id].abbreviation + ")",
				// 			player.player.id
				// 		);
				// 		$(option).attr("data-toggle", "tooltip")
				// 			.attr("title", POSITIONS_GUIDE[player.position.id].name);
				// 		optgroup.append(option);
				// 	});

				//////////////////////////// new
				positions[index] = [
					{position: "G", players: players.filter(p => p.position.id == 1)},
					{position: "D", players: players.filter(p => p.position.id >= 2 && p.position.id <= 8)},
					{position: "M", players: players.filter(p => (p.position.id >= 9 && p.position.id <= 16) || p.position.id >= 18 && p.position.id <= 20)},
					{position: "S", players: players.filter(p => p.position.id == 17 || p.position.id >= 21)}
				];
				console.log(positions[index]);
				let currentTrElement;
				positions[index].forEach(position => {
					currentTrElement = $("#" + position.position + "-checkbox" + index);
					position.players.forEach(player => {
						currentTrElement.after(`
							<tr id="tr-` + player.player.id + index + `">
								<td>
									<div class="checkbox player">
										<label data-toggle="tooltip" title="` + POSITIONS_GUIDE[player.position.id].name + `">
											<input type="checkbox" name="player" 
											value="` + position.position + `P" 
											playerId="` + player.player.id + `">
												` + player.jersey_number + " - " + player.player.name + " (" + POSITIONS_GUIDE[player.position.id].abbreviation + ")" + `
										</label>
									</div>
								</td>
							</tr>
						`);
						currentTrElement = $("#tr-" + player.player.id + index);
					});
				});


				const playersEventsData = events.filter(event => event.location && event.player);
				addCheckboxesListeners(index, playersEventsData);
			});

			$("#players-tabs").show();

			// $(playerHtmlSelect).prop( "disabled", false );
			//
			// $(playerHtmlSelect).unbind("change");
			// $(playerHtmlSelect).change(function () {
			// 	const playerId = Number($(this).val());
			// 	if (playerId) {
			// 		updateD3(events, playerId);
			// 	}
			// })
		});
	// loadJSON(LINEUP_URL + match.match_id + ".json")
	// 	.then(lineup => {
	// 		const homeLineup = lineup.find(team => team.team_id === match.home_team.home_team_id);
	// 		console.log("home lineup");
	// 		console.log(homeLineup);
	// 		let optgroup = $('<optgroup/>')
	// 			.attr('label', homeLineup.team_name)
	// 			.appendTo($(playerHtmlSelect));
	// 		const homePlayers = homeLineup.lineup;
	// 		homePlayers.sort((a, b) => a.player_name.localeCompare(b.player_name))
	// 			.forEach(player => optgroup.append(new Option(player.player_name, player.player_id)));
	//
	// 		const awayLineup = lineup.find(team => team.team_id === match.away_team.away_team_id);
	// 		console.log("away lineup");
	// 		console.log(awayLineup);
	// 		optgroup = $('<optgroup/>')
	// 			.attr('label', awayLineup.team_name)
	// 			.appendTo($(playerHtmlSelect));
	// 		const awayPlayers = awayLineup.lineup;
	// 		awayPlayers.sort((a, b) => a.player_name.localeCompare(b.player_name))
	// 			.forEach(player => optgroup.append(new Option(player.player_name, player.player_id)));
	//
	// 		$(playerHtmlSelect).prop( "disabled", false );
	//
	// 		const url = EVENT_URL + match.match_id + ".json";
	// 		$(playerHtmlSelect).unbind("change");
	// 		$(playerHtmlSelect).change(function () {
	// 			const playerId = Number($(this).val());
	// 			if (playerId) {
	// 				updateD3(url, playerId);
	// 			}
	// 		})
	// 	});
}

/**
 * Create checkboxes listeners
 */
let selectedPlayersId = [];
let selectedPlayersPositions = [];
let positions = [];

function onCheckboxChange(index, events){
	selectedPlayersId[index] =
		$.map($(".players-tab" + index + " input[name=player]:checked"), function(el) {
			return $(el).attr("playerId");
		});
	selectedPlayersPositions[index] =
		$.map($(".players-tab" + index + " input[name=player]:checked"), function(el) {
			return $(el).val();
		});
	console.log(selectedPlayersId[index]);
	console.log(selectedPlayersPositions[index]);

	positions[index].forEach(pos => {
		console.log("filter on selectedPlayersId");
		console.log(selectedPlayersPositions[index].filter(x => x[0] == pos.position));
		const concernedElement = $(".players-tab" + index + " input[value=" + pos.position + "]");
		const filter = selectedPlayersPositions[index].filter(x => x[0] == pos.position);
		if (filter.length === pos.players.length) {
			concernedElement.prop("checked", true);
			concernedElement.prop("indeterminate", false);
		} else if (filter.length == 0) {
			concernedElement.prop("checked", false);
			concernedElement.prop("indeterminate", false);
		} else {
			concernedElement.prop("indeterminate", true);
		}
	});

	const filteredData = events.filter(event => selectedPlayersId[index].includes(event.player.id.toString()));
	index == 0 ? updateD3Home(filteredData) : updateD3Away(filteredData);
}

function addCheckboxesListeners(index, events) {
	$.each($(".players-tab" + index + " input[name=player]"), (i, el) => {
		$(el).unbind("change");
		$(el).change(function () {
			onCheckboxChange(index, events);
		});
	});

	$.each($(".players-tab" + index + " input[name=position]"), (i, elPosition) => {
		$(elPosition).unbind("click");
		$(elPosition).click(function() {
			const value = $(elPosition).val();
			console.log(value);
			$.each($(".players-tab" + index + " input[value=" + value + "P]"), (i, elPlayer) => {
				$(elPlayer).prop("checked", $(elPosition).prop("checked"));
			});
			onCheckboxChange(index, events);
		});
	});
}

/**
 * Update information of given match in html
 * @param match Given match
 */
function updateInformations(match) {
	homeScore.html(match.home_score);
	awayScore.html(match.away_score);
	if (match.match_date) {
		matchDateSpan.html(match.match_date);
	} else {
		matchDateSpan.html("-");
	}
	if (match.kick_off) {
		matchKickoffSpan.html(match.kick_off);
	} else {
		matchKickoffSpan.html("-");
	}
	if (match.match_week) {
		matchWeek.html(match.match_week);
	} else {
		matchWeek.html("-");
	}
	if (match.referee && match.referee.name) {
		matchReferee.html(match.referee.name);
	} else {
		matchReferee.html("-");
	}
	if (match.stadium && match.stadium.name) {
		matchStadium.html(match.stadium.name);
	} else {
		matchStadium.html("-");
	}
	if (match.stadium && match.stadium.country) {
		if (match.stadium.country.name) {
			matchStadiumCountrySpan.html(match.stadium.country.name);
		} else {
			matchStadiumCountrySpan.html(match.stadium.country);
		}
	} else {
		matchStadiumCountrySpan.html("-");
	}
}