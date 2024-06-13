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

function displayCurrentWeather(data) {
  const current = data.list[0];
  currentWeatherEl.innerHTML = `
    <h2>${data.city.name} (${new Date(current.dt_txt).toLocaleDateString()})</h2>
    <img src="http://openweathermap.org/img/wn/${current.weather[0].icon}.png" />
    <p>Temperature: ${current.main.temp} °C</p>
    <p>Humidity: ${current.main.humidity}%</p>
    <p>Wind Speed: ${current.wind.speed} m/s</p>
  `;
}

function displayForecast(data) {
  forecastEl.innerHTML = '<h2>5-Day Forecast:</h2>';
  const forecastList = data.list.filter(item => item.dt_txt.includes('12:00:00'));
  for (const forecast of forecastList) {
    const forecastElChild = document.createElement('div');
    forecastElChild.classList.add('card', 'm-2', 'p-2');
    forecastElChild.innerHTML = `
      <h4>${new Date(forecast.dt_txt).toLocaleDateString()}</h4>
      <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" />
      <p>Temperature: ${forecast.main.temp} °C</p>
      <p>Humidity: ${forecast.main.humidity}%</p>
      <p>Wind Speed: ${forecast.wind.speed} m/s</p>
    `;
    forecastEl.appendChild(forecastElChild);
  }
}

function saveToHistory(city) {
  let locations = JSON.parse(localStorage.getItem('locations')) || [];
  if (!locations.includes(city)) {
    locations.push(city);
    localStorage.setItem('locations', JSON.stringify(locations));
    addCityToHistory(city);
  }
}

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeatherData(city);
    cityInput.value = '';
  }
});

init()
