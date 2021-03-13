// let searchFormEl = document.querySelector('#search-form');
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
let weatherIconEl = document.querySelector('#weatherIcon');
let searchLogBtn = document.querySelector('#search-log')
let searchBtn = document.querySelector('#searchBtn')
let lat, lon;

//api url
const API_key = 'c55a6a193fb103621798dce241c8f1d3';

//Gather the search data
let getWeatherData = function (searchArea) {
    console.log("started fetch");
    console.log(searchArea);
    console.log(API_key);
    //set the Url
    // let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchArea}&appid=${API_key}`;

    // api.openweathermap.org / data / 2.5 / weather ? q = London, uk & APPID=df55f4eee967881d933a0281758e9b21

    //fetch the data by making a request to the url
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchArea}&appid=${API_key}&units=imperial`)
        .then(function (response) {
            console.log(response);
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    searchCityDisplayEl.innerText = data.name;
                    console.log(data.weather[0].main);
                    let wicon = data.weather[0].icon;
                    let iconUrl = `http://openweathermap.org/img/w/${wicon}.png`;
                    let temperature = data.main.temp;
                    let humidity = data.main.humidity;
                    let windSpeed = data.wind.speed;
                    console.log(`Temperature : ${temperature}`);
                    tempEl.innerText = temperature;
                    console.log(`Humidity : ${humidity}`);
                    humidityEl.innerText = humidity;
                    console.log(`WindSpeed : ${windSpeed}`);
                    windspeedEl.innerText = windSpeed;
                    //weather icon
                    weatherIconEl.setAttribute("src", iconUrl);
                    lat = data.coord.lat;
                    lon = data.coord.lon;
                    console.log(lat, lon);
                    fetch(`http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_key}`)
                        .then(function (response) {
                            if (response) {
                                response.json().then(function (data) {
                                    // console.log(data.value);
                                    uvindexEl.classList.remove("green");
                                    uvindexEl.classList.remove("yellow");
                                    uvindexEl.classList.remove("orange");
                                    uvindexEl.classList.remove("red");
                                    uvindexEl.innerText = data.value;
                                    switch (Math.floor(data.value)) {
                                        case 0:
                                        case 1:
                                        case 2:
                                            uvindexEl.classList.add("green");
                                            break;
                                        case 3:
                                        case 4:
                                        case 5:
                                            uvindexEl.classList.add("yellow");
                                            break;
                                        case 6:
                                        case 7:
                                            uvindexEl.classList.add("orange");
                                            break;
                                        case 8:
                                        case 9:
                                        case 10:
                                            uvindexEl.classList.add("red");
                                            break;
                                        default:
                                            break;
                                    }
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
            console.log(error);
            alert(`Unable to connect to Open Weather`);
        });

};

let get5DayForcast = function (searchArea) {
    // let forecastApiUrl = `api.openweathermap.org/data/2.5/forecast?q=${searchArea}&appid=${API_key}`;

    // fetch(`api.openweathermap.org/data/2.5/forecast?q=London,us&mode=xml&appid=${API_key}`)
    //     .then(function (response) {
    //         console.log(response);
    //     });
};
let i = 0;
//Save the searched area name in local storage
let saveSearch = function (searchArea) {
    localStorage.setItem(i, searchArea);
    i++;
};

let searchLog = function (searchArea) {
    // for (i = 0; i < localStorage.length; i++) {
    //     let key = localStorage.key(i);
    //     console.log(localStorage.getItem(key));
    // }
    let listEl = document.createElement("button");
    // listEl.setAttribute('type', "submit");
    listEl.classList.add("list-group-item");
    listEl.classList.add("list-element")
    listEl.innerText = searchArea;
    console.log(listEl);
    searchListEl.appendChild(listEl);
};


//Search Form Handler
let searchFormHandler = function () {
    dataEl.classList.remove("hidden");
    // console.log(event); //Submit event
    let searchedArea = userSearchEl.value;
    console.log(searchedArea);//foster city
    let date = moment().format("L");
    dateEl.innerText = date;
    if (searchedArea) {
        // debugger;
        saveSearch(searchedArea);
        searchLog(searchedArea);
        getWeatherData(searchedArea);
        userSearchEl.value = '';
        // get5DayForcast(searchedArea);
    }
    else {
        alert("Please enter a valid city name");
        return;
    }

};

//Display the retrieved Climate Data
// let displayClimateData = function (searchArea, climateData) {
//     displayArea.textContent = `${searchArea}'s Climate is`;

//     //display climate data
//     console.log(climateData.base);


// };

searchBtn.addEventListener("click", searchFormHandler);

searchLogBtn.addEventListener("click", function (event) {
    event.preventDefault();
    let search = event.target.innerText;
    getWeatherData(search);

});