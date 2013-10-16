/**
 * Created by Adam on 10/2/13.
 */

(function () {
    // Method signature matching $.fn.each()'s, for easy use in the .each loop later.
    var initialize = function (i, el) {
        // el is the input element that we need to initialize a map for, jQuery-ize it,
        //  and cache that since we'll be using it a few times.
        var $input = $(el);
        var mapName = $input.attr('name') + '_map';
        // Create the map div and insert it into the page.
        var $map = $('<div>', {
            css: {
                width: '400px',
                height: '400px'
            }
        }).insertAfter($input);

        var map = L.map($map[0]);

        var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        var mapquestUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png';
        var subDomains = ['otile1', 'otile2', 'otile3', 'otile4'];
        var mapquestAttrib = 'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">';
        var mapquest = new L.TileLayer(mapquestUrl, {maxZoom: 18, attribution: mapquestAttrib, subdomains: subDomains});

        var drawnItems = new L.FeatureGroup().addTo(map);

        var baseLayers = {
            "OSM": osmLayer,
            "MapQuest Satalite": mapquest
        };

        var overlays = {
            "DB Features": drawnItems
        };

        L.control.layers(baseLayers, overlays).addTo(map);

        if ($input.val()) {
            var valLayer = L.geoJson($.parseJSON($input.val()));

            valLayer.eachLayer(function (layer) {
                if (layer.eachLayer) {
                    layer.eachLayer(function (alayer) {
                        drawnItems.addLayer(alayer);
                    });
                }
                else {
                    drawnItems.addLayer(layer);
                }

            });

//$input.val(JSON.stringify(drawnItems.toGeoJSON()));
            try {
                map.fitBounds(valLayer.getBounds());
            } catch (e) {

            }
        }
        else {
            map.fitBounds([[42.08191667830631, -113.04931640625], [35.22767235493586, -121.83837890625]]);
        }

// If the input came from an EditorFor, initialize editing-related events.
        if ($input.hasClass('editor-for-dbgeography')) {
            // Initialize the draw control and pass it the FeatureGroup of editable layers
            var drawControl = new L.Control.Draw({
                draw: {
                    polygon: false,
                    polyline: false,
                    circle: false,
                    rectangle: false
                    //marker: false
                },
                edit: {
                    featureGroup: drawnItems
                }
            });
            map.addControl(drawControl);

            map.on('draw:created', function (e) {
                var type = e.layerType,
                    layer = e.layer;

                drawnItems.clearLayers();
                drawnItems.addLayer(layer);
                $input.val(JSON.stringify(layer.toGeoJSON().geometry));
            });

            map.on('draw:edited', function (e) {
                var features = drawnItems.toGeoJSON().features;
                layer = features[0];
                $input.val(JSON.stringify(layer.geometry));
            });

            map.on('draw:deleted', function (e) {
                $input.val('');
            });
        }
    };

// Find all DBGeography inputs and initialize maps for them.
    $('.editor-for-dbgeography, .display-for-dbgeography').each(initialize);
})();