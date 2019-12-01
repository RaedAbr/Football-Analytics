const imageUrl = "img/field.jpg";

// set the dimensions and margins of the graph
const margin = {top: 20, right: 20, bottom: 20, left: 20},
  width = 450 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#heatmap")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

$("svg").css({
  backgroundColor: "green",
  backgroundImage: "url(" + imageUrl + ")",
  backgroundRepeat: "no-repeat",
  backgroundSize: width + "px " + height + "px",
  backgroundPositionX: margin.left,
  backgroundPositionY: margin.top
});

/**
 * Update svg element with new player event
 * @param url Url of the match event
 * @param playerId Player id
 * @param bandwidth
 * @param valueScale
 */
function updateD3(url, playerId, bandwidth=10, valueScale=100) {
  d3.json(url, function(data) {
    // Clear svg
    svg.selectAll("g").remove();

    data = data.filter(event => event.location && event.player)
      .filter(event => event.player.id === playerId);

    const maxX = 120;
    const maxY = 80;

    // Add X axis
    const x = d3.scaleLinear()
      .domain([0, maxX])
      .range([0, width]);
    // Display X axis
    // svg.append("g")
    //   .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, maxY])
      .range([0, height]);
    // Display Y axis
    // svg.append("g")
    //   .call(d3.axisRight(y));

    // Prepare a color palette
    const color = d3.scaleLinear()
      .domain([0, 0.25, 0.5, 0.75, 1]) // Points per square pixel.
      .range(["rgba(0,0,255,.5)", "rgba(255,233,0,0.5)", "rgba(255,111,0,0.5)", "rgba(255,0,0,0.5)"]);

    // compute the density data
    const densityData = d3.contourDensity()
      .x(function (d) {
        return x(d.location[0]);
      })
      .y(function (d) {
        return y(d.location[1]);
      })
      .size([width, height])
      .bandwidth(bandwidth)
      (data);

    // show the shape!
    svg.insert("g", "g")
      .selectAll("path")
      .data(densityData)
      .enter().append("path")
      .attr("d", d3.geoPath())
      .attr("fill", function(d) { return color(d.value * valueScale); });
  });
}