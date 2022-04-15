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