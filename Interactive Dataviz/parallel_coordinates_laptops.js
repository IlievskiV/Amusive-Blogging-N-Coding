/**
 * Author: Vladimir  Ilievski
 * Inspired form:
 *  1. https://bl.ocks.org/syntagmatic/482706e0638c67836d94b20f0cb37122
 *  2. http://bl.ocks.org/gka/17ee676dc59aa752b4e6
 *  3. http://bl.ocks.org/eesur/1a2514440351ec22f176
 */

/**  @type {dict} The margins of the plot container */
var margin = {top: 70, right: 50, bottom: 10, left: 70};
/** @type {number} The width of the plot container */
var width = document.body.clientWidth - margin.left - margin.right;
/** @type {number} The height of the plot container */
var height = 500 - margin.top - margin.bottom;
/** @type {number} The inner height used for plotting the axes */
var innerHeight = height - 2;

/**
 * @type {number}
 * Ratio of the resolution in physical pixels to the resolution in CSS pixels.
 * this tells the browser how many of the screen's actual pixels should be used
 * to draw a single CSS pixel.
 */
var devicePixelRatio = window.devicePixelRatio || 1;

/** Mapping of the company names to a color on an ordinal scale */
var color = d3.scaleOrdinal()
  .domain(["Apple", "HP", "Acer", "Asus", "Dell", "Lenovo", "Chuwi", "MSI", "Microsoft", "Toshiba", "Huawei", "Xiaomi", "Vero", "Razer", "Mediacom", "Samsung", "Google", "Fujitsu", "LG"])
  .range(["#D27F8A", "#50A9D4", "#4CFC86", "#C97D0B", "#459248", "#D26FA7", "#E1525A", "#5DB5B3", "#785D82", "#A8AF72", "#954A56", "#097AEB", "#D8197D", "#AB9E27", "#D27D4B", "#D98323", "#BA8AAD", "#35D468", "#8FF6C2"]);

/**
 * @type {dict}
 * Dictionary of the data types present in the data in order to assign one type to each dimension;
 * Each type contains the following fields:
 *  - key: the keu identifying the data type
 *  - coerce: function cast the  data to the same type
 *  - extent: the range of values that can appear
 *  - within: function to check whether a given point belongs in the range
 *  - defaultScale: the default scale used to map the values from the input domain to the given range
 */
var types = {
  "Number": {
    key: "Number",
    coerce: function(d) { return +d; }, // convert the input to number +d
    extent: d3.extent,  // return (min, max) to set in the domain
    within: function(d, extent, dim) { return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1]; },
    // use a linear function (y = m * x + b) to map the domain values to a specified and allowed range
    defaultScale: d3.scaleLinear().range([innerHeight, 0])
  },
  "String": {
    key: "String",
    coerce: String,
    extent: function (data) { return data.sort(); },  // sort alphabetically the strings to set in the domain
    within: function(d, extent, dim) { return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1]; },
    // map the domain value with one point each in the allowed range, no padding, no rounding and center alignment
    defaultScale: d3.scalePoint().range([0, innerHeight])
  }
};

/**
 * @type {dict}
 * List of dictionaries specifying every dimension to plot. Each dimension is specified with the
 * following fields:
 *  - key: specifies the key in the .csv file for that particular dimension;  it must be the same as in the .csv;
 *  - description: the  text to appear on top of the line describing that dimension
 *  - type: the type of data stored in the dimension; important to set the domain, range and scale
 * Optionally is may contain the following key:
 *  - axis: specifies how to render the axis
 * The dimensions will be plot from left to right in the order in which they are specified here.
 */
var dimensions = [
  {
    key: "Company",
    description: "Company",
    type: types["String"],
    axis: d3.axisLeft()
      .tickFormat(function(d,i) {
        return d;
      })
  },
  {
    key: "Inches",
    description: "Screen Size (Inches)",
    type: types["Number"]
  },
  {
    key: "ScreenResolution_px",
    description: "Screen Resolution (Pixels)",
    type: types["String"]
  },
  {
    key: "Ram_GB",
    description: "Ram Memory (GB)",
    type: types["Number"]
  },
  {
    key: "SSD_Memory_GB",
    description: "SSD Memory (GB)",
    type: types["Number"]
  },
  {
    key: "HDD_Memory_GB",
    description: "HDD Memory (GB)",
    type: types["Number"]
  },
  {
    key: "Cpu_Type",
    description: "CPU Model",
    type: types["String"]
  },
  {
    key: "Cpu_Frequency_GHz",
    description: "CPU Clock Rate (GHz)",
    type: types["Number"]
  },
  {
    key: "Gpu_Type",
    description: "GPU Model",
    type: types["String"]
  },
  {
    key: "Price_euros",
    description: "Price (Euros)",
    type: types["Number"]
  }
];


