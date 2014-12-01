/**
 * Nikita Filatov
 */
var ref = new Firebase("https://flickering-fire-1568.firebaseio.com/");
var locRef = ref.child("locations");
var locations;
locRef.on("value", function (snapshot) {
    locations = snapshot.val();
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});


var feedResults = {
    "science": null,
    "technology": null,
    "politics": null,
    "ecology": null,
    "culture": null,
    "military": null
}

var feedLookup = {"http://feeds.reuters.com/reuters/scienceNews": "science",
    "http://feeds.reuters.com/reuters/technologyNews": "technology",
    "http://feeds.reuters.com/Reuters/PoliticsNews": "politics",
    "http://feeds.reuters.com/reuters/environment": "ecology",
    "http://feeds.reuters.com/news/artsculture": "culture",
    "http://feeds.reuters.com/Reuters/worldNews": "military"
}

var currentDate = 3;
var iconsNames = ["science", "technology", "military", "culture", "ecology", "politics"];
var sources = ["bbc", "cnn", "economist", "new york times", "al jazeera", "time", "reuters"];
var geography = ["North America", "Central America", "South America", "Europe", "Asia", "Africa", "Oceania"];
var iconBooleans = {"science": true, "technology": true, "military": true, "culture": true, "ecology": true, "politics": true};
var sourceBooleans = {"bbc": true, "cnn": true, "economist": true, "new york times": true, "al jazeera": true, "time": true, "reuters": true};
//var geoBooleans = {"science" : false,"technology" : false,"military" : false,"culture" : false,"ecology" : false,"politics" : false};


//set up map and icon data
var map = L.map('map', { zoomControl: false }).setView([51.505, -0.09], 13);
new L.Control.Zoom({ position: 'topright' }).addTo(map);
var icons = [];
var readyArticles = [];
var unReadyArticles = [];
var results = [];

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
        iconSize: [50, 50], // size of the icon
        shadowSize: [50, 50], // size of the shadow
        iconAnchor: [25, 50], // point of the icon which will correspond to marker's location
        shadowAnchor: [17, 0],  // the same for the shadow
        popupAnchor: [0, -50] // point from which the popup should open relative to the iconAnchor
    }
});

function Article(entry, topic, cityName) {
    this.link = entry.link;
    this.date = 3;
    this.topic = topic;// iconsNames[getRandInt(0,5)];
    this.title = entry.title;
    this.pubDate = entry.publishedDate;
    this.content = entry.content;
    this.categories = entry.categories;
    //this.media = entry.mediaGroup.content;


    this.location = cityName;
    // console.log();
    this.sources = ["reuters"];

    this.geo = geography[getRandInt(0, 6)];
    // this.icon = new Icon({iconUrl: 'img/'+ this.topic + '.png'});
    this.icon = new Icon({iconUrl: 'img/' + topic + '.png'});
    this.icon.topic = this.topic;

    //codeCityName(cityName, this);
    //console.log("done");
    this.x = 0;
    this.y = 0;
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

    var feeds = {"science": "http://feeds.reuters.com/reuters/scienceNews",
        "technology": "http://feeds.reuters.com/reuters/technologyNews",
        "politics": "http://feeds.reuters.com/Reuters/PoliticsNews",
        "ecology": "http://feeds.reuters.com/reuters/environment",
        "culture": "http://feeds.reuters.com/news/artsculture",
        "military": "http://feeds.reuters.com/Reuters/worldNews"
    }

    for (var i = 0; i < iconsNames.length; i++) {
        var feed = new google.feeds.Feed(feeds[iconsNames[i]]);

        feed.setNumEntries(50);
        feed.includeHistoricalEntries();
        feed.load(function (res) {
            if (!res.error) {
                results.push(res);
            }
        });
    }
}

google.setOnLoadCallback(initialize);


