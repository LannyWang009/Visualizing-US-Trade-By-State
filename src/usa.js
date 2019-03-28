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