const apiKey = "e5c70d2a66ae1d10e85c6dd2081e302d";
var data, dayTrack = 0;
let searchQuery = document.querySelector("input[type='text']");
let loc = document.getElementById("location");
let temp = document.getElementById("temp");
let desc = document.getElementById("desc");
let humidity = document.getElementById("humidity");
let content = document.querySelector(".content");
let dateTime = document.querySelector("#dateTime");
let body = document.getElementsByTagName("body")[0];
let picture = document.getElementById("picture");
let hourly = document.getElementsByClassName("hourly");
let daily = document.getElementsByClassName("daily");

//Weather object constructor
function Weather(city, cond, humidity, loc, timeStamp, temp, wind) {
    this.city = city;
    this.cond = cond;
    this.desc = desc;
    this.humidity = humidity;
    this.loc = loc;
    this.timeStamp = timeStamp;
    this.temp = temp;
    this.wind = wind;
};

content.style.opacity = 0;
body.classList.add("daytime");

//Add event listener to text input
searchQuery.addEventListener("keypress", function (event) {
    parseSearchInput(event);
});

//Parse text input and append to API link
function parseSearchInput(event) {
    if (event.which === 13) {
        dayTrack = 0;
        content.style.opacity = 1;
        if (searchQuery.value === "") {
            alert("Please enter a city.");
        }
        console.log(searchQuery.value);
        let url = "http://api.openweathermap.org/data/2.5/forecast?q=" + searchQuery.value + "&appid=" + apiKey;
        console.log(url);
        httpRequest(url);
    }
}

//Asyncronous AJAX request to OpenWeatherMap's API for 5 day / 3 hour weather info
function httpRequest(url) {
    var httpReq = new XMLHttpRequest();
    httpReq.onload = function () {
        if (httpReq.status == 200 && httpReq.readyState == 4) {
            console.log("Status OK");
            data = JSON.parse(httpReq.responseText);
            parseCurrentData();
            //console.log(data);
        }
        else {
            alert("Please enter a valid city.");
            console.log("Status error");
        }
    }
    //Open a GET request with the constructed API link; send request
    httpReq.open("GET", url);
    httpReq.send();
}

//Parses data from API and sets HTML elements
function parseCurrentData() {
    let set1 = new Weather();
    set1.desc = data.list[0].weather[0].description;
    set1.humidity = "Humidity: " + data.list[0].main.humidity + "%";
    set1.loc = data.city.name + ", " + data.city.country;
    set1.temp = "  " + parseInt(data.list[0].main.temp - 273) + "°";
    set1.wind = "Wind: " + data.list[0].wind.speed + " MPH";
    desc.innerHTML = set1.desc;
    humidity.innerHTML = set1.humidity;
    loc.innerHTML = set1.loc;
    temp.innerHTML = set1.temp;
    wind.innerHTML = set1.wind;
    //console.log(data.list[0].weather[0].icon);
    picture.innerHTML = getIconHTML(0);
    dateTime.innerHTML = getDateTime();
    setBackground();
    hourlyConstruct();
    dailyConstruct();
    getDaysOfWeek();
}

//Constructs hourly forecast data
function hourlyConstruct() {
    for (let i = 0; i <= 7; i++) {
        let date = new Date(data.list[i].dt_txt);
        let hourVal = date.getHours();
        //console.log(date);
        //console.log(hourVal);
        hourly[i].innerHTML = hourVal + ":00: " + parseInt(data.list[i].main.temp - 273) + "°";
    }
}

//Constructs daily forecast data
function dailyConstruct() {
    for (let i = 0; i < 5; i++) {
        dayTrack += 7;
        //console.log(data.list[dayTrack].main.temp - 273 + "°");
        daily[i].innerHTML = getDaysOfWeek(i) + " " + getIconHTML(dayTrack) + "" + parseInt(data.list[dayTrack].main.temp - 273) + "°";
    }

}

//Retreive current date/time info
function getDateTime() {
    var today = new Date(data.list[0].dt_txt);
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    dateTime = date + ' ' + time + " UTC";
    return dateTime;
}

function getDaysOfWeek(day) {
    day += 1;
    let myDays =
        ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    let today = new Date();
    let thisDay = today.getDay();
    dayOfWeek = myDays[thisDay];
    console.log(myDays[thisDay + day]);
    return (myDays[thisDay + day]);

}

//Retreive corresponding thumbnail based on weather conditions
function getIconHTML(listNo) {
    let link = "<img src = \"http://openweathermap.org/img/w/" + data.list[listNo].weather[0].icon + ".png\" width='50' height='50'></img>";
    return link;
}

//Set background to daytime or nighttime theme based on time of day
function setBackground() {
    body.classList.remove("daytime");
    body.classList.remove("nigttime");
    let date = new Date();
    let hours = date.getHours();
    if (hours > 6 && hours < 20) {
        body.classList.add("daytime");
    }
    else {
        body.classList.add("nighttime");
    }
}