/**
 * Method of HTMLSelectElement class
 * Reinitialize all next htmlSelectElement of the current htmlSelectElement.
 * All elements are saved in "htmlSelectElements" array
 */
HTMLSelectElement.prototype.resetNextElements = function() {
	const nextHTMLSelectElements = htmlSelectElements.slice(htmlSelectElements.indexOf(this) + 1);
	nextHTMLSelectElements.flat(1).forEach(el => el.resetElement());
	spanElements.forEach(el => el.html("-"));
	$("#home-heatmap > svg").empty();
	$("#away-heatmap > svg").empty();
	$("#home-formation").empty();
	$("#away-formation").empty();
	$("#players-tabs").hide();
	$("[id^=tr-]").remove();
	$("input[type=checkbox]").prop("checked", false).prop("indeterminate", false);
};

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
				$("#players-heading" + index).html(`
					<input type="checkbox" class="all-players-checkbox" value="all-` + index + `">
					All players - <strong>` + teamInfo.team.name + `</strong>
				`);
				const players = teamInfo.tactics.lineup;
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
		});
}

/**
 * Create checkboxes listeners
 */
let selectedPlayersId = [];
let selectedPlayersPositions = [];
let positions = [];
let eventsArray = [[], []];

function onCheckboxChange(index, events){
	const allCheckedCheckboxes = $(".players-tab" + index + " input[name=player]:checked");
	selectedPlayersId[index] =
		$.map(allCheckedCheckboxes, function(el) {
			return $(el).attr("playerId");
		});
	selectedPlayersPositions[index] =
		$.map(allCheckedCheckboxes, function(el) {
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
	eventsArray[index] = filteredData;
	buildStatsTable("stats-table", eventsArray);
	index == 0 ? updateD3Home(filteredData) : updateD3Away(filteredData);
}

function addCheckboxesListeners(index, events) {
	// select all checkbox event
	const el = $("input[type=checkbox][value=all-" + index + "]");
	el.unbind("change");
	el.click(function() {
		$(".players-tab" + index + " input[name=player]").prop("checked", $(el).prop("checked"));
		onCheckboxChange(index, events);
	});

	// select player checkbox event
	$.each($(".players-tab" + index + " input[name=player]"), (i, el) => {
		$(el).unbind("change");
		$(el).change(function () {
			onCheckboxChange(index, events);
		});
	});

	// select position checkbox event
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