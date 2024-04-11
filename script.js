//Selecting html elements
const form = document.querySelector("form");
const searchInput = document.getElementById('search');
const countryInput = document.getElementById('country');
const forecastContainer = document.querySelector('.forecast-container');
const cityWeatherInfo = document.querySelector('.city-weather-info')
const cityBtnContainer = document.querySelector('.city-btn-container')
const btnContainer = document.getElementById('btn-container')
//api key
const apiKey = 'a2778a07e9d9a3c87823acbb0ec3a7d3';

//event listeners
form.addEventListener('submit', weatherForm);

//function to handle form submission
function weatherForm(e) {
    e.preventDefault();
    const city = searchInput.value;
    const country = countryInput.value;

    if (city) {
        locationCoordinates(city, country);

    } else {
        alert("Enter location to proceed");
    }

    searchInput.value = '';
    countryInput.value = '';
}

function locationCoordinates(cityLocation, countryLocation) {
    const apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityLocation},${countryLocation}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    const longitude = data[0].lon;
                    const latitude = data[0].lat;
                    getLocationWeather(latitude, longitude);
                });
            }
        });
}