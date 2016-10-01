window.app = {
  w: 400,
  h: 500,
  base: 50,
  tempScale: "F",
  currentMonth: 2,
  thisYearData: [],
  lastYearData: [],
  generateSemiRandomData: function(coin) {
    var years = ["January", "February", "March", "April", "May", "June", "July", "August", "Septemeber", "October", "November", "December"];
    return _.map(years, function(month, index){ 
      return {
        "month": month,
        "temperatures": _.map(_.range(30), function(a, i) {
          return Math.floor(Math.random() * 80 + 80 + ((coin === 0 ? (index % 2  === 0) : !(index % 2  === 0)) ? i : -i));
        })
      }
    });
  },
  convertData: function(tempScale) {
    if(tempScale === "F") {
      _.each(app.thisYearData, function(month) {
        month.temperatures = _.map(month.temperatures, function(temp) {
          return temp * 9 / 5 + 32;
        });
      });
    } else {
      _.each(app.thisYearData, function(month) {
        month.temperatures = _.map(month.temperatures, function(temp) {
          return (temp - 32) * 5 / 9;
        });
      });
    }
  },
  updateArea: function(set, classname, month, path, xScale, yScale) {
    var data = set[month].temperatures;
    var label = set[month].month;

    var area = d3.svg.area()
      .interpolate('bundle')
      .x(function(d, i) {
        return xScale(i);
      })
      .y0(function(d) {
        return yScale(app.base);
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

  updateHeader: function(month) {
    // change header
  },
  generateXScale: function() {
    return d3.scale.linear()
    .domain([0, 30])
    .range([35, app.w - 10]);
  },
  generateYScale: function(tempScale) {
    var max = tempScale === "F" ? 200 : 93;
    return d3.scale.linear()
    .domain([max, app.base])
    .range([max, app.h - app.base]);
  },
  drawXAxis: function(svg, xScale) {
    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient('bottom')
      .tickValues([1, 8, 15, 22, 29])
      .tickFormat(function(d, i) {
        return String.fromCharCode(97 + i);
      })
      .outerTickSize(0);

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0, ' + (app.h - app.base) + ')')
      .call(xAxis);
  },
  drawYAxis: function(svg, yScale, tempScale) {
    var fScale = [50, 75, 100, 125, 150, 175, 200];
    var cScale = fScale.map(function(num) {
      return Math.round((num - 32) * 5 / 9);
    });
    var cScale = [];
    var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient('left')
      .tickValues(tempScale === "F" ? fScale : cScale);

    svg.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(35, 0)')
      .call(yAxis);
  },
  createChart: function() {
    var header = d3
      .select('#challengeArea h1');

    var svg = d3
      .select('#challengeArea')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%');

    var path1 = svg
      .append('g')
      .append('path');

    var path2 = svg
      .append('g')
      .append('path');

    // SVG Gradients

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
    // Scales 

    var xScale = app.generateXScale();
    var yScale = app.generateYScale(app.tempScale)

    // Axi

    app.drawXAxis(svg, xScale);
    app.drawYAxis(svg, yScale, app.tempScale);

    // Area

    app.updateArea(app.lastYearData, 'lastYearData', app.currentMonth, path1, xScale, yScale);
    app.updateArea(app.thisYearData, 'thisYearData', app.currentMonth, path2, xScale, yScale);

    // Controllers

    d3.select('.backwards').on('click', function() {
      app.currentMonth = app.currentMonth === 0 ? 11 : app.currentMonth - 1;
      app.updateArea(app.lastYearData, 'lastYearData', app.currentMonth, path1, xScale, yScale);
    app.updateArea(app.thisYearData, 'thisYearData', app.currentMonth, path2, xScale, yScale);
    });
    d3.select('.forwards').on('click', function() {
      app.currentMonth = app.currentMonth === 11 ? 0 : app.currentMonth + 1;
      app.updateArea(app.lastYearData, 'lastYearData', app.currentMonth, path1, xScale, yScale);
      app.updateArea(app.thisYearData, 'thisYearData', app.currentMonth, path2, xScale, yScale);
    });
    d3.select('.toggleTempScale').on('click', function() {
      app.convertData(app.tempScale);
      if(app.tempScale === "F") {
        this.innerHTML = '°C to °F';
        app.tempScale = 'C';
      } else {
        this.innerHTML = '°F to °C';
        app.tempScale = "F";
      }
      setTimeout(function() {
        app.createChart();
      }, 100);
      d3.select('svg').remove();
    });
  },
  init: function() {
    app.thisYearData = app.generateSemiRandomData(0);
    app.lastYearData = app.generateSemiRandomData(1);

    app.createChart();
  }
};

app.init();










