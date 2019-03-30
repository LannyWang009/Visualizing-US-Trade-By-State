function updateImportPack () {
  d3.csv('./data/csv/StateImportData.csv', conversor, function (csvdata) {
    var filters = {
      'state': selectedState || 'Texas',
      'time': selectedTime || '2018'
    }
    // ================= filter the data =========
    const updatedDatasetImport = csvdata.filter(function (row) {
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
    console.log('updatedDatasetImport: ', updatedDatasetImport)

    // =========== scaling function ===========
    const importValue = updatedDatasetImport.map(element => { return (element.total_import_values) })
    const biggest3data = importValue.sort(function (a, b) { return b - a }).slice(0, 5)

    // ==================Size of the SVG==========

    var s = 410
    const max = d3.max(importValue)
    const range = [0, s]
    const domain = [0, max]
    var linearscale = d3.scaleLinear()
      .domain(domain)
      .range(range)

    var data = {
      'name': 'Total',
      'children': updatedDatasetImport.map(element => {
        if (biggest3data.includes(element.total_import_values)) {
          console.log('show label', element.commodity)
          return { 'name': element.commodity, 'value': linearscale(element.total_import_values), 'importValue': element.total_import_values, 'tag': true }
        } else {
          return { 'name': element.commodity, 'value': linearscale(element.total_import_values), 'importValue': element.total_import_values, 'tag': false }
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

    // hierarchy
    var rootNode = d3.hierarchy(data)
      .sum(function (d) {
        return d.value
      })

    // =====================JOIN==========================
    var nodes = d3.select('#packLayout-import svg g')
      .selectAll('circle')
      .data(packLayout(rootNode).descendants())

    var text = d3.select('#packLayout-import svg g')
      .selectAll('text')
      .data(packLayout(rootNode).descendants())

    // var textNumber = d3.select('#packLayout-import svg g')
    //   .selectAll('.layout-label-number')
    //   .data(packLayout(rootNode).descendants())

    // ==========================EXIT=================================

    nodes.exit()
      .style('fill', function (d) { return switchColor(d.data.name) })
      .transition(t)
      .remove()

    text.exit().transition(t).remove()
    // textNumber.exit().transition(t).remove()

    // =====================UPDATE====================

    nodes.transition(t)
      .style('fill', function (d) { return switchColor(d.data.name) })
      .attr('r', function (d) { return d.r })
      .attr('cx', function (d) { return d.x })
      .attr('cy', function (d) { return d.y })
    // show tips on mouseover
      .on('mouseover', function (d) {
        const xPosition = parseFloat(d.x)
        const yPosition = parseFloat(d.y)
        const lengthOftext = d.data.name.length
        const textCategory = d.data.name.slice(3, lengthOftext)
        const textValue = Math.round(d.data.importValue / 10000000)
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
                return textCategory + ', $' + textValue / 100 + ' B'
              } else { return '' }
            }

          )
      })
      .on('mouseout', function (d) {
        d3.select('#tooltip').remove()
      })

    text.transition(t)
      .append('text')
      .attr('class', 'packlayout-import-label')
      .attr('class', 'layout-label-text')
      .attr('dy', (d) => { return d.y })
      .attr('dx', (d) => d.x - 40)
      .text(function (d) {
        const lengthOftext = d.data.name.length
        const textCategory = d.data.name.slice(3, lengthOftext)
        return d.data.tag === true ? textCategory : ''
      })

    // add label of import value under the category
    // textNumber.transition(t)
    //   .append('text')
    //   .attr('class', 'packlayout-import-label')
    //   .attr('class', 'layout-label-number')
    //   .attr('dx', d => d.x - 36)
    //   .attr('dy', d => d.y18)
    //   .text(function (d) {
    //     let textValue = Math.round(d.data.importValue / 10000000)
    //     return d.data.tag === true ? ' $' + textValue / 100 + ' Billion' : ''
    //   })
  })

  // end d3.csv function
  // parsing csv data
  function conversor (d) {
    d.total_import_values = parseInt(d.total_import_values.replace(/,/g, ''))
    // console.log(d.total_import_values)
    return d
  }

  // use for the sorting function
  function compare (a, b) {
    const valueA = a.total_import_values
    const valueB = b.total_import_values
    let comparison = 0
    if (valueA > valueB) {
      comparison = 1
    } else if (valueA < valueB) {
      comparison = -1
    }
    return comparison
  }
}
