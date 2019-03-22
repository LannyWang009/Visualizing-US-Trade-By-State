
var datasetBarchart // global var for
d3.csv('al2018.csv', conversor, function (csvdata) {
  console.log(csvdata)
  datasetBarchart = csvdata

  var data = {
    'name': 'Total',
    'children': csvdata.map(element => {
      return { 'name': element.commodity, 'value': element.total_exports_value / 1000000 }
    })
  }

  var packLayout = d3.pack()
    .size([900, 900])

  var rootNode = d3.hierarchy(data)

  rootNode.sum(function (d) {
    return d.value
  })

  packLayout(rootNode)

  d3.select('svg g')
    .selectAll('circle')
    .data(rootNode.descendants())
    .enter()
    .append('circle')
    .attr('cx', function (d) { return d.x })
    .attr('cy', function (d) { return d.y })
    .attr('r', function (d) { return d.r })
  // -------plot circle example-----
  //   const w = 500
  //   const h = 500

  //   const svg = d3.select('body')
  //     .append('svg')
  //     .attr('width', w)
  //     .attr('height', h)

//   svg.selectAll('circle')
//     .data(datasetBarchart)
//     .enter()
//     .append('circle')
//     .attr('cx', (d, i) => (i * 12))
//     .attr('cy', (d, h) => (h - d.total_exports_value / 5000000))
//     .attr('r', 2)
})
function conversor (d) {
  d.total_exports_value = parseInt(d.total_exports_value.replace(/,/g, ''))
  console.log(d.total_exports_value)
  return d
}
