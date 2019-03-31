var tradeVolumeDataset

d3.csv('./data/csv/allState2018.csv', function (error, csvdata) {
  
  // Sort Data
  if (error) { 
    console.log('There was an error loading trade volume data: ', error) 
  } else {
    console.log('csvdata = ', csvdata)
    var dataset = d3.layout.stack()(["import_2018", "export_2018"].map(function(trade) {
      return csvdata.map(function(d) {
        return {x: parseInt(d.total_trade_activity), y: +d[trade]}
      })
    })
    )
    console.log('the new dataset = ', dataset)
    tradeVolumeDataset = dataset

    }
  
  // Setup chart 
  var margin = {top: 20, right: 10, bottom: 20, left: 10}
  var width = 432 - margin.right - margin.left
  var height = 577 - margin.top - margin.bottom

  var svg = d3.select('#bar')
              .append('svg')
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transfrom", "translate(" + margin.left + "," + margin.top + ")");
  
  // Set up scale
  var yScale = d3.scale.ordinal()
            .domain(tradeVolumeDataset[0].map(function(d) { return d.x; }))
            .rangeRoundBands([10, height-10], 0.02)

  var xScale = d3.scale.linear()
            .domain([0, d3.max(tradeVolumeDataset, function(d) {
                          return d3.max(d, function(d) { return d.y0 + d.y;
                        })
                      })
                    ])  
            .range([width, 0])
  // scaleLinear()
  //           .domain([0, d3.max(tradeVolumeDataset, function(d) { 
  //                       return d3.max(d, function(d) {
  //                         return d.y0 + d.y
  //                       })
  //                     })
  //                   ])
  //           .range([0, width])
  
  // var y = d3.scale.ordinal()
  //           .domain(tradeVolumeDataset[0].map(function(d) {return d.x}))
  //           .rangeRoundBands([10, height-10], 0.02)
    
  var colors = ['#6b55d3', '#cf5cc5']

  // Create groups for each series, rects for each segment
  var groups = svg.selectAll("g")
                  .data(tradeVolumeDataset)
                  .enter()
                  .append('g')
                  .attr("class", "volume")
                  .style("fill", function(d,i) { return colors[i]})
          
  var rect = groups.selectAll("rect")
                    .data(function(d) {return d})
                    .enter()
                    .append('rect')
                    .attr("y", function(d) {return yScale(d.x)})
                    .attr("x", function(d) { return xScale(d.y0 + d.y)})
                    .attr("height", yScale.rangeBand())
                    .attr("width", function(d) { return xScale(d.y0) - xScale(d.y0 + d.y)})

})

//               var s = 400
//   var h = 570
//   const range = [0, s]
//   const domain = [0, 770]
//   var xlinearscale = d3.scaleLinear()
//     .domain(domain)
//     .range(range)

//   const svg = d3.select()

//   d3.select('#exportbar')
//     .append('g')
//     .attr('fill', '#ebe4eb')
//     .selectAll('rect')
//     .data(tradeVolumeDataset)
//     .enter()
//     .join('rect')
//     .attr('x', xlinearscale(450))
//     .attr('y', x)
//     .width('width', d => xlinearscale(d.export_2018))
//     .height('height', d => h / d.length)
// })

// // function conversor (d) {
// //   console.log(d.sort(compare))
// //   return d
// // }

// // function compare (a, b) {
// //   const valueA = a.total_trade_activity
// //   const valueB = b.total_trade_activity

// //   let comparison = 0
// //   if (valueA > valueB) {
// //     comparison = 1
// //   } else if (valueA < valueB) {
// //     comparison = -1
// //   }
// //   return comparison
// // 
