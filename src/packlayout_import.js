
var datasetImport // global var for
var filters = {
  'state': 'Texas',
  'time': '2018'
}

d3.csv('./data/csv/StateImportType.csv', conversor, function (csvdata) {
  datasetImport = csvdata

  // ================= filter the data =========
  datasetImport = csvdata.filter(function (row) {
    // run through all the filters, returning a boolean
    return ['commodity', 'state', 'time', 'country', 'total_import_values'].reduce(function (pass, column) {
      return pass && (
      // pass if no filter is set
        !filters[column] ||
              // pass if the row's value is equal to the filter
              // (i.e. the filter is set to a string)
              row[column] === filters[column]
      )
    }, true)
  })
  // }).sort(compare)
  console.log('datasetImport', datasetImport)
  // ========helper var for labels and scaling function=====
  // to find out the top 3 category
  const importValue = datasetImport.map(element => { return (element.total_import_values) })
  // console.log('importValue array', importValue)
  const biggest3data = importValue.sort(function (a, b) { return b - a }).slice(0, 3)
  // console.log('big import numbers', biggest3data)

  var s = 410
  const max = d3.max(importValue)
  const range = [0, s]
  const domain = [0, max]
  var linearscale = d3.scaleLinear()
    .domain(domain)
    .range(range)

  // ====layout=====
  var data = {
    'name': 'Total',
    'children': datasetImport.map(element => {
      if (biggest3data.includes(element.total_import_values)) {
        console.log('injecting', element.commodity)
        return { 'name': element.commodity, 'value': linearscale(element.total_import_values), 'importValue': element.total_import_values, 'tag': true }
      } else {
        return { 'name': element.commodity, 'value': linearscale(element.total_import_values), 'importValue': element.total_import_values, 'tag': false }
      }
    })
  }

  var packLayout = d3.pack()
    .size([s, s])

  var rootNode = d3.hierarchy(data)

  rootNode.sum(function (d) {
    return d.value
  })

  packLayout(rootNode)

  var nodes = d3.select('#packLayout-import svg g')
    // .select('svg g')
    .selectAll('circle')
    .data(rootNode.descendants())
    .enter()
    .append('g')
    .attr('transform', function (d) {
      // console.log(d)
      return 'translate(' + [d.x, d.y] + ')'
    })

  nodes
    .append('circle')
    .style('fill', function (d) { return switchColor(d.data.name) })
    // .attr('cx', function (d) { return d.x })
    // .attr('cy', function (d) { return d.y })
    .attr('r', function (d) { return d.r })

    // show tips on mouseover
    .on('mouseover', function (d) {
      console.log('your mouse moved here')
      // to get circle's cx and cy value
      // const xPosition = parseFloat(d3.select(this).attr('cx'))
      // const yPosition = parseFloat(d3.select(this).attr('cy'))
      const xPosition = parseFloat(d.x)
      const yPosition = parseFloat(d.y)
      const lengthOftext = d.data.name.length
      const textCategory = d.data.name.slice(3, lengthOftext)
      // const textCategory = d.data.name
      const textValue = Math.round(d.data.importValue / 1000000)
      // create the tooltip label
      d3.select('#packLayout-import svg g').append('text')
        .attr('id', 'tooltip')
        .attr('x', xPosition)
        .attr('y', yPosition)
        .attr('text-anchor', 'middle')
        .attr('fill', 'lavender')
        .text(
          function () {
            if (textValue) {
              return textCategory + ', $' + textValue + ' Million'
            } else { return '' }
          }

        )
    })
    .on('mouseout', function (d) {
      d3.select('#tooltip').remove()
    })

  // add label of category name for top 3 categories
  nodes
    .append('text')
    .attr('class', 'packlayout-import-label')
    // .attr(d => { return d.y })
    .attr('dx', -40)
    .attr('dy', 0)
    .text(function (d) {
      const lengthOftext = d.data.name.length
      const textCategory = d.data.name.slice(3, lengthOftext)
      return d.data.tag === true ? textCategory : ''
    })

  // add label of import value under the category
  nodes
    .append('text')
    .attr('class', 'packlayout-import-label')
    // .attr('dx', d => -40 - d.data.name.slice(3, d.data.name.length) / 7)
    .attr('dx', -36)
    .attr('dy', 18)
    .text(function (d) {
      let textValue = Math.round(d.data.importValue / 1000000)
      return d.data.tag === true ? ' $' + textValue + ' M' : ''
    })
})

//   d3.select('#packLayout-import svg g')
//     // .select('svg g')
//     .selectAll('circle')
//     .data(rootNode.descendants())
//     .enter()
//     .append('circle')
//     .style('fill', function (d) { return switchColor(d.data.name) })
//     .attr('cx', function (d) { return d.x })
//     .attr('cy', function (d) { return d.y })
//     .attr('r', function (d) { return d.r })

//   // show tooltip on mouseover
//     .on('mouseover', function (d) {
//       console.log('your mouse moved here')
//       // to get circle's cx and cy value
//       const xPosition = parseFloat(d3.select(this).attr('cx'))
//       const yPosition = parseFloat(d3.select(this).attr('cy'))
//       const text = d.data.name
//       // create the tooltip label
//       d3.select('#packLayout-import svg g').append('text')
//         .attr('id', 'tooltip')
//         .attr('x', xPosition)
//         .attr('y', yPosition)
//         .attr('text-anchor', 'middle')
//         .attr('font-family', 'sans-serif')
//         .attr('font-weight', 'bold')
//         .attr('font-size', '12px')
//         .attr('fill', 'lavender')
//         .text(text)
//     })
//     .on('mouseout', function (d) {
//       d3.select('#tooltip').remove()
//     })
// })

function conversor (d) {
  d.total_import_values = parseInt(d.total_import_values.replace(/,/g, ''))
  // console.log(d.total_import_values)
  return d
}

// ============All about assignming colors==================
var colors =
['#ae3871',
  '#3e40d3',
  '#df6fa3',
  '#4e1ab2',
  '#e53296',
  '#5f8ddb',
  '#7a28d1',
  '#7a2255',
  '#9251f2',
  '#752063',
  '#4d62ea',
  '#b93497',
  '#6a7ee8',
  '#e04eca',
  '#445ba7',
  '#d851ec',
  '#313380',
  '#e78bd7',
  '#37149a',
  '#b390e0',
  '#48218e',
  '#bb6fce',
  '#502a69',
  '#aa3dcf',
  '#7a53a0',
  '#7231b8',
  '#a34e97',
  '#574db8',
  '#682278',
  '#a16de7',
  '#9131a7']

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
