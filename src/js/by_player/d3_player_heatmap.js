const imageUrl = "img/field.jpg";

const
  defaultWidth = 672,
  defaultHeight = 442;

const homeSvg = d3.select("#home-heatmap")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 " + defaultWidth + " " + defaultHeight)
  .classed("svg-content", true);

const awaySvg = d3.select("#away-heatmap")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 " + defaultWidth + " " + defaultHeight)
  .classed("svg-content", true);

$("svg").css({
  backgroundImage: "url(" + imageUrl + ")",
  backgroundRepeat: "no-repeat",
  backgroundSize: "contain"
});

function updateD3Home(filteredEvents) {
  updateD3(homeSvg, filteredEvents);
}

function updateD3Away(filteredEvents) {
  updateD3(awaySvg, filteredEvents);
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

  // filteredEvents = filteredEvents.filter(event => event.location && event.player)
  //   .filter(event => event.player.id === playerId);
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
    .range(["rgba(0,0,255,.5)", "rgba(255,233,0,0.5)", "rgba(255,111,0,0.5)", "rgba(255,0,0,0.5)"]);

  // compute the density filteredEvents
  const densityData = d3.contourDensity()
    .x(function (d) { return x(d.location[0]); })
    .y(function (d) { return y(d.location[1]); })
    .weight(1)
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