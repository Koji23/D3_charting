app.params = {
  w: 450,
  h: 450,
  top: 10, 
  right: 10, 
  bottom: 30, 
  left: 30,
};
app.createLineChart = function() {
  
  // Reset

  d3.select('.lineChart div').remove();
  
  // SVG

  var svg = d3
    .select('#lineChartArea')
    .append('svg')
    .attr('class', 'lineChart')
    .attr('width', app.params.w)
    .attr('height', app.params.h);
  
  //Scales

  var xScale = d3.scale.linear()
    .domain([data.length + 1, 0])
    .range([app.params.w - app.params.left - app.params.right, 0]);

  var yScale = d3.scale.linear()
    .domain([0, 1])
    .range([app.params.h - app.params.bottom - app.params.top, 0]);
  
  // Axi

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .tickValues(_.range(data.length + 1).map(function(a, i) {
      return i;
    }))
    .tickFormat(function(d) {
      if(d === 0) return '';
      return data.length > 7 ? d : 'Day ' + d;
    })
    .outerTickSize(0)
    .innerTickSize(9)
    .tickPadding(7)
    .orient('bottom');

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .ticks(10)
    .innerTickSize(app.params.w)
    .outerTickSize(0)
    .orient('right');

  // Dotted Line

  var makeDottedPath = function(letter, svg) {
    var line = d3.svg.line()
      .x(function(d, i){
        return xScale(i + 1);
      })
      .y(function(d) {
        return yScale(d[letter]);
      });
    var path = svg
      .append('g')
      .append('path')
      .attr('transform', 'translate(30, 10)')
      .datum(data)
      .transition()
      .duration(500)
      .attr('d', line)
      .attr('class', function(d) {
        return 'line_' + letter;
      });
    svg.selectAll('dot_' + letter)
      .data(data)
      .enter()
      .append('circle')
      .attr('transform', 'translate(30, 10)')
      .attr('r', 3.5)
      .attr("cx", function(d, i) { return xScale(i + 1); })
      .attr("cy", function(d) { return yScale(d[letter]); });
    return path;
  };

  //Draw

  makeDottedPath('A', svg, xScale, yScale, data);
  makeDottedPath('B', svg, xScale, yScale, data);
  makeDottedPath('C', svg, xScale, yScale, data);
    
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate('+ app.params.left +', ' + (app.params.h - app.params.bottom) + ')')
    .call(xAxis);

  svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate('+ app.params.left + ', ' + app.params.top + ')')
    .call(yAxis);

  d3.select('.y').selectAll('text')
    .attr('x', -28)
    .attr('class', 'vText');
};