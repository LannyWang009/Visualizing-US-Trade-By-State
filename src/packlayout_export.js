var datasetExport

let packExpTooltip = d3.select('#packLayout-export')
  .append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0)

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


  // =========== scaling function ===========
  // to find out the top 3 category
  const exportValue = datasetExport.map(element => { return (element.total_exports_value) })
  const biggest3data = exportValue.sort(function (a, b) { return b - a }).slice(0, numberOfLabels)


  // ==================Size of the SVG==========

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
    .selectAll('circle')
    .data(rootNode.descendants())
    .enter()
  

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
      const textValue = Math.round(d.data.exportValue / 10000000)

      if (d.data.name != 'Total') {
        packExpTooltip.transition()
          .duration(500)
          .style('opacity', 0.9)
      }

      var tip = setTooltipText

      packExpTooltip.html(tip)
        .style('left', (d3.event.pageX) + 'px')
        .style('top', (d3.event.pageY) + 'px')

      function setTooltipText () {
        if (textValue) {
          return textCategory + ', $' + textValue / 100 + ' B'
        } else { return null }
      }
    })
    .on('mouseout', function (d) {
      packExpTooltip.transition()
        .duration(500)
        .style('opacity', 0)
    })

  // add label of category name for top  categories
  nodes
    .append('text')
    .attr('class', 'packlayout-export-label-name')
    .attr('dx', (d) => d.x - 40)
    .attr('dy', (d) => d.y)
    .text(function (d) {
      const lengthOftext = d.data.name.length
      const textCategory = d.data.name.slice(3, lengthOftext)
      return d.data.tag === true ? textCategory : ''
    })

  // add label of export value under the category
  nodes
    .append('text')
    .attr('class', 'packlayout-export-label-number')
    .attr('dx', (d) => d.x - 36)
    .attr('dy', (d) => d.y + 18)
    .text(function (d) {
      let textValue = Math.round(d.data.exportValue / 10000000)
      return d.data.tag === true ? ' $' + textValue / 100 + ' Billion' : ''
    })
})

// parsing csv data
function conversor (d) {
  d.total_exports_value = parseInt(d.total_exports_value.replace(/,/g, ''))
  
  return d
}

// Update Export Pack Layout
function updateExportPack () {
  d3.csv('./data/csv/StateExportData.csv', conversor, function (csvdata) {
    var filters = {
      'state': selectedState || 'Texas',
      'time': selectedTime || '2018'
    }
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
    // console.log('updated datasetExport: ', datasetExport)

    // =========== scaling function ===========
    const exportValue = datasetExport.map(element => { return (element.total_exports_value) })
    const biggest3data = exportValue.sort(function (a, b) { return b - a }).slice(0, numberOfLabels)

    // ==================Size of the SVG==========

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
          console.log('updated export layout labels', element.commodity)
          return { 'name': element.commodity, 'value': linearscale(element.total_exports_value), 'exportValue': element.total_exports_value, 'tag': true }
        } else {
          return { 'name': element.commodity, 'value': linearscale(element.total_exports_value), 'exportValue': element.total_exports_value, 'tag': false }
        }
      })
    }

    // packLayout
    var packLayout = d3.pack()
      .size([s, s])
      // .value(function(d) { return d.value; });

    // transition
    var t = d3.transition()
      .duration(1000)

    var t2 = d3.transition()
      .duration(2000)

    // hierarchy
    var rootNode = d3.hierarchy(data)
      .sum(function (d) {
        return d.value
      })

    // =====================JOIN==========================
    var nodes = d3.select('#packLayout-export svg g')
      .selectAll('circle')
      .data(packLayout(rootNode).descendants())

    var textName = d3.select('#packLayout-export svg g')
      .selectAll('.packlayout-export-label-name')
      .data(packLayout(rootNode).descendants())

    var textNumber = d3.select('#packLayout-export svg g')
      .selectAll('.packlayout-export-label-number')
      .data(packLayout(rootNode).descendants())


    // ==========================EXIT=================================

  // no need to exit 

    // =====================UPDATE====================

    nodes.transition(t)
      .style('fill', function (d) { return switchColor(d.data.name) })
      .attr('r', function (d) { return d.r })
      .attr('cx', function (d) { return d.x })
      .attr('cy', function (d) { return d.y })

    textName
      .transition(t2)
      .text(function (d) {
        const lengthOftext = d.data.name.length
        const textCategory = d.data.name.slice(3, lengthOftext)
        return d.data.tag === true ? textCategory : ''
      })
      .attr('dx', d => d.x - 40)
      .attr('dy', d => d.y)

    // add label of export value under the category
    textNumber
    .transition(t2)
    .text(function (d) {
      let textValue = Math.round(d.data.exportValue / 10000000)
      return d.data.tag === true ? ' $' + textValue / 100 + ' Billion' : ''
    })
      .attr('dx', d => d.x - 36)
      .attr('dy', d => d.y+ 18)
      
  })

  // end d3.csv function
  // parsing csv data
  function conversor (d) {
    d.total_exports_value = parseInt(d.total_exports_value.replace(/,/g, ''))
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
}