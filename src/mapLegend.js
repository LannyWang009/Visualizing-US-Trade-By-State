


d3.csv('../../data/csv/allState2018.csv', function (error, data) {

    if (error) { console.log('There was an error loading the legend data: ', error) }

    // Define linear scale for color output
    var mapColor = d3.scaleQuantize()
                    .range(['#ebe4eb', '#e4dbea', '#ddd1e9', '#d4c5e8', '#cab8e6', '#c0abe4', '#b69ee2', '#ab91e0', '#a085de'])
                    .domain([
                                d3.min(data, function (d) { return d.total_trade_activity }),
                                d3.max(data, function (d) { return d.total_trade_activity })
                            ])

    for (var i = 0; i < data.length; i++) {
        // grab the state name and total trade activity value in billions
        var dataState = data[i].state
        var dataValue = data[i].total_trade_activity
                                                
    }
    
    var legend = d3.select("#map-slider")
                    .append('svg')
                    
    var legendHeader = d3.select("#map-slider")
                            .attr("width", 200)
                            .attr("height", 50)
    
    legendHeader.append("text")
                .text("Trade Volume")
                .style("color", "white")
                .attr({
                    x: 0,
                    y: 0,
                    class: "tradelabel"
                })
    var mapLegend = d3.select("#map-slider")

})


