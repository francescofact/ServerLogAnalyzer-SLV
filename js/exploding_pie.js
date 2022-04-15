var debug = "";
am5.ready(function() {

    // Create root element
    var root = am5.Root.new("expiechart");
    root.setThemes([theme_color.new(root)]);
    
    var container = root.container.children.push(
        am5.Container.new(root, {
        width: am5.p100,
        height: am5.p100,
        layout: root.horizontalLayout
        })
    );
    
    // Create main chart
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
    var chart = container.children.push(
        am5percent.PieChart.new(root, {
            tooltip: am5.Tooltip.new(root, {
                labelText: "[bold]{category}[/]\n{valuePercentTotal.formatNumber('0.00')}%\n{value} reqs",
            })
        })
    );
    
    // Create series
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
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
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
    var subChart = container.children.push(
        am5percent.PieChart.new(root, {
            radius: am5.percent(50),
            tooltip: am5.Tooltip.new(root, {
                labelText: "[bold]{category}[/]\n{valuePercentTotal.formatNumber('0.00')}%\n{value} reqs"
            })
        })
    );
    
    // Create sub series
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
    var subSeries = subChart.series.push(
        am5percent.PieSeries.new(root, {
            valueField: "value",
            categoryField: "os"
        })
    );
    
    subSeries.slices.template.set("toggleKey", "none");
    


    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
    var subChart2 = container.children.push(
        am5percent.PieChart.new(root, {
            radius: am5.percent(50),
            tooltip: am5.Tooltip.new(root, {
                labelText: "[bold]{category}[/]\n{valuePercentTotal.formatNumber('0.00')}%\n{value} reqs"
            })
        })
    );
    
    // Create sub series
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
    var subSeries2 = subChart2.series.push(
        am5percent.PieSeries.new(root, {
            valueField: "value",
            categoryField: "browser"
        })
    );
    
    subSeries2.slices.template.set("toggleKey", "none");


    var selectedSlice;

    // Set data
    am5.net.load("devices.json", distchart).then(function (result) {
        let devices = am5.JSONParser.parse(result.response);
        series.data.setAll(devices);
    });
    
    function selectSlice(slice) {
        selectedSlice = slice;
        var dataItem = slice.dataItem;
        var dataContext = dataItem.dataContext;
    
        if(dataContext["device"] == "Bot")
            return;
        
        debug = subSeries
        if (dataContext) {
            subSeries.data.clear()
            dataContext.os.forEach(function(os){
                subSeries.data.push(os)
            })

            subSeries2.data.clear()
            let totals = sumObjsChildren(dataContext.browser, "value");
            dataContext.browser.forEach(function(browser){
                console.log([browser.value, totals])
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
    
}); // end am5.ready()
