var polygonSeries;
function loadGlobe(){
    am5.ready(function() {
        // -------------  MAIN GLOBE -----------
        var root = am5.Root.new("chartdiv");
        root.setThemes([
            theme_color.new(root)
        ]);

        // Create the map chart
        chart = root.container.children.push(am5map.MapChart.new(root, {
            panX: "rotateX",
            panY: "rotateY",
            wheelX: "none",
            wheelY: "none",
            projection: am5map.geoOrthographic(),
        }));
        chart.chartContainer.wheelable = false;
        chart.maxZoomLevel = 1;
        

        // Create main polygon series for countries
        polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow,
            valueField: "value",
            value: 0
        }));


        var heatLegend = chart.children.push(
            am5.HeatLegend.new(root, {
                orientation: "vertical",
                startColor: am5.color(0xe6d3e4),//0xbd9fbb
                endColor: am5.color(0x875692),
                startText: "Lowest",
                endText: "Highest",
                stepCount: 200
            })
        );

        heatLegend.startLabel.setAll({
            fontSize: 12,
            fill: heatLegend.get("startColor")
        });

        heatLegend.endLabel.setAll({
            fontSize: 12,
            fill: heatLegend.get("endColor")
        });

        heatLegend.set("startValue", 0);

        //countries
        
        let maxGlobe = world[Object.entries(world).reduce((a, b) => a[1][""] > b[1]["reqs"] ? a : b)[0]];
        polygonSeries.set("heatRules", [{
            target: polygonSeries.mapPolygons.template,
            dataField: "value",
            min: am5.color(0xbd9fbb),
            max: am5.color(0x875692),
            maxValue: maxGlobe["reqs"],
            key: "fill"
        }]);
        heatLegend.set("endValue", maxGlobe["reqs"]);
        
        polygonSeries.mapPolygons.template.setAll({
            tooltipText: "{name}: {value}",
            toggleKey: "active",
            interactive: true,
            fill: am5.color(0x898989),
        });

        polygonSeries.mapPolygons.template.states.create("hover", {
            fill: root.interfaceColors.get("primaryButtonHover")
        });

        polygonSeries.mapPolygons.template.states.create("active", {
            fill: root.interfaceColors.get("primaryButtonActive")
        });

        // Create series for background fill
        // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
        var backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
        backgroundSeries.mapPolygons.template.setAll({
            fill: root.interfaceColors.get("alternativeBackground"),
            fillOpacity: 0.1,
            strokeOpacity: 0
        });
        backgroundSeries.data.push({
            geometry: am5map.getGeoRectangle(90, 180, -90, -180)
        });

        polygonSeries.mapPolygons.template.events.on("click", function(ev) {
            let country = ev.target.dataItem.get("id");
            showCountryInsights(country);
        });

        polygonSeries.mapPolygons.template.events.on("pointerover", function(ev) {
            heatLegend.showValue(ev.target.dataItem.get("value"));
        });

        polygonSeries.events.on("datavalidated", function () {
            $(window).trigger("resize"); //update canvas height
        })


        // Set up events
        var previousPolygon;

        polygonSeries.mapPolygons.template.on("active", function (active, target) {
        if (previousPolygon && previousPolygon != target) {
            previousPolygon.set("active", false);
        }
        if (target.get("active")) {
            var centroid = target.geoCentroid();
            if (centroid) {
            chart.animate({ key: "rotationX", to: -centroid.longitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) });
            chart.animate({ key: "rotationY", to: -centroid.latitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) });
            }
        }

        previousPolygon = target;
        });

        chart.animate({
            key: "rotationX",
            from: 0,
            to: 360,
            duration: 30000,
            loops: Infinity
        });

        // Make stuff animate on load
        chart.appear(1000, 100);

    }); // end am5.ready()


    var wind = $(window);
    var chartdiv = $("#chartdiv")
    //set right globe height
    wind.resize(function() {
        chart.root.dom.style.height = wind.height() + "px";
        chartdiv.css("height", wind.height() + "px !important");

    });

    //managing scrolls
    let presentations = $(".nav");
    let first = true;
    wind.scroll(function (event) {
        var scroll = wind.scrollTop();
        if (scroll >= wind.height()/3 *2){
            presentations.fadeIn("slow");
        } else {
            presentations.fadeOut();
        }
        if (first){
            first = false;
            $('body').data()['bs.scrollspy'].options.offset = wind.height()/2
        }
    });

    setTimeout(function(){
        Object.entries(world).forEach(function(kv){
            polygonSeries.getDataItemById(kv[0]).set("value", kv[1]["reqs"])
        });
    }, 100)
}
