const API_KEY = '5be4d368ce2667761b6edd7cd8dd4895';
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('city');
const searchedEl = document.getElementById('searched-cities');
const currentWeatherEl = document.getElementById('current-weather');
const forecastEl = document.getElementById('forecast');

function init() {
  const searchedLocations = JSON.parse(localStorage.getItem('locations')) || [];
  if (searchedLocations.length > 0) {
    for (const location of searchedLocations) {
      addCityToHistory(location);
    }
  }
}

function addCityToHistory(city) {
  const cityButton = document.createElement('button');
  cityButton.textContent = city;
  cityButton.classList.add('btn', 'btn-secondary', 'btn-block', 'mt-2');
  cityButton.addEventListener('click', () => getWeatherData(city));
  searchedEl.appendChild(cityButton);
}

init()