(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    function drawChart(data) {
        return Highcharts.mapChart('container', {
            chart: {
                map: topology,
                height: 900,
                borderWidth: 1
            },

            colors: ['rgba(19,64,117,0.05)', 'rgba(19,64,117,0.2)', 'rgba(19,64,117,0.4)',
                'rgba(19,64,117,0.5)', 'rgba(19,64,117,0.6)', 'rgba(19,64,117,0.8)', 'rgba(19,64,117,1)'],

            title: {
                text: 'SSH Login Attempts By Country',
                align: 'left'
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    align: 'right'
                }
            },

            mapView: {
                fitToGeometry: {
                    type: 'MultiPoint',
                    coordinates: [
                        // Alaska west
                        [-164, 54],
                        // Greenland north
                        [-35, 84],
                        // New Zealand east
                        [179, -38],
                        // Chile south
                        [-68, -55]
                    ]
                }
            },

            legend: {
                title: {
                    text: 'Logins Per Day',
                    style: {
                        color: ( // theme
                            Highcharts.defaultOptions &&
                            Highcharts.defaultOptions.legend &&
                            Highcharts.defaultOptions.legend.title &&
                            Highcharts.defaultOptions.legend.title.style &&
                            Highcharts.defaultOptions.legend.title.style.color
                        ) || 'black'
                    }
                },
                align: 'left',
                verticalAlign: 'bottom',
                floating: true,
                layout: 'vertical',
                valueDecimals: 0,
                backgroundColor: ( // theme
                    Highcharts.defaultOptions &&
                    Highcharts.defaultOptions.legend &&
                    Highcharts.defaultOptions.legend.backgroundColor
                ) || 'rgba(255, 255, 255, 0.85)',
                symbolRadius: 0,
                symbolHeight: 14
            },

            colorAxis: {
                dataClasses: [{
                    to: 1
                }, {
                    from: 1,
                    to: 50
                }, {
                    from: 50,
                    to: 100
                }, {
                    from: 100,
                    to: 250
                }, {
                    from: 250,
                    to: 500
                }, {
                    from: 500,
                }]
            },

            series: [{
                data: data,
                joinBy: ['iso-a2', 'code'],
                animation: true,
                name: 'SSH Logins',
                states: {
                    hover: {
                        color: '#a4edba'
                    }
                },
                tooltip: {
                    valueSuffix: '/Day'
                },
                shadow: false
            }]
        });
    }

    function refreshData()
    {
        $.get("/update", (data, status) => {
            drawChart(data["locations"]);

          var options = {
            series: [{
            data: data["users"]["yaxis"]
          }],
            chart: {
            type: 'bar',
            height: 1000
          },
          plotOptions: {
            bar: {
              borderRadius: 4,
              horizontal: true,
            }
          },
          dataLabels: {
            enabled: false
          },
          xaxis: {
            categories: data["users"]["xaxis"]
          }
          };

          var chart = new ApexCharts(document.querySelector("#chart"), options);
          chart.render();

        });
    }

    refreshData();

    setInterval(() => {
        refreshData();
    }, 60000);
})();