/** Scale for the x axis to place every parallel line */
var xscale = d3.scalePoint()  /** map every value in the domain to one point, s.t. they are equidistant */
    .domain(d3.range(dimensions.length))  /** input domain: one point per dimension */
    .range([0, width]);  /** map the points equidistantly in the range from [0, width] */

/** The default y axis to render */
var yAxis = d3.axisLeft();

/** Create a <div> container to contain the SVG and the canvas to draw the plot. */
var container = d3.select("body").append("div")
    .attr("class", "parcoords")  /** the div tag will have a class "parcoords" */
    .style("width", width + margin.left + margin.right + "px")  /** set the width of the container */
    .style("height", height + margin.top + margin.bottom + "px");  /** set the height of the container */

/** Create an SVG element with one group <g> element */
var svg = container.append("svg")
    .attr("width", width + margin.left + margin.right)  /** set the width of the SVG element */
    .attr("height", height + margin.top + margin.bottom)  /** set the height of the SVG element */
    .append("g")  /** append one group <g> element inside */
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");  /** move the <g> element along x and y axis */

/** Create a canvas element to draw the data points */
var canvas = container.append("canvas")
    .attr("width", width * devicePixelRatio)
    .attr("height", height * devicePixelRatio)
    .style("width", width + "px")
    .style("height", height + "px")
    .style("margin-top", margin.top + "px")
    .style("margin-left", margin.left + "px");

/**
 * Create data table to update it according to the selection in the Parallel Coordinates plot.
 * The table will contain the same columns as the parallel coordinates plot.
 */

/**
 * @type {list}
 * Column definitions in the table head. Each element in the array is a dictionary fully  defining one
 * column in the table. It has the following keys:
 *  - head: the text to display
 *  - cl: the class of the column, depending on the data
 *  - key: the original key in the data set
 */
var columns = [
    { head: 'Company', cl: 'title', key: 'Company' },
    { head: 'Screen Size (Inches)', cl: 'num', key: 'Inches'},
    { head: 'Screen Resolution (Pixels)', cl: 'center', key: 'ScreenResolution_px'},
    { head: 'Ram Memory (GB)', cl: 'num', key: 'Ram_GB'},
    { head: 'SSD Memory (GB)', cl: 'num', key: 'SSD_Memory_GB'},
    { head: 'HDD Memory (GB)', cl: 'num', key: 'HDD_Memory_GB'},
    { head: 'CPU Model', cl: 'center', key: 'Cpu_Type'},
    { head: 'CPU Clock Rate (GHz)', cl: 'num', key: 'Cpu_Frequency_GHz'},
    { head: 'GPU Model', cl: 'center', key: 'Gpu_Type'},
    { head: 'Price (Euros)', cl: 'num', key: 'Price_euros'}
];


/** Create a <table> element with id "grid" */
var table = d3.select("body")
            .append("table")
            .attr("id", "grid");

/** Create the table header */
table.append('thead')
    .append('tr')  /** append one row */
    .selectAll('th')  /** select all header cells */
    .data(columns)  /** attach the columns list as data */
    .enter()
    .append('th')  /** for each entry in the columns list create one <th> element */
    .attr('class', function(col){return col.cl; })  /** set the <th> element class as specified in the current column */
    .text(function(col){return col.head; });  /** display the text in the <th> element as specified in the current column */

/**
 * Get the 2D context for drawing of class CanvasRenderingContext2D.
 * Documentation for the class: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
 */
var ctx = canvas.node().getContext("2d");
ctx.globalCompositeOperation = 'darken';
ctx.globalAlpha = 0.25;  /** Set the transparency level between 0.0 and 1.0 */
ctx.lineWidth = 1.5;  /** Set the width of the line in coordinate space unit */
ctx.scale(devicePixelRatio, devicePixelRatio);  /** Scale the canvas according to the pixels */

