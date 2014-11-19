
/*

var reader = new FileReader();
reader.onload = function(event) {
    var contents = event.target.result;
    console.log("File contents: " + contents);
};

reader.onerror = function(event) {
    console.error("File could not be read! Code " + event.target.error.code);
};


var csv =  reader.readAsDataURL("cow.csv");
;

    var data = $.csv.toObjects(csv);
    console.log(data[0]);
*/


    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd
    }
    if(mm<10){
        mm='0'+mm
    }
    var today = dd+'/'+mm+'/'+yyyy;
    var today1 = (dd-1)+'/'+mm+'/'+yyyy;
    var today2 = (dd-2)+'/'+mm+'/'+yyyy;
    var today3 = (dd-3)+'/'+mm+'/'+yyyy;
    var today4 = (dd-4)+'/'+mm+'/'+yyyy;

    $("#today").text(today);
    $("#today1").text(today1);
    $("#today2").text(today2);
    $("#today3").text(today3);
    $("#today4").text(today4);
    //console.log(today);

   var currentDate = 3;
   var iconsNames = ["science","technology","military","culture","ecology","politics"];
   var sources = ["bbc","cnn","economist","new york times","al jazeera","time", "reuters"];
   var geography = ["North America","Central America","South America","Europe","Asia","Africa", "Oceania"];
   var iconBooleans = {"science" : true,"technology" : true,"military" : true,"culture" : true,"ecology" : true,"politics" : true};
   var sourceBooleans = {"bbc" : true,"cnn" : true,"economist" : true,"new york times" : true,"al jazeera" : true,"time" : true,"reuters" : true};
   //var geoBooleans = {"science" : false,"technology" : false,"military" : false,"culture" : false,"ecology" : false,"politics" : false};
   var filtersOpen = false;
   var rightPanelOpen = false;
   var topicsOpen = true;
   var geoOpen = true;
   var sourcesOpen = true;
    var datesOpen = true;
   var map = L.map('map', { zoomControl: false }).setView([51.505, -0.09], 13);
   new L.Control.Zoom({ position: 'topright' }).addTo(map);
   var icons = [];

    function setDate(date){
        currentDate = date;
         repopulate();
    }

   function filterSources(source){
       sourceBooleans[source] = ! sourceBooleans[source];
       $('.leaflet-marker-icon').remove();
       repopulate();
   }
   function filterTopics(topic){
        iconBooleans[topic] = ! iconBooleans[topic];
         $('.leaflet-marker-icon').remove();
        repopulate();
    };
    $( "#filtersButton" ).click(function() {
     // alert( "Handler for .click() called." );
       //if(filtersOpen){

        //}
        if(!topicsOpen && !geoOpen && !sourcesOpen){
             $( "#topics").height("130px");
             $( "#geography").height("150px");
             $( "#sources").height("140px");
             $( "#dates").height("120px");
            topicsOpen = true;
            geoOpen = true;
            sourcesOpen = true;
            datesOpen = true;
        }
        else{
             $( "#topics").height("0px");
             $( "#geography").height("0px");
             $( "#sources").height("0px");
             $( "#dates").height("0px");
            topicsOpen = false;
            geoOpen = false;
            sourcesOpen = false;
            datesOpen = false;
        }
        //filtersOpen = !filtersOpen;
    });

    $( "#topicsButton" ).click(function() {
     // alert( "Handler for .click() called." );

        if(topicsOpen){
             $( "#topics").height("0px");
        }
        else{
             $( "#topics").height("130px");
        }
        topicsOpen = !topicsOpen;
    });

    $( "#geoButton" ).click(function() {
     // alert( "Handler for .click() called." );
        if(geoOpen){
             $( "#geography").height("0px");
        }
        else{
             $( "#geography").height("150px");
        }
        geoOpen = !geoOpen;
    });

    $( "#sourcesButton" ).click(function() {
     // alert( "Handler for .click() called." );
        if(sourcesOpen){
             $( "#sources").height("0px");
        }
        else{
             $( "#sources").height("140px");
        }
        sourcesOpen = !sourcesOpen;
    });
    $( "#datesButton" ).click(function() {
     // alert( "Handler for .click() called." );
        if(datesOpen){
             $( "#dates").height("0px");
        }
        else{
             $( "#dates").height("120px");
        }
        datesOpen = !datesOpen;
    });


    $( "#hideRightPanel" ).click(function() {
        closePanel();
    });
    $( "#articleButton" ).click(function() {
        openPanel();
    });

   function openPanel(){
        $( "#rightPanel").width("350px");
       // $( "#panelContents").css({"opacity" : 1});
       $( "#articleButton" ).fadeTo( 500, 0.0, function() {
            $( "#panelContents").css({"opacity" : 1});
         });
       // $( "#articleButton").fadeTo( "fast" , 0);
   }
    function closePanel(){
         $( "#rightPanel").width("50px");
         $( "#panelContents").css({"opacity" : 0});
         $( "#articleButton").fadeTo( "fast" , 1);
   }
   function checkSources(article){
        var anyMatch = false;
       // console.log(article.sources.length);

        for(var i = 0; i <article.sources.length; i++){
            //console.log(article.sources[i]);
            anyMatch = anyMatch || sourceBooleans[article.sources[i]];
        }
       return anyMatch;
   }
   function showArticle(headline){
       openPanel();
        $('#panelBody').empty();
        var lorem = new Lorem;
        lorem.type = Lorem.TEXT;
        lorem.query = '2p';
        lorem.createLorem(document.getElementById('panelBody'));

       //$('#panelBody').text(text);
       $('#panelHeader').text(headline.toUpperCase());
   }
   function repopulate(){
       for(var i = 0; i <icons.length; i++){
            var article = icons[i];
            if(iconBooleans[article.topic] && checkSources(article) && article.date <= currentDate){
                var sourceTitles = "";
                 for(var j = 0; j <article.sources.length; j++){
                      var headline = "'" + article.sources[j] + "'";
                      var methodCall = "showArticle(" + headline + ")";
                      sourceTitles += "<a href='#' onclick=" + methodCall + ">" + article.sources[j].toUpperCase() + "</a><br>";
                 };
                // console.log(icons[i].icon);
                //icons[i].icon.options.iconAnchor = [11110,0];
                 L.marker([article.x,article.y],{icon: article.icon}).addTo(map)
                .bindPopup(
                   "<h3>"+article.topic.toUpperCase()+"</h3>" +
                    sourceTitles
                   // article.topic.toUpperCase() + "<br>" +
                    //article.source.toUpperCase() + "<br>"
                );

            }
        }
   }
    L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'examples.map-i875mjb7'
    }).addTo(map);