function repopulate() {
    for (var i = 0; i < readyArticles.length; i++) {
        var article = readyArticles[i];
        if (iconBooleans[article.topic] && checkSources(article) && article.date <= currentDate) {
            var sourceTitles = "";
            for (var j = 0; j < article.categories.length; j++) {
                sourceTitles += '<a href="#" onclick="showArticle(\'' + article.title + '\')"> View Article in Left Panel </a><br>';
            }
            if (article.x && article.y) {
                L.marker([article.x, article.y], {icon: article.icon}).addTo(map)
                    .bindPopup(
                        "<h2>" + article.title + "</h2>" +
                        "<h3>" + article.location + "</h3>" +
                            "<h4>" + article.pubDate + "</h4>" +
                            "<a href="+ article.link +"  target='_blank'> Open Article in New Tab </a><br><br>" +
                            sourceTitles
                    );
            }
            else {
                console.log("missing coordinates");
            }
        }
    }
}
function showArticle(title) {
    var article;
    for (var i = 0; i < readyArticles.length; i++) {
        if (readyArticles[i].title == title) {
            article = readyArticles[i];
            break;
        }
    }
    if (article) {
        openPanel();
        $('#panelBody').empty();
        $('#panelHeader').empty();
        $('#panelBody').attr('src', article.link);
        //console.log(article.content);
        $('#panelHeader').text(article.title);
    }
}

function ParseFeed(result, topic) {
    //console.log(locations);
    //console.log(results.feed.entries.length + " articles");
    for (var i = 0; i < result.feed.entries.length; i++) {
        var entry = result.feed.entries[i];
        var cityName = entry.contentSnippet.split(" (R")[0];
        cityName = cityName.replace("/", " ");
//        cityName = cityName.replace("(", " ");
        //       cityName = cityName.replace(")", " ");
        cityName = cityName.replace("[", " ");
        cityName = cityName.replace("]", " ");
        cityName = cityName.replace("#", " ");
        cityName = cityName.replace("$", " ");
        cityName = cityName.replace(".", "");
        // cityName = cityName.replace(".).", " ");


        if (cityName.length < 40) {
            //console.log(cityName);

            if (locations[cityName]) {
                var readyArticle = new Article(entry, topic, cityName);
                readyArticle.x = locations[cityName].lat + getRand(-.1, .1);
                readyArticle.y = locations[cityName].lng + getRand(-.3, .3);
                readyArticles.push(readyArticle);
            }
            else {
                unReadyArticles.push(new Article(entry, topic, cityName));
            }
        }
    }
    repopulate();
}

function Geolocate() {
    if (unReadyArticles.length > 0) {
        var index = getRandInt(0, unReadyArticles.length);
        codeCityName(unReadyArticles[index]);
        unReadyArticles.splice(index, 1);
    }
}


setTimeout(function () {
    for (var i = 0; i < iconsNames.length; i++) {
        for (var j = 0; j < results.length; j++) {
            if (feedLookup[results[j].feed.feedUrl] == iconsNames[i])
                feedResults[iconsNames[i]] = results[j];
        }
    }

    for (var i = 0; i < iconsNames.length; i++) {
        var topic = iconsNames[i];
        ParseFeed(feedResults[topic], topic);
    }

    setInterval(function () {
        Geolocate()
    }, 800);
}, 1500);


function getRand(min, max) {
    return Math.random() * (max - min) + min;
}
function getRandInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var geocoder;
function init() {
    geocoder = new google.maps.Geocoder();
}

function codeCityName(article) {
    if (article && article.location) {
        geocoder.geocode({ 'address': article.location}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var latitude = results[0].geometry.location.lat();// + getRand(-.1, .1);
                var longitude = results[0].geometry.location.lng();// + getRand(-.3, .3);
                article.x = latitude;//+ getRand(-.1, .1);
                article.y = longitude;// + getRand(-.3, .3);
                var loc = new Object();
                loc[("" + article.location)] = { lat: latitude, lng: longitude};
                if (article.location.indexOf(".") == -1) {
                    locRef.update(loc);
                    readyArticles.push(article);
                    repopulate();
                }
            } else {
                console.log('Geocode was not successful for the following reason: ' + status);
            }
        });
    }
}

google.maps.event.addDomListener(window, 'load', init);

