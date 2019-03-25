
let importBarChartData
let dataset
const colors = [
    "#9221ac",
    "#d5c3fc",
    "#a085de",
    "#4d308b",
    "#714fdb"
]

d3.csv("./data/csv/ImportsByCountry.csv", numConverter, function(error, data) {
    console.log(data[0])
    if(error) {
        alert('Something went wrong when trying to load the data.')
    } else {
        let allData = []
        for (let i = 0; i < data.length; i++) {
            if (data[i].State === "Texas" && data[i].Time === 2018 && data[i].Country != "World Total") {
                allData.push(data[i])
            }
        }

        allData.sort(function (a, b) {
            return b.Imports - a.Imports
        })

        importBarChartData = allData.slice(0, 10)

    }

    console.log(importBarChartData)

    const w = 500;
    const h = 400;
    const paddingTopBottom = 15;
    const paddingLeftRight = 100;
    let numItems = Number(importBarChartData.length)

    let barTooltip = d3.select("#importBarChart")
                        .append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0)

    const xScale = d3.scaleLinear()
                    .domain([0, d3.max(importBarChartData, (d) => d.Imports)])
                    .range([paddingLeftRight, w - paddingLeftRight])

    const yScale = d3.scaleLinear()
                    .domain([0, numItems])
                    .range([paddingTopBottom, h - paddingTopBottom])

    const svg2 = d3.select("#importBarChart")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h)
                    .attr("class", "exportsChart");
                    
    svg2.selectAll("rect")
        .data(importBarChartData)
        .enter()
        .append("rect")
        .attr("x", paddingLeftRight)
        .attr("y", (d, i) => paddingTopBottom + i * ((h - (2 * paddingTopBottom)) / importBarChartData.length))
        .attr("width", (d) => xScale(d.Imports))
        .attr("height", (d) => ((h - (2 * paddingTopBottom)) / importBarChartData.length) - 5)
        .attr("fill", colors[1])
        .attr("class", "chartBar")
        .on("mouseover", function(d) {

            barTooltip.transition()
                .duration(500)
                .style("opacity", .9)

            format = d3.format(",")

            var tip = "<strong>Total Imports from " + d.Country + ":</strong> $" + format(d.Imports)
            
            barTooltip.html(tip)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {

            barTooltip.transition()
                .duration(500)
                .style("opacity", 0)
        })

    const yAxis = d3.axisLeft(yScale)
                    // .tickFormat(function(d, i) { return importBarChartData[i].Country})

    svg2.append("g")
        .attr("class", "axis yaxis")
        .attr("transform", "translate(" + (paddingLeftRight) +")", 0)
        .call(yAxis)

})

function numConverter(d) {
    d.Imports = parseFloat(d.Imports.replace(/,/g, ''));
    d.Time = +d.Time;
    return d;
}

