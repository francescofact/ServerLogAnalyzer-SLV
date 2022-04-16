var modalPI = null;
var debug;
function loadPies(country){
    am5.ready(function() {

        // Create root element
        if (country != "global" && modalPI != null)
            modalPI.dispose();
        var root = am5.Root.new("expiechart_"+((country!="global") ? "modal" : "global"));
        root.setThemes([
            theme_color.new(root)
        ]);
        if (country != "global"){
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
        
            if(dataContext["device"] == "Bot")
                return;
            
            if (dataContext) {
                subSeries.data.clear()
                dataContext.os.forEach(function(os){
                    subSeries.data.push(os)
                })

                subSeries2.data.clear()
                let totals = sumObjsChildren(dataContext.browser, "value");
                dataContext.browser.forEach(function(browser){
                    if ((browser.value)*100/totals >  1)
                        subSeries2.data.push(browser)
                })
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


            subSeries.labels.each(hideSmall, 1);
            subSeries2.labels.each(hideSmall, 1);
        }

        function sumObjsChildren(list, key){
            let sum = 0;
            list.forEach(function(e){
                sum += e[key]
            })
            return sum;
        }
        
        container.appear(1000, 10);
        
        series.events.on("datavalidated", function() {
            selectSlice(series.slices.getIndex(0));
        });
        
        setTimeout(function(){
            series.labels.each(hideSmall, 5);
            subSeries.labels.each(hideSmall, 1);
            subSeries2.labels.each(hideSmall, 1);
        }, 100)
    }); // end am5.ready()
    
}

function hideSmall(ev, min) {
    let text = ev.getText();
    console.log(text);
    if (text.includes(" ") && text.includes(".")){
        text = text.split(" ")
        text = text[text.length -1].split(".")[0]
        console.log(text);
        if (parseInt(text)<min)
            ev.hide();
    }
}