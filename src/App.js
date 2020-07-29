import * as d3 from "d3";
import { feature } from "topojson";
import { scaleLinear } from "d3";

const container = d3.select("#container");

container
  .append("h2")
  .attr("id", "title")
  .text("United States Educational Attainment");

container
  .append("p")
  .attr("id", "description")
  .text(
    "Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)"
  );

const US_EDUCATION_DATA =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const US_COUNTY_DATA =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

let educationData;
let countyData;

const width = 800,
  height = 600;

const canvas = container
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const legendData = [3, 12, 21, 30, 39, 48, 57, 66];
const colorScale = d3
  .scaleThreshold()
  .domain(legendData)
  .range(d3.schemeBlues[8])




const drawMap = () => {
  canvas
    .selectAll("path")
    .data(countyData)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class", "county")

    .attr("fill", (d) => {
      let id = d.id;
      let county = educationData.find((item) => {
        return item.fips === id;
      });
      let percentage = county.bachelorsOrHigher;
      return colorScale(percentage)
    }) // fill

    .attr("data-fips", (d) => d.id) // id
    .attr("data-education", (d) => {
      let id = d.id;
      let county = educationData.find((item) => {
        return item.fips === id;
      });
      let percentage = county.bachelorsOrHigher;
      return percentage;
    });
};

d3.json(US_COUNTY_DATA).then((data, error) => {
  if (error) {
    throw error;
  } else {
    countyData = feature(data, data.objects.counties).features;
    // console.log(countyData);

    // affter the first data srouce is loaded, then load the second one
    d3.json(US_EDUCATION_DATA).then((data, error) => {
      if (error) {
        throw error;
      } else {
        educationData = data;
        drawMap();
        // console.log(data);
      }
    });
  }
});



const legendWidth = 400, legendHeight = 40, l_margin = 40;
const lWidth = legendWidth / legendData.length;
const legend = container
  .append('svg')
  .attr('id', 'legend')
  .attr('width', legendWidth + l_margin)
  .attr('height', legendHeight + l_margin);


const l_group = legend
  .append('g')
  .attr('transform', `translate(${l_margin / 2}, ${l_margin / 2})`)


l_group.selectAll('rect')
  .data(legendData)
  .enter()
  .append('rect')

  .attr('x', (d, i) => i * lWidth)
  .attr('y', 0)

  .attr('height', legendHeight)
  .attr('width', lWidth)

  .attr('fill', d => colorScale(d))


const lScale = d3
  .scaleLinear()
  .range([0, legendWidth])
  .domain(d3.extent(legendData))

const lAxis = d3
  .axisBottom(lScale)
  .tickFormat( d => d + "%")


l_group
  .append('g')
  .attr('transform', `translate(0, ${legendHeight})`)
  .call(lAxis)