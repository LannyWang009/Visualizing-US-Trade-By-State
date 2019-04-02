
let importBarChartData

const importColors = [
  '#9221ac',
  '#d5c3fc',
  '#a085de',
  '#4d308b',
  '#714fdb'
]

function renderImportGraph () {
  d3.csv('./data/csv/ImportsByCountry.csv', numConverter, importGraph)

  function numConverter (d) {
    d.Imports = parseFloat(d.Imports.replace(/,/g, ''))
    d.Time = +d.Time
    return d
  }
}

renderImportGraph()

function importGraph (error, data) {
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
      return b.Imports - a.Imports
    })

    importBarChartData = statesData.slice(0, 10)
  }

  console.log(importBarChartData, importBarChartData.length)

  // Build Import Bar Chart Graph
  const w = 550
  const h = 280
  const padding = 30

  // Build tooltip
  let barTooltip = d3.select('#importBarChart')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0)

  // Define scales
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(importBarChartData, (d) => d.Imports)])
    .range([padding, w])

  // Add Chart svg
  const svg = d3.select('#importBarChart')
    .append('svg')
    .attr('width', w)
    .attr('height', h)
    .attr('class', 'importsChart')

  // Build bars
  svg.selectAll('rect')
    .data(importBarChartData)
    .enter()
    .append('rect')
    .attr('x', padding)
    .attr('y', (d, i) => i * (h / importBarChartData.length))
    .attr('height', (d) => (h / importBarChartData.length) - 5)
    .attr('width', (d) => xScale(d.Imports))
    .attr('fill', '#6B56D3')
    .attr('class', 'chartBar')
    .on('mouseover', function (d) {
      barTooltip.transition()
        .duration(500)
        .style('opacity', 0.9)

      format = d3.format(',')

      var tip = '<strong>Total Imports from ' + d.Country + ':</strong> $' + format(d.Imports)

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
    .data(importBarChartData)
    .enter()
    .append('text')
    .text(function (d, i) {
      return importBarChartData[i].Country
    })
    .attr('text-anchor', 'left')
    .attr('y', (d, i) => 18 + i * (h / importBarChartData.length))
    .attr('x', padding + 5)
    .attr('fill', 'white')
    .attr('class', 'chart-label')
}

// Update Import Bar Chart
function updateImportGraph () {
  d3.csv('./data/csv/ImportsByCountry.csv', numConverter, updatedImportGraph)

  function numConverter (d) {
    d.Imports = parseFloat(d.Imports.replace(/,/g, ''))
    // d.Time = +d.Time
    return d
  }
}

function updatedImportGraph (error, data) {
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
      return b.Imports - a.Imports
    })

    importBarChartData = statesData.slice(0, 10)
  }

  // console.log(importBarChartData, importBarChartData.length)

  const w = 550
  const h = 280
  const padding = 30

  // Update tooltip
  let barTooltip = d3.select('#importBarChart')

  barTooltip.exit().remove()

  barTooltip.enter()
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0)

  // Define scales
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(importBarChartData, (d) => d.Imports)])
    .range([padding, w])

  // Update chart
  const svg = d3.select('#importBarChart')

  // Update bars
  svg.selectAll('rect')
    .data(importBarChartData)
    .transition().duration(1000)
    .attr('x', padding)
    .attr('y', (d, i) => i * (h / importBarChartData.length))
    .attr('height', (d) => (h / importBarChartData.length) - 5)
    .attr('width', (d) => xScale(d.Imports))
    .attr('fill', '#6B56D3')
    .attr('class', 'chartBar')

  // Update labels
  svg.selectAll('text')
    .data(importBarChartData)
    .transition()
    .delay(function (d, i) {
      return i * 50
    })
    .duration(2000)
    .text(function (d, i) {
      return importBarChartData[i].Country
    })
    .attr('text-anchor', 'left')
    .attr('y', (d, i) => 18 + i * (h / importBarChartData.length))
    .attr('x', padding + 5)
    .attr('fill', 'white')
    .attr('class', 'chart-label')
}
