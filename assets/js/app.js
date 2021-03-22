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
let searchLogBtn = document.querySelector('#search-log');
let searchBtn = document.querySelector('#searchBtn');
let forecastEl = document.querySelector('.forecast');
let resetEl = document.querySelector('#reset');
let lat, lon;
let searchArray = JSON.parse(localStorage.getItem("search")) || [];
// console.log(searchArray);
let i = 0, count = 0;
let date = moment().format("L");
// localStorage.clear()
//api url
const API_key = 'bd8df5439f0695bbedc7f6bb49854451';

//Gather the search data
let getWeatherData = function (searchArea) {
    //fetch the data by making a request to the url
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchArea}&appid=${API_key}&units=imperial`)
        .then(function (response) {
            // console.log(response);
            if (response.ok) {
                response.json().then(function (data) {
                    // console.log(data);
                    searchCityDisplayEl.innerText = data.name;
                    // console.log(data.weather[0].main);
                    let wicon = data.weather[0].icon;
                    let iconUrl = `https://openweathermap.org/img/w/${wicon}.png`;
                    let temperature = data.main.temp;
                    let humidity = data.main.humidity;
                    let windSpeed = data.wind.speed;
                    // console.log(`Temperature : ${temperature}`);
                    tempEl.innerText = temperature;
                    // console.log(`Humidity : ${humidity}`);
                    humidityEl.innerText = humidity;
                    // console.log(`WindSpeed : ${windSpeed}`);
                    windspeedEl.innerText = windSpeed;
                    //weather icon
                    weatherIconEl.setAttribute("src", iconUrl);
                    lat = data.coord.lat;
                    lon = data.coord.lon;
                    // console.log(lat, lon);
                    fetch(`https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_key}`)
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
            // console.log(error);
            alert(`Unable to connect to Open Weather`);
        });

};

let get5DayForcast = function (searchArea) {
    // let forecastApiUrl = `api.openweathermap.org/data/2.5/forecast?q=${searchArea}&appid=${API_key}`;

    for (let i = 0; i <= 5; i++) {
        // console.log(forecastEl);
        if (forecastEl.hasChildNodes()) {
            forecastEl.removeChild(forecastEl.childNodes[0]);
        }
    }

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchArea}&appid=${API_key}&units=imperial`)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    // console.log(data);
                    for (let i = 0; i < data.cnt; i++) {


                        if (data.list[i].dt_txt.includes("00:00:00")) {

                            let newDate = ((data.list[i].dt_txt).split(' '))[0];
                            let newMomentDate = moment(newDate).format("L");
                            // console.log(newMomentDate);
                            //create the element for the data to be displayed
                            let forecastItemEl = document.createElement("div");
                            forecastItemEl.classList.add("col");
                            forecastItemEl.classList.add("forecast-box");
                            forecastItemEl.innerHTML = `<h4>${newMomentDate}</h4>`;
                            // forecastEl.appendChild(forecastItemEl);
                            //Weather Icon
                            let wicon = data.list[i].weather[0].icon;
                            let iconUrl = `https://openweathermap.org/img/w/${wicon}.png`;
                            let weatherIconEl = document.createElement("div");
                            weatherIconEl.innerHTML = `<img src="${iconUrl}" alt= "Weather icon">`;
                            forecastItemEl.appendChild(weatherIconEl);
                            //Temperature
                            let tempEl = document.createElement("div");
                            tempEl.innerHTML = `<p>Temp: ${data.list[i].main.temp}<span>&#176;F</span></p>`;
                            forecastItemEl.appendChild(tempEl);
                            //Humidity
                            let humidEl = document.createElement("div");
                            humidEl.innerHTML = `<p>Humidity:${data.list[i].main.humidity} %`;
                            forecastItemEl.appendChild(humidEl);
                            forecastEl.appendChild(forecastItemEl);
                            // console.log(newDate);
                        }
                    }
                });

            }

        });

};


let searchLog = function () {
    for (let i = 0; i <= count; i++) {
        // console.log(searchListEl);
        if (searchListEl.hasChildNodes()) {
            searchListEl.removeChild(searchListEl.childNodes[0]);
        }
    }
    display();
};

//Search Form Handler
let searchFormHandler = function () {
    dataEl.classList.remove("hidden");

    // console.log(event);
    let searchedArea = userSearchEl.value;
    searchArray.push(searchedArea);
    //searching for duplicates
    if (searchArray.length != 0) {
        for (let i = 0; i < searchArray.length; i++) {
            for (let j = i + 1; j < searchArray.length; j++) {
                if (searchArray[i] === searchArray[j]) {
                    searchArray.pop();
                }
            }
        }
    }

    dateEl.innerText = date;
    if (searchedArea) {
        getWeatherData(searchedArea);
        userSearchEl.value = '';
        get5DayForcast(searchedArea);
    }
    else {
        alert("Please enter a valid city name");
        return;
    }


    localStorage.setItem("search", JSON.stringify(searchArray));
    searchLog();

};
//search for elements in local storage and display
let display = function () {
    // debugger;

    while (searchListEl.hasChildNodes()) {
        searchListEl.removeChild(searchListEl.firstChild);
    }

    console.log(searchArray);
    for (let i = 0; i < searchArray.length; i++) {
        let listEl = document.createElement("button");
        listEl.classList.add("list-group-item");
        listEl.classList.add("list-element");
        listEl.innerText = searchArray[i];
        // console.log(listEl);
        searchListEl.appendChild(listEl);
    }


};


searchLog();
if (searchArray.length > 0) {
    getWeatherData(searchArray[searchArray.length - 1]);
}
//search button click event handler
searchBtn.addEventListener("click", function () {
    searchFormHandler();
});

//search log button click event handler
searchLogBtn.addEventListener("click", function (event) {
    let search = event.target.innerText;
    console.log(search);
    dataEl.classList.remove("hidden");
    getWeatherData(search);
    get5DayForcast(search);
});
resetEl.addEventListener("click", function () {
    localStorage.clear();
    while (searchListEl.hasChildNodes()) {
        searchListEl.removeChild(searchListEl.firstChild);
    }
    searchArray = [];
    dataEl.classList.add("hidden");
});