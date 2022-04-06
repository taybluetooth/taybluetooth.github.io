/*
Author: Callum Taylor
Filename: worldmap.js
License: MIT Open Source License
*/

// declare map constants
const MAPWIDTH = 600;
const MAPHEIGHT = 500;

// initialise map svg
const MAP = d3
  .select(".world-map")
  .append("svg")
  .attr("class", "bg-gray-800")
  .attr("width", MAPWIDTH)
  .attr("height", MAPHEIGHT);

// initialise world svg
const LEGENDSVG = d3
  .select(".world-map")
  .append("svg")
  .attr("class", "bg-gray-800")
  .attr("width", 300)
  .attr("height", 400);

// declare mercator projection for map
const PROJECTION = d3
  .geoMercator()
  .scale(100)
  .translate([MAPWIDTH / 2, MAPHEIGHT / 1.8]);

// set geometry path to projection
const PATH = d3.geoPath(PROJECTION);

// declare map grouping
const MAPG = MAP.append("g");

// global temp storage
var arr = [];

// callback function when selecting country
function selectCountry(country) {
  for (var i = 0; i < arr.length; i++) {
    // if country matches any in storage update components
    if (arr[i].country === country) {
      UPDATEPIE(
        "worldshare",
        parseFloat(arr[i].worldshare.replace("%", "") / 100)
      );
      UPDATEPIE(
        "urbanpops",
        parseFloat(arr[i].urbanPopPercentage.replace("%", "") / 100)
      );
      UPDATEPIE("yearly", parseFloat(arr[i].yearly.replace("%", "") / 100));
      UPDATELINECHART(country, pops, svg);
      UPDATEINDICATOR(country, pops);
    }
  }
  // add selected class to country on map
  d3.select(".selected").classed("selected", false);
  d3.select(`[name=${country.replace(/\s/g, "")}]`).classed("selected", true);
}

// create world map using topojson data
function createMap() {
  // read json file containing country dimensions
  d3.json(
    "https://raw.githubusercontent.com/taybluetooth/taybluetooth.github.io/main/code/data/countries.json"
  ).then((data) => {
    // store countries as a feature
    const countries = topojson.feature(data, data.objects.countries);
    // declare an initially selected country
    MAPG.selectAll("PATH")
      .data(countries.features)
      .enter()
      .append("PATH")
      .attr("class", function (d) {
        return d.properties.name == "China"
          ? `selected ${d.properties.name.replace(/\s/g, "")}`
          : d.properties.name.replace(/\s/g, "");
      })
      // if clicked fire callback method
      .on("click", function (d, i) {
        selectCountry(i.properties.name);
      })
      // remove whitespace from country name
      .attr("name", function (d) {
        return d.properties.name.replace(/\s/g, "");
      })
      .attr("id", function (d) {
        return "country" + d.id;
      })
      .style("fill", function (d) {
        return d3.schemeBlues[6][Math.floor(Math.random() * (3 + 1) + 1)];
      })
      .style("stroke", "black")
      .style("stroke-width", "0.1")
      .attr("d", PATH);
  });

  // read country coordinates for circle mapping
  d3.json(
    "https://raw.githubusercontent.com/taybluetooth/taybluetooth.github.io/main/code/data/coordinates.json"
  ).then((data) => {
    for (var i = 0; i < data.length; i++) {
      arr.push(data[i]);
    }

    // set circle scale to be managed by population
    var scaleCircle = d3
      .scaleSqrt()
      .domain(
        d3.extent(data, function (d) {
          return parseInt(d.population);
        })
      )
      .range([2, 20]);

    // set circle colour to be a quantile scale by population
    var scaleColor = d3
      .scaleQuantile()
      .domain(
        d3.extent(data, function (d) {
          return parseInt(d.population);
        })
      )
      .range(["blue", "purple", "orange", "red", "darkred"]);

    // create svg legend for map
    var legend = d3
      .legendColor()
      .scale(scaleColor)
      .labelFormat(d3.format(".2s"))
      .shape("circle")
      .title("Population Count");

    // append legend to map
    LEGENDSVG.append("g").attr("transform", "translate(50,150)").call(legend);

    // wait a second for circles to be added so no overlapping occurs
    setTimeout(function () {
      // create circle elements
      var circle = MAPG.selectAll(".mark")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", function (d) {
          return d.country + "-circle";
        })
        // read lat long data and interpolate for projection
        .attr("cx", function (d) {
          return PROJECTION([d.longitude, d.latitude])[0];
        })
        .attr("cy", function (d) {
          return PROJECTION([d.longitude, d.latitude])[1];
        })
        // scale circle
        .attr("r", function (d) {
          // find better way to scale
          return scaleCircle(d.population);
        })
        // if clicked fire callback function
        .on("click", function (d, i) {
          selectCountry(i.country);
          console.log(i.population);
        })
        // scale color using helper method
        .style("fill", function (d) {
          return scaleColor(d.population);
        })
        .style("fill-opacity", ".50")
        .attr("z-index", "9999 !important");
    }, 500);
  });
}

// handle zoom and panning
var zoom = d3
  .zoom()
  .scaleExtent([1, 10])
  .on("zoom", function (event) {
    MAPG.selectAll("PATH").attr("transform", event.transform);
    MAPG.selectAll("circle").attr("transform", event.transform);
  });

// bind zoom function to map
MAP.call(zoom);

// create map
createMap();
