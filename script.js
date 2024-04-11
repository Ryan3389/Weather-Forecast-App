//SELECTING HTML ELEMENTS
const form = document.querySelector("form");
const searchInput = document.getElementById('search');
const countryInput = document.getElementById('country');
const forecastContainer = document.querySelector('.forecast-container');
const cityWeatherInfo = document.querySelector('.city-weather-info')
const cityBtnContainer = document.querySelector('.city-btn-container')
const btnContainer = document.getElementById('btn-container')

//API KEY
const apiKey = 'a2778a07e9d9a3c87823acbb0ec3a7d3';

//ARRAY TO HOLD WEATHER AND SEARCH HISTORY DATA
let weatherData = [];
let currentDayWeather = []
let searchHistoryArr = []

//EVENT LISTENERS
btnContainer.addEventListener('click', clickHistoryBtn)
//this is responsible for rendering local storage when the page loads
document.addEventListener('DOMContentLoaded', function () {
    const storedSearchHistory = localStorage.getItem('searchHistory')
    const storedWeatherData = localStorage.getItem('weatherData');
    const storedDailyWeather = localStorage.getItem
        ('currentDayWeather')
    if (!storedWeatherData) {
        cityWeatherInfo.innerHTML = 'No weather to show. Enter your location to see your weather'
    } else {
        weatherData = JSON.parse(storedWeatherData)
        renderForecast();
    }
    if (!storedDailyWeather) {
        forecastContainer.innerHTML = "Please enter your location"
    } else {
        currentDayWeather = JSON.parse(storedDailyWeather)
        renderDailyForecast()
    }

    if (storedSearchHistory) {
        searchHistoryArr = JSON.parse(storedSearchHistory)
        renderSearchHistory()
    }

})

form.addEventListener('submit', weatherForm);

//form event listener
function weatherForm(e) {
    e.preventDefault();
    const city = searchInput.value;
    const country = countryInput.value;

    if (city) {
        locationCoordinates(city, country);
        saveSearchHistory(city)

    } else {
        alert("Enter location to proceed");
    }

    searchInput.value = '';
    countryInput.value = '';
}

//SEARCH HISTORY
//save searh history
function saveSearchHistory(location) {
    if (!searchHistoryArr.includes(location)) {
        searchHistoryArr.push(location)
    }


    localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArr))
    renderSearchHistory()
}
//render search history on the screen
function renderSearchHistory() {
    cityBtnContainer.innerHTML = ''

    for (let history of searchHistoryArr) {
        const searchHistoryBtn = document.createElement("button")
        searchHistoryBtn.classList.add('city-btn')
        searchHistoryBtn.textContent = history
        searchHistoryBtn.setAttribute('data-city', history);

        cityBtnContainer.append(searchHistoryBtn)

    }
}
//making search buttons clickable
function clickHistoryBtn(e) {
    const targetedCity = e.target.getAttribute('data-city');
    if (targetedCity) {
        searchHistoryLocation(targetedCity)
    }

}
//searching weather based on btn clicked
function searchHistoryLocation(city) {
    const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                const longitude = data[0].lon
                const latitude = data[0].lat
                getLocationWeather(latitude, longitude)
            })
        }
    })
}

//convert city input to latitude and longitude
function locationCoordinates(cityLocation, countryLocation) {
    const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityLocation},${countryLocation}&appid=${apiKey}`;

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

//pass coodinates above to retrieve weather
function getLocationWeather(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    //returning weather matching certain times
                    const dailyForecast = data.list.filter(function (item) {
                        return item.dt_txt.includes('12:00:00')
                    })
                    const dailyWeather = [data]
                    //filtering through weather t get current day weather
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


                    //setting data into local storage
                    localStorage.setItem('weatherData', JSON.stringify(weatherData));
                    localStorage.setItem('currentDayWeather', JSON.stringify(currentDayWeather))

                    renderForecast();
                    renderDailyForecast()


                });
            }
        });
}




function renderDailyForecast() {
    // Clear weather container before rendering
    cityWeatherInfo.innerHTML = '';

    // Loop through current day weather array
    for (let currentDay of currentDayWeather) {
        // Create city name element
        const cityNameEl = document.createElement('h1');
        cityNameEl.textContent = `${currentDay.city} (${currentDay.date})`;

        // Create city temp element
        const cityTempEl = document.createElement('p');
        cityTempEl.textContent = `Temp: ${currentDay.temp} degrees C`;

        // Create city wind element
        const cityWindEl = document.createElement('p');
        cityWindEl.textContent = `Wind: ${currentDay.wind} KPH`;

        // Create city humidity element
        const cityHumidityEl = document.createElement('p');
        cityHumidityEl.textContent = `Humidity: ${currentDay.humidity}%`;

        if (currentDay.desc === 'Clouds') {
            const sunIcon = document.createElement('i');
            sunIcon.className = 'fas fa-cloud fa-2x';
            cityWeatherInfo.append(cityNameEl, sunIcon, cityTempEl, cityWindEl, cityHumidityEl);

        } else {
            const sunIcon = document.createElement('i');
            sunIcon.className = 'fas fa-sun fa-2x';
            cityWeatherInfo.append(cityNameEl, cityTempEl, cityWindEl, cityHumidityEl);
        }


        cityWeatherInfo.append(cityNameEl, cityTempEl, cityWindEl, cityHumidityEl);
    }


}


//render weather forecast
function renderForecast() {
    //avoid duplicates from rendering
    forecastContainer.innerHTML = '';

    for (let weather of weatherData) {
        //create div
        const weatherDiv = document.createElement('div');
        weatherDiv.classList.add('weather-box');
        //create dateEl
        const dateEl = document.createElement('h3');
        dateEl.textContent = weather.date;
        //create temp paragraph
        const tempPara = document.createElement('p');
        tempPara.textContent = `Temp: ${weather.temp} degrees, C`;
        //create wind element
        const windPara = document.createElement('p');
        windPara.textContent = `Wind: ${weather.wind} KPH`;
        //create humidity element
        const humidPara = document.createElement('p');
        humidPara.textContent = `Humidity: ${weather.humidity}%`;

        //rendering out font awesome icons based on the current weather 
        if (weather.desc === 'Clouds') {
            const iconDiv = document.createElement('div');
            iconDiv.classList.add('icon-container')
            const cloudIcon = document.createElement('i');
            cloudIcon.className = 'fas fa-cloud fa-2x';

            iconDiv.append(cloudIcon)
            forecastContainer.append(weatherDiv);
            weatherDiv.append(dateEl, iconDiv, tempPara, windPara, humidPara);

        } else if (weather.desc === 'Rain') {
            const iconDiv = document.createElement('div');
            iconDiv.classList.add('icon-container')
            const rainIcon = document.createElement('i');
            rainIcon.className = 'fas fa-raindrops fa-2x';

            iconDiv.append(rainIcon)
            forecastContainer.append(weatherDiv);
            weatherDiv.append(dateEl, iconDiv, tempPara, windPara, humidPara);
        } else if (weather.desc === 'Clear') {
            const iconDiv = document.createElement('div');
            iconDiv.classList.add('icon-container')
            const sunIcon = document.createElement('i');
            sunIcon.className = 'fas fa-sun fa-2x';

            iconDiv.append(sunIcon)
            forecastContainer.append(weatherDiv);
            weatherDiv.append(dateEl, iconDiv, tempPara, windPara, humidPara);
        }
    }
}
