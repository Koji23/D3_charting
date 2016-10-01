var thisYearData = [
  {
    "month": "January",
    "weeks": [102, 80, 140, 150, 155]
  },
];

var lastYearData = [
  {
    "month": "January",
    "weeks": [140, 120, 130, 85, 115]
  },
];

var w = 500;
var h = 400;
var base = 50;
var svg = d3
  .select('#challengeArea')
  .append('svg')
  .attr('width', '100%')
  .attr('height', '100%');

var path1 = d3
  .select('#challengeArea svg')
  .append('g')
  .append('path');

var path2 = d3
  .select('#challengeArea svg')
  .append('g')
  .append('path');
  
// Scales

var xScale = d3.scale.linear()
  .domain([0, 4])
  .range([35, w - 10]);

var yScale = d3.scale.linear()
  .domain([200, base])
  .range([20, h - base]);

// Axi

var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient('bottom')
  .tickValues([0, 1, 2, 3 ,4])
  .tickFormat(function(d) {
    return String.fromCharCode(97 + d);
  });

svg.append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(0, ' + (h - base) + ')')
  .call(xAxis);

var yAxis = d3.svg.axis()
  .scale(yScale)
  .orient('left')
  .tickValues([50, 75, 100, 125, 150, 175, 200]);

svg.append('g')
  .attr('class', 'y axis')
  .attr('transform', 'translate(35, 0)')
  .call(yAxis);

// Line Chart

function createChart (set, classname, month, path) {
  var data = set[month].weeks;
  var label = set[month].month;

  var area = d3.svg.area()
    // .interpolate('bundle')
    .x(function(d, i) {
      return xScale(i);
    })
    .y0(function(d) {
      return yScale(base);
    })
    .y1(function(d) {
      return yScale(d);
    });
    console.log(xScale, yScale);
  path.datum(data)
    .transition()
    .duration(300)
    .attr('d', area)
    .attr('class', classname);
}

createChart(thisYearData, 'thisYearData', 0, path1);
createChart(lastYearData, 'lastYearData', 0, path2);










