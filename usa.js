var width = 960,
height = 500;
var path = d3.geoPath() // <- A
.projection(d3.geoAlbersUsa());
var svg = d3.select("body").append("svg")
.attr("width", width)
.attr("height", height);
var g = svg.append('g')
.call(d3.zoom()
        .scaleExtent([1, 10])
        .on("zoom", zoomHandler));
d3.json("../../data/us.json", function (error, us) {
g.insert("path") // <-B
    .datum(topojson.feature(us, us.objects.land))
    .attr("class", "land")
    .attr("d", path);
g.selectAll("path.state")
        .data(topojson.feature(us,
                us.objects.states).features) // <-C
    .enter()
        .append("path")
        .attr("class", "state")
        .attr("d", path);
});
function zoomHandler() {
var transform = d3.event.transform;
g.attr("transform", "translate("
    + transform.x + "," + transform.y
    + ")scale(" + transform.k + ")");
}