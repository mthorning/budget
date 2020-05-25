<div bind:this={chartEl}></div>

<script>
    import * as d3 from 'd3';
    import { onMount } from 'svelte';
    import { startOfMonth, addMonths } from 'date-fns';

    export let savings, monthlyChange, min, max, months;

    let chartEl, svg, path, x, y;

    const width = 600;
    const height = 300;
    const margin = {
        top: 10,
        bottom: 60,
        left: 60
    }

    $: data = calculateDataPoints(monthlyChange, savings, months);

    $: xScale = d3.scaleUtc()
        .domain(d3.extent(data, d => d.date))
        .range([0, width - margin.left * 2]);

    $: yScale = d3.scaleLinear()
        .domain([min || 0, max || 5000])
        .range([height - margin.bottom, margin.top]);
    
    $: xAxis = d3.axisBottom()
        .tickFormat(d3.timeFormat("%m/%y"))
        .scale(xScale);

    $: yAxis = d3.axisLeft()
        .scale(yScale);

    $: line = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.value));

    $: {
        if(svg) {

            path.selectAll("path")
            .data([data])
                .transition()
                .attr('d', line)
                .attr('stroke-width', 1)
                .attr('stroke', 'steelblue');

            x.call(xAxis);
            y.call(yAxis);
        }
    }
    
    onMount(() => {
        svg = d3.select(chartEl) 
            .append("svg")
            .attr("viewBox", [0, 0, width, height])
            .append("g")
            .attr("transform", `translate(${margin.left}, 0)`)

        x = svg.append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(xAxis);
        
        y = svg.append("g")
            .call(yAxis);

        path = svg.append("g");
        path.selectAll("path")
            .data([data])
            .enter()
            .append('path')
            .attr('d', line)
            .attr('stroke-width', 1)
            .attr('stroke', 'steelblue')
            .attr("fill", "none");
    });

    function calculateDataPoints(change, funds, periods) {
        const points = [{ 
            date: startOfMonth(Date.now()),
            value: funds 
        }];

        for(let i = 1; i < periods; i++) {
            const prev = points[i - 1];
            points.push({ 
                date: addMonths(prev.date, 1),
                value: prev.value + change
            });
        }
        return points.map(({date, value}) => 
            ({date: new Date(date), value }))
    }

</script>

<style>
    div {
        height: 100%;
        width: 100%;
        min-width: 600px;
        min-height: 300px;
    }
</style>
