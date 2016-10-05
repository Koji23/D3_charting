window.app = {
  w: 400,
  h: 400,
  fBase: 32,
  cBase: 0,
  margin: {top: 20 , right: 10, bottom: 20, left: 35},
  tempScale: "F",
  currentMonth: 2,
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "Septemeber", "October", "November", "December"],
  xTicks: [1, 7, 14, 21, 28],
  yTicks: [50, 75, 100, 125, 150, 175, 200],
  thisYearData: [],
  lastYearData: [],
  generateSemiRandomData: function(coin) {
    return _.map(app.months, function(month, index){ 
      var dayValues = _.map(_.range(30), function(a, i) {
        // mostly random but with a tendency to trend upwards in one year and downdwards in the other for more realistic visuals
        return Math.floor(80 + Math.random() * 50 + ((coin === 0 ? (index % 2  === 0) : !(index % 2  === 0)) ? i : -i)); 
      });
      return {
        "month": month,
        "daysInFareignheit": dayValues,
        "daysInCelsius": app.convertToCelsius(dayValues),
      };
    });
  },
  convertToCelsius: function(array) {
    return _.map(array, function(temp) {
      return Math.round((temp - 32) * 5 / 9);
    });
  },
  generateXScale: function() {
    return d3.scale.linear()
    .domain([0, 30]) // 0 - 30 days
    .range([app.margin.left, app.w - app.margin.right]);
  },
  drawXAxis: function(svg, xScale) {
    var base = app.tempScale === "F" ? app.fBase : app.cBase;
    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient('top')
      .tickValues(app.xTicks) // correlating to days of the month
      .tickSize(app.h - 50)
      .tickFormat(function(d, i) {
        return String.fromCharCode(65 + i); // a b c d e
      })
      .outerTickSize(0);

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0, ' + (app.h - app.margin.bottom) + ')')
      .call(xAxis);

    d3.select('.x').selectAll('text')
      .attr('y', 1)
      .attr('dy', -6)
      .attr('class', 'vText');

    d3.select('.x').selectAll('line')
      .attr('class', 'vTick');
  },
  generateYScale: function() {
    var max = app.tempScale === "F" ? 200 : 93;
    var min = app.tempScale === "F" ? app.fBase : app.cBase;
    return d3.scale.linear()
    .domain([max, min])
    .range([app.margin.top, app.h - app.margin.bottom]);
  },
  drawYAxis: function(svg, yScale) {
    var fScale = app.yTicks;  // predetermined range from 50 - 200
    var cScale = app.convertToCelsius(fScale); 
    var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient('right')
      .tickValues(app.tempScale === "F" ? fScale : cScale)
      .tickSize(0);

    svg.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate('+ app.margin.left + ', 0)')
      .call(yAxis);

  },
  updateArea: function(set, classname, month, path, xScale, yScale, temperatures) {
    var data = app.tempScale === "F" ? set[month].daysInFareignheit : set[month].daysInCelsius;
    var base = app.tempScale === "F" ? app.fBase : app.cBase;
    // var label = set[month].month;

    var area = d3.svg.area()
      .interpolate('bundle')
      .x(function(d, i) {
        return xScale(i);
      })
      .y0(function(d) {
        return yScale(base);
      })
      .y1(function(d) {
        return yScale(d);
      });

    path.datum(data)
      .transition()
      .duration(500)
      .ease('elastic')
      .attr('d', area)
      .attr('class', classname);
  },
  createGradient: function(svg) {
    var defs = svg.append('defs');
    var gradient1 = defs
      .append('linearGradient')
      .attr('id', "MyGradient1")
      .attr('x1', '0')
      .attr('x2', '0')
      .attr('y1', '0')
      .attr('y2', '1');
    var stop1 = gradient1.append('stop')
      .attr('offset', '20%')
      .attr('stop-color', 'rgba(255, 0, 197, 1)');
    var stop2 = gradient1.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'rgba(255, 255, 255, 0.1)');
    var gradient2 = defs
      .append('linearGradient')
      .attr('id', "MyGradient2")
      .attr('x1', '0')
      .attr('x2', '0')
      .attr('y1', '0')
      .attr('y2', '1');
    var stop3 = gradient2.append('stop')
      .attr('offset', '20%')
      .attr('stop-color', 'rgba(30, 0, 255, 1)');
    var stop4 = gradient2.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'rgba(255, 255, 255, 0.1)');
  },
  updateHeader: function(month) {

    d3.select('#challengeArea')
      .select('h1')
      .text(app.months[month] + " 2016");

  },
  createChart: function() {
    var header = d3
      .select('#challengeArea h1');

    var svg = d3
      .select('#challengeArea')
      .append('svg')
      .attr('width', '450')
      .attr('height', '500');


    // SVG Gradients

    app.createGradient(svg);

    // Scales 

    var xScale = app.generateXScale();
    var yScale = app.generateYScale()

    // Axi

    app.drawXAxis(svg, xScale);
    app.drawYAxis(svg, yScale, app.tempScale);

    // Area

    var path1 = svg
      .append('g')
      .append('path');

    var path2 = svg
      .append('g')
      .append('path');

    app.updateArea(app.lastYearData, 'lastYearData', app.currentMonth, path1, xScale, yScale);
    app.updateArea(app.thisYearData, 'thisYearData', app.currentMonth, path2, xScale, yScale);

    // Controllers

    d3.select('.backwards').on('click', function() {
      app.currentMonth = app.currentMonth === 0 ? 11 : app.currentMonth - 1;
      app.updateHeader(app.currentMonth);
      app.updateArea(app.lastYearData, 'lastYearData', app.currentMonth, path1, xScale, yScale);
      app.updateArea(app.thisYearData, 'thisYearData', app.currentMonth, path2, xScale, yScale);
    });
    d3.select('.forwards').on('click', function() {
      app.currentMonth = app.currentMonth === 11 ? 0 : app.currentMonth + 1;
      app.updateHeader(app.currentMonth);
      app.updateArea(app.lastYearData, 'lastYearData', app.currentMonth, path1, xScale, yScale);
      app.updateArea(app.thisYearData, 'thisYearData', app.currentMonth, path2, xScale, yScale);
    });
    d3.select('.toggleTempScale').on('click', function() {
      if(app.tempScale === "F") {
        this.innerHTML = '°C to °F';
        app.tempScale = 'C';
      } else {
        this.innerHTML = '°F to °C';
        app.tempScale = "F";
      }
      d3.select('svg').remove();
      app.createChart();
    });
  },
  init: function() {
    app.thisYearData = app.generateSemiRandomData(0);
    app.lastYearData = app.generateSemiRandomData(1);

    app.createChart();
  }
};

app.init();










