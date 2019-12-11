
window.countryChart = dc.rowChart("#country-chart");
window.competitionChart = dc.rowChart("#competition-chart");
window.seasonChart = dc.rowChart("#season-chart");
window.timeChartObs = dc.lineChart("#time-chart-obs");
// window.timeBar = dc.barChart("#time-bar");
window.dataTable = dc.dataTable("#data-table");

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
            //console.log(data);
            data.forEach(d => {
                matches.push({
                    match_id: d.match_id,
                    match_date: new Date(d.match_date),
                    match_date_str: new Date(d.match_date).toLocaleDateString(),
                    home_team_name: d.home_team.home_team_name,
                    away_team_name: d.away_team.away_team_name,
                    home_score: d.home_score,
                    away_score: d.away_score,
                    score: d.home_score + " - " + d.away_score,
                    season_name: d.season.season_name,
                    country_name: d.competition.country_name,
                    competition_name: d.competition.competition_name
                });
            });

        });
}


var tableOffset = 0, tablePageSize = 10;
var ndx;
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

            setTimeout(function () {
                console.log(matches);
                ndx = crossfilter(matches);
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
                    .colors('#3182bd')
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
                    .colors('#3182bd')
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
                    .colors('#3182bd')
                    .label(d => d.key)
                    .elasticX(true)
                    .xAxis()
                    .ticks(4);

                const observationDimension = ndx.dimension(d => d3.time.month(d.match_date));
                const observationGroup = observationDimension.group().reduceCount(d => d.match_date);

                timeChartObs
                    .renderArea(true)
                    .width(990)
                    .height(270)
                    .transitionDuration(500)
                    .margins({
                        top: 20, right: 50, bottom: 30, left: 40,
                    })
                    .dimension(observationDimension)
                    .group(observationGroup)
                    .yAxisLabel("Match nb")
                    .xAxisLabel("Date")
                    // .rangeChart(timeBar)
                    .brushOn(false)
                    .mouseZoomable(false)
                    .x(d3.time.scale().domain(d3.extent(matches, d => d.match_date)))
                    .round(d3.time.month.round)
                    .xUnits(d3.time.months)
                    .elasticY(true)
                    .renderHorizontalGridLines(true)
                    .title(d => `Number of matche: ` + d.value)
                    .xAxis();


                // timeBar
                //     .width(990)
                //     .height(100)
                //     .margins({
                //         top: 0, right: 50, bottom: 30, left: 30,
                //     })
                //     .dimension(observationDimension)
                //     .group(observationGroup)
                //     .yAxisLabel("Match nb")
                //     .xAxisLabel("Date")
                //     .centerBar(true)
                //     .gap(1)
                //     .x(d3.time.scale().domain(d3.extent(matches, d => d.match_date)))
                //     .round(d3.time.month.round)
                //     .alwaysUseRounding(true)
                //     .xUnits(d3.time.months)
                //     .yAxis()
                //     .tickFormat(v => '');


                const matchDimension = ndx.dimension(d => d.match_id);
                const matchGroup = matchDimension.group();

                // dataTable
                //     .dimension(matchDimension)
                //     .group(d => matchGroup)
                //     .size(matches.length)
                //     .columns([
                //         {
                //             label: 'Home team',
                //             format(d) {
                //                 return d.home_team_name;
                //             },
                //         },
                //         {
                //             label: 'Score',
                //             format(d) {
                //                 return d.home_score + " - " + d.away_score;
                //             },
                //         },
                //         {
                //             label: 'Away team',
                //             format(d) {
                //                 return d.away_team_name;
                //             },
                //         },
                //         {
                //             label: 'Competition',
                //             format(d) {
                //                 return d.competition_name;
                //             },
                //         },
                //         {
                //             label: 'Season',
                //             format(d) {
                //                 return d.season_name;
                //             },
                //         },
                //         {
                //             label: 'Date',
                //             format(d) {
                //                 return d.match_date.toLocaleDateString();
                //             },
                //         },

                //     ])
                //     .sortBy(d => d.match_date)
                //     .order(d3.descending);
                //     // .on('renderlet', (table) => {
                //     //     table.selectAll('.dc-table-group').classed('info', true);
                //     // });


                // var dim = {},     // Stores all crossfilter dimensions
                //     groups = {},  // Stores all crossfilter groups
                //     cf;
                    
                    // https://github.com/HamsterHuey/intothevoid.io/blob/master/code/2017/dcjs%20sortable%20table/dcjsSortableTable.html
                    // Programmatically insert header labels for table
                    var tableHeader = d3.select(".table-header")
                        .selectAll("th");
                    // Bind data to tableHeader selection.
                    tableHeader = tableHeader.data(
                        [
                            { label: "Home Team", field_name: "home_team_name", sort_state: "ascending" },
                            { label: "Score", field_name: "score", sort_state: "ascending" },
                            { label: "Away Team", field_name: "away_team_name", sort_state: "ascending" },
                            { label: "Competition", field_name: "competition_name", sort_state: "ascending" },
                            { label: "Season", field_name: "season_name", sort_state: "ascending" },
                            { label: "Date", field_name: "match_date", sort_state: "descending" } // Note Max Conf row starts off as descending
                        ]
                    );
                    // enter() into virtual selection and create new <th> header elements for each table column
                    tableHeader = tableHeader.enter()
                        .append("th")
                        .text(function (d) { return d.label; }) // Accessor function for header titles
                        .on("click", tableHeaderCallback);
                    function tableHeaderCallback(d) {
                        // Highlight column header being sorted and show bootstrap glyphicon
                        var activeClass = "info";
                        d3.selectAll("#data-table th") // Disable all highlighting and icons
                            .classed(activeClass, false)
                            .selectAll("span")
                            .style("visibility", "hidden") // Hide glyphicon
                        var activeSpan = d3.select(this) // Enable active highlight and icon for active column for sorting
                            .classed(activeClass, true)  // Set bootstrap "info" class on active header for highlight
                            .select("span")
                            .style("visibility", "visible");
                        // Toggle sort order state to user desired state
                        d.sort_state = d.sort_state === "ascending" ? "descending" : "ascending";
                        var isAscendingOrder = d.sort_state === "ascending";
                        dataTable
                            .order(isAscendingOrder ? d3.ascending : d3.descending)
                            .sortBy(function (datum) { return datum[d.field_name]; });
                        // Reset glyph icon for all other headers and update this headers icon
                        activeSpan.node().className = ''; // Remove all glyphicon classes
                        // Toggle glyphicon based on ascending/descending sort_state
                        activeSpan.classed(
                            isAscendingOrder ? "glyphicon glyphicon-sort-by-attributes" :
                                "glyphicon glyphicon-sort-by-attributes-alt", true);
                        updateTable();
                        dataTable.redraw();
                    }
                    // Initialize sort state and sort icon on one of the header columns
                    // Highlight "Max Conf" cell on page load
                    // This can be done programmatically for user specified column
                    tableHeader.filter(function (d) { return d.label === "Date"; })
                        .classed("info", true);
                    var tableSpans = tableHeader
                        .append("span") // For Sort glyphicon on active table headers
                        .classed("glyphicon glyphicon-sort-by-attributes-alt", true)
                        .style("visibility", "hidden")
                        .filter(function (d) { return d.label === "Date"; })
                        .style("visibility", "visible");
                    
                    // ##############################
                    // Generate the dc.js dataTable
                    // ##############################
                    // Create generating functions for each columns
                    var columnFunctions = [
                        function (d) { return d.home_team_name; },
                        function (d) { return d.score; },
                        function (d) { return d.away_team_name; },
                        function (d) { return d.competition_name; },
                        function (d) { return d.season_name; },
                        function (d) { return d.match_date_str; },
                    ];
                    // Pagination implementation inspired by:
                    // https://github.com/dc-js/dc.js/blob/master/web/examples/table-pagination.html
                    dataTable.width(960).height(800)
                        .dimension(matchDimension)
                        .group(function (d) { return "Dummy" }) // Must pass in. Ignored since .showGroups(false)
                        .size(Infinity)
                        .columns(columnFunctions)
                        .showGroups(false)
                        .sortBy(function (d) { return d.date; }) // Initially sort by max_conf column
                        .order(d3.descending);
                    updateTable();
                    dataTable.redraw();
                    

                // Data Table Pagination
                
                // updateTable calculates correct start and end indices for current page view
                // it slices and pulls appropriate date for current page from dataTable object
                // Finally, it updates the pagination button states depending on if more records
                // are available
                
                


                // number selected
                dc.dataCount('.data-count')
                    .dimension(ndx) // set dimension to all data
                    .group(all); // set group to ndx.groupAll()

                dc.renderAll();
                dc.redrawAll();

            }, 1000);




            // const distinctByCountry = data.distinct("country_name")
            //     .sort((a, b) => a.country_name.localeCompare(b.country_name));
            // console.log(distinctByCountry);


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

