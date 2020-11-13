function initialize() {
    var bounds = new google.maps.LatLngBounds();
    var mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(0, 0),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    var $input = $('#txtWKV');
    var position;
    var latLong;

    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    //for a point we create a marker
    if ($input.val().indexOf("POINT") !== -1) {

        latLong = parseLatLong($input.val());
        var position = new google.maps.LatLng(latLong.latitude, latLong.longitude);
        bounds.extend(position);

        //create the marker
        var marker = new google.maps.Marker({
            position: position,
            map: map
        });
    }
    else {
        parsePolygons($input.val()).forEach(function (currentPolygon) {
            //for everything else we use an overlay, which is an array of points
            position = [];

            //pull all of the lat/long combinations out of the string array and add a point for each
            parseWKV(currentPolygon).forEach(function (thisWKV) {
                latLong = parseLatLong(thisWKV);
                var thisPoint = new google.maps.LatLng(latLong.latitude, latLong.longitude);
                position.push(thisPoint);
                bounds.extend(thisPoint);
            });

            // Construct the polygon
            var polygon = new google.maps.Polygon({
                paths: position,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35
            });

            polygon.setMap(map);
        });
    }

    //set the default position and zoom of the map
    map.fitBounds(bounds);
}

var parsePolygons = function (value) {
    if (!value) { return undefined; }

    return value.match(/\(\([\d\s\.,]*?\)\)/g);
};

//pulls all lat/long pairs out of a Well Known Value string
var parseWKV = function (value) {
    if (!value) { return undefined; }

    //example:
    //input:  "LINESTRING (30 10, 10 30, 40 40)"
    //output:  ["30 10", "10 30", "40 40"];
    return value.match(/(-?\d+\.?\d+)\s(-?\d+\.?\d+)/g);
};

var parseLatLong = function (value) {
    if (!value) { return undefined; }

    //example:
    //input:  "30 10"
    //output:  ["30 10", "30", "10"];
    var latLong = value.match(/(-?\d+\.?\d+)\s(-?\d+\.?\d+)/);

    return {
        latitude: latLong[2],
        longitude: latLong[1]
    };
};

$('#txtWKV').change(function () {
    initialize();
});