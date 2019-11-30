HTMLSelectElement.prototype.resetElement = function() {
	const id = this.id;
	const text = id.replace("_", " ");
	// "this" => an JavaScript DOM object
	// "$(this)" => convert "this" to a JQuery object
	$(this).empty();
	$(this).append(new Option("Select " + text + "...", NONE));
	$(this).prop("disabled", true);
};

HTMLSelectElement.prototype.resetNextElements = function() {
	const nextHTMLSelectElements = htmlSelectElements.slice(htmlSelectElements.indexOf(this) + 1);
	nextHTMLSelectElements.flat(1).forEach(el => el.resetElement())
};

Array.prototype.distinct = function(prop) {
	return this.filter((obj, pos, arr) => {
		return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
	});
};

async function loadJSON(url) {
	return fetch(url)
		.then(response => {
			return response.json();
		})
		.catch(err => {
			console.log(err);
		})
}

function loadCountries(url) {
	loadJSON(url)
		.then(data => {
			console.log(data);

			const distinctByCountry = data.distinct("country_name");
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

function loadCompetitions(data) {
	console.log(data);

	const distinctByCompetition = data.distinct("competition_id");
	console.log(distinctByCompetition);

	distinctByCompetition.forEach(competition => competitionHtmlSelect.append(new Option(competition.competition_name, competition.competition_id)));
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

function loadSeasons(data) {
	console.log(data);

	const distinctBySeason = data.distinct("season_id");
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
			const competitionsBySeason = data.filter(competition => competition.season_id === seasonId);
			loadGender(competitionsBySeason);
		}
	});
}

function loadGender(data) {
	console.log(data);

	const distinctByGender = data.distinct("competition_gender");
	console.log(distinctByGender);

	distinctByGender.forEach(competition => genderHtmlSelect.append(new Option(competition.competition_gender, competition.competition_gender)));
	$(genderHtmlSelect).prop( "disabled", false );

	// event
	$(genderHtmlSelect).unbind("change");
	$(genderHtmlSelect).change(function (e) {
		e.stopImmediatePropagation();
		genderHtmlSelect.resetNextElements();
		if ($(this).val() !== NONE) {
			const competitionsByGender = data.find(competition => competition.competition_gender === $(this).val());
			loadHomeTeams(competitionsByGender);
		}
	});
}

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
			}).distinct("team_id");
			console.log(distinctHomeTeams);

			distinctHomeTeams.forEach(team => homeTeamHtmlSelect.append(new Option(team.team_name, team.team_id)));
			$(homeTeamHtmlSelect).prop( "disabled", false );

			// event
			$(homeTeamHtmlSelect).unbind("change");
			$(homeTeamHtmlSelect).change(function (e) {
				homeTeamHtmlSelect.resetNextElements();
				const homeTeamId = Number($(this).val());
				if (homeTeamId) {
					const matchesForHomeTeam = matches.filter(match => match.home_team.home_team_id === homeTeamId);
					loadAwayTeams(matchesForHomeTeam);
				}
			})
		});
}

function loadAwayTeams(matches) {
	console.log("in data:");
	console.log(matches);
	const distinctAwayTeams = matches.map(match => {
		return {
			team_id: match.away_team.away_team_id,
			team_name: match.away_team.away_team_name
		}
	}).distinct("team_id");
	console.log(distinctAwayTeams);

	distinctAwayTeams.forEach(team => awayTeamHtmlSelect.append(new Option(team.team_name, team.team_id)));
	$(awayTeamHtmlSelect).prop( "disabled", false );

	// event
	$(awayTeamHtmlSelect).unbind("change");
	$(awayTeamHtmlSelect).change(function (e) {
		awayTeamHtmlSelect.resetNextElements();
		const awayTeamId = Number($(this).val());
		if (awayTeamId) {
			const match = matches.find(match =>
				match.home_team.home_team_id === Number($(homeTeamHtmlSelect).val()) &&
				match.away_team.away_team_id === awayTeamId);
			loadPlayers(match);
		}
	})
}

function loadPlayers(match) {
	loadJSON(LINEUP_URL + match.match_id + ".json")
		.then(lineup => {
			const homeLineup = lineup.find(team => team.team_id === match.home_team.home_team_id);
			console.log("home lineup");
			console.log(homeLineup);
			let optgroup = $('<optgroup/>')
				.attr('label', homeLineup.team_name)
				.appendTo($(playerHtmlSelect));
			homeLineup.lineup.forEach(player => optgroup.append(new Option(player.player_name, player.player_id)));

			const awayLineup = lineup.find(team => team.team_id === match.away_team.away_team_id);
			console.log("away lineup");
			console.log(awayLineup);
			optgroup = $('<optgroup/>')
				.attr('label', awayLineup.team_name)
				.appendTo($(playerHtmlSelect));
			awayLineup.lineup.forEach(player => optgroup.append(new Option(player.player_name, player.player_id)));

			$(playerHtmlSelect).prop( "disabled", false );

			const url = EVENT_URL + match.match_id + ".json";
			$(playerHtmlSelect).unbind("change");
			$(playerHtmlSelect).change(function () {
				const playerId = Number($(this).val());
				if (playerId) {
					updateD3(url, playerId);
				}
			})
		});
}
