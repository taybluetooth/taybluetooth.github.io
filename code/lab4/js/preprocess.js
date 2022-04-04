// read population data as csv file
const POPDATA = d3.csv(
  "https://raw.githubusercontent.com/taybluetooth/taybluetooth.github.io/main/code/data/population.csv"
);

const LOCATIONDATA = d3.json(
  "https://raw.githubusercontent.com/taybluetooth/taybluetooth.github.io/main/code/data/lat-long.json"
);

// global array for population
var population = [];

const PREPROCESS = () => {
  POPDATA.then((value) => {
    // load csv values into a preprocessing array.
    for (var i = 0; i < value.length; i++) {
      population.push(value[i]);
    }
  });

  // use location data and merge into singular entity.
  LOCATIONDATA.then((data) => {
    data.forEach(function (d) {
      population.forEach(function (element) {
        element.latitude = d.latitude;
        element.longitude = d.longitude;
      });
    });
  });
};

function getPopulationData() {
  PREPROCESS();
  return population;
}
