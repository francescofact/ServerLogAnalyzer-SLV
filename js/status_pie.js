var modalSPI = null;
var debug;

function loadStatusPie(country){
    am5.ready(function() {

        // Create root element
        if (country != "global" && modalSPI != null)
            modalSPI.dispose();
        var root = am5.Root.new("statuschart_"+((country!="global") ? "modal" : "global"));
        root.setThemes([
            theme_color.new(root)
        ]);
        
        if (country != "global"){
            modalSPI = root;
        }
        
        
        var container = root.container.children.push(
            am5.Container.new(root, {
                width: am5.p100,
                height: am5.p100,
                layout: root.horizontalLayout
            })
        );
        
        // Create main chart
        var chart = container.children.push(
            am5percent.PieChart.new(root, {
                tooltip: am5.Tooltip.new(root, {
                    labelText: "[bold]{category}[/]\n{valuePercentTotal.formatNumber('0.00')}%\n{value} reqs",
                })
            })
        );
        
        // Create series
        var series = chart.series.push(
            am5percent.PieSeries.new(root, {
                valueField: "value",
                categoryField: "status",
                alignLabels: false
            })
        );
        
        
        // Set data
        let alldata = [];
        Object.entries(statuses[country]).forEach(function(kv){
            alldata.push({"value": kv[1], "status": kv[0]});
        })
        series.data.setAll(alldata);
        
        container.appear(1000, 10);
        
        setTimeout(function(){
            hideSmall(series, 1);
        }, 100)
    }); // end am5.ready()
    
}