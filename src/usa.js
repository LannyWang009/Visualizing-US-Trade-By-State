var width = 960
var height = 500
var path = d3.geoPath() // <- A
  .projection(d3.geoAlbersUsa().scale([900]))
var svg = d3.select('#map').append('svg')
  .attr('width', width)
  .attr('height', height)
var g = svg.append('g')
//   .call(d3.zoom()
//     .scaleExtent([1, 10])
//     .on('zoom', zoomHandler))
d3.json('../../data/json/us.json', function (error, us) {
  if (error) { console.log('error', error) }
  g.insert('path') // <-B
    .datum(topojson.feature(us, us.objects.land))
    .attr('class', 'land')
    .attr('d', path)
  g.selectAll('path.state')
    .data(topojson.feature(us,
      us.objects.states).features) // <-C
    .enter()
    .append('path')
    .attr('class', 'state')
    .attr('d', path)
})
// function zoomHandler () {
//   var transform = d3.event.transform
//   g.attr('transform', 'translate(' +
//     transform.x + ',' + transform.y +
//     ')scale(' + transform.k + ')')
// }