/** Create one axis per dimension */
var axes = svg.selectAll(".axis")  /** create an axis element inside the svg tag */
    .data(dimensions)  /** bound the dimensions to the .axis element */
    .enter().append("g")  /** for each entry in the dimensions append one <g> tag in the svg */
    .attr("class", function(d) { return "axis " + d.key.replace(/ /g, "_"); })  /** the class of each <g> tag is axis_dimension_key_name */
    .attr("transform", function(d,i) { return "translate(" + xscale(i) + ")"; });  /** translate  the <g> tag to the right */


/**
 * Loads the data at the specified path and plots it. The callback function takes the loaded data.
 * @param {list} data: a list of dictionaries with a keys same as column names in the loaded .csv file
 */
d3.csv("laptops_updated.csv", function(error, data) {
  if (error) throw error;

  /**
   * Iterate through each data row.
   * @param {dict} d: one entry in the list of data points
   */
  data.forEach(function(d) {
    /**
     * Iterate through each dimension.
     * @param {dict} p: one entry in the list of dimensions
     */
    dimensions.forEach(function(p) {
      /**
       * Check if the data entry belongs to the current dimension:
       * if not belong set it null, otherwise coerce it to the specified type;
      */
      d[p.key] = !d[p.key] ? null : p.type.coerce(d[p.key]);
    });
  });

  /**
   * Iterate through each dimension and set domain and scale.
   * Every dimension appears as one line and needs a domain and a scale that knows
   * how to map, i.e. how to transform the input from the domain as an output that
   * appears in the final plot.
   * @param {dict} dim: one entry in the list of dimensions
   */
  dimensions.forEach(function(dim) {
    /** If the current dimension does not define its own input domain */
    if (!("domain" in dim)) {
      /** set domain using dimension type's extent function */
      dim.domain = d3_functor(dim.type.extent)(data.map(function(d) { return d[dim.key]; }));
    }
    /** If the current dimension does not define its own scale */
    if (!("scale" in dim)) {
      /** use dimension type's default scale */
      dim.scale = dim.type.defaultScale.copy();
    }
    dim.scale.domain(dim.domain);
  });

  /**
   * Draw 30 data entries each frame asynchronously.
   * @param {function} draw: function defined below that knows how to draw one data point
   */
  var render = renderQueue(draw).rate(30);

  ctx.clearRect(0,0,width,height); /** erase the pixels in a rectangular area */
  ctx.globalAlpha = d3.min([1.15/Math.pow(data.length,0.3),1]); /** set the transparency according to how much data is selected */
  render(data);  /** render the selected data by calling the 'draw' function */

  /** Render each axis associated with one dimension */
  axes.append("g")
    .each(function(d) {
        var renderAxis = "axis" in d ? d.axis.scale(d.scale) : yAxis.scale(d.scale); /** custom or default axis */
        d3.select(this).call(renderAxis);
    })
    .append("text")
    .attr("class", "title")
    .attr("text-anchor", "start")
    .text(function(d) { return "description" in d ? d.description : d.key; });

  /** Add and store a brush for each axis. */
  axes.append("g")
      .attr("class", "brush")
      .each(function(d) {
        d3.select(this).call(d.brush = d3.brushY()
          .extent([[-10,0], [10,height]])
          .on("start", brushstart)
          .on("brush", brush)
          .on("end", brush)
        )
      })
    .selectAll("rect")
    .attr("x", -8)
    .attr("width", 16);

  /** Set the colors for the axis representing the companies */
  d3.selectAll(".axis.Company .tick text")
    .style("fill", color);

  /** Create the table body */
  var tbody = table.append('tbody')
    .selectAll('tr')  /** Select all rows in the table's body */
    .data(data.sort(function(d1, d2){  /** sort the data in ascending order according to the price */
        return d3.ascending(d1['Price_euros'], d2['Price_euros']);
    }).slice(0, 5))  /** select the first five entries with lowest price */
    .enter()
    .append('tr')  /** for each of the 5 selected data entries create one row */
    .selectAll('td')  /** select all cells in the created rows */
    .data(function(row, i) {  /** insert data in each cell in the rows, @param {dict} row: selected data entry */
        return columns.map(function(c) {  /** map every entry in the list of columns, @param {dict} c: column specification */
            /** compute cell values for this specific row */
            var cell = {};
            d3.keys(c).forEach(function(k) {  /** iterate over the keys of the current column,  @param {string} k: key */
                cell[k] = k == 'key' ? row[c[k]] : c[k];  /** if specifying the content of the cell or something else */
            });
            return cell;
        });
    }).enter()
    .append('td')  /** for each of the selected data entries create one table cell */
    .html(function(cell){ return cell.key; })
    .attr('class', function(cell){ return cell.cl; });

  /**
   * Project a data entry to the corresponding dimension.
   * @param {dict} d: one data entry
   * @return {list} (x, y) coordinates for each dimension in the input  data entry
   */
  function project(d) {
    /**
     * Run the callback function on every element in the list
     * @param {dict} p: one element in the list
     * @param {number} i: the index of the element
     */
    return dimensions.map(function(p,i) {
      /** check if the data element d has the current dimension key and contains a value */
      if (!(p.key in d) || d[p.key] === null) return null;
      return [xscale(i),p.scale(d[p.key])];
    });
  };

  /**
   * Function to draw one data entry as a poly-line across the parallel axes.
   * @param {dict} d: one data entry
   */
  function draw(d) {
    ctx.strokeStyle = color(d.Company);  /** Set the color of the poly-line */
    ctx.beginPath();  /** Start a new path by emptying the list of sub-paths */
    var coords = project(d);  /** Take the (x, y) coordinates for each dimension of the current data point */

    /**
     * Drawing the poly-line following the coordinates.
     * @param {list} p: (x, y) coordinates for each element in the data point
     * @param {number} i: the index of the element
     */
    coords.forEach(function(p,i) {
      /** Initialize the line for the first element */
      if (i == 0) {
        ctx.moveTo(p[0],p[1]);  /** Begin a new sub-path at the specified point */
        return;
      }

      ctx.lineTo(p[0],p[1]);  /** Connect the sub-path's last point to the specified point */
    });

    ctx.stroke(); /**  Stroke the current path with the current stroke style */
  }

  /** Event listener to activate the brush */
  function brushstart() {
    d3.event.sourceEvent.stopPropagation();
  }

  /**
   * Handles a brush event, toggling the display of foreground lines and updates the table.
   */
  function brush() {
    render.invalidate(); /**  stop rendering the data points */

    /** Select the axis with an active brush on them */
    var actives = [];
    svg.selectAll(".axis .brush")
      .filter(function(d) {
        return d3.brushSelection(this);
      })
      .each(function(d) {
        actives.push({
          dimension: d,
          extent: d3.brushSelection(this)
        });
      });

    /** Get the selected data */
    var selected = data.filter(function(d) {
      if (actives.every(function(active) {
          var dim = active.dimension;
          /** test if point is within extents for each active brush */
          return dim.type.within(d[dim.key], active.extent, dim);
        })) {
        return true;
      }
    });

    /** Draw only the selected lines */
    ctx.clearRect(0,0,width,height);  /** erase the pixels in a rectangular area */
    ctx.globalAlpha = d3.min([0.85/Math.pow(selected.length,0.3),1]);  /** set the transparency according to how much data is selected */
    render(selected);  /** render the selected data by calling the 'draw' function */

    /** Update the table */
    var rows = table.selectAll('tbody tr')
      .data(selected.sort(function(d1, d2){
        return d3.ascending(d1['Price_euros'], d2['Price_euros']);
      }).slice(0, 5));

    var cells = rows.selectAll('td')
      .data(function(row, i) {
        return columns.map(function(c) {
            // compute cell values for this specific row
            var cell = {};
            d3.keys(c).forEach(function(k) {
                cell[k] = k == 'key' ? row[c[k]] : c[k];
            });
            return cell;
        });
    }).html(function(cell){ return cell.key; })
    .attr('class', function(cell){ return cell.cl; });

   /** Insert the new data */
   cells.enter()
    .append("td")
    .html(function(cell) { return cell.key; });

   /** Remove the absent data */
   cells.exit().remove();

  }
});

function d3_functor(v) {
  return typeof v === "function" ? v : function() { return v; };
};