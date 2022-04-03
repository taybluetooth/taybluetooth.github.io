// callback function when selecting country
function selectCountry(country) {
  d3.select(".selected").classed("selected", false);
  d3.select(`[name=${country.replace(/\s/g, "")}]`).classed("selected", true);
  d3.select("select").property("value", country);
}

// declare map constants
const mapWidth = 600;
const mapHeight = 498;

const map = d3
  .select(".world-map")
  .append("svg")
  .attr("class", "white")
  .attr("width", mapWidth)
  .attr("height", mapHeight); //track where user clicked down

const projection = d3
  .geoMercator()
  .scale(100)
  .translate([mapWidth / 2, mapHeight / 1.4]);

const path = d3.geoPath(projection);

const mapG = map.append("g");

const colorScale = d3.scaleOrdinal().range(["#FF0000", "#009933" , "#0000FF"]);

function createMap() {
  d3.json(
    "https://raw.githubusercontent.com/taybluetooth/f21dv-lab-3/main/data/countries.json"
  ).then((data) => {
    const countries = topojson.feature(data, data.objects.countries);
    mapG
      .selectAll("path")
      .data(countries.features)
      .enter()
      .append("path")
      .attr("class", function (d) {
        return d.properties.name == "Afghanistan"
          ? `selected ${d.properties.name.replace(/\s/g, "")}`
          : d.properties.name.replace(/\s/g, "");
      })
      .on("click", function (d, i) {
        selectCountry(i.properties.name);
      })
      .attr("name", function (d) {
        return d.properties.name.replace(/\s/g, "");
      })
      .attr("id", function (d) {
        return "country" + d.id;
      })
      .style("fill", function (d) {
        return d3.schemeBlues[8][Math.floor(Math.random() * (3 - 1 + 1) + 1)];
      })
      .style("stroke", "black")
      .style("stroke-width", "0.1")
      .attr("d", path);
  });

  d3.json(
    "https://raw.githubusercontent.com/taybluetooth/f21dv-lab-3/main/data/lat-long.json"
  ).then((data) => {
    var scaleCircle = d3
      .scaleSqrt()
      .domain(
        d3.extent(data, function (d) {
          return d.cases;
        })
      )
      .range([0, 0.5]);

    var scaleColor = d3
      .scaleQuantize()
      .domain([0, 10000000])
      .range(["#ecca00", "#ec9b00", "#ec5300", "#ec2400", "#ec0000"]);

    setTimeout(function () {
      var circle = mapG
        .selectAll(".mark")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", function (d) {
          return d.country + "-circle";
        })
        .attr("cx", function (d) {
          return projection([d.longitude, d.latitude])[0];
        })
        .attr("cy", function (d) {
          return projection([d.longitude, d.latitude])[1];
        })
        .attr("r", function (d) {
          // find better way to scale
          return scaleCircle(d.cases);
        })
        .on("click", function (d, i) {
          selectCountry(i.country);
        })
        .style("fill", function (d) {
          return scaleColor(d.cases);
        })
        .style("fill-opacity", ".30")
        .attr("z-index", "9999 !important");
    }, 500);
  });
}

// handle zoom and panning
var zoom = d3
  .zoom()
  .scaleExtent([1, 10])
  .on("zoom", function (event) {
    mapG.selectAll("path").attr("transform", event.transform);
    mapG.selectAll("circle").attr("transform", event.transform);
  });

map.call(zoom);

createMap();
