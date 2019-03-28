/* This visualization was made possible by modifying code provided by:
Scott Murray, Choropleth example from "Interactive Data Visualization for the Web"
https://github.com/alignedleft/d3-book/blob/master/chapter_12/05_choropleth.html

Nick Zhu, D3 Cookbook2, Chapter 12
https://github.com/NickQiZhu/d3-cookbook/blob/master/src/chapter12/usa.html

Michelle Chandra's "Basic US State Map -D3"
http://bl.ocks.org/michellechandra/0b2ce4923dc9b5809922
*/

// define the size of the map
var width = 960 * 0.7
var height = 500 * 0.95
var path = d3.geoPath() // <- A
  .projection(d3.geoAlbersUsa().translate([width / 2, height / 2]).scale([800]))
var svg = d3.select('#themap').append('svg')
  .attr('width', width)
  .attr('height', height)

var g = svg.append('g')

// Define linear scale for color output
var mapColor = d3.scaleQuantize()
  .range(['#ebe4eb', '#e4dbea', '#ddd1e9', '#d4c5e8', '#cab8e6', '#c0abe4', '#b69ee2', '#ab91e0', '#a085de'])

var selectedState;
function selectState(d) {
  console.log(d.properties.name)
  selectedState = d.properties.name
  // return d.properties.name
}

d3.csv('../../data/csv/allState2018.csv', function (error, data) {
  if (error) { console.log('error', error) }
  console.log('data', data)
  mapColor.domain([
    d3.min(data, function (d) { return d.total_trade_activity }),
    d3.max(data, function (d) { return d.total_trade_activity })
  ])

  // load GeoJSON data and merge with allstate2018 data
  d3.json('../../data/json/us-states.json', function (error, json) {
    if (error) { console.log('error', error) }
    console.log('usjson', json)
    for (var i = 0; i < data.length; i++) {
      // grab te state name and total trade activity value in billions
      var dataState = data[i].state
      var dataValue = data[i].total_trade_activity

      // Find the corresponding state inside the GeoJSON
      for (var j = 0; j < json.features.length; j++) {
        var jsonState = json.features[j].properties.name
        if (dataState == jsonState) {
          // copy the data value into the json
          json.features[j].properties.value = dataValue
          // stop looking through the json
          break
        }
      }
    }

    // Bind the data to the SVG and create one ath per GeoJSON feature
    svg.selectAll('path')
      .data(json.features)
      .enter()
      .append('path')
      .attr('d', path)
      .style('stroke', 'grey')
      .style('fill', function (d) {
        let value = d.properties.value
        if (value) {
          return mapColor(value)
        } else {
          return 'grey'
        }
      })
      .on("click", function(d) {
        selectState(d)
        updateExportGraph()
        updateImportGraph()
        updateExportPack()
      })
      .on('mouseover', function(d){
        selectState(d)
        updateExportGraph()
        updateImportGraph()

      })
      


  })
}
)

//Update Export Bar Chart
function updateExportGraph() {
  d3.csv("./data/csv/ExportByCountry.csv", numConverter, updatedExportGraph)

  function numConverter(d) {
      d.Exports = parseFloat(d.Exports.replace(/,/g, ''));
      d.Time = +d.Time;
      return d;
  }
}

function updatedExportGraph(error, data) {

  //Filter dataset
  if(error) {
      console.log('Error occurred while loading data:', error)
  } else {
      let statesData = []
      for (let i = 0; i < data.length; i++) {
          if (data[i].State === selectedState && data[i].Time === 2018 && data[i].Country != "World Total") {
              statesData.push(data[i])
          }
      }

      statesData.sort(function (a, b) {
          return b.Exports - a.Exports
      })

      exportBarChartData = statesData.slice(0, 10)

  }

  // console.log(exportBarChartData, exportBarChartData.length)

  const w = 400;
  const h = 225;
  const padding = 30

  //Update tooltip
  let barTooltip = d3.select("#exportBarChart")
  
  barTooltip.exit().remove()

  barTooltip.enter()
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)

  //Define scales
  const xScale = d3.scaleLinear()
                  .domain([0, d3.max(exportBarChartData, (d) => d.Exports)])
                  .range([padding, w]);

