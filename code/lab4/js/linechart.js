// read covid data as csv file
const csv = d3.csv(
    "https://raw.githubusercontent.com/taybluetooth/taybluetooth.github.io/main/code/data/population.csv"
);

var arr = []

const PREPROCESS = () => {
    csv.then((value) => {
        // load csv values into a preprocessing array
    for (var i = 0; i < value.length; i++) {
        arr.push(value[i]);
      }

    })
      console.log(arr)
}

PREPROCESS();