
var datasetExport // global var for
d3.csv('./data/csv/al2018.csv', conversor, function (csvdata) {
  console.log('csv', csvdata)
  datasetExport = csvdata

  var s = 400
  // =========== scaling function ===========
  let exportValue = datasetExport.map(element => { return element.total_exports_value })
  const max = d3.max(exportValue)
  const range = [0, s]
  const domain = [0, max]
  var linearscale = d3.scaleLinear()
    .domain(domain)
    .range(range)
  // ========tooltip=========
  // var tooltip = d3.select('body')
  //   .append('div')
  //   .attr('class', 'tooltip')
  // ====layout=====
  var data = {
    'name': 'Total',
    'children': datasetExport.map(element => {
      return { 'name': element.commodity, 'value': linearscale(element.total_exports_value) }
    })
  }

  var packLayout = d3.pack()
    .size([s, s])

  var rootNode = d3.hierarchy(data)

  rootNode.sum(function (d) {
    return d.value
  })

  packLayout(rootNode)

  d3.select('#packLayout-export svg g')
    // .select('svg g')
    .selectAll('circle')
    .data(rootNode.descendants())
    .enter()
    .append('circle')
    .style('fill', function (d) { return switchColor(d.data.name) })
    .attr('cx', function (d) { return d.x })
    .attr('cy', function (d) { return d.y })
    .attr('r', function (d) { return d.r })

  // show tips on mouseover
    .on('mouseover', function (d) {
      console.log('your mouse moved here')
      // d3.select(this).attr('stroke', 'grey')
      tooltip.transition()
        .duration(200)
        .style('opacity', 1)
      tooltip.text(d.data.name)
        .style('left', (d3.event.pageX) + 'px')
        .style('top', (d3.event.pageY - 100) + 'px')
    })
    .on('mouseout', function (d) {
      tooltip.transition()
        .duration(500)
        .style('opacity', 0)
    })
})

function conversor (d) {
  d.total_exports_value = parseInt(d.total_exports_value.replace(/,/g, ''))
  // console.log(d.total_exports_value)
  return d
}

// ============All about assignming colors==================
var colors = ['#7fc5c9',
  '#ecb1c2',
  '#b2e5c2',
  '#7fcfe0',
  '#d6eec0',
  '#ffcbbd',
  '#abc89b',
  '#dabbe9',
  '#a2ece5',
  '#ccd9a6',
  '#c1bced',
  '#cac092',
  '#a6c3ed',
  '#e9bc99',
  '#87c9ed',
  '#eeebc0',
  '#bbe4ee',
  '#d0b89c',
  '#bad6d0',
  '#e2a997',
  '#94c5b3',
  '#ddb2b6',
  '#b5e6bb',
  '#e1d9ee',
  '#bbc5aa',
  '#c1b3d0',
  '#e7ddc9',
  '#acbed0',
  '#edd3d5',
  '#c9b6b0',
  '#60c699'
]
function switchColor (commodity) {
  switch (commodity) {
    case '111 Agricultural Products':return colors[0]
    case '112 Livestock & Livestock Products':return colors[1]
    case '113 Forestry Products, Nesoi':return colors[2]
    case '114 Fish, Fresh/chilled/frozen & Other Marine Products': return colors[3]
    case '211 Oil & Gas': return colors[4]
    case '212 Minerals & Ores': return colors[5]
    case '311 Food & Kindred Products': return colors[6]
    case '312 Beverages & Tobacco Products': return colors[7]
    case '313 Textiles & Fabrics': return colors[8]
    case '314 Textile Mill Products': return colors[9]
    case '315 Apparel & Accessories': return colors[10]
    case '316 Leather & Allied Products': return colors[11]
    case '321 Wood Products': return colors[12]
    case '322 Paper': return colors[13]
    case '323 Printed Matter And Related Products, Nesoi': return colors[14]
    case '324 Petroleum & Coal Products': return colors[15]
    case '325 Chemicals': return colors[16]
    case '326 Plastics & Rubber Products': return colors[17]
    case '327 Nonmetallic Mineral Products': return colors[18]
    case '331 Primary Metal Mfg': return colors[19]
    case '332 Fabricated Metal Products, Nesoi': return colors[20]
    case '333 Machinery, Except Electrical': return colors[21]
    case '334 Computer & Electronic Products': return colors[22]
    case '335 Electrical Equipment, Appliances & Components': return colors[23]
    case '336 Transportation Equipment': return colors[24]
    case '337 Furniture & Fixtures': return colors[25]
    case '339 Miscellaneous Manufactured Commodities': return colors[26]
    case '910 Waste And Scrap': return colors[27]
    case '930 Used Or Second-hand Merchandise': return colors[28]
    case '980 Goods Returned (exports For Canada Only)': return colors[29]
    case '990 Other Special Classification Provisions': return colors[30]
    default:return 'rgba(0, 0, 0, 0)'
  }
}
