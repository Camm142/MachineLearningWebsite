import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import dataCBD from '../data/denormalized_price_cbd.json';
import dataLandsize from '../data/denormalized_price_landsize.json';

const ScatterPlotComponent = () => {
    // State variables to manage the current dataset, x and y fields, and dataset toggle
    const [currentData, setCurrentData] = useState(dataCBD);
    const [xField, setXField] = useState('CBD Distance');
    const [yField, setYField] = useState('Price');
    const [isCBD, setIsCBD] = useState(true);
    const [tooltipData, setTooltipData] = useState(null); // For storing tooltip info
    const svgRef = useRef();

    // Chart dimensions and margins
    const margin = { top: 20, right: 30, bottom: 70, left: 150 };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    useEffect(() => {
        // Initialize the SVG element
        const svg = d3.select(svgRef.current)
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Define scales and axes
        const xScale = d3.scaleLinear().range([0, width]);
        const yScale = d3.scaleLinear().range([height, 0]);
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        // Append axes to the SVG
        svg.append("g").attr("class", "x-axis").attr("transform", `translate(0,${height})`);
        svg.append("g").attr("class", "y-axis");

        // Append axis labels
        svg.append("text")
            .attr("class", "x-axis-label axis-label")
            .attr("x", width / 2)
            .attr("y", height + 50)
            .attr("text-anchor", "middle");

        svg.append("text")
            .attr("class", "y-axis-label axis-label")
            .attr("x", -height / 2)
            .attr("y", -120)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)");

        // Tooltip setup
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background", "#f9f9f9")
            .style("padding", "5px")
            .style("border", "1px solid #d3d3d3")
            .style("border-radius", "5px")
            .style("pointer-events", "none")
            .style("display", "none");

        // Function to update the chart with new data
        const updateChart = (data) => {
            if (!Array.isArray(data)) {
                console.error("Data is not an array:", data);
                return;
            }

            // Set the domains for the scales
            xScale.domain(d3.extent(data, d => d[xField]));
            yScale.domain(d3.extent(data, d => d[yField]));

            // Update the axes
            svg.select(".x-axis").transition().duration(1000).call(xAxis);
            svg.select(".y-axis").transition().duration(1000).call(yAxis);

            // Update the axis labels
            svg.select(".x-axis-label").text(xField);
            svg.select(".y-axis-label").text(yField);

            // Bind data to circles and update their attributes
            const circles = svg.selectAll("circle").data(data);

            circles.enter().append("circle")
                .merge(circles)
                .transition()
                .duration(1000)
                .attr("cx", d => xScale(d[xField]))
                .attr("cy", d => yScale(d[yField]))
                .attr("r", 3) // Smaller radius for the dots
                .attr("fill", d => colorScale(d.kmeans_3));

            circles.exit().remove();

            // Tooltip and interaction events
            svg.selectAll("circle")
                .on("mouseover", function(event, d) {
                    d3.select(this)
                        .transition()
                        .duration(100)
                        .attr("r", 5)
                        .attr("stroke", "black");

                    setTooltipData({
                        cluster: d.kmeans_3,
                        x: d[xField],
                        y: d[yField],
                        position: { x: event.pageX, y: event.pageY }
                    });
                })
                .on("mousemove", function(event) {
                    setTooltipData(prevData => ({
                        ...prevData,
                        position: { x: event.pageX, y: event.pageY }
                    }));
                })
                .on("mouseout", function() {
                    d3.select(this)
                        .transition()
                        .duration(100)
                        .attr("r", 3) // Smaller radius for the dots
                        .attr("stroke", "none");

                    setTooltipData(null);
                })
                .on("click", function(event, d) {
                    setTooltipData({
                        cluster: d.kmeans_3,
                        x: d[xField],
                        y: d[yField],
                        position: { x: event.pageX, y: event.pageY }
                    });
                });


        };

        // Initial chart update
        updateChart(currentData);

        // Handle window resize
        const handleResize = () => {
            const newWidth = svgRef.current.clientWidth - margin.left - margin.right;
            const newHeight = svgRef.current.clientHeight - margin.top - margin.bottom;

            xScale.range([0, newWidth]);
            yScale.range([newHeight, 0]);

            svg.select(".x-axis").call(xAxis);
            svg.select(".y-axis").call(yAxis);

            svg.selectAll("circle")
                .attr("cx", d => xScale(d[xField]))
                .attr("cy", d => yScale(d[yField]));

            svg.select(".x-axis-label")
                .attr("x", newWidth / 2)
                .attr("y", newHeight + 50);

            svg.select(".y-axis-label")
                .attr("x", -newHeight / 2)
                .attr("y", -120);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
            d3.select(svgRef.current).selectAll("*").remove();
            tooltip.remove();
        };
    }, [currentData, xField, yField]);

    // Function to switch between datasets
    const handleSwitchData = () => {
        if (isCBD) {
            setCurrentData(dataLandsize);
            setXField('Landsize');
        } else {
            setCurrentData(dataCBD);
            setXField('CBD Distance');
        }
        setIsCBD(!isCBD);
    };

    return (
        <div>
            <h1>Scatter plot for housing market distributions</h1>
            <p className='chart-desc'>
            This chart displays the distribution of houses by comparing various attributes with their prices. The x-axis represents the CBD distance and Landsize while the y-axis represents the Price. Users can hover on any plot to see the data of it. Each dot represents a house's price and its distance from the CBD or the landsize.The scatter plot also shows the clusters of houses to help users identify the different groups of houses.
            </p>
            <button className='btn btn-danger' onClick={handleSwitchData}>
                Switch to {isCBD ? "Landsize" : "CBD"} Data
            </button>
            <div id="scatterPlot" style={{ width: '100%', height: '100%' }}>
                <svg ref={svgRef}></svg>
            </div>
            {tooltipData && (
                <div
                    style={{
                        position: 'absolute',
                        left: tooltipData.position.x - 50,
                        top: tooltipData.position.y - 200,
                        backgroundColor: 'white',
                        padding: '5px',
                        border: '1px solid black',
                        borderRadius: '4px',
                        pointerEvents: 'none'
                    }}
                >
                    <strong>Cluster:</strong> {tooltipData.cluster}<br />
                    <strong>{xField}:</strong> {tooltipData.x}<br />
                    <strong>{yField}:</strong> {tooltipData.y}
                </div>
            )}
        </div>
    );
};

export default ScatterPlotComponent;