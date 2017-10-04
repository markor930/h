
//高雄市政府開放資料平台-旅遊景點
var url = "https://hotman0901.github.io/travel/json/datastore_search.json";

var selectAreaObj = document.querySelector(".toSelect");
var hotList = document.querySelector(".hot-area-list");
var contentTitle = document.querySelector(".content-title");
var repage = document.querySelector("#render-page");
var reContent = document.querySelector(".render_Content");
var choose_tabs = document.querySelector(".choose_tabs");
var mapShow_style;
var listShow_style;
var mapKey_script;

var optionData = [];
var data = [];
var show_Map = false;
var can_Choose = false;


/*window.onresize = function () {

    document.querySelector(".header").style.height = window.innerHeight + "px";
}*/

// get JSON file
callAjax(url, 0);

// status 0=initial; 1=select; 2=popular menu.
function callAjax(url, status) {

    var xhttp;


    if (window.XMLHttpRequest) { // Mozilla, Safari, ...

        xhttp = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) { // IE

        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if (!xhttp) {

        alert("Cannot create an XMLHTTP instance");
        return false;
    }

    xhttp.open("GET", url, true);
    xhttp.send(null);

    xhttp.onload = function () {

        //console.log(xhttp);

        //readyState=4: "already get the JSON data.".
        //status=200: "OK". ; status=404: "erro".
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            var content = JSON.parse(xhttp.responseText);
            //console.log(content);

            // get the JSON object: result → records.(all data)
            optionData = content.result.records;
            renderOption(optionData);
        }
        else {

            alert("There was a problem with the request.");
        }
    }
}

//select-option
function renderOption(option) {

    var selectItem = [];

    for (var i = 0; i < option.length; i++) {

        //if the data not in the arry, indexOf=-1.
        if (selectItem.indexOf(option[i].Zone) == -1) {

            selectItem.push(option[i].Zone);
        }
    }

    for (var i = 0; i < selectItem.length; i++) {

        // add option item
        selectAreaObj.options.add(new Option(selectItem[i]));
    }
}

// select
selectAreaObj.addEventListener("change", function (e) {

    if (can_Choose == true) {

        document.body.removeChild(mapKey_script);
        can_Choose = false;
    }

    var objValue = e.target.value;

    choose_tabs.innerHTML =
        "<ul class='tabs'>" +
        "<li class='list_Style'><a href='#'>旅遊資訊列表</a></li>" +
        "<li class='map_Style'><a href='#'>區域景點位置</a></li>" +
        "</ul>";

    mapShow_style = document.querySelector(".map_Style");
    listShow_style = document.querySelector(".list_Style");
    show_Map = false;

    if (objValue != "") {

        // callAjax(url, 1);
        queryArea(objValue);

        // callAjax(url, 2);
        renderContent();
    }
});

// popular menu
hotList.addEventListener("click", function (e) {

    if (can_Choose == true) {

        document.body.removeChild(mapKey_script);
        can_Choose = false;
    }


    e.preventDefault();

    choose_tabs.innerHTML =
        "<ul class='tabs'>" +
        "<li class='list_Style'><a href='#'>旅遊資訊列表</a></li>" +
        "<li class='map_Style'><a href='#'>區域景點位置</a></li>" +
        "</ul>";

    mapShow_style = document.querySelector(".map_Style");
    listShow_style = document.querySelector(".list_Style");
    show_Map = false;

    // click the 「"a"-html tag」.
    if (e.target.nodeName == "A") {

        queryArea(e.target.textContent);

        renderContent();
    }
});


function queryArea(viewPoint_name) {

    // buffer array
    data = [];

    for (var i = 0; i < optionData.length; i++) {

        if (optionData[i].Zone == viewPoint_name) {

            data.push(optionData[i]);
        }
    }
}





