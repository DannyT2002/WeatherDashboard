const API_KEY = '5be4d368ce2667761b6edd7cd8dd4895';
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('city');
const searchedEl = document.getElementById('searched-cities');
const currentWeatherEl = document.getElementById('current-weather');
const forecastEl = document.getElementById('forecast');

// Initialize the dashboard by loading the search history from localStorage
function init() {
  const searchedLocations = JSON.parse(localStorage.getItem('locations')) || [];
  // Add each city in the search history to the UI
  if (searchedLocations.length > 0) {
    for (const location of searchedLocations) {
      addCityToHistory(location);
    }
  }
}

// Add a city to the search history UI
function addCityToHistory(city) {
  const cityButton = document.createElement('button');
  cityButton.textContent = city;
  cityButton.classList.add('btn', 'btn-secondary', 'btn-block', 'mt-2');
  cityButton.addEventListener('click', () => getWeatherData(city));
  searchedEl.appendChild(cityButton);
}

// Get the geographical coordinates of a city using the OpenWeather API
async function getCoordinates(city) {
  try {
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`);
    const data = await response.json();
    if (data.length === 0) {
      alert('City not found');
      return null;
    }
    return { lat: data[0].lat, lon: data[0].lon };
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    alert('Error fetching coordinates');
    return null;
  }
}

// Get the weather data for a city and display it
async function getWeatherData(city) {
  const coordinates = await getCoordinates(city);
  if (!coordinates) return;

  const { lat, lon } = coordinates;
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    console.log('Weather data:', data); // Debugging line
    displayCurrentWeather(data);
    displayForecast(data);
    saveToHistory(city);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    alert('Error fetching weather data');
  }
}

// Display the current weather data
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

// Display the 5-day weather forecast
function displayForecast(data) {
  forecastEl.innerHTML = '<h2>5-Day Forecast:</h2>';
  // Filter the forecast data to show only one entry per day (12:00 PM)
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

// Save the searched city to localStorage and add it to the history UI
function saveToHistory(city) {
  let locations = JSON.parse(localStorage.getItem('locations')) || [];
  if (!locations.includes(city)) {
    locations.push(city);
    localStorage.setItem('locations', JSON.stringify(locations));
    addCityToHistory(city);
  }
}

// Add event listener to the search button to fetch weather data for the entered city
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    console.log('Searching for city:', city); // Debugging line
    getWeatherData(city);
    cityInput.value = '';
  } else {
    alert('Please enter a city name');
  }
});

// Initialize the dashboard
init();