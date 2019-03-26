var datasetTradeVolume
d3.csv('./data/csv/allState2018.csv', function (error, csvdata) {
  if (error) { console.log(error) }
  console.log('datasetTradeVolume', csvdata)
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