function renderContent() {

    if (data.length == 0) {

        contentTitle.textContent = "查無資料";
        reContent.innerHTML = "";
        return false;
    }

    // target="_blank"
    // data title name.
    contentTitle.textContent = data[0].Zone;

    mapShow_style.addEventListener("click", function () {

        show_Map = true;
        console.log(show_Map);
        renderContent();
    }, false);

    listShow_style.addEventListener("click", function () {

        show_Map = false;
        console.log(show_Map);
        renderContent();
    }, false);


    if (show_Map == true) {

        //alert("To show the map!");

        reContent.innerHTML = "<div id='map'></div>";
        mapKey_script = document.createElement('script');

        mapKey_script.setAttribute('src', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCW1N0wycwbxBXBdNGFutyt4a2mgrnPVvc&callback=initMap');
        mapKey_script.setAttribute("async", " ");
        mapKey_script.setAttribute("defer", " ");

        document.body.appendChild(mapKey_script);

        can_Choose = true;
    }
    else {

        var strHtml = "";
        for (var i = 0; i < data.length; i++) {

            var tempHtml =
                "<div class= 'viewPoint'>" +
                "<div class= 'innerFrame'>" +
                "<a href= '" + data[i].Website + "' class='thumbnail' target='_blank'>" +
                "<div class='photo' style='background-image: url(" + data[i].Picture1 + ")'>" +
                "<div class='content-img-title'>" +
                "<h3>" + data[i].Name + "</h3>" +
                "<span>" + data[i].Zone + "</span>" +
                "</div>" +
                "</div>" +

                "<div class='content-info'>" +
                "<span class='content-info-1'>" + data[i].Opentime + "</span>" +
                "<span class='content-info-2'>" + data[i].Add + "</span>" +
                "<span class='content-info-3'>" + data[i].Tel + "</span>" +
                "</div>" +
                "</a >" +
                "</div>" +
                "</div> ";

            strHtml += tempHtml;
        }

        reContent.innerHTML = strHtml;
    }

}

var map;
function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {

        center: { lat: parseFloat(data[0].Py), lng: parseFloat(data[0].Px) },
        zoom: 12
    });


    var mapData = [];

    for (var i = 0; i < data.length; i++) {

        mapData.push({

            position: { lat: parseFloat(data[i].Py), lng: parseFloat(data[i].Px) },
            map: map,
            title: data[i].Name
        });
    }

    console.log(mapData);
    for (var i = 0; i < mapData.length; i++) {

        var marker = new google.maps.Marker(mapData[i]);

    }

}

";

var selectAreaObj = document.querySelector(".toSelect");
var hotList = document.querySelector(".hot-area-list");
var contentTitle = document.querySelector(".content-title");
var repage = document.querySelector("#render-page");
var reContent = document.querySelector(".render_Content");
var choose_tabs = document.querySelector(".choose_tabs");
var mapShow_style;
var listShow_style;
var mapKey_script;

var optionData = [];
var data = [];
var show_Map = false;
var can_Choose = false;


/*window.onresize = function () {

    document.querySelector(".header").style.height = window.innerHeight + "px";
}*/

// get JSON file
callAjax(url, 0);

// status 0=initial; 1=select; 2=popular menu.
function callAjax(url, status) {

    var xhttp;


    if (window.XMLHttpRequest) { // Mozilla, Safari, ...

        xhttp = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) { // IE

        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if (!xhttp) {

        alert("Cannot create an XMLHTTP instance");
        return false;
    }

    xhttp.open("GET", url, true);
    xhttp.send(null);

    xhttp.onload = function () {

        //console.log(xhttp);

        //readyState=4: "already get the JSON data.".
        //status=200: "OK". ; status=404: "erro".
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            var content = JSON.parse(xhttp.responseText);
            //console.log(content);

            // get the JSON object: result → records.(all data)
            optionData = content.result.records;
            renderOption(optionData);
        }
        else {

            alert("There was a problem with the request.");
        }
    }
}

//select-option
function renderOption(option) {

    var selectItem = [];

    for (var i = 0; i < option.length; i++) {

        //if the data not in the arry, indexOf=-1.
        if (selectItem.indexOf(option[i].Zone) == -1) {

            selectItem.push(option[i].Zone);
        }
    }

    for (var i = 0; i < selectItem.length; i++) {

        // add option item
        selectAreaObj.options.add(new Option(selectItem[i]));
    }
}

// select
selectAreaObj.addEventListener("change", function (e) {

    if (can_Choose == true) {

        document.body.removeChild(mapKey_script);
        can_Choose = false;
    }

    var objValue = e.target.value;

    choose_tabs.innerHTML =
        "<ul class='tabs'>" +
        "<li class='list_Style'><a href='#'>旅遊資訊列表</a></li>" +
        "<li class='map_Style'><a href='#'>區域景點位置</a></li>" +
        "</ul>";

    mapShow_style = document.querySelector(".map_Style");
    listShow_style = document.querySelector(".list_Style");
    show_Map = false;

    if (objValue != "") {

        // callAjax(url, 1);
        queryArea(objValue);

        // callAjax(url, 2);
        renderContent();
    }
});

