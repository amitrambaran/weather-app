const apiKey = "e5c70d2a66ae1d10e85c6dd2081e302d";
var data;
let searchQuery = document.querySelector("input[type='text']");
let loc = document.getElementById("location");
let temp = document.getElementById("temp");
let cond = document.getElementById("cond");
let desc = document.getElementById("desc");
let humidity = document.getElementById("humidity");

function Weather(city, cond, desc, humidity, loc, timeStamp, temp, wind){
    this.city = city;
    this.cond = cond;
    this.desc = desc;
    this.humidity = humidity;
    this.loc = loc;
    this.timeStamp = timeStamp;
    this.temp = temp;
    this.wind = wind;
};

//console.log(getDateTime());
//Add event listener to text input
searchQuery.addEventListener("keypress", function (event) {
    parseSearchInput(event);
});

//Parse text input and append to API link
function parseSearchInput(event) {
    if (event.which === 13) {
        if (searchQuery.value === "") {
            alert("Please enter a city.");
        }
        console.log(searchQuery.value);
        let url = "http://api.openweathermap.org/data/2.5/forecast?q=" + searchQuery.value + "&appid=" + apiKey;
        console.log(url);
        httpRequest(url);
    }
}

//Asyncronous AJAX request to API for 5 day / 3 hour weather info
function httpRequest(url) {
    var httpReq = new XMLHttpRequest();
    httpReq.onload = function () {
        if (httpReq.status == 200 && httpReq.readyState == 4) {
            console.log("Status OK");
            data = JSON.parse(httpReq.responseText);
            parseCurrentData();
            //console.log(data);
            //document.getElementById("temperature").textContent = data.main.temp;
        }
        else {
            console.log("Status error");
        }
    }
    //Open a GET request with the constructed API link; send request
    httpReq.open("GET", url);
    httpReq.send();
}

function parseCurrentData() {
    let set1 = new Weather();
    set1.cond = data.list[0].weather[0].main;
    set1.desc = data.list[0].weather[0].description;
    set1.humidity = data.list[0].main.humidity;
    set1.loc = data.city.name + ", " + data.city.country;
    set1.temp = parseInt(data.list[0].main.temp - 273) + "°";
    set1.wind = data.list[0].wind.speed;

    cond.innerHTML = set1.cond;
    desc.innerHTML = set1.desc;
    humidity.innerHTML = set1.humidity;
    loc.innerHTML = set1.loc;
    temp.innerHTML = set1.temp;
    wind.innerHTML = set1.wind;
    console.log(set1);
}

function getDateTime() {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    dateTime = date + ' ' + time;
    return dateTime;
}