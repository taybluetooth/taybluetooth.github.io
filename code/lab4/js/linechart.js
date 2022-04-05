// declare global values
const WIDTH = 600;
const HEIGHT = 400;
const MARGIN = {
  top: 20,
  right: 30,
  bottom: 30,
  left: 80,
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

var pops = [];

const csv = d3.csv(
  "https://raw.githubusercontent.com/taybluetooth/taybluetooth.github.io/main/code/data/population_total_long.csv"
);

const MINIWIDTH = 600;
const MINIHEIGHT = 240;

d3.select(".linechart").append("h1").text("Graph Navigator").classed("text-white pl-10", true)

var mini = d3
  .select(".linechart")
  .append("svg")
  .attr("width", MINIWIDTH + MARGIN.left + MARGIN.right)
  .attr("height", MINIHEIGHT + MARGIN.top + MARGIN.bottom)
  .append("g")
  .attr("transform", "translate(" + MARGIN.left + "," + MARGIN.top + ")");

var miniX = d3.scaleTime().range([0, MINIWIDTH]);
var miniY = d3.scaleLinear().range([MINIHEIGHT, 0]);

// CREATE LINE CHART METHOD

const CREATELINECHART = (country, arr, svg) => {
  csv.then((value) => {
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
      // turn strings into years
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
        g.selectAll(".tick text").attr("x", -70).attr("color", "white")
      );
  });
};

// UPDATE LINE CHART METHOD

const UPDATELINECHART = (selectedGroup, arr, svg) => {
  csv.then((value) => {
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
      // turn strings into years
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
        g.selectAll(".tick text").attr("x", -70).attr("color", "white")
      );

    // Give these new data to upyear line
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
};

const CREATEINDICATOR = (country) => {
  csv.then((value) => {
    // load csv values into a preprocessing array
    for (var i = 0; i < value.length; i++) {
      if (value[i].country === country) {
        pops.push(value[i]);
      }
    }

    var brush = d3
      .brushX()
      .extent([
        [0, MARGIN.top],
        [MINIWIDTH, MINIHEIGHT - MARGIN.bottom],
      ])
      .on("end", brushed);

    // format the data
    pops.forEach(function (d) {
      d.year = new Date(d.year);
      d.count = +d.count;
    });

    pops.sort(function (a, b) {
      // turn strings into years
      return new Date(b.year) - new Date(a.year);
    });

    // cale the range of the data
    miniX
      .domain(
        d3.extent(pops, function (d) {
          return d.year;
        })
      )
      .range([0, MINIWIDTH]);
    miniY
      .domain([
        0,
        d3.max(pops, function (d) {
          return d.count;
        }),
      ])
      .range([MINIHEIGHT - MARGIN.bottom, MARGIN.top]);

    // define the value line
    var valueLine = d3
      .line()
      .x(function (d) {
        return miniX(d.year);
      })
      .y(function (d) {
        return miniY(d.count);
      });

    // add the case line path.
    line2 = mini
      .append("g")
      .attr("clip-path", "url(#clip)")
      .append("path")
      .data([pops])
      .attr("class", "line")
      .attr("d", valueLine)
      .attr("class", "lineBlue");

    line2.append("g").attr("class", "brush").call(brush);

    mini.append("g").attr("class", "brush").call(brush);

    function brushed(event) {
      const selection = event.selection;
      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if (!selection) {
        d3.extent(pops, function (d) {
          return d.year;
        });
      } else {
        x.domain([x.invert(selection[0]), x.invert(selection[1])]);
        mini.select(".brush").call(brush.move, null); // This remove the grey brush area as soon as the selection has been done
      }

      // update axis and line position
      svg
        .selectAll("#xAxis")
        .transition()
        .duration(1000)
        .call(d3.axisBottom(x));

      line
        .transition()
        .duration(1000)
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
        );
    }

    // add the x axis
    mini
      .append("g")
      .attr("transform", `translate(0,${MINIHEIGHT - MARGIN.bottom})`)
      .call(d3.axisBottom(miniX).tickFormat(d3.timeFormat("%b %y")).ticks(12))
      .attr("id", "miniXAxis")
      .attr("class", "axisWhite")
      .call((g) => g.selectAll(".tick text"));

    // add the y axis
    mini
      .append("g")
      .call(d3.axisRight(miniY).tickSize(MINIWIDTH))
      .attr("id", "miniYAxis")
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick:not(:first-of-type) line")
          .attr("stroke-opacity", 0.5)
          .attr("stroke-dasharray", "2,2")
      )
      .call((g) =>
        g.selectAll(".tick text").attr("x", -70).attr("color", "white")
      );
  });

  d3.select(".linechart").append("button").text("reset").classed("ml-3 bg-gray-900 text-white p-2 w-20", true).on("click", function(d) {
    x.domain(
      d3.extent(pops, function (d) {
        return d.year;
      })
    );
    d3.select("#xAxis").transition().duration(1000).call(d3.axisBottom(x));
    line.transition()
    .duration(1000).attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.year);
        })
        .y(function (d) {
          return y(d.count);
        })
    );
  });
}

const UPDATEINDICATOR = (country) => {

  csv.then((value) => {
    pops = [];

    for (var i = 0; i < value.length; i++) {
      if (value[i].country === country) {
        pops.push(value[i]);
      }
    }

    if (pops.length == 0) {
      pops.push({ year: new Date(), count: 0 });
    }

    // TODO: Refactor
    // format the data
    pops.forEach(function (d) {
      d.year = new Date(d.year);
      d.count = +d.count;
    });

    pops.sort(function (a, b) {
      // turn strings into years
      return new Date(b.year) - new Date(a.year);
    });

    // calc the range of the data
    miniX
      .domain(
        d3.extent(pops, function (d) {
          return d.year;
        })
      )
      .range([0, MINIWIDTH]);
    miniY
      .domain([
        0,
        d3.max(pops, function (d) {
          return d.count;
        }),
      ])
      .range([MINIHEIGHT - MARGIN.bottom, MARGIN.top]);

    mini
      .selectAll("#miniXAxis")
      .transition()
      .duration(1000)
      .ease(d3.easeCubicInOut)
      .call(d3.axisBottom(miniX).tickFormat(d3.timeFormat("%y")).ticks())
      .attr("class", "axisWhite")
      .call((g) => g.selectAll(".tick text"));

    mini
      .selectAll("#miniYAxis")
      .transition()
      .duration(1000)
      .ease(d3.easeCubicInOut)
      .call(d3.axisRight(miniY).tickSize(MINIWIDTH))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick:not(:first-of-type) line")
          .attr("stroke-opacity", 0.5)
          .attr("stroke-dasharray", "2,2")
      )
      .call((g) =>
        g.selectAll(".tick text").attr("x", -70).attr("color", "white")
      );

    // Give these new data to update line
    line2
      .data([pops])
      .transition()
      .duration(1000)
      .ease(d3.easeCubicInOut)
      .attr(
        "d",
        d3
          .line()
          .x(function (d) {
            return miniX(d.year);
          })
          .y(function (d) {
            return miniY(d.count);
          })
      )
      .attr("stroke", "blue");
  });
}

CREATELINECHART("China", pops, svg);
CREATEINDICATOR("China");
