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
	$("#heatmaps-container").empty();
	$("#page-header").hide();
	const nextHTMLSelectElements = htmlSelectElements.slice(htmlSelectElements.indexOf(this) + 1);
	nextHTMLSelectElements.flat(1).forEach(el => el.resetElement());
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
			loadTeams(competitionsBySeason);
		}
	});
}

/**
 * Load all maches in a competition and get teams names and ids in corresponding htmlSelectElement
 * @param competition Specific competitions
 */
function loadTeams(competition) {
	console.log(competition);
	const url = MATCHES_URL +	competition.competition_id + "/" + competition.season_id + ".json";
	console.log("loadTeams");
	console.log(url);
	loadJSON(url)
		.then(matches => {
			console.log(matches);

			const distinctTeams1 = matches.map(match => {
				return {
					team_id: match.home_team.home_team_id,
					team_name: match.home_team.home_team_name
				}
			});
			const distinctTeams2 = matches.map(match => {
				return {
					team_id: match.away_team.away_team_id,
					team_name: match.away_team.away_team_name
				}
			});
			const distinctTeams = [...distinctTeams1, ...distinctTeams2].distinct("team_id")
				.sort((a, b) => a.team_name.localeCompare(b.team_name));
			console.log(distinctTeams);

			distinctTeams.forEach(team => teamHtmlSelect.append(new Option(team.team_name, team.team_id)));
			$(teamHtmlSelect).prop( "disabled", false );

			// event
			$(teamHtmlSelect).unbind("change");
			$(teamHtmlSelect).change(function () {
				teamHtmlSelect.resetNextElements();
				const teamId = Number($(this).val());
				if (teamId) {
					const matchesTeam = matches.filter(match => match.home_team.home_team_id === teamId ||
						match.away_team.away_team_id === teamId);
					displayHeatmaps(matchesTeam, distinctTeams.find(team => team.team_id == teamId));
				}
			})
		});
}

function displayHeatmaps(matches, selectedTeam) {
	console.log(matches);
	$("#page-header").show();
	matches.forEach(match => {
		$("#heatmaps-container").append(`
		<div class="panel panel-default text-center">
			<div class="panel-heading">
				<div class="row">
					<div class="col-md-5 text-right">
						<strong><span id="selected-name-` + match.match_id + `"></span> (<span id="selected-leg-` + match.match_id + `"></span>)</strong>
					</div>
					<div class="col-md-2">
						vs
					</div>
					<div class="col-md-5 text-left">
						<strong><span id="other-name-` + match.match_id + `"></span> (<span id="other-leg-` + match.match_id + `"></span>)</strong>
					</div>
				</div>
				<hr>
				<div class="row">
					<div class="col-md-5 text-right">
						<strong><span id="selected-score-` + match.match_id + `">-</span></strong>
					</div>
					<div class="col-md-2">
						:
					</div>
					<div class="col-md-5 text-left">
						<strong><span id="other-score-` + match.match_id + `">-</span></strong>
					</div>
				</div>
			</div>
  		<div class="panel-body">
        <div class="row">
          <div class="col-xs-5 heatmap">
						<div class="text-center .svg-container" id="heatmap1-` + match.match_id + `">
							<div class="text-left attack-arrow">
								<span style="font-size: 30px">&#8680;</span>
								<span style="position: relative; top: -4px;">Attack</span>
							</div>
						</div> 
          </div>
          <div class="col-xs-2 stats">
						<table class="table" id="table-` + match.match_id + `">
						</table>
					</div>
          <div class="col-xs-5 heatmap">            
						<div class="text-center .svg-container" id="heatmap2-` + match.match_id + `">
							<div class="text-left attack-arrow">
								<span style="font-size: 30px">&#8680;</span>
								<span style="position: relative; top: -4px;">Attack</span>
							</div>
						</div>
          </div>
        </div>
			</div>
		</div>`
		);
		let otherTeam = "", otherTeamId, scoreSelectedTeam, scoreOtherTeam, selectedLeg, otherLeg;
		if (selectedTeam.team_id == match.home_team.home_team_id) {
			otherTeam = match.away_team.away_team_name;
			otherTeamId = match.away_team.away_team_id;
			scoreSelectedTeam = match.home_score;
			scoreOtherTeam = match.away_score;
			selectedLeg = "home";
			otherLeg = "away";
		} else {
			otherTeam = match.home_team.home_team_name;
			otherTeamId = match.home_team.home_team_id;
			scoreSelectedTeam = match.away_score;
			scoreOtherTeam = match.home_score;
			selectedLeg = "away";
			otherLeg = "home";
		}

		let colorScoreSelected = "black", colorScoreOther = "black";
		if (scoreSelectedTeam > scoreOtherTeam) {
			colorScoreSelected = "green";
		} else {
			colorScoreOther = "green";
		}

		$("#selected-name-" + match.match_id).html(selectedTeam.team_name).css("color", colorScoreSelected);
		$("#other-name-" + match.match_id).html(otherTeam).css("color", colorScoreOther);

		$("#selected-score-" + match.match_id).html(scoreSelectedTeam).css("color", colorScoreSelected);
		$("#other-score-" + match.match_id).html(scoreOtherTeam).css("color", colorScoreOther);

		$("#selected-leg-" + match.match_id).html(selectedLeg);
		$("#other-leg-" + match.match_id).html(otherLeg);

		const url = EVENT_URL + match.match_id + ".json";
		loadJSON(url)
			.then(events => {
				const data1 = events.filter(
					event => event.team.id == selectedTeam.team_id &&
						event.position && event.location &&
						(event.position.id >= 9 && event.position.id <= 20) // [9..20] => Midfield positions);
				);
				const data2 = events.filter(event => event.team.id == otherTeamId &&
					event.position && event.location &&
					(event.position.id >= 9 && event.position.id <= 20));
				return [data1, data2]
			})
			.then(dataArray => {
				const eventList1 = dataArray[0].map(event => {return {name: event.type.name, id: event.type.id}});
				const eventList2 = dataArray[1].map(event => {return {name: event.type.name, id: event.type.id}});

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

				stats.forEach(stat => {
					$("#table-" + match.match_id).append(`
						<tr>
							<td>` + stat.team1Stat + `</td>
							<td data-toggle="tooltip" title="` + eventsDescriptions[stat.eventId] + `">` + stat.eventName + `</td>
							<td>` + stat.team2Stat + `</td>
						</tr>
					`);
				});
				$("#table-" + match.match_id).append(`
					<tr>
						<td>` + stats.reduce((acc, stat) => acc + stat.team1Stat, 0) + `</td>
						<td>Total</td>
						<td>` + stats.reduce((acc, stat) => acc + stat.team2Stat, 0) + `</td>
					</tr>
				`);

				return dataArray;
			})
			.then(dataArray => {
				loadD3(match.match_id, dataArray[0], dataArray[1]);
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