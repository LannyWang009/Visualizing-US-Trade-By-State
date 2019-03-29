var datasetExport
var filters = {
  'state': 'Montana',
  'time': '2018'
}

let packExpTooltip = d3.select("#packLayout-export")
                    .append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0)

d3.csv('./data/csv/StateExportData.csv', conversor, function (csvdata) {
  // ================= filter the data =========
  datasetExport = csvdata.filter(function (row) {
    // run through all the filters, returning a boolean
    return ['commodity', 'state', 'time', 'country', 'total_exports_value'].reduce(function (pass, column) {
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
  console.log('datasetExport', datasetExport)

  // =========== scaling function ===========
  // to find out the top 3 category
  const exportValue = datasetExport.map(element => { return (element.total_exports_value) })
  // console.log('exportValue array', exportValue)
  const biggest3data = exportValue.sort(function (a, b) { return b - a }).slice(0, 3)
  // console.log('big numbers', biggest3data)

  // ==================Size of the SVG==========
  // var biggest = 410
  // const maxStateExport = 315400000000
  // const sizeRange = [0, biggest]
  // const sizeDomain = [0, maxStateExport]
  // var sqrtScale = d3.scale.sqrt().domain(sizeDomain).range(sizeRange)
  // var s = sqrtScale(sum(exportValue))
  var s = 410
  const max = d3.max(exportValue)
  const range = [0, s]
  const domain = [0, max]
  var linearscale = d3.scaleLinear()
    .domain(domain)
    .range(range)

  var data = {
    'name': 'Total',
    'children': datasetExport.map(element => {
      if (biggest3data.includes(element.total_exports_value)) {
        console.log(element.commodity)
        return { 'name': element.commodity, 'value': linearscale(element.total_exports_value), 'exportValue': element.total_exports_value, 'tag': true }
      } else {
        return { 'name': element.commodity, 'value': linearscale(element.total_exports_value), 'exportValue': element.total_exports_value, 'tag': false }
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

  var nodes = d3.select('#packLayout-export svg g')
    // .select('svg g')
    .selectAll('circle')
    .data(rootNode.descendants())
    .enter()
    .append('g')
    .attr('transform', function (d) { return 'translate(' + [d.x, d.y] + ')' })

  nodes
    .append('circle')
    .style('fill', function (d) { return switchColor(d.data.name) })
    // .attr('cx', function (d) { return d.x })
    // .attr('cy', function (d) { return d.y })
    .attr('r', function (d) { return d.r })

    // show tips on mouseover
    .on('mouseover', function (d) {
      const lengthOftext = d.data.name.length
      const textCategory = d.data.name.slice(3, lengthOftext)
      const textValue = Math.round(d.data.exportValue / 10000000)

      if (d.data.name != "Total") {
        packExpTooltip.transition()
        .duration(500)
        .style("opacity", .9)
      }

      var tip = setTooltipText
      
      packExpTooltip.html(tip)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) + "px");

          function setTooltipText () {
            if (textValue) {
              return textCategory + ', $' + textValue/100 + ' B'
            } else { return null}
          }

    })
    .on('mouseout', function (d) {
      packExpTooltip.transition()
      .duration(500)
      .style("opacity", 0)
    })

  // add label of category name for top 3 categories
  nodes
    .append('text')
    .attr('class', 'packlayout-export-label')
    // .attr(d => { return d.y })
    .attr('dx', -40)
    .attr('dy', 0)
    .text(function (d) {
      const lengthOftext = d.data.name.length
      const textCategory = d.data.name.slice(3, lengthOftext)
      return d.data.tag === true ? textCategory : ''
    })

  // add label of export value under the category
  nodes
    .append('text')
    .attr('class', 'packlayout-export-label')
    // .attr('dx', d => -40 - d.data.name.slice(3, d.data.name.length) / 7)
    .attr('dx', -36)
    .attr('dy', 18)
    .text(function (d) {
      let textValue = Math.round(d.data.exportValue / 10000000)
      return d.data.tag === true ? ' $' + textValue/100 + ' Billion' : ''
    })
})

// function wrap (text, width) {
//   text.each(function () {
//     const text = d3.select(this)
//     let words = text.text().split(/\s+/).reverse()
//     var word = ''
//     let line = []
//     let lineNumber = 0
//     let lineHeight = 1.1 // ems
//     let y = text.attr('y')
//     let dy = parseFloat(text.attr('dy'))
//     let tspan = text.text(null).append('tspan').attr('x', 0).attr('dy', dy + 'em')
//     while (word === words.pop()) {
//       line.push(word)
//       tspan.text(line.join(' '))
//       if (tspan.node().getComputedTextLength() > width) {
//         line.pop()
//         tspan.text.append('tspan').attr('x', 0).attr('y', y).attr('dy', ++lineNumber * lineHeight)
//       }
//     }
//   })
// }

// parsing csv data
function conversor (d) {
  d.total_exports_value = parseInt(d.total_exports_value.replace(/,/g, ''))
  // console.log(d.total_exports_value)
  return d
}

// use for the sorting function
function compare (a, b) {
  const valueA = a.total_exports_value
  const valueB = b.total_exports_value
  let comparison = 0
  if (valueA > valueB) {
    comparison = 1
  } else if (valueA < valueB) {
    comparison = -1
  }
  return comparison
}
// get sum of an array
function sum (input) {
  if (toString.call(input) !== '[object Array]') { return false }
  var total = 0
  for (var i = 0; i < input.length; i++) {
    if (isNaN(input[i])) {
      continue
    }
    total += Number(input[i])
  }
  return total
}

// ============All about assignming Colors==================
var expColors =
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

// var expColors =
// ['#7fc5c9',
//   '#ecb1c2',
//   '#b2e5c2',
//   '#7fcfe0',
//   '#d6eec0',
//   '#ffcbbd',
//   '#abc89b',
//   '#dabbe9',
//   '#a2ece5',
//   '#ccd9a6',
//   '#c1bced',
//   '#cac092',
//   '#a6c3ed',
//   '#e9bc99',
//   '#87c9ed',
//   '#eeebc0',
//   '#bbe4ee',
//   '#d0b89c',
//   '#bad6d0',
//   '#e2a997',
//   '#94c5b3',
//   '#ddb2b6',
//   '#b5e6bb',
//   '#e1d9ee',
//   '#bbc5aa',
//   '#c1b3d0',
//   '#e7ddc9',
//   '#acbed0',
//   '#edd3d5',
//   '#c9b6b0',
//   '#9131a7']

function switchColor (commodity) {
  switch (commodity) {
    case '111 Agricultural Products':return expColors[0]
    case '112 Livestock & Livestock Products':return expColors[1]
    case '113 Forestry Products, Nesoi':return expColors[2]
    case '114 Fish, Fresh/chilled/frozen & Other Marine Products': return expColors[3]
    case '211 Oil & Gas': return expColors[4]
    case '212 Minerals & Ores': return expColors[5]
    case '311 Food & Kindred Products': return expColors[6]
    case '312 Beverages & Tobacco Products': return expColors[7]
    case '313 Textiles & Fabrics': return expColors[8]
    case '314 Textile Mill Products': return expColors[9]
    case '315 Apparel & Accessories': return expColors[10]
    case '316 Leather & Allied Products': return expColors[11]
    case '321 Wood Products': return expColors[12]
    case '322 Paper': return expColors[13]
    case '323 Printed Matter And Related Products, Nesoi': return expColors[14]
    case '324 Petroleum & Coal Products': return expColors[15]
    case '325 Chemicals': return expColors[16]
    case '326 Plastics & Rubber Products': return expColors[17]
    case '327 Nonmetallic Mineral Products': return expColors[18]
    case '331 Primary Metal Mfg': return expColors[19]
    case '332 Fabricated Metal Products, Nesoi': return expColors[20]
    case '333 Machinery, Except Electrical': return expColors[21]
    case '334 Computer & Electronic Products': return expColors[22]
    case '335 Electrical Equipment, Appliances & Components': return expColors[23]
    case '336 Transportation Equipment': return expColors[24]
    case '337 Furniture & Fixtures': return expColors[25]
    case '339 Miscellaneous Manufactured Commodities': return expColors[26]
    case '910 Waste And Scrap': return expColors[27]
    case '930 Used Or Second-hand Merchandise': return expColors[28]
    case '980 Goods Returned (exports For Canada Only)': return expColors[29]
    case '990 Other Special Classification Provisions': return expColors[30]
    default:return 'rgba(0, 0, 0, 0)'
  }
}
