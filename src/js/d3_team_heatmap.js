const imageUrl = "img/field.jpg";

const
  defaultWidth = 672,
  defaultHeight = 442;

function loadD3(matchId, data1, data2) {

  const heatmap1Svg = d3.select("#heatmap1-" + matchId)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + defaultWidth + " " + defaultHeight)
    .classed("svg-content", true);

// const heatmap2Svg = d3.select("#lost-heatmap")
//     .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform",
//         "translate(" + margin.left + "," + margin.top + ")");

  const heatmap2Svg = d3.select("#heatmap2-" + matchId)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + defaultWidth + " " + defaultHeight)
    .classed("svg-content", true);

  $("svg").css({
    // backgroundColor: "green",
    backgroundImage: "url(" + imageUrl + ")",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain"
    // backgroundSize: width + "px " + height + "px",
    // backgroundPositionX: margin.left,
    // backgroundPositionY: margin.top
  });

  updateD3(data1, heatmap1Svg);
  updateD3(data2, heatmap2Svg);

  /**
   * Update svg element with new player event
   * @param url Url of the match event
   * @param playerId Player id
   * @param bandwidth
   * @param valueScale
   */
  function updateD3(data, heatmapSvg, bandwidth = 10, valueScale = 100) {
    // const teams = data.map(event => {return {id: event.team.id}}).distinct("id");
    // console.log(teams);

    // Clear svg
    heatmapSvg.selectAll("g").remove();

    // define an arrow
    // const defs = heatmapSvg.append("svg:defs");
    // const redArrowId = defineArrow(defs,"red");
    // const greenArrowId = defineArrow(defs, "green");

    const maxX = 120;
    const maxY = 80;

    // Add X axis
    const x = d3.scaleLinear()
      .domain([0, maxX])
      .range([0, defaultWidth]);
    // Display X axis
    // heatmap1Svg.append("g")
    //   .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, maxY])
      .range([0, defaultHeight]);
    // Display Y axis
    // heatmap1Svg.append("g")
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
      .size([defaultWidth, defaultHeight])
      .bandwidth(bandwidth)
      (data);

    // show the shape!
    heatmapSvg.insert("g", "g")
      .selectAll("path")
      .data(densityData)
      .enter().append("path")
      .attr("d", d3.geoPath())
      .attr("fill", function(d) { return color(d.value * valueScale); });

    // heatmap1Svg.insert("g", "g")
    //   .selectAll("line")
    //   .data(data).enter()
    //   .append("line")
    //   .attr("x1",  event => x(event.location[0]))
    //   .attr("y1", event => y(event.location[1]))
    //   .attr("x2", event => x(event.pass.end_location[0]))
    //   .attr("y2", event => y(event.pass.end_location[1]))
    //   .attr("stroke-width", 2)
    //   .attr("stroke", event => event.team.id === teams[0].id ? "green" : "red")
    //   .attr("marker-end", event => "url(#" + (event.team.id === teams[0].id ? greenArrowId : redArrowId) + ")");

    // heatmapSvg.insert("g", "g")
    //   .selectAll("line")
    //   .data(data).enter()
    //   .append("line")
    //   .attr("x1", event => x(event.location[0]))
    //   .attr("y1", event => y(event.location[1]))
    //   .attr("x2", event => x(event.pass.end_location[0]))
    //   .attr("y2", event => y(event.pass.end_location[1]))
    //   .attr("stroke-width", 2)
    //   .attr("stroke", "green")
    //   .attr("marker-end", "url(#" + greenArrowId + ")");
  }

  // function defineArrow(defs, colorString) {
  //   const id = "arrow-" + colorString;
  //   defs.append("svg:marker")
  //     .attr("id", id)
  //     .attr("refX", 6)
  //     .attr("refY", 6)
  //     .attr("markerWidth", 30)
  //     .attr("markerHeight", 30)
  //     .attr("markerUnits", "userSpaceOnUse")
  //     .attr("orient", "auto")
  //     .append("path")
  //     .attr("d", "M 0 0 12 6 0 12 3 6")
  //     .style("fill", colorString);
  //   return id
  // }

}