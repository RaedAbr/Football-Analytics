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
 * Get gender names and ids in corresponding htmlSelectElement
 * @param data Array containing competitions
 */
// function loadGender(data) {
// 	console.log(data);
//
// 	const distinctByGender = data.distinct("competition_gender")
// 		.sort((a, b) => a.competition_gender.localeCompare(b.competition_gender));
// 	console.log(distinctByGender);
//
// 	distinctByGender.forEach(competition => genderHtmlSelect.append(new Option(competition.competition_gender, competition.competition_gender)));
// 	$(genderHtmlSelect).prop( "disabled", false );
//
// 	// event
// 	$(genderHtmlSelect).unbind("change");
// 	$(genderHtmlSelect).change(function (e) {
// 		e.stopImmediatePropagation();
// 		genderHtmlSelect.resetNextElements();
// 		if ($(this).val() !== NONE) {
// 			const competitionsByGender = data.find(competition => competition.competition_gender === $(this).val());
// 			loadTeams(competitionsByGender);
// 		}
// 	});
// }

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
	$("#matches-container").empty();
	matches.forEach(match =>
	{
		$("#matches-container").append(`
				<div class="row text-center">
          <div class="col-md-6 col-md-offset-3">
            <div class="panel panel-default final-score">
              <div class="panel-heading">Final Score</div>

              <table class="table">
                <tr>
                  <td><strong><span id="selected-score-` + match.match_id + `">-</span></strong></td>
                  <td>:</td>
                  <td><strong><span id="other-score-` + match.match_id + `">-</span></strong></td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-6">
            <div class="panel panel-default">
            	<div class="panel-heading">
              	<span id="selected-name-` + match.match_id + `"></span> (<span id="selected-leg-` + match.match_id + `"></span>)
              </div>
              <div class="text-center .svg-container" id="heatmap1-` + match.match_id + `"></div>
            </div>
          </div>
          <div class="col-xs-6">
            <div class="panel panel-default">
              <div class="panel-heading">
              	<span id="other-name-` + match.match_id + `"></span> (<span id="other-leg-` + match.match_id + `"></span>)
              </div>
              <div class="text-center .svg-container" id="heatmap2-` + match.match_id + `"></div>
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

		$("#selected-name-" + match.match_id).html(selectedTeam.team_name);
		$("#other-name-" + match.match_id).html(otherTeam);

		$("#selected-score-" + match.match_id).html(scoreSelectedTeam);
		$("#other-score-" + match.match_id).html(scoreOtherTeam);

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
				loadD3(match.match_id, data1, data2);
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