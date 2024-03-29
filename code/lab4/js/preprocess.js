/*
Author: Callum Taylor
Filename: preprocess.js
License: MIT Open Source License
*/


// read population data as csv file
const POPDATA = d3.csv(
  "https://raw.githubusercontent.com/taybluetooth/taybluetooth.github.io/main/code/data/population.csv"
);

// read location data as json file
const LOCATIONDATA = d3.json(
  "https://raw.githubusercontent.com/taybluetooth/taybluetooth.github.io/main/code/data/lat-long.json"
);

// global array for population
var population = [];

// helper method used to pre load data and return as an array
const PREPROCESS = () => {
  POPDATA.then((value) => {
    // load csv values into a preprocessing array.
    for (var i = 0; i < value.length; i++) {
      population.push(value[i]);
    }
  });

  temp = [];
  // use location data and merge into singular entity.
  LOCATIONDATA.then((data) => {
    data.forEach(function (d) {
      let obj = population.find((o) => o.country === d.country);
      if(obj) {
        obj.latitude = d.latitude;
      obj.longitude = d.longitude;
      temp.push(obj);
      console.log(obj)
      }
    });
  });
  return temp;
};