// popular menu
hotList.addEventListener("click", function (e) {

    if (can_Choose == true) {

        document.body.removeChild(mapKey_script);
        can_Choose = false;
    }


    e.preventDefault();

    choose_tabs.innerHTML =
        "<ul class='tabs'>" +
        "<li class='list_Style'><a href='#'>旅遊資訊列表</a></li>" +
        "<li class='map_Style'><a href='#'>區域景點位置</a></li>" +
        "</ul>";

    mapShow_style = document.querySelector(".map_Style");
    listShow_style = document.querySelector(".list_Style");
    show_Map = false;

    // click the 「"a"-html tag」.
    if (e.target.nodeName == "A") {

        queryArea(e.target.textContent);

        renderContent();
    }
});


function queryArea(viewPoint_name) {

    // buffer array
    data = [];

    for (var i = 0; i < optionData.length; i++) {

        if (optionData[i].Zone == viewPoint_name) {

            data.push(optionData[i]);
        }
    }
}





function renderContent() {

    if (data.length == 0) {

        contentTitle.textContent = "查無資料";
        reContent.innerHTML = "";
        return false;
    }

    // target="_blank"
    // data title name.
    contentTitle.textContent = data[0].Zone;

    mapShow_style.addEventListener("click", function () {

        show_Map = true;
        console.log(show_Map);
        renderContent();
    }, false);

    listShow_style.addEventListener("click", function () {

        show_Map = false;
        console.log(show_Map);
        renderContent();
    }, false);


    if (show_Map == true) {

        //alert("To show the map!");

        reContent.innerHTML = "<div id='map'></div>";
        mapKey_script = document.createElement('script');

        mapKey_script.setAttribute('src', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCW1N0wycwbxBXBdNGFutyt4a2mgrnPVvc&callback=initMap');
        mapKey_script.setAttribute("async", " ");
        mapKey_script.setAttribute("defer", " ");

        document.body.appendChild(mapKey_script);

        can_Choose = true;
    }
    else {

        var strHtml = "";
        for (var i = 0; i < data.length; i++) {

            var tempHtml =
                "<div class= 'viewPoint'>" +
                "<div class= 'innerFrame'>" +
                "<a href= '" + data[i].Website + "' class='thumbnail' target='_blank'>" +
                "<div class='photo' style='background-image: url(" + data[i].Picture1 + ")'>" +
                "<div class='content-img-title'>" +
                "<h3>" + data[i].Name + "</h3>" +
                "<span>" + data[i].Zone + "</span>" +
                "</div>" +
                "</div>" +

                "<div class='content-info'>" +
                "<span class='content-info-1'>" + data[i].Opentime + "</span>" +
                "<span class='content-info-2'>" + data[i].Add + "</span>" +
                "<span class='content-info-3'>" + data[i].Tel + "</span>" +
                "</div>" +
                "</a >" +
                "</div>" +
                "</div> ";

            strHtml += tempHtml;
        }

        reContent.innerHTML = strHtml;
    }

}

var map;
function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {

        center: { lat: parseFloat(data[0].Py), lng: parseFloat(data[0].Px) },
        zoom: 12
    });


    var mapData = [];

    for (var i = 0; i < data.length; i++) {

        mapData.push({

            position: { lat: parseFloat(data[i].Py), lng: parseFloat(data[i].Px) },
            map: map,
            title: data[i].Name
        });
    }

    console.log(mapData);
    for (var i = 0; i < mapData.length; i++) {

        var marker = new google.maps.Marker(mapData[i]);

    }

}

";

var selectAreaObj = document.querySelector(".toSelect");
var hotList = document.querySelector(".hot-area-list");
var contentTitle = document.querySelector(".content-title");
var repage = document.querySelector("#render-page");
var reContent = document.querySelector(".render_Content");
var choose_tabs = document.querySelector(".choose_tabs");
var mapShow_style;
var listShow_style;
var mapKey_script;

var optionData = [];
var data = [];
var show_Map = false;
var can_Choose = false;


/*window.onresize = function () {

    document.querySelector(".header").style.height = window.innerHeight + "px";
}*/

// get JSON file
callAjax(url, 0);

// status 0=initial; 1=select; 2=popular menu.
function callAjax(url, status) {

    var xhttp;


    if (window.XMLHttpRequest) { // Mozilla, Safari, ...

        xhttp = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) { // IE

        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if (!xhttp) {

        alert("Cannot create an XMLHTTP instance");
        return false;
    }

    xhttp.open("GET", url, true);
    xhttp.send(null);

    xhttp.onload = function () {

        //console.log(xhttp);

        //readyState=4: "already get the JSON data.".
        //status=200: "OK". ; status=404: "erro".
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            var content = JSON.parse(xhttp.responseText);
            //console.log(content);

            // get the JSON object: result → records.(all data)
            optionData = content.result.records;
            renderOption(optionData);
        }
        else {

            alert("There was a problem with the request.");
        }
    }
}

