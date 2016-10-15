window.data = [
  {"Day": "Day 1", "A": 0.1, "B": 0.8, "C": 0.3, "Weight": 150, "Calories_In": 1000, "Calories_Out": 800},
  {"Day": "Day 2", "A": 0.9, "B": 0.5, "C": 0.5, "Weight": 180, "Calories_In": 1500, "Calories_Out": 900},
  {"Day": "Day 3", "A": 0.3, "B": 0.6, "C": 0.8, "Weight": 160, "Calories_In": 1250, "Calories_Out": 1000}
];

window.app = {
  addData: function(obj) {
    d3.select('table').selectAll('.data')
      .data(data)
      .enter()
      .append('tr')
      .attr('class', 'data')
      .each(function(d) {
        d3.select(this).append('td')
            .text(d.Day);
        d3.select(this).append('td')
            .text(d.A);
        d3.select(this).append('td')
            .text(d.B);
        d3.select(this).append('td')
            .text(d.C);
        d3.select(this).append('td')
            .text(d.Weight);
        d3.select(this).append('td')
            .text(d.Calories_In);
        d3.select(this).append('td')
            .text(d.Calories_Out);
      });
      app.addInputs();
  },
  addInputs: function() {
    d3.selectAll('.formInput').remove();
    d3.selectAll('table')
      .append('tr')
      .selectAll('.formInput')
      .data(Object.keys(data[0]))
      .enter()
      .append('td')
      .attr('class', 'formInput')
      .append('input')
      .attr('type', 'text')
      .attr('placeholder', function(d) {
        switch(d){
          case ('Day'): 
            return 'Day ' + (data.length + 1);
          default: 
            return 0;
        }
      });
  },
  init: function() {
    app.addData();
    d3.select('.dataSet button ').on('click', function(e) {
        // Next Steps: Add form validation here.
        var newData = d3.selectAll('.formInput input[type="text"]')[0].map(function(el) {
          return el.value;
        });
        var newDatum = {};
        newDatum.Day = newData[0] || 'Day ' + (data.length + 1);
        newDatum.A = newData[1] || 0;
        newDatum.B = newData[2] || 0;
        newDatum.C = newData[3] || 0;
        newDatum.Weight = newData[4] || 80;
        newDatum.Calories_In = newData[5] || 500;
        newDatum.Calories_Out = newData[6] || 500;
        data.push(newDatum)
        app.addData();
        // Clear Inputs
        d3.selectAll('.formInput')[0].forEach(function(el){
          el.value = '';
        });
        app.createLineChart();
        app.createAreaChart();
    });

    app.createLineChart();
    app.createAreaChart();
  }
}