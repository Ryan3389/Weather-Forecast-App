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

function getLocationWeather(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {

                    const dailyForecast = data.list.filter(function (item) {
                        return item.dt_txt.includes('12:00:00')
                    })
                    const dailyWeather = [data]
                    //daily forecast
                    currentDayWeather = dailyWeather.map(function (item) {
                        return {
                            city: item.city.name,
                            date: item.list[0].dt_txt.split(' ')[0],
                            desc: item.list[0].weather[0].main,
                            temp: Math.floor(item.list[0].main.temp),
                            wind: Math.floor(item.list[0].wind.speed),
                            humidity: item.list[0].main.humidity
                        }
                    })

                    //5 day forecast
                    weatherData = dailyForecast.map(forecast => ({
                        date: forecast.dt_txt.split(' ')[0],
                        desc: forecast.weather[0].main,
                        temp: Math.floor(forecast.main.temp),
                        wind: Math.floor(forecast.wind.speed),
                        humidity: forecast.main.humidity
                    }));



                    localStorage.setItem('weatherData', JSON.stringify(weatherData));
                    localStorage.setItem('currentDayWeather', JSON.stringify(currentDayWeather))

                    //CALL FUNCTIONS TO RENDER WEATHER FORECAST
                });
            }
        });
}