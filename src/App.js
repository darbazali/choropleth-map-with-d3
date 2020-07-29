import * as d3 from "d3";
import {feature} from 'topojson';


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


const US_EDUCATION_DATA = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const US_COUNTY_DATA = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

let educationData;
let countyData;

const width = 800,
  height = 600;

const canvas = container
  .append("svg")
  .attr('width', width)
  .attr('height', height)


const drawMap = () => {
    canvas
      .selectAll('path')
      .data(countyData)
      .enter()
      .append('path')
      .attr('d', d3.geoPath())
      .attr('class', 'county')

      .attr('fill', d => {
        let id = d.id;
        let county = educationData.find( item => {
          return item.fips === id;
        })
        let percentage = county.bachelorsOrHigher;

        if ( percentage <= 15 ) {
          return 'tomato';
        } else if ( percentage <= 30 ) {
          return 'orange';
        } else if ( percentage <= 45 ) {
          return 'lightgreen';
        } else {
          return 'limegreen'
        }


      }) // fill

      .attr('data-fips', d => d.id) // id
      .attr('data-education', d => {
        let id = d.id;
        let county = educationData.find( item => {
          return item.fips === id;
        })
        let percentage = county.bachelorsOrHigher;
        return percentage
      })
} 


d3
.json( US_COUNTY_DATA )
.then( (data, error) => {
  if ( error ) { 
    throw error
  } else {
    countyData = feature( data, data.objects.counties).features
    // console.log(countyData);

    // affter the first data srouce is loaded, then load the second one
    d3
      .json( US_EDUCATION_DATA )
      .then( (data, error) => {
        if ( error ) {
          throw error;
        } else {
          educationData = data;
          drawMap()
          // console.log(data);
        }
      })
  }
  
})

