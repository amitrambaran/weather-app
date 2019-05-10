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
let checkbox = document.querySelector('input[type="checkbox"]');
let celsius = true;

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

setBackground();

//Add event listener to text input
searchQuery.addEventListener("keyup", function (event) {
    parseSearchInput(event);
});

checkbox.addEventListener("click", function () {
    celsius = !celsius;
    console.log(celsius);
    parseCurrentData();
})

//Parse text input and append to API link
function parseSearchInput(event) {
    if (event.key === "Enter" || event.key === 13) {
        content.style.opacity = 1;
        if (searchQuery.value === "") {
            alert("Please enter a city.");
        }
        console.log(searchQuery.value);
        let url = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchQuery.value + "&appid=" + apiKey;
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
    //Zero out dayTrack on either Enter keypress or toggle switch (parseCurrentData() invoked on both events)
    dayTrack = 0;
    let set1 = new Weather();
    set1.desc = data.list[0].weather[0].description;
    set1.humidity = "Humidity: " + data.list[0].main.humidity + "%";
    set1.loc = data.city.name + ", " + data.city.country;
    set1.temp = getTemp(0);
    set1.wind = "Wind: " + data.list[0].wind.speed + " MPH";
    desc.innerHTML = set1.desc;
    humidity.innerHTML = set1.humidity;
    loc.innerHTML = set1.loc;
    temp.innerHTML = set1.temp;
    wind.innerHTML = set1.wind;
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
        hourly[i].innerHTML = getIconHTML(i) + getTemp(i) + "<br>" + hourVal + ":00";
    }
}

//Constructs daily forecast data
function dailyConstruct() {
    for (let i = 0; i < 5; i++) {
        //API doesn't provide 5 complete days; 5th day is 21 hours ahead of 4th day rather than 24 (1 dayTrack unit = 3 hours real time).
        if (i !== 4) {
            dayTrack += 8;
        }
        //accounts for total listcnt not being exactly 40
        else {
            dayTrack = (data.cnt) - 1;
        }
        //console.log(data.list[dayTrack].main.temp - 273 + "°");
        daily[i].innerHTML = getDaysOfWeek(i) + " " + getIconHTML(dayTrack) + getTemp(dayTrack);
    }

}

//Retreive current date/time info
function getDateTime() {
    var today = new Date(data.list[0].dt_txt);
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":00";
    dateTime = date + ' ' + time + " UTC";
    return dateTime;
}

//Returns corresponding day of week
function getDaysOfWeek(day) {
    day += 1;
    let myDays =
        ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    let today = new Date();
    let thisDay = today.getDay();
    dayOfWeek = myDays[thisDay];
    //console.log(myDays[thisDay + day]);
    return (myDays[thisDay + day]);

}

//Retreive corresponding thumbnail based on weather conditions
function getIconHTML(listIndex) {
    let link = "<img src = \"https://openweathermap.org/img/w/" + data.list[listIndex].weather[0].icon + ".png\" width='50' height='50'></img>";
    return link;
}

//Set background to daytime or nighttime theme based on time of day
function setBackground() {
    let date = new Date();
    let hours = date.getHours();
    if (hours < 6 || hours > 20) {
        body.classList.remove("daytime");
        body.classList.add("nighttime");
    }
}

//Returns temperature based on the 'celsius' flag
function getTemp(listIndex) {
    if (!celsius) {
        return parseInt((data.list[listIndex].main.temp - 273) * 1.8 + 32) + "°";
    }
    else {
        return parseInt(data.list[listIndex].main.temp - 273) + "°";
    }
}