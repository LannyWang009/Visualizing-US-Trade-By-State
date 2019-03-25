
let exportBarChartData
let dataset
const colors = [
    "#9221ac",
    "#d5c3fc",
    "#a085de",
    "#4d308b",
    "#714fdb"
]

d3.csv("./data/csv/ExportByCountry.csv", numConverter, function(error, data) {
    
    if(error) {
        alert('Something went wrong when trying to load the data.')
    } else {
        let allData = []
        for (let i = 0; i < data.length; i++) {
            if (data[i].State === "Maryland" && data[i].Time === 2018 && data[i].Country != "World Total") {
                allData.push(data[i])
            }
        }

        allData.sort(function (a, b) {
            return b.Exports - a.Exports
        })

        exportBarChartData = allData.slice(0, 10)

    }

    console.log(exportBarChartData)

    const w = 500;
    const h = 400;
    const paddingTopBottom = 15;
    const paddingLeftRight = 100;
    let numItems = Number(exportBarChartData.length)

    let barTooltip = d3.select("#exportBarChart")
                        .append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0)

    const xScale = d3.scaleLinear()
                    .domain([0, d3.max(exportBarChartData, (d) => d.Exports)])
                    .range([paddingLeftRight, w - paddingLeftRight])

    const yScale = d3.scaleLinear()
                    .domain([0, numItems])
                    .range([paddingTopBottom, h - paddingTopBottom])

    const svg = d3.select("#exportBarChart")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h)
                    .attr("class", "exportsChart");

    svg.selectAll("rect")
        .data(exportBarChartData)
        .enter()
        .append("rect")
        .attr("x", paddingLeftRight)
        .attr("y", (d, i) => paddingTopBottom + i * ((h - (2 * paddingTopBottom)) / exportBarChartData.length))
        .attr("width", (d) => xScale(d.Exports))
        .attr("height", (d) => ((h - (2 * paddingTopBottom)) / exportBarChartData.length) - 5)
        .attr("fill", colors[1])
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

    const yAxis = d3.axisLeft(yScale)
                    .tickFormat(function(d, i) { return exportBarChartData[i].Country})

    svg.append("g")
        .attr("class", "axis yaxis")
        .attr("transform", "translate(" + (paddingLeftRight) +")", 0)
        .call(yAxis)

})

function numConverter(d) {
    d.Exports = parseFloat(d.Exports.replace(/,/g, ''));
    d.Time = +d.Time;
    return d;
}

