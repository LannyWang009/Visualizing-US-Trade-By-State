var slider = document.getElementById('myRange')
var selectedTime
// var output = document.getElementById('demo')

// output.innerHTML = slider.value // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
// slider.oninput = function () {
//   output.innerHTML = this.value
// }

d3.select('input')
  .on('change', function () {
    var sliderValue = +d3.select(this).node().value
    if (sliderValue < 25) { selectedTime = '2014' }
    if (sliderValue < 50 && sliderValue >= 25) { selectedTime = '2015' }
    if (sliderValue < 75 && sliderValue >= 50) { selectedTime = '2016' }
    if (sliderValue < 95 && sliderValue >= 75) { selectedTime = '2017' }
    if (sliderValue <= 100 && sliderValue >= 95) { selectedTime = '2018' }

    updateExportPack()
  })
