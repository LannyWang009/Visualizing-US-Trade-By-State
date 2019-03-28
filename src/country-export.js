
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

    //Filter dataset
    if(error) {
        console.log('Error occurred while loading data:', error)
    } else {
        let statesData = []
        for (let i = 0; i < data.length; i++) {
            if (data[i].State === "Texas" && data[i].Time === 2018 && data[i].Country != "World Total") {
                statesData.push(data[i])
            }
        }

        statesData.sort(function (a, b) {
            return b.Exports - a.Exports
        })

        exportBarChartData = statesData.slice(0, 10)

    }

    console.log(exportBarChartData, exportBarChartData.length)

    //Build Export Bar Chart Graph
    const w = 400;
    const h = 225;
    const padding = 30

    //Build tooltip
    let barTooltip = d3.select("#exportBarChart")
                        .append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0)

    //Define scales
    const xScale = d3.scaleLinear()
                    .domain([0, d3.max(exportBarChartData, (d) => d.Exports)])
                    .range([padding, w]);
 
    //Add Chart svg
    const svg = d3.select("#exportBarChart")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h)
                    .attr("class", "exportsChart");

    //Build bars
    svg.selectAll("rect")
        .data(exportBarChartData)
        .enter()
        .append("rect")
        .attr("x", padding)
        .attr("y", (d, i) => i * (h / exportBarChartData.length))
        .attr("height", (d) => (h / exportBarChartData.length) - 5)
        .attr("width", (d) => xScale(d.Exports))
        .attr("fill", "#9B88D8")
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

        svg.selectAll("text")
        .data(exportBarChartData)
        .enter()
        .append("text")
        .text(function(d, i) {
                return exportBarChartData[i].Country;
        })
        .attr("text-anchor", "left")
        .attr("y", (d, i) => 11 + i * (h / exportBarChartData.length))
        .attr("x", padding + 5)
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white")

}



