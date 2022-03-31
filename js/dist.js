

am5.ready(function() {

    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("distchart");
    
    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    
    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        layout: root.verticalLayout
      })
    );
    
    // Create axes and their renderers
    var yRenderer = am5xy.AxisRendererY.new(root, {
      visible: false,
      minGridDistance: 20,
      inversed: true
    });
    
    yRenderer.grid.template.set("visible", false);
    
    var yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        renderer: yRenderer,
        categoryField: "category"
      })
    );
    
    var xRenderer = am5xy.AxisRendererX.new(root, {
      visible: false,
      minGridDistance: 30,
      inversed: true
    });
    
    xRenderer.grid.template.set("visible", false);
    
    var xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        renderer: xRenderer,
        categoryField: "category"
      })
    );
    
    // Create series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/#Adding_series
    var series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        calculateAggregates: true,
        stroke: am5.color(0xffffff),
        clustered: false,
        xAxis: xAxis,
        yAxis: yAxis,
        categoryXField: "x",
        categoryYField: "y",
        valueField: "value"
      })
    );
    
    series.columns.template.setAll({
      tooltipText: "{x} at {y}:00\n[bold]{value}[\]",
      width: am5.percent(100),
      height: am5.percent(100),
      templateField: "columnSettings"
    });
    
    
    // Add heat rule
    series.set("heatRules", [{
      target: series.columns.template,
      min: am5.color(0xccf2de),
      max: am5.color(0x226d41),
      dataField: "value",
      key: "fill"
    }]);
    
    // Set data
    am5.net.load("dist.json", distchart).then(function (result) {
        let alldata = am5.JSONParser.parse(result.response);
        let distdata = [];
        let week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        Object.entries(alldata).forEach(function(kv){
            kv[1].forEach(function (val, i){
                distdata.push({
                    y: i,
                    x: week[parseInt(kv[0])],
                    value: val,
                    columnSettings: {
                        fill: am5.color(0xe1d92d)
                    }
                });
            });
        });
        series.data.setAll(distdata);
    
        yAxis.data.setAll([
            { category: 23 },
            { category: 22 },
            { category: 21 },
            { category: 20 },
            { category: 19 },
            { category: 18 },
            { category: 17 },
            { category: 16 },
            { category: 15 },
            { category: 14 },
            { category: 13 },
            { category: 12 },
            { category: 11 },
            { category: 10 },
            { category: 9 },
            { category: 8 },
            { category: 7 },
            { category: 6 },
            { category: 5 },
            { category: 4 },
            { category: 3 },
            { category: 2 },
            { category: 1 },
            { category: 0 }
        ]);
        
        xAxis.data.setAll([
            { category: "Sat" },
            { category: "Sun" },
            { category: "Fri" },
            { category: "Thu" },
            { category: "Wed" },
            { category: "Tue" },
            { category: "Mon" }
        ]);
        
        chart.appear(1000, 100);
    });
}); // end am5.ready()
   