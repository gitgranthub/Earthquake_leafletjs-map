// CREATING THE MAP OBJECT
function createMap(earthquakes) {

  // Define darkmap and light map layers
  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

  var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers **DARK MAP LOADS FIRST
  var baseMaps = {
    "Dark Map": darkmap,
    "Light Map": lightmap,
    "Satellite": satellite
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
    zoom: 4,
    layers: [darkmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Create a legend to display information about our map
  var info = L.control({
    position: "bottomright"
  });

  info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend")
    depth = [-10, 10, 30, 50, 70, 90]
    // labels = [];
    div.innerHTML += "<h4>Earthquake Depth (km)</h4>"
    div.innerHTML += '<i style="background: #84E1CA"></i><span>-10 - 10</span><br>';
    div.innerHTML += '<i style="background: #CBE6A3"></i><span>10 - 30</span><br>';
    div.innerHTML += '<i style="background: #FDDE90"></i><span>30 - 50</span><br>';
    div.innerHTML += '<i style="background: #F68B76"></i><span>50 - 70</span><br>';
    div.innerHTML += '<i style="background: #C6ACD4"></i><span>70 - 90+</span><br>';

    return div;
  };
  // Add the info legend to the map
  info.addTo(myMap);
}

// COLORS FOR THE FEATURES AND LEGEND
function getValue(x) {
  if (x >= -10 && x <= 10) {
    return "#84E1CA"
  } else if (x <= 30) {
    return "#CBE6A3"
  } else if (x <= 50) {
    return "#FDDE90"
  } else if (x <= 70) {
    return "#F68B76"
  } else {
    return "#C6ACD4"
  }
  
}



// ACTUALLY BUILDING THE MAP FROM THE ABOVE FUNCTIONS
function createFeatures(geojson) {
  

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data 
  // ****** WHERE THE CIRCLES ARE CREATED!!****
  var earthquakes = L.geoJSON(geojson, {
    onEachFeature: function (feature, layer) {
      // Setting the marker radius for the city by passing population into the markerSize function
      
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "<hr>" + "<h3>" + "Magnitude" + "</h3>" + feature.properties.mag + "<hr>" + "<h3>" + "Depth (km)" + "</h3>" + feature.geometry.coordinates[2] + "</p>");
    },
    pointToLayer: function(geoJsonPoint, latlng) {
      return new L.CircleMarker(latlng, {
        radius: (geoJsonPoint.properties.mag * 3),
        color: getValue(geoJsonPoint.geometry.coordinates[2]),
        opacity: 1,
        fillOpacity: .7
      });
    }
  });
  

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}


// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});