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

async function getCoordinates(city) {
  const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`);
  const data = await response.json();
  if (data.length === 0) {
    alert('City not found');
    return null;
  }
  return { lat: data[0].lat, lon: data[0].lon };
}

async function getWeatherData(city) {
  const coordinates = await getCoordinates(city);
  if (!coordinates) return;

  const { lat, lon } = coordinates;
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
  const data = await response.json();

  displayCurrentWeather(data);
  displayForecast(data);
  saveToHistory(city);
}

init()