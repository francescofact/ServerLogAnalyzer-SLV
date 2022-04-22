//retive data
var world;
var dists;
var requests;
var devices;
var statuses;

am5.net.load("world.json").then(function (result) {
    let alldata = am5.JSONParser.parse(result.response);
    //countries
    let geodata = alldata["countries"];
    world = geodata;
    loadGlobe();
    loadBarCountries(world);
    am5.net.load("requests.json").then(function (result) {
        requests = am5.JSONParser.parse(result.response);
        loadLineChart("global", requests["global"])
        loadLineChart2("global", requests["global"])
        loadBestCountries();
        setTimeout(function(){
            $(".loading").fadeOut();
        }, 500)
    })
    
})

am5.net.load("dist.json").then(function (result) {
    dists = am5.JSONParser.parse(result.response);
    loadDistChart("global")
});

am5.net.load("devices.json").then(function (result) {
    devices = am5.JSONParser.parse(result.response);
    loadPies("global");
    
});

am5.net.load("status.json").then(function (result) {
    statuses = am5.JSONParser.parse(result.response);
    loadStatusPie("global");
});

//EVENT HANDLERS
$("#closeModal").click(function(){
    $("#fsModal").modal("hide");
})


//UTILITY FUNCTIONS
function stringToDate(_date,_format,_delimiter){
            var formatLowerCase=_format.toLowerCase();
            var formatItems=formatLowerCase.split(_delimiter);
            var dateItems=_date.split(_delimiter);
            var monthIndex=formatItems.indexOf("mm");
            var dayIndex=formatItems.indexOf("dd");
            var yearIndex=formatItems.indexOf("yyyy");
            var month=parseInt(dateItems[monthIndex]);
            month-=1;
            var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
            return formatedDate;
}

function loadBestCountries(){
    const bests = Object.fromEntries(
        Object.entries(world).slice(0, 5)
    );
    Object.entries(bests).forEach(function(kv, index){
        index += 1;
        $("#cname_"+index).html('<img src="https://flagcdn.com/36x27/'+kv[0].toLowerCase()+'.png"/> ');
        $("#cimg_"+index).html('<img src="https://flagcdn.com/36x27/'+kv[0].toLowerCase()+'.png"/> '+ kv[0]);
        $("#creqs_"+index).text(kv[1]["reqs"]);
        loadLineChart(index, requests[kv[0]])
        loadCountry(kv[0], index)
    });
}

function hideSmall(series, min){
    for (let i=0; i<series.labels.values.length; i++){
        let ev = series.labels.values[i];
        let text = ev.getText();
        if (text.includes(" ") && text.includes(".")){
            text = text.split(" ")
            text = text[text.length -1].split(".")[0]
            if (parseInt(text)<min){
                ev.hide();
                series.ticks.values[i].hide();
            }
        }
    }
}