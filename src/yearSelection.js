var slider = document.getElementById('myRange')
var selectedTime

d3.select('input')
  .on('change', function () {
    var sliderValue = +d3.select(this).node().value
    if (sliderValue < 25) { selectedTime = '2014' }
    if (sliderValue < 50 && sliderValue >= 25) { selectedTime = '2015' }
    if (sliderValue < 75 && sliderValue >= 50) { selectedTime = '2016' }
    if (sliderValue < 95 && sliderValue >= 75) { selectedTime = '2017' }
    if (sliderValue <= 100 && sliderValue >= 95) { selectedTime = '2018' }

    updateExportPack()
    updateImportPack()
    updateImportGraph()
    updateExportGraph()
    updateShowState()
  })

// ============All about assignming Colors==================
var expColors =
['#ae3871',
  '#3e40d3',
  '#df6fa3',
  '#4e1ab2',
  '#e53296',
  '#5f8ddb',
  '#7a28d1',
  '#7a2255',
  '#9251f2',
  '#752063',
  '#4d62ea',
  '#b93497',
  '#6a7ee8',
  '#e04eca',
  '#445ba7',
  '#d851ec',
  '#313380',
  '#e78bd7',
  '#37149a',
  '#b390e0',
  '#48218e',
  '#bb6fce',
  '#502a69',
  '#aa3dcf',
  '#7a53a0',
  '#7231b8',
  '#a34e97',
  '#574db8',
  '#682278',
  '#a16de7',
  '#9131a7']

// var expColors =
// ['#7fc5c9',
//   '#ecb1c2',
//   '#b2e5c2',
//   '#7fcfe0',
//   '#d6eec0',
//   '#ffcbbd',
//   '#abc89b',
//   '#dabbe9',
//   '#a2ece5',
//   '#ccd9a6',
//   '#c1bced',
//   '#cac092',
//   '#a6c3ed',
//   '#e9bc99',
//   '#87c9ed',
//   '#eeebc0',
//   '#bbe4ee',
//   '#d0b89c',
//   '#bad6d0',
//   '#e2a997',
//   '#94c5b3',
//   '#ddb2b6',
//   '#b5e6bb',
//   '#e1d9ee',
//   '#bbc5aa',
//   '#c1b3d0',
//   '#e7ddc9',
//   '#acbed0',
//   '#edd3d5',
//   '#c9b6b0',
//   '#9131a7']

function switchColor (commodity) {
  switch (commodity) {
    case '111 Agricultural Products':return '#9221ac'
    case '112 Livestock & Livestock Products':return '#d5c3fc'
    case '113 Forestry Products, Nesoi':return expColors[2]
    case '114 Fish, Fresh/chilled/frozen & Other Marine Products': return expColors[3]
    case '211 Oil & Gas': return '#714fdb'
    case '212 Minerals & Ores': return expColors[5]
    case '311 Food & Kindred Products': return expColors[6]
    case '312 Beverages & Tobacco Products': return '#a085de'
    case '313 Textiles & Fabrics': return expColors[8]
    case '314 Textile Mill Products': return expColors[9]
    case '315 Apparel & Accessories': return expColors[10]
    case '316 Leather & Allied Products': return expColors[11]
    case '321 Wood Products': return expColors[12]
    case '322 Paper': return expColors[13]
    case '323 Printed Matter And Related Products, Nesoi': return expColors[14]
    case '324 Petroleum & Coal Products': return expColors[15]
    case '325 Chemicals': return '#4d308b'
    case '326 Plastics & Rubber Products': return expColors[17]
    case '327 Nonmetallic Mineral Products': return expColors[18]
    case '331 Primary Metal Mfg': return expColors[19]
    case '332 Fabricated Metal Products, Nesoi': return expColors[20]
    case '333 Machinery, Except Electrical': return expColors[21]
    case '334 Computer & Electronic Products': return expColors[22]
    case '335 Electrical Equipment, Appliances & Components': return expColors[23]
    case '336 Transportation Equipment': return expColors[24]
    case '337 Furniture & Fixtures': return expColors[25]
    case '339 Miscellaneous Manufactured Commodities': return expColors[26]
    case '910 Waste And Scrap': return expColors[27]
    case '930 Used Or Second-hand Merchandise': return expColors[28]
    case '980 Goods Returned (exports For Canada Only)': return expColors[29]
    case '990 Other Special Classification Provisions': return expColors[30]
    default:return 'rgba(0, 0, 0, 0)'
  }
}