//[51.57 -> 51.45, 0 -> -.3]


   var Icon = L.Icon.extend({
        options: {
            iconUrl: 'img/science.png',
            //shadowUrl: 'img/shadow.png',
            iconSize:     [64, 64], // size of the icon
            shadowSize:   [64, 64], // size of the shadow
            iconAnchor:   [32, 0], // point of the icon which will correspond to marker's location
            shadowAnchor: [17, 0],  // the same for the shadow
            popupAnchor:  [0, 8] // point from which the popup should open relative to the iconAnchor
        }
    });
    function Article(){
       this.date = getRandInt(0,3);
       this.topic =  iconsNames[getRandInt(0,5)];
       this.sources = shuffle(sources.slice(0)).slice(getRandInt(3,6));

       this.geo =  geography[getRandInt(0,6)];
       this.icon = new Icon({iconUrl: 'img/'+ this.topic + '.png'});

       this.icon.topic =  this.topic;
       //console.log(this.icon.options.source);
       this.x = getRand(51.45, 51.57);
       this.y = getRand(-.3, 0);

    };

    for(var i = 0; i < 100; i++){
        icons[i] = new Article();
    }

        //.bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();


    /*
		L.circle([51.508, -0.11], 500, {
			color: 'red',
			fillColor: '#f03',
			fillOpacity: 0.5
		}).addTo(map).bindPopup("I am a circle.");

		L.polygon([
			[51.509, -0.08],
			[51.503, -0.06],
			[51.51, -0.047]
		]).addTo(map).bindPopup("I am a polygon.");
        */

   /*
		var popup = L.popup();

		function onMapClick(e) {
			popup
				.setLatLng(e.latlng)
				.setContent("You clicked the map at " + e.latlng.toString())
				.openOn(map);
		}
*/
		//map.on('click', onMapClick);


    function getRand(min, max) {
    return Math.random() * (max - min) + min;
}
   function getRandInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
   }

    function getText()
    {

        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        for( var j = 0; j < 100; j++){
            var word = "";
            for( var i=0; i < getRandInt(0,10); i++ ){
                 word += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            text += word + " ";
        }
        return text;
    }


  function shuffle(array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
};

      repopulate();

/*
   $('#timeSlider').change(function() {
    //console.log(this.value);
    $('.leaflet-marker-icon').remove();
    currentDate = this.value;
    repopulate();
   });
*/
   /*
    $('.leaflet-marker-icon').click(function() {
       $('#panelBody').text(getText());// getText();
   });
       */