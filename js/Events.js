/**
 * Nikita Filatov
 */
var filtersOpen = false;
var rightPanelOpen = false;
var topicsOpen = true;
var geoOpen = true;
var sourcesOpen = true;
var datesOpen = true;
$("#filtersButton").click(function () {
    if (!topicsOpen && !geoOpen && !sourcesOpen) {
        $("#topics").height("130px");
        $("#geography").height("150px");
        $("#sources").height("140px");
        $("#dates").height("120px");
        topicsOpen = true;
        geoOpen = true;
        sourcesOpen = true;
        datesOpen = true;
    }
    else {
        $("#topics").height("0px");
        $("#geography").height("0px");
        $("#sources").height("0px");
        $("#dates").height("0px");
        topicsOpen = false;
        geoOpen = false;
        sourcesOpen = false;
        datesOpen = false;
    }
});

$("#topicsButton").click(function () {
    // alert( "Handler for .click() called." );

    if (topicsOpen) {
        $("#topics").height("0px");
    }
    else {
        $("#topics").height("130px");
    }
    topicsOpen = !topicsOpen;
});

$("#geoButton").click(function () {
    // alert( "Handler for .click() called." );
    if (geoOpen) {
        $("#geography").height("0px");
    }
    else {
        $("#geography").height("150px");
    }
    geoOpen = !geoOpen;
});

$("#sourcesButton").click(function () {
    // alert( "Handler for .click() called." );
    if (sourcesOpen) {
        $("#sources").height("0px");
    }
    else {
        $("#sources").height("140px");
    }
    sourcesOpen = !sourcesOpen;
});
$("#datesButton").click(function () {
    // alert( "Handler for .click() called." );
    if (datesOpen) {
        $("#dates").height("0px");
    }
    else {
        $("#dates").height("120px");
    }
    datesOpen = !datesOpen;
});


$("#hideRightPanel").click(function () {
    closePanel();
});
$("#articleButton").click(function () {
    openPanel();
});

function openPanel() {
   // map.panBy([-700, 0]);
    $("#rightPanel").width("700px");
    //$( "#rightPanel").padding("5px");
    // $( "#rightPanel").css({"padding" : 5});
    // $( "#panelContents").css({"opacity" : 1});
    $("#articleButton").fadeTo(500, 0.0, function () {
        $("#panelContents").css({"opacity": 1});

    });
    // $( "#articleButton").fadeTo( "fast" , 0);
}
function closePanel() {
   //map.panBy([700, 0]);
    $("#rightPanel").width("0px");
    // $( "#rightPanel").css({"padding" : 0});
    // $( "#rightPanel").padding("0px");
    $("#panelContents").css({"opacity": 0});
    $("#articleButton").fadeTo("fast", 1);
}
function setDate(date) {
    currentDate = date;
    repopulate();
}

function filterSources(source) {
    sourceBooleans[source] = !sourceBooleans[source];
    $('.leaflet-marker-icon').remove();
    repopulate();
}
function filterTopics(topic) {
    iconBooleans[topic] = !iconBooleans[topic];
    $('.leaflet-marker-icon').remove();
    repopulate();
};


function checkSources(article) {
    var anyMatch = false;
    // console.log(article.sources.length);

    for (var i = 0; i < article.sources.length; i++) {
        //console.log(article.sources[i]);
        anyMatch = anyMatch || sourceBooleans[article.sources[i]];
    }
    return anyMatch;
}

//set time and date
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!

var yyyy = today.getFullYear();
if (dd < 10) {
    dd = '0' + dd
}
if (mm < 10) {
    mm = '0' + mm
}
var today = dd + '/' + mm + '/' + yyyy;
var today1 = (dd - 1) + '/' + mm + '/' + yyyy;
var today2 = (dd - 2) + '/' + mm + '/' + yyyy;
var today3 = (dd - 3) + '/' + mm + '/' + yyyy;
var today4 = (dd - 4) + '/' + mm + '/' + yyyy;

$("#today").text(today);
$("#today1").text(today1);
$("#today2").text(today2);
$("#today3").text(today3);
$("#today4").text(today4);
//console.log(today);