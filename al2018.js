var dataset; //global var for
d3.csv('al2018.csv', conversor, function(data){
    console.log(data)
    dataset = data
})
function conversor(d){
    d.total_exports_value = +d.total_exports_value
    return d
}

