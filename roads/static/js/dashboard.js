var ctxLine = document.getElementById('construction-chart').getContext('2d');

var roadsChart = new Chart(ctxLine, {
    type: 'line',
    data: {
        labels:["2013", "2014", "2015", "2016", "2017"],
        datasets:[{
            // label: "Construction of Roads",
            data:[2, 5, 10, 25, 15],
            backgroundColor:"#36384480"
        }]
    },
    options: {
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

// load the data
fetch("/dashboard_data/")
.then(response => {
    return response.json();
})
.then(data => {
    let {construction, maintenance, structure, surface} = data;

    // construction
    let [years, constructionCount] = cleanAndSort(construction, "constructi");
    roadsChart.data.labels = years;
    roadsChart.data.datasets[0].data = constructionCount
    roadsChart.update();

    // Maintenance
    console.log(maintenance);
    let [maintenanceYears, maintenanceCount] = cleanAndSort(maintenance, "maintenanc");

    console.log(maintenanceYears);
    maintenanceChart.data.labels = maintenanceYears;
    maintenanceChart.data.datasets[0].data = maintenanceCount;
    maintenanceChart.update();

    // surface
    // structure


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