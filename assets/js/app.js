let searchFormEl = document.querySelector('#search-form');
let userSearchEl = document.querySelector('#searchForCity');
let displayArea = document.querySelector('#display-areaname');
let searchListEl = document.querySelector('.search-list');
let climateData = document.querySelector('.climate-data');
let temp = document.querySelector('.temp');
let humidity = document.querySelector('.humidity');
let windspeed = document.querySelector('.windspeed');
let uvindex = document.querySelector('.uvindex');
let areas = [];

//api url
const API_key = 'df55f4eee967881d933a0281758e9b21';

//Gather the search data
let getWeatherData = function (searchArea) {

    //set the Url
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchArea}&appid=${API_key}`;

    // api.openweathermap.org / data / 2.5 / weather ? q = London, uk & APPID=df55f4eee967881d933a0281758e9b21

    //fetch the data by making a request to the url
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data.temp);
                    // displayClimateData(searchArea, data);
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
let get5DayForcast = function (searchArea) {
    let apiUrl = `api.openweathermap.org/data/2.5/forecast?q=${searchArea}&appid=${API_key}`;

    fetch(apiUrl)
        .then(function (response) {
            console.log(response);
        });
};
let i = 0;
//Save the searched area name in local storage
let saveSearch = function (searchArea) {

    localStorage.setItem(i, searchArea);
    i++;
};

let displaySearch = function (searchArea) {
    localStorage.getItem("areas", searchArea);
    let listEl = document.createElement("a");
    listEl.setAttribute('href', "#");
    listEl.classList.add("list-group-item");
    listEl.innerText = searchArea;
    console.log(listEl);
    searchListEl.appendChild(listEl);
};
//Search Form Handler
let searchFormHandler = function (event) {
    event.preventDefault();
    console.log(event); //Submit event
    let searchedArea = userSearchEl.value;
    console.log(searchedArea);//foster city

    if (searchedArea) {
        // debugger;
        saveSearch(searchedArea);
        displaySearch(searchedArea);
        getWeatherData(searchedArea);
        userSearchEl.value = ' ';
        get5DayForcast(searchedArea);
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