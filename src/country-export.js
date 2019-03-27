
let exportBarChartData

const exportColors = [
    "#9221ac",
    "#d5c3fc",
    "#a085de",
    "#4d308b",
    "#714fdb"
]

function renderExportGraph() {
    d3.csv("./data/csv/ExportByCountry.csv", numConverter, exportGraph)

    function numConverter(d) {
        d.Exports = parseFloat(d.Exports.replace(/,/g, ''));
        d.Time = +d.Time;
        return d;
    }
}

renderExportGraph()

function exportGraph(error, data) {
    // if (selectedState === undefined) {
    //     selectedState = "Texas"
    // }

    if(error) {
        console.log('this is the error:', error)
    } else {
        let allData = []
        console.log('export file:', selectedState)
        for (let i = 0; i < data.length; i++) {
            if (data[i].State === "Texas" && data[i].Time === 2018 && data[i].Country != "World Total") {
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
                        .append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0)

    const xScale = d3.scaleLinear()
                    .domain([0, numItems])
                    .range([paddingLeftRight, w - paddingLeftRight])

    const yScale = d3.scaleLinear()
                    .domain([0, d3.max(exportBarChartData, (d) => d.Exports)])
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
                    // .tickFormat(function(d, i) { return exportBarChartData[i].Country})

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



