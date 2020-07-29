import * as d3 from 'd3'

const container = d3.select('#container');

container
  .append('h2')
  .attr('id', 'title')
  .text('United States Educational Attainment');

container
  .append('p')
  .attr('id', 'description')
  .text("Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)")


