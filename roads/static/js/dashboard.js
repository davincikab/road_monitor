var ctxLine = document.getElementById('construction-chart').getContext('2d');

var roadsChart = new Chart(ctxLine, {
    type: 'line',
    data: {
        labels:["2013", "2014", "2015", "2016", "2017"],
        datasets:[{
            label: "# of Roads",
            data:[2, 5, 10, 5, 15],
            backgroundColor:"#36384480"
        }]
    },
    options: {}
});

// Maintenace chart
var ctxLine = document.getElementById('maintenance-chart').getContext('2d');

var maintenanceChart = new Chart(ctxLine, {
    type: 'line',
    data: {
        labels:["2013", "2014", "2015", "2016", "2017"],
        datasets:[{
            label: "# of Maintenance",
            data:[8, 10, 3, 7, 1],
            backgroundColor:"#36384480"
        }]
    },
    options: {}
});

// structure-chart
var ctxLine = document.getElementById('structure-chart').getContext('2d');

var roadStructureChart = new Chart(ctxLine, {
    type: 'bar',
    data: {
        labels:["NULL", "base", "Pavement", "Bitumen", "Sub base"],
        datasets:[{
            label: "Road Structure",
            data:[8, 10, 12, 7, 10],
            backgroundColor:'#EC877B'
        }]
    },
    options: {}
});

// structure-chart
var ctxLine = document.getElementById('surface-chart').getContext('2d');

var roadSurfaceChart = new Chart(ctxLine, {
    type: 'bar',
    data: {
        labels:["NULL", "Asphalt", "Earth", "Murram", "Paved", "Unpaved"],
        datasets:[{
            label: "Road Surface",
            data:[8, 10, 12, 7, 10, 4],
            backgroundColor: "#EC877B"
        }]
    },
    options: {}
});