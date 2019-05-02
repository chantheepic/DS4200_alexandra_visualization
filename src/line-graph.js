var data = [{ name: "cars", values: [] }, { name: "hv", values: [] }, { name: "pab", values: [] }, { name: "carsSubset", values: [] }, { name: "hvSubset", values: [] }, { name: "pabSubset", values: [] }];
var queryReturn;
var width;
var height;
var margin;

dispatch.on("paramConfig.line-graph", function (param) {
  width = param.width;
  height = param.height;
  margin = param.margin;
});

dispatch.on("dataLoaded.line-graph", function (data) {
  queryReturn = data;
  parse();
  parseSubset({ from: null, bound: null });
  draw();
});

function parse() {
  queryReturn.forEach(function (d) {
    var value = { time: d['hour'] + ':' + d['minute'], count: d['Int-Total']-d['MAFN-U-Turn']-d['MAFS-U-Turn']-d['WSE-U-Turn']-d['WSW-U-Turn'] };
    if (d['Type'] == 'CARS') {
      data[0].values.push(value)
    }
    if (d['Type'] == 'HV') {
      data[1].values.push(value)
    }
    if (d['Type'] == 'PAB') {
      data[2].values.push(value)
    }
  });
}

function parseSubset(direction) {
  data[3].values = [];
  data[4].values = [];
  data[5].values = [];
  queryReturn.forEach(function (d) {
    // If only Inbound from is defined
    if (direction.from != null && direction.bound == null) {
      var dir = direction.from;
      var count = parseInt(d[`${dir}-Left`]) + parseInt(d[`${dir}-Right`]) + parseInt(d[`${dir}-Thru`]);
      var value = { time: d['hour'] + ':' + d['minute'], count: count };
      if (d['Type'] == 'CARS') {
        data[3].values.push(value)
      }
      if (d['Type'] == 'HV') {
        data[4].values.push(value)
      }
      if (d['Type'] == 'PAB') {
        data[5].values.push(value)
      }
    } else {
      // If neither Inbound from and Bound to is defined
      var dir = 'Int-Total';

      // If both Inbound from and Bound to is defined
      if (direction.from != null && direction.bound != null) {
        dir = `${direction.from}-${direction.bound}`;
      }
      if(dir == 'Int-Total'){
        if (d['Type'] == 'CARS') {
          data[3].values.push({ time: d['hour'] + ':' + d['minute'], count: d[dir]-d['MAFN-U-Turn']-d['MAFS-U-Turn']-d['WSE-U-Turn']-d['WSW-U-Turn'] })
        }
        if (d['Type'] == 'HV') {
          data[4].values.push({ time: d['hour'] + ':' + d['minute'], count: d[dir]-d['MAFN-U-Turn']-d['MAFS-U-Turn']-d['WSE-U-Turn']-d['WSW-U-Turn'] })
        }
        if (d['Type'] == 'PAB') {
          data[5].values.push({ time: d['hour'] + ':' + d['minute'], count: d[dir]-d['MAFN-U-Turn']-d['MAFS-U-Turn']-d['WSE-U-Turn']-d['WSW-U-Turn'] })
        }
      } else {
        if (d['Type'] == 'CARS') {
          data[3].values.push({ time: d['hour'] + ':' + d['minute'], count: d[dir] })
        }
        if (d['Type'] == 'HV') {
          data[4].values.push({ time: d['hour'] + ':' + d['minute'], count: d[dir] })
        }
        if (d['Type'] == 'PAB') {
          data[5].values.push({ time: d['hour'] + ':' + d['minute'], count: d[dir] })
        }
      } 
    }
  });

  // Format Time
  data.forEach(function (d) {
    d.values.forEach(function (d) {
      if (!(d.time instanceof Date)) {
        d.time = d3.timeParse("%H:%M")(d.time);
      }
    });
  });
}

