// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});


// Define arrays to hold quake markers
// var quakeMarkers = [];
// console.log(quakeMarkers);

function createFeatures(earthquakeData) {
  

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    // Setting the marker radius for the city by passing population into the markerSize function
    
    L.circle(feature.properties.place, {
      stroke: false,
      fillOpacity: 0.75,
      color: "purple",
      fillColor: "purple",
      radius: markerSize(feature.properties.mag)
    })
    
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var quakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });
  // var quakes = L.geoJSON(quakeMarkers, {
  //   onEachFeature: onEachFeature
  // });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakeData);
}

// function createFeatures(earthquakeData) {
  

//   // Define a function we want to run once for each feature in the features array
//   // Give each feature a popup describing the place and time of the earthquake
//   function onEachFeature(feature, layer) {
//     // Setting the marker radius for the city by passing population into the markerSize function
//     layer.bindPopup("<h3>" + feature.properties.place +
//       "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
//   }

//   // Create a GeoJSON layer containing the features array on the earthquakeData object
//   // Run the onEachFeature function once for each piece of data in the array
//   var earthquakes = L.geoJSON(earthquakeData, {
//     onEachFeature: onEachFeature
//   });
//   // var quakes = L.geoJSON(quakeMarkers, {
//   //   onEachFeature: onEachFeature
//   // });

//   // Sending our earthquakes layer to the createMap function
//   createMap(earthquakes);
// }

// Create separate layer group for quakes
// var quakes = L.layerGroup(quakeMarkers);

// Define a markerSize function that will give each earthquake a different radius based on its magnitude
function markerSize(mag) {
  return mag / 40;
}
// Loop through the earthquake features and create one marker for each city object
function onEachFeature(feature) {
  L.circle(feature.properties.mag, {
    fillOpacity: 0.75,
    color: "white",
    fillColor: "purple",
    // Setting our circle's radius equal to the output of our markerSize function
    // This will make our marker's size proportionate to its population
    radius: markerSize(feature.properties.place)
  }).bindPopup("<h1>" + feature.properties.place + "</h1> <hr> <h3>Population: " + feature.properties.mag + "</h3>").addTo(myMap);
}
function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Dark Map": darkmap,
    "Light Map": lightmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    //Magnitude: quakes
  };


  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.257, -121.80
    ],
    zoom: 5,
    layers: [darkmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
