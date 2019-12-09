
window.countryChart = dc.rowChart("#country-chart");
window.competitionChart = dc.rowChart("#competition-chart");
window.seasonChart = dc.rowChart("#season-chart");

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
Array.prototype.distinct = function (prop) {
    return this.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
};


var matches = [];
function loadMatches(competition_id, season_id) {
    let url = MATCHES_URL + competition_id + "/" + season_id + ".json";
    loadJSON(url)
        .then(data => {
            console.log(data);
            data.forEach(d => {
                matches.push({
                    match_date: d.match_date,
                    home_team_name: d.home_team.home_team_name,
                    away_team_name: d.away_team.away_team_name,
                    home_score: d.home_score,
                    away_score: d.away_score,
                    season_name: d.season.season_name,
                    country_name: d.competition.country_name,
                    competition_name: d.competition.competition_name
                });
            });

        });
}




/**
 * Load competitions data and get countries names and ids in corresponding htmlSelectElement
 * @param {string} url Url to competitions data
 */
function loadAll(url) {
    loadJSON(url)
        .then(data => {
            console.log(data);

            data.forEach(d => {
                loadMatches(d.competition_id, d.season_id)
            });

            setTimeout(function() {
                console.log(matches);
                var ndx = crossfilter(matches);
            var all = ndx.groupAll();

            // console.log(ndx);
            // console.log(all);

            const countryDimension = ndx.dimension(d => d.country_name);
            const countryGroup = countryDimension.group();

            countryChart
                .width(300)
                .height(300)
                .margins({
                    top: 5, left: 10, right: 10, bottom: 20,
                })
                .dimension(countryDimension)
                .group(countryGroup)
                .colors(d3.scale.category10())
                .label(d => d.key)
                .elasticX(true)
                .xAxis()
                .ticks(4);

            const competitionDimension = ndx.dimension(d => d.competition_name);
            const competitionGroup = competitionDimension.group();

            competitionChart
                .width(300)
                .height(300)
                .margins({
                    top: 5, left: 10, right: 10, bottom: 20,
                })
                .dimension(competitionDimension)
                .group(competitionGroup)
                .colors(d3.scale.category10())
                .label(d => d.key)
                .elasticX(true)
                .xAxis()
                .ticks(4);

            const seasonDimension = ndx.dimension(d => d.season_name);
            const seasonGroup = seasonDimension.group();

            seasonChart
                .width(300)
                .height(300)
                .margins({
                    top: 5, left: 10, right: 10, bottom: 20,
                })
                .dimension(seasonDimension)
                .group(seasonGroup)
                .colors(d3.scale.category10())
                .label(d => d.key)
                .elasticX(true)
                .xAxis()
                .ticks(4);
            

            dc.renderAll();
            dc.redrawAll();
            }, 500);

            
            

            const distinctByCountry = data.distinct("country_name")
                .sort((a, b) => a.country_name.localeCompare(b.country_name));
            console.log(distinctByCountry);


            // distinctByCountry.forEach(competition => countryHtmlSelect.append(new Option(competition.country_name, competition.country_name)));
            // $(countryHtmlSelect).prop("disabled", false);

            // // event
            // $(countryHtmlSelect).unbind("change");
            // $(countryHtmlSelect).change(function (e) {
            // 	e.stopImmediatePropagation();
            // 	countryHtmlSelect.resetNextElements();
            // 	if ($(this).val() !== NONE) {
            // 		const competitionsByCountry = data.filter(competition => competition.country_name === $(this).val());
            // 		loadCompetitions(competitionsByCountry);
            // 	}
            // });
        });
}