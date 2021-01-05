var closeFilterButton = document.getElementById("btn-close");
var filterSection = document.getElementById("filter-section");
var maintenanceSelect = document.getElementById("maint-select");
var contractorSelect = document.getElementById("contractor-select");
var devSelect = document.getElementById("development-select");
var searchInput = document.getElementById("search-input");
var searchResult = document.getElementById("search-result");
// var costSlider = $("#cost-slider").slider({ min: 0, max: 10, value: [0, 10], focus: true });

var roadsData;

var developmentNature;
var maintenanceType;
var contractors;
var status;
var funding;



var map = L.map("map", {
    center:{lat: 0.5188716059672112, lng: 35.27007222175599},
    zoom:15,
    minZoom:10
});


// add a tile Layer
var cartoLight = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}' + (L.Browser.retina ? '@2x.png' : '.png'), {
    attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
    minZoom: 0
});

var cartoDark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}' + (L.Browser.retina ? '@2x.png' : '.png'), {
    attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
    minZoom: 0
}).addTo(map);;

// 
function getRoadColor(feature, visual) {
    let colorsOne =['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928']
    let colorsTwo = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f'];

    if (visual == "status") {
        let value = feature.properties.status;
        let index =status.indexOf(value);

        return status.length <= 7 ? colorsTwo[index] : colorsOne[index];
    } else if (visual == "funding") {
        let value = feature.properties.funding;
        let index = funding.indexOf(value);
        
        return funding.length <= 7 ? colorsTwo[index] : colorsOne[index];

    }  else if (visual == "contractor") {
        let value = feature.properties.contractor;
        let index = contractors.indexOf(value);
        
        return contractors.length <= 7 ? colorsTwo[index] : colorsOne[index];

    } else if (visual == "developmentType") {
        let value = feature.properties.nature_dvp;
        let index = developmentNature.indexOf(value);

        // console.log(developmentNature);
        // console.log(colorsTwo[index]);
        
        return developmentNature.length <= 7 ? colorsTwo[index] : colorsOne[index];

    } else if (visual == "maintenanceType") {
        let value = feature.properties.maint_type;
        let index = maintenanceType.indexOf(value);
        
        return maintenanceType <= 7 ? colorsTwo[index] : colorsOne[index];
    } else {
        return "#c9c122";
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
    onEachFeature:onEachRoadFeature
});

function onEachRoadFeature(feature, layer) {
    let popupContent = "<div class='popup-content'>"+
    "<h5 class='popup-title'>"+ feature.properties.name +"</h5>"+
    "<div class='popup-body'>"+
        "<p class='popup-item'>Surface<b>"+ feature.properties.surface +"</b></p>"+
        "<p class='popup-item'>Road No<b>"+ feature.properties.road_no +"</b></p>"+
        "<p class='popup-item'>Road Stage<b>"+ feature.properties.road_stage +"</b></p>"+
        "<p class='popup-item'>Road Class<b>"+ feature.properties.road_class +"</b></p>"+
    "</div>"+
    "</div>";
    layer.bindPopup(popupContent);

    layer.on("mouseover", function(e){

    });

    layer.on("mouseout", function(e) {

    });
}

roads.addTo(map);

var roadCondition = L.geoJson(null, {
    style:function(feature) {
        return {
            color:getRoadConditionColor(feature),
            weight:2,
        }
    },
    onEachFeature:function(feature, layer) {
        let popupContent = "<div class='popup-content'>"+
        "<h5 class='popup-title'>"+ feature.properties.name +"</h5>"+
        "<div class='popup-body'>"+
            "<p class='popup-item'>Road No.<b>"+ feature.properties.road_no +"</b></p>"+
            "<p class='popup-item'>Road Condition<b>"+ feature.properties.rd_condtn +"</b></p>"+
        "</div>"+
        "</div>";
        layer.bindPopup(popupContent);
    }
});

function getRoadConditionColor(feature) {
    let condition = ['NULL', 'Under Construction', 'Poor', 'Fair', 'Good'];
    let colors = ['#1b9e77','#d95f02','#7570b3','#e7298a','#66a61e'];

    let index = condition.indexOf(feature.properties.rd_condtn);
    return colors[index]
}

