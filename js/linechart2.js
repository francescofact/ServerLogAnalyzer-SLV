var modalLC2= null;
function loadLineChart2(country, alldata){
    am5.ready(function() {
        // Create root element
        if (country == "modal" && modalLC2 != null)
          modalLC2.dispose();
        
        var root = am5.Root.new("linechart2_"+country);
        root.setThemes([
          theme_color.new(root)
        ]);
        if (country == "modal"){
          modalLC2 = root;
        }
        
        
        // Create chart
        // https://www.amcharts.com/docs/v5/charts/xy-chart/
        var chart = root.container.children.push(am5xy.XYChart.new(root, {
          panX: "rotateX",
          panY: "rotateY",
          wheelX: "none",
          wheelY: "none",
          pinchZoomX:true
        }));
        
        
        // Add cursor
        // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
        var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
          behavior: "none"
        }));
        cursor.lineY.set("visible", false);


        var data = [];
        Object.entries(alldata).forEach(function(kv){
            data.push({
                "date": stringToDate(kv[0], "dd/MM/yyyy", "/"),
                "url": kv[1]["url"],
                "users": kv[1]["users"],
                "newusers": kv[1]["newusers"],
            });
            console.log([stringToDate(kv[0], "dd/MM/yyyy", "/"), kv[1]["users"], kv[1]["newusers"]])
        });
    
        // Create axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        var xAxis = chart.xAxes.push(am5xy.CategoryDateAxis.new(root, {
          categoryField: "date",
          baseInterval: { timeUnit: "day", count: 1 },
          renderer: am5xy.AxisRendererX.new(root, {}),
          tooltip: am5.Tooltip.new(root, {})
        }));
        
        xAxis.data.setAll(data);
        
        var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {})
        }));
        
        // Add series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        
        function createSeries(name, field) {
          var series = chart.series.push(am5xy.LineSeries.new(root, {
              name: name,
              xAxis: xAxis,
              yAxis: yAxis,
              stacked:true,
              valueYField: field,
              categoryXField: "date",
              tooltip: am5.Tooltip.new(root, {
                pointerOrientation: "horizontal",
                labelText: "[bold]{name}[/]\n{categoryX}: {valueY}"
              })
          }));
        
          series.fills.template.setAll({
              fillOpacity: 0.5,
              visible: true
          });
          series.data.setAll(data);
          series.appear(1000);
        }
        
        createSeries("New Users", "newusers");
        createSeries("Old Users", "users");
        
        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        chart.appear(1000, 100);
        
    }); // end am5.ready()
}