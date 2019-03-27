
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
    const h = 250;
    const paddingTopBottom = 100;
    const paddingSide = 5;
    let numItems = Number(importBarChartData.length)

    let barTooltip = d3.select("#importBarChart")
                        .append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0)

    const xScale = d3.scaleLinear()
                    .domain([0, numItems])
                    .range([paddingSide, w - paddingSide])

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
        .attr("x", (d, i) => i * ((w - (2 * paddingSide))  / importBarChartData.length))
        .attr("y", (d) => h - paddingTopBottom - yScale(d.Imports))
        .attr("height", (d) => yScale(d.Imports))
        .attr("width", (d) => ((h - (2 * paddingSide)) / importBarChartData.length) - 5)
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

    // svg.selectAll("text")
    //     .data(importBarChartData)
    //     .enter()        
    //     .append("text")
    //     .attr("x", 50)
    //     .attr("y", (d, i) => paddingSide + i * ((w - (2 * paddingSide)) / importBarChartData.length))
    //     .text((d) => d.Country)
    //     .attr("dy", ".35em")
    //     .attr("transform", "rotate(90)")
    //     // (d, i) => h - paddingTopBottom - yScale(d.Imports)
        
    const xAxis = d3.axisBottom(xScale)
                    // .tickFormat(function(d, i) { return importBarChartData[i].Country})

    var axisLabels = function(d) {
        var labels = []
        for (let i = 0; i < 10; i++) {
            labels.push(importBarChartData[i].Country)
        }
        return labels[d]
    }

    svg.append("g")
        .attr("class", "axis xaxis")
        .attr("transform", "translate(0, " + (h - paddingTopBottom) +")")
        .call(xAxis)
        .selectAll("text")
            .text(axisLabels)
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(90)")
})

function numConverter(d) {
    d.Imports = parseFloat(d.Imports.replace(/,/g, ''));
    d.Time = +d.Time;
    return d;
}

