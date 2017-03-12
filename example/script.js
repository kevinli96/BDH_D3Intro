// *************************************************************************************


// 1: Set up dimensions of SVG
// We need a margin so that we can fit our axes labels outside of our 
// data points, but still within our svg.
var margin = {
        top: 30,
        right: 30,
        bottom: 60,
        left: 60
    },
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// 2: Create SVG
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// 3: Scales
// Scales map from domains to range. Here we specify the range 
// to be the coordinates of our svg element.
var x = d3.scale.linear()
    .range([0, width]);
var y = d3.scale.linear()
    .range([height, 0]);
var color = d3.scale.category10();

// 4: Axes
// Feel free to change the orient positions or number of ticks
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(6);
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(6);

// 5: Graph
// The 'g' tag denotes a grouping of svg elements, useful for applying the same
// css stylings 
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(yAxis);

// 6: Axes Labels (x,y) => (sepal length, sepal width)
svg.append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + width / 2 + "," + (height + margin.bottom / 2) + ")");
svg.append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + margin.left / -2 + "," + height / 2 + ")rotate(-90)");

var tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip');

tooltip.append('div')
    .attr('class', 'length');

tooltip.append('div')
    .attr('class', 'width');

tooltip.append('div')
    .attr('class', 'species');

//7: Join, Update, Enter, Exit
var time = 300,
    radius = 5;
// 7.1: Get Traits
// 7.2: Update Axes Labels
function update(iris) {
    svg.selectAll("text.label")
        .data(["Sepal Length", "Sepal Width"])
        .text(function(d) {
            return d;
        });

    // 7.3: Scale Domains
    x.domain([d3.min(iris, function(d) {
            return d["Sepal Length"];
        }),
        d3.max(iris, function(d) {
            return d["Sepal Length"];
        })
    ]);
    y.domain([d3.min(iris, function(d) {
            return d["Sepal Width"];
        }),
        d3.max(iris, function(d) {
            return d["Sepal Width"];
        })
    ]);

    svg.select('.x.axis').transition().duration(time).call(xAxis);
    svg.select(".y.axis").transition().duration(time).call(yAxis);

    // 7.5: JOIN new data with old elements.
    var flower = svg.selectAll("circle")
        .data(iris).enter().append("circle")
        .attr("cx", function(d) {
            return x(d["Sepal Length"]);
        })
        .attr("cy", function(d) {
            return y(d["Sepal Width"]);
        })
        .attr("r", radius)
        .style("fill", function(d) {
            return color(d["Species"]);
        })
        .style("fill-opacity", 1e-6)
        .transition(time)
        .style("fill-opacity", 1);

    d3.selectAll("circle").on('mouseover', function(d) {
        console.log(d)
        tooltip.select('.length').html("length: " + d["Sepal Length"]);
        tooltip.select('.width').html("width: " + d["Sepal Width"]);
        tooltip.select('.species').html(d["Species"]);
        tooltip.style('display', 'block');
    })
    d3.selectAll("circle").on('mouseout', function() {
        tooltip.style('display', 'none');
    });

}



// update(iris);