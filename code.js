d3.csv('titanic.csv').then(data => {
    drawScatterplot(data);
    drawBarChart(data);
});
function drawScatterplot(data) {
    const svg = d3.select("#scatterplot");
    const width = 500;
    const height = 500;
    svg.attr("width", width).attr("height", height);
    const xScale = d3.scaleLinear().domain([0, 100]).range([50, width - 50]);
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 10)
        .style("text-anchor", "middle")
        .text("Age");
    const yScale = d3.scaleLinear().domain([0, 300]).range([height - 50, 50]);
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 15)
        .attr("x", -(height / 2))
        .style("text-anchor", "middle")
        .text("Fare price");
    svg.append("g")
        .attr("transform", "translate(0," + (height - 50) + ")")
        .call(d3.axisBottom(xScale));
    svg.append("g")
        .attr("transform", "translate(50,0)")
        .call(d3.axisLeft(yScale));
    svg.selectAll("circle")
        .data(data)
        .enter() 
        .append("circle")
        .attr("cx", d => xScale(d.age))
        .attr("cy", d => yScale(d.fare))
        .attr("r", 5)
        .attr("fill", d => d.survived === "1" ? "green" : "red")
        .attr("class", d => "pclass-" + d.pclass)  
        .on("mouseover", function (event, d) {
            d3.select(this)
                .attr("fill", "silver"); 
            d3.select("#barchart")
                .select(".pclass-" + d.pclass)
                .classed("highlight", true);
        })
        .on("mouseout", function (event, d) {
            d3.select(this)
                .attr("fill", d => d.survived === "1" ? "green" : "red");
            d3.select("#barchart")
                .selectAll("rect")
                .classed("highlight", false);
        });

    const legendData = [
        { color: "green", label: "Preživjeli" },
        { color: "red", label: "Umrli" }
    ];
    const legend = svg.append("g")
        .attr("transform", "translate(" + (width - 120) + "," + 20 + ")");

    legend.selectAll("rect")
        .data(legendData)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", (d, i) => i * 20)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", d => d.color);

    legend.selectAll("text")
        .data(legendData)
        .enter()
        .append("text")
        .attr("x", 15)
        .attr("y", (d, i) => i * 20 + 9)  
        .text(d => d.label);
}

function drawBarChart(data) {
    const svg = d3.select("#barchart");
    const width = 500;
    const height = 300;

    svg.attr("width", width).attr("height", height);

    const groupedData = d3.rollups(
        data,
        v => v.length,
        d => d.pclass,
    );

    const xScale = d3.scaleBand().domain(["1", "2", "3"]).range([50, width - 50]).padding(0.2);
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 10)
        .style("text-anchor", "middle")
        .text("Passenger class");
    const yScale = d3.scaleLinear().domain([0, d3.max(groupedData, d => d[1])]).range([height - 50, 50]);
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 15)
        .attr("x", -(height / 2))
        .style("text-anchor", "middle")
        .text("Number of passengers");
    svg.append("g")
        .attr("transform", "translate(0," + (height - 50) + ")")
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .attr("transform", "translate(50,0)")
        .call(d3.axisLeft(yScale));
    svg.selectAll("rect")
        .data(groupedData)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d[0]))
        .attr("y", d => yScale(d[1])) 
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - 50 - yScale(d[1]))  
        .attr("fill", "gray")
        .attr("class", d => "pclass-" + d[0])
        .on("mouseover", function (event, d) {
            d3.select("#scatterplot")
                .selectAll(".pclass-" + d[0])
                .classed("highlight", true);
        })
        .on("mouseout", function (event, d) {
            d3.select("#scatterplot")
                .selectAll("circle")
                .classed("highlight", false);
        });
}
