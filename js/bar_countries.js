function loadBarCountries(countries){

    // Create root element
    var root = am5.Root.new("barcountries");
    root.setThemes([
        theme_color.new(root)
    ]);
    
    
    // Create chart
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "none",
      wheelY: "none",
      layout: root.verticalLayout
    }));
    
    
    // Data
    var colors = chart.get("colors");
    
    var data = [];
    Object.entries(countries).forEach(function(kv){
        if (data.length < 12)
            data.push({
                country: kv[0],
                visits: kv[1]["reqs"],
                icon: "https://flagcdn.com/28x21/"+kv[0].toLowerCase()+".png",
                columnSettings: { fill: colors.next() }
            });
    });

    // Create axes
    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        categoryField: "country",
        renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: 30
        }),
        bullet: function (root, axis, dataItem) {
            return am5xy.AxisBullet.new(root, {
            location: 0.5,
            sprite: am5.Picture.new(root, {
                width: 28,
                height: 21,
                centerY: am5.p50,
                centerX: am5.p50,
                src: dataItem.dataContext.icon
            })
            });
        }
    }));

    xAxis.get("renderer").labels.template.setAll({
        paddingTop: 20
    });

    xAxis.data.setAll(data);

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
    }));


    // Add series
    var series = chart.series.push(am5xy.ColumnSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "visits",
        categoryXField: "country"
    }));

    series.columns.template.setAll({
        tooltipText: "{categoryX}: {valueY}",
        tooltipY: 0,
        strokeOpacity: 0,
        templateField: "columnSettings"
    });

    series.data.setAll(data);


    // Make stuff animate on load
    series.appear();
    chart.appear(1000, 100);

} // end am5.ready()