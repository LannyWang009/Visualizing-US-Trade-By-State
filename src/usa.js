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
      })


  })
}
)

function updateExportGraph() {
  d3.csv("./data/csv/ExportByCountry.csv", numConverter, renderUpdate)

  function numConverter(d) {
      d.Exports = parseFloat(d.Exports.replace(/,/g, ''));
      d.Time = +d.Time;
      return d;
  }
}

function renderUpdate(error, data) {

  if(error) {
      console.log('this is the error:', error)
  } else {
      let allData = []
      console.log('export file:', selectedState)
      for (let i = 0; i < data.length; i++) {
          if (data[i].State === selectedState && data[i].Time === 2018 && data[i].Country != "World Total") {
              allData.push(data[i])
          }
      }

      allData.sort(function (a, b) {
          return b.Exports - a.Exports
      })

      exportBarChartData = allData.slice(0, 10)

  }

  console.log(exportBarChartData)

  const w = 300;
  const h = 250;
  const paddingTopBottom = 100;
  const paddingLeftRight = 5;
  let numItems = Number(exportBarChartData.length)

  let barTooltip = d3.select("#exportBarChart")

  barTooltip.exit().remove()

  barTooltip.enter()
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)

  const xScale = d3.scaleLinear()
                  .domain([0, numItems])
                  .range([paddingLeftRight, w - paddingLeftRight])

  const yScale = d3.scaleLinear()
                  .domain([0, d3.max(exportBarChartData, (d) => d.Exports)])
                  .range([paddingTopBottom, h - paddingTopBottom])

  let svg = d3.select("#exportBarChart")

  svg.selectAll("rect")
      .data(exportBarChartData)
      .transition().duration(750)
      .attr("x", (d, i) => paddingLeftRight + i * ((h - (2 * paddingLeftRight)) / exportBarChartData.length))
      .attr("y", (d) => h - paddingTopBottom - yScale(d.Exports))
      .attr("height", (d) => yScale(d.Exports))
      .attr("width", (d) => ((h - (2 * paddingLeftRight)) / exportBarChartData.length) - 5)
      .attr("fill", exportColors[1])
      .attr("class", "chartBar")
      .on("mouseover", function(d) {

          barTooltip.transition()
              .duration(500)
              .style("opacity", .9)

          format = d3.format(",")

          var tip = "<strong>Total Exports to " + d.Country + ":</strong> $" + format(d.Exports)
          
          barTooltip.html(tip)
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {

          barTooltip.transition()
              .duration(500)
              .style("opacity", 0)
      })

  const xAxis = d3.axisBottom(xScale)

  var exportAxisLabels = function(d) {
      var labels = []
          for (let i = 0; i < 10; i++) {
              labels.push(exportBarChartData[i].Country)
          }
      return labels[d]
  }

  svg.append("g")
      .attr("class", "axis xaxis")
      .attr("transform", "translate(0, " + (h - paddingTopBottom) +")")
      .call(xAxis)
      .selectAll("text")
          .text(exportAxisLabels)
          .attr("y", 0)
          .attr("x", 9)
          .attr("dy", ".35em")
          .attr("transform", "rotate(90)")

}



