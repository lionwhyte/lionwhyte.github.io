const location_name = document.getElementById("location_name"),
    reminder_description = document.getElementById("reminder_description"),
    latitude = document.getElementById("latitude"),
    longitude = document.getElementById("longitude");

send_to_storage.onclick = () => {
    if (location_name.value === "" || reminder_description.value === "" || latitude === "" || longitude === "") {
        alert("Please fill all the input fields!");
        return;
    };
    const reminder_object = {
        reminder: reminder_description.value,
        latitude: latitude.value,
        longitude: longitude.value,
        location: location_name.value
    };
    localStorage.setItem(location_name.value, JSON.stringify(reminder_object));
    alert("Location reminder " + "'" + location_name.value + "'" + " saved.")
}

get_location.onclick = (e) => {
    e.preventDefault();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            latitude.value = position.coords.latitude;
            longitude.value = position.coords.longitude;
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    };
};

let myInterval;
run_app.onclick = () => {
    if (myInterval !== undefined) {
        return;
    };
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by this browser.");
        return;
    };
    app_status.innerHTML = "Checking location.."

    myInterval = setInterval(() => {
        for (key in Object.keys(localStorage)) {
            let storage_items = Object.keys(localStorage),
                item = JSON.parse(localStorage.getItem(storage_items[key]))

            navigator.geolocation.getCurrentPosition((position) => {
                let lat = position.coords.latitude,
                    long = position.coords.longitude,
                    variation = 0.0010000;
                if ((lat + variation > item.latitude && lat - variation < item.latitude && long + variation > item.longitude && long - variation < item.longitude)) {
                    notifyMe(item.location, item.reminder)
                    clearInterval(myInterval);
                    myInterval = undefined;
                    app_status.innerHTML = ""
                };
            });
        };
    }, 3000);
};

stop_app.onclick = () => {
    if (myInterval !== undefined) {
        clearInterval(myInterval);
        myInterval = undefined;
        app_status.innerHTML = ""
    };
};

function notifyMe(location, reminder) {
    navigator.serviceWorker.register('sw.js');
    Notification.requestPermission(function (result) {
        if (result === 'granted') {
            navigator.serviceWorker.ready.then(function (registration) {
                registration.showNotification("Location: " + "'" + location + "'. Reminder: " + reminder);
                alert("Location: " + "'" + location + "'. Reminder: " + reminder)
            });
        }
    });
}


const map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([15.24, 44.11]),
        zoom: 12
    })
});

map.on('click', function (evt) {
    const lat = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326')[1],
        long = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326')[0];
    const layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [
                new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([long, lat]))
                })
            ]
        })
    });

    map.getLayers().R.splice(1, 1)
    console.log(ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'))
    if (confirm("Add location?") == true) {
        latitude.value = lat + 1.536119;
        longitude.value = long + 0.745095;
    } else {
        return;
    }
    map.addLayer(layer);
});

