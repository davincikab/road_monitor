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

cartoLight.addTo(map);

var isgeolocateByMapClick;
var isGeolocationActive;
var myLocation;
var userLocationModal = $("#user-location-modal");
var geolocateModal = $("#geolocate-prompt");
var roadCondtionForm = $("#road-condition-form");
var roadConditionFormElement = document.querySelector("#road-condition-form");
var confirmUserLocationButton = $("#confirm-location");
var dismissUserLocationButton = $("#dismiss-location");
var imageData = null;
var userLocationMarker;

map.on('click', function(e) {
    console.log(e);
    if(isgeolocateByMapClick) {
         // prompt the user to set as their location
        geolocateModal.modal('show');
        myLocation = e.latlng;
        userLocationMarker = L.marker(e.latlng).addTo(map);
    }
   
});

// load report data
var issueResolvedIcon = L.icon({
    iconUrl:"/static/images/green.png",
    iconSize:[30, 55],
    popupAnchor:[-3, -30]
});

var issueNotResolvedIcon = L.icon({
    iconUrl:"/static/images/red.png",
    iconSize:[30, 55],
    popupAnchor:[-3, -30]
});

var reportedIssues = L.geoJSON(null, {
    onEachFeature:function(feature, layer) {
        let bgColor = feature.properties.is_resolved ? "bg-success" : "bg-danger";

        let popupContent = "<div class='popup-content'>"+
            "<h5 class='popup-title "+ bgColor +"'>"+ feature.properties.title+"</h5>"+
            "<div class='popup-body'>"+
                "<p class='popup-item'>Report Type<b>"+ feature.properties.report_type +"</b></p>"+
                "<p class='popup-item'>Reported On<b>"+ feature.properties.date +"</b></p>"+
                "<img class='img-popup mb-2' src='/media/"+ feature.properties.image +"'>"+
            "</div>"+
            "</div>";
        layer.bindPopup(popupContent);
    },
    pointToLayer:function(feature, latlng) {
        if(feature.properties.is_resolved) {
            return L.marker(latlng, {icon:issueResolvedIcon});
        }

        return L.marker(latlng, {icon:issueNotResolvedIcon});
    }
});

reportedIssues.addTo(map);

function loadReportData() {
    fetch("/road_report_data/")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        reportedIssues.addData(data);
    })
    .catch(error => {
        console.error(error);
    })
}

loadReportData();

// Geolocation control
var geolocationControl = new L.Control({position:'topleft'});
geolocationControl.onAdd = function(map) {
    let div = L.DomUtil.create('div', 'leaflet-bar');
    div.innerHTML = '<a><i class="fa fa-location-arrow"></i></a>'

    div.addEventListener('click', function(e) {
        triggerGeolocation();
    });

    return div;
}

geolocationControl.addTo(map);

function triggerGeolocation() {
    if(isGeolocationActive) {
        map.stopLocate();
        isGeolocationActive = false;

        // update the geolocation Icon
    } else {
        map.locate({
            watch:true,
            setView:true,
            enableHighAccuracy:true
        });
    }
}

map.on("locationfound", function(e) {
    // update myLocation
    myLocation = e.latlng;

    userLocationMarker = L.marker(e.latlng).addTo(map);

    // open the modal
    setTimeout(function(e) {
        userLocationModal.modal("show");
    }, 2000);
    
});

map.on("locationerror" , function(e) {
    isgeolocateByMapClick = true;
    alert("Click your Location on the Map");
});

// geolocation
confirmUserLocationButton.on("click", function(e) {
    geolocateModal.modal('hide');
    isgeolocateByMapClick = false;

    // modal
    userLocationModal.modal("show");
});


dismissUserLocationButton.on("click", function(e) {
    myLocation = null;
    geolocateModal.modal('hide');
});

// WebCam
const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const snapSoundElement = document.getElementById('snapSound');
const webcam = new Webcam(webcamElement, 'user', canvasElement, snapSoundElement);
const takeSnapButton = $("#take-snap");
const stopSnapButton = $("#stop-snap");
const flipSnapButton = $("#flip-snap");

takeSnapButton.on("click", function(e) {
    takeSnap();
});

function takeSnap() {
    let picture = webcam.snap();

    console.log("Snapshot");
    document.querySelector('#download-photo').src = picture;
    imageData = picture;

    $('#download-photo').toggleClass("d-none");

    // nn
    toggleSnap();
}

stopSnapButton.on("click", function(e) {
    toggleSnap();
});

function toggleSnap() {
    console.log(stopSnapButton.text());
     // toggle cam 
     if(stopSnapButton.text()  == "stop") {
        webcam.stop();
        stopSnapButton.text("start");

        // 
       
    } else {
        webcam.start();
        stopSnapButton.text("stop");
        $('#download-photo').toggleClass("d-none");
    }

    $('.cam').toggleClass('d-none');

}

flipSnapButton.on("click", function(e) {
    webcam.flip();
    webcam.start();
});

// commit the data to db
roadCondtionForm.on("submit", function(e) {
    e.preventDefault();

    toggleSnap();
    if(!imageData) {
        alert("Kindly provide an image");
        return;
    }

    let roadCondtionData = new FormData(roadConditionFormElement);

    roadCondtionData.append('geom', Object.values(myLocation).reverse().join(" "));

    // add image data
    roadCondtionData.append('image-data', imageData);

    console.log(Object.fromEntries(roadCondtionData));
    
    // add the geom
    fetch('/road_report_condition/', {
        method:'POST',
        body:roadCondtionData
    })
    .then(response => response.json())
    .then(res => {
        console.log(res);
        if(res.message == 'success') {
            userLocationModal.modal('hide');
            roadConditionFormElement.reset();

            loadReportData();
            userLocationMarker.remove();
            userLocationMarker = null;
            isgeolocateByMapClick = false
            // update snackbar message
        //    snackbar.addClass('open');
        //    snackbar.text("Successfully reported your location")
        } else {
            console.error(res.errors);
            $('error-message').text("");
        }

        toggleSnap();
    })
    .catch(error => {
        console.error(error);
    });
});

$('#dismiss-location').on('click', function(e) {
    roadConditionFormElement.reset();
    myLocation = null;

    userLocationModal.modal('hide');
    userLocationMarker.remove();
});


// TODO: 
/*
    WORK CUSTOM MARKERS FOR EACH TYPE
    ANIMATE REPORT DATE
    
    CAMERA AND THE MODAL behaviour on mobile phone.
*/