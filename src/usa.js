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
  .projection(d3.geoAlbersUsa().translate([width / 2, height / 2]).scale([880]))
var svg = d3.select('#themap').append('svg')
  .attr('width', width)
  .attr('height', height)

var g = svg.append('g')
var colors = ['#ffc7ff', '#eab2ef', '#d59de0', '#bf8ad1', '#a976c2', '#9364b4', '#7d52a6', '#654098', '#4d308b']
// var colors = ['#4d308b', '#654098', '#7d52a6', '#9364b4', '#a976c2', '#bf8ad1', '#d59de0', '#eab2ef', '#ffc7ff']

// Define linear scale for color output
var mapColor = d3.scaleQuantize()
  .range(colors)
  // .range(['#ebe4eb', '#e4dbea', '#ddd1e9', '#d4c5e8', '#cab8e6', '#c0abe4', '#b69ee2', '#ab91e0', '#a085de'])

var selectedState
// var selectedTime
function selectState (d) {
  selectedState = d.properties.name
  // return d.properties.name
}

// Build U.S. Map
d3.csv('./data/csv/allState2018.csv', function (error, data) {
  if (error) { console.log('error', error) }
  // console.log('data', data)
  mapColor.domain([
    d3.min(data, function (d) { return d.total_trade_activity }),
    d3.max(data, function (d) { return d.total_trade_activity })
  ])

  // load GeoJSON data and merge with allstate2018 data
  d3.json('./data/json/us-states.json', function (error, json) {
    if (error) { console.log('error', error) }
    // console.log('usjson', json)
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

    // Bind the data to the SVG and create one path per GeoJSON feature
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
      .on('click', function (d) {
        // Find previously selected, unselect
        d3.select(".selected").classed("selected", false);
        // Select current item
        d3.select(this).classed("selected", true);

        // Update bar and pack layout charts
        selectState(d)
        updateExportGraph()
        updateImportGraph()
        updateExportPack()
        updateImportPack()
        updateShowState()
      })
      // .on('mouseover', function (d) {
      //   selectState(d)
      //   updateExportGraph()
      //   updateImportGraph()
      //   updateExportPack()
      //   updateImportPack()
      //   updateShowState()
      // })
  })
})

// Build map legend
function buildMapLegend () {
  const w = 280
  const h = 50

  var legend = d3.select('#themap')
    .append('svg')
    .attr('width', w)
    .attr('height', h)
    .attr('class', 'mapLegend')

  // Build bars
  legend.selectAll('rect')
    .data(colors)
    .enter()
    .append('rect')
    .attr('x', (d, i) => i * 30)
    .attr('y', h - 10)
    .attr('height', 10)
    .attr('width', 30)
    .attr('fill', function (d, i) {
      return colors[i]
    })

  legend.append('text')
    .text('Trade Volume')
    .attr('class', 'legend-label')
    .attr('x', (d, i) => (colors.length * 30) / 3)
    .attr('y', h - 25)

  legend.append('text')
    .text('Low')
    .attr('class', 'legend-label')
    .attr('x', 0)
    .attr('y', h - 15)
    .style('font-size', '11px')

  legend.append('text')
    .text('High')
    .attr('class', 'legend-label')
    .attr('x', (d, i) => (colors.length * 30) - 25)
    .attr('y', h - 15)
    .style('font-size', '11px')
}

buildMapLegend()