function updateTable() {
    // Ensure Prev/Next bounds are correct, especially after filters applied to dc charts
    var totFilteredRecs = ndx.groupAll().value();
    // Adjust values of start and end record numbers for edge cases
    var end = tableOffset + tablePageSize > totFilteredRecs ? totFilteredRecs : tableOffset + tablePageSize;
    tableOffset = tableOffset >= totFilteredRecs ? Math.floor((totFilteredRecs - 1) / tablePageSize) * tablePageSize : tableOffset;
    tableOffset = tableOffset < 0 ? 0 : tableOffset; // In case of zero entries
    // Grab data for current page from the dataTable object
    dataTable.beginSlice(tableOffset);
    dataTable.endSlice(tableOffset + tablePageSize);
    // Update Table paging buttons and footer text
    d3.select('span#begin')
        .text(end === 0 ? tableOffset : tableOffset + 1); // Correct for "Showing 1 of 0" bug
    d3.select('span#end')
        .text(end);
    d3.select('#Prev.btn')
        .attr('disabled', tableOffset - tablePageSize < 0 ? 'true' : null);
    d3.select('#Next.btn')
        .attr('disabled', tableOffset + tablePageSize >= totFilteredRecs ? 'true' : null);
    d3.select('span#size').text(totFilteredRecs);
    dataTable.redraw();
}

// Callback function for clicking "Next" page button
function nextPage() {
    tableOffset += tablePageSize;
    updateTable();
}
// Callback function for clicking "Prev" page button
function prevPage() {
    tableOffset -= tablePageSize;
    updateTable();
}
