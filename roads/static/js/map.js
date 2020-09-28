var map = L.map("map", {
    center:{lat: 0.5108141559002755, lng: 35.275297164917},
    zoom:14,
    minZoom:10
});


// add a tile Layer
var cartoLight = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}' + (L.Browser.retina ? '@2x.png' : '.png'), {
    attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
    minZoom: 0
}).addTo(map);

// roads layer
var roads = L.geoJson(null, {
    style:function(feature) {
        return {
            color:"#ff002e",
            weight:2,
        }
    },
    onEachFeature:function(feature, layer) {

    }
});

roads.addTo(map);

// ward layer
var wards = L.geoJson(null, {
    style:function() {
        return {
            fillColor:"#fc8d59",
            color:"#c9c122",
            weight:0.5
        }
    },
    onEachFeature:function(feature, layer) {
        
    }
});

wards.addTo(map);

// municipality area
var municipality = L.geoJson(null, {
    style:{
        fillColor:"#91cf60",
        fillOpacity:0.6,
        color:"#E9E9E9",
        weight:1
    },
    onEachFeature:function(feature, layer) {
        
    }
}).addTo(map);

// load the data
let requests = [fetch("/roads"), fetch("/other_data")];
let dataLoad = Promise.all(requests);

fetch("/roads")
.then(response => {
    console.log(response);

    return response.json()
}).then(road => {
    console.log(road);
    roads.addData(road);
})
.catch(error => {
    console.log(error);
});

fetch("/other_data")
.then(response => {
    console.log(response);

    return response.json()
}).then(other_data => {
    console.log();

    wards.addData(JSON.parse(other_data[0]));
    municipality.addData(JSON.parse(other_data[1]));
})
.catch(error => {
    console.log(error);
});

// layer control
var overlay = {
    "Roads":roads,
    "Ward" :wards,
    "Municipility":municipality
};

var baseLayer = {
    "Carto Light":cartoLight
};

L.control.layers(baseLayer, overlay, {collapsed:false}).addTo(map);


// Event listeners
map.on("overlayadd", function(e) {
    roads.bringToFront();
});

map.on("layeradd", function(e) {
    if(roads) {
        roads.bringToFront();
    } 
   
});

map.on("overlayremove", function(e) {
    roads.bringToFront();
});

// Visual type

// Animate roads
