/**
 * Author: Vladimir  Ilievski
 * Inspired form:
 *  1. https://ourworldindata.org/life-expectancy
 *  2. https://apexcharts.com/javascript-chart-demos/line-charts/data-labels/
 */


/**
 * Loads the data from a JSON file using jQuery.
 * @param {list} data: list of dictionaries each representing one line
 */
$.getJSON( "../data/life-expectancy-apex.json", function( data ) {
    /**
     * This object defines the full line chart.
     */
    var options = {
        series: data,  /* list of objects, where each one is one line */
        chart: {
            height: 350,
            width: 1200,
            type: 'line',
            toolbar: {
                show: false
            }
        },
        colors: ['#77B6EA', '#545454', '#C7EFCF', '#E63462', '#FE5F55', '#A4F072'],  /* The color of each line */
        dataLabels: {  /* Disable the points to appear along the lines */
            enabled: false,
        },
        stroke: {  /* Produce smooth line in between the discrete points on the chart */
            curve: 'smooth'
        },
        title: {
            text: 'Rising life expectancy around the world',
            align: 'left'
        },
        grid: {  /* Options for the background grid where the lines appear */
            borderColor: '#e7e7e7',
        row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5
        },
    },
    xaxis: {  /* Options for the x axis - self descriptive */
        type: 'numeric',
        title: {
            text: 'Year'
        },
        min: 1770,
        max: 2020
    },
    yaxis: {  /* Options for the y axis - self descriptive */
        type: 'numeric',
        title: {
            text: 'Life expectancy (years)'
        },
      min: 0,
      max: 80,
      labels: {
        formatter: function (val) {
            return val.toFixed(2)
        }
      }
    },
    legend: {  /* Options for the legend */
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5
        }
    };

    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
});