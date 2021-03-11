let searchFormEl = document.querySelector('#search-form');
let userSearchEl = document.querySelector('#searchForCity');
let displayArea = document.querySelector('#display-areaname');
let searchListEl = document.querySelector('.search-list');
let climateData = document.querySelector('.climate-data');
let tempEl = document.querySelector('.temp');
let humidityEl = document.querySelector('.humidity');
let windspeedEl = document.querySelector('.windspeed');
let uvindexEl = document.querySelector('.uvindex');
let searchCityDisplayEl = document.querySelector('#searchcity');
let dateEl = document.querySelector('#date');
let dataEl = document.querySelector('#data');
let iconEl = document.querySelector('#icon');
let lat, lon;

//api url
const API_key = 'b2291366fe0fa0dd2bc42b199a8c4e41';

//Gather the search data
let getWeatherData = function (searchArea) {

    //set the Url
    // let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchArea}&appid=${API_key}`;

    // api.openweathermap.org / data / 2.5 / weather ? q = London, uk & APPID=df55f4eee967881d933a0281758e9b21

    //fetch the data by making a request to the url
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchArea}&appid=${API_key}&units=imperial`)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    searchCityDisplayEl.innerText = data.name;
                    console.log(data.weather[0].main);
                    // iconEl.innerHTML = ` <i class="fas fa-${data.weather[0].main}"></i>`;
                    let temperature = data.main.temp;
                    let humidity = data.main.humidity;
                    let windSpeed = data.wind.speed;
                    console.log(`Temperature : ${temperature}`);
                    tempEl.innerText = temperature;
                    console.log(`Humidity : ${humidity}`);
                    humidityEl.innerText = humidity;
                    console.log(`WindSpeed : ${windSpeed}`);
                    windspeedEl.innerText = windSpeed;
                    //check weather
                    currentWeatherImg(searchArea);
                    lat = data.coord.lat;
                    lon = data.coord.lon;
                    console.log(lat, lon);
                    fetch(`http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_key}`)
                        .then(function (response) {
                            if (response) {
                                response.json().then(function (data) {
                                    console.log(data.value);
                                    uvindexEl.innerText = data.value;
                                });
                            }
                            else {
                                alert(`Error:${response.statusText}`);
                            }
                        });

                });
            }
            else {
                alert(`Error:${response.statusText}`);
            }
        })//end of then
        .catch(function (error) {
            alert(`Unable to connect to Open Weather`);
        });

};

let currentWeatherImg = function (searchArea) {
    fetch(`http://api.weatherstack.com/current?access_key=09a266bbc7a05f11da423c2c5484f2d6&query=${searchArea}`)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data.current.weather_icons[0]);
                    iconEl.setAttribute("src", data.current.weather_icons[0]);
                    iconEl.setAttribute("alt", "Icon showing the current weather");
                });
            }
        });
};
let get5DayForcast = function (searchArea) {
    // let forecastApiUrl = `api.openweathermap.org/data/2.5/forecast?q=${searchArea}&appid=${API_key}`;

    fetch(`api.openweathermap.org/data/2.5/forecast?q=${searchArea}&appid=${API_key}`)
        .then(function (response) {

        });
};
let i = 0;
//Save the searched area name in local storage
let saveSearch = function (searchArea) {

    localStorage.setItem(i, searchArea);
    i++;
};

let displaySearch = function (searchArea) {
    if (i === 0) {
        console.log("No elements in Local Storage");
    }


    localStorage.getItem(searchArea[i]);
    console.log(searchArea);
    let listEl = document.createElement("a");
    listEl.setAttribute('href', "#");
    listEl.classList.add("list-group-item");
    listEl.classList.add("list-element")
    listEl.innerText = searchArea;
    console.log(listEl);
    searchListEl.appendChild(listEl);



};


//Search Form Handler
let searchFormHandler = function (event) {
    event.preventDefault();
    dataEl.classList.remove("hidden");
    console.log(event); //Submit event
    let searchedArea = userSearchEl.value;
    console.log(searchedArea);//foster city
    let date = moment().format("L");
    dateEl.innerText = date;
    if (searchedArea) {
        // debugger;
        saveSearch(searchedArea);
        displaySearch(searchedArea);
        getWeatherData(searchedArea);
        userSearchEl.value = '';
        // get5DayForcast(searchedArea);
    }
    else {
        alert("Please enter a valid city name, state code or country code");
    }
};

//Display the retrieved Climate Data
// let displayClimateData = function (searchArea, climateData) {
//     displayArea.textContent = `${searchArea}'s Climate is`;

//     //display climate data
//     console.log(climateData.base);


// };

searchFormEl.addEventListener("submit", searchFormHandler);