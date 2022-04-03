// read covid data as csv file
const csv = d3.csv(
    "https://raw.githubusercontent.com/taybluetooth/taybluetooth.github.io/main/code/data/population.csv"
);

var arr = []

const PREPROCESS = () => {
    // load csv values into a preprocessing array
    for (var i = 0; i < value.length; i++) {
        if (value[i].location === country) {
          arr.push(value[i]);
        }
      }

      // format the data
      arr.forEach(function (d) {
        d.country = d.country
        //d.new_cases = +d.new_cases;
      });

      /*arr.sort(function (a, b) {
        // turn strings into dates
        return new Date(b.date) - new Date(a.date);
      });*/
}