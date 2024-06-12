const searchedEl = document.getElementById("searched-cities");

function init () {
    const searchedLocations = JSON.parse(localStorage.getItems('locations'));

    if(searchedLocations.length === 0) {
        return;
    }

    for(const location of searchedLocations){
    }
}

init()