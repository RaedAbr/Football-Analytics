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