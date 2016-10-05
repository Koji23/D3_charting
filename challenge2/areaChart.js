app.params = {
  w: 450,
  h: 450,
  top: 10, 
  right: 10, 
  bottom: 30, 
  left: 30,
};
app.createAreaChart = function() {
  
  // Reset

  d3.select('.areaChart').remove();
  
  // SVG

  var svg = d3
    .select('#areaChartArea div')
    .append('svg')
    .attr('class', 'areaChart')
    .attr('width', app.params.w)
    .attr('height', app.params.h);
  
  //Scales

  var xScale = d3.scale.linear()
    .domain([data.length + 1, 0])
    .range([app.params.w - app.params.left - app.params.right, 0]);

  var y1Scale = d3.scale.linear()
    .domain([500, 2100])
    .range([app.params.h - app.params.bottom - app.params.top, 0]);

  var y2Scale = d3.scale.linear()
    .domain([80, 205])
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

  var y1Axis = d3.svg.axis()
    .scale(y1Scale)
    .ticks(10)
    .innerTickSize(10)
    .outerTickSize(0)
    .orient('right');

  var y2Axis = d3.svg.axis()
    .scale(y2Scale)
    .tickValues(['', 90, 100, 110, 120, 130, 140, 150, 160, 170,180, 190, 200])
    .innerTickSize(10)
    .outerTickSize(0)
    .orient('left');

  // Dotted Line

  var makeDottedPath = function(key, svg, xScale, yScale, data) {
    var line = d3.svg.line()
      .x(function(d, i){
        return xScale(i + 1);
      })
      .y(function(d) {
        // console.log(d[key]);
        return yScale(d[key]);
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
        return 'line_' + key;
      });
    svg.selectAll('dot_' + key)
      .data(data)
      .enter()
      .append('circle')
      .attr('class', key)
      .attr('transform', 'translate(30, 10)')
      .attr('r', 3.5)
      .attr("cx", function(d, i) { return xScale(i + 1); })
      .attr("cy", function(d) { return yScale(d[key]); });
    return path;
  };

  var makeAreaPath = function(key, svg, xScale, yScale, data) {
    var area = d3.svg.area()
      .x(function(d, i){
        return xScale(i + 1);
      })
      .y0(function(d) {
        return 410;
      })
      .y1(function(d) {
        // console.log(d[key]);
        return yScale(d[key]);
      });
    var path = svg
      .append('g')
      .append('path')
      .attr('transform', 'translate(30, 10)')
      .datum(data)
      .transition()
      .duration(500)
      .attr('d', area)
      .attr('class', function(d) {
        return 'area_' + key;
      });
    return path;
  };

  //Draw

  makeAreaPath('Weight', svg, xScale, y2Scale, data);
  makeDottedPath('Weight', svg, xScale, y2Scale, data);
  makeDottedPath('Calories_In', svg, xScale, y1Scale, data);
  makeDottedPath('Calories_Out', svg, xScale, y1Scale, data);
    
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate('+ app.params.left +', ' + (app.params.h - app.params.bottom) + ')')
    .call(xAxis);

  svg.append('g')
    .attr('class', 'y1 axis')
    .attr('transform', 'translate('+ app.params.left + ', ' + app.params.top + ')')
    .call(y1Axis);

  d3.select('.y').selectAll('text')
    .attr('x', -28)
    .attr('class', 'vText');

  svg.append('g')
    .attr('class', 'y2 axis')
    .attr('transform', 'translate(' + (app.params.w - app.params.right) + ', ' + app.params.top + ')')
    .call(y2Axis);

  svg.select('.y1')
    .append('text')
    .text('Calories')
    .attr('transform', 'translate(15, 2)');
  svg.select('.y2')
    .append('text')
    .text('lbs')
    .attr('transform', 'translate(-35, 2)');
};