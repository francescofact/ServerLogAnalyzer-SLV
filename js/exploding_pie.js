var modalPI = null;
function loadPies(country, index){
    am5.ready(function() {

        // Create root element
        if (index == undefined && country != "global" && modalPI != null)
            modalPI.dispose();
        
        var root = am5.Root.new("expiechart_"+((index==undefined) ? ((country!="global") ? "modal" : "global") : index));
        root.setThemes([
            theme_color.new(root)
        ]);
        if (index == undefined && country != "global"){
            modalPI = root;
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
                categoryField: "device",
                alignLabels: false
            })
        );
        
        
        series.labels.template.setAll({
            textType: "circular",
            radius: 4
        });
        series.ticks.template.set("visible", false);
        series.slices.template.set("toggleKey", "none");
        

        // add events
        series.slices.template.events.on("click", function(e) {
            selectSlice(e.target);
        });
        
        // Create sub chart
        var subChart = container.children.push(
            am5percent.PieChart.new(root, {
                radius: am5.percent(50),
                tooltip: am5.Tooltip.new(root, {
                    labelText: "[bold]{category}[/]\n{valuePercentTotal.formatNumber('0.00')}%\n{value} reqs"
                })
            })
        );
        
        // Create sub series
        var subSeries = subChart.series.push(
            am5percent.PieSeries.new(root, {
                valueField: "value",
                categoryField: "os",
                alignLabels: false
            })
        );
        
        subSeries.slices.template.set("toggleKey", "none");
        
        var subChart2 = container.children.push(
            am5percent.PieChart.new(root, {
                radius: am5.percent(50),
                tooltip: am5.Tooltip.new(root, {
                    labelText: "[bold]{category}[/]\n{valuePercentTotal.formatNumber('0.00')}%\n{value} reqs"
                })
            })
        );
        
        // Create sub series
        var subSeries2 = subChart2.series.push(
            am5percent.PieSeries.new(root, {
                valueField: "value",
                categoryField: "browser"
            })
        );
        
        subSeries2.slices.template.set("toggleKey", "none");


        var selectedSlice;

        // Set data
        series.data.setAll(devices[country]);
        function selectSlice(slice) {
            selectedSlice = slice;
            var dataItem = slice.dataItem;
            var dataContext = dataItem.dataContext;
        
            if(dataContext["device"] == "Bot"){
                alert("No insights for Bots")
                return;
            }
            
            if (dataContext) {
                subSeries.data.clear()
                subSeries.data.setAll(dataContext.os)
                setTimeout(function(){
                    hideSmall(subSeries, 1);
                }, 1)

                subSeries2.data.clear()
                subSeries2.data.setAll(dataContext.browser)
                subSeries2.labels.clear();
                subSeries2.ticks.clear();
            }
            var middleAngle = slice.get("startAngle") + slice.get("arc") / 2;
            var firstAngle = series.dataItems[0].get("slice").get("startAngle");
        
            series.animate({
                key: "startAngle",
                to: firstAngle - middleAngle,
                duration: 1000,
                easing: am5.ease.out(am5.ease.cubic)
            });
            series.animate({
                key: "endAngle",
                to: firstAngle - middleAngle + 360,
                duration: 1000,
                easing: am5.ease.out(am5.ease.cubic)
            });

        }

        function sumObjsChildren(list, key){
            let sum = 0;
            list.forEach(function(e){
                sum += e[key]
            })
            return sum;
        }
        
        container.appear(1000, 10);
        
        setTimeout(function(){
            hideSmall(series, 5);
            hideSmall(subSeries, 2);
            hideSmall(subSeries2, 2);
        }, 100)
    }); // end am5.ready()
    
}
