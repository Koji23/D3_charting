var dataset = _.map(_.range(700), function (i) {
  return Math.floor(Math.random() * 10);
});

var margin = {top: 25, right: 5, bottom: 20, left: 40};

var w = 500 - margin.left - margin.right, 
    h = 400 - margin.top - margin.bottom;

var svg = d3.select('#barChartArea').append('svg')
  .attr('width', w + margin.left + margin.right)
  .attr('height', h + margin.top + margin.bottom)
  .append('g') // note that svg variable now points to the 'g' element
  .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

var xScale = d3.scale.ordinal()
  .domain(dataset)
  .rangeBands([0, w], 0.1, 0.3);

var yScale = d3.scale.linear()
  .domain([0, d3.max(dataset) * 1.1])
  .range([h, 0]);

var colorScale = d3.scale.linear()
  // .domain([0, dataset.length])
  .domain([0, d3.max(dataset)])
  .range(['orange', 'purple']);

// var colorScale = d3.scale.quantize()
// // .domain([0, dataset.length])
// .domain([0, d3.max(dataset)])
// .range(['yellow', 'green']);

// var colorScale = d3.scale.quantile()
// .domain([0, 10, dataset.length / 4, dataset.length])
// // .domain([0, 10, dataset.length / 3, d3.max(dataset)])
// .range(['yellow', 'green', 'red']);

svg.selectAll('rect')
  .data(dataset)
  .enter()
  .append('rect')
  .attr('class', 'bar')
  .attr('x', function (d, i) {
    return xScale(d);
  })
  .attr('y', function (d) {
    return h - yScale(d);
  })
  .attr('width', xScale.rangeBand())
  .attr('height', function (d) {
    return yScale(d);
  })
  .attr('fill', function (d, i) {
    // return colorScale(i);          // to color by position pass the the index instead of the data and update scale ^
    return colorScale(d);
  });

// Axis

var yAxis = d3.svg.axis()
  .scale(yScale)
  .orient('left')
  .ticks(10)
  .innerTickSize(6)
  .outerTickSize(12)
  .tickPadding(2);

svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(-5, 0)')
    .call(yAxis);

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom');

svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0, '+ (h + 0) + ')')
    .call(xAxis);
