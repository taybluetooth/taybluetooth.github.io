arr = []

// callback function when selecting country
function selectCountry(country) {
  d3.select(".selected").classed("selected", false);
  d3.select(`[name=${country.replace(/\s/g, "")}]`).classed("selected", true);
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].country === country) {
      updateProgress(parseFloat(arr[i].worldshare.replace('%','')/100))
      (function loops() {
        var progress = parseFloat(arr[i].worldshare.replace('%','')/100)
        updateProgress(progress)
      
        if (count > 0) {
          count--;
          progress += step;
          setTimeout(loops, 10);
        }
      })();
    }
  }
}

// declare map constants
const mapWidth = 600;
const mapHeight = 500;
const map = d3
  .select(".world-map")
  .append("svg")
  .attr("class", "white")
  .attr("width", mapWidth)
  .attr("height", mapHeight);
const legendSvg = d3
  .select(".world-map")
  .append("svg")
  .attr("class", "white")
  .attr("width", 300)
  .attr("height", 400); // //track where user clicked down
const projection = d3
  .geoMercator()
  .scale(100)
  .translate([mapWidth / 2, mapHeight / 1.8]);
const path = d3.geoPath(projection);
const mapG = map.append("g");

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
        return d3.schemeBlues[6][Math.floor(Math.random() * (3 + 1) + 1)];
      })
      .style("stroke", "black")
      .style("stroke-width", "0.1")
      .attr("d", path);
  });

  d3.json(
    "https://raw.githubusercontent.com/taybluetooth/taybluetooth.github.io/main/code/data/coordinates.json"
  ).then((data) => {
    for (var i = 0; i < data.length; i++) {
      arr.push(data[i]);
    }

    var scaleCircle = d3
      .scaleSqrt()
      .domain(
        d3.extent(data, function (d) {
          return parseInt(d.population);
        })
      )
      .range([2, 20]);

    var scaleColor = d3
      .scaleQuantile()
      .domain(
        d3.extent(data, function (d) {
          return parseInt(d.population);
        })
      )
      .range(["blue", "purple", "orange", "red", "darkred"]);

    var legend = d3
      .legendColor()
      .scale(scaleColor)
      .labelFormat(d3.format(".2s"))
      .shape("circle")
      .title("Population Count");

    legendSvg.append("g").attr("transform", "translate(50,150)").call(legend);

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
          return scaleCircle(d.population);
        })
        .on("click", function (d, i) {
          selectCountry(i.country);
          console.log(i.population);
        })
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
    mapG.selectAll("path").attr("transform", event.transform);
    mapG.selectAll("circle").attr("transform", event.transform);
  });

map.call(zoom);

createMap();
