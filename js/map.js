


   var currentDate = 3;
   var iconsNames = ["science","technology","military","culture","ecology","politics"];
   var sources = ["bbc","cnn","economist","new york times","al jazeera","time", "reuters"];
   var geography = ["North America","Central America","South America","Europe","Asia","Africa", "Oceania"];
   var iconBooleans = {"science" : true,"technology" : true,"military" : true,"culture" : true,"ecology" : true,"politics" : true};
   var sourceBooleans = {"bbc" : true,"cnn" : true,"economist" : true,"new york times" : true,"al jazeera" : true,"time" : true,"reuters" : true};
   //var geoBooleans = {"science" : false,"technology" : false,"military" : false,"culture" : false,"ecology" : false,"politics" : false};

   var map = L.map('map').setView([51.505, -0.09], 13);
   var icons = [];

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


   function repopulate(){
       for(var i = 0; i <icons.length; i++){
            var article = icons[i];
            if(iconBooleans[article.topic] && sourceBooleans[article.source] && article.date <= currentDate){
                // console.log(icons[i].icon);
                //icons[i].icon.options.iconAnchor = [11110,0];
                 L.marker([article.x,article.y],{icon: article.icon}).addTo(map)
                .bindPopup(
                    article.topic.toUpperCase() + "<br>" +
                    article.source.toUpperCase() + "<br>"
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
           // shadowUrl: 'leaf-shadow.png',
            iconSize:     [64, 64], // size of the icon
            shadowSize:   [64, 64], // size of the shadow
            iconAnchor:   [32, 0], // point of the icon which will correspond to marker's location
            shadowAnchor: [32, 0],  // the same for the shadow
            popupAnchor:  [0, 8] // point from which the popup should open relative to the iconAnchor
        }
    });
    function Article(){
       this.date = getRandInt(0,3);
       this.topic =  iconsNames[getRandInt(0,5)];
       this.source =  sources[getRandInt(0,6)];
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

   repopulate();

   $('#timeSlider').change(function() {
    //console.log(this.value);
    $('.leaflet-marker-icon').remove();
    currentDate = this.value;
    repopulate();
   });

    $('.leaflet-marker-icon').click(function() {
       $('#panelBody').text(getText());// getText();
   });