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

  const heatmap2Svg = d3.select("#heatmap2-" + matchId)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + defaultWidth + " " + defaultHeight)
    .classed("svg-content", true);

  $("svg").css({
    backgroundImage: "url(" + imageUrl + ")",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain"
  });

  updateD3(heatmap1Svg, data1);
  updateD3(heatmap2Svg, data2);
}