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
    };
    localStorage.setItem(location_name.value, JSON.stringify(reminder_object));
    alert("Location reminder " + "'" + location_name.value + "'" + " saved.")
}

get_location.onclick = () => {
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
                    variation = 0.000010;

                if ((lat + variation > item.latitude && lat - variation < item.latitude && long + variation > item.longitude && long - variation < item.longitude)) {
                    alert("You are at " + "'" + storage_items[key] + "'.\n\nReminder: " + item.reminder)
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