// read population data as csv file
const POPDATA = d3.csv(
  "https://raw.githubusercontent.com/taybluetooth/taybluetooth.github.io/main/code/data/population.csv"
);

const LOCATIONDATA = d3.csv(
  "https://raw.githubusercontent.com/taybluetooth/taybluetooth.github.io/main/code/data/lat-long.json"
);

var population = [];

const PREPROCESS = () => {
  csv.then((value) => {
    // load csv values into a preprocessing array
    for (var i = 0; i < value.length; i++) {
      population.push(value[i]);
    }
  });

  csv.then((data) => {
    var holder = [];
    data.forEach(function (d) {
      holder.push({ country: d.country, population: d.population });
    });
  
    var temp = {};
  
    holder.forEach(function (d) {
      if (temp.hasOwnProperty(d.country)) {
        temp[d.country] = temp[d.country] + d.population;
      } else {
        temp[d.country] = d.population;
      }
    });
    for (var prop in temp) {
      let obj = population.find((o, i) => {
        if (o.country === prop) {
          population[i].population = temp[prop];
          return true; // stop searching
        }
      });
    }
    console.log(population);

  });
};

PREPROCESS();