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
						<table class="table" id="stats-table-` + match.match_id + `">
							<thead>
								<tr>
									<th colspan="3" class="text-center">Midfield events</th>
								</tr>
							</thead>
							<tbody></tbody>
							<tfoot>
								<tr>
									<td>0</td>
									<td>Total</td>
									<td>0</td>
								</tr>
							</tfoot>
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
			.then(eventsArray => {
				buildStatsTable("stats-table-" + match.match_id, eventsArray);
				return eventsArray;
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