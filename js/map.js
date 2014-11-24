
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
    var results;

    L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'examples.map-i875mjb7'
    }).addTo(map);

    map.setZoom(3);
    map.panBy([-100, 200]);

   var Icon = L.Icon.extend({
        options: {
            iconUrl: 'img/science.png',
            //shadowUrl: 'img/shadow.png',
            iconSize:     [64, 64], // size of the icon
            shadowSize:   [64, 64], // size of the shadow
            iconAnchor:   [32, 64], // point of the icon which will correspond to marker's location
            shadowAnchor: [17, 0],  // the same for the shadow
            popupAnchor:  [0, -64] // point from which the popup should open relative to the iconAnchor
        }
    });
    function Article(entry){
        this.link = entry.link;
       this.date = getRandInt(0,3);
       this.topic =  iconsNames[getRandInt(0,5)];
        this.title = entry.title;
        this.pubDate =  entry.publishedDate;
        this.content = entry.content;
        this.categories = entry.categories;
        //this.media = entry.mediaGroup.content;

        var cityName = entry.contentSnippet.split(" (")[0];

       // console.log();
       this.sources = shuffle(sources.slice(0)).slice(getRandInt(3,6));

       this.geo =  geography[getRandInt(0,6)];
      // this.icon = new Icon({iconUrl: 'img/'+ this.topic + '.png'});
       this.icon = new Icon({iconUrl: 'img/military.png'});
        this.icon.topic =  this.topic;

        console.log(cityName);
        codeCityName(cityName, this);
        console.log("done");
        //this.x = coords.lat();
        //this.y = coords.lng();
       //console.log(this.icon.options.source);
       //this.x = getRand(51.45, 51.57);
       //this.y = getRand(-.3, 0);
      //  console.log("making article");

    };

    google.load("feeds", "1");


    function initialize() {

      var googleTopNews = "https://news.google.com/?output=rss";
      var reutersTopNews = "http://feeds.reuters.com/reuters/topNews";
      var foxTopNews = "http://feeds.foxnews.com/foxnews/latest";
      var nyTopNews = "http://rss.nytimes.com/services/xml/rss/nyt/InternationalHome.xml";
      var scienceDailyTopNews = "http://www.sciencedaily.com/newsfeed.xml";
      var abcTopNews = "http://feeds.abcnews.com/abcnews/topstories";
      var bbcTopNews = "http://feeds.bbci.co.uk/news/rss.xml?edition=int";
      var nprTopNews = "http://www.npr.org/rss/rss.php?id=1004";
      var cnnTopNews = "http://rss.cnn.com/rss/cnn_topstories.rss";

      var feed = new google.feeds.Feed(reutersTopNews);

      feed.setNumEntries(10);
      feed.includeHistoricalEntries();

      feed.load(function(res) {
        if (!res.error) {
            results = res;
        }
      });

        //var query = 'site:cnn.com president';
        //google.feeds.findFeeds(query, findDone);
    }

    google.setOnLoadCallback(initialize);


   function repopulate(){
       for(var i = 0; i <icons.length; i++){
            var article = icons[i];
            if(iconBooleans[article.topic] && checkSources(article) && article.date <= currentDate){
                var sourceTitles = "";
               // var link = '<a href="'+article.link+'"> Link </a><br>';

                 for(var j = 0; j <article.categories.length; j++){
                      var headline = article.title;
                     //console.log(headline.);
                      //var arg = "'" + article.title.toString() + "'";//article.title.toString();
                      sourceTitles += '<a href="#" onclick="showArticle(\''+article.title + '\')"> View </a><br>';
                 };
                // console.log(icons[i].icon);
                //icons[i].icon.options.iconAnchor = [11110,0];
                 L.marker([article.x,article.y],{icon: article.icon}).addTo(map)
                .bindPopup(
                  "<h3>"+article.title+"</h3>" +
                  "<h4>"+article.pubDate +"</h4>"+
                    sourceTitles
                   // article.topic.toUpperCase() + "<br>" +
                    //article.source.toUpperCase() + "<br>"
                );

            }
        }
   }
   function showArticle(title){

       var article;
       for(var i =0; i < icons.length; i++){
           if(icons[i].title == title){
                article = icons[i];
               break;
           }
       }
       if(article){
       openPanel();
       $('#panelBody').empty();
       $('#panelHeader').empty();
       $('#panelBody').attr('src', article.link);
           //console.log(article.content);
       $('#panelHeader').text(article.title);
       }

   }

function ParseFeed(){
      for (var i = 0; i < results.feed.entries.length; i++) {
          var entry = results.feed.entries[i];
           icons.push(new Article(entry));

          //CreateArticle(entry, i);
      }
}

function CreateArticle(entry, i){
    setTimeout(function(){
        icons.push(new Article(entry));

        //console.log("push");

    }, i*500);
  // icons.push(new Article(entry));
}
setTimeout(function(){
    ParseFeed();
}, 1000);

setTimeout(function(){
   repopulate();
}, 2000);


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
        $( "#rightPanel").width("720px");
        //$( "#rightPanel").padding("5px");
       // $( "#rightPanel").css({"padding" : 5});
       // $( "#panelContents").css({"opacity" : 1});
       $( "#articleButton" ).fadeTo( 500, 0.0, function() {
            $( "#panelContents").css({"opacity" : 1});

         });
       // $( "#articleButton").fadeTo( "fast" , 0);
   }
    function closePanel(){
         $( "#rightPanel").width("0px");
        // $( "#rightPanel").css({"padding" : 0});
        // $( "#rightPanel").padding("0px");
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




//[51.57 -> 51.45, 0 -> -.3]




/*
    for(var i = 0; i < 100; i++){
        icons[i] = new Article();
    }
*/
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


var geocoder;
function init() {
  geocoder = new google.maps.Geocoder();
}

function codeCityName(name, article) {
    geocoder.geocode( { 'address': name}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
        article.x = results[0].geometry.location.lat();
        article.y = results[0].geometry.location.lng();
        console.log("geocoded");
        //article.coords = results[0].geometry.location;
    } else {
      console.log('Geocode was not successful for the following reason: ' + status);
    }
  });
}

google.maps.event.addDomListener(window, 'load', init);

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