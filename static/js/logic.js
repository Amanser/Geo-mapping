earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"



// Perform a GET request to the query URL
d3.json(earthquakeURL, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });
  
  function createFeatures(earthquakeData) {
  
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and magnitude of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + "Magnitude: " + feature.properties.mag +
        "</h3><hr><p>" + feature.properties.place + "</p>");
    }
    // Define a function to update the map markers
    function styleInfo(feature) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: getColor(feature.properties.mag),
          color: "#000000",
          radius: feature.properties.mag * 3.5,
          stroke: true,
          weight: 0.5
        };
      }
    
      // Define the color of the marker based on the magnitude of the earthquake.
      function getColor(magnitude) {
        switch (true) {
          case magnitude > 5:
            return "#ea2c2c";
          case magnitude > 4:
            return "#ea822c";
          case magnitude > 3:
            return "#ee9c00";
          case magnitude > 2:
            return "#eecc00";
          case magnitude > 1:
            return "#d4ee00";
          default:
            return "#98ee00";
        }
      }
    



    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      style: styleInfo,
    });
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }
  
  function createMap(earthquakes) {
  
    // Define satelliteMap and darkmap layers
    var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 16,
      id: "mapbox.streets-satellite",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 16,
      id: "mapbox.dark",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Satellite": satelliteMap,
      "Dark": darkmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the satelliteMap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
      //Coords for San Francisco   
        37.7577627, -122.4727052
      ],
      zoom: 6,
      layers: [satelliteMap, earthquakes]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  }
  
  // @TODO Add the Legend to the map