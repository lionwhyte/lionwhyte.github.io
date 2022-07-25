const x = document.getElementById("demo");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    if (position.coords.latitude < 44.266956 && position.coords.latitude > 44.266936) {
        alert("You are at home!")
    } else {
        alert("You are not at home!")
    }
}