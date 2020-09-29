var closeFilterButton = document.getElementById("btn-close");
var filterSection = document.getElementById("filter-section");

var contractors;
var materials;
var structure;
var surface;


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

var cartoDark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}' + (L.Browser.retina ? '@2x.png' : '.png'), {
    attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
    minZoom: 0
});

// 
function getRoadColor(visual, feature) {
    let colorsOne = ['#a50026','#d73027','#f46d43','#fdae61','#fee090','#ffffbf','#e0f3f8','#abd9e9','#74add1','#4575b4','#313695'];
    let colorsTwo = ['#d53e4f','#fc8d59','#fee08b','#ffffbf','#e6f598','#99d594','#3288bd']

    if (visual == "material") {
        let value = feature.properties.material;
        let index = materials.indexOf(value);

        return materials.length <= 7 ? colorsTwo[index] : colorsOne[index];
    } else if (visual == "contractor") {
        let value = feature.properties.contractor;
        let index = contractors.indexOf(value);
        
        return contractors.length <= 7 ? colorsTwo[index] : colorsOne[index];

    } else if (visual == "structure") {
        let value = feature.properties.road_struc;
        let index = structure.indexOf(value);
        
        return structure.length <= 7 ? colorsTwo[index] : colorsOne[index];

    } else if (visual == "surface") {
        let value = feature.properties.surface;
        let index = surface.indexOf(value);
        
        return surface <= 7 ? colorsTwo[index] : colorsOne[index];
    } else {
        return "#ff002e";
    }

}

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

    materials = getUniqueValues(road, "material");
    surface = getUniqueValues(road, "surface");
    structure = getUniqueValues(road, "road_struc");
    contractors = getUniqueValues(road, "contractor");
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

// get uniques values
function getUniqueValues(data, field) {
    let newData = data.features.map(feature => feature.properties[field]);
    newData = [...new Set(newData)];

    return newData;
}

// layer control
var overlay = {
    "Roads":roads,
    "Ward" :wards,
    "Municipility":municipality
};

var baseLayer = {
    "Carto Light":cartoLight,
    "Carto Dark": cartoDark
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

// ========================= Visual type =============================
// Visual Legend
var legendControl = new L.Control({position:"bottomright"});
legendControl.onAdd = function(map) {
    let div = L.DomUtil.create("div", "accordion bg-white");

    div.innerHTML = '<button class="btn btn-block bg-light text-left" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">'+
    'Legend</button>';

   div.innerHTML += '<div id="collapseOne">'+
   'Anim pariatur cliche reprehenderit</div>';

    return div;
}

legendControl.addTo(map);

var visualType = document.querySelectorAll(".form-group .form-check");
visualType.forEach(visual => {
    visual.addEventListener("change", function(e) {
        // get the value
        let value = e.target.value;
        updateVisual(value);
    });
});


function updateVisual(value) {
    roads.eachLayer(layer => {
        let feature = layer.feature;
        layer.setStyle({
            color:getRoadColor(value, feature),
            weight:3
        });
    });

    if(value != "default") {
        updateLegend(value);
        if(!map.hasLayer(cartoDark)) {
            cartoDark.addTo(map);
            map.removeLayer(cartoLight);
        }
    }
}


function updateLegend(value) {
    let legendContainer = document.getElementById("collapseOne");
   
    // create a color scale
    let legendContent = "";
    let feature = roads.toGeoJSON().features[0];

    if(value == "material") {
        legendContent = getLegendContent(materials, feature, "material", value);
    } else if (value == "contractor") {
        legendContent = getLegendContent(contractors, feature, "contractor", value);
    } else if (value == "surface") {
        legendContent = getLegendContent(surface, feature, "surface", value);
    } else if (value == "structure") {
        legendContent = getLegendContent(structure, feature, "road_struc", value);
    } 


    legendContainer.innerHTML = legendContent;
}

function getLegendContent(data, feature, field, value) {
    let legendContent = "";
    data.forEach(element => {
        feature.properties[field] = element;
        let color = getRoadColor(value, feature);

        legendContent += "<div class='legend-item' style='background-color:"+color+"'></div><span>"+element+"</span>";
    });

    return legendContent;
}

function toggleLegend() {
        
}

// Animate roads

// Filter Section
var filterControl = new L.Control({position:"topleft"});

filterControl.onAdd = function(map) {
    let div = L.DomUtil.create("div", "leaflet-touch leaflet-bar");

    div.innerHTML = "<a><i class='fa fa-filter'></i></a>";

    div.addEventListener("click", function(e) {
        filterSection.classList.toggle("collapse-filter");
        map.removeControl(filterControl);
    });

    return div;
}

filterControl.addTo(map);

closeFilterButton.addEventListener("click", function(e) {
    filterSection.classList.toggle("collapse-filter");
    filterControl.addTo(map);
});
