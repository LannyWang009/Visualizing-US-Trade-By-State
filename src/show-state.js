d3.select('#show-state g')
  .append('text')
  .text('Texas, 2018')
  .attr('x', 250)
  .attr('y', 25)
  .attr('font-size', '30px')
  .attr('fill', 'white')
  .attr('class', 'show-state-name')
  .attr('z-index', 20)

function updateShowState () {
  var stateName = d3.select('#show-state text')
  stateName.remove()
  d3.select('#show-state g')
    .append('text')
    .attr('x', 250)
    .attr('y', 25)
    .attr('fill', 'white')
    .attr('font-size', '30px')
    .attr('class', 'show-state-name')
    .attr('z-index', 20)
    .text(() => {
      var text = []
      if (selectedState) {
        text[0] = selectedState
      } else {
        text[0] = 'Texas'
      };
      if (selectedTime) {
        text[1] = selectedTime
      } else {
        text[1] = '2018'
      };
      return text[0] + ',   ' + text[1]
    })
}
