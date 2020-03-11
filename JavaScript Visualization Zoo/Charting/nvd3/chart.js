/**
 * Author: Vladimir  Ilievski
 * Inspired form:
 *  1. https://ourworldindata.org/life-expectancy
 *  2. http://nvd3.org/examples/line.html
 */


/**
 * Loads the data from a JSON file using jQuery.
 * @param {list} data: list of dictionaries each representing one line
 */
d3.json('../data/life-expectancy-nvd.json', function(data) {
  /* Define an interactive line chart */
  var chart = nv.models.lineChart()
    .useInteractiveGuideline(true)
    .yDomain([0, 80]);

  /* Set the x-axis options */
  chart.xAxis
    .axisLabel('Year')
    .tickFormat(d3.format('.1'));

  /* Set the y-axis options */
  chart.yAxis
    .axisLabel('Life expectancy (years)')
    .tickFormat(d3.format('.02f'));

  /* Load the data */
  d3.select('#chart svg')
    .datum(data)
    .transition().duration(500)
    .call(chart);

  nv.utils.windowResize(chart.update);

  return chart;
});