var ctxLine = document.getElementById('construction-chart').getContext('2d');

var roadsChart = new Chart(ctxLine, {
    type: 'line',
    data: {
        labels:["2013", "2014", "2015", "2016", "2017"],
        datasets:[{
            data:[2, 5, 10, 25, 15],
            backgroundColor:"#36384480"
        }]
    },
    options: {
        title: {
            display: true,
            text: 'Road Construction'
        },
        legend: {
            display: false,
            labels: {
                fontColor: 'rgb(255, 99, 132)'
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    stepSize: 1
                }
            }],
            xAxes:[{
                ticks:{
                    beginAtZero: false,
                    stepSize: 3
                }
            }]
        }
    }
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
    options: {
        title: {
            display: true,
            text: 'Road Maintenance'
        },
        legend: {
            display: false,
            labels: {
                fontColor: 'rgb(255, 99, 132)'
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    stepSize: 1
                }
            }]
        }
    }
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
    options: {
        title: {
            display: true,
            text: 'Road Structure'
        },
        legend: {
            display: false,
            labels: {
                fontColor: 'rgb(255, 99, 132)'
            }
        },
    }
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
    options: {
        title: {
            display: true,
            text: 'Road Surface'
        },
        legend: {
            display: false,
            labels: {
                fontColor: 'rgb(255, 99, 132)'
            }
        },
    }
});

// load the data
fetch("/dashboard_data/")
.then(response => {
    return response.json();
})
.then(data => {
    console.log(data);
    let {construction, maintenance, structure, surface} = data;

    // construction
    let [years, constructionCount] = cleanAndSort(construction, "constructi");
    roadsChart.data.labels = years;
    roadsChart.data.datasets[0].data = constructionCount
    roadsChart.update();

    // Maintenance
    let [maintenanceYears, maintenanceCount] = cleanAndSort(maintenance, "maintenanc");

    maintenanceChart.data.labels = maintenanceYears;
    maintenanceChart.data.datasets[0].data = maintenanceCount;
    maintenanceChart.update();

    // surface
    console.log(surface);
    roadSurfaceChart.data.labels = surface.map(el => el.surface);
    roadSurfaceChart.data.datasets[0].data =  surface.map(el => el.count);
    roadSurfaceChart.update();

    // structure
    console.log(structure);
    roadStructureChart.data.labels = structure.map(el => el.road_struc);
    roadStructureChart.data.datasets[0].data =  structure.map(el => el.count);
    roadStructureChart.update();


})
.catch(error => {
    console.log(error);
});

function cleanAndSort(data, field) {
    newData = data.filter(element => element[field]).map(element => {
        element.year = parseInt(element[field].split(',')[1]);
        return element;
    });

    newData = newData.sort((a, b) => a.year - b.year);
    let years = newData.map(el => el.year);
    let values = newData.map(el =>  el.count);

    return [years, values]
}

// filter 
let contractorsData = document.getElementById("contractors").innerHTML;

// clean the string an create an array
contractorsData = contractorsData.trim().toString().slice(13, -4);
console.log(contractorsData);