var roadDevelopment = L.geoJson(null, {
    style:function(feature) {
        return {
            fillColor:"#fc8d59",
            color:getRoadColor(feature, "funding"),
            weight:1
        }
    },
    onEachFeature:function(feature, layer) {
        let popupContent = "<div class='popup-content'>"+
        "<h5 class='popup-title'>"+ feature.properties.road_no +"</h5>"+
        "<div class='popup-body'>"+
            "<p class='popup-item'>Project Name<b>"+ feature.properties.prj_name +"</b></p>"+
            "<p class='popup-item'>Contractor<b>"+ feature.properties.contractor +"</b></p>"+
            "<p class='popup-item'>Maintenance Type<b>"+ feature.properties.maint_type +"</b></p>"+
            "<p class='popup-item'>Development Nature<b>"+ feature.properties.nature_dvp +"</b></p>"+
            "<p class='popup-item'>Contract Cost<b>"+ feature.properties.conct_sum +"</b></p>"+
            "<p class='popup-item'>Funding<b>"+ feature.properties.funding +"</b></p>"+
        "</div>"+
        "</div>";
        layer.bindPopup(popupContent);
    }
});

var bridgeIcon = L.icon({
    iconUrl:'/static/images/bridges.png',
    iconSize:[24, 24],
    iconAnchor:[0,0]
});

var roadBridges = L.geoJson(null, {
    style:function(feature) {
        return {
            fillColor:"#fc8d59",
            color:"#c9c122",
            weight:0.5
        }
    },
    pointToLayer:function(feature, latLng) {
        return L.marker(latLng, {icon:bridgeIcon});
    },
    onEachFeature:function(feature, layer) {
        let popupContent = "<div class='popup-content'>"+
        "<h5 class='popup-title'>"+ feature.properties.road_no +"</h5>"+
        "<div class='popup-body'>"+
            "<p class='popup-item'>Bridge Type<b>"+ feature.properties.bridge_typ +"</b></p>"+
            "<p class='popup-item'>Cross Type<b>"+ feature.properties.cross_typ +"</b></p>"+
            "<p class='popup-item'>Structure Type<b>"+ feature.properties.struct_typ +"</b></p>"+
        "</div>"+
        "</div>";
        layer.bindPopup(popupContent);
    }
}).addTo(map);

function createPopupContent(properties) {
    return ;
}

// ward layer
var wards = L.geoJson(null, {
    style:function() {
        return {
            fillColor:"#fc8d59",
            color:"#c9c122",
            weight:0.5
        }
    },
    onEachFeature:onEachWardFeature
});

function onEachWardFeature(feature, layer) {
    let popupContent = "<div class='popup-content'>"+
    "<h5 class='popup-title'>"+ feature.properties.elec_area_field +"</h5>"+
    "<div class='popup-body'>"+
        "<p class='popup-item'>Local Authority<b>"+ feature.properties.local_auth +"</b></p>"+
        "<p class='popup-item'>Contituency<b>"+ feature.properties.const_nam +"</b></p>"+
    "</div>"+
    "</div>";
    layer.bindPopup(popupContent);
}

// municipality area
var municipality = L.geoJson(null, {
    style:{
        fillColor:"#91cf60",
        fillOpacity:0.6,
        color:"#E9E9E9",
        weight:1
    },
    onEachFeature:function(feature, layer) {
        let popupContent = "<div class='popup-content'>"+
        "<h5 class='popup-title'>Municipality</h5>"+
        "<div class='popup-body'>"+
            "<p class='popup-item'>Eldoret Municipality</p>"+
        "</div>"
        "</div>";
        layer.bindPopup(popupContent);
    }
});

// load the data
let requests = [fetch("/roads"), fetch("/other_data")];
let dataLoad = Promise.all(requests);

