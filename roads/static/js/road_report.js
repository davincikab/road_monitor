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

map.on('click', function(e) {
    console.log(e);
    if(isgeolocateByMapClick) {
         // prompt the user to set as their location
        geolocateModal.modal('show');
        myLocation = e.latlng;
    }
   
});

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
}

stopSnapButton.on("click", function(e) {
    toggleSnap();
});

function toggleSnap() {
     // toggle cam 
     if(stopSnapButton.text()  == "start") {
        webcam.stop();
        stopSnapButton.text("stop")
    } else {
        webcam.start();
        stopSnapButton.text("start")
    }
}

flipSnapButton.on("flip", function(e) {
    webcam.flip();
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


            // update snackbar message
        //    snackbar.addClass('open');
        //    snackbar.text("Successfully reported your location")
        } else {
            console.error(res.errors);
            $('error-message').text("");
        }
    })
    .catch(error => {
        console.error(error);
    });
});

$('#dismiss-location').on('click', function(e) {
    roadConditionFormElement.reset();
    myLocation = null;

    userLocationModal.modal('hide');
});


