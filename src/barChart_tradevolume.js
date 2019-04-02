var tradeVolumeDataset
var stateNames

d3.csv('./data/csv/allState2018.csv', numConverter, function (error, csvdata) {
  
  // Sort Data
  if (error) { 
    console.log('There was an error loading trade volume data: ', error) 
  } 
  console.log(csvdata)
  tradeVolumeDataset = csvdata
  
  var legendData = ['Total Exports', 'Total Imports']

  // Setup chart 
  var margin = {top: 50, right: 10, bottom: 0, left: 105}
  var width = 432 - margin.right - margin.left
  var height = 577 - margin.top - margin.bottom
  var colors = ['#C85FE5', '#6B56D3']

  var svg = d3.select('#bar')
                .append('svg')
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
  let tooltip = d3.select('#bar')
                .append('div')
                .attr('class', 'tooltip')
                .style('opacity', 0)
  // Axes
  var xScale = d3.scaleLinear()
                .domain([0, 620.1])
                .range([0, width])

  var yScale = d3.scaleBand()
                .range([0, height])
                .domain(tradeVolumeDataset.map(function(d) { return d.state}))
                .padding(1)
                
  svg.append('g')
      .attr('class', 'axisLabel')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .data(tradeVolumeDataset)
      .enter()
      .append('text')
      .text(function(d) { return d.state})
      .attr('fill', 'white')
      .attr('class', 'axisLabels')
  
  // Lines
  svg.selectAll('lines')
      .data(tradeVolumeDataset)
      .enter()
      .append('line')
      .attr('x1', function(d) { return xScale(d.total_trade_activity)})
      .attr('x2', xScale(0))
      .attr('y1', function(d) { return yScale(d.state)})
      .attr('y2', function(d) { return yScale(d.state)})
      .attr('stroke', 'white')

  // Circles
  svg.selectAll('import-circles')
      .data(tradeVolumeDataset)
      .enter()
      .append('circle')
      .attr('cx', function(d) { return xScale((d.import_2018 + d.export_2018))})
      .attr('cy', function(d) { return yScale(d.state)})
      .attr('r', '4')
      .style('fill', colors[1])
      .attr('stroke', colors[1])
      .on('mouseover', function (d) {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0.9)
  
        format = d3.format(',')
  
        var tip = 'Total ' + d.state + ' Imports: $' + d.import_2018 + ' B'
  
        tooltip.html(tip)
          .style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY - 28) + 'px')
      })
      .on('mouseout', function (d) {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0)
      })

  svg.selectAll('export-circles')
      .data(tradeVolumeDataset)
      .enter()
      .append('circle')
      .attr('cx', function(d) { return xScale((d.export_2018))})
      .attr('cy', function(d) { return yScale(d.state)})
      .attr('r', '4')
      .style('fill', function(d) {return colors[0]})
      .attr('stroke', function(d) {return colors[0]})
      .on('mouseover', function (d) {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0.9)
  
        format = d3.format(',')
  
        var tip = 'Total ' + d.state + ' Exports: $' + d.export_2018 + ' B'
  
        tooltip.html(tip)
          .style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY - 28) + 'px')
      })
      .on('mouseout', function (d) {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0)
      })

  var legend = svg.selectAll('.legend')
                  .data(legendData)
                  .enter()
                  .append('circle')
                  .attr('cx', width - 150)
                  .attr('cy', function(d, i) {return height - 50 + (i * 25)})
                  .attr('r', '10')
                  .style('fill', function(d, i) {return colors[i]})
                  .attr('class', 'legend')
    
 svg.selectAll('textLabels')
        .data(legendData)
        .enter()
        .append('text')
        .text(function(d) {return d})
        .attr('class', 'textLabels')
        .attr('x', width - 135)
        .attr('y', function(d, i) { return height - 45 + (i * 25)})
})

function numConverter (d) {
  d.total_trade_activity = +d.total_trade_activity
  d.import_2018 = +d.import_2018
  d.export_2018 = +d.export_2018
  return d
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Old code for the barchart version
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// var tradeVolumeDataset

// d3.csv('./data/csv/allState2018.csv', function (error, csvdata) {
  
//   // Sort Data
//   if (error) { 
//     console.log('There was an error loading trade volume data: ', error) 
//   } else {
//     console.log('csvdata = ', csvdata)
//     var dataset = d3.layout.stack()(["import_2018", "export_2018"].map(function(trade) {
//       return csvdata.map(function(d) {
//         return {x: parseInt(d.total_trade_activity), y: +d[trade]}
//       })
//     })
//     )
//     console.log('the new dataset = ', dataset)
//     tradeVolumeDataset = dataset

//     }
  
//   // Setup chart 
//   var margin = {top: 50, right: 10, bottom: 0, left: 10}
//   var width = 432 - margin.right - margin.left
//   var height = 577 - margin.top - margin.bottom

//   var svg = d3.select('#bar')
//               .append('svg')
//               .attr("width", width + margin.left + margin.right)
//               .attr("height", height + margin.top + margin.bottom)
//               .append("g")
//               .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
//   var tooltip = d3.select('#bar')
//     .append('div')
//     .attr('class', 'tooltip')
//     .style('opacity', 0)

//   // Set up scale
//   var yScale = d3.scale.ordinal()
//             .domain(tradeVolumeDataset[0].map(function(d) { return d.x; }))
//             .rangeRoundBands([10, height-10], 0.05)

//   var xScale = d3.scale.linear()
//             .domain([0, d3.max(tradeVolumeDataset, function(d) {
//                           return d3.max(d, function(d) { return d.y0 + d.y;
//                         })
//                       })
//                     ])  
//             .range([0, width])
    
//   var colors = ['#6b55d3', '#cf5cc5']

//   // // Axis
//   // var yAxis = d3.svg.axis()
//   //               .scale(yScale)
//   //               .orient('left')

//   // svg.append('g')
//   //     .attr('class', 'y axis')
//   //     .call(yAxis)   

//   // Create groups for each series, rects for each segment
//   var groups = svg.selectAll("g")
//                   .data(tradeVolumeDataset)
//                   .enter()
//                   .append('g')
//                   .attr("class", "volume")
//                   .style("fill", function(d,i) { return colors[i]})
          
//   var rect = groups.selectAll("rect")
//                     .data(function(d) {return d})
//                     .enter()
//                     .append('rect')
//                     .attr("y", function(d) {return yScale(d.x)})
//                     .attr("x", function(d) { return xScale(d.y0)})
//                     .attr("height", yScale.rangeBand())
//                     .attr("width", function(d) { return xScale(d.y0 + d.y) - xScale(d.y0)})
//                     .on('mouseover', function (d) {
//                       tooltip.transition()
//                         .duration(500)
//                         .style('opacity', 0.9)
                
//                       format = d3.format(',')
                
//                       var tip = '$' + d.y + ' B'
                
//                       tooltip.html(tip)
//                         .style('left', (d3.event.pageX) + 'px')
//                         .style('top', (d3.event.pageY - 28) + 'px')
//                     })
//                     .on('mouseout', function (d) {
//                       tooltip.transition()
//                         .duration(500)
//                         .style('opacity', 0)
//                     })

//   var labels = svg.selectAll('text')
//                   .data(csvdata)
//                   .enter()
//                   .append('text')
//                   .text(function (d, i) {
//                     return csvdata[i].state
//                   })
//                   .attr('text-anchor', 'left')
//                   .attr('y', (d, i) => 26 + i * 12)
//                   .attr('x', 0)
//                   .attr('fill', 'white')
//                   .style('font-size', '8px')
//                   .style('font-family', 'sans-serif')
          
// })