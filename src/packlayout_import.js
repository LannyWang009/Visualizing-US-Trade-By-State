var datasetImport // global var for
var filters = {
  'state': 'Texas',
  'time': '2018'
}

let packImpTooltip = d3.select('#packLayout-export')
  .append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0)

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
  // to find out the top 5 category
  const importValue = datasetImport.map(element => { return (element.total_import_values) })
  // console.log('importValue array', importValue)
  const biggest3data = importValue.sort(function (a, b) { return b - a }).slice(0, 5)
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
    // .append('g')
    // .attr('transform', function (d) {
    //   // console.log(d)
    //   return 'translate(' + [d.x, d.y] + ')'
    // })

  nodes
    .append('circle')
    .style('fill', function (d) { return switchColor(d.data.name) })
    .attr('cx', function (d) { return d.x })
    .attr('cy', function (d) { return d.y })
    .attr('r', function (d) { return d.r })

    // show tips on mouseover
    .on('mouseover', function (d) {
      const lengthOftext = d.data.name.length
      const textCategory = d.data.name.slice(3, lengthOftext)
      const textValue = Math.round(d.data.importValue / 10000000)

      if (d.data.name != 'Total') {
        packImpTooltip.transition()
          .duration(500)
          .style('opacity', 0.9)
      }

      var tip = setTooltipText

      packImpTooltip.html(tip)
        .style('left', (d3.event.pageX) + 'px')
        .style('top', (d3.event.pageY) + 'px')

      function setTooltipText () {
        if (textValue) {
          return textCategory + ', $' + textValue / 100 + ' B'
        } else { return null }
      }
    })
    .on('mouseout', function (d) {
      packImpTooltip.transition()
        .duration(500)
        .style('opacity', 0)
    })

  // add label of category name for top 3 categories
  var labelg = nodes
    .append('g')
    .attr('class', 'packlayout-import-label')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)

  labelg
    .append('text')
    .text(function (d) {
      const lengthOftext = d.data.name.length
      const textCategory = d.data.name.slice(3, lengthOftext)
      return d.data.tag === true ? textCategory : ''
    })
    .attr('dx', d => d.x - 40)
    .attr('dy', d => d.y)
    .attr('class', 'commodity-label')

  labelg
    .append('text')
    .attr('class', 'number-label')
    .attr('dx', d => d.x - 36)
    .attr('dy', d => d.y + 18)
    .text(function (d) {
      let textValue = Math.round(d.data.importValue / 10000000)
      return d.data.tag === true ? ' $' + textValue / 100 + ' Billion' : ''
    })
})

//   // add label of import value under the category
//   nodes
//     .append('text')
//     .attr('class', 'packlayout-import-label')
//     .attr('class', 'layout-label-text')
//     .attr('dx', d => d.x - 36)
//     .attr('dy', d => d.y + 18)
//     .text(function (d) {
//       let textValue = Math.round(d.data.importValue / 10000000)
//       return d.data.tag === true ? ' $' + textValue / 100 + ' Billion' : ''
//     })
// })

function conversor (d) {
  d.total_import_values = parseInt(d.total_import_values.replace(/,/g, ''))
  // console.log(d.total_import_values)
  return d
}

// ============All about assignming colors==================
// the first version (purple)
// var colors =
// ['#ae3871',
//   '#3e40d3',
//   '#df6fa3',
//   '#4e1ab2',
//   '#e53296',
//   '#5f8ddb',
//   '#7a28d1',
//   '#7a2255',
//   '#9251f2',
//   '#752063',
//   '#4d62ea',
//   '#b93497',
//   '#6a7ee8',
//   '#e04eca',
//   '#445ba7',
//   '#d851ec',
//   '#313380',
//   '#e78bd7',
//   '#37149a',
//   '#b390e0',
//   '#48218e',
//   '#bb6fce',
//   '#502a69',
//   '#aa3dcf',
//   '#7a53a0',
//   '#7231b8',
//   '#a34e97',
//   '#574db8',
//   '#682278',
//   '#a16de7',
//   '#9131a7']

// var colors = [
//   'rgb(189,123,123)',
//   'rgb(64,108,191)',
//   'rgb(234,134,129)',
//   'rgb(75,104,165)',
//   'rgb(184,93,86)',
//   'rgb(127,154,232)',
//   'rgb(151,68,72)',
//   'rgb(176,146,219)',
//   'rgb(139,87,84)',
//   'rgb(225,170,233)',
//   'rgb(181,72,92)',
//   'rgb(222,189,223)',
//   'rgb(169,69,110)',
//   'rgb(182,180,233)',
//   'rgb(222,117,146)',
//   'rgb(137,124,183)',
//   'rgb(233,170,174)',
//   'rgb(116,113,190)',
//   'rgb(186,134,163)',
//   'rgb(147,82,146)',
//   'rgb(146,88,110)',
//   'rgb(80,80,153)',
//   'rgb(234,145,191)',
//   'rgb(133,88,167)',
//   'rgb(162,74,128)',
//   'rgb(151,142,180)',
//   'rgb(116,82,142)',
//   'rgb(195,120,180)',
//   'rgb(118,93,125)',
//   'rgb(98,96,143)',
//   'rgb(147,84,125)'
// ]

// function switchColor (commodity) {
//   switch (commodity) {
//     case '111 Agricultural Products':return colors[0]
//     case '112 Livestock & Livestock Products':return colors[1]
//     case '113 Forestry Products, Nesoi':return colors[2]
//     case '114 Fish, Fresh/chilled/frozen & Other Marine Products': return colors[3]
//     case '211 Oil & Gas': return colors[4]
//     case '212 Minerals & Ores': return colors[5]
//     case '311 Food & Kindred Products': return colors[6]
//     case '312 Beverages & Tobacco Products': return colors[7]
//     case '313 Textiles & Fabrics': return colors[8]
//     case '314 Textile Mill Products': return colors[9]
//     case '315 Apparel & Accessories': return colors[10]
//     case '316 Leather & Allied Products': return colors[11]
//     case '321 Wood Products': return colors[12]
//     case '322 Paper': return colors[13]
//     case '323 Printed Matter And Related Products, Nesoi': return colors[14]
//     case '324 Petroleum & Coal Products': return colors[15]
//     case '325 Chemicals': return colors[16]
//     case '326 Plastics & Rubber Products': return colors[17]
//     case '327 Nonmetallic Mineral Products': return colors[18]
//     case '331 Primary Metal Mfg': return colors[19]
//     case '332 Fabricated Metal Products, Nesoi': return colors[20]
//     case '333 Machinery, Except Electrical': return colors[21]
//     case '334 Computer & Electronic Products': return colors[22]
//     case '335 Electrical Equipment, Appliances & Components': return colors[23]
//     case '336 Transportation Equipment': return colors[24]
//     case '337 Furniture & Fixtures': return colors[25]
//     case '339 Miscellaneous Manufactured Commodities': return colors[26]
//     case '910 Waste And Scrap': return colors[27]
//     case '930 Used Or Second-hand Merchandise': return colors[28]
//     case '980 Goods Returned (exports For Canada Only)': return colors[29]
//     case '990 Other Special Classification Provisions': return colors[30]
//     default:return 'rgba(0, 0, 0, 0)'
//   }
// }
