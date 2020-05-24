<div bind:this={chartEl}></div>

<script>
    import * as d3 from 'd3';
    import { onMount } from 'svelte';
    import { startOfMonth, addMonths } from 'date-fns';
    export let savings, monthlyChange;
    /* let monthlyChange = 15; */

    let chartEl, svg, path;

    const months = 12;
    const width = 600;
    const height = 300;
    const margin = 50;


    $: data = calculateDataPoints(monthlyChange);

    $: xScale = d3.scaleUtc()
        .domain(d3.extent(data, d => d.date))
        .range([0, width - margin * 2]);

    $: yScale = d3.scaleLinear()
        .domain([
            -1000 * months,
            1000 * months
        ])
        .nice()
        .range([height - margin, margin]);
    
    $: xAxis = d3.axisBottom()
        .scale(xScale);

    $: yAxis = d3.axisLeft()
        .scale(yScale);

    $: line = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.value));

    $: {
        if(path) {
            path.selectAll("path")
            .data([data])
                .transition()
                .attr('d', line)
                .attr('stroke-width', 1)
                .attr('stroke', 'steelblue');
        }
    }
    $: console.log(data);
    
    onMount(() => {
        svg = d3.select(chartEl) 
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin}, 0)`)

        svg.append("g")
            .attr("transform", `translate(0, ${height - margin})`)
            .call(xAxis);

        svg.append("g")
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

    function calculateDataPoints(change) {
        const points = [{ 
            date: startOfMonth(Date.now()),
            value: savings 
        }];

        for(let i = 1; i < months; i++) {
            const prev = points[i - 1];
            points.push({ 
                date: addMonths(prev.date, 1),
                value: prev.value + change
            });
        }
        return Object.assign(points.map(({date, value}) => 
            ({date: new Date(date), value })), {y: "$ Amount"})
    }

</script>

<style>
    div {
        height: 100%;
        width: 100%;
        border: 1px solid #555;
    }
</style>
