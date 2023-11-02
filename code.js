// Učitavanje CSV datoteke
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
    const yScale = d3.scaleLinear().domain([0, 300]).range([height - 50, 50]);

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
        .on("mouseover", function(event, d) {
            d3.select("#barchart")
                .selectAll("rect")
                .filter(rect => rect.data[0] === d.pclass)
                .classed("highlight", true);
        })
        .on("mouseout", function(event, d) {
            d3.select("#barchart")
                .selectAll("rect")
                .classed("highlight", false);
        });
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
        d => d.survived
    );

    const xScale = d3.scaleBand().domain(["1", "2", "3"]).range([50, width - 50]).padding(0.2);
    const yScale = d3.scaleLinear().domain([0, d3.max(groupedData, d => d[1].reduce((acc, val) => acc + val[1], 0))]).range([height - 50, 50]);

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
        .attr("y", d => yScale(d[1].filter(item => item[0] === "1")[0][1]))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d[1].filter(item => item[0] === "1")[0][1]) - 50)
        .attr("fill", "green")
        .on("mouseover", function(event, d) {
            d3.select("#scatterplot")
                .selectAll("circle")
                .filter(circle => circle.pclass === d[0])
                .classed("highlight", true);
        })
        .on("mouseout", function(event, d) {
            d3.select("#scatterplot")
                .selectAll("circle")
                .classed("highlight", false);
        });
}
