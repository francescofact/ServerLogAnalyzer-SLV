var modalCO = null;
function loadCountry(country, div){
    //create map
    if (div == "modal" && modalCO != null)
        modalCO.dispose();
        
        var root = am5.Root.new("countrychart_"+div);
        root.setThemes([
          theme_color.new(root)
        ]);
        if (div == "modal"){
            modalCO = root;
        }
    
    
    var chart = root.container.children.push(
        am5map.MapChart.new(root, {
            panX: "rotateX",
            panY: "rotateY",
            wheelX: "none",
            wheelY: "none",
        })
    );
    var polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow,
            include: [country],
            fill: "#f3c300"
        })
    );
    
    //add dots
    let cities = world[country]["cities"];
    var pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));
    pointSeries.bullets.push(function () {
        var container = am5.Container.new(root, {});
        
        container.children.push(
            am5.Circle.new(root, {
                radius: 2,
                fill: "#db2d21",
                strokeOpacity: 0
            })
        );
        
        return am5.Bullet.new(root, {
            sprite: container
        });
    });

    for (var i = 0; i < cities.length; i++) {
        var city = cities[i];
        pointSeries.data.push({
            geometry: { type: "Point", coordinates: [city[1], city[0]] },
            title: city[2]
        });
    }

}