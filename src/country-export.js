
let exportBarChartData

const exportColors = [
  '#9221ac',
  '#d5c3fc',
  '#a085de',
  '#4d308b',
  '#714fdb'
]

function renderExportGraph () {
  d3.csv('./data/csv/ExportByCountry.csv', numConverter, exportGraph)

  function numConverter (d) {
    d.Exports = parseFloat(d.Exports.replace(/,/g, ''))
    d.Time = +d.Time
    return d
  }
}

renderExportGraph()

function exportGraph (error, data) {
  // Filter dataset
  if (error) {
    console.log('Error occurred while loading data:', error)
  } else {
    let statesData = []
    for (let i = 0; i < data.length; i++) {
      if (data[i].State === 'Texas' && data[i].Time === 2018 && data[i].Country != 'World Total') {
        statesData.push(data[i])
      }
    }

    statesData.sort(function (a, b) {
      return b.Exports - a.Exports
    })

    exportBarChartData = statesData.slice(0, 10)
  }

  console.log(exportBarChartData, exportBarChartData.length)

  // Build Export Bar Chart Graph
  const w = 550
  const h = 280
  const padding = 30

  // Build tooltip
  let barTooltip = d3.select('#exportBarChart')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0)

  // Define scales
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(exportBarChartData, (d) => d.Exports)])
    .range([padding, w])

  // Add Chart svg
  const svg = d3.select('#exportBarChart')
    .append('svg')
    .attr('width', w)
    .attr('height', h)
    .attr('class', 'exportsChart')

  // Build bars
  svg.selectAll('rect')
    .data(exportBarChartData)
    .enter()
    .append('rect')
    .attr('x', padding)
    .attr('y', (d, i) => i * (h / exportBarChartData.length))
    .attr('height', (d) => (h / exportBarChartData.length) - 5)
    .attr('width', (d) => xScale(d.Exports))
    .attr('fill', '#C85FE5')
    .attr('class', 'chartBar')
    .on('mouseover', function (d) {
      barTooltip.transition()
        .duration(500)
        .style('opacity', 0.9)

      format = d3.format(',')

      var tip = '<strong>Total Exports to ' + d.Country + ':</strong> $' + format(d.Exports)

      barTooltip.html(tip)
        .style('left', (d3.event.pageX) + 'px')
        .style('top', (d3.event.pageY - 28) + 'px')
    })
    .on('mouseout', function (d) {
      barTooltip.transition()
        .duration(500)
        .style('opacity', 0)
    })

  svg.selectAll('text')
    .data(exportBarChartData)
    .enter()
    .append('text')
    .text(function (d, i) {
      return exportBarChartData[i].Country
    })
    .attr('text-anchor', 'left')
    .attr('y', (d, i) => 18 + i * (h / exportBarChartData.length))
    .attr('x', padding + 5)
    .attr('fill', 'white')
    .attr('class', 'chart-label')
}

// Update Export Bar Chart
function updateExportGraph () {
  d3.csv('./data/csv/ExportByCountry.csv', numConverter, updatedExportGraph)

  function numConverter (d) {
    d.Exports = parseFloat(d.Exports.replace(/,/g, ''))
    // d.Time = +d.Time
    return d
  }
}

function updatedExportGraph (error, data) {
  var filters = {
    state: selectedState || 'Texas',
    time: selectedTime || '2018'
  }

  // Filter dataset
  if (error) {
    console.log('Error occurred while loading data:', error)
  } else {
    let statesData = []
    for (let i = 0; i < data.length; i++) {
      if (data[i].State === filters.state && data[i].Time === filters.time && data[i].Country != 'World Total') {
        statesData.push(data[i])
      }
    }

    statesData.sort(function (a, b) {
      return b.Exports - a.Exports
    })

    exportBarChartData = statesData.slice(0, 10)
  }

  // console.log(exportBarChartData, exportBarChartData.length)

  const w = 550
  const h = 280
  const padding = 30

  // Update tooltip
  let barTooltip = d3.select('#exportBarChart')

  barTooltip.exit().remove()

  barTooltip.enter()
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0)

  // Define scales
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(exportBarChartData, (d) => d.Exports)])
    .range([padding, w])

  // Update chart
  const svg = d3.select('#exportBarChart')

  // Update bars
  svg.selectAll('rect')
    .data(exportBarChartData)
    .transition().duration(1000)
    .attr('x', padding)
    .attr('y', (d, i) => i * (h / exportBarChartData.length))
    .attr('height', (d) => (h / exportBarChartData.length) - 5)
    .attr('width', (d) => xScale(d.Exports))
    .attr('fill', '#C85FE5')
    .attr('class', 'chartBar')

  // Update labels
  svg.selectAll('text')
    .data(exportBarChartData)
    .transition()
    .delay(function (d, i) {
      return i * 50
    })
    .duration(2000)
    .text(function (d, i) {
      return exportBarChartData[i].Country
    })
    .attr('text-anchor', 'left')
    .attr('y', (d, i) => 18 + i * (h / exportBarChartData.length))
    .attr('x', padding + 5)
    .attr('fill', 'white')
    .attr('class', 'chart-label')
}