// Main Draw Function for line-chart
function draw() {
  // Bind SVG to dom, set with of chart, offset by margin
  var svg = d3.select(".line-chart")
    .append("svg")
    .attr("width", (width + margin) + "px")
    .attr("height", (height + margin) + "px")
    .append("g")
    .attr("transform", `translate(${margin}, ${margin})`);

  // Set Relative Scale and Range
  var allVal = data[0].values.concat(data[1].values).concat(data[2].values);
  var xScale = d3.scaleTime()
    .domain(d3.extent(allVal, function (d) { return d.time }))
    .range([0, width - margin]);

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(data[0].values, function (d) { return d.count })])
    .range([height - margin, 0]);

  // Set Axis ticks
  var xAxis = d3.axisBottom(xScale).ticks(10);
  var yAxis = d3.axisLeft(yScale).ticks(10);

  // Define SVG Line
  var line = d3.line()
    .x(function (d) { return xScale(d.time) })
    .y(function (d) { return yScale(d.count) });
  var line2 = d3.line()
    .x(function (d) { return xScale(d.time) })
    .y(function (d) { return yScale(d.count / 2) });

  // Set color profile
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  // Add Lines and Paths
  svg.selectAll('.line-group')
    .data(data).enter()
    .append('path')
    .attr('class', function (d, i) {
      if (i < 3) {
        return `line subset svg_${d.name}`
      } else {
        return `line original svg_${d.name}`
      }
    })
    .attr('d', function (d) { return line(d.values) })
    .style('stroke', function (d, i) { if (i < 3) { return color(i) } else { return color(i - 3) } })
    .style('stroke-width', 3)
    .style('fill', "none")
    .style('opacity', function (d, i) { if (i > 2) { return 0.5 } });

  var brush = d3.brushX()
    .extent([[0, 0], [width - margin, height - margin]])
    .on("start brush", brushed);

  var formatTime = d3.timeFormat("%H:%M %p");
  var dot = svg
    .selectAll('.line-group')
    .data(data)
    .enter()
    .append("g")
    .attr("fill-opacity", 0.2)
    .attr('class', function (d) {
      return `dot original svg_${d.name}`;
    })
    .selectAll("circle")
    .data(function (d) { return d.values })
    .enter()
    .append("circle")
    .attr('transform', function (d) {
      return `translate(${xScale(d.time)},${yScale(d.count)})`
    })
    .attr("r", 2);

  //.values.length
  svg.append("g")
    .call(brush)
    .call(brush.move, [100, 200]);

  function brushed() {
    var maxTime;
    var minTime;
    var extent = d3.event.selection.map(xScale.invert, xScale);
    dot.attr('fill', 'black');
    dot.classed("selected", function (d) { return extent[0] <= d.time && d.time <= extent[1]; });
    d3.selectAll('.selected')
      .attr('fill', function (d) {
        if (maxTime == null || d.time > maxTime) {
          maxTime = d.time;
        }
        if (minTime == null || d.time < minTime) {
          minTime = d.time;
        }
        return 'white'
      });
      if(isNaN(minTime)){
        $('.sTime').text("")
      } else {
        $('.sTime').text(formatTime(minTime));
      }
      if(isNaN(minTime)){
        $('.eTime').text("")
      } else {
        $('.eTime').text(formatTime(maxTime));
      }
      
    // Dispatch the new time range
    dispatch.call('updateTime', null, { timeRange: { start: formatTime(minTime), end: formatTime(maxTime) }, selectedDirection: null });
  }

  // Assign Axis
  svg.append("g")
    .call(xAxis)
    .attr("transform", `translate(0, ${height - margin})`);

  svg.append("g")
    .call(yAxis);

  // Update
  dispatch.on("updateLine.line-graph", function (direction) {
    var svg = d3.selectAll(".line").transition();
    if (direction.from == null && direction.bound == null) {
      parseSubset(direction);
      svg.attr('d', function (d) { return line(d.values) });
    } else {
      parseSubset(direction);
      svg.attr('d', function (d, i) { return line(data[i].values) });
    }
  });
  // Test Command
  // $("rect").click(function () { dispatch.call('updateLine', null, { from: "MAFS", bound: null }); });

  // With good help from Mr. Zakaria Chowdhury
  // https://codepen.io/zakariachowdhury/pen/JEmjwq
  // And D3 Noob
  // http://www.d3noob.org/2012/12/adding-axis-labels-to-d3js-graph.html
  // http://www.d3noob.org/2016/08/create-simple-line-graph-using-d3js-v4.html
  // http://www.d3noob.org/2012/12/setting-scales-domains-and-ranges-in.html
  // And D3 in depth
  // https://d3indepth.com/enterexit/
  // Time formatting
  // https://github.com/d3/d3-time-format
  // Brushing
  // https://github.com/d3/d3-brush#brushX
}
