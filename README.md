# Amusive Blogging N' Coding

This repository contains the code from the hands-on blog posts at [iSquared](https://isquared.digital/). The website
mainly revolves around the visual explanation of many different phenomena. There are two main parts: blogs and visualizations.

# Blog Posts
The blog posts are longer and more detailed texts covering some interesting topics. They include explanations,
intuition, theory, and visual perception of the discussed subject. Morever an open-source implementation
is provided for a fully-featured experience. The blog posts are summarized below:

## [The importance of interactive data visualization](https://isquared.digital/blog/2020-02-08-interactive-dataviz/)

The blog post points why the interactive visualization is important and how it can help us in the process
of data exploration and interpretation. It also includes a hands-on experience using the *JavaScript* library
[D3](https://d3js.org/), to code an interactive *Parallel Coordinates* plot augmented with a dynamic table to search
laptops easily.

Code: [Interactive Dataviz](/Interactive%20Dataviz) 

Dataset: [Laptop Prices](https://www.kaggle.com/ionaskel/laptop-prices)

## [JavaScript Visualization: Discover Different Visualization Tools](/JavaScript%20Visualization%20Zoo)

A series of 4 blog posts, each discovering a different set of JavaScript visualization tools: charting, graphs, maps
and 3D.

### [First part - Charting](https://isquared.digital/blog/2020-03-10-viz-tools-pt1/)
The first part covers the charting libraries with a hands-on experience with *NVD3*, *ApexCharts JS* and *Plotly JS*.

Code: [JavaScript Charting Libraries](/JavaScript%20Visualization%20Zoo/Charting)

Dataset: [Life Expectancy](https://ourworldindata.org/life-expectancy)

### [Second Part - Graph Visualization](https://isquared.digital/blog/2020-03-24-viz-tools-pt2-2/)

The second part covers the graph visualization libraries with a hands-on experience with *Cytoscape JS*.
We discuss the different graph data formats, data repositories, different *JavaScript* libraries and
out-of-the=box tools.

Code: [JavaScript Graph Visualization Libraries](/JavaScript%20Visualization%20Zoo/Graphs)

Data: [Class Dependency Network of JDK 1.6.0.7](http://konect.uni-koblenz.de/networks/subelj_jdk)

## [Random Processes in Python](/Random%20Processes)

A series of blog posts dedicated to the random processes simulation and animated visualization using the Python numerical
libraries.

### [Animated Visualization of Random Walks in Python](https://isquared.digital/blog/2020-04-12-random-walk/)

Introduction of the simple random walk, simulation and animated visualization.

Code: [Random Walk Animation Pyhton Notebook](/Random%20Processes/random_walk_animation.ipynb)

### [Animated Visualization of Brownian Motion in Python](https://isquared.digital/blog/2020-04-16-brownian-motion/)

Introduction of the Brownian Motion, how to construct it using the simple random walk and animated visualization of this principle.

Code: [Brownian Motion Animation Pyhton Notebook](/Random%20Processes/brownian_motion_animation.ipynb)

### [Random Walks Have Never Been Funnier: Drifted Brownian Motion in Python](https://isquared.digital/blog/2020-05-01-drifted-brownian-motion/)

Extending the bare Brownian Motion with volatility and drift. We illustrate these two proparties with an animated visualization using Matplotlib's Animation API. Source code:

Code: [Drifted Brownian Motion](/Random%20Processes/drifted_brownian_motion.ipynb)

### [Forget Determinism, see Randomness in Action: How to Model Stock Price](https://isquared.digital/blog/2020-05-17-geometric-brownian-motion/)

Transforming the Drifted Brownian Motion from a process with additive increments to a process with multiplicative
increments. This is well suited for modelling stock price data. We analyze and animate one interesting property of
the process: for certain conditions, it has zero mean and infinite variance.

Code: [Geometric Brownian Motion](/Random%20Processes/geometric_brownian_motion.ipynb)

## [Numerical Integration in Python](/Integration)

A series of blog posts dedicated to the numerical integration with animated visualizations in Python.

### [Integrals are Easy: Visualized Riemann Integration in Python](https://isquared.digital/blog/2020-05-27-riemann-integration/)

Introduction to the simplest form of Integration using the Riemann sums. We illustrate the numerical integration
process using Matplotlib's Animation API.

Code: [Riemann Sums](/Integration/riemann_sums.ipynb)

# Visualizations

The visualization part offers very short and simple explanation of some big ideas where the main focus is
put on the visualizations and how to create them. For completeness, the open-source implementation is provided
here. The list of visualizations is summarized below:

## [Calculation of the Circle’s Area Explained Visually](https://isquared.digital/visualizations/2020-06-07-area-circle/)

How to calculate the area of the circle numerically. What is the visual interpretation behind it?

Find the source code [here](/Visualizations/calculate_area_animation.ipynb)

## [This is why the Mandelbrot sets are amazing!](https://isquared.digital/visualizations/2020-06-11-mandelbrot/)

Amazing properties of the Mandelbrot sets and an animated visualization using Matplotlib as it converges.

Find the source code [here](/Visualizations/mandelbrot.ipynb)