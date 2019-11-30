// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// read data
d3.json("https://raw.githubusercontent.com/statsbomb/open-data/master/data/events/266310.json", function(data) {
  data = data.filter(event => event.location).filter(event => event.player.name === "Lionel Andrés Messi Cuccittini")
  console.log(data)

  let maxX = 120
  let maxY = 80

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, maxX])
    .range([ margin.left, width - margin.right ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, maxY])
    .range([ height - margin.bottom, margin.top ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Prepare a color palette
  var color = d3.scaleLinear()
      .domain([0, 1]) // Points per square pixel.
      .range(["rgba(1,0,0,0)", "red"])

  // compute the density data
  var densityData = d3.contourDensity()
    .x(function(d) { return x(d.location[0]); })
    .y(function(d) { return y(d.location[1]); })
    .size([width, height])
    .bandwidth(15)
    (data)

  
    console.log(densityData)

  // show the shape!
  svg.insert("g", "g")
    .selectAll("path")
    .data(densityData)
    .enter().append("path")
      .attr("d", d3.geoPath())
      .attr("fill", function(d) { return color(d.value * 100); })
})