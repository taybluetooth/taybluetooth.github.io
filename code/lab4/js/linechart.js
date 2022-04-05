// declare constant values
const WIDTH = 500;
const HEIGHT = 400;
const MARGIN = {
  top: 20,
  right: 30,
  bottom: 30,
  left: 40,
};

// set the ranges
var x = d3.scaleTime().range([0, WIDTH]);
var y = d3.scaleLinear().range([HEIGHT, 0]);
var line, line2;

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin

var svg = d3
  .select(".linechart")
  .append("svg")
  .attr("width", WIDTH + MARGIN.left + MARGIN.right)
  .attr("height", HEIGHT + MARGIN.top + MARGIN.bottom)
  .append("g")
  .attr("transform", "translate(" + MARGIN.left + "," + MARGIN.top + ")");

var cases = [];

const CREATELINECHART = (country, arr, svg) => {
  d3.csv(
    "https://raw.githubusercontent.com/taybluetooth/taybluetooth.github.io/main/code/data/population_total_long.csv"
  ).then((value) => {
    // load csv values into a preprocessing array
    for (var i = 0; i < value.length; i++) {
      if (value[i].country === country) {
        arr.push(value[i]);
      }
    }

    // format the data
    arr.forEach(function (d) {
      d.year = new Date(d.year);
      d.count = +d.count;
    });

    arr.sort(function (a, b) {
      // turn strings into dates
      return new Date(b.year) - new Date(a.year);
    });

    // cale the range of the data
    x.domain(
      d3.extent(arr, function (d) {
        return d.year;
      })
    ).range([0, WIDTH]);
    y.domain([
      0,
      d3.max(arr, function (d) {
        return d.count;
      }),
    ]).range([HEIGHT - MARGIN.bottom, MARGIN.top]);

    // define the value line
    var valueLine = d3
      .line()
      .x(function (d) {
        return x(d.year);
      })
      .y(function (d) {
        return y(d.count);
      });

    // add the case line path.
    line = svg
      .append("g")
      .attr("clip-path", "url(#clip)")
      .append("path")
      .data([arr])
      .attr("class", "line")
      .attr("d", valueLine)
      .attr("class", "lineBlue");

    // add the x axis
    svg
      .append("g")
      .attr("transform", `translate(0,${HEIGHT - MARGIN.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")).ticks(12))
      .attr("id", "xAxis")
      .attr("class", "axisWhite")
      .call((g) => g.selectAll(".tick text"));

    // add the y axis
    svg
      .append("g")
      .call(d3.axisRight(y).tickSize(WIDTH))
      .attr("id", "yAxis")
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick:not(:first-of-type) line")
          .attr("stroke-opacity", 0.5)
          .attr("stroke-dasharray", "2,2")
      )
      .call((g) =>
        g.selectAll(".tick text").attr("x", 4).attr("color", "white")
      );
  });
};

const UPDATELINECHART = (selectedGroup, arr, svg) => {
    d3.csv(
        "https://raw.githubusercontent.com/taybluetooth/taybluetooth.github.io/main/code/data/population_total_long.csv"
      ).then((value) => {

      arr = [];

      for (var i = 0; i < value.length; i++) {
        if (value[i].country === selectedGroup) {
          arr.push(value[i]);
        }
      }

      if (arr.length == 0) {
        arr.push({ year: new Date(), count: 0 });
      }

      arr.forEach(function (d) {
        d.year = new Date(d.year);
        d.count = +d.count;
      });

      arr.sort(function (a, b) {
        // turn strings into dates
        return new Date(b.year) - new Date(a.year);
      });

      // calc the range of the data
      x.domain(
        d3.extent(arr, function (d) {
          return d.year;
        })
      ).range([0, WIDTH]);
      y.domain([
        0,
        d3.max(arr, function (d) {
          return d.count;
        }),
      ]).range([HEIGHT - MARGIN.bottom, MARGIN.top]);

      svg
        .selectAll("#xAxis")
        .transition()
        .duration(1000)
        .ease(d3.easeCubicInOut)
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")).ticks())
        .attr("class", "axisWhite")
        .call((g) => g.selectAll(".tick text"));

      svg
        .selectAll("#yAxis")
        .transition()
        .duration(1000)
        .ease(d3.easeCubicInOut)
        .call(d3.axisRight(y).tickSize(WIDTH))
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .selectAll(".tick:not(:first-of-type) line")
            .attr("stroke-opacity", 0.5)
            .attr("stroke-dasharray", "2,2")
        )
        .call((g) =>
          g.selectAll(".tick text").attr("x", 4).attr("color", "white")
        );

      // Give these new data to update line
      svg
        .select("path")
        .data([arr])
        .transition()
        .duration(1000)
        .ease(d3.easeCubicInOut)
        .attr(
          "d",
          d3
            .line()
            .x(function (d) {
              return x(d.year);
            })
            .y(function (d) {
              return y(d.count);
            })
        )
        .attr("stroke", "blue");
    });
  }

CREATELINECHART("Afghanistan", cases, svg);
