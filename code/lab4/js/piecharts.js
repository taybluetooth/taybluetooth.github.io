/*
Author: Callum Taylor
Filename: piecharts.js
License: MIT Open Source License
*/


// declare pie chart constants

var colors = {
  pink: "#B122B7",
  blue: "#00DBFF",
};

var radius = 100;
var border = 20;
var padding = 30;
var startPercent = 0;
var endPercent = 0.005;

var twoPi = Math.PI * 2;
var formatPercent = d3.format(".2%");
var boxSize = (radius + padding) * 2;

// experimental values for animation
var count = Math.abs((endPercent - startPercent) / 0.01);
var step = endPercent < startPercent ? -0.01 : 0.01;

// create pie chart arc progress
var arc = d3
  .arc()
  .startAngle(0)
  .innerRadius(radius)
  .outerRadius(radius - border);

// method which creates a pie (doughnut) chart given a set of params
const CREATEPIE = (name, text, color) => {
  // declare pie chart parent and svg groupings
  var parent = d3.select(".piecharts");
  var svg = parent.append("svg").attr("width", boxSize).attr("height", boxSize);
  var defs = svg.append("defs");
  var g = svg
    .append("g")
    .attr("transform", "translate(" + boxSize / 2 + "," + boxSize / 2 + ")");
  var meter = g.append("g").attr("class", "progress-meter");

  // create background of pie chart
  meter
    .append("path")
    .attr("class", `${name}-background`)
    .attr("fill", "#ccc")
    .attr("fill-opacity", 0.5)
    .attr("d", arc.endAngle(twoPi));

  // create foreground of pie chart
  var foreground = meter
    .append("path")
    .attr("class", `${name}-foreground`)
    .attr("fill", color)
    .attr("fill-opacity", 1)
    .attr("stroke", color)
    .attr("stroke-width", 5)
    .attr("stroke-opacity", 1)
    .attr("filter", "url(#blur)");

  // create foreground limiter of pie chart
  var front = meter
    .append("path")
    .attr("class", `${name}-front`)
    .attr("fill", color)
    .attr("fill-opacity", 1);

  // create center text of pie chart
  meter
    .append("text")
    .text(text)
    .attr("fill", "#fff")
    .attr("text-anchor", "middle")
    .attr("dy", "0em");

  // create percentage center text of pie chart
  var numberText = meter
    .append("text")
    .attr("class", `${name}-text`)
    .attr("fill", "#fff")
    .attr("text-anchor", "middle")
    .attr("dy", "1.5em");
};

// update function which assigns a new value to a pie chart
function UPDATEPIE(name, progress) {
  console.log(name);
  // only update graphic if progress is positive
  if (progress > 0) {
    d3.select(`.${name}-foreground`).attr("d", arc.endAngle(twoPi * progress));
    d3.select(`.${name}-front`).attr("d", arc.endAngle(twoPi * progress));
    d3.select(`.${name}-text`).text(formatPercent(progress));
  } else {
    d3.select(`.${name}-foreground`).attr("d", arc.endAngle(0));
    d3.select(`.${name}-front`).attr("d", arc.endAngle(0));
    d3.select(`.${name}-text`).text(formatPercent(progress));
  }
}

// create pie charts
CREATEPIE("worldshare", "World Share", colors.pink);
CREATEPIE("urbanpops", "Urban Population", colors.blue);
CREATEPIE("yearly", "Yearly Growth", colors.pink);

// give initial values
UPDATEPIE("worldshare", 0.1847);
UPDATEPIE("urbanpops", 0.61);
UPDATEPIE("yearly", 0.0039);
