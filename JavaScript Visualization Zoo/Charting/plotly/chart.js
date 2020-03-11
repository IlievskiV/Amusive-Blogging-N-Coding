/**
 * Author: Vladimir  Ilievski
 * Inspired form:
 *  1. https://ourworldindata.org/life-expectancy
 *  2. https://plot.ly/javascript/bar-charts/
 */

/**
 * Loads the data from a JSON file using jQuery.
 * @param {list} data: list of dictionaries each representing one line
 */
$.getJSON( "../data/life-expectancy-plotly.json", function( data ) {
    var a = [];
    /* Iterate through the list of data */
    $.each(data, function(key, val){
        var trace = {
            x: val['x'],
            y: val['y'],
            name: val['name'],
            type: 'bar'
        };
        a.push(trace);
    });

    /* Set the layout of the bar chart */
    var layout = {
    title: 'Rising life expectancy around the world',
    barmode: 'group',
    bargap: 0.15,
    bargroupgap: 0.1,
    xaxis: {
        title: 'Year',
        tickfont: {
            size: 14,
            color: 'rgb(107, 107, 107)'
        },
        range: [1970, 2020]
    },
    yaxis: {
        title: 'Life expectancy (years)',
        titlefont: {
            size: 16,
            color: 'rgb(107, 107, 107)'
        },
        tickfont: {
            size: 14,
            color: 'rgb(107, 107, 107)'
        },
        range: [0, 90]
    }
    };

    Plotly.newPlot('myDiv', a, layout);
});