fetch("/roads_data/")
.then(response => {
    console.log(response);

    return response.json()
}).then(data => {
    console.log(data);
    const { road, road_condition, development, bridges} = data;
    // add year column
    // road.features.forEach(feature => {
    //     if(feature.properties.constructi) {
    //         feature.properties.year = feature.properties.constructi.split(",")[1]
    //     }
        
    //     return feature;
    // });

    roadsData = JSON.parse(road);

    // console.log(road);
    let developmentData = JSON.parse(development);

    console.log(developmentData);
    // update the filter arrays;
    developmentNature = getUniqueValues(developmentData, "nature_dvp");
    maintenanceType = getUniqueValues(developmentData, "maint_type");
    status = getUniqueValues(developmentData, "status");
    contractors = getUniqueValues(developmentData, "contractor");
    funding = getUniqueValues(developmentData, "funding");

    // update geojson objects
    roads.addData(JSON.parse(road));
    roadCondition.addData(JSON.parse(road_condition));
    roadDevelopment.addData(JSON.parse(development));
    roadBridges.addData(JSON.parse(bridges));


    // update the cost slider 
    let costSum = developmentData.features.map(feature => parseInt(feature.properties.conct_sum)).filter(cost => cost);
    costSum.sort((a,b) => a -b);

    console.log(costSum);

    $("#cost-slider").slider({
        min: 0, 
        max: costSum[costSum.length -1], 
        value: [0, costSum[costSum.length -1]], 
        focus: true 
    }).on('slide', function(e) {
        // console.log(e);
        e.stopPropagation();

        let value = e.value;
        console.log(value);

        // filter the data;
        roadDevelopment.eachLayer(layer => {
            let sum = layer.feature.properties.conct_sum;
            sum = parseInt(sum) ? parseInt(sum) : 0;
            console.log(sum);

            if(sum >= value[0] && sum < value[1]) {
                console.log(layer);
                layer.setStyle({
                    opacity:1
                });
            } else {
                layer.setStyle({
                    opacity:0
                });
            }
        });
    });

    updateSelectElement(maintenanceType, maintenanceSelect);
    updateSelectElement(developmentNature, devSelect);
    // updateSelectElement(contractors, contractorSelect);
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

function updateSelectElement(data, element) {
    element.innerHTML = "";
    element.innerHTML += "<option value='all'>All ...</option>";

    data.forEach(entry => {
        element.innerHTML += "<option value='"+ entry +"'>"+ entry +"</option>";
    });
}

// layer control
var overlay = {
    "Roads":roads,
    "Road Condition": roadCondition,
    "Development":roadDevelopment,
    "Bridges":roadBridges,
    "Ward" :wards,
    "Municipility":municipality
};

var baseLayer = {
    "Carto Light":cartoLight,
    "Carto Dark": cartoDark
};

L.control.layers(baseLayer, overlay, {collapsed:true}).addTo(map);


// Event listeners
map.on("overlayadd", function(e) {
    console.log(e);
    roads.bringToFront();

    if(e.name ="Road Condition") {
        // update the legend
        let conditionData = roadCondition.toGeoJSON();
        let statusData = conditionData.features.map(feature => feature.properties.rd_condtn);
        statusData = statusData.reduce((a, b) =>{
            if(a.indexOf(b) == -1) {
                a.push(b);
            }

            return a;
        }, []);

        let feature = conditionData.features[0];
        var legendContent = getLegendContent(statusData, feature, 'rd_condtn', "rd_condtn", true);

        let legendContainer = document.getElementById("collapseOne");
        legendContainer.innerHTML = legendContent;
    }
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

   div.innerHTML += '<div class="collapse" id="collapseOne"></div>';

    return div;
}

legendControl.addTo(map);

var visualType = document.querySelectorAll(".form-group .form-check");
visualType.forEach(visual => {
    visual.addEventListener("change", function(e) {
        // get the value
        let value = e.target.value;
        console.log()
        updateVisual(value);
    });
});


function updateVisual(value) {
    roadDevelopment.eachLayer(layer => {
        let feature = layer.feature;
        layer.setStyle({
            color:getRoadColor(feature, value),
            weight:3
        });
    });

    if(value != "default") {
        updateLegend(value);
        if(!map.hasLayer(cartoDark)) {
            cartoDark.addTo(map);
            map.removeLayer(cartoLight);
        }
    } else {
        let legendContainer = document.getElementById("collapseOne");

        legendContainer.innerHTML = "";
    }
}

// update the legend with the corresponding visual type
function updateLegend(value) {
    let legendContainer = document.getElementById("collapseOne");
   
    // create a color scale
    let legendContent = "";
    let feature = roadDevelopment.toGeoJSON().features[0];

    if(value == "status") {
        legendContent = getLegendContent(status, feature, "status", value);
    } else if (value == "contractor") {
        legendContent = getLegendContent(contractors, feature, "contractor", value);
    } else if (value == "funding") {
        legendContent = getLegendContent(funding, feature, "funding", value);
    } else if (value == "developmentType") {
        legendContent = getLegendContent(developmentNature, feature, "nature_dvp", value);
    } else if (value == "maintenanceType") {
        legendContent = getLegendContent(maintenanceType, feature, "maint_type", value);
    } 


    legendContainer.innerHTML = legendContent;
}

// legend colors
function getLegendContent(data, feature, field, value, isCondition=False) {
    let legendContent = "";
    data.forEach(element => {
        feature.properties[field] = element;
       
        let color = isCondition ? getRoadConditionColor(feature) : getRoadColor(feature, value);

        legendContent += "<div class='legend_wrapper'><div class='legend-item' style='background-color:"+color+"'></div><span>"+element+"</span></div>";
    });

    return legendContent;
}


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

// Filter data
var progessButtons = document.querySelectorAll(".col .form-check");
progessButtons.forEach(progressButton => {
    progressButton.addEventListener("change", function(e) {
        let value = e.target.value;
        let currentYear = new Date().getFullYear();

        let data = JSON.parse(JSON.stringify(roadsData));
        roads.clearLayers();
        if(value == "completed") {
            data.features = data.features.filter(feature => feature.properties.year <= currentYear);
            roads.addData(data);
        } else if (value == "all") {
            roads.addData(data);
        } 
        else {
            data.features = data.features.filter(feature => feature.properties.year >= currentYear);
            roads.addData(data);
        }
    });
});

// select filters
var customSelect = document.querySelectorAll(".custom-select");

customSelect.forEach(cs => {
    cs.addEventListener("change", function(e) {
        let value = e.target.value;
        let name = e.target.name;

        let data = JSON.parse(JSON.stringify(roadsData));

        if(value == "all") {
            roadDevelopment.eachLayer(layer => {
                layer.setStyle({opacity:1});
            });

            return;
        }

        // filter accordingly
        if(name == "maintanence") {
            roadDevelopment.eachLayer(layer => {
                if(layer.feature.properties.maint_type == value) {
                    layer.setStyle({opacity:1});
                } else {
                    layer.setStyle({opacity:0});
                }
            });

        } else if (name == "development") {
            roadDevelopment.eachLayer(layer => {
                if(layer.feature.properties.nature_dvp == value) {
                    layer.setStyle({opacity:1});
                } else {
                    layer.setStyle({opacity:0});
                }
            });
        } else {

        }

        // roadDe.addData(data);

    });
});

// Search road segments
// Search 
searchInput.addEventListener("input", function(e) {
    let value = e.target.value;
    if(value.length >= 2) {
        filterRoadSegment(value);
    } else {
        searchResult.innerHTML = "";
    }
});

function filterRoadSegment(query) {
    // filter road matching the query
    let data = JSON.parse(JSON.stringify(roadsData));
    data.features = data.features.filter(feature => {
        let roadName = feature.properties.name;
        if(roadName && roadName.toLowerCase().includes(query.toLowerCase()) ) {
            return feature;
        }
    });

    // create list item
    if(data.features.length > 7) {
        data.features = data.features.slice(0,7);
    }

    if(data.features.length > 0) {
        let docFragment = document.createDocumentFragment();

        data.features.forEach(feature => {
            let listItem = document.createElement("li");
            listItem.setAttribute("class", "list-group-item");
            listItem.setAttribute("id", feature.properties.pk);
            listItem.setAttribute("data-name", feature.properties.name);

            listItem.innerHTML = feature.properties.name;

            listItem.addEventListener("click", listEventListener);

            docFragment.append(listItem);
        });

        searchResult.innerHTML = "";
        searchResult.append(docFragment);
    } else {
        searchResult.innerHTML = "<p class='bg-light'>No result found</p>"
    }

}

function listEventListener(e) {
    let data = JSON.parse(JSON.stringify(roadsData));

    // get target attrinute;
    let target = e.target;
    let roadPk = target.getAttribute("id");
    let name = target.getAttribute("data-name");

    // update search input value
    searchInput.value = name;
    searchResult.innerHTML = "";

    // zoom to road layer
    data.features = data.features.filter(feature => feature.properties.pk == roadPk);
    console.log(data);

    // create a geojson with result
    let feature = L.geoJson(data, {
        style:function(feature) {
            return {
                color:"#c7f709",
                weight:4
            }
        },
        onEachFeature:onEachRoadFeature
    }).addTo(map);
    map.fitBounds(feature.getBounds());
}