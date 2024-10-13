// Update data here
const data = [
    { "name": "Build my own Portfolio site", "status": "done" },
    { "name": "Learn Angular.Js", "status": "notDone" },
    { "name": "Get Certified", "status": "inProgress" },
    { "name": "Build a wordle solver - using Python", "status": "notDone" },
    { "name": "Build a simple chatbot using MongoDB", "status": "inProgress" },
    { "name": "Build a mobile application using Flutter", "status": "done" },
];

// Legends here:
const legendItems = [
    { color: "green", text: "Completed" },
    { color: "orange", text: "In Progress" },
    { color: "red", text: "Not Completed" },
];

// Color mapping based on status
const colorScale = d3.scaleOrdinal()
    .domain(["done", "notDone", "inProgress"])
    .range(["green", "red", "orange"]);

// Select the SVG element
const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");

// Define the radius of the nodes
const radius = 20;

// Create simulation
const simulation = d3.forceSimulation(data)
    .force("charge", d3.forceManyBody().strength(-200)) // Repulsive force
    .force("center", d3.forceCenter(width / 2, height / 2)) // Center the simulation
    .force("collide", d3.forceCollide(radius * 2).strength(1)) // Collision force
    .on("tick", ticked); // Update positions on each tick

// Create nodes
const nodes = svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "node floating") // Add the floating class for animation
    .attr("r", radius)
    .attr("fill", d => colorScale(d.status)) // Set color based on status
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

// Add labels to nodes
const labels = svg.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "label")
    .text(d => d.name)
    .style("opacity", 0.5); // Initially hidden until hovered

// Add legend to the SVG
const legend = svg.append("g")
    .attr("transform", `translate(10, 0)`); // Adjust the x value as needed for left positioning

legendItems.forEach((item, i) => {
    legend.append("rect")
        .attr("x", 0)
        .attr("y", i * 30)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", item.color);

    legend.append("text")
        .attr("x", 30) // Adjusted to place the text closer to the rectangles
        .attr("y", 15 + i * 30) // Center the text vertically with the rectangles
        .attr("class", "label")
        .text(item.text);
});


// Update positions on each tick
function ticked() {
    nodes
        .attr("cx", d => {
            // Ensure nodes stay within the SVG boundaries
            d.x = Math.max(radius, Math.min(width - radius, d.x));
            return d.x;
        })
        .attr("cy", d => {
            d.y = Math.max(radius, Math.min(height - radius, d.y));
            return d.y;
        });

    labels
        .attr("x", d => d.x)
        .attr("y", d => d.y + 4); // Offset the text a bit to center it vertically
}

// Drag behaviors
function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

// Hover effect
nodes
    .on("mouseover", function (event, d) {
        d3.select(this)
            .transition()
            .duration(200)
            .attr("r", radius * 1.5)
            .style("fill", "grey");
        svg.selectAll("text")
            .filter(td => td === d)
            .style("opacity", 1);
    })
    .on("mouseout", function (event, d) {
        d3.select(this)
            .transition()
            .duration(200)
            .attr("r", radius)
            .style("fill", colorScale(d.status)); // Reset color based on status
        svg.selectAll("text")
            .filter(td => td === d)
            .style("opacity", 0.5);
    });