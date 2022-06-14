//retive data
var world;
var dists;
var requests;
var devices;
var statuses;
var bests = [];

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

$(".seemore").click(function(){
    let btn = $(this);
    btn.html("Loading...").attr("disabled", true)
    showCountryInsights(btn.data("country"), btn)
})


//UTILITY FUNCTIONS
function showCountryInsights(country, btn){
    loadLineChart("modal", requests[country]);
    loadDistChart(country);
    loadCountry(country, "modal");
    setTimeout(function () {
        $("#fsModal").modal("show");
        loadPies(country)
        if (btn != undefined)
            btn.html("See more analytics").attr("disabled", false)
    }, 1000);
}

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
    bests = Object.fromEntries(
        Object.entries(world).slice(0, 5)
    );
    Object.entries(bests).forEach(function(kv, index){
        $("#flagcontainer").append('<li class="text-center"><span class="avatar avatar-64 img-circle flagnotselected" data-index="'+kv[0]+'"><img src="https://flagcdn.com/36x27/'+kv[0].toLowerCase()+'.png" alt="'+kv[0]+'"></span><p>#'+(index+1)+'</p></li>')
    });
    $(".flagnotselected").eq(0).click();
}

$("body").on("click", ".flagnotselected", function(){
    $(".flagselected").removeClass("flagselected").addClass("flagnotselected");
    $(this).removeClass("flagnotselected").addClass("flagselected");
    let country = $(this).data("index");
    let kv = bests[country];
    console.log(kv)
    $("#creqs_1").text(kv["unique"]);
    $("#totreqs_1").text(kv["reqs"]);
    $("#section1 .seemore").data("country",country)
    loadLineChart(1, requests[country])
    loadPies(country, 1)
})

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