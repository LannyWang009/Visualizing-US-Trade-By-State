
let importBarChartData
// let importDataset
const importColors = [
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

    const w = 300;
    const h = 300;
    const paddingTopBottom = 50;
    const paddingLeftRight = 5;
    let numItems = Number(importBarChartData.length)

    let barTooltip = d3.select("#importBarChart")
                        .append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0)

    const xScale = d3.scaleLinear()
                    .domain([0, numItems])
                    .range([paddingLeftRight, w - paddingLeftRight])

    const yScale = d3.scaleLinear()
                    .domain([0, d3.max(importBarChartData, (d) => d.Imports)])
                    .range([paddingTopBottom, h - paddingTopBottom])

    const svg = d3.select("#importBarChart")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h)
                    .attr("class", "exportsChart");
                    
    svg.selectAll("rect")
        .data(importBarChartData)
        .enter()
        .append("rect")
        .attr("x", (d, i) => paddingLeftRight + i * ((h - (2 * paddingLeftRight)) / importBarChartData.length))
        .attr("y", (d) => h - paddingTopBottom - yScale(d.Imports))
        .attr("height", (d) => yScale(d.Imports))
        .attr("width", (d) => ((h - (2 * paddingLeftRight)) / importBarChartData.length) - 5)
        .attr("fill", importColors[1])
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

    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(function(d, i) { return importBarChartData[i].Country})

    svg.append("g")
        .attr("class", "axis yaxis")
        .attr("transform", "translate(0, " + (h - paddingTopBottom) +")")
        .call(xAxis)
})

function numConverter(d) {
    d.Imports = parseFloat(d.Imports.replace(/,/g, ''));
    d.Time = +d.Time;
    return d;
}