//Update chart
  const svg = d3.select("#exportBarChart")

  //Update bars
  svg.selectAll("rect")
      .data(exportBarChartData)
      .transition().duration(1000)
      .attr("x", padding)
      .attr("y", (d, i) => i * (h / exportBarChartData.length))
      .attr("height", (d) => (h / exportBarChartData.length) - 5)
      .attr("width", (d) => xScale(d.Exports))
      .attr("fill", "#9B88D8")
      .attr("class", "chartBar")

  //Update labels
  svg.selectAll("text")
      .data(exportBarChartData)
      .transition()
      .delay(function(d, i) {
        return i * 50;})
      .duration(2000)
      .text(function(d, i) {
              return exportBarChartData[i].Country;
      })
      .attr("text-anchor", "left")
      .attr("y", (d, i) => 11 + i * (h / exportBarChartData.length))
      .attr("x", padding + 5)
      .attr("font-family", "sans-serif")
      .attr("font-size", "11px")
      .attr("fill", "white")

}

//Update Import Bar Chart
function updateImportGraph() {
  d3.csv("./data/csv/ImportsByCountry.csv", numConverter, updatedImportGraph)

  function numConverter(d) {
      d.Imports = parseFloat(d.Imports.replace(/,/g, ''));
      d.Time = +d.Time;
      return d;
  }
}

function updatedImportGraph(error, data) {

  //Filter dataset
  if(error) {
      console.log('Error occurred while loading data:', error)
  } else {
      let statesData = []
      for (let i = 0; i < data.length; i++) {
          if (data[i].State === selectedState && data[i].Time === 2018 && data[i].Country != "World Total") {
              statesData.push(data[i])
          }
      }

      statesData.sort(function (a, b) {
          return b.Imports - a.Imports
      })

      importBarChartData = statesData.slice(0, 10)

  }

  // console.log(importBarChartData, importBarChartData.length)

  const w = 400;
  const h = 225;
  const padding = 30

  //Update tooltip
  let barTooltip = d3.select("#importBarChart")
  
  barTooltip.exit().remove()

  barTooltip.enter()
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)

  //Define scales
  const xScale = d3.scaleLinear()
                  .domain([0, d3.max(importBarChartData, (d) => d.Imports)])
                  .range([padding, w]);

//Update chart
  const svg = d3.select("#importBarChart")

  //Update bars
  svg.selectAll("rect")
      .data(importBarChartData)
      .transition().duration(1000)
      .attr("x", padding)
      .attr("y", (d, i) => i * (h / importBarChartData.length))
      .attr("height", (d) => (h / importBarChartData.length) - 5)
      .attr("width", (d) => xScale(d.Imports))
      .attr("fill", "#9B88D8")
      .attr("class", "chartBar")

  //Update labels
  svg.selectAll("text")
      .data(importBarChartData)
      .transition()
      .delay(function(d, i) {
        return i * 50;})
      .duration(2000)
      .text(function(d, i) {
              return importBarChartData[i].Country;
      })
      .attr("text-anchor", "left")
      .attr("y", (d, i) => 11 + i * (h / importBarChartData.length))
      .attr("x", padding + 5)
      .attr("font-family", "sans-serif")
      .attr("font-size", "11px")
      .attr("fill", "white")

}

//Update Export Pack Layout
function updateExportPack(){
  d3.csv('./data/csv/StateExportData.csv', conversor, function (csvdata) {
    var filters = {
      'state': selectedState,
      'time': '2018'
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
    // console.log('datasetExport', datasetExport)
  
    // =========== scaling function ===========
    const exportValue = datasetExport.map(element => { return (element.total_exports_value) })
    const biggest3data = exportValue.sort(function (a, b) { return b - a }).slice(0, 3)
  
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
      .selectAll('circle')
      .data(rootNode.descendants())
      .transition().duration(1000)
      // .enter()
      // .append('g')
      // .attr('transform', function (d) { return 'translate(' + [d.x, d.y] + ')' })
  
    // nodes
      // .append('circle')
      // .transition().duration(1000)
      .style('fill', function (d) { return switchColor(d.data.name) })
      .attr('cx', function (d) { return d.x })
      .attr('cy', function (d) { return d.y })
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
        const textValue = Math.round(d.data.exportValue / 10000000)
        // create the tooltip label
        d3.select('#packLayout-export svg g').append('text')
          .attr('id', 'tooltip')
          .attr('x', xPosition)
          .attr('y', yPosition)
          .attr('text-anchor', 'middle')
          .attr('fill', 'lavender')
          .text(
            function () {
              if (textValue) {
                return textCategory + ', $' + textValue/100 + ' B'
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
  
  //end d3.csv function
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
    
}
