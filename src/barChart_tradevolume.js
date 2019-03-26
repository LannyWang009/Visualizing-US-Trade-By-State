var datasetTradeVolume
d3.csv('./data/csv/allState2018.csv', function (error, csvdata) {
  if (error) { console.log(error) }
  console.log('datasetTradeVolume', csvdata)
  datasetTradeVolume = csvdata
  // create scale
  var s = 400
  var h = 570
  const range = [0, s]
  const domain = [0, 770]
  var xlinearscale = d3.scaleLinear()
    .domain(domain)
    .range(range)

  const svg = d3.select()

  d3.select('#exportbar')
    .append('g')
    .attr('fill', '#ebe4eb')
    .selectAll('rect')
    .data(datasetTradeVolume)
    .enter()
    .join('rect')
    .attr('x', xlinearscale(450))
    .attr('y', x)
    .width('width', d => xlinearscale(d.export_2018))
    .height('height', d => h / d.length)
})

// function conversor (d) {
//   console.log(d.sort(compare))
//   return d
// }

// function compare (a, b) {
//   const valueA = a.total_trade_activity
//   const valueB = b.total_trade_activity

//   let comparison = 0
//   if (valueA > valueB) {
//     comparison = 1
//   } else if (valueA < valueB) {
//     comparison = -1
//   }
//   return comparison
// }