//select-option
function renderOption(option) {

    var selectItem = [];

    for (var i = 0; i < option.length; i++) {

        //if the data not in the arry, indexOf=-1.
        if (selectItem.indexOf(option[i].Zone) == -1) {

            selectItem.push(option[i].Zone);
        }
    }

    for (var i = 0; i < selectItem.length; i++) {

        // add option item
        selectAreaObj.options.add(new Option(selectItem[i]));
    }
}

// select
selectAreaObj.addEventListener("change", function (e) {

    if (can_Choose == true) {

        document.body.removeChild(mapKey_script);
        can_Choose = false;
    }

    var objValue = e.target.value;

    choose_tabs.innerHTML =
        "<ul class='tabs'>" +
        "<li class='list_Style'><a href='#'>旅遊資訊列表</a></li>" +
        "<li class='map_Style'><a href='#'>區域景點位置</a></li>" +
        "</ul>";

    mapShow_style = document.querySelector(".map_Style");
    listShow_style = document.querySelector(".list_Style");
    show_Map = false;

    if (objValue != "") {

        // callAjax(url, 1);
        queryArea(objValue);

        // callAjax(url, 2);
        renderContent();
    }
});

// popular menu
hotList.addEventListener("click", function (e) {

    if (can_Choose == true) {

        document.body.removeChild(mapKey_script);
        can_Choose = false;
    }


    e.preventDefault();

    choose_tabs.innerHTML =
        "<ul class='tabs'>" +
        "<li class='list_Style'><a href='#'>旅遊資訊列表</a></li>" +
        "<li class='map_Style'><a href='#'>區域景點位置</a></li>" +
        "</ul>";

    mapShow_style = document.querySelector(".map_Style");
    listShow_style = document.querySelector(".list_Style");
    show_Map = false;

    // click the 「"a"-html tag」.
    if (e.target.nodeName == "A") {

        queryArea(e.target.textContent);

        renderContent();
    }
});


function queryArea(viewPoint_name) {

    // buffer array
    data = [];

    for (var i = 0; i < optionData.length; i++) {

        if (optionData[i].Zone == viewPoint_name) {

            data.push(optionData[i]);
        }
    }
}





function renderContent() {

    if (data.length == 0) {

        contentTitle.textContent = "查無資料";
        reContent.innerHTML = "";
        return false;
    }

    // target="_blank"
    // data title name.
    contentTitle.textContent = data[0].Zone;

    mapShow_style.addEventListener("click", function () {

        show_Map = true;
        console.log(show_Map);
        renderContent();
    }, false);

    listShow_style.addEventListener("click", function () {

        show_Map = false;
        console.log(show_Map);
        renderContent();
    }, false);


    if (show_Map == true) {

        //alert("To show the map!");

        reContent.innerHTML = "<div id='map'></div>";
        mapKey_script = document.createElement('script');

        mapKey_script.setAttribute('src', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCW1N0wycwbxBXBdNGFutyt4a2mgrnPVvc&callback=initMap');
        mapKey_script.setAttribute("async", " ");
        mapKey_script.setAttribute("defer", " ");

        document.body.appendChild(mapKey_script);

        can_Choose = true;
    }
    else {

        var strHtml = "";
        for (var i = 0; i < data.length; i++) {

            var tempHtml =
                "<div class= 'viewPoint'>" +
                "<div class= 'innerFrame'>" +
                "<a href= '" + data[i].Website + "' class='thumbnail' target='_blank'>" +
                "<div class='photo' style='background-image: url(" + data[i].Picture1 + ")'>" +
                "<div class='content-img-title'>" +
                "<h3>" + data[i].Name + "</h3>" +
                "<span>" + data[i].Zone + "</span>" +
                "</div>" +
                "</div>" +

                "<div class='content-info'>" +
                "<span class='content-info-1'>" + data[i].Opentime + "</span>" +
                "<span class='content-info-2'>" + data[i].Add + "</span>" +
                "<span class='content-info-3'>" + data[i].Tel + "</span>" +
                "</div>" +
                "</a >" +
                "</div>" +
                "</div> ";

            strHtml += tempHtml;
        }

        reContent.innerHTML = strHtml;
    }

}

var map;
function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {

        center: { lat: parseFloat(data[0].Py), lng: parseFloat(data[0].Px) },
        zoom: 12
    });


    var mapData = [];

    for (var i = 0; i < data.length; i++) {

        mapData.push({

            position: { lat: parseFloat(data[i].Py), lng: parseFloat(data[i].Px) },
            map: map,
            title: data[i].Name
        });
    }

    console.log(mapData);
    for (var i = 0; i < mapData.length; i++) {

        var marker = new google.maps.Marker(mapData[i]);

    }

